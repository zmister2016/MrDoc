"""
Views and functions for serving static files. These are only to be used
during development, and SHOULD NOT be used in a production setting.

"""
import mimetypes
import posixpath
import re
import os
from pathlib import Path

from django.http import (
    FileResponse, Http404, HttpResponse, HttpResponseNotModified,
)
from django.shortcuts import render
from django.template import Context, Engine, TemplateDoesNotExist, loader
from django.utils._os import safe_join
from django.utils.http import http_date, parse_http_date
from django.utils.translation import gettext as _, gettext_lazy
from wsgiref.util import FileWrapper
from django.http import StreamingHttpResponse
from django.conf import settings
from django.views.static import serve
from app_admin.models import SysSetting
from app_doc.models import Attachment

# 站点备份文件下载（仅超级管理员可下载）
def backup_download(request, filename):
    if not request.user.is_authenticated or not request.user.is_superuser:
        raise Http404(_('"%(path)s" 不存在') % {'path': filename})
    # 只接受备份自身生成的文件名（兼容旧版 mrdoc_backup_<ts>.zip 命名），杜绝路径穿越与任意文件读取
    if not re.match(r'^mrdoc_backup_(data_|media_)?\d+\.zip$', filename):
        raise Http404(_('"%(path)s" 不存在') % {'path': filename})
    fullpath = Path(safe_join(settings.BACKUP_DIR, filename))
    if not fullpath.is_file():
        raise Http404(_('"%(path)s" 不存在') % {'path': filename})
    return FileResponse(fullpath.open('rb'), as_attachment=True, filename=filename)


# 旧备份路径封堵：文件已迁出 MEDIA_ROOT，/media/backup/ 一律 404
def backup_legacy_deny(request, path=''):
    raise Http404(_('"%(path)s" 不存在') % {'path': path})

# /media/ 通用文件服务：先归一化路径再判断，封堵 /media//backup/、/media/./backup/ 等变体
def media_serve(request, path, document_root=None, show_indexes=False):
    path = posixpath.normpath(path).lstrip('/')
    if '\\' in path or path == '..' or path.startswith('../'):
        raise Http404(_('"%(path)s" 不存在') % {'path': path})
    # 大小写不敏感，并兼容 Windows 忽略目录名末尾的点/空格
    first_seg = path.split('/', 1)[0].rstrip(' .').lower()
    if first_seg == 'backup':
        raise Http404(_('"%(path)s" 不存在') % {'path': path})
    return serve(request, path, document_root=document_root, show_indexes=show_indexes)

# robots 协议文件：优先读取 config 目录下的 robots.txt，不存在时使用 template 目录下的 robots.txt
def robots_txt_serve(request):
    config_robots = os.path.join(settings.CONFIG_DIR, 'robots.txt')
    if os.path.exists(config_robots):
        return FileResponse(open(config_robots, 'rb'), content_type="text/plain")
    return render(request, 'robots.txt', content_type="text/plain")

# llms 协议文件：优先读取 config 目录下的 llms.txt，不存在时返回404
def llms_txt_serve(request):
    config_llms = os.path.join(settings.CONFIG_DIR, 'llms.txt')
    if os.path.exists(config_llms):
        return FileResponse(open(config_llms, 'rb'), content_type="text/plain")
    return Http404(_("404 Not Found: /llms.txt 不存在"))

# 扩展根目录文本文件：优先读取 config 目录下的指定文件，不存在时回退到 template 目录渲染
def extend_root_txt_serve(request, filename):
    config_file = os.path.join(settings.CONFIG_DIR, filename)
    if os.path.exists(config_file):
        return FileResponse(open(config_file, 'rb'), content_type="text/plain")
    try:
        return render(request, filename, content_type="text/plain")
    except TemplateDoesNotExist:
        raise Http404(_("404 Not Found: /%s 不存在") % filename)