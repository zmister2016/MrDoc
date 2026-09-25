<h1 align="center">MrDoc - Writing documents, Gathering ideas</h1>

<p align="center">A self-hosted notes, documents and knowledge management solution for individuals and small teams</p>

<p align="center">
<a href="./README-zh.md">中文介绍</a> |
<a href="./README.md">English Description</a> 
</p>


<p align="center">
<a href='https://gitee.com/zmister/MrDoc/stargazers'><img src='https://gitee.com/zmister/MrDoc/badge/star.svg?theme=gvp' alt='star'></img></a>
<a href='https://github.com/zmister2016/MrDoc/stargazers'><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/zmister2016/MrDoc?style=flat&logo=github"></a>
<a href='https://atomgit.com/zmister/MrDoc/stargazers'><img src='https://atomgit.com/zmister/MrDoc/star/badge.svg' alt='star'></img></a>
<img src="https://img.shields.io/badge/MrDoc-v1.1.0-brightgreen.svg" title="MrDoc" />
<img src="https://img.shields.io/badge/MrDocPro-v1.6.8-brightgreen.svg" title="MrDoc Professional" />
<img src="https://img.shields.io/badge/Python-3.9+-blue.svg" title="Python" />
<img src="https://img.shields.io/badge/Django-v4.2-important.svg" title="Django" />
<a href="https://hellogithub.com/repository/6494f041e00d4b8481ed1114a0bd33c1" target="_blank"><img src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=6494f041e00d4b8481ed1114a0bd33c1&claim_uid=3IU9mFeOVT0cXyw&theme=small" alt="Featured｜HelloGitHub" /></a>
</p>

<p align="center">
<a href="https://mrdoc.io">Home</a> | 
<a href="https://mrdoc.pro">Official Site</a> | 
<a href="http://mrdoc.zmister.com/">Demo Site</a> |
<a href="https://mrdoc.pro/p/deploy/">Deployment Guide</a> | 
<a href="https://mrdoc.pro/p/user-guide/">User Manual</a> |
<a href="https://mrdoc.pro/p/example/">Document Examples</a>
</p>

<p align="center">Source code：<a href="https://gitee.com/zmister/MrDoc">Gitee</a> | 
<a href="https://github.com/zmister2016/MrDoc">GitHub</a> |
<a href="https://atomgit.com/zmister/MrDoc">AtomGit</a>
</p>

## Introduce

MrDoc is a self-hostable online document and knowledge base system. It covers the full cycle of knowledge capture, document storage, knowledge organization, AI Q&A, content creation and knowledge sharing, helping individuals and small teams build a complete knowledge management loop.

```
Capture → Store → Organize → Use with AI → Publish → Keep Accumulating
```

You can simply think of MrDoc as a "self-hosted Yuque" and an "online-editable GitBook".

Supports Web, browser extensions, desktop client, mobile client and Obsidian sync plugin, and can be used for personal knowledge bases, team knowledge bases, product documentation and other scenarios.

MrDoc currently provides the following clients and extensions:

- 🌐Web: Open Source Edition and Professional Edition, [version comparison](https://mrdoc.pro/doc/3441/)
- 💻Browser Extension: mainly for web clipping, quick notes and AI knowledge base Q&A; supports Chromium-based browsers and Firefox, [Download](https://gitee.com/zmister/mrdoc-webclipper)/[Chrome Web Store](https://chromewebstore.google.com/detail/mrdoc-%E9%80%9F%E8%AE%B0/aenkcglddghpaemlhefmhkdnhfceflcj)/[Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/dihimgafbjljdfanobikhnolpmjjhpic)/[Firefox Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/mrdoc-webclipper/)
- 🗔Desktop Client: mainly for document editing and importing; supports Windows, macOS, Linux, [Download](https://mrdoc.pro/d/mrdoc-desktop-releases/)
- 📱Mobile Client: mainly for personal knowledge base viewing, document editing and AI knowledge base Q&A; supports Android, [Download](https://mrdoc.pro/d/mobile-app-releases/)
- Obsidian Sync Plugin: mainly for two-way sync between Obsidian documents and MrDoc documents [Tutorial](https://mrdoc.pro/doc/45650/)

## Applicable Scenarios

Self-hosted scenarios such as personal knowledge bases, internal team knowledge bases, product documentation, project documentation and online tutorials.

## Feature Overview

### Document & Knowledge Management

| Capability | Details |
| ---- | ---- |
| Document Editing | Supports Markdown, rich text and spreadsheet documents, along with editors such as Editor.md, Vditor and iceEditor; supports images, attachments, formulas, audio and video, mind maps, flow charts and ECharts diagrams |
| Document Management | Supports document hierarchy, sorting, tags, templates, historical versions and recycle bin |
| Project Management | Supports project creation, sorting, export, transfer and collaborator management |
| Permission Control | Supports multiple access permissions such as public, private, specified users and access codes |

### AI Capabilities

| Capability | Details |
| ---- | ---- |
| AI Knowledge Base | AI Q&A based on document content and permissions, for fast retrieval and understanding of knowledge |
| AI Writing | Supports AI document writing, continuation and text polishing |
| AI API | Supports accessing AI capabilities and third-party applications through Token API |

### Reading & Publishing

| Capability | Details |
| ---- | ---- |
| Document Reading | Two-column reading layout, three-level outline, font settings and day/night modes, adapted for mobile |
| Content Search | Supports document full-text search and tag relationship network |
| Content Sharing | Supports document share codes, favorites and Markdown download |
| Project Publishing | Supports PDF and EPUB generation and download, as well as project export |

### SEO & GEO

| Capability | Details |
| ---- | ---- |
| SEO Optimization | Supports search engine indexing optimization, robots.txt, Canonical and JSON-LD structured data |
| GEO Optimization | Supports mechanisms such as llms.txt, providing an entry point to site content for AI search and large language models |

### Management & Deployment

| Capability | Details |
| ---- | ---- |
| Site Management | Provides unified management of users, projects, documents, images, attachments and site configuration |
| Access Control | Supports registration invitation codes, login captcha, disabling registration and forced login |
| API | Provides Token API, supporting editing, retrieving and searching documents through the API |
| Self-hosting | Supports deployment on personal computers, NAS, servers and corporate intranets, with data fully controlled by the user |

For the complete update record, see: [CHANGES.md](./CHANGES.md)

## Example Site

Open Source Edition: [http://demo.mrdoc.pro](http://demo.mrdoc.pro)　Professional Edition: [https://mrdoc.pro](https://mrdoc.pro)

Comparison between the Open Source Edition and the Professional Edition - [https://mrdoc.pro/doc/3441/](https://mrdoc.pro/doc/3441/)

username: test1　password: 123456

## Docker Compose Deployment

### 1、Deployment
```
git clone https://gitee.com/zmister/mrdoc-install.git && cd mrdoc-install && chmod +x docker-install.sh && ./docker-install.sh
```

### 2、Update

If a new version is available, simply run the `docker-update.sh` script in the MrDoc project directory to complete the update.

## Windows Deployment Panel

Even without a Linux server or dedicated technical staff, you can still build your own MrDoc AI knowledge base on Windows.

Visual operation interface, no need to install any extra environment or dependencies, no need to enter any commands, supports runserver/Waitress modes and provides production-grade deployment capabilities.

User Manual: https://mrdoc.pro/d/windows-deploy-panel/
Download and update notes: https://mrdoc.pro/d/windows-panel-log/

### More Deployment Methods

See the deployment documentation for details: https://mrdoc.pro/doc/1362/

## Deployment Tools

- [Official Docker Image](https://hub.docker.com/r/zmister/mrdoc)
- [Docker Compose One-Click Deployment](https://mrdoc.pro/doc/45758/)
- [Docker Image By jonnyan404](https://registry.hub.docker.com/r/jonnyan404/mrdoc-nginx)
- [~~Linux Deployment Script By jonnyan404~~](https://gitee.com/jonnyan404/oh-my-mrdoc)
- [Windows Deployment Panel](https://mrdoc.pro/d/windows-deploy-panel/)
- [VirtualBox/VmWare Image By 无名](https://gitee.com/nicktf/tinycore-mrdoc)

## Document Import Tools
- [MrDoc Desktop Client](https://mrdoc.pro/doc/4031/)
- ~~[MrDoc Import Toolbox](https://gitee.com/zmister/mrdoc-import-toolbox)~~

## Other Tools

- [Local Document Synchronization Tool By Atyin](https://gitee.com/atyin/mrdocTools)

## Feedback

<p>
<img src="https://mrdoc.pro/media/202609/MrDoc%E5%BC%80%E6%BA%90%E7%89%88%E7%94%A8%E6%88%B7%E4%BA%A4%E6%B5%81%E7%BE%A4_20260922194353167253.png" width="50%">
<img src="https://mrdoc.pro/media/202505/1354bec77bdb4339a74a79397ca79f2d4926.png" width="50%">
</p>

You can also submit issues on the following pages:

- [https://gitee.com/zmister/MrDoc/issues](https://gitee.com/zmister/MrDoc/issues)
- [https://github.com/zmister2016/MrDoc/issues](https://github.com/zmister2016/MrDoc/issues)

## Dependent

MrDoc is developed based on open source projects such as Python, Django, Layui, Vditor, Editor.md and ECharts. Thanks to all open source projects and contributors.

## License

<a href="./LICENSE">GPL-3.0</a>

Users of the Open Source Edition must retain the copyright notices related to MrDoc (觅思文档). Modifying or removing the MrDoc (觅思文档) copyright notices is prohibited.

In case of violation, the developer reserves the right to pursue legal responsibility against the infringer.

### Disclaimer and User Compliance Statement

《[MrDoc Disclaimer and User Compliance Statement](https://mrdoc.pro/doc/45932/)》.

For commercial licensing (Professional Edition), please contact via WeChat:

<img src="https://mrdoc.pro/media/202212/wechatwork_qrcode_20221201165203490192.png" width="200px" />
