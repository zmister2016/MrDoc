from django.db import models
from django.contrib.auth.models import User


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


# 用户选项配置
class UserOptions(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    # 用户配置的编辑器选项，1表示Editormd编辑器，2表示Vditor编辑器，默认为1
    editor_mode = models.IntegerField(default=1,verbose_name="编辑器选项")

    def __str__(self):
        return self.user

    class Meta:
        verbose_name = '用户设置'
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

# 用户注册邀请码模型
class RegisterCode(models.Model):
    code = models.CharField(verbose_name="注册邀请码",max_length=10,unique=True)
    # 注册码的有效注册数量，表示注册码最多能够被使用多少次，默认为1
    all_cnt = models.IntegerField(verbose_name="有效注册数量",default=1)
    # 注册码的已使用数量，其值小于等于有效注册数量，默认为0
    used_cnt = models.IntegerField(verbose_name='已使用数量',default=0)
    # 注册码状态：0表示数据已满，1表示有效，默认为1
    status = models.IntegerField(verbose_name="注册码状态",default=1)
    user_list = models.CharField(verbose_name="使用此注册码的用户",default='',max_length=500,blank=True,null=True)
    create_user = models.ForeignKey(User,on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now=True,verbose_name='创建时间')

    def __str__(self):
        return self.code

    class Meta:
        verbose_name = '注册邀请码'
        verbose_name_plural = verbose_name