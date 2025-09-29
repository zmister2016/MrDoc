# coding:utf-8

from django.urls import path,include,re_path
from django.conf import settings
from app_ai import views

urlpatterns = [
    path('config/',views.ai_config,name="ai_config"), # AI配置页面
    path('text_generate/',views.ai_text_genarate,name="ai_text_genarate"), # AI文本生成
]