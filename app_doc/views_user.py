# coding:utf-8
# @文件: views_user.py
# @创建者：州的先生
# #日期：2020/11/7
# 博客地址：zmister.com
from django.shortcuts import render,redirect
from django.http.response import JsonResponse,Http404,HttpResponseNotAllowed,HttpResponse
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from django.views.decorators.http import require_http_methods,require_GET,require_POST # 视图请求方法装饰器
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage,InvalidPage # 后端分页
from django.core.exceptions import PermissionDenied,ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from app_doc.models import Project,Doc,DocTemp
from django.contrib.auth.models import User
from django.db.models import Q
from django.db import transaction
from django.urls import reverse
from loguru import logger
from app_doc.report_utils import *
from app_admin.models import UserOptions,SysSetting
from app_admin.decorators import check_headers,allow_report_file
import datetime
import traceback
import re
import json
import random
import os.path
import base64
import hashlib


# 个人中心
@login_required()
def user_center(request):
    return render(request,'app_doc/user/user_center.html',locals())


# 个人中心菜单
def user_center_menu(request):
    menu_data = [
        {
            "id": 1,
            "title": _("我的概览"),
            "type": 1,
            "icon": "layui-icon layui-icon-console",
            "href": reverse('manage_overview'),
        },
        {
            "id": "my_project",
            "title": _("我的文集"),
            "icon": "layui-icon layui-icon-component",
            "type": 0,
            "href": "",
            "children": [
                {
                    "id": "manage_project",
                    "title": _("文集管理"),
                    "icon": "layui-icon layui-icon-console",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse('manage_project')
                },
                {
                    "id": "manage_colla_self",
                    "title": _("我的协作"),
                    "icon": "layui-icon layui-icon-console",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse('manage_pro_colla_self')
                },
                {
                    "id": "import_project",
                    "title": _("导入文集"),
                    "icon": "layui-icon layui-icon-console",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse('import_project')
                },
            ]
        },
        {
            "id": "my_doc",
            "title": _("我的文档"),
            "icon": "layui-icon layui-icon-file-b",
            "type": 0,
            "href": "",
            "children": [
                {
                    "id": "doc_manage",
                    "title": _("文档管理"),
                    "icon": "layui-icon layui-icon-face-smile",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse("manage_doc")
                },
                {
                    "id": "doc_template",
                    "title": _("文档模板"),
                    "icon": "layui-icon layui-icon-face-cry",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse("manage_doctemp")
                },
                {
                    "id": "doc_tag",
                    "title": _("文档标签"),
                    "icon": "layui-icon layui-icon-face-cry",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse("manage_doc_tag")
                },
                {
                    "id": "doc_share",
                    "title": _("我的分享"),
                    "icon": "layui-icon layui-icon-face-cry",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse("manage_doc_share")
                },
                {
                    "id": "doc_recycle",
                    "title": _("文档回收站"),
                    "icon": "layui-icon layui-icon-face-cry",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse("doc_recycle")
                }
            ]
        },
        {
            "id": "my_fodder",
            "title": _("我的素材"),
            "icon": "layui-icon layui-icon-upload-drag",
            "type": 0,
            "href": "",
            "children": [
                {
                    "id": "my_img",
                    "title": _("我的图片"),
                    "icon": "layui-icon layui-icon-face-smile",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse("manage_image")
                },
                {
                    "id": "my_attachment",
                    "title": _("我的附件"),
                    "icon": "layui-icon layui-icon-face-cry",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse("manage_attachment")
                },
            ]
        },
        {
            "id": "my_collect",
            "title": _("我的收藏"),
            "icon": "layui-icon layui-icon-star",
            "type": 1,
            "openType": "_iframe",
            "href": reverse("manage_collect")
        },
        {
            "id": "self_settings",
            "title": _("个人管理"),
            "icon": "layui-icon layui-icon-set-fill",
            "type": 0,
            "href": "",
            "children": [
                {
                    "id": 601,
                    "title": _("个人设置"),
                    "icon": "layui-icon layui-icon-face-smile",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse("manage_self")
                },
                {
                    "id": 602,
                    "title": _("Token管理"),
                    "icon": "layui-icon layui-icon-face-cry",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse("manage_token")
                },
            ]
        },
        {
            "id": "user_manual",
            "title": _("使用手册"),
            "icon": "layui-icon layui-icon-template-1",
            "type": 1,
            "openType": "_blank",
            "href": "https://doc.mrdoc.pro/project-54/",
        }
        # {
        #     "id": "common",
        #     "title": "使用帮助",
        #     "icon": "layui-icon layui-icon-template-1",
        #     "type": 0,
        #     "href": "",
        #     "children": [{
        #         "id": 701,
        #         "title": "安装说明",
        #         "icon": "layui-icon layui-icon-face-smile",
        #         "type": 1,
        #         "openType": "_iframe",
        #         "href": "http://mrdoc.zmister.com/project-7/"
        #     }, {
        #         "id": 702,
        #         "title": "使用说明",
        #         "icon": "layui-icon layui-icon-face-smile",
        #         "type": 1,
        #         "openType": "_iframe",
        #         "href": "http://mrdoc.zmister.com/project-54/"
        #     }]
        # }
    ]
    return JsonResponse(menu_data,safe=False)
