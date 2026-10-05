# coding:utf-8
"""本地 JSON 状态文件：跨平台通用的导入幂等依据。

不参与数据库结构，由导入命令独占写入；删除该文件只会导致下次全量重建。

结构：
    {
      "version": 1,
      "sources": {
        "<来源标识>|<空间key>": {
          "space_name": "...",
          "attachments": {"<页面ID>:<文件名>": {...}},
          "projects": {"<文集ID>": {"pages": {"<页面ID>": {...}}}}
        }
      }
    }

附件记录归属"来源+空间"，因此同一空间导入到第二个文集时可复用已下载的文件，
不必重复下载。
"""

import json
import os

from loguru import logger


class ImportState:
    VERSION = 1

    def __init__(self, path):
        self.path = path
        self.data = {'version': self.VERSION, 'sources': {}}
        self.load()

    def load(self):
        if not self.path or not os.path.exists(self.path):
            return self
        try:
            with open(self.path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            if isinstance(data, dict) and isinstance(data.get('sources'), dict):
                self.data = data
            else:
                logger.warning(f'状态文件结构异常，将以空状态继续：{self.path}')
        except Exception as e:
            # 损坏的状态文件不应阻断导入，退化为全量导入
            logger.warning(f'状态文件读取失败，将以空状态继续：{self.path} | {e!r}')
        return self

    def save(self):
        if not self.path:
            return
        directory = os.path.dirname(os.path.abspath(self.path))
        if directory:
            os.makedirs(directory, exist_ok=True)
        tmp_path = self.path + '.tmp'
        with open(tmp_path, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)
        os.replace(tmp_path, self.path)  # 原子替换，避免中途中断留下半截 JSON

    def source_node(self, identity, space_key, space_name=''):
        sources = self.data.setdefault('sources', {})
        node = sources.setdefault(f'{identity}|{space_key}', {})
        node.setdefault('identifier', identity)
        node.setdefault('space_key', space_key)
        if space_name:
            node['space_name'] = space_name
        node.setdefault('attachments', {})
        node.setdefault('projects', {})
        return node

    def project_node(self, source_node, project_id, project_name=''):
        projects = source_node.setdefault('projects', {})
        node = projects.setdefault(str(project_id), {})
        if project_name:
            node['project_name'] = project_name
        node.setdefault('pages', {})
        return node

    @staticmethod
    def cached_attachment(source_node, key):
        return (source_node.get('attachments') or {}).get(key)

    @staticmethod
    def remember_attachment(source_node, key, payload):
        source_node.setdefault('attachments', {})[key] = payload
