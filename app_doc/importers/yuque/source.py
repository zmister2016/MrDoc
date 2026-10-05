# coding:utf-8
"""语雀数据来源适配器。

把语雀知识库与文档翻译成通用中间模型（`app_doc.importers.base`）：

- 知识库（repo）  → SourceSpace，key 取 namespace（如 `login/repo`）
- 文档（doc）     → SourcePage，正文取 `body_html`
- 目录（toc）     → 文档的父子关系（分组节点 TITLE 会被跳过，向上找最近的文档祖先）
- 正文内嵌图片    → SourceAttachment，复用通用层的下载/入库/去重

下游的正文落地、建树、图片落库、内链改写、幂等跳过完全共享，无需另写一条链路。
"""

from loguru import logger

from app_doc.importers.base import BaseSource, SourcePage, SourceSpace
from app_doc.importers.html_normalize import collect_images


def document_version(detail):
    """把文档的更新时间压成可比较的整数，供状态文件判断内容是否变化"""
    raw = detail.get('content_updated_at') or detail.get('updated_at') or ''
    digits = ''.join(ch for ch in str(raw) if ch.isdigit())
    return int(digits) if digits else 0


class YuqueSource(BaseSource):
    """语雀知识库来源"""

    def __init__(self, client, with_attachments=True):
        self.client = client
        self.with_attachments = with_attachments
        self.identity = client.source_identity()
        self.label = client.describe()

    # ------------------------------------------------------------------ #
    # 知识库
    # ------------------------------------------------------------------ #
    @staticmethod
    def _to_space(data):
        namespace = data.get('namespace') or ''
        return SourceSpace(
            key=namespace,
            name=data.get('name') or namespace,
            description=data.get('description') or '',
        )

    def list_spaces(self, space_keys=None):
        if space_keys:
            return [self._to_space(self.client.get_repo(key)) for key in space_keys]
        return [self._to_space(item) for item in self._iter_all_repos()]

    def _iter_all_repos(self):
        """当前 Token 可见的个人知识库 + 各团队知识库"""
        login = (self.client.get_user() or {}).get('login') or ''
        for item in self.client.list_user_repos(login):
            yield item

        try:
            groups = self.client.list_user_groups()
        except Exception as e:
            logger.warning(f'语雀导入：团队列表获取失败，仅导入个人知识库 | {e!r}')
            return

        for group in groups or []:
            group_login = group.get('login') or ''
            if not group_login:
                continue
            try:
                for item in self.client.list_group_repos(group_login):
                    yield item
            except Exception as e:
                logger.warning(f'语雀导入：团队 {group_login} 的知识库列表获取失败 | {e!r}')

    # ------------------------------------------------------------------ #
    # 目录层级
    # ------------------------------------------------------------------ #
    def _toc_parent_map(self, book_id):
        """返回 {文档ID: 父文档ID}。

        目录里既有文档节点（DOC）也有分组节点（TITLE），分组在本站没有对应实体，
        因此遇到分组时继续向上找，直到遇到最近的文档祖先。
        """
        try:
            nodes = self.client.get_toc(book_id)
        except Exception as e:
            logger.warning(f'语雀导入：知识库 {book_id} 目录获取失败，将按扁平结构导入 | {e!r}')
            return {}

        by_uuid = {node.get('uuid'): node for node in nodes if node.get('uuid')}
        parent_map = {}

        for node in nodes:
            if (node.get('type') or 'DOC').upper() != 'DOC':
                continue
            doc_id = node.get('doc_id')
            if not doc_id:
                continue

            parent_uuid = node.get('parent_uuid')
            visited = set()
            while parent_uuid and parent_uuid not in visited:
                visited.add(parent_uuid)
                parent = by_uuid.get(parent_uuid)
                if parent is None:
                    break
                if (parent.get('type') or 'DOC').upper() == 'DOC' and parent.get('doc_id'):
                    parent_map[str(doc_id)] = str(parent.get('doc_id'))
                    break
                parent_uuid = parent.get('parent_uuid')

        return parent_map

    # ------------------------------------------------------------------ #
    # 文档
    # ------------------------------------------------------------------ #
    @staticmethod
    def _is_importable(item):
        """只导入正式文档：跳过画板/表格/资源等其它类型，以及未发布的草稿"""
        doc_type = item.get('type') or ''
        if doc_type and doc_type != 'Doc':
            return False
        status = item.get('status') or ''
        if status and status != '1':
            return False
        return True

    def iter_pages(self, space_key, max_pages=None):
        # 文档列表/详情/目录均以数字 ID 定位知识库与文档
        book = self.client.get_repo(space_key)
        book_id = book.get('id')
        if not book_id:
            raise ValueError(f'未找到知识库：{space_key}')

        parent_map = self._toc_parent_map(book_id)
        count = 0

        for item in self.client.list_docs(book_id, max_items=max_pages):
            if max_pages and count >= max_pages:
                return
            if not self._is_importable(item):
                continue

            doc_id = item.get('id')
            if not doc_id:
                continue

            # 详情接口有频率限制，逐篇拉取时留出固定间隔
            self.client.throttle_detail()
            try:
                detail = self.client.get_doc(doc_id)
            except Exception as e:
                # 单篇文档失败不应中断整个知识库的导入
                logger.warning(f'语雀导入：文档 {doc_id} 详情获取失败 | {e!r}')
                continue

            count += 1
            body_html = detail.get('body_html') or ''
            if not body_html:
                logger.warning(f'语雀导入：文档 {doc_id}「{item.get("title")}」没有 body_html，正文将为空')

            attachments = collect_images(body_html) if self.with_attachments else []
            namespace = (detail.get('book') or {}).get('namespace') or space_key
            slug = detail.get('slug') or item.get('slug') or ''

            yield SourcePage(
                source_id=str(doc_id),
                title=detail.get('title') or item.get('title') or str(doc_id),
                body=body_html,
                body_format='html',
                parent_source_id=parent_map.get(str(doc_id)),
                version=document_version(detail),
                updated=str(detail.get('content_updated_at') or ''),
                source_url=f'{self.client.web_base}/{namespace}/{slug}' if slug else '',
                attachments=attachments,
            )

    def fetch_attachment(self, attachment):
        return self.client.download(attachment.download_url)
