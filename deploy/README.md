# Datapolit 一键部署（deploy/）

本目录用于在服务器上一条命令部署/更新 Datapolit 全部服务：

| 服务 | 容器名 | 端口 | 说明 |
|---|---|---|---|
| client | datapolit-client | 80 | 前端（Nginx 反代 `/core` `/v1` `/doc-kit`） |
| core | datapolit-core | 3002（内部） | Node/Express 后端 |
| docs-seeker | datapolit-docs-seeker | 8001 | 语义检索问答（Python） |
| doc-kit | datapolit-dockit | 8100 | 文档处理（Python） |
| mysql | datapolit-mysql | 3306（内部） | MySQL 8.0，首次建库自动执行 init.sql |
| redis | datapolit-redis | 6379（内部） | Redis 语义缓存（docs-seeker 使用） |

## 快速开始（服务器上）

```bash
# 1. 拉取本目录（或整个仓库），进入 deploy/
cd deploy

# 2. 配置环境变量（首次必需）
cp .env.example .env
vi .env        # 填入 DeepSeek / 百炼 / Zilliz 等真实密钥

# 3. 一键部署
bash deploy.sh
```

脚本会自动完成：检查 Docker → 创建外部网络 `datapolit-shared` → 拉取镜像
（如仓库需要登录会提示 `docker login docker.cnb.cool`）→ 启动全部服务。

## 常用命令

```bash
bash deploy.sh               # 部署/更新（pull + up -d）
bash deploy.sh update        # 拉取最新镜像并强制重建
bash deploy.sh status        # 查看服务状态
bash deploy.sh logs          # 跟踪全部日志
bash deploy.sh logs core     # 跟踪指定服务日志
bash deploy.sh restart       # 重启全部服务
bash deploy.sh down          # 停止全部服务（数据卷保留）
```

## 环境变量说明（.env）

`deploy/.env.example` 是模板，包含全部服务的配置项，按段组织：

- **Core + MySQL**：`DB_*`（应用用户连接 MySQL）、`MYSQL_*`（MySQL 初始化）
- **Doc-Kit**：`DASHSCOPE_API_KEY`、`DEEPSEEK_API_KEY`、`MILVUS_URI`、`MILVUS_API_KEY`（大写变量名）
- **Docs-Seeker**：`MILVUS_TOKEN`、`SEMANTIC_CACHE_ENABLED`、`REDIS_URL=redis://redis:6379`

> ⚠️ `.env` 已被 `.gitignore` 忽略，请勿提交真实密钥。
> ⚠️ 不要修改 `REDIS_URL` 的 host（`redis`）与端口（`6379`）——容器内通过服务名访问。

## 手动方式（不依赖脚本）

```bash
cd deploy
docker network create datapolit-shared   # 首次
docker compose -f docker-compose.yml up -d
```

## 说明

- 网络统一使用外部网络 `datapolit-shared`，与各服务独立部署（`docker-compose.server.yml` /
  `docker-compose.prod.yml`）一致，互不冲突。
- MySQL 首次建库时挂载 `../services/core/database/init` 执行唯一权威 `init.sql`；
  已有数据库由 Core 启动时的 `ensureSchema()` 幂等补齐。
- 数据持久化使用命名卷：`mysql_data`、`redis_data`、`docsseeker-data`、`dockit-data`；Core 日志写入 `./logs`（本目录）。
