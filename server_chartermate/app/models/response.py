"""响应模型"""
from pydantic import BaseModel
from typing import List, Optional


class Source(BaseModel):
    page: int
    similarity: Optional[float] = None


class ChatResponse(BaseModel):
    answer: str
    confidence: str
    sources: List[Source]
    trace_id: str