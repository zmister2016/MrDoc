# coding:utf-8
# @文件: urls.py
# @创建者：州的先生
# #日期：2020/3/22
# 博客地址：zmister.com
from django.urls import path,re_path
from app_api import views

urlpatterns = [
    path('manage_token/',views.manage_token,name='manage_token'),# 用户Token管理
    path('get_projects/',views.get_projects,name="api_get_projects"), # 获取文集列表
    path('create_doc/',views.create_doc,name="api_create_doc"), # 新建文档
    path('upload_img/',views.upload_img,name="api_upload_img"), # 粘贴上传文件
]