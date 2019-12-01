# coding:utf-8
# @文件: context_processer.py
# @创建者：州的先生
# #日期：2019/11/16
# 博客地址：zmister.com
from app_admin.models import SysSetting

# 系统设置 - 上下文变量
def sys_setting(request):
    setting_dict = dict()
    # 获取系统设置状态
    datas = SysSetting.objects.filter(types="basic")
    for data in datas:
        setting_dict[data.name] = data.value
    return setting_dict