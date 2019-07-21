# coding:utf-8
# 文档自定义模板过滤器
from app_doc.models import *
from django import template

register = template.Library()

# 获取文档的子文档
@register.filter(name='get_next_doc')
def get_next_doc(value):
    return Doc.objects.filter(parent_doc=value)