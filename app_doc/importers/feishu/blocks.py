# coding:utf-8
"""飞书 docx 块数组 → HTML。

飞书文档的块是**扁平数组**（不是树），每个块用整数 `block_type` 区分类型，
并用 `children` 记录子块 ID；原生表格的单元格也作为独立块存在，
需要先标记出「被表格消费掉的块」，避免同一段文字被渲染两次。

块类型编号与处理方式对齐 WeKnora 的 feishu 连接器（core/blocks.go、core/markdown.go）。

与 WeKnora 的一处关键差异：它面向 RAG，图片一律丢弃（渲染成 `![图片]()`）；
本项目是文档迁移，图片与附件必须保留，因此这里改为登记媒体、由上层下载落库。
"""

from html import escape

BLOCK_PAGE = 1
BLOCK_TEXT = 2
BLOCK_HEADING1 = 3
BLOCK_HEADING9 = 11
BLOCK_BULLET = 12
BLOCK_ORDERED = 13
BLOCK_CODE = 14
BLOCK_QUOTE = 15
BLOCK_TODO = 17
BLOCK_BITABLE = 18
BLOCK_CALLOUT = 19
BLOCK_DIVIDER = 22
BLOCK_FILE = 23
BLOCK_IMAGE = 27
BLOCK_SHEET = 30
BLOCK_TABLE = 31
BLOCK_TABLE_CELL = 32

# 列表类块：连续的同类块合并成一个 <ul>/<ol>
LIST_TYPES = {BLOCK_BULLET: 'ul', BLOCK_ORDERED: 'ol', BLOCK_TODO: 'ul'}

# 承载富文本的字段名（标题类由编号推导）
TEXT_FIELD_NAMES = {
    BLOCK_TEXT: 'text',
    BLOCK_BULLET: 'bullet',
    BLOCK_ORDERED: 'ordered',
    BLOCK_CODE: 'code',
    BLOCK_QUOTE: 'quote',
    BLOCK_TODO: 'todo',
    BLOCK_CALLOUT: 'callout',
}

# 图片没有原始扩展名，统一按 png 命名（飞书图片 token 不带类型信息）
IMAGE_SUFFIX = 'png'


def blocks_to_html(blocks):
    """扁平块数组 → (HTML, 媒体清单)。

    媒体清单元素形如 {'token', 'filename', 'media_type', 'kind'}，
    由来源层登记为附件并在下载时补上文档 ID。
    """
    by_id = {block.get('block_id'): block for block in blocks or [] if block.get('block_id')}
    ctx = {'by_id': by_id, 'media': []}
    consumed = _table_descendants(blocks, by_id)
    html = _render_blocks(blocks or [], consumed, ctx)
    return html, ctx['media']


# ---------------------------------------------------------------------- #
# 富文本
# ---------------------------------------------------------------------- #
def rich_text_to_html(elements):
    """富文本片段 → HTML，保留加粗/斜体/删除线/下划线/行内代码/链接/公式/提及"""
    parts = []
    for element in elements or []:
        if element.get('text_run') is not None:
            run = element.get('text_run') or {}
            text = run.get('content') or ''
            if not text:
                continue
            style = run.get('text_element_style') or {}
            html = escape(text)
            if style.get('inline_code'):
                html = f'<code>{html}</code>'
            if style.get('bold'):
                html = f'<strong>{html}</strong>'
            if style.get('italic'):
                html = f'<em>{html}</em>'
            if style.get('strikethrough'):
                html = f'<s>{html}</s>'
            if style.get('underline'):
                html = f'<u>{html}</u>'
            link = (style.get('link') or {}).get('url')
            if link:
                html = f'<a href="{escape(link, quote=True)}">{html}</a>'
            parts.append(html)

        elif element.get('equation') is not None:
            expression = (element.get('equation') or {}).get('content') or ''
            parts.append(f'<code>{escape(expression)}</code>')

        elif element.get('mention_doc') is not None:
            mention = element.get('mention_doc') or {}
            title = mention.get('title') or ''
            url = mention.get('url') or ''
            if title:
                # 锚文本是目标文档标题，通用层会据此改写成本站地址
                parts.append(f'<a href="{escape(url, quote=True)}">{escape(title)}</a>')

        elif element.get('mention_user') is not None:
            name = (element.get('mention_user') or {}).get('name') or ''
            if name:
                parts.append(f'@{escape(name)}')

    return ''.join(parts)


def _text_elements(block):
    """取块上的富文本片段"""
    block_type = block.get('block_type')
    if BLOCK_HEADING1 <= block_type <= BLOCK_HEADING9:
        field = block.get(f'heading{block_type - BLOCK_HEADING1 + 1}')
    else:
        field = block.get(TEXT_FIELD_NAMES.get(block_type, 'text'))
    field = field or block.get('text') or {}
    return field.get('elements')


def _plain_text(block):
    parts = []
    for element in _text_elements(block) or []:
        run = element.get('text_run')
        if run:
            parts.append(run.get('content') or '')
    return ''.join(parts)


# ---------------------------------------------------------------------- #
# 块渲染
# ---------------------------------------------------------------------- #
def _render_blocks(blocks, consumed, ctx):
    parts = []
    index = 0
    while index < len(blocks):
        block = blocks[index]
        block_id = block.get('block_id')
        block_type = block.get('block_type')

        # 页面容器本身没有内容；表格单元格由表格渲染器负责
        if block_id in consumed or block_type in (BLOCK_PAGE, BLOCK_TABLE_CELL):
            index += 1
            continue

        list_tag = LIST_TYPES.get(block_type)
        if list_tag:
            items = []
            while index < len(blocks):
                current = blocks[index]
                if (current.get('block_type') != block_type
                        or current.get('block_id') in consumed):
                    break
                items.append(_render_list_item(current))
                index += 1
            parts.append(f'<{list_tag}>{"".join(items)}</{list_tag}>')
            continue

        rendered = _render_block(block, ctx)
        if rendered:
            parts.append(rendered)
        index += 1

    return ''.join(parts)


def _render_list_item(block):
    text = rich_text_to_html(_text_elements(block))
    if block.get('block_type') == BLOCK_TODO:
        text = f'<input type="checkbox" disabled> {text}'
    return f'<li>{text}</li>'


def _render_block(block, ctx):
    block_type = block.get('block_type')

    if block_type == BLOCK_TEXT:
        text = rich_text_to_html(_text_elements(block))
        return f'<p>{text}</p>' if text else ''

    if BLOCK_HEADING1 <= block_type <= BLOCK_HEADING9:
        level = min(block_type - BLOCK_HEADING1 + 1, 6)   # HTML 只有 h1~h6
        text = rich_text_to_html(_text_elements(block))
        return f'<h{level}>{text}</h{level}>' if text else ''

    if block_type == BLOCK_CODE:
        return f'<pre><code>{escape(_plain_text(block))}</code></pre>'

    if block_type == BLOCK_QUOTE:
        return f'<blockquote>{rich_text_to_html(_text_elements(block))}</blockquote>'

    if block_type == BLOCK_CALLOUT:
        # 标注块是容器，正文通常在子块里，这里只输出它自带的行内文字
        text = rich_text_to_html(_text_elements(block))
        return f'<blockquote>{text}</blockquote>' if text else ''

    if block_type == BLOCK_DIVIDER:
        return '<hr>'

    if block_type == BLOCK_IMAGE:
        return _render_image(block, ctx)

    if block_type == BLOCK_FILE:
        return _render_file(block, ctx)

    if block_type == BLOCK_TABLE:
        return _render_table(block, ctx)

    if block_type in (BLOCK_SHEET, BLOCK_BITABLE):
        label = '电子表格' if block_type == BLOCK_SHEET else '多维表格'
        return f'<p>（飞书{label}暂不支持迁移）</p>'

    return ''


def _render_image(block, ctx):
    token = (block.get('image') or {}).get('token') or ''
    if not token:
        return ''
    filename = f'{token}.{IMAGE_SUFFIX}'
    ctx['media'].append({
        'token': token,
        'filename': filename,
        'media_type': f'image/{IMAGE_SUFFIX}',
        'kind': 'image',
    })
    # 用占位地址承载 token，正文改写阶段再换成本站图片地址
    return f'<figure><img src="feishu-media:{token}" data-token="{token}" alt="图片"></figure>'


def _render_file(block, ctx):
    file_info = block.get('file') or {}
    token = file_info.get('token') or ''
    if not token:
        return ''
    name = file_info.get('name') or token
    ctx['media'].append({
        'token': token,
        'filename': name,
        'media_type': '',
        'kind': 'file',
    })
    return f'<p><a href="feishu-media:{token}" data-token="{token}">{escape(name)}</a></p>'


def _render_table(block, ctx):
    table = block.get('table') or {}
    cells = table.get('cells') or []
    column_size = (table.get('property') or {}).get('column_size') or 0
    if not cells or column_size <= 0:
        return ''

    rows = []
    for start in range(0, len(cells), column_size):
        row = cells[start:start + column_size]
        rows.append('<tr>' + ''.join(
            f'<td>{_cell_text(cell_id, ctx)}</td>' for cell_id in row) + '</tr>')
    return f'<table>{"".join(rows)}</table>'


def _cell_text(cell_id, ctx):
    """单元格块 → 文字：取它所有子块的富文本"""
    cell = ctx['by_id'].get(cell_id) or {}
    parts = []
    for child_id in cell.get('children') or []:
        child = ctx['by_id'].get(child_id) or {}
        text = rich_text_to_html(_text_elements(child))
        if text:
            parts.append(text)
    return '<br>'.join(parts)


def _table_descendants(blocks, by_id):
    """标记被原生表格消费掉的块，避免内容被渲染两次。

    图片与附件块不标记：表格渲染器只取文字，媒体仍需由主循环输出，否则会丢。
    """
    consumed = set()

    def mark(block_id):
        if block_id in consumed:
            return
        block = by_id.get(block_id)
        if block is None:
            return
        if block.get('block_type') in (BLOCK_FILE, BLOCK_IMAGE):
            return
        consumed.add(block_id)
        for child_id in block.get('children') or []:
            mark(child_id)

    for block in blocks or []:
        if block.get('block_type') != BLOCK_TABLE:
            continue
        table = block.get('table') or {}
        # 表格结构不完整时不消费单元格，让它们按普通段落输出，避免整段丢失
        if not table.get('cells') or not (table.get('property') or {}).get('column_size'):
            continue
        for cell_id in table.get('cells') or []:
            mark(cell_id)

    return consumed


def iter_object_types(blocks):
    """产出文档中出现的、暂不支持的嵌入类型（表格 / 多维表格）"""
    for block in blocks or []:
        block_type = block.get('block_type')
        if block_type in (BLOCK_SHEET, BLOCK_BITABLE):
            yield block_type
