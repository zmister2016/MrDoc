from django.urls import path,re_path
from app_doc import views,util_upload_img

urlpatterns = [
    path('',views.project_list,name='pro_list'),# 文档首页
    #################文集相关
    path('project/<int:pro_id>/', views.project_index, name='pro_index'),  # 文集浏览页
    path('create_project/', views.create_project, name='create_project'),  # 新建文集
    path('get_pro_doc/', views.get_pro_doc, name="get_pro_doc"),  # 获取某个文集的下级文档
    path('modify_pro/',views.modify_project,name='modify_project'), # 修改文集
    path('manage_project',views.manage_project,name="manage_project"), # 管理文集
    path('del_project/',views.del_project,name='del_project'), # 删除文集
    #################文档相关
    path('project/<int:pro_id>/<int:doc_id>/', views.doc, name='doc'),  # 文档浏览页
    path('create_doc/', views.create_doc, name="create_doc"),  # 新建文档
    path('modify_doc/<int:doc_id>/', views.modify_doc, name="modify_doc"),  # 修改文档
    path('del_doc/',views.del_doc,name="del_doc"), # 删除文档
    path('manage_doc/',views.manage_doc,name="manage_doc"), # 管理文档
    #################文档模板相关
    path('manage_doctemp/',views.manage_doctemp,name='manage_doctemp'), # 文档模板列表
    path('create_doctemp/',views.create_doctemp,name="create_doctemp"), # 创建文档模板
    path('get_doctemp/',views.get_doctemp,name='get_doctemp'), # 获取某一个文档模板内容
    path('del_doctemp/',views.del_doctemp,name="del_doctemp"), # 删除某一个文档模板
    path('modify_doctemp/<int:doctemp_id>/',views.modify_doctemp,name="modify_doctemp"), # 修改文档模板
    ################其他功能相关
    path('upload_doc_img/',util_upload_img.upload_img,name="upload_doc_img"), # 上传图片
]