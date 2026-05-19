# coding:utf-8

ALLOWED_TAGS = [
    'p', 'br',
    'strong', 'b', 'em', 'i', 'u',
    'ul', 'ol', 'li',
    'a',
    'img',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote',
    'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    # 表格
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    # 文本样式
    'span', 'div',  # 配合 style 白名单使用
    'sub', 'sup',   # 上下标
    'small', 'big',
    'hr',           # 水平分割线
    # 多媒体
    'iframe',       # 谨慎，建议配合域名白名单
    'audio', 'video', 'source',
    # 语义/布局
    'header', 'footer', 'section', 'article', 'aside', 'nav',
    'figure', 'figcaption',
    # 列表增强
    'dl', 'dt', 'dd',
]

ALLOWED_ATTRIBUTES = {
    # 全局允许的属性（所有标签都能用）
    '*': ['style', 'class', 'id', 'title', 'lang', 'dir'],

    # 链接相关
    'a': ['href', 'title', 'target', 'rel', 'name'],

    # 图片相关
    'img': ['src', 'alt', 'title', 'width', 'height', 'align'],

    # 表格相关（这是关键！）
    'table': ['border', 'cellpadding', 'cellspacing', 'width', 'style', 'class', 'id', 'summary'],
    'td': ['colspan', 'rowspan', 'align', 'valign', 'width', 'style', 'class', 'id'],
    'th': ['colspan', 'rowspan', 'scope', 'align', 'valign', 'width', 'style', 'class', 'id'],
    'tr': ['align', 'valign', 'style', 'class', 'id'],
    'thead': ['align', 'valign', 'style', 'class', 'id'],
    'tbody': ['align', 'valign', 'style', 'class', 'id'],

    # 布局与区块
    'div': ['style', 'class', 'id', 'align'],
    'span': ['style', 'class', 'id'],

    # 列表
    'ul': ['style', 'class', 'id', 'type'],
    'ol': ['style', 'class', 'id', 'type', 'start'],
    'li': ['style', 'class', 'id', 'value'],

    # 标题与段落
    'h1': ['style', 'class', 'id', 'align'],
    'h2': ['style', 'class', 'id', 'align'],
    'h3': ['style', 'class', 'id', 'align'],
    'h4': ['style', 'class', 'id', 'align'],
    'h5': ['style', 'class', 'id', 'align'],
    'h6': ['style', 'class', 'id', 'align'],
    'p': ['style', 'class', 'id', 'align'],

    # 多媒体（注意 iframe 的安全风险）
    'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'sandbox'],
    'audio': ['src', 'controls', 'autoplay', 'loop', 'preload'],
    'video': ['src', 'controls', 'autoplay', 'loop', 'preload', 'width', 'height', 'poster'],
    'source': ['src', 'type'],

    # 引用与代码
    'blockquote': ['cite', 'style', 'class', 'id'],
    'pre': ['style', 'class'],
    'code': ['style', 'class'],

    # 其他常用
    'hr': ['style', 'class', 'id', 'width', 'size', 'noshade'],
    'br': [],
    'dl': ['style', 'class', 'id'],
    'dt': ['style', 'class', 'id'],
    'dd': ['style', 'class', 'id'],
}

ALLOWED_PROTOCOLS = ['http', 'https', 'mailto']

def sanitize_html(html):
    import bleach
    return bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=ALLOWED_PROTOCOLS,
        strip=True
    )