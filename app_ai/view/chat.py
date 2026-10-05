# coding:utf-8

import json
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.utils.translation import gettext_lazy as _
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from app_ai.utils import get_sys_value
from app_ai.views import dynamic_rate_limit_chat
from app_api.auth_app import AppAuth
from loguru import logger


class ChatSessionAuthentication(SessionAuthentication):
    """
    会话认证：在 CSRF 校验前缓存请求原始 body。

    DRF 的 SessionAuthentication.enforce_csrf 会访问 request.POST 以获取
    csrfmiddlewaretoken，从而消费请求体数据流（_read_started=True），导致流式
    响应生成器内再读取 request.body 时抛出 RawPostDataException。这里先缓存
    _body，后续 request.body 直接返回缓存内容，CSRF 校验行为保持不变。
    """

    def enforce_csrf(self, request):
        raw = request._request
        if not hasattr(raw, '_body') and raw.method == 'POST':
            try:
                raw._body = raw.body
            except Exception:
                pass
        super().enforce_csrf(request)

    def authenticate(self, request):
        raw = request._request
        # Token API封装视图（app_api.ai_chat_stream）已验证UserToken并注入用户身份。
        # 父类SessionAuthentication.authenticate对注入用户会强制执行CSRF校验，
        # 外部API客户端没有CSRF Token会导致403，这里识别标记后直接返回注入用户并跳过CSRF
        if getattr(raw, '_token_api_authenticated', False):
            user = getattr(raw, 'user', None)
            if user and user.is_active:
                return (user, None)
        return super().authenticate(request)


def chat_index(request):
    # Web聊天助手不开放欢迎语配置，使用固定默认欢迎语
    ai_chat_welcome = _('你好！我是AI智能助手，有什么可以帮助你的吗？')
    ai_chat_avatar = get_sys_value(types='ai', name='ai_chat_avatar', default='')
    return render(request, 'app_ai/chat.html', locals())


class AIChatStreamApi(APIView):
    """
    AI聊天流式接口 - 对话模式（内置引擎）
    认证方式：SessionAuthentication（会话）或 AppAuth（HTTP TOKEN 头）
    """

    authentication_classes = (ChatSessionAuthentication, AppAuth)
    http_method_names = ['post']

    def post(self, request):
        def event_stream():
            try:
                # 解析请求数据
                try:
                    request_data = json.loads(request.body)
                    user_input = request_data.get('inputs', {}).get('query', '')
                    project_ids = request_data.get('inputs', {}).get('project_ids', [])
                    project_ids = [int(pid) for pid in project_ids if str(pid).isdigit()]
                    conversation_id = request_data.get('conversation_id', '')

                    if not user_input.strip():
                        yield f"data: {json.dumps({'event': 'error', 'message': str(_('消息内容不能为空'))})}\n\n"
                        return

                except (json.JSONDecodeError, KeyError) as e:
                    yield f"data: {json.dumps({'event': 'error', 'message': _('请求数据格式错误: %(e)s') % {'e': str(e)}})}\n\n"
                    return

                # 调用本地知识库
                from app_ai.util.llm_wiki import ask_ai_stream
                # 读取配置的 Prompt ID
                prompt_id = get_sys_value('ai', 'ai_chat_prompt_id', '')
                prompt_id = int(prompt_id) if str(prompt_id).isdigit() else None
                for data in ask_ai_stream(user_input, request.user, project_ids, prompt_id=prompt_id):
                    if data.get("event") in ["message", "reasoning", "status"]:
                        yield f"data: {json.dumps(data)}\n\n"

                    elif data.get("event") == "message_end":
                        metadata = data.get("metadata", {})
                        retriever_resources = metadata.get("retriever_resources", [])

                        # 转换成前端需要的 sources 格式
                        sources = [
                            {
                                "id": r["document_id"],
                                "name": r['title']
                            }
                            for r in retriever_resources
                        ]

                        yield f"data: {json.dumps({'event': 'message_end','conversation_id': conversation_id,'message_id': '','sources': sources})}\n\n"
                        return

            except Exception as e:
                logger.exception(f"AI聊天流式接口异常: {e}")
                yield f"data: {json.dumps({'event': 'error', 'message': _('服务器内部错误: %(e)s') % {'e': str(e)}})}\n\n"

        # 返回流式响应
        response = StreamingHttpResponse(
            event_stream(),
            content_type='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'X-Accel-Buffering': 'no'  # 禁用Nginx缓冲
            }
        )

        return response


# 兼容导出：保留原函数名，app_ai/urls.py 的 URL 引用与 app_api/views.py 的 Token 封装引用保持不变
# 注：dynamic_rate_limit_chat 包装会丢失 as_view() 自带的 csrf_exempt 标记，需在最外层重新声明，否则 POST 会被 CSRF 中间件拦截
ai_chat_stream = csrf_exempt(dynamic_rate_limit_chat(AIChatStreamApi.as_view()))


@login_required
@require_http_methods(["GET"])
def ai_conversations(request):
    """
    获取用户的对话历史列表
    """
    try:
        # 这里可以根据实际需求实现对话历史的存储和获取
        # 示例返回空列表
        conversations = []

        return JsonResponse({
            'success': True,
            'data': conversations
        })

    except Exception as e:
        logger.error(f"获取对话历史失败: {e}")
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)


@csrf_exempt
@login_required
@require_http_methods(["DELETE"])
def ai_conversation_delete(request, conversation_id):
    """
    删除指定的对话
    """
    try:
        # 这里可以实现对话删除逻辑
        # 示例：如果你有ConversationHistory模型
        # ConversationHistory.objects.filter(
        #     conversation_id=conversation_id,
        #     user=request.user
        # ).delete()

        return JsonResponse({
            'success': True,
            'message': _('对话已删除')
        })

    except Exception as e:
        logger.error(f"删除对话失败: {e}")
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)
