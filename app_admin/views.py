from django.shortcuts import render,redirect
from django.http.response import JsonResponse,HttpResponse
from django.contrib.auth import authenticate,login,logout # 认证相关方法
from django.contrib.auth.models import User # Django默认用户模型
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage,InvalidPage # 后端分页
from app_admin.decorators import superuser_only
import json
import datetime
from app_doc.models import *

# 返回验证码图片
def check_code(request):
    import io
    from . import check_code as CheckCode
    stream = io.BytesIO()
    # img图片对象,code在图像中写的内容
    img, code = CheckCode.create_validate_code()
    img.save(stream, "png")
    # 图片页面中显示,立即把session中的CheckCode更改为目前的随机字符串值
    request.session["CheckCode"] = code
    return HttpResponse(stream.getvalue())


# 登录视图
def log_in(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return redirect('/')
        else:
            return render(request,'login.html',locals())
    elif request.method == 'POST':
        try:
            username = request.POST.get('username','')
            pwd = request.POST.get('password','')
            if username != '' and pwd != '':
                user = authenticate(username=username,password=pwd)
                if user is not None:
                    if user.is_active:
                        login(request,user)
                        return redirect('/')
                    else:
                        errormsg = '用户被禁用！'
                        return render(request, 'login.html', locals())
                else:
                    errormsg = '用户名或密码错误！'
                    return render(request, 'login.html', locals())
            else:
                errormsg = '用户名或密码错误！'
                return render(request, 'login.html', locals())
        except Exception as e:
            return HttpResponse('请求出错')


# 注册视图
def register(request):
    if request.user.is_authenticated:
        return redirect('/')
    else:
        if request.method == 'GET':
            return render(request,'register.html',locals())
        elif request.method == 'POST':
            username = request.POST.get('username',None)
            email = request.POST.get('email',None)
            password = request.POST.get('password',None)
            checkcode = request.POST.get("check_code",None)
            if username and email and password:
                if '@'in email:
                    email_exit = User.objects.filter(email=email)
                    username_exit = User.objects.filter(username=username)
                    if email_exit.count() > 0:
                        errormsg = '电子邮箱已经被注册使用，请更换电子邮箱地址！'
                        return render(request, 'register.html', locals())
                    elif username_exit.count() > 0:
                        errormsg = '用户名已存在，请换一个用户名！'
                        return render(request, 'register.html', locals())
                    elif len(password) < 6:
                        errormsg = '密码必须大于等于6位！'
                        return render(request, 'register.html', locals())
                    elif checkcode != request.session['CheckCode'].lower():
                        errormsg = "验证码错误"
                        return render(request, 'register.html', locals())
                    else:
                        # 创建用户
                        user = User.objects.create_user(username=username, email=email, password=password)
                        user.save()
                        # 登录用户
                        user = authenticate(username=username, password=password)
                        if user.is_active:
                            login(request, user)
                            return redirect('/')
                        else:
                            errormsg = '用户被禁用！'
                            return render(request, 'register.html', locals())
                else:
                    errormsg = '请输入正确的电子邮箱格式！'
                    return render(request, 'register.html', locals())
            else:
                errormsg = "请检查输入值"
                return render(request, 'register.html', locals())


# 注销
def log_out(request):
    try:
        logout(request)
    except Exception as e:
        print(e)
        # logger.error(e)
    return redirect(request.META['HTTP_REFERER'])


# 管理员后台首页 - 用户管理
@superuser_only
def admin_user(request):
    if request.method == 'GET':
        # user_list = User.objects.all()
        return render(request, 'app_admin/admin_user.html', locals())
    elif request.method == 'POST':
        username = request.POST.get('username','')
        if username == '':
            user_data = User.objects.all().values_list(
                'id','last_login','is_superuser','username','email','date_joined','is_active'
            )
        else:
            user_data = User.objects.filter(username__icontains=username).values_list(
                'id','last_login','is_superuser','username','email','date_joined','is_active'
            )
        table_data = []
        for i in list(user_data):
            item = {
                'id':i[0],
                'last_login':i[1],
                'is_superuser':i[2],
                'username':i[3],
                'email':i[4],
                'date_joined':i[5],
                'is_active':i[6]
            }
            table_data.append(item)
        return JsonResponse({'status':True,'data':table_data})


# 管理员后台首页 - 创建用户
@superuser_only
def admin_create_user(request):
    if request.method == 'POST':
        username = request.POST.get('username','') # 接收用户名参数
        email = request.POST.get('email','') # 接收email参数
        password = request.POST.get('password','') # 接收密码参数
        if username != '' and password != '' and email != '' and '@' in email:
            try:
                user = User.objects.create_user(
                    username=username,
                    password=password,
                    email=email
                )
                user.save()
                return JsonResponse({'status':True})
            except Exception as e:
                return JsonResponse({'status':False})
        else:
            return JsonResponse({'status':False})
    else:
        return HttpResponse('方法不允许')


# 管理员后台 - 修改密码
@superuser_only
def admin_change_pwd(request):
    if request.method == 'POST':
        try:
            user_id = request.POST.get('user_id',None)
            password = request.POST.get('password',None)
            password2 = request.POST.get('password2',None)
            if user_id and password:
                if password == password2:
                    user = User.objects.get(id=int(user_id))
                    user.set_password(password)
                    user.save()
                    return JsonResponse({'status':True,'data':'修改成功'})
                else:
                    return JsonResponse({'status':False,'data':'两个密码不一致'})
            else:
                return JsonResponse({'status':False,'data':'参数错误'})
        except Exception as e:
            print(repr(e))
            return JsonResponse({'status':False,'data':'请求错误'})
    else:
        return JsonResponse({'status':False,'data':'方法错误'})


# 管理员后台 - 删除用户
@superuser_only
def admin_del_user(request):
    if request.method == 'POST':
        try:
            user_id = request.POST.get('user_id',None)
            user = User.objects.get(id=int(user_id))
            user.delete()
            return JsonResponse({'status':True,'data':'删除成功'})
        except Exception as e:
            return JsonResponse({'status':False,'data':'删除出错'})
    else:
        return JsonResponse({'status':False,'data':'方法错误'})


# 管理员后台 - 文集管理
@superuser_only
def admin_project(request):
    if request.method == 'GET':
        search_kw = request.GET.get('kw','')
        if search_kw == '':
            project_list = Project.objects.all()
            paginator = Paginator(project_list,20)
            page = request.GET.get('page',1)
            try:
                projects = paginator.page(page)
            except PageNotAnInteger:
                projects = paginator.page(1)
            except EmptyPage:
                projects = paginator.page(paginator.num_pages)
        else:
            project_list = Project.objects.filter(intro__icontains=search_kw)
            paginator = Paginator(project_list, 20)
            page = request.GET.get('page', 1)

            try:
                projects = paginator.page(page)
            except PageNotAnInteger:
                projects = paginator.page(1)
            except EmptyPage:
                projects = paginator.page(paginator.num_pages)
            projects.kw = search_kw
        return render(request,'app_admin/admin_project.html',locals())
    else:
        return HttpResponse('方法错误')


# 管理员后台 - 文档管理
@superuser_only
def admin_doc(request):
    if request.method == 'GET':
        kw = request.GET.get('kw','')
        if kw == '':
            doc_list = Doc.objects.all()
            paginator = Paginator(doc_list, 10)
            page = request.GET.get('page', 1)
            try:
                docs = paginator.page(page)
            except PageNotAnInteger:
                docs = paginator.page(1)
            except EmptyPage:
                docs = paginator.page(paginator.num_pages)
        else:
            doc_list = Doc.objects.filter(pre_content__icontains=kw)
            paginator = Paginator(doc_list, 10)
            page = request.GET.get('page', 1)
            try:
                docs = paginator.page(page)
            except PageNotAnInteger:
                docs = paginator.page(1)
            except EmptyPage:
                docs = paginator.page(paginator.num_pages)
            docs.kw = kw
        return render(request,'app_admin/admin_doc.html',locals())


# 管理员后台 - 文档模板管理
@superuser_only
def admin_doctemp(request):
    if request.method == 'GET':
        kw = request.GET.get('kw','')
        if kw == '':
            doctemp_list = DocTemp.objects.all()
            paginator = Paginator(doctemp_list, 10)
            page = request.GET.get('page', 1)
            try:
                doctemps = paginator.page(page)
            except PageNotAnInteger:
                doctemps = paginator.page(1)
            except EmptyPage:
                doctemps = paginator.page(paginator.num_pages)
        else:
            doctemp_list = DocTemp.objects.filter(content__icontains=kw)
            paginator = Paginator(doctemp_list, 10)
            page = request.GET.get('page', 1)
            try:
                doctemps = paginator.page(page)
            except PageNotAnInteger:
                doctemps = paginator.page(1)
            except EmptyPage:
                doctemps = paginator.page(paginator.num_pages)
            doctemps.kw = kw
        return render(request,'app_admin/admin_doctemp.html',locals())


# 普通用户修改密码
@login_required()
def change_pwd(request):
    if request.method == 'POST':
        try:
            password = request.POST.get('password',None)
            password2 = request.POST.get('password2',None)
            print(password, password2)
            if password and password== password2:
                if len(password) >= 6:
                    user = User.objects.get(id=request.user.id)
                    user.set_password(password)
                    user.save()
                    return JsonResponse({'status':True,'data':'修改成功'})
                else:
                    return JsonResponse({'status':False,'data':'密码不得少于6位数'})
            else:
                return JsonResponse({'status':False,'data':'两个密码不一致'})
        except Exception as e:
            return JsonResponse({'status':False,'data':'修改出错'})
    else:
        return HttpResponse('方法错误')
