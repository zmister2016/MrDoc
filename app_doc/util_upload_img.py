# coding:utf-8
from django.http import HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required # 登录需求装饰器
import datetime,time,json,base64,os,uuid
from app_doc.models import Image,ImageGroup
from app_admin.models import SysSetting
import requests

@login_required()
@csrf_exempt
def upload_img(request):
    ##################
    # {"success": 0, "message": "出错信息"}
    # {"success": 1, "url": "图片地址"}
    ##################
    img = request.FILES.get("editormd-image-file", None) # 编辑器上传
    manage_upload = request.FILES.get('manage_upload',None) # 图片管理上传
    try:
        url_img = json.loads(request.body.decode())['url']
    except:
        url_img = None
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

    # 上传普通图片文件
    if img:
        result = img_upload(img, dir_name,request.user)
    # 图片管理上传
    elif manage_upload:
        result = img_upload(manage_upload, dir_name, request.user, group_id=group_id)
    # 上传base64编码图片
    elif base_img:
        result = base_img_upload(base_img,dir_name,request.user)
    # 上传图片URL地址
    elif url_img:
        if url_img.startswith("data:image"):# 以URL形式上传的BASE64编码图片
            result = base_img_upload(url_img, dir_name, request.user)
        else:
            result = url_img_upload(url_img,dir_name,request.user)
    else:
        result = {"success": 0, "message": "上传出错"}
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
    # 允许上传文件类型
    allow_suffix =["jpg", "jpeg", "gif", "png", "bmp", "webp"]
    file_suffix = files.name.split(".")[-1] # 提取图片格式
    # 判断图片格式
    if file_suffix.lower() not in allow_suffix:
        return {"success": 0, "message": "图片格式不正确"}

    # 判断图片的大小
    try:
        allow_image_size = SysSetting.objects.get(types='doc', name='img_size')
        allow_img_size = int(allow_image_size.value) * 1048576
    except Exception as e:
        # print(repr(e))
        allow_img_size = 10485760
    if files.size > allow_img_size:
        return {"success": 0, "message": "图片大小超出{}MB".format(allow_img_size / 1048576)}

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


# url图片上传
def url_img_upload(url,dir_name,user):

    relative_path = upload_generation_dir(dir_name)
    file_name = str(datetime.datetime.today()).replace(':', '').replace(' ', '_').split('.')[0] + '.png'  # 日期时间
    path_file = os.path.join(relative_path, file_name)
    path_file = settings.MEDIA_ROOT + path_file
    # print('文件路径：', path_file)
    file_url = settings.MEDIA_URL + relative_path + file_name
    # print("文件URL：", file_url)
    header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
    }
    r = requests.get(url, headers=header, stream=True)

    if r.status_code == 200:
        with open(path_file, 'wb') as f:
            f.write(r.content)  # 保存文件
        Image.objects.create(
            user=user,
            file_path=file_url,
            file_name=file_name,
            remark='粘贴上传',
        )
    resp_data = {
         'msg': '',
         'code': 0,
         'data' : {
           'originalURL': url,
           'url': file_url
         }
        }
    return resp_data
    # return {"success": 1, "url": file_url, 'message': '上传图片成功'}