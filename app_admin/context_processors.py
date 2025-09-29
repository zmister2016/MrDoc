# coding:utf-8
# @文件: context_processer.py
# @创建者：州的先生
# #日期：2019/11/16
# 博客地址：zmister.com
from app_admin.models import SysSetting
from django.conf import settings
from app_admin.utils import decrypt_data

# 系统设置 - 上下文变量
def sys_setting(request):
    setting_dict = dict()
    # 设置网站版本
    setting_dict['mrdoc_version'] = settings.VERSIONS
    # 设置debug状态
    setting_dict['debug'] = settings.DEBUG
    # 站点地图状态
    setting_dict['sitemap'] = settings.SITEMAP
    # 获取系统设置状态
    datas = SysSetting.objects.filter(types__in=["basic","doc","ai"])
    for data in datas:
        if data.name in ['ai_dify_chat_api_key', 'ai_dify_dataset_api_key', 'ai_dify_textgenerate_api_key']:
            setting_dict[data.name] = decrypt_data(data.value)
        else:
            setting_dict[data.name] = data.value
    return setting_dict