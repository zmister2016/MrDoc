from django.db import models
from django.contrib.auth.models import User


# 文集模型
class Project(models.Model):
    name = models.CharField(verbose_name="文集名称",max_length=50)
    icon= models.CharField(verbose_name="文集图标",max_length=50,blank=True,null=True,default=None)
    intro = models.TextField(verbose_name="介绍")
    # 文集权限说明：0表示公开，1表示私密,2表示指定用户可见,3表示访问码可见 默认公开
    role = models.IntegerField(choices=((0,0),(1,1),(2,2),(3,3)), default=0,verbose_name="文集权限")
    role_value = models.TextField(verbose_name="文集权限值",blank=True,null=True)
    is_watermark = models.BooleanField(verbose_name="水印状态",default=False)
    watermark_type = models.IntegerField(verbose_name="水印类型",default=1) # 1表示文字水印 2表示图片水印
    watermark_value = models.CharField(verbose_name="水印内容",null=True,blank=True,default='',max_length=250)
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


# 文集协作模型
class ProjectCollaborator(models.Model):
    project = models.ForeignKey(Project,on_delete=models.CASCADE) # 文集
    user = models.ForeignKey(User,on_delete=models.CASCADE) # 用户
    # 用户的协作模式：0表示可新建文档，可修改、删除自己新建的文档，1表示可新建文档，可删除自己创建的文档、可修改所有文档
    role = models.IntegerField(choices=((0,0),(1,1)),default=0,verbose_name='协作模式')
    create_time = models.DateTimeField(auto_now=True,verbose_name='添加时间')
    modify_time = models.DateTimeField(auto_now_add=True,verbose_name='修改时间')

    def __str__(self):
        return self.project

    class Meta:
        verbose_name = '文集协作'
        verbose_name_plural = verbose_name


# 文集目录模型
class ProjectToc(models.Model):
    project = models.ForeignKey(Project,on_delete=models.CASCADE)
    value = models.TextField(verbose_name="文集文档层级目录")

    def __str__(self):
        return self.project

    class Meta:
        verbose_name = '文集目录'
        verbose_name_plural = verbose_name


# 文档模型
class Doc(models.Model):
    name = models.CharField(verbose_name="文档标题",max_length=50)
    pre_content = models.TextField(verbose_name="编辑内容",null=True,blank=True)
    content = models.TextField(verbose_name="文档内容",null=True,blank=True)
    parent_doc = models.IntegerField(default=0,verbose_name="上级文档")
    top_doc = models.IntegerField(default=0,verbose_name="所属项目")
    sort = models.IntegerField(verbose_name='排序',default=99)
    create_user = models.ForeignKey(User,on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now_add=True)
    modify_time = models.DateTimeField(auto_now=True)
    # 文档状态说明：0表示草稿状态，1表示发布状态，2表示删除状态
    status = models.IntegerField(choices=((0,0),(1,1)),default=1,verbose_name='文档状态')
    # 编辑器模式：1表示Editormd编辑器，2表示Vditor编辑器，3表示iceEditor编辑器
    editor_mode = models.IntegerField(default=1,verbose_name='编辑器模式')
    open_children = models.BooleanField(default=False,verbose_name="展开下级目录")
    show_children = models.BooleanField(verbose_name="显示下级文档",default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '文档'
        verbose_name_plural = verbose_name
        indexes = [
            models.Index(fields=['top_doc','parent_doc','status']),
            models.Index(fields=['sort']),
        ]
        # ordering = ['-create_time','sort']

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse("doc",
                       kwargs={
                           "pro_id": str(self.top_doc),
                           "doc_id":self.pk}
                       )


# 文档历史模型
class DocHistory(models.Model):
    doc = models.ForeignKey(Doc,on_delete=models.CASCADE)
    pre_content = models.TextField(verbose_name='文档历史编辑内容',null=True,blank=True)
    create_user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    create_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.doc

    class Meta:
        verbose_name = '文档历史'
        verbose_name_plural = verbose_name


# 文档模板模型
class DocTemp(models.Model):
    name = models.CharField(verbose_name="模板名称",max_length=50)
    content = models.TextField(verbose_name="文档模板")
    create_user = models.ForeignKey(User,on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now_add=True)
    modify_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '文档模板'
        verbose_name_plural = verbose_name

# 文档分享模型
class DocShare(models.Model):
    token = models.CharField(verbose_name="分享Token",max_length=100,blank=True,null=True)
    doc = models.ForeignKey(Doc,on_delete=models.CASCADE) # 文档
    # 文档分享类型，0表示公开分享，1表示私密分享
    share_type = models.IntegerField(choices=((0,0),(1,1)),default=0)
    # 文档分享码，当分享类型为私密分享时，需要验证分享码
    share_value = models.CharField(max_length=10,verbose_name="分享码",blank=True,null=True)
    # 分享有效期，默认为0，表示永久有效，值为整数，表示创建时间起多久过期
    # effective_time = models.IntegerField(default=0,blank=True,null=True)
    is_enable = models.BooleanField(default=True,verbose_name="启用状态")
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.doc.name

    class Meta:
        verbose_name = '文档分享'
        verbose_name_plural = verbose_name

# 标签模板
class Tag(models.Model):
    name = models.CharField(verbose_name='标签名',max_length=10)
    create_user = models.ForeignKey(User,on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '标签'
        verbose_name_plural = verbose_name


# 文档标签
class DocTag(models.Model):
    tag = models.ForeignKey(Tag,on_delete=models.CASCADE)
    doc = models.ForeignKey(Doc,on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{}-{}".format(self.tag.name,self.doc.name)

    class Meta:
        verbose_name = '文档标签'
        verbose_name_plural = verbose_name


# 文集导出模型
class ProjectReport(models.Model):
    project = models.OneToOneField(Project,unique=True,on_delete=models.CASCADE)
    # 允许导出，默认为0-允许，1-不允许
    allow_epub = models.IntegerField(default=0,verbose_name="前台导出EPUB")
    allow_pdf = models.IntegerField(default=0, verbose_name="前台导出PDF")

    def __str__(self):
        return self.project.name

    class Meta:
        verbose_name = '文集导出'
        verbose_name_plural = verbose_name


# 文集导出文件模型
class ProjectReportFile(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)  # 外键关联文集
    file_type = models.CharField(choices=(('epub', 'epub'), ('pdf', 'pdf'), ('docx', 'docx')), verbose_name='文件类型',max_length=10)
    file_name = models.CharField(max_length=100, verbose_name='文件名称')
    file_path = models.CharField(max_length=250, verbose_name='文件路径')
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name

    class Meta:
        verbose_name = '附件管理'
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


# 附件模型
class Attachment(models.Model):
    file_name = models.CharField(max_length=200,verbose_name="附件名",default='mrdoc_附件.zip')
    file_size = models.CharField(max_length=100,verbose_name="附件大小",blank=True,null=True)
    file_path = models.FileField(upload_to='attachment/%Y/%m/',verbose_name='附件')
    user = models.ForeignKey(User,on_delete=models.CASCADE,)
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name

    class Meta:
        verbose_name = '附件管理'
        verbose_name_plural = verbose_name


# 我的收藏
class MyCollect(models.Model):
    # 收藏类型 1表示文档 2表示文集
    collect_type = models.IntegerField(verbose_name="收藏类型")
    collect_id = models.IntegerField(verbose_name="收藏对象ID")
    create_user = models.ForeignKey(User,on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.collect_type

    class Meta:
        verbose_name = '我的收藏'
        verbose_name_plural = verbose_name