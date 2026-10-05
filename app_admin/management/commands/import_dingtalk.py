# coding:utf-8
"""从钉钉文档知识库迁移导入文档。

一次性迁移工具：把钉钉知识库整体搬进本站。
每个知识库视为一个"空间"（对应一个文集），知识库内的节点构成文档树。

不指定 --project 时每次新建一个文集；指定 --project 时可重复执行，
配合本地 JSON 状态文件跳过已导入且未变化的文档、只补齐新增与变更的部分。

用法示例：
    # 导入指定知识库（新建文集）
    python manage.py import_dingtalk --app-key dingxxx --app-secret yyy \
        --operator-id <操作用户unionId> --space <知识库ID> --user admin

    # 导入到已有文集（可重复执行，补齐新增/变更）
    python manage.py import_dingtalk --app-key dingxxx --app-secret yyy \
        --operator-id <操作用户unionId> --space <知识库ID> --project 3 --user admin

    # 只盘点不写库
    python manage.py import_dingtalk --app-key dingxxx --app-secret yyy \
        --operator-id <操作用户unionId> --space <知识库ID> --user admin --dry-run

应用凭据未用参数提供时，读取环境变量 DINGTALK_APP_KEY / DINGTALK_APP_SECRET / DINGTALK_OPERATOR_ID。

几点限制（均来自钉钉接口本身，不是本命令的问题）：
1. 接口要求以某个成员身份操作，必须提供 operatorId（该成员的 unionId），
   且该成员需对目标知识库有访问权限；
2. 只迁移"钉钉文档"（.adoc），知识库里的其它文件（xlsx/pdf 等）钉钉未给出下载地址，会跳过；
3. 钉钉块接口只返回第一层块，容器（标注/分栏）里的嵌套正文可能取不到；
4. 文档内的附件只有不透明标识，同样无法下载，只在正文中保留文件名。
"""

import os

from django.core.management.base import CommandError

from app_doc.importers.cli import BaseSourceImportCommand
from app_doc.importers.dingtalk.client import DEFAULT_BASE_URL, DingTalkApiError, DingTalkClient
from app_doc.importers.dingtalk.importer import DingTalkImporter
from app_doc.importers.dingtalk.source import DingTalkSource


class Command(BaseSourceImportCommand):
    help = "从钉钉文档知识库迁移导入文档"
    source_type = 'dingtalk'
    importer_cls = DingTalkImporter

    def add_source_arguments(self, parser):
        parser.add_argument('--app-key', type=str, default='',
                            help='钉钉应用 AppKey（未提供时读取环境变量 DINGTALK_APP_KEY）')
        parser.add_argument('--app-secret', type=str, default='',
                            help='钉钉应用 AppSecret（未提供时读取环境变量 DINGTALK_APP_SECRET）')
        parser.add_argument('--operator-id', type=str, default='',
                            help='操作者 unionId（未提供时读取环境变量 DINGTALK_OPERATOR_ID）')
        parser.add_argument('--base-url', type=str, default=DEFAULT_BASE_URL,
                            help=f'钉钉开放平台地址，默认 {DEFAULT_BASE_URL}')
        parser.add_argument('--insecure', action='store_true', help='跳过 HTTPS 证书校验')

    def build_source(self, options):
        try:
            client = DingTalkClient(
                app_key=options['app_key'] or os.environ.get('DINGTALK_APP_KEY', ''),
                app_secret=options['app_secret'] or os.environ.get('DINGTALK_APP_SECRET', ''),
                operator_id=options['operator_id'] or os.environ.get('DINGTALK_OPERATOR_ID', ''),
                base_url=options['base_url'],
                verify=not options['insecure'],
                delay=options['delay'],
            )
            client.access_token()  # 提前校验凭据，避免翻页到一半才发现无效
        except DingTalkApiError as e:
            raise CommandError(str(e))

        with_attachments = not options['no_attachments'] or not options['no_images']
        return DingTalkSource(client, with_attachments=with_attachments)
