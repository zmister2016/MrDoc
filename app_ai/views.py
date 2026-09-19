# coding:utf-8
from django.http import Http404
from django.shortcuts import render
from django.core.cache import cache
from django.core.paginator import Paginator
from django.db.models import Count, Q, Max
from django.http.response import JsonResponse,StreamingHttpResponse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required # 登录需求装饰器
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination # 分页
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from app_admin.decorators import superuser_only
from app_admin.models import SysSetting
from app_api.auth_app import AppMustAuth
from app_api.permissions_app import SuperUserPermission
from app_api.serializers_app import AIProviderSerializer, PromptSerializer
from app_doc.models import Doc
from app_ai.models import DocAISection, AIProvider, Prompt
from app_ai.utils import get_sys_value
from app_ai.services import ai_router
from app_ai.services.reranker import get_reranker
from app_ai.services.vector_store import get_vector_store
from app_ai.util.llm_wiki import rebuild_section, hybrid_search, build_sections_pipeline
from loguru import logger
import json
import time

# Create your views here.

# 返回用户标识符
def get_user_identifier(request):
    """
    返回用户标识符：
    - 已登录用户：user_<id>
    - 匿名用户：anon_<session_key>
    """
    if request.user.is_authenticated:
        return f"user_{request.user.id}"
    else:
        # 确保 session 存在
        if not request.session.session_key:
            request.session.create()
        return f"anon_{request.session.session_key}"


# 自定义分页器，支持layui的?page=1&limit=10形式
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'  # 支持前端传 ?limit=20
    max_page_size = 100              # 最大支持 100 条/页（可选）

# 文本生成动态速率限制装饰器
def dynamic_rate_limit(view_func):
    """
    动态速率限制装饰器，基于 request.user 进行限制
    """

    def wrapped_view(request, *args, **kwargs):
        # 从数据库中获取速率限制值
        rate_limit_value = getattr(
            SysSetting.objects.filter(types='ai', name='ai_write_rate_limit').first(),
            'value', '-1'  # 默认值为 '5/m'
        )

        if rate_limit_value == '-1':
            return view_func(request, *args, **kwargs)

        # 获取用户标识符（使用 request.user）
        user_identifier = get_user_identifier(request)  # 使用用户ID作为标识符

        # 解析速率限制
        try:
            num_requests = int(rate_limit_value)
        except:
            num_requests = 5
        duration = 60

        # 生成缓存键
        cache_key = f'ai_text_rate_limit_{user_identifier}_{request.path}'

        # 获取当前请求时间
        current_time = time.time()

        # 获取缓存中的请求记录
        request_times = cache.get(cache_key, [])

        # 删除超过时间窗口的请求记录
        request_times = [t for t in request_times if current_time - t < duration]

        # 检查请求次数是否超过限制
        if len(request_times) >= num_requests:
            return JsonResponse({'status':False,'data':'已超过请求频率限制，请稍后再使用！'})

        # 添加当前请求时间到记录中
        request_times.append(current_time)

        # 更新缓存
        cache.set(cache_key, request_times, duration)

        # 调用原始视图函数
        return view_func(request, *args, **kwargs)

    return wrapped_view

# 对话动态速率限制装饰器
def dynamic_rate_limit_chat(view_func):
    """
    动态速率限制装饰器，基于 request.user 进行限制
    """

    def wrapped_view(request, *args, **kwargs):
        # 从数据库中获取速率限制值
        rate_limit_value = getattr(
            SysSetting.objects.filter(types='ai', name='ai_chat_rate_limit').first(),
            'value', '-1'  # 默认值为 '5/m'
        )

        if rate_limit_value == '-1':
            return view_func(request, *args, **kwargs)

        # 获取用户标识符（使用 request.user）
        user_identifier = get_user_identifier(request)  # 使用用户ID作为标识符

        # 解析速率限制
        try:
            num_requests = int(rate_limit_value)
        except:
            num_requests = 5
        duration = 60

        # 生成缓存键
        cache_key = f'ai_chat_rate_limit_{user_identifier}_{request.path}'

        # 获取当前请求时间
        current_time = time.time()

        # 获取缓存中的请求记录
        request_times = cache.get(cache_key, [])

        # 删除超过时间窗口的请求记录
        request_times = [t for t in request_times if current_time - t < duration]

        # 检查请求次数是否超过限制
        if len(request_times) >= num_requests:
            return JsonResponse({'status':False,'data':'已超过对话频率限制，请稍后再使用！'})

        # 添加当前请求时间到记录中
        request_times.append(current_time)

        # 更新缓存
        cache.set(cache_key, request_times, duration)

        # 调用原始视图函数
        return view_func(request, *args, **kwargs)

    return wrapped_view


# 后台管理 - 站点管理 - AI接入设置
@superuser_only
def ai_config(request):
    if request.method == 'GET':
        ai_status = get_sys_value('ai', 'ai_status', '')
        ai_chat_status = get_sys_value('ai', 'ai_chat_status', '')
        ai_chat_role = get_sys_value('ai', 'ai_chat_role', '')
        ai_chat_type = get_sys_value('ai', 'ai_chat_type', 'default')
        ai_chat_prompt_id = get_sys_value('ai', 'ai_chat_prompt_id', '')
        ai_chat_rate_limit = get_sys_value('ai', 'ai_chat_rate_limit', '-1')
        ai_write_status = get_sys_value('ai', 'ai_write_status', '')
        ai_write_rate_limit = get_sys_value('ai', 'ai_write_rate_limit', '-1')
        prompt_list = Prompt.objects.all()

        return render(request,'app_ai/config.html',locals())
    elif request.method == 'POST':
        try:
            data = request.POST.get("data")
            data_json = json.loads(data)
            for d in data_json:
                if d['type'] == 'ai':
                    SysSetting.objects.update_or_create(
                        name=d['name'],
                        defaults={'value': d['value'], 'types': 'ai'}
                    )
                else:
                    pass
            return JsonResponse({'code': 0, })
        except Exception as e:
            logger.exception("保存AI配置异常")
            return JsonResponse({'code':4})

# AI文本写作（调用AI模型供应商接口）
@csrf_exempt
@login_required
@dynamic_rate_limit
def ai_text_genarate(request):
    def event_stream():
        user_input = json.loads(request.body)['inputs']['query']
        stream = ai_router.call_llm_core(user_input, request)
        try:
            for chunk in stream:
                if chunk:
                    yield chunk
        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"
    return StreamingHttpResponse(
        event_stream(),
        content_type='text/event-stream',
        headers={'X-Accel-Buffering': 'no'}  # 禁用Nginx缓冲
    )


# AI模型供应商数据接口
class AIProviderApi(GenericAPIView, ListModelMixin, CreateModelMixin):
    """
    支持分页、过滤和排序的 AI模型 提供商 API（列表和创建）
    """
    authentication_classes = [SessionAuthentication, AppMustAuth]
    permission_classes = [SuperUserPermission]

    queryset = AIProvider.objects.all()
    serializer_class = AIProviderSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['is_active']  # 支持过滤的字段
    ordering_fields = ['created_at']  # 支持排序的字段
    ordering = ['-is_active']  # 默认排序字段
    search_fields = ['provider', 'model_name']  # 支持搜索的字段
    pagination_class = PageNumberPagination

    def get(self, request, *args, **kwargs):
        """获取 AI模型提供商列表"""
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """创建新的AI模型提供商"""
        return self.create(request, *args, **kwargs)


class AIProviderDetailApi(GenericAPIView, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
    """
    获取、更新或删除单个AI模型提供商
    """
    authentication_classes = [SessionAuthentication, AppMustAuth]
    permission_classes = [SuperUserPermission]

    queryset = AIProvider.objects.all()
    serializer_class = AIProviderSerializer

    def get(self, request, *args, **kwargs):
        """获取单个AI模型提供商详情"""
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """更新单个AI模型提供商"""
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """删除单个AI模型提供商"""
        return self.destroy(request, *args, **kwargs)


class PromptApi(GenericAPIView, ListModelMixin, CreateModelMixin):
    """Prompt 列表和创建"""
    authentication_classes = [SessionAuthentication, AppMustAuth]
    permission_classes = [SuperUserPermission]

    queryset = Prompt.objects.all()
    serializer_class = PromptSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['name', 'modify_time']
    ordering = ['-modify_time']
    search_fields = ['name', 'desc']
    pagination_class = PageNumberPagination

    def get(self, request, *args, **kwargs):
        """获取 Prompt 列表"""
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """创建 Prompt"""
        return self.create(request, *args, **kwargs)


class PromptDetailApi(GenericAPIView, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
    """Prompt 详情、更新和删除"""
    authentication_classes = [SessionAuthentication, AppMustAuth]
    permission_classes = [SuperUserPermission]

    queryset = Prompt.objects.all()
    serializer_class = PromptSerializer

    def get(self, request, *args, **kwargs):
        """获取单个 Prompt 详情"""
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """更新 Prompt"""
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """删除 Prompt"""
        return self.destroy(request, *args, **kwargs)


# 文档的索引切片管理
@superuser_only
def manage_doc_ai_section_page(request,doc_id):
    try:
        doc = Doc.objects.get(id=doc_id)
        return render(request,'app_ai/manage_ai_doc_sections.html',locals())
    except Exception as e:
        logger.error(f"访问文档索引切片管理页面错误：{repr(e)}")
        raise Http404

# 文档Section索引类视图
class DocAISectionView(APIView):
    authentication_classes = [SessionAuthentication, AppMustAuth]
    permission_classes = [SuperUserPermission]

    def get(self, request):
        """列表查询（Layui表格）"""
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        doc_id = request.GET.get('doc_id')

        qs = DocAISection.objects.select_related('doc').exclude(source_type='deprecated').order_by('doc_id', 'order')

        if doc_id:
            qs = qs.filter(doc_id=doc_id)

        paginator = Paginator(qs, limit)
        page_obj = paginator.get_page(page)

        data = []
        for item in page_obj:
            data.append({
                "id": item.id,
                "doc_title": item.doc.name,
                "chunk_index": item.order,
                "section_title": item.section_title,
                "content_preview": item.content,
                "embedding_text": item.embedding_text,
                "embedding_status": item.embedding_status,
                "updated_at": item.updated_at.strftime("%Y-%m-%d %H:%M:%S")
            })

        return Response({
            "code": 0,
            "msg": "",
            "count": paginator.count,
            "data": data
        })

    def delete(self, request):
        """删除文档chunk"""
        doc_id = request.data.get("doc_id")
        vector_store = get_vector_store()
        if doc_id:
            doc = Doc.objects.filter(id=doc_id).first()
            if not doc:
                return Response({'code':0,'msg':'文档不存在'})
            doc_sections = DocAISection.objects.filter(doc=doc)
            for sec in doc_sections:
                vector_store.delete_by_section(sec.id)
            doc_sections.delete()
            return Response({
                "code": 0,
                "msg": "文档索引删除成功"
            })

        section_id = request.data.get('id')
        if section_id:
            DocAISection.objects.filter(id=section_id).delete()
            vector_store.delete_by_section(section_id)

            return Response({
                "code": 0,
                "msg": "索引删除成功"
            })
        return Response({
            "code": 5,
            "msg": "参数错误"
        })


# 文档索引列表接口（开源版无AIIndex模型，按文档聚合切片数，供文档索引管理使用）
class DocAIIndexListView(APIView):
    authentication_classes = [SessionAuthentication, AppMustAuth]
    permission_classes = [SuperUserPermission]

    def get(self, request):
        """文档索引聚合列表（Layui表格），仅统计全站已发布文档"""
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        kw = request.GET.get('kw', '')

        docs = Doc.objects.filter(status=1, ai_sections__isnull=False).distinct()
        if kw:
            docs = docs.filter(name__icontains=kw)
        docs = docs.annotate(
            chunk_count=Count('ai_sections'),
            updated_at=Max('ai_sections__updated_at'),
        ).order_by('-updated_at')

        paginator = Paginator(docs, limit)
        page_obj = paginator.get_page(page)

        data = []
        for doc in page_obj:
            data.append({
                "doc_id": doc.id,
                "doc_title": doc.name,
                "chunk_count": doc.chunk_count,
                "updated_at": doc.updated_at.strftime("%Y-%m-%d %H:%M:%S") if doc.updated_at else "",
            })

        return Response({
            "code": 0,
            "msg": "",
            "count": paginator.count,
            "data": data
        })


# 重建文档索引（同步执行）
@superuser_only
def rebuild_doc_index(request):
    doc_id = request.POST.get('doc_id')
    if not doc_id:
        return JsonResponse({"status": False, "data": "缺少文档ID"})
    try:
        doc = Doc.objects.get(id=doc_id)
    except Doc.DoesNotExist:
        return JsonResponse({"status": False, "data": "文档不存在"})
    try:
        # 同步重建索引
        result = build_sections_pipeline(doc)
        if result.get("skipped"):
            return JsonResponse({"status": True, "data": "文档内容为空，未生成索引"})
        return JsonResponse({"status": True, "data": f"索引文档重建成功，共 {result['total']} 个切片"})
    except Exception as e:
        logger.error(f"重建文档索引失败：{str(e)}")
        return JsonResponse({"status": False, "data": f"索引重建失败：{str(e)}"})


# 重建片段索引
@superuser_only
def rebuild_section_index(request):
    section_id = request.POST.get('section_id')
    if not section_id:
        return JsonResponse({"status": False, "data": "缺少片段ID"})
    try:
        section = DocAISection.objects.get(id=section_id)
    except DocAISection.DoesNotExist:
        return JsonResponse({"status": False, "data": "片段不存在"})
    try:
        # 重建索引
        rebuild_section(section)
        return JsonResponse({"status": True, "data": "索引重建成功"})
    except Exception as e:
        logger.error(f"重建片段索引失败：{str(e)}")
        return JsonResponse({"status": False, "data": f"索引重建失败：{str(e)}"})


# RAG调试接口
class RagSearchDebugView(APIView):
    authentication_classes = [SessionAuthentication, AppMustAuth]
    permission_classes = [SuperUserPermission]

    @staticmethod
    def _to_int_list(value):
        """把前端传入的 ID（标量或列表）归一化为 int 列表，非法项忽略。

        必须归一化：Django 的 __in 若收到字符串会按字符拆解（如 "12" -> 1、2），
        导致过滤出错误结果。
        """
        if value in (None, ''):
            return []
        items = value if isinstance(value, (list, tuple)) else [value]
        result = []
        for item in items:
            try:
                result.append(int(item))
            except (TypeError, ValueError):
                continue
        return result

    def post(self, request):
        query = request.data.get("query")
        rerank = request.data.get('rerank')

        # 文集/文档过滤：均未传时为 None（调试需看到全量召回，不加限制）；
        # 传了任一则构造 scope，注意不能传空列表的 scope —— 空 scope 在
        # DB/BM25 实现下等价于“命中为空”，而非“不过滤”
        project_ids = self._to_int_list(request.data.get('project_id'))
        doc_ids = self._to_int_list(request.data.get('doc_id'))
        scope = None
        if project_ids or doc_ids:
            scope = {'project_ids': project_ids, 'doc_ids': doc_ids}

        total_start = time.perf_counter()

        # 向量 + BM25 混合检索（RRF 融合）
        search_start = time.perf_counter()
        results = hybrid_search(query, scope=scope)
        search_time = round(
            (time.perf_counter() - search_start) * 1000,
            2
        )

        rerank_time = 0

        # 重排
        if rerank:
            rerank_start = time.perf_counter()

            reranker = get_reranker()
            if reranker is not None:
                results = reranker.rerank(
                    query,
                    results,
                    top_k=5
                )

            rerank_time = round(
                (time.perf_counter() - rerank_start) * 1000,
                2
            )

        total_time = round(
            (time.perf_counter() - total_start) * 1000,
            2
        )

        return JsonResponse({
            "status": True,
            "data": results,
            "debug": {
                "search_time_ms": search_time,
                "rerank_time_ms": rerank_time,
                "total_time_ms": total_time,
                "scope": scope
            }
        })
