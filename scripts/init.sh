#!/bin/bash
set -e

#=========================================
# Datapilot 项目初始化脚本
# 用途：克隆主仓库后执行，初始化子模块和依赖
# 使用：bash scripts/init.sh
#=========================================

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "========================================"
echo "  Datapilot 项目初始化"
echo "========================================"
echo ""

# 1. 初始化并拉取子模块
echo "[1/4] 初始化 Git 子模块..."
if [ -f .gitmodules ]; then
    git submodule update --init --recursive
    echo "  [OK] 子模块已就绪"
else
    echo "  [SKIP] 未找到 .gitmodules，跳过"
fi
echo ""

# 2. 检查依赖环境
echo "[2/4] 检查依赖环境..."

# Node.js
if command -v node &> /dev/null; then
    echo "  [OK] Node.js $(node --version)"
else
    echo "  [ERROR] 未检测到 Node.js，请先安装：https://nodejs.org/"
    exit 1
fi

# Python
if command -v python3 &> /dev/null; then
    echo "  [OK] Python3 $(python3 --version 2>&1)"
elif command -v python &> /dev/null; then
    echo "  [OK] Python $(python --version 2>&1)"
else
    echo "  [ERROR] 未检测到 Python，请先安装：https://www.python.org/"
    exit 1
fi

# Docker（可选）
if command -v docker &> /dev/null; then
    echo "  [OK] Docker $(docker --version 2>&1 | awk '{print $3}' | tr -d ',')"
else
    echo "  [WARN] 未检测到 Docker（Docker 部署时需要）"
fi
echo ""

# 3. 安装 Client 依赖
echo "[3/4] 安装 Client 依赖..."
if [ -f client/package.json ]; then
    cd client
    npm install
    cd "$PROJECT_ROOT"
    echo "  [OK] Client 依赖已安装"
else
    echo "  [SKIP] client/ 目录不存在"
fi
echo ""

# 4. 安装 Core Service 依赖
echo "[4/4] 安装 Core Service 依赖..."
if [ -f services/core/package.json ]; then
    cd services/core
    npm install
    cd "$PROJECT_ROOT"
    echo "  [OK] Core Service 依赖已安装"
else
    echo "  [SKIP] services/core/ 目录不存在"
fi
echo ""

# 提示 CharterMate 虚拟环境（可选）
if [ -f services/chartermate/requirements.txt ] && [ ! -d services/chartermate/.venv ]; then
    echo "========================================"
    echo "  提示：CharterMate 虚拟环境未创建"
    echo "========================================"
    echo "  建议执行以下命令创建虚拟环境："
    echo ""
    echo "    cd services/chartermate"
    echo "    python -m venv .venv"
    echo "    source .venv/bin/activate      # Linux/macOS"
    echo "    .venv\\Scripts\\activate.bat    # Windows"
    echo "    pip install -r requirements.txt"
    echo ""
fi

echo "========================================"
echo "  初始化完成！"
echo "========================================"
echo ""
echo "  启动开发环境："
echo "    bash scripts/start-dev.sh    # Linux/macOS"
echo "    scripts\\start-dev.bat        # Windows"
echo ""
echo "  或分别启动各服务："
echo "    cd client && npm run dev              # 前端 :3001"
echo "    cd services/core && npm run dev        # Core  :3002"
echo "    cd services/chartermate && uvicorn app.main:app --reload  # AI :8000"
echo ""
