# coding:utf-8
# 文档自定义模板过滤器
from app_doc.models import *
from django import template
from django.utils.translation import gettext_lazy as _

register = template.Library()


# 获取文集下的文档数量
@register.filter(name='get_doc_count')
def get_doc_count(value):
    return Doc.objects.filter(top_doc=int(value),status=1).count()

# 获取文集下最新的文档及其修改时间
@register.filter(name='get_new_doc')
def get_new_doc(value):
    new_doc = Doc.objects.filter(top_doc=int(value),status=1).order_by('-modify_time')[:3]
    if new_doc is None:
        new_doc = _('它还没有文档……')
    return new_doc

# 获取文集的EPUB开放导出状态
@register.filter(name='report_status_epub')
def get_report_status_epub(value):
    try:
        project = Project.objects.get(id=int(value))
        status = ProjectReport.objects.get(project=project).allow_epub
    except Exception as e:
        # print(repr(e))
        status = 0
    return status

# 获取文集的PDF开放导出状态
@register.filter(name='report_status_pdf')
def get_report_status_pdf(value):
    try:
        project = Project.objects.get(id=int(value))
        status = ProjectReport.objects.get(project=project).allow_pdf
    except Exception as e:
        # print(repr(e))
        status = 0
    return status

# 获取图片分组的图片数量
@register.filter(name='img_group_cnt')
def get_img_group_cnt(value):
    cnt = Image.objects.filter(group_id=value).count()
    return cnt

# 获取文集的协作用户数
@register.filter(name='project_collaborator_cnt')
def get_project_collaborator_cnt(value):
    cnt = ProjectCollaborator.objects.filter(project=value).count()
    return cnt

# 获取标签的文档数量
@register.filter(name='tag_doc_cnt')
def get_img_group_cnt(value):
    cnt = DocTag.objects.filter(tag=value).count()
    return cnt