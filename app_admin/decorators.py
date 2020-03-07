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
        # if 'HTTP_COOKIE' not in metas:
        #     raise Http404
        if 'HTTP_USER_AGENT' not in metas:
            raise Http404
        return function(request, *args, **kwargs)
    return _inner


# 开放前台文集导出
def allow_report_file(function):
    def _inner(request,*args,**kwargs):
        try:
            status = SysSetting.objects.get(name='enable_project_report')
        except:
            # 如果不存在enable_project_report这个属性，那么表示是禁止导出的
            raise Http404
        # 启用导出
        if status.value == 'on':
            return function(request, *args, **kwargs)
        else:
            raise Http404
    return _inner