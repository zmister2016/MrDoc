# coding:utf-8
"""来源平台注册表与元数据。

各平台的类型标识、展示名称、鉴权方式与能力标签集中登记在这里，
导入命令据此统一校验与展示；新增平台只需在 `REGISTERED_SOURCES` 中加一条。
"""

from typing import Dict, List, Tuple

from dataclasses import dataclass


@dataclass(frozen=True)
class SourceMeta:
    type: str                      # 唯一标识，与命令名 import_<type> 对应
    name: str                      # 展示名称
    auth: str                      # 鉴权方式说明
    description: str = ''
    capabilities: Tuple[str, ...] = ()


REGISTERED_SOURCES: Tuple[SourceMeta, ...] = (
    SourceMeta(
        type='confluence',
        name='Confluence',
        auth='Cloud: 邮箱 + API Token；Server/DC: PAT 或用户名密码',
        description='Atlassian Confluence 空间，支持在线 API 与离线 HTML 导出包',
        capabilities=('hierarchy', 'images', 'attachments'),
    ),
    SourceMeta(
        type='yuque',
        name='语雀',
        auth='个人 Token（X-Auth-Token）',
        description='语雀个人 / 团队知识库',
        capabilities=('hierarchy', 'images'),
    ),
    SourceMeta(
        type='notion',
        name='Notion',
        auth='Internal Integration Token（Bearer）',
        description='Notion 页面树（数据库暂不支持）',
        capabilities=('hierarchy', 'images', 'attachments'),
    ),
    SourceMeta(
        type='feishu',
        name='飞书 / Lark',
        auth='自建应用 app_id + app_secret',
        description='飞书知识空间（含 Lark，改 --base-url 即可）',
        capabilities=('hierarchy', 'images', 'attachments'),
    ),
    SourceMeta(
        type='dingtalk',
        name='钉钉文档',
        auth='应用 AppKey + AppSecret + operatorId',
        description='钉钉知识库（仅钉钉文档 .adoc，其它文件无下载地址）',
        capabilities=('hierarchy', 'images'),
    ),
)

_BY_TYPE: Dict[str, SourceMeta] = {meta.type: meta for meta in REGISTERED_SOURCES}


def get_source_meta(source_type: str) -> SourceMeta:
    """按类型取元数据；类型未登记时抛 KeyError"""
    return _BY_TYPE[source_type]


def list_sources() -> List[SourceMeta]:
    """已登记的全部来源平台"""
    return list(REGISTERED_SOURCES)
