from app_doc.models import Doc,Project,ProjectCollaborator
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.conf import settings
from urllib.parse import urlparse
from loguru import logger
import time
import os
import io
import subprocess
import shutil

# 编辑模式与图标class映射
EDITOR_MODE_ICON_MAP = {
    1:'iconfont mrdoc-icon-wendang',
    2:'iconfont mrdoc-icon-wendang',
    3:'iconfont mrdoc-icon-wendang',
    4:'layui-icon layui-icon-table',
    5:'layui-icon layui-icon-link',
    6:'layui-icon layui-icon-release',
    7:'iconfont mrdoc-icon-onlyoffice',
    8:'layui-icon layui-icon-table',
    9:'iconfont mrdoc-icon-mindmap-map',
    10:'iconfont mrdoc-icon-drawio',
    11:'layui-icon layui-icon-theme',
}

# 将扁平的文档列表构建为不限层级的文档树
def build_doc_tree(nodes, child_key='sub', root_parent=0, level_key=None):
    """
    根据文档列表构建不限层级的树形结构。

    nodes: 文档字典列表，每项至少包含 id、parent_doc 字段，列表顺序决定同级顺序
    child_key: 子节点列表挂载的键名，默认为 sub
    root_parent: 根节点的 parent_doc 值，默认为 0
    level_key: 可选，传入时按深度写入该键（从 1 开始计）
    返回: 根节点列表
    """
    doc_map = {}
    for node in nodes:
        node[child_key] = []
        doc_map[node['id']] = node

    roots = []
    for node in nodes:
        parent_id = node.get('parent_doc', 0)
        # 父文档不存在（已删除、跨文集）或指向自身时，作为根节点处理，避免文档在目录中丢失
        if parent_id == root_parent or parent_id == node['id'] or parent_id not in doc_map:
            roots.append(node)
        else:
            doc_map[parent_id][child_key].append(node)

    if level_key:
        def _set_level(items, level):
            for item in items:
                item[level_key] = level
                _set_level(item[child_key], level + 1)

        _set_level(roots, 1)

    return roots


# 递归获取指定文档的全部下级文档ID（包含所有层级）
def get_doc_children_ids(doc_ids):
    """
    获取指定文档的全部下级文档ID列表（含所有层级，不含自身）。
    doc_ids 可传单个文档ID，也可传文档ID列表；按层级逐批查询，避免逐个文档递归查询。
    """
    if isinstance(doc_ids, (int, str)):
        current_ids = [int(doc_ids)]
    else:
        current_ids = [int(i) for i in doc_ids]
    children_ids = []
    # 已访问集合：数据中存在循环引用（A 的下级是 B、B 的下级又是 A）时，
    # 按层级下钻会反复取回同一批ID，去重后循环才必然终止
    visited = set(current_ids)
    while current_ids:
        next_ids = [i for i in Doc.objects.filter(
            parent_doc__in=current_ids).values_list('id', flat=True) if i not in visited]
        if not next_ids:
            break
        visited.update(next_ids)
        children_ids.extend(next_ids)
        current_ids = next_ids
    return children_ids


# 校验文档的上级文档设置是否合法（防止形成循环引用）
def check_doc_parent_valid(doc_id, parent_id):
    """
    判断将文档 doc_id 的上级文档设置为 parent_id 是否合法。
    parent_id 不能是 doc_id 自身，也不能是 doc_id 的下级文档，否则会形成循环引用导致目录异常。
    """
    try:
        doc_id = int(doc_id)
        parent_id = int(parent_id)
    except (TypeError, ValueError):
        return False
    if doc_id == parent_id:
        return False
    # 沿待设置上级文档的父链向上回溯，若经过 doc_id，说明 parent_id 位于 doc_id 的子树中
    visited = set()
    current = parent_id
    while current and current not in visited:
        if current == doc_id:
            return False
        visited.add(current)
        current = Doc.objects.filter(id=current).values_list('parent_doc', flat=True).first() or 0
    return True


# 查找文档的下级文档
def find_doc_next(doc_id):
    doc = Doc.objects.get(id=int(doc_id))  # 当前文档

    # 获取文档的下级文档
    subdoc = Doc.objects.filter(parent_doc=doc.id,top_doc=doc.top_doc, status=1)

    # 如果存在子级文档，那么下一篇文档为第一篇子级文档
    if subdoc.count() != 0:
        next_doc = subdoc.order_by('sort')[0]

    # 如果不存在子级文档，获取兄弟文档
    else:
        sibling_docs = Doc.objects.filter(parent_doc=doc.parent_doc,top_doc=doc.top_doc, status=1).order_by('sort','create_time')
        sibling_list = [d.id for d in sibling_docs]
        # 如果当前文档不是兄弟文档中的最后一个，那么下一篇文档是当前文档的下一个兄弟文档
        if sibling_list.index(doc.id) != len(sibling_list) - 1:
            next_id = sibling_list[sibling_list.index(doc.id) + 1]
            next_doc = Doc.objects.get(id=next_id)
        # 如果当前文档是兄弟文档中的最后一个，那么从上级文档中查找
        else:
            # 如果文档的上级文档为0，说明文档没有上级文档
            if doc.parent_doc == 0:
                next_doc = None
            else:
                next_doc = find_doc_parent_sibling(doc.parent_doc)

    return next_doc


# 查找文档的上级文档的同级文档（用于遍历获取文档的下一篇文档）
def find_doc_parent_sibling(doc_id):
    doc = Doc.objects.get(id=int(doc_id))  # 当前文档

    # 获取兄弟文档
    sibling_docs = Doc.objects.filter(parent_doc=doc.parent_doc, top_doc=doc.top_doc, status=1).order_by('sort',
                                                                                                             'create_time')
    sibling_list = [d.id for d in sibling_docs]
    # 如果当前文档不是兄弟文档中的最后一个，那么下一篇文档是当前文档的下一个兄弟文档
    if sibling_list.index(doc.id) != len(sibling_list) - 1:
        next_id = sibling_list[sibling_list.index(doc.id) + 1]
        next_doc = Doc.objects.get(id=next_id)
    # 如果当前文档是兄弟文档中的最后一个，那么从上级文档中查找
    else:
        # 如果文档的上级文档为0，说明文档没有上级文档
        if doc.parent_doc == 0:
            next_doc = None
        else:
            next_doc = find_doc_parent_sibling(doc.parent_doc)
    return next_doc


# 查找文档的上一篇文档
def find_doc_previous(doc_id):
    doc = Doc.objects.get(id=int(doc_id))  # 当前文档
    # 获取文集的文档默认排序方式
    sort = Project.objects.get(id=doc.top_doc)
    # 获取文档的兄弟文档
    # 获取兄弟文档
    sibling_docs = Doc.objects.filter(parent_doc=doc.parent_doc, top_doc=doc.top_doc, status=1).order_by('sort',
                                                                                                             'create_time')
    sibling_list = [d.id for d in sibling_docs]

    # 如果文档为兄弟文档的第一个，那么其上级文档即为上一篇文档
    if sibling_list.index(doc.id) == 0:
        # 如果其为顶级文档，那么没有上一篇文档
        if doc.parent_doc == 0:
            previous_doc = None
        # 如果其为次级文档，那么其上一篇文档为上级文档
        else:
            previous_doc = Doc.objects.get(id=doc.parent_doc)
    # 如果文档不为兄弟文档的第一个，从兄弟文档中查找
    else:
        previous_id = sibling_list[sibling_list.index(doc.id) - 1]
        previous_doc = find_doc_sibling_sub(previous_id,sort)

    return previous_doc


# 查找文档的最下级文档（用于遍历获取文档的上一篇文档）
def find_doc_sibling_sub(doc_id,sort):
    doc = Doc.objects.get(id=int(doc_id))  # 当前文档
    # 查询文档的下级文档
    if sort == 1:
        subdoc = Doc.objects.filter(parent_doc=doc.id, top_doc=doc.top_doc, status=1).order_by(
            '-create_time')
    else:
        subdoc = Doc.objects.filter(parent_doc=doc.id, top_doc=doc.top_doc, status=1).order_by('sort','create_time')
    subdoc_list = [d.id for d in subdoc]
    # 如果文档没有下级文档，那么返回自己
    if subdoc.count() == 0:
        previous_doc = doc
    # 如果文档存在下级文档，查找最靠后的下级文档
    else:
        previous_doc = find_doc_sibling_sub(subdoc_list[len(subdoc) - 1],sort)

    return previous_doc

# 验证用户是否有文集的协作权限
def check_user_project_writer_role(user_id,project_id):
    if user_id == '' or project_id == '':
        return False
    try:
        user = User.objects.get(id=user_id)

        # 验证请求者是否有文集的权限
        project = Project.objects.filter(id=project_id, create_user=user)
        if project.exists():
            return True

        # 协作用户
        colla_project = ProjectCollaborator.objects.filter(project__id=project_id, user=user)
        if colla_project.exists():
            return True
        return False
    except Exception as e:
        logger.error(e)
        return False

# 验证用户是否有文集的访问权限
def check_user_project_view_role(user_id,project_id):
    if user_id == '' or project_id == '':
        return False
    try:
        project = Project.objects.get(id=project_id)
    except:
        return False

    if project.role in [0,4]: # 公开、登录可见
        return True

    try:
        user = User.objects.get(id=user_id)
    except:
        return False

    str_user_id = str(user.id)
    if project.create_user == user: # 文集作者有权限
        return True

    # 协作用户
    colla_user = ProjectCollaborator.objects.filter(project=project, user=user).count()
    # 协作用户组
    colla_groups = ProjectCollaboratorUserGroup.objects.filter(project=project)
    for colla_group in colla_groups:  # 判断用户存在于文集协作用户组中
        if str_user_id in colla_group.group.group_ids.split(","):
            colla_user = colla_groups.count()
            break

    if colla_user > 0: # 协作用户有权限
        return True

    if project.role == 2: # 指定用户可见文集
        try:
            user_list = project.role_value.split(',')  # 文集允许的用户和用户组id列表
        except:
            user_list = []
        if str_user_id in user_list:
            return True

    # 访问码可见
    elif project.role == 3:
        return False

    return False


# 验证URL的有效性，以及排除本地URL
def validate_url(url):
    try:
        validate = URLValidator()
        validate(url)
        parsed_url = urlparse(url)
        if parsed_url.hostname in ['localhost', '127.0.0.1']:
            return False
        return url
    except:
        return False

# Docx x-emf 图片处理
_wmf_extensions = {
    "image/x-wmf": ".wmf",
    "image/x-emf": ".emf",
}


def libreoffice_wmf_conversion(image, post_process=None):
    if post_process is None:
        post_process = lambda x: x

    wmf_extension = _wmf_extensions.get(image.content_type)
    if wmf_extension is None:
        return image
    else:
        # 定义临时文件夹
        temporary_directory = os.path.join(settings.MEDIA_ROOT,'import_docx_imgs')
        if os.path.exists(temporary_directory) is False:
            os.mkdir(temporary_directory)
        try:
            timestamp = str(time.time())
            # 将 docx 内嵌图片文件存为wmf、emf等文件
            input_path = os.path.join(temporary_directory, "image_{}".format(timestamp) + wmf_extension)
            with open(input_path, "wb") as input_fileobj:
                with image.open() as image_fileobj:
                    shutil.copyfileobj(image_fileobj, input_fileobj)

            # 调用 LibreOffice 将 wmf/emf 文件转为 PNG 图片文件
            output_path = os.path.join(temporary_directory, "image_{}.png".format(timestamp))
            subprocess.check_call([
                settings.LIBREOFFICE_PATH,
                "--headless",
                "--convert-to",
                "png",
                input_path,
                "--outdir",
                temporary_directory,
            ])

            # return post_process(output_path)

            with open(output_path, "rb") as output_fileobj:
                output = output_fileobj.read()

            def open_image():
                return io.BytesIO(output)

            return post_process(image.copy(
                content_type="image/png",
                open=open_image,
            ))
        except:
            return image
        finally:
            if os.path.exists(input_path):
                os.remove(input_path)
            if os.path.exists(output_path):
                os.remove(output_path)

def image_trim(old_image):
    from PIL import Image

    # 获取时间戳作为文件名的一部分
    timestamp = str(time.time())
    temporary_directory = os.path.join(settings.MEDIA_ROOT, 'import_docx_imgs')
    output_path = os.path.join(temporary_directory, f"trim_image_{timestamp}.png")

    def open_image():
        try:
            with open(output_path, 'rb') as imgfile:
                return io.BytesIO(imgfile.read())
        finally:
            if os.path.exists(output_path):
                os.remove(output_path)

    image = Image.open(old_image.open())
    width, height = image.size

    # 初始化裁剪边界
    x_left, x_top = width, height
    x_right = x_bottom = 0

    # 遍历每个像素
    for r in range(height):
        for c in range(width):
            pixel = image.getpixel((c, r))  # 获取 (x, y) 像素值
            # 判断条件，避免裁剪掉内容
            if pixel[0] < 255 and pixel[1] < 255 and pixel[2] < 255:  # 假设是接近白色的区域
                x_top = min(x_top, r)
                x_bottom = max(x_bottom, r)
                x_left = min(x_left, c)
                x_right = max(x_right, c)

    # 进行裁剪
    if x_left < x_right and x_top < x_bottom:
        cropped = image.crop((x_left - 5, x_top - 5, x_right + 5, x_bottom + 5))  # 裁剪区域
        cropped.save(output_path, format="PNG")
    else:
        # 如果没有找到有效的裁剪区域，直接保存原图
        image.save(output_path, format="PNG")

    new_image = old_image.copy(open=open_image)
    return new_image
