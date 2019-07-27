from django.db import models
from django.contrib.auth.models import User

# 文集模型
class Project(models.Model):
    name = models.CharField(verbose_name="文档名称",max_length=50)
    intro = models.TextField(verbose_name="介绍")
    create_user = models.ForeignKey(User,on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now_add=True)
    modify_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '文集'
        verbose_name_plural = verbose_name

# 文档模型
class Doc(models.Model):
    name = models.CharField(verbose_name="文档标题",max_length=50)
    pre_content = models.TextField(verbose_name="编辑内容")
    content = models.TextField(verbose_name="文档内容")
    parent_doc = models.IntegerField(default=0,verbose_name="上级文档")
    top_doc = models.IntegerField(default=0,verbose_name="所属项目")
    sort = models.IntegerField(verbose_name='排序',default=99)
    create_user = models.ForeignKey(User,on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now_add=True)
    modify_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '文档'
        verbose_name_plural = verbose_name
        # ordering = ['-create_time','sort']

# 文档模板模型
class DocTemp(models.Model):
    name = models.CharField(verbose_name="模板名称",max_length=50)
    content = models.TextField(verbose_name="文档模板")
    create_user = models.ForeignKey(User,on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now_add=True)
    modify_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        self.name

    class Meta:
        verbose_name = '文档模板'
        verbose_name_plural = verbose_name
