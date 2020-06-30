# coding:utf-8
from django.shortcuts import render,redirect
from django.http.response import JsonResponse,HttpResponse,Http404
from django.contrib.auth import authenticate,login,logout # 认证相关方法
from django.contrib.auth.models import User # Django默认用户模型
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage,InvalidPage # 后端分页
from app_admin.decorators import superuser_only,open_register
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
import json,datetime,hashlib,random
from app_doc.models import *
from app_admin.models import *
from app_admin.utils import *
import traceback
from loguru import logger


# 返回验证码图片
def check_code(request):
    try:
        import io
        from . import check_code as CheckCode
        stream = io.BytesIO()
        # img图片对象,code在图像中写的内容
        img, code = CheckCode.create_validate_code()
        img.save(stream, "png")
        # 图片页面中显示,立即把session中的CheckCode更改为目前的随机字符串值
        request.session["CheckCode"] = code
        return HttpResponse(stream.getvalue())
    except Exception as e:
        logger.exception("生成验证码图片异常")
        return HttpResponse("请求异常：{}".format(repr(e)))


# 登录视图
def log_in(request):
    if request.method == 'GET':
        # 登录用户访问登录页面自动跳转到首页
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
            logger.exception("登录异常")
            return HttpResponse('请求出错')


# 注册视图
@open_register
@logger.catch()
def register(request):
    # 如果登录用户访问注册页面，跳转到首页
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
            register_code = request.POST.get("register_code",None)
            is_register_code = SysSetting.objects.filter(types='basic', name='enable_register_code', value='on')
            if is_register_code.count() > 0: # 开启了注册码设置
                try:
                    register_code_value = RegisterCode.objects.get(code=register_code,status=1)
                except ObjectDoesNotExist:
                    errormsg = '注册码无效!'
                    return render(request, 'register.html', locals())
            # 判断是否输入了用户名、邮箱和密码
            if username and email and password:
                if '@'in email:
                    email_exit = User.objects.filter(email=email)
                    username_exit = User.objects.filter(username=username)
                    if email_exit.count() > 0: # 验证电子邮箱
                        errormsg = '此电子邮箱已被注册！'
                        return render(request, 'register.html', locals())
                    elif username_exit.count() > 0: # 验证用户名
                        errormsg = '用户名已被使用！'
                        return render(request, 'register.html', locals())
                    elif len(password) < 6: # 验证密码长度
                        errormsg = '密码必须大于等于6位！'
                        return render(request, 'register.html', locals())
                    elif checkcode != request.session['CheckCode'].lower(): # 验证验证码
                        errormsg = "验证码错误"
                        return render(request, 'register.html', locals())
                    else:
                        # 创建用户
                        user = User.objects.create_user(username=username, email=email, password=password)
                        user.save()
                        # 登录用户
                        user = authenticate(username=username, password=password)
                        # 注册码数据更新
                        if is_register_code.count() > 0:
                            r_all_cnt = register_code_value.all_cnt # 注册码的最大使用次数
                            r_used_cnt = register_code_value.used_cnt + 1 # 更新注册码的已使用次数
                            r_use_user = register_code_value.user_list # 注册码的使用用户
                            if r_used_cnt >= r_all_cnt: # 如果注册码已使用次数大于等于注册码的最大使用次数，则注册码失效
                                RegisterCode.objects.filter(code=register_code).update(
                                    status=0,# 注册码状态设为失效
                                    used_cnt = r_used_cnt, # 更新注册码的已使用次数
                                    user_list = r_use_user + email + ',',
                                )
                            else:
                                RegisterCode.objects.filter(code=register_code).update(
                                    used_cnt=r_used_cnt, # 更新注册码的已使用次数
                                    user_list = r_use_user + email + ',',
                                )
                        if user.is_active:
                            login(request, user)
                            return redirect('/')
                        else:
                            errormsg = '用户被禁用，请联系管理员！'
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
        logger.exception("注销异常")
    return redirect(request.META['HTTP_REFERER'])


# 忘记密码
def forget_pwd(request):
    if request.method == 'GET':
        return render(request,'forget_pwd.html',locals())
    elif request.method == 'POST':
        email = request.POST.get("email",None) # 邮箱
        vcode = request.POST.get("vcode",None) # 验证码
        new_pwd= request.POST.get('password',None) # 密码
        new_pwd_confirm = request.POST.get('confirm_password')
        # 查询验证码和邮箱是否匹配
        try:
            data = EmaiVerificationCode.objects.get(email_name=email,verification_code=vcode,verification_type='忘记密码')
            expire_time = data.expire_time
            print(expire_time)
            if expire_time > datetime.datetime.now():
                user = User.objects.get(email=email)
                user.set_password(new_pwd)
                user.save()
                errormsg = "修改密码成功，请返回登录！"
                return render(request, 'forget_pwd.html', locals())
            else:
                errormsg = "验证码已过期"
                return render(request, 'forget_pwd.html', locals())
        except Exception as e:
            logger.exception("修改密码异常")
            errormsg = "验证码错误"
            return render(request,'forget_pwd.html',locals())


# 发送电子邮箱验证码
@logger.catch()
def send_email_vcode(request):
    if request.method == 'POST':
        email = request.POST.get('email',None)
        is_email = User.objects.filter(email=email)
        if is_email.count() != 0:
            vcode_str = generate_vcode()
            # 发送邮件
            send_status = send_email(to_email=email, vcode_str=vcode_str)
            if send_status:
                # 生成过期时间
                now_time = datetime.datetime.now()
                expire_time = now_time + datetime.timedelta(minutes=30)
                # 创建数据库记录
                EmaiVerificationCode.objects.create(
                    email_name = email,
                    verification_type = '忘记密码',
                    verification_code = vcode_str,
                    expire_time = expire_time
                )
                return JsonResponse({'status':True,'data':'发送成功'})
            else:
                return JsonResponse({'status':False,'data':'发送验证码出错，请重试！'})

        else:
            return JsonResponse({'status':False,'data':'电子邮箱不存在！'})
    else:
        return JsonResponse({'status':False,'data':'方法错误'})

# 管理员后台首页 - 用户管理
@superuser_only
@logger.catch()
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
    else:
        return JsonResponse({'status':False,'data':'方法错误'})


# 管理员后台首页 - 创建用户
@superuser_only
@logger.catch()
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
@logger.catch()
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
@logger.catch()
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
@logger.catch()
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

# 管理员后台 - 修改文集权限
@superuser_only
@logger.catch()
def admin_project_role(request,pro_id):
    pro = Project.objects.get(id=pro_id)
    if request.method == 'GET':
        return render(request,'app_admin/admin_project_role.html',locals())
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
            return render(request, 'app_admin/admin_project_role.html', locals())
        else:
            return Http404


# 管理员后台 - 文档管理
@superuser_only
@logger.catch()
def admin_doc(request):
    if request.method == 'GET':
        kw = request.GET.get('kw','')
        if kw == '':
            doc_list = Doc.objects.all().order_by('-modify_time')
            paginator = Paginator(doc_list, 10)
            page = request.GET.get('page', 1)
            try:
                docs = paginator.page(page)
            except PageNotAnInteger:
                docs = paginator.page(1)
            except EmptyPage:
                docs = paginator.page(paginator.num_pages)
        else:
            doc_list = Doc.objects.filter(Q(content__icontains=kw) | Q(name__icontains=kw)).order_by('-modify_time')
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
@logger.catch()
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


# 管理员后台 - 注册邀请码管理
@superuser_only
@logger.catch()
def admin_register_code(request):
    # 返回注册邀请码管理页面
    if request.method == 'GET':
        register_codes = RegisterCode.objects.all()
        paginator = Paginator(register_codes, 10)
        page = request.GET.get('page', 1)
        try:
            codes = paginator.page(page)
        except PageNotAnInteger:
            codes = paginator.page(1)
        except EmptyPage:
            codes = paginator.page(paginator.num_pages)
        return render(request,'app_admin/admin_register_code.html',locals())
    elif request.method == 'POST':
        types = request.POST.get('types',None)
        if types is None:
            return JsonResponse({'status':False,'data':'参数错误'})
        # types表示注册码操作的类型，1表示新增、2表示删除
        if int(types) == 1:
            try:
                all_cnt = int(request.POST.get('all_cnt',1)) # 注册码的最大使用次数
                if all_cnt <= 0:
                    return JsonResponse({'status': False, 'data': '最大使用次数不可为负数'})
                is_code = False
                while is_code is False:
                    code_str = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
                    random_code = ''.join(random.sample(code_str, k=10))
                    random_code_used = RegisterCode.objects.filter(code=random_code).count()
                    if random_code_used > 0: # 已存在此注册码，继续生成一个注册码
                        is_code = False
                    else:# 数据库中不存在此注册码，跳出循环
                        is_code = True
                # 创建一个注册码
                RegisterCode.objects.create(
                    code = random_code,
                    all_cnt = all_cnt,
                    create_user = request.user
                )
                return JsonResponse({'status':True,'data':'新增成功'})
            except Exception as e:
                logger.exception("生成注册码异常")
                return JsonResponse({'status': False,'data':'系统异常'})
        elif int(types) == 2:
            code_id = request.POST.get('code_id',None)
            try:
                register_code = RegisterCode.objects.get(id=int(code_id))
                register_code.delete()
                return JsonResponse({'status':True,'data':'删除成功'})
            except ObjectDoesNotExist:
                return JsonResponse({'status':False,'data':'注册码不存在'})
            except:
                return JsonResponse({'status':False,'data':'系统异常'})
        else:
            return JsonResponse({'status':False,'data':'类型错误'})
    else:
        return JsonResponse({'status': False,'data':'方法错误'})

# 普通用户修改密码
@login_required()
@logger.catch()
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


# 管理员后台 - 应用设置
@superuser_only
@logger.catch()
def admin_setting(request):
    email_settings = SysSetting.objects.filter(types="email")
    if email_settings.count() == 6:
        emailer = email_settings.get(name='send_emailer')
        email_host = email_settings.get(name='smtp_host')
        email_port = email_settings.get(name='smtp_port')
        email_username = email_settings.get(name="username")
        email_ssl = email_settings.get(name="smtp_ssl")
        email_pwd = email_settings.get(name="pwd")
    if request.method == 'GET':
        return render(request,'app_admin/admin_setting.html',locals())
    elif request.method == 'POST':
        types = request.POST.get('type',None)
        # 基础设置
        if types == 'basic':
            close_register = request.POST.get('close_register',None) # 禁止注册
            require_login = request.POST.get('require_login',None) # 全站登录
            static_code = request.POST.get('static_code',None) # 统计代码
            ad_code = request.POST.get('ad_code',None) # 广告位1
            ad_code_2 = request.POST.get('ad_code_2',None) # 广告位2
            ad_code_3 = request.POST.get('ad_code_3', None)  # 广告位3
            beian_code = request.POST.get('beian_code',None) # 备案号
            enbale_email = request.POST.get("enable_email",None) # 启用邮箱
            enable_register_code = request.POST.get('enable_register_code',None) # 注册邀请码
            enable_project_report = request.POST.get('enable_project_report',None) # 文集导出
            # 更新开放注册状态
            SysSetting.objects.update_or_create(
                name='require_login',
                defaults={'value':require_login,'types':'basic'}
            )
            # 更新全站登录状态
            SysSetting.objects.update_or_create(
                name='close_register',
                defaults={'value': close_register, 'types': 'basic'}
            )
            # 更新统计代码状态
            SysSetting.objects.update_or_create(
                name = 'static_code',
                defaults={'value':static_code,'types':'basic'}
            )
            # 更新广告代码状态
            SysSetting.objects.update_or_create(
                name = 'ad_code',
                defaults={'value':ad_code,'types':'basic'}
            )
            SysSetting.objects.update_or_create(
                name='ad_code_2',
                defaults={'value': ad_code_2, 'types': 'basic'}
            )
            SysSetting.objects.update_or_create(
                name='ad_code_3',
                defaults={'value': ad_code_3, 'types': 'basic'}
            )

            # 更新备案号
            SysSetting.objects.update_or_create(
                name='beian_code',
                defaults={'value':beian_code,'types':'basic'}
            )
            # 更新邮箱启用状态
            SysSetting.objects.update_or_create(
                name='enable_email',
                defaults={'value': enbale_email, 'types': 'basic'}
            )
            # 更新注册码启停状态
            SysSetting.objects.update_or_create(
                name = 'enable_register_code',
                defaults= {'value': enable_register_code, 'types':'basic'}
            )
            # 更新文集导出状态
            SysSetting.objects.update_or_create(
                name = 'enable_project_report',
                defaults={'value':enable_project_report,'types':'basic'}
            )

            return render(request,'app_admin/admin_setting.html',locals())
        elif types == 'email':
            # 读取上传的参数
            emailer = request.POST.get("send_emailer",None)
            host = request.POST.get("smtp_host",None)
            port = request.POST.get("smtp_port",None)
            username = request.POST.get("smtp_username",None)
            pwd = request.POST.get("smtp_pwd",None)
            ssl = request.POST.get("smtp_ssl",None)
            # 对密码进行加密
            pwd = enctry(pwd)
            if emailer != None:
                # 更新发件箱
                SysSetting.objects.update_or_create(
                    name = 'send_emailer',
                    defaults={"value":emailer,"types":'email'}
                )
            if host != None:
                # 更新邮箱主机
                SysSetting.objects.update_or_create(
                    name='smtp_host',
                    defaults={"value": host, "types": 'email'}
                )
            if port != None:
                # 更新邮箱主机端口
                SysSetting.objects.update_or_create(
                    name='smtp_port',
                    defaults={"value": port, "types": 'email'}
                )
            if username != None:
                # 更新用户名
                SysSetting.objects.update_or_create(
                    name='username',
                    defaults={"value": username, "types": 'email'}
                )
            if pwd != None:
                # 更新密码
                SysSetting.objects.update_or_create(
                    name='pwd',
                    defaults={"value": pwd, "types": 'email'}
                )
            # 更新SSL
            SysSetting.objects.update_or_create(
                name='smtp_ssl',
                defaults={"value": ssl, "types": 'email'}
            )
            email_settings = SysSetting.objects.filter(types="email")
            if email_settings.count() == 6:
                emailer = email_settings.get(name='send_emailer')
                email_host = email_settings.get(name='smtp_host')
                email_port = email_settings.get(name='smtp_port')
                email_username = email_settings.get(name="username")
                email_ssl = email_settings.get(name="smtp_ssl")
                email_pwd = email_settings.get(name="pwd")
            return render(request, 'app_admin/admin_setting.html',locals())
