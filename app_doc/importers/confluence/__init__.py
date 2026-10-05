# coding:utf-8
"""Confluence 迁移导入（平台层）。

- `client.py`  ：Confluence REST 客户端（Cloud / Server 鉴权、分页、限流重试）
- `source.py`  ：来源适配器（在线 API / 离线 HTML 导出包）
- `convert.py` ：storage format → 标准 HTML 转换
- `importer.py`：把上述能力接入通用导入编排

本子包只负责 Confluence 专有部分，通用编排见上一级 `app_doc.importers`。
"""
