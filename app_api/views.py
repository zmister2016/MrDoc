from django.shortcuts import render
from django.http.response import JsonResponse,HttpResponse
from django.views.decorators.csrf import csrf_exempt # CSRF装饰器
from django.views.decorators.http import require_http_methods,require_safe,require_GET
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from django.core.exceptions import PermissionDenied,ObjectDoesNotExist
from app_api.models import UserToken
from app_doc.models import Project,Doc,Image
import time,hashlib
import traceback,json
from django.conf import settings
from app_doc.util_upload_img import upload_generation_dir,base_img_upload
from loguru import logger

# MrDoc 基于用户的Token访问API模块

# Token管理页面
@require_http_methods(['POST','GET'])
@login_required()
def manage_token(request):
    if request.method == 'GET':
        try:
            token = UserToken.objects.get(user=request.user).token # 查询用户Token
        except ObjectDoesNotExist:
            token = '你还没有生成过Token！'
        except:
            if settings.DEBUG:
                print(traceback.print_exc())
                logger.exception("Token管理页面异常")
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
            logger.exception("用户Token生成异常")
            return JsonResponse({'status':False,'data':'生成出错，请重试！'})


# 获取文集
@require_GET
def get_projects(request):
    token = request.GET.get('token','')
    try:
        token = UserToken.objects.get(token=token)
        projects = Project.objects.filter(create_user=token.user) # 查询文集
        project_list =  []
        for project in projects:
            item = {
                'id':project.id, # 文集ID
                'name':project.name, # 文集名称
                'type':project.role # 文集状态
            }
            project_list.append(item)
        return JsonResponse({'status':True,'data':project_list})
    except ObjectDoesNotExist:
        return JsonResponse({'status':False,'data':'token无效'})
    except:
        logger.exception("token获取文集异常")
        return JsonResponse({'status':False,'data':'系统异常'})


# 新建文档
@require_http_methods(['GET','POST'])
@csrf_exempt
def create_doc(request):
    token = request.GET.get('token', '')
    project_id = request.POST.get('pid','')
    doc_title = request.POST.get('title','')
    doc_content = request.POST.get('doc','')
    try:
        # 验证Token
        token = UserToken.objects.get(token=token)
        # 文集是否属于用户
        is_project = Project.objects.filter(create_user=token.user,id=project_id)
        # 新建文档
        if is_project.exists():
            Doc.objects.create(
                name = doc_title, # 文档内容
                pre_content = doc_content, # 文档的编辑内容，意即编辑框输入的内容
                top_doc = project_id, # 所属文集
                create_user = token.user # 创建的用户
            )
            return JsonResponse({'status': True, 'data': 'ok'})
        else:
            return JsonResponse({'status':False,'data':'非法请求'})
    except ObjectDoesNotExist:
        return JsonResponse({'status': False, 'data': 'token无效'})
    except:
        logger.exception("token创建文档异常")
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
    base64_img = request.POST.get('data','')
    try:
        # 验证Token
        token = UserToken.objects.get(token=token)
        # 上传图片
        result = base_img_upload(base64_img, '', token.user)
        return JsonResponse(result)
        # return HttpResponse(json.dumps(result), content_type="application/json")
    except ObjectDoesNotExist:
        return JsonResponse({'success': 0, 'data': 'token无效'})
    except:
        logger.exception("token上传图片异常")
        return JsonResponse({'success':0,'data':'上传出错'})