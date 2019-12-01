from django.db import models

# 系统设置项模型
class SysSetting(models.Model):
    name = models.CharField(verbose_name="项目",max_length=50,primary_key=True)
    value = models.TextField(verbose_name="内容",null=True,blank=True)
    types = models.CharField(verbose_name="类型",max_length=10,default="basic")


    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '系统设置'
        verbose_name_plural = verbose_name

# 电子邮件验证码模型
class EmaiVerificationCode(models.Model):
    email_name = models.EmailField(verbose_name="电子邮箱")
    verification_type = models.CharField(verbose_name="验证码类型",max_length=50)
    verification_code = models.CharField(verbose_name="验证码",max_length=10)
    create_time = models.DateTimeField(verbose_name="创建时间",auto_now_add=True)
    expire_time = models.DateTimeField(verbose_name="过期时间")

    def __str__(self):
        return "{}:{}".format(self.verification_type,self.email_name)

    class Meta:
        verbose_name = '电子邮件验证码'
        verbose_name_plural = verbose_name