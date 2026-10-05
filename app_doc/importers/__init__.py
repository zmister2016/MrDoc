# coding:utf-8
"""跨平台内容导入框架。

分两层组织，新增一个平台时只需写平台层：

- 通用层（本目录）：与具体平台无关的中间模型、状态文件、正文落地与导入编排。
  文集与文档树的建立、图片/附件落库、内链改写、幂等跳过都在这里，可直接复用。
- 平台层（子包，如 `confluence/`）：某平台的客户端、来源适配器与正文转换。

新增平台的步骤：
1. 在 `base.py` 的 `BaseSource` 契约下写一个来源适配器（如 `notion/source.py`）；
2. 若该平台正文不是标准 HTML，继承 `pipeline.BaseImporter` 覆盖 `convert_body()`；
3. 在 `app_admin/management/commands/` 下加一个命令入口，把二者接起来。
"""
