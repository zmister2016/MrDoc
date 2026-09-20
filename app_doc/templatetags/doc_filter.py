# coding:utf-8
# 文档自定义模板过滤器

from django import template
from django.utils.translation import gettext_lazy as _
from django.utils.html import strip_tags
from django.urls import reverse
from app_doc.models import *
import re
import markdown

register = template.Library()

# 获取文档URL
@register.filter
def doc_url(doc):
    # 统一获取属性的方法
    def get_attr(obj, key, default=None):
        if isinstance(obj, dict):
            return obj.get(key, default)
        return getattr(obj, key, default)

    editor_mode = get_attr(doc, 'editor_mode')

    # 特殊类型直接返回
    if editor_mode == 5:
        return get_attr(doc, 'pre_content')

    alias = get_attr(doc, 'alias')
    if alias:
        return reverse("doc_alias", kwargs={"alias": alias})

    doc_id = get_attr(doc, 'id')
    if doc_id is not None:
        return reverse("doc_id", kwargs={"doc_id": doc_id})

    return ''

# 获取文档的子文档
@register.filter(name='get_next_doc')
def get_next_doc(value):
    data = Doc.objects.filter(parent_doc=value,status=1).values('id','name').order_by('sort')
    return data

# 获取文档的所属文集
@register.filter(name='get_doc_top')
def get_doc_top(value):
    try:
        return Project.objects.get(id=int(value))
    except Exception:
        return ''

# 获取用户是否为文集创建者
@register.filter(name='is_colla_pro')
def is_colla_pro(pro,user):
    p = Project.objects.filter(id=pro,create_user=user)
    if p.exists():
        return ''
    else:
        return _('【协作】')

# 获取文档的上级文档名称
@register.filter(name='get_doc_parent')
def get_doc_parent(value):
    if int(value) != 0:
        try:
            data = Doc.objects.get(id=int(value))
        except:
            data = _('无上级文档')
        return data
    else:
        return _('无上级文档')

# 获取文档的下一篇文档
@register.filter(name='get_doc_next')
def get_doc_next(value):
    # 复用不限层级的下一篇文档查找逻辑
    from app_doc.utils import find_doc_next
    next_doc = find_doc_next(value)
    return next_doc.id if next_doc else None

# 获取文档的上一篇文档
@register.filter(name='get_doc_previous')
def get_doc_previous(value):
    # 复用不限层级的上一篇文档查找逻辑
    from app_doc.utils import find_doc_previous
    previous_doc = find_doc_previous(value)
    return previous_doc.id if previous_doc else None


# 获取内容的关键词上下文
@register.filter(name='get_key_context')
def get_key_context(value,args):
    # print(value,args)
    # re_result = re.findall(args, value, flags=re.IGNORECASE)
    value = value.replace('\n','') if value is not None else ''
    p = re.compile(args,flags=re.IGNORECASE)
    value_list = []
    for m in p.finditer(value):
        # print(value,m,m.start(),m.group(),)
        # print( m.start(), m.group())
        start_point = m.start() - 20
        if start_point < 0:
            start_point = 0
        end_point = m.end()+20
        # print(start_point,end_point)
        # print(value[start_point:end_point])
        value_list.append(value[start_point:end_point])
    # print(value_list)
    if len(value_list) > 0:
        r = "…".join(value_list)
        if len(r) > 200:
            r = r[0:200]
    else:
        r = value[0:200]
    return r

# 摘取文档部分正文
@register.filter(name='remove_doc_tag')
def remove_doc_tag(doc):
    try:
        if doc.editor_mode == 3: # 富文本文档
            result = strip_tags(doc.content)[:300]
        else: # 其他文档
            result = strip_tags(markdown.markdown(doc.pre_content))[:300]
    except Exception as e:
        result = doc.pre_content[:300]
    result = result.replace("&nbsp;",'')
    return result