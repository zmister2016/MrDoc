# coding:utf-8
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
import json
import random
from app_doc.report_utils import *
from app_admin.models import UserOptions,SysSetting
from app_admin.decorators import check_headers,allow_report_file
import os.path


# 替换前端传来的非法字符
def validateTitle(title):
  rstr = r"[\/\\\:\*\?\"\<\>\|\[\]]" # '/ \ : * ? " < > |'
  new_title = re.sub(rstr, "_", title) # 替换为下划线
  return new_title


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
    parent_id_list = Doc.objects.filter(top_doc=pro_id, status=1).exclude(parent_doc=0).values_list('parent_doc',
                                                                                                    flat=True)
    # 获取存在上级文档的上级文档ID
    # print(parent_id_list)
    doc_list = []
    n = 0
    # 获取一级文档
    top_docs = Doc.objects.filter(top_doc=pro_id, parent_doc=0, status=1).values('id', 'name').order_by('sort')
    # 遍历一级文档
    for doc in top_docs:
        top_item = {
            'id': doc['id'],
            'name': doc['name'],
            # 'spread': True,
            # 'level': 1
        }
        # 如果一级文档存在下级文档，查询其二级文档
        if doc['id'] in parent_id_list:
            # 获取二级文档
            sec_docs = Doc.objects.filter(
                top_doc=pro_id, parent_doc=doc['id'], status=1).values('id', 'name').order_by('sort')
            top_item['children'] = []
            for doc in sec_docs:
                sec_item = {
                    'id': doc['id'],
                    'name': doc['name'],
                    # 'level': 2
                }
                # 如果二级文档存在下级文档，查询第三级文档
                if doc['id'] in parent_id_list:
                    # 获取三级文档
                    thr_docs = Doc.objects.filter(
                        top_doc=pro_id, parent_doc=doc['id'], status=1).values('id','name').order_by('sort')
                    sec_item['children'] = []
                    for doc in thr_docs:
                        item = {
                            'id': doc['id'],
                            'name': doc['name'],
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
        ).order_by("{}create_time".format(sort_str))

    # 没有搜索 and 认证用户 and 有筛选
    elif (is_kw is False ) and (is_auth) and (is_role):
        if role in ['0',0]:
            project_list = Project.objects.filter(role=0).order_by("{}create_time".format(sort_str))
        elif role in ['1',1]:
            project_list = Project.objects.filter(create_user=request.user,role=1).order_by("{}create_time".format(sort_str))
        elif role in ['2',2]:
            project_list = Project.objects.filter(role=2,role_value__contains=str(request.user.username)).order_by("{}create_time".format(sort_str))
        elif role in ['3',3]:
            project_list = Project.objects.filter(role=3).order_by("{}create_time".format(sort_str))
        elif role in ['99',99]:
            colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)] # 用户的协作文集列表
            project_list = Project.objects.filter(id__in=colla_list).order_by("{}create_time".format(sort_str))
        else:
            return render(request,'404.html')

    # 没有搜索 and 游客 and 没有筛选
    elif (is_kw is False) and (is_auth is False) and (is_role is False):
        project_list = Project.objects.filter(role__in=[0,3]).order_by("{}create_time".format(sort_str))

    # 没有搜索 and 游客 and 有筛选
    elif (is_kw is False) and (is_auth is False) and (is_role):
        if role in ['0',0]:
            project_list = Project.objects.filter(role=0).order_by("{}create_time".format(sort_str))
        elif role in ['3',3]:
            project_list = Project.objects.filter(role=3).order_by("{}create_time".format(sort_str))
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
        ).order_by('{}create_time'.format(sort_str))

    # 有搜索 and 认证用户 and 有筛选
    elif (is_kw) and (is_auth) and (is_role):
        if role in ['0',0]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw)|Q(intro__icontains=kw),
                role=0
            ).order_by("{}create_time".format(sort_str))
        elif role in ['1',1]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                create_user=request.user
            ).order_by("{}create_time".format(sort_str))
        elif role in ['2',2]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                role=2,
                role_value__contains=str(request.user.username)
            ).order_by("{}create_time".format(sort_str))
        elif role in ['3',3]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                role=3
            ).order_by("{}create_time".format(sort_str))
        elif role in ['99',99]:
            colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)] # 用户的协作文集列表
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                id__in=colla_list
            ).order_by("{}create_time".format(sort_str))
        else:
            return render(request,'404.html')

    # 有搜索 and 游客 and 没有筛选
    elif (is_kw) and (is_auth is False) and (is_role is False):
        project_list = Project.objects.filter(
            Q(name__icontains=kw) | Q(intro__icontains=kw),
            role__in=[0, 3]
        ).order_by("{}create_time".format(sort_str))

    # 有搜索 and 游客 and 有筛选
    elif (is_kw) and (is_auth is False) and (is_role):
        if role in ['0',0]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                role=0
            ).order_by("{}create_time".format(sort_str))
        elif role in ['3',3]:
            project_list = Project.objects.filter(
                Q(name__icontains=kw) | Q(intro__icontains=kw),
                role=3
            ).order_by("{}create_time".format(sort_str))
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
        desc = request.POST.get('desc','')
        role = request.POST.get('role',0)
        role_list = ['0','1','2','3',0,1,2,3]
        if name != '':
            project = Project.objects.create(
                name=validateTitle(name),
                intro=desc[:100],
                create_user=request.user,
                role = int(role) if role in role_list else 0
            )
            project.save()
            return JsonResponse({'status':True,'data':{'id':project.id,'name':project.name}})
        else:
            return JsonResponse({'status':False,'data':'文集名称不能为空！'})
    except Exception as e:

        logger.exception("创建文集出错")
        return JsonResponse({'status':False,'data':'出现异常,请检查输入值！'})

# 文集页
@require_http_methods(['GET'])
@check_headers
def project_index(request,pro_id):
    # 获取文集
    try:
        # 获取文集信息
        project = Project.objects.get(id=int(pro_id))
        # 获取文集的文档目录
        toc_list,toc_cnt = get_pro_toc(pro_id)
        # toc_list,toc_cnt = ([],1000)
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
            search_result = Doc.objects.filter(top_doc=int(pro_id),pre_content__icontains=kw)
            return render(request,'app_doc/project_doc_search.html',locals())
        return render(request, 'app_doc/project.html', locals())
    except Exception as e:
        logger.exception("文集页访问异常")
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
            return render(request,'app_doc/manage_project_options.html',locals())
        else:
            return Http404
    elif request.method == 'POST':
        try:
            pro_id = request.POST.get('pro_id',None)
            project = Project.objects.get(id=pro_id)
            # 验证用户有权限修改文集
            if (request.user == project.create_user) or request.user.is_superuser:
                name = request.POST.get('name',None)
                content = request.POST.get('desc',None)
                project.name = validateTitle(name)
                project.intro = content
                project.save()
                return JsonResponse({'status':True,'data':'修改成功'})
            else:
                return JsonResponse({'status':False,'data':'非法请求'})
        except Exception as e:
            logger.exception("修改文集出错")
            return JsonResponse({'status':False,'data':'请求出错'})


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
            return render(request,'app_doc/manage_project_role.html',locals())
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
                    # return render(request, 'app_doc/manage_project_role.html', locals())
                    return JsonResponse({'status':True,'data':'ok'})
                except:
                    return JsonResponse({'status':False,'data':'出错'})
            else:
                return Http404


# 验证文集访问码
@require_http_methods(['GET',"POST"])
def check_viewcode(request):
    try:
        if request.method == 'GET':
            project_id = request.GET.get('to','').split("/")[1].split('-')[1]
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
                errormsg = "访问码错误"
                return render(request, 'app_doc/check_viewcode.html', locals())
    except Exception as e:
        logger.exception("验证文集访问码出错")
        return render(request,'404.html')


# 删除文集
@login_required()
@require_http_methods(["POST"])
def del_project(request):
    try:
        pro_id = request.POST.get('pro_id','')
        if pro_id != '':
            pro = Project.objects.get(id=pro_id)
            if (request.user == pro.create_user) or request.user.is_superuser:
                # 删除文集下的文档
                pro_doc_list = Doc.objects.filter(top_doc=int(pro_id))
                pro_doc_list.delete()
                # 删除文集
                pro.delete()
                return JsonResponse({'status':True})
            else:
                return JsonResponse({'status':False,'data':'非法请求'})
        else:
            return JsonResponse({'status':False,'data':'参数错误'})
    except Exception as e:
        logger.exception("删除文集出错")
        return JsonResponse({'status':False,'data':'请求出错'})


# 管理文集
@login_required()
@require_http_methods(['GET'])
def manage_project(request):
    try:
        search_kw = request.GET.get('kw', None)
        if search_kw:
            pro_list = Project.objects.filter(create_user=request.user,intro__icontains=search_kw).order_by('-create_time')
            paginator = Paginator(pro_list, 15)
            page = request.GET.get('page', 1)
            try:
                pros = paginator.page(page)
            except PageNotAnInteger:
                pros = paginator.page(1)
            except EmptyPage:
                pros = paginator.page(paginator.num_pages)
            pros.kw = search_kw
        else:
            pro_list = Project.objects.filter(create_user=request.user).order_by('-create_time')
            paginator = Paginator(pro_list, 15)
            page = request.GET.get('page', 1)
            try:
                pros = paginator.page(page)
            except PageNotAnInteger:
                pros = paginator.page(1)
            except EmptyPage:
                pros = paginator.page(paginator.num_pages)
        return render(request,'app_doc/manage_project.html',locals())
    except Exception as e:
        logger.exception("管理文集出错")
        return render(request,'404.html')


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
            return render(request,'app_doc/manage_project_download.html',locals())
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
            # return render(request,'app_doc/manage_project_download.html',locals())
            return JsonResponse({'status':True,'data':'ok'})


# 文集协作管理
@login_required()
@require_http_methods(['GET',"POST"])
@logger.catch()
def manage_project_collaborator(request,pro_id):
    project = Project.objects.filter(id=pro_id, create_user=request.user)
    if project.exists() is False:
        return Http404

    if request.method == 'GET':
        pro = project[0]
        collaborator = ProjectCollaborator.objects.filter(project=pro) # 获取文集的协作者
        colla_user_list = [i.user for i in collaborator] # 文集协作用户的ID
        colla_docs = Doc.objects.filter(top_doc=pro.id,create_user__in=colla_user_list) # 获取文集协作用户创建的文档
        return render(request, 'app_doc/manage_project_collaborator.html', locals())

    elif request.method == 'POST':
        # type类型：0表示新增协作者、1表示删除协作者、2表示修改协作者
        types = request.POST.get('types','')
        try:
            types = int(types)
        except:
            return JsonResponse({'status':False,'data':'参数错误'})
        # 添加文集协作者
        if int(types) == 0:
            colla_user = request.POST.get('username','')
            role = request.POST.get('role',0)
            user = User.objects.filter(username=colla_user)
            if user.exists():
                if user[0] == project[0].create_user: # 用户为文集的创建者
                    return JsonResponse({'status':False,'data':'文集创建者无需添加'})
                elif ProjectCollaborator.objects.filter(user=user[0],project=project[0]).exists():
                    return JsonResponse({'status':False,'data':'用户已存在'})
                else:
                    ProjectCollaborator.objects.create(
                        project = project[0],
                        user = user[0],
                        role = role if role in ['1',1] else 0
                    )
                    return JsonResponse({'status':True,'data':'添加成功'})
            else:
                return JsonResponse({'status':False,'data':'用户不存在'})
        # 删除文集协作者
        elif int(types) == 1:
            username = request.POST.get('username','')
            try:
                user = User.objects.get(username=username)
                pro_colla = ProjectCollaborator.objects.get(project=project[0],user=user)
                pro_colla.delete()
                return JsonResponse({'status':True,'data':'删除成功'})
            except:
                logger.exception("删除协作者出错")
                return JsonResponse({'status':False,'data':'删除出错'})
        # 修改协作权限
        elif int(types) == 2:
            username = request.POST.get('username', '')
            role = request.POST.get('role','')
            try:
                user = User.objects.get(username=username)
                pro_colla = ProjectCollaborator.objects.filter(project=project[0], user=user)
                pro_colla.update(role=role)
                return JsonResponse({'status':True,'data':'修改成功'})
            except:
                logger.exception("修改协作权限出错")
                return JsonResponse({'status':False,'data':'修改失败'})

        else:
            return JsonResponse({'status':False,'data':'无效的类型'})


# 我协作的文集
@login_required()
@logger.catch()
def manage_pro_colla_self(request):
    colla_pros = ProjectCollaborator.objects.filter(user=request.user)
    return render(request,'app_doc/manage_project_self_colla.html',locals())


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
            return render(request,'app_doc/manage_project_transfer.html',locals())
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
                return JsonResponse({'status':False,'data':'用户不存在'})


# 文档浏览页
@require_http_methods(['GET'])
def doc(request,pro_id,doc_id):
    try:
        if pro_id != '' and doc_id != '':
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
                doc = Doc.objects.get(id=int(doc_id),status=1)
                doc_tags = DocTag.objects.filter(doc=doc)
            except ObjectDoesNotExist:
                return render(request, '404.html')
            # 获取文集下一级文档
            # project_docs = Doc.objects.filter(top_doc=doc.top_doc, parent_doc=0, status=1).order_by('sort')
            return render(request,'app_doc/doc.html',locals())
        else:
            return HttpResponse('参数错误')
    except Exception as e:
        logger.exception("文集浏览出错")
        return render(request,'404.html')


# 创建文档
@login_required()
@require_http_methods(['GET',"POST"])
@logger.catch()
def create_doc(request):
    # 获取用户的编辑器模式
    try:
        user_opt = UserOptions.objects.get(user=request.user)
        if user_opt.editor_mode == 1:
            editor_mode = 1
        elif user_opt.editor_mode == 2:
            editor_mode = 2
    except ObjectDoesNotExist:
        editor_mode = 1
    if request.method == 'GET':
        try:
            pid = request.GET.get('pid',-999)
            project_list = Project.objects.filter(create_user=request.user) # 自己创建的文集列表
            colla_project_list = ProjectCollaborator.objects.filter(user=request.user) # 协作的文集列表
            doctemp_list = DocTemp.objects.filter(create_user=request.user).values('id','name','create_time')
            # 根据编辑器模式返回不同的模板
            if editor_mode == 1:
                return render(request, 'app_doc/create_doc.html', locals())
            elif editor_mode == 2:
                return render(request, 'app_doc/create_doc_vditor.html', locals())
        except Exception as e:
            logger.exception("访问创建文档页面出错")
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
            status = request.POST.get('status',1) # 文档状态
            if project != '' and doc_name != '' and project != '-1':
                # 验证请求者是否有文集的权限
                check_project = Project.objects.filter(id=project,create_user=request.user)
                colla_project = ProjectCollaborator.objects.filter(project=project,user=request.user)
                if check_project.count() > 0 or colla_project.count() > 0:
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
                                sort = sort if sort != '' else 99,
                                create_user=request.user,
                                status = status,
                                editor_mode = editor_mode
                            )
                            # 设置文档标签
                            for t in doc_tags.split(","):
                                if t != '':
                                    tag = Tag.objects.get_or_create(name=t,create_user=request.user)
                                    DocTag.objects.get_or_create(tag=tag[0],doc=doc)

                            return JsonResponse({'status': True, 'data': {'pro': project, 'doc': doc.id}})
                        except Exception as e:
                            logger.exception("创建文档异常")
                            # 回滚事务
                            transaction.savepoint_rollback(save_id)
                        transaction.savepoint_commit(save_id)
                        return JsonResponse({'status': False, 'data': '创建失败'})
                else:
                    return JsonResponse({'status':False,'data':'无权操作此文集'})
            else:
                return JsonResponse({'status':False,'data':'请确认文档标题、文集正确'})
        except Exception as e:
            logger.exception("创建文档出错")
            return JsonResponse({'status':False,'data':'请求出错'})
    else:
        return JsonResponse({'status':False,'data':'方法不允许'})


# 修改文档
@login_required()
@require_http_methods(['GET',"POST"])
def modify_doc(request,doc_id):
    # 获取用户的编辑器模式
    try:
        user_opt = UserOptions.objects.get(user=request.user)
        if user_opt.editor_mode == 1:
            editor_mode = 1
        elif user_opt.editor_mode == 2:
            editor_mode = 2
    except ObjectDoesNotExist:
        editor_mode = 1
    if request.method == 'GET':
        try:
            doc = Doc.objects.get(id=doc_id) # 查询文档信息
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
                # 获取用户的编辑器模式
                if editor_mode == 1:
                    return render(request, 'app_doc/modify_doc.html', locals())
                elif editor_mode == 2:
                    return render(request, 'app_doc/modify_doc_vditor.html', locals())

            else:
                return render(request,'403.html')
        except Exception as e:
            logger.exception("修改文档页面访问出错")
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
            status = request.POST.get('status',1) # 文档状态

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
                                sort=sort if sort != '' else 99,
                                modify_time = datetime.datetime.now(),
                                status = status,
                                editor_mode = editor_mode
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

                            return JsonResponse({'status': True, 'data': '修改成功'})
                        except:
                            logger.exception("修改文档异常")
                            # 回滚事务
                            transaction.savepoint_rollback(save_id)
                        transaction.savepoint_commit(save_id)
                    return JsonResponse({'status': False, 'data': '修改失败'})

                else:
                    return JsonResponse({'status':False,'data':'未授权请求'})
            else:
                return JsonResponse({'status': False,'data':'参数错误'})
        except Exception as e:
            logger.exception("修改文档出错")
            return JsonResponse({'status':False,'data':'请求出错'})


# 删除文档 - 软删除 - 进入回收站
@login_required()
@require_http_methods(["POST"])
def del_doc(request):
    try:
        # 获取文档ID
        doc_id = request.POST.get('doc_id',None)
        if doc_id:
            # 查询文档
            try:
                doc = Doc.objects.get(id=doc_id)
                project = Project.objects.get(id=doc.top_doc) # 查询文档所属的文集
                # 获取文档所属文集的协作信息
                pro_colla = ProjectCollaborator.objects.filter(project=project,user=request.user) #
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
                Doc.objects.filter(parent_doc__in=chr_doc_ids).update(status=3,modify_time=datetime.datetime.now()) # 修改下级文档的下级文档状态

                return JsonResponse({'status': True, 'data': '删除完成'})
            else:
                return JsonResponse({'status': False, 'data': '非法请求'})
        else:
            return JsonResponse({'status':False,'data':'参数错误'})
    except Exception as e:
        logger.exception("删除文档出错")
        return JsonResponse({'status':False,'data':'请求出错'})


# 管理文档
@login_required()
@require_http_methods(['GET'])
@logger.catch()
def manage_doc(request):
    # 文档内容搜索参数
    search_kw = request.GET.get('kw','')
    # 文档状态筛选参数
    doc_status = request.GET.get('status', 'all')
    # 文档文集筛选参数
    doc_pro_id = request.GET.get('pid','')

    is_search = True if search_kw != '' else False
    is_status = doc_status
    is_project = True if doc_pro_id != '' else False

    # 无搜索 - 无状态 - 无文集
    if (is_search is False) and (is_status == 'all') and (is_project is False):
        doc_list = Doc.objects.filter(create_user=request.user,status__in=[0,1]).order_by('-modify_time')

    # 无搜索 - 无状态 - 有文集
    elif (is_search is False) and (is_status == 'all') and (is_project):
        doc_list = Doc.objects.filter(
            create_user=request.user,
            top_doc=int(doc_pro_id),
            status__in=[0,1]
        ).order_by('-modify_time')

    # 无搜索 - 有状态 - 无文集
    elif (is_search is False) and (is_status != 'all') and (is_project is False):
        # 返回已发布文档
        if doc_status == 'published':
            doc_list = Doc.objects.filter(create_user=request.user, status=1).order_by('-modify_time')
        # 返回草稿文档
        elif doc_status == 'draft':
            doc_list = Doc.objects.filter(create_user=request.user, status=0).order_by('-modify_time')
        else:
            doc_list = Doc.objects.filter(create_user=request.user, status__in=[0,1]).order_by('-modify_time')

    # 无搜索 - 有状态 - 有文集
    elif (is_search is False) and (is_status != 'all') and (is_project):
        # 返回已发布文档
        if doc_status == 'published':
            doc_list = Doc.objects.filter(
                create_user=request.user,
                status=1,
                top_doc=int(doc_pro_id)
            ).order_by('-modify_time')
        # 返回草稿文档
        elif doc_status == 'draft':
            doc_list = Doc.objects.filter(
                create_user=request.user,
                status=0,
                top_doc = int(doc_pro_id)
            ).order_by('-modify_time')
        else:
            doc_list = Doc.objects.filter(
                create_user=request.user,
                top_doc=int(doc_pro_id),
                status__in=[0,1]
            ).order_by('-modify_time')

    # 有搜索 - 无状态 - 无文集
    elif (is_search) and (is_status == 'all') and (is_project is False):
        doc_list = Doc.objects.filter(
            Q(content__icontains=search_kw) | Q(name__icontains=search_kw),  # 文本或文档标题包含搜索词
            create_user=request.user,
            status__in=[0,1]
        ).order_by('-modify_time')

    # 有搜索 - 无状态 - 有文集
    elif (is_search) and (is_status == 'all') and (is_project):
        doc_list = Doc.objects.filter(
            Q(content__icontains=search_kw) | Q(name__icontains=search_kw),  # 文本或文档标题包含搜索词
            create_user=request.user,top_doc=int(doc_pro_id),status__in=[0,1]
        ).order_by('-modify_time')

    # 有搜索 - 有状态 - 无文集
    elif (is_search) and (is_status != 'all') and (is_project is False):
        if doc_status == 'published':
            doc_list = Doc.objects.filter(
                Q(content__icontains=search_kw) | Q(name__icontains=search_kw),
                create_user=request.user,
                status = 1
            ).order_by('-modify_time')
        elif doc_status == 'draft':
            doc_list = Doc.objects.filter(
                Q(content__icontains=search_kw) | Q(name__icontains=search_kw), # 文本或文档标题包含搜索词
                create_user=request.user,
                status = 0
            ).order_by('-modify_time')
        else:
            doc_list = Doc.objects.filter(
                Q(content__icontains=search_kw) | Q(name__icontains=search_kw),  # 文本或文档标题包含搜索词
                create_user=request.user,status__in=[0,1]
            ).order_by('-modify_time')

    # 有搜索 - 有状态 - 有文集
    elif (is_search) and (is_status != 'all') and (is_project):
        if doc_status == 'published':
            doc_list = Doc.objects.filter(
                Q(content__icontains=search_kw) | Q(name__icontains=search_kw),
                create_user=request.user,
                status = 1,
                top_doc=int(doc_pro_id)
            ).order_by('-modify_time')
        elif doc_status == 'draft':
            doc_list = Doc.objects.filter(
                Q(content__icontains=search_kw) | Q(name__icontains=search_kw), # 文本或文档标题包含搜索词
                create_user=request.user,
                status = 0,
                top_doc=int(doc_pro_id)
            ).order_by('-modify_time')
        else:
            doc_list = Doc.objects.filter(
                Q(content__icontains=search_kw) | Q(name__icontains=search_kw),  # 文本或文档标题包含搜索词
                create_user=request.user,
                top_doc=int(doc_pro_id),status__in=[0,1]
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
    paginator = Paginator(doc_list, 15)
    page = request.GET.get('page', 1)
    try:
        docs = paginator.page(page)
    except PageNotAnInteger:
        docs = paginator.page(1)
    except EmptyPage:
        docs = paginator.page(paginator.num_pages)
    docs.status = doc_status
    docs.pid = doc_pro_id
    docs.kw = search_kw
    return render(request,'app_doc/manage_doc.html',locals())


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
        if (project.create_user is not request.user) and (colla.count()): # 请求者不是文集创建者和协作者返回错误
            return JsonResponse({'status':False,'data':'文集无权限'})
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':'文集不存在'})
    # 判断文档是否存在
    try:
        doc = Doc.objects.get(id=int(doc_id),create_user=request.user)
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':'文档不存在'})
    # 判断上级文档是否存在
    try:
        if parent_id != '0':
            parent = Doc.objects.get(id=int(parent_id),create_user=request.user)
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':'上级文档不存在'})
    # 复制文档
    if move_type == '0':
        copy_doc = Doc.objects.create(
            name = doc.name,
            pre_content = doc.pre_content,
            content = doc.content,
            parent_doc = parent_id,
            top_doc = int(pro_id),
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
            logger.exception("移动文档异常")
            return JsonResponse({'status':False,'data':'移动文档失败'})
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
            logger.exception("移动包含下级的文档异常")
            return JsonResponse({'status': False, 'data': '移动文档失败'})
    else:
        return JsonResponse({'status':False,'data':'移动类型错误'})


# 查看对比文档历史版本
@login_required()
@require_http_methods(['GET',"POST"])
def diff_doc(request,doc_id,his_id):
    if request.method == 'GET':
        try:
            doc = Doc.objects.get(id=doc_id)  # 查询文档信息
            project = Project.objects.get(id=doc.top_doc)  # 查询文档所属的文集信息
            pro_colla = ProjectCollaborator.objects.filter(project=project, user=request.user)  # 查询用户的协作文集信息
            if (request.user == doc.create_user) or (pro_colla[0].role == 1):
                history = DocHistory.objects.get(id=his_id)
                history_list = DocHistory.objects.filter(doc=doc).order_by('-create_time')
                if history.doc == doc:
                    return render(request, 'app_doc/diff_doc.html', locals())
                else:
                    return render(request, '403.html')
            else:
                return render(request, '403.html')
        except Exception as e:
            logger.exception("文档历史版本页面访问出错")
            return render(request, '404.html')

    elif request.method == 'POST':
        try:
            doc = Doc.objects.get(id=doc_id)  # 查询文档信息
            project = Project.objects.get(id=doc.top_doc)  # 查询文档所属的文集信息
            pro_colla = ProjectCollaborator.objects.filter(project=project, user=request.user)  # 查询用户的协作文集信息
            if (request.user == doc.create_user) or (pro_colla[0].role == 1):
                history = DocHistory.objects.get(id=his_id)
                if history.doc == doc:
                    return JsonResponse({'status':True,'data':history.pre_content})
                else:
                    return JsonResponse({'status': False, 'data': '非法请求'})
            else:
                return JsonResponse({'status':False,'data':'非法请求'})
        except Exception as e:
            logger.exception("文档历史版本获取出错")
            return JsonResponse({'status':False,'data':'获取异常'})


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
            return render(request, 'app_doc/manage_doc_history.html', locals())
        except Exception as e:
            logger.exception("管理文档历史版本页面访问出错")
            return render(request, '404.html')
    elif request.method == 'POST':
        try:
            history_id = request.POST.get('history_id','')
            DocHistory.objects.filter(id=history_id,doc=doc_id,create_user=request.user).delete()
            return JsonResponse({'status':True,'data':'删除成功'})
        except:
            logger.exception("操作文档历史版本出错")
            return JsonResponse({'status':False,'data':'出现异常'})


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
        return render(request,'app_doc/manage_doc_recycle.html',locals())
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
                    return JsonResponse({'status': False, 'data': '文档不存在'})
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
                        # 删除文档
                        doc.delete()
                    else:
                        return JsonResponse({'status':False,'data':'无效请求'})
                    return JsonResponse({'status': True, 'data': '删除完成'})
                else:
                    return JsonResponse({'status': False, 'data': '非法请求'})
            # 清空回收站
            elif types == 'empty':
                docs = Doc.objects.filter(status=3,create_user=request.user)
                docs.delete()
                return JsonResponse({'status': True, 'data': '清空成功'})
            # 还原回收站
            elif types == 'restoreAll':
                Doc.objects.filter(status=3,create_user=request.user).update(status=0)
                return JsonResponse({'status': True, 'data': '还原成功'})
            else:
                return JsonResponse({'status': False, 'data': '参数错误'})
        except Exception as e:
            logger.exception("处理文档出错")
            return JsonResponse({'status': False, 'data': '请求出错'})


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
        return JsonResponse({'status': False, 'data': '文档不存在'})
    # 判断请求者是否有权限（文档创建者、文集创建者、文集高级协作者）
    # 如果请求用户为文档创建者、高级权限的协作者、文集的创建者，可以删除
    if (request.user == doc.create_user) or (colla_user_role == 1) or (request.user == project.create_user):
        try:
            doc.status = 1
            doc.modify_time = datetime.datetime.now()
            doc.save()
            return JsonResponse({'status':True,'data':'发布成功'})
        except:
            logger.exception("文档一键发布失败")
            return JsonResponse({'status':False,'data':'发布失败'})
    else:
        return JsonResponse({'status':False,'data':'非法请求'})


# 创建文档模板
@login_required()
@require_http_methods(['GET',"POST"])
def create_doctemp(request):
    if request.method == 'GET':
        # 获取用户的编辑器模式
        try:
            user_opt = UserOptions.objects.get(user=request.user)
            if user_opt.editor_mode == 1:
                editor_mode = 1
            elif user_opt.editor_mode == 2:
                editor_mode = 2
        except ObjectDoesNotExist:
            editor_mode = 1
        doctemps = DocTemp.objects.filter(create_user=request.user)
        if editor_mode == 1:
            return render(request,'app_doc/create_doctemp.html',locals())
        else:
            return render(request, 'app_doc/create_doctemp_vditor.html', locals())
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
                return JsonResponse({'status':True,'data':'创建成功'})
            else:
                return JsonResponse({'status':False,'data':'模板标题不能为空'})
        except Exception as e:
            logger.exception("创建文档模板出错")
            return JsonResponse({'status':False,'data':'请求出错'})


# 修改文档模板
@login_required()
@require_http_methods(['GET',"POST"])
def modify_doctemp(request,doctemp_id):
    if request.method == 'GET':
        try:
            doctemp = DocTemp.objects.get(id=doctemp_id)
            if request.user.id == doctemp.create_user.id:
                # 获取用户的编辑器模式
                try:
                    user_opt = UserOptions.objects.get(user=request.user)
                    if user_opt.editor_mode == 1:
                        editor_mode = 1
                    elif user_opt.editor_mode == 2:
                        editor_mode = 2
                except ObjectDoesNotExist:
                    editor_mode = 1
                doctemps = DocTemp.objects.filter(create_user=request.user)
                if editor_mode == 1:
                    return render(request,'app_doc/modify_doctemp.html',locals())
                else:
                    return render(request, 'app_doc/modify_doctemp_vditor.html', locals())
            else:
                return HttpResponse('非法请求')
        except Exception as e:
            logger.exception("访问文档模板修改页面出错")
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
                    return JsonResponse({'status':True,'data':'修改成功'})
                else:
                    return JsonResponse({'status':False,'data':'非法操作'})
            else:
                return JsonResponse({'status':False,'data':'参数错误'})
        except Exception as e:
            logger.exception("修改文档模板出错")
            return JsonResponse({'status':False,'data':'请求出错'})


# 删除文档模板
@login_required()
def del_doctemp(request):
    try:
        doctemp_id = request.POST.get('doctemp_id','')
        if doctemp_id != '':
            doctemp = DocTemp.objects.get(id=doctemp_id)
            if request.user.id == doctemp.create_user.id:
                doctemp.delete()
                return JsonResponse({'status':True,'data':'删除完成'})
            else:
                return JsonResponse({'status':False,'data':'非法请求'})
        else:
            return JsonResponse({'status': False, 'data': '参数错误'})
    except Exception as e:
        logger.exception("删除文档模板出错")
        return JsonResponse({'status':False,'data':'请求出错'})


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
        return render(request, 'app_doc/manage_doctemp.html', locals())
    except Exception as e:
        logger.exception("管理文档模板页面访问出错")
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
            return JsonResponse({'status':False,'data':'参数错误'})
    except Exception as e:
        logger.exception("获取指定文档模板出错")
        return JsonResponse({'status':False,'data':'请求出错'})


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
        return JsonResponse({'status':False,'data':'参数错误'})


# 获取指定文集的文档树数据
# @login_required()
@require_http_methods(['POST'])
@logger.catch()
def get_pro_doc_tree(request):
    pro_id = request.POST.get('pro_id', None)
    if pro_id:
        # 查询存在上级文档的文档
        parent_id_list = Doc.objects.filter(top_doc=pro_id,status=1).exclude(parent_doc=0).values_list('parent_doc',flat=True)
        # 获取存在上级文档的上级文档ID
        # print(parent_id_list)
        doc_list = []
        # 获取一级文档
        top_docs = Doc.objects.filter(top_doc=pro_id,parent_doc=0,status=1).values('id','name').order_by('sort')
        # 遍历一级文档
        for doc in top_docs:
            top_item = {
                'id':doc['id'],
                'field':doc['name'],
                'title':doc['name'],
                'spread':True,
                'level':1
            }
            # 如果一级文档存在下级文档，查询其二级文档
            if doc['id'] in parent_id_list:
                # 获取二级文档
                sec_docs = Doc.objects.filter(top_doc=pro_id,parent_doc=doc['id'],status=1).values('id','name').order_by('sort')
                top_item['children'] = []
                for doc in sec_docs:
                    sec_item = {
                        'id': doc['id'],
                        'field': doc['name'],
                        'title': doc['name'],
                        'level':2
                    }
                    # 如果二级文档存在下级文档，查询第三级文档
                    if doc['id'] in parent_id_list:
                        # 获取三级文档
                        thr_docs = Doc.objects.filter(top_doc=pro_id,parent_doc=doc['id'],status=1).values('id','name').order_by('sort')
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
        return JsonResponse({'status':True,'data':doc_list})
    else:
        return JsonResponse({'status':False,'data':'参数错误'})


# 404页面
def handle_404(request):
    return render(request,'404.html')

# 导出文集MD文件
@login_required()
@require_http_methods(["POST"])
def report_md(request):
    pro_id = request.POST.get('project_id','')
    user = request.user
    try:
        project = Project.objects.get(id=int(pro_id))
        if project.create_user == user:
            project_md = ReportMD(
                project_id=int(pro_id)
            )
            md_file_path = project_md.work() # 生成并获取MD文件压缩包绝对路径
            md_file_filename = os.path.split(md_file_path)[-1] # 提取文件名
            md_file = "/media/reportmd_temp/"+ md_file_filename # 拼接相对链接
            return JsonResponse({'status':True,'data':md_file})
        else:
            return JsonResponse({'status':False,'data':'无权限'})
    except Exception as e:
        logger.exception("导出文集MD文件出错")
        return JsonResponse({'status':False,'data':'文集不存在'})


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
                    logger.exception("生成EPUB出错")
                    return JsonResponse({'status': False, 'data': '生成出错'})
            # 导出PDF
            elif report_type in ['pdf']:
                try:
                    report_project = ReportPDF(
                        project_id=project.id
                    ).work()
                    if report_project is False:
                        return JsonResponse({'status':False,'data':'生成出错'})
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
                    return JsonResponse({'status': False, 'data': '生成出错'})
            else:
                return JsonResponse({'status': False, 'data': '不支持的类型'})
        # 不允许被导出
        else:
            return JsonResponse({'status':False,'data':'无权限导出'})

    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':'文集不存在'})

    except Exception as e:
        logger.exception("生成文集文件出错")
        return JsonResponse({'status':False,'data':'系统异常'})


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
                        return JsonResponse({'status':False,'data':'无可用文件,请联系文集创建者'})
                    # print(report_project)
                    return JsonResponse({'status': True, 'data': report_project.file_path})
                except Exception as e:
                    return JsonResponse({'status': False, 'data': '导出出错'})
            # 导出PDF
            elif report_type in ['pdf']:
                try:
                    try:
                        report_project = ProjectReportFile.objects.get(project=project,file_type='pdf')
                    except ObjectDoesNotExist:
                        return JsonResponse({'status':False,'data':'无可用文件,请联系文集创建者'})
                    # print(report_project)
                    return JsonResponse({'status': True, 'data': report_project.file_path})
                except Exception as e:
                    return JsonResponse({'status': False, 'data': '导出出错'})
            else:
                return JsonResponse({'status': False, 'data': '不支持的类型'})
        else:
            return JsonResponse({'status':False,'data':'无权限导出'})
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':'文集不存在'})
    except Exception as e:
        logger.exception("获取文集前台导出文件出错")
        return JsonResponse({'status':False,'data':'系统异常'})


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
            return render(request,'app_doc/manage_image.html',locals())
        except:
            logger.exception("图片素材管理出错")
            return render(request,'404.html')
    elif request.method == 'POST':
        try:
            img_id = request.POST.get('img_id','')
            types = request.POST.get('types','') # 操作类型：0表示删除，1表示修改，2表示获取
            # 删除图片
            if int(types) == 0:
                img = Image.objects.get(id=img_id)
                if img.user != request.user:
                    return JsonResponse({'status': False, 'data': '未授权请求'})
                file_path = settings.BASE_DIR+img.file_path
                is_exist = os.path.exists(file_path)
                if is_exist:
                    os.remove(file_path)
                img.delete() # 删除记录
                return JsonResponse({'status':True,'data':'删除完成'})
            # 移动图片分组
            elif int(types) == 1:
                group_id = request.POST.get('group_id',None)
                if group_id is None:
                    Image.objects.filter(id=img_id,user=request.user).update(group_id=None)
                else:
                    group = ImageGroup.objects.get(id=group_id,user=request.user)
                    Image.objects.filter(id=img_id,user=request.user).update(group_id=group)
                return JsonResponse({'status':True,'data':'移动完成'})
            # 获取图片
            elif int(types) == 2:
                group_id = request.POST.get('group_id', None) # 接受分组ID参数
                if group_id is None: #
                    return JsonResponse({'status':False,'data':'参数错误'})
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
                return JsonResponse({'status':False,'data':'非法参数'})
        except ObjectDoesNotExist:
            return JsonResponse({'status':False,'data':'图片不存在'})
        except:
            logger.exception("操作图片素材出错")
            return JsonResponse({'status':False,'data':'程序异常'})

# 图片分组管理
@login_required()
@require_http_methods(['GET',"POST"])
@logger.catch()
def manage_img_group(request):
    if request.method == 'GET':
        groups = ImageGroup.objects.filter(user=request.user)
        return render(request,'app_doc/manage_image_group.html',locals())
    # 操作分组
    elif request.method == 'POST':
        types = request.POST.get('types',None) # 请求类型，0表示创建分组，1表示修改分组，2表示删除分组，3表示获取分组
        # 创建分组
        if int(types) == 0:
            group_name = request.POST.get('group_name', '')
            if group_name not in ['','默认分组','未分组']:
                ImageGroup.objects.get_or_create(
                    user = request.user,
                    group_name = group_name
                )
                return JsonResponse({'status':True,'data':'ok'})
            else:
                return JsonResponse({'status':False,'data':'名称无效'})
        # 修改分组
        elif int(types) == 1:
            group_name = request.POST.get("group_name",'')
            if group_name not in ['','默认分组','未分组']:
                group_id = request.POST.get('group_id', '')
                ImageGroup.objects.filter(id=group_id,user=request.user).update(group_name=group_name)
                return JsonResponse({'status':True,'data':'修改成功'})
            else:
                return JsonResponse({'status':False,'data':'名称无效'})

        # 删除分组
        elif int(types) == 2:
            try:
                group_id = request.POST.get('group_id','')
                group = ImageGroup.objects.get(id=group_id,user=request.user) # 查询分组
                images = Image.objects.filter(group_id=group_id,user=request.user).update(group_id=None) # 移动图片到未分组
                group.delete() # 删除分组
                return JsonResponse({'status':True,'data':'删除完成'})
            except:
                logger.exception("删除图片分组出错")
                return JsonResponse({'status':False,'data':'删除错误'})
        # 获取分组
        elif int(types) == 3:
            try:
                group_list = []
                all_cnt = Image.objects.filter(user=request.user).count()
                non_group_cnt = Image.objects.filter(group_id=None,user=request.user).count()
                group_list.append({'group_name':'全部图片','group_cnt':all_cnt,'group_id':0})
                group_list.append({'group_name':'未分组','group_cnt':non_group_cnt,'group_id':-1})
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
                logger.exception("获取图片分组出错")
                return JsonResponse({'status':False,'data':'出现错误'})


# 附件管理
@login_required()
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
            return render(request, 'app_doc/manage_attachment.html', locals())
        except Exception as e:
            logger.exception("附件管理访问出错")
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
                    return JsonResponse({'status':False,'data':'文件大小超出限制'})

                # 限制附件格式
                # 获取系统设置允许的附件格式，如果不存在，默认仅允许zip格式文件
                try:
                    attacement_suffix_list =  SysSetting.objects.get(types='doc',name='attachment_suffix')
                    attacement_suffix_list = attacement_suffix_list.value.split(',')
                except ObjectDoesNotExist:
                    attachment_suffix_list = ['zip']
                allow_attachment = False
                for suffix in attacement_suffix_list:
                    if attachment_name.split('.')[-1] in attacement_suffix_list:
                        allow_attachment = True
                if allow_attachment:
                    a = Attachment.objects.create(
                        file_name = attachment_name,
                        file_size = attachment_size,
                        file_path = attachment,
                        user = request.user
                    )
                    return JsonResponse({'status':True,'data':{'name':attachment_name,'url':a.file_path.name}})
                else:
                    return JsonResponse({'status':False,'data':'不支持的格式'})
            else:
                return JsonResponse({'status':False,'data':'无效文件'})
        elif types in ['1',1]:
            attach_id = request.POST.get('attach_id','')
            attachment = Attachment.objects.filter(id=attach_id,user=request.user) # 查询附件
            for a in attachment: # 遍历附件
                a.file_path.delete() # 删除文件
            attachment.delete() # 删除数据库记录
            return JsonResponse({'status':True,'data':'删除成功'})
        elif types in [2,'2']:
            attachment_list = []
            attachments = Attachment.objects.filter(user=request.user)
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
            return JsonResponse({'status':False,'data':'无效参数'})


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
                )]  # 公开文集

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
                pass

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
                return JsonResponse({'status':False,'data':'文档不存在'})
        else:
            try:
                doc = Doc.objects.get(id=doc_id,create_user = request.user)
            except ObjectDoesNotExist:
                return JsonResponse({'status':False,'data':'文档不存在'})
    else:
        return render(request,'404.html')

    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename={}.md'.format(doc.name)
    response.write(doc.pre_content)

    return response


# 个人中心 - 概览
@login_required()
@require_http_methods(['GET'])
def manage_overview(request):
    pro_list = Project.objects.filter(create_user=request.user).order_by('-create_time')
    colla_pro_cnt = ProjectCollaborator.objects.filter(user=request.user).count()
    total_pro_cnt = pro_list.count() + colla_pro_cnt
    total_doc_cnt = Doc.objects.filter(create_user=request.user).count()
    total_tag_cnt = Tag.objects.filter(create_user=request.user).count()

    doc_active_list = Doc.objects.filter(create_user=request.user).order_by('-modify_time')[:5]

    return render(request,'app_doc/manage_overview.html',locals())

# 个人中心 - 文档标签
@login_required()
@require_http_methods(['GET','POST'])
def manage_doc_tag(request):
    if request.method == 'GET':
        tags = Tag.objects.filter(create_user=request.user)
        return render(request,'app_doc/manage_doc_tag.html',locals())
        # 操作分组
    elif request.method == 'POST':
        types = request.POST.get('types', None)  # 请求类型，0表示创建标签，1表示修改标签，2表示删除标签，3表示获取标签
        # 创建分组
        if int(types) == 0:
            tag_name = request.POST.get('tag_name', '')
            if tag_name != '':
                Tag.objects.create(
                    user=request.user,
                    name=tag_name
                )
                return JsonResponse({'status': True, 'data': 'ok'})
            else:
                return JsonResponse({'status': False, 'data': '名称无效'})
        # 修改分组
        elif int(types) == 1:
            try:
                tag_name = request.POST.get('tag_name', '')
                if tag_name != "":
                    tag_id = request.POST.get('tag_id', '')
                    if tag_id != "":
                        print(tag_id,tag_name)
                        Tag.objects.filter(id=tag_id, create_user=request.user).update(name=tag_name)
                        return JsonResponse({'status': True, 'data': '修改成功'})
                    else:
                        return JsonResponse({'status': False, 'data': '标签ID无效'})
                else:
                    return JsonResponse({'status': False, 'data': '名称无效'})
            except Exception as e:
                logger.exception("修改异常")
                return JsonResponse({'status': False, 'data': '异常错误'})

        # 删除分组
        elif int(types) == 2:
            try:
                tag_id = request.POST.get('tag_id', '')
                tag = Tag.objects.get(id=tag_id, create_user=request.user)  # 查询分组
                tag.delete()  # 删除标签
                return JsonResponse({'status': True, 'data': '删除完成'})
            except:
                logger.exception("删除标签出错")
                return JsonResponse({'status': False, 'data': '删除错误'})
        # 获取分组
        elif int(types) == 3:
            try:
                tag_list = []
                return JsonResponse({'status': True, 'data': tag_list})
            except:
                logger.exception("获取文档标签出错")
                return JsonResponse({'status': False, 'data': '出现错误'})


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
        logger.exception("标签文档页访问异常")
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
            return HttpResponse('参数错误')
    except Exception as e:
        logger.exception("文集浏览出错")
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
        return render(request,'app_doc/manage_self.html',locals())
    elif request.method == 'POST':
        first_name = request.POST.get('first_name','') # 昵称
        email = request.POST.get('email',None) # 电子邮箱
        editor_mode = request.POST.get('editor_mode',1) # 编辑器
        user = User.objects.get_by_natural_key(request.user)
        if len(first_name) < 2 or len(first_name) > 10:
            return JsonResponse({'status': False, 'data': '昵称长度不得小于2位大于10位'})
        if User.objects.filter(first_name=first_name).count() > 0 and user.first_name != first_name:
            return JsonResponse({'status':False,'data':'昵称已被使用'})
        if User.objects.filter(email=email).count() > 0 and user.email != email:
            return JsonResponse({'status':False,'data':'电子邮箱已被使用'})
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
            return JsonResponse({'status':False,'data':'参数不正确'})