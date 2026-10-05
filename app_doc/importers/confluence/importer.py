# coding:utf-8
"""把 Confluence 来源接入通用导入编排。

Confluence 与其它平台的唯一差异是正文为 storage format，
因此这里只覆盖 `convert_body()`，其余（建文集、建文档树、图片附件落库、
内链改写、幂等跳过）全部复用 `app_doc.importers.pipeline`。
"""

from app_doc.importers.confluence.convert import normalize_storage
from app_doc.importers.pipeline import BaseImporter, run_import


class ConfluenceImporter(BaseImporter):
    """Confluence 导入器：正文先由 storage format 归一化为标准 HTML"""

    def convert_body(self, page, resolve_image, resolve_page_link, resolve_attachment_link):
        return normalize_storage(
            page.body,
            resolve_image=resolve_image,
            resolve_page_link=resolve_page_link,
            resolve_attachment_link=resolve_attachment_link,
        )


def import_confluence(source, state, options, spaces):
    """按空间依次导入 Confluence 内容，返回统计列表"""
    return run_import(source, state, options, spaces, importer_cls=ConfluenceImporter)
