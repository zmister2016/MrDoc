# coding:utf-8
"""把飞书来源接入通用导入编排。

飞书与其它平台的差异只有正文（块树已转成 HTML，其中的图片、附件与文档内链需要改写），
因此这里只覆盖 `convert_body()`，其余全部复用 `app_doc.importers.pipeline`。
"""

from app_doc.importers.feishu.convert import normalize_feishu_html
from app_doc.importers.pipeline import BaseImporter


class FeishuImporter(BaseImporter):
    """飞书导入器：正文归一化后交给通用层落地"""

    def convert_body(self, page, resolve_image, resolve_page_link, resolve_attachment_link):
        return normalize_feishu_html(page.body, resolve_image, resolve_page_link,
                                     resolve_attachment_link)
