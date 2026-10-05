# coding:utf-8
"""正文落地：归一化后的 HTML → 站点文档内容（跨平台通用）。

与站内保存口径保持一致：
- Markdown 编辑器（模式 1/2）：pre_content 存 Markdown 源码，content 为空（渲染时转换）
- 富文本编辑器（模式 3）：pre_content 与 content 均为净化后的 HTML

安全约定：来源正文属于第三方不可信内容，落地前统一经 sanitize_html 过滤，
防止把来源站点正文里的脚本/事件属性带进本站。
"""

from html import escape

from markdownify import markdownify

from app_doc.utils_ext.doc_content_sanitize import sanitize_html


def _code_language(pre_tag):
    """从 <pre><code class="language-x"> 中取回代码语言，避免代码块丢失高亮标注"""
    code = pre_tag.find('code') if hasattr(pre_tag, 'find') else None
    if code is None:
        return None
    classes = code.get('class') or []
    if isinstance(classes, str):
        classes = classes.split()
    for name in classes:
        if name.startswith('language-'):
            return name[len('language-'):] or None
    return None


def to_markdown(html):
    """HTML → Markdown（标题使用 ATX 风格，与项目内 docx 导入保持一致）"""
    if not html:
        return ''
    return markdownify(
        html,
        heading_style='ATX',
        strip=['script', 'style'],
        code_language_callback=_code_language,
    ).strip()


def build_doc_content(html, editor_mode):
    """按编辑器模式生成 (pre_content, content)"""
    clean = sanitize_html(html or '')
    if int(editor_mode) in (1, 2):
        return to_markdown(clean), None
    return clean, clean


def append_attachment_links(pre_content, content, editor_mode, items):
    """在正文末尾追加附件下载列表。

    :param items: [(文件名, 下载URL), ...]，已成功入库的附件
    """
    if not items:
        return pre_content, content

    if int(editor_mode) in (1, 2):
        lines = ['', '', '---', '', '**附件**', '']
        for name, url in items:
            lines.append(f'- [{name}]({url})')
        pre_content = (pre_content or '') + '\n'.join(lines) + '\n'
        return pre_content, content

    html = ['<hr><p><strong>附件</strong></p><ul>']
    for name, url in items:
        html.append(f'<li><a href="{escape(url, quote=True)}">{escape(name)}</a></li>')
    html.append('</ul>')
    suffix = ''.join(html)
    return (pre_content or '') + suffix, (content or '') + suffix
