# coding:utf-8
from django.conf import settings
from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.translation import gettext_lazy as _
from django.core.cache import cache
from app_admin.decorators import superuser_only,open_register
from app_admin.models import SysSetting
from loguru import logger
import json
import sys
import requests
import datetime

# 获取系统配置
def get_sys_value(types, name, default=None):
    return getattr(SysSetting.objects.filter(types=types, name=name).first(), 'value', default)