# coding:utf-8
"""跨平台导入编排（与平台无关）。

职责：
- 空间 → 文集（支持"每次新建文集"与"导入到指定文集"两种模式）
- 页面 → 文档，保留父子层级与顺序
- 内嵌图片 → 素材图片（Image）并改写为本地地址
- 附件 → 附件记录（Attachment），并在正文末尾追加下载链接
- 页面互链 → 本地文档地址
- 通过本地 JSON 状态文件实现可重跑：已导入的页面/已下载的附件可跳过

平台差异只有正文表示格式一处，通过覆盖 `BaseImporter.convert_body()` 接入，
本模块不含任何平台专有逻辑。
"""

from dataclasses import dataclass

from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from loguru import logger

from app_doc.importers.html_utils import append_attachment_links, build_doc_content
from app_doc.importers.state import ImportState
from app_doc.models import Doc, Project
from app_doc.util_upload_file import handle_attachment_upload
from app_doc.util_upload_img import img_upload

# 状态文件写盘间隔（每处理多少篇文档落一次盘），兼顾性能与断点续跑
STATE_FLUSH_INTERVAL = 20


def _now_str():
    """当前时间字符串；兼容 USE_TZ 开启与关闭两种配置"""
    now = timezone.now()
    if timezone.is_naive(now):
        return now.strftime('%Y-%m-%d %H:%M:%S')
    return timezone.localtime(now).strftime('%Y-%m-%d %H:%M:%S')


# ---------------------------------------------------------------------- #
# 导入配置
# ---------------------------------------------------------------------- #
@dataclass
class ImportOptions:
    user: object
    editor_mode: int = 1
    project: object = None          # 指定文集；为空则新建
    project_name: str = ''          # 新建文集时的名称
    project_role: int = 1           # 新建文集权限，默认私密
    doc_status: int = 1             # 文档状态：1 发布，0 草稿
    mode: str = 'skip-existing'     # skip-existing | update | create
    with_images: bool = True
    with_attachments: bool = True
    max_pages: int = 0
    dry_run: bool = False


# ---------------------------------------------------------------------- #
# 导入器
# ---------------------------------------------------------------------- #
class BaseImporter:
    """平台无关的导入器：建文集 → 建文档树 → 填正文 → 落图片附件。

    新增平台时继承本类，至少覆盖 `convert_body()`。
    """

    def __init__(self, source, state, options):
        self.source = source
        self.state = state
        self.options = options
        self.storage_type = self._read_storage_type()

        self.stats = {
            'doc_created': 0,
            'doc_updated': 0,
            'doc_unchanged': 0,
            'doc_skipped': 0,
            'image_ok': 0,
            'image_fail': 0,
            'attachment_ok': 0,
            'attachment_fail': 0,
            'errors': [],
        }
        self._space_node = None
        self._project_node = None
        self._doc_map = {}          # 来源页面ID -> Doc
        self._title_index = {}      # 页面标题 -> 来源页面ID
        self._created_in_run = set()  # 本次运行内新建的文档（其正文写入不重复计入"更新正文"）
        self._since_flush = 0

    # ---------------- 平台扩展点 ---------------- #
    def convert_body(self, page, resolve_image, resolve_page_link, resolve_attachment_link):
        """把来源正文转换成标准 HTML。

        默认认为来源正文已经是标准 HTML，直接透传；
        正文为平台私有标记（如 Confluence storage format）时覆盖本方法。

        :param resolve_image: callable(filename) -> 本地图片URL 或 None
        :param resolve_page_link: callable(title, space_key) -> 本地文档URL 或 None
        :param resolve_attachment_link: callable(filename) -> 附件URL 或 None
        """
        return page.body

    @staticmethod
    def default_project_name(space):
        """未显式指定文集名称时的默认值"""
        return (space.name or space.key or '导入文集').strip()

    # ---------------- 环境 ---------------- #
    @staticmethod
    def _read_storage_type():
        from app_admin.models import SysSetting
        try:
            return SysSetting.objects.get(types='storage', name='storage_type').value
        except Exception:
            return '0'

    # ---------------- 入口 ---------------- #
    def import_space(self, space):
        """导入一个空间，返回统计信息"""
        self._space_node = self.state.source_node(self.source.identity, space.key, space.name)

        pages = list(self.source.iter_pages(space.key, max_pages=self.options.max_pages or None))
        logger.info(f'内容导入：空间 {space.key} 共获取到 {len(pages)} 个页面')

        if self.options.dry_run:
            return self._dry_run(space, pages)

        project = self._resolve_project(space)
        self._project_node = self.state.project_node(self._space_node, project.id, project.name)

        self._build_skeleton(project, pages)
        self._fill_contents(pages)

        self._space_node['last_run'] = _now_str()
        self._project_node['last_run'] = _now_str()
        self._project_node['project_name'] = project.name
        self.state.save()

        return {
            'space': space.key,
            'project_id': project.id,
            'project_name': project.name,
            'pages': len(pages),
            **self.stats,
        }

    # ---------------- 试运行 ---------------- #
    def _dry_run(self, space, pages):
        """只盘点与试转换，不写数据库、不写状态文件"""
        images = attachments = bodies = 0
        for page in pages:
            images += sum(1 for a in page.attachments if self._is_image(a))
            attachments += sum(1 for a in page.attachments if not self._is_image(a))
            # 试跑一次转换，验证转换链路是否可用
            self.convert_body(page, None, None, None)
            bodies += len(page.body or '')

        return {
            'space': space.key,
            'project_id': 0,
            'project_name': self.options.project_name or self.default_project_name(space),
            'pages': len(pages),
            'images': images,
            'attachments': attachments,
            'body_chars': bodies,
            'dry_run': True,
        }

    # ---------------- 文集 ---------------- #
    def _resolve_project(self, space):
        if self.options.project is not None:
            return self.options.project

        name = (self.options.project_name or self.default_project_name(space)).strip()[:50]
        intro = space.description or f'由「{space.name}」导入'
        return Project.objects.create(
            name=name,
            intro=intro,
            create_user=self.options.user,
            role=self.options.project_role,
        )

    # ---------------- 第一遍：建骨架 ---------------- #
    def _ordered_pages(self, pages):
        """父页面先于子页面，避免依赖创建顺序"""
        by_id = {p.source_id: p for p in pages}
        ordered = []
        placed = set()

        def visit(page, stack):
            if page.source_id in placed:
                return
            parent_id = page.parent_source_id
            if parent_id and parent_id in by_id and parent_id not in placed \
                    and parent_id not in stack:
                visit(by_id[parent_id], stack | {page.source_id})
            placed.add(page.source_id)
            ordered.append(page)

        for page in pages:
            visit(page, set())
        return ordered

    def _build_skeleton(self, project, pages):
        pages_node = self._project_node.setdefault('pages', {})
        siblings_sort = {}

        for page in self._ordered_pages(pages):
            # create 模式忽略已有的文档映射，一律新建（仅用于一次性迁移，会产生重复）
            record = pages_node.get(page.source_id) if self.options.mode != 'create' else None
            doc = None
            if record:
                doc = Doc.objects.filter(id=record.get('doc_id')).first()
                if doc is None:
                    # 目标文档已被删除：状态记录失效，重新创建
                    logger.warning(f'内容导入：状态文件中的文档 {record.get("doc_id")} 已不存在，将重建')
                    pages_node.pop(page.source_id, None)

            if doc is not None:
                self._doc_map[page.source_id] = doc
                continue

            parent_doc = 0
            if page.parent_source_id:
                parent = self._doc_map.get(page.parent_source_id)
                if parent is not None:
                    parent_doc = parent.id

            sort = siblings_sort.get(parent_doc, 0)
            siblings_sort[parent_doc] = sort + 1

            doc = Doc.objects.create(
                name=self._safe_title(page.title),
                pre_content='',
                content='',
                parent_doc=parent_doc,
                top_doc=project.id,
                sort=sort,
                create_user=self.options.user,
                status=self.options.doc_status,
                editor_mode=self.options.editor_mode,
            )
            self._doc_map[page.source_id] = doc
            self._created_in_run.add(page.source_id)
            pages_node[page.source_id] = {
                'doc_id': doc.id,
                'title': page.title,
                'version': page.version,
                'source_url': page.source_url,
            }
            self.stats['doc_created'] += 1
            self._flush_periodically()

    @staticmethod
    def _safe_title(title):
        title = (title or '').strip() or '未命名文档'
        return title[:255]

    def _flush_periodically(self):
        self._since_flush += 1
        if self._since_flush >= STATE_FLUSH_INTERVAL:
            self._since_flush = 0
            self.state.save()

    # ---------------- 第二遍：填正文 ---------------- #
    def _fill_contents(self, pages):
        # 内链改写依赖"标题 → 文档"的完整映射，因此必须在骨架建完之后构建
        for page in pages:
            self._title_index.setdefault(page.title, page.source_id)

        pages_node = self._project_node.setdefault('pages', {})
        for page in pages:
            doc = self._doc_map.get(page.source_id)
            if doc is None:
                continue
            record = pages_node.setdefault(page.source_id, {})
            try:
                self._sync_page(page, doc, record)
            except Exception as e:
                # 单页失败不影响整体导入，记录后继续
                self.stats['errors'].append(f'{page.title}({page.source_id}): {e!r}')
                logger.warning(f'内容导入：页面「{page.title}」处理失败 | {e!r}')
            self._flush_periodically()

    def _sync_page(self, page, doc, record):
        # 已同步且来源版本未变化 → 直接跳过，不再下载附件、不再转换
        if self._should_skip(page, record):
            self.stats['doc_skipped'] += 1
            return

        image_urls, attachment_urls, attachment_links = self._import_files(page)

        def resolve_attachment_link(filename):
            # 正文可能以"链接"的形式指向一张图片（如 Confluence 的
            # <ac:link><ri:attachment/></ac:link>），此时该文件只存在于图片映射里，
            # 需要一并回退查找，否则链接目标会丢失
            return attachment_urls.get(filename) or image_urls.get(filename)

        html = self.convert_body(
            page,
            resolve_image=lambda filename: image_urls.get(filename),
            resolve_page_link=self._resolve_page_link,
            resolve_attachment_link=resolve_attachment_link,
        )
        pre_content, content = build_doc_content(html, self.options.editor_mode)
        pre_content, content = append_attachment_links(
            pre_content, content, self.options.editor_mode, attachment_links)

        if self.options.mode != 'create' \
                and (doc.pre_content or '') == pre_content \
                and (doc.content or '') == (content or ''):
            self.stats['doc_unchanged'] += 1
        else:
            doc.pre_content = pre_content
            doc.content = content
            doc.save(update_fields=['pre_content', 'content', 'modify_time'])
            # 本次新建的文档已在"新建文档"里计数，不再重复计入"更新正文"
            if page.source_id not in self._created_in_run:
                self.stats['doc_updated'] += 1

        record['content_synced'] = True
        record['version'] = page.version
        record['synced_at'] = _now_str()

    def _should_skip(self, page, record):
        """只有 skip-existing 模式才按状态文件跳过；来源版本变化时仍会重新同步"""
        if self.options.mode != 'skip-existing':
            return False
        if not record.get('content_synced'):
            return False
        return record.get('version') == page.version

    # ---------------- 内链 ---------------- #
    def _resolve_page_link(self, title, space_key=''):
        if not title:
            return None
        source_id = self._title_index.get(title)
        if not source_id:
            return None
        doc = self._doc_map.get(source_id)
        if doc is None:
            return None
        return f'/doc/{doc.id}/'

    # ---------------- 图片与附件 ---------------- #
    @staticmethod
    def _is_image(attachment):
        media_type = (attachment.media_type or '').lower()
        if media_type.startswith('image/'):
            return True
        suffix = attachment.filename.rsplit('.', 1)[-1].lower() if '.' in attachment.filename else ''
        return suffix in settings.ALLOWED_IMG

    def _import_files(self, page):
        """下载并入库当前页面的图片与附件，返回 (图片URL映射, 附件URL映射, 附件链接列表)"""
        image_urls = {}
        attachment_urls = {}
        attachment_links = []

        for attachment in page.attachments:
            is_image = self._is_image(attachment)
            if is_image and not self.options.with_images:
                continue
            if not is_image and not self.options.with_attachments:
                continue

            # 缓存键优先取来源侧唯一标识（Confluence 附件ID / 导出包内的成员路径），
            # 这样同一文件被多篇文档引用时只下载入库一次；无标识时退回"页面+文件名"
            cache_key = attachment.remote_id or f'{page.source_id}:{attachment.filename}'
            cached = ImportState.cached_attachment(self._space_node, cache_key)

            if cached:
                url = cached.get('url')
                if cached.get('kind') == 'image':
                    image_urls[attachment.filename] = url
                else:
                    attachment_urls[attachment.filename] = url
                    attachment_links.append((attachment.filename, url))
                continue

            try:
                data = self.source.fetch_attachment(attachment)
            except Exception as e:
                self._count_file_fail(is_image, attachment, e)
                continue

            if is_image:
                url = self._save_image(data, attachment)
                if url:
                    image_urls[attachment.filename] = url
                    self.stats['image_ok'] += 1
                    ImportState.remember_attachment(self._space_node, cache_key, {
                        'kind': 'image', 'url': url, 'size': attachment.size,
                    })
                    continue
                # 图片格式不被允许时降级为普通附件，避免正文出现坏图
                url = self._save_attachment(data, attachment, cache_key)
                if url:
                    attachment_urls[attachment.filename] = url
                    attachment_links.append((attachment.filename, url))
                continue

            url = self._save_attachment(data, attachment, cache_key)
            if url:
                attachment_urls[attachment.filename] = url
                attachment_links.append((attachment.filename, url))

        return image_urls, attachment_urls, attachment_links

    def _count_file_fail(self, is_image, attachment, error):
        if is_image:
            self.stats['image_fail'] += 1
        else:
            self.stats['attachment_fail'] += 1
        message = f'{attachment.filename}: {error!r}'
        self.stats['errors'].append(message)
        logger.warning(f'内容导入：文件下载失败 {message}')

    def _save_image(self, data, attachment):
        result = img_upload(SimpleUploadedFile(attachment.filename, data), '', self.options.user)
        if result.get('success') == 1:
            return result.get('url')
        logger.info(f'内容导入：图片 {attachment.filename} 未入库（{result.get("message")}）')
        return None

    def _save_attachment(self, data, attachment, cache_key):
        result = handle_attachment_upload(
            SimpleUploadedFile(attachment.filename, data), self.options.user, None)
        if not result.get('status'):
            self.stats['attachment_fail'] += 1
            reason = str(result.get('data'))
            self.stats['errors'].append(f'{attachment.filename}: {reason}')
            logger.info(f'内容导入：附件 {attachment.filename} 未入库（{reason}）')
            return None

        url = self._normalize_attachment_url(result['data']['url'])
        self.stats['attachment_ok'] += 1
        # 缓存键取来源侧文件标识，因此同一文件被多篇文档引用、或导入到另一个文集时，
        # 都只下载入库一次，不必重复拉取
        ImportState.remember_attachment(self._space_node, cache_key, {
            'kind': 'attachment',
            'url': url,
        })
        return url

    def _normalize_attachment_url(self, url):
        """本地存储的返回值为相对路径，需要补上 MEDIA_URL 才能被访问"""
        if self.storage_type != '0':
            return url
        if url.startswith('/media/'):
            return url
        return (settings.MEDIA_URL + url).replace('//', '/')

    # ---------------- 兜底写盘 ---------------- #
    def finalize(self):
        self.state.save()


# ---------------------------------------------------------------------- #
# 对外入口
# ---------------------------------------------------------------------- #
def run_import(source, state, options, spaces, importer_cls=BaseImporter):
    """按空间依次导入，返回统计列表

    :param importer_cls: 平台导入器，默认 BaseImporter（正文视为标准 HTML）
    """
    importer = importer_cls(source, state, options)
    results = []
    try:
        for space in spaces:
            results.append(importer.import_space(space))
    finally:
        if not options.dry_run:
            importer.finalize()
    return results
