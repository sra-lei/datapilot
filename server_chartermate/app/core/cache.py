"""
CharterMate - 内存缓存
对完全匹配的问题缓存答案，带 TTL 过期
"""
import time
import hashlib
from threading import Lock
from app.core.logger import get_logger

logger = get_logger()


class MemoryCache:
    """线程安全的内存缓存"""

    def __init__(self, ttl: int = 3600):
        self._store = {}
        self._ttl = ttl
        self._lock = Lock()
        self._hits = 0
        self._misses = 0

    def _key(self, question: str) -> str:
        """对问题做归一化后生成 key"""
        normalized = question.strip().lower()
        return hashlib.md5(normalized.encode()).hexdigest()

    def get(self, question: str) -> dict | None:
        """查缓存，命中返回答案，否则返回 None"""
        key = self._key(question)

        with self._lock:
            if key in self._store:
                entry = self._store[key]
                if time.time() - entry["timestamp"] < self._ttl:
                    self._hits += 1
                    logger.info(f"💾 缓存命中 (总命中: {self._hits})")
                    return entry["result"]
                else:
                    # 过期，删除
                    del self._store[key]

        self._misses += 1
        return None

    def set(self, question: str, result: dict):
        """写入缓存"""
        key = self._key(question)
        with self._lock:
            self._store[key] = {
                "result": result,
                "timestamp": time.time(),
            }

    def clear(self):
        """清空缓存（文档更新时调用）"""
        with self._lock:
            self._store.clear()
            self._hits = 0
            self._misses = 0

    @property
    def hit_rate(self) -> float:
        total = self._hits + self._misses
        if total == 0:
            return 0.0
        return self._hits / total

    @property
    def stats(self) -> dict:
        return {
            "hits": self._hits,
            "misses": self._misses,
            "hit_rate": f"{self.hit_rate:.1%}",
            "size": len(self._store),
        }


# 全局缓存实例
cache = MemoryCache(ttl=3600)