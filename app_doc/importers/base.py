# coding:utf-8
"""跨平台导入的中间模型与来源契约。

各平台只负责把自身数据翻译成这里的中间模型，
下游编排（建文档树、落库图片附件、内链改写）因此可以完全复用。
"""

from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class SourceSpace:
    key: str
    name: str
    description: str = ''


@dataclass
class SourceAttachment:
    filename: str
    remote_id: str = ''
    version: int = 0
    size: int = 0
    media_type: str = ''
    download_url: str = ''
    base_url: str = ''
    local_path: str = ''


@dataclass
class SourcePage:
    source_id: str
    title: str
    body: str = ''
    body_format: str = 'html'  # storage | html
    parent_source_id: Optional[str] = None
    version: int = 0
    updated: str = ''
    source_url: str = ''
    attachments: List[SourceAttachment] = field(default_factory=list)


class BaseSource:
    """来源适配器接口"""

    identity = ''
    label = ''

    def list_spaces(self, space_keys=None) -> List[SourceSpace]:
        raise NotImplementedError

    def iter_pages(self, space_key, max_pages=None):
        raise NotImplementedError

    def fetch_attachment(self, attachment) -> bytes:
        raise NotImplementedError
