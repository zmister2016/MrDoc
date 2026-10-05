# coding:utf-8
"""钉钉文档块 → HTML。

块结构与转换规则对齐 WeKnora 的 dingtalk 连接器（markdown.go）：
- 块用字符串 `blockType` 区分：paragraph / heading / blockquote /
  orderedList / unorderedList / callout / columns / table / code / attachment / unknown
- 行内元素放在 `children` 里，用 `elementType` 区分：text / sticker / image / link
- 图片是在线地址（`properties.src`），可直接下载；附件只有不透明的 `resourceId`，

  官方没有给出下载地址，因此只能保留文件名并告警。

已知官方限制：块接口只返回第一层块，`callout` / `columns` 这类容器的嵌套正文可能取不到。
另外钉钉历史数据里把 strike 拼成过 `stike`，两个字段都要认。
"""

import json
from html import escape

LIST_BLOCKS = {'orderedlist': 'ol', 'unorderedlist': 'ul'}

# 块类型（小写）与真正载荷字段名的对应：只有列表是驼峰命名
PAYLOAD_KEYS = {
    'orderedlist': 'orderedList',
    'unorderedlist': 'unorderedList',
}

# 容器类块：正文在子块里
CONTAINER_BLOCKS = ('callout', 'columns')


def blocks_to_html(blocks):
    """块数组 → (HTML, 未知块类型集合)"""
    ctx = {'unknown': set()}
    html = _render_blocks(blocks or [], ctx)
    return html, ctx['unknown']


# ---------------------------------------------------------------------- #
# 行内元素
# ---------------------------------------------------------------------- #
def _render_inlines(elements, ctx):
    parts = []
    for element in elements or []:
        if not isinstance(element, dict):
            continue
        element_type = str(element.get('elementType') or '').strip().lower()

        if element_type in ('', 'text'):
            parts.append(_styled_text(element))
        elif element_type == 'sticker':
            parts.append(escape(((element.get('properties') or {}).get('code')) or ''))
        elif element_type == 'image':
            src = ((element.get('properties') or {}).get('src')) or ''
            if src.startswith(('http://', 'https://')):
                parts.append(f'<img src="{escape(src, quote=True)}" alt="图片">')
        elif element_type == 'link':
            label = _render_inlines(element.get('children'), ctx)
            href = ((element.get('properties') or {}).get('href')) or ''
            if not href.startswith(('http://', 'https://')):
                parts.append(label)
            else:
                parts.append(f'<a href="{escape(href, quote=True)}">{label or escape(href)}</a>')
        else:
            ctx['unknown'].add(f'inline:{element_type}')
            # 未建模的行内类型可能把文字放在 children 里，兜底取出避免丢字
            parts.append(_styled_text(element) or _render_inlines(element.get('children'), ctx))

    return ''.join(parts)


def _styled_text(element):
    text = str(element.get('text') or '').replace('\x00', '')
    if not text:
        return ''
    html = escape(text)
    if str(element.get('fonts') or '').lower() == 'monospace':
        html = f'<code>{html}</code>'
    if element.get('bold'):
        html = f'<strong>{html}</strong>'
    if element.get('italic'):
        html = f'<em>{html}</em>'
    # 钉钉历史数据把 strike 拼成过 stike，两个都认
    if element.get('strike') or element.get('stike'):
        html = f'<s>{html}</s>'
    return html


# ---------------------------------------------------------------------- #
# 块渲染
# ---------------------------------------------------------------------- #
def _render_blocks(blocks, ctx):
    parts = []
    index = 0
    while index < len(blocks):
        block = blocks[index]
        if not isinstance(block, dict):
            index += 1
            continue

        block_type = _block_type(block)
        list_tag = LIST_BLOCKS.get(block_type)
        if list_tag:
            items = []
            while index < len(blocks) and _block_type(blocks[index]) == block_type:
                items.append(f'<li>{_block_text(blocks[index], ctx)}</li>')
                index += 1
            parts.append(f'<{list_tag}>{"".join(items)}</{list_tag}>')
            continue

        rendered = _render_block(block, block_type, ctx)
        if rendered:
            parts.append(rendered)
        index += 1
    return ''.join(parts)


def _block_type(block):
    if not isinstance(block, dict):
        return ''
    return str(block.get('blockType') or '').strip().lower()


def _block_text(block, ctx):
    """块的文字：优先取 children 里的行内元素，其次取同名载荷字段里的 text"""
    inner = _render_inlines(block.get('children'), ctx)
    if inner:
        return inner
    block_type = _block_type(block)
    payload = block.get(PAYLOAD_KEYS.get(block_type, block_type)) or {}
    return escape(str(payload.get('text') or ''))


def _render_block(block, block_type, ctx):
    if block_type == 'paragraph':
        text = _block_text(block, ctx)
        return f'<p>{text}</p>' if text else ''

    if block_type == 'heading':
        text = _block_text(block, ctx)
        if not text:
            return ''
        level = (block.get('heading') or {}).get('level') or 1
        try:
            level = int(level)
        except (TypeError, ValueError):
            level = 1
        level = min(max(level, 1), 6)
        return f'<h{level}>{text}</h{level}>'

    if block_type == 'blockquote':
        text = _block_text(block, ctx)
        return f'<blockquote>{text}</blockquote>' if text else ''

    if block_type in CONTAINER_BLOCKS:
        children = block.get('children') or []
        if not children:
            # 官方块接口只返回第一层块，容器为空时无法取到嵌套正文
            ctx['unknown'].add('nested_blocks_unavailable')
            return ''
        return _render_blocks(children, ctx)

    if block_type == 'table':
        return _render_table(block, ctx)

    if block_type == 'code':
        payload = block.get('code') or {}
        language = str(payload.get('syntax') or '')
        css = f' class="language-{escape(language, quote=True)}"' if language else ''
        return f'<pre><code{css}>{escape(str(payload.get("text") or ""))}</code></pre>'

    if block_type == 'attachment':
        payload = block.get('attachment') or {}
        name = str(payload.get('name') or '附件')
        # resourceId 是不透明标识，官方未提供下载地址，只能保留文件名
        ctx['unknown'].add('attachment_not_downloadable')
        return f'<p>📎 附件：{escape(name)}（钉钉未提供下载地址，未能迁移）</p>'

    if block_type == '':
        ctx['unknown'].add('missing_block_type')
        return ''

    # 未知块：接口只给出原始类型名，部分仍带正文
    payload = block.get('unknown') or {}
    raw_type = str(payload.get('rawType') or '').strip()
    ctx['unknown'].add(f'unknown:{raw_type}' if raw_type else f'unknown:{block_type}')
    text = str(payload.get('text') or '')
    return f'<p>{escape(text)}</p>' if text else ''


def _render_table(block, ctx):
    rows = _parse_table_cells((block.get('table') or {}).get('cells'), ctx)
    if not rows:
        return ''
    body = ''.join('<tr>' + ''.join(f'<td>{cell}</td>' for cell in row) + '</tr>' for row in rows)
    return f'<table>{body}</table>'


def _parse_table_cells(raw, ctx):
    """表格单元格结构官方未明确说明，这里做兼容解析"""
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except ValueError:
            return []
    if not isinstance(raw, list):
        return []

    rows = []
    for item in raw:
        cells = item.get('cells') if isinstance(item, dict) else item
        if isinstance(cells, dict):
            cells = [cells]
        if not isinstance(cells, list):
            continue
        rows.append([_render_cell(cell, ctx) for cell in cells])
    return rows


def _render_cell(cell, ctx):
    if isinstance(cell, str):
        return escape(cell)
    if isinstance(cell, dict):
        if cell.get('children'):
            return _render_inlines(cell.get('children'), ctx)
        return escape(str(cell.get('text') or ''))
    if isinstance(cell, list):
        return _render_inlines(cell, ctx)
    return ''
