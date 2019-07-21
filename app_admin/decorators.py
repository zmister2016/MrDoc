from django.core.exceptions import PermissionDenied # 权限拒绝异常

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