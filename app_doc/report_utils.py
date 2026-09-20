# coding:utf-8
# @文件: report_utils.py
# @创建者：州的先生
# #日期：2019/12/7
# 博客地址：zmister.com
# MrDoc文集文档导出相关功能代码
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from bs4 import BeautifulSoup
import subprocess
import datetime,time
import re
import os,sys
import shutil
import tempfile
import html


from django.core.wsgi import get_wsgi_application
sys.path.extend([settings.BASE_DIR])
os.environ.setdefault("DJANGO_SETTINGS_MODULE","MrDoc.settings")
application = get_wsgi_application()
import django
django.setup()
from app_doc.models import *
from app_doc.utils import build_doc_tree
from subprocess import Popen
from loguru import logger
from app_doc.report_html2pdf import convert
import traceback
import time
import markdown
import yaml
import pathlib
from urllib.parse import unquote
from pathlib import Path


# 替换前端传来的非法字符
def validate_title(title):
  rstr = r"[\/\\\:\*\?\"\<\>\|\[\]]" # '/ \ : * ? " < > |'
  new_title = re.sub(rstr, "_", title) # 替换为下划线
  return new_title

# 导出MD文件压缩包
class ReportMD():
    def __init__(self,project_id):
        # 查询文集信息
        self.pro_id = project_id
        self.project_data = Project.objects.get(pk=project_id)

        # 文集名称
        self.project_name = "{0}_{1}_{2}".format(
            self.project_data.create_user,
            validate_title(self.project_data.name),
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
        # 初始化文集YAML数据
        project_toc_list = {}
        project_toc_list['project_name'] = validate_title(self.project_data.name)
        project_toc_list['project_desc'] = self.project_data.intro
        project_toc_list['project_role'] = self.project_data.role
        project_toc_list['toc'] = []
        # 读取指定文集的文档数据
        data = Doc.objects.filter(
            top_doc=self.pro_id,
            status=1
        ).order_by('sort', 'create_time').values(
            'name', 'editor_mode', 'pre_content', 'content', 'parent_doc', 'id'
        )
        if data.count() == 0:
            return None
        out = {}
        for p in data:
            doc_pre_content = p['pre_content']
            doc_content = p['content']
            p['name'] = validate_title(p['name'])
            p['file'] = '{}-{}.md'.format(validate_title(p['name']), p['id'])
            del p['pre_content']
            del p['content']
            out.setdefault(p['parent_doc'], {'children': []})
            out.setdefault(p['id'], {'children': []})
            out[p['id']].update(p)
            out[p['parent_doc']]['children'].append(out[p['id']])

            # 处理文档内的图片，如果使用Markdown编辑器编写则导出Markdown文本，如果使用富文本编辑器编写则导出HTML文本
            md_content = self.operat_md_media(doc_content) \
                if p['editor_mode'] in [3] else self.operat_md_media(doc_pre_content)
            # 新建MD文件
            file_path = '{}/{}-{}.md'.format(self.project_path, p['name'], p['id'])
            with open(file_path, 'w', encoding='utf-8') as files:
                files.write(md_content)
        project_toc_list['toc'] = out[0]['children']

        # 写入层级YAML
        with open('{}/mrdoc.yaml'.format(self.project_path), 'a+', encoding='utf-8') as toc_yaml:
            yaml.dump(project_toc_list,toc_yaml,allow_unicode=True)

        # 压缩文件
        md_file = shutil.make_archive(
            base_name=self.project_path,
            format='zip',
            root_dir=self.project_path
        )
        # print(md_file)
        # 删除文件夹
        shutil.rmtree(self.project_path)

        return "{}.zip".format(self.project_path)

    # 处理MD内容中的静态文件
    def operat_md_media(self,md_content):
        # 查找MD内容中的静态文件
        pattern = r"\!\[.*?\]\(.*?\)"
        media_list = re.findall(pattern, md_content)
        # print(media_list)
        # 查找<img>标签形式的静态图片
        img_pattern = r'<img[^>]*/>'
        img_list = re.findall(img_pattern, md_content)
        # 存在静态文件,进行遍历
        if len(media_list) > 0:
            for media in media_list:
                try:
                    media_filename = media.replace('//','/').split("(")[-1].split(")")[0] # 媒体文件的文件名
                except:
                    continue
                # 安全检查前先解码，防止 %2e%2e 等编码绕过
                media_filename = unquote(media_filename)
                # 对本地静态文件进行复制
                if media_filename.startswith("/media"):
                    # 安全拼接路径
                    target_path = os.path.join(settings.BASE_DIR, media_filename[1:])
                    abs_path = os.path.abspath(target_path)
                    # 检查目标路径是否在允许范围内
                    if (not abs_path.startswith(settings.MEDIA_ROOT)) \
                            or '..' in os.path.relpath(abs_path,settings.MEDIA_ROOT):
                        continue
                    # print(media_filename)
                    sub_folder = "/" + media_filename.split("/")[2] # 获取子文件夹的名称
                    # print(sub_folder)
                    is_sub_folder = os.path.exists(self.media_path+sub_folder)
                    # 创建子文件夹
                    if is_sub_folder is False:
                        os.mkdir(self.media_path+sub_folder)
                    # 替换MD内容的静态文件链接
                    md_content = md_content.replace(media_filename, "." + media_filename)
                    # 复制静态文件到指定文件夹
                    try:
                        new_file_path = pathlib.Path(settings.BASE_DIR, media_filename[1:])
                        shutil.copy(new_file_path, self.media_path + sub_folder)
                    except FileNotFoundError:
                        pass
        if len(img_list) > 0:
            for media in img_list:
                try:
                    media_filename = re.findall('src="([^"]+)"', media)[0]
                except:
                    continue
                # 安全检查前先解码，防止 %2e%2e 等编码绕过
                media_filename = unquote(media_filename)
                # 对本地静态文件进行复制
                if media_filename.startswith("/media"):
                    # 安全拼接路径
                    target_path = os.path.join(settings.BASE_DIR, media_filename[1:])
                    abs_path = os.path.abspath(target_path)
                    # 检查目标路径是否在允许范围内
                    if (not abs_path.startswith(settings.MEDIA_ROOT)) \
                            or '..' in os.path.relpath(abs_path, settings.MEDIA_ROOT):
                        continue
                    # print(media_filename)
                    sub_folder = "/" + media_filename.split("/")[2]  # 获取子文件夹的名称
                    # print(sub_folder)
                    is_sub_folder = os.path.exists(self.media_path + sub_folder)
                    # 创建子文件夹
                    if is_sub_folder is False:
                        os.mkdir(self.media_path + sub_folder)
                    # 替换MD内容的静态文件链接
                    md_content = md_content.replace(media_filename, "." + media_filename)
                    # 复制静态文件到指定文件夹
                    try:
                        new_file_path = pathlib.Path(settings.BASE_DIR, media_filename[1:])
                        shutil.copy(new_file_path, self.media_path + sub_folder)
                    except FileNotFoundError:
                        pass
        return md_content


# 批量导出文集Markdown压缩包
class ReportMdBatch():
    def __init__(self,username,project_id_list):
        self.project_list = project_id_list
        self.username = username
        # 判断MD导出临时文件夹是否存在
        if os.path.exists(settings.MEDIA_ROOT + "/reportmd_temp") is False:
            os.mkdir(settings.MEDIA_ROOT + "/reportmd_temp")

        # 判断用户名+日期文件夹是否存在
        self.report_file_path = settings.MEDIA_ROOT + "/reportmd_temp/{}_{}".format(
            self.username,datetime.datetime.strftime(datetime.datetime.now(),"%y%m%d%H%M%S")
        )
        is_fold = os.path.exists(self.report_file_path)
        if is_fold is False:
            os.mkdir(self.report_file_path)

    def work(self):
        # 遍历文集列表，打包每一个文集
        project_file_list = []
        for project_id in self.project_list:
            report_func = ReportMD(project_id=project_id)
            report_project_zip = report_func.work()
            project_file_list.append(report_project_zip)

        # 遍历打包好的文集列表，将其移入统一文件夹
        for file in project_file_list:
            shutil.move(file,self.report_file_path)

        # 压缩打包文集合集文件夹
        md_file = shutil.make_archive(
            base_name=self.report_file_path,
            format='zip',
            root_dir=self.report_file_path
        )
        # print(md_file)
        # 删除文件夹
        shutil.rmtree(self.report_file_path)

        return "{}.zip".format(self.report_file_path)


# 导出EPUB
class ReportEPUB():
    def __init__(self,project_id):
        self.project = Project.objects.get(id=project_id)
        # 中间产物使用系统临时目录，不落在 MEDIA_ROOT 下：
        # 这些 .xhtml 含未转义的文档内容，若位于 /media/ 下会被未授权访问，
        # 并被浏览器按 application/xhtml+xml 解析而执行其中的脚本。
        self.base_path = tempfile.mkdtemp(prefix='mrdoc_epub_{}_'.format(project_id))

        # 创建相关目录
        if os.path.exists(self.base_path + '/OEBPS') is False:
            os.makedirs(self.base_path + '/OEBPS')
        if os.path.exists(self.base_path + '/OEBPS/Images') is False:
            os.makedirs(self.base_path + '/OEBPS/Images')
        if os.path.exists(self.base_path + '/OEBPS/Text') is False:
            os.makedirs(self.base_path + '/OEBPS/Text')
        if os.path.exists(self.base_path + '/OEBPS/Styles') is False:
            os.makedirs(self.base_path + '/OEBPS/Styles')
        if os.path.exists(self.base_path + '/META-INF') is False:
            os.makedirs(self.base_path + '/META-INF')

        # 复制样式文件到相关目录
        shutil.copyfile(settings.BASE_DIR+'/static/report_epub/style.css',self.base_path + '/OEBPS/Styles/style.css')
        # shutil.copyfile(settings.BASE_DIR+'/static/katex/katex.min.css',self.base_path + '/OEBPS/Styles/katex.css')
        shutil.copyfile(settings.BASE_DIR+'/static/mr-marked/marked.css',self.base_path + '/OEBPS/Styles/marked.css')
        # 复制封面图片到相关目录
        shutil.copyfile(settings.BASE_DIR+'/static/report_epub/epub_cover1.jpg',self.base_path + '/OEBPS/Images/epub_cover1.jpg')

    # 将文档内容写入HTML文件
    def write_html(self, d, html_str):
        # 使用BeautifulSoup解析拼接好的HTML文本
        html_soup = BeautifulSoup(html_str, 'lxml')
        src_tag = html_soup.find_all(lambda tag: tag.has_attr("src"))  # 查找所有包含src的标签
        mindmap_tag = html_soup.select('svg.mindmap') # 查找所有脑图的SVG标签
        tex_tag = html_soup.select('.editormd-tex') # 查找所有公式标签
        flowchart_tag = html_soup.select('.flowchart') # 查找所有流程图标签
        seque_tag = html_soup.select('.sequence-diagram') # 查找所有时序图标签
        echart_tag = html_soup.select('.echart') # 查找所有echart图表标签
        code_tag = html_soup.find_all(name="code") # 查找code代码标签
        iframe_tag = html_soup.find_all(name='iframe') # 查找iframe

        # 添加css样式标签
        style_link = html_soup.new_tag(name='link',href="../Styles/style.css",rel="stylesheet",type="text/css")
        html_soup.body.insert_before(style_link)
        editormd_link = html_soup.new_tag(name='link',href='../Styles/marked.css',rel="stylesheet",type="text/css")
        html_soup.body.insert_before(editormd_link)

        # 添加html标签的xmlns属性
        html_soup.html['xmlns'] = "http://www.w3.org/1999/xhtml"

        # 替换iframe视频为视频URL链接文本
        for iframe in iframe_tag:
            iframe_src = iframe.get('src')
            iframe.name = 'p'
            iframe.string = "本格式不支持iframe视频显示，视频地址为：{}".format(str(iframe_src))

        # 替换HTML文本中静态文件的相对链接为绝对链接
        for src in src_tag:
            if src['src'].startswith("/"):
                src_path = src['src'] # 媒体文件原始路径

                # 规范化路径,移除 ../ 等危险字符
                src_path_normalized = os.path.normpath(src_path).lstrip(os.sep)

                # 验证路径不包含路径穿越字符
                if '..' in src_path_normalized or src_path_normalized.startswith('/'):
                    logger.error(f"EPUB导出：检测到潜在路径穿越攻击: {src_path}")
                    continue  # 跳过危险路径

                # 限制允许的图片扩展名
                file_ext = os.path.splitext(src_path_normalized)[1].lower().lstrip('.')
                print(file_ext,settings.ALLOWED_IMG)
                if file_ext not in settings.ALLOWED_IMG:
                    logger.error(f"EPUB导出：不允许的文件类型: {src_path}")
                    continue

                src_filename = os.path.basename(src_path_normalized)

                # 使用 Path 对象安全拼接路径
                source_file = Path(settings.BASE_DIR) / src_path_normalized
                dest_file = Path(self.base_path) / 'OEBPS' / 'Images' / src_filename

                # 验证源文件在允许的目录内
                try:
                    source_file_resolved = source_file.resolve()
                    base_dir_resolved = Path(settings.BASE_DIR).resolve()

                    # 确保源文件在 BASE_DIR 内
                    source_file_resolved.relative_to(base_dir_resolved)

                except (ValueError, FileNotFoundError):
                    logger.error(f"EPUB导出：文件不在允许的目录范围内: {src_path}")
                    continue

                src['src'] = '../Images/' + src_filename # 媒体文件在EPUB中的路径
                # 复制文件到epub的Images文件夹
                try:
                    # 确保目标目录存在
                    dest_file.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(source_file_resolved, dest_file)
                except FileNotFoundError:
                    logger.error(f"EPUB导出：源文件不存在: {source_file}")
                except Exception as e:
                    logger.error(f"EPUB导出：复制文件失败: {e}")

        # 创建写入临时HTML文件
        temp_file_path = self.base_path + '/OEBPS/Text/{0}.xhtml'.format(d['id'])
        with open(temp_file_path, 'a+', encoding='utf-8') as htmlfile:
            htmlfile.write('<?xml version="1.0" encoding="UTF-8"?>' + str(html_soup))

    # 生成文档HTML
    def generate_html(self):
        # 一次查询文集下的全部已发布文档，再构建不限层级的文档树
        doc_nodes = list(
            Doc.objects.filter(top_doc=self.project.id, status=1).values(
                'id', 'name', 'parent_doc', 'pre_content', 'content'
            ).order_by("sort")
        )
        toc_tree = build_doc_tree(doc_nodes, child_key='children')
        self.toc_list = [
            {
                'id': 0,
                'link': 'Text/toc_summary.xhtml',
                'pid': 0,
                'title': _('目录')
            }
        ]
        # content.opf相关
        manifest = '''<item id="book_cover" href="Text/book_cover.xhtml" media-type="application/xhtml+xml"/>
        <item id="book_title" href="Text/book_title.xhtml" media-type="application/xhtml+xml"/>
        <item id="book_desc" href="Text/book_desc.xhtml" media-type="application/xhtml+xml"/>
        <item id="toc_summary" href="Text/toc_summary.xhtml" media-type="application/xhtml+xml"/>
        '''
        spine = '<itemref idref="book_cover" linear="no"/><itemref idref="book_title"/><itemref idref="book_desc"/><itemref idref="toc_summary"/>'
        # 导航序号，使用列表便于在递归中累加
        nav_num = [1]

        def walk(docs, level):
            """递归生成不限层级的文档HTML与导航节点"""
            nav_str = ''
            for d in docs:
                # 按文档层级使用对应的标题标签，最深层级使用h6
                heading_tag = 'h{}'.format(min(level, 6))
                html_str = "<{} style='page-break-before: always;'>{}</{}>".format(
                    heading_tag, html.escape(d['name']), heading_tag)
                # 如果文档没有HTML内容，将Markdown转换为HTML
                if d['content'] is None:
                    d['content'] = markdown.markdown(
                        d['pre_content'],
                        extensions=['markdown.extensions.fenced_code', 'markdown.extensions.tables']
                    )
                html_str += d['content']
                self.write_html(d=d, html_str=html_str)  # 生成HTML
                # 生成HTML的目录位置
                toc = {
                    'id': d['id'],
                    'link': '{}.xhtml'.format(d['id']),
                    'pid': d['parent_doc'],
                    'title': html.escape(d['name'])
                }
                self.toc_list.append(toc)

                # nav
                num = nav_num[0]
                nav_num[0] += 1
                nav_str += '''<navPoint id="np_{nav_num}" playOrder="{nav_num}">
                    <navLabel><text>{title}</text></navLabel>
                    <content src="Text/{file}"/>
                '''.format(nav_num=num, title=toc['title'], file=toc['link'])
                # 递归生成下级文档的导航节点
                nav_str += walk(d['children'], level + 1)
                nav_str += '</navPoint>'
            return nav_str

        def build_summary(docs):
            """递归生成目录页的嵌套列表"""
            summary = ''
            for d in docs:
                link = '{}.xhtml'.format(d['id'])
                title = html.escape(d['name'])
                if d['children']:
                    summary += '<li><a href="./{link}">{title}</a><ul>{sub}</ul></li>'.format(
                        link=link, title=title, sub=build_summary(d['children']))
                else:
                    summary += '<li><a href="./{link}">{title}</a></li>'.format(link=link, title=title)
            return summary

        nav_str = '<navMap>' + walk(toc_tree, 1) + '</navMap>'
        toc_summary_str = '<ul>' + build_summary(toc_tree) + '</ul>'

        # content.opf中的manifest与spine按文档目录顺序生成
        for toc in self.toc_list[1:]:
            manifest += '<item id="{}" href="Text/{}.xhtml" media-type="application/xhtml+xml"/>'.format(toc['id'], toc['id'])
            spine += '<itemref idref="{}"/>'.format(toc['id'])

        self.nav_str = nav_str
        self.toc_summary_str = toc_summary_str
        # self.config_json['toc'] = self.toc_list
        self.manifest = manifest
        self.spine = spine

    # 生成书籍标题的描述HTML文件
    def generate_title_html(self):
        title_str = '''<?xml version="1.0" encoding="UTF-8"?>
            <html xmlns="http://www.w3.org/1999/xhtml">
              <head>
                <title>书籍标题</title>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
                <link href="../Styles/style.css" rel="stylesheet" type="text/css"/>
              </head>
              <body class="bookname">
                  <div class="main">
                    <h1 class="title"">{title}</h1>
                    <p class="author"><b>{author} 著</b></p><br>
                    <p class="author">{create_time}</p>
                    <p class="book-src">本书籍由<a href='http://mrdoc.zmister.com'>MrDoc(mrdoc.zmister.com)</a>生成</p>
                  </div>
            </body>
            </html>
        '''.format(
            title=html.escape(self.project.name),
            author=html.escape(str(self.project.create_user)),
            create_time = time.strftime('%Y{y}%m{m}%d{d}').format(y='年',m='月',d='日')
        )
        with open(self.base_path+'/OEBPS/Text/book_title.xhtml','a+',encoding='utf-8') as file:
            file.write(title_str)

        desc_str = '''<?xml version="1.0" encoding="UTF-8"?>
            <html xmlns="http://www.w3.org/1999/xhtml">
              <head>
                <title>简介</title>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
                <link href="../Styles/style.css" rel="stylesheet" type="text/css"/>
              </head>
              <body class="bookdesc">
                  <div class="main">
                    <p class="title">书籍简介</p>
                    <p class="subtitle">{desc}</p>
                  </div>
            </body>
            </html>
        '''.format(desc=html.escape(self.project.intro or ''))
        with open(self.base_path+'/OEBPS/Text/book_desc.xhtml','a+',encoding='utf-8') as file:
            file.write(desc_str)

    # 生成元信息container.xml文件
    def generate_metainfo(self):
        xml = '''<?xml version="1.0" encoding="UTF-8"?>
            <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container" >
                <rootfiles>
                    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />
                </rootfiles>
            </container>
            '''
        folder = self.base_path + '/META-INF'
        with open(folder+'/container.xml','a+',encoding='utf-8') as metafile:
            metafile.write(xml)

    # 生成元类型mimetype文件
    def generate_metatype(self):
        with open(self.base_path+'/mimetype','a+',encoding='utf-8') as metatype:
            metatype.write('application/epub+zip')

    # 生成封面
    def generate_cover(self):
        xml_str = '''<?xml version="1.0" encoding="utf-8"?>
            <!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh">
            <head>
              <title>封面</title>
            <style type="text/css">
            svg {padding: 0pt; margin:0pt}
            body { text-align: center; padding:0pt; margin: 0pt; }
            </style>
            </head>
            <body>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" height="100%" preserveAspectRatio="xMidYMid meet" version="1.1" viewBox="0 0 628 892" width="100%" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <image height="892" width="628" xlink:href="../Images/epub_cover1.jpg"/>
                </svg>
              </div>
            </body>
            </html>
        '''
        with open(self.base_path + '/OEBPS/Text/book_cover.xhtml','a+', encoding='utf-8') as cover:
            cover.write(xml_str)

    # 生成文档目录.ncx文件
    def generate_toc_ncx(self):
        ncx = '''
        <?xml version='1.0' encoding='utf-8'?>
            <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="zh-CN">
              <head>
                <meta name="dtb:uid" content="urn:uuid:12345"/>
                <meta name="dtb:depth" content="1"/>
                <meta name="dtb:totalPageCount" content="0"/>
                <meta name="dtb:maxPageNumber" content="0"/>
              </head>
              <docTitle>
                <text>{title}</text>
              </docTitle>
              {nav_map}
            </ncx>
        '''.format(title=html.escape(self.project.name),nav_map=self.nav_str)

        with open(self.base_path+'/OEBPS/toc.ncx','a+',encoding='utf-8') as file:
            file.write(ncx)

    # 生成文档目录toc_summary.html文件
    def generate_toc_html(self):
        summary = '''<?xml version="1.0" encoding="UTF-8"?>
            <html lang="zh-CN">
            <head>
                <meta charset="utf-8">
                <title>目录</title>
                <style>
                    body{margin: 0px;padding: 0px;}h1{text-align: center;padding: 0px;margin: 0px;}ul,li{list-style: none;}ul{padding-left:0px;}li>ul{padding-left: 2em;}
                    a{text-decoration: none;color: #4183c4;text-decoration: none;font-size: 16px;line-height: 28px;}
                </style>
            </head>
            <body>
                <h1>目&nbsp;&nbsp;&nbsp;&nbsp;录</h1>
                %s
            </body>
            </html>
        ''' % (self.toc_summary_str)

        with open(self.base_path+'/OEBPS/Text/toc_summary.xhtml','a+',encoding='utf-8') as file:
            file.write(summary)

    # 生成content.opf文件
    def generate_opf(self):
        content_info = '''<?xml version="1.0" encoding="utf-8" ?>
            <package version="2.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" >
              <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
                <dc:title>{title}</dc:title>
                <dc:language>zh</dc:language>
                <dc:creator>{creator}</dc:creator>
                <dc:identifier id="bookid">urn:uuid:12345</dc:identifier>
                <dc:publisher>MrDoc制作</dc:publisher>
                <dc:date opf:event="publication">{create_time}</dc:date>
                <dc:description>{desc}</dc:description>
                <meta name="cover" content="cover_img" />
                <meta name="output encoding" content="utf-8" />
                <meta name="primary-writing-mode" content="horizontal-lr" />
              </metadata>
              <manifest>
                  {manifest}
                <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
                <item id="css" href="stylesheet.css" media-type="text/css"/>
                <item id="cover_img" media-type="image/jpeg" href="Images/epub_cover1.jpg" />
              </manifest>
              <spine toc="ncx">
                  {spine}
              </spine>
              <guide>
                <reference type="toc" title="目录" href="Text/toc_summary.xhtml" />
                <reference href="Text/book_cover.xhtml" type="cover" title="封面"/>
              </guide>
            </package>
            '''

        with open(self.base_path+'/OEBPS/content.opf','a+',encoding='utf-8') as file:
            file.write(
                content_info.format(
                    title = html.escape(self.project.name),
                    creator = html.escape(str(self.project.create_user)),
                    create_time = str(datetime.date.today()),
                    desc=html.escape(self.project.intro or ''),
                    manifest=self.manifest,
                    spine = self.spine,
                )
            )

    # 生成epub文件
    def generate_epub(self):
        try:
            # 生成ZIP压缩文件
            # 文集名可被用户控制（部分创建入口未过滤），直接拼路径可写出 report_epub 之外，
            # 此处按文件名规则过滤后再拼接
            zipfile_name = settings.MEDIA_ROOT + '/report_epub/{}'.format(validate_title(self.project.name))+'_'+str(int(time.time()))
            zip_name = shutil.make_archive(
                base_name = zipfile_name,
                format='zip',
                root_dir= self.base_path
            )
            # print(zip_name)
            # 修改zip压缩文件后缀为EPUB
            os.rename(zip_name,zipfile_name+'.epub')
            # 删除生成的临时文件夹
            shutil.rmtree(self.base_path)
            return zipfile_name
        except Exception as e:
            if settings.DEBUG:
                print(traceback.print_exc())
            return None

    def work(self):
        self.generate_html() # 生成HTML
        self.generate_metainfo() # 生成元信息
        self.generate_metatype() # 生成元类型
        self.generate_toc_ncx() # 生成目录ncx
        self.generate_toc_html() # 生成目录html
        self.generate_cover() # 生成封面html
        self.generate_title_html() # 生产书籍的标题页和简介页
        self.generate_opf() # 生成content.opf
        epub_file = self.generate_epub()
        return epub_file


# 导出PDF
class ReportPDF():
    def __init__(self,project_id,user_id):
        # 查询文集信息
        self.pro_id = project_id
        self.user_id = user_id
        self.editormd_html_str = '''
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>{title}</title>
            <link rel="stylesheet" href="../../static/layui/css/layui.css" />
            <link rel="stylesheet" href="../../static/mr-marked/marked.css" />
            <link rel="stylesheet" href="../../static/mrdoc/mrdoc-docs.css" />
            <script src="../../static/jquery/3.5.0/jquery.min.js"></script>
            <script>var iframe_whitelist = []</script>
            <script src="../../static/mr-marked/marked.min.js"></script>
            <style>
            pre.linenums {{
                max-height: 100%;
            }}
            ol.linenums li {{
                width: 100%;
            }}
            /*一级无序li显示实心圆点*/
            ul li{{
                list-style:disc;
            }}
            /*二级无序li显示空心圆点*/
            ul > li > ul > li{{
                list-style-type: circle;
            }}
            /*有序li显示数字*/
            ol li{{
                list-style-type: decimal;
            }}
            ol ol ul,ol ul ul,ul ol ul,ul ul ul {{
                list-style-type: square;
            }}
            /* 三级及以下无序li显示小方块 */
            ul ul ul li{{
                list-style-type: square;
            }}
            </style>
            </head>
            <body>
                <div style="position: fixed;font-size:8px; bottom: 5px;padding: 5px; right: 10px; color: white;background: black; z-index: 10000">
                    本文件由MrDoc觅思文档生成
                </div>
                <div style="text-align:center;margin-top:400px;">
                    <h1>{project_name}</h1>
                    <p>作者：{author}</p>
                    <p>日期：{create_time}</p>
                </div>\n
                <div class="markdown-body" id="content" style="padding:0px;font-family:宋体;">
                    <textarea style="display: none;">{pre_content}</textarea>
                </div>
            <script>
                var marked = new markedParse();
                marked.getHtml({{
                    id:'content',
                    value:$("#content textarea").val(),
                    cdn:"../../static/mr-marked/",
                }})
                marked.renderGraphic()
                document.querySelector("pre").setAttribute('style',"white-space: pre-wrap");
            </script>
            </body>
            </html>
        '''
        self.vditor_html_str = ''''''
        self.iceesitor_html_str = ''''''
        self.content_str = ""

    def work(self):
        try:
            user = User.objects.get(id=self.user_id)
            project = Project.objects.get(pk=self.pro_id,create_user=user)
        except ObjectDoesNotExist:
            logger.error("查询文集或用户失败")
            return False
        except:
            logger.exception("未知异常")
            return False
        # 一次查询文集下的全部已发布文档，再构建不限层级的文档树
        doc_nodes = list(
            Doc.objects.filter(top_doc=self.pro_id, status=1).values(
                'id', 'name', 'parent_doc', 'editor_mode', 'pre_content', 'content'
            ).order_by("sort")
        )
        toc_tree = build_doc_tree(doc_nodes, child_key='children')

        def walk_docs(docs, level):
            """递归拼接不限层级的文档HTML，按文档层级使用对应的标题标签"""
            heading_tag = 'h{}'.format(min(level, 6))
            for d in docs:
                self.content_str += "\n\n<{} style='page-break-before: always;'>{}</{}>\n\n".format(
                    heading_tag, d['name'], heading_tag)
                if d['editor_mode'] in [1, 2]:
                    self.content_str += (d['pre_content'] or '') + '\n'
                elif d['editor_mode'] == 3:
                    self.content_str += (d['content'] or '') + '\n'
                walk_docs(d['children'], level + 1)

        walk_docs(toc_tree, 1)

        # 替换所有媒体文件链接
        self.content_str = self.content_str.replace('![](/media/','![](../../media/')
        # print(self.html_str.format(pre_content=self.content_str))

        # 创建写入临时HTML文件
        report_pdf_folder = settings.MEDIA_ROOT+'/report_pdf'
        is_folder = os.path.exists(report_pdf_folder)
        # 创建文件夹
        if is_folder is False:
            os.mkdir(report_pdf_folder)
        # 临时HTML和PDF文件名
        temp_file_name =  '{}_{}'.format(
            project.name,
            str(datetime.datetime.today()).replace(' ', '-').replace(':', '-')
        )
        # 临时HTML文件路径
        temp_file_path = report_pdf_folder + '/{0}.html'.format(temp_file_name)
        # PDF文件路径
        report_file_path = report_pdf_folder + '/{0}.pdf'.format(temp_file_name)
        # 写入HTML文件
        with open(temp_file_path, 'w', encoding='utf-8') as htmlfile:
            htmlfile.write(
                self.editormd_html_str.format(
                    title=html.escape(project.name),
                    # 用户可控内容（文档内容、文集名、作者名）统一HTML转义，
                    # 防止 </textarea> 闭合等注入在PDF渲染页执行任意脚本
                    pre_content=html.escape(self.content_str),
                    project_name=html.escape(project.name),
                    author=html.escape(project.create_user.first_name if project.create_user.first_name != '' else project.create_user.username),
                    create_time=str(datetime.date.today())
                )
            )

        # 执行HTML转PDF
        try:
            convert('file://'+temp_file_path,report_file_path)
        except:
            logger.exception(_("生成PDF出错"))
            return False
        # 处理PDF文件
        if os.path.exists(report_file_path):
            os.remove(temp_file_path)
            return report_file_path
        else:
            return False


# 导出Docx
class ReportDocx():
    def __init__(self,project_id):
        self.project = Project.objects.get(id=project_id)
        self.base_path = settings.MEDIA_ROOT + '/report/{}/'.format(project_id)

        self.content_str = ""
        self.doc_str = """<html xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta http-equiv=Content-Type content="text/html; charset=utf-8">
            <style type="text/css">
                table  
                {  
                    border-collapse: collapse;
                    border: none;  
                    width: 100%;  
                }  
                td,tr  
                {  
                    border: solid #CCC 1px;
                    padding:3px;
                    font-size:9pt;
                } 
                .codestyle{
                    word-break: break-all;
                    mso-highlight:rgb(252, 252, 252);
                    padding-left: 5px; background-color: rgb(252, 252, 252); border: 1px solid rgb(225, 225, 232);
                }
                img {
                    width:100;
                }
                /*预格式*/
                pre {
                  padding: 10px;
                  background: #f6f6f6;
                  border: 1px solid #ddd;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                  white-space: -moz-pre-wrap;
                  white-space: -o-pre-wrap;
                
                }
                /*块代码*/
                pre code {
                  border: none;
                  background: none;
                }
                pre ol {
                  padding-left: 2.5em;
                  margin: 0;
                }
                /*行内代码*/
                code {
                  border: 1px solid #ddd;
                  background: #f6f6f6;
                  padding: 3px;
                  border-radius: 3px;
                  font-size: 14px;
                }
                /* 引用块 */
                blockquote {
                  color: #666;
                  border-left: 4px solid #ddd;
                  padding-left: 20px;
                  margin-left: 0;
                  font-size: 14px;
                  font-style: italic;
                }
                /* 表格 */
                table {
                  display: block;
                  width: 100%;
                  overflow: auto;
                  word-break: normal;
                  word-break: keep-all;
                  margin-bottom: 16px;
                }
                thead {
                  display: table-header-group;
                  vertical-align: middle;
                  border-color: inherit;
                }
                table thead tr {
                  background-color: #F8F8F8;
                }
                table th, table td {
                  padding: 6px 13px;
                  border: 1px solid #ddd;
                }
                /*公式*/
                p.editormd-tex {
                  text-align: center;
                }
            </style>
            <meta name=ProgId content=Word.Document>
            <meta name=Generator content="Microsoft Word 11">
            <meta name=Originator content="Microsoft Word 11">
            <xml><w:WordDocument><w:View>Print</w:View></xml></head>
            <body>
        """

    def work(self):
        # 一次查询文集下的全部已发布文档，再构建不限层级的文档树
        doc_nodes = list(
            Doc.objects.filter(top_doc=self.project.id, status=1).values(
                'id', 'name', 'parent_doc', 'content'
            ).order_by("sort")
        )
        toc_tree = build_doc_tree(doc_nodes, child_key='children')

        def walk_docs(docs, level):
            """递归拼接不限层级的文档HTML，按文档层级使用对应的标题标签"""
            heading_tag = 'h{}'.format(min(level, 6))
            for d in docs:
                # 一级文档标题单独分页
                if level == 1:
                    self.content_str += "<{} style='page-break-before: always;'>{}</{}>".format(
                        heading_tag, d['name'], heading_tag)
                else:
                    self.content_str += "<{}>{}</{}>".format(heading_tag, d['name'], heading_tag)
                self.content_str += d['content'] or ''
                walk_docs(d['children'], level + 1)

        walk_docs(toc_tree, 1)

        # 使用BeautifulSoup解析拼接好的HTML文本
        soup = BeautifulSoup(self.content_str,'lxml')
        src_tag = soup.find_all(lambda tag:tag.has_attr("src")) # 查找所有包含src的标签
        print(src_tag)

        # 替换HTML文本中静态文件的相对链接为绝对链接
        for src in src_tag:
            if src['src'].startswith("/"):
                src['src'] = settings.BASE_DIR + src['src']

        is_folder = os.path.exists(self.base_path)
        # 创建文件夹
        if is_folder is False:
            os.mkdir(self.base_path)
        temp_file_name = str(datetime.datetime.today()).replace(':', '-').replace(' ', '-').replace('.', '')
        temp_file_path = self.base_path + '/{0}.docx'.format(temp_file_name)

        with open(temp_file_path, 'a+', encoding='utf-8') as htmlfile:
            htmlfile.write(self.doc_str + self.content_str + "</body></html>")

