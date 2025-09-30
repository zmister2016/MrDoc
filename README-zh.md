<h1 align="center">觅思文档开源版</h1>

<p align="center">个人和小型团队的云笔记、云文档、知识管理私有化部署方案</p>

<p align="center">
<a href="./README-zh.md">中文介绍</a> |
<a href="./README.md">English Description</a> 
</p>


<p align="center">
<img src="https://img.shields.io/badge/MrDoc-v0.9.7-brightgreen.svg" title="Mrdoc" />
<img src="https://img.shields.io/badge/Python-3.9+-blue.svg" title="Python" />
<img src="https://img.shields.io/badge/Django-v4.2-important.svg" title="Django" />
<a href="https://hellogithub.com/repository/6494f041e00d4b8481ed1114a0bd33c1" target="_blank"><img src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=6494f041e00d4b8481ed1114a0bd33c1&claim_uid=3IU9mFeOVT0cXyw&theme=small" alt="Featured｜HelloGitHub" /></a>
</p>

<p align="center">
<a href="https://mrdoc.pro">官网</a> | 
<a href="http://mrdoc.zmister.com/">演示站点</a> |
<a href="https://www.bilibili.com/video/BV1LF411u7NM/">零基础视频教程</a>
</p>

<p align="center">
<a href="https://doc.mrdoc.pro/p/deploy/">安装手册</a> | 
<a href="https://doc.mrdoc.pro/p/user-guide/">使用手册</a> |
<a href="https://doc.mrdoc.pro/p/example/">文档效果</a>
</p>

<p align="center">源码：<a href="https://gitee.com/zmister/MrDoc">码云</a> | 
<a href="https://github.com/zmister2016/MrDoc">GitHub</a>
</p>

## 简介

`MrDoc` 是基于`Python`开发的在线文档系统。

MrDoc 适合作为个人和中小型团队的私有云文档、云笔记和知识管理工具，致力于成为优秀的私有化在线文档部署方案。

你可以简单粗暴地将 MrDoc 视为「可私有部署的语雀」和「可在线编辑文档的GitBook」。

MrDoc 全系产品目前涵盖以下终端：

- 🌐Web端：开源版、专业版，[版本对比](https://doc.mrdoc.pro/doc/3441/)
- 💻浏览器扩展：主要用于网页剪藏和速记，支持 Chromium 系列浏览器、Firefox 浏览器，[下载地址](https://gitee.com/zmister/mrdoc-webclipper)
- 🗔桌面客户端：主要用于文档编辑和文档导入，支持 Windows、macOS、Linux，[下载地址](https://doc.mrdoc.pro/doc/4031/)
- 📱移动客户端：主要用于个人知识库查看和文档编辑，支持 Android，[下载地址](https://gitee.com/zmister/mrdoc-app-release)
- Obsidian 同步插件：[使用教程](https://doc.mrdoc.pro/doc/45650/)

## 演示站点

开源版 - [http://demo.mrdoc.pro](http://demo.mrdoc.pro)

专业版 - [https://doc.mrdoc.pro](https://doc.mrdoc.pro)

开源版与专业版对比 - [https://doc.mrdoc.pro/doc/3441/](https://doc.mrdoc.pro/doc/3441/)

用户名：test1  密码：123456

## 适用场景

个人云笔记、在线产品手册、团队内部知识库、在线电子教程等私有化部署场景。

## 功能特性

- **⚙站点管理**
	- 用户管理
	- 图片管理
	- 附件管理
	- 文档管理
	- 文集管理
	- 注册邀请码配置
	- 登录验证码配置
	- 全站禁止注册配置
	- 全站强制登录配置
	- 广告代码配置
	- 统计代码配置
	- 站点信息配置
	- 备案号配置
	- 附件配置

- **🧑个人管理**
	- 文集管理
	- 文档管理：新建、删除、回收站、历史版本
	- 文档模板管理：新建、删除
	- 图片管理：上传、分组、删除
	- 附件管理：上传、删除
	- Token管理：借助Token API 接口高效新建和获取文档；
	- 个人信息管理：修改昵称、修改电子邮箱、切换文档编辑器；

- **📚文集控制**
    - 文集图标配置
    - 文字水印配置
    - 文集权限配置：公开、私密、指定用户可见、访问码可见
    - 下载配置：PDF、EPUB文件生成和下载
    - 文集协作成员配置
    - 文集文档拖拽排序
    - 文集导出
    - 文集转让
    
- **✍文档书写**
	- 文本文档、表格文档两种文档类型，`Markdown` 、富文本两种编辑模式，`Editor.md`、`Vditor`、`iceEditor`三种编辑器加持，自由选择、自由切换；
	- 图片、附件、科学公式、音视频、思维导图、流程图、Echart图表；
	- 文档排序、文档上级设置、文档模板插入；
	- 文档标签设置；

- **📖文档阅读**
	- 两栏式布局，三级目录层级显示，左侧文集大纲，右侧文档正文；
	- 文档阅读字体缩放、字体类型切换、日间夜间模式切换、页面社交分享、移动端阅读优化；
	- 文档 Markdown 文件下载；
	- 标签关系网络图；
	- 文档全文搜索；
	- 文档分享码分享；
	- 文档收藏；
	
- **其他特性**
    - 搜索引擎收录支持；
    - sitemap站点地图；
    - 无限用户限制；
    - 无限空间限制；

完整更新记录详见：[CHANGES.md](./CHANGES.md)

## 基于 Docker Compose 的一键部署和更新

### 1、部署
```
git clone https://gitee.com/zmister/mrdoc-install.git && cd mrdoc-install && chmod +x docker-install.sh && ./docker-install.sh
```

### 2、更新

如果有版本更新，直接在觅思文档项目目录下运行`docker-update.sh`脚本即可完成更新。

## 简明运行教程

### 1、安装依赖库
```
pip install -r requirements.txt
```

### 2、初始化数据库

在安装完所需的第三方库并配置好数据库信息之后，我们需要对数据库进行初始化。

在项目路径下打开命令行界面，运行如下命令生成数据库迁移：

```
python manage.py makemigrations 
```

运行如下命令执行数据库迁移:

```
python manage.py migrate
```
执行完毕之后，数据库就初始化完成了。

### 3、创建管理员账户
在初始化完数据库之后，需要创建一个管理员账户来管理整个MrDoc，在项目路径下打开命令行终端，运行如下命令：
```
python manage.py createsuperuser
```
按照提示输入用户名、电子邮箱地址和密码即可。

### 4、测试运行
在完成上述步骤之后，即可运行使用MrDoc。

在测试环境中，可以使用Django自带的服务器运行MrDoc，其命令为：

```
python manage.py runserver
```

## 部署工具

- [Docker 官方镜像](https://hub.docker.com/r/zmister/mrdoc)
- [Docker Compose 一键部署](https://doc.mrdoc.pro/doc/45758/)
- [Docker镜像 By jonnyan404 ](https://registry.hub.docker.com/r/jonnyan404/mrdoc-nginx)
- [~~Linux 一键部署脚本 By jonnyan404~~](https://gitee.com/jonnyan404/oh-my-mrdoc)
- [Windows 部署面板 By 小肥羊](https://gitee.com/debj031634/win-django)
- [VirtualBox/VmWare 虚拟机镜像 By 无名](https://gitee.com/nicktf/tinycore-mrdoc)

## 文档导入工具
- [觅思文档桌面客户端](https://doc.mrdoc.pro/doc/4031/)
- ~~[觅思文档导入工具箱](https://gitee.com/zmister/mrdoc-import-toolbox)~~

## 其他工具

- [本地文档同步工具 By Atyin](https://gitee.com/atyin/mrdocTools)

## 交流

<p align="center">
<img src="https://doc.mrdoc.pro/media/202505/1354bec77bdb4339a74a79397ca79f2d4926.png" width="50%">
</p>

## 依赖

觅思文档基于以下开源项目进行开发，在此表示感谢：

- Python
- Django
- Jquery
- LayUI
- PearAdminLayui
- Editor.md
- Marked
- CodeMirror
- Echarts
- Viewer.js
- Sortable.js
- Vditor
- iceEditor

## 协议

<a href="./LICENSE">GPL-3.0</a>

开源版的使用者必须保留 MrDoc 和觅思文档相关版权标识，禁止对 MrDoc 和 觅思文档相关版权标识进行修改和删除。

如果违反，开发者保留对侵权者追究责任的权利。

其他相关协议亦可参考《[免责声明](https://gitee.com/zmister/MrDoc/blob/master/DISCLAIMER.md)》。

商业授权（专业版）请微信咨询：

<img src="https://doc.mrdoc.pro/media/202212/wechatwork_qrcode_20221201165203490192.png" width="200px" />