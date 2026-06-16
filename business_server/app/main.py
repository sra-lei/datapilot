# CharterMate - 业务服务
# 提供健康检查接口

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="CharterMate", version="1.0.0")

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头部
)

@app.get("/api/v1/health")
async def health_check():
    """健康检查接口"""
    return {
        "status": "ok",
        "service": "CharterMate"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)