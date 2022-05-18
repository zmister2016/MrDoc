#!/bin/sh

# 生成数据库迁移文件
python /app/MrDoc/manage.py makemigrations &&
# 根据数据库迁移文件执行数据库变更
python /app/MrDoc/manage.py migrate &&
# 重建全文搜索索引
nohup echo y |python /app/MrDoc/manage.py rebuild_index &
# 启动uwsgi
uwsgi --ini /app/MrDoc/config/uwsgi.ini
# 直接 runserver 方式运行
# python -u /app/MrDoc/manage.py runserver --noreload 0.0.0.0:${LISTEN_PORT}
exec "$@"