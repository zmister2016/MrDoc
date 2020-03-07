# coding:utf-8
# 文档自定义模板过滤器
from app_doc.models import *
from django import template

register = template.Library()


# 获取文集下的文档数量
@register.filter(name='get_doc_count')
def get_doc_count(value):
    return Doc.objects.filter(top_doc=int(value)).count()

# 获取文集下最新的文档及其修改时间
@register.filter(name='get_new_doc')
def get_new_doc(value):
    new_doc = Doc.objects.filter(top_doc=int(value),status=1).order_by('-modify_time').first()
    return new_doc

# 获取文集的开放导出状态
@register.filter(name='get_report_status')
def get_report_status(value):
    try:
        project = Project.objects.get(id=int(value))
        status = ProjectReport.objects.get(project=project).allow_epub
    except Exception as e:
        # print(repr(e))
        status = 0
    return status
