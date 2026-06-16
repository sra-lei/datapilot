"""
CharterMate - 结构化日志
基于 loguru，输出 JSON 格式，支持 trace_id
"""
import sys
import uuid
from loguru import logger
from app.core.config import settings


def setup_logger():
    """配置日志：移除默认 handler，添加结构化输出"""
    logger.remove()

    # 控制台输出（开发环境用彩色格式）
    logger.add(
        sys.stdout,
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
        level=settings.log_level,
        colorize=True,
    )

    # 文件输出（JSON 格式，用于后续分析）
    logger.add(
        "data/logs/app_{time:YYYY-MM-DD}.json",
        format="{time} {level} {message}",
        level="INFO",
        rotation="00:00",  # 每天轮转
        retention="7 days",
        serialize=True,     # JSON 格式
    )

    return logger


def get_logger():
    return logger


def generate_trace_id():
    return str(uuid.uuid4())[:8]