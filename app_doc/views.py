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
import datetime
import traceback
import re
from app_doc.report_utils import *
from app_admin.decorators import check_headers,allow_report_file
import os.path

# 替换前端传来的非法字符
def validateTitle(title):
  rstr = r"[\/\\\:\*\?\"\<\>\|]" # '/ \ : * ? " < > |'
  new_title = re.sub(rstr, "_", title) # 替换为下划线
  return new_title


def project_list(request):
    kw = request.GET.get('kw','') # 搜索词
    sort = request.GET.get('sort',0) # 排序,0表示按时间升序排序，1表示按时间降序排序，默认为0
    role = request.GET.get('role',-1) # 筛选文集权限，默认为显示所有可显示的文集

    # 是否排序
    if sort in ['',0,'0']:
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
def create_project(request):
    if request.method == 'POST':
        try:
            name = request.POST.get('pname','')
            name = validateTitle(name)
            desc = request.POST.get('desc','')
            role = request.POST.get('role',0)
            role_list = ['0','1','2','3',0,1,2,3]
            if name != '':
                project = Project.objects.create(
                    name=name,
                    intro=desc[:100],
                    create_user=request.user,
                    role = int(role) if role in role_list else 0
                )
                project.save()
                return JsonResponse({'status':True,'data':{'id':project.id,'name':project.name}})
            else:
                return JsonResponse({'status':False,'data':'文集名称不能为空！'})
        except Exception as e:
            if settings.DEBUG:
                print(traceback.print_exc())
            return JsonResponse({'status':False,'data':'出现异常,请检查输入值！'})
    else:
        return JsonResponse({'status':False,'data':'请求方法不允许'})


# 文集页
@require_http_methods(['GET'])
@check_headers
def project_index(request,pro_id):
    # 获取文集
    try:
        # 获取文集信息
        project = Project.objects.get(id=int(pro_id))
        # 获取文集的协作用户信息
        if request.user.is_authenticated: # 对登陆用户查询其协作文档信息
            colla_user = ProjectCollaborator.objects.filter(project=project,user=request.user).count()
        else:
            colla_user = 0

        # 获取问价文集前台下载权限
        try:
            allow_epub_download = ProjectReport.objects.get(project=project).allow_epub
        except ObjectDoesNotExist:
            allow_epub_download = 0

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
        project_docs = Doc.objects.filter(top_doc=int(pro_id), parent_doc=0, status=1).order_by('sort')
        if kw != '':
            search_result = Doc.objects.filter(top_doc=int(pro_id),pre_content__icontains=kw)
            return render(request,'app_doc/project_doc_search.html',locals())
        return render(request, 'app_doc/project.html', locals())
    except Exception as e:
        if settings.DEBUG:
            print(traceback.print_exc())
        return render(request,'404.html')


# 修改文集
@login_required()
def modify_project(request):
    if request.method == 'POST':
        try:
            pro_id = request.POST.get('pro_id',None)
            project = Project.objects.get(id=pro_id)
            # 验证用户有权限修改文集
            if (request.user == project.create_user) or request.user.is_superuser:
                name = request.POST.get('name',None)
                content = request.POST.get('desc',None)
                project.name = name
                project.intro = content
                project.save()
                return JsonResponse({'status':True,'data':'修改成功'})
            else:
                return JsonResponse({'status':False,'data':'非法请求'})
        except Exception as e:
            if settings.DEBUG:
                print(traceback.print_exc())
            return JsonResponse({'status':False,'data':'请求出错'})
    else:
        return JsonResponse({'status':False,'data':'方法不允许'})


# 修改文集权限
@login_required()
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
                return render(request, 'app_doc/manage_project_role.html', locals())
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
        if settings.DEBUG:
            print(traceback.print_exc())
        return render(request,'404.html')


# 删除文集
@login_required()
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
        if settings.DEBUG:
            print(traceback.print_exc())
        return JsonResponse({'status':False,'data':'请求出错'})


# 管理文集
@login_required()
def manage_project(request):
    if request.method == 'GET':
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
            if settings.DEBUG:
                print(traceback.print_exc())
            return render(request,'404.html')
    else:
        return HttpResponse('方法不允许')


# 修改文集前台下载权限
@login_required()
def modify_project_download(request,pro_id):
    try:
        pro = Project.objects.get(id=pro_id)
    except ObjectDoesNotExist:
        return Http404
    if (pro.create_user != request.user) and (request.user.is_superuser is False):
        return render(request,'403.html')
    else:
        if request.method == 'GET':
            return render(request,'app_doc/manage_project_download.html',locals())
        elif request.method == 'POST':
            download_epub = request.POST.get('download_epub',None)
            # print("epub状态:",download_epub)
            if download_epub == 'on':
                epub_status = 1
            else:
                epub_status = 0
            ProjectReport.objects.update_or_create(
                project = pro,defaults={'allow_epub':epub_status}
            )
            return render(request,'app_doc/manage_project_download.html',locals())


# 文集协作管理
@login_required()
def manage_project_collaborator(request,pro_id):
    project = Project.objects.filter(id=pro_id, create_user=request.user)
    if project.exists() is False:
        return Http404

    if request.method == 'GET':
        pro = project[0]
        collaborator = ProjectCollaborator.objects.filter(project=pro)
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
                if settings.DEBUG:
                    print(traceback.print_exc())
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
                if settings.DEBUG:
                    print(traceback.print_exc())
                return JsonResponse({'status':False,'data':'修改失败'})

        else:
            return JsonResponse({'status':False,'data':'无效的类型'})


# 我协作的文集
@login_required()
def manage_pro_colla_self(request):
    colla_pros = ProjectCollaborator.objects.filter(user=request.user)
    return render(request,'app_doc/manage_project_self_colla.html',locals())


# 文档浏览页页
@require_http_methods(['GET'])
def doc(request,pro_id,doc_id):
    try:
        if pro_id != '' and doc_id != '':
            # 获取文集信息
            project = Project.objects.get(id=int(pro_id))
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
            except ObjectDoesNotExist:
                if settings.DEBUG:
                    print(traceback.print_exc())
                return render(request, '404.html')
            # 获取文集下一级文档
            project_docs = Doc.objects.filter(top_doc=doc.top_doc, parent_doc=0, status=1).order_by('sort')
            return render(request,'app_doc/doc.html',locals())
        else:
            return HttpResponse('参数错误')
    except Exception as e:
        if settings.DEBUG:
            print(traceback.print_exc())
        return render(request,'404.html')


# 创建文档
@login_required()
def create_doc(request):
    if request.method == 'GET':
        try:
            pid = request.GET.get('pid',-999)
            project_list = Project.objects.filter(create_user=request.user) # 自己创建的文集列表
            colla_project_list = ProjectCollaborator.objects.filter(user=request.user) # 协作的文集列表
            doctemp_list = DocTemp.objects.filter(create_user=request.user).values('id','name','create_time')
            return render(request,'app_doc/create_doc.html',locals())
        except Exception as e:
            if settings.DEBUG:
                print(traceback.print_exc())
            return render(request,'404.html')
    elif request.method == 'POST':
        try:
            project = request.POST.get('project','')
            parent_doc = request.POST.get('parent_doc','')
            doc_name = request.POST.get('doc_name','')
            doc_content = request.POST.get('content','')
            pre_content = request.POST.get('pre_content','')
            sort = request.POST.get('sort','')
            status = request.POST.get('status',1)
            if project != '' and doc_name != '' and project != '-1':
                # 验证请求者是否有文集的权限
                check_project = Project.objects.filter(id=project,create_user=request.user)
                colla_project = ProjectCollaborator.objects.filter(project=project,user=request.user)
                if check_project.count() > 0 or colla_project.count() > 0:
                    # 创建文档
                    doc = Doc.objects.create(
                        name=doc_name,
                        content = doc_content,
                        pre_content= pre_content,
                        parent_doc= int(parent_doc) if parent_doc != '' else 0,
                        top_doc= int(project),
                        sort = sort if sort != '' else 99,
                        create_user=request.user,
                        status = status
                    )
                    return JsonResponse({'status':True,'data':{'pro':project,'doc':doc.id}})
                else:
                    return JsonResponse({'status':False,'data':'无权操作此文集'})
            else:
                return JsonResponse({'status':False,'data':'请确认文档标题、文集正确'})
        except Exception as e:
            if settings.DEBUG:
                print(traceback.print_exc())
            return JsonResponse({'status':False,'data':'请求出错'})
    else:
        return JsonResponse({'status':False,'data':'方法不允许'})


# 修改文档
@login_required()
def modify_doc(request,doc_id):
    if request.method == 'GET':
        try:
            doc = Doc.objects.get(id=doc_id) # 查询文档信息
            project = Project.objects.get(id=doc.top_doc) # 查询文档所属的文集信息
            pro_colla = ProjectCollaborator.objects.filter(project=project,user=request.user) # 查询用户的协作文集信息
            if (request.user == doc.create_user) or (pro_colla[0].role == 1):
                doc_list = Doc.objects.filter(top_doc=project.id)
                doctemp_list = DocTemp.objects.filter(create_user=request.user)
                history_list = DocHistory.objects.filter(doc=doc).order_by('-create_time')
                return render(request,'app_doc/modify_doc.html',locals())
            else:
                return render(request,'403.html')
        except Exception as e:
            if settings.DEBUG:
                print(traceback.print_exc())
            return render(request,'404.html')
    elif request.method == 'POST':
        try:
            doc_id = request.POST.get('doc_id','') # 文档ID
            project = request.POST.get('project', '') # 文集ID
            parent_doc = request.POST.get('parent_doc', '') # 上级文档ID
            doc_name = request.POST.get('doc_name', '') # 文档名称
            doc_content = request.POST.get('content', '') # 文档内容
            pre_content = request.POST.get('pre_content', '') # 文档Markdown格式内容
            sort = request.POST.get('sort', '') # 文档排序
            status = request.POST.get('status',1) # 文档状态

            if doc_id != '' and project != '' and doc_name != '' and project != '-1':
                doc = Doc.objects.get(id=doc_id)
                pro_colla = ProjectCollaborator.objects.filter(project=project, user=request.user)
                # 验证用户有权限修改文档 - 文档的创建者或文集的高级协作者
                if (request.user == doc.create_user) or (pro_colla[0].role == 1):
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
                        status = status
                    )
                    return JsonResponse({'status': True,'data':'修改成功'})
                else:
                    return JsonResponse({'status':False,'data':'未授权请求'})
            else:
                return JsonResponse({'status': False,'data':'参数错误'})
        except Exception as e:
            if settings.DEBUG:
                print(traceback.print_exc())
            return JsonResponse({'status':False,'data':'请求出错'})


# 删除文档
@login_required()
def del_doc(request):
    try:
        # 获取文档ID
        doc_id = request.POST.get('doc_id',None)
        if doc_id:
            # 查询文档
            try:
                doc = Doc.objects.get(id=doc_id)
            except ObjectDoesNotExist:
                return JsonResponse({'status': False, 'data': '文档不存在'})
            if request.user == doc.create_user:
                # 删除
                doc.delete()
                # 修改其子文档为顶级文档
                Doc.objects.filter(parent_doc=doc_id).update(parent_doc=0)
                return JsonResponse({'status': True, 'data': '删除完成'})
            else:
                return JsonResponse({'status': False, 'data': '非法请求'})
        else:
            return JsonResponse({'status':False,'data':'参数错误'})
    except Exception as e:
        if settings.DEBUG:
            print(traceback.print_exc())
        return JsonResponse({'status':False,'data':'请求出错'})


# 管理文档
@login_required()
def manage_doc(request):
    if request.method == 'GET':
        # 文档内容搜索参数
        search_kw = request.GET.get('kw',None)
        if search_kw:
            # 已发布文档数量
            published_doc_cnt = Doc.objects.filter(
                create_user=request.user, status=1
            ).count()
            # 草稿文档数量
            draft_doc_cnt = Doc.objects.filter(
                create_user=request.user, status=0
            ).count()
            # 所有文档数量
            all_cnt = published_doc_cnt + draft_doc_cnt
            # 获取文档状态筛选参数
            doc_status = request.GET.get('status', 'all')

            # 查询文档
            if doc_status == 'all':
                doc_list = Doc.objects.filter(
                    Q(content__icontains=search_kw) | Q(name__icontains=search_kw),  # 文本或文档标题包含搜索词
                    create_user=request.user,
                ).order_by('-modify_time')
            elif doc_status == 'published':
                doc_list = Doc.objects.filter(
                    create_user=request.user,
                    content__icontains=search_kw,
                    status = 1
                ).order_by('-modify_time')
            elif doc_status == 'draft':
                doc_list = Doc.objects.filter(
                    Q(content__icontains=search_kw) | Q(name__icontains=search_kw), # 文本或文档标题包含搜索词
                    create_user=request.user,
                    status = 0
                ).order_by('-modify_time')
            # 分页处理
            paginator = Paginator(doc_list, 15)
            page = request.GET.get('page', 1)
            try:
                docs = paginator.page(page)
            except PageNotAnInteger:
                docs = paginator.page(1)
            except EmptyPage:
                docs = paginator.page(paginator.num_pages)
            docs.kw = search_kw
            docs.status = doc_status
        else:
            # 已发布文档数量
            published_doc_cnt = Doc.objects.filter(
                create_user=request.user,status=1
            ).count()
            # 草稿文档数量
            draft_doc_cnt = Doc.objects.filter(
                create_user=request.user,status=0
            ).count()
            # 所有文档数量
            all_cnt = published_doc_cnt + draft_doc_cnt
            # 获取文档状态筛选参数
            doc_status = request.GET.get('status','all')
            if len(doc_status) == 0:
                doc_status = 'all'
            # print('status:', doc_status,type(doc_status))
            # 返回所有文档
            if doc_status == 'all':
                doc_list = Doc.objects.filter(create_user=request.user).order_by('-modify_time')
            # 返回已发布文档
            elif doc_status == 'published':
                doc_list = Doc.objects.filter(
                    create_user=request.user,status=1
                ).order_by('-modify_time')
            # 返回草稿文档
            elif doc_status == 'draft':
                doc_list = Doc.objects.filter(
                    create_user=request.user, status=0
                ).order_by('-modify_time')
            else:
                doc_list = Doc.objects.filter(create_user=request.user).order_by('-modify_time')
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
        return render(request,'app_doc/manage_doc.html',locals())
    else:
        return HttpResponse('方法不允许')

# 查看对比文档历史版本
@login_required()
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
            if settings.DEBUG:
                print(traceback.print_exc())
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
            if settings.DEBUG:
                print(traceback.print_exc())
            return JsonResponse({'status':False,'data':'获取异常'})

# 管理文档历史版本
@login_required()
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
            if settings.DEBUG:
                print(traceback.print_exc())
            return render(request, '404.html')
    elif request.method == 'POST':
        try:
            history_id = request.POST.get('history_id','')
            DocHistory.objects.filter(id=history_id,doc=doc_id,create_user=request.user).delete()
            return JsonResponse({'status':True,'data':'删除成功'})
        except:
            if settings.DEBUG:
                print(traceback.print_exc())
            return JsonResponse({'status':False,'data':'出现异常'})


# 创建文档模板
@login_required()
def create_doctemp(request):
    if request.method == 'GET':
        doctemps = DocTemp.objects.filter(create_user=request.user)
        return render(request,'app_doc/create_doctemp.html',locals())
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
            if settings.DEBUG:
                print(traceback.print_exc())
            return JsonResponse({'status':False,'data':'请求出错'})
    else:
        return JsonResponse({'status':False,'data':'方法不允许'})


# 修改文档模板
@login_required()
def modify_doctemp(request,doctemp_id):
    if request.method == 'GET':
        try:
            doctemp = DocTemp.objects.get(id=doctemp_id)
            if request.user.id == doctemp.create_user.id:
                doctemps = DocTemp.objects.filter(create_user=request.user)
                return render(request,'app_doc/modify_doctemp.html',locals())
            else:
                return HttpResponse('非法请求')
        except Exception as e:
            if settings.DEBUG:
                print(traceback.print_exc())
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
            if settings.DEBUG:
                print(traceback.print_exc())
            return JsonResponse({'status':False,'data':'请求出错'})
    else:
        return HttpResponse('方法不允许')


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
        if settings.DEBUG:
            print(traceback.print_exc())
        return JsonResponse({'status':False,'data':'请求出错'})


# 管理文档模板
@login_required()
def manage_doctemp(request):
    if request.method == 'GET':
        try:
            search_kw = request.GET.get('kw', None)
            if search_kw:
                doctemp_list = DocTemp.objects.filter(create_user=request.user,content__icontains=search_kw)
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
                doctemp_list = DocTemp.objects.filter(create_user=request.user)
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
            if settings.DEBUG:
                print(traceback.print_exc())
            return render(request, '404.html')
    else:
        return HttpResponse('方法不允许')


# 获取指定文档模板
@login_required()
def get_doctemp(request):
    if request.method == 'POST':
        try:
            doctemp_id = request.POST.get('doctemp_id','')
            if doctemp_id != '':
                content = DocTemp.objects.get(id=int(doctemp_id)).serializable_value('content')
                return JsonResponse({'status':True,'data':content})
            else:
                return JsonResponse({'status':False,'data':'参数错误'})
        except Exception as e:
            if settings.DEBUG:
                print(traceback.print_exc())
            return JsonResponse({'status':False,'data':'请求出错'})
    else:
        return JsonResponse({'status':False,'data':'方法错误'})


# 获取指定文集的所有文档
def get_pro_doc(request):
    if request.method == 'POST':
        pro_id = request.POST.get('pro_id','')
        if pro_id != '':
            # 获取文集所有文档的id、name和parent_doc3个字段
            doc_list = Doc.objects.filter(top_doc=int(pro_id)).values_list('id','name','parent_doc').order_by('parent_doc')
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
    else:
        return JsonResponse({'status':False,'data':'方法错误'})

# 获取指定文集的文档树数据
@login_required()
@require_http_methods(['POST'])
def get_pro_doc_tree(request):
    pro_id = request.POST.get('pro_id', None)
    if pro_id:
        # 获取一级文档
        doc_list = []
        top_docs = Doc.objects.filter(top_doc=pro_id,parent_doc=0,status=1).order_by('sort')
        for doc in top_docs:
            top_item = {
                'id':doc.id,
                'field':doc.name,
                'title':doc.name,
                'spread':True,
                'level':1
            }
            # 获取二级文档
            sec_docs = Doc.objects.filter(top_doc=pro_id,parent_doc=doc.id,status=1).order_by('sort')
            if sec_docs.exists():# 二级文档
                top_item['children'] = []
                for doc in sec_docs:
                    sec_item = {
                        'id': doc.id,
                        'field': doc.name,
                        'title': doc.name,
                        'level':2
                    }
                    # 获取三级文档
                    thr_docs = Doc.objects.filter(top_doc=pro_id,parent_doc=doc.id,status=1).order_by('sort')
                    if thr_docs.exists():
                        sec_item['children'] = []
                        for doc in thr_docs:
                            item = {
                                'id': doc.id,
                                'field': doc.name,
                                'title': doc.name,
                                'level': 3
                            }
                            sec_item['children'].append(item)
                        top_item['children'].append(sec_item)
                    else:
                        top_item['children'].append(sec_item)
                doc_list.append(top_item)
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
def report_md(request):
    if request.method == 'POST':
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
            if settings.DEBUG:
                print(traceback.print_exc())
            return JsonResponse({'status':False,'data':'文集不存在'})

    else:
        return Http404

# 导出文集文件
@allow_report_file
def report_file(request):
    if request.method == 'POST':
        report_type = request.POST.get('types',None)
        if report_type in ['epub']:
            pro_id = request.POST.get('pro_id')
            try:
                project = Project.objects.get(id=int(pro_id))
                # 公开的文集 - 可以直接导出
                if project.role == 0:
                    report_project = ReportEPUB(
                        project_id=project.id
                    ).work()
                    # print(report_project)
                    report_file_path = report_project.split('media',maxsplit=1)[-1]
                    epub_file = '/media' + report_file_path + '.epub'
                    return JsonResponse({'status':True,'data':epub_file})
                # 私密文集 - 拥有者可导出
                elif project.role == 1:
                    pass
                # 指定用户可见文集 - 指定用户可导出
                elif project.role == 2:
                    pass
                # 访问码可见文集 - 通过验证即可导出
                elif project.role == 3:
                    pass
                else:
                    return JsonResponse({'status':False,'data':'不存在的文集权限'})
            except ObjectDoesNotExist:
                return JsonResponse({'status':False,'data':'文集不存在'})
            except Exception as e:
                if settings.DEBUG:
                    print(traceback.print_exc())
                return JsonResponse({'status':False,'data':'系统异常'})
        else:
            return JsonResponse({'status':False,'data':'不支持的类型'})
    else:
        return Http404


# 图片素材管理
@login_required()
def manage_image(request):
    # 获取图片
    if request.method == 'GET':
        try:
            groups = ImageGroup.objects.filter(user=request.user) # 获取所有分组
            all_img_cnt = Image.objects.filter(user=request.user).count()
            no_group_cnt = Image.objects.filter(user=request.user,group_id=None).count() # 获取所有未分组的图片数量
            g_id = int(request.GET.get('group', 0))  # 图片分组id
            if int(g_id) == 0:
                image_list = Image.objects.filter(user=request.user)  # 查询所有图片
            elif int(g_id) == -1:
                image_list = Image.objects.filter(user=request.user,group_id=None)  # 查询指定分组的图片
            else:
                image_list = Image.objects.filter(user=request.user,group_id=g_id)  # 查询指定分组的图片
            paginator = Paginator(image_list, 20)
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
            if settings.DEBUG:
                print(traceback.print_exc())
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
                    Image.objects.filter(id=img_id).update(group_id=None)
                else:
                    group = ImageGroup.objects.get(id=group_id,user=request.user)
                    Image.objects.filter(id=img_id).update(group_id=group)
                return JsonResponse({'status':True,'data':'移动完成'})
            # 获取图片
            elif int(types) == 2:
                group_id = request.POST.get('group_id', None) # 接受分组ID参数
                if group_id is None: #
                    return JsonResponse({'status':False,'data':'参数错误'})
                elif int(group_id) == 0:
                    imgs = Image.objects.filter(user=request.user)
                elif int(group_id) == -1:
                    imgs = Image.objects.filter(user=request.user,group_id=None)
                else:
                    imgs = Image.objects.filter(user=request.user,group_id=group_id)
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
            if settings.DEBUG:
                print(traceback.print_exc())
            return JsonResponse({'status':False,'data':'程序异常'})

# 图片分组管理
@login_required()
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
                ImageGroup.objects.create(
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
                ImageGroup.objects.filter(id=group_id).update(group_name=group_name)
                return JsonResponse({'status':True,'data':'修改成功'})
            else:
                return JsonResponse({'status':False,'data':'名称无效'})

        # 删除分组
        elif int(types) == 2:
            try:
                group_id = request.POST.get('group_id','')
                group = ImageGroup.objects.get(id=group_id,user=request.user) # 查询分组
                images = Image.objects.filter(group_id=group_id).update(group_id=None) # 移动图片到未分组
                group.delete() # 删除分组
                return JsonResponse({'status':True,'data':'删除完成'})
            except:
                if settings.DEBUG:
                    print(traceback.print_exc())
                return JsonResponse({'status':False,'data':'删除错误'})
        # 获取分组
        elif int(types) == 3:
            try:
                group_list = []
                all_cnt = Image.objects.all().count()
                non_group_cnt = Image.objects.filter(group_id=None).count()
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
                if settings.DEBUG:
                    print(traceback.print_exc())
                return JsonResponse({'status':False,'data':'出现错误'})


# 附件管理
@login_required()
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
            if search_kw:
                attachment_list = Attachment.objects.filter(user=request.user,file_name__icontains=search_kw)
                paginator = Paginator(attachment_list, 15)
                page = request.GET.get('page', 1)
                try:
                    attachments = paginator.page(page)
                except PageNotAnInteger:
                    attachments = paginator.page(1)
                except EmptyPage:
                    attachments = paginator.page(paginator.num_pages)
                attachments.kw = search_kw
            else:
                attachment_list = Attachment.objects.filter(user=request.user)
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
            if settings.DEBUG:
                print(traceback.print_exc())
            return render(request,'404.html')
    elif request.method == 'POST':
        # types参数，0表示上传、1表示删除、2表示获取附件列表
        types = request.POST.get('types','')
        if types in ['0',0]:
            attachment = request.FILES.get('attachment_upload',None)
            if attachment:
                attachment_name = attachment.name
                attachment_size = sizeFormat(attachment.size)
                # 限制附件大小在50mb以内
                if attachment.size > 52428800:
                    return JsonResponse({'status':False,'data':'文件大小超出限制'})
                # 限制附件为ZIP格式文件
                if attachment_name.endswith('.zip'):
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