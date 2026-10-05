# coding:utf-8
"""跨平台导入命令的公共骨架。

各平台命令只需：
1. 声明 `source_type`（对应 `registry.SourceMeta`）；
2. 用 `add_source_arguments()` 追加平台专属参数；
3. 实现 `build_source()` 返回来源适配器实例。

用户/文集校验、空间解析、状态文件、搜索索引暂停、统计报告、AI 索引入队
都在本模块复用，避免每个平台各写一遍。
"""

import os

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from app_doc.importers.pipeline import BaseImporter, ImportOptions, run_import
from app_doc.importers.registry import get_source_meta
from app_doc.importers.state import ImportState
from app_doc.models import Project

User = get_user_model()


class BaseSourceImportCommand(BaseCommand):
    """平台导入命令基类"""

    source_type = ''                    # 子类必须覆盖，对应 registry 中的 type
    importer_cls = BaseImporter         # 平台导入器，正文为平台私有格式时覆盖

    # ------------------------------------------------------------------ #
    # 子类扩展点
    # ------------------------------------------------------------------ #
    def add_source_arguments(self, parser):
        """追加平台专属参数（如站点地址、Token）"""
        raise NotImplementedError

    def build_source(self, options):
        """按参数构建来源适配器，返回 BaseSource 实例"""
        raise NotImplementedError

    # ------------------------------------------------------------------ #
    # 参数
    # ------------------------------------------------------------------ #
    def add_arguments(self, parser):
        self.add_source_arguments(parser)

        parser.add_argument('--user', type=str, required=True, help='内容归属的用户名（必填）')
        parser.add_argument('--project', type=int, default=0,
                            help='导入到指定文集ID；不指定则每次新建文集')
        parser.add_argument('--project-name', type=str, default='',
                            help='新建文集时的名称，默认取来源空间名称')
        parser.add_argument('--project-role', type=int, choices=[0, 1, 2, 3], default=1,
                            help='新建文集权限：0公开 1私密 2指定用户 3访问码，默认 1 私密')

        parser.add_argument('--space', type=str, default='',
                            help='要导入的空间/知识库标识，多个用逗号分隔')
        parser.add_argument('--all-spaces', action='store_true', help='导入全部可访问的空间/知识库')

        parser.add_argument('--editor-mode', type=int, choices=[1, 2, 3], default=1,
                            help='文档编辑器模式：1 Editormd 2 Vditor 3 富文本，默认 1')
        parser.add_argument('--doc-status', type=int, choices=[0, 1], default=1,
                            help='文档状态：1 发布 0 草稿，默认 1')
        parser.add_argument('--mode', choices=['skip-existing', 'update', 'create'],
                            default='skip-existing',
                            help='重复导入策略：skip-existing 命中状态文件则跳过（默认）'
                                 '，update 命中则重新同步正文，create 一律新建')

        parser.add_argument('--no-images', action='store_true', help='不导入正文内嵌图片')
        parser.add_argument('--no-attachments', action='store_true', help='不导入附件')

        parser.add_argument('--state-file', type=str, default='',
                            help=f'本地状态文件路径，默认 config/{self.source_type}_import_state.json')
        parser.add_argument('--limit', type=int, default=0, help='每个空间最多导入的页面数，0 表示不限制')
        parser.add_argument('--delay', type=float, default=0.0, help='每次请求前的间隔秒数，用于给源站降速')
        parser.add_argument('--dry-run', action='store_true', help='只盘点与试转换，不写数据库')
        parser.add_argument('--keep-search-index', action='store_true',
                            help='导入期间保留实时搜索索引（默认关闭以提升批量导入速度）')

    # ------------------------------------------------------------------ #
    # 主流程
    # ------------------------------------------------------------------ #
    def handle(self, *args, **options):
        meta = get_source_meta(self.source_type)
        user = self._get_user(options['user'])
        source = self.build_source(options)
        spaces = self._resolve_spaces(source, options)

        dry_run = options['dry_run']
        if not dry_run:
            self._check_project(options)

        import_options = ImportOptions(
            user=user,
            editor_mode=options['editor_mode'],
            project=self._get_project(options),
            project_name=options['project_name'],
            project_role=options['project_role'],
            doc_status=options['doc_status'],
            mode=options['mode'],
            with_images=not options['no_images'],
            with_attachments=not options['no_attachments'],
            max_pages=options['limit'],
            dry_run=dry_run,
        )

        state_file = self._state_file(options)
        state = ImportState(state_file)
        search_index_guard = self._suspend_search_index(options)

        self.stdout.write(self.style.NOTICE(f'数据来源：{meta.name} · {source.label}'))
        self.stdout.write(self.style.NOTICE(f'待导入空间：{", ".join(s.key for s in spaces)}'))
        if not dry_run:
            self.stdout.write(self.style.NOTICE(f'状态文件：{state_file}'))
        self.stdout.write('')

        try:
            results = run_import(source, state, import_options, spaces,
                                 importer_cls=self.importer_cls)
        finally:
            search_index_guard()

        self._print_report(results, options)

    def _state_file(self, options):
        if options['state_file']:
            return options['state_file']
        return os.path.join(settings.BASE_DIR, 'config', f'{self.source_type}_import_state.json')

    # ------------------------------------------------------------------ #
    # 校验与解析
    # ------------------------------------------------------------------ #
    def _get_user(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            raise CommandError(f'用户不存在: {username}')

    def _get_project(self, options):
        project_id = options['project']
        if not project_id:
            return None
        try:
            return Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise CommandError(f'文集不存在: {project_id}')

    def _check_project(self, options):
        if options['project'] and options['mode'] == 'create':
            raise CommandError('--project 与 --mode create 同时使用会产生重复文档，请改用 update')

    def _resolve_spaces(self, source, options):
        if options['space']:
            space_keys = [k.strip() for k in options['space'].split(',') if k.strip()]
        elif options['all_spaces']:
            space_keys = None
        else:
            raise CommandError('请用 --space 指定空间，或使用 --all-spaces 导入全部空间')

        try:
            spaces = source.list_spaces(space_keys)
        except Exception as e:
            raise CommandError(str(e))

        if not spaces:
            raise CommandError(f'未找到任何空间：{space_keys if space_keys else "全部"}')
        return spaces

    # ------------------------------------------------------------------ #
    # 搜索索引
    # ------------------------------------------------------------------ #
    def _suspend_search_index(self, options):
        """批量导入期间关闭 Haystack 实时索引，避免每篇文档都触发一次索引写入。

        返回一个恢复函数，无论导入成功与否都会被执行。
        """
        if options['dry_run'] or options['keep_search_index']:
            return lambda: None
        try:
            from django.apps import apps as django_apps
            config = django_apps.get_app_config('haystack')
            processor = getattr(config, 'signal_processor', None)
            if processor is None:
                return lambda: None
            processor.teardown()

            def restore():
                try:
                    processor.setup()
                except Exception as e:
                    self.stderr.write(self.style.WARNING(f'搜索索引信号恢复失败：{e!r}'))

            return restore
        except Exception as e:
            self.stderr.write(self.style.WARNING(f'未能关闭实时搜索索引，继续导入：{e!r}'))
            return lambda: None

    # ------------------------------------------------------------------ #
    # 报告
    # ------------------------------------------------------------------ #
    def _print_report(self, results, options):
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 60))

        total = {'pages': 0, 'doc_created': 0, 'doc_updated': 0, 'doc_unchanged': 0,
                 'doc_skipped': 0, 'image_ok': 0, 'image_fail': 0,
                 'attachment_ok': 0, 'attachment_fail': 0}

        attachment_rejected = False
        for result in results:
            self.stdout.write(self.style.SUCCESS(
                f'空间 {result["space"]} → 文集 #{result["project_id"]} {result["project_name"]}'))
            self.stdout.write(
                f'  页面 {result["pages"]} 篇 | '
                f'新建文档 {result.get("doc_created", 0)} | '
                f'更新正文 {result.get("doc_updated", 0)} | '
                f'内容未变 {result.get("doc_unchanged", 0)} | '
                f'跳过 {result.get("doc_skipped", 0)}')
            if options['dry_run']:
                self.stdout.write(
                    f'  试运行：预计图片 {result.get("images", 0)} 个，'
                    f'附件 {result.get("attachments", 0)} 个，'
                    f'正文合计 {result.get("body_chars", 0)} 字符')
                continue
            self.stdout.write(
                f'  图片 {result.get("image_ok", 0)} 成功 / {result.get("image_fail", 0)} 失败 | '
                f'附件 {result.get("attachment_ok", 0)} 成功 / '
                f'{result.get("attachment_fail", 0)} 失败')
            for field in total:
                total[field] += result.get(field, 0) or 0
            if result.get('attachment_fail'):
                attachment_rejected = True

        if options['dry_run']:
            self.stdout.write('')
            self.stdout.write(self.style.WARNING('试运行结束：未写入数据库，也未写入状态文件'))
            return

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'合计：新建 {total["doc_created"]}，更新 {total["doc_updated"]}，'
            f'未变 {total["doc_unchanged"]}，跳过 {total["doc_skipped"]}'))
        if attachment_rejected:
            self.stdout.write(self.style.WARNING(
                '部分附件未能入库：默认站点策略只允许 zip 附件，'
                '请在「系统设置 → 文档设置 → 附件格式」中放行所需格式后重跑（已成功的不会重复下载）'))
        if not options['keep_search_index']:
            self.stdout.write(self.style.WARNING(
                '本次导入已暂停实时搜索索引，如需检索请执行：'
                'python manage.py rebuild_index'))

        errors = []
        for result in results:
            errors.extend(result.get('errors') or [])
        if errors:
            self.stdout.write('')
            self.stdout.write(self.style.WARNING(f'失败明细（最多显示 20 条，共 {len(errors)} 条）：'))
            for message in errors[:20]:
                self.stdout.write(self.style.WARNING(f'  - {message}'))
