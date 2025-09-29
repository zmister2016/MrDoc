# coding:utf-8
from django.shortcuts import render
from django.core.cache import cache
from django.http.response import JsonResponse,StreamingHttpResponse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination,LimitOffsetPagination # 分页
from rest_framework.authentication import SessionAuthentication # 认证
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from app_admin.decorators import superuser_only,open_register
from app_admin.models import SysSetting
from app_admin.utils import encrypt_data,decrypt_data
from app_api.auth_app import AppMustAuth
from app_api.permissions_app import SuperUserPermission
from app_doc.models import Doc, Project
from app_ai.utils import get_sys_value
from loguru import logger
import json
import sys
import requests
import datetime
import time

# 返回用户标识符
def get_user_identifier(request):
    """
    返回用户标识符：
    - 已登录用户：user_<id>
    - 匿名用户：anon_<session_key>
    """
    if request.user.is_authenticated:
        return f"user_{request.user.id}"
    else:
        # 确保 session 存在
        if not request.session.session_key:
            request.session.create()
        return f"anon_{request.session.session_key}"



# 文本生成动态速率限制装饰器
def dynamic_rate_limit(view_func):
    """
    动态速率限制装饰器，基于 request.user 进行限制
    """

    def wrapped_view(request, *args, **kwargs):
        # 从数据库中获取速率限制值
        rate_limit_value = getattr(
            SysSetting.objects.filter(types='ai', name='ai_write_rate_limit').first(),
            'value', '-1'  # 默认值为 '5/m'
        )

        if rate_limit_value == '-1':
            return view_func(request, *args, **kwargs)

        # 获取用户标识符（使用 request.user）
        user_identifier = get_user_identifier(request)  # 使用用户ID作为标识符

        # 解析速率限制
        try:
            num_requests = int(rate_limit_value)
        except:
            num_requests = 5
        duration = 60

        # 生成缓存键
        cache_key = f'ai_text_rate_limit_{user_identifier}_{request.path}'

        # 获取当前请求时间
        current_time = time.time()

        # 获取缓存中的请求记录
        request_times = cache.get(cache_key, [])

        # 删除超过时间窗口的请求记录
        request_times = [t for t in request_times if current_time - t < duration]

        # 检查请求次数是否超过限制
        if len(request_times) >= num_requests:
            return JsonResponse({'status':False,'data':'已超过请求频率限制，请稍后再使用！'})

        # 添加当前请求时间到记录中
        request_times.append(current_time)

        # 更新缓存
        cache.set(cache_key, request_times, duration)

        # 调用原始视图函数
        return view_func(request, *args, **kwargs)

    return wrapped_view



# Create your views here.
# 后台管理 - 站点管理 - AI接入设置
@superuser_only
def ai_config(request):
    if request.method == 'GET':
        ai_frames = [
            {'name':'Dify','value':'1', 'status':True},
            # {'name': 'FastGPT', 'value': '2', 'status':False},
        ]

        return render(request,'app_ai/config.html',locals())
    elif request.method == 'POST':
        try:
            data = request.POST.get("data")
            data_json = json.loads(data)
            # print(data_json)
            for d in data_json:
                # print(d)
                if d['type'] == 'ai':
                    if d['name'] in ['ai_dify_chat_api_key','ai_dify_dataset_api_key','ai_dify_textgenerate_api_key']:
                        d['value'] = encrypt_data(d['value'])
                    SysSetting.objects.update_or_create(
                        name=d['name'],
                        defaults={'value': d['value'], 'types': 'ai'}
                    )
                else:
                    pass
            return JsonResponse({'code': 0, })
        except Exception as e:
            logger.exception("保存AI配置异常")
            return JsonResponse({'code',4})

# AI文本写作
@csrf_exempt
@login_required
@dynamic_rate_limit
def ai_text_genarate(request):
    def event_stream():
        ai_frame = getattr(SysSetting.objects.filter(types='ai', name='ai_frame').first(), 'value', '')
        if ai_frame == '1':  # Dify
            dify_api_address = getattr(SysSetting.objects.filter(types='ai', name='ai_dify_api_address').first(),
                                       'value',
                                       '')
            dify_textgenerate_key = getattr(
                SysSetting.objects.filter(types='ai', name='ai_dify_textgenerate_api_key').first(),
                'value', '')

            dify_textgenerate_rate_limit = getattr(
                SysSetting.objects.filter(types='ai', name='ai_dify_textgenerate_rate_limit').first(),
                'value', 0)

            # 构造Dify请求头
            headers = {
                'Authorization': 'Bearer {api_key}'.format(api_key=decrypt_data(dify_textgenerate_key)),
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            }

            # 获取用户消息
            user_input = json.loads(request.body)['inputs']['query']

            try:
                # 发起流式请求
                with requests.post(
                        f'{dify_api_address}/completion-messages',
                        headers=headers,
                        data=json.dumps({
                            'inputs':{'query':user_input},
                            'response_mode':'streaming',
                            'user':request.user.username
                        }),
                        stream=True
                ) as r:
                    r.raise_for_status()

                    # 转发数据流
                    for chunk in r.iter_content(chunk_size=None):
                        if chunk:
                            yield chunk
                            # yield f"data: {chunk.decode('utf-8')}\n\n"

            except Exception as e:
                yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"

    return StreamingHttpResponse(
        event_stream(),
        content_type='text/event-stream',
        headers={'X-Accel-Buffering': 'no'}  # 禁用Nginx缓冲
    )

