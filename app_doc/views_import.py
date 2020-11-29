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
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage,InvalidPage # 后端分页
from django.core.exceptions import PermissionDenied,ObjectDoesNotExist
from app_doc.models import Project,Doc,DocTemp
from django.contrib.auth.models import User
from django.db.models import Q
from django.db import transaction
from loguru import logger
import datetime
import traceback
import re
from app_doc.report_utils import *
from app_admin.decorators import check_headers,allow_report_file
import os.path
import json
from app_doc.import_utils import *

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
                    return JsonResponse({'status': False, 'data': '文件大小超出限制'})
                # 限制文件格式为.zip
                if file_name.endswith('.zip'):
                    if os.path.exists(os.path.join(settings.MEDIA_ROOT,'import_temp')) is False:
                        os.mkdir(os.path.join(settings.MEDIA_ROOT,'import_temp'))
                    temp_file_name = str(time.time())+'.zip'
                    temp_file_path = os.path.join(settings.MEDIA_ROOT,'import_temp/'+temp_file_name)
                    with open(temp_file_path,'wb+') as zip_file:
                        for chunk in import_file:
                            zip_file.write(chunk)
                    if os.path.exists(temp_file_path):
                        import_file = ImportZipProject()
                        project = import_file.read_zip(temp_file_path,request.user)
                        if project:
                            docs = Doc.objects.filter(top_doc=project).values_list('id','name')
                            doc_list = [doc for doc in docs]
                            return JsonResponse({'status':True,'data':doc_list,'id':project})
                        else:
                            return JsonResponse({'status':False,'data':'上传失败'})
                    else:
                        return JsonResponse({'status':False,'data':'上传失败'})
                else:
                    return JsonResponse({'status':False,'data':'仅支持.zip格式'})
            else:
                return JsonResponse({'status':False,'data':'无有效文件'})
        else:
            return JsonResponse({'status':False,'data':'参数错误'})


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
        return JsonResponse({'status':False,'data':'文档参数错误'})

    try:
        Project.objects.get(id=project_id,create_user=request.user)
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':'没有匹配的文集'})

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
