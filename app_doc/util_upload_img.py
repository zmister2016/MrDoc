# coding:utf-8
from django.http import HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required # 登录需求装饰器
import datetime,time,json,base64,os,uuid
from app_doc.models import Image,ImageGroup

@login_required()
@csrf_exempt
def upload_img(request):
    ##################
    # {"success": 0, "message": "出错信息"}
    # {"success": 1, "url": "图片地址"}
    ##################
    img = request.FILES.get("editormd-image-file", None) # 编辑器上传
    manage_upload = request.FILES.get('manage_upload',None) # 图片管理上传
    dir_name = request.POST.get('dirname','')
    base_img = request.POST.get('base',None)
    group_id = request.POST.get('group_id',0)

    if int(group_id) not in [0,-1]:
        try:
            group_id = ImageGroup.objects.get(id=group_id)
        except:
            group_id = None
    else:
        group_id = None

    print('分组ID：',group_id)
    if img:# 上传普通图片文件
        result = img_upload(img, dir_name,request.user)
    elif manage_upload:
        result = img_upload(manage_upload, dir_name, request.user, group_id=group_id)
    elif base_img: # 上传base64编码图片
        result = base_img_upload(base_img,dir_name,request.user)
    else:
        result = {"success": 0, "message": "出错信息"}
    return HttpResponse(json.dumps(result), content_type="application/json")

# 目录创建
def upload_generation_dir(dir_name=''):
    today = datetime.datetime.today()
    dir_name = dir_name + '/%d%02d/' %(today.year,today.month)
    # print("dir_name:",dir_name)
    if not os.path.exists(settings.MEDIA_ROOT + dir_name):
        # print("创建目录")
        os.makedirs(settings.MEDIA_ROOT + dir_name)
    return dir_name

# 普通图片上传
def img_upload(files, dir_name, user, group_id=None):
    #允许上传文件类型
    allow_suffix =["jpg", "jpeg", "gif", "png", "bmp", "webp"]
    file_suffix = files.name.split(".")[-1] # 提取图片格式
    # 判断图片格式
    if file_suffix.lower() not in allow_suffix:
        return {"success": 0, "message": "图片格式不正确"}

    relative_path = upload_generation_dir(dir_name)
    file_name = files.name.replace(file_suffix,'').replace('.','') + '_' +str(int(time.time())) + '.' + file_suffix
    path_file=os.path.join(relative_path, file_name)
    path_file = settings.MEDIA_ROOT + path_file
    # print('文件路径：',path_file)
    file_url = settings.MEDIA_URL + relative_path + file_name
    # print("文件URL：",file_url)
    with open(path_file, 'wb') as f:
        for chunk in files.chunks():
            f.write(chunk) # 保存文件
    Image.objects.create(
        user=user,
        file_path=file_url,
        file_name=file_name,
        remark='本地上传',
        group = group_id,
    )
    return {"success": 1, "url": file_url,'message':'上传图片成功'}

# base64编码图片上传
def base_img_upload(files,dir_name, user):
    files_str = files.split(';base64,')[-1] # 截取图片正文
    files_base = base64.b64decode(files_str) # 进行base64编码
    relative_path = upload_generation_dir(dir_name)
    file_name = str(datetime.datetime.today()).replace(':', '').replace(' ', '_').split('.')[0] + '.png' # 日期时间
    path_file = os.path.join(relative_path, file_name)
    path_file = settings.MEDIA_ROOT + path_file
    # print('文件路径：', path_file)
    file_url = settings.MEDIA_URL + relative_path + file_name
    # print("文件URL：", file_url)
    with open(path_file, 'wb') as f:
        f.write(files_base)  # 保存文件
    Image.objects.create(
        user = user,
        file_path = file_url,
        file_name=file_name,
        remark = '粘贴上传',
    )
    return {"success": 1, "url": file_url, 'message': '上传图片成功'}