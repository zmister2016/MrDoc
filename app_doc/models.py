from django.db import models
from django.contrib.auth.models import User

# 文集模型
class Project(models.Model):
    name = models.CharField(verbose_name="文档名称",max_length=50)
    intro = models.TextField(verbose_name="介绍")
    # 文集权限说明：0表示公开，1表示私密,2表示指定用户可见,3表示访问码可见 默认公开
    role = models.IntegerField(choices=((0,0),(1,1),(2,2),(3,3)), default=0,verbose_name="文集权限")
    role_value = models.TextField(verbose_name="文集权限值",blank=True,null=True)
    create_user = models.ForeignKey(User,on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now_add=True)
    modify_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '文集'
        verbose_name_plural = verbose_name

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse("pro_index",
                       kwargs={
                           "pro_id":self.pk}
                       )

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
    # 文档状态说明：0表示草稿状态，1表示发布状态
    status = models.IntegerField(choices=((0,0),(1,1)),default=1,verbose_name='文档状态')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '文档'
        verbose_name_plural = verbose_name
        # ordering = ['-create_time','sort']

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse("doc",
                       kwargs={
                           "pro_id": str(self.top_doc),
                           "doc_id":self.pk}
                       )

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

# 文集导出模型
class ProjectReport(models.Model):
    project = models.OneToOneField(Project,unique=True,on_delete=models.CASCADE)
    # 允许导出，默认为0-允许，1-不允许
    allow_epub = models.IntegerField(default=0,verbose_name="前台导出EPUB")

    def __str__(self):
        self.project.name

    class Meta:
        verbose_name = '文集导出'
        verbose_name_plural = verbose_name

# 图片分组模型
class ImageGroup(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    group_name = models.CharField(verbose_name="图片分组",max_length=50,default="默认分组")

    def __str__(self):
        return self.group_name

    class Meta:
        verbose_name = '图片分组'
        verbose_name_plural = verbose_name

# 图片模型
class Image(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    file_path = models.CharField(verbose_name="图片路径",max_length=250)
    file_name = models.CharField(verbose_name="图片名称",max_length=250,null=True,blank=True)
    group = models.ForeignKey(ImageGroup,on_delete=models.SET_NULL,null=True,verbose_name="图片分组")
    remark = models.CharField(verbose_name="图片备注",null=True,blank=True,max_length=250,default="图片描述")
    create_time = models.DateTimeField(verbose_name='创建时间',auto_now_add=True)
    modify_time = models.DateTimeField(verbose_name='修改时间',auto_now=True)

    class Meta:
        verbose_name = '素材图片'
        verbose_name_plural = verbose_name