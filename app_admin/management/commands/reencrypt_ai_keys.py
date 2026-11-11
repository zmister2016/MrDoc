# coding:utf-8
from django.conf import settings
from django.core.management.base import BaseCommand
from cryptography.fernet import Fernet, MultiFernet, InvalidToken


class Command(BaseCommand):
    help = '将 AI Provider 的 api_key 与邮箱密码用当前 CRYPTO_KEY 重新加密，以移除旧的默认回退密钥'

    def handle(self, *args, **options):
        from app_ai.models import AIProvider
        from app_admin.models import SysSetting
        from app_admin.utils import decrypt_legacy_data

        if settings.CRYPTO_KEY == settings.DEFAULT_CRYPTO_KEY:
            self.stderr.write('当前仍在使用公开默认 CRYPTO_KEY，请先配置新密钥再执行迁移')
            return

        new_cipher = Fernet(settings.CRYPTO_KEY)
        old_cipher = MultiFernet([Fernet(k) for k in settings.CRYPTO_KEYS])

        done = skipped = failed = 0
        for provider in AIProvider.objects.exclude(api_key__isnull=True).exclude(api_key=''):
            try:
                new_cipher.decrypt(provider.api_key)
                skipped += 1
                continue
            except InvalidToken:
                pass
            try:
                plain = old_cipher.decrypt(provider.api_key).decode()
            except InvalidToken:
                failed += 1
                self.stderr.write(
                    'AIProvider %s (%s) 无法解密，已跳过' % (provider.pk, provider.provider)
                )
                continue
            provider.api_key = new_cipher.encrypt(plain.encode()).decode()
            provider.save(update_fields=['api_key'])
            done += 1

        # 邮箱密码同样使用 CRYPTO_KEY 加密，必须一并迁移
        pwd_done = pwd_skipped = pwd_legacy = pwd_failed = 0
        pwd_settings = SysSetting.objects.filter(types='email', name='pwd').exclude(
            value__isnull=True
        ).exclude(value='')
        for setting in pwd_settings:
            try:
                new_cipher.decrypt(setting.value)
                pwd_skipped += 1
                continue
            except InvalidToken:
                pass
            try:
                plain = old_cipher.decrypt(setting.value).decode()
            except InvalidToken:
                # 旧版 enctry 依赖 _LEGACY_SECRET_KEY，与默认 CRYPTO_KEY 无关；
                # 首次发信登录成功后会自动迁移，因此不算迁移失败
                if decrypt_legacy_data(setting.value) is not None:
                    pwd_legacy += 1
                    self.stdout.write('邮箱密码仍为旧版 enctry 格式，将在首次发信成功后自动迁移')
                else:
                    pwd_failed += 1
                    self.stderr.write('邮箱密码无法解密，请在后台重新填写后再移除默认密钥')
                continue
            SysSetting.objects.filter(pk=setting.pk).update(
                value=new_cipher.encrypt(plain.encode()).decode()
            )
            pwd_done += 1

        self.stdout.write(
            'AIProvider：重新加密 %s 条，已是新密钥 %s 条，无法解密 %s 条' % (done, skipped, failed)
        )
        self.stdout.write(
            '邮箱密码：重新加密 %s 条，已是新密钥 %s 条，旧格式跳过 %s 条，无法解密 %s 条'
            % (pwd_done, pwd_skipped, pwd_legacy, pwd_failed)
        )
        if failed or pwd_failed:
            self.stderr.write('存在无法迁移的凭据，请先在后台重新保存，再移除 DEFAULT_CRYPTO_KEY')
