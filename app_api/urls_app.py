# coding:utf-8
# @文件: urls_app.py
# @创建者：州的先生
# #日期：2020/5/11
# 博客地址：zmister.com
from django.urls import path,re_path
from app_api import views_app

urlpatterns = [
    path('login/',views_app.LoginView.as_view()),# 登录
    path('projects/',views_app.ProjectView.as_view()), # 文集
    path('docs/',views_app.DocView.as_view()), # 文档
    path('doctemps/',views_app.DocTempView.as_view()), # 文档模板
    path('images/',views_app.ImageView.as_view()), # 图片
    path('imggroups/',views_app.ImageGroupView.as_view()), # 图片分组
    path('attachments/',views_app.AttachmentView.as_view()), # 附件
]