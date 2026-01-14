from app_doc.models import Project,ProjectCollaborator
from django.utils.html import strip_tags
import markdown

# 验证用户对文档是否读写授权权限
def is_edit_authorized(token, doc):
    view_list = read_add_edit_projects(token.user)
    return doc.create_user == token.user or doc.top_doc in view_list

# 用户有浏览和、新增权限的文集列表
def read_add_projects(user):
    # 用户的协作文集ID列表
    colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=user)]

    # 用户自己的文集ID列表
    self_list = [i.id for i in Project.objects.filter(create_user=user)]

    # 合并上述文集ID列表
    view_list = list(
        set(self_list)
            .union(set(colla_list))
    )
    return view_list


# 用户有浏览、新增、和修改所有文档权限的文集列表
def read_add_edit_projects(user):
    # 用户的协作文集ID列表
    colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=user,role=1)]

    # 用户自己的文集ID列表
    self_list = [i.id for i in Project.objects.filter(create_user=user)]

    # 合并上述文集ID列表
    view_list = list(
        set(self_list)
            .union(set(colla_list))
    )
    return view_list

# 摘取文档部分正文
def remove_doc_tag(doc):
    try:
        if doc.editor_mode == 3: # 富文本文档
            result = strip_tags(doc.content)[:100]
        elif doc.editor_mode == 4:
            result = "此为表格文档，进入文档查看详细内容"
        else: # 其他文档
            result = strip_tags(markdown.markdown(doc.pre_content))[:100]
    except Exception as e:
        result = doc.pre_content[:100]
    result = result.replace("&nbsp;",'')
    return result