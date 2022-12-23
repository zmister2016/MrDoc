"""MrDoc URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include,re_path
from django.views.static import serve
from django.conf import settings
from django.contrib.sitemaps import views
from app_doc.sitemaps import SitemapAll
from app_admin import views as admin_views

sitemaps = SitemapAll()

urlpatterns = [
    path('',include('app_doc.urls')), # doc应用
    path('login/', admin_views.log_in, name='login'),  # 登录
    path('logout/', admin_views.log_out, name='logout'),  # 注销
    path('register/', admin_views.register, name="register"),  # 注册
    path('check_code/', admin_views.check_code, name='check_code'),  # 注册验证码
    path('admin/',include('app_admin.urls'),), # admin应用
    path('api/',include('app_api.urls')), # 用户 Token API 接口
    path('api_app/',include('app_api.urls_app')), # RESTFUL API 接口
    # re_path('^static/(?P<path>.*)$',serve,{'document_root':settings.STATIC_ROOT}),# 静态文件
    re_path('^media/(?P<path>.*)$',serve,{'document_root':settings.MEDIA_ROOT}),# 媒体文件
]

if settings.SITEMAP:
    urlpatterns.extend([
        path('sitemap.xml', views.index, {'sitemaps': sitemaps,'template_name':'sitemap/sitemap-index.xml'},name='sitemap',), # 站点地图索引
        path('sitemap-<section>.xml', views.sitemap, {'sitemaps': sitemaps,'template_name':'sitemap/sitemap.xml'},
             name='django.contrib.sitemaps.views.sitemap'),  # 站点地图
    ])

if settings.DEBUG:
    urlpatterns.append(
        re_path('^static/(?P<path>.*)$',serve,{'document_root':settings.STATICFILES_DIR}),# 静态文件
    )
    try:
        import debug_toolbar
        urlpatterns.append(path('__debug__/', include(debug_toolbar.urls)))
    except ImportError:
        pass
else:
    urlpatterns.append(
        re_path('^static/(?P<path>.*)$',serve,{'document_root':settings.STATIC_ROOT}),# 静态文件
    )