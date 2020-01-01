from django.shortcuts import render,redirect
from django.http.response import JsonResponse,Http404,HttpResponseNotAllowed,HttpResponse
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from django.views.decorators.http import require_http_methods,require_GET,require_POST # 视图请求方法装饰器
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage,InvalidPage # 后端分页
from django.core.exceptions import PermissionDenied
from app_doc.models import Project,Doc,DocTemp
from django.contrib.auth.models import User
from django.db.models import Q
import datetime
import traceback
from app_doc.report_utils import *


# 文集列表
def project_list(request):
    # 登录用户
    if request.user.is_authenticated:
        project_list = Project.objects.filter(
            Q(role=0) | Q(role=2,role_value__contains=str(request.user.username)) | Q(create_user=request.user)
        )
    else:
        # 非登录用户只显示公开文集
        project_list = Project.objects.filter(role=0)
    return render(request, 'app_doc/pro_list.html', locals())


# 创建文集
@login_required()
def create_project(request):
    if request.method == 'POST':
        try:
            name = request.POST.get('pname','')
            desc = request.POST.get('desc','')
            role = request.POST.get('role','')
            if name != '':
                project = Project.objects.create(
                    name=name,
                    intro=desc[:100],
                    create_user=request.user,
                    role = int(role)
                )
                project.save()
                return JsonResponse({'status':True,'data':{'id':project.id,'name':project.name}})
            else:
                return JsonResponse({'status':False})
        except Exception as e:
            return JsonResponse({'status':False})
    else:
        return JsonResponse({'status':False})


# 文集页
@require_http_methods(['GET'])
def project_index(request,pro_id):
    # 获取文集
    try:
        # 获取文集信息
        project = Project.objects.get(id=int(pro_id))

        # 私密文集并且访问者非创建者
        if project.role == 1 and request.user != project.create_user:
            return render(request,'404.html')
        # 指定用户可见文集
        elif project.role == 2:
            user_list = project.role_value
            if request.user.is_authenticated: # 认证用户判断是否在许可用户列表中
                if request.user.username not in user_list and request.user != project.create_user: # 访问者不在指定用户之中
                    return render(request, '404.html')
            else:# 游客直接返回404
                return render(request, '404.html')
        # 访问码可见
        elif project.role == 3:
            # 浏览用户不为创建者
            if request.user != project.create_user:
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
        print(traceback.print_exc())
        print(repr(e))
        return HttpResponse('请求出错')


# 修改文集
@login_required()
def modify_project(request):
    if request.method == 'POST':
        try:
            pro_id = request.POST.get('pro_id',None)
            project = Project.objects.get(id=pro_id)
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
            return JsonResponse({'status':False,'data':'请求出错'})
    else:
        return JsonResponse({'status':False,'data':'方法不允许'})


# 修改文集权限
@login_required()
def modify_project_role(request,pro_id):
    pro = Project.objects.get(id=pro_id)
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
            project_id = request.GET.get('to','').split("/")[2]
            project = Project.objects.get(id=int(project_id))
            return render(request,'app_doc/check_viewcode.html',locals())
        else:
            viewcode = request.POST.get('viewcode','')
            project_id = request.POST.get('project_id','')
            project = Project.objects.get(id=int(project_id))
            if project.role == 3 and project.role_value == viewcode:
                obj = redirect("/project/{}/".format(project_id))
                obj.set_cookie('viewcode-{}'.format(project_id),viewcode)
                return obj
            else:
                errormsg = "访问码错误"
                return render(request, 'app_doc/check_viewcode.html', locals())

    except Exception as e:
        print(repr(e))
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
        return JsonResponse({'status':False,'data':'请求出错'})


# 管理文集
@login_required()
def manage_project(request):
    if request.method == 'GET':
        try:
            search_kw = request.GET.get('kw', None)
            if search_kw:
                pro_list = Project.objects.filter(create_user=request.user,intro__icontains=search_kw)
                paginator = Paginator(pro_list, 10)
                page = request.GET.get('page', 1)
                try:
                    pros = paginator.page(page)
                except PageNotAnInteger:
                    pros = paginator.page(1)
                except EmptyPage:
                    pros = paginator.page(paginator.num_pages)
                pros.kw = search_kw
            else:
                pro_list = Project.objects.filter(create_user=request.user)
                paginator = Paginator(pro_list, 10)
                page = request.GET.get('page', 1)
                try:
                    pros = paginator.page(page)
                except PageNotAnInteger:
                    pros = paginator.page(1)
                except EmptyPage:
                    pros = paginator.page(paginator.num_pages)
            return render(request,'app_doc/manage_project.html',locals())
        except Exception as e:
            return HttpResponse('请求出错')
    else:
        return HttpResponse('方法不允许')


# 文档浏览页页
@require_http_methods(['GET'])
def doc(request,pro_id,doc_id):
    try:
        if pro_id != '' and doc_id != '':
            # 获取文集信息
            project = Project.objects.get(id=int(pro_id))

            # 私密文集并且访问者非创建者
            if project.role == 1 and request.user != project.create_user:
                return render(request, '404.html')
            # 指定用户可见文集
            elif project.role == 2:
                user_list = project.role_value
                if request.user.is_authenticated:  # 认证用户判断是否在许可用户列表中
                    if request.user.username not in user_list and request.user != project.create_user:  # 访问者不在指定用户之中
                        return render(request, '404.html')
                else:  # 游客直接返回404
                    return render(request, '404.html')
            # 访问码可见
            elif project.role == 3:
                # 浏览用户不为创建者
                if request.user != project.create_user:
                    viewcode = project.role_value
                    viewcode_name = 'viewcode-{}'.format(project.id)
                    r_viewcode = request.COOKIES[
                        viewcode_name] if viewcode_name in request.COOKIES.keys() else 0  # 从cookie中获取访问码
                    if viewcode != r_viewcode:  # cookie中的访问码不等于文集访问码，跳转到访问码认证界面
                        return redirect('/check_viewcode/?to={}'.format(request.path))

            # 获取文档内容
            doc = Doc.objects.get(id=int(doc_id),status=1)
            # 获取文集下一级文档
            project_docs = Doc.objects.filter(top_doc=doc.top_doc, parent_doc=0, status=1).order_by('sort')
            return render(request,'app_doc/doc.html',locals())
        else:
            return HttpResponse('参数错误')
    except Exception as e:
        return HttpResponse('请求出错')


# 创建文档
@login_required()
def create_doc(request):
    if request.method == 'GET':
        try:
            # doc_list = Doc.objects.filter(create_user=request.user)
            project_list = Project.objects.filter(create_user=request.user)
            doctemp_list = DocTemp.objects.filter(create_user=request.user).values('id','name','create_time')
            return render(request,'app_doc/create_doc.html',locals())
        except Exception as e:
            print(repr(e))
            return HttpResponse('请求出错')
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
                return JsonResponse({'status':True,'data':doc.id})
            else:
                return JsonResponse({'status':False,'data':'参数错误'})
        except Exception as e:
            print(repr(e))
            return JsonResponse({'status':False,'data':'请求出错'})
    else:
        return JsonResponse({'status':False,'data':'方法不允许'})


# 修改文档
@login_required()
def modify_doc(request,doc_id):
    if request.method == 'GET':
        try:
            doc = Doc.objects.get(id=doc_id)
            if request.user == doc.create_user:
                project = Project.objects.get(id=doc.top_doc)
                doc_list = Doc.objects.filter(top_doc=project.id)
                doctemp_list = DocTemp.objects.filter(create_user=request.user)
                return render(request,'app_doc/modify_doc.html',locals())
            else:
                return HttpResponse("非法请求")
        except Exception as e:
            return HttpResponse('请求出错')
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
                return JsonResponse({'status': False,'data':'参数错误'})
        except Exception as e:
            return JsonResponse({'status':False,'data':'请求出错'})


# 删除文档
@login_required()
def del_doc(request):
    try:
        doc_id = request.POST.get('doc_id',None)
        if doc_id:
            doc = Doc.objects.get(id=doc_id)
            if request.user == doc.create_user:
                doc.delete()
                return JsonResponse({'status': True, 'data': '删除完成'})
            else:
                return JsonResponse({'status': False, 'data': '非法请求'})
        else:
            return JsonResponse({'status':False,'data':'参数错误'})
    except Exception as e:
        return JsonResponse({'status':False,'data':'请求出错'})


# 管理文档
@login_required()
def manage_doc(request):
    if request.method == 'GET':
        search_kw = request.GET.get('kw',None)
        if search_kw:
            doc_list = Doc.objects.filter(create_user=request.user,content__icontains=search_kw).order_by('-modify_time')
            paginator = Paginator(doc_list, 10)
            page = request.GET.get('page', 1)
            try:
                docs = paginator.page(page)
            except PageNotAnInteger:
                docs = paginator.page(1)
            except EmptyPage:
                docs = paginator.page(paginator.num_pages)
            docs.kw = search_kw
        else:
            doc_list = Doc.objects.filter(create_user=request.user).order_by('-modify_time')
            paginator = Paginator(doc_list, 10)
            page = request.GET.get('page', 1)
            try:
                docs = paginator.page(page)
            except PageNotAnInteger:
                docs = paginator.page(1)
            except EmptyPage:
                docs = paginator.page(paginator.num_pages)
        return render(request,'app_doc/manage_doc.html',locals())
    else:
        return HttpResponse('方法不允许')


# 创建文档模板
@login_required()
def create_doctemp(request):
    if request.method == 'GET':
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
                return render(request,'app_doc/modify_doctemp.html',locals())
            else:
                return HttpResponse('非法请求')
        except Exception as e:
            return HttpResponse('请求出错')
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
            return HttpResponse('请求出错')
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
            return JsonResponse({'status':False,'data':'请求出错'})
    else:
        return JsonResponse({'status':False,'data':'方法错误'})


# 获取指定文集的所有文档
def get_pro_doc(request):
    if request.method == 'POST':
        pro_id = request.POST.get('pro_id','')
        if pro_id != '':
            doc_list = Doc.objects.filter(top_doc=int(pro_id)).values_list('id','name','parent_doc').order_by('parent_doc')
            item_list = []
            for doc in doc_list:
                if doc[2] == 0:
                    item = [
                        doc[0],doc[1],doc[2],''
                    ]
                    item_list.append(item)
                else:
                    parent = Doc.objects.get(id=doc[2])
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
        except:
            return JsonResponse({'status':False,'data':'文集不存在'})

    else:
        return Http404