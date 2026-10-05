# coding:utf-8
"""把语雀来源接入通用导入编排。

语雀与其它平台的差异只有正文（body_html 里的图片与互链需要改写），
因此这里只覆盖 `convert_body()`，其余全部复用 `app_doc.importers.pipeline`。
"""

from app_doc.importers.html_normalize import normalize_html
from app_doc.importers.pipeline import BaseImporter


class YuqueImporter(BaseImporter):
    """语雀导入器：正文归一化后交给通用层落地"""

    def convert_body(self, page, resolve_image, resolve_page_link, resolve_attachment_link):
        return normalize_html(page.body, resolve_image, resolve_page_link)
