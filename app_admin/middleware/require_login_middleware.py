# coding:utf-8
# @文件: require_login_middleware.py
# @创建者：州的先生
# #日期：2020/5/8
# 博客地址：zmister.com

from app_admin.models import SysSetting
from django.contrib.auth.decorators import login_required
import re


class RequiredLoginMiddleware():
    def __init__(self, get_response):
        self.get_response = get_response
        # 设置排除URL
        compile_tuple = (
            r'/login(.*)$', # 登录
            r'/logout(.*)$', # 注销
            r'/register(.*)$', # 注册
            r'/check_code(.*)$', # 验证码
            r'/admin/forget_pwd(.*)$',  # 忘记密码
            r'/static/(.*)$', # 静态文件
            r'/media/(.*)$',  # 媒体文件
            r'/share_doc(.*)$',  # 文档分享
            r'/api/get_projects/(.*)$', # token api 获取文集列表
            r'/api/get_docs/(.*)$',  # token api 获取文档列表
            r'/api/get_self_docs/(.*)$',  # token api 获取个人文档列表
            r'/api/get_level_docs/(.*)$',  # token api 获取文集目录
            r'/api/get_doc_previous_next/(.*)$',  # token api 获取文档上下篇文档
            r'/api/get_doc/(.*)$',  # token api 获取文档
            r'/api/create_project/(.*)$',  # token api 新建文集
            r'/api/create_doc/(.*)$',  # token api 新建文档
            r'/api/modify_doc/(.*)$',  # token api 修改文档
            r'/api/delete_doc/(.*)$',  # token api 删除文档
            r'/api/upload_img/(.*)$',  # token api 上传图片
            r'/api/upload_img_url/(.*)$',  # token api 上传URL图片
            r'/api/check_token/(.*)$',  # token api 验证
        )
        self.exceptions = tuple(re.compile(url) for url in compile_tuple)

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # 登陆用户不理会
        if request.user.is_authenticated:
            return None

        try:
            # 获取数据库的设置值
            data = SysSetting.objects.get(name='require_login').value
            # 如果设置值为on，表示开启了验证
            if data == 'on':
                is_exceptions = False
                # 遍历排除列表
                for url in self.exceptions:
                    # 如果当前url匹配到排除列表，不理会
                    if url.match(request.path):
                        # print('排除URL：',request.path)
                        is_exceptions = True
                if is_exceptions:
                    return None
                else:
                    # print("验证URL：",request.path)
                    return login_required(view_func)(request, *view_args, **view_kwargs)
            # 否则，不理会
            else:
                return None
        except:
            # 如果查询异常，说明数据库无此设置值，不理会
            return None