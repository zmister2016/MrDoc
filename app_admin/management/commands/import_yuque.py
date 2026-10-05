# coding:utf-8
"""从语雀迁移导入文档。

一次性迁移工具：把语雀知识库（个人或团队）整体搬进本站。
不指定 --project 时每次新建一个文集；指定 --project 时可重复执行，
配合本地 JSON 状态文件跳过已导入且未变化的文档、只补齐新增与变更的部分。

用法示例：
    # 导入指定知识库（新建文集）
    python manage.py import_yuque --token xxx --space mylogin/mybook --user admin

    # 导入到已有文集（可重复执行，补齐新增/变更）
    python manage.py import_yuque --token xxx --space mylogin/mybook --project 3 --user admin

    # 导入当前账号可见的全部知识库
    python manage.py import_yuque --token xxx --all-spaces --user admin

    # 只盘点不写库
    python manage.py import_yuque --token xxx --space mylogin/mybook --user admin --dry-run

Token 未用 --token 提供时，读取环境变量 YUQUE_TOKEN。
"""

import os

from django.core.management.base import CommandError

from app_doc.importers.cli import BaseSourceImportCommand
from app_doc.importers.yuque.client import DEFAULT_API_ROOT, YuqueApiError, YuqueClient
from app_doc.importers.yuque.importer import YuqueImporter
from app_doc.importers.yuque.source import YuqueSource


class Command(BaseSourceImportCommand):
    help = "从语雀迁移导入文档（个人 / 团队知识库）"
    source_type = 'yuque'
    importer_cls = YuqueImporter

    def add_source_arguments(self, parser):
        parser.add_argument('--token', type=str, default='',
                            help='语雀个人 Token（未提供时读取环境变量 YUQUE_TOKEN）')
        parser.add_argument('--api-root', type=str, default=DEFAULT_API_ROOT,
                            help=f'语雀 API 地址，默认 {DEFAULT_API_ROOT}；'
                                 f'企业版为 https://<企业>.yuque.com/api/v2')
        parser.add_argument('--insecure', action='store_true', help='跳过 HTTPS 证书校验')

    def build_source(self, options):
        token = options['token'] or os.environ.get('YUQUE_TOKEN', '')
        try:
            client = YuqueClient(
                token=token,
                api_root=options['api_root'],
                verify=not options['insecure'],
                delay=options['delay'],
            )
            client.get_user()  # 提前校验 Token，避免翻页到一半才发现凭据无效
        except YuqueApiError as e:
            raise CommandError(str(e))

        with_attachments = not options['no_attachments'] or not options['no_images']
        return YuqueSource(client, with_attachments=with_attachments)
