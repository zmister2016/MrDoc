# coding:utf-8
"""从 Notion 迁移导入文档。

一次性迁移工具：把 Notion 页面树整体搬进本站。
每个可访问的顶层页面视为一个"空间"（对应一个文集），其下的子页面构成文档树。

不指定 --project 时每次新建一个文集；指定 --project 时可重复执行，
配合本地 JSON 状态文件跳过已导入且未变化的页面、只补齐新增与变更的部分。

用法示例：
    # 导入指定顶层页面（新建文集）
    python manage.py import_notion --token ntn_xxx --space <页面ID> --user admin

    # 导入到已有文集（可重复执行，补齐新增/变更）
    python manage.py import_notion --token ntn_xxx --space <页面ID> --project 3 --user admin

    # 导入集成可访问的全部顶层页面
    python manage.py import_notion --token ntn_xxx --all-spaces --user admin

    # 只盘点不写库
    python manage.py import_notion --token ntn_xxx --all-spaces --user admin --dry-run

Token 未用 --token 提供时，读取环境变量 NOTION_TOKEN。
注意：需先把目标页面「共享」给该集成，否则接口会返回 404。
"""

import os

from django.core.management.base import CommandError

from app_doc.importers.cli import BaseSourceImportCommand
from app_doc.importers.notion.client import (
    DEFAULT_API_VERSION,
    DEFAULT_BASE_URL,
    NotionApiError,
    NotionClient,
)
from app_doc.importers.notion.importer import NotionImporter
from app_doc.importers.notion.source import NotionSource


class Command(BaseSourceImportCommand):
    help = "从 Notion 迁移导入文档（页面树）"
    source_type = 'notion'
    importer_cls = NotionImporter

    def add_source_arguments(self, parser):
        parser.add_argument('--token', type=str, default='',
                            help='Notion Internal Integration Token（未提供时读取环境变量 NOTION_TOKEN）')
        parser.add_argument('--base-url', type=str, default=DEFAULT_BASE_URL,
                            help=f'Notion API 地址，默认 {DEFAULT_BASE_URL}')
        parser.add_argument('--api-version', type=str, default=DEFAULT_API_VERSION,
                            help=f'Notion-Version 请求头，默认 {DEFAULT_API_VERSION}')
        parser.add_argument('--insecure', action='store_true', help='跳过 HTTPS 证书校验')

    def build_source(self, options):
        token = options['token'] or os.environ.get('NOTION_TOKEN', '')
        try:
            client = NotionClient(
                token=token,
                base_url=options['base_url'],
                api_version=options['api_version'],
                verify=not options['insecure'],
                delay=options['delay'],
            )
            client.ping()  # 提前校验 Token，避免翻页到一半才发现凭据无效
        except NotionApiError as e:
            raise CommandError(str(e))

        with_attachments = not options['no_attachments'] or not options['no_images']
        return NotionSource(client, with_attachments=with_attachments)
