# coding:utf-8
"""从飞书 / Lark 知识空间迁移导入文档。

一次性迁移工具：把飞书知识空间（wiki）整体搬进本站。
每个知识空间视为一个"空间"（对应一个文集），空间下的节点构成文档树。

飞书与 Lark 是同一产品部署在两个隔离的云上，接口形状一致，只有域名不同：
国内飞书用默认的 https://open.feishu.cn，国际版 Lark 传 --base-url https://open.larksuite.com。

不指定 --project 时每次新建一个文集；指定 --project 时可重复执行，
配合本地 JSON 状态文件跳过已导入且未变化的节点、只补齐新增与变更的部分。

用法示例：
    # 导入指定知识空间（新建文集）
    python manage.py import_feishu --app-id cli_xxx --app-secret yyy \
        --space <知识空间ID> --user admin

    # 导入国际版 Lark
    python manage.py import_feishu --app-id cli_xxx --app-secret yyy \
        --base-url https://open.larksuite.com --space <知识空间ID> --user admin

    # 导入到已有文集（可重复执行，补齐新增/变更）
    python manage.py import_feishu --app-id cli_xxx --app-secret yyy \
        --space <知识空间ID> --project 3 --user admin

    # 只盘点不写库
    python manage.py import_feishu --app-id cli_xxx --app-secret yyy \
        --space <知识空间ID> --user admin --dry-run

应用凭据未用参数提供时，读取环境变量 FEISHU_APP_ID / FEISHU_APP_SECRET。
注意：需为该应用开通 wiki 与 docx 的读取权限，并把应用添加为目标知识空间的成员，
否则接口会返回无权限错误。

当前支持 docx 文档；飞书电子表格、多维表格、旧版文档等类型会跳过并告警。
"""

import os

from django.core.management.base import CommandError

from app_doc.importers.cli import BaseSourceImportCommand
from app_doc.importers.feishu.client import OPEN_BASE_URL, FeishuApiError, FeishuClient
from app_doc.importers.feishu.importer import FeishuImporter
from app_doc.importers.feishu.source import FeishuSource


class Command(BaseSourceImportCommand):
    help = "从飞书 / Lark 知识空间迁移导入文档"
    source_type = 'feishu'
    importer_cls = FeishuImporter

    def add_source_arguments(self, parser):
        parser.add_argument('--app-id', type=str, default='',
                            help='飞书应用 App ID（未提供时读取环境变量 FEISHU_APP_ID）')
        parser.add_argument('--app-secret', type=str, default='',
                            help='飞书应用 App Secret（未提供时读取环境变量 FEISHU_APP_SECRET）')
        parser.add_argument('--base-url', type=str, default=OPEN_BASE_URL,
                            help=f'开放平台域名，国内 {OPEN_BASE_URL}，'
                                 f'国际版传 https://open.larksuite.com')
        parser.add_argument('--web-base-url', type=str, default='',
                            help='用户侧站点域名（用于生成来源链接），默认按 --base-url 推导')
        parser.add_argument('--insecure', action='store_true', help='跳过 HTTPS 证书校验')

    def build_source(self, options):
        app_id = options['app_id'] or os.environ.get('FEISHU_APP_ID', '')
        app_secret = options['app_secret'] or os.environ.get('FEISHU_APP_SECRET', '')
        try:
            client = FeishuClient(
                app_id=app_id,
                app_secret=app_secret,
                base_url=options['base_url'],
                web_base_url=options['web_base_url'],
                verify=not options['insecure'],
                delay=options['delay'],
            )
            client.tenant_access_token()  # 提前校验凭据，避免翻页到一半才发现无效
        except FeishuApiError as e:
            raise CommandError(str(e))

        with_attachments = not options['no_attachments'] or not options['no_images']
        return FeishuSource(client, with_attachments=with_attachments)
