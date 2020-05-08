from loguru import logger
from django.conf import settings
import os

LOG_DIR = os.path.join(settings.BASE_DIR,'log')

if os.path.exists(LOG_DIR) is False:
    os.makedirs(LOG_DIR)

logger.add(os.path.join(LOG_DIR,'{time}.log'),rotation='1 days',retention='30 days',encoding='utf-8')