from django.urls import path,re_path
from app_admin import views

urlpatterns = [
    path('login/',views.log_in,name='login'),# 登录
    path('logout/',views.log_out,name='logout'),# 注销
    path('register/',views.register,name="register"), # 注册
    path('user_manage/',views.admin_user,name="user_manage"), # 用户管理
    path('create/',views.admin_create_user,name="create_user"), # 新建用户
]