# coding:utf-8
"""Notion 块（block）树 → HTML。

Notion 的正文以块树返回，这里按块类型翻译成 HTML，并顺带登记媒体文件。

媒体必须在这里登记，因为 Notion 的文件地址是带签名的 S3 直链（约 1 小时后失效），
只有在导入当下立刻下载才能拿到内容。

块类型清单对齐 WeKnora 的 Notion 连接器（markdown.go），逐类覆盖。
"""

import mimetypes
import posixpath
from html import escape
from urllib.parse import urlparse

from app_doc.importers.html_normalize import image_filename, image_media_type

# 连续的同类型列表项会合并成一个 <ul>/<ol>
LIST_BLOCKS = {
    'bulleted_list_item': 'ul',
    'numbered_list_item': 'ol',
    'to_do': 'ul',
}

HEADING_LEVELS = {
    'heading_1': 1,
    'heading_2': 2,
    'heading_3': 3,
    'heading_4': 4,
}

# 需要登记为附件并改写链接的媒体块
MEDIA_BLOCKS = ('image', 'file', 'pdf', 'video', 'audio')

# 仅用于导航、对迁移无意义的块
SKIPPED_BLOCKS = ('unsupported', 'breadcrumb', 'table_of_contents', 'template')


def blocks_to_html(blocks):
    """块树 → (HTML, 媒体清单)。

    媒体清单元素形如 {'url', 'filename', 'media_type', 'kind'}。
    """
    media = []
    html = render_blocks(blocks or [], media)
    return html, media


# ---------------------------------------------------------------------- #
# 富文本
# ---------------------------------------------------------------------- #
def rich_text_to_html(elements):
    """富文本片段 → HTML，保留加粗/斜体/删除线/下划线/行内代码/链接"""
    parts = []
    for element in elements or []:
        annotations = element.get('annotations') or {}

        if element.get('type') == 'equation':
            expression = (element.get('equation') or {}).get('expression') or ''
            parts.append(f'<code>{escape(expression)}</code>')
            continue

        text = element.get('plain_text')
        if text is None:
            text = (element.get('text') or {}).get('content') or ''
        if not text:
            continue

        html = escape(text)
        if annotations.get('code'):
            html = f'<code>{html}</code>'
        if annotations.get('bold'):
            html = f'<strong>{html}</strong>'
        if annotations.get('italic'):
            html = f'<em>{html}</em>'
        if annotations.get('strikethrough'):
            html = f'<s>{html}</s>'
        if annotations.get('underline'):
            html = f'<u>{html}</u>'

        href = element.get('href')
        if href:
            html = f'<a href="{escape(href, quote=True)}">{html}</a>'
        parts.append(html)
    return ''.join(parts)


def plain_text(elements):
    """富文本片段 → 纯文本（代码块等不能用 HTML 标签的场景）"""
    parts = []
    for element in elements or []:
        text = element.get('plain_text')
        if text is None:
            text = (element.get('text') or {}).get('content') or ''
        parts.append(text)
    return ''.join(parts)


# ---------------------------------------------------------------------- #
# 块渲染
# ---------------------------------------------------------------------- #
def render_blocks(blocks, media):
    parts = []
    index = 0
    while index < len(blocks):
        block = blocks[index]
        list_tag = LIST_BLOCKS.get(block.get('type'))
        if list_tag:
            items = []
            while index < len(blocks) and blocks[index].get('type') == block.get('type'):
                items.append(_render_list_item(blocks[index], list_tag, media))
                index += 1
            parts.append(f'<{list_tag}>{"".join(items)}</{list_tag}>')
            continue

        rendered = _render_block(block, media)
        if rendered:
            parts.append(rendered)
        index += 1

    return ''.join(parts)


def _render_list_item(block, list_tag, media):
    content = block.get('content') or {}
    text = rich_text_to_html(content.get('rich_text'))
    if block.get('type') == 'to_do':
        checked = ' checked' if content.get('checked') else ''
        text = f'<input type="checkbox" disabled{checked}> {text}'
    nested = render_blocks(block.get('children') or [], media)
    return f'<li>{text}{nested}</li>'


def _render_block(block, media):
    block_type = block.get('type') or ''
    content = block.get('content') or {}
    children = block.get('children') or []

    if block_type in SKIPPED_BLOCKS:
        return ''

    if block_type == 'paragraph':
        text = rich_text_to_html(content.get('rich_text'))
        return f'<p>{text}{render_blocks(children, media)}</p>' if text or children else ''

    level = HEADING_LEVELS.get(block_type)
    if level:
        text = rich_text_to_html(content.get('rich_text'))
        return f'<h{level}>{text}</h{level}>{render_blocks(children, media)}'

    if block_type == 'code':
        language = content.get('language') or ''
        code = escape(plain_text(content.get('rich_text')))
        css = f' class="language-{escape(language, quote=True)}"' if language else ''
        return f'<pre><code{css}>{code}</code></pre>'

    if block_type in ('quote', 'meeting_notes'):
        text = rich_text_to_html(content.get('rich_text'))
        return f'<blockquote>{text}{render_blocks(children, media)}</blockquote>'

    if block_type == 'callout':
        icon = _callout_icon(content)
        text = rich_text_to_html(content.get('rich_text'))
        prefix = f'{escape(icon)} ' if icon else ''
        return f'<blockquote>{prefix}{text}{render_blocks(children, media)}</blockquote>'

    if block_type == 'toggle':
        summary = rich_text_to_html(content.get('rich_text'))
        return (f'<details><summary>{summary}</summary>'
                f'{render_blocks(children, media)}</details>')

    if block_type == 'divider':
        return '<hr>'

    if block_type == 'equation':
        expression = content.get('expression') or ''
        return f'<p>$${escape(expression)}$$</p>'

    if block_type == 'table':
        rows = ''.join(_render_table_row(row, media) for row in children)
        return f'<table>{rows}</table>'

    if block_type in MEDIA_BLOCKS:
        return _render_media(block_type, content, media)

    if block_type in ('bookmark', 'link_preview', 'embed'):
        url = content.get('url') or ''
        caption = rich_text_to_html(content.get('caption')) or escape(url)
        return f'<p><a href="{escape(url, quote=True)}">{caption}</a></p>' if url else ''

    if block_type == 'link_to_page':
        target = content.get('page_id') or content.get('database_id') or ''
        if not target:
            return ''
        href = f'https://www.notion.so/{target.replace("-", "")}'
        return f'<p><a href="{href}">Notion 页面</a></p>'

    if block_type == 'child_page':
        title = content.get('title') or '未命名页面'
        href = f'https://www.notion.so/{(block.get("id") or "").replace("-", "")}'
        # 锚文本即子页面标题，通用层会据此把链接改写到本站文档
        return f'<p><a href="{href}">{escape(title)}</a></p>'

    if block_type == 'child_database':
        title = content.get('title') or '未命名数据库'
        return f'<p><strong>{escape(title)}</strong>（Notion 数据库暂不支持迁移）</p>'

    # column_list / column / tab_list / tab / synced_block：直接摊平子块
    return render_blocks(children, media)


def _render_table_row(row, media):
    cells = (row.get('content') or {}).get('cells') or []
    return '<tr>' + ''.join(f'<td>{rich_text_to_html(cell)}</td>' for cell in cells) + '</tr>'


def _render_media(block_type, content, media):
    file_obj = {
        'file': content.get('file'),
        'external': content.get('external'),
        'type': content.get('type'),
    }
    url = _file_url(file_obj)
    if not url:
        return ''

    caption = rich_text_to_html(content.get('caption'))

    if block_type == 'image':
        filename = image_filename(url)
        media.append({
            'url': url,
            'filename': filename,
            'media_type': image_media_type(filename),
            'kind': 'image',
        })
        alt = escape(plain_text(content.get('caption')))
        figure = f'<img src="{escape(url, quote=True)}" alt="{alt}">'
        if caption:
            figure += f'<figcaption>{caption}</figcaption>'
        return f'<figure>{figure}</figure>'

    name = content.get('name') or _basename(url)
    media_type = mimetypes.guess_type(name)[0] or 'application/octet-stream'
    media.append({
        'url': url,
        'filename': name,
        'media_type': media_type,
        'kind': 'file',
    })
    label = caption or escape(name)
    return f'<p><a href="{escape(url, quote=True)}">{label}</a></p>'


def _file_url(file_obj):
    if not file_obj:
        return ''
    hosted = file_obj.get('file') or {}
    if hosted.get('url'):
        return hosted['url']
    external = file_obj.get('external') or {}
    return external.get('url') or ''


def _basename(url):
    name = posixpath.basename(urlparse(url).path)
    return name or 'attachment'


def _callout_icon(content):
    icon = content.get('icon') or {}
    if icon.get('type') == 'emoji':
        return icon.get('emoji') or ''
    return ''


def iter_child_pages(blocks):
    """遍历块树，产出所有子页面 ID（child_page 块的 ID 即页面 ID）"""
    for block in blocks:
        if block.get('type') == 'child_page' and block.get('id'):
            yield block.get('id')
        for child_id in iter_child_pages(block.get('children') or []):
            yield child_id


def iter_child_databases(blocks):
    """遍历块树，产出所有子数据库 ID"""
    for block in blocks:
        if block.get('type') == 'child_database' and block.get('id'):
            yield block.get('id')
        for db_id in iter_child_databases(block.get('children') or []):
            yield db_id
