# coding:utf-8
# 用户可访问范围工具：供 AI 知识库检索（rag_search）按权限过滤文集/文档

from django.utils.translation import gettext_lazy as _

from app_doc.models import Project, ProjectCollaborator


def get_user_access_scope(user):
    """
    获取用户可访问的文集范围：
    - 公开文集（role=0）
    - 自己创建的文集
    - 自己参与的协作文集

    :return: {"project_ids": [...], "doc_ids": []}，doc_ids 预留（空列表表示不额外限定文档）
    """
    project_ids = set(
        Project.objects.filter(role=0).values_list('id', flat=True)
    )
    project_ids |= set(
        Project.objects.filter(create_user=user).values_list('id', flat=True)
    )
    project_ids |= set(
        ProjectCollaborator.objects.filter(user=user).values_list('project_id', flat=True)
    )
    return {
        'project_ids': list(project_ids),
        'doc_ids': [],
    }
