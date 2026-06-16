"""并发测试：20 个请求同时发，不应有 500"""
import asyncio
import httpx
import time

URL = "http://localhost:8000/api/v1/chat"
QUESTIONS = [
    "年假有几天？",
    "怎么报销差旅费？",
    "考勤迟到怎么扣钱？",
    "加班费怎么算？",
    "请假流程是什么？",
]

async def send_one(client, i):
    q = QUESTIONS[i % len(QUESTIONS)]
    start = time.time()
    try:
        resp = await client.post(URL, json={"question": q}, timeout=30)
        elapsed = time.time() - start
        return f"[{i}] {resp.status_code} | {elapsed:.2f}s | {q[:20]}"
    except Exception as e:
        return f"[{i}] ERROR: {e}"

async def main():
    async with httpx.AsyncClient() as client:
        tasks = [send_one(client, i) for i in range(20)]
        results = await asyncio.gather(*tasks)
        for r in results:
            print(r)

        errors = sum(1 for r in results if "ERROR" in r or "500" in r)
        print(f"\n{'✅ 全部通过' if errors == 0 else f'❌ {errors} 个失败'}")

asyncio.run(main())