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

sitemaps = SitemapAll()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('app_doc.urls')),
    path('user/',include('app_admin.urls'),),
    re_path('^static/(?P<path>.*)$',serve,{'document_root':settings.STATIC_ROOT}),# 静态文件
    re_path('^media/(?P<path>.*)$',serve,{'document_root':settings.MEDIA_ROOT}),# 媒体文件
    path('sitemap.xml', views.index, {'sitemaps': sitemaps,'template_name':'sitemap/sitemap-index.xml'},name='sitemap',), # 站点地图索引
    path('sitemap-<section>.xml', views.sitemap, {'sitemaps': sitemaps,'template_name':'sitemap/sitemap.xml'}, # 站点地图
         name='django.contrib.sitemaps.views.sitemap')
]
