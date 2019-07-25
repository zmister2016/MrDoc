# coding:utf-8
# 文档自定义模板过滤器
from app_doc.models import *
from django import template

register = template.Library()


# 获取文集下的文档数量
@register.filter(name='get_doc_count')
def get_doc_count(value):
    return Doc.objects.filter(top_doc=int(value)).count()
