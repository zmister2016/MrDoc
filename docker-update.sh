#!/bin/bash
set -e  # 严格错误模式

# 1. 拉取最新代码
echo "▶ 更新最新代码..."
git fetch --all && git reset --hard origin/master && git pull

# 2. 拉取最新镜像（如果镜像有更新）
echo "▶ 拉取最新镜像..."
docker-compose pull

# 3. 重新创建容器（仅当镜像或配置变化时）并启动
echo "▶ 重建容器..."
docker-compose up -d

# 4. 重启容器（确保代码变更生效，即使镜像未更新）
echo "▶ 重启容器..."
docker-compose restart mrdoc  # 根据服务名称调整