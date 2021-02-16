# coding:utf-8
from django.shortcuts import render,redirect
from django.http.response import JsonResponse,HttpResponse,Http404
from django.contrib.auth import authenticate,login,logout # 认证相关方法
from django.contrib.auth.models import User # Django默认用户模型
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from django.views.decorators.http import require_http_methods,require_GET,require_POST # 视图请求方法装饰器
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage,InvalidPage # 后端分页
from app_admin.decorators import superuser_only,open_register
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.urls import reverse
import datetime
import requests
from app_doc.models import *
from app_admin.models import *
from app_admin.utils import *
import traceback
from loguru import logger
import re


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
        return HttpResponse(stream.getvalue(), content_type="image/png")
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
            # 判断是否需要验证码
            require_login_check_code = SysSetting.objects.filter(types="basic",name="enable_login_check_code")
            if (len(require_login_check_code) > 0) and (require_login_check_code[0].value == 'on'):
                checkcode = request.POST.get("check_code", None)
                if checkcode != request.session['CheckCode'].lower():
                    errormsg = '验证码错误！'
                    return render(request, 'login.html', locals())
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
                    elif re.match('^[0-9a-z]+$',username) is False:
                        errormsg = '用户名只能为英文数字组合'
                        return render(request, 'register.html', locals())
                    elif len(username) < 5:
                        errormsg = '用户名必须大于等于5位！'
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
            if expire_time > datetime.datetime.now():
                user = User.objects.get(email=email)
                user.set_password(new_pwd)
                user.save()
                errormsg = "修改密码成功，请返回登录！"
                return render(request, 'forget_pwd.html', locals())
            else:
                errormsg = "验证码已过期"
                return render(request, 'forget_pwd.html', locals())
        except ObjectDoesNotExist:
            logger.error("邮箱不存在：{}".format(email))
            errormsg = "验证码或邮箱错误"
            return render(request, 'forget_pwd.html', locals())
        except Exception as e:
            logger.exception("修改密码异常")
            errormsg = "验证码或邮箱错误"
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


# 后台管理 - 仪表盘
@superuser_only
def admin_overview(request):
    if request.method == 'GET':
        # 用户数
        user_cnt = User.objects.all().count()
        # 文集数
        pro_cnt = Project.objects.all().count() # 文集总数
        # 文档数
        doc_cnt = Doc.objects.all().count() # 文档总数
        total_tag_cnt = Tag.objects.filter(create_user=request.user).count()
        img_cnt = Image.objects.filter(user=request.user).count()
        attachment_cnt = Attachment.objects.filter(user=request.user).count()
        # 文档动态
        doc_active_list = Doc.objects.all().order_by('-modify_time')[:5]
        # 个人文集列表
        pro_list = Project.objects.filter(create_user=request.user).order_by('-create_time')
        return render(request,'app_admin/admin_overview.html',locals())
    else:
        pass

# 后台管理 - 用户管理
@superuser_only
@logger.catch()
def admin_user(request):
    if request.method == 'GET':
        return render(request, 'app_admin/admin_user.html', locals())
    elif request.method == 'POST':
        username = request.POST.get('username','')
        page = request.POST.get('page', 1)
        limit = request.POST.get('limit', 10)
        if username == '':
            user_data = User.objects.all().values(
                'id','last_login','is_superuser','username','email','date_joined','is_active','first_name'
            )
        else:
            user_data = User.objects.filter(username__icontains=username).values(
                'id','last_login','is_superuser','username','email','date_joined','is_active','first_name'
            )

        # 分页处理
        paginator = Paginator(user_data, limit)
        page = request.GET.get('page', page)
        try:
            users = paginator.page(page)
        except PageNotAnInteger:
            users = paginator.page(1)
        except EmptyPage:
            users = paginator.page(paginator.num_pages)

        table_data = []
        for i in users:
            item = {
                'id':i['id'],
                'last_login':i['last_login'],
                'is_superuser':i['is_superuser'],
                'username':i['username'],
                'email':i['email'],
                'date_joined':i['date_joined'],
                'is_active':i['is_active'],
                'first_name':i['first_name'],
            }
            table_data.append(item)
        return JsonResponse({'code':0,'data':table_data,"count": user_data.count()})
    else:
        return JsonResponse({'code':1,'msg':'方法错误'})


# 后台管理 - 创建用户
@superuser_only
@logger.catch()
def admin_create_user(request):
    if request.method == 'POST':
        username = request.POST.get('username','') # 接收用户名参数
        email = request.POST.get('email','') # 接收email参数
        password = request.POST.get('password','') # 接收密码参数
        user_type = request.POST.get('user_type',0) # 用户类型 0为普通用户，1位管理员
        if username != '' and password != '' and email != '' and \
                '@' in email and re.match(r'^[0-9a-z]',username) and len(username) >= 5 :
            # 不允许电子邮箱重复
            if User.objects.filter(email = email).count() > 0:
                return JsonResponse({'status':False,'data':'电子邮箱不可重复'})
            # 不允许重复的用户名
            if User.objects.filter(username = username).count() > 0:
                return JsonResponse({'status': False,'data':'用户名不可重复'})
            try:
                if user_type == 0:
                    user = User.objects.create_user(
                        username=username,
                        password=password,
                        email=email
                    )
                    user.save()
                elif int(user_type) == 1:
                    user = User.objects.create_superuser(
                        username=username,
                        password=password,
                        email=email
                    )
                    user.save()
                return JsonResponse({'status':True})
            except Exception as e:
                return JsonResponse({'status':False,'data':'系统异常'})
        else:
            return JsonResponse({'status':False,'data':'请检查参数'})
    else:
        return HttpResponse('方法不允许')


# 后台管理 - 修改密码
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


# 后台管理 - 删除用户
@superuser_only
@logger.catch()
def admin_del_user(request):
    if request.method == 'POST':
        try:
            user_id = request.POST.get('user_id',None) # 获取用户ID
            user = User.objects.get(id=int(user_id)) # 获取用户
            colloas = ProjectCollaborator.objects.filter(user=user) # 获取参与协作的文集
            # 遍历用户参与协作的文集
            for colloa in colloas:
                # 查询出用户协作创建的文档，修改作者为文集所有者
                Doc.objects.filter(
                    top_doc=colloa.project.id,create_user=user
                ).update(create_user=colloa.project.create_user)
            user.delete()
            return JsonResponse({'status':True,'data':'删除成功'})
        except Exception as e:
            return JsonResponse({'status':False,'data':'删除出错'})
    else:
        return JsonResponse({'status':False,'data':'方法错误'})


# 后台管理 - 文集管理
@superuser_only
@logger.catch()
def admin_project(request):
    if request.method == 'GET':
        return render(request,'app_admin/admin_project.html',locals())
    elif request.method == 'POST':
        kw = request.POST.get('kw', '')
        page = request.POST.get('page', 1)
        limit = request.POST.get('limit', 10)
        # 获取文集列表
        if kw == '':
            project_list = Project.objects.all().order_by('-create_time')
        else:
            project_list = Project.objects.filter(
                Q(intro__icontains=kw) | Q(name__icontains=kw),
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
                'id': project.id,
                'name': project.name,
                'intro': project.intro,
                'doc_total': Doc.objects.filter(top_doc=project.id).count(),
                'role': project.role,
                'role_value': project.role_value,
                'colla_total': ProjectCollaborator.objects.filter(project=project).count(),
                'is_top':project.is_top,
                'create_user':project.create_user.username,
                'create_time': project.create_time,
                'modify_time': project.modify_time
            }
            table_data.append(item)
        resp_data = {
            "code": 0,
            "msg": "ok",
            "count": project_list.count(),
            "data": table_data
        }
        return JsonResponse(resp_data)

# 后台管理 - 修改文集权限
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

# 后台管理 - 控制文集置顶状态
@superuser_only
@require_POST
def admin_project_istop(request):
    try:
        project_id = request.POST.get('id')
        is_top = request.POST.get('is_top')
        if is_top == 'true':
            is_top = True
        else:
            is_top = False
        Project.objects.filter(id=project_id).update(is_top=is_top)
        return JsonResponse({'status':True})
    except:
        logger.exception("置顶文集出错")
        return JsonResponse({'status':False,'data':'执行出错'})


# 后台管理 - 文档管理
@superuser_only
@logger.catch()
def admin_doc(request):
    if request.method == 'GET':
        # 文集列表
        project_list = Project.objects.all()  # 自己创建的文集列表
        # 文档数量
        # 已发布文档数量
        published_doc_cnt = Doc.objects.filter(status=1).count()
        # 草稿文档数量
        draft_doc_cnt = Doc.objects.filter(status=0).count()
        # 所有文档数量
        all_cnt = published_doc_cnt + draft_doc_cnt
        return render(request,'app_admin/admin_doc.html',locals())
    elif request.method == 'POST':
        kw = request.POST.get('kw', '')
        project = request.POST.get('project', '')
        status = request.POST.get('status', '')
        if status == '-1':  # 全部文档
            q_status = [0, 1]
        elif status in ['0', '1']:
            q_status = [int(status)]
        else:
            q_status = [0, 1]

        if project == '':
            project_list = Project.objects.all().values_list('id', flat=True)  # 自己创建的文集列表
            q_project = list(project_list)
        else:
            q_project = [project]

        page = request.POST.get('page', 1)
        limit = request.POST.get('limit', 10)
        # 没有搜索
        if kw == '':
            doc_list = Doc.objects.filter(
                status__in=q_status,
                top_doc__in=q_project
            ).order_by('-modify_time')
        # 有搜索
        else:
            doc_list = Doc.objects.filter(
                Q(content__icontains=kw) | Q(name__icontains=kw),
                status__in=q_status, top_doc__in=q_project
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
                'parent': Doc.objects.get(id=doc.parent_doc).name if doc.parent_doc != 0 else '无',
                'project_id': Project.objects.get(id=doc.top_doc).id,
                'project_name': Project.objects.get(id=doc.top_doc).name,
                'status': doc.status,
                'editor_mode': doc.editor_mode,
                'open_children': doc.open_children,
                'create_user':doc.create_user.username,
                'create_time': doc.create_time,
                'modify_time': doc.modify_time
            }
            table_data.append(item)
        resp_data = {
            "code": 0,
            "msg": "ok",
            "count": doc_list.count(),
            "data": table_data
        }
        return JsonResponse(resp_data)


# 后台管理 - 文档模板管理
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


# 后台管理 - 注册邀请码管理
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


# 后台管理 - 应用设置
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
            site_name = request.POST.get('site_name',None) # 站点名称
            site_sub_name = request.POST.get('site_sub_name', None)  # 站点子标题
            site_keywords = request.POST.get('site_keywords', None)  # 站点关键词
            site_desc = request.POST.get('site_desc', None)  # 站点描述
            beian_code = request.POST.get('beian_code', None)  # 备案号
            index_project_sort = request.POST.get('index_project_sort','1') # 首页文集默认排序
            close_register = request.POST.get('close_register',None) # 禁止注册
            require_login = request.POST.get('require_login',None) # 全站登录
            static_code = request.POST.get('static_code',None) # 统计代码
            ad_code = request.POST.get('ad_code',None) # 广告位1
            ad_code_2 = request.POST.get('ad_code_2',None) # 广告位2
            ad_code_3 = request.POST.get('ad_code_3', None)  # 广告位3
            enbale_email = request.POST.get("enable_email",None) # 启用邮箱
            img_scale = request.POST.get('img_scale',None) # 图片缩略
            enable_register_code = request.POST.get('enable_register_code',None) # 注册邀请码
            enable_project_report = request.POST.get('enable_project_report',None) # 文集导出
            enable_login_check_code = request.POST.get('enable_login_check_code',None) # 登录验证码
            # 更新首页文集默认排序
            SysSetting.objects.update_or_create(
                name='index_project_sort',
                defaults={'value': index_project_sort, 'types': 'basic'}
            )
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
            # 更新站点名称
            SysSetting.objects.update_or_create(
                name='site_name',
                defaults={'value': site_name, 'types': 'basic'}
            )
            # 更新站点子标题
            SysSetting.objects.update_or_create(
                name='site_sub_name',
                defaults={'value': site_sub_name, 'types': 'basic'}
            )
            # 更新站点关键词
            SysSetting.objects.update_or_create(
                name='site_keywords',
                defaults={'value': site_keywords, 'types': 'basic'}
            )
            # 更新站点描述
            SysSetting.objects.update_or_create(
                name='site_desc',
                defaults={'value': site_desc, 'types': 'basic'}
            )

            # 更新图片缩略状态
            SysSetting.objects.update_or_create(
                name='img_scale',
                defaults={'value': img_scale, 'types': 'basic'}
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
            # 更新登录验证码状态
            SysSetting.objects.update_or_create(
                name = 'enable_login_check_code',
                defaults={'value':enable_login_check_code,'types':'basic'}
            )


            return render(request,'app_admin/admin_setting.html',locals())
        # 邮箱设置
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
        # 文档全局设置
        elif types == 'doc':
            # iframe白名单
            iframe_whitelist = request.POST.get('iframe_whitelist','')
            SysSetting.objects.update_or_create(
                name = 'iframe_whitelist',
                defaults = {'value':iframe_whitelist,'types':'doc'}
            )
            # 上传图片大小
            img_size = request.POST.get('img_size', 10)
            try:
                if int(img_size) == 0:
                    img_size = 50
                else:
                    img_size = abs(int(img_size))
            except Exception as e:
                # print(repr(e))
                img_size = 10
            SysSetting.objects.update_or_create(
                name='img_size',
                defaults={'value': img_size, 'types': 'doc'}
            )

            # 附件格式白名单
            attachment_suffix = request.POST.get('attachment_suffix','')
            SysSetting.objects.update_or_create(
                name = 'attachment_suffix',
                defaults = {'value':attachment_suffix,'types':'doc'}
            )
            # 附件大小
            attachment_size = request.POST.get('attachment_size',50)
            try:
                if int(attachment_size) == 0:
                    attachment_size = 50
                else:
                    attachment_size = abs(int(attachment_size))
            except Exception as e:
                # print(repr(e))
                attachment_size = 50
            SysSetting.objects.update_or_create(
                name='attachment_size',
                defaults={'value': attachment_size, 'types': 'doc'}
            )
            return render(request, 'app_admin/admin_setting.html', locals())


# 检测版本更新
def check_update(request):
    url = 'https://gitee.com/api/v5/repos/zmister/MrDoc/tags'
    resp = requests.get(url,timeout=5).json()
    return JsonResponse({'status':True,'data':resp[-1]})


# 后台管理
@superuser_only
def admin_center(request):
    return render(request,'app_admin/admin_center.html',locals())


# 后台管理菜单
def admin_center_menu(request):
    menu_data = [
        {
            "id": 1,
            "title": "仪表盘",
            "type": 1,
            "icon": "layui-icon layui-icon-console",
            "href": reverse('admin_overview'),
        },
        {
            "id": 2,
            "title": "文集管理",
            "type": 1,
            "icon": "layui-icon layui-icon-list",
            "href": reverse('project_manage'),
        },
        {
            "id": 3,
            "title": "文档管理",
            "type": 1,
            "icon": "layui-icon layui-icon-form",
            "href": reverse('doc_manage'),
        },
        {
            "id": 4,
            "title": "文档模板管理",
            "type": 1,
            "icon": "layui-icon layui-icon-templeate-1",
            "href": reverse('doctemp_manage'),
        },
        {
            "id": 5,
            "title": "注册码管理",
            "type": 1,
            "icon": "layui-icon layui-icon-component",
            "href": reverse('register_code_manage'),
        },
        {
            "id": 6,
            "title": "用户管理",
            "type": 1,
            "icon": "layui-icon layui-icon-user",
            "href": reverse('user_manage'),
        },
        {
            "id": 7,
            "title": "站点设置",
            "type": 1,
            "icon": "layui-icon layui-icon-set",
            "href": reverse('sys_setting'),
        },
        {
            "id": "common",
            "title": "使用帮助",
            "icon": "layui-icon layui-icon-template-1",
            "type": 0,
            "href": "",
            "children": [{
                "id": 701,
                "title": "安装说明",
                "icon": "layui-icon layui-icon-face-smile",
                "type": 1,
                "openType": "_blank",
                "href": "http://mrdoc.zmister.com/project-7/"
            }, {
                "id": 702,
                "title": "使用说明",
                "icon": "layui-icon layui-icon-face-smile",
                "type": 1,
                "openType": "_blank",
                "href": "http://mrdoc.zmister.com/project-54/"
            }]
        }
    ]
    return JsonResponse(menu_data,safe=False)
