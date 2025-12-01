<h1 align="center">MrDoc - Writing documents, Gathering ideas</h1>

<p align="center">Personal and small team notes, documents, knowledge management privatization deployment scheme</p>

<p align="center">
<a href="./README-zh.md">中文介绍</a> |
<a href="./README.md">English Description</a> 
</p>

<p align="center">
<img src="https://img.shields.io/badge/MrDoc-v0.9.8-brightgreen.svg" title="Mrdoc" />
<img src="https://img.shields.io/badge/Python-3.9+-blue.svg" title="Python" />
<img src="https://img.shields.io/badge/Django-v4.2-important.svg" title="Django" />
<a href="https://hellogithub.com/repository/6494f041e00d4b8481ed1114a0bd33c1" target="_blank"><img src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=6494f041e00d4b8481ed1114a0bd33c1&claim_uid=3IU9mFeOVT0cXyw&theme=small" alt="Featured｜HelloGitHub" /></a>
</p>

<p align="center">
<a href="https://mrdoc.io">Home</a> | 
<a href="http://demo.mrdoc.pro/">Example Site</a> |

</p>

<p align="center">
<a href="https://mrdoc.io/p/deploy_guide/">Deployment Guide</a> | 
<a href="https://mrdoc.io/p/user_manual/">User Manual</a> |
<a href="https://mrdoc.io/p/example/">Document Example</a>
</p>


<p align="center">Source code：<a href="https://gitee.com/zmister/MrDoc">Gitee</a> | 
<a href="https://github.com/zmister2016/MrDoc">GitHub</a>
</p>


### Introduce

`Mrdoc` is an online document system developed based on python. It is suitable for individuals and small teams to manage documents, knowledge and notes. It is committed to become a private online document deployment solution for the whole platform (web, desktop, mobile).

Current Platform：

- 🌐Web:[instructions](https://mrdoc.io/p/deploy_guide/)；
- 💻Browser Extensions:Supported Chromium Browser,Firefox Browser [Download](https://gitee.com/zmister/mrdoc-webclipper)/[Chrome](https://chromewebstore.google.com/detail/mrdoc-%E9%80%9F%E8%AE%B0/aenkcglddghpaemlhefmhkdnhfceflcj)/[Edge](https://microsoftedge.microsoft.com/addons/detail/dihimgafbjljdfanobikhnolpmjjhpic)/[Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/mrdoc-webclipper/)
- 🗔Desktop: Supported Windows,macOS,Linux [Download](https://gitee.com/zmister/mrdoc-desktop-release/releases/)
- 📱Mobile APP:supportd Android [Download](https://gitee.com/zmister/mrdoc-app-release)
- Obsidian Plugin：[Instructions](https://doc.mrdoc.pro/doc/45650/)

## Example Site

Open Source Edition -  [http://demo.mrdoc.pro](http://demo.mrdoc.pro)

Professional Edition - [https://docker.mrdoc.pro](https://doc.mrdoc.pro)

username:test1  password:123456

## Feature

- **⚙Site Manage & User Manage**
    - Support user registration, login, management, administrator and other basic user functions;
    - Support site configuration registration invitation code, advertising code, statistics code, email retrieval password, site wide close registration, site wide forced login and other management functions;
    - It supports the configuration of the permission of the Project, and provides four permission modes: public, private, visible to the specified user and visible to the access code;
    
- **📚Document System**
    - Document writing and reading are based on the Project, with five modules, namely **project**, **document**, **document template**, **image** and **attachment**;
    - The `markdown` editor based on `editormd` and `vditor` is used to optimize and extend, and the `markdown` syntax is used for document writing, and image management and uploading, table pasting, mind mapping, flow chart drawing and sequence diagram drawing are supported;
    - Two column **document reading** page, three-level directory level display, document reading font scaling, font type switching, page social sharing, mobile reading optimization, text collection export PDF, ePub file;
    - Support the account based `API` interface, which can use the account `token` to get the corpus, upload pictures and create documents through the 'API';
    - Supports the project collaboration function. A project can have one Creator and multiple collaborators, and can flexibly select collaboration permissions;
    - It supports the function of document historical version to view and compare the differences between the historical version and the existing version, and restore a historical version to the current version;
    - AI Write;

Update Record : [CHANGES.md](./CHANGES.md)

## Docker Compose Deployment

### 1、Deployment
```
git clone https://gitee.com/zmister/mrdoc-install.git && cd mrdoc-install && chmod +x docker-install.sh && ./docker-install.sh
```

### 2、Update

run`docker-update.sh`

## Simple Installation Tutorial

### 1. install dependent modules
```
pip install -r requirements.txt
```

### 2. Initialize database

After installing the required third-party library and configuring the database information, we need to initialize the database.

Open the command line interface under the project path and run the following command to generate the database migration:

```
python manage.py makemigrations 
```

Run the following command to perform database migration:

```
python manage.py migrate
```

After execution, the database is initialized.

### 3. Create Super User

After initializing the database, you need to create an administrator account to manage the whole mrdoc. Open the command line terminal in the project path and run the following command:

```
python manage.py createsuperuser
```

Follow the prompts to enter the user name, email address and password.

### 4、Test Running

After completing the above steps, you can run and use mrdoc.

In the test environment, you can use the server provided by Django to run mrdoc. The command is:

```
python manage.py runserver
```


## Third deployment tools

- [Docker Image](https://hub.docker.com/r/zmister/mrdoc)
- [Docker Image By jonnyan404](https://registry.hub.docker.com/r/jonnyan404/mrdoc-nginx)
- [Linux Deployment Script](https://gitee.com/jonnyan404/oh-my-mrdoc)
- [Windows Deployment Pannel By 小肥羊](https://gitee.com/debj031634/win-django)
- [VirtualBox/VmWare Image By 无名](https://gitee.com/nicktf/tinycore-mrdoc)

## Other Tools

- [Local Document Synchronization Tool By Atyin](https://gitee.com/atyin/mrdocTools)


## Feedback

### 1. Commit Issue

Submit questions on the following pages:

- [https://gitee.com/zmister/MrDoc/issues](https://gitee.com/zmister/MrDoc/issues)
- [https://github.com/zmister2016/MrDoc/issues](https://github.com/zmister2016/MrDoc/issues)

### 3. Contact author

WeChat Subscription : **觅思文档**

<p align="center">
<img src="https://doc.mrdoc.pro/media/202505/1354bec77bdb4339a74a79397ca79f2d4926.png" width="50%">
</p>

## Dependent

Thanks for the development based on the following projects：

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

## License

<a href="./LICENSE">GPL-3.0</a>

Business License Contact:zmister@qq.com