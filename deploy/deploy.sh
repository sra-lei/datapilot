#!/usr/bin/env bash
# ============================================================
# Datapolit 一键部署脚本
#
# 用途：在服务器（或任意装有 Docker 的主机）上一条命令部署/更新全部服务
#       （client / core / docs-seeker / doc-kit / mysql / redis）
#
# 用法：
#   bash deploy/deploy.sh             # 首次部署 / 更新（pull + up -d）
#   bash deploy/deploy.sh up          # 同上
#   bash deploy/deploy.sh update      # 拉取最新镜像并重建
#   bash deploy/deploy.sh down        # 停止全部服务（保留数据卷）
#   bash deploy/deploy.sh restart     # 重启全部服务
#   bash deploy/deploy.sh status      # 查看服务状态
#   bash deploy/deploy.sh logs [svc]  # 跟踪日志（可指定服务名）
#
# 首次使用：
#   1. 进入 deploy/ 目录：cd deploy
#   2. 复制环境变量模板并填入真实密钥：cp .env.example .env
#   3. 运行：bash deploy.sh
#   4. 若镜像仓库需要登录，脚本会提示 docker login docker.cnb.cool
#      （也可提前设置 CNB_REGISTRY_USER / CNB_REGISTRY_PASSWORD 自动登录）
# ============================================================
set -euo pipefail

# ---------- 基础配置 ----------
DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DEPLOY_DIR"

COMPOSE_FILE="docker-compose.yml"
NETWORK="datapolit-shared"
ENV_TEMPLATE=".env.example"
ENV_FILE=".env"
REGISTRY="docker.cnb.cool"
PROJECT="sra_lei"

# ---------- 输出配色 ----------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; }

# ---------- 1. 检查 Docker 环境 ----------
check_docker() {
  if ! command -v docker &>/dev/null; then
    error "未检测到 Docker，请先安装：https://docs.docker.com/engine/install/"
    exit 1
  fi
  info "Docker 版本: $(docker --version)"

  if ! docker compose version &>/dev/null; then
    error "未检测到 docker compose 插件（v2），请安装：https://docs.docker.com/compose/install/"
    exit 1
  fi
  info "Docker Compose 版本: $(docker compose version --short)"
}

# ---------- 2. 确保外部网络存在 ----------
ensure_network() {
  if docker network inspect "$NETWORK" &>/dev/null; then
    info "网络 $NETWORK 已存在"
  else
    warn "创建外部网络 $NETWORK ..."
    docker network create "$NETWORK"
    info "网络 $NETWORK 已创建"
  fi
}

# ---------- 3. 准备环境变量文件 ----------
ensure_env() {
  if [ ! -f "$ENV_FILE" ]; then
    cp "$ENV_TEMPLATE" "$ENV_FILE"
    error "已从 $ENV_TEMPLATE 生成 $ENV_FILE，请先编辑填入真实密钥后再运行"
    echo ""
    echo "    vi $ENV_FILE"
    echo ""
    exit 1
  fi
  info "环境变量文件 $ENV_FILE 已就绪"
}

# ---------- 4. 登录镜像仓库（可选） ----------
ensure_registry_login() {
  if [ -n "${CNB_REGISTRY_USER:-}" ] && [ -n "${CNB_REGISTRY_PASSWORD:-}" ]; then
    info "使用 CNB_REGISTRY_USER / CNB_REGISTRY_PASSWORD 登录 $REGISTRY ..."
    echo "$CNB_REGISTRY_PASSWORD" | docker login "$REGISTRY" -u "$CNB_REGISTRY_USER" --password-stdin
  else
    # 先试匿名拉取（公开镜像可直接拉），失败则交互式登录
    if ! docker pull "$REGISTRY/$PROJECT/datapolit-client:latest" &>/dev/null; then
      warn "拉取镜像需要登录 $REGISTRY，请按提示登录（或设置 CNB_REGISTRY_USER/CNB_REGISTRY_PASSWORD 自动登录）"
      docker login "$REGISTRY"
    else
      info "镜像仓库 $REGISTRY 可匿名访问"
    fi
  fi
}

# ---------- 5. 部署 / 更新 ----------
cmd_up() {
  check_docker
  ensure_network
  ensure_env
  ensure_registry_login

  info "拉取最新镜像 ..."
  docker compose -f "$COMPOSE_FILE" pull

  info "启动/更新全部服务 ..."
  docker compose -f "$COMPOSE_FILE" up -d

  cmd_status
  echo ""
  info "部署完成！访问地址："
  echo "    前端入口:     http://<服务器IP>/"
  echo "    Docs-Seeker:  http://<服务器IP>:8001"
  echo "    Doc-Kit:      http://<服务器IP>:8100"
}

# ---------- 子命令 ----------
cmd_update() {
  check_docker
  ensure_network
  ensure_env
  ensure_registry_login
  info "拉取最新镜像并重建服务 ..."
  docker compose -f "$COMPOSE_FILE" pull
  docker compose -f "$COMPOSE_FILE" up -d --force-recreate
  cmd_status
}

cmd_down() {
  check_docker
  info "停止全部服务（数据卷保留）..."
  docker compose -f "$COMPOSE_FILE" down --remove-orphans
}

cmd_restart() {
  check_docker
  docker compose -f "$COMPOSE_FILE" restart
}

cmd_status() {
  check_docker
  docker compose -f "$COMPOSE_FILE" ps
}

cmd_logs() {
  check_docker
  local svc="${1:-}"
  if [ -n "$svc" ]; then
    docker compose -f "$COMPOSE_FILE" logs -f "$svc"
  else
    docker compose -f "$COMPOSE_FILE" logs -f
  fi
}

# ---------- 入口 ----------
ACTION="${1:-up}"
case "$ACTION" in
  up)        cmd_up ;;
  update)    cmd_update ;;
  down)      cmd_down ;;
  restart)   cmd_restart ;;
  status)    cmd_status ;;
  logs)      cmd_logs "${2:-}" ;;
  help|-h|--help)
    sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
    ;;
  *)
    error "未知命令: $ACTION"
    echo "可用命令: up | update | down | restart | status | logs [svc] | help"
    exit 1
    ;;
esac
