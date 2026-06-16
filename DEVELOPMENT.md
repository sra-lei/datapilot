# Trae 开发环境启动指南

## 📋 概述

Trae 项目包含三个主要服务：

| 服务 | 技术栈 | 端口 | 说明 |
|------|--------|------|------|
| **Client** | Vite + React | 3001 | 前端界面 |
| **Server** | Express + TypeScript | 3002 | Node.js 主服务器 |
| **Server_Chartermate** | FastAPI + Python | 8000 | Python 业务服务器 |

## 🚀 快速启动

### 方法 1：一键启动（推荐）

双击运行 `start-dev.bat`，选择启动模式：

```
[1] 启动所有服务（推荐）
[2] 仅启动 Client
[3] 仅启动 Server
[4] 仅启动 Server_Chartermate
[5] 停止所有服务
```

**优点**：
- ✅ 一键启动所有服务
- ✅ 每个服务在独立终端窗口中运行
- ✅ 实时查看日志输出
- ✅ 便于调试和问题排查

### 方法 2：PowerShell 脚本

```powershell
# 启动所有服务
.\start-dev.ps1

# 仅启动特定服务
.\start-dev.ps1 -Client
.\start-dev.ps1 -Server
.\start-dev.ps1 -Chartermate
```

### 方法 3：手动启动

#### 1. 启动 Client

```bash
cd e:\workspace\Trae\client
npm run dev
```

#### 2. 启动 Server（新终端）

```bash
cd e:\workspace\Trae\server
npm run dev
```

#### 3. 启动 Server_Chartermate（新终端）

```bash
cd e:\workspace\Trae\server_chartermate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📊 访问地址

### 服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| Client | http://localhost:3001 | 前端应用 |
| Server | http://localhost:3002 | 主服务器 API |
| Server_Chartermate | http://localhost:8000 | 业务服务器 API |

### API 文档

| 服务 | 地址 | 说明 |
|------|------|------|
| Server | http://localhost:3002/api-docs | Swagger 文档（仅开发环境） |
| Server_Chartermate | http://localhost:8000/docs | FastAPI 自动生成文档 |

## 🔍 查看日志

### 终端窗口日志

启动后，每个服务都会在独立的终端窗口中运行：

```
┌─────────────────────────────────────┐
│ Client - Vite                       │  ← 蓝色标题栏
├─────────────────────────────────────┤
│ VITE v5.x.x                        │
│ ready in 1234 ms                    │
│                                    │
│ ➜  Local:   http://localhost:3001/ │
│ ➜  Network: http://192.168.x.x:3001│
│                                    │
│ watching for changes...            │  ← 实时热重载
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Server - Express                   │  ← 绿色标题栏
├─────────────────────────────────────┤
│ Server is running on port 3002     │
│ Environment: development           │
│ Swagger API docs enabled           │
│                                    │
│ [2024-01-01 12:00:00] GET /api/user│
│ [2024-01-01 12:00:01] POST /api... │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Server_Chartermate - FastAPI       │  ← 紫色标题栏
├─────────────────────────────────────┤
│ INFO:     Uvicorn running on        │
│           http://0.0.0.0:8000       │
│                                    │
│ 2024-01-01 12:00:00 | INFO | 收到请 │
│ 2024-01-01 12:00:01 | INFO | 返回响 │
└─────────────────────────────────────┘
```

### 日志类型

#### Client (Vite)
- ✅ 热重载状态
- ✅ 编译错误和警告
- ✅ 浏览器控制台错误映射
- ✅ 请求代理日志

#### Server (Express)
- ✅ HTTP 请求日志（使用 Winston）
- ✅ 数据库操作日志
- ✅ 权限检查日志
- ✅ 错误堆栈跟踪

#### Server_Chartermate (FastAPI)
- ✅ 请求日志（使用 Loguru）
- ✅ RAG 处理日志
- ✅ 向量检索日志
- ✅ LLM 调用日志

## 🐛 常见问题

### 1. 端口被占用

如果端口被占用，会看到类似错误：

```
Error: listen EADDRINUSE :::3001
```

**解决方法**：

```bash
# Windows 查看端口占用
netstat -ano | findstr :3001

# 结束占用进程
taskkill /PID <PID> /F
```

### 2. 依赖安装失败

#### Node.js 依赖

```bash
cd e:\workspace\Trae\client
rm -rf node_modules package-lock.json
npm install
```

#### Python 依赖

```bash
cd e:\workspace\Trae\server_chartermate
pip install -r requirements.txt
```

### 3. TypeScript 编译错误

```bash
cd e:\workspace\Trae\server
npx tsc --noEmit
```

### 4. Python 模块导入错误

确保使用正确的环境：

```bash
cd e:\workspace\Trae\server_chartermate
python -c "import app; print('OK')"
```

## 🔧 开发技巧

### 1. 实时日志监控

在 Windows Terminal 中打开多个标签页，每个标签页运行一个服务：

```powershell
# 标签页 1: Client
cd e:\workspace\Trae\client; npm run dev

# 标签页 2: Server
cd e:\workspace\Trae\server; npm run dev

# 标签页 3: Server_Chartermate
cd e:\workspace\Trae\server_chartermate; python -m uvicorn app.main:app --reload
```

### 2. 过滤日志

#### Server 日志（过滤 INFO 级别）

```javascript
// server/src/utils/logger.js
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};
```

#### Server_Chartermate 日志（过滤特定模块）

```python
# server_chartermate/app/main.py
logger.add(sys.stderr, level="INFO")  # 只显示 INFO 及以上
```

### 3. 调试工具

#### Client
- 浏览器 DevTools (F12)
- React DevTools 扩展
- Redux DevTools（如果使用）

#### Server
- Node.js 调试器：`node --inspect src/index.ts`
- VS Code 调试配置

#### Server_Chartermate
- Python 调试器：`python -m debugpy -m uvicorn app.main:app`

## 📝 日志输出示例

### 登录请求日志

#### Client
```
[vite] http proxy error: /api/user/login
POST /api/user/login 200 45ms
```

#### Server
```
[2024-01-01 12:00:00] [INFO] POST /api/user/login
  User: admin
  IP: ::1
  Response: { status: 200, msg: 'success', data: {...} }
```

#### Server_Chartermate
```
2024-01-01 12:00:00 | INFO     | 收到请求: GET /api/v1/health
2024-01-01 12:00:00 | INFO     | 返回响应: {"status":"ok","service":"CharterMate"}
```

## 🛑 停止服务

### 方法 1：关闭终端窗口

直接关闭对应的终端窗口即可停止服务。

### 方法 2：使用快捷键

在终端窗口中按 `Ctrl + C` 可以停止服务。

### 方法 3：使用脚本

```bash
# Windows
start-dev.bat
# 选择 [5] 停止所有服务

# PowerShell
.\start-dev.ps1
# 按 Ctrl+C
```

### 方法 4：手动结束进程

```bash
# 结束 Node.js 进程
taskkill /F /IM node.exe

# 结束 Python 进程
taskkill /F /IM python.exe
```

## ✅ 检查服务状态

访问健康检查接口：

```bash
# 检查 Client
curl http://localhost:3001

# 检查 Server
curl http://localhost:3002/api/health

# 检查 Server_Chartermate
curl http://localhost:8000/api/v1/health
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
