# coding:utf-8
from django.shortcuts import render,redirect
from django.http.response import JsonResponse,Http404,HttpResponseNotAllowed,HttpResponse
from django.http import QueryDict
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods,require_GET,require_POST # 视图请求方法装饰器
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage,InvalidPage # 后端分页
from django.core.exceptions import PermissionDenied,ObjectDoesNotExist
from django.core.serializers import serialize
from app_doc.models import Project,Doc,DocTemp
from django.contrib.auth.models import User
from rest_framework.views import APIView # 视图
from rest_framework.response import Response # 响应
from rest_framework.pagination import PageNumberPagination # 分页
from rest_framework.authentication import SessionAuthentication # 认证
from django.db.models import Q
from django.db import transaction
from django.utils.html import strip_tags,escape
from django.utils.translation import gettext_lazy as _
from loguru import logger
from app_api.serializers_app import *
from app_doc.report_utils import *
from app_doc.utils import check_user_project_writer_role
from app_admin.models import UserOptions,SysSetting
from app_admin.decorators import check_headers,allow_report_file
from app_admin.utils import is_zip_bomb
from app_api.auth_app import AppAuth,AppMustAuth # 自定义认证
import datetime
import traceback
import re
import json
import random
import os.path
import base64
import hashlib
import markdown
import tempfile


# HTML转义
def jsonXssFilter(data):
    payloads = {
        '\'':'&apos;',
        '"':'&quot;',
        '<':'&lt;',
        '>':'&gt;'
    }
    if type(data) == dict:
        new = {}
        for key,values in data.items():
            new[key] = jsonXssFilter(values)
    elif type(data) == list:
        new = []
        for i in data:
            new.append(jsonXssFilter(i))
    elif type(data) == int or type(data) == float:
        new = data
    elif type(data) == str:
        new = data
        for key,value in payloads.items():
            new = new.replace(key,value)
    elif type(data) ==bytes:
        new = data
    else:
        # print('>>> unknown type:')
        # print(type(data))
        new = data
    return new


def html_filter(data):
    if len(data) == 0:
        return ""
    payloads = {
        '\'':'&apos;',
        '"':'&quot;',
        '<':'&lt;',
        '>':'&gt;'
    }
    new = data
    for key, value in payloads.items():
        new = new.replace(key, value)
    print(new)
    return new


# 替换前端传来的非法字符
def validateTitle(title):
  rstr = r"[\/\\\:\*\?\"\<\>\|\[\]]" # '/ \ : * ? " < > |'
  new_title = re.sub(rstr, "_", title) # 替换为下划线
  return new_title

# 文档文本生成摘要（不带markdown标记和html标签）
def remove_markdown_tag(docs):
    for doc in docs:
        try:
            if doc.editor_mode == 3: # 富文本文档
                doc.content = strip_tags(doc.content)[:201]
            elif doc.editor_mode == 4:
                doc.pre_content = "此为表格文档，进入文档查看详细内容"
            else: # 其他文档
                doc.pre_content = strip_tags(markdown.markdown(doc.pre_content))[:201]
        except Exception as e:
            doc.pre_content = doc.pre_content[:201]

# 获取文集的文档目录
def get_pro_toc(pro_id):
    # try:
    #     project = Project.objects.get(id=pro_id)
    #     pro_toc = ProjectToc.objects.get(project=project)
    #     doc_list = json.loads(pro_toc.value)
    #     print("使用缓存")
    # except:
    # print("重新生成")
    # 查询存在上级文档的文档
    parent_id_list = Doc.objects.filter(
        top_doc=pro_id,
        status=1
    ).exclude(parent_doc=0).values_list('parent_doc',flat=True)
    # 获取存在上级文档的上级文档ID
    # print(parent_id_list)
    doc_list = []
    n = 0
    # 获取一级文档
    top_docs = Doc.objects.filter(top_doc=pro_id, parent_doc=0, status=1).values('id', 'name','open_children','editor_mode').order_by('sort')
    # 遍历一级文档
    for doc in top_docs:
        top_item = {
            'id': doc['id'],
            'name': doc['name'],
            'open_children':doc['open_children'],
            'editor_mode':doc['editor_mode']
            # 'spread': True,
            # 'level': 1
        }
        # 如果一级文档存在下级文档，查询其二级文档
        if doc['id'] in parent_id_list:
            # 获取二级文档
            sec_docs = Doc.objects.filter(
                top_doc=pro_id,
                parent_doc=doc['id'],
                status=1
            ).values('id', 'name','open_children','editor_mode').order_by('sort')
            top_item['children'] = []
            for doc in sec_docs:
                sec_item = {
                    'id': doc['id'],
                    'name': doc['name'],
                    'open_children': doc['open_children'],
                    'editor_mode': doc['editor_mode']
                    # 'level': 2
                }
                # 如果二级文档存在下级文档，查询第三级文档
                if doc['id'] in parent_id_list:
                    # 获取三级文档
                    thr_docs = Doc.objects.filter(
                        top_doc=pro_id,
                        parent_doc=doc['id'],
                        status=1
                    ).values('id','name','editor_mode').order_by('sort')
                    sec_item['children'] = []
                    for doc in thr_docs:
                        item = {
                            'id': doc['id'],
                            'name': doc['name'],
                            'editor_mode': doc['editor_mode']
                            # 'level': 3
                        }
                        sec_item['children'].append(item)
                        n += 1
                    top_item['children'].append(sec_item)
                    n += 1
                else:
                    top_item['children'].append(sec_item)
                    n += 1
            doc_list.append(top_item)
            n += 1
        # 如果一级文档没有下级文档，直接保存
        else:
            doc_list.append(top_item)
            n += 1
    # 将文集的大纲目录写入数据库
    # ProjectToc.objects.create(
    #     project = project,
    #     value = json.dumps(doc_list)
    # )
    # print(doc_list,n)
    # if n > 999:
    #     return ([],n)
    # else:
    return (doc_list,n)


# 文集列表（首页）
@logger.catch()
def project_list(request):
    kw = request.GET.get('kw','') # 搜索词
    sort = request.GET.get('sort','') # 排序,0表示按时间升序排序，1表示按时间降序排序，''表示按后台配置排序，默认为''
    role = request.GET.get('role',-1) # 筛选文集权限，默认为显示所有可显示的文集

    # 是否排序
    if sort in [0,'0']:
        sort_str = ''
    elif sort == '':
        try:
            index_project_sort = SysSetting.objects.get(name='index_project_sort')
            if index_project_sort.value == '-1':
                sort_str = '-'
            else:
                sort_str = ''
        except:
            sort_str = ''
    else:
        sort_str = '-'

    # 是否搜索
    if kw == '':
        is_kw = False
    else:
        is_kw = True

    # 是否认证
    if request.user.is_authenticated:
        is_auth = True
    else:
        is_auth = False

    # 是否筛选
    if role in ['',-1,'-1']:
        is_role = False
        role_list = [0,3]
    else:
        is_role = True

    # 没有搜索 and 认证用户 and 没有筛选
    if (is_kw is False) and (is_auth) and (is_role is False):
        colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)] # 用户的协作文集列表
        project_list = Project.objects.filter(
            Q(role__in=role_list) | \
            Q(role=2,role_value__contains=str(request.user.username)) | \
            Q(create_user=request.user) | \
            Q(id__in=colla_list)
        ).order_by('-is_top',"{}create_time".format(sort_str))

    # 没有搜索 and 认证用户 and 有筛选
    elif (is_kw is False ) and (is_auth) and (is_role):
        if role in ['0',0]:
            project_list = Project.objects.filter(role=0).order_by('-is_top',"{}create_time".format(sort_str))
        elif role in ['1',1]:
            project_list = Project.objects.filter(create_user=request.user,role=1).order_by(
                '-is_top',"{}create_time".format(sort_str))
        elif role in ['2',2]:
            project_list = Project.objects.filter(role=2,role_value__contains=str(request.user.username)).order_by(
                '-is_top',"{}create_time".format(sort_str))
        elif role in ['3',3]:
            project_list = Project.objects.filter(role=3).order_by('-is_top',"{}create_time".format(sort_str))
        elif role in ['99',99]:
            colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)] # 用户的协作文集列表
            project_list = Project.objects.filter(id__in=colla_list).order_by('-is_top',"{}create_time".format(sort_str))
        else:
            return render(request,'404.html')

    # 没有搜索 and 游客 and 没有筛选
    elif (is_kw is False) and (is_auth is False) and (is_role is False):
        project_list = Project.objects.filter(role__in=[0,3]).order_by('-is_top',"{}create_time".format(sort_str))

    # 没有搜索 and 游客 and 有筛选
    elif (is_kw is False) and (is_auth is False) and (is_role):
        if role in ['0',0]:
            project_list = Project.objects.filter(role=0).order_by('-is_top',"{}create_time".format(sort_str))
        elif role in ['3',3]:
            project_list = Project.objects.filter(role=3).order_by('-is_top',"{}create_time".format(sort_str))
        else:
            return render(request,'404.html')

    # 有搜索 and 认证用户 and 没有筛选
    elif (is_kw) and (is_auth) and (is_role is False):
        colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)] # 用户的协作文集
        # 查询所有可显示的文集
        project_list = Project.objects.filter(
            Q(role__in=[0, 3]) | \
            Q(role=2, role_value__contains=str(request.user.username)) | \
            Q(create_user=request.user) | \
            Q(id__in=colla_list),
            Q(name__icontains=kw) | Q(intro__icontains=kw)
        ).order_by('-is_top','{}create_time'.format(sort_str))

    # 有搜索 and 认证用户 and 有筛选
    elif (is_kw) and (is_auth) and (is_role):
        if role in ['0',0]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw)|Q(intro__icontains=kw),
                role=0
            ).order_by('-is_top',"{}create_time".format(sort_str))
        elif role in ['1',1]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                create_user=request.user
            ).order_by('-is_top',"{}create_time".format(sort_str))
        elif role in ['2',2]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                role=2,
                role_value__contains=str(request.user.username)
            ).order_by('-is_top',"{}create_time".format(sort_str))
        elif role in ['3',3]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                role=3
            ).order_by('-is_top',"{}create_time".format(sort_str))
        elif role in ['99',99]:
            colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)] # 用户的协作文集列表
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                id__in=colla_list
            ).order_by('-is_top',"{}create_time".format(sort_str))
        else:
            return render(request,'404.html')

    # 有搜索 and 游客 and 没有筛选
    elif (is_kw) and (is_auth is False) and (is_role is False):
        project_list = Project.objects.filter(
            Q(name__icontains=kw) | Q(intro__icontains=kw),
            role__in=[0, 3]
        ).order_by('-is_top',"{}create_time".format(sort_str))

    # 有搜索 and 游客 and 有筛选
    elif (is_kw) and (is_auth is False) and (is_role):
        if role in ['0',0]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                role=0
            ).order_by('-is_top',"{}create_time".format(sort_str))
        elif role in ['3',3]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                role=3
            ).order_by('-is_top',"{}create_time".format(sort_str))
        else:
            return render(request,'404.html')

    # 分页处理
    paginator = Paginator(project_list, 12)
    page = request.GET.get('page', 1)
    try:
        projects = paginator.page(page)
    except PageNotAnInteger:
        projects = paginator.page(1)
    except EmptyPage:
        projects = paginator.page(paginator.num_pages)
    return render(request, 'app_doc/pro_list.html', locals())


# 创建文集
@login_required()
@require_http_methods(['POST'])
def create_project(request):
    try:
        name = request.POST.get('pname','')
        name = validateTitle(name)
        icon = request.POST.get('picon',None)
        desc = request.POST.get('desc','')
        role = request.POST.get('role',0)
        role_list = ['0','1','2','3',0,1,2,3]
        if name != '':
            # 不允许用户下同名文集存在
            if Project.objects.filter(name=name,create_user=request.user).exists():
                return JsonResponse({'status': False, 'data': _('同名文集已存在！')})
            project = Project.objects.create(
                name=validateTitle(name),
                icon = icon,
                intro=desc[:100],
                create_user=request.user,
                role = int(role) if role in role_list else 0
            )
            project.save()
            return JsonResponse({'status':True,'data':{'id':project.id,'name':project.name,'role':project.role}})
        else:
            return JsonResponse({'status':False,'data':_('文集名称不能为空！')})
    except Exception as e:

        logger.exception(_("创建文集出错"))
        return JsonResponse({'status':False,'data':_('出现异常,请检查输入值！')})

# 文集页
@require_http_methods(['GET'])
@check_headers
def project_index(request,pro_id):
    # 获取文集
    try:
        # 获取文集信息
        project = Project.objects.get(id=int(pro_id))
        # 获取文集最新的5篇文档
        new_docs = Doc.objects.filter(top_doc=pro_id,status=1).order_by('-modify_time')[:5]
        # markdown文本生成摘要（不带markdown标记）
        remove_markdown_tag(new_docs)

        # 获取文集的文档目录
        toc_list,toc_cnt = get_pro_toc(pro_id)
        # toc_list,toc_cnt = ([],1000)

        # 获取文集的协作成员
        colla_user_list = ProjectCollaborator.objects.filter(project=project)

        # 获取文集收藏状态
        if request.user.is_authenticated:
            is_collect_pro = MyCollect.objects.filter(
                collect_type=2,collect_id=pro_id,create_user=request.user).exists()
        else:
            is_collect_pro = False

        # 获取文集的协作用户信息
        if request.user.is_authenticated: # 对登陆用户查询其协作文档信息
            colla_user = ProjectCollaborator.objects.filter(project=project,user=request.user).count()
        else:
            colla_user = 0

        # 获取文集前台下载权限
        try:
            allow_download = ProjectReport.objects.get(project=project)
        except ObjectDoesNotExist:
            allow_download = False

        # 私密文集并且访问者非创建者非协作者
        if (project.role == 1) and (request.user != project.create_user) and (colla_user == 0):
            return render(request,'404.html')
        # 指定用户可见文集
        elif project.role == 2:
            user_list = project.role_value
            if request.user.is_authenticated: # 认证用户判断是否在许可用户列表中
                if (request.user.username not in user_list) and \
                        (request.user != project.create_user) and \
                        (colla_user == 0): # 访问者不在指定用户之中
                    return render(request, '404.html')
            else:# 游客直接返回404
                return render(request, '404.html')
        # 访问码可见
        elif project.role == 3:
            # 浏览用户不为创建者、协作者
            if request.user != project.create_user and colla_user == 0:
                viewcode = project.role_value
                viewcode_name = 'viewcode-{}'.format(project.id)
                r_viewcode = request.COOKIES[viewcode_name] if viewcode_name in request.COOKIES.keys() else 0 # 从cookie中获取访问码
                if viewcode != r_viewcode: # cookie中的访问码不等于文集访问码，跳转到访问码认证界面
                    return redirect('/check_viewcode/?to={}'.format(request.path))

        # 获取搜索词
        kw = request.GET.get('kw','')
        # 获取文集下所有一级文档
        # project_docs = Doc.objects.filter(
        #     top_doc=int(pro_id),
        #     parent_doc=0,
        #     status=1
        # ).values('id','name','top_doc').order_by('sort')
        if kw != '':
            search_result = Doc.objects.filter(Q(pre_content__icontains=kw) | Q(name__icontains=kw),top_doc=int(pro_id))
            remove_markdown_tag(search_result)
            return render(request,'app_doc/project_doc_search.html',locals())
        return render(request, 'app_doc/project.html', locals())
    except Exception as e:
        logger.exception(_("文集页访问异常"))
        return render(request,'404.html')


# 修改文集
@login_required()
@require_http_methods(['GET','POST'])
def modify_project(request):
    if request.method == 'GET':
        pro_id = request.GET.get('pro_id', None)
        pro = Project.objects.get(id=pro_id)
        project_files = ProjectReportFile.objects.filter(project=pro) # 文集的导出文件列表
        # 验证用户有权限修改文集
        if (request.user == pro.create_user) or request.user.is_superuser:
            return render(request,'app_doc/manage/manage_project_options.html',locals())
        else:
            return Http404
    elif request.method == 'POST':
        try:
            pro_id = request.POST.get('pro_id',None)
            project = Project.objects.get(id=pro_id)
            # 验证用户有权限修改文集
            if (request.user == project.create_user) or request.user.is_superuser:
                name = request.POST.get('name',None)
                icon = request.POST.get('picon', None)
                content = request.POST.get('desc',None)
                is_watermark = request.POST.get('is_watermark',False)
                if is_watermark == 'true':
                    is_watermark = True
                else:
                    is_watermark = False
                watermark_value = request.POST.get('watermark_value','')
                project.name = validateTitle(name)
                project.intro = content
                project.icon = icon
                project.is_watermark = is_watermark
                project.watermark_value = watermark_value
                project.save()
                return JsonResponse({'status':True,'data':_('修改成功')})
            else:
                return JsonResponse({'status':False,'data':_('非法请求')})
        except Exception as e:
            logger.exception(_("修改文集出错"))
            return JsonResponse({'status':False,'data':_('请求出错')})


# 修改文集权限
@login_required()
@require_http_methods(['GET',"POST"])
@logger.catch()
def modify_project_role(request,pro_id):
    try:
        pro = Project.objects.get(id=pro_id)
    except ObjectDoesNotExist:
        return Http404
    if (pro.create_user != request.user) and (request.user.is_superuser is False):
        return render(request,'403.html')
    else:
        if request.method == 'GET':
            return render(request,'app_doc/manage/manage_project_role.html',locals())
        elif request.method == 'POST':
            role_type = request.POST.get('role','')
            if role_type != '':
                try:
                    if int(role_type) in [0,1]:# 公开或私密
                        Project.objects.filter(id=int(pro_id)).update(
                            role = role_type,
                            modify_time = datetime.datetime.now()
                        )
                    if int(role_type) == 2: # 指定用户可见
                        role_value = request.POST.get('tagsinput','')
                        Project.objects.filter(id=int(pro_id)).update(
                            role=role_type,
                            role_value = role_value,
                            modify_time = datetime.datetime.now()
                        )
                    if int(role_type) == 3: # 访问码可见
                        role_value = request.POST.get('viewcode','')
                        Project.objects.filter(id=int(pro_id)).update(
                            role=role_type,
                            role_value=role_value,
                            modify_time=datetime.datetime.now()
                        )
                    pro = Project.objects.get(id=int(pro_id))
                    # return render(request, 'app_doc/manage/manage_project_role.html', locals())
                    return JsonResponse({'status':True,'data':'ok'})
                except:
                    return JsonResponse({'status':False,'data':_('出错')})
            else:
                return Http404


# 验证文集访问码
@require_http_methods(['GET',"POST"])
def check_viewcode(request):
    try:
        if request.method == 'GET':
            project_id = re.search(r'/project[/-](\d+)', request.GET.get('to', ''))
            if project_id:
                project_id = project_id.group(1)
            project = Project.objects.get(id=int(project_id))
            return render(request,'app_doc/check_viewcode.html',locals())
        else:
            viewcode = request.POST.get('viewcode','')
            project_id = request.POST.get('project_id','')
            project = Project.objects.get(id=int(project_id))
            if project.role == 3 and project.role_value == viewcode:
                obj = redirect("pro_index",pro_id=project_id)
                obj.set_cookie('viewcode-{}'.format(project_id),viewcode)
                return obj
            else:
                errormsg = _("访问码错误")
                return render(request, 'app_doc/check_viewcode.html', locals())
    except Exception as e:
        logger.exception(_("验证文集访问码出错"))
        return render(request,'404.html')


# 删除文集
@login_required()
@require_http_methods(["POST"])
def del_project(request):
    try:
        range = request.POST.get('range','single')
        pro_id = request.POST.get('pro_id','')
        if pro_id != '':
            if range == 'single':
                pro = Project.objects.get(id=pro_id)
                if (request.user == pro.create_user) or (request.user.is_superuser):
                    # 删除文集下的文档、文档历史、文档分享、文档标签
                    pro_doc_list = Doc.objects.filter(top_doc=int(pro_id))
                    for doc in pro_doc_list:
                        DocHistory.objects.filter(doc=doc).delete()
                        DocShare.objects.filter(doc=doc).delete()
                        DocTag.objects.filter(doc=doc).delete()
                    pro_doc_list.delete()
                    # 删除文集
                    pro.delete()
                    return JsonResponse({'status':True})
                else:
                    return JsonResponse({'status':False,'data':_('非法请求')})
            elif range == 'multi':
                pros = pro_id.split(",")
                try:
                    projects = Project.objects.filter(id__in=pros, create_user=request.user)
                    # 删除文集下的文档、文档历史、文档分享、文档标签
                    pro_doc_list = Doc.objects.filter(top_doc__in=[i.id for i in projects])
                    for doc in pro_doc_list:
                        DocHistory.objects.filter(doc=doc).delete()
                        DocShare.objects.filter(doc=doc).delete()
                        DocTag.objects.filter(doc=doc).delete()
                    pro_doc_list.delete()
                    projects.delete()
                    return JsonResponse({'status': True, 'data': 'ok'})
                except Exception:
                    logger.exception(_("异常"))
                    return JsonResponse({'status': False, 'data': _('无指定内容')})
            else:
                return JsonResponse({'status': False, 'data': _('类型错误')})
        else:
            return JsonResponse({'status':False,'data':_('参数错误')})
    except Exception as e:
        logger.exception(_("删除文集出错"))
        return JsonResponse({'status':False,'data':_('请求出错')})


# 管理文集
@login_required()
@require_http_methods(['GET','POST'])
def manage_project(request):
    if request.method == 'GET':
        return render(request,'app_doc/manage/manage_project.html',locals())
    else:
        kw = request.POST.get('kw','')
        page = request.POST.get('page', 1)
        limit = request.POST.get('limit', 10)
        # 获取文集列表
        if kw == '':
            project_list = Project.objects.filter(create_user=request.user).order_by('-create_time')
        else:
            project_list = Project.objects.filter(
                Q(intro__icontains=kw) | Q(name__icontains=kw),
                create_user=request.user,
                ).order_by('-create_time')
        paginator = Paginator(project_list, limit)
        try:
            pros = paginator.page(page)
        except PageNotAnInteger:
            pros = paginator.page(1)
        except EmptyPage:
            pros = paginator.page(paginator.num_pages)
        table_data = []
        for project in pros:
            item = {
                'id':project.id,
                'name':project.name,
                'intro':project.intro,
                'doc_total':Doc.objects.filter(top_doc=project.id).count(),
                'role':project.role,
                'role_value':project.role_value,
                'colla_total':ProjectCollaborator.objects.filter(project=project).count(),
                'create_time':project.create_time,
                'modify_time':project.modify_time
            }
            table_data.append(item)
        resp_data = {
            "code": 0,
            "msg": "ok",
            "count": project_list.count(),
            "data": table_data
        }
        return JsonResponse(resp_data)


# 管理文集 - 文集文档排序
@login_required()
@require_http_methods(['GET','POST'])
def manage_project_doc_sort(request,pro_id):
    if request.method == 'GET':
        try:
            # 获取文集
            pro = Project.objects.get(id=pro_id)
        except ObjectDoesNotExist:
            return render(request, '404.html')

        # 查询文集的协作者
        pro_colla = ProjectCollaborator.objects.filter(project=pro,user=request.user,role=1)
        # 文集的创建者和文集高级权限协作者允许操作
        if (pro.create_user == request.user) or pro_colla.count() > 0:
            # 查询存在上级文档的文档
            parent_id_list = Doc.objects.filter(top_doc=pro_id, status=1).exclude(parent_doc=0).values_list(
                'parent_doc', flat=True)
            # 获取存在上级文档的上级文档ID
            doc_list = []
            # 获取一级文档
            top_docs = Doc.objects.filter(top_doc=pro_id, parent_doc=0, status=1).values('id', 'name').order_by('sort')
            # 遍历一级文档
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
                    # 获取二级文档
                    sec_docs = Doc.objects.filter(top_doc=pro_id, parent_doc=doc['id'], status=1).values('id',
                                                                                                         'name').order_by(
                        'sort')
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
                            # 获取三级文档
                            thr_docs = Doc.objects.filter(top_doc=pro_id, parent_doc=doc['id'], status=1).values('id',
                                                                                                                 'name').order_by(
                                'sort')
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
            return render(request,'app_doc/manage/manage_project_doc_sort.html',locals())
        else:
            return render(request, '403.html')

    else:
        project_id = request.POST.get('pid', None)  # 文集ID
        sort_data = request.POST.get('sort_data', '[]')  # 文档排序列表
        try:
            sort_data = json.loads(sort_data)
        except Exception:
            return JsonResponse({'status': False, 'data': _('文档参数错误')})

        try:
            pro = Project.objects.get(id=project_id)
        except ObjectDoesNotExist:
            return JsonResponse({'status': False, 'data': _('没有匹配的文集')})

        # 查询文集的协作者
        pro_colla = ProjectCollaborator.objects.filter(project=pro, user=request.user, role=1)
        # 文集的创建者和文集高级权限协作者允许操作
        if (pro.create_user == request.user) or pro_colla.count() > 0:
            # 文档排序
            n = 10
            # 第一级文档
            for data in sort_data:
                # print(data)
                Doc.objects.filter(id=data['id']).update(sort=n,parent_doc=0)
                n += 10
                # 存在第二级文档
                if 'children' in data.keys():
                    n1 = 10
                    for c1 in data['children']:
                        Doc.objects.filter(id=c1['id']).update(sort=n1, parent_doc=data['id'])
                        n1 += 10
                        # 存在第三级文档
                        if 'children' in c1.keys():
                            n2 = 10
                            for c2 in c1['children']:
                                Doc.objects.filter(id=c2['id']).update(sort=n2, parent_doc=c1['id'])
                                n2 += 10

            return JsonResponse({'status': True, 'data': 'ok'})
        else:
            return JsonResponse({'status':False,'data':_('无权操作')})

# 修改文集前台下载权限
@login_required()
@require_http_methods(['GET',"POST"])
@logger.catch()
def modify_project_download(request,pro_id):
    try:
        pro = Project.objects.get(id=pro_id)
    except ObjectDoesNotExist:
        return Http404
    if (pro.create_user != request.user) and (request.user.is_superuser is False):
        return render(request,'403.html')
    else:
        project_files = ProjectReportFile.objects.filter(project=pro)
        if request.method == 'GET':
            return render(request,'app_doc/manage/manage_project_download.html',locals())
        elif request.method == 'POST':
            download_epub = request.POST.get('download_epub',None)
            download_pdf = request.POST.get('download_pdf', None)
            # print("epub状态:",download_epub)
            # EPUB下载权限
            if download_epub == 'on':
                epub_status = 1
            else:
                epub_status = 0
            # PDF下载权限
            if download_pdf == 'on':
                pdf_status = 1
            else:
                pdf_status = 0
            # 写入数据库
            ProjectReport.objects.update_or_create(
                project = pro,defaults={'allow_epub':epub_status}
            )
            ProjectReport.objects.update_or_create(
                project=pro, defaults={'allow_pdf': pdf_status}
            )
            # return render(request,'app_doc/manage/manage_project_download.html',locals())
            return JsonResponse({'status':True,'data':'ok'})


# 文集协作管理
@login_required()
@require_http_methods(['GET',"POST"])
@logger.catch()
def manage_project_collaborator(request,pro_id):
    if request.user.is_superuser:
        project = Project.objects.filter(id=pro_id)
    else:
        project = Project.objects.filter(id=pro_id, create_user=request.user)
    if project.exists() is False:
        return render(request, '404.html')

    if request.method == 'GET':
        user_list = User.objects.filter(~Q(username=request.user.username)) # 获取用户列表
        pro = project[0]
        collaborator = ProjectCollaborator.objects.filter(project=pro) # 获取文集的协作者
        colla_user_list = [i.user for i in collaborator] # 文集协作用户的ID
        colla_docs = Doc.objects.filter(top_doc=pro.id,create_user__in=colla_user_list) # 获取文集协作用户创建的文档
        return render(request, 'app_doc/manage/manage_project_collaborator.html', locals())

    elif request.method == 'POST':
        # type类型：0表示新增协作者、1表示删除协作者、2表示修改协作者
        types = request.POST.get('types','')
        try:
            types = int(types)
        except:
            return JsonResponse({'status':False,'data':_('参数错误')})
        # 添加文集协作者
        if int(types) == 0:
            colla_user = request.POST.get('username','')
            role = request.POST.get('role',0)
            user = User.objects.filter(username=colla_user)
            if user.exists():
                if user[0] == project[0].create_user: # 用户为文集的创建者
                    return JsonResponse({'status':False,'data':_('文集创建者无需添加')})
                elif ProjectCollaborator.objects.filter(user=user[0],project=project[0]).exists():
                    return JsonResponse({'status':False,'data':_('用户已存在')})
                else:
                    ProjectCollaborator.objects.create(
                        project = project[0],
                        user = user[0],
                        role = role if role in ['1',1] else 0
                    )
                    return JsonResponse({'status':True,'data':_('添加成功')})
            else:
                return JsonResponse({'status':False,'data':_('用户不存在')})
        # 删除文集协作者
        elif int(types) == 1:
            username = request.POST.get('username','')
            try:
                user = User.objects.get(username=username)
                pro_colla = ProjectCollaborator.objects.get(project=project[0],user=user)
                pro_colla.delete()
                return JsonResponse({'status':True,'data':_('删除成功')})
            except:
                logger.exception(_("删除协作者出错"))
                return JsonResponse({'status':False,'data':_('删除出错')})
        # 修改协作权限
        elif int(types) == 2:
            username = request.POST.get('username', '')
            role = request.POST.get('role','')
            try:
                user = User.objects.get(username=username)
                pro_colla = ProjectCollaborator.objects.filter(project=project[0], user=user)
                pro_colla.update(role=role)
                return JsonResponse({'status':True,'data':_('修改成功')})
            except:
                logger.exception(_("修改协作权限出错"))
                return JsonResponse({'status':False,'data':_('修改失败')})

        else:
            return JsonResponse({'status':False,'data':_('无效的类型')})


# 我协作的文集
@login_required()
@logger.catch()
def manage_pro_colla_self(request):
    colla_pros = ProjectCollaborator.objects.filter(user=request.user)
    return render(request,'app_doc/manage/manage_project_self_colla.html',locals())


# 我协作的文集文档列表接口
class MyCollaList(APIView):
    authentication_classes = (AppAuth, SessionAuthentication)

    # 获取列表
    def get(self,request):
        pid = request.query_params.get('pid','')
        page_num = request.query_params.get('page', 1)
        limit = request.query_params.get('limit', 10)
        if pid == '':
            doc_data = ProjectCollaborator.objects.filter(user=request.user).order_by('-create_time')
        else:
            project = Project.objects.get(id=pid)
            doc_data = ProjectCollaborator.objects.filter(user=request.user,project=project).order_by('-create_time')
        page = PageNumberPagination()  # 实例化一个分页器
        page.page_size = limit
        page_docs = page.paginate_queryset(doc_data, request, view=self)  # 进行分页查询
        serializer = ProjectCollaSerializer(page_docs, many=True)  # 对分页后的结果进行序列化处理
        colla_doc_list = []
        for s in serializer.data:
            item = {
                "project_id": s['project_id'],
                "project_name": s['project_name'],
                'role':s['role'],
                "top_doc": 0,
                'type':'project',
                'create_time':s['create_time'],
                'username':s['username'],
                # "checkArr": "0"
            }
            colla_doc_list.append(item)
        for doc in doc_data:
            doc_list = Doc.objects.filter(
                top_doc=doc.project.id,
                create_user=request.user
            ).defer('content','pre_content')
            if doc_list.exists():
                for d in doc_list:
                    item = {
                        "project_id": d.id,
                        "project_name": d.name,
                        "top_doc": d.top_doc,
                        'role':None,
                        'type':'doc',
                        'create_time':d.create_time,
                        'username':d.create_user.username,
                    }
                    colla_doc_list.append(item)
        resp = {
            'code': 0,
            'data': colla_doc_list,
            # 'data':a,
            'count': doc_data.count()
        }

        return Response(resp)


# 转让文集
@login_required()
@require_http_methods(['GET',"POST"])
def manage_project_transfer(request,pro_id):
    try:
        pro = Project.objects.get(id=pro_id)
    except ObjectDoesNotExist:
        return Http404
    if (pro.create_user != request.user) and (request.user.is_superuser is False):
        return render(request,'403.html')
    else:
        if request.method == 'GET':
            user_list = User.objects.filter(~Q(username=request.user.username))
            return render(request,'app_doc/manage/manage_project_transfer.html',locals())
        elif request.method == 'POST':
            user_name = request.POST.get('username',None)
            try:
                transfer_user = User.objects.get(username=user_name)
                init_user = pro.create_user
                # 修改文集的创建者
                pro.create_user = transfer_user
                pro.save()
                # 修改文集文档的创建者
                Doc.objects.filter(create_user=init_user,top_doc=pro_id).update(
                    create_user=transfer_user
                )
                return JsonResponse({'status':True,'data':'ok'})

            except:
                return JsonResponse({'status':False,'data':_('用户不存在')})


# 文档浏览页
@require_http_methods(['GET'])
def doc(request,pro_id,doc_id):
    try:
        if pro_id != '' and doc_id != '':
            # 获取文集信息
            doc = Doc.objects.get(id=int(doc_id),status__in=[0,1]) # 文档信息
            pro_id = doc.top_doc
            project = Project.objects.get(id=int(pro_id))
            # 获取文集的文档目录
            toc_list,toc_cnt = get_pro_toc(pro_id)
            # 获取文集的协作用户信息
            if request.user.is_authenticated:
                colla_user = ProjectCollaborator.objects.filter(project=project,user=request.user)
                if colla_user.exists():
                    colla_user_role = colla_user[0].role
                    colla_user = colla_user.count()
                else:
                    colla_user = colla_user.count()
            else:
                colla_user = 0

            # 获取文集收藏状态
            if request.user.is_authenticated:
                is_collect_pro = MyCollect.objects.filter(collect_type=2, collect_id=pro_id,
                                                          create_user=request.user).exists()
                # 获取文档收藏状态
                is_collect_doc = MyCollect.objects.filter(collect_type=1, collect_id=doc_id,
                                                          create_user=request.user).exists()
            else:
                is_collect_pro,is_collect_doc = False,False

            # 私密文集且访问者非创建者、协作者 - 不能访问
            if (project.role == 1) and (request.user != project.create_user) and (colla_user == 0):
                return render(request, '404.html')
            # 指定用户可见文集
            elif project.role == 2:
                user_list = project.role_value
                if request.user.is_authenticated:  # 认证用户判断是否在许可用户列表中
                    if (request.user.username not in user_list) and \
                            (request.user != project.create_user) and \
                            (colla_user == 0):  # 访问者不在指定用户之中，也不是协作者
                        return render(request, '404.html')
                else:  # 游客直接返回404
                    return render(request, '404.html')
            # 访问码可见
            elif project.role == 3:
                # 浏览用户不为创建者和协作者 - 需要访问码
                if (request.user != project.create_user) and (colla_user == 0):
                    viewcode = project.role_value
                    viewcode_name = 'viewcode-{}'.format(project.id)
                    r_viewcode = request.COOKIES[
                        viewcode_name] if viewcode_name in request.COOKIES.keys() else 0  # 从cookie中获取访问码
                    if viewcode != r_viewcode:  # cookie中的访问码不等于文集访问码，跳转到访问码认证界面
                        return redirect('/check_viewcode/?to={}'.format(request.path))

            # 获取文档内容
            try:
                doc = Doc.objects.get(id=int(doc_id),status__in=[0,1]) # 文档信息
                doc_tags = DocTag.objects.filter(doc=doc) # 文档标签信息
                if doc.status == 0 and doc.create_user != request.user:
                    raise ObjectDoesNotExist
                elif doc.status == 0 and doc.create_user == request.user:
                    doc.name  = _('【预览草稿】')+ doc.name

            except ObjectDoesNotExist:
                return render(request, '404.html')
            # 获取文档分享信息
            try:
                doc_share = DocShare.objects.get(doc=doc)
                is_share = True
            except ObjectDoesNotExist:
                is_share = False
            # 获取文集下一级文档
            # project_docs = Doc.objects.filter(top_doc=doc.top_doc, parent_doc=0, status=1).order_by('sort')
            return render(request,'app_doc/doc.html',locals())
        else:
            return HttpResponse(_('参数错误'))
    except Exception as e:
        logger.exception(_("文集浏览出错"))
        return render(request,'404.html')


# 文档浏览页，可通过文档ID 或文集ID+文档ID访问
@require_http_methods(['GET'])
def doc_id(request,doc_id):
    try:
        # 获取文档内容
        try:
            doc = Doc.objects.get(id=int(doc_id),status__in=[0,1]) # 文档信息
            doc_tags = DocTag.objects.filter(doc=doc) # 文档标签信息
            pro_id = doc.top_doc
            if doc.status == 0 and doc.create_user != request.user:
                raise ObjectDoesNotExist
            elif doc.status == 0 and doc.create_user == request.user:
                doc.name  = _('【预览草稿】')+ doc.name

        except ObjectDoesNotExist:
            return render(request, '404.html')

        # 获取文集信息
        project = Project.objects.get(id=int(pro_id))
        # 获取文集的文档目录
        toc_list,toc_cnt = get_pro_toc(pro_id)
        # 获取文集的协作用户信息
        if request.user.is_authenticated:
            colla_user = ProjectCollaborator.objects.filter(project=project,user=request.user)
            if colla_user.exists():
                colla_user_role = colla_user[0].role
                colla_user = colla_user.count()
            else:
                colla_user = colla_user.count()
        else:
            colla_user = 0

        # 获取文集收藏状态
        if request.user.is_authenticated:
            is_collect_pro = MyCollect.objects.filter(collect_type=2, collect_id=pro_id,
                                                      create_user=request.user).exists()
            # 获取文档收藏状态
            is_collect_doc = MyCollect.objects.filter(collect_type=1, collect_id=doc_id,
                                                      create_user=request.user).exists()
        else:
            is_collect_pro,is_collect_doc = False,False

        # 私密文集且访问者非创建者、协作者 - 不能访问
        if (project.role == 1) and (request.user != project.create_user) and (colla_user == 0):
            return render(request, '404.html')
        # 指定用户可见文集
        elif project.role == 2:
            user_list = project.role_value
            if request.user.is_authenticated:  # 认证用户判断是否在许可用户列表中
                if (request.user.username not in user_list) and \
                        (request.user != project.create_user) and \
                        (colla_user == 0):  # 访问者不在指定用户之中，也不是协作者
                    return render(request, '404.html')
            else:  # 游客直接返回404
                return render(request, '404.html')
        # 访问码可见
        elif project.role == 3:
            # 浏览用户不为创建者和协作者 - 需要访问码
            if (request.user != project.create_user) and (colla_user == 0):
                viewcode = project.role_value
                viewcode_name = 'viewcode-{}'.format(project.id)
                r_viewcode = request.COOKIES[
                    viewcode_name] if viewcode_name in request.COOKIES.keys() else 0  # 从cookie中获取访问码
                if viewcode != r_viewcode:  # cookie中的访问码不等于文集访问码，跳转到访问码认证界面
                    return redirect('/check_viewcode/?to={}'.format(request.path))

        # 获取文档内容
        try:
            doc = Doc.objects.get(id=int(doc_id),status__in=[0,1]) # 文档信息
            doc_tags = DocTag.objects.filter(doc=doc) # 文档标签信息
            if doc.status == 0 and doc.create_user != request.user:
                raise ObjectDoesNotExist
            elif doc.status == 0 and doc.create_user == request.user:
                doc.name  = _('【预览草稿】')+ doc.name

        except ObjectDoesNotExist:
            return render(request, '404.html')
        # 获取文档分享信息
        try:
            doc_share = DocShare.objects.get(doc=doc)
            is_share = True
        except ObjectDoesNotExist:
            is_share = False
        return render(request,'app_doc/doc.html',locals())
    except Exception as e:
        logger.exception(_("文集浏览出错"))
        return render(request,'404.html')


# 创建文档
@login_required()
@require_http_methods(['GET',"POST"])
@logger.catch()
def create_doc(request):
    # 获取用户的编辑器模式
    try:
        user_opt = UserOptions.objects.get(user=request.user)
        editor_mode = user_opt.editor_mode
    except ObjectDoesNotExist:
        editor_mode = 1
    if request.method == 'GET':
        # 获取url切换的编辑器模式
        eid = request.GET.get('eid',editor_mode)
        if eid in [1,2,3,4,'1','2','3','4']:
            editor_mode = int(eid)
        try:
            editor_type = _("新建表格") if editor_mode == 4 else _("新建文档")
            pid = request.GET.get('pid',-999)
            project_list = Project.objects.filter(create_user=request.user) # 自己创建的文集列表
            colla_project_list = ProjectCollaborator.objects.filter(user=request.user) # 协作的文集列表
            doctemp_list = DocTemp.objects.filter(create_user=request.user).values('id','name','create_time')
            return render(request, 'app_doc/editor/create_doc.html', locals())
        except Exception as e:
            logger.exception(_("访问创建文档页面出错"))
            return render(request,'404.html')
    elif request.method == 'POST':
        try:
            project = request.POST.get('project','') # 文集ID
            parent_doc = request.POST.get('parent_doc','') # 上级文档ID
            doc_name = request.POST.get('doc_name','') # 文档标题
            doc_tags = request.POST.get('doc_tag','') # 文档标签
            doc_content = request.POST.get('content','') # 文档内容
            pre_content = request.POST.get('pre_content','') # 文档Markdown内容
            sort = request.POST.get('sort','') # 文档排序
            editor_mode = request.POST.get('editor_mode',editor_mode)    #获取文档编辑器
            status = request.POST.get('status',1) # 文档状态
            open_children = request.POST.get('open_children', False)  # 展示下级目录
            show_children = request.POST.get('show_children', False)  # 展示下级目录
            if open_children == 'on':
                open_children = True
            else:
                open_children = False
            if show_children == 'on':
                show_children = True
            else:
                show_children = False
            if project != '' and doc_name != '' and project != '-1':
                # 验证请求者是否有文集的权限
                check_project = Project.objects.filter(id=project,create_user=request.user)
                colla_project = ProjectCollaborator.objects.filter(project=project,user=request.user)
                if check_project.count() > 0 or colla_project.count() > 0:
                    # 判断文集下是否存在同名文档
                    # if Doc.objects.filter(name=doc_name,top_doc=int(project)).exists():
                    #     return JsonResponse({'status':False,'data':_('文集内不允许同名文档')})
                    # 开启事务
                    with transaction.atomic():
                        save_id = transaction.savepoint()
                        try:
                            # 创建文档
                            doc = Doc.objects.create(
                                name=doc_name,
                                content = doc_content,
                                pre_content= pre_content,
                                parent_doc= int(parent_doc) if parent_doc != '' else 0,
                                top_doc= int(project),
                                sort = sort if sort != '' else 9999,
                                create_user=request.user,
                                status = status,
                                editor_mode = editor_mode,
                                open_children = open_children,
                                show_children = show_children
                            )
                            # 设置文档标签
                            for t in doc_tags.split(","):
                                if t != '':
                                    tag = Tag.objects.get_or_create(name=t,create_user=request.user)
                                    DocTag.objects.get_or_create(tag=tag[0],doc=doc)

                            return JsonResponse({'status': True, 'data': {'pro': project, 'doc': doc.id}})
                        except Exception as e:
                            logger.exception(_("创建文档异常"))
                            # 回滚事务
                            transaction.savepoint_rollback(save_id)
                        transaction.savepoint_commit(save_id)
                        return JsonResponse({'status': False, 'data': _('创建失败')})
                else:
                    return JsonResponse({'status':False,'data':_('无权操作此文集')})
            else:
                return JsonResponse({'status':False,'data':_('请确认文档标题、文集正确')})
        except Exception as e:
            logger.exception("创建文档出错")
            return JsonResponse({'status':False,'data':_('请求出错')})
    else:
        return JsonResponse({'status':False,'data':_('方法不允许')})


# 修改文档
@login_required()
@require_http_methods(['GET',"POST"])
def modify_doc(request,doc_id):
    editor_type = _("修改文档")
    if request.method == 'GET':
        try:
            doc = Doc.objects.get(id=doc_id) # 查询文档信息
            editor_mode = doc.editor_mode # 设置文档编辑器为文档上一次使用的编辑模式
            eid = request.GET.get('eid',editor_mode)
            if eid in [1,2,3,'1','2','3']:
                editor_mode = int(eid)
            doc_tags = ','.join([i.tag.name for i in DocTag.objects.filter(doc=doc)]) # 查询文档标签信息
            project = Project.objects.get(id=doc.top_doc) # 查询文档所属的文集信息
            pro_colla = ProjectCollaborator.objects.filter(project=project,user=request.user) # 查询用户的协作文集信息
            if pro_colla.count() == 0:
                is_pro_colla = False
            elif pro_colla[0].role == 1:
                is_pro_colla = True
            else:
                is_pro_colla = False
            project_list = Project.objects.filter(create_user=request.user)  # 自己创建的文集列表
            colla_project_list = ProjectCollaborator.objects.filter(user=request.user)  # 协作的文集列表
            # 判断用户是否有权限进行修改
            if (request.user == doc.create_user) or \
                    (is_pro_colla is True) or \
                    (request.user == project.create_user):
                doc_list = Doc.objects.filter(top_doc=project.id)
                doctemp_list = DocTemp.objects.filter(create_user=request.user)
                history_list = DocHistory.objects.filter(doc=doc).order_by('-create_time')
                return render(request, 'app_doc/editor/modify_doc.html', locals())

            else:
                return render(request,'403.html')
        except Exception as e:
            logger.exception(_("修改文档页面访问出错"))
            return render(request,'404.html')
    elif request.method == 'POST':
        try:
            doc_id = request.POST.get('doc_id','') # 文档ID
            project_id = request.POST.get('project', '') # 文集ID
            parent_doc = request.POST.get('parent_doc', '') # 上级文档ID
            doc_name = request.POST.get('doc_name', '') # 文档名称
            doc_tags = request.POST.get('doc_tag','') # 文档标签
            doc_content = request.POST.get('content', '') # 文档内容
            pre_content = request.POST.get('pre_content', '') # 文档Markdown格式内容
            sort = request.POST.get('sort', '') # 文档排序
            editor_mode = request.POST.get('editor_mode',1)    #获取文档编辑器
            status = request.POST.get('status',1) # 文档状态
            open_children = request.POST.get('open_children',False) # 展示下级目录
            show_children = request.POST.get('show_children', False)  # 展示下级目录
            if open_children == 'on':
                open_children = True
            else:
                open_children = False
            if show_children == 'on':
                show_children = True
            else:
                show_children = False

            if doc_id != '' and project_id != '' and doc_name != '' and project_id != '-1':
                doc = Doc.objects.get(id=doc_id)
                project = Project.objects.get(id=project_id)
                pro_colla = ProjectCollaborator.objects.filter(project=project, user=request.user)
                if pro_colla.count() == 0:
                    is_pro_colla = False
                elif pro_colla[0].role == 1:
                    is_pro_colla = True
                else:
                    is_pro_colla = False
                # 验证用户有权限修改文档 - 文档的创建者或文集的高级协作者
                if (request.user == doc.create_user) or (is_pro_colla is True) or (request.user == project.create_user):
                    # 开启事务
                    with transaction.atomic():
                        save_id = transaction.savepoint()
                        try:
                            # 将现有文档内容写入到文档历史中
                            DocHistory.objects.create(
                                doc = doc,
                                pre_content = doc.pre_content,
                                create_user = request.user
                            )
                            # 更新文档内容
                            Doc.objects.filter(id=int(doc_id)).update(
                                name=doc_name,
                                content=doc_content,
                                pre_content=pre_content,
                                parent_doc=int(parent_doc) if parent_doc != '' else 0,
                                sort=sort if sort != '' else 9999,
                                modify_time = datetime.datetime.now(),
                                status = status,
                                editor_mode = editor_mode,
                                open_children = open_children,
                                show_children = show_children
                            )
                            # 更新文档标签
                            doc_tag_list = doc_tags.split(",") if doc_tags != "" else []
                            # print(doc_tags,doc_tag_list)
                            # 如果没有设置标签，则删除此文档的所有标签
                            if len(doc_tag_list) == 0:
                                DocTag.objects.filter(doc=doc).delete()
                            else:
                                current_doc_tags = [i.tag.name for i in DocTag.objects.filter(doc=doc)] # 获取当前文档的标签
                                # 遍历当前文档标签，如果不在新的标签列表，则删除
                                for tag in current_doc_tags:
                                    if tag not in doc_tag_list:
                                        tag = Tag.objects.get(name=tag,create_user=request.user)
                                        DocTag.objects.filter(doc=doc,tag=tag).delete()
                                # 遍历新的标签列表，如果不在当前文档标签中，则创建
                                for t in doc_tag_list:
                                    if t not in current_doc_tags and current_doc_tags != '':
                                        tag = Tag.objects.get_or_create(name=t, create_user=request.user)
                                        DocTag.objects.get_or_create(tag=tag[0], doc=doc)

                            return JsonResponse({'status': True, 'data': _('修改成功')})
                        except:
                            logger.exception(_("修改文档异常"))
                            # 回滚事务
                            transaction.savepoint_rollback(save_id)
                        transaction.savepoint_commit(save_id)
                    return JsonResponse({'status': False, 'data': _('修改失败')})

                else:
                    return JsonResponse({'status':False,'data':_('未授权请求')})
            else:
                return JsonResponse({'status': False,'data':_('参数错误')})
        except Exception as e:
            logger.exception(_("修改文档出错"))
            return JsonResponse({'status':False,'data':_('请求出错')})


# 删除文档 - 软删除 - 进入回收站
@login_required()
@require_http_methods(["POST"])
def del_doc(request):
    try:
        # 获取文档ID
        doc_id = request.POST.get('doc_id',None)
        range = request.POST.get('range', 'single')
        if doc_id:
            if range == 'single':
                # 查询文档
                try:
                    doc = Doc.objects.get(id=doc_id)
                    try:
                        project = Project.objects.get(id=doc.top_doc) # 查询文档所属的文集
                    except ObjectDoesNotExist:
                        logger.error(_("文档{}的所属文集不存在。".format(doc_id)))
                        project = 0
                    # 获取文档所属文集的协作信息
                    pro_colla = ProjectCollaborator.objects.filter(project=project,user=request.user)
                    if pro_colla.exists():
                        colla_user_role = pro_colla[0].role
                    else:
                        colla_user_role = 0
                except ObjectDoesNotExist:
                    return JsonResponse({'status': False, 'data': '文档不存在'})
                # 如果请求用户为站点管理员、文档创建者、高级权限的协作者、文集的创建者，可以删除
                if (request.user == doc.create_user) \
                        or (colla_user_role == 1) \
                        or (request.user == project.create_user)\
                        or (request.user.is_superuser):
                    # 修改状态为删除
                    doc.status = 3
                    doc.modify_time = datetime.datetime.now()
                    doc.save()
                    # 修改其下级所有文档状态为删除
                    chr_doc = Doc.objects.filter(parent_doc=doc_id) # 获取下级文档
                    chr_doc_ids = chr_doc.values_list('id',flat=True) # 提取下级文档的ID
                    chr_doc.update(status=3,modify_time=datetime.datetime.now()) # 修改下级文档的状态为删除
                    Doc.objects.filter(parent_doc__in=list(chr_doc_ids)).update(status=3,modify_time=datetime.datetime.now()) # 修改下级文档的下级文档状态

                    return JsonResponse({'status': True, 'data': _('删除完成')})
                else:
                    return JsonResponse({'status': False, 'data': _('非法请求')})
            elif range == 'multi':
                docs = doc_id.split(",")
                try:
                    # 管理员无需验证权限
                    if request.user.is_superuser:
                        Doc.objects.filter(id__in=docs).update(status=3,modify_time=datetime.datetime.now())
                        Doc.objects.filter(parent_doc__in=docs).update(status=3, modify_time=datetime.datetime.now())
                    else:
                        Doc.objects.filter(id__in=docs,create_user=request.user).update(status=3,modify_time=datetime.datetime.now())
                        Doc.objects.filter(parent_doc__in=docs).update(status=3,modify_time=datetime.datetime.now())
                    return JsonResponse({'status': True, 'data': _('删除完成')})
                except:
                    return JsonResponse({'status': False, 'data': _('非法请求')})
            else:
                return JsonResponse({'status': False, 'data': _('类型错误')})

        else:
            return JsonResponse({'status':False,'data':_('参数错误')})
    except Exception as e:
        logger.exception(_("删除文档出错"))
        return JsonResponse({'status':False,'data':_('请求出错')})


# 管理文档
@login_required()
@require_http_methods(['GET','POST'])
def manage_doc(request):
    if request.method == 'GET':
        # 文集列表
        project_list = Project.objects.filter(create_user=request.user)  # 自己创建的文集列表
        colla_project_list = ProjectCollaborator.objects.filter(user=request.user)  # 协作的文集列表
        # 文档数量
        # 已发布文档数量
        published_doc_cnt = Doc.objects.filter(create_user=request.user, status=1).count()
        # 草稿文档数量
        draft_doc_cnt = Doc.objects.filter(create_user=request.user, status=0).count()
        # 回收站文档数量
        recycle_doc_cnt = Doc.objects.filter(create_user=request.user, status=3).count()
        # 所有文档数量
        all_cnt = published_doc_cnt + draft_doc_cnt + recycle_doc_cnt
        return render(request,'app_doc/manage/manage_doc.html',locals())
    else:
        kw = request.POST.get('kw', '')
        project = request.POST.get('project','')
        status = request.POST.get('status','')
        if status == '-1': # 全部文档
            q_status = [0,1]
        elif status in ['0','1']:
            q_status = [int(status)]
        else:
            q_status = [0, 1]

        if project == '':
            project_list = Project.objects.filter(create_user=request.user).values_list('id',flat=True)  # 自己创建的文集列表
            colla_project_list = ProjectCollaborator.objects.filter(user=request.user).values_list('project__id',flat=True)  # 协作的文集列表
            q_project = list(project_list) + list(colla_project_list)
        else:
            q_project = [project]

        page = request.POST.get('page', 1)
        limit = request.POST.get('limit', 10)
        # 没有搜索
        if kw == '':
            doc_list = Doc.objects.filter(
                create_user=request.user,
                status__in=q_status,
                top_doc__in=q_project
            ).order_by('-modify_time')
        # 有搜索
        else:
            doc_list = Doc.objects.filter(
                Q(content__icontains=kw) | Q(name__icontains=kw),
                create_user=request.user,status__in=q_status,top_doc__in=q_project
            ).order_by('-modify_time')

        # 文集列表
        project_list = Project.objects.filter(create_user=request.user)  # 自己创建的文集列表
        colla_project_list = ProjectCollaborator.objects.filter(user=request.user)  # 协作的文集列表

        # 文档数量
        # 已发布文档数量
        published_doc_cnt = Doc.objects.filter(create_user=request.user, status=1).count()
        # 草稿文档数量
        draft_doc_cnt = Doc.objects.filter(create_user=request.user, status=0).count()
        # 所有文档数量
        all_cnt = published_doc_cnt + draft_doc_cnt

        # 分页处理
        paginator = Paginator(doc_list, limit)
        page = request.GET.get('page', page)
        try:
            docs = paginator.page(page)
        except PageNotAnInteger:
            docs = paginator.page(1)
        except EmptyPage:
            docs = paginator.page(paginator.num_pages)

        table_data = []
        for doc in docs:
            item = {
                'id': doc.id,
                'name': doc.name,
                'parent':Doc.objects.get(id=doc.parent_doc).name if doc.parent_doc != 0 else '无',
                'project_id': Project.objects.get(id=doc.top_doc).id,
                'project_name':Project.objects.get(id=doc.top_doc).name,
                'status':doc.status,
                'editor_mode':doc.editor_mode,
                'open_children':doc.open_children,
                'create_time': doc.create_time,
                'modify_time': doc.modify_time
            }
            table_data.append(item)
        resp_data = {
            "code": 0,
            "msg": "ok",
            "count": doc_list.count(),
            "data": jsonXssFilter(table_data)
        }
        return JsonResponse(resp_data)


# 移动文档
@login_required()
@require_http_methods(['POST'])
def move_doc(request):
    doc_id = request.POST.get('doc_id','') # 文档ID
    pro_id = request.POST.get('pro_id','') # 移动的文集ID
    move_type = request.POST.get('move_type','') # 移动的类型 0复制 1移动 2连同下级文档移动
    parent_id = request.POST.get('parent_id',0)
    # 判断文集是否存在且有权限
    try:
        project = Project.objects.get(id=int(pro_id)) # 自己的文集
        colla = ProjectCollaborator.objects.filter(project=project, user=request.user) # 协作文集
        if (project.create_user != request.user) and (colla.count() == 0) : # 文集创建者
            print(project.create_user,request.user,colla.count())
            return JsonResponse({'status':False,'data':_('文集无权限')})
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':_('文集不存在')})
    # 判断源文档是否存在且有操作权限
    try:
        doc = Doc.objects.get(id=int(doc_id)) # 查询源文档
        source_project = Project.objects.get(id=doc.top_doc) # 查询源文档所属的文集
        # 查询源文档所属文集的协作者
        source_colla = ProjectCollaborator.objects.filter(project=source_project, user=request.user,role=1)
        # 如果请求者既不是文档的创建者，又不是文档所属文集的创建者，也不是文档所属文集的高级协作成员
        if  (doc.create_user != request.user) and \
                (source_project.create_user != request.user) and \
                (source_colla.count() == 0):
            return JsonResponse({'status':False,'data':_("无权操作文档")})
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':_('文档不存在')})
    # 判断上级文档是否存在
    try:
        if parent_id != '0':
            parent = Doc.objects.get(id=int(parent_id), top_doc=pro_id, status=1)
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':_('上级文档不存在')})
    # 复制文档
    if move_type == '0':
        copy_doc = Doc.objects.create(
            name = doc.name,
            pre_content = doc.pre_content,
            content = doc.content,
            parent_doc = parent_id,
            top_doc = int(pro_id),
            editor_mode = doc.editor_mode,
            create_user = request.user,
            create_time = datetime.datetime.now(),
            modify_time = datetime.datetime.now(),
            # 文档状态说明：0表示草稿状态，1表示发布状态
            status = doc.status
        )
        return JsonResponse({'status':True,'data':{'pro_id':pro_id,'doc_id':copy_doc.id}})
    # 移动文档，下级文档更改到根目录
    elif move_type == '1':
        try:
            # 修改文档的所属文集和上级文档实现移动文档
            Doc.objects.filter(id=int(doc_id)).update(parent_doc=int(parent_id),top_doc=int(pro_id))
            # 修改其子文档为顶级文档
            Doc.objects.filter(parent_doc=doc_id).update(parent_doc=0)
            return JsonResponse({'status':True,'data':{'pro_id':pro_id,'doc_id':doc_id}})
        except:
            logger.exception(_("移动文档异常"))
            return JsonResponse({'status':False,'data':_('移动文档失败')})
    # 包含下级文档一起移动
    elif move_type == '2':
        try:
            # 修改文档的所属文集和上级文档实现移动文档
            Doc.objects.filter(id=int(doc_id)).update(parent_doc=int(parent_id), top_doc=int(pro_id))
            # 修改其子文档的文集归属
            child_doc = Doc.objects.filter(parent_doc=doc_id)
            child_doc.update(top_doc=int(pro_id))
            # 遍历子文档，如果其存在下级文档，那么继续修改所属文集
            for child in child_doc:
                Doc.objects.filter(parent_doc=child.id).update(top_doc=int(pro_id))
            return JsonResponse({'status': True, 'data':{'pro_id':pro_id,'doc_id':doc_id}})
        except:
            logger.exception(_("移动包含下级的文档异常"))
            return JsonResponse({'status': False, 'data': _('移动文档失败')})
    else:
        return JsonResponse({'status':False,'data':_('移动类型错误')})


# 查看对比文档历史版本
@login_required()
@require_http_methods(['GET',"POST"])
def diff_doc(request,doc_id,his_id):
    if request.method == 'GET':
        try:
            doc = Doc.objects.get(id=doc_id)  # 查询文档信息
            project = Project.objects.get(id=doc.top_doc)  # 查询文档所属的文集信息
            pro_colla = ProjectCollaborator.objects.filter(project=project, user=request.user)  # 查询用户的协作文集信息
            if (request.user == doc.create_user) or (pro_colla[0].role == 1) or (request.user.is_superuser):
                history = DocHistory.objects.get(id=his_id)
                history_list = DocHistory.objects.filter(doc=doc).order_by('-create_time')
                if history.doc == doc:
                    return render(request, 'app_doc/diff_doc.html', locals())
                else:
                    return render(request, '403.html')
            else:
                return render(request, '403.html')
        except Exception as e:
            logger.exception(_("文档历史版本页面访问出错"))
            return render(request, '404.html')

    elif request.method == 'POST':
        try:
            doc = Doc.objects.get(id=doc_id)  # 查询文档信息
            project = Project.objects.get(id=doc.top_doc)  # 查询文档所属的文集信息
            pro_colla = ProjectCollaborator.objects.filter(project=project, user=request.user)  # 查询用户的协作文集信息
            if (request.user == doc.create_user) or (pro_colla[0].role == 1) or (request.user.is_superuser):
                history = DocHistory.objects.get(id=his_id)
                if history.doc == doc:
                    return JsonResponse({'status':True,'data':history.pre_content})
                else:
                    return JsonResponse({'status': False, 'data': _('非法请求')})
            else:
                return JsonResponse({'status':False,'data':_('非法请求')})
        except Exception as e:
            logger.exception(_("文档历史版本获取出错"))
            return JsonResponse({'status':False,'data':_('获取异常')})


# 管理文档历史版本
@login_required()
@require_http_methods(['GET',"POST"])
def manage_doc_history(request,doc_id):
    if request.method == 'GET':
        try:
            doc = Doc.objects.get(id=doc_id,create_user=request.user)
            history_list = DocHistory.objects.filter(create_user=request.user,doc=doc_id).order_by('-create_time')
            paginator = Paginator(history_list, 15)
            page = request.GET.get('page', 1)
            try:
                historys = paginator.page(page)
            except PageNotAnInteger:
                historys = paginator.page(1)
            except EmptyPage:
                historys = paginator.page(paginator.num_pages)
            return render(request, 'app_doc/manage/manage_doc_history.html', locals())
        except Exception as e:
            logger.exception(_("管理文档历史版本页面访问出错"))
            return render(request, '404.html')
    elif request.method == 'POST':
        try:
            history_id = request.POST.get('history_id','')
            DocHistory.objects.filter(id=history_id,doc=doc_id,create_user=request.user).delete()
            return JsonResponse({'status':True,'data':_('删除成功')})
        except:
            logger.exception(_("操作文档历史版本出错"))
            return JsonResponse({'status':False,'data':_('出现异常')})


# 文档回收站
@login_required()
@require_http_methods(['GET','POST'])
def doc_recycle(request):
    if request.method == 'GET':
        # 获取状态为删除的文档
        doc_list = Doc.objects.filter(status=3,create_user=request.user).order_by('-modify_time')
        # 分页处理
        paginator = Paginator(doc_list, 15)
        page = request.GET.get('page', 1)
        try:
            docs = paginator.page(page)
        except PageNotAnInteger:
            docs = paginator.page(1)
        except EmptyPage:
            docs = paginator.page(paginator.num_pages)
        return render(request,'app_doc/manage/manage_doc_recycle.html',locals())
    elif request.method == 'POST':
        try:
            # 获取参数
            doc_id = request.POST.get('doc_id', None) # 文档ID
            types = request.POST.get('type',None) # 操作类型
            if doc_id:
                # 查询文档
                try:
                    doc = Doc.objects.get(id=doc_id)
                    project = Project.objects.get(id=doc.top_doc)  # 查询文档所属的文集
                    # 获取文档所属文集的协作信息
                    pro_colla = ProjectCollaborator.objects.filter(project=project, user=request.user)  #
                    if pro_colla.exists():
                        colla_user_role = pro_colla[0].role
                    else:
                        colla_user_role = 0
                except ObjectDoesNotExist:
                    return JsonResponse({'status': False, 'data': _('文档不存在')})
                # 如果请求用户为文档创建者、高级权限的协作者、文集的创建者，可以操作
                if (request.user == doc.create_user) or (colla_user_role == 1) or (request.user == project.create_user):
                    # 还原文档
                    if types == 'restore':
                        # 修改状态为草稿
                        doc.status = 0
                        doc.modify_time = datetime.datetime.now()
                        doc.save()
                    # 删除文档
                    elif types == 'del':
                        # 删除文档历史、分享、标签
                        DocHistory.objects.filter(doc=doc).delete()
                        DocShare.objects.filter(doc=doc).delete()
                        DocTag.objects.filter(doc=doc).delete()
                        # 删除文档
                        doc.delete()
                    else:
                        return JsonResponse({'status':False,'data':_('无效请求')})
                    return JsonResponse({'status': True, 'data': _('删除完成')})
                else:
                    return JsonResponse({'status': False, 'data': _('非法请求')})
            # 清空回收站
            elif types == 'empty':
                docs = Doc.objects.filter(status=3,create_user=request.user)
                for doc in docs:
                    # 删除文档历史、分享、标签
                    DocHistory.objects.filter(doc=doc).delete()
                    DocShare.objects.filter(doc=doc).delete()
                    DocTag.objects.filter(doc=doc).delete()
                docs.delete()
                return JsonResponse({'status': True, 'data': _('清空成功')})
            # 还原回收站
            elif types == 'restoreAll':
                Doc.objects.filter(status=3,create_user=request.user).update(status=0)
                return JsonResponse({'status': True, 'data': _('还原成功')})
            else:
                return JsonResponse({'status': False, 'data': _('参数错误')})
        except Exception as e:
            logger.exception(_("处理文档出错"))
            return JsonResponse({'status': False, 'data': _('请求出错')})


# 一键发布文档
@login_required()
@require_http_methods(['POST'])
def fast_publish_doc(request):
    doc_id = request.POST.get('doc_id',None)
    # 查询文档
    try:
        doc = Doc.objects.get(id=doc_id)
        project = Project.objects.get(id=doc.top_doc)  # 查询文档所属的文集
        # 获取文档所属文集的协作信息
        pro_colla = ProjectCollaborator.objects.filter(project=project, user=request.user)  #
        if pro_colla.exists():
            colla_user_role = pro_colla[0].role
        else:
            colla_user_role = 0
    except ObjectDoesNotExist:
        return JsonResponse({'status': False, 'data': _('文档不存在')})
    # 判断请求者是否有权限（文档创建者、文集创建者、文集高级协作者）
    # 如果请求用户为文档创建者、高级权限的协作者、文集的创建者，可以删除
    if (request.user == doc.create_user) or (colla_user_role == 1) or (request.user == project.create_user):
        try:
            doc.status = 1
            doc.modify_time = datetime.datetime.now()
            doc.save()
            return JsonResponse({'status':True,'data':_('发布成功')})
        except:
            logger.exception(_("文档一键发布失败"))
            return JsonResponse({'status':False,'data':_('发布失败')})
    else:
        return JsonResponse({'status':False,'data':_('非法请求')})


# 私密文档分享
@require_http_methods(['GET','POST'])
def share_doc(request):
    if request.method == 'GET':
        share_token = request.GET.get('token')
        # 判断是否存在分享
        try:
            share_doc = DocShare.objects.get(token=share_token,is_enable=True)
            doc = share_doc.doc
            # 公开分享
            if share_doc.share_type == 0:
                return render(request, 'app_doc/share/share_doc.html', locals())
            # 私密分享
            else:
                doc_id_base64 = base64.standard_b64encode(str(share_doc.doc.id).encode())
                # 不存在公开分享的文档，则判断验证分享码
                share_cookie_name = 'sharedoc-{}'.format(share_token)
                share_value = request.COOKIES.get(share_cookie_name) if share_cookie_name in request.COOKIES.keys() else 0
                if share_doc.share_value == share_value:
                    return render(request, 'app_doc/share/share_doc.html', locals())
                else:
                    return redirect('/share_doc_check/?surl={}'.format(share_token))
        except ObjectDoesNotExist:
            return render(request,'404.html')
    elif request.method == 'POST':
        doc_id = request.POST.get('id')
        try:
            # 获取请求参数
            doc = Doc.objects.get(id=doc_id)
            has_role = check_user_project_writer_role(request.user.id, doc.top_doc)
            if has_role is False:
                return JsonResponse({'status': False, 'data': _('无操作权限')})
            share_type = request.POST.get('share_type',0)
            share_value = request.POST.get('share_value',0)
            is_enable = request.POST.get('is_enable',True)
            if is_enable == 'false':
                is_enable = False
            else:
                is_enable = True
            # 生成分享文档Token
            share_token = hashlib.md5()
            share_token.update("{}_{}".format(doc_id,request.user.username).encode())
            share_token = share_token.hexdigest()
            # 创建或更新分享信息
            doc_share = DocShare.objects.update_or_create(
                token=share_token,
                defaults={'doc': doc,
                          'share_type': share_type,
                          'share_value':share_value,
                          'is_enable':is_enable
                          }
            )
            if int(share_type) == 0:
                data = {
                    'doc':share_token
                }
            else:
                data = {
                    'doc': share_token,
                    'share_value':share_value
                }
            return JsonResponse({'status':True,'data':data})
        except ObjectDoesNotExist:
            return JsonResponse({'status':False,'data':_('文档不存在')})


# 验证文档分享码
def share_doc_check(request):
    doc_token = request.GET.get('surl', '')
    if request.method == 'GET':
        if doc_token != '':
            doc_share = DocShare.objects.get(token=doc_token)
            share_cookie_name = 'sharedoc-{}'.format(doc_token)
            share_value = request.COOKIES.get(share_cookie_name) if share_cookie_name in request.COOKIES.keys() else 0
            if doc_share.share_value == share_value:
                return redirect("/share_doc/?token={}".format(doc_token))
            else:
                return render(request,'app_doc/share/share_check.html',locals())
        else:
            return render(request,'404.html')
    else:
        # 接收参数值
        share_value = request.POST.get('share_value','')
        # 查询数据
        if DocShare.objects.filter(token=doc_token,share_type=1,share_value=share_value).exists():
            obj = redirect("/share_doc/?token={}".format(doc_token))
            obj.set_cookie('sharedoc-{}'.format(doc_token),share_value)
            return obj
        else:
            errormsg = _("分享码错误")
            return render(request, 'app_doc/share/share_check.html', locals())


# 管理文档分享
@login_required()
@require_http_methods(['GET','POST'])
def manage_doc_share(request):
    if request.method == 'GET':
        return render(request, 'app_doc/manage/manage_doc_share.html', locals())
    else:
        types = request.POST.get('type')
        # 请求类型 1：获取列表 2：删除 3：修改
        if types == '1':
            page = request.POST.get('page', 1)
            limit = request.POST.get('limit', 10)
            # share_doc = DocShare.objects.filter(doc__create_user=request.user).order_by('-create_time')
            docshare_list = DocShare.objects.filter(doc__create_user=request.user).order_by('-create_time')
            paginator = Paginator(docshare_list, limit)
            page = request.GET.get('page', page)
            try:
                docshares = paginator.page(page)
            except PageNotAnInteger:
                docshares = paginator.page(1)
            except EmptyPage:
                docshares = paginator.page(paginator.num_pages)
            share_list = []
            for doc in docshares:
                item = {
                    'token':doc.token,
                    'doc_name':doc.doc.name,
                    'share_type':doc.share_type,
                    'share_value':doc.share_value,
                    'share_status':doc.is_enable,
                    'create_time':doc.create_time
                }
                share_list.append(item)
            resp_data = {
                "code":0,
                "msg":"ok",
                "count":docshare_list.count(),
                "data":share_list
            }
            return JsonResponse(resp_data)
        # 删除
        elif types == '2':
            range = request.POST.get("range")
            token = request.POST.get("token")
            if range == 'single':
                try:
                    share = DocShare.objects.get(token=token,doc__create_user=request.user)
                    share.delete()
                    return JsonResponse({'status':True,'data':'ok'})
                except:
                    return JsonResponse({'status':False,'data':_('无指定内容')})
            elif range == "multi":
                tokens = token.split(",")
                try:
                    share = DocShare.objects.filter(token__in=tokens,doc__create_user=request.user)
                    share.delete()
                    return JsonResponse({'status':True,'data':'ok'})
                except:
                    return JsonResponse({'status':False,'data':_('无指定内容')})
            else:
                return JsonResponse({'status':False,'data':_('类型错误')})
        # 修改
        elif types == '3':
            token = request.POST.get("token",'')
            name = request.POST.get('key','')
            value = request.POST.get('value','')
            # 修改分享状态
            if name == 'share_status':
                is_enable = True if value == 'true' else False
                DocShare.objects.filter(token=token).update(is_enable=is_enable)
            # 修改分享类型
            elif name == 'share_type':
                share_type = 0 if value == '0' else 1
                DocShare.objects.filter(token=token).update(share_type=share_type)
            else:
                return JsonResponse({'status':False,'data':_('参数错误')})
            return JsonResponse({'status':True,'data':'ok'})


# 创建文档模板
@login_required()
@require_http_methods(['GET',"POST"])
def create_doctemp(request):
    if request.method == 'GET':
        editor_type = _("新建文档模板")
        # 获取用户的编辑器模式
        try:
            user_opt = UserOptions.objects.get(user=request.user)
            editor_mode = user_opt.editor_mode
        except ObjectDoesNotExist:
            editor_mode = 1
        doctemps = DocTemp.objects.filter(create_user=request.user)
        return render(request,'app_doc/editor/create_doctemp.html',locals())
    elif request.method == 'POST':
        try:
            name = request.POST.get('name','')
            content = request.POST.get('content','')
            if name != '':
                doctemp = DocTemp.objects.create(
                    name = name,
                    content = content,
                    create_user=request.user
                )
                doctemp.save()
                return JsonResponse({'status':True,'data':doctemp.id})
            else:
                return JsonResponse({'status':False,'data':_('模板标题不能为空')})
        except Exception as e:
            logger.exception(_("创建文档模板出错"))
            return JsonResponse({'status':False,'data':_('请求出错')})


# 修改文档模板
@login_required()
@require_http_methods(['GET',"POST"])
def modify_doctemp(request,doctemp_id):
    if request.method == 'GET':
        editor_type = _('修改文档模板')
        try:
            doctemp = DocTemp.objects.get(id=doctemp_id)
            if request.user.id == doctemp.create_user.id:
                # 获取用户的编辑器模式
                try:
                    user_opt = UserOptions.objects.get(user=request.user)
                    editor_mode = user_opt.editor_mode
                except ObjectDoesNotExist:
                    editor_mode = 1
                doctemps = DocTemp.objects.filter(create_user=request.user)
                return render(request,'app_doc/editor/modify_doctemp.html',locals())
            else:
                return HttpResponse(_('非法请求'))
        except Exception as e:
            logger.exception(_("访问文档模板修改页面出错"))
            return render(request, '404.html')
    elif request.method == 'POST':
        try:
            doctemp_id = request.POST.get('doctemp_id','')
            name = request.POST.get('name','')
            content = request.POST.get('content','')
            if doctemp_id != '' and name !='':
                doctemp = DocTemp.objects.get(id=doctemp_id)
                if request.user.id == doctemp.create_user.id:
                    doctemp.name = name
                    doctemp.content = content
                    doctemp.save()
                    return JsonResponse({'status':True,'data':_('修改成功')})
                else:
                    return JsonResponse({'status':False,'data':_('非法操作')})
            else:
                return JsonResponse({'status':False,'data':_('参数错误')})
        except Exception as e:
            logger.exception(_("修改文档模板出错"))
            return JsonResponse({'status':False,'data':_('请求出错')})


# 删除文档模板
@login_required()
def del_doctemp(request):
    try:
        doctemp_id = request.POST.get('doctemp_id','')
        if doctemp_id != '':
            doctemp = DocTemp.objects.get(id=doctemp_id)
            if request.user.id == doctemp.create_user.id:
                doctemp.delete()
                return JsonResponse({'status':True,'data':_('删除完成')})
            else:
                return JsonResponse({'status':False,'data':_('非法请求')})
        else:
            return JsonResponse({'status': False, 'data': _('参数错误')})
    except Exception as e:
        logger.exception(_("删除文档模板出错"))
        return JsonResponse({'status':False,'data':_('请求出错')})


# 管理文档模板
@login_required()
@require_http_methods(['GET'])
def manage_doctemp(request):
    try:
        search_kw = request.GET.get('kw', None)
        if search_kw:
            doctemp_list = DocTemp.objects.filter(
                create_user=request.user,
                content__icontains=search_kw
            ).order_by('-modify_time')
            paginator = Paginator(doctemp_list, 10)
            page = request.GET.get('page', 1)
            try:
                doctemps = paginator.page(page)
            except PageNotAnInteger:
                doctemps = paginator.page(1)
            except EmptyPage:
                doctemps = paginator.page(paginator.num_pages)
            doctemps.kw = search_kw
        else:
            doctemp_list = DocTemp.objects.filter(create_user=request.user).order_by('-modify_time')
            paginator = Paginator(doctemp_list, 10)
            page = request.GET.get('page', 1)
            try:
                doctemps = paginator.page(page)
            except PageNotAnInteger:
                doctemps = paginator.page(1)
            except EmptyPage:
                doctemps = paginator.page(paginator.num_pages)
        return render(request, 'app_doc/manage/manage_doctemp.html', locals())
    except Exception as e:
        logger.exception(_("管理文档模板页面访问出错"))
        return render(request, '404.html')


# 获取指定文档模板
@login_required()
@require_http_methods(["POST"])
def get_doctemp(request):
    try:
        doctemp_id = request.POST.get('doctemp_id','')
        if doctemp_id != '':
            content = DocTemp.objects.get(id=int(doctemp_id)).serializable_value('content')
            return JsonResponse({'status':True,'data':content})
        else:
            return JsonResponse({'status':False,'data':_('参数错误')})
    except Exception as e:
        logger.exception(_("获取指定文档模板出错"))
        return JsonResponse({'status':False,'data':_('请求出错')})


# 获取指定文集的所有文档
@require_http_methods(["POST"])
@logger.catch()
def get_pro_doc(request):
    pro_id = request.POST.get('pro_id','')
    if pro_id != '':
        # 获取文集所有文档的id、name和parent_doc3个字段
        doc_list = Doc.objects.filter(top_doc=int(pro_id),status=1).values_list('id','name','parent_doc').order_by('parent_doc')
        item_list = []
        # 遍历文档
        for doc in doc_list:
            # 如果文档为顶级文档
            if doc[2] == 0:
                # 将其数据添加到列表中
                item = [
                    doc[0],doc[1],doc[2],''
                ]
                item_list.append(item)
            # 如果文档不是顶级文档
            else:
                # 查询文档的上级文档
                try:
                    parent = Doc.objects.get(id=doc[2])
                except ObjectDoesNotExist:
                    return JsonResponse({'status':False,'data':'文档id不存在'})
                # 如果文档上级文档的上级是顶级文档，那么将其添加到列表
                if parent.parent_doc == 0: # 只要二级目录
                    item = [
                        doc[0],doc[1],doc[2],parent.name+' --> '
                    ]
                    item_list.append(item)
        return JsonResponse({'status':True,'data':list(item_list)})
    else:
        return JsonResponse({'status':False,'data':_('参数错误')})


# 获取指定文集的文档树数据
@require_http_methods(['POST'])
@logger.catch()
def get_pro_doc_tree(request):
    pro_id = request.POST.get('pro_id', None)
    is_page = request.POST.get('is_page', False)
    if pro_id:
        # 查询存在上级文档的文档
        parent_id_list = Doc.objects.filter(top_doc=pro_id,status=1).exclude(parent_doc=0).values_list('parent_doc',flat=True)
        # 获取存在上级文档的上级文档ID
        # print(parent_id_list)
        doc_list = []
        # 获取一级文档
        top_docs = Doc.objects.filter(top_doc=pro_id,parent_doc=0,status=1).values('id','name','modify_time').order_by('sort')
        # 遍历一级文档
        for doc in top_docs:
            top_item = {
                'id':doc['id'],
                'field':doc['name'],
                'title':doc['name'],
                'modify_time':doc['modify_time'],
                'spread':True,
                'level':1
            }
            # 如果一级文档存在下级文档，查询其二级文档
            if doc['id'] in parent_id_list:
                # 获取二级文档
                sec_docs = Doc.objects.filter(top_doc=pro_id,parent_doc=doc['id'],status=1).values('id','name','modify_time').order_by('sort')
                top_item['children'] = []
                for doc in sec_docs:
                    sec_item = {
                        'id': doc['id'],
                        'field': doc['name'],
                        'title': doc['name'],
                        'modify_time': doc['modify_time'],
                        'level':2
                    }
                    # 如果二级文档存在下级文档，查询第三级文档
                    if doc['id'] in parent_id_list:
                        # 获取三级文档
                        thr_docs = Doc.objects.filter(top_doc=pro_id,parent_doc=doc['id'],status=1).values('id','name','modify_time').order_by('sort')
                        sec_item['children'] = []
                        for doc in thr_docs:
                            item = {
                                'id': doc['id'],
                                'field': doc['name'],
                                'title': doc['name'],
                                'modify_time': doc['modify_time'],
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
        doc_list = jsonXssFilter(doc_list)
        if is_page is False:
            return JsonResponse({'status':True,'data':doc_list})
        else:
            # 分页处理
            paginator = Paginator(doc_list, 20)
            page = request.POST.get('page', 1)
            doc_id = request.POST.get('doc_id', None)
            if doc_id:
                data_index = -1
                for index, item in enumerate(doc_list):
                    if item.get('id') == int(doc_id):
                        data_index = index
                        break

                if data_index != -1:
                    # 计算指定 doc_id 所在的分页页码
                    items_per_page = 20  # 每页显示的数量，需要和分页器中设置的数量保持一致
                    page = data_index // items_per_page + 1
                    # print("文档页码：", page)
            try:
                project_toc = paginator.page(page)
            except PageNotAnInteger:
                project_toc = paginator.page(1)
            except EmptyPage:
                project_toc = paginator.page(paginator.num_pages)

            resp = {'status': True, "total": len(doc_list), 'data': list(project_toc), 'current': page}
            return JsonResponse(resp)
    else:
        return JsonResponse({'status':False,'data':_('参数错误')})


# 404页面
def handle_404(request):
    return render(request,'404.html')

# 导出文集MD文件
@login_required()
@require_http_methods(["POST"])
def report_md(request):
    pro_id = request.POST.get('project_id','')
    types = request.POST.get('type','single')
    user = request.user
    if types == 'single':
        try:
            if user.is_superuser is False:
                Project.objects.get(id=int(pro_id),create_user=user)
            project_md = ReportMD(
                project_id=int(pro_id)
            )
            md_file_path = project_md.work() # 生成并获取MD文件压缩包绝对路径
            md_file_filename = os.path.split(md_file_path)[-1] # 提取文件名
            md_file = "/media/reportmd_temp/"+ md_file_filename # 拼接相对链接
            return JsonResponse({'status':True,'data':md_file})
        except ObjectDoesNotExist as e:
            return JsonResponse({'status': False, 'data': _('文集不存在')})
        except Exception as e:
            logger.exception(_("导出文集MD文件出错"))
            return JsonResponse({'status': False, 'data': _('导出文集异常')})
    elif types == 'multi':
        project_list = pro_id.split(',')
        for project in project_list:
            try:
                Project.objects.get(id=project,create_user=request.user)
            except ObjectDoesNotExist:
                return JsonResponse({'status':False,'data':_('无权限')})
        project_md = ReportMdBatch(
            project_id_list = project_list,
            username = request.user.username
        )
        try:
            md_file_path = project_md.work()  # 生成并获取MD文件压缩包绝对路径
        except:
            logger.exception("文集导出异常")
            return JsonResponse({'status': False, 'data': _('文集导出异常')})
        md_file_filename = os.path.split(md_file_path)[-1]  # 提取文件名
        md_file = "/media/reportmd_temp/" + md_file_filename  # 拼接相对链接
        return JsonResponse({'status': True, 'data': md_file})

    else:
        return JsonResponse({'status':False,'data':_('无效参数')})


# 生成文集文件 - 个人中心 - 文集管理
@login_required()
@require_http_methods(["POST"])
def genera_project_file(request):
    report_type = request.POST.get('types',None) # 获取前端传入到导出文件类型参数
    # 导出EPUB文件
    pro_id = request.POST.get('pro_id')
    try:
        project = Project.objects.get(id=int(pro_id))
        # 获取文集的协作用户信息
        if request.user.is_authenticated:
            colla_user = ProjectCollaborator.objects.filter(project=project, user=request.user)
            if colla_user.exists():
                colla_user_role = colla_user[0].role
                colla_user = colla_user.count()
            else:
                colla_user = colla_user.count()
        else:
            colla_user = 0

        # 公开的文集 - 可以直接导出
        if project.role == 0:
            allow_export = True

        # 私密文集 - 非创建者和协作者不可导出
        elif (project.role == 1):
            if (request.user != project.create_user) and (colla_user == 0):
                allow_export = False
            else:
                allow_export = True

        # 指定用户可见文集 - 指定用户、文集创建者和协作者可导出
        elif project.role == 2:
            user_list = project.role_value
            if request.user.is_authenticated:  # 认证用户判断是否在许可用户列表中
                if (request.user.username not in user_list) and \
                        (request.user != project.create_user) and \
                        (colla_user == 0):  # 访问者不在指定用户之中，也不是协作者
                    allow_export = False
                else:
                    allow_export = True
            else:  # 游客直接返回404
                allow_export = False

        # 访问码可见文集 - 文集创建者、协作者和通过验证即可导出
        elif project.role == 3:
            # 浏览用户不为创建者和协作者 - 需要访问码
            if (request.user != project.create_user) and (colla_user == 0):
                viewcode = project.role_value
                viewcode_name = 'viewcode-{}'.format(project.id)
                r_viewcode = request.COOKIES[
                    viewcode_name] if viewcode_name in request.COOKIES.keys() else 0  # 从cookie中获取访问码
                if viewcode != r_viewcode:  # cookie中的访问码不等于文集访问码，不可导出
                    allow_export = False
                else:
                    allow_export = True
            else:
                allow_export = True
        else:
            allow_export = False

        # 允许被导出
        if allow_export:
            # 导出EPUB
            if report_type in ['epub']:
                try:
                    report_project = ReportEPUB(
                        project_id=project.id
                    ).work()
                    # print(report_project)
                    report_file_path = report_project.split('media', maxsplit=1)[-1] # 导出文件的路径
                    epub_file = '/media' + report_file_path + '.epub' # 文件相对路径
                    # 查询文集是否存在导出文件
                    report_cnt = ProjectReportFile.objects.filter(project=project,file_type='epub')
                    # 存在文件删除
                    if report_cnt.count() != 0:
                        for r in report_cnt:
                            is_exist = os.path.exists(settings.BASE_DIR + r.file_path)
                            if is_exist:
                                os.remove(settings.BASE_DIR + r.file_path)
                        report_cnt.delete()  # 删除数据库记录

                    # 创建数据库记录
                    ProjectReportFile.objects.create(
                        project=project,
                        file_type='epub',
                        file_name=epub_file,
                        file_path=epub_file
                    )

                    return JsonResponse({'status': True, 'data': epub_file})
                except Exception as e:
                    logger.exception(_("生成EPUB出错"))
                    return JsonResponse({'status': False, 'data': _('生成出错')})
            # 导出PDF
            elif report_type in ['pdf']:
                try:
                    report_project = ReportPDF(
                        project_id=project.id,
                        user_id=request.user.id
                    ).work()
                    if report_project is False:
                        return JsonResponse({'status':False,'data':_('生成出错')})
                    report_file_path = report_project.split('media', maxsplit=1)[-1]  # 导出文件的路径
                    pdf_file = '/media' + report_file_path  # 文件相对路径
                    # 查询文集是否存在导出文件
                    report_cnt = ProjectReportFile.objects.filter(project=project, file_type='pdf')
                    # 存在文件删除
                    if report_cnt.count() != 0:
                        for r in report_cnt:
                            is_exist = os.path.exists(settings.BASE_DIR + r.file_path)
                            if is_exist:
                                os.remove(settings.BASE_DIR + r.file_path)
                        report_cnt.delete()  # 删除数据库记录

                    # 创建数据库记录
                    ProjectReportFile.objects.create(
                        project=project,
                        file_type='pdf',
                        file_name=pdf_file,
                        file_path=pdf_file
                    )

                    return JsonResponse({'status': True, 'data': pdf_file})

                except Exception as e:
                    logger.exception(_("生成出错"))
                    return JsonResponse({'status': False, 'data': _('生成出错')})
            else:
                return JsonResponse({'status': False, 'data': _('不支持的类型')})
        # 不允许被导出
        else:
            return JsonResponse({'status':False,'data':_('无权限导出')})

    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':_('文集不存在')})

    except Exception as e:
        logger.exception(_("生成文集文件出错"))
        return JsonResponse({'status':False,'data':_('系统异常')})


# 获取文集前台导出文件
@allow_report_file
@require_http_methods(["POST"])
def report_file(request):
    report_type = request.POST.get('types',None) # 获取前端传入到导出文件类型参数

    pro_id = request.POST.get('pro_id')
    try:
        project = Project.objects.get(id=int(pro_id))

        # 获取文集的协作用户信息
        if request.user.is_authenticated:
            colla_user = ProjectCollaborator.objects.filter(project=project, user=request.user)
            if colla_user.exists():
                colla_user_role = colla_user[0].role
                colla_user = colla_user.count()
            else:
                colla_user = colla_user.count()
        else:
            colla_user = 0

        # 公开的文集 - 可以直接导出
        if project.role == 0:
            allow_export = True

        # 私密文集 - 非创建者和协作者不可导出
        elif (project.role == 1):
            if (request.user != project.create_user) and (colla_user == 0):
                allow_export = False
            else:
                allow_export = True

        # 指定用户可见文集 - 指定用户、文集创建者和协作者可导出
        elif project.role == 2:
            user_list = project.role_value
            if request.user.is_authenticated:  # 认证用户判断是否在许可用户列表中
                if (request.user.username not in user_list) and \
                        (request.user != project.create_user) and \
                        (colla_user == 0):  # 访问者不在指定用户之中，也不是协作者
                    allow_export = False
                else:
                    allow_export = True
            else:  # 游客直接返回404
                allow_export = False
        # 访问码可见文集 - 文集创建者、协作者和通过验证即可导出
        elif project.role == 3:
            # 浏览用户不为创建者和协作者 - 需要访问码
            if (request.user != project.create_user) and (colla_user == 0):
                viewcode = project.role_value
                viewcode_name = 'viewcode-{}'.format(project.id)
                r_viewcode = request.COOKIES[
                    viewcode_name] if viewcode_name in request.COOKIES.keys() else 0  # 从cookie中获取访问码
                if viewcode != r_viewcode:  # cookie中的访问码不等于文集访问码，不可导出
                    allow_export = False
                else:
                    allow_export = True
            else:
                allow_export = True
        else:
            allow_export = False
            # return JsonResponse({'status':False,'data':'不存在的文集权限'})
        if allow_export:
            # 导出EPUB文件
            if report_type in ['epub']:
                try:
                    try:
                        report_project = ProjectReportFile.objects.get(project=project,file_type='epub')
                    except ObjectDoesNotExist:
                        return JsonResponse({'status':False,'data':_('无可用文件,请联系文集创建者')})
                    # print(report_project)
                    return JsonResponse({'status': True, 'data': report_project.file_path})
                except Exception as e:
                    return JsonResponse({'status': False, 'data': _('导出出错')})
            # 导出PDF
            elif report_type in ['pdf']:
                try:
                    try:
                        report_project = ProjectReportFile.objects.get(project=project,file_type='pdf')
                    except ObjectDoesNotExist:
                        return JsonResponse({'status':False,'data':_('无可用文件,请联系文集创建者')})
                    # print(report_project)
                    return JsonResponse({'status': True, 'data': report_project.file_path})
                except Exception as e:
                    return JsonResponse({'status': False, 'data': _('导出出错')})
            else:
                return JsonResponse({'status': False, 'data': _('不支持的类型')})
        else:
            return JsonResponse({'status':False,'data':_('无权限导出')})
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':_('文集不存在')})
    except Exception as e:
        logger.exception(_("获取文集前台导出文件出错"))
        return JsonResponse({'status':False,'data':_('系统异常')})


# 图片素材管理
@login_required()
@require_http_methods(['GET',"POST"])
def manage_image(request):
    # 获取图片
    if request.method == 'GET':
        try:
            groups = ImageGroup.objects.filter(user=request.user) # 获取所有分组
            all_img_cnt = Image.objects.filter(user=request.user).count()
            no_group_cnt = Image.objects.filter(user=request.user,group_id=None).count() # 获取所有未分组的图片数量
            g_id = int(request.GET.get('group', 0))  # 图片分组id
            if int(g_id) == 0:
                image_list = Image.objects.filter(user=request.user).order_by('-create_time')  # 查询所有图片
            elif int(g_id) == -1:
                image_list = Image.objects.filter(user=request.user,group_id=None).order_by('-create_time')  # 查询未分组的图片
            else:
                image_list = Image.objects.filter(user=request.user,group_id=g_id).order_by('-create_time')  # 查询指定分组的图片
            paginator = Paginator(image_list, 18)
            page = request.GET.get('page', 1)
            try:
                images = paginator.page(page)
            except PageNotAnInteger:
                images = paginator.page(1)
            except EmptyPage:
                images = paginator.page(paginator.num_pages)
            images.group = g_id
            return render(request,'app_doc/manage/manage_image.html',locals())
        except:
            logger.exception(_("图片素材管理出错"))
            return render(request,'404.html')
    elif request.method == 'POST':
        try:
            img_id = request.POST.get('img_id','')
            types = request.POST.get('types','') # 操作类型：0表示删除，1表示修改，2表示获取
            range = request.POST.get('range','single') # 操作范围 single 表示单个图片，multi表示多个图片
            # 删除图片
            if int(types) == 0:
                if range == 'single':
                    img = Image.objects.get(id=img_id)
                    if img.user != request.user:
                        return JsonResponse({'status': False, 'data': _('未授权请求')})
                    file_path = settings.BASE_DIR+img.file_path
                    is_exist = os.path.exists(file_path)
                    if is_exist:
                        os.remove(file_path)
                    img.delete() # 删除记录
                elif range == 'multi':
                    imgs = img_id.split(',')
                    for i in imgs:
                        img = Image.objects.get(id=i)
                        if img.user != request.user:
                            logger.error(_("图片{}非法删除".format(i)))
                            break
                        file_path = settings.BASE_DIR + img.file_path
                        is_exist = os.path.exists(file_path)
                        if is_exist:
                            os.remove(file_path)
                        img.delete()  # 删除记录

                return JsonResponse({'status':True,'data':_('删除完成')})
            # 移动图片分组
            elif int(types) == 1:
                if range == 'single':
                    group_id = request.POST.get('group_id',None)
                    if group_id is None:
                        Image.objects.filter(id=img_id,user=request.user).update(group_id=None)
                    else:
                        group = ImageGroup.objects.get(id=group_id,user=request.user)
                        Image.objects.filter(id=img_id,user=request.user).update(group_id=group)
                elif range == 'multi':
                    imgs = img_id.split(',')
                    group_id = request.POST.get('group_id',None)
                    if group_id is None:
                        Image.objects.filter(id__in=imgs,user=request.user).update(group_id=None)
                    else:
                        group = ImageGroup.objects.get(id=group_id,user=request.user)
                        Image.objects.filter(id__in=imgs,user=request.user).update(group_id=group)

                return JsonResponse({'status':True,'data':_('移动完成')})
            # 获取图片
            elif int(types) == 2:
                group_id = request.POST.get('group_id', None) # 接受分组ID参数
                if group_id is None: #
                    return JsonResponse({'status':False,'data':_('参数错误')})
                elif int(group_id) == 0:
                    imgs = Image.objects.filter(user=request.user).order_by('-create_time')
                elif int(group_id) == -1:
                    imgs = Image.objects.filter(user=request.user,group_id=None).order_by('-create_time')
                else:
                    imgs = Image.objects.filter(user=request.user,group_id=group_id).order_by('-create_time')
                img_list = []
                for img in imgs:
                    item = {
                        'path':img.file_path,
                        'name':img.file_name,
                    }
                    img_list.append(item)
                return JsonResponse({'status':True,'data':img_list})
            else:
                return JsonResponse({'status':False,'data':_('非法参数')})
        except ObjectDoesNotExist:
            return JsonResponse({'status':False,'data':_('图片不存在')})
        except:
            logger.exception(_("操作图片素材出错"))
            return JsonResponse({'status':False,'data':_('程序异常')})

# 图片分组管理
@login_required()
@require_http_methods(['GET',"POST"])
@logger.catch()
def manage_img_group(request):
    if request.method == 'GET':
        groups = ImageGroup.objects.filter(user=request.user)
        return render(request,'app_doc/manage/manage_image_group.html',locals())
    # 操作分组
    elif request.method == 'POST':
        types = request.POST.get('types',None) # 请求类型，0表示创建分组，1表示修改分组，2表示删除分组，3表示获取分组
        # 创建分组
        if int(types) == 0:
            group_name = escape(request.POST.get('group_name', ''))
            if group_name not in ['',_('默认分组'),_('未分组')]:
                ImageGroup.objects.get_or_create(
                    user = request.user,
                    group_name = group_name
                )
                return JsonResponse({'status':True,'data':'ok'})
            else:
                return JsonResponse({'status':False,'data':_('名称无效')})
        # 修改分组
        elif int(types) == 1:
            group_name = escape(request.POST.get("group_name",''))
            if group_name not in ['',_('默认分组'),_('未分组')]:
                group_id = request.POST.get('group_id', '')
                ImageGroup.objects.filter(id=group_id,user=request.user).update(group_name=group_name)
                return JsonResponse({'status':True,'data':_('修改成功')})
            else:
                return JsonResponse({'status':False,'data':_('名称无效')})

        # 删除分组
        elif int(types) == 2:
            try:
                group_id = request.POST.get('group_id','')
                group = ImageGroup.objects.get(id=group_id,user=request.user) # 查询分组
                images = Image.objects.filter(group_id=group_id,user=request.user).update(group_id=None) # 移动图片到未分组
                group.delete() # 删除分组
                return JsonResponse({'status':True,'data':_('删除完成')})
            except:
                logger.exception(_("删除图片分组出错"))
                return JsonResponse({'status':False,'data':_('删除错误')})
        # 获取分组
        elif int(types) == 3:
            try:
                group_list = []
                all_cnt = Image.objects.filter(user=request.user).count()
                non_group_cnt = Image.objects.filter(group_id=None,user=request.user).count()
                group_list.append({'group_name':_('全部图片'),'group_cnt':all_cnt,'group_id':0})
                group_list.append({'group_name':_('未分组'),'group_cnt':non_group_cnt,'group_id':-1})
                groups = ImageGroup.objects.filter(user=request.user) # 查询所有分组
                for group in groups:
                    group_cnt = Image.objects.filter(group_id=group).count()
                    item = {
                        'group_id':group.id,
                        'group_name':group.group_name,
                        'group_cnt':group_cnt
                    }
                    group_list.append(item)
                return JsonResponse({'status':True,'data':group_list})
            except:
                logger.exception(_("获取图片分组出错"))
                return JsonResponse({'status':False,'data':_('出现错误')})


# 附件管理
@login_required()
@csrf_exempt
@require_http_methods(['GET',"POST"])
def manage_attachment(request):
    # 文件大小 字节转换
    def sizeFormat(size, is_disk=False, precision=2):
        '''
        size format for human.
            byte      ---- (B)
            kilobyte  ---- (KB)
            megabyte  ---- (MB)
            gigabyte  ---- (GB)
            terabyte  ---- (TB)
            petabyte  ---- (PB)
            exabyte   ---- (EB)
            zettabyte ---- (ZB)
            yottabyte ---- (YB)
        '''
        formats = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        unit = 1000.0 if is_disk else 1024.0
        if not (isinstance(size, float) or isinstance(size, int)):
            raise TypeError('a float number or an integer number is required!')
        if size < 0:
            raise ValueError('number must be non-negative')
        for i in formats:
            size /= unit
            if size < unit:
                r = '{}{}'.format(round(size, precision),i)
                return r

    if request.method == 'GET':
        try:
            search_kw = request.GET.get('kw', None)
            # 搜索附件
            if search_kw:
                attachment_list = Attachment.objects.filter(
                    user=request.user,
                    file_name__icontains=search_kw
                ).order_by('-create_time')
                paginator = Paginator(attachment_list, 15)
                page = request.GET.get('page', 1)
                try:
                    attachments = paginator.page(page)
                except PageNotAnInteger:
                    attachments = paginator.page(1)
                except EmptyPage:
                    attachments = paginator.page(paginator.num_pages)
                attachments.kw = search_kw
            # 所有附件
            else:
                attachment_list = Attachment.objects.filter(user=request.user).order_by('-create_time')
                paginator = Paginator(attachment_list, 15)
                page = request.GET.get('page', 1)
                try:
                    attachments = paginator.page(page)
                except PageNotAnInteger:
                    attachments = paginator.page(1)
                except EmptyPage:
                    attachments = paginator.page(paginator.num_pages)
            return render(request, 'app_doc/manage/manage_attachment.html', locals())
        except Exception as e:
            logger.exception(_("附件管理访问出错"))
            return render(request,'404.html')
    elif request.method == 'POST':
        # types参数，0表示上传、1表示删除、2表示获取附件列表
        types = request.POST.get('types','')
        if types in ['0',0]:
            attachment = request.FILES.get('attachment_upload',None)
            if attachment:
                attachment_name = attachment.name # 获取附件文件名
                attachment_size = sizeFormat(attachment.size) # 获取附件文件大小

                # 限制附件大小
                # 获取系统设置的附件文件大小，如果不存在，默认50MB
                try:
                    allow_attachment_size = SysSetting.objects.get(types='doc',name='attachment_size')
                    allow_attach_size = int(allow_attachment_size.value) * 1048576
                except Exception as e:
                    # print(repr(e))
                    allow_attach_size = 52428800
                if attachment.size > allow_attach_size:
                    return JsonResponse({'status':False,'data':_('文件大小超出限制')})

                # 限制附件格式
                if settings.CHECK_ATTACHMENT_SUFFIX:
                    try:
                        attachment_suffix_list = SysSetting.objects.get(types='doc', name='attachment_suffix')
                        attachment_suffix_list = attachment_suffix_list.value.split(',')
                        if attachment_suffix_list == ['']:
                            attachment_suffix_list = ['zip']
                    except ObjectDoesNotExist:
                        attachment_suffix_list = ['zip']
                    allow_attachment = False
                    if attachment_name.split('.')[-1].lower() in attachment_suffix_list:
                        allow_attachment = True
                else:
                    allow_attachment = True

                # 检测ZIP炸弹
                if allow_attachment and attachment_name.split('.')[-1].lower() == 'zip':
                    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                        for chunk in attachment.chunks():
                            temp_file.write(chunk)
                        temp_file_path = temp_file.name

                    if is_zip_bomb(temp_file_path):
                        os.remove(temp_file_path)
                        return JsonResponse({'code': 5, 'data': _('检测到可能的ZIP炸弹')})

                    os.remove(temp_file_path)
                    attachment.seek(0)

                if allow_attachment:
                    a = Attachment.objects.create(
                        file_name = attachment_name,
                        file_size = attachment_size,
                        file_path = attachment,
                        user = request.user
                    )
                    return JsonResponse({'status':True,'data':{'name':attachment_name,'url':a.file_path.name}})
                else:
                    return JsonResponse({'status':False,'data':_('不支持的格式')})
            else:
                return JsonResponse({'status':False,'data':_('无效文件')})
        elif types in ['1',1]:
            attach_id = request.POST.get('attach_id','')
            attachment = Attachment.objects.filter(id=attach_id,user=request.user) # 查询附件
            for a in attachment: # 遍历附件
                a.file_path.delete() # 删除文件
            attachment.delete() # 删除数据库记录
            return JsonResponse({'status':True,'data':_('删除成功')})
        elif types in [2,'2']:
            attachment_list = []
            attachments = Attachment.objects.filter(user=request.user).order_by('-create_time')
            for a in attachments:
                item = {
                    'filename':a.file_name,
                    'filesize':a.file_size,
                    'filepath':a.file_path.name,
                    'filetime':a.create_time
                }
                attachment_list.append(item)
            return JsonResponse({'status':True,'data':attachment_list})
        else:
            return JsonResponse({'status':False,'data':_('无效参数')})


# 搜索
def search(request):
    kw = request.GET.get('kw', None)
    search_type = request.GET.get('type', 'doc')  # 搜索类型，默认文档doc
    date_type = request.GET.get('d_type', 'recent')
    date_range = request.GET.get('d_range', 'all')  # 时间范围，默认不限，all
    project_range = request.GET.get('p_range', 0)  # 文集范围，默认不限，all

    # 处理时间范围
    if date_type == 'recent':
        if date_range == 'recent1':  # 最近1天
            start_date = datetime.datetime.now() - datetime.timedelta(days=1)
        elif date_range == 'recent7':  # 最近7天
            start_date = datetime.datetime.now() - datetime.timedelta(days=7)
        elif date_range == 'recent30':  # 最近30天
            start_date = datetime.datetime.now() - datetime.timedelta(days=30)
        elif date_range == 'recent365':  # 最近一年
            start_date = datetime.datetime.now() - datetime.timedelta(days=365)
        else:
            start_date = datetime.datetime.strptime('1900-01-01', '%Y-%m-%d')
        end_date = datetime.datetime.now()
    elif date_type == 'day':
        try:
            date_list = date_range.split('|')
            start_date = datetime.datetime.strptime(date_list[0], '%Y-%m-%d')
            end_date = datetime.datetime.strptime(date_list[1], '%Y-%m-%d')
        except:
            start_date = datetime.datetime.now() - datetime.timedelta(days=1)
            end_date = datetime.datetime.now()

    # 是否时间筛选
    if date_range == 'all':
        is_date_range = False
    else:
        is_date_range = True

    # 是否认证
    if request.user.is_authenticated:
        is_auth = True
    else:
        is_auth = False

    # 存在搜索关键词
    if kw:
        # 搜索文档
        if search_type == 'doc':
            if is_auth:
                colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)]  # 用户的协作文集
                open_list = [i.id for i in Project.objects.filter(
                    Q(role=0) | Q(create_user=request.user)
                )]  # 公开文集

                view_list = list(set(open_list).union(set(colla_list)))  # 合并上述两个文集ID列表

                data_list = Doc.objects.filter(
                    Q(top_doc__in=view_list),  # 包含用户可浏览到的文集
                    Q(create_time__gte=start_date, create_time__lte=end_date),  # 筛选创建时间
                    Q(name__icontains=kw) | Q(content__icontains=kw) | Q(pre_content__icontains=kw)  # 筛选文档标题和内容中包含搜索词
                ).order_by('-create_time')
            else:
                view_list = [i.id for i in Project.objects.filter(role=0)]
                data_list = Doc.objects.filter(
                    Q(top_doc__in=view_list),
                    Q(create_time__gte=start_date, create_time__lte=end_date),  # 筛选创建时间
                    Q(name__icontains=kw) | Q(content__icontains=kw) | Q(pre_content__icontains=kw)  # 筛选文档标题和内容中包含搜索词
                ).order_by('-create_time')

        # 搜索文集
        elif search_type == 'pro':
            # 认证用户
            if is_auth:
                colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)]  # 用户的协作文集
                # 查询所有可显示的文集
                data_list = Project.objects.filter(
                    Q(role=0) | \
                    Q(role=2, role_value__contains=str(request.user.username)) | \
                    Q(create_user=request.user) | \
                    Q(id__in=colla_list),
                    Q(create_time__gte=start_date, create_time__lte=end_date),  # 筛选创建时间
                    Q(name__icontains=kw) | Q(intro__icontains=kw)  # 筛选文集名称和简介包含搜索词
                ).order_by('-create_time')
            # 游客
            else:
                data_list = Project.objects.filter(
                    Q(role=0),
                    Q(name__icontains=kw) | Q(intro__icontains=kw),
                    Q(create_time__gte=start_date, create_time__lte=end_date),  # 筛选创建时间
                ).order_by("-create_time")

        # 搜索标签
        elif search_type == 'tag':
            # 认证用户
            if is_auth:
                colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)]  # 用户的协作文集
                open_list = [i.id for i in Project.objects.filter(
                    Q(role=0) | Q(create_user=request.user)
                )]  # 公开文集和自己创建的文集

                view_list = list(set(open_list).union(set(colla_list)))  # 合并上述两个文集ID列表

                tag_list = Tag.objects.filter(name__icontains=kw) # 查询符合条件的标签
                tag_doc_list = [i.doc.id for i in DocTag.objects.filter(tag__in=tag_list)] # 获取符合条件的标签文档

                data_list = Doc.objects.filter(
                    Q(top_doc__in=view_list),  # 包含用户可浏览到的文集
                    Q(id__in=tag_doc_list), # 包含符合条件标签的文档ID列表
                    Q(create_time__gte=start_date, create_time__lte=end_date),  # 筛选创建时间
                ).order_by('-create_time')
            # 游客
            else:
                open_list = [i.id for i in Project.objects.filter(Q(role=0))]  # 公开文集

                view_list = list(set(open_list))

                tag_list = Tag.objects.filter(name__icontains=kw)  # 查询符合条件的标签
                tag_doc_list = [i.doc.id for i in DocTag.objects.filter(tag__in=tag_list)]  # 获取符合条件的标签文档

                data_list = Doc.objects.filter(
                    Q(top_doc__in=view_list),  # 包含用户可浏览到的文集
                    Q(id__in=tag_doc_list),  # 包含符合条件标签的文档ID列表
                    Q(create_time__gte=start_date, create_time__lte=end_date),  # 筛选创建时间
                ).order_by('-create_time')

        else:
            return render(request, 'app_doc/search.html')

        # 分页处理
        paginator = Paginator(data_list, 12)
        page = request.GET.get('page', 1)
        try:
            datas = paginator.page(page)
        except PageNotAnInteger:
            datas = paginator.page(1)
        except EmptyPage:
            datas = paginator.page(paginator.num_pages)
        return render(request, 'app_doc/search_result.html', locals())

    # 否则跳转到搜索首页
    else:
        return render(request,'app_doc/search.html')


# 文档Markdown文件下载
@require_http_methods(['GET',"POST"])
def download_doc_md(request,doc_id):
    if request.user.is_authenticated:
        if request.user.is_superuser:
            try:
                doc = Doc.objects.get(id=doc_id)
            except ObjectDoesNotExist:
                return JsonResponse({'status':False,'data':_('文档不存在')})
        else:
            try:
                doc = Doc.objects.get(id=doc_id)
                project = Project.objects.get(id=doc.top_doc)
            except ObjectDoesNotExist:
                return JsonResponse({'status':False,'data':_('数据不存在')})
            if request.user != project.create_user and request.user != doc.create_user:
                return JsonResponse({'status':False,'data':_('无权限')})
    else:
        return render(request,'404.html')

    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename={}.md'.format(doc.name)
    response.write(doc.pre_content)

    return response


# 个人中心 - 概览
@login_required()
@require_http_methods(['GET','POST'])
def manage_overview(request):
    if request.method == 'GET':
        pro_list = Project.objects.filter(create_user=request.user).order_by('-create_time')
        colla_pro_cnt = ProjectCollaborator.objects.filter(user=request.user).count()
        pro_cnt = pro_list.count() + colla_pro_cnt # 文集总数
        doc_cnt = Doc.objects.filter(create_user=request.user).count() # 文档总数
        total_tag_cnt = Tag.objects.filter(create_user=request.user).count()
        img_cnt = Image.objects.filter(user=request.user).count()
        attachment_cnt = Attachment.objects.filter(user=request.user).count()

        doc_active_list = Doc.objects.filter(create_user=request.user).order_by('-modify_time')[:5]

        return render(request,'app_doc/manage/manage_overview.html',locals())
    else:
        pass


# 个人中心 - 文档标签
@login_required()
@require_http_methods(['GET','POST'])
def manage_doc_tag(request):
    if request.method == 'GET':
        tags = Tag.objects.filter(create_user=request.user)
        return render(request,'app_doc/manage/manage_doc_tag.html',locals())
    # 操作标签
    elif request.method == 'POST':
        types = request.POST.get('types', None)  # 请求类型，0表示创建标签，1表示修改标签，2表示删除标签，3表示获取标签
        # 创建标签
        if int(types) == 0:
            tag_name = request.POST.get('tag_name', '')
            if tag_name != '':
                Tag.objects.create(
                    user=request.user,
                    name=tag_name
                )
                return JsonResponse({'status': True, 'data': 'ok'})
            else:
                return JsonResponse({'status': False, 'data': _('名称无效')})
        # 修改标签
        elif int(types) == 1:
            try:
                tag_name = request.POST.get('tag_name', '')
                if tag_name != "":
                    tag_id = request.POST.get('tag_id', '')
                    if tag_id != "":
                        print(tag_id,tag_name)
                        Tag.objects.filter(id=tag_id, create_user=request.user).update(name=tag_name)
                        return JsonResponse({'status': True, 'data': _('修改成功')})
                    else:
                        return JsonResponse({'status': False, 'data': _('标签ID无效')})
                else:
                    return JsonResponse({'status': False, 'data': _('名称无效')})
            except Exception as e:
                logger.exception(_("修改异常"))
                return JsonResponse({'status': False, 'data': _('异常错误')})

        # 删除标签
        elif int(types) == 2:
            try:
                tag_id = request.POST.get('tag_id', '')
                tag = Tag.objects.get(id=tag_id, create_user=request.user)  # 查询分组
                tag.delete()  # 删除标签
                return JsonResponse({'status': True, 'data': _('删除完成')})
            except:
                logger.exception(_("删除标签出错"))
                return JsonResponse({'status': False, 'data': _('删除错误')})
        # 获取标签
        elif int(types) == 3:
            try:
                tag_list = []
                return JsonResponse({'status': True, 'data': tag_list})
            except:
                logger.exception(_("获取文档标签出错"))
                return JsonResponse({'status': False, 'data': _('出现错误')})


# 标签文档关系页
def tag_docs(request,tag_id):
    # 获取标签
    try:
        # 颜色列表
        color_list = ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#e062ae', '#e062ae']
        # 获取标签信息
        tag = Tag.objects.get(id=int(tag_id))
        # 获取标签的文档信息
        # 如果访问者已经登录
        if request.user.is_authenticated:
            # 判断是否为标签的创建者
            if request.user == tag.create_user:
                # 获取标签的所有文档
                view_list = [i.id for i in Project.objects.filter(create_user=request.user)]
                docs = DocTag.objects.filter(tag=tag,doc__status=1)
            else:
                # 获取有权限的文档
                colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)]  # 用户的协作文集
                open_list = [i.id for i in Project.objects.filter(
                    Q(role=0) | Q(create_user=tag.create_user)
                )]  # 公开文集

                view_list = list(set(open_list).union(set(colla_list)))  # 合并上述两个文集ID列表
                # 查询可浏览文集的文档
                doc_list = [i for i in Doc.objects.filter(top_doc__in=view_list,status=1)]
                # 筛选可浏览的文档的标签文档
                docs = DocTag.objects.filter(tag=tag,doc__in=doc_list)

        else:
            # 查询标签创建者的公开文集
            open_list = [i.id for i in Project.objects.filter(
                role=0,create_user=tag.create_user
            )]
            view_list = open_list
            doc_list = [i for i in Doc.objects.filter(top_doc__in=view_list,status=1)]
            docs = DocTag.objects.filter(tag=tag,doc__in=doc_list)

        # 获取文档的其他标签信息
        current_link_list = [] # 文档的所有标签ID列表
        for doc in docs:
            other_tags = [str(i.tag.id) for i in DocTag.objects.filter(~Q(tag=tag), doc=doc.doc)]
            current_link_list.extend(other_tags)

        # 标签的节点列表
        tag_nodes_list = [
            # {'id':str(tag.id),'name':tag.name,'symbolSize':50,'value':docs.count(),'itemStyle':{'color':random.choice(color_list)}}
        ]
        # 标签的关系列表
        tag_links_list = []
        # 标签分类列表
        tag_cate = []

        # 添加用户创建的所有标签到节点列表
        for t in Tag.objects.filter(create_user=tag.create_user):
            tag_cate.append({'name':t.name})
            if t.name == tag.name:
                item = {
                    'id': str(t.id),
                    'name': t.name,
                    'symbolSize': 50,
                    'value': DocTag.objects.filter(tag=t,doc__status=1,doc__top_doc__in=view_list).count(),
                    'itemStyle': {'color': random.choice(color_list)}
                }
            else:
                item = {
                    'id':str(t.id),
                    'name':t.name,
                    'symbolSize':25,
                    'value':DocTag.objects.filter(tag=t,doc__status=1,doc__top_doc__in=view_list).count(),
                    'itemStyle':{'color':random.choice(color_list)}
                }
            tag_nodes_list.append(item)
            # 查询非主标签的关联标签
            sub_tags = DocTag.objects.filter(tag=t,doc__status=1,doc__top_doc__in=view_list) # 获取包含t标签的文档
            for sub_tag in sub_tags:
                sub_docs = DocTag.objects.filter(doc=sub_tag.doc,doc__top_doc__in=view_list) # 获取包含文档的标签
                for sub_doc in sub_docs:
                    if str(sub_tag.tag.id) != str(sub_doc.tag.id):
                        item = {
                            'source': str(sub_tag.tag.id),
                            'target': str(sub_doc.tag.id),
                            'value' : sub_doc.doc.name,
                            'id': sub_doc.doc.id,
                            'pid': sub_doc.doc.top_doc,
                            'label':{
                                'normal':{
                                    'show':'true',
                                    'formatter':"{c}",
                                    'fontsize':'10px',
                                }
                            }
                        }
                        item_1 = {
                            'source': str(sub_doc.tag.id),
                            'target': str(sub_tag.tag.id),
                            'value': sub_doc.doc.name,
                            'id':sub_doc.doc.id,
                            'pid': sub_doc.doc.top_doc,
                            'label': {
                                'normal': {
                                    'show': 'true',
                                    'formatter': "{c}",
                                    'fontsize': '10px',
                                }
                            }
                        }
                        if item_1 not in tag_links_list:
                            tag_links_list.append(item)

        return render(request, 'app_doc/tag_docs.html', locals())
    except Exception as e:
        logger.exception(_("标签文档页访问异常"))
        return render(request, '404.html')


# 标签文档页
@require_http_methods(['GET'])
def tag_doc(request,tag_id,doc_id):
    try:
        if tag_id != '' and doc_id != '':
            doc = Doc.objects.get(id=int(doc_id), status=1)
            # 获取文档的文集信息，以判断是否有权限访问
            project = Project.objects.get(id=int(doc.top_doc))
            # 获取文集的协作用户信息
            if request.user.is_authenticated:
                colla_user = ProjectCollaborator.objects.filter(project=project,user=request.user)
                if colla_user.exists():
                    colla_user_role = colla_user[0].role
                    colla_user = colla_user.count()
                else:
                    colla_user = colla_user.count()
            else:
                colla_user = 0

            # 私密文集且访问者非创建者、协作者 - 不能访问
            if (project.role == 1) and (request.user != project.create_user) and (colla_user == 0):
                return render(request, '404.html')
            # 指定用户可见文集
            elif project.role == 2:
                user_list = project.role_value
                if request.user.is_authenticated:  # 认证用户判断是否在许可用户列表中
                    if (request.user.username not in user_list) and \
                            (request.user != project.create_user) and \
                            (colla_user == 0):  # 访问者不在指定用户之中，也不是协作者
                        return render(request, '404.html')
                else:  # 游客直接返回404
                    return render(request, '404.html')
            # 访问码可见
            elif project.role == 3:
                # 浏览用户不为创建者和协作者 - 需要访问码
                if (request.user != project.create_user) and (colla_user == 0):
                    viewcode = project.role_value
                    viewcode_name = 'viewcode-{}'.format(project.id)
                    r_viewcode = request.COOKIES[
                        viewcode_name] if viewcode_name in request.COOKIES.keys() else 0  # 从cookie中获取访问码
                    if viewcode != r_viewcode:  # cookie中的访问码不等于文集访问码，跳转到访问码认证界面
                        return redirect('/check_viewcode/?to={}'.format(request.path))

            # 获取文档内容
            try:
                # 获取标签信息
                tag = Tag.objects.get(id=int(tag_id))
                # 获取标签文档信息
                docs = DocTag.objects.filter(tag=tag)
                # 获取文档的标签
                doc_tags = DocTag.objects.filter(doc=doc)
            except ObjectDoesNotExist:
                return render(request, '404.html')
            return render(request,'app_doc/tag_doc_single.html',locals())
        else:
            return HttpResponse(_('参数错误'))
    except Exception as e:
        logger.exception(_("文集浏览出错"))
        return render(request,'404.html')


# 个人中心 - 个人设置
@login_required()
def manage_self(request):
    if request.method == 'GET':
        user = User.objects.get_by_natural_key(request.user)
        try:
            user_opt = UserOptions.objects.get(user=request.user)
        except ObjectDoesNotExist:
            user_opt = []
        return render(request,'app_doc/manage/manage_self.html',locals())
    elif request.method == 'POST':
        first_name = request.POST.get('first_name','') # 昵称
        email = request.POST.get('email',None) # 电子邮箱
        editor_mode = request.POST.get('editor_mode',1) # 编辑器
        user = User.objects.get_by_natural_key(request.user)
        if len(first_name) < 2 or len(first_name) > 10:
            return JsonResponse({'status': False, 'data': _('昵称长度不得小于2位大于10位')})
        if User.objects.filter(first_name=first_name).count() > 0 and user.first_name != first_name:
            return JsonResponse({'status':False,'data':_('昵称已被使用')})
        if User.objects.filter(email=email).count() > 0 and user.email != email:
            return JsonResponse({'status':False,'data':_('电子邮箱已被使用')})
        if email != '' and '@' in email:
            user.email = email
            user.first_name = first_name
            user.save()
            user_opt = UserOptions.objects.update_or_create(
                user = user,
                defaults={'editor_mode':editor_mode}
            )
            return JsonResponse({'status':True,'data':'ok'})
        else:
            return JsonResponse({'status':False,'data':_('参数不正确')})


# 文集文档收藏
@login_required()
def my_collect(request):
    if request.method == 'GET':
        pass
    elif request.method == 'POST':
        collect_type = request.POST.get('type',None) # 收藏类型
        collect_id = request.POST.get('id',None) # 收藏对象ID
        if (collect_type is None) or (collect_id is None):
            return JsonResponse({'status':False,'data':_('参数错误')})
        else:
            is_collect = MyCollect.objects.filter(collect_type=collect_type,collect_id=collect_id,create_user=request.user)
            # 存在收藏
            if is_collect.exists():
                is_collect.delete()
                return JsonResponse({'status': True, 'data': _('取消收藏成功')})
            else:
                MyCollect.objects.create(
                    collect_type = collect_type,
                    collect_id = collect_id,
                    create_user = request.user,
                    create_time = datetime.datetime.now()
                )
                return JsonResponse({'status':True,'data':_('收藏成功')})

    elif request.method == 'DELETE':
        pass

# 收藏管理
@login_required()
@require_http_methods(['GET','POST','DELETE'])
@csrf_exempt
def manage_collect(request):
    if request.method == 'GET':
        # 收藏文集数量
        collect_project_cnt = MyCollect.objects.filter(create_user=request.user, collect_type=2).count()
        # 收藏文档数量
        collect_doc_cnt = MyCollect.objects.filter(create_user=request.user, collect_type=1).count()
        # 所有收藏数量
        all_cnt = collect_project_cnt + collect_doc_cnt

        return render(request,'app_doc/manage/manage_collect.html',locals())
    elif request.method == 'POST':
        kw = request.POST.get('kw', '') # 搜索词
        collect_type = request.POST.get('type', '') # 收藏类型
        if collect_type in ['1', '2']:
            q_type = [int(collect_type)]
        else:
            q_type = [1, 2]

        page = request.POST.get('page', 1)
        limit = request.POST.get('limit', 10)
        # 没有搜索
        if kw == '':
            collect_list = MyCollect.objects.filter(
                create_user=request.user,
                collect_type__in=q_type,
            ).order_by('-create_time')
        # 有搜索
        else:
            collect_list = MyCollect.objects.filter(
                Q(content__icontains=kw) | Q(name__icontains=kw),
                create_user=request.user, collect_type__in=q_type
            ).order_by('-create_time')

        # 分页处理
        paginator = Paginator(collect_list, limit)
        page = request.GET.get('page', page)
        try:
            collects = paginator.page(page)
        except PageNotAnInteger:
            collects = paginator.page(1)
        except EmptyPage:
            collects = paginator.page(paginator.num_pages)

        table_data = []
        for collect in collects:
            if collect.collect_type == 1:
                item_doc = Doc.objects.get(id=collect.collect_id)
                item_id = item_doc.id
                item_name = item_doc.name
                item_project = Project.objects.get(id=item_doc.top_doc)
                item_project_name = item_project.name
                item_project_id = item_project.id
            else:
                item_project = Project.objects.get(id=collect.collect_id)
                item_id = item_project.id
                item_name = item_project.name
                item_project_name = ''
                item_project_id = ''
            item = {
                'id': collect.id,
                'item_id':item_id,
                'item_name': html_filter(item_name),
                'type': collect.collect_type,
                'item_project_id':item_project_id,
                'item_project_name':item_project_name,
                'create_time': collect.create_time,
            }
            table_data.append(item)
        resp_data = {
            "code": 0,
            "msg": "ok",
            "count": collect_list.count(),
            "data": table_data
        }
        return JsonResponse(resp_data)
    elif request.method == 'DELETE':
        try:
            # 获取收藏ID
            DELETE = QueryDict(request.body)
            collect_id = DELETE.get('collect_id', None)
            range = DELETE.get('range', 'single')
            if collect_id:
                if range == 'single':
                    # 查询收藏
                    try:
                        collect = MyCollect.objects.get(id=collect_id)
                    except ObjectDoesNotExist:
                        return JsonResponse({'status': False, 'data': _('收藏不存在')})
                    # 如果请求用户为站点管理员、收藏的创建者，可以删除
                    if (request.user == collect.create_user) or (request.user.is_superuser):
                        MyCollect.objects.filter(id=collect_id).delete()
                        return JsonResponse({'status': True, 'data': _('删除完成')})
                    else:
                        return JsonResponse({'status': False, 'data': _('非法请求')})
                elif range == 'multi':
                    collects = collect_id.split(",")
                    try:
                        MyCollect.objects.filter(id__in=collects, create_user=request.user).delete()
                        return JsonResponse({'status': True, 'data': _('删除完成')})
                    except:
                        return JsonResponse({'status': False, 'data': _('非法请求')})
                else:
                    return JsonResponse({'status': False, 'data': _('类型错误')})

            else:
                return JsonResponse({'status': False, 'data': _('参数错误')})
        except Exception as e:
            logger.exception(_("取消收藏出错"))
            return JsonResponse({'status': False, 'data': _('请求出错')})

# 获取当前版本
def get_version(request):
    try:
        version = settings.VERSIONS
        data = {
            'status':True,
            'data':version
        }
    except:
        data = {
            'status':False,
            'data':_('异常')
        }
    return JsonResponse(data)


# 用户分组用户列表接口
class UserGroupUserList(APIView):
    authentication_classes = [SessionAuthentication, AppMustAuth]

    def get(self,request):
        user_data = User.objects.filter(is_active=True).values(
            'id', 'username', 'first_name'
        )
        user_list = []
        for user in user_data:
            item = {
                'name':user['username'],
                'value':user['id']
            }
            user_list.append(item)
        # serializer = UserSerializer(user_data, many=True)  # 对结果进行序列化处理
        resp = {
            'code': 0,
            'data': user_list,
            'count': user_data.count()
        }

        return Response(resp)
