# coding:utf-8
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from django.utils.translation import gettext_lazy as _
from app_api.auth_app import AppMustAuth  # 自定义认证
from app_doc.models import Doc
from app_doc.utils import check_user_doc_edit, check_doc_parent_valid


# 文档节点拖拽排序接口
class DocNodeMoveApi(APIView):
    authentication_classes = [SessionAuthentication, AppMustAuth]

    # 重排排序值
    def normalize_sort(self, qs):
        n = 20
        for d in qs:
            if d.sort != n:
                d.sort = n
                d.save(update_fields=['sort'])
            n += 20

    # 排序中间值计算
    def calc_middle_sort(self, prev, next):
        if prev and next:
            if prev.sort == next.sort:
                # 极端情况兜底
                return prev.sort + 1
            return (prev.sort + next.sort) // 2

        if prev:
            return prev.sort + 10

        if next:
            return max(next.sort - 10, 0)

        # 当前层级第一个节点
        return 10

    def post(self, request):
        doc_id = request.data.get('id')
        parent_id = request.data.get('parent_id')
        prev_id = request.data.get('prev_id')
        next_id = request.data.get('next_id')

        # 权限校验
        if not check_user_doc_edit(request.user.id, doc_id):
            return Response({'code': 5, 'data': _('无权编辑')})

        doc = Doc.objects.filter(id=doc_id).first()
        if doc is None:
            return Response({'code': 1, 'data': _('文档不存在')})
        pro_id = request.data.get('pro_id') or doc.top_doc

        # 上级文档校验，避免跨文集或移动到自身下级形成循环引用
        if parent_id and str(parent_id) != '0':
            if not Doc.objects.filter(id=parent_id, top_doc=pro_id, status=1).exists():
                return Response({'code': 4, 'data': _('上级文档不存在')})
            if not check_doc_parent_valid(doc_id, parent_id):
                return Response({'code': 3, 'data': _('不能将文档移动到其下级文档中')})
        else:
            parent_id = 0

        # 获取前后兄弟节点
        prev = Doc.objects.filter(id=prev_id, top_doc=pro_id).first() if prev_id else None
        next = Doc.objects.filter(id=next_id, top_doc=pro_id).first() if next_id else None

        # 前后兄弟的排序值不同且不为空时，直接取中间值更新
        if prev is not None and next is not None and prev.sort != next.sort:
            new_sort = (prev.sort + next.sort) // 2
        else:
            # 重排文档所在层级的所有文档排序值
            siblings = Doc.objects.filter(
                top_doc=pro_id, parent_doc=parent_id, status=1
            ).order_by('sort', 'create_time')
            self.normalize_sort(siblings)

            # 重新获取前后兄弟节点
            prev = Doc.objects.filter(id=prev_id, top_doc=pro_id).first() if prev_id else None
            next = Doc.objects.filter(id=next_id, top_doc=pro_id).first() if next_id else None

            new_sort = self.calc_middle_sort(prev, next)

        Doc.objects.filter(id=doc_id).update(
            parent_doc=parent_id,
            sort=new_sort
        )

        return Response({'code': 0, 'data': 'ok'})


# 文档结构修改接口（上级文档 + 排序值）
class DocStructureUpdateApi(APIView):
    authentication_classes = [SessionAuthentication, AppMustAuth]

    def post(self, request):
        doc_id = request.data.get('id')
        parent_id = request.data.get('parent_id')
        sort = request.data.get('sort')

        if not doc_id:
            return Response({'code': 1, 'data': _('缺少文档ID')})

        # 权限校验
        if not check_user_doc_edit(request.user.id, doc_id):
            return Response({'code': 5, 'data': _('无权编辑')})

        doc = Doc.objects.filter(id=doc_id).first()
        if doc is None:
            return Response({'code': 1, 'data': _('文档不存在')})
        pro_id = request.data.get('pro_id') or doc.top_doc

        # 排序值处理
        try:
            sort = int(sort) if sort is not None and sort != '' else None
        except (ValueError, TypeError):
            return Response({'code': 2, 'data': _('排序值不合法')})

        # 上级文档合法性校验（防止循环引用）
        if parent_id is not None and str(parent_id) != '' and str(parent_id) != '0':
            if not Doc.objects.filter(id=parent_id, top_doc=pro_id, status=1).exists():
                return Response({'code': 4, 'data': _('上级文档不存在')})
            if not check_doc_parent_valid(doc_id, parent_id):
                return Response({'code': 3, 'data': _('不能将文档的下级文档设为上级')})
        else:
            parent_id = 0

        update_fields = {'parent_doc': parent_id}
        if sort is not None:
            update_fields['sort'] = sort

        Doc.objects.filter(id=doc_id).update(**update_fields)

        return Response({'code': 0, 'data': 'ok'})
