# coding:utf-8
"""语雀 Open API v2 客户端。

只依赖 requests，与 Confluence 客户端保持一致的风格：
分页、429 限流等待、5xx 重试、凭据校验、图片下载。

接口细节遵循语雀官方 OpenAPI（https://www.yuque.com/yuque/developer/api）：
- 鉴权：请求头 `X-Auth-Token`
- 统一以 `{"data": ...}` 包裹业务数据
- 分页：`offset` + `limit`
"""

import time
from urllib.parse import quote

import requests
from loguru import logger

DEFAULT_API_ROOT = 'https://www.yuque.com/api/v2'

# 只取文档型知识库，排除画板/表格/资源等其它类型
BOOK_TYPE = 'Book'

# 文档详情之间的固定间隔：语雀个人 Token 约 100 请求 / 5 分钟
DETAIL_INTERVAL = 0.3


class YuqueApiError(Exception):
    """语雀接口调用失败（鉴权、权限、网络、协议错误等）"""


class YuqueClient:
    """语雀 REST 客户端。

    :param token: 语雀个人 Token
    :param api_root: API 根地址，企业版为 https://<企业>.yuque.com/api/v2
    :param verify: 是否校验 HTTPS 证书
    :param timeout: 单次请求超时秒数
    :param delay: 每次请求前的固定间隔，用于给源站降速
    """

    def __init__(self, token, api_root=DEFAULT_API_ROOT, verify=True, timeout=30,
                 delay=0.0, max_retries=3, page_size=100,
                 detail_interval=DETAIL_INTERVAL):
        token = (token or '').strip()
        if not token:
            raise YuqueApiError('缺少语雀 Token（--token 或环境变量 YUQUE_TOKEN）')

        self.token = token
        self.api_root = (api_root or DEFAULT_API_ROOT).strip().rstrip('/')
        self.timeout = timeout
        self.delay = max(0.0, float(delay or 0))
        self.max_retries = max(0, int(max_retries))
        self.page_size = max(1, int(page_size or 100))
        self.detail_interval = max(0.0, float(detail_interval or 0))

        self.session = requests.Session()
        self.session.verify = verify
        self.session.headers.update({
            'X-Auth-Token': token,
            'Accept': 'application/json',
            'User-Agent': 'MrDocPro-Importer/1.0',
        })

        # 图片等静态资源位于第三方 CDN，单独用一个不带 Token 的会话下载，
        # 避免把凭据发送到语雀之外的域名
        self._download_session = requests.Session()
        self._download_session.verify = verify
        self._download_session.headers.update({
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (compatible; MrDocPro-Importer/1.0)',
            'Referer': 'https://www.yuque.com/',
        })

        self._user = None

    # ------------------------------------------------------------------ #
    # 身份
    # ------------------------------------------------------------------ #
    def get_user(self):
        """当前 Token 对应的用户，同时用于提前校验凭据"""
        if self._user is None:
            self._user = self.get_json('/user') or {}
        return self._user

    @property
    def web_base(self):
        """站点地址（去掉 API 前缀），用于拼接文档原始链接"""
        root = self.api_root
        for suffix in ('/api/v2', '/api'):
            if root.endswith(suffix):
                return root[: -len(suffix)]
        return root

    def source_identity(self):
        """来源标识，用于状态文件分区"""
        login = (self.get_user() or {}).get('login') or 'unknown'
        return f'yuque:{self.api_root}:{login}'

    def describe(self):
        user = self.get_user() or {}
        name = user.get('name') or user.get('login') or ''
        return f'{name}（{self.api_root}）' if name else self.api_root

    # ------------------------------------------------------------------ #
    # 底层请求
    # ------------------------------------------------------------------ #
    def _sleep(self):
        if self.delay:
            time.sleep(self.delay)

    def get_json(self, path, params=None):
        """GET 并返回 `data` 字段内容，带 429/5xx 重试"""
        url = self.api_root + path
        last_error = None
        for attempt in range(self.max_retries + 1):
            self._sleep()
            try:
                resp = self.session.get(url, params=params, timeout=self.timeout)
            except requests.RequestException as e:
                last_error = f'网络异常: {e!r}'
                logger.warning(f'语雀请求异常（第{attempt + 1}次）: {url} | {e!r}')
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code == 429:
                retry_after = resp.headers.get('Retry-After') or ''
                wait = int(retry_after) if retry_after.isdigit() else (2 ** attempt)
                wait = min(max(wait, 1), 60)
                last_error = f'限流(429)，等待{wait}秒'
                logger.warning(f'语雀触发限流，等待 {wait}s 后重试: {url}')
                time.sleep(wait)
                continue

            if resp.status_code >= 500:
                last_error = f'服务端错误({resp.status_code})'
                logger.warning(f'语雀服务端错误（第{attempt + 1}次）: {resp.status_code} {url}')
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code in (401, 403):
                raise YuqueApiError(
                    f'鉴权/权限失败({resp.status_code})：请检查 Token 与知识库访问权限 | {url}')
            if resp.status_code == 404:
                raise YuqueApiError(f'资源不存在(404)：{url}')
            if resp.status_code >= 400:
                raise YuqueApiError(
                    f'接口返回异常({resp.status_code})：{resp.text[:300]} | {url}')

            try:
                payload = resp.json()
            except ValueError:
                raise YuqueApiError(f'接口返回非 JSON 内容：{url}')

            if isinstance(payload, dict) and 'data' in payload:
                return payload['data']
            return payload

        raise YuqueApiError(f'请求失败（已重试 {self.max_retries} 次）：{url} | {last_error}')

    def paginate(self, path, params=None, max_items=None):
        """按 offset/limit 翻页，逐条产出结果"""
        params = dict(params or {})
        offset = 0
        yielded = 0
        while True:
            page_params = dict(params, offset=offset, limit=self.page_size)
            items = self.get_json(path, page_params)
            if not isinstance(items, list) or not items:
                return
            for item in items:
                yield item
                yielded += 1
                if max_items and yielded >= max_items:
                    return
            if len(items) < self.page_size:
                return
            offset += len(items)

    def download(self, url):
        """下载二进制内容（图片等静态资源）"""
        last_error = None
        for attempt in range(self.max_retries + 1):
            self._sleep()
            try:
                resp = self._download_session.get(url, timeout=self.timeout, stream=True)
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
                raise YuqueApiError(f'下载失败({resp.status_code})：{url}')

            return resp.content

        raise YuqueApiError(f'下载失败（已重试 {self.max_retries} 次）：{url} | {last_error}')

    # ------------------------------------------------------------------ #
    # 业务接口
    # ------------------------------------------------------------------ #
    def list_user_repos(self, login, max_items=None):
        """列出某个用户的个人知识库（仅文档型）"""
        return self.paginate(f'/users/{quote(str(login))}/repos',
                             params={'type': BOOK_TYPE}, max_items=max_items)

    def list_user_groups(self):
        """列出当前用户加入的团队。

        该端点要求传**数字用户 ID**，传 login 取不到数据。
        """
        user_id = (self.get_user() or {}).get('id')
        if not user_id:
            return []
        return self.get_json(f'/users/{user_id}/groups') or []

    def list_group_repos(self, login, max_items=None):
        """列出某个团队的知识库（仅文档型）"""
        return self.paginate(f'/groups/{quote(str(login))}/repos',
                             params={'type': BOOK_TYPE}, max_items=max_items)

    def get_repo(self, namespace):
        """按 namespace（如 login/repo）获取知识库详情，返回值含数字 id"""
        return self.get_json(f'/repos/{namespace}') or {}

    def list_docs(self, book_id, max_items=None):
        """列出知识库下的全部文档（不含正文）"""
        return self.paginate(f'/repos/{book_id}/docs', max_items=max_items)

    def get_doc(self, doc_id):
        """获取文档详情（含 body / body_html / body_lake）"""
        return self.get_json(f'/repos/docs/{doc_id}') or {}

    def get_toc(self, book_id):
        """获取知识库目录（一次请求返回扁平节点列表）"""
        return self.get_json(f'/repos/{book_id}/toc') or []

    def throttle_detail(self):
        """文档详情之间的固定间隔，避免触发语雀的请求频率限制"""
        wait = max(self.detail_interval, self.delay)
        if wait:
            time.sleep(wait)
