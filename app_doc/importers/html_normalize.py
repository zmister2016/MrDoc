# coding:utf-8
"""正文 HTML 归一化（跨平台共用）。

各平台取到的正文都是 HTML，差异只在两处：
1. 正文内嵌图片要换成本站已落库的地址；
2. 指向来源站点的文档互链要换成本站文档地址。

图片文件名由地址推导，且必须在「登记附件」与「改写正文」两处保持一致，
所以统一放在这里，避免每个平台各写一份导致对不上号。
"""

import posixpath
from urllib.parse import urlparse

from bs4 import BeautifulSoup

from app_doc.importers.base import SourceAttachment

IMAGE_SUFFIXES = ('png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg')
DEFAULT_IMAGE_SUFFIX = 'png'
MIME_BY_SUFFIX = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
}


def image_filename(url):
    """由图片地址推导出稳定且带扩展名的文件名。

    去掉查询串后取路径末段；缺少扩展名时补默认值，保证能被站点的图片白名单识别。
    """
    path = urlparse(url).path
    name = posixpath.basename(path) or 'image'
    suffix = name.rsplit('.', 1)[-1].lower() if '.' in name else ''
    if suffix not in IMAGE_SUFFIXES:
        name = f'{name}.{DEFAULT_IMAGE_SUFFIX}'
    return name


def image_media_type(filename):
    suffix = filename.rsplit('.', 1)[-1].lower() if '.' in filename else DEFAULT_IMAGE_SUFFIX
    return MIME_BY_SUFFIX.get(suffix, f'image/{suffix}')


def collect_images(html):
    """从正文 HTML 中收集图片附件，按地址去重。

    同一张图在多个文档中出现时 remote_id 相同，通用层会自动复用已下载的缓存。
    """
    if not html:
        return []

    soup = BeautifulSoup(html, 'html.parser')
    attachments = []
    seen = set()
    for img in soup.find_all('img'):
        src = (img.get('src') or '').strip()
        if not src.startswith(('http://', 'https://')) or src in seen:
            continue
        seen.add(src)
        filename = image_filename(src)
        attachments.append(SourceAttachment(
            filename=filename,
            remote_id=src,
            download_url=src,
            media_type=image_media_type(filename),
        ))
    return attachments


def normalize_html(html, resolve_image, resolve_page_link,
                   resolve_attachment_link=None, attachment_urls=None):
    """改写正文中的图片、附件与文档互链。

    :param resolve_image: 文件名 → 本站图片地址
    :param resolve_page_link: (标题, 空间标识) → 本站文档地址
    :param resolve_attachment_link: 文件名 → 本站附件地址
    :param attachment_urls: {来源地址: 文件名}，用于把媒体链接换算成附件
    """
    if not html:
        return ''

    soup = BeautifulSoup(html, 'html.parser')
    attachment_urls = attachment_urls or {}

    for img in soup.find_all('img'):
        src = (img.get('src') or '').strip()
        if not src.startswith(('http://', 'https://')):
            continue
        local = resolve_image(image_filename(src)) if resolve_image else None
        if local:
            img['src'] = local
        # 未落库的图片保留原地址，避免正文出现坏图

    for anchor in soup.find_all('a'):
        href = (anchor.get('href') or '').strip()
        if not href.startswith(('http://', 'https://')):
            continue

        # 先看是不是已登记的附件/媒体
        filename = attachment_urls.get(href)
        if filename and resolve_attachment_link:
            local = resolve_attachment_link(filename)
            if local:
                anchor['href'] = local
            continue

        # 再按锚文本匹配本站文档标题，改写跨文档链接
        if resolve_page_link is None:
            continue
        title = anchor.get_text(strip=True)
        if not title:
            continue
        local = resolve_page_link(title, '')
        if local:
            anchor['href'] = local

    for tag in soup.find_all(['script', 'style']):
        tag.decompose()

    return soup.decode_contents()
