# coding:utf-8
"""Notion API 客户端。

只依赖 requests，鉴权用 Internal Integration Token（Bearer），
分页用 `start_cursor`/`next_cursor`，自带限流与重试。

实现细节对齐 WeKnora 的 Notion 连接器（client.go）：
- 必带 `Notion-Version` 请求头；
- 官方限流约 3 请求/秒，这里按固定最小间隔节流；
- 429 读 `Retry-After`，5xx 指数退避，401/403 视为凭据无效；
- 文件地址是带签名的 S3 直链，下载时不带凭据。

接口参考：https://developers.notion.com/reference/intro
"""

import time

import requests
from loguru import logger

DEFAULT_BASE_URL = 'https://api.notion.com'
DEFAULT_API_VERSION = '2022-06-28'

MIN_REQUEST_INTERVAL = 1.0 / 3.0   # 官方限流约 3 请求/秒
MAX_RETRIES = 3
MAX_PAGE_SIZE = 100


class NotionApiError(Exception):
    """Notion 接口调用失败（鉴权、权限、网络、协议错误等）"""


class NotionClient:
    def __init__(self, token, base_url=DEFAULT_BASE_URL, api_version=DEFAULT_API_VERSION,
                 verify=True, timeout=30, delay=0.0, max_retries=MAX_RETRIES,
                 page_size=MAX_PAGE_SIZE, min_interval=MIN_REQUEST_INTERVAL):
        token = (token or '').strip()
        if not token:
            raise NotionApiError('缺少 Notion Integration Token（--token 或环境变量 NOTION_TOKEN）')

        self.token = token
        self.base_url = (base_url or DEFAULT_BASE_URL).strip().rstrip('/')
        self.api_version = api_version or DEFAULT_API_VERSION
        self.timeout = timeout
        self.delay = max(0.0, float(delay or 0))
        self.max_retries = max(0, int(max_retries))
        self.page_size = max(1, min(int(page_size or MAX_PAGE_SIZE), MAX_PAGE_SIZE))
        self.min_interval = max(0.0, float(min_interval or 0))
        self._last_request_at = 0.0

        self.session = requests.Session()
        self.session.verify = verify
        self.session.headers.update({
            'Authorization': f'Bearer {token}',
            'Notion-Version': self.api_version,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'MrDocPro-Importer/1.0',
        })

        # 文件在第三方签名直链上，既不需要也不应带上凭据
        self._download_session = requests.Session()
        self._download_session.verify = verify
        self._download_session.headers.update({
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (compatible; MrDocPro-Importer/1.0)',
        })

        self._bot = None

    # ------------------------------------------------------------------ #
    # 身份
    # ------------------------------------------------------------------ #
    def ping(self):
        """校验 Token 是否有效"""
        return self.request('GET', '/v1/users/me') or {}

    def _bot_info(self):
        if self._bot is None:
            self._bot = self.ping()
        return self._bot

    def source_identity(self):
        bot_id = self._bot_info().get('id') or 'unknown'
        return f'notion:{self.base_url}:{bot_id}'

    def describe(self):
        name = self._bot_info().get('name') or ''
        return f'{name}（{self.base_url}）' if name else self.base_url

    # ------------------------------------------------------------------ #
    # 底层请求
    # ------------------------------------------------------------------ #
    def _throttle(self):
        wait = max(self.min_interval, self.delay)
        if wait:
            elapsed = time.monotonic() - self._last_request_at
            if elapsed < wait:
                time.sleep(wait - elapsed)
        self._last_request_at = time.monotonic()

    def request(self, method, path, params=None, json_body=None):
        url = self.base_url + path
        last_error = None

        for attempt in range(self.max_retries + 1):
            self._throttle()
            try:
                resp = self.session.request(method, url, params=params,
                                            json=json_body, timeout=self.timeout)
            except requests.RequestException as e:
                last_error = f'网络异常: {e!r}'
                logger.warning(f'Notion 请求异常（第{attempt + 1}次）：{url} | {e!r}')
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code == 429:
                retry_after = resp.headers.get('Retry-After') or ''
                wait = float(retry_after) if retry_after.replace('.', '', 1).isdigit() else (2 ** attempt)
                wait = min(max(wait, 1.0), 60.0)
                last_error = '限流(429)'
                logger.warning(f'Notion 触发限流，等待 {wait:.0f}s 后重试：{url}')
                time.sleep(wait)
                continue

            if resp.status_code >= 500:
                last_error = f'服务端错误({resp.status_code})'
                logger.warning(f'Notion 服务端错误（第{attempt + 1}次）：{resp.status_code} {url}')
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code in (401, 403):
                raise NotionApiError(
                    f'鉴权/权限失败({resp.status_code})：请确认 Integration Token 有效，'
                    f'且目标页面已共享给该集成 | {resp.text[:200]}')
            if resp.status_code == 404:
                raise NotionApiError(f'资源不存在或未共享给集成(404)：{path}')
            if resp.status_code >= 400:
                raise NotionApiError(f'接口返回异常({resp.status_code})：{resp.text[:300]} | {path}')

            try:
                return resp.json()
            except ValueError:
                raise NotionApiError(f'接口返回非 JSON 内容：{path}')

        raise NotionApiError(f'请求失败（已重试 {self.max_retries} 次）：{path} | {last_error}')

    def download(self, url):
        """下载媒体文件（签名直链，不带凭据）"""
        last_error = None
        for attempt in range(self.max_retries + 1):
            self._throttle()
            try:
                resp = self._download_session.get(url, timeout=self.timeout, stream=True)
            except requests.RequestException as e:
                last_error = repr(e)
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code == 429:
                last_error = '限流(429)'
                time.sleep(min(2 ** attempt, 10))
                continue
            if resp.status_code >= 500:
                last_error = f'服务端错误({resp.status_code})'
                time.sleep(min(2 ** attempt, 10))
                continue
            if resp.status_code >= 400:
                raise NotionApiError(f'下载失败({resp.status_code})：{url}')

            return resp.content

        raise NotionApiError(f'下载失败（已重试 {self.max_retries} 次）：{url} | {last_error}')

    # ------------------------------------------------------------------ #
    # 业务接口
    # ------------------------------------------------------------------ #
    def search(self):
        """列出集成可访问的全部页面与数据库"""
        results = []
        cursor = None
        while True:
            body = {'page_size': self.page_size}
            if cursor:
                body['start_cursor'] = cursor
            payload = self.request('POST', '/v1/search', json_body=body) or {}
            results.extend(payload.get('results') or [])
            if not payload.get('has_more') or not payload.get('next_cursor'):
                break
            cursor = payload['next_cursor']
        return results

    def get_page(self, page_id):
        return self.request('GET', f'/v1/pages/{page_id}') or {}

    def list_block_children(self, block_id):
        """列出某个块的直接子块（自动翻页）"""
        blocks = []
        cursor = None
        while True:
            params = {'page_size': self.page_size}
            if cursor:
                params['start_cursor'] = cursor
            payload = self.request('GET', f'/v1/blocks/{block_id}/children', params=params) or {}
            blocks.extend(payload.get('results') or [])
            if not payload.get('has_more') or not payload.get('next_cursor'):
                break
            cursor = payload['next_cursor']
        return blocks
