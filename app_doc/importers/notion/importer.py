# coding:utf-8
"""把 Notion 来源接入通用导入编排。

Notion 与其它平台的差异只有正文（块树已转成 HTML，其中的图片、附件与页面互链需要改写），
因此这里只覆盖 `convert_body()`，其余全部复用 `app_doc.importers.pipeline`。
"""

from app_doc.importers.html_normalize import normalize_html
from app_doc.importers.pipeline import BaseImporter


class NotionImporter(BaseImporter):
    """Notion 导入器：正文归一化后交给通用层落地"""

    def convert_body(self, page, resolve_image, resolve_page_link, resolve_attachment_link):
        # 媒体块渲染成 <a href="签名直链">，用地址反查已落库的附件
        attachment_urls = {a.download_url: a.filename for a in (page.attachments or [])}
        return normalize_html(page.body, resolve_image, resolve_page_link,
                              resolve_attachment_link, attachment_urls)
