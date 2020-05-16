# coding:utf-8
# @文件: auth.py
# @创建者：州的先生
# #日期：2020/5/11
# 博客地址：zmister.com

from django.contrib.auth.models import User
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from app_api.models import *


class AppAuth(BaseAuthentication):
    '''自定义认证类'''

    def authenticate(self, request):
        token = request.query_params.get('token')
        # print(token)
        if token:
            # 如果请求url中携带有token参数
            user_obj = AppUserToken.objects.filter(token=token).first()
            if user_obj:
                # print("ok")
                # token 是有效的，返回一个元组
                return user_obj.user, token  # request.user, request.auth
            else:
                # raise AuthenticationFailed('无效的token')
                return None
        else:
            # raise AuthenticationFailed('请求的URL中必须携带token参数')
            return None


class AppMustAuth(BaseAuthentication):
    '''自定义认证类'''

    def authenticate(self, request):
        token = request.query_params.get('token')
        # print(token)
        if token:
            # 如果请求url中携带有token参数
            user_obj = AppUserToken.objects.filter(token=token).first()
            if user_obj:
                # print("ok")
                # token 是有效的，返回一个元组
                return user_obj.user, token  # request.user, request.auth
            else:
                raise AuthenticationFailed('无效的token')
                # return None
        else:
            raise AuthenticationFailed('请求的URL中必须携带token参数')
            # return None