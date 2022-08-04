# coding:utf-8
# @文件: import_views.py
# @创建者：州的先生
# #日期：2020/6/17
# 博客地址：zmister.com
# 文集导入相关视图函数

from django.shortcuts import render,redirect
from django.http.response import JsonResponse,Http404,HttpResponseNotAllowed,HttpResponse
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from django.views.decorators.http import require_http_methods,require_GET,require_POST # 视图请求方法装饰器
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage,InvalidPage # 后端分页
from django.core.exceptions import PermissionDenied,ObjectDoesNotExist
from app_doc.models import Project,Doc,DocTemp
from django.contrib.auth.models import User
from django.db.models import Q
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from rest_framework.views import APIView # 视图
from rest_framework.response import Response # 响应
from rest_framework.pagination import PageNumberPagination # 分页
from rest_framework.authentication import SessionAuthentication # 认证
from rest_framework.permissions import IsAdminUser # 权限
from loguru import logger
from app_doc.report_utils import *
from app_admin.decorators import check_headers,allow_report_file
from app_doc.import_utils import *
from app_doc.views import get_pro_toc,html_filter,jsonXssFilter
from app_api.auth_app import AppAuth,AppMustAuth # 自定义认证
import datetime
import traceback
import re
import os.path
import json


# 导入文集
@login_required()
@require_http_methods(['GET','POST'])
def import_project(request):
    if request.method == 'GET':
        return render(request,'app_doc/manage/manage_project_import.html',locals())
    elif request.method == 'POST':
        file_type = request.POST.get('type',None)
        # 上传Zip压缩文件
        if file_type == 'zip':
            import_file = request.FILES.get('import_file',None)
            if import_file:
                file_name = import_file.name
                # 限制文件大小在50mb以内
                if import_file.size > 52428800:
                    return JsonResponse({'status': False, 'data': _('文件大小超出限制')})
                # 限制文件格式为.zip
                if file_name.endswith('.zip'):
                    if os.path.exists(os.path.join(settings.MEDIA_ROOT,'import_temp')) is False:
                        os.mkdir(os.path.join(settings.MEDIA_ROOT,'import_temp'))
                    temp_file_name = datetime.datetime.now().strftime('%Y%m%d%H%M%S%f') +'.zip'
                    temp_file_path = os.path.join(settings.MEDIA_ROOT,'import_temp/'+temp_file_name)
                    with open(temp_file_path,'wb+') as zip_file:
                        for chunk in import_file:
                            zip_file.write(chunk)
                    if os.path.exists(temp_file_path):
                        import_file = ImportZipProject()
                        project = import_file.read_zip(temp_file_path,request.user) # 返回文集id或None
                        if project:
                            pro = Project.objects.get(id=project)
                            docs = Doc.objects.filter(top_doc=project).values_list('id','name')
                            # 查询存在上级文档的文档
                            parent_id_list = Doc.objects.filter(top_doc=project).exclude(
                                parent_doc=0).values_list('parent_doc', flat=True)
                            # 获取存在上级文档的上级文档ID
                            doc_list = []
                            # 获取一级文档
                            top_docs = Doc.objects.filter(
                                top_doc=project,
                                parent_doc=0).values('id','name').order_by('sort')
                            for doc in top_docs:
                                top_item = {
                                    'id': doc['id'],
                                    'field': doc['name'],
                                    'title': doc['name'],
                                    'spread': True,
                                    'level': 1
                                }
                                # 如果一级文档存在下级文档，查询其二级文档
                                if doc['id'] in parent_id_list:
                                    sec_docs = Doc.objects.filter(
                                        top_doc=project,
                                        parent_doc=doc['id']).values('id','name').order_by('sort')
                                    top_item['children'] = []
                                    for doc in sec_docs:
                                        sec_item = {
                                            'id': doc['id'],
                                            'field': doc['name'],
                                            'title': doc['name'],
                                            'level': 2
                                        }
                                        # 如果二级文档存在下级文档，查询第三级文档
                                        if doc['id'] in parent_id_list:
                                            thr_docs = Doc.objects.filter(
                                                top_doc=project,
                                                parent_doc=doc['id'],).values('id','name').order_by('sort')
                                            sec_item['children'] = []
                                            for doc in thr_docs:
                                                item = {
                                                    'id': doc['id'],
                                                    'field': doc['name'],
                                                    'title': doc['name'],
                                                    'level': 3
                                                }
                                                sec_item['children'].append(item)
                                            top_item['children'].append(sec_item)
                                        else:
                                            top_item['children'].append(sec_item)
                                    doc_list.append(top_item)
                                # 如果一级文档没有下级文档，直接保存
                                else:
                                    doc_list.append(top_item)

                            return JsonResponse({
                                'status':True,
                                'data':doc_list,
                                'project':{
                                    'id':project,
                                    'name':pro.name,
                                    'desc':pro.intro
                                }
                            })
                        else:
                            return JsonResponse({'status':False,'data':_('上传失败')})
                    else:
                        return JsonResponse({'status':False,'data':_('上传失败')})
                else:
                    return JsonResponse({'status':False,'data':_('仅支持.zip格式')})
            else:
                return JsonResponse({'status':False,'data':_('无有效文件')})
        else:
            return JsonResponse({'status':False,'data':_('参数错误')})


# 导入本地文档到文集
@login_required()
@require_http_methods(['GET','POST'])
def import_local_doc_to_project(request):
    if request.method == 'GET':
        project_list = Project.objects.filter(create_user=request.user)  # 自己创建的文集列表
        colla_project_list = ProjectCollaborator.objects.filter(user=request.user)  # 协作的文集列表
        return render(request,'app_doc/manage/import_local_doc_to_project.html',locals())


# 导入文档到文集API
class ImportLocalDoc(APIView):
    authentication_classes = [SessionAuthentication, AppMustAuth]

    # 上传文件
    def post(self,request):
        project = request.data.get("project",'')
        editor_mode = request.data.get("editor_mode",0)
        file = request.data.get("local_doc",None)
        try:
            project = int(project)
            editor_mode = int(editor_mode)
        except:
            resp = {
                'code':5,
                'data':'必须选择文集'
            }
            return Response(resp)
        if file is None:
            resp = {
                'code':5,
                'data':'文件未选择'
            }
        file_name = file.name
        # Markdown 文件和 TXT 文件
        if file_name.endswith('.md') or file_name.endswith(".txt"):
            doc_content = file.read().decode('utf-8')
            if editor_mode == 3:
                doc_content_html = markdown.markdown(text=doc_content)
            else:
                doc_content_html = None
            doc = Doc.objects.create(
                name = html_filter('.'.join(file_name.split('.')[:-1])),
                pre_content = doc_content,
                content = doc_content_html,
                top_doc = project,
                editor_mode = 1 if editor_mode == 0 else editor_mode,
                create_user = request.user,
                status = 0
            )
            doc.save()
            resp = {
                'code':0,
                'data':{
                    'doc_id':doc.id,
                    'doc_name':doc.name
                }
            }
        # Word 文件
        elif file_name.endswith('.docx'):
            if os.path.exists(os.path.join(settings.MEDIA_ROOT, 'import_temp')) is False:
                os.mkdir(os.path.join(settings.MEDIA_ROOT, 'import_temp'))

            temp_file_name = str(time.time()) + '.docx'
            temp_file_path = os.path.join(settings.MEDIA_ROOT, 'import_temp/' + temp_file_name)
            with open(temp_file_path, 'wb+') as docx_file:
                for chunk in file:
                    docx_file.write(chunk)
            if os.path.exists(temp_file_path):
                docx_file_content = ImportDocxDoc(
                    docx_file_path=temp_file_path,
                    editor_mode=editor_mode,
                    create_user=request.user
                ).run()
                if docx_file_content['status']:
                    doc = Doc.objects.create(
                        name=html_filter(file_name[:-5]),
                        pre_content=docx_file_content['data'],
                        content=docx_file_content['data'],
                        top_doc=project,
                        editor_mode=1 if editor_mode == 0 else editor_mode,
                        create_user=request.user,
                        status=0
                    )
                    doc.save()
                    resp = {
                        'code': 0,
                        'data': {
                            'doc_id': doc.id,
                            'doc_name': doc.name
                        }
                    }
                else:
                    resp = {
                        'code':4,
                        'data': '{}读取失败'.format(file_name)
                    }
            else:
                resp = {
                    'code': 4,
                    'data': '{}上传失败'.format(file_name)
                }
        else:
            resp = {
                'code':5,
                'data':'文件格式不支持'
            }
        return Response(resp)

    # 发布文档
    def put(self,request):
        sort_data = request.data.get('sort_data', '[]')  # 文档排序列表
        try:
            sort_data = json.loads(sort_data)
        except Exception:
            return JsonResponse({'code': 5, 'data': _('文档参数错误')})
        # 文档排序
        n = 10
        # 第一级文档
        for data in sort_data:
            Doc.objects.filter(id=data['id']).update(sort=n, status=1)
            n += 10
            # 存在第二级文档
            if 'children' in data.keys():
                n1 = 10
                for c1 in data['children']:
                    Doc.objects.filter(id=c1['id']).update(sort=n1, parent_doc=data['id'], status=1)
                    n1 += 10
                    # 存在第三级文档
                    if 'children' in c1.keys():
                        n2 = 10
                        for c2 in c1['children']:
                            Doc.objects.filter(id=c2['id']).update(sort=n2, parent_doc=c1['id'], status=1)

        return Response({'code':0,'data':'ok'})



# 文集文档排序
@login_required()
@require_http_methods(['POST'])
def project_doc_sort(request):
    project_id = request.POST.get('pid',None) # 文集ID
    title = request.POST.get('title',None) # 文集名称
    desc = request.POST.get('desc',None) # 文集简介
    role = request.POST.get('role',1) # 文集权限
    sort_data = request.POST.get('sort_data','[]') # 文档排序列表
    doc_status = request.POST.get('status',0) # 文档状态
    # print(sort_data)
    try:
        sort_data = json.loads(sort_data)
    except Exception:
        return JsonResponse({'status':False,'data':_('文档参数错误')})

    try:
        Project.objects.get(id=project_id,create_user=request.user)
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':_('没有匹配的文集')})

    # 修改文集信息
    Project.objects.filter(id=project_id).update(
        name = title,
        intro = desc,
        role = role
    )
    # 文档排序
    n = 10
    # 第一级文档
    for data in sort_data:
        Doc.objects.filter(id=data['id']).update(sort = n,status=doc_status)
        n += 10
        # 存在第二级文档
        if 'children' in data.keys():
            n1 = 10
            for c1 in data['children']:
                Doc.objects.filter(id=c1['id']).update(sort = n1,parent_doc=data['id'],status=doc_status)
                n1 += 10
                # 存在第三级文档
                if 'children' in c1.keys():
                    n2 = 10
                    for c2 in c1['children']:
                        Doc.objects.filter(id=c2['id']).update(sort=n2,parent_doc=c1['id'],status=doc_status)

    return JsonResponse({'status':True,'data':'ok'})


# 导入docx文档
@login_required()
@csrf_exempt
@require_POST
def import_doc_docx(request):
    file_type = request.POST.get('type', None)
    editor_mode = request.POST.get('editor_mode',1)
    # 上传Zip压缩文件
    if file_type == 'docx':
        import_file = request.FILES.get('import_doc_docx', None)
        if import_file:
            file_name = import_file.name
            # 限制文件大小在50mb以内
            if import_file.size > 52428800:
                return JsonResponse({'status': False, 'data': _('文件大小超出限制')})
            # 限制文件格式为.zip
            if file_name.endswith('.docx'):
                if os.path.exists(os.path.join(settings.MEDIA_ROOT, 'import_temp')) is False:
                    os.mkdir(os.path.join(settings.MEDIA_ROOT, 'import_temp'))

                temp_file_name = str(time.time()) + '.docx'
                temp_file_path = os.path.join(settings.MEDIA_ROOT, 'import_temp/' + temp_file_name)
                with open(temp_file_path, 'wb+') as docx_file:
                    for chunk in import_file:
                        docx_file.write(chunk)
                if os.path.exists(temp_file_path):
                    import_file = ImportDocxDoc(
                        docx_file_path=temp_file_path,
                        editor_mode=editor_mode,
                        create_user=request.user
                    ).run()
                    return JsonResponse(import_file)
                else:
                    return JsonResponse({'status': False, 'data': _('上传失败')})
            else:
                return JsonResponse({'status': False, 'data': _('仅支持.docx格式')})
        else:
            return JsonResponse({'status': False, 'data': _('无有效文件')})
    else:
        return JsonResponse({'status': False, 'data': _('参数错误')})