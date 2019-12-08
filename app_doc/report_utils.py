# coding:utf-8
# @文件: report_utils.py
# @创建者：州的先生
# #日期：2019/12/7
# 博客地址：zmister.com
# MrDoc文集文档导出相关功能代码
from django.conf import settings
from app_doc.models import *
import subprocess
import datetime
import re
import os
import shutil

# 导出MD文件压缩包
class ReportMD():
    def __init__(self,project_id):
        # 查询文集信息
        self.pro_id = project_id
        project_data = Project.objects.get(pk=project_id)

        # 文集名称
        self.project_name = "{0}_{1}_{2}".format(
            project_data.create_user,
            project_data.name,
            str(datetime.date.today())
        )

        # 判断MD导出临时文件夹是否存在
        if os.path.exists(settings.MEDIA_ROOT + "/reportmd_temp") is False:
            os.mkdir(settings.MEDIA_ROOT + "/reportmd_temp")

        # 判断文集名称文件夹是否存在
        self.project_path = settings.MEDIA_ROOT + "/reportmd_temp/{}".format(self.project_name)
        is_fold = os.path.exists(self.project_path)
        if is_fold is False:
            os.mkdir(self.project_path)

        # 判断是否存在静态文件文件夹
        self.media_path = settings.MEDIA_ROOT + "/reportmd_temp/{}/media".format(self.project_name)
        is_media = os.path.exists(self.media_path)
        if is_media is False:
            os.mkdir(self.media_path)

    def work(self):
        # 读取指定文集的文档数据
        data = Doc.objects.filter(top_doc=self.pro_id, parent_doc=0).order_by("sort")
        # 遍历文档
        for d in data:
            md_name = d.name
            md_content = d.pre_content
            md_content = self.operat_md_media(md_content)

            # 新建MD文件
            with open('{}/{}.md'.format(self.project_path,md_name),'w',encoding='utf-8') as files:
                files.write(md_content)

            # 查询二级文档
            data_2 = Doc.objects.filter(parent_doc=d.id).order_by("sort")
            for d2 in data_2:
                md_name_2 = d2.name
                md_content_2 = d2.pre_content

                md_content_2 = self.operat_md_media(md_content_2)

                # 新建MD文件
                with open('{}/{}.md'.format(self.project_path, md_name_2), 'w', encoding='utf-8') as files:
                    files.write(md_content_2)

                # 获取第三级文档
                data_3 = Doc.objects.filter(parent_doc=d2.id).order_by("sort")
                for d3 in data_3:
                    md_name_3 = d3.name
                    md_content_3 = d3.pre_content

                    md_content_3 = self.operat_md_media(md_content_3)

                    # 新建MD文件
                    with open('{}/{}.md'.format(self.project_path, md_name_3), 'w', encoding='utf-8') as files:
                        files.write(md_content_3)

        # 压缩文件
        shutil.make_archive(self.project_path,'zip',self.project_path)
        # 删除文件夹
        shutil.rmtree(self.project_path)

        return "{}.zip".format(self.project_path)

    # 处理MD内容中的静态文件
    def operat_md_media(self,md_content):
        # 查找MD内容中的静态文件
        pattern = r"\!\[.*?\]\(.*?\)"
        media_list = re.findall(pattern, md_content)
        # print(media_list)
        # 存在静态文件,进行遍历
        if len(media_list) > 0:
            for media in media_list:
                media_filename = media.split("(")[-1].split(")")[0] # 媒体文件的文件名
                # 对本地静态文件进行复制
                if media_filename.startswith("/"):
                    sub_folder = "/" + media_filename.split("/")[3] # 获取子文件夹的名称
                    is_sub_folder = os.path.exists(self.media_path+sub_folder)
                    # 创建子文件夹
                    if is_sub_folder is False:
                        os.mkdir(self.media_path+sub_folder)
                    # 替换MD内容的静态文件链接
                    md_content = md_content.replace(media_filename, "." + media_filename)
                    # 复制静态文件到指定文件夹
                    shutil.copy(settings.BASE_DIR + media_filename, self.media_path+sub_folder)
                # 不存在本地静态文件，直接返回MD内容
                # else:
                #     print("没有本地静态文件")
            return md_content
        # 不存在静态文件，直接返回MD内容
        else:
            return md_content

if __name__ == '__main__':
    app = ReportMD(
        project_id=7
    )
    app.work()
