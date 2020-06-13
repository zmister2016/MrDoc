# coding:utf-8
# @文件: views_app.py
# @创建者：州的先生
# #日期：2020/5/11
# 博客地址：zmister.com

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.conf import settings
from rest_framework.views import APIView
from app_api.models import AppUserToken
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from app_doc.models import *
from app_api.serializers_app import *
from app_api.auth_app import AppAuth,AppMustAuth
from app_doc.views import validateTitle
from app_doc.util_upload_img import img_upload,base_img_upload
from loguru import logger
import datetime
import os

'''
响应：
	code：状态码
	data：数据
	
状态码：
	0：成功
	1：资源未找到
	2：无权访问
	3：需要访问码
	4：系统异常
	5：参数不正确
	6：需要登录

'''

# 生成Token的函数
def get_token_code(username):
    """
    根据用户名和时间戳来生成永不相同的token随机字符串
    :param username: 字符串格式的用户名
    :return: 字符串格式的Token
    """

    import time
    import hashlib

    timestamp = str(time.time())
    m = hashlib.md5(username.encode("utf-8"))
    # md5 要传入字节类型的数据
    m.update(timestamp.encode("utf-8"))
    return m.hexdigest()  # 将生成的随机字符串返回


# 登陆视图
class LoginView(APIView):
    '''
    登陆检测试图。
    1，接收用户发过来的用户名和密码数据
    2，校验用户密码是否正确
        - 成功就返回登陆成功,然后发Token
        - 失败就返回错误提示
    '''

    def post(self,request):
        res = {"code":0}
        # 从post 里面取数据
        # print(request.data)
        username = request.data.get("username")
        password = request.data.get("password")
        # 查询用户是否存在、密码是否匹配
        user_obj = authenticate(username=username, password=password)
        if user_obj:
            if user_obj.is_active:
                # 生成Token
                token = get_token_code(username)
                # 保存或更新token
                AppUserToken.objects.update_or_create(defaults={"token": token}, user=user_obj)
                # 将token返回给用户
                res["token"] = token
                res['username'] = username
            else:
                res['code'] = 2
                res["error"] = '账号被禁用'

        else:
            # 登陆失败
            res["code"] = 1
            res["error"] = "用户名或密码错误"
        return Response(res)


# 文集视图
class ProjectView(APIView):
    authentication_classes = (AppAuth,)
    # 获取文集
    def get(self,request):
        pro_id = request.query_params.get('id',None)
        range = request.query_params.get('range',None)
        # 获取自己的文集创建的、协作的文集列表
        if range == 'self':
            colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)]  # 用户的协作文集列表
            project_list = Project.objects.filter(
                Q(create_user=request.user) | \
                Q(id__in=colla_list)
            )
            page = PageNumberPagination()  # 实例化一个分页器
            page_projects = page.paginate_queryset(project_list, request, view=self)  # 进行分页查询
            serializer = ProjectSerializer(page_projects, many=True)  # 对分页后的结果进行序列化处理
            resp = {
                'code': 0,
                'data': serializer.data,
                'count': project_list.count()
            }
            return Response(resp)

        # 存在文集ID，返回指定的文集
        if pro_id:
            resp = dict()
            # 获取文集信息
            project = Project.objects.get(id=int(pro_id))
            # 获取文集的协作用户信息
            # print(request.auth)
            # print(request.user)
            if request.auth:  # 对登陆用户查询其协作文档信息
                colla_user = ProjectCollaborator.objects.filter(project=project, user=request.user).count()
            else:
                colla_user = 0

            # 获取文集前台下载权限
            try:
                allow_download = ProjectReport.objects.get(project=project)
            except:
                allow_download = False

            # 私密文集并且访问者非创建者非协作者
            if (project.role == 1) and (request.user != project.create_user) and (colla_user == 0):
                # return Response({'code': 2, 'data': []})
                resp['code'] = 2
            # 指定用户可见文集
            elif project.role == 2:
                user_list = project.role_value
                if request.auth:  # 认证用户判断是否在许可用户列表中
                    if (request.user.username not in user_list) and \
                            (request.user != project.create_user) and \
                            (colla_user == 0):  # 访问者不在指定用户之中
                        resp['code'] = 2
                else:  # 游客直接返回404
                    resp['code'] = 2
            # 访问码可见
            elif project.role == 3:
                # 浏览用户不为创建者、协作者
                if request.user != project.create_user and colla_user == 0:
                    viewcode = project.role_value
                    viewcode_name = 'viewcode-{}'.format(project.id)
                    r_viewcode = request.data.get(viewcode_name,0)  # 获取访问码
                    if viewcode != r_viewcode:  # 访问码不等于文集访问码，跳转到访问码认证界面
                        # return Response({'code': 3})
                        resp['code'] = 3
            else:
                serializer = ProjectSerializer(project)
                resp = {'code': 0, 'data': serializer.data}
            return Response(resp)
        # 否则，根据查询条件返回文集列表
        else:
            kw = request.query_params.get('kw', '')  # 搜索词
            sort = request.query_params.get('sort', 0)  # 排序,0表示按时间升序排序，1表示按时间降序排序，默认为0
            role = request.query_params.get('role', -1)  # 筛选文集权限，默认为显示所有可显示的文集

            # 是否排序
            if sort in ['', 0, '0']:
                sort_str = ''
            else:
                sort_str = '-'

            # 是否搜索
            if kw == '':
                is_kw = False
            else:
                is_kw = True

            # 是否认证
            if request.auth:
                is_auth = True
            else:
                is_auth = False

            # 是否筛选
            if role in ['', -1, '-1']:
                is_role = False
                role_list = [0, 3]
            else:
                is_role = True

            # 没有搜索 and 认证用户 and 没有筛选
            if (is_kw is False) and (is_auth) and (is_role is False):
                colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)]  # 用户的协作文集列表
                project_list = Project.objects.filter(
                    Q(role__in=role_list) | \
                    Q(role=2, role_value__contains=str(request.user.username)) | \
                    Q(create_user=request.user) | \
                    Q(id__in=colla_list)
                ).order_by("{}create_time".format(sort_str))

            # 没有搜索 and 认证用户 and 有筛选
            elif (is_kw is False) and (is_auth) and (is_role):
                if role in ['0', 0]:
                    project_list = Project.objects.filter(role=0).order_by("{}create_time".format(sort_str))
                elif role in ['1', 1]:
                    project_list = Project.objects.filter(create_user=request.user, role=1).order_by(
                        "{}create_time".format(sort_str))
                elif role in ['2', 2]:
                    project_list = Project.objects.filter(role=2, role_value__contains=str(request.user.username)).order_by(
                        "{}create_time".format(sort_str))
                elif role in ['3', 3]:
                    project_list = Project.objects.filter(role=3).order_by("{}create_time".format(sort_str))
                elif role in ['99', 99]:
                    colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)]  # 用户的协作文集列表
                    project_list = Project.objects.filter(id__in=colla_list).order_by("{}create_time".format(sort_str))
                else:
                    return Response({'code':2,'data':[]})

            # 没有搜索 and 游客 and 没有筛选
            elif (is_kw is False) and (is_auth is False) and (is_role is False):
                project_list = Project.objects.filter(role__in=[0, 3]).order_by("{}create_time".format(sort_str))

            # 没有搜索 and 游客 and 有筛选
            elif (is_kw is False) and (is_auth is False) and (is_role):
                if role in ['0', 0]:
                    project_list = Project.objects.filter(role=0).order_by("{}create_time".format(sort_str))
                elif role in ['3', 3]:
                    project_list = Project.objects.filter(role=3).order_by("{}create_time".format(sort_str))
                else:
                    return Response({'code': 2, 'data': []})

            # 有搜索 and 认证用户 and 没有筛选
            elif (is_kw) and (is_auth) and (is_role is False):
                colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)]  # 用户的协作文集
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
                if role in ['0', 0]:
                    project_list = Project.objects.filter(
                        Q(name__icontains=kw) | Q(intro__icontains=kw),
                        role=0
                    ).order_by("{}create_time".format(sort_str))
                elif role in ['1', 1]:
                    project_list = Project.objects.filter(
                        Q(name__icontains=kw) | Q(intro__icontains=kw),
                        create_user=request.user
                    ).order_by("{}create_time".format(sort_str))
                elif role in ['2', 2]:
                    project_list = Project.objects.filter(
                        Q(name__icontains=kw) | Q(intro__icontains=kw),
                        role=2,
                        role_value__contains=str(request.user.username)
                    ).order_by("{}create_time".format(sort_str))
                elif role in ['3', 3]:
                    project_list = Project.objects.filter(
                        Q(name__icontains=kw) | Q(intro__icontains=kw),
                        role=3
                    ).order_by("{}create_time".format(sort_str))
                elif role in ['99', 99]:
                    colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=request.user)]  # 用户的协作文集列表
                    project_list = Project.objects.filter(
                        Q(name__icontains=kw) | Q(intro__icontains=kw),
                        id__in=colla_list
                    ).order_by("{}create_time".format(sort_str))
                else:
                    return Response({'code':1,'data':[]})

            # 有搜索 and 游客 and 没有筛选
            elif (is_kw) and (is_auth is False) and (is_role is False):
                project_list = Project.objects.filter(
                    Q(name__icontains=kw) | Q(intro__icontains=kw),
                    role__in=[0, 3]
                ).order_by("{}create_time".format(sort_str))

            # 有搜索 and 游客 and 有筛选
            elif (is_kw) and (is_auth is False) and (is_role):
                if role in ['0', 0]:
                    project_list = Project.objects.filter(
                        Q(name__icontains=kw) | Q(intro__icontains=kw),
                        role=0
                    ).order_by("{}create_time".format(sort_str))
                elif role in ['3', 3]:
                    project_list = Project.objects.filter(
                        Q(name__icontains=kw) | Q(intro__icontains=kw),
                        role=3
                    ).order_by("{}create_time".format(sort_str))
                else:
                    return Response({'code':1,'data':[]})

            page = PageNumberPagination() # 实例化一个分页器
            page_projects = page.paginate_queryset(project_list,request,view=self) # 进行分页查询
            serializer = ProjectSerializer(page_projects,many=True) # 对分页后的结果进行序列化处理
            resp = {
                'code':0,
                'data':serializer.data,
                'count':project_list.count()
            }
            return Response(resp)

    # 新增文集
    def post(self,request):
        resp = dict()
        if request.auth:
            try:
                name = request.data.get('pname', '')
                name = validateTitle(name)
                desc = request.data.get('desc', '')
                role = request.data.get('role', 0)
                role_list = ['0', '1', '2', '3', 0, 1, 2, 3]
                if name != '':
                    project = Project.objects.create(
                        name=validateTitle(name),
                        intro=desc[:100],
                        create_user=request.user,
                        role=int(role) if role in role_list else 0
                    )
                    project.save()
                    resp = {'code':0,'data':{'id': project.id, 'name': project.name}}
                    return Response(resp)
                else:
                    resp['code'] = 5
                    resp['data'] = '参数不正确'
                    return Response(resp)
            except Exception as e:
                logger.exception("创建文集出错")
                resp['code'] = 4
                resp['data'] = '系统异常请稍后再试'
                return Response(resp)
        else:
            resp['code'] = 6
            resp['data'] = '请登录后操作'
            return Response(resp)

    # 修改文集
    def put(self,request):
        resp = dict()
        if request.auth:
            try:
                pro_id = request.query_params.get('id', None)
                project = Project.objects.get(id=pro_id)
                # 验证用户有权限修改文集
                if (request.user == project.create_user) or request.user.is_superuser:
                    name = request.data.get('name', None)
                    content = request.data.get('desc', None)
                    role = request.data.get('role',None)
                    role_value = request.data.get('role_value',None)
                    project.name = validateTitle(name)
                    project.intro = content
                    project.role = role
                    project.role_value = role_value
                    project.save()
                    resp['code'] = 0
                    resp['data'] = 'ok'
                    # return Response(resp)
                else:
                    resp['code'] = 2
                    resp['data'] = '非法请求'
                    # return Response(resp)
            except ObjectDoesNotExist:
                resp['code'] = 1
                resp['data'] = '资源未找到'
                # return Response(resp)
            except Exception as e:
                logger.exception("修改文集出错")
                resp['code'] = 4
                # return Response(resp)
        else:
            resp['code'] = 6

        return Response(resp)

    # 删除文集
    def delete(self,request):
        resp = dict()
        if request.auth:
            try:
                pro_id = request.query_params.get('id', '')
                if pro_id != '':
                    pro = Project.objects.get(id=pro_id)
                    if (request.user == pro.create_user) or request.user.is_superuser:
                        # 删除文集下的文档
                        pro_doc_list = Doc.objects.filter(top_doc=int(pro_id))
                        pro_doc_list.delete()
                        # 删除文集
                        pro.delete()
                        resp['code'] = 0
                        resp['data'] = 'ok'
                        # return Response(resp)
                    else:
                        resp['code'] = 2
                        # return Response(resp)
                else:
                    resp['code'] = 5
                    resp['data'] = '参数错误'
                    # return Response(resp)
            except ObjectDoesNotExist:
                resp['code'] = 1
                resp['data'] = '资源未找到'
                # return Response(resp)
            except Exception as e:
                logger.exception("API文集删除异常")
                resp['code'] = 4
                # return Response(resp)
        else:
            resp['code'] = 6

        return Response(resp)


# 文档视图
class DocView(APIView):
    authentication_classes = (AppAuth,)

    # 获取文档
    def get(self,request):
        pro_id = request.query_params.get('pid','')
        doc_id = request.query_params.get('did','')

        if pro_id != '' and doc_id != '':
            # 获取文集信息
            project = Project.objects.get(id=int(pro_id))
            # 获取文集的协作用户信息
            if request.auth:
                colla_user = ProjectCollaborator.objects.filter(project=project, user=request.user)
                if colla_user.exists():
                    colla_user_role = colla_user[0].role
                    colla_user = colla_user.count()
                else:
                    colla_user = colla_user.count()
            else:
                colla_user = 0

            # 私密文集且访问者非创建者、协作者 - 不能访问
            if (project.role == 1) and (request.user != project.create_user) and (colla_user == 0):
                return Response({'code':2})
            # 指定用户可见文集
            elif project.role == 2:
                user_list = project.role_value
                if request.user.is_authenticated:  # 认证用户判断是否在许可用户列表中
                    if (request.user.username not in user_list) and \
                            (request.user != project.create_user) and \
                            (colla_user == 0):  # 访问者不在指定用户之中，也不是协作者
                        return Response({'code': 2})
                else:  # 游客直接返回404
                    return Response({'code': 2})
            # 访问码可见
            elif project.role == 3:
                # 浏览用户不为创建者和协作者 - 需要访问码
                if (request.user != project.create_user) and (colla_user == 0):
                    viewcode = project.role_value
                    viewcode_name = 'viewcode-{}'.format(project.id)
                    r_viewcode = request.data.get(viewcode_name,0)  # 获取访问码
                    if viewcode != r_viewcode:  # cookie中的访问码不等于文集访问码，跳转到访问码认证界面
                        return Response({'code':3})

            # 获取文档内容
            try:
                doc = Doc.objects.get(id=int(doc_id), status=1)
                serializer = DocSerializer(doc)
                resp = {'code':0,'data':serializer.data}
                return Response(resp)
            except ObjectDoesNotExist:
                return Response({'code':4})
        else:
            return Response({'code':4})

    # 新建文档
    def post(self, request):
        try:
            project = request.data.get('project','')
            parent_doc = request.data.get('parent_doc','')
            doc_name = request.data.get('doc_name','')
            doc_content = request.data.get('content','')
            pre_content = request.data.get('pre_content','')
            sort = request.data.get('sort','')
            status = request.data.get('status',1)
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
                    return Response({'code':0,'data':{'pro':project,'doc':doc.id}})
                else:
                    return Response({'code':2,'data':'无权操作此文集'})
            else:
                return Response({'code':5,'data':'请确认文档标题、文集正确'})
        except Exception as e:
            logger.exception("api新建文档异常")
            return Response({'status':4,'data':'请求出错'})

    # 修改文档
    def put(self, request):
        try:
            doc_id = request.data.get('doc_id','') # 文档ID
            project = request.data.get('project', '') # 文集ID
            parent_doc = request.data.get('parent_doc', '') # 上级文档ID
            doc_name = request.data.get('doc_name', '') # 文档名称
            doc_content = request.data.get('content', '') # 文档内容
            pre_content = request.data.get('pre_content', '') # 文档Markdown格式内容
            sort = request.data.get('sort', '') # 文档排序
            status = request.data.get('status',1) # 文档状态

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
                    return Response({'code': 0,'data':'修改成功'})
                else:
                    return Response({'code':2,'data':'未授权请求'})
            else:
                return Response({'code': 5,'data':'参数错误'})
        except Exception as e:
            logger.exception("api修改文档出错")
            return Response({'code':4,'data':'请求出错'})

    # 删除文档
    def delete(self, request):
        try:
            # 获取文档ID
            doc_id = request.data.get('doc_id', None)
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
                    return Response({'code': 1, 'data': '文档不存在'})
                if (request.user == doc.create_user) or (colla_user_role == 1) or (request.user == project.create_user):
                    # 修改状态为删除
                    doc.status = 3
                    doc.modify_time = datetime.datetime.now()
                    doc.save()
                    # 修改其下级所有文档状态为删除
                    chr_doc = Doc.objects.filter(parent_doc=doc_id)  # 获取下级文档
                    chr_doc_ids = chr_doc.values_list('id', flat=True)  # 提取下级文档的ID
                    chr_doc.update(status=3, modify_time=datetime.datetime.now())  # 修改下级文档的状态为删除
                    Doc.objects.filter(parent_doc__in=chr_doc_ids).update(status=3,
                                                                          modify_time=datetime.datetime.now())  # 修改下级文档的下级文档状态

                    return Response({'code': 0, 'data': '删除完成'})
                else:
                    return Response({'code': 2, 'data': '非法请求'})
            else:
                return Response({'code': 5, 'data': '参数错误'})
        except Exception as e:
            logger.exception("api删除文档出错")
            return Response({'code': 4, 'data': '请求出错'})


# 文档模板视图
class DocTempView(APIView):
    authentication_classes = (AppAuth,)

    # 获取文档模板
    def get(self, request):
        if request.auth:
            temp_id = request.query_params.get('id','')
            if temp_id != '':
                doctemp = DocTemp.objects.get(id=int(temp_id))
                if request.user == doctemp.create_user:
                    serializer = DocTempSerializer(doctemp)
                    resp = {'code': 0, 'data': serializer.data}
                else:
                    resp = {'code':2,'data':'无权操作'}
            else:
                doctemps = DocTemp.objects.filter(create_user=request.user)
                page = PageNumberPagination()
                page_doctemps = page.paginate_queryset(doctemps,request,view=self)
                serializer = DocTempSerializer(page_doctemps,many=True)
                resp = {'code':0,'data':serializer.data,'count':doctemps.count()}
            return Response(resp)
        else:
            return Response({'code': 6, 'data': '请登录'})

    def post(self, request):
        try:
            if request.auth:
                name = request.data.get('name','')
                content = request.data.get('content','')
                if name != '':
                    doctemp = DocTemp.objects.create(
                        name = name,
                        content = content,
                        create_user=request.user
                    )
                    doctemp.save()
                    return Response({'code':0,'data':'创建成功'})
                else:
                    return Response({'code':5,'data':'模板标题不能为空'})
            else:
                return Response({'code':6,'data':'请登录'})
        except Exception as e:
            logger.exception("api创建文档模板出错")
            return Response({'code':4,'data':'请求出错'})

    def put(self, request):
        try:
            doctemp_id = request.data.get('doctemp_id','')
            name = request.data.get('name','')
            content = request.data.get('content','')
            if doctemp_id != '' and name !='':
                doctemp = DocTemp.objects.get(id=doctemp_id)
                # 验证请求用户为文档模板的创建者
                if request.user == doctemp.create_user:
                    doctemp.name = name
                    doctemp.content = content
                    doctemp.save()
                    return Response({'code':0,'data':'修改成功'})
                else:
                    return Response({'code':2,'data':'非法操作'})
            else:
                return Response({'code':5,'data':'参数错误'})
        except Exception as e:
            logger.exception("api修改文档模板出错")
            return Response({'code':4,'data':'请求出错'})

    def delete(self, request):
        try:
            doctemp_id = request.data.get('doctemp_id', '')
            if doctemp_id != '':
                doctemp = DocTemp.objects.get(id=doctemp_id)
                if request.user == doctemp.create_user:
                    doctemp.delete()
                    return Response({'code': 0, 'data': '删除完成'})
                else:
                    return Response({'code': 2, 'data': '非法请求'})
            else:
                return Response({'code': 5, 'data': '参数错误'})
        except Exception as e:
            logger.exception("api删除文档模板出错")
            return Response({'code': 4, 'data': '请求出错'})


# 图片视图
class ImageView(APIView):
    authentication_classes = (AppAuth,)

    def get(self, request):
        if request.auth:
            g_id = int(request.query_params.get('group', 0))  # 图片分组id
            if int(g_id) == 0:
                image_list = Image.objects.filter(user=request.user)  # 查询所有图片
            elif int(g_id) == -1:
                image_list = Image.objects.filter(user=request.user, group_id=None)  # 查询指定分组的图片
            else:
                image_list = Image.objects.filter(user=request.user, group_id=g_id)  # 查询指定分组的图片
            page = PageNumberPagination()
            page_images = page.paginate_queryset(image_list,request,view=self)
            serializer = ImageSerializer(page_images,many=True)
            resp = {'code':0,'data':serializer.data,'count':image_list.count()}
            return Response(resp)
        else:
            return Response({'code': 6, 'data': '请登录'})

    # 上传
    def post(self, request):
        img = request.data.get("api_img_upload", None)  # 编辑器上传
        # manage_upload = request.data.get('manage_upload', None)  # 图片管理上传
        dir_name = request.data.get('dirname', '')
        base_img = request.data.get('base', None)
        if img:  # 上传普通图片文件
            result = img_upload(img, dir_name, request.user)
            resp = {'code':0,'data':result['url']}
        # elif manage_upload:
        #     result = img_upload(manage_upload, dir_name, request.user)
        #     resp = {'code': 0, 'data': result['url']}
        elif base_img:  # 上传base64编码图片
            result = base_img_upload(base_img, dir_name, request.user)
            resp = {'code': 0, 'data': result['url']}
        else:
            resp = {"code": 5, "message": "出错信息"}
        return Response(resp)

    # 删除
    def delete(self, request):
        img_id = request.data.get('id', '')
        img = Image.objects.get(id=img_id)
        if img.user != request.user:
            return Response({'code': 2, 'data': '未授权请求'})
        file_path = settings.BASE_DIR + img.file_path
        is_exist = os.path.exists(file_path)
        if is_exist:
            os.remove(file_path) # 删除本地文件
        img.delete()  # 删除记录
        return Response({'code': 0, 'data': 'ok'})


# 图片分组视图
class ImageGroupView(APIView):
    authentication_classes = (AppMustAuth,)

    def get(self, request):
        try:
            group_list = []
            all_cnt = Image.objects.filter(user=request.user).count()
            non_group_cnt = Image.objects.filter(group_id=None,user=request.user).count()
            group_list.append({'group_name': '全部图片', 'group_cnt': all_cnt, 'group_id': 0})
            group_list.append({'group_name': '未分组', 'group_cnt': non_group_cnt, 'group_id': -1})
            groups = ImageGroup.objects.filter(user=request.user)  # 查询所有分组
            for group in groups:
                group_cnt = Image.objects.filter(group_id=group).count()
                item = {
                    'group_id': group.id,
                    'group_name': group.group_name,
                    'group_cnt': group_cnt
                }
                group_list.append(item)
            return Response({'code': 0, 'data': group_list})
        except:
            return Response({'code': 4, 'data': '出现错误'})

    def post(self, request):
        group_name = request.data.get('group_name', '')
        if group_name not in ['', '默认分组', '未分组']:
            ImageGroup.objects.create(
                user=request.user,
                group_name=group_name
            )
            return Response({'code': 0, 'data': 'ok'})
        else:
            return Response({'code': 5, 'data': '名称无效'})

    def put(self, request):
        group_name = request.data.get("group_name", '')
        if group_name not in ['', '默认分组', '未分组']:
            group_id = request.POST.get('group_id', '')
            ImageGroup.objects.filter(id=group_id,user=request.user).update(group_name=group_name)
            return Response({'code': 0, 'data': 'ok'})
        else:
            return Response({'code': 5, 'data': '名称无效'})

    def delete(self, request):
        try:
            group_id = request.data.get('group_id', '')
            group = ImageGroup.objects.get(id=group_id, user=request.user)  # 查询分组
            images = Image.objects.filter(group_id=group_id).update(group_id=None)  # 移动图片到未分组
            group.delete()  # 删除分组
            return Response({'code': 0, 'data': 'ok'})
        except:
            return Response({'code': 4, 'data': '删除错误'})


# 附件视图
class AttachmentView(APIView):
    authentication_classes = (AppAuth,)

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
                r = '{}{}'.format(round(size, precision), i)
                return r

    def get(self, request):
        attachment_list = []
        attachments = Attachment.objects.filter(user=request.user)
        for a in attachments:
            item = {
                'filename': a.file_name,
                'filesize': a.file_size,
                'filepath': a.file_path.name,
                'filetime': a.create_time
            }
            attachment_list.append(item)
        return Response({'code': 0, 'data': attachment_list})

    def post(self, request):
        attachment = request.data.get('attachment_upload', None)
        if attachment:
            attachment_name = attachment.name
            attachment_size = self.sizeFormat(attachment.size)
            # 限制附件大小在50mb以内
            if attachment.size > 52428800:
                return Response({'code': False, 'data': '文件大小超出限制'})
            # 限制附件为ZIP格式文件
            if attachment_name.endswith('.zip'):
                a = Attachment.objects.create(
                    file_name=attachment_name,
                    file_size=attachment_size,
                    file_path=attachment,
                    user=request.user
                )
                return Response({'code': 0, 'data': {'name': attachment_name, 'url': a.file_path.name}})
            else:
                return Response({'code': 5, 'data': '不支持的格式'})
        else:
            return Response({'code': 5, 'data': '无效文件'})

    def delete(self, request):
        attach_id = request.data.get('attach_id', '')
        attachment = Attachment.objects.filter(id=attach_id, user=request.user)  # 查询附件
        for a in attachment:  # 遍历附件
            a.file_path.delete()  # 删除文件
        attachment.delete()  # 删除数据库记录
        return Response({'code': 0, 'data': 'ok'})