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

    def __init__(self,pro):
        self.pro = pro

    def items(self):
        return Doc.objects.filter(status=1,top_doc=self.pro)

    def lastmod(self,obj):
        return obj.modify_time

def all_sitemaps():
    all_sitemap = {}
    all_sitemap['home'] = HomeSitemap()
    all_project = ProjectSitemap()
    # print("所有文集：",all_project.items())
    for project in all_project.items():
    # for project in Project.objects.filter(role=0):
        info_dict = {
            'queryset': Doc.objects.filter(status=1,top_doc=project.id),
        }
        # sitemap = GenericSitemap(info_dict,priority=0.6)
        sitemap = DocSitemap(pro=project.id)
        all_sitemap[str(project.id)] = sitemap
    # print(all_sitemaps)
    return all_sitemap