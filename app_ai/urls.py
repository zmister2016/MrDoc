# coding:utf-8

from django.urls import path,include,re_path
from django.conf import settings
from app_ai import views
from app_ai.view import chat

urlpatterns = [
    path('config/',views.ai_config,name="ai_config"), # AI配置页面
    path('chat/stream/',chat.ai_chat_stream,name="ai_chat_stream"), # AI流式对话接口
    path('chat/conversations/', chat.ai_conversations, name='ai_conversations'), # AI对话会话管理
    path('chat/conversations/<str:conversation_id>/delete/', chat.ai_conversation_delete, name='ai_conversation_delete'), # AI对话会话删除
    path('chat/', chat.chat_index, name='chat_page'), # 聊天助手页面
    path('text_generate/',views.ai_text_genarate,name="ai_text_genarate"), # AI文本生成
    path('model-providers/', views.AIProviderApi.as_view(), name='api-ai-providers-list'), # AI模型供应商列表接口
    path('model-providers/<str:pk>/', views.AIProviderDetailApi.as_view(), name='api-ai-providers-detail'), # AI模型供应商详情接口
    path('manage-doc-sections/<str:doc_id>/',views.manage_doc_ai_section_page,name='manange-ai-doc-secions'), # 文档切片索引管理页面
    path('doc-sections/',views.DocAISectionView.as_view(), name="api-ai-doc-sections"), # 文档切片接口
    path('doc-index/',views.DocAIIndexListView.as_view(), name="api-ai-doc-index"), # 文档索引聚合列表接口
    path('rebuild-section/', views.rebuild_section_index, name='ai-rebuild-section'), # 重建片段索引接口
    path('rebuild-doc/', views.rebuild_doc_index, name='ai-rebuild-doc'), # 重建文档索引接口
    path('rebuild-project/<int:pro_id>/', views.rebuild_project_index, name='ai-rebuild-project'), # 重建文集索引接口
    path('rag-search-debug/',views.RagSearchDebugView.as_view(),name="api-ai-rag-search-debug"), # RAG搜索调试接口
    path('prompts/api/', views.PromptApi.as_view(), name='api-prompt-list'), # Prompt 列表接口
    path('prompts/api/<int:pk>/', views.PromptDetailApi.as_view(), name='api-prompt-detail'), # Prompt 详情接口
]
