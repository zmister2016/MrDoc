# coding:utf-8
from django.http import HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import os
import uuid
import json
import datetime as dt
import base64

@csrf_exempt
def upload_img(request):
    ##################
    # {"success": 0, "message": "出错信息"}
    # {"success": 1, "url": "图片地址"}
    ##################
    files = request.FILES.get("editormd-image-file", None)
    dir_name = request.POST.get('dirname','')
    base_img = request.POST.get('base',None)
    if files:# 上传普通图片文件
        result = file_upload(files, dir_name)
    elif base_img: # 上传base64编码图片
        result = base_img_upload(base_img,dir_name)
    else:
        result = {"success": 0, "message": "出错信息"}
    return HttpResponse(json.dumps(result), content_type="application/json")

# 目录创建
def upload_generation_dir(dir_name=''):
    today = dt.datetime.today()
    dir_name = dir_name + '/%d%02d/' %(today.year,today.month)
    print("dir_name:",dir_name)
    if not os.path.exists(settings.MEDIA_ROOT + dir_name):
        print("创建目录")
        os.makedirs(settings.MEDIA_ROOT + dir_name)
    return dir_name

# 普通图片上传
def file_upload(files, dir_name):
    #允许上传文件类型
    allow_suffix =["jpg", "jpeg", "gif", "png", "bmp", "webp"]
    file_suffix = files.name.split(".")[-1]
    if file_suffix not in allow_suffix:
        return {"success": 0, "message": "图片格式不正确"}
    relative_path = upload_generation_dir(dir_name)
    file_name = str(dt.datetime.today()).replace(':','').replace(' ','').replace('.','')+files.name
    path_file=os.path.join(relative_path, file_name)
    path_file = settings.MEDIA_ROOT + path_file
    print('文件路径：',path_file)
    file_url = settings.MEDIA_URL + relative_path + file_name
    print("文件URL：",file_url)
    with open(path_file, 'wb') as f:
        for chunk in files.chunks():
            f.write(chunk) # 保存文件
    return {"success": 1, "url": file_url,'message':'上传图片成功'}

# base64编码图片上传
def base_img_upload(files,dir_name):
    files_str = files.split(';base64,')[-1] # 截取图片正文
    files_base = base64.b64decode(files_str) # 进行base64编码
    relative_path = upload_generation_dir(dir_name)
    file_name = str(dt.datetime.today()).replace(':', '').replace(' ', '').replace('.', '') + '.png'
    path_file = os.path.join(relative_path, file_name)
    path_file = settings.MEDIA_ROOT + path_file
    print('文件路径：', path_file)
    file_url = settings.MEDIA_URL + relative_path + file_name
    print("文件URL：", file_url)
    with open(path_file, 'wb') as f:
        f.write(files_base)  # 保存文件
    return {"success": 1, "url": file_url, 'message': '上传图片成功'}