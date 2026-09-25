<h1 align="center">觅思文档开源版</h1>

<p align="center">个人和中小型团队的云笔记、云文档、知识管理私有化部署方案</p>

<p align="center">
<a href="./README-zh.md">中文介绍</a> |
<a href="./README.md">English Description</a> 
</p>


<p align="center">
<a href='https://gitee.com/zmister/MrDoc/stargazers'><img src='https://gitee.com/zmister/MrDoc/badge/star.svg?theme=gvp' alt='star'></img></a>
<a href='https://github.com/zmister2016/MrDoc/stargazers'><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/zmister2016/MrDoc?style=flat&logo=github"></a>
<a href='https://atomgit.com/zmister/MrDoc/stargazers'><img src='https://atomgit.com/zmister/MrDoc/star/badge.svg' alt='star'></img></a>
<img src="https://img.shields.io/badge/MrDoc-v1.1.0-brightgreen.svg" title="MrDoc" />
<img src="https://img.shields.io/badge/MrDocPro-v1.6.8-brightgreen.svg" title="MrDoc专业版" />
<img src="https://img.shields.io/badge/Python-3.9+-blue.svg" title="Python" />
<img src="https://img.shields.io/badge/Django-v4.2-important.svg" title="Django" />
<a href="https://hellogithub.com/repository/6494f041e00d4b8481ed1114a0bd33c1" target="_blank"><img src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=6494f041e00d4b8481ed1114a0bd33c1&claim_uid=3IU9mFeOVT0cXyw&theme=small" alt="Featured｜HelloGitHub" /></a>
</p>

<p align="center">
<a href="https://mrdoc.io">English</a> | 
<a href="https://mrdoc.pro">官网</a> | 
<a href="http://mrdoc.zmister.com/">演示站点</a> |
<a href="https://mrdoc.pro/p/deploy/">安装手册</a> | 
<a href="https://mrdoc.pro/p/user-guide/">使用手册</a> |
<a href="https://mrdoc.pro/p/example/">文档效果</a>
</p>

<p align="center">源码：<a href="https://gitee.com/zmister/MrDoc">Gitee</a> | 
<a href="https://github.com/zmister2016/MrDoc">GitHub</a> |
<a href="https://atomgit.com/zmister/MrDoc">AtomGit</a>
</p>

## 简介

MrDoc（觅思文档）是一款支持私有化部署的在线文档与知识库系统，覆盖知识获取、文档沉淀、知识组织、AI 问答、内容创作与知识分享等环节，帮助个人和中小型团队建立完整的知识管理闭环。

```
知识获取 → 文档沉淀 → 知识组织 → AI 使用 → 内容发布 → 持续沉淀
```

你可以简单粗暴地将 MrDoc 理解为「可私有部署的语雀」和「可在线编辑文档的 GitBook」。

支持 Web、浏览器扩展、桌面客户端、移动客户端及 Obsidian 同步插件，可用于个人知识库、团队知识库、产品文档等场景。

MrDoc 目前提供以下客户端及扩展：

- 🌐Web端：开源版、专业版，[版本对比](https://mrdoc.pro/doc/3441/)
- 💻浏览器扩展：主要用于网页剪藏、速记和AI知识库问答，支持 Chromium 系列浏览器、Firefox 浏览器，[下载地址](https://gitee.com/zmister/mrdoc-webclipper)/[Chrome应用商店](https://chromewebstore.google.com/detail/mrdoc-%E9%80%9F%E8%AE%B0/aenkcglddghpaemlhefmhkdnhfceflcj)/[Edge应用商店](https://microsoftedge.microsoft.com/addons/detail/dihimgafbjljdfanobikhnolpmjjhpic)/[Firefox扩展商店](https://addons.mozilla.org/zh-CN/firefox/addon/mrdoc-webclipper/)
- 🗔桌面客户端：主要用于文档编辑和文档导入，支持 Windows、macOS、Linux，[下载地址](https://mrdoc.pro/d/mrdoc-desktop-releases/)
- 📱移动客户端：主要用于个人知识库查看、文档编辑和AI知识库问答，支持 Android，[下载地址](https://mrdoc.pro/d/mobile-app-releases/)
- Obsidian 同步插件：主要用于Obsidian文档和MrDoc 文档之间的双向同步 [使用教程](https://mrdoc.pro/doc/45650/)

## 适用场景

个人知识库、团队内部知识库、产品文档、项目文档、在线教程等私有化部署场景。

## 功能概览

### 文档与知识管理

| 能力   | 详情                                                                                         |
| ---- | ------------------------------------------------------------------------------------------ |
| 文档编辑 | 支持 Markdown、富文本、表格文档，以及 Editor.md、Vditor、iceEditor 等编辑器；支持图片、附件、公式、音视频、思维导图、流程图、ECharts 图表 |
| 文档管理 | 支持文档层级、排序、标签、模板、历史版本及回收站                                                                   |
| 文集管理 | 支持文集创建、排序、导出、转让及协作成员管理                                                                     |
| 权限控制 | 支持公开、私密、指定用户及访问码等多种访问权限                                                                    |

### AI 能力

| 能力     | 详情                            |
| ------ |-------------------------------|
| AI 知识库 | 基于文档内容和权限进行 AI 问答，快速检索和理解知识   |
| AI 写作  | 支持 AI 文档写作、续写及文本润色            |
| AI 接口  | 支持通过 Token API 接入 AI 能力及第三方应用 |

### 阅读与发布

| 能力   | 详情                              |
| ---- | ------------------------------- |
| 文档阅读 | 两栏式阅读布局、三级目录、字体设置及日间/夜间模式，适配移动端 |
| 内容搜索 | 支持文档全文搜索及标签关系网络                 |
| 内容分享 | 支持文档分享码、收藏及 Markdown 下载         |
| 文集发布 | 支持 PDF、EPUB 生成下载及文集导出           |

### SEO 与 GEO

| 能力     | 详情                                              |
| ------ | ----------------------------------------------- |
| SEO 优化 | 支持搜索引擎收录优化、robots.txt、Canonical 及 JSON-LD 结构化数据 |
| GEO 优化 | 支持 llms.txt 等机制，为 AI 搜索及大语言模型提供网站内容入口          |

### 管理与部署

| 能力    | 详情                               |
| ----- |----------------------------------|
| 站点管理  | 提供用户、文集、文档、图片、附件及站点配置等统一管理能力     |
| 访问控制  | 支持注册邀请码、登录验证码、禁止注册及强制登录          |
| API   | 提供 Token API，支持通过 API 编辑、获取和搜索文档 |
| 私有化部署 | 支持个人电脑、NAS、服务器及企业内网部署，数据由用户自行掌控  |

完整更新记录详见：[CHANGES.md](./CHANGES.md)

## 演示站点

开源版：[http://demo.mrdoc.pro](http://demo.mrdoc.pro)  专业版：[https://mrdoc.pro](https://mrdoc.pro)

开源版与专业版对比 - [https://mrdoc.pro/doc/3441/](https://mrdoc.pro/doc/3441/)

用户名：test1  密码：123456

## Docker Compose 一键部署

### 1、部署
```
git clone https://gitee.com/zmister/mrdoc-install.git && cd mrdoc-install && chmod +x docker-install.sh && ./docker-install.sh
```

### 2、更新

如果有版本更新，直接在觅思文档项目目录下运行`docker-update.sh`脚本即可完成更新。

## Windows 部署面板

没有 Linux 服务器、没有专门的技术人员，也可以在 Windows 上搭建自己的 MrDoc AI知识库。

可视化操作界面，无需额外安装任何环境和依赖，无需输入任何命令，支持 runserver/Waitress 模式运行，提供生产级部署能力。

使用文档：https://mrdoc.pro/d/windows-deploy-panel/
下载地址及更新动态：https://mrdoc.pro/d/windows-panel-log/

### 更多部署方式

详见部署文档：https://mrdoc.pro/doc/1362/

## 部署工具

- [Docker 官方镜像](https://hub.docker.com/r/zmister/mrdoc)
- [Docker Compose 一键部署](https://mrdoc.pro/doc/45758/)
- [Docker镜像 By jonnyan404 ](https://registry.hub.docker.com/r/jonnyan404/mrdoc-nginx)
- [~~Linux 一键部署脚本 By jonnyan404~~](https://gitee.com/jonnyan404/oh-my-mrdoc)
- [Windows 部署面板](https://mrdoc.pro/d/windows-deploy-panel/)
- [VirtualBox/VmWare 虚拟机镜像 By 无名](https://gitee.com/nicktf/tinycore-mrdoc)

## 文档导入工具
- [觅思文档桌面客户端](https://mrdoc.pro/doc/4031/)
- ~~[觅思文档导入工具箱](https://gitee.com/zmister/mrdoc-import-toolbox)~~

## 其他工具

- [本地文档同步工具 By Atyin](https://gitee.com/atyin/mrdocTools)

## 交流

<p>
<img src="https://mrdoc.pro/media/202609/MrDoc%E5%BC%80%E6%BA%90%E7%89%88%E7%94%A8%E6%88%B7%E4%BA%A4%E6%B5%81%E7%BE%A4_20260922194353167253.png" width="50%">
<img src="https://mrdoc.pro/media/202505/1354bec77bdb4339a74a79397ca79f2d4926.png" width="50%">
</p>


## 依赖

MrDoc 基于 Python、Django、Layui、Vditor、Editor.md、ECharts 等开源项目开发，感谢所有开源项目及贡献者。

## 协议

<a href="./LICENSE">GPL-3.0</a>

开源版的使用者必须保留 MrDoc 和觅思文档相关版权标识，禁止对 MrDoc 和 觅思文档相关版权标识进行修改和删除。

如果违反，开发者保留对侵权者追究责任的权利。

### 免责协议与用户合规使用声明

《[MrDoc 免责声明与用户合规使用声明](https://mrdoc.pro/doc/45932/)》。

商业授权（专业版）请微信咨询：

<img src="https://mrdoc.pro/media/202212/wechatwork_qrcode_20221201165203490192.png" width="200px" />