# coding:utf-8
"""Confluence 数据来源适配器。

把两种获取途径归一化成通用中间模型（`app_doc.importers.base`），
下游的转换、建树、附件落库、内链改写完全共享，无需维护两条导入链路：

- ApiSource    : 通过 Confluence REST API 在线抓取
- ExportSource : 解析 Confluence「HTML 导出包」（zip）

说明：ExportSource 面向的是 Confluence 的空间导出包，其目录布局随版本有差异，
实现采取"容错 + 多级回退"策略；接入真实导出包后如遇差异，只需调整本文件。
"""

import posixpath
import zipfile
from html import unescape
from urllib.parse import unquote

from bs4 import BeautifulSoup
from loguru import logger

from app_doc.importers.base import (
    BaseSource,
    SourceAttachment,
    SourcePage,
    SourceSpace,
)


# ---------------------------------------------------------------------- #
# 在线 API 来源
# ---------------------------------------------------------------------- #
class ApiSource(BaseSource):
    """Confluence REST API 来源"""

    def __init__(self, client, with_attachments=True):
        self.client = client
        self.with_attachments = with_attachments
        self.identity = client.source_identity()
        self.label = client.describe()

    @staticmethod
    def _to_space(data):
        description = ''
        plain = (data.get('description') or {}).get('plain') or {}
        if plain.get('value'):
            description = plain['value']
        key = data.get('key') or ''
        return SourceSpace(key=key, name=data.get('name') or key, description=description)

    @staticmethod
    def _to_attachment(data, base_url):
        links = data.get('_links') or {}
        extensions = data.get('extensions') or {}
        metadata = data.get('metadata') or {}
        version = data.get('version') or {}
        return SourceAttachment(
            filename=data.get('title') or '',
            remote_id=str(data.get('id') or ''),
            version=int(version.get('number') or 0),
            size=int(extensions.get('fileSize') or 0),
            media_type=metadata.get('mediaType') or '',
            download_url=links.get('download') or '',
            base_url=base_url,
        )

    def list_spaces(self, space_keys=None):
        if space_keys:
            spaces = []
            for key in space_keys:
                spaces.append(self._to_space(self.client.get_space(key)))
            return spaces
        return [self._to_space(item) for item in self.client.list_spaces()]

    def _to_page(self, item):
        page_id = str(item.get('id') or '')
        ancestors = item.get('ancestors') or []
        parent_id = str(ancestors[-1].get('id')) if ancestors else None

        body = ((item.get('body') or {}).get('storage') or {}).get('value') or ''
        version = int(((item.get('version') or {}).get('number')) or 0)

        links = item.get('_links') or {}
        base = links.get('base') or self.client.base_url
        webui = links.get('webui') or ''
        source_url = (base + webui) if webui else ''

        attachments = []
        if self.with_attachments:
            try:
                raw_items, att_base = self.client.list_attachments(page_id)
                attachments = [self._to_attachment(a, att_base) for a in raw_items]
            except Exception as e:  # 单个页面附件失败不应中断整体导入
                logger.warning(f'Confluence 导入：页面 {page_id} 附件列表获取失败 | {e!r}')

        return SourcePage(
            source_id=page_id,
            title=item.get('title') or page_id,
            body=body,
            body_format='storage',
            parent_source_id=parent_id,
            version=version,
            updated=str(((item.get('version') or {}).get('when')) or ''),
            source_url=source_url,
            attachments=attachments,
        )

    def iter_pages(self, space_key, max_pages=None):
        for item in self.client.list_pages(space_key, max_items=max_pages):
            yield self._to_page(item)

    def fetch_attachment(self, attachment):
        return self.client.download(attachment.download_url, attachment.base_url)


# ---------------------------------------------------------------------- #
# 离线导出包来源
# ---------------------------------------------------------------------- #
class ExportSource(BaseSource):
    """Confluence HTML 导出包（zip）来源。

    导出包常见结构（不同版本略有差异）：
        <空间目录>/
            index.html              页面树导航
            <页面>.html             页面正文
            attachments/... 或 images/...  附件与图片
    """

    PAGE_SUFFIXES = ('.html', '.htm')

    def __init__(self, archive_path, with_attachments=True):
        self.archive_path = archive_path
        self.with_attachments = with_attachments
        archive_name = posixpath.basename(str(archive_path).replace('\\', '/'))
        self.identity = f'export:{archive_name}'
        self.label = f'导出包 {archive_path}'

        self._zip = zipfile.ZipFile(archive_path)
        self._infos = {info.filename: info for info in self._zip.infolist()}
        self._names = set(self._infos.keys())
        self._file_set = {n for n in self._names if not n.endswith('/')}

        self._pages = self._discover_pages()
        self._path_to_title = {p: self._read_title(p) for p in self._pages}
        self._title_map = self._build_title_map()
        self._parent_map = self._build_parent_map()

    # ---------------- 发现页面 ---------------- #
    def _discover_pages(self):
        pages = []
        for name in sorted(self._file_set):
            lower = name.lower()
            if not lower.endswith(self.PAGE_SUFFIXES):
                continue
            if posixpath.basename(lower) == 'index.html':
                continue
            pages.append(name)
        if not pages:
            raise ValueError(f'导出包中未找到任何页面 HTML：{self.archive_path}')
        return pages

    def _space_dir(self):
        """页面所在的最上层目录，视作空间目录"""
        first = self._pages[0]
        return first.split('/')[0] if '/' in first else ''

    def _read_text(self, name):
        raw = self._zip.read(name)
        for encoding in ('utf-8', 'utf-8-sig', 'gb18030', 'latin-1'):
            try:
                return raw.decode(encoding)
            except UnicodeDecodeError:
                continue
        return raw.decode('utf-8', errors='replace')

    def _read_title(self, name):
        try:
            soup = BeautifulSoup(self._read_text(name), 'html.parser')
        except Exception:
            return posixpath.basename(name).rsplit('.', 1)[0]

        heading = soup.find('h1', id='title-text') or soup.find('h1', class_='title') \
            or soup.find('h1')
        if heading is not None and heading.get_text(strip=True):
            return heading.get_text(strip=True)

        if soup.title is not None and soup.title.string:
            title = unescape(soup.title.string).strip()
            for suffix in (' - ', ' – '):
                if suffix in title:
                    title = title.split(suffix)[0].strip()
            if title:
                return title

        return posixpath.basename(name).rsplit('.', 1)[0]

    def _build_title_map(self):
        return {path: title for path, title in self._path_to_title.items()}

    # ---------------- 层级推导 ---------------- #
    def _build_parent_map(self):
        """优先用 index.html 的嵌套列表推导层级，其次用面包屑"""
        parent_map = {}
        space_dir = self._space_dir()
        index_name = f'{space_dir}/index.html' if space_dir else 'index.html'

        if index_name in self._names:
            try:
                parent_map.update(self._parents_from_index(self._read_text(index_name)))
            except Exception as e:
                logger.warning(f'Confluence 导出包：index.html 解析失败，回退面包屑 | {e!r}')

        missing = [p for p in self._pages if p not in parent_map]
        if missing:
            for path in missing:
                parent_path = self._parents_from_breadcrumb(path)
                if parent_path and parent_path in self._path_to_title:
                    parent_map[path] = parent_path
        return parent_map

    def _parents_from_index(self, html):
        soup = BeautifulSoup(html, 'html.parser')
        parent_map = {}

        def walk(ul, parent_path):
            for li in ul.find_all('li', recursive=False):
                anchor = li.find('a')
                current = parent_path
                if anchor is not None:
                    target = self._normalize(self._space_dir(), anchor.get('href') or '')
                    if target in self._path_to_title and target != parent_path:
                        parent_map[target] = parent_path
                        current = target
                child_ul = li.find('ul', recursive=False)
                if child_ul is not None:
                    walk(child_ul, current)

        for ul in soup.find_all('ul'):
            if ul.find_parent('ul') is None:
                walk(ul, None)
        return parent_map

    def _parents_from_breadcrumb(self, path):
        try:
            soup = BeautifulSoup(self._read_text(path), 'html.parser')
        except Exception:
            return None
        container = soup.find(id='breadcrumbs') or soup.find(class_='breadcrumbs')
        if container is None:
            return None
        anchors = container.find_all('a')
        for anchor in reversed(anchors):
            target = self._normalize(posixpath.dirname(path), anchor.get('href') or '')
            if target in self._path_to_title and target != path:
                return target
        return None

    # ---------------- 路径归一 ---------------- #
    def _normalize(self, base_dir, href):
        if not href:
            return ''
        href = unquote(href.split('#', 1)[0].strip())
        if not href or href.startswith(('http://', 'https://', 'mailto:')):
            return ''
        if base_dir:
            return posixpath.normpath(posixpath.join(base_dir, href))
        return posixpath.normpath(href)

    def _resolve_file(self, page_path, href):
        """把相对引用解析为导出包内的真实路径，多级回退"""
        for base in (posixpath.dirname(page_path), self._space_dir()):
            candidate = self._normalize(base, href)
            if candidate and candidate in self._file_set:
                return candidate

        # 最后回退：按文件名匹配
        name = posixpath.basename(unquote(href.split('#', 1)[0]))
        matches = [n for n in self._file_set if posixpath.basename(n) == name]
        if len(matches) == 1:
            return matches[0]
        return ''

    # ---------------- 正文抽取与改写 ---------------- #
    def _extract_body(self, html):
        soup = BeautifulSoup(html, 'html.parser')
        container = soup.find(id='main-content') or soup.find(id='content') \
            or soup.find(class_='wiki-content') or soup.body
        if container is None:
            return ''
        return container.decode_contents()

    def _rewrite_body(self, page_path, body):
        """把导出包里的相对引用改写成 storage 标记，复用同一套转换逻辑"""
        soup = BeautifulSoup(body, 'html.parser')

        for anchor in soup.find_all('a'):
            href = anchor.get('href') or ''
            if not href or href.startswith(('http://', 'https://', 'mailto:', '#')):
                continue
            target = self._resolve_file(page_path, href)
            if not target:
                continue
            if target in self._path_to_title:
                anchor.replace_with(self._make_page_link(soup, self._path_to_title[target], anchor))
            else:
                anchor.replace_with(self._make_attachment_link(soup, posixpath.basename(target), anchor))

        for img in soup.find_all('img'):
            src = img.get('src') or ''
            if not src or src.startswith(('http://', 'https://', 'data:')):
                continue
            target = self._resolve_file(page_path, src)
            if not target:
                continue
            macro = soup.new_tag('ac:image')
            ri = soup.new_tag('ri:attachment')
            ri['ri:filename'] = posixpath.basename(target)
            macro.append(ri)
            img.replace_with(macro)

        return soup.decode_contents()

    def _make_page_link(self, soup, title, anchor):
        link = soup.new_tag('ac:link')
        ri = soup.new_tag('ri:page')
        ri['ri:content-title'] = title
        link.append(ri)
        self._attach_link_body(soup, link, anchor)
        return link

    def _make_attachment_link(self, soup, filename, anchor):
        link = soup.new_tag('ac:link')
        ri = soup.new_tag('ri:attachment')
        ri['ri:filename'] = filename
        link.append(ri)
        self._attach_link_body(soup, link, anchor)
        return link

    @staticmethod
    def _attach_link_body(soup, link, anchor):
        """保留锚内原有内容（含图片、格式），避免只留下纯文本标题"""
        if not anchor.contents:
            return
        body = soup.new_tag('ac:link-body')
        for child in list(anchor.contents):
            body.append(child.extract())
        link.append(body)

    # ---------------- 附件 ---------------- #
    def _collect_attachments(self, page_path, body):
        attachments = []
        seen = set()
        soup = BeautifulSoup(body, 'html.parser')
        for tag in soup.find_all(['img', 'a']):
            ref = tag.get('src') or tag.get('href') or ''
            if not ref or ref.startswith(('http://', 'https://', 'mailto:', 'data:', '#')):
                continue
            target = self._resolve_file(page_path, ref)
            if not target or target in self._path_to_title or target in seen:
                continue
            seen.add(target)
            info = self._infos.get(target)
            attachments.append(SourceAttachment(
                filename=posixpath.basename(target),
                remote_id=target,
                version=int(getattr(info, 'CRC', 0) or 0),
                size=int(getattr(info, 'file_size', 0) or 0),
                local_path=target,
            ))
        return attachments

    # ---------------- 接口实现 ---------------- #
    def list_spaces(self, space_keys=None):
        space_dir = self._space_dir()
        key = space_dir or 'CONFLUENCE'
        if space_keys and key not in space_keys:
            return []
        return [SourceSpace(key=key, name=space_dir or key)]

    def iter_pages(self, space_key, max_pages=None):
        count = 0
        for path in self._pages:
            if max_pages and count >= max_pages:
                return
            count += 1
            html = self._read_text(path)
            body = self._extract_body(html)
            attachments = self._collect_attachments(path, body) if self.with_attachments else []
            info = self._infos.get(path)
            yield SourcePage(
                source_id=path,
                title=self._path_to_title.get(path) or posixpath.basename(path),
                body=self._rewrite_body(path, body),
                body_format='html',
                parent_source_id=self._parent_map.get(path),
                version=int(getattr(info, 'CRC', 0) or 0),
                updated='',
                source_url=path,
                attachments=attachments,
            )

    def fetch_attachment(self, attachment):
        return self._zip.read(attachment.local_path)
