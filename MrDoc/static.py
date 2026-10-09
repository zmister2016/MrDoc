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
from app_admin.models import SysSetting
from app_doc.models import Attachment

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