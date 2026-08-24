# Datapilot 开发环境启动指南

## 📋 概述

Datapilot 项目采用微服务架构组织，主要包含以下服务：

| 服务 | 技术栈 | 端口 | 目录 | 说明 |
|------|--------|------|------|------|
| **Client** | Vite + React | 8080 | `client/` | 前端界面 |
| **Core Service** | Express + TypeScript | 3002 | `services/core/` | 核心服务（用户、权限、数据库管理） |
| **Doc-Kit** | Python FastAPI | 8100 | `services/doc-kit/` | 文档处理服务（PDF 解析、向量入库） |
| **Docs-Seeker** | Python FastAPI | 8001 | `services/docs-seeker/` | 检索问答服务（RAG 智能问答） |

## 📁 项目结构

```
datapilot/
├── client/                    # 前端应用
├── services/                  # 后端服务集合
│   ├── core/                  # 核心服务
│   ├── doc-kit/               # 文档处理服务
│   └── docs-seeker/           # 检索问答服务
├── scripts/
│   └── init.sh                    # 项目初始化（submodule + 依赖）
├── deploy/                        # 一键部署（docker compose + deploy.sh）
└── DEVELOPMENT.md                 # 开发文档
```

## 🚀 快速启动

### 各服务启动说明

> 各服务详细说明以各自目录下的 README 为准。

#### 1. 启动 Client

```bash
cd e:\workspace\datapilot\client
npm run dev
```

#### 2. 启动 Core Service

```bash
cd e:\workspace\datapilot\services\core
npm run dev
```

#### 3. 启动 Doc-Kit（Python，可选）

```bash
cd e:\workspace\datapilot\services\doc-kit
uv sync --extra dev        # 首次需先复制 .env.example 为 .env 并填写密钥
uv run uvicorn dockit.app:app --host 0.0.0.0 --port 8100
```

#### 4. 启动 Docs-Seeker（Python，可选）

```bash
cd e:\workspace\datapilot\services\docs-seeker
uv sync --extra dev          # 首次需先复制 .env.example 为 .env 并填写密钥
uv run uvicorn docs_seeker.app:app --host 0.0.0.0 --port 8001
```

## 📊 访问地址

### 服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| Client | http://localhost:8080 | 前端应用 |
| Core Service | http://localhost:3002 | 核心服务 API |
| Doc-Kit | http://localhost:8100 | 文档处理服务 API |
| Docs-Seeker | http://localhost:8001 | 检索问答服务 API |

### API 文档

| 服务 | 地址 | 说明 |
|------|------|------|
| Core Service | http://localhost:3002/core/api-docs | Swagger 文档（仅开发环境） |

## 🔍 查看日志

### 终端窗口日志

启动后，每个服务都会在独立的终端窗口中运行：

```
┌─────────────────────────────────────┐
│ Client - Vite                       │
├─────────────────────────────────────┤
│ VITE v5.x.x                        │
│ ready in 1234 ms                    │
│                                    │
│ ➜  Local:   http://localhost:8080/ │
│ ➜  Network: http://192.168.x.x:8080│
│                                    │
│ watching for changes...            │  ← 实时热重载
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Core - Express                     │
├─────────────────────────────────────┤
│ Server is running on port 3002     │
│ Environment: development           │
│ Swagger API docs enabled           │
│                                    │
│ 2024-01-01 12:00:00 [INFO] [USER_LOGIN] 用户登录成功 │
│ 2024-01-01 12:00:01 [INFO] [REQUEST] GET /core/health│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Doc-Kit - FastAPI                   │
├─────────────────────────────────────┤
│ INFO:     Started server process [1234]               │
│ INFO:     Application startup complete.               │
│ INFO:     Uvicorn running on http://0.0.0.0:8100      │
│ INFO:     VectorStore 初始化完成 | collection=chartermate_docs │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Docs-Seeker - FastAPI               │
├─────────────────────────────────────┤
│ INFO:     Started server process [5678]               │
│ INFO:     docs-seeker 启动中...                        │
│ INFO:     BM25 索引构建完成: docs=120 terms=4500       │
│ INFO:     Application startup complete.               │
│ INFO:     Uvicorn running on http://0.0.0.0:8001      │
└─────────────────────────────────────┘
```

### 日志类型

#### Client (Vite)
- ✅ 热重载状态
- ✅ 编译错误和警告
- ✅ 浏览器控制台错误映射
- ✅ 请求代理日志

#### Core Service (Express)
- ✅ HTTP 请求日志（使用 Winston）
- ✅ 数据库操作日志
- ✅ 权限检查日志
- ✅ 错误堆栈跟踪

#### Doc-Kit (FastAPI)
- ✅ uvicorn 访问日志
- ✅ 文档解析 / 切块 / 摘要生成日志
- ✅ 向量化与入库进度日志

#### Docs-Seeker (FastAPI)
- ✅ uvicorn 访问日志
- ✅ BM25 索引构建与检索日志
- ✅ RAG 流程 / 语义缓存命中日志
- ✅ LLM 网关与熔断日志

## 🐛 常见问题

### 1. 端口被占用

如果端口被占用，会看到类似错误：

```
Error: listen EADDRINUSE :::8080
```

**解决方法**：

```bash
# Windows 查看端口占用（8080 为 Client，3002 为 Core Service）
netstat -ano | findstr :8080

# 结束占用进程
taskkill /PID <PID> /F
```

### 2. 依赖安装失败

#### Node.js 依赖

```bash
cd e:\workspace\datapilot\services\core
rm -rf node_modules package-lock.json
npm install
```

### 3. TypeScript 编译错误

```bash
cd e:\workspace\datapilot\services\core
npx tsc --noEmit
```

## 🔧 开发技巧

### 1. 实时日志监控

在 Windows Terminal 中打开多个标签页，每个标签页运行一个服务：

```powershell
# 标签页 1: Client
cd e:\workspace\datapilot\client; npm run dev

# 标签页 2: Core Service
cd e:\workspace\datapilot\services\core; npm run dev
```

### 2. 过滤日志

#### Core Service 日志（默认 INFO 级别）

日志级别由 `services/core/src/constants/logConstants.ts` 中的 `LOG_CONFIG.DEFAULT_LEVEL` 定义（默认 `info`），
可通过环境变量 `LOG_LEVEL` 调整（可选值：`error` / `warn` / `info` / `debug`）。

### 3. 调试工具

#### Client
- 浏览器 DevTools (F12)
- React DevTools 扩展

#### Core Service
- Node.js 调试器：`npx ts-node --inspect src/index.ts`
- VS Code 调试配置

## 📝 日志输出示例

### 登录请求日志

#### Client
```
[vite] http proxy error: /core/user/login
POST /core/user/login 200 45ms
```

#### Core Service
```
2024-01-01 12:00:00 [INFO ] [USER_LOGIN       ] 用户登录成功 | userId=1 | {"ip":"::1","path":"/core/user/login"}
```

## 🛑 停止服务

### 方法 1：关闭终端窗口

直接关闭对应的终端窗口即可停止服务。

### 方法 2：使用快捷键

在终端窗口中按 `Ctrl + C` 可以停止服务。

### 方法 3：手动结束进程

```bash
# 结束 Node.js 进程
taskkill /F /IM node.exe
```

## ✅ 检查服务状态

访问健康检查接口：

```bash
# 检查 Client
curl http://localhost:8080

# 检查 Core Service
curl http://localhost:3002/core/health

# 检查 Doc-Kit
curl http://localhost:8100/doc-kit/health

# 检查 Docs-Seeker
curl http://localhost:8001/v1/health
```

## 🎯 最佳实践

1. **开发前**：启动所有服务，确保日志正常输出
2. **开发时**：观察终端日志，及时发现问题
3. **调试时**：使用对应服务的终端窗口查看详细日志
4. **完成后**：使用 `Ctrl + C` 优雅停止服务
5. **问题排查**：先查看相关服务的日志输出

## 📞 获取帮助

如果在启动过程中遇到问题：

1. 查看终端中的错误信息
2. 参考本文档的常见问题部分
3. 检查依赖是否正确安装
4. 确认端口未被占用

## 📌 扩展说明

未来添加新的业务服务时，只需在 `services/` 目录下创建新的服务目录即可：

```
services/
├── core/              # 核心服务（用户、权限、数据库）
├── analytics/         # 数据分析服务（新增）
├── notifications/     # 通知服务（新增）
├── payment/           # 支付服务（新增）
└── gateway/           # API 网关（可选）
```

每个服务保持独立的代码结构、依赖管理和部署配置。
