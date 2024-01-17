from django.shortcuts import render
from django.http.response import JsonResponse,HttpResponse
from django.views.decorators.csrf import csrf_exempt # CSRF装饰器
from django.views.decorators.http import require_http_methods,require_safe,require_GET
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from django.core.exceptions import PermissionDenied,ObjectDoesNotExist
from django.conf import settings
from django.contrib.auth import authenticate,login,logout # 认证相关方法
from django.contrib.auth.models import User # Django默认用户模型
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage,InvalidPage # 后端分页
from django.shortcuts import render,redirect
from django.utils.translation import gettext_lazy as _
from app_doc.util_upload_img import upload_generation_dir,base_img_upload,url_img_upload,img_upload
from app_doc.utils import find_doc_next,find_doc_previous
from app_api.models import UserToken
from app_doc.models import Project,Doc,DocHistory,Image
from app_api.utils import read_add_projects,remove_doc_tag
from loguru import logger
import time,hashlib
import traceback,json
import datetime

# MrDoc 基于用户的Token访问API模块

# 用户通过该url获取服务器时间戳，便于接口访问
# url范例：http://127.0.0.1:8000/api/get_timestamp/
def get_timestamp(request):
    now_time = str(int(time.time()))
    return JsonResponse({'status':True,'data':now_time})

def oauth0(request):
    # url范例：http://127.0.0.1:8000/api/oauth0/?username=huyang&timestamp=1608797025&randstr=123adsfadf&hashstr=c171ce95ef3789d922cb6663c678c255&redirecturl=http%3A%2F%2F127.0.0.1%3A8000%2Fproject-1%2Fdoc-10%2F
    if request.method == 'GET':
        try:
            username = request.GET.get("username","")
            timestamp = request.GET.get("timestamp","")
            randstr = request.GET.get("randstr","")
            hashstr = request.GET.get("hashstr","")
            redirecturl = request.GET.get("redirecturl","/") 
            if redirecturl == "" :
                # 必须用判断的方式，否则url里提交redirecturl= 还是为空
                redirecturl =  "/"                
            if "" not in [username,timestamp,randstr,hashstr] :
                # 都不为空，才验证哦
                # 1 、验证timestamp的时效性
                nowtime = int (time.time())
                # 时间戳失效时间，默认为3600，可以改短，如30，严格点5秒，如果使用5秒，请求前，需要通过get_timestamp获取服务器时间戳，否则因为和服务器时间差导致无法验证通过
                if (nowtime - int(timestamp)) > 3600 :                    
                    raise ValueError(_('链接已失效，请从合法路径访问，或联系管理员！'))
                # 2、获取userid的Token
                user = User.objects.get(username=username)                                
                if user is None:
                    raise ValueError(_('请求用户出错！'))
                ID = user.id
                State = user.is_active
                if State == 1 and ID is not None:
                    usertoken = UserToken.objects.get(user_id=ID)
                    token = usertoken.token
                else:
                    raise ValueError(_('非法用户！'))
            
                # 3、 验证hash的正确性
                final_str  =  str(randstr) + str(timestamp) + str(username) + token
                md5 = hashlib.md5(final_str.encode("utf-8")).hexdigest()        # 不支持中文
                if md5 == hashstr:
                    # 用户验证成功                   
                    login(request,user)
                    from urllib.parse import unquote
                    newurl = unquote(redirecturl)
                    return redirect(newurl)
                else:                    
                    raise ValueError(_('验证失败,可能是用户名或Token不正确!详情请联系管理员！'))
            else:
                raise ValueError(_('关键字验证失败，请联系管理员！部分关键字为空'))
        except ValueError as e:
            errormsg = e
            return render(request, 'app_api/api404.html', locals())
        except :
            errormsg = _("API接口运行出错！")
            return render(request, 'app_api/api404.html', locals())
    else:
        return JsonResponse({'status':False,'data':'Nothing Here'}) 


# Token管理页面
@require_http_methods(['POST','GET'])
@login_required()
def manage_token(request):
    if request.method == 'GET':
        try:
            token = UserToken.objects.get(user=request.user).token # 查询用户Token
        except ObjectDoesNotExist:
            token = _('你还没有生成过Token！')
        except:
            if settings.DEBUG:
                logger.exception(_("Token管理页面异常"))
        return render(request,'app_api/manage_token.html',locals())
    elif request.method == 'POST':
        try:
            user = request.user
            now_time =str(time.time())
            string = 'user_{}_time_{}'.format(user,now_time).encode('utf-8')
            token_str = hashlib.sha224(string).hexdigest()
            user_token = UserToken.objects.filter(user=user)
            if user_token.exists():
                UserToken.objects.get(user=user).delete()
            UserToken.objects.create(
                user=user,
                token=token_str
            )
            return JsonResponse({'status':True,'data':token_str})
        except:
            logger.exception(_("用户Token生成异常"))
            return JsonResponse({'status':False,'data':_('生成出错，请重试！')})


# 检查用户Token
def check_token(request):
    token = request.GET.get('token', '')
    try:
        token = UserToken.objects.get(token=token)
        data = {
            'is_writer':True,
        }
        return JsonResponse({'status':True,'data':data})
    except:
        return JsonResponse({'status':False})

# 获取文集
@require_GET
def get_projects(request):
    token = request.GET.get('token','')
    sort = request.GET.get('sort',0)
    if sort == '1':
        sort = '-'
    else:
        sort = ''
    try:
        token = UserToken.objects.get(token=token)
        projects = Project.objects.filter(create_user=token.user).order_by('{}create_time'.format(sort)) # 查询文集
        project_list =  []
        for project in projects:
            item = {
                'id':project.id, # 文集ID
                'name':project.name, # 文集名称
                'icon': project.icon,  # 文集图标
                'type':project.role, # 文集状态
                'total': Doc.objects.filter(top_doc=project.id, status=1).count(),
                'create_time': project.create_time
            }
            project_list.append(item)
        return JsonResponse({'status':True,'data':project_list})
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':_('token无效')})
    except:
        logger.exception(_("token获取文集异常"))
        return JsonResponse({'status':False,'data':_('系统异常')})


# 获取文集下的文档列表
def get_docs(request):
    token = request.GET.get('token', '')
    sort = request.GET.get('sort',0)
    if sort == '1':
        sort = '-'
    else:
        sort = ''
    try:
        token = UserToken.objects.get(token=token)
        pid = request.GET.get('pid','')
        docs = Doc.objects.filter(create_user=token.user,top_doc=pid,status=1).order_by('{}create_time'.format(sort))  # 查询文集下的文档
        doc_list = []
        for doc in docs:
            item = {
                'id': doc.id,  # 文档ID
                'name': doc.name,  # 文档名称
                'parent_doc':doc.parent_doc, # 上级文档
                'top_doc':doc.top_doc, # 所属文集
                'status':doc.status, # 文档状态
                'create_time': doc.create_time,  # 文档创建时间
                'modify_time': doc.modify_time,  # 文档的修改时间
                'create_user': doc.create_user.username,  # 文档的创建者
                'editor_mode': doc.editor_mode,  # 文档类型
            }
            doc_list.append(item)
        return JsonResponse({'status': True, 'data': doc_list})
    except ObjectDoesNotExist:
        return JsonResponse({'status': False, 'data': _('token无效')})
    except:
        logger.exception(_("token获取文集异常"))
        return JsonResponse({'status': False, 'data': _('系统异常')})


# 获取文集的文档层级列表
def get_level_docs(request):
    token = request.GET.get('token', '')
    try:
        token = UserToken.objects.get(token=token)
        pid = request.GET.get('pid', '')

        # 用户有浏览和新增权限的文集列表
        view_list = read_add_projects(token.user)
        if int(pid) not in view_list:
            return JsonResponse({'status': False, 'data': _('无文集权限')})

        # 查询存在上级文档的文档
        parent_id_list = Doc.objects.filter(top_doc=pid,status=1).exclude(parent_doc=0).values_list('parent_doc',flat=True)
        # 获取存在上级文档的上级文档ID
        # print(parent_id_list)
        doc_list = []
        doc_cnt = 0
        # 获取一级文档
        top_docs = Doc.objects.filter(top_doc=pid,parent_doc=0,status=1).values('id','name','editor_mode','parent_doc').order_by('sort')
        # 遍历一级文档
        for doc in top_docs:
            top_item = {
                'id':doc['id'],
                'name':doc['name'],
                'editor_mode':doc['editor_mode'],
                'parent_doc':doc['parent_doc'],
                'top_doc':pid,
                'sub':[]
            }
            doc_cnt += 1
            # 如果一级文档存在下级文档，查询其二级文档
            if doc['id'] in parent_id_list:
                # 获取二级文档
                sec_docs = Doc.objects.filter(top_doc=pid,parent_doc=doc['id'],status=1).values('id','name','editor_mode','parent_doc').order_by('sort')
                for doc in sec_docs:
                    sec_item = {
                        'id': doc['id'],
                        'name': doc['name'],
                        'editor_mode':doc['editor_mode'],
                        'parent_doc': doc['parent_doc'],
                        'top_doc':pid,
                        'sub': []
                    }
                    doc_cnt += 1
                    # 如果二级文档存在下级文档，查询第三级文档
                    if doc['id'] in parent_id_list:
                        # 获取三级文档
                        thr_docs = Doc.objects.filter(top_doc=pid,parent_doc=doc['id'],status=1).values('id','name','editor_mode','parent_doc').order_by('sort')
                        for doc in thr_docs:
                            item = {
                                'id': doc['id'],
                                'name': doc['name'],
                                'editor_mode': doc['editor_mode'],
                                'parent_doc': doc['parent_doc'],
                                'top_doc':pid,
                                'sub': []
                            }
                            doc_cnt += 1
                            sec_item['sub'].append(item)
                        top_item['sub'].append(sec_item)
                    else:
                        top_item['sub'].append(sec_item)
                doc_list.append(top_item)
            # 如果一级文档没有下级文档，直接保存
            else:
                doc_list.append(top_item)

        return JsonResponse({'status': True, 'data': doc_list,'total':doc_cnt})
    except ObjectDoesNotExist:
        return JsonResponse({'status': False, 'data': _('token无效')})
    except:
        logger.exception(_("token获取文集异常"))
        return JsonResponse({'status': False, 'data': _('系统异常')})

# 获取个人所有文档列表
def get_self_docs(request):
    token = request.GET.get('token', '')
    sort = request.GET.get('sort',0)
    kw = request.GET.get('kw','')
    if sort == '1':
        sort = '-'
    else:
        sort = ''
    try:
        token = UserToken.objects.get(token=token)
        # 按文档修改时间进行排序
        if kw == '':
            docs = Doc.objects.filter(create_user=token.user,status=1).order_by('{}modify_time'.format(sort))
        else:
            # kw_list = jieba.cut(kw, cut_all=True)
            # reduce(operator.or_,(Q(name__icontains=x) for x in kw_list))
            docs = Doc.objects.filter(create_user=token.user,status=1,name__icontains=kw).order_by('{}modify_time'.format(sort))

        # 分页处理
        paginator = Paginator(docs, 10)
        page = request.GET.get('page', 1)
        try:
            docs_page = paginator.page(page)
        except PageNotAnInteger:
            docs_page = paginator.page(1)
        except EmptyPage:
            # docs_page = paginator.page(paginator.num_pages)
            return JsonResponse({'status': True, 'data': []})

        doc_list = []
        for doc in docs_page:
            project = Project.objects.get(id=doc.top_doc)
            item = {
                'id': doc.id,  # 文档ID
                'name': doc.name,  # 文档名称
                'summary': remove_doc_tag(doc),
                'parent_doc':doc.parent_doc, # 上级文档
                'top_doc':doc.top_doc, # 所属文集
                'project_name':project.name,
                'project_role':project.role,
                'project_icon':project.icon,
                'editor_mode':doc.editor_mode,
                'status':doc.status, # 文档状态
                'create_time': doc.create_time,  # 文档创建时间
                'modify_time': doc.modify_time,  # 文档的修改时间
                'create_user': doc.create_user.username  # 文档的创建者
            }
            doc_list.append(item)
        return JsonResponse({'status': True, 'data': doc_list})
    except ObjectDoesNotExist:
        return JsonResponse({'status': False, 'data': _('token无效')})
    except:
        logger.exception("token获取文档列表异常")
        return JsonResponse({'status': False, 'data': _('系统异常')})



# 获取单篇文档
def get_doc(request):
    token = request.GET.get('token', '')
    try:
        token = UserToken.objects.get(token=token)
        did = request.GET.get('did', '')
        doc = Doc.objects.get(create_user=token.user, id=did)  # 查询文集下的文档

        item = {
            'id': doc.id,  # 文档ID
            'name': doc.name,  # 文档名称
            "content": doc.content,  # 文档内容
            'md_content':doc.pre_content, # 文档内容
            'parent_doc':doc.parent_doc, # 上级文档
            'top_doc':doc.top_doc, # 所属文集
            'status':doc.status, # 文档状态
            "editor_mode": doc.editor_mode,  # 文档编辑模式
            'create_time': doc.create_time,  # 文档创建时间
            'modify_time': doc.modify_time,  # 文档的修改时间
            'create_user': doc.create_user.username  # 文档的创建者
        }
        return JsonResponse({'status': True, 'data': item})
    except ObjectDoesNotExist:
        return JsonResponse({'status': False, 'data': _('token无效')})
    except:
        logger.exception("token获取文集异常")
        return JsonResponse({'status': False, 'data': _('系统异常')})


# 获取文档上下篇文档
def get_doc_previous_next(request):
    token = request.GET.get('token', '')
    try:
        token = UserToken.objects.get(token=token)
        did = request.GET.get('did', '')
        doc = Doc.objects.get(id=did)  # 查询文档
        project = Project.objects.get(id=doc.top_doc)  # 查询文档所属的文集
        # 用户有浏览和新增权限的文集列表
        view_list = read_add_projects(token.user)

        if project.id not in view_list:
            return JsonResponse({'status': False, 'data': _('无权限')})

        try:
            previous_doc = find_doc_previous(did)
            previous_doc_id = previous_doc.id
        except Exception as e:
            logger.error("获取上一篇文档异常")
            previous_doc_id = None
        try:
            next_doc = find_doc_next(did)
            next_doc_id = next_doc.id
        except Exception as e:
            logger.error("获取下一篇文档异常")
            next_doc_id = None
        return JsonResponse({'status': True, 'data': {'next':next_doc_id,'previous':previous_doc_id}})
    except Exception as e:
        logger.exception("获取文档上下篇文档异常")
        return JsonResponse({'status':False,'data':'系统异常'})



# 新建文集
@require_http_methods(['GET','POST'])
@csrf_exempt
def create_project(request):
    token = request.GET.get('token', '')
    content_type = request.headers.get('Content-Type', '').lower()
    if 'json' in content_type:
        try:
            json_data = json.loads(request.body.decode('utf-8'))
            project_name = json_data.get('name', '')
            project_desc = json_data.get('desc', '')
            project_role = json_data.get('role', 1)
        except json.JSONDecodeError:
            return JsonResponse({'data': 'Invalid JSON data', 'status': False})
    else:
        project_name = request.POST.get('name', '')
        project_desc = request.POST.get('desc', '')
        project_role = request.POST.get('role', 1)
    if project_name == '':
        return JsonResponse({'status': False, 'data': _('文集名称不能为空！')})
    try:
        # 验证Token
        token = UserToken.objects.get(token=token)
        p = Project.objects.create(
            name = project_name, # 文集名称
            intro = project_desc, # 文集简介
            role = project_role, # 文集权限
            create_user = token.user # 创建的用户
        )
        return JsonResponse({'status': True, 'data': p.id})
    except ObjectDoesNotExist:
        return JsonResponse({'status': False, 'data': _('token无效')})
    except:
        logger.exception(_("token创建文集异常"))
        return JsonResponse({'status':False,'data':_('系统异常')})


# 新建文档
@require_http_methods(['GET','POST'])
@csrf_exempt
def create_doc(request):
    token = request.GET.get('token', '')
    content_type = request.headers.get('Content-Type', '').lower()
    if 'json' in content_type:
        try:
            json_data = json.loads(request.body.decode('utf-8'))
            project_id = json_data.get('pid', '')
            doc_title = json_data.get('title', '')
            doc_content = json_data.get('doc', '')
            parent_doc = json_data.get('parent_doc', 0)
            editor_mode = json_data.get('editor_mode', 1)
        except json.JSONDecodeError:
            return JsonResponse({'data': 'Invalid JSON data', 'status': False})
    else:
        project_id = request.POST.get('pid', '')
        doc_title = request.POST.get('title', '')
        doc_content = request.POST.get('doc', '')
        editor_mode = request.POST.get('editor_mode', 1)
        parent_doc = request.POST.get('parent_doc', 0)
    try:
        # 验证Token
        token = UserToken.objects.get(token=token)
        # 文集是否属于用户
        is_project = Project.objects.filter(create_user=token.user,id=project_id)
        # 新建文档
        if is_project.exists():
            if int(editor_mode) == 1 or int(editor_mode) == 2:
                doc = Doc.objects.create(
                    name=doc_title,  # 文档内容
                    pre_content=doc_content,  # 文档的编辑内容，意即编辑框输入的内容
                    top_doc=project_id,  # 所属文集
                    editor_mode=editor_mode,  # 编辑器模式
                    parent_doc=parent_doc,  # 上级文档
                    create_user=token.user  # 创建的用户
                )
            elif int(editor_mode) == 3:
                doc = Doc.objects.create(
                    name=doc_title,  # 文档内容
                    content=doc_content,  # 文档的编辑内容，意即编辑框输入的内容
                    top_doc=project_id,  # 所属文集
                    editor_mode=editor_mode,  # 编辑器模式
                    parent_doc=parent_doc,  # 上级文档
                    create_user=token.user  # 创建的用户
                )
            return JsonResponse({'status': True, 'data': doc.id})
        else:
            return JsonResponse({'status':False,'data':_('非法请求')})
    except ObjectDoesNotExist:
        return JsonResponse({'status': False, 'data': _('token无效')})
    except:
        logger.exception(_("token创建文档异常"))
        return JsonResponse({'status':False,'data':_('系统异常')})

# 更新修改文档
@require_http_methods(['GET','POST'])
@csrf_exempt
def modify_doc(request):
    token = request.GET.get('token', '')
    content_type = request.headers.get('Content-Type', '').lower()
    if 'json' in content_type:
        try:
            json_data = json.loads(request.body.decode('utf-8'))
            project_id = json_data.get('pid', '')
            doc_id = json_data.get('did', '')
            doc_title = json_data.get('title', '')
            doc_content = json_data.get('doc', '')
            parent_doc = json_data.get('parent_doc', '')
        except json.JSONDecodeError:
            return JsonResponse({'data': 'Invalid JSON data', 'status': False})
    else:
        project_id = request.POST.get('pid', '')
        doc_id = request.POST.get('did', '')
        doc_title = request.POST.get('title', '')
        doc_content = request.POST.get('doc', '')
        parent_doc = request.POST.get('parent_doc', '')
    try:
        # 验证Token
        token = UserToken.objects.get(token=token)
        # 文集是否属于用户
        is_project = Project.objects.filter(create_user=token.user,id=project_id)
        # 修改现有文档
        if is_project.exists():
            # 将现有文档内容写入到文档历史中
            doc = Doc.objects.get(id=doc_id,top_doc=project_id)
            parent_id = doc.parent_doc if parent_doc == '' else parent_doc
            DocHistory.objects.create(
                doc=doc,
                pre_content=doc.pre_content,
                create_user=token.user
            )
            # 更新修改现有文档
            if doc.editor_mode == 1 or doc.editor_mode == 2: # markdown文档
                Doc.objects.filter(id=int(doc_id),top_doc=project_id).update(
                    name=doc_title,
                    pre_content=doc_content,
                    parent_doc=parent_id,
                    modify_time=datetime.datetime.now(),
                )
            elif doc.editor_mode == 3: # 富文本文档
                Doc.objects.filter(id=int(doc_id),top_doc=project_id).update(
                    name=doc_title,
                    content=doc_content,
                    parent_doc=parent_id,
                    modify_time=datetime.datetime.now(),
                )
            elif doc.editor_mode == 4: # 在线表格
                pass
            return JsonResponse({'status': True, 'data': 'ok'})
        else:
            return JsonResponse({'status':False,'data':'非法请求'})
    except ObjectDoesNotExist:
        return JsonResponse({'status': False, 'data': 'token无效'})
    except:
        logger.exception("token修改文档异常")
        return JsonResponse({'status':False,'data':'系统异常'})
    
# 上传图片
@csrf_exempt
@require_http_methods(['GET','POST'])
def upload_img(request):
    ##################
    # {"success": 0, "message": "出错信息"}
    # {"success": 1, "url": "图片地址"}
    ##################
    token = request.GET.get('token', '')
    content_type = request.headers.get('Content-Type', '').lower()
    if 'json' in content_type:
        try:
            json_data = json.loads(request.body.decode('utf-8'))
            base64_img = json_data.get('base64', None)
            commom_img = json_data.get('image', None)
        except json.JSONDecodeError:
            return JsonResponse({'data': 'Invalid JSON data', 'status': False})
    else:
        base64_img = request.POST.get('data', None)
        commom_img = request.FILES.get('image', None)  # 普通图片上传
    try:
        # 验证Token
        token = UserToken.objects.get(token=token)
        # 上传图片
        if base64_img:
            result = base_img_upload(base64_img, '', token.user)
        elif commom_img:
            result = img_upload(commom_img, '', token.user)
        else:
            return JsonResponse({'status': False, 'data': _('无有效图片')})
        return JsonResponse(result)
        # return HttpResponse(json.dumps(result), content_type="application/json")
    except ObjectDoesNotExist:
        return JsonResponse({'success': 0, 'data': _('token无效')})
    except:
        logger.exception(_("token上传图片异常"))
        return JsonResponse({'success':0,'data':_('上传出错')})

# 上传URL图片
@csrf_exempt
@require_http_methods(['GET','POST'])
def upload_img_url(request):
    token = request.GET.get('token', '')
    url_img = request.POST.get('url','')
    try:
        # 验证Token
        token = UserToken.objects.get(token=token)
        if token.user:
            # 上传图片
            if url_img.startswith("data:image"):  # 以URL形式上传的BASE64编码图片
                result = base_img_upload(url_img, '', token.user)
            else:
                result = url_img_upload(url_img, '', token.user)
            return JsonResponse(result)
        else:
            return JsonResponse({'status': False, 'data': _('用户无权限操作')})
    except ObjectDoesNotExist:
        return JsonResponse({'success': 0, 'data': _('token无效')})
    except:
        logger.error(_("token上传url图片异常"))
        return JsonResponse({'success':0,'data':_('上传出错')})

# 删除文档（软删除）
@csrf_exempt
@require_http_methods(['GET','POST'])
def delete_doc(request):
    token = request.GET.get('token', '')
    doc_id = request.POST.get('did', '')
    try:
        # 验证Token
        token = UserToken.objects.get(token=token)
        doc = Doc.objects.get(id=doc_id)

        # 验证权限
        if doc.create_user == token.user:
            Doc.objects.filter(id=int(doc_id)).update(
                status=3,
                modify_time=datetime.datetime.now(),
            )
            return JsonResponse({'status': True, 'data': 'ok'})
        else:
            return JsonResponse({'status':False,'data':'非法请求'})
    except ObjectDoesNotExist:
        return JsonResponse({'status': False, 'data': 'token无效'})
    except:
        logger.exception("token修改文档异常")
        return JsonResponse({'status':False,'data':'系统异常'})