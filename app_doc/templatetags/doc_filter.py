# coding:utf-8
# 文档自定义模板过滤器
from app_doc.models import *
from django import template

register = template.Library()

# 获取文档的子文档
@register.filter(name='get_next_doc')
def get_next_doc(value):
    return Doc.objects.filter(parent_doc=value)

# 获取文档的所属文集
@register.filter(name='get_doc_top')
def get_doc_top(value):
    return Project.objects.get(id=int(value))

# 获取文档的上级文档名称
@register.filter(name='get_doc_parent')
def get_doc_parent(value):
    if int(value) != 0:
        return Doc.objects.get(id=int(value))
    else:
        return '无上级文档'