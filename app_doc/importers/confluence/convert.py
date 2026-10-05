# coding:utf-8
"""Confluence storage format → 标准 HTML 转换。

Confluence 正文（storage format）含 ac:/ri: 私有命名空间与各类宏，
这里把它们归一化为标准 HTML，后续由通用层落成 Markdown 或富文本。

来源正文属于第三方不可信内容，净化在通用层（html_utils）统一完成。
"""

import re
from html import escape

from bs4 import BeautifulSoup, Tag
from loguru import logger

# 纯导航类宏：没有正文可保留，直接丢弃
DROPPED_MACROS = {
    'toc', 'children', 'pagetree', 'recently-updated', 'recently-updated-dashboard',
    'livesearch', 'spaces', 'attachments', 'blog-posts', 'content-by-label',
}

# 包裹式宏：取 rich-text-body 内容，以引用块呈现
QUOTE_MACROS = {'info', 'note', 'tip', 'warning', 'panel', 'expand', 'details', 'excerpt'}

# 包裹式宏的中文标签
QUOTE_LABELS = {
    'info': '信息',
    'note': '提示',
    'tip': '技巧',
    'warning': '警告',
    'panel': '面板',
    'expand': '展开',
    'details': '展开',
    'excerpt': '摘要',
}

# CDATA 段：HTML 解析器会把 <![CDATA[..]]> 当成注释处理，先转成转义文本再解析
_CDATA_RE = re.compile(r'<!\[CDATA\[(.*?)\]\]>', re.S)


def _protect_cdata(body):
    """把 CDATA 段转义为普通文本，避免 HTML 解析器误判为注释而丢失代码内容"""
    return _CDATA_RE.sub(lambda m: escape(m.group(1)), body or '')


def _new_child(soup, name):
    return soup.new_tag(name)


# ---------------------------------------------------------------------- #
# 单元素处理
# ---------------------------------------------------------------------- #
def _replace_image(soup, tag, resolve_image):
    """ac:image → <img>；无法取得图片时降级为文字占位，不静默丢内容"""
    filename = ''
    attachment = tag.find('ri:attachment')
    if attachment is not None:
        filename = attachment.get('ri:filename') or ''

    src = None
    if filename and resolve_image is not None:
        src = resolve_image(filename)

    if not src:
        # 外链图片保留原始地址；服务端不去主动抓取，避免 SSRF
        remote = tag.find('ri:url')
        remote_url = (remote.get('ri:url') or '') if remote is not None else ''
        if remote_url.startswith('http://') or remote_url.startswith('https://'):
            src = remote_url

    if src:
        img = _new_child(soup, 'img')
        img['src'] = src
        img['alt'] = filename or ''
        tag.replace_with(img)
    else:
        tag.replace_with(f'[图片未导入：{filename or "外部图片"}]')


def _replace_link(soup, tag, resolve_page_link, resolve_attachment_link):
    """ac:link → <a>；解析不到目标时保留可见文字"""
    href = None
    text = ''

    ri_page = tag.find('ri:page')
    ri_attachment = tag.find('ri:attachment')
    ri_url = tag.find('ri:url')
    ri_user = tag.find('ri:user')

    if ri_page is not None:
        title = ri_page.get('ri:content-title') or ''
        space_key = ri_page.get('ri:space-key') or ''
        text = title
        if resolve_page_link is not None:
            href = resolve_page_link(title, space_key)
    elif ri_attachment is not None:
        filename = ri_attachment.get('ri:filename') or ''
        text = filename
        if resolve_attachment_link is not None:
            href = resolve_attachment_link(filename)
    elif ri_url is not None:
        remote_url = ri_url.get('ri:url') or ''
        text = remote_url
        if remote_url.startswith('http://') or remote_url.startswith('https://'):
            href = remote_url
    elif ri_user is not None:
        key = ri_user.get('ri:userkey') or ri_user.get('ri:account-id') or ''
        text = f'@{key}' if key else '@'

    link_body = tag.find('ac:link-body') or tag.find('ac:plain-text-link-body')
    if href:
        anchor = _new_child(soup, 'a')
        anchor['href'] = href
        if link_body is not None and link_body.decode_contents().strip():
            inner = BeautifulSoup(link_body.decode_contents(), 'html.parser')
            for child in list(inner.contents):
                anchor.append(child.extract())
        else:
            anchor.string = text or href
        tag.replace_with(anchor)
    else:
        if link_body is not None and link_body.decode_contents().strip():
            tag.replace_with(link_body.decode_contents())
        else:
            tag.replace_with(text)


def _build_code_block(soup, macro):
    """code 宏 → <pre><code class="language-x">"""
    language = ''
    param = macro.find('ac:parameter', attrs={'ac:name': 'language'})
    if param is not None:
        language = param.get_text(strip=True)

    body = macro.find('ac:plain-text-body')
    code_text = body.get_text() if body is not None else ''
    if code_text.startswith('[CDATA['):
        code_text = code_text[len('[CDATA['):]
        if code_text.endswith(']]'):
            code_text = code_text[:-2]
    code_text = code_text.strip('\n')

    pre = _new_child(soup, 'pre')
    code = _new_child(soup, 'code')
    if language:
        code['class'] = f'language-{language}'
    code.string = code_text
    pre.append(code)
    return pre


def _build_quote(soup, macro, label):
    """info/note/panel/expand 等宏 → <blockquote>"""
    title = ''
    param = macro.find('ac:parameter', attrs={'ac:name': 'title'})
    if param is not None:
        title = param.get_text(strip=True)

    heading = ''
    if label and title:
        heading = f'{label}：{title}'
    elif label or title:
        heading = label or title

    blockquote = _new_child(soup, 'blockquote')
    if heading:
        paragraph = _new_child(soup, 'p')
        strong = _new_child(soup, 'strong')
        strong.string = heading
        paragraph.append(strong)
        blockquote.append(paragraph)

    body = macro.find('ac:rich-text-body')
    if body is not None:
        inner = BeautifulSoup(f'<div>{body.decode_contents()}</div>', 'html.parser')
        holder = inner.find('div')
        if holder is not None:
            for child in list(holder.contents):
                blockquote.append(child.extract())
    return blockquote


def _replace_macro(soup, macro):
    """替换单个宏（调用前保证其内部已无嵌套宏）"""
    name = (macro.get('ac:name') or '').strip().lower()

    if name == 'code':
        macro.replace_with(_build_code_block(soup, macro))
        return

    if name in DROPPED_MACROS:
        macro.decompose()
        return

    if name in QUOTE_MACROS:
        macro.replace_with(_build_quote(soup, macro, QUOTE_LABELS.get(name, '')))
        return

    # 未支持的宏：保留 rich-text-body 内容并标注，避免静默丢内容
    body = macro.find('ac:rich-text-body')
    if body is not None and body.decode_contents().strip():
        holder = BeautifulSoup(f'<div>{body.decode_contents()}</div>', 'html.parser')
        container = holder.find('div')
        note = holder.new_tag('p')
        note.string = f'[未转换的 Confluence 宏：{name}]'
        container.insert(0, note)
        macro.replace_with(container)
    else:
        logger.info(f'Confluence 导入：跳过无正文宏 {name}')
        macro.replace_with(f'[未转换的 Confluence 宏：{name}]')


def _replace_macros(soup):
    """由内向外逐层替换宏，保证嵌套宏先被处理"""
    for _ in range(50):  # 防御性上限，正常嵌套不会超过该值
        macros = soup.find_all('ac:structured-macro')
        if not macros:
            return
        innermost = [m for m in macros if m.find('ac:structured-macro') is None]
        if not innermost:
            return
        for macro in innermost:
            _replace_macro(soup, macro)


def _replace_task_list(soup, tag):
    """ac:task-list → 勾选框列表"""
    ul = _new_child(soup, 'ul')
    for task in tag.find_all('ac:task'):
        status = task.find('ac:task-status')
        body = task.find('ac:task-body')
        done = status is not None and status.get_text(strip=True).lower() == 'complete'
        text = body.get_text(strip=True) if body is not None else ''
        li = _new_child(soup, 'li')
        li.string = ('☑ ' if done else '☐ ') + text
        ul.append(li)
    tag.replace_with(ul)


# ---------------------------------------------------------------------- #
# 对外接口
# ---------------------------------------------------------------------- #
def normalize_storage(body, resolve_image=None, resolve_page_link=None,
                      resolve_attachment_link=None):
    """把 Confluence storage 正文（或 HTML 导出正文）归一化为标准 HTML。

    :param resolve_image: callable(filename) -> 本地图片URL 或 None
    :param resolve_page_link: callable(title, space_key) -> 本地文档URL 或 None
    :param resolve_attachment_link: callable(filename) -> 附件URL 或 None
    """
    if not body:
        return ''

    soup = BeautifulSoup(_protect_cdata(body), 'html.parser')

    for tag in soup.find_all('ac:image'):
        _replace_image(soup, tag, resolve_image)

    for tag in soup.find_all('ac:link'):
        _replace_link(soup, tag, resolve_page_link, resolve_attachment_link)

    _replace_macros(soup)

    for tag in soup.find_all('ac:task-list'):
        _replace_task_list(soup, tag)

    for tag in soup.find_all('ac:emoticon'):
        tag.replace_with(tag.get('ac:name') or '')
    for tag in soup.find_all('ac:date'):
        tag.replace_with(tag.get('ac:date') or '')
    for tag in soup.find_all('ac:time'):
        tag.replace_with(tag.get('ac:time') or '')
    for tag in soup.find_all('ac:placeholder'):
        tag.decompose()

    # 布局容器与行内批注标记：解包，保留内部内容
    for name in ('ac:layout', 'ac:layout-section', 'ac:layout-cell', 'ac:inline-comment-marker'):
        for tag in soup.find_all(name):
            tag.unwrap()

    # 兜底：清理残留的 ac:/ri: 命名空间标签
    leftovers = soup.find_all(
        lambda t: isinstance(t, Tag) and (t.name.startswith('ac:') or t.name.startswith('ri:')))
    for tag in leftovers:
        if tag.name in ('ac:parameter', 'ac:plain-text-body'):
            tag.decompose()
        else:
            tag.unwrap()

    return str(soup)
