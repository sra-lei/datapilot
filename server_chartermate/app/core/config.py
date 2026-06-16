"""
CharterMate - 配置管理
所有配置通过环境变量读取，禁止硬编码
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # DeepSeek (Chat)
    deepseek_api_key: str = ""
    deepseek_base_url: str = "https://api.deepseek.com"
    llm_model: str = "deepseek-chat"

    # 阿里百炼 (Embedding)
    dashscope_api_key: str = ""
    dashscope_base_url: str = "https://dashscope.aliyuncs.com/compatible-mode/v1"
    embedding_model: str = "text-embedding-v2"

    # 应用配置
    log_level: str = "INFO"
    chroma_dir: str = "data/chroma_db"
    collection_name: str = "chartermate_docs"
    cache_ttl: int = 3600  # 缓存过期时间（秒）

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()