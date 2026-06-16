# CharterMate 业务服务

基于 FastAPI 的业务服务，提供健康检查等接口。

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 启动服务

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. 访问接口

- 健康检查：http://localhost:8000/api/v1/health
- API 文档：http://localhost:8000/docs

## 接口说明

### 健康检查

**GET** `/api/v1/health`

返回服务状态信息。

**响应示例**：
```json
{
  "status": "ok",
  "service": "CharterMate"
}
```

## 开发说明

- 使用 FastAPI 框架
- 支持 CORS 跨域访问
- 提供 RESTful API
- 自动生成 API 文档