# coding:utf-8
# @文件: import_utils.py
# @创建者：州的先生
# #日期：2020/6/17
# 博客地址：zmister.com
# 文集导入相关方法

from django.utils.translation import gettext_lazy as _
from app_doc.models import Doc,Project,Image
from app_doc.util_upload_img import upload_generation_dir
from app_doc.utils import libreoffice_wmf_conversion,image_trim
from django.db import transaction
from django.conf import settings
from loguru import logger
from markdownify import markdownify
from bs4 import BeautifulSoup,Tag
from app_admin.models import SysSetting
from PIL import Image as PILImage
import mammoth
import shutil
import zipfile
import os
import io
import time
import re
import yaml
import sys
import datetime
import xml.etree.ElementTree as ET

# 允许保留的外部关系类型后缀：超链接等属于正常文档内容，不属于本漏洞的拦截范围
_ALLOWED_EXTERNAL_RELATION_SUFFIXES = ("/hyperlink",)

# 允许落盘的图片格式（PIL format 与文件扩展名的映射）
_IMAGE_FORMAT_EXT = {
    "PNG": "png",
    "JPEG": "jpg",
    "GIF": "gif",
    "BMP": "bmp",
    "WEBP": "webp",
    "TIFF": "tiff",
}

# 单张图片的字节上限，避免读取 /dev/zero 之类的特殊文件造成资源耗尽
MAX_IMAGE_BYTES = 20 * 1024 * 1024


# 扫描docx内所有.rels，找出"外部引用的媒体资源"关系
# 即 TargetMode="External" 且关系类型不是超链接类的关系
# 返回 [(rels文件名, 关系类型, 目标地址), ...]
def find_external_media_relationships(docx_file_path):
    found = []
    try:
        with zipfile.ZipFile(docx_file_path) as docx_zip:
            for name in docx_zip.namelist():
                if not name.endswith('.rels'):
                    continue
                try:
                    root = ET.fromstring(docx_zip.read(name))
                except ET.ParseError:
                    continue
                for rel in root.iter():
                    if not rel.tag.endswith('Relationship'):
                        continue
                    if rel.get('TargetMode') != 'External':
                        continue
                    rel_type = rel.get('Type', '')
                    if rel_type.endswith(_ALLOWED_EXTERNAL_RELATION_SUFFIXES):
                        continue
                    found.append((name, rel_type, rel.get('Target')))
    except zipfile.BadZipFile:
        # 非法的docx（不是zip包），放行给转换环节处理，由转换环节返回读取异常
        return []
    return found


# 读取图片字节并校验其确实为图片
# 返回 (图片字节, 文件扩展名)，非图片内容返回 (None, None)
def read_valid_image(image, max_bytes=MAX_IMAGE_BYTES):
    with image.open() as image_file:
        image_data = image_file.read(max_bytes + 1)
    if len(image_data) > max_bytes:
        return None, None
    try:
        with PILImage.open(io.BytesIO(image_data)) as pil_image:
            image_format = pil_image.format
            pil_image.verify()
    except Exception:
        return None, None
    file_suffix = _IMAGE_FORMAT_EXT.get(image_format)
    if file_suffix is None:
        return None, None
    return image_data, file_suffix

# 导入Word文档(.docx)
class ImportDocxDoc():
    def __init__(self,docx_file_path,editor_mode,create_user):
        self.docx_file_path = docx_file_path # docx文件绝对路径
        self.tmp_img_dir = self.docx_file_path.split('.')
        self.create_user = create_user
        self.editor_mode = int(editor_mode)

    # 转存docx文件中的图片
    def convert_img(self,image):
        image = libreoffice_wmf_conversion(image, post_process=image_trim)
        if image.alt_text:
            alt = image.alt_text.replace('\n', '').replace('\r', '')
        else:
            alt = ''
        # 校验内容确实为图片，并以真实图片格式决定文件后缀，避免任意文件被写入媒体目录
        image_data,file_suffix = read_valid_image(image)
        if image_data is None:
            logger.warning(f"导入Word文档：跳过非图片内容 content_type={image.content_type}")
            return {"src":"","alt_text":alt,"alt":alt}
        file_time_name = str(time.time())
        dir_name = upload_generation_dir()  # 获取当月文件夹名称
        # 图片在媒体文件夹内的路径，形如 /202012/12542542.jpg
        copy2_filename = os.path.join(dir_name, file_time_name + '.' + file_suffix)
        # 文件的绝对路径 形如/home/MrDoc/media/202012/12542542.jpg
        new_media_file_path = os.path.join(settings.MEDIA_ROOT, copy2_filename.lstrip('/'))
        # 图片文件的相对url路径
        file_url = '/media' + copy2_filename

        # 先落盘，再登记数据库，避免产生无效的图片记录
        with open(new_media_file_path, 'wb') as f:
            f.write(image_data)
        # 图片数据写入数据库
        Image.objects.create(
            user=self.create_user,
            file_path=file_url,
            file_name=file_time_name + '.' + file_suffix,
            remark=_('本地上传'),
        )
        return {"src": file_url,"alt_text":alt,"alt":alt}

    # 转换docx文件内容为HTML和Markdown
    def convert_docx(self):
        # 读取Word文件
        with open(self.docx_file_path, "rb") as docx_file:
            # 转化Word文档为HTML
            result = mammoth.convert_to_html(
                docx_file,
                convert_image=mammoth.images.img_element(self.convert_img),
                # 禁止解析文档中声明的外部（file:/http:等）资源
                external_file_access=False,
            )
            # 获取HTML内容
            html = result.value
            if self.editor_mode in [1,2]:
                # 转化HTML为Markdown
                md = markdownify(html, heading_style="ATX")
                return md
            else:
                return html

    def run(self):
        # 拒绝包含外部媒体引用的文档，阻断服务端读取任意文件的链路
        external_media = find_external_media_relationships(self.docx_file_path)
        if external_media:
            logger.warning(f"拒绝导入包含外部媒体引用的Word文档：{external_media}")
            if os.path.exists(self.docx_file_path):
                os.remove(self.docx_file_path)
            return {'status':False,'data':_('文档包含外部资源引用，出于安全考虑已拒绝导入')}
        try:
            result = self.convert_docx()
            os.remove(self.docx_file_path)
            return {'status':True,'data':result}
        except:
            os.remove(self.docx_file_path)
            return {'status':False,'data':_('读取异常')}


# 导入Word文档为文集
class ImportDocxAsProject:
    def __init__(self, file_name,docx_file_path, editor_mode, create_user):
        self.filename = file_name
        self.docx_file_path = docx_file_path
        self.create_user = create_user
        self.editor_mode = int(editor_mode)
        # 获取存储类型
        try:
            self.storage_type = SysSetting.objects.get(types="storage", name="storage_type").value
        except:
            self.storage_type = '0'

    def parse_html_to_structure(self, html):
        soup = BeautifulSoup(html, "lxml")
        container = soup.body or soup

        BLOCK_TAGS = {'p', 'ul', 'ol','li', 'pre', 'table', 'blockquote', 'img'}
        # 支持h1~h6的标题层级，拆分出不限层级的文档结构
        HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

        headings = container.find_all(HEADING_TAGS)
        if not headings:
            return []

        min_level = min(int(h.name[1]) for h in headings)

        nodes = []
        stack = [{'level': 0, 'children': nodes}]

        def _walk(node):
            for elem in node.children:
                if not isinstance(elem, Tag):
                    continue

                tag = elem.name.lower()

                # —— 标题处理 ——
                if tag in HEADING_TAGS:
                    raw = int(tag[1])
                    if raw < min_level:
                        continue

                    level = raw - min_level + 1
                    current = {
                        'title': elem.get_text(strip=True),
                        'level': level,
                        'content': '',
                        'children': []
                    }

                    while stack and stack[-1]['level'] >= level:
                        stack.pop()

                    stack[-1]['children'].append(current)
                    stack.append(current)
                    continue

                # —— 正文处理 ——
                if len(stack) > 1 and tag in BLOCK_TAGS:
                    stack[-1]['content'] += str(elem)
                    continue
                # —— 继续向下遍历 ——
                _walk(elem)

        _walk(container)
        return nodes

    # 转存docx文件中的图片
    def convert_img(self, image):
        image = libreoffice_wmf_conversion(image, post_process=image_trim)
        if image.alt_text:
            alt = image.alt_text.replace('\n', '').replace('\r', '')
        else:
            alt = ''
        # 非本地存储时不转存图片
        if self.storage_type != '0':
            return {"src": ''}
        # 校验内容确实为图片，并以真实图片格式决定文件后缀，避免任意文件被写入媒体目录
        image_data,file_suffix = read_valid_image(image)
        if image_data is None:
            logger.warning(f"导入Word文档：跳过非图片内容 content_type={image.content_type}")
            return {"src": "", "alt_text": alt, "alt": alt}
        file_time_name = datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')
        dir_name = upload_generation_dir()  # 获取当月文件夹名称
        # 图片在媒体文件夹内的路径，形如 /202012/12542542.jpg
        copy2_filename = os.path.join(dir_name, file_time_name + '.' + file_suffix)
        # 文件的绝对路径 形如/home/MrDoc/media/202012/12542542.jpg
        new_media_file_path = os.path.join(settings.MEDIA_ROOT, copy2_filename.lstrip('/'))
        # 图片文件的相对url路径
        file_url = '/media' + copy2_filename

        # 先落盘，再登记数据库，避免产生无效的图片记录
        with open(new_media_file_path, 'wb') as f:
            f.write(image_data)
        Image.objects.create(
            user=self.create_user,
            file_path=file_url,
            file_name=file_time_name + '.' + file_suffix,
            remark=_('本地上传'),
        )
        return {"src": file_url, "alt_text": alt, "alt": alt}

    @transaction.atomic
    def recursive_save_docs(self, nodes, project_id, parent_doc_id=0):
        """
        递归创建Doc，关联父文档parent_doc和项目top_doc
        """
        created_docs = []
        for idx, node in enumerate(nodes):
            if self.editor_mode == 1:
                # 转化HTML为Markdown
                pre_content = markdownify(node['content'], heading_style="ATX")
            else:
                pre_content = node['content']
            doc = Doc.objects.create(
                name=node['title'],
                pre_content=pre_content,
                content=node['content'],
                parent_doc=parent_doc_id,
                top_doc=project_id,
                sort=idx,
                show_children=True,
                create_user=self.create_user,
                editor_mode=self.editor_mode,
                status=1,
            )
            created_docs.append(doc)
            if node['children']:
                self.recursive_save_docs(node['children'], project_id, parent_doc_id=doc.id)
        return created_docs

    def run(self):
        # 拒绝包含外部媒体引用的文档，阻断服务端读取任意文件的链路
        external_media = find_external_media_relationships(self.docx_file_path)
        if external_media:
            logger.warning(f"拒绝导入包含外部媒体引用的Word文档：{external_media}")
            if os.path.exists(self.docx_file_path):
                os.remove(self.docx_file_path)
            return {'status': False, 'data': _('文档包含外部资源引用，出于安全考虑已拒绝导入')}
        try:
            with open(self.docx_file_path, "rb") as docx_file:
                result = mammoth.convert_to_html(
                    docx_file,
                    convert_image=mammoth.images.img_element(self.convert_img),
                    # 禁止解析文档中声明的外部（file:/http:等）资源
                    external_file_access=False,
                )
            html = result.value

            # 解析html成层级结构
            structure = self.parse_html_to_structure(html)

            # 创建文集（Project）
            project_name = self.filename.replace('.docx', '')
            project = Project.objects.create(
                name=project_name,
                intro=_("由Word文档导入生成"),
                create_user=self.create_user
            )

            if not structure:
                if self.editor_mode == 1:
                    # 转化HTML为Markdown
                    pre_content = markdownify(html, heading_style="ATX")
                else:
                    pre_content = html
                Doc.objects.create(
                    name=project.name,
                    content=html,
                    pre_content=pre_content,
                    parent_doc=0,
                    top_doc=project.id,
                    create_user=self.create_user,
                    editor_mode=self.editor_mode,
                    status=1,
                )
                return {'status': True, 'data': '未检测到标题，已导入为单一文档','pid':project.id}

            # 递归保存文档树，关联文集
            self.recursive_save_docs(structure, project.id)

            os.remove(self.docx_file_path)
            return {'status': True, 'data': _('文集和文档导入成功'),'pid':project.id}
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.exception(f"导入Word为文集异常: {e}")
            if os.path.exists(self.docx_file_path):
                os.remove(self.docx_file_path)
            return {'status': False, 'data': _('导入异常')}

if __name__ == '__main__':
    pass