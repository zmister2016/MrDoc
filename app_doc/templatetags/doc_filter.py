# coding:utf-8
# 文档自定义模板过滤器
from app_doc.models import *
from django import template

register = template.Library()

# 获取文档的子文档
@register.filter(name='get_next_doc')
def get_next_doc(value):
    return Doc.objects.filter(parent_doc=value,status=1).order_by('sort')

# 获取文档的所属文集
@register.filter(name='get_doc_top')
def get_doc_top(value):
    return Project.objects.get(id=int(value))

# 获取用户是否为文集创建者
@register.filter(name='is_colla_pro')
def is_colla_pro(pro,user):
    p = Project.objects.filter(id=pro,create_user=user)
    if p.exists():
        return ''
    else:
        return '【协作】'

# 获取文档的上级文档名称
@register.filter(name='get_doc_parent')
def get_doc_parent(value):
    if int(value) != 0:
        return Doc.objects.get(id=int(value))
    else:
        return '无上级文档'

# 获取文档的下一篇文档
@register.filter(name='get_doc_next')
def get_doc_next(value):
    try:
        doc_id = value
        doc = Doc.objects.get(id=int(doc_id))  # 当前文档
        docs = Doc.objects.filter(parent_doc=doc.parent_doc, top_doc=doc.top_doc, status=1).order_by('sort')  # 同级所有文档
        docs_list = [d.id for d in docs]

        subdoc = Doc.objects.filter(parent_doc=doc.id,top_doc=doc.top_doc, status=1)  # 获取当前文档的所有子级文档

        # 没有下级文档
        if subdoc.count() == 0:
            # 如果文档为同级最后一个文档，则没有下一篇文档
            if docs_list.index(doc.id) == len(docs_list) - 1:
                try:
                    parentdoc = Doc.objects.get(id=doc.parent_doc)  # 获取当前文档的上级文档
                    parents = Doc.objects.filter(parent_doc=parentdoc.parent_doc, top_doc=doc.top_doc, status=1).order_by('sort')  # 获取上级文档的所有同级文档
                    parent_list = [d.id for d in parents]
                except:
                    return None
                if parent_list.index(parentdoc.id) == len(parent_list) - 1:
                    # 获取上级文档的上一级文档
                    try:
                        parentdoc2 = Doc.objects.get(id=parentdoc.parent_doc)
                        parents2 = Doc.objects.filter(parent_doc = parentdoc2.parent_doc,top_doc=parentdoc.top_doc,status=1).order_by('sort')
                        parent_list2 = [d.id for d in parents2]
                    except:
                        return None
                    if parent_list2.index(parentdoc2.id) == len(parent_list2) - 1:
                        next_doc = None
                        return next_doc
                    else:
                        next_id = parent_list2[parent_list2.index(parentdoc2.id) + 1]
                        return next_id
                else:
                    next_id = parent_list[parent_list.index(parentdoc.id) + 1]
                    return next_id
            else:
                next_id = docs_list[docs_list.index(doc.id) + 1]
                next_doc = Doc.objects.get(id=next_id)
                # print("下一篇：", next_doc.id, next_doc)
                return next_doc.id
        # 存在下级文档
        else:
            # 下一篇文档为下级第一篇文档
            next_doc = subdoc.order_by('sort')[0]
            # print("下一篇：", next_doc.id, next_doc)
            return next_doc.id
    except Exception as e:
        import traceback
        print(traceback.print_exc())

# 获取文档的上一篇文档
@register.filter(name='get_doc_previous')
def get_doc_previous(value):
    try:
        doc_id = value
        doc = Doc.objects.get(id=int(doc_id))  # 当前文档
        docs = Doc.objects.filter(parent_doc=doc.parent_doc,top_doc=doc.top_doc,status=1).order_by('sort')  # 同级所有文档
        docs_list = [d.id for d in docs]
        # 文档为同级中的第一个，
        if docs_list.index(doc.id) == 0:
            # 如果其为顶级文档，那么没有上一篇文档，
            if doc.parent_doc == 0:
                # print("无上一篇文档")
                previous = None
                return previous
            # 如果其为次级文档，那么其上一篇文档为上级文档
            else:
                previous = Doc.objects.get(id=doc.parent_doc)  # 获取
                # print("上一篇：", previous.id, previous)
                return previous.id
        # 文档为同级中的非第一个，那么上一篇为索引号的前一个文档
        else:
            previou_id = docs_list[docs_list.index(doc.id) - 1] # 获取前一个文档的ID
            previous = Doc.objects.get(id=previou_id) # 获取前一个文档
            # 查询以此文档为上级的文档
            previous_subdoc = Doc.objects.filter(parent_doc=previous.id,top_doc=doc.top_doc,status=1).order_by('-sort')
            # 如果没有文档以此文档为上级文档，那么为上一篇文档
            if previous_subdoc.count() == 0:
                return previou_id
            else:# 否则，上一篇文档为以此文档作为上级文档的文档里面的最后一篇文档
                previous = previous_subdoc[:1][0]
                parent_list = Doc.objects.filter(parent_doc=previous.id,top_doc=doc.top_doc,status=1).order_by('-sort')
                if parent_list.count() == 0:
                    return previous.id
                else:
                    previous = parent_list[:1][0]
                    return previous.id
    except Exception as e:
        import traceback
        print(traceback.print_exc())