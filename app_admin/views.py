from django.shortcuts import render,redirect
from django.http.response import JsonResponse
from django.contrib.auth import authenticate,login,logout # 认证相关方法
from django.contrib.auth.models import User # Django默认用户模型
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from app_admin.decorators import superuser_only
import json
import datetime

class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, datetime.date):
            return obj.strftime("%Y-%m-%d")
        else:
            return json.JSONEncoder.default(self, obj)

# 登录视图
def log_in(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return redirect('/user/user_manage')
        else:
            return render(request,'login.html',locals())
    elif request.method == 'POST':
        username = request.POST.get('username','')
        pwd = request.POST.get('password','')
        if username != '' and pwd != '':
            user = authenticate(username=username,password=pwd)
            if user is not None:
                if user.is_active:
                    login(request,user)
                    return redirect('/user/user_manage')
                else:
                    errormsg = '用户被禁用！'
                    return render(request, 'login.html', locals())
            else:
                errormsg = '用户名或密码错误！'
                return render(request, 'login.html', locals())
        else:
            errormsg = '用户名或密码错误！'
            return render(request, 'login.html', locals())


# 注册视图
def register(request):
    pass

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


# 管理员后台 - 修改密码
@superuser_only
def admin_change_pwd(request):
    pass

# 管理员后台 - 删除用户
@superuser_only
def admin_del_user(request):
    pass

# 普通用户修改密码
def change_pwd(request):
    pass