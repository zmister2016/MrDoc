## MrDoc - Writing documents, gathering ideas

![Mrdoc首页](./captrue/mrdoc-index.png)

### Introduce

`Mrdoc` is an online document system developed based on python. It is suitable for individuals and small teams to manage documents, knowledge and notes. It is committed to become a private online document deployment solution for the whole platform (web, desktop, mobile).

Current Platform：

- Web，[instructions](http://mrdoc.zmister.com/project-7/)；
- Chrome Extends，[instructions](http://mrdoc.zmister.com/project-7/doc-243/)；
- Mobile App(developing)
- Windows、Mac、Linux Desktop GUI(developing)
- Windows Portable Experience Edition，[instructions](http://mrdoc.zmister.com/project-7/doc-249/)

### Source Code Address

**Gitee:** <https://gitee.com/zmister/MrDoc>

**GitHub:** <https://github.com/zmister2016/MrDoc>

### Example Site:

<http://mrdoc.zmister.com> 

You can register, create project and documents. The account can be cleared from time to time. It is only for testing purposes. Please do not write important documents.

### Documentation

[MrDoc Install Manual](http://mrdoc.zmister.com/project-7/),[MrDoc User Manual](http://mrdoc.zmister.com/project-54/),[Document Example](http://mrdoc.zmister.com/project-20/)

## Feature

- **Site Manage & User Manage**
    - Support user registration, login, management, administrator and other basic user functions;
    - Support site configuration registration invitation code, advertising code, statistics code, email retrieval password, site wide close registration, site wide forced login and other management functions;
    - It supports the configuration of the permission of the Project, and provides four permission modes: public, private, visible to the specified user and visible to the access code;
    
- **Document System**
    - Document writing and reading are based on the Project, with five modules, namely **project**, **document**, **document template**, **image** and **attachment**;
    - The `markdown` editor based on `editormd` is used to optimize and extend, and the `markdown` syntax is used for document writing, and image management and uploading, table pasting, mind mapping, flow chart drawing and sequence diagram drawing are supported;
    - Two column **document reading** page, three-level directory level display, document reading font scaling, font type switching, page social sharing, mobile reading optimization, text collection export PDF, ePub file;
    - Support the account based `API` interface, which can use the account `token` to get the corpus, upload pictures and create documents through the 'API';
    - Supports the project collaboration function. A project can have one Creator and multiple collaborators, and can flexibly select collaboration permissions;
    - It supports the function of document historical version to view and compare the differences between the historical version and the existing version, and restore a historical version to the current version;

Current Version : v0.5.4

Update Record : [CHANGES.md](./CHANGES.md)


## Dependent environment

`Mrdoc` is developed on `Python 3.6` + `Django 2.2`, and tested well on Django 2.1, 2.2 and python 3.5, 3.6 and 3.7. Running mrdoc in other environments does not exclude unknown exceptions.

## Simple Installation Tutorial

### 1. install dependent modules
```
pip install -r requirements.txt
```

### 2. configure database info

By default, mrdoc uses Django's SQLite database. If you use SQLite database, you do not need to configure another database.

If you need to configure other databases, please first follow Django's official [database support instructions](https://docs.djangoproject.com/zh-hans/2.2/ref/databases/),Install a python binding library for a specific database.

Then open it in the `/mrdoc/config` directory `conig.ini` File, modify according to your own database information:

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

### 3. Initialize database

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

### 4. Create Super User

After initializing the database, you need to create an administrator account to manage the whole mrdoc. Open the command line terminal in the project path and run the following command:

```
python manage.py createsuperuser
```

Follow the prompts to enter the user name, email address and password.

### 5、Test Running

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

Join the mrdoc communication Tencent QQ group ，Group number is **735507293**

### 3. Contact author

WeChat : **taoist_ling**

WeChat Subscription : **zmister2016**

## Sponsor

Open source is not easy. We need to encourage you. If mrdoc is helpful to you, please give a `star`.

Welcome to give appreciation to developers and help the project develop better.

![](./captrue/mrdoc-zan.png)