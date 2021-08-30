<h1 align="center">MrDoc - Writing documents, Gathering ideas</h1>

<p align="center">Personal and small team notes, documents, knowledge management privatization deployment scheme</p>

<p align="center">
<a href="./README-zh.md">中文介绍</a> |
<a href="./README.md">English Description</a> 
</p>

<p align="center">
<img src="https://img.shields.io/badge/MrDoc-v0.6.9-brightgreen.svg" title="Mrdoc" />
<img src="https://img.shields.io/badge/Python-3.5+-blue.svg" title="Python" />
<img src="https://img.shields.io/badge/Django-v2.2-important.svg" title="Django" />
</p>

<p align="center">
<a href="https://mrdoc.pro">Home</a> | 
<a href="http://mrdoc.zmister.com/">Example Site</a> |
<a href="https://qm.qq.com/cgi-bin/qm/qr?k=LsgDSw8a6IlrzORBGGyRC6LrlIU_vYON&jump_from=webapi">QQ Group</a>

</p>

<p align="center">
<a href="http://mrdoc.zmister.com/project-7/">Installation Manual</a> | 
<a href="http://mrdoc.zmister.com/project-54/">User Manual</a> |
<a href="http://mrdoc.zmister.com/project-20/">Document Example</a>
</p>


<p align="center">Source code：<a href="https://gitee.com/zmister/MrDoc">Gitee</a> | 
<a href="https://github.com/zmister2016/MrDoc">GitHub</a>
</p>


### Introduce

`Mrdoc` is an online document system developed based on python. It is suitable for individuals and small teams to manage documents, knowledge and notes. It is committed to become a private online document deployment solution for the whole platform (web, desktop, mobile).

Current Platform：

- Web，[instructions](http://mrdoc.zmister.com/project-7/)；
- Chrome Extends:
    - [instructions](http://mrdoc.zmister.com/project-7/doc-243/)；
    - [simpread](https://github.com/Kenshin/simpread)：[instructions](https://github.com/Kenshin/simpread/issues/893)
- Mobile App(developing)

## Example Site

[http://mrdoc.zmister.com](http://mrdoc.zmister.com)

username:test1  password:123456

## Donate

<p align="center">Donate a can of Coffee to the author to speed up the development.</p>
<p>    
<a href="https://ko-fi.com/zmister">Ko-Fi</a> |
<a href="https://paypal.me/zmister">PayPal</a>
</p>

<p align="center">
<img src="http://mrdoc.zmister.com/media/202106/dashang_wxwebp_1622762424.jpg" height=200>
<img src="http://mrdoc.zmister.com/media/202106/dashang_alipaywebp_1622762435.jpg" height=200>
<img src="http://mrdoc.zmister.com/media/202106/dashang_qqwebp_1622762444.jpg" height=200>
</p>

## Feature

- **Site Manage & User Manage**
    - Support user registration, login, management, administrator and other basic user functions;
    - Support site configuration registration invitation code, advertising code, statistics code, email retrieval password, site wide close registration, site wide forced login and other management functions;
    - It supports the configuration of the permission of the Project, and provides four permission modes: public, private, visible to the specified user and visible to the access code;
    
- **Document System**
    - Document writing and reading are based on the Project, with five modules, namely **project**, **document**, **document template**, **image** and **attachment**;
    - The `markdown` editor based on `editormd` and `vditor` is used to optimize and extend, and the `markdown` syntax is used for document writing, and image management and uploading, table pasting, mind mapping, flow chart drawing and sequence diagram drawing are supported;
    - Two column **document reading** page, three-level directory level display, document reading font scaling, font type switching, page social sharing, mobile reading optimization, text collection export PDF, ePub file;
    - Support the account based `API` interface, which can use the account `token` to get the corpus, upload pictures and create documents through the 'API';
    - Supports the project collaboration function. A project can have one Creator and multiple collaborators, and can flexibly select collaboration permissions;
    - It supports the function of document historical version to view and compare the differences between the historical version and the existing version, and restore a historical version to the current version;

Update Record : [CHANGES.md](./CHANGES.md)

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

## Feedback

### 1. Commit Issue

Submit questions on the following pages:

- [https://gitee.com/zmister/MrDoc/issues](https://gitee.com/zmister/MrDoc/issues)
- [https://github.com/zmister2016/MrDoc/issues](https://github.com/zmister2016/MrDoc/issues)

### 2. Join the mrdoc communication group

Join the mrdoc communication Tencent QQ group ，Group number:
 
 - **735507293**(Full)
 - **849206042**

### 3. Contact author

WeChat Subscription : **zmister2016**

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