from django.core.exceptions import PermissionDenied # 权限拒绝异常
from django.http import Http404
from app_admin.models import SysSetting

# 超级管理员用户需求
def superuser_only(function):
    """限制视图只有超级管理员能够访问"""
    def _inner(request, *args, **kwargs):
        if request.user.is_authenticated:
            if not request.user.is_superuser:
                raise PermissionDenied
        else:
            raise PermissionDenied
        return function(request, *args, **kwargs)

    return _inner

# 开放注册需求
def open_register(function):
    '''只有开放注册才能访问'''
    def _inner(request,*args,**kwargs):
        try:
            status = SysSetting.objects.get(name='close_register')
        except:
            # 如果不存在close_register这个属性，那么表示是开放注册的
            return function(request, *args, **kwargs)
        if status.value == 'on':
            raise Http404
        return function(request, *args, **kwargs)

    return _inner

# 请求头验证
def check_headers(function):
    def _inner(request,*args,**kwargs):
        metas = request.META
        if 'HTTP_COOKIE' not in metas:
            raise Http404
        elif 'HTTP_USER_AGENT' not in metas:
            raise Http404
        return function(request, *args, **kwargs)
    return _inner