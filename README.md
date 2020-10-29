<h1 align="center">MrDoc觅道文档 - 记录文档、汇聚思想</h1>

<p align="center">个人和小型团队的笔记、文档、知识管理私有化部署方案</p>

<p align="center">
<img src="https://img.shields.io/badge/MrDoc-v0.6.0-brightgreen.svg" title="Mrdoc" />
<img src="https://img.shields.io/badge/Python-3.5+-blue.svg" title="Python" />
<img src="https://img.shields.io/badge/Django-v2.2-important.svg" title="Django" />
</p>

<p align="center">
<a href="http://mrdoc.zmister.com/project-7/">安装手册</a> | 
<a href="http://mrdoc.zmister.com/project-20/">文档效果</a> |
<a href="http://mrdoc.zmister.com/">示例站点</a> |
<a href="./README_ENG.md">English</a>
</p>

<p align="center">源码：<a href="https://gitee.com/zmister/MrDoc">码云</a> | 
<a href="https://github.com/zmister2016/MrDoc">GitHub</a>
</p>

## 简介

`MrDoc` 是基于`Python`开发的在线文档系统，适合作为个人和小型团队的文档、知识和笔记管理工具。致力于成为优秀的私有化在线文档部署方案。

目前涵盖：

- Web端，[安装手册](http://mrdoc.zmister.com/project-7/)，[使用手册](http://mrdoc.zmister.com/project-54/)；
- Chrome扩展：
    - MrDoc官方插件：[使用说明](http://mrdoc.zmister.com/project-7/doc-243/)；
    - [简悦扩展](https://github.com/Kenshin/simpread)：[使用说明](https://github.com/Kenshin/simpread/issues/893)
- App端（开发中）
- Windows免安装体验版，[使用说明](http://mrdoc.zmister.com/project-7/doc-249/)


## 打赏

<p align="center">给作者打赏一罐红牛，祝他天天能迭代，日日可更新</p>
<p align="center">
<img src="http://mrdoc.zmister.com/media//202010/2020-10-29_212410.png" height=300>
<img src="http://mrdoc.zmister.com/media//202010/2020-10-29_212511.png" height=300>
<img src="http://mrdoc.zmister.com/media//202010/2020-10-29_212543.png" height=300>
</p>
<p align="center">
<a href="http://mrdoc.zmister.com/project-7/doc-434/">微信</a>|
<a href="http://mrdoc.zmister.com/project-7/doc-434/">支付宝</a>|
<a href="http://mrdoc.zmister.com/project-7/doc-434/">QQ</a>|
<a href="http://mrdoc.zmister.com/project-7/doc-434/">PayPal</a>
</p>

## 功能特性

- **站点管理**
	- 用户注册、用户登录、用户管理、注册邀请码配置、全站关闭注册开关、全站强制登录开关；
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
	- `Editor.md`、`Vditor`双编辑器加持，自由选择、自由切换；
	- 图片、附件、科学公式、音视频、思维导图、流程图、Echart图表；
	- 文档排序、文档上级设置、文档模板插入；
	- 标签设置

- **文档阅读**
	- 两栏式布局，三级目录层级显示，左侧文集大纲，右侧文档正文；
	- 文档阅读字体缩放、字体类型切换、页面社交分享、移动端阅读优化；
	- 文集EPUB、PDF文件下载，文档Markdown文件下载；
	- 标签关系网络图；

完整更新记录详见：[CHANGES.md](./CHANGES.md)

## 简明安装教程

### 1、安装依赖库
```
pip install -r requirements.txt
```

### 2、配置数据库信息

默认情况下，MrDoc使用Django的SQLite数据库，如果你使用Sqlite数据库，则无需另外配置数据库。

如果有配置其他数据库的需求，请首先按照Django官方的[数据库支持说明](https://docs.djangoproject.com/zh-hans/2.2/ref/databases/)，安装特定数据库的Python绑定库，

然后在/MrDoc/config目录下打开conig.ini文件，根据自己的数据库信息进行修改：

```python
# engine，指定数据库类型，接受sqlite、mysql、oracle、postgresql
engine = sqlite
# name表示数据库的名称
# name = db_name
# user表示数据库用户名
# user = db_user
# password表示数据库用户密码
# password = db_pwd
# host表示数据库主机地址
# host = db_host
# port表示数据库端口
# port = db_port
```

### 3、初始化数据库

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

### 4、创建管理员账户
在初始化完数据库之后，需要创建一个管理员账户来管理整个MrDoc，在项目路径下打开命令行终端，运行如下命令：
```
python manage.py createsuperuser
```
按照提示输入用户名、电子邮箱地址和密码即可。

### 5、测试运行
在完成上述步骤之后，即可运行使用MrDoc。

在测试环境中，可以使用Django自带的服务器运行MrDoc，其命令为：

```
python manage.py runserver
```

## 交流：

微信公众号：州的先生（ID：zmister2016）
<img src="http://mrdoc.zmister.com/media//202010/2020-10-29_213550.png" height=150 />

<p>QQ群：735507293 <a href="http://shang.qq.com/wpa/qunwpa?idkey=143c23a4ffbd0ba9137d2bce3ee86c83532c05259a0542a69527e36615e64dba"><img src="http://pub.idqqimg.com/wpa/images/group.png" /></a></p>

## 协议

<a href="./LICENSE">GPL-3.0</a>