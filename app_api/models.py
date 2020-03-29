from django.db import models
from django.contrib.auth.models import User

# Token模型
class UserToken(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    token = models.CharField(verbose_name="token值",max_length=250,unique=True)

    def __str__(self):
        return self.user

    class Meta:
        verbose_name = '用户Token'
        verbose_name_plural = verbose_name
