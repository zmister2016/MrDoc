# coding:utf-8

from .text_generate import call_text_generate, call_text_generate_sync
from .embedding import call_embedding
from .base import sse_yield
from app_ai.models import AIProvider
from app_admin.utils import decrypt_data
from cryptography.fernet import InvalidToken
from loguru import logger


def _decrypt_api_key(value):
    """解密 AI Provider 密钥：空值返回空串，密文无法解密时给出可定位的错误"""
    if not value:
        return ''
    try:
        return decrypt_data(value)
    except InvalidToken:
        logger.error('AI Provider 的 api_key 解密失败，请在后台重新保存该模型的密钥')
        raise Exception('API 密钥解密失败，请在后台重新保存该模型的密钥')


def call_ai(provider, task_type, api_key, base_url, model, payload, mode="stream"):
    """
    AI 多任务分发器
    :param provider: 厂商标识，如 openai / giteeai / deepseek
    :param task_type: text_generate
    :param api_key: API 密钥
    :param base_url: API 地址
    :param model: 模型名称
    :param payload: 请求体（通常包含 prompt 或 inputs）
    :param mode: 传输模式，默认流式传输
    """
    provider = (provider or "").lower()
    task_type = (task_type or "").lower()

    try:
        if task_type == "text_generate":
            if mode == 'stream':
                yield from call_text_generate(provider, api_key, base_url, model, payload)
            else:
                result = call_text_generate_sync(provider, api_key, base_url, model, payload)
                yield sse_yield("message", result["content"])
                yield sse_yield("message_end", "")
        else:
            yield sse_yield("error", f"未知的任务类型：{task_type}")

    except Exception as e:
        yield sse_yield("error", f"AI 调用异常：{str(e)}")


def call_ai_sync(provider, task_type, api_key, base_url, model, payload):

    provider = (provider or "").lower()
    task_type = (task_type or "").lower()

    if task_type == "text_generate":
        return call_text_generate_sync(provider, api_key, base_url, model, payload)

    elif task_type == "embedding":
        return get_embedding(payload)

    else:
        raise ValueError(f"未知任务类型: {task_type}")


def call_llm_core(user_input, request=None, mode="stream", task_type='text_generate'):
    """
    文本生成核心入口：直接使用 AIProvider 中最新启用的 text_generate 模型
    """
    ai_model_info = AIProvider.objects.filter(
        is_active=True,
        model_type="text_generate"
    ).order_by('-updated_at').first()

    if not ai_model_info:
        raise Exception("未配置文本生成模型")

    provider = ai_model_info.provider
    base_url = ai_model_info.base_url or ''
    api_key = _decrypt_api_key(ai_model_info.api_key)
    model = ai_model_info.model_name or 'gpt-4o-mini'
    if mode == 'sync':
        return call_ai_sync(provider, task_type, api_key, base_url, model, user_input)
    # 返回生成器
    return call_ai(provider, task_type, api_key, base_url, model, user_input, mode=mode)


def get_embedding(text: str) -> list:
    """
    获取文本向量（统一入口）
    """
    ai_model = AIProvider.objects.filter(
        is_active=True,
        model_type="embedding"
    ).order_by('-updated_at').first()

    if not ai_model:
        raise Exception("未配置 embedding 模型")

    provider = ai_model.provider
    base_url = ai_model.base_url or ''
    api_key = _decrypt_api_key(ai_model.api_key)
    model = ai_model.model_name

    return call_embedding(provider, api_key, base_url, model, text)
