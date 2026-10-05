from django.db import models
from django.utils.translation import gettext_lazy as _
from app_doc.models import Doc
import uuid


# 文档 AI 切片索引
class DocAISection(models.Model):
    doc = models.ForeignKey(Doc, on_delete=models.CASCADE, related_name="ai_sections")

    doc_title = models.CharField(max_length=255)  # 文档标题
    section_title = models.CharField(max_length=1024, default="")  # Section 标题
    title_path = models.CharField(max_length=1024, default="")  # Section标题路径（面包屑）
    content = models.TextField()  # 原文切片
    embedding_text = models.TextField(blank=True)  # 文档标题 + Section 标题 + 原文切片，专门用于向量化
    embedding = models.JSONField(null=True, blank=True)  # 向量化

    embedding_status = models.CharField(
        max_length=20,
        default="pending"  # pending / done / failed
    )
    # LLM 增强（预留字段，当前内置引擎不启用）
    summary = models.TextField(blank=True)
    keywords = models.JSONField(default=list)
    tags = models.JSONField(default=list)
    faqs = models.JSONField(default=list)

    llm_status = models.CharField(
        max_length=20,
        default="pending"  # pending / done / failed
    )

    order = models.IntegerField(default=0)
    source_type = models.CharField(max_length=20, default="raw")  # raw / deprecated
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("文档AI切片")
        verbose_name_plural = _("文档AI切片")


# AI 模型供应商
class AIProvider(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.CharField(max_length=50)  # openai, deepseek, 硅基流动、模力方舟...
    api_key = models.CharField(max_length=200)
    base_url = models.URLField(blank=True, null=True)  # 有些厂商需要
    model_type = models.CharField(verbose_name=_("模型类型"), default='text_generate', max_length=100)  # 模型类型，默认文本生成
    model_name = models.CharField(max_length=100, verbose_name=_("模型名称"), blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name=_("是否启用"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("创建时间"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("更新时间"))

    def __str__(self):
        return self.provider

    class Meta:
        verbose_name = _("AI 模型提供商")
        verbose_name_plural = _("AI 模型提供商")


# Prompt 管理
class Prompt(models.Model):
    name = models.CharField(max_length=100, verbose_name=_("Prompt 名称"), unique=True)
    desc = models.TextField(verbose_name=_("Prompt 描述"), blank=True, default="")
    value = models.TextField(verbose_name=_("Prompt 内容"))
    create_time = models.DateTimeField(auto_now_add=True, verbose_name=_("创建时间"))
    modify_time = models.DateTimeField(auto_now=True, verbose_name=_("修改时间"))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Prompt"
        verbose_name_plural = _("Prompt 管理")
