# coding:utf-8
# @文件: import_utils.py
# @创建者：州的先生
# #日期：2020/6/17
# 博客地址：zmister.com
# 文集导入相关方法

import shutil
import os
import time
import re
from app_doc.models import Doc,Project,Image
from app_doc.util_upload_img import upload_generation_dir
from django.db import transaction
from django.conf import settings
from loguru import logger

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
        for root, dirs, files in os.walk(self.temp_dir):
            for dir in dirs:
                try:
                    new_dir = dir.encode('cp437').decode('gbk')
                except:
                    new_dir = dir.encode('utf-8').decode('utf-8')
                # print(new_dir)
                os.rename(os.path.join(root, dir), os.path.join(root, new_dir))

            for file in files:
                try:
                    new_file = file.encode('cp437').decode('gbk')
                except:
                    new_file = file.encode('utf-8').decode('utf-8')
                # print(root, new_file)
                os.rename(os.path.join(root, file), os.path.join(root, new_file))

        # 开启事务
        with transaction.atomic():
            save_id = transaction.savepoint()
            try:
                # 新建文集
                project = Project.objects.create(
                    name=zip_file_path[:-4].split('/')[-1],
                    intro='',
                    role=1,
                    create_user=create_user
                )
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
                                create_user = create_user
                            )
            except:
                logger.exception("解析导入文件异常")
                # 回滚事务
                transaction.savepoint_rollback(save_id)

            transaction.savepoint_commit(save_id)
        try:
            shutil.rmtree(self.temp_dir)
            os.remove(zip_file_path)
            return project.id
        except:
            logger.exception("删除临时文件异常")
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
                if media_filename.startswith("./"):
                    # 获取文件后缀
                    file_suffix = media_filename.split('.')[-1]
                    if file_suffix.lower() not in settings.ALLOWED_IMG:
                        continue
                    # 判断本地图片路径是否存在
                    temp_media_file_path = os.path.join(self.temp_dir,media_filename[2:])
                    if os.path.exists(temp_media_file_path):
                        # 如果存在，上传本地图片
                        print(media_filename)
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
                            remark='本地上传',
                        )
                        md_content = md_content.replace(media_filename, new_media_filename)
                else:
                    pass
            return md_content
        # 不存在静态文件，直接返回MD内容
        else:
            return md_content

if __name__ == '__main__':
    imp = ImportZipProject()
    imp.read_zip(r"D:\Python XlsxWriter模块中文文档_2020-06-16.zip")