# coding:utf-8
"""飞书正文改写。

飞书的图片与附件不是可直接访问的 URL，而是需要 app 凭据的媒体接口，
所以不能复用通用的「按地址改写」逻辑，这里改为「按 media token 改写」：

- `<img data-token>` → 本站图片地址
- `<a data-token>`   → 本站附件地址
- 其余指向飞书的文档链接 → 按锚文本匹配本站文档标题
"""

from bs4 import BeautifulSoup

from app_doc.importers.feishu.blocks import IMAGE_SUFFIX


def normalize_feishu_html(html, resolve_image, resolve_page_link, resolve_attachment_link):
    if not html:
        return ''

    soup = BeautifulSoup(html, 'html.parser')

    for img in soup.find_all('img'):
        token = img.get('data-token') or ''
        if not token:
            continue
        local = resolve_image(f'{token}.{IMAGE_SUFFIX}') if resolve_image else None
        if local:
            img['src'] = local
            img.attrs.pop('data-token', None)
        else:
            # 未落库时不留无效占位，避免正文出现坏图
            img.decompose()

    for anchor in soup.find_all('a'):
        token = anchor.get('data-token') or ''
        if token:
            name = anchor.get_text(strip=True)
            local = resolve_attachment_link(name) if (name and resolve_attachment_link) else None
            if local:
                anchor['href'] = local
            anchor.attrs.pop('data-token', None)
            continue

        href = (anchor.get('href') or '').strip()
        if not href.startswith(('http://', 'https://')) or resolve_page_link is None:
            continue
        title = anchor.get_text(strip=True)
        if not title:
            continue
        local = resolve_page_link(title, '')
        if local:
            anchor['href'] = local

    return soup.decode_contents()
