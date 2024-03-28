from app_doc.models import Doc,Project,ProjectCollaborator
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from urllib.parse import urlparse
from loguru import logger

# 查找文档的下级文档
def find_doc_next(doc_id):
    doc = Doc.objects.get(id=int(doc_id))  # 当前文档

    # 获取文档的下级文档
    subdoc = Doc.objects.filter(parent_doc=doc.id,top_doc=doc.top_doc, status=1)

    # 如果存在子级文档，那么下一篇文档为第一篇子级文档
    if subdoc.count() != 0:
        next_doc = subdoc.order_by('sort')[0]

    # 如果不存在子级文档，获取兄弟文档
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
                next_doc = find_doc_parent_sibling(doc.parent_doc)

    return next_doc


# 查找文档的上级文档的同级文档（用于遍历获取文档的下一篇文档）
def find_doc_parent_sibling(doc_id):
    doc = Doc.objects.get(id=int(doc_id))  # 当前文档

    # 获取兄弟文档
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
    sort = Project.objects.get(id=doc.top_doc)
    # 获取文档的兄弟文档
    # 获取兄弟文档
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

# 验证用户是否有文集的协作权限
def check_user_project_writer_role(user_id,project_id):
    if user_id == '' or project_id == '':
        return False
    try:
        user = User.objects.get(id=user_id)

        # 验证请求者是否有文集的权限
        project = Project.objects.filter(id=project_id, create_user=user)
        if project.exists():
            return True

        # 协作用户
        colla_project = ProjectCollaborator.objects.filter(project__id=project_id, user=user)
        if colla_project.exists():
            return True
        return False
    except Exception as e:
        logger.error(e)
        return False


# 验证URL的有效性，以及排除本地URL
def validate_url(url):
    try:
        validate = URLValidator()
        validate(url)
        parsed_url = urlparse(url)
        if parsed_url.hostname in ['localhost', '127.0.0.1']:
            return False
        return url
    except:
        return False