from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# Token模型 - 用于浏览器扩展
class UserToken(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    token = models.CharField(verbose_name=_("token值"),max_length=250,unique=True)

    def __str__(self):
        return self.user

    class Meta:
        verbose_name = _('用户Token')
        verbose_name_plural = verbose_name

# AppToken模型 - 用于桌面、移动等各类 APP 应用
class AppUserToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(verbose_name=_("token值"), max_length=250, unique=True)

    def __str__(self):
        return self.user

    class Meta:
        verbose_name = _('App用户Token')
        verbose_name_plural = verbose_name


# 细粒度访问令牌模型 - 参考 GitHub PAT，支持多 Token、权限范围、限定文集与有效期
class AccessToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                             related_name='access_tokens', verbose_name=_("用户"))
    name = models.CharField(verbose_name=_("Token名称"), max_length=64, default='默认')
    token_prefix = models.CharField(verbose_name=_("Token前缀"), max_length=24, db_index=True)
    token_hash = models.CharField(verbose_name=_("Token哈希"), max_length=64, unique=True)
    scopes = models.JSONField(verbose_name=_("权限范围"), default=list)
    project_ids = models.JSONField(verbose_name=_("限定文集"), default=list, blank=True)
    expires_at = models.DateTimeField(verbose_name=_("过期时间"), null=True, blank=True)
    last_used_at = models.DateTimeField(verbose_name=_("最近使用时间"), null=True, blank=True)
    last_used_ip = models.GenericIPAddressField(verbose_name=_("最近使用IP"), null=True, blank=True)
    revoked_at = models.DateTimeField(verbose_name=_("吊销时间"), null=True, blank=True)
    created_at = models.DateTimeField(verbose_name=_("创建时间"), auto_now_add=True)

    def is_expired(self):
        if self.expires_at is None:
            return False
        return timezone.now() > self.expires_at

    def is_active(self):
        return self.revoked_at is None and self.is_expired() is False

    def has_scope(self, scope):
        return scope in (self.scopes or [])

    def allows_project(self, project_id):
        """project_ids 为空表示不限定文集"""
        ids = self.project_ids or []
        if not ids:
            return True
        try:
            return int(project_id) in [int(i) for i in ids]
        except (TypeError, ValueError):
            return False

    def __str__(self):
        return '{} - {}'.format(self.user, self.name)

    class Meta:
        verbose_name = _('访问令牌')
        verbose_name_plural = verbose_name
        ordering = ['-created_at']