# coding:utf-8
# @文件: language.py
# 忽略浏览器的 Accept-Language，强制使用设置文件中指定的语言

from django.conf import settings
from django.utils import translation


class ForceDefaultLanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 强制激活 LANGUAGE_CODE
        translation.activate(settings.LANGUAGE_CODE)
        request.LANGUAGE_CODE = settings.LANGUAGE_CODE

        response = self.get_response(request)
        # 设置响应头中的语言
        response['Content-Language'] = settings.LANGUAGE_CODE
        return response
