# coding:utf-8
"""把钉钉文档来源接入通用导入编排。

钉钉正文里的图片是可直接访问的在线地址，因此可以复用通用的按地址改写逻辑，
这里只覆盖 `convert_body()`，其余全部复用 `app_doc.importers.pipeline`。
"""

from app_doc.importers.html_normalize import normalize_html
from app_doc.importers.pipeline import BaseImporter


class DingTalkImporter(BaseImporter):
    """钉钉文档导入器：正文归一化后交给通用层落地"""

    def convert_body(self, page, resolve_image, resolve_page_link, resolve_attachment_link):
        return normalize_html(page.body, resolve_image, resolve_page_link)
