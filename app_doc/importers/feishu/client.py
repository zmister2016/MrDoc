# coding:utf-8
"""飞书 / Lark 开放平台客户端。

鉴权用自建应用的 app_id + app_secret 换取 tenant_access_token（有效期 2 小时），
调用时带 `Authorization: Bearer <tenant_access_token>`。

接口与错误处理对齐 WeKnora 的 feishu 连接器（core/client.go、core/region.go）：
- 飞书与 Lark 是同一产品部署在两个隔离的云上，API 形状一致，只是域名不同；
- token 缓存并留 5 分钟安全边界；
- 响应体是 `{code, msg, data}` 信封，HTTP 200 也可能 code != 0，必须按 code 判断；
- 429 读 `Retry-After`，5xx 重试一次，其余 4xx 直接失败（重试无意义）。

接口参考：https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/docx-structure
"""

import json
import time
from urllib.parse import quote

import requests
from loguru import logger

# 飞书（中国大陆）与 Lark（国际）两套域名
OPEN_BASE_URL = 'https://open.feishu.cn'
LARK_OPEN_BASE_URL = 'https://open.larksuite.com'
WEB_BASE_URL = 'https://feishu.cn'
LARK_WEB_BASE_URL = 'https://larksuite.com'

WIKI_PAGE_SIZE = 50
DOCX_BLOCK_PAGE_SIZE = 500
TOKEN_SAFETY_MARGIN = 300   # token 提前 5 分钟视为过期


class FeishuApiError(Exception):
    """飞书接口调用失败（鉴权、权限、网络、协议错误等）"""


def default_web_base(open_base_url):
    """按 API 域名推导对应的用户侧站点域名（用于生成可点击的来源链接）"""
    return LARK_WEB_BASE_URL if 'larksuite' in (open_base_url or '') else WEB_BASE_URL


class FeishuClient:
    def __init__(self, app_id, app_secret, base_url=OPEN_BASE_URL,
                 web_base_url='', verify=True, timeout=30, delay=0.0, max_retries=3):
        app_id = (app_id or '').strip()
        app_secret = (app_secret or '').strip()
        if not app_id or not app_secret:
            raise FeishuApiError('缺少飞书应用凭据（--app-id / --app-secret，'
                                 '或环境变量 FEISHU_APP_ID / FEISHU_APP_SECRET）')

        self.app_id = app_id
        self.app_secret = app_secret
        self.base_url = (base_url or OPEN_BASE_URL).strip().rstrip('/')
        self.web_base = (web_base_url or default_web_base(self.base_url)).strip().rstrip('/')
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
            'User-Agent': 'MrDocPro-Importer/1.0',
        })

    # ------------------------------------------------------------------ #
    # 访问凭据
    # ------------------------------------------------------------------ #
    def tenant_access_token(self):
        """获取（并缓存）tenant_access_token"""
        if self._token and time.time() < self._token_expire_at:
            return self._token

        url = f'{self.base_url}/open-apis/auth/v3/tenant_access_token/internal'
        try:
            resp = self.session.post(url, json={
                'app_id': self.app_id,
                'app_secret': self.app_secret,
            }, timeout=self.timeout)
            payload = resp.json()
        except (requests.RequestException, ValueError) as e:
            raise FeishuApiError(f'获取 tenant_access_token 失败：{e!r}')

        if payload.get('code') != 0:
            raise FeishuApiError(f'获取 tenant_access_token 失败：'
                                 f"code={payload.get('code')} msg={payload.get('msg')}")

        self._token = payload.get('tenant_access_token') or ''
        expire = int(payload.get('expire') or 0)
        self._token_expire_at = time.time() + max(expire - TOKEN_SAFETY_MARGIN, 60)
        logger.debug(f'飞书导入：已获取 tenant_access_token，有效期 {expire}s')
        return self._token

    def source_identity(self):
        return f'feishu:{self.base_url}:{self.app_id}'

    def describe(self):
        return f'{self.base_url}（app_id={self.app_id}）'

    # ------------------------------------------------------------------ #
    # 底层请求
    # ------------------------------------------------------------------ #
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
            headers = {'Authorization': f'Bearer {self.tenant_access_token()}'}
            try:
                resp = self.session.request(method, url, params=params, json=json_body,
                                            headers=headers, timeout=self.timeout)
            except requests.RequestException as e:
                last_error = f'网络异常: {e!r}'
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code == 429:
                retry_after = resp.headers.get('Retry-After') or ''
                wait = float(retry_after) if retry_after.replace('.', '', 1).isdigit() else (2 ** attempt)
                last_error = '限流(429)'
                logger.warning(f'飞书触发限流，等待 {min(max(wait, 1.0), 60.0):.0f}s 后重试：{path}')
                time.sleep(min(max(wait, 1.0), 60.0))
                continue

            if resp.status_code >= 500:
                last_error = f'服务端错误({resp.status_code})'
                if attempt >= 1:   # 5xx 只重试一次
                    break
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code >= 400:
                raise FeishuApiError(f'接口返回异常({resp.status_code})：'
                                     f'{resp.text[:300]} | {path}')

            try:
                payload = resp.json()
            except ValueError:
                raise FeishuApiError(f'接口返回非 JSON 内容：{path}')

            code = payload.get('code')
            if code != 0:
                raise FeishuApiError(f"接口业务错误：code={code} msg={payload.get('msg')} | {path}")
            return payload.get('data') or {}

        raise FeishuApiError(f'请求失败（已重试 {self.max_retries} 次）：{path} | {last_error}')

    def download(self, file_token, document_id=''):
        """下载文档内嵌媒体（图片 / 附件）。

        docx 内嵌的媒体必须额外带上 `extra={"drive_route_token": 文档ID}`，
        否则接口会返回 403。
        """
        params = {}
        if document_id:
            params['extra'] = json.dumps({'drive_route_token': document_id})
        url = f'{self.base_url}/open-apis/drive/v1/medias/{quote(str(file_token))}/download'

        last_error = None
        for attempt in range(self.max_retries + 1):
            self._throttle()
            try:
                resp = self.session.get(url, params=params, timeout=self.timeout,
                                        headers={'Authorization': f'Bearer {self.tenant_access_token()}'})
            except requests.RequestException as e:
                last_error = repr(e)
                time.sleep(min(2 ** attempt, 10))
                continue

            if resp.status_code == 429:
                last_error = '限流(429)'
                time.sleep(min(2 ** attempt, 10))
                continue
            if resp.status_code >= 400:
                raise FeishuApiError(f'媒体下载失败({resp.status_code})：{file_token}')

            return resp.content

        raise FeishuApiError(f'媒体下载失败（已重试 {self.max_retries} 次）：{file_token} | {last_error}')

    # ------------------------------------------------------------------ #
    # 知识空间（wiki）
    # ------------------------------------------------------------------ #
    def list_spaces(self):
        """列出全部知识空间（自动翻页）"""
        items = []
        page_token = ''
        while True:
            params = {'page_size': WIKI_PAGE_SIZE}
            if page_token:
                params['page_token'] = page_token
            data = self.request('GET', '/open-apis/wiki/v2/spaces', params=params)
            items.extend(data.get('items') or [])
            if not data.get('has_more') or not data.get('page_token'):
                break
            page_token = data['page_token']
        return items

    def get_space(self, space_id):
        return self.request('GET', f'/open-apis/wiki/v2/spaces/{quote(str(space_id))}')

    def list_nodes(self, space_id):
        """列出知识空间下的全部节点（扁平，含 parent_node_token 与 obj_type）"""
        items = []
        page_token = ''
        while True:
            params = {'page_size': WIKI_PAGE_SIZE}
            if page_token:
                params['page_token'] = page_token
            data = self.request('GET', f'/open-apis/wiki/v2/spaces/{quote(str(space_id))}/nodes',
                                params=params)
            items.extend(data.get('items') or [])
            if not data.get('has_more') or not data.get('page_token'):
                break
            page_token = data['page_token']
        return items

    # ------------------------------------------------------------------ #
    # 文档内容
    # ------------------------------------------------------------------ #
    def list_document_blocks(self, document_id):
        """取文档的全部块（飞书返回的是扁平数组，不是树）"""
        blocks = []
        page_token = ''
        while True:
            params = {'page_size': DOCX_BLOCK_PAGE_SIZE, 'document_revision_id': -1}
            if page_token:
                params['page_token'] = page_token
            path = f'/open-apis/docx/v1/documents/{quote(str(document_id))}/blocks'
            data = self.request('GET', path, params=params)
            blocks.extend(data.get('items') or [])
            if not data.get('has_more') or not data.get('page_token'):
                break
            page_token = data['page_token']
        return blocks

    def get_document_raw_content(self, document_id):
        """取文档纯文本（仅用于兜底，正常走块接口）"""
        data = self.request(
            'GET', f'/open-apis/docx/v1/documents/{quote(str(document_id))}/raw_content')
        return data.get('content') or ''
