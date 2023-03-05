from app_doc.models import Doc,Project

# 查找文档的下级文档
def find_doc_next(doc_id):
    doc = Doc.objects.get(id=int(doc_id))  # 当前文档
    # 获取文集的文档默认排序方式
    sort = Project.objects.get(id=doc.top_doc).sort_value

    # 获取文档的下级文档
    subdoc = Doc.objects.filter(parent_doc=doc.id,top_doc=doc.top_doc, status=1)

    # 如果存在子级文档，那么下一篇文档为第一篇子级文档
    if subdoc.count() != 0:
        if sort == 1:
            next_doc = subdoc.order_by('-create_time')[0]
        else:
            next_doc = subdoc.order_by('sort')[0]

    # 如果不存在子级文档
    else:
        # 获取兄弟文档
        if sort == 1:
            sibling_docs = Doc.objects.filter(parent_doc=doc.parent_doc,top_doc=doc.top_doc, status=1).order_by('-create_time')
        else:
            sibling_docs = Doc.objects.filter(parent_doc=doc.parent_doc,top_doc=doc.top_doc, status=1).order_by('sort','create_time')
        sibling_list = [d.id for d in sibling_docs]
        # 如果当前文档不是兄弟文档中的最后一个，那么下一篇文档是当前文档的下一个兄弟文档
        if sibling_list.index(doc.id) != len(sibling_list) - 1:
            next_id = sibling_list[sibling_list.index(doc.id) + 1]
            next_doc = Doc.objects.get(id=next_id)
        # 如果当前文档是兄弟文档中的最后一个，那么从上级文档中查找
        else:
            # 如果文档的上级文档为0，说明文档没有上级文档
            if doc.parent_doc == 0:
                next_doc = None
            else:
                next_doc = find_doc_parent_sibling(doc.parent_doc,sort=sort)

    return next_doc


# 查找文档的上级文档的同级文档（用于遍历获取文档的下一篇文档）
def find_doc_parent_sibling(doc_id,sort):
    doc = Doc.objects.get(id=int(doc_id))  # 当前文档

    # 获取兄弟文档
    if sort == 1:
        sibling_docs = Doc.objects.filter(parent_doc=doc.parent_doc, top_doc=doc.top_doc, status=1).order_by(
            '-create_time')
    else:
        sibling_docs = Doc.objects.filter(parent_doc=doc.parent_doc, top_doc=doc.top_doc, status=1).order_by('sort',
                                                                                                             'create_time')
    sibling_list = [d.id for d in sibling_docs]
    # 如果当前文档不是兄弟文档中的最后一个，那么下一篇文档是当前文档的下一个兄弟文档
    if sibling_list.index(doc.id) != len(sibling_list) - 1:
        next_id = sibling_list[sibling_list.index(doc.id) + 1]
        next_doc = Doc.objects.get(id=next_id)
    # 如果当前文档是兄弟文档中的最后一个，那么从上级文档中查找
    else:
        # 如果文档的上级文档为0，说明文档没有上级文档
        if doc.parent_doc == 0:
            next_doc = None
        else:
            next_doc = find_doc_parent_sibling(doc.parent_doc,sort)
    return next_doc


# 查找文档的上一篇文档
def find_doc_previous(doc_id):
    doc = Doc.objects.get(id=int(doc_id))  # 当前文档
    # 获取文集的文档默认排序方式
    sort = Project.objects.get(id=doc.top_doc).sort_value
    # 获取文档的兄弟文档
    # 获取兄弟文档
    if sort == 1:
        sibling_docs = Doc.objects.filter(parent_doc=doc.parent_doc, top_doc=doc.top_doc, status=1).order_by(
            '-create_time')
    else:
        sibling_docs = Doc.objects.filter(parent_doc=doc.parent_doc, top_doc=doc.top_doc, status=1).order_by('sort',
                                                                                                             'create_time')
    sibling_list = [d.id for d in sibling_docs]

    # 如果文档为兄弟文档的第一个，那么其上级文档即为上一篇文档
    if sibling_list.index(doc.id) == 0:
        # 如果其为顶级文档，那么没有上一篇文档
        if doc.parent_doc == 0:
            previous_doc = None
        # 如果其为次级文档，那么其上一篇文档为上级文档
        else:
            previous_doc = Doc.objects.get(id=doc.parent_doc)
    # 如果文档不为兄弟文档的第一个，从兄弟文档中查找
    else:
        previous_id = sibling_list[sibling_list.index(doc.id) - 1]
        previous_doc = find_doc_sibling_sub(previous_id,sort)

    return previous_doc


# 查找文档的最下级文档（用于遍历获取文档的上一篇文档）
def find_doc_sibling_sub(doc_id,sort):
    doc = Doc.objects.get(id=int(doc_id))  # 当前文档
    # 查询文档的下级文档
    if sort == 1:
        subdoc = Doc.objects.filter(parent_doc=doc.id, top_doc=doc.top_doc, status=1).order_by(
            '-create_time')
    else:
        subdoc = Doc.objects.filter(parent_doc=doc.id, top_doc=doc.top_doc, status=1).order_by('sort','create_time')
    subdoc_list = [d.id for d in subdoc]
    # 如果文档没有下级文档，那么返回自己
    if subdoc.count() == 0:
        previous_doc = doc
    # 如果文档存在下级文档，查找最靠后的下级文档
    else:
        previous_doc = find_doc_sibling_sub(subdoc_list[len(subdoc) - 1],sort)

    return previous_doc
