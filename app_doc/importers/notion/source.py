# coding:utf-8
"""Notion 数据来源适配器。

把 Notion 的页面树翻译成通用中间模型（`app_doc.importers.base`）：

- 顶层页面  → SourceSpace（key 取页面 ID），本次迁移的"空间"
- 页面      → SourcePage，正文由块树转成 HTML
- 子页面    → 通过 child_page 块递归，父子关系即文档树
- 正文媒体  → SourceAttachment（Notion 文件是 1 小时过期的签名直链，必须立刻下载）

已知限制：Notion 数据库（database）暂不支持迁移，遇到时会跳过并告警。
"""

from loguru import logger

from app_doc.importers.base import BaseSource, SourceAttachment, SourcePage, SourceSpace
from app_doc.importers.notion.blocks import (
    blocks_to_html,
    iter_child_databases,
    iter_child_pages,
)

# 单页最多抓取的块数，防止异常页面导致请求量失控
MAX_BLOCKS_PER_PAGE = 2000


def document_version(page):
    """把页面的最后编辑时间压成可比较的整数，供状态文件判断内容是否变化"""
    raw = page.get('last_edited_time') or ''
    digits = ''.join(ch for ch in str(raw) if ch.isdigit())
    return int(digits) if digits else 0


def extract_page_title(obj):
    """提取页面标题。

    页面标题存放在 properties 里 type 为 title 的属性上；
    数据库对象则把标题放在顶层 title 字段。
    """
    properties = obj.get('properties') or {}
    for value in properties.values():
        if isinstance(value, dict) and value.get('type') == 'title':
            text = ''.join(item.get('plain_text') or '' for item in (value.get('title') or []))
            if text.strip():
                return text.strip()

    title = obj.get('title')
    if isinstance(title, list):
        text = ''.join(item.get('plain_text') or '' for item in title)
        if text.strip():
            return text.strip()
    return ''


class NotionSource(BaseSource):
    """Notion 页面来源"""

    def __init__(self, client, with_attachments=True):
        self.client = client
        self.with_attachments = with_attachments
        self.identity = client.source_identity()
        self.label = client.describe()

    # ------------------------------------------------------------------ #
    # 页面层级
    # ------------------------------------------------------------------ #
    @staticmethod
    def _parent_id(obj):
        parent = obj.get('parent') or {}
        return (parent.get('page_id') or parent.get('database_id')
                or parent.get('block_id') or parent.get('data_source_id') or '')

    @staticmethod
    def _split_objects(objects):
        """拆分出页面与数据库，并过滤回收站内容"""
        pages, databases = [], []
        for obj in objects or []:
            if obj.get('in_trash'):
                continue
            if (obj.get('object') or '') == 'page':
                pages.append(obj)
            else:
                databases.append(obj)
        return pages, databases

    def _root_pages(self, pages, all_ids):
        """父级不在可访问范围内的页面即根页面"""
        roots = []
        for page in pages:
            parent_id = self._parent_id(page)
            if parent_id and parent_id in all_ids:
                continue
            roots.append(page)
        return roots

    @staticmethod
    def _to_space(page):
        return SourceSpace(
            key=page.get('id') or '',
            name=extract_page_title(page) or '未命名页面',
            description='Notion 页面',
        )

    def list_spaces(self, space_keys=None):
        if space_keys:
            return [self._to_space(self.client.get_page(key)) for key in space_keys]

        objects = self.client.search()
        pages, databases = self._split_objects(objects)
        if databases:
            logger.warning(f'Notion 导入：集成可访问 {len(databases)} 个数据库，'
                           f'数据库暂不支持迁移，已排除在来源之外')
        all_ids = {page.get('id') for page in pages} | {db.get('id') for db in databases}
        return [self._to_space(page) for page in self._root_pages(pages, all_ids)]

    # ------------------------------------------------------------------ #
    # 块树
    # ------------------------------------------------------------------ #
    def _fetch_blocks(self, block_id, budget=None):
        """递归取块树，为 has_children 的块补上 children。

        子页面 / 子数据库由调用方单独处理，这里不递归进去。
        """
        if budget is None:
            budget = {'remaining': MAX_BLOCKS_PER_PAGE}
        if budget['remaining'] <= 0:
            return []

        blocks = []
        for raw in self.client.list_block_children(block_id):
            if budget['remaining'] <= 0:
                logger.warning(f'Notion 导入：页面 {block_id} 块数超过 {MAX_BLOCKS_PER_PAGE}，已截断')
                break
            budget['remaining'] -= 1

            block_type = raw.get('type') or ''
            block = {
                'id': raw.get('id'),
                'type': block_type,
                'has_children': bool(raw.get('has_children')),
                'content': raw.get(block_type) or {},
                'children': [],
            }
            if block['has_children'] and block_type not in ('child_page', 'child_database'):
                block['children'] = self._fetch_blocks(block['id'], budget)
            blocks.append(block)
        return blocks

    @staticmethod
    def _to_attachments(media):
        """媒体清单 → 附件，按地址去重"""
        attachments = []
        seen = set()
        for item in media or []:
            url = item.get('url')
            if not url or url in seen:
                continue
            seen.add(url)
            attachments.append(SourceAttachment(
                filename=item.get('filename') or 'attachment',
                remote_id=url,
                download_url=url,
                media_type=item.get('media_type') or '',
            ))
        return attachments

    # ------------------------------------------------------------------ #
    # 页面
    # ------------------------------------------------------------------ #
    def iter_pages(self, space_key, max_pages=None):
        visited = set()
        queue = [(space_key, None)]   # 广度优先，保证父页面先于子页面产出
        count = 0
        skipped_databases = 0

        while queue:
            if max_pages and count >= max_pages:
                return

            page_id, parent_id = queue.pop(0)
            if not page_id or page_id in visited:
                continue
            visited.add(page_id)

            try:
                page = self.client.get_page(page_id)
            except Exception as e:
                logger.warning(f'Notion 导入：页面 {page_id} 获取失败，已跳过 | {e!r}')
                continue

            if page.get('in_trash'):
                continue

            count += 1
            blocks = self._fetch_blocks(page_id)
            html, media = blocks_to_html(blocks)
            attachments = self._to_attachments(media) if self.with_attachments else []
            skipped_databases += len(list(iter_child_databases(blocks)))

            yield SourcePage(
                source_id=str(page_id),
                title=extract_page_title(page) or '未命名页面',
                body=html,
                body_format='html',
                parent_source_id=str(parent_id) if parent_id else None,
                version=document_version(page),
                updated=str(page.get('last_edited_time') or ''),
                source_url=page.get('url') or f'https://www.notion.so/{page_id.replace("-", "")}',
                attachments=attachments,
            )

            for child_id in iter_child_pages(blocks):
                if child_id not in visited:
                    queue.append((child_id, page_id))

        if skipped_databases:
            logger.warning(f'Notion 导入：页面 {space_key} 下有 {skipped_databases} 个数据库，'
                           f'数据库暂不支持迁移，已跳过')

    def fetch_attachment(self, attachment):
        return self.client.download(attachment.download_url)
