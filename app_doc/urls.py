from django.urls import path,re_path
from app_doc import views,util_upload_img

urlpatterns = [
    path('',views.project_list,name='pro_list'),# 文档首页
    #################文集相关
    path('project-<int:pro_id>/', views.project_index, name='pro_index'),  # 文集浏览页
    path('create_project/', views.create_project, name='create_project'),  # 新建文集
    path('get_pro_doc/', views.get_pro_doc, name="get_pro_doc"),  # 获取某个文集的下级文档
    path('get_pro_doc_tree/', views.get_pro_doc_tree, name="get_pro_doc_tree"),  # 获取某个文集的下级文档树数据
    path('modify_pro/',views.modify_project,name='modify_project'), # 修改文集
    path('manage_project',views.manage_project,name="manage_project"), # 管理文集
    path('del_project/',views.del_project,name='del_project'), # 删除文集
    path('report_project_md/',views.report_md,name='report_md'), # 导出文集MD文件
    path('genera_project_file/',views.genera_project_file,name='genera_project_file'), # 个人中心生成文集文件（epub\docx\pdf等）
    path('report_project_file/',views.report_file,name='report_file'), # 导出文集文件(epub、docx等)
    path('modify_pro_role/<int:pro_id>/',views.modify_project_role,name="modify_pro_role"),# 修改文集权限
    path('modify_pro_download/<int:pro_id>/', views.modify_project_download, name="modify_pro_download"),  # 修改文集前台下载权限
    path('check_viewcode/',views.check_viewcode,name='check_viewcode'),# 文集访问码验证
    path('manage_project_colla/<int:pro_id>/',views.manage_project_collaborator,name="manage_pro_colla"), # 管理文集协作
    path('manage_pro_colla_self/',views.manage_pro_colla_self,name="manage_pro_colla_self"), # 我协作的文集
    #################文档相关
    path('project-<int:pro_id>/doc-<int:doc_id>/', views.doc, name='doc'),  # 文档浏览页
    path('create_doc/', views.create_doc, name="create_doc"),  # 新建文档
    path('modify_doc/<int:doc_id>/', views.modify_doc, name="modify_doc"),  # 修改文档
    path('del_doc/',views.del_doc,name="del_doc"), # 删除文档
    path('manage_doc/',views.manage_doc,name="manage_doc"), # 管理文档
    path('diff_doc/<int:doc_id>-<int:his_id>/',views.diff_doc,name='diff_doc'), # 对比文档历史版本
    path('manage_doc_history/<int:doc_id>/',views.manage_doc_history,name='manage_doc_history'), # 管理文档历史版本
    path('move_doc/', views.move_doc, name='move_doc'), # 移动文档
    #################文档模板相关
    path('manage_doctemp/',views.manage_doctemp,name='manage_doctemp'), # 文档模板列表
    path('create_doctemp/',views.create_doctemp,name="create_doctemp"), # 创建文档模板
    path('get_doctemp/',views.get_doctemp,name='get_doctemp'), # 获取某一个文档模板内容
    path('del_doctemp/',views.del_doctemp,name="del_doctemp"), # 删除某一个文档模板
    path('modify_doctemp/<int:doctemp_id>/',views.modify_doctemp,name="modify_doctemp"), # 修改文档模板
    #################文件管理相关
    path('manage_image/',views.manage_image,name="manage_image"), # 图片管理
    path('manage_image_group/',views.manage_img_group,name="manage_img_group"), # 图片分组管理
    path('manage_attachment/',views.manage_attachment,name='manage_attachment'), # 附件管理
    ################其他功能相关
    path('upload_doc_img/',util_upload_img.upload_img,name="upload_doc_img"), # 上传图片
]