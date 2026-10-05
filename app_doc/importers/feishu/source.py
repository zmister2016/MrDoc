# coding:utf-8
"""飞书 / Lark 数据来源适配器。

把飞书知识空间翻译成通用中间模型（`app_doc.importers.base`）：

- 知识空间（wiki space） → SourceSpace
- 空间节点（wiki node）   → SourcePage，`parent_node_token` 即文档树
- docx 文档块            → 正文 HTML
- 图片 / 附件            → SourceAttachment（通过需鉴权的媒体接口下载）

节点的 `obj_type` 决定内容来源，本项目当前支持 `docx`；
`sheet`/`bitable`/`mindnote`/`slides`/`doc`（旧版文档）等类型会跳过并告警。
"""

from loguru import logger

from app_doc.importers.base import BaseSource, SourceAttachment, SourcePage, SourceSpace
from app_doc.importers.feishu.blocks import blocks_to_html, iter_object_types
from app_doc.importers.feishu.client import FeishuApiError

SUPPORTED_OBJECT_TYPES = ('docx',)


class FeishuSource(BaseSource):
    """飞书知识空间来源"""

    def __init__(self, client, with_attachments=True):
        self.client = client
        self.with_attachments = with_attachments
        self.identity = client.source_identity()
        self.label = client.describe()
        # media token → 所属文档 ID，下载内嵌媒体时需要回传
        self._media_owner = {}

    # ------------------------------------------------------------------ #
    # 知识空间
    # ------------------------------------------------------------------ #
    @staticmethod
    def _to_space(item):
        space_id = item.get('space_id') or ''
        return SourceSpace(
            key=space_id,
            name=item.get('name') or space_id,
            description=item.get('description') or '',
        )

    def list_spaces(self, space_keys=None):
        if space_keys:
            return [self._to_space(self.client.get_space(key)) for key in space_keys]
        return [self._to_space(item) for item in self.client.list_spaces()]

    # ------------------------------------------------------------------ #
    # 节点树
    # ------------------------------------------------------------------ #
    @staticmethod
    def _children_index(nodes):
        """按 parent_node_token 建立父子索引"""
        children = {}
        for node in nodes:
            parent = node.get('parent_node_token') or ''
            children.setdefault(parent, []).append(node)
        return children

    def _walk_nodes(self, nodes, space_id, max_pages):
        """广度优先遍历节点，保证父节点先于子节点产出"""
        by_token = {node.get('node_token'): node for node in nodes if node.get('node_token')}
        children = self._children_index(nodes)

        roots = [node for node in nodes
                 if not node.get('parent_node_token')
                 or node.get('parent_node_token') not in by_token]

        queue = [(node, None) for node in roots]
        visited = set()
        count = 0
        unsupported = {}

        while queue:
            if max_pages and count >= max_pages:
                return
            node, parent_token = queue.pop(0)
            node_token = node.get('node_token')
            if not node_token or node_token in visited:
                continue
            visited.add(node_token)

            obj_type = node.get('obj_type') or ''
            obj_token = node.get('obj_token') or ''
            title = node.get('title') or node_token
            child_nodes = children.get(node_token, [])

            if obj_type not in SUPPORTED_OBJECT_TYPES:
                unsupported[obj_type or 'unknown'] = unsupported.get(obj_type or 'unknown', 0) + 1
            else:
                try:
                    page = self._build_page(node, parent_token, title, obj_type, obj_token, space_id)
                except FeishuApiError as e:
                    logger.warning(f'飞书导入：文档「{title}」({obj_token}) 获取失败，已跳过 | {e}')
                    page = None
                if page is not None:
                    count += 1
                    yield page

            for child in child_nodes:
                if child.get('node_token') not in visited:
                    queue.append((child, node_token))

        if unsupported:
            detail = '、'.join(f'{name}×{num}' for name, num in sorted(unsupported.items()))
            logger.warning(f'飞书导入：知识空间 {space_id} 中存在暂不支持迁移的节点类型（{detail}），已跳过')

    def _build_page(self, node, parent_token, title, obj_type, obj_token, space_id):
        blocks = self.client.list_document_blocks(obj_token)
        html, media = blocks_to_html(blocks)
        skipped = sorted(set(iter_object_types(blocks)))
        if skipped:
            logger.info(f'飞书导入：文档「{title}」含 {len(skipped)} 类嵌入对象，'
                        f'已在正文中标注为暂不支持')

        attachments = []
        if self.with_attachments:
            for item in media:
                token = item.get('token')
                if not token:
                    continue
                self._media_owner[token] = obj_token
                attachments.append(SourceAttachment(
                    filename=item.get('filename') or token,
                    remote_id=token,
                    download_url=token,
                    media_type=item.get('media_type') or '',
                ))

        node_token = node.get('node_token')
        return SourcePage(
            source_id=str(node_token),
            title=title,
            body=html,
            body_format='html',
            parent_source_id=str(parent_token) if parent_token else None,
            version=_node_version(node),
            updated=str(node.get('obj_edit_time') or ''),
            source_url=f'{self.client.web_base}/wiki/{node_token}',
            attachments=attachments,
        )

    def iter_pages(self, space_key, max_pages=None):
        nodes = self.client.list_nodes(space_key)
        if not nodes:
            logger.warning(f'飞书导入：知识空间 {space_key} 下没有节点')
            return
        yield from self._walk_nodes(nodes, space_key, max_pages)

    def fetch_attachment(self, attachment):
        document_id = self._media_owner.get(attachment.download_url, '')
        return self.client.download(attachment.download_url, document_id)


def _node_version(node):
    """节点最后编辑时间 → 可比较的整数"""
    raw = node.get('obj_edit_time') or ''
    digits = ''.join(ch for ch in str(raw) if ch.isdigit())
    return int(digits) if digits else 0
