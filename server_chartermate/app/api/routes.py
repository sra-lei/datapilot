"""
CharterMate - API 路由
"""
import time
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.request import ChatRequest
from app.models.response import ChatResponse, Source
from app.services.generator import generate_answer
from app.core.logger import get_logger, generate_trace_id
from app.core.cache import cache

logger = get_logger()
router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "ok", "service": "CharterMate"}

@router.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    """流式问答——SSE 协议"""
    trace_id = generate_trace_id()
    logger.info(f"[{trace_id}] 收到流式问题: {req.question[:50]}...")

    def event_generator():
        from app.services.generator import generate_answer_stream

        for token in generate_answer_stream(req.question):
            # SSE 格式: data: xxx\n\n
            yield f"data: {token}\n\n"

        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Trace-Id": trace_id,
        },
    )
    
@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    trace_id = generate_trace_id()
    start_time = time.time()

    logger.info(f"[{trace_id}] 收到问题: {req.question[:50]}...")

    # === 查缓存 ===
    cached = cache.get(req.question)
    if cached:
        elapsed = time.time() - start_time
        logger.info(f"[{trace_id}] 缓存命中 | 耗时: {elapsed:.3f}s")
        return ChatResponse(
            answer=cached["answer"],
            confidence=cached["confidence"],
            sources=[Source(**s) for s in cached["sources"]],
            trace_id=trace_id,
        )

    # === 调用 LLM ===
    result = generate_answer(req.question)

    elapsed = time.time() - start_time
    logger.info(
        f"[{trace_id}] LLM完成 | 置信度: {result['confidence']} | "
        f"耗时: {elapsed:.2f}s | 来源数: {len(result['sources'])}"
    )

    # 转换来源
    sources = []
    for s in result["sources"]:
        page_str = s.split("第")[-1].split("页")[0] if "第" in s else "未知"
        try:
            page = int(page_str)
        except ValueError:
            page = 0
        sources.append(Source(page=page))

    # === 写缓存 ===
    cache_result = {
        "answer": result["answer"],
        "confidence": result["confidence"],
        "sources": [s.model_dump() for s in sources],
    }
    cache.set(req.question, cache_result)

    return ChatResponse(
        answer=result["answer"],
        confidence=result["confidence"],
        sources=sources,
        trace_id=trace_id,
    )


@router.get("/cache/stats")
async def cache_stats():
    """查看缓存命中率"""
    return cache.stats