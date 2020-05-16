from django.db import models
from django.contrib.auth.models import User

# Token模型 - 用于浏览器扩展
class UserToken(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    token = models.CharField(verbose_name="token值",max_length=250,unique=True)

    def __str__(self):
        return self.user

    class Meta:
        verbose_name = '用户Token'
        verbose_name_plural = verbose_name

# AppToken模型 - 用于桌面、移动等各类 APP 应用
class AppUserToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(verbose_name="token值", max_length=250, unique=True)

    def __str__(self):
        return self.user

    class Meta:
        verbose_name = 'App用户Token'
        verbose_name_plural = verbose_name