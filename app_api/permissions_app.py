# coding:utf-8
# @文件: permissions.py
# @创建者：州的先生
# #日期：2020/5/11
# 博客地址：zmister.com

from rest_framework.permissions import BasePermission,SAFE_METHODS
from django.utils.translation import gettext_lazy as _

class AppPermission(BasePermission):
    message = _('只有VIP才能访问')

    def has_permission(self, request, view):
        # vip才有访问权限
        # request.user:当前经过认证的用户对象
        # 如果没有认证 request.user就是匿名用户
        if not request.auth:
            # 认证没有通过
            return False
        if request.user.vip:
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

            # 示例必须要有一个名为`owner`的属性
        return obj.owner == request.user