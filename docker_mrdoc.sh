#!/bin/sh

# ---------------------------------------------------------------------------
# MrDoc Pro 容器启动脚本
# 启动流程：数据库迁移 -> 后台重建全文搜索索引 -> 启动 Web 服务器
# Web 服务器通过环境变量 SERVER_TYPE 二选一（默认 uwsgi）：
#   - SERVER_TYPE=gunicorn : 使用 gunicorn（可自定义 config/gunicorn_custom.conf.py）
#   - 其他/未设置          : 使用 uwsgi（可自定义 config/uwsgi_custom.ini）
# ---------------------------------------------------------------------------

# ---- 输出辅助函数（设置 NO_COLOR 环境变量可禁用颜色，便于日志平台采集） ----
if [ -n "$NO_COLOR" ]; then
  CLR_RESET=''; CLR_BLUE=''; CLR_GREEN=''; CLR_YELLOW=''; CLR_RED=''; CLR_CYAN=''
else
  CLR_RESET='\033[0m'; CLR_BLUE='\033[34m'; CLR_GREEN='\033[32m'
  CLR_YELLOW='\033[33m'; CLR_RED='\033[31m'; CLR_CYAN='\033[36m'
fi
info()   { printf "${CLR_BLUE}[INFO]${CLR_RESET} %s\n" "$*"; }
ok()     { printf "${CLR_GREEN}[ OK ]${CLR_RESET} %s\n" "$*"; }
warn()   { printf "${CLR_YELLOW}[WARN]${CLR_RESET} %s\n" "$*"; }
error()  { printf "${CLR_RED}[ERROR]${CLR_RESET} %s\n" "$*"; }
banner() { printf "${CLR_CYAN}%s${CLR_RESET}\n" "$*"; }

banner "================================================"
banner "  MrDoc 容器启动"
banner "================================================"

# Step 1/3: 执行数据库迁移，失败则终止启动
info "Step 1/3: 执行数据库迁移 ..."
if python /app/MrDoc/manage.py migrate; then
  ok "数据库迁移完成"
else
  error "数据库迁移失败，容器即将退出，请检查数据库连接与配置"
  exit 1
fi

# Step 2/3: 后台重建全文搜索索引，不阻塞启动流程
info "Step 2/3: 后台重建全文搜索索引 ..."
nohup echo y | python /app/MrDoc/manage.py rebuild_index &

# Step 3/3: 启动 Web 服务器（前台运行，阻塞本脚本）
PORT="${LISTEN_PORT:-10086}"
info "Step 3/3: 启动 Web 服务器，监听端口 ${PORT}"
case "$SERVER_TYPE" in
  gunicorn)
    if [ -f /app/MrDoc/config/gunicorn_custom.conf.py ]; then
      warn "使用自定义 Gunicorn 配置: config/gunicorn_custom.conf.py"
      gunicorn -c /app/MrDoc/config/gunicorn_custom.conf.py MrDoc.wsgi:application
    else
      info "使用默认 Gunicorn 配置: config/gunicorn.conf.py"
      gunicorn -c /app/MrDoc/config/gunicorn.conf.py MrDoc.wsgi:application
    fi
    ;;
  *)
    if [ -f /app/MrDoc/config/uwsgi_custom.ini ]; then
      warn "使用自定义 uwsgi 配置: config/uwsgi_custom.ini"
      uwsgi --ini /app/MrDoc/config/uwsgi_custom.ini
    else
      info "使用默认 uwsgi 配置: config/uwsgi.ini"
      uwsgi --ini /app/MrDoc/config/uwsgi.ini
    fi
    ;;
esac

# 若 Web 服务器意外退出，提示后转为执行 docker run 传入的命令
error "Web 服务器已退出（退出码: $?）"
exec "$@"
