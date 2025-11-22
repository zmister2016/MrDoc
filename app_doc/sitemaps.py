# coding:utf-8
# @文件: sitemaps.py
# @创建者：州的先生
# #日期：2020/2/26
# 博客地址：zmister.com

from django.contrib.sitemaps import Sitemap,GenericSitemap
from django.urls import reverse
from app_doc.models import Doc,Project

# 首页地图
class HomeSitemap(Sitemap):
    priority = 0.5
    changefreq = 'daily'

    def items(self):
        return ['pro_list']

    def location(self, item):
        return reverse(item)

# 文集地图
class ProjectSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8

    def items(self):
        return Project.objects.filter(role=0)

# 文档地图
class DocSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8

    def items(self):
        public_project_ids = Project.objects.filter(role=0).values_list('id', flat=True)
        return Doc.objects.filter(status=1,top_doc__in=public_project_ids)

    def lastmod(self,obj):
        return obj.modify_time


class SitemapAll():
    def __init__(self):
        self.sitemaps = {}

    def __iter__(self):
        self._generate_sitemaps_dict()
        return self.sitemaps.__iter__()

    def __getitem__(self, key):
        self._generate_sitemaps_dict()
        return self.sitemaps[key]

    def items(self):
        self._generate_sitemaps_dict()
        return self.sitemaps.items()

    def _generate_sitemaps_dict(self):
        if self.sitemaps:
            return
        self.sitemaps['home'] = HomeSitemap()
        self.sitemaps['projects'] = ProjectSitemap()
        self.sitemaps['docs'] = DocSitemap()