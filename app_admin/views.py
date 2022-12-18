# coding:utf-8
from django.shortcuts import render,redirect
from django.http.response import JsonResponse,HttpResponse,Http404
from django.contrib.auth import authenticate,login,logout # 认证相关方法
from django.contrib.auth.models import User # Django默认用户模型
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from django.views.decorators.http import require_http_methods,require_GET,require_POST # 视图请求方法装饰器
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage,InvalidPage # 后端分页
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from rest_framework.views import APIView # 视图
from rest_framework.response import Response # 响应
from rest_framework.pagination import PageNumberPagination # 分页
from rest_framework.authentication import SessionAuthentication # 认证
from rest_framework.permissions import IsAdminUser # 权限
from app_api.serializers_app import *
from app_api.auth_app import AppAuth,AppMustAuth # 自定义认证
from app_api.permissions_app import SuperUserPermission # 自定义权限
from app_admin.decorators import superuser_only,open_register
from app_doc.models import *
from app_doc.views import jsonXssFilter
from app_admin.models import *
from app_admin.utils import *
from loguru import logger
import re
import datetime
import requests
import os


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
        logger.exception(_("生成验证码图片异常"))
        return HttpResponse(_("请求异常：{}".format(repr(e))))


# 登录视图
def log_in(request):
    to = request.GET.get('next', '/')
    if request.method == 'GET':
        # 登录用户访问登录页面自动跳转到首页
        if request.user.is_authenticated:
            return redirect(to)
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
                if checkcode.lower() != request.session['CheckCode'].lower():
                    errormsg = _('验证码错误！')
                    return render(request, 'login.html', locals())
            # 验证登录次数
            if 'LoginLock' not in request.session.keys():
                request.session['LoginNum'] = 1 # 重试次数
                request.session['LoginLock'] = False # 是否锁定
                request.session['LoginTime'] = datetime.datetime.now().timestamp() # 解除锁定时间
            verify_num = request.session['LoginNum']
            if verify_num > 5:
                request.session['LoginLock'] = True
                request.session['LoginTime'] = (datetime.datetime.now() + datetime.timedelta(minutes=10)).timestamp()
            verify_lock = request.session['LoginLock']
            verify_time = request.session['LoginTime']

            # 验证是否锁定
            # print(datetime.datetime.now().timestamp(),verify_time)
            if verify_lock is True and datetime.datetime.now().timestamp() < verify_time:
                errormsg = _("操作过于频繁，请10分钟后再试！")
                request.session['LoginNum'] = 0  # 重试次数清零
                return render(request, 'login.html', locals())

            if username != '' and pwd != '':
                user = authenticate(username=username,password=pwd)
                if user is not None:
                    if user.is_active:
                        login(request,user)
                        request.session['LoginNum'] = 0  # 重试次数
                        request.session['LoginLock'] = False  # 是否锁定
                        request.session['LoginTime'] = datetime.datetime.now().timestamp()  # 解除锁定时间
                        return redirect(to)
                    else:
                        errormsg = _('用户被禁用！')
                        return render(request, 'login.html', locals())
                else:
                    errormsg = _('用户名或密码错误！')
                    request.session['LoginNum'] += 1
                    return render(request, 'login.html', locals())
            else:
                errormsg = _('用户名或密码未输入！')
                return render(request, 'login.html', locals())
        except Exception as e:
            logger.exception("登录异常")
            return HttpResponse(_('请求出错'))


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
                    errormsg = _('注册码无效!')
                    return render(request, 'register.html', locals())
            # 判断是否输入了用户名、邮箱和密码
            if username and email and password:
                if '@'in email:
                    email_exit = User.objects.filter(email=email)
                    username_exit = User.objects.filter(username=username)
                    if email_exit.count() > 0: # 验证电子邮箱
                        errormsg = _('此电子邮箱已被注册！')
                        return render(request, 'register.html', locals())
                    elif username_exit.count() > 0: # 验证用户名
                        errormsg = _('用户名已被使用！')
                        return render(request, 'register.html', locals())
                    elif re.match('^[0-9a-z]+$',username) is None:
                        errormsg = _('用户名只能为小写英文+数字组合')
                        return render(request, 'register.html', locals())
                    elif len(username) < 5:
                        errormsg = _('用户名必须大于等于5位！')
                        return render(request, 'register.html', locals())
                    elif len(password) < 6: # 验证密码长度
                        errormsg = _('密码必须大于等于6位！')
                        return render(request, 'register.html', locals())
                    elif checkcode.lower() != request.session['CheckCode'].lower(): # 验证验证码
                        errormsg = _("验证码错误")
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
                            errormsg = _('用户被禁用，请联系管理员！')
                            return render(request, 'register.html', locals())
                else:
                    errormsg = _('请输入正确的电子邮箱格式！')
                    return render(request, 'register.html', locals())
            else:
                errormsg = _("请检查输入值")
                return render(request, 'register.html', locals())


# 注销
@require_POST
def log_out(request):
    try:
        logout(request)
        project_viewcode_list = []
        for c in list(request.COOKIES.keys()):
            if c.startswith('viewcode-'):
                project_viewcode_list.append(c)
        resp = request.META['HTTP_REFERER']
        for c in project_viewcode_list:
            resp.delete_cookie(c)
        return JsonResponse({'status': True, 'data': resp})
    except Exception as e:
        logger.exception(_("注销异常"))
        return JsonResponse({'status':False})


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
            # 验证重试次数
            if 'ForgetPwdEmailCodeVerifyLock' not in request.session.keys():
                request.session['ForgetPwdEmailCodeVerifyNum'] = 1 # 重试次数
                request.session['ForgetPwdEmailCodeVerifyLock'] = False # 是否锁定
                request.session['ForgetPwdEmailCodeVerifyTime'] = datetime.datetime.now().timestamp() # 解除锁定时间
            verify_num = request.session['ForgetPwdEmailCodeVerifyNum']
            if verify_num > 5:
                request.session['ForgetPwdEmailCodeVerifyLock'] = True
                request.session['ForgetPwdEmailCodeVerifyTime'] = (datetime.datetime.now() + datetime.timedelta(minutes=10)).timestamp()
            verify_lock = request.session['ForgetPwdEmailCodeVerifyLock']
            verify_time = request.session['ForgetPwdEmailCodeVerifyTime']

            # 验证是否锁定
            # print(datetime.datetime.now().timestamp(),verify_time)
            if verify_lock is True and datetime.datetime.now().timestamp() < verify_time:
                errormsg = _("操作过于频繁，请10分钟后再试！")
                request.session['ForgetPwdEmailCodeVerifyNum'] = 0  # 重试次数清零
                return render(request, 'forget_pwd.html', locals())
            # 比对验证码
            data = EmaiVerificationCode.objects.get(email_name=email,verification_code=vcode,verification_type='忘记密码')
            expire_time = data.expire_time
            if expire_time > datetime.datetime.now():
                user = User.objects.get(email=email)
                user.set_password(new_pwd)
                user.save()
                errormsg = _("修改密码成功，请返回登录！")
                request.session['ForgetPwdEmailCodeVerifyNum'] = 0 # 重试次数
                request.session['ForgetPwdEmailCodeVerifyLock'] = False # 是否锁定
                request.session['ForgetPwdEmailCodeVerifyTime'] = datetime.datetime.now().timestamp() # 解除锁定时间
                return render(request, 'forget_pwd.html', locals())
            else:
                errormsg = _("验证码已过期！")
                return render(request, 'forget_pwd.html', locals())
        except ObjectDoesNotExist:
            logger.error(_("验证码或邮箱不存在：{}".format(email)))
            errormsg = _("验证码或邮箱错误！")
            request.session['ForgetPwdEmailCodeVerifyNum'] += 1
            return render(request, 'forget_pwd.html', locals())
        except Exception as e:
            logger.exception("修改密码异常")
            errormsg = _("验证码或邮箱错误！")
            request.session['ForgetPwdEmailCodeVerifyNum'] += 1
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
                return JsonResponse({'status':True,'data':_('发送成功')})
            else:
                return JsonResponse({'status':False,'data':_('发送验证码出错，请重试！')})

        else:
            return JsonResponse({'status':False,'data':_('电子邮箱不存在！')})
    else:
        return JsonResponse({'status':False,'data':_('方法错误')})


# 测试电子邮箱配置
@superuser_only
@require_http_methods(['POST'])
def send_email_test(request):
    smtp_host = request.POST.get('smtp_host','')
    send_emailer = request.POST.get('send_emailer','')
    smtp_port = request.POST.get('smtp_port','')
    username = request.POST.get('smtp_username','')
    pwd = request.POST.get('smtp_pwd','')
    ssl = True if request.POST.get('smtp_ssl','') == 'on' else False
    # print(smtp_host,smtp_port,send_emailer,username,pwd)

    msg_from = send_emailer  # 发件人邮箱
    msg_to = send_emailer  # 收件人邮箱
    try:
        sitename = SysSetting.objects.get(types="basic", name="site_name").value
    except:
        sitename = "MrDoc"
    subject = "{sitename} - 邮箱配置测试".format(sitename=sitename)
    content = "此邮件由管理员配置【{sitename}】邮箱信息时发出！".format(sitename=sitename)
    msg = MIMEText(content, _subtype='html', _charset='utf-8')
    msg['Subject'] = subject
    msg['From'] = '{}[{}]'.format(sitename, msg_from)
    msg['To'] = msg_to
    try:
        # print(smtp_host,smtp_port)
        if ssl:
            s = smtplib.SMTP_SSL(smtp_host, int(smtp_port))  # 发件箱邮件服务器及端口号
        else:
            s = smtplib.SMTP(smtp_host, int(smtp_port))
        s.login(username, pwd)
        s.sendmail(from_addr=msg_from, to_addrs=msg_to, msg=msg.as_string())
        s.quit()
        return JsonResponse({'status':True,'data':_('发送成功')})
    except smtplib.SMTPException as e:
        logger.error("邮件发送异常:{}".format(repr(e)))
        return JsonResponse({'status':False,'data':repr(e)})
    except Exception as e:
        logger.error("邮件发送异常:{}".format(repr(e)))
        return JsonResponse({'status':False,'data':repr(e)})

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

# 后台管理 - 用户管理HTML
@superuser_only
@logger.catch()
@require_GET
def admin_user(request):
    return render(request, 'app_admin/admin_user.html', locals())


# 后台管理 - 用户管理 - 用户资料编辑HTML
def admin_user_profile(request):
    return render(request, 'app_admin/admin_user_profile.html',locals())


# 后台管理 - 用户列表接口
class AdminUserList(APIView):
    authentication_classes = [SessionAuthentication,AppMustAuth]
    permission_classes = [SuperUserPermission]

    # 获取用户列表
    def get(self, request):
        username = request.query_params.get('username', '')
        page_num = request.query_params.get('page', 1)
        limit = request.query_params.get('limit', 10)
        if username == '':
            user_data = User.objects.all().values(
                'id', 'last_login', 'is_superuser', 'username', 'email', 'date_joined', 'is_active', 'first_name'
            )
        else:
            user_data = User.objects.filter(username__icontains=username).values(
                'id', 'last_login', 'is_superuser', 'username', 'email', 'date_joined', 'is_active', 'first_name'
            )

        page = PageNumberPagination()  # 实例化一个分页器
        page.page_size = limit
        page_users = page.paginate_queryset(user_data, request, view=self)  # 进行分页查询
        serializer = UserSerializer(page_users, many=True)  # 对分页后的结果进行序列化处理
        resp = {
            'code': 0,
            'data': serializer.data,
            'count': user_data.count()
        }

        return Response(resp)

    # 新增用户
    def post(self, request):
        username = request.data.get('username', '')  # 接收用户名参数
        email = request.data.get('email', '')  # 接收email参数
        password = request.data.get('password', '')  # 接收密码参数
        user_type = request.data.get('user_type', 0)  # 用户类型 0为普通用户，1位管理员
        # 用户名只能为英文小写或数字且大于等于5位，密码大于等于6位
        if len(username) >= 5 and \
                len(password) >= 6 and \
                '@' in email and \
                re.match(r'^[0-9a-z]', username):
            # 不允许电子邮箱重复
            if User.objects.filter(email=email).count() > 0:
                return JsonResponse({'status': False, 'data': _('电子邮箱不可重复')})
            # 不允许重复的用户名
            if User.objects.filter(username=username).count() > 0:
                return JsonResponse({'status': False, 'data': _('用户名不可重复')})
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
                return Response({'code': 0})
            except Exception as e:
                return Response({'code': 4, 'data': _('系统异常')})
        else:
            return JsonResponse({'code': 5, 'data': _('请检查参数')})


# 后台管理 - 用户接口
class AdminUserDetail(APIView):
    authentication_classes = [SessionAuthentication,AppMustAuth]
    permission_classes = [SuperUserPermission]

    def get_object(self, id):
        try:
            return User.objects.get(id=id)
        except ObjectDoesNotExist:
            raise Http404

    # 获取用户
    def get(self,request, id):
        user = self.get_object(id)
        serializer = UserSerializer(user)
        resp = {
            'code': 0,
            'data': serializer.data,
        }

        return Response(resp)

    # 修改用户（资料、密码）
    def put(self, request, id):
        obj = request.data.get('obj','')
        if obj.replace(' ','') == '':
            resp = {
                'code':5,
                'data':'无效类型'
            }
            return Response(resp)
        elif obj == 'info': # 修改资料
            status = request.POST.get('is_active', '')  # 状态
            username = request.POST.get('username', '')  # 用户名
            nickname = request.POST.get('nickname', '')  # 昵称
            email = request.POST.get('email', '')  # 电子邮箱
            is_superuser = request.POST.get('is_superuser', '')  # 是否超级管理员
            try:
                User.objects.filter(id=id).update(
                    username = username,
                    first_name = nickname,
                    email = email,
                    is_active = True if status == 'on' else False,
                    is_superuser = True if is_superuser == 'true' else False
                )
                return Response({'code': 0, 'data': _('修改成功')})
            except:
                logger.exception("修改用户资料异常")
                return Response({'code': 4, 'data': _('修改异常')})

        elif obj == 'pwd': # 修改密码
            try:
                password = request.data.get('password', None)
                password2 = request.data.get('password2', None)
                if id and password:
                    if password == password2:
                        user = User.objects.get(id=int(id))
                        user.set_password(password)
                        user.save()
                        return Response({'code': 0, 'data': _('修改成功')})
                    else:
                        return Response({'code': 5, 'data': _('两个密码不一致')})
                else:
                    return JsonResponse({'code': 5, 'data': _('参数错误')})
            except Exception as e:
                return JsonResponse({'code': 4, 'data': _('请求错误')})

        else:
            resp = {
                'code': 5,
                'data': '无效类型'
            }
            return Response(resp)

    # 删除用户
    def delete(self, request, id):
        try:
            user = self.get_object(id)  # 获取用户
            projects = Project.objeects.filter(create_user=user) # 获取用户自己的文集
            for p in projects:
                Doc.objects.filter(top_doc=p.id).delete()
            colloas = ProjectCollaborator.objects.filter(user=user)  # 获取参与协作的文集
            # 遍历用户参与协作的文集
            for colloa in colloas:
                # 查询出用户协作创建的文档，修改作者为文集所有者
                Doc.objects.filter(
                    top_doc=colloa.project.id, create_user=user
                ).update(create_user=colloa.project.create_user)
            user.delete()
            resp = {
                'code':0,
                'data':_('删除成功')
            }
            return Response(resp)
        except Exception as e:
            logger.exception("删除用户出错")
            resp = {
                'code': 4,
                'data': _('删除出错')
            }
            return Response(resp)


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

# 后台管理 - 修改文集协作成员页面
@superuser_only
def admin_project_colla_config(request,pro_id):
    project = Project.objects.filter(id=pro_id)
    if project.exists() is False:
        return render(request, '404.html')
    if request.method == 'GET':
        user_list = User.objects.filter(~Q(username=request.user.username)) # 获取用户列表
        pro = project[0]
        collaborator = ProjectCollaborator.objects.filter(project=pro) # 获取文集的协作者
        colla_user_list = [i.user for i in collaborator] # 文集协作用户的ID
        colla_docs = Doc.objects.filter(top_doc=pro.id,create_user__in=colla_user_list) # 获取文集协作用户创建的文档
        return render(request, 'app_admin/admin_project_colla_config.html', locals())

    elif request.method == 'POST':
        # type类型：0表示新增协作者、1表示删除协作者、2表示修改协作者
        types = request.POST.get('types','')
        try:
            types = int(types)
        except:
            return JsonResponse({'status':False,'data':_('参数错误')})
        # 添加文集协作者
        if int(types) == 0:
            colla_user = request.POST.get('username','').split(',') # 获取用户列表，形如1,2,3
            role = request.POST.get('role',0)
            for user in colla_user:
                user = User.objects.filter(id=user)
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
                else:
                    return JsonResponse({'status':False,'data':_('用户不存在')})
            return JsonResponse({'status': True, 'data': _('添加成功')})
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

# 后台管理 - 删除文集
@superuser_only
@require_POST
def admin_project_delete(request):
    try:
        range = request.POST.get('range','single')
        pro_id = request.POST.get('pro_id','')
        if pro_id != '':
            if range == 'single':
                pro = Project.objects.get(id=pro_id)
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
            elif range == 'multi':
                pros = pro_id.split(",")
                try:
                    projects = Project.objects.filter(id__in=pros)
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
        logger.exception(_("置顶文集出错"))
        return JsonResponse({'status':False,'data':_('执行出错')})


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
            "data": jsonXssFilter(table_data)
        }
        return JsonResponse(resp_data)

# 后台管理 - 文档管理 - 文档历史管理
@superuser_only
def admin_doc_history(request,id):
    doc = Doc.objects.get(id=id)
    return render(request,'app_admin/admin_doc_history.html',locals())


# 文档历史接口 - 通过文档id
class AdminDocHistory(APIView):
    authentication_classes = [SessionAuthentication, AppMustAuth]
    permission_classes = [SuperUserPermission]

    def get_object(self, id):
        try:
            return Doc.objects.get(id=id)
        except ObjectDoesNotExist:
            raise Http404

    # 获取文档的历史记录
    def get(self,request, id):
        doc = self.get_object(id=id)
        page_num = request.query_params.get('page', 1)
        limit = request.query_params.get('limit', 10)

        history_data = DocHistory.objects.filter(doc=doc).order_by('-create_time')
        page = PageNumberPagination()  # 实例化一个分页器
        page.page_size = limit
        page_historys = page.paginate_queryset(history_data, request, view=self)  # 进行分页查询
        serializer = DocHistorySerializer(page_historys, many=True)  # 对分页后的结果进行序列化处理
        resp = {
            'code': 0,
            'data': serializer.data,
            'count': history_data.count()
        }

        return Response(resp)

    # 删除文档的历史记录
    def delete(self,request,id):
        pass


# 文档历史详情接口 - 通过文档历史id
class AdminDocHistoryDetail(APIView):
    authentication_classes = [SessionAuthentication, AppMustAuth]
    permission_classes = [SuperUserPermission]

    def delete(self,request):
        try:
            id = request.data.get('id','')
            his = DocHistory.objects.filter(id=id).delete()
            return Response({'code':0})
        except:

            return Response({'code':5,'data':_("系统异常")})



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


# 后台管理 - 图片管理页面
@superuser_only
def admin_image(request):
    return render(request,'app_admin/admin_image.html',locals())

# 图片列表接口
class AdminImageList(APIView):
    authentication_classes = [SessionAuthentication,AppMustAuth]
    permission_classes = [SuperUserPermission]

    # 获取图片列表
    def get(self, request):
        kw  = request.query_params.get('kw', '')
        username = request.query_params.get('username', '')
        page_num = request.query_params.get('page', 1)
        limit = request.query_params.get('limit', 10)
        if kw == '' and username == '':
            img_data = Image.objects.all().order_by('-create_time')
        elif kw != '':
            img_data = Image.objects.filter(file_name__icontains=kw).order_by('-create_time')
        elif username != '':
            user = User.objects.get(id=username)
            img_data = Image.objects.filter(user=user).order_by('-create_time')
        page = PageNumberPagination()  # 实例化一个分页器
        page.page_size = limit
        page_imgs = page.paginate_queryset(img_data, request, view=self)  # 进行分页查询
        serializer = ImageSerializer(page_imgs, many=True)  # 对分页后的结果进行序列化处理
        resp = {
            'code': 0,
            'data': serializer.data,
            'count': img_data.count()
        }

        return Response(resp)

    # 批量删除图片
    def delete(self,request):
        ids = request.data.get('id','').split(',')
        try:
            image = Image.objects.filter(id__in=ids)  # 查询附件
            for a in image:  # 遍历附件
                file_path = settings.BASE_DIR + a.file_path
                is_exist = os.path.exists(file_path)
                if is_exist:
                    os.remove(file_path)
            image.delete()  # 删除数据库记录
            return JsonResponse({'code': 0, 'data': _('删除成功')})
        except Exception as e:
            logger.exception("删除图片异常")
            return JsonResponse({'code': 4, 'data': _('删除异常')})

# 图片详情接口
class AdminImageDetail(APIView):
    authentication_classes = [SessionAuthentication,AppMustAuth]
    permission_classes = [SuperUserPermission]

    # 删除图片
    def delete(self,request,id):
        try:
            image = Image.objects.filter(id=id)  # 查询附件
            for a in image:  # 遍历附件
                file_path = settings.BASE_DIR + a.file_path
                is_exist = os.path.exists(file_path)
                if is_exist:
                    os.remove(file_path)
            image.delete()  # 删除数据库记录
            return JsonResponse({'code': 0, 'data': _('删除成功')})
        except Exception as e:
            logger.exception("删除图片异常")
            return JsonResponse({'code': 4, 'data': _('删除异常')})


@superuser_only
# 后台管理 - 附件管理页面
def admin_attachment(request):
    return render(request,'app_admin/admin_attachment.html',locals())


# 附件列表接口
class AdminAttachmentList(APIView):
    authentication_classes = [SessionAuthentication,AppMustAuth]
    permission_classes = [SuperUserPermission]

    # 获取附件列表
    def get(self, request):
        kw  = request.query_params.get('kw', '')
        username = request.query_params.get('username', '')
        page_num = request.query_params.get('page', 1)
        limit = request.query_params.get('limit', 10)
        if kw == '' and username == '':
            attachment_data = Attachment.objects.all().order_by('-create_time')
        elif kw != '':
            attachment_data = Attachment.objects.filter(file_name__icontains=kw).order_by('-create_time')
        elif username != '':
            user = User.objects.get(id=username)
            attachment_data = Attachment.objects.filter(user=user).order_by('-create_time')
        page = PageNumberPagination()  # 实例化一个分页器
        page.page_size = limit
        page_attachments = page.paginate_queryset(attachment_data, request, view=self)  # 进行分页查询
        serializer = AttachmentSerializer(page_attachments, many=True)  # 对分页后的结果进行序列化处理
        resp = {
            'code': 0,
            'data': serializer.data,
            'count': attachment_data.count()
        }

        return Response(resp)

    # 批量删除附件
    def delete(self,request):
        ids = request.data.get('id','').split(',')
        try:
            attachment = Attachment.objects.filter(id__in=ids)  # 查询附件
            for a in attachment:  # 遍历附件
                a.file_path.delete()  # 删除文件
            attachment.delete()  # 删除数据库记录
            return JsonResponse({'code': 0, 'data': _('删除成功')})
        except Exception as e:
            logger.exception("删除附件异常")
            return JsonResponse({'code': 4, 'data': _('删除异常')})


# 附件详情接口
class AdminAttachmentDetail(APIView):
    authentication_classes = [SessionAuthentication,AppMustAuth]
    permission_classes = [SuperUserPermission]

    # 删除图片
    def delete(self,request,id):
        try:
            attachment = Attachment.objects.filter(id=id)  # 查询附件
            for a in attachment:  # 遍历附件
                a.file_path.delete()  # 删除文件
            attachment.delete()  # 删除数据库记录
            return JsonResponse({'code': 0, 'data': _('删除成功')})
        except Exception as e:
            logger.exception("删除图片异常")
            return JsonResponse({'code': 4, 'data': _('删除异常')})


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
                    return JsonResponse({'status': False, 'data': _('最大使用次数不可为负数')})
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
                return JsonResponse({'status':True,'data':_('新增成功')})
            except Exception as e:
                logger.exception(_("生成注册码异常"))
                return JsonResponse({'status': False,'data':_('系统异常')})
        elif int(types) == 2:
            code_id = request.POST.get('code_id',None)
            try:
                register_code = RegisterCode.objects.get(id=int(code_id))
                register_code.delete()
                return JsonResponse({'status':True,'data':_('删除成功')})
            except ObjectDoesNotExist:
                return JsonResponse({'status':False,'data':_('注册码不存在')})
            except:
                return JsonResponse({'status':False,'data':_('系统异常')})
        else:
            return JsonResponse({'status':False,'data':_('类型错误')})
    else:
        return JsonResponse({'status': False,'data':_('方法错误')})


# 普通用户修改密码
@login_required()
@logger.catch()
def change_pwd(request):
    if request.method == 'POST':
        try:
            old_pwd = request.POST.get('old_pwd', None)
            password = request.POST.get('password',None)
            password2 = request.POST.get('password2',None)
            # print(password, password2)
            user = request.user.check_password(old_pwd)
            if user is False:
                return JsonResponse({'status':False,'data':_('密码错误！')})
            if password and password== password2:
                if len(password) >= 6:
                    user = User.objects.get(id=request.user.id)
                    user.set_password(password)
                    user.save()
                    return JsonResponse({'status':True,'data':_('修改成功')})
                else:
                    return JsonResponse({'status':False,'data':_('密码不得少于6位数')})
            else:
                return JsonResponse({'status':False,'data':_('两个密码不一致')})
        except Exception as e:
            return JsonResponse({'status':False,'data':_('修改出错')})
    else:
        return HttpResponse(_('方法错误'))


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
        email_dec_pwd = dectry(email_settings.get(name="pwd").value)
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
            long_code = request.POST.get('long_code', None)  # 长代码显示
            disable_update_check = request.POST.get('disable_update_check', None)  # 关闭更新检测
            static_code = request.POST.get('static_code',None) # 统计代码
            ad_code = request.POST.get('ad_code',None) # 广告位1
            ad_code_2 = request.POST.get('ad_code_2',None) # 广告位2
            ad_code_3 = request.POST.get('ad_code_3', None)  # 广告位3
            ad_code_4 = request.POST.get('ad_code_4', None)  # 广告位4
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
            SysSetting.objects.update_or_create(
                name='ad_code_4',
                defaults={'value': ad_code_4, 'types': 'basic'}
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
            # 更新长代码展示状态
            SysSetting.objects.update_or_create(
                name='long_code',
                defaults={'value': long_code, 'types': 'basic'}
            )
            # 更新关闭更新检测状态
            SysSetting.objects.update_or_create(
                name='disable_update_check',
                defaults={'value': disable_update_check, 'types': 'basic'}
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
    gitee_url = 'https://gitee.com/api/v5/repos/zmister/MrDoc/tags'
    github_url = 'https://api.github.com/repos/zmister2016/MrDoc/tags'
    gitee_resp = requests.get(gitee_url,timeout=5)
    if gitee_resp.status_code == 200:
        return JsonResponse({'status':True,'data':gitee_resp.json()[0]})
    else:
        github_resp = requests.get(github_url,timeout=5)
        if github_resp.status_code == 200:
            return JsonResponse({'status':True,'data':github_resp.json()[0]})
        else:
            return JsonResponse({'status':True,'data':{'name': 'v0.0.1'}})


# 后台管理
@superuser_only
def admin_center(request):
    return render(request,'app_admin/admin_center.html',locals())


# 后台管理菜单
def admin_center_menu(request):
    menu_data = [
        {
            "id": 1,
            "title": _("仪表盘"),
            "type": 1,
            "icon": "layui-icon layui-icon-console",
            "href": reverse('admin_overview'),
        },
        {
            "id": 2,
            "title": _("文集管理"),
            "type": 1,
            "icon": "layui-icon layui-icon-list",
            "href": reverse('project_manage'),
        },
        {
            "id": 3,
            "title": _("文档管理"),
            "type": 1,
            "icon": "layui-icon layui-icon-form",
            "href": reverse('doc_manage'),
        },
        {
            "id": 4,
            "title": _("文档模板管理"),
            "type": 1,
            "icon": "layui-icon layui-icon-templeate-1",
            "href": reverse('doctemp_manage'),
        },
        {
            "id": "my_fodder",
            "title": _("素材管理"),
            "icon": "layui-icon layui-icon-upload-drag",
            "type": 0,
            "href": "",
            "children": [
                {
                    "id": "my_img",
                    "title": _("图片管理"),
                    "icon": "layui-icon layui-icon-face-smile",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse("image_manage")
                },
                {
                    "id": "my_attachment",
                    "title": _("附件管理"),
                    "icon": "layui-icon layui-icon-face-cry",
                    "type": 1,
                    "openType": "_iframe",
                    "href": reverse("attachment_manage")
                },
            ]
        },
        {
            "id": 5,
            "title": _("注册码管理"),
            "type": 1,
            "icon": "layui-icon layui-icon-component",
            "href": reverse('register_code_manage'),
        },
        {
            "id": 6,
            "title": _("用户管理"),
            "type": 1,
            "icon": "layui-icon layui-icon-user",
            "href": reverse('user_manage'),
        },
        {
            "id": 7,
            "title": _("站点设置"),
            "type": 1,
            "icon": "layui-icon layui-icon-set",
            "href": reverse('sys_setting'),
        },
        {
            "id": "download",
            "title": _("客户端下载"),
            "icon": "layui-icon layui-icon-template-1",
            "type": 0,
            "href": "",
            "children": [
                {
                    "id": 702,
                    "title": _("浏览器扩展"),
                    "icon": "layui-icon layui-icon-face-cry",
                    "type": 1,
                    "openType": "_blank",
                    "href": "https://gitee.com/zmister/mrdoc-webclipper"
                },
                {
                    "id": 703,
                    "title": _("桌面客户端"),
                    "icon": "layui-icon layui-icon-face-cry",
                    "type": 1,
                    "openType": "_blank",
                    "href": "https://gitee.com/zmister/mrdoc-desktop-release"
                },
                {
                    "id": 704,
                    "title": _("移动端APP"),
                    "icon": "layui-icon layui-icon-face-cry",
                    "type": 1,
                    "openType": "_blank",
                    "href": "https://gitee.com/zmister/mrdoc-app-release"
                },
            ]
        },
        {
            "id": "common",
            "title": _("使用帮助"),
            "icon": "layui-icon layui-icon-template-1",
            "type": 0,
            "href": "",
            "children": [{
                "id": 701,
                "title": _("部署手册"),
                "icon": "layui-icon layui-icon-face-smile",
                "type": 1,
                "openType": "_blank",
                "href": "https://doc.mrdoc.pro/project/7/"
            }, {
                "id": 702,
                "title": _("使用手册"),
                "icon": "layui-icon layui-icon-face-smile",
                "type": 1,
                "openType": "_blank",
                "href": "https://doc.mrdoc.pro/project/54/"
            }]
        }
    ]
    return JsonResponse(menu_data,safe=False)
