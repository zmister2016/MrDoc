# coding:utf-8
# @文件: import_utils.py
# @创建者：州的先生
# #日期：2020/6/17
# 博客地址：zmister.com
# 文集导入相关方法

from django.utils.translation import gettext_lazy as _
from app_doc.models import Doc,Project,Image
from app_doc.util_upload_img import upload_generation_dir
from django.db import transaction
from django.conf import settings
from loguru import logger
from markdownify import markdownify
import mammoth
import shutil
import os
import time
import re
import yaml
import sys


# 导入Zip文集
class ImportZipProject():
    # 读取 Zip 压缩包
    def read_zip(self,zip_file_path,create_user):
        # 导入流程：
        # 1、解压zip压缩包文件到temp文件夹
        # 2、遍历temp文件夹内的解压后的.md文件
        # 3、读取.md文件的文本内容
        # 4、如果里面匹配到相对路径的静态文件，从指定文件夹里面读取
        # 5、上传图片，写入数据库，修改.md文件里面的url路径

        # 新建一个临时文件夹，用于存放解压的文件
        self.temp_dir = zip_file_path[:-3]
        os.mkdir(self.temp_dir)
        # 解压 zip 文件到指定临时文件夹
        shutil.unpack_archive(zip_file_path, extract_dir=self.temp_dir)

        # 处理文件夹和文件名的中文乱码
        sys_encoding = sys.getdefaultencoding()
        for root, dirs, files in os.walk(self.temp_dir):
            for dir in dirs:
                try:
                    new_dir = dir.encode('cp437').decode(sys_encoding)
                except:
                    new_dir = dir.encode('utf-8').decode(sys_encoding)
                # print(new_dir)
                os.rename(os.path.join(root, dir), os.path.join(root, new_dir))

            for file in files:
                try:
                    new_file = file.encode('cp437').decode(sys_encoding)
                except:
                    new_file = file.encode('utf-8').decode(sys_encoding)
                # print(root, new_file)
                os.rename(os.path.join(root, file), os.path.join(root, new_file))

        # 读取yaml文件
        try:
            with open(os.path.join(self.temp_dir ,'mrdoc.yaml'),'r',encoding='utf-8') as yaml_file:
                yaml_str = yaml.safe_load(yaml_file.read())
                project_name = yaml_str['project_name'] \
                    if 'project_name' in yaml_str.keys() else zip_file_path[:-4].split('/')[-1]
                project_desc = yaml_str['project_desc'] if 'project_desc' in yaml_str.keys() else ''
                project_role = yaml_str['project_role'] if 'project_role' in yaml_str.keys() else 1
                editor_mode = yaml_str['editor_mode'] if 'editor_mode' in yaml_str.keys() else 1
                project_toc = yaml_str['toc']
                toc_item_list = []
                for toc in project_toc:
                    # print(toc)
                    item = {
                        'name': toc['name'],
                        'file': toc['file'],
                        'parent': 0,
                    }
                    toc_item_list.append(item)
                    if 'children' in toc.keys():
                        for b in toc['children']:
                            item = {
                                'name': b['name'],
                                'file': b['file'],
                                'parent': toc['name']
                            }
                            toc_item_list.append(item)
                            if 'children' in b.keys():
                                for c in b['children']:
                                    item = {
                                        'name': c['name'],
                                        'file': c['file'],
                                        'parent': b['name']
                                    }
                                    toc_item_list.append(item)


        except:
            logger.error(_("未发现yaml文件"))
            project_name = zip_file_path[:-4].split('/')[-1]
            project_desc = ''
            project_role = 1
            editor_mode = 1
            project_toc = False

        # 开启事务
        with transaction.atomic():
            save_id = transaction.savepoint()
            try:
                # 新建文集
                project = Project.objects.create(
                    name=project_name,
                    intro=project_desc,
                    role=project_role,
                    create_user=create_user
                )
                if project_toc is False:
                    # 遍历临时文件夹中的所有文件和文件夹
                    for f in os.listdir(self.temp_dir):
                        # 获取 .md 文件
                        if f.endswith('.md'):
                            # print(f)
                            # 读取 .md 文件文本内容
                            with open(os.path.join(self.temp_dir,f),'r',encoding='utf-8') as md_file:
                                md_content = md_file.read()
                                md_content = self.operat_md_media(md_content,create_user)
                                # 新建文档
                                doc = Doc.objects.create(
                                    name = f[:-3],
                                    pre_content = md_content,
                                    top_doc = project.id,
                                    status = 0,
                                    editor_mode = editor_mode,
                                    create_user = create_user
                                )
                else:
                    for i in toc_item_list:
                        with open(os.path.join(self.temp_dir,i['file']),'r',encoding='utf-8') as md_file:
                            md_content = md_file.read()
                            md_content = self.operat_md_media(md_content, create_user)
                            # 新建文档
                            doc = Doc.objects.create(
                                name=i['name'],
                                pre_content=md_content,
                                top_doc=project.id,
                                parent_doc = (Doc.objects.get(top_doc=project.id,name=i['parent'])).id \
                                    if i['parent'] != 0 else 0,
                                status=0,
                                editor_mode=editor_mode,
                                create_user=create_user
                            )
            except:
                logger.exception(_("解析导入文件异常"))
                # 回滚事务
                transaction.savepoint_rollback(save_id)

            transaction.savepoint_commit(save_id)
        try:
            shutil.rmtree(self.temp_dir)
            os.remove(zip_file_path)
            return project.id
        except:
            logger.exception(_("删除临时文件异常"))
            return None

    # 处理MD内容中的静态文件
    def operat_md_media(self,md_content,create_user):
        # 查找MD内容中的静态文件
        pattern = r"\!\[.*?\]\(.*?\)"
        media_list = re.findall(pattern, md_content)
        # print(media_list)
        # 存在静态文件,进行遍历
        if len(media_list) > 0:
            for media in media_list:
                media_filename = media.split("(")[-1].split(")")[0] # 媒体文件的文件名
                # 存在本地图片路径
                if media_filename.startswith("./") or media_filename.startswith("/"):
                    # 获取文件后缀
                    file_suffix = media_filename.split('.')[-1]
                    if file_suffix.lower() not in settings.ALLOWED_IMG:
                        continue
                    # 判断本地图片路径是否存在
                    if media_filename.startswith("./"):
                        temp_media_file_path = os.path.join(self.temp_dir,media_filename[2:])
                    else :
                        temp_media_file_path = os.path.join(self.temp_dir, media_filename[1:])
                    if os.path.exists(temp_media_file_path):
                        # 如果存在，上传本地图片
                        dir_name = upload_generation_dir() # 获取当月文件夹名称

                        # 复制文件到媒体文件夹
                        copy2_filename = dir_name + '/' + str(time.time()) + '.' + file_suffix
                        new_media_file_path = shutil.copy2(
                            temp_media_file_path,
                            settings.MEDIA_ROOT + copy2_filename
                        )

                        # 替换MD内容的静态文件链接
                        new_media_filename = new_media_file_path.split(settings.MEDIA_ROOT,1)[-1]
                        new_media_filename = '/media' + new_media_filename

                        # 图片数据写入数据库
                        Image.objects.create(
                            user=create_user,
                            file_path=new_media_filename,
                            file_name=str(time.time())+'.'+file_suffix,
                            remark=_('本地上传'),
                        )
                        md_content = md_content.replace(media_filename, new_media_filename)
                else:
                    pass
            return md_content
        # 不存在静态文件，直接返回MD内容
        else:
            return md_content


# 导入Word文档(.docx)
class ImportDocxDoc():
    def __init__(self,docx_file_path,editor_mode,create_user):
        self.docx_file_path = docx_file_path # docx文件绝对路径
        self.tmp_img_dir = self.docx_file_path.split('.')
        self.create_user = create_user
        self.editor_mode = int(editor_mode)

    # 转存docx文件中的图片
    def convert_img(self,image):
        with image.open() as image_bytes:
            file_suffix = image.content_type.split("/")[1]
            file_time_name = str(time.time())
            dir_name = upload_generation_dir()  # 获取当月文件夹名称
            # 图片在媒体文件夹内的路径，形如 /202012/12542542.jpg
            copy2_filename = dir_name + '/' + file_time_name + '.' + file_suffix
            # 文件的绝对路径 形如/home/MrDoc/media/202012/12542542.jpg
            new_media_file_path = settings.MEDIA_ROOT + copy2_filename
            # 图片文件的相对url路径
            new_media_filename = '/media' + copy2_filename

            # 图片数据写入数据库
            Image.objects.create(
                user=self.create_user,
                file_path=new_media_filename,
                file_name=file_time_name + '.' + file_suffix,
                remark=_('本地上传'),
            )
            with open(new_media_file_path, 'wb') as f:
                f.write(image_bytes.read())
        return {"src": new_media_filename}

    # 转换docx文件内容为HTML和Markdown
    def convert_docx(self):
        # 读取Word文件
        with open(self.docx_file_path, "rb") as docx_file:
            # 转化Word文档为HTML
            result = mammoth.convert_to_html(docx_file, convert_image=mammoth.images.img_element(self.convert_img))
            # 获取HTML内容
            html = result.value
            if self.editor_mode in [1,2]:
                # 转化HTML为Markdown
                md = markdownify(html, heading_style="ATX")
                return md
            else:
                return html

    def run(self):
        try:
            result = self.convert_docx()
            os.remove(self.docx_file_path)
            return {'status':True,'data':result}
        except:
            os.remove(self.docx_file_path)
            return {'status':False,'data':_('读取异常')}

if __name__ == '__main__':
    imp = ImportZipProject()
    imp.read_zip(r"D:\Python XlsxWriter模块中文文档_2020-06-16.zip")