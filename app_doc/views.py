from django.shortcuts import render
from django.http.response import JsonResponse,Http404,HttpResponseNotAllowed,HttpResponse
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from app_doc.models import Project,Doc,DocTemp
from django.contrib.auth.models import User
from django.db.models import Q


# 文集列表
def project_list(request):
    project_list = Project.objects.all()
    return render(request, 'app_doc/pro_list.html', locals())


# 创建文集
@login_required()
def create_project(request):
    if request.method == 'POST':
        try:
            name = request.POST.get('pname','')
            desc = request.POST.get('desc','')
            if name != '':
                project = Project.objects.create(
                    name=name,
                    intro=desc,
                    create_user=request.user
                )
                project.save()
                return JsonResponse({'status':True,'data':{'id':project.id,'name':project.name}})
            else:
                return JsonResponse({'status':False})
        except Exception as e:
            return JsonResponse({'status':False})
    else:
        return JsonResponse({'status':False})


# 文集浏览页
def project_index(request,pro_id):
    # 获取文集
    if request.method == 'GET':
        try:
            # 获取文集信息
            project = Project.objects.get(id=int(pro_id))
            # 获取搜索词
            kw = request.GET.get('kw','')
            if kw == '':
                doc = Doc.objects.filter(top_doc=int(pro_id)).order_by('sort')
                # 获取文集第一篇文档作为默认内容
                if doc.count() > 0:
                    doc = doc[0]
                else:
                    doc = None
            else: # 搜索结果
                search_result = Doc.objects.filter(top_doc=int(pro_id),pre_content__icontains=kw)
            # 获取文集下所有一级文档
            project_docs = Doc.objects.filter(top_doc=int(pro_id), parent_doc=0).order_by('sort')
            return render(request,'app_doc/project.html',locals())
        except Exception as e:
            return HttpResponse('请求出错')
    else:
        return HttpResponse('方法不允许')


# 修改文集
@login_required()
def modify_project(request):
    if request.method == 'POST':
        try:
            pro_id = request.POST.get('pro_id',None)
            project = Project.objects.get(id=pro_id)
            if request.user == project.create_user:
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


# 删除文集
@login_required()
def del_project(request):
    try:
        pro_id = request.POST.get('pro_id','')
        if pro_id != '':
            pro = Project.objects.get(id=pro_id)
            if request.user == pro.create_user:
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
            else:
                pro_list = Project.objects.filter(create_user=request.user)
            return render(request,'app_doc/manage_project.html',locals())
        except Exception as e:
            return HttpResponse('请求出错')
    else:
        return HttpResponse('方法不允许')


# 文档浏览页页
def doc(request,pro_id,doc_id):
    if request.method == 'GET':
        try:
            if pro_id != '' and doc_id != '':
                # 获取文集信息
                project = Project.objects.get(id=int(pro_id))
                # 获取文档内容
                doc = Doc.objects.get(id=int(doc_id))
                # 获取文集下一级文档
                project_docs = Doc.objects.filter(top_doc=doc.top_doc, parent_doc=0).order_by('sort')
                return render(request,'app_doc/project.html',locals())
            else:
                return HttpResponse('参数错误')
        except Exception as e:
            return HttpResponse('请求出错')
    else:
        return HttpResponse('方法不允许')


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
            if project != '' and doc_name != '' and project != '-1':
                doc = Doc.objects.create(
                    name=doc_name,
                    content = doc_content,
                    pre_content= pre_content,
                    parent_doc= int(parent_doc) if parent_doc != '' else 0,
                    top_doc= int(project),
                    sort = sort if sort != '' else 99,
                    create_user=request.user
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
            if doc_id != '' and project != '' and doc_name != '' and project != '-1':
                # 更新文档内容
                Doc.objects.filter(id=int(doc_id)).update(
                    name=doc_name,
                    content=doc_content,
                    pre_content=pre_content,
                    parent_doc=int(parent_doc) if parent_doc != '' else 0,
                    sort=sort if sort != '' else 99,
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
            doc_list = Doc.objects.filter(create_user=request.user,content__icontains=search_kw)
        else:
            doc_list = Doc.objects.filter(create_user=request.user)
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
            else:
                doctemp_list = DocTemp.objects.filter(create_user=request.user)
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

