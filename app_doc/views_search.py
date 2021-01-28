# coding:utf-8
# @文件: views_search.py
# @创建者：州的先生
# #日期：2020/11/22
# 博客地址：zmister.com


# from haystack.generic_views import SearchView
from django.db.models import Q
from haystack.views import SearchView
from haystack.query import SearchQuerySet
from app_doc.models import *
import datetime

# 文档搜索 - 基于Haystack全文搜索
class DocSearchView(SearchView):
    results_per_page = 10

    def __call__(self, request):
        self.request = request
        date_type = self.request.GET.get('d_type', 'recent')
        date_range = self.request.GET.get('d_range', 'all')  # 时间范围，默认不限，all

        # 处理时间范围
        if date_type == 'recent':
            if date_range == 'recent1':  # 最近1天
                start_date = datetime.datetime.now() - datetime.timedelta(days=1)
            elif date_range == 'recent7':  # 最近7天
                start_date = datetime.datetime.now() - datetime.timedelta(days=7)
            elif date_range == 'recent30':  # 最近30天
                start_date = datetime.datetime.now() - datetime.timedelta(days=30)
            elif date_range == 'recent365':  # 最近一年
                start_date = datetime.datetime.now() - datetime.timedelta(days=365)
            else:
                start_date = datetime.datetime.strptime('1900-01-01', '%Y-%m-%d')
            end_date = datetime.datetime.now()
        elif date_type == 'day':
            try:
                date_list = date_range.split('|')
                start_date = datetime.datetime.strptime(date_list[0], '%Y-%m-%d')
                end_date = datetime.datetime.strptime(date_list[1], '%Y-%m-%d')
            except:
                start_date = datetime.datetime.now() - datetime.timedelta(days=1)
                end_date = datetime.datetime.now()

        # 是否时间筛选
        if date_range == 'all':
            is_date_range = False
        else:
            is_date_range = True

        # 是否认证
        if self.request.user.is_authenticated:
            is_auth = True
        else:
            is_auth = False

        # 获取可搜索的文集列表
        if is_auth:
            colla_list = [i.project.id for i in
                          ProjectCollaborator.objects.filter(user=self.request.user)]  # 用户的协作文集
            open_list = [i.id for i in Project.objects.filter(
                Q(role=0) | Q(create_user=self.request.user)
            )]  # 公开文集

            view_list = list(set(open_list).union(set(colla_list)))  # 合并上述两个文集ID列表
        else:
            view_list = [i.id for i in Project.objects.filter(role=0)] # 公开文集
        if len(view_list) > 0:
            sqs = SearchQuerySet().filter(
                top_doc__in=view_list
            ).filter(
                modify_time__gte=start_date,
                modify_time__lte=end_date).order_by('-modify_time')
        else:
            sqs = SearchQuerySet().filter(
                top_doc__in=None
            ).filter(
                modify_time__gte=start_date,
                modify_time__lte=end_date).order_by('-modify_time')
        self.form = self.build_form(form_kwargs={'searchqueryset': sqs})
        self.query = self.get_query().replace("\n",'').replace("\r",'')
        self.results = self.get_results()
        return self.create_response()

    def extra_context(self):
        context = {
            'date_range':self.request.GET.get('d_range', 'all')
        }
        return context




