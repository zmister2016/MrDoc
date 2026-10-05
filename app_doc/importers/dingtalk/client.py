# coding:utf-8
"""钉钉文档客户端。

鉴权用企业内部应用的 appKey + appSecret 换取 accessToken；
调用时带 `x-acs-dingtalk-access-token` 请求头。

接口与错误处理对齐 WeKnora 的 dingtalk 连接器（client.go）：
- 所有接口都要传 `operatorId`（操作者的 unionId），否则视为无权限；
- `operatorId` 是拼接在查询串里的，出错时会随 URL 一起冒出来，因此日志与异常里必须脱敏；
- 分页用 `maxResults` + `nextToken`（重复 nextToken 视为死循环，需中断）；
- 文档块接口用 `startIndex`/`endIndex` 下标分页。

接口参考：https://open.dingtalk.com/document/orgapp/overview-of-document-apis
"""

import time
from urllib.parse import quote, urlencode

import requests
from loguru import logger

DEFAULT_BASE_URL = 'https://api.dingtalk.com'
WORKSPACE_PAGE_SIZE = 30
NODE_PAGE_SIZE = 50
BLOCK_PAGE_SIZE = 100
MAX_PAGES = 1000
TOKEN_DEFAULT_TTL = 90 * 60
TOKEN_SAFETY_MARGIN = 300


class DingTalkApiError(Exception):
    """钉钉接口调用失败（鉴权、权限、网络、协议错误等）"""


class DingTalkClient:
    def __init__(self, app_key, app_secret, operator_id, base_url=DEFAULT_BASE_URL,
                 verify=True, timeout=30, delay=0.0, max_retries=3):
        app_key = (app_key or '').strip()
        app_secret = (app_secret or '').strip()
        operator_id = (operator_id or '').strip()
        if not app_key or not app_secret:
            raise DingTalkApiError('缺少钉钉应用凭据（--app-key / --app-secret，'
                                   '或环境变量 DINGTALK_APP_KEY / DINGTALK_APP_SECRET）')
        if not operator_id:
            raise DingTalkApiError('缺少 operatorId（--operator-id，或环境变量 DINGTALK_OPERATOR_ID）。'
                                   '钉钉文档接口要求以某个成员的 unionId 身份操作')

        self.app_key = app_key
        self.app_secret = app_secret
        self.operator_id = operator_id
        self.base_url = (base_url or DEFAULT_BASE_URL).strip().rstrip('/')
        self.timeout = timeout
        self.delay = max(0.0, float(delay or 0))
        self.max_retries = max(0, int(max_retries))

        self._token = ''
        self._token_expire_at = 0.0
        self._last_request_at = 0.0

        self.session = requests.Session()
        self.session.verify = verify
        self.session.headers.update({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'MrDocPro-Importer/1.0',
        })

        # 正文里的图片是可直接访问的地址，用独立会话下载，避免把 access token 发给第三方
        self._download_session = requests.Session()
        self._download_session.verify = verify
        self._download_session.headers.update({
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (compatible; MrDocPro-Importer/1.0)',
        })

    # ------------------------------------------------------------------ #
    # 访问凭据
    # ------------------------------------------------------------------ #
    def access_token(self):
        if self._token and time.time() < self._token_expire_at:
            return self._token

        url = f'{self.base_url}/v1.0/oauth2/accessToken'
        try:
            resp = self.session.post(url, json={
                'appKey': self.app_key,
                'appSecret': self.app_secret,
            }, timeout=self.timeout)
            payload = resp.json()
        except (requests.RequestException, ValueError) as e:
            raise DingTalkApiError(f'获取钉钉 accessToken 失败：{e!r}')

        token = (payload.get('accessToken') or '').strip()
        if not token:
            raise DingTalkApiError(f"获取钉钉 accessToken 失败：{self._redact(str(payload))[:200]}")

        ttl = int(payload.get('expireIn') or 0) or TOKEN_DEFAULT_TTL
        self._token = token
        self._token_expire_at = time.time() + max(ttl - TOKEN_SAFETY_MARGIN, 60)
        logger.debug(f'钉钉导入：已获取 accessToken，有效期 {ttl}s')
        return self._token

    def source_identity(self):
        return f'dingtalk:{self.base_url}:{self.app_key}'

    def describe(self):
        return f'{self.base_url}（appKey={self.app_key}）'

    # ------------------------------------------------------------------ #
    # 底层请求
    # ------------------------------------------------------------------ #
    def _redact(self, text):
        """把 operatorId 从文本里抹掉，避免随 URL 泄漏到日志或异常里"""
        text = str(text)
        if self.operator_id:
            text = text.replace(self.operator_id, '[REDACTED]')
        return text

    def _throttle(self):
        if self.delay:
            elapsed = time.monotonic() - self._last_request_at
            if elapsed < self.delay:
                time.sleep(self.delay - elapsed)
        self._last_request_at = time.monotonic()

    def request(self, method, path, params=None, json_body=None):
        url = self.base_url + path
        last_error = None

        for attempt in range(self.max_retries + 1):
            self._throttle()
            headers = {'x-acs-dingtalk-access-token': self.access_token()}
            try:
                resp = self.session.request(method, url, params=params, json=json_body,
                                            headers=headers, timeout=self.timeout)
            except requests.RequestException as e:
                last_error = f'网络异常: {type(e).__name__}'
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code == 429:
                retry_after = resp.headers.get('Retry-After') or ''
                wait = float(retry_after) if retry_after.replace('.', '', 1).isdigit() else (2 ** attempt)
                last_error = '限流(429)'
                logger.warning(f'钉钉触发限流，等待 {min(max(wait, 1.0), 60.0):.0f}s 后重试')
                time.sleep(min(max(wait, 1.0), 60.0))
                continue

            if resp.status_code >= 500:
                last_error = f'服务端错误({resp.status_code})'
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code >= 400:
                # 钉钉把错误信息放在响应体里，且可能回显 URL（含 operatorId）
                raise DingTalkApiError(
                    f'接口返回异常({resp.status_code})：{self._redact(resp.text)[:300]} | {path}')

            try:
                return resp.json()
            except ValueError:
                raise DingTalkApiError(f'接口返回非 JSON 内容：{path}')

        raise DingTalkApiError(f'请求失败（已重试 {self.max_retries} 次）：{path} | {last_error}')

    def _paged_items(self, path, key, params, page_size):
        """按 nextToken 翻页收集全部条目"""
        items = []
        next_token = ''
        seen_tokens = set()

        for _ in range(MAX_PAGES):
            query = dict(params)
            query['maxResults'] = page_size
            if next_token:
                query['nextToken'] = next_token

            payload = self.request('GET', f'{path}?{urlencode(query)}') or {}
            items.extend(payload.get(key) or [])

            next_token = str(payload.get('nextToken') or '').strip()
            if not next_token:
                return items
            if next_token in seen_tokens:
                logger.warning(f'钉钉导入：分页 nextToken 重复，提前结束：{path}')
                return items
            seen_tokens.add(next_token)

        logger.warning(f'钉钉导入：分页超过 {MAX_PAGES} 页，已截断：{path}')
        return items

    # ------------------------------------------------------------------ #
    # 知识库与节点
    # ------------------------------------------------------------------ #
    def list_workspaces(self):
        """列出全部知识库"""
        return self._paged_items('/v2.0/wiki/workspaces', 'workspaces',
                                 {'operatorId': self.operator_id}, WORKSPACE_PAGE_SIZE)

    def list_nodes(self, parent_node_id):
        """列出某个节点下的直接子节点（树需要逐层递归获取）"""
        return self._paged_items('/v2.0/wiki/nodes', 'nodes',
                                 {'operatorId': self.operator_id,
                                  'parentNodeId': parent_node_id}, NODE_PAGE_SIZE)

    # ------------------------------------------------------------------ #
    # 文档内容
    # ------------------------------------------------------------------ #
    def document_blocks(self, document_id):
        """取文档的块（按 startIndex/endIndex 下标分页）"""
        blocks = []
        for page in range(MAX_PAGES):
            start = page * BLOCK_PAGE_SIZE
            params = {
                'startIndex': start,
                'endIndex': start + BLOCK_PAGE_SIZE - 1,
                'operatorId': self.operator_id,
            }
            path = f'/v1.0/doc/suites/documents/{quote(str(document_id))}/blocks?{urlencode(params)}'
            payload = self.request('GET', path) or {}
            if not payload.get('success') or not payload.get('result'):
                raise DingTalkApiError(f'文档块接口返回失败：{self._redact(str(payload))[:200]}')

            data = (payload.get('result') or {}).get('data') or []
            blocks.extend(data)
            if len(data) < BLOCK_PAGE_SIZE:
                return blocks

        logger.warning(f'钉钉导入：文档 {document_id} 块数超过 {MAX_PAGES * BLOCK_PAGE_SIZE}，已截断')
        return blocks

    def download(self, url):
        """下载正文中的图片（在线地址，无需额外凭据）"""
        last_error = None
        for attempt in range(self.max_retries + 1):
            try:
                resp = self._download_session.get(url, timeout=self.timeout)
            except requests.RequestException as e:
                last_error = repr(e)
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code == 429 or resp.status_code >= 500:
                last_error = f'HTTP {resp.status_code}'
                time.sleep(min(2 ** attempt, 10))
                continue
            if resp.status_code >= 400:
                raise DingTalkApiError(f'下载失败({resp.status_code})：{self._redact(url)}')

            return resp.content

        raise DingTalkApiError(f'下载失败（已重试 {self.max_retries} 次）：{self._redact(url)} | {last_error}')
