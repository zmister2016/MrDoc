# coding:utf-8
"""钉钉文档数据来源适配器。

把钉钉知识库翻译成通用中间模型（`app_doc.importers.base`）：

- 知识库（workspace） → SourceSpace
- 节点树              → 从 rootNodeId 起逐层递归（`parentNodeId` 拉子节点）
- 钉钉文档（alidoc）   → SourcePage，正文由块数组转成 HTML
- 正文内嵌图片        → SourceAttachment（图片是在线地址，可直接下载）

只导入"文件夹"与"钉钉文档"两类节点；其它文件（xlsx/pdf 等）会跳过并告警，
因为钉钉没有给出这类文件的下载地址。
"""

from loguru import logger

from app_doc.importers.base import BaseSource, SourcePage, SourceSpace
from app_doc.importers.dingtalk.blocks import blocks_to_html
from app_doc.importers.dingtalk.client import DingTalkApiError
from app_doc.importers.html_normalize import collect_images


class DingTalkSource(BaseSource):
    """钉钉知识库来源"""

    def __init__(self, client, with_attachments=True):
        self.client = client
        self.with_attachments = with_attachments
        self.identity = client.source_identity()
        self.label = client.describe()

    # ------------------------------------------------------------------ #
    # 知识库
    # ------------------------------------------------------------------ #
    @staticmethod
    def _to_space(item):
        workspace_id = item.get('workspaceId') or ''
        return SourceSpace(
            key=workspace_id,
            name=item.get('name') or workspace_id,
            description=item.get('description') or '',
        )

    def list_spaces(self, space_keys=None):
        spaces = self.client.list_workspaces()
        if not space_keys:
            return [self._to_space(item) for item in spaces]

        by_id = {item.get('workspaceId'): item for item in spaces}
        missing = [key for key in space_keys if key not in by_id]
        if missing:
            raise ValueError(f'未找到知识库：{", ".join(missing)}')
        return [self._to_space(by_id[key]) for key in space_keys]

    # ------------------------------------------------------------------ #
    # 节点
    # ------------------------------------------------------------------ #
    @staticmethod
    def _is_folder(node):
        return str(node.get('type') or '').upper() == 'FOLDER'

    @staticmethod
    def _is_document(node):
        return (str(node.get('type') or '').upper() == 'FILE'
                and str(node.get('category') or '').upper() == 'ALIDOC'
                and str(node.get('extension') or '').lower() == 'adoc')

    @staticmethod
    def _node_version(node):
        """节点最后修改时间 → 可比较的整数。

        优先用毫秒时间戳：官方节点列表里的 modifiedTime 只有分钟精度，
        用它判断变化会漏掉同一分钟内的编辑。
        """
        timestamp = node.get('modifiedTimestamp')
        if timestamp:
            digits = ''.join(ch for ch in str(timestamp) if ch.isdigit())
            if digits:
                return int(digits)
        digits = ''.join(ch for ch in str(node.get('modifiedTime') or '') if ch.isdigit())
        return int(digits) if digits else 0

    def iter_pages(self, space_key, max_pages=None):
        workspace = self._resolve_workspace(space_key)
        root_node_id = workspace.get('rootNodeId') or ''
        if not root_node_id:
            raise ValueError(f'知识库 {space_key} 缺少 rootNodeId，无法遍历')

        # (待展开的父节点ID, 它所属的最近文档ID)
        queue = [(root_node_id, None)]
        visited = set()
        count = 0
        skipped = {}

        while queue:
            if max_pages and count >= max_pages:
                return

            parent_node_id, parent_doc_id = queue.pop(0)
            if parent_node_id in visited:
                continue
            visited.add(parent_node_id)

            try:
                nodes = self.client.list_nodes(parent_node_id)
            except DingTalkApiError as e:
                logger.warning(f'钉钉导入：节点 {parent_node_id} 的子节点获取失败，已跳过 | {e}')
                continue

            for node in nodes:
                node_id = node.get('nodeId') or ''
                if not node_id:
                    continue

                if self._is_folder(node):
                    queue.append((node_id, parent_doc_id))
                    continue

                if not self._is_document(node):
                    name = node.get('name') or node_id
                    extension = node.get('extension') or node.get('type') or '未知'
                    skipped[extension] = skipped.get(extension, 0) + 1
                    logger.info(f'钉钉导入：节点「{name}」不是钉钉文档（{extension}），'
                                f'没有下载地址，已跳过')
                    continue

                try:
                    page = self._build_page(node, parent_doc_id)
                except DingTalkApiError as e:
                    logger.warning(f'钉钉导入：文档「{node.get("name") or node_id}」获取失败，已跳过 | {e}')
                    continue

                count += 1
                yield page
                queue.append((node_id, node_id))

        if skipped:
            detail = '、'.join(f'{name}×{num}' for name, num in sorted(skipped.items()))
            logger.warning(f'钉钉导入：知识库 {space_key} 中有非钉钉文档的节点（{detail}），'
                           f'钉钉未提供下载地址，已跳过')

    def _resolve_workspace(self, workspace_id):
        for item in self.client.list_workspaces():
            if item.get('workspaceId') == workspace_id:
                return item
        raise ValueError(f'未找到知识库：{workspace_id}')

    def _build_page(self, node, parent_doc_id):
        node_id = node.get('nodeId')
        node_name = node.get('name') or node_id

        blocks = self.client.document_blocks(node_id)
        html, unknown = blocks_to_html(blocks)
        if unknown:
            logger.info(f'钉钉导入：文档「{node_name}」含暂未支持的块类型（'
                        f'{"、".join(sorted(unknown))}），已在正文中尽量保留')

        attachments = collect_images(html) if self.with_attachments else []

        return SourcePage(
            source_id=str(node_id),
            title=node_name,
            body=html,
            body_format='html',
            parent_source_id=str(parent_doc_id) if parent_doc_id else None,
            version=self._node_version(node),
            updated=str(node.get('modifiedTime') or ''),
            source_url=node.get('url') or '',
            attachments=attachments,
        )

    def fetch_attachment(self, attachment):
        return self.client.download(attachment.download_url)
