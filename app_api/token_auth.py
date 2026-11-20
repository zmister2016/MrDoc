# coding:utf-8
"""统一 Token 解析与权限校验。

- AccessToken：细粒度 Token，支持多 Token、scope、限定文集、有效期、吊销；
- UserToken：旧版 Token，全权限、无过期，保持兼容（等价于全部 scope）；
- 鉴权推荐使用 ``Authorization: Bearer <token>``，``?token=`` 查询参数仅兼容保留、已不推荐；
- 业务端点统一通过 ``authenticate(request, scope)`` 接入，文集范围由 ``project_ids`` 约束。
"""
import hashlib
import json
import secrets
from dataclasses import dataclass
from typing import Optional

from django.conf import settings
from django.http.response import JsonResponse
from django.utils import timezone

from app_api.models import AccessToken, UserToken

# Token 前缀，便于在日志/配置中识别
TOKEN_PREFIX = 'mrdoc_pat_'

# 权限范围注册表：新增 scope 只需在此追加
SCOPES = {
    'project:read': '读取文集',
    'project:write': '创建、修改文集',
    'doc:read': '读取文档',
    'doc:write': '创建、修改文档',
    'doc:delete': '删除文档',
    'image:write': '上传图片',
    'attachment:write': '上传附件',
}
ALL_SCOPES = tuple(SCOPES.keys())

# 旧 Token 等价于全部权限
LEGACY_SCOPES = ALL_SCOPES

# last_used_at 写库节流（秒）
LAST_USED_THROTTLE_SECONDS = 60


class TokenError(Exception):
    """Token 认证/授权异常"""
    status_code = 401
    code = 'invalid_token'
    default_message = '无效或已过期的 Token'

    def __init__(self, message=None, code=None, status_code=None):
        self.message = message or self.default_message
        if code:
            self.code = code
        if status_code:
            self.status_code = status_code


class TokenScopeError(TokenError):
    status_code = 403
    code = 'insufficient_scope'
    default_message = 'Token 权限不足'


@dataclass(frozen=True)
class TokenContext:
    user: object
    scopes: frozenset
    project_ids: frozenset
    token: Optional[object] = None
    legacy: bool = False
    name: str = ''

    def has_scope(self, scope):
        return scope in self.scopes

    def allows_project(self, project_id):
        if not self.project_ids:
            return True
        try:
            return int(project_id) in self.project_ids
        except (TypeError, ValueError):
            return False


def _pepper():
    return getattr(settings, 'API_TOKEN_PEPPER', settings.SECRET_KEY)


def hash_token(raw_token):
    """对 Token 明文做不可逆哈希，数据库只保存哈希值"""
    return hashlib.sha256('{}{}'.format(_pepper(), raw_token).encode('utf-8')).hexdigest()


def generate_token(user, name='默认', scopes=None, project_ids=None, expires_at=None):
    """创建细粒度 Token，返回 (AccessToken 实例, 明文 Token)"""
    scopes = list(scopes or [])
    project_ids = [int(i) for i in (project_ids or [])]
    raw_token = TOKEN_PREFIX + secrets.token_urlsafe(32)
    token_obj = AccessToken.objects.create(
        user=user,
        name=(name or '默认')[:64],
        token_prefix=raw_token[:20],
        token_hash=hash_token(raw_token),
        scopes=scopes,
        project_ids=project_ids,
        expires_at=expires_at,
    )
    return token_obj, raw_token


def extract_raw_token(request):
    """从请求中提取 Token，优先级：Authorization > X-Token/Token 头 > token 参数

    Authorization 支持 ``Bearer <token>``、``Token <token>`` 以及直接放原始 Token；
    ``?token=`` 会出现在访问日志和 Referer 中，仅为兼容旧客户端保留，已不推荐使用。
    """
    auth_header = (request.META.get('HTTP_AUTHORIZATION') or '').strip()
    if auth_header:
        parts = auth_header.split(None, 1)
        if len(parts) == 2 and parts[0].lower() in ('bearer', 'token'):
            return parts[1].strip()
        # 兼容不带 scheme 的写法：Authorization: <token>
        return auth_header
    header_token = (request.META.get('HTTP_X_TOKEN') or request.META.get('HTTP_TOKEN') or '').strip()
    if header_token:
        return header_token
    raw_token = ''
    if request.method == 'POST':
        raw_token = (request.POST.get('token') or '').strip()
    # POST 未带 token 时回退到查询参数，兼容 ?token= 的老调用方式
    return raw_token or (request.GET.get('token') or '').strip()


def _client_ip(request):
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR', '')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR') or None


def _touch_last_used(token_obj, request):
    """更新最近使用时间，按 60 秒节流，失败不影响认证"""
    now = timezone.now()
    if token_obj.last_used_at and (now - token_obj.last_used_at).total_seconds() < LAST_USED_THROTTLE_SECONDS:
        return
    try:
        token_obj.last_used_at = now
        token_obj.last_used_ip = _client_ip(request)
        token_obj.save(update_fields=['last_used_at', 'last_used_ip'])
    except Exception:
        pass


def resolve_token(request):
    """解析请求中的 Token；无效返回 None，不回写任何业务逻辑"""
    raw_token = extract_raw_token(request)
    if not raw_token:
        return None

    # 优先匹配细粒度 Token
    token_obj = AccessToken.objects.select_related('user').filter(
        token_hash=hash_token(raw_token)).first()
    if token_obj:
        if not token_obj.is_active() or not token_obj.user.is_active:
            return None
        _touch_last_used(token_obj, request)
        return TokenContext(
            user=token_obj.user,
            scopes=frozenset(token_obj.scopes or []),
            project_ids=frozenset(int(i) for i in (token_obj.project_ids or [])),
            token=token_obj,
            legacy=False,
            name=token_obj.name,
        )

    # 兼容旧版 Token（用户唯一 Token，全权限）
    legacy_token = UserToken.objects.select_related('user').filter(token=raw_token).first()
    if legacy_token and legacy_token.user.is_active:
        return TokenContext(
            user=legacy_token.user,
            scopes=frozenset(LEGACY_SCOPES),
            project_ids=frozenset(),
            token=legacy_token,
            legacy=True,
            name='旧版 Token',
        )
    return None


def require_scope(context, scope, project_id=None):
    """校验 scope 与文集范围，失败抛出 TokenError/TokenScopeError"""
    if context is None:
        raise TokenError()
    if not context.has_scope(scope):
        raise TokenScopeError('Token 缺少 {} 权限'.format(scope))
    if project_id is not None and not context.allows_project(project_id):
        raise TokenScopeError('Token 未被授权访问该文集')
    return context


def _enforce_project_scope(request, context):
    """按请求中的 pid/did 校验 Token 的限定文集"""
    if not context.project_ids:
        return
    pid = request.GET.get('pid') or request.POST.get('pid')
    did = request.GET.get('did') or request.POST.get('did')
    # JSON 请求体（部分接口使用 application/json）
    if not pid and not did and request.method == 'POST' \
            and 'json' in (request.META.get('CONTENT_TYPE') or '').lower():
        try:
            payload = json.loads(request.body.decode('utf-8') or '{}')
        except Exception:
            payload = {}
        if isinstance(payload, dict):
            pid = payload.get('pid')
            did = payload.get('did')
    if pid:
        if not context.allows_project(pid):
            raise TokenScopeError('Token 未被授权访问该文集')
    elif did:
        from app_doc.models import Doc
        top_doc = Doc.objects.filter(id=did).values_list('top_doc', flat=True).first()
        if top_doc is not None and not context.allows_project(top_doc):
            raise TokenScopeError('Token 未被授权访问该文集')


def authenticate(request, scope=None):
    """解析并校验请求中的 Token，返回 TokenContext；失败抛出 TokenError"""
    context = resolve_token(request)
    if context is None:
        raise TokenError()
    if scope:
        require_scope(context, scope)
    _enforce_project_scope(request, context)
    return context


def scoped_projects(context, edit=False):
    """返回 Token 可访问的文集ID列表（用户权限与 Token 限定文集取交集）"""
    from app_api.utils import read_add_projects, read_add_edit_projects
    if edit:
        project_ids = read_add_edit_projects(context.user)
    else:
        project_ids = read_add_projects(context.user)
    if context.project_ids:
        project_ids = [pid for pid in project_ids if pid in context.project_ids]
    return project_ids


def error_response(error):
    """把 TokenError 转成统一 JSON 响应"""
    return JsonResponse({
        'status': False,
        'code': error.code,
        'data': error.message,
    }, status=error.status_code)
