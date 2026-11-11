# coding:utf-8
# @文件: utils.py
# @创建者：州的先生
# #日期：2019/11/23
# 博客地址：zmister.com

from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.urls import resolve,Resolver404
from email.mime.text import MIMEText
from email.header import Header
from app_admin.models import SysSetting
from loguru import logger
from cryptography.fernet import Fernet, MultiFernet, InvalidToken
import secrets
import smtplib
import zipfile
import os

# 生成随机验证码（使用密码学安全随机源）
def generate_vcode(n=8):
    # 57 个字符，去除易混淆的 I、O、0、1
    _chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    vcode_str = ''.join(secrets.choice(_chars) for _ in range(n))
    return vcode_str

# 发送电子邮件
def send_email(to_email,vcode_str):
    email_enable = SysSetting.objects.get(types="basic",name='enable_email')
    if email_enable.value == 'on':
        smtp_host = SysSetting.objects.get(types='email',name='smtp_host').value
        send_emailer = SysSetting.objects.get(types='email', name='send_emailer').value
        smtp_port = SysSetting.objects.get(types='email', name='smtp_port').value
        username = SysSetting.objects.get(types='email', name='username').value
        ssl = SysSetting.objects.get(types='email',name='smtp_ssl').value

        msg_from = send_emailer  # 发件人邮箱
        try:
            passwd, is_legacy = get_email_pwd()  # 发件人邮箱密码
        except Exception as e:
            logger.error("SMTP 密码解密失败，请在后台重新填写邮箱密码:{}".format(repr(e)))
            return False
        msg_to = to_email  # 收件人邮箱
        try:
            sitename = SysSetting.objects.get(types="basic",name="site_name").value
        except:
            sitename = "MrDoc"
        subject = _("MrDoc - 重置密码验证码")
        content = _("你的验证码为：{}，验证码30分钟内有效！").format(vcode_str)
        msg = MIMEText(content, _subtype='html', _charset='utf-8')
        msg['Subject'] = subject
        msg['From'] = Header(sitename,'utf-8').encode() + " <{}>".format(msg_from)
        msg['To'] = msg_to
        try:
            # print(smtp_host,smtp_port)
            if ssl:
                s = smtplib.SMTP_SSL(smtp_host, int(smtp_port), timeout=30)  # 发件箱邮件服务器及端口号
            else:
                s = smtplib.SMTP(smtp_host, int(smtp_port), timeout=30)
            s.login(username, passwd)
            if is_legacy:
                # 旧版 enctry 无法自校验，登录成功才证明明文正确，此时才写回新格式
                migrate_email_pwd(passwd)
            s.sendmail(from_addr=msg_from, to_addrs=msg_to, msg=msg.as_string())
            return True
        except smtplib.SMTPException as e:
            logger.error("邮件发送异常:{}".format(repr(e)))
            return False
        except Exception as e:
            logger.error("邮件发送异常:{}".format(repr(e)))
            return False
        finally:
            if 's' in locals():  # 连接可能未建立（s 未定义），避免 NameError
                s.quit()
    else:
        return False


# 基于cryptography的加解密
def _cipher_suite():
    # 首个密钥用于加密，其余用于解密存量数据（密钥轮换期间新旧数据并存）
    return MultiFernet([Fernet(k) for k in settings.CRYPTO_KEYS])

# 加密数据
def encrypt_data(data):
    encrypted_data = _cipher_suite().encrypt(data.encode()).decode()
    return encrypted_data

# 解密数据
def decrypt_data(encrypted_data):
    decrypted_data = _cipher_suite().decrypt(encrypted_data).decode()
    return decrypted_data


# 旧版 enctry 的逆向：密文为 '码_码_...'，每个码 = ord(明文字符) + ord(密钥字符)
def _legacy_dectry(p, k):
    try:
        nums = [int(i) for i in p.split('_')[:-1]]
    except (ValueError, AttributeError):
        return None
    if not nums:
        return None
    # 密文段数多于密钥长度说明不是合法旧密文，zip 会静默截断成前缀，需显式拒绝
    if len(nums) > len(k):
        return None
    dec_str = ''
    for i, j in zip(nums, k):
        code = i - ord(j)
        if code < 0x20 or code > 0x10FFFF or 0xD800 <= code <= 0xDFFF:
            return None
        dec_str += chr(code)
    return dec_str


# 解密旧版 enctry 密文，失败返回 None
def decrypt_legacy_data(data):
    # 历史版本的 SECRET_KEY 是硬编码的，旧密文只可能由该值生成，
    # 因此只保留唯一候选，避免多候选放大误判
    key = getattr(settings, '_LEGACY_SECRET_KEY', '')
    if not key:
        return None
    return _legacy_dectry(data, key)


# 获取发件人邮箱密码，返回 (明文, 是否为旧版格式)
# 只解密不写库：旧版 enctry 无法自校验，必须等 SMTP 登录成功后再迁移
def get_email_pwd():
    pwd = SysSetting.objects.get(types='email', name='pwd').value
    if not pwd:
        return '', False
    try:
        return decrypt_data(pwd), False
    except InvalidToken:
        plain = decrypt_legacy_data(pwd)
        if plain is None:
            raise
        return plain, True


# 将旧版 enctry 密文迁移为 Fernet 密文，调用前必须已确认明文可登录
def migrate_email_pwd(plain):
    SysSetting.objects.filter(types='email', name='pwd').update(value=encrypt_data(plain))
    logger.info('已将邮箱密码从旧版加密格式迁移为新格式')


# 判断是否内部链接
def is_internal_path(path):
    try:
        resolve(path)
        return True
    except Resolver404:
        return False

def is_zip_bomb(zip_path, compression_threshold=100):
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_file:
            uncompressed_size = sum(file.file_size for file in zip_file.infolist())
            compressed_size = os.path.getsize(zip_path)
            # print(f"未压缩大小：{uncompressed_size}")
            # print(f"压缩后大小：{compressed_size}")
            compression_ratio = uncompressed_size / compressed_size
            # print(f"压缩率：{compression_ratio}")
            if compression_ratio > compression_threshold:
                return True
    except zipfile.BadZipFile:
        return False
    except Exception as e:
        return False
    return False