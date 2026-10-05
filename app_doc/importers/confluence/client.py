# coding:utf-8
"""Confluence REST API 客户端。

只依赖 requests，不引入新的第三方库：
- 兼容 Confluence Cloud（Basic: email + API Token）与 Server/Data Center（Bearer PAT 或 Basic）
- 统一使用 REST API v1（Cloud 与 Server 均可用），避免两套分页/返回结构
- 分页、429 限流等待、5xx 重试、附件下载

本模块只负责"取数"，不做任何本地落库，便于单独测试。
"""

import time
from urllib.parse import urljoin

import requests
from loguru import logger

# Cloud 站点域名特征，用于 auto 模式识别部署类型
CLOUD_DOMAIN_SUFFIX = 'atlassian.net'


class ConfluenceApiError(Exception):
    """Confluence 接口调用失败（鉴权、权限、网络、协议错误等）"""


class ConfluenceClient:
    """Confluence REST 客户端。

    :param base_url: 站点地址，如 https://xxx.atlassian.net/wiki 或 https://confluence.example.com
    :param deployment: cloud / server / auto，auto 时按域名自动判断
    :param email: Cloud 账号邮箱
    :param api_token: Cloud API Token
    :param token: Server/DC 个人访问令牌（PAT，优先于用户名密码）
    :param username: Server/DC 用户名
    :param password: Server/DC 密码
    :param verify: 是否校验 HTTPS 证书
    :param timeout: 单次请求超时秒数
    :param delay: 每次请求前的固定间隔，用于给源站降速
    """

    def __init__(self, base_url, deployment='auto', email='', api_token='', token='',
                 username='', password='', verify=True, timeout=30, delay=0.0,
                 max_retries=3, page_size=50):
        self.base_url = (base_url or '').strip().rstrip('/')
        if not self.base_url:
            raise ConfluenceApiError('缺少 --base-url')

        if deployment == 'auto':
            deployment = 'cloud' if CLOUD_DOMAIN_SUFFIX in self.base_url else 'server'
        if deployment not in ('cloud', 'server'):
            raise ConfluenceApiError(f'未知的部署类型: {deployment}')
        self.deployment = deployment

        self.timeout = timeout
        self.delay = max(0.0, float(delay or 0))
        self.max_retries = max(0, int(max_retries))
        self.page_size = max(1, min(int(page_size or 50), 100))

        self.session = requests.Session()
        self.session.verify = verify
        self.session.headers['Accept'] = 'application/json'
        self._setup_auth(email, api_token, token, username, password)

    # ------------------------------------------------------------------ #
    # 鉴权
    # ------------------------------------------------------------------ #
    def _setup_auth(self, email, api_token, token, username, password):
        if self.deployment == 'cloud':
            if not (email and api_token):
                raise ConfluenceApiError('Confluence Cloud 需要 --email 与 --api-token')
            self.session.auth = (email, api_token)
        else:
            if token:
                self.session.headers['Authorization'] = f'Bearer {token}'
            elif username and password:
                self.session.auth = (username, password)
            else:
                raise ConfluenceApiError('Confluence Server/DC 需要 --token 或 --username/--password')

    @property
    def api_root(self):
        """REST API 根路径（Cloud 需要 /wiki 前缀）"""
        if self.deployment == 'cloud':
            base = self.base_url
            if not base.endswith('/wiki'):
                base = base + '/wiki'
            return base + '/rest/api'
        return self.base_url + '/rest/api'

    def source_identity(self):
        """来源站点标识，用于状态文件分区（同一站点重复导入可命中历史记录）"""
        return f'{self.deployment}:{self.base_url}'

    def describe(self):
        return f'{self.base_url}（{self.deployment}）'

    # ------------------------------------------------------------------ #
    # 底层请求
    # ------------------------------------------------------------------ #
    def _sleep(self):
        if self.delay:
            time.sleep(self.delay)

    def _full_url(self, path):
        if path.startswith('http://') or path.startswith('https://'):
            return path
        return self.api_root + path

    def get_json(self, path, params=None):
        """GET 并返回 JSON，带 429/5xx 重试"""
        url = self._full_url(path)
        last_error = None
        for attempt in range(self.max_retries + 1):
            self._sleep()
            try:
                resp = self.session.get(url, params=params, timeout=self.timeout)
            except requests.RequestException as e:
                last_error = f'网络异常: {e!r}'
                logger.warning(f'Confluence 请求异常（第{attempt + 1}次）: {url} | {e!r}')
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code == 429:
                retry_after = resp.headers.get('Retry-After') or ''
                wait = int(retry_after) if retry_after.isdigit() else (2 ** attempt)
                wait = min(max(wait, 1), 60)
                last_error = f'限流(429)，等待{wait}秒'
                logger.warning(f'Confluence 触发限流，等待 {wait}s 后重试: {url}')
                time.sleep(wait)
                continue

            if resp.status_code >= 500:
                last_error = f'服务端错误({resp.status_code})'
                logger.warning(f'Confluence 服务端错误（第{attempt + 1}次）: {resp.status_code} {url}')
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code in (401, 403):
                raise ConfluenceApiError(
                    f'鉴权/权限失败({resp.status_code})：请检查凭据与账号权限 | {url}')
            if resp.status_code == 404:
                raise ConfluenceApiError(f'资源不存在(404)：{url}')
            if resp.status_code >= 400:
                raise ConfluenceApiError(
                    f'接口返回异常({resp.status_code})：{resp.text[:300]} | {url}')

            try:
                return resp.json()
            except ValueError:
                raise ConfluenceApiError(f'接口返回非 JSON 内容：{url}')

        raise ConfluenceApiError(f'请求失败（已重试 {self.max_retries} 次）：{url} | {last_error}')

    def paginate(self, path, params=None, max_items=None):
        """按 start/limit 翻页，逐条产出 results"""
        params = dict(params or {})
        params.setdefault('limit', self.page_size)
        start = 0
        yielded = 0
        while True:
            page_params = dict(params)
            page_params['start'] = start
            data = self.get_json(path, page_params)
            results = data.get('results') or []
            if not results:
                return
            for item in results:
                yield item
                yielded += 1
                if max_items and yielded >= max_items:
                    return
            if len(results) < page_params['limit']:
                return
            start += len(results)

    def _absolute_url(self, url, base_url):
        """把附件上的相对地址还原成完整 URL。

        附件 _links.download 常见三种形态：
        - 绝对地址（http/https）→ 原样使用
        - 站点根相对（/download/...）→ 直接拼在站点上下文之后，
          Cloud 下应得到 https://xxx.atlassian.net/wiki/download/...
        - 相对路径（download/...）→ 以站点上下文为目录拼接
        """
        if url.startswith('http://') or url.startswith('https://'):
            return url
        base = (base_url or self.api_root).rstrip('/')
        if url.startswith('/'):
            return base + url
        return urljoin(base + '/', url)

    def download(self, url, base_url=None):
        """下载二进制内容（附件/图片）"""
        full_url = self._absolute_url(url, base_url)

        last_error = None
        for attempt in range(self.max_retries + 1):
            self._sleep()
            try:
                resp = self.session.get(full_url, timeout=self.timeout, stream=True)
            except requests.RequestException as e:
                last_error = repr(e)
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code == 429:
                retry_after = resp.headers.get('Retry-After') or ''
                wait = int(retry_after) if retry_after.isdigit() else (2 ** attempt)
                time.sleep(min(max(wait, 1), 60))
                last_error = '限流(429)'
                continue
            if resp.status_code >= 500:
                last_error = f'服务端错误({resp.status_code})'
                time.sleep(min(2 ** attempt, 10))
                continue
            if resp.status_code >= 400:
                raise ConfluenceApiError(f'下载失败({resp.status_code})：{full_url}')

            return resp.content

        raise ConfluenceApiError(f'下载失败（已重试 {self.max_retries} 次）：{full_url} | {last_error}')

    # ------------------------------------------------------------------ #
    # 业务接口
    # ------------------------------------------------------------------ #
    def list_spaces(self, max_items=None):
        """列出全部空间"""
        return self.paginate('/space', {'expand': 'description.plain'}, max_items)

    def get_space(self, space_key):
        """按 key 获取单个空间，不存在返回 None"""
        data = self.get_json(f'/space/{space_key}', {'expand': 'description.plain'})
        return data

    def list_pages(self, space_key, max_items=None):
        """列出空间下全部页面（含正文 storage 格式、版本、父级）"""
        return self.paginate(
            '/content',
            {
                'spaceKey': space_key,
                'type': 'page',
                'expand': 'body.storage,version,ancestors',
            },
            max_items,
        )

    def get_page(self, page_id):
        """按页面 ID 获取单页"""
        return self.get_json(
            f'/content/{page_id}',
            {'expand': 'body.storage,version,ancestors,space'},
        )

    def list_attachments(self, page_id, max_items=None):
        """列出页面下的附件，返回 (附件列表, 该响应的 _links.base)

        _links.base 用于把附件上的相对下载地址拼成完整 URL。
        """
        path = f'/content/{page_id}/child/attachment'
        params = {'limit': self.page_size, 'expand': 'version'}
        results = []
        base = self.api_root

        while True:
            data = self.get_json(path, params)
            base = (data.get('_links') or {}).get('base') or base
            items = data.get('results') or []
            results.extend(items)

            if max_items and len(results) >= max_items:
                return results[:max_items], base
            if len(items) < self.page_size:
                return results, base
            params = dict(params, start=len(results))
