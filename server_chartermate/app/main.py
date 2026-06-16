"""
CharterMate - FastAPI 应用入口
"""
from fastapi import FastAPI
from app.api.routes import router
from app.core.logger import setup_logger

# 初始化日志
setup_logger()

app = FastAPI(
    title="CharterMate",
    description="员工手册智能问答助手",
    version="0.2.0",
)

app.include_router(router, prefix="/api/v1")