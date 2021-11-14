<h1 align="center">觅思文档开源版</h1>

<p align="center">个人和小型团队的云笔记、云文档、知识管理私有化部署方案</p>

<p align="center">
<a href="./README-zh.md">中文介绍</a> |
<a href="./README.md">English Description</a> 
</p>


<p align="center">
<img src="https://img.shields.io/badge/MrDoc-v0.7.2-brightgreen.svg" title="Mrdoc" />
<img src="https://img.shields.io/badge/Python-3.5+-blue.svg" title="Python" />
<img src="https://img.shields.io/badge/Django-v2.2-important.svg" title="Django" />
</p>

<p align="center">
<a href="https://mrdoc.pro">官网</a> | 
<a href="http://mrdoc.zmister.com/">演示站点</a> |
<a href="http://shang.qq.com/wpa/qunwpa?idkey=143c23a4ffbd0ba9137d2bce3ee86c83532c05259a0542a69527e36615e64dba">QQ群</a>
</p>

<p align="center">
<a href="https://doc.mrdoc.pro/project-7/">安装手册</a> | 
<a href="https://doc.mrdoc.pro/project-54/">使用手册</a> |
<a href="https://doc.mrdoc.pro/project-20/">文档效果</a>
</p>

<p align="center">源码：<a href="https://gitee.com/zmister/MrDoc">码云</a> | 
<a href="https://github.com/zmister2016/MrDoc">GitHub</a>
</p>

## 简介

`MrDoc` 是基于`Python`开发的在线文档系统。

MrDoc 适合作为个人和中小型团队的私有云文档、云笔记和知识管理工具，致力于成为优秀的私有化在线文档部署方案。

你可以简单粗暴地将 MrDoc 视为「可私有部署的语雀」和「可在线编辑文档的GitBook」。

MrDoc 目前涵盖终端：

- Web端
- Chrome扩展：
    - [MrDoc官方插件](https://gitee.com/zmister/mrdoc-webclipper)：[使用说明](http://mrdoc.zmister.com/project-7/doc-243/)；
    - [简悦扩展](https://github.com/Kenshin/simpread)：[使用说明](https://github.com/Kenshin/simpread/issues/893)

开发中的终端：

- 微信小程序

计划中的终端：

- 桌面客户端
- 手机APP


## 演示站点

开源版 - [http://mrdoc.zmister.com](http://mrdoc.zmister.com)

专业版 - [https://doc.mrdoc.pro](https://doc.mrdoc.pro)

开源版与专业版差异 - [https://doc.mrdoc.pro/project-7/doc-3441/](https://doc.mrdoc.pro/project-7/doc-3441/)

用户名：test1  密码：123456

## 打赏支持

<p align="center">「付费部署服务」请添加作者QQ：3280350050</p>

<p align="center">请作者喝一罐红牛，助他天天能迭代，日日可更新。<a href="http://mrdoc.zmister.com/project-7/doc-1366/">打赏赞助鸣谢榜</a></p>

<p align="center">
<a href="http://mrdoc.zmister.com/project-7/doc-434/">微信</a>|
<a href="http://mrdoc.zmister.com/project-7/doc-434/">支付宝</a>|
<a href="http://mrdoc.zmister.com/project-7/doc-434/">QQ</a>|
<a href="https://paypal.me/zmister">PayPal</a> |
<a href="https://ko-fi.com/zmister">Ko-Fi</a>
</p>

<p align="center">
<img src="http://mrdoc.zmister.com/media/202106/dashang_wxwebp_1622762424.jpg" height=200>
<img src="http://mrdoc.zmister.com/media/202106/dashang_alipaywebp_1622762435.jpg" height=200>
<img src="http://mrdoc.zmister.com/media/202106/dashang_qqwebp_1622762444.jpg" height=200>
</p>


## 适用场景

个人云笔记、在线产品手册、团队内部知识库、在线电子教程等私有化部署场景。

## 功能特性

- **站点管理**
	- 用户注册、用户登录、用户管理、图片管理、附件管理、文档管理、文集管理、注册邀请码配置、全站关闭注册开关、全站强制登录开关；
	- 广告代码配置、统计代码配置、站点信息配置、备案号配置；
	- 附件格式配置、附件大小配置、图片大小配置；

- **个人管理**
	- 文集管理：新建、删除、权限控制、转让、协作、导出、生成电子书格式文件
	- 文档管理：新建、删除、回收站、历史版本
	- 文档模板管理：新建、删除
	- 图片管理：上传、分组、删除
	- 附件管理：上传、删除
	- Token管理：借助Token高效新建和获取文档；
	- 个人信息管理：修改昵称、修改电子邮箱、切换文档编辑器；
	
- **文档书写**
	- 文本文档、表格文档两种文档类型，`Markdown` 、富文本两种编辑模式，`Editor.md`、`Vditor`、`iceEditor`三种编辑器加持，自由选择、自由切换；
	- 图片、附件、科学公式、音视频、思维导图、流程图、Echart图表；
	- 文档排序、文档上级设置、文档模板插入；
	- 文档标签设置；

- **文档阅读**
	- 两栏式布局，三级目录层级显示，左侧文集大纲，右侧文档正文；
	- 文档阅读字体缩放、字体类型切换、页面社交分享、移动端阅读优化；
	- 文集EPUB、PDF文件下载，文档Markdown文件下载；
	- 标签关系网络图；
	- 文档全文搜索；
	- 私密文档分享码分享

完整更新记录详见：[CHANGES.md](./CHANGES.md)

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

## 第三方部署工具

- [Docker镜像](https://registry.hub.docker.com/r/jonnyan404/mrdoc-nginx)
- [Linux一键部署脚本](https://gitee.com/jonnyan404/oh-my-mrdoc)
- [Windows部署面板](https://gitee.com/debj031634/win-django)

## 交流

<p>微信公众号：州的先生（ID：zmister2016）</p>
<img src="http://mrdoc.zmister.com/media//202010/2020-10-29_213550.png" height=150 />

<p>QQ群：735507293 <a href="http://shang.qq.com/wpa/qunwpa?idkey=143c23a4ffbd0ba9137d2bce3ee86c83532c05259a0542a69527e36615e64dba"><img src="http://pub.idqqimg.com/wpa/images/group.png" /></a></p>
<p>QQ群2：849206042 <a href="https://qm.qq.com/cgi-bin/qm/qr?k=LsgDSw8a6IlrzORBGGyRC6LrlIU_vYON&jump_from=webapi"><img src="//pub.idqqimg.com/wpa/images/group.png" /></a></p>

## 依赖

觅思文档基于以下项目进行开发，在此表示感谢：

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
- TinyMCE

## 协议

<a href="./LICENSE">GPL-3.0</a>

开源版的使用者必须保留 MrDoc 和觅思文档相关版权标识，禁止对 MrDoc 和 觅思文档相关版权标识进行修改和删除。

如果违反，开发者保留对侵权者追究责任的权利。

商业授权（专业版）请联系QQ咨询：3280350050