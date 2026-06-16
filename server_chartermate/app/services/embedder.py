"""
CharterMate - 向量化与存储模块
Embedding: 阿里百炼 text-embedding-v2
Chat: DeepSeek（后续 Q&A 阶段用）
"""
import os
import chromadb
from dotenv import load_dotenv
from openai import OpenAI
from typing import List, Dict

load_dotenv()

# ============ 配置 ============
# Embedding 客户端（阿里百炼）
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-v2")
embedding_client = OpenAI(
    api_key=os.getenv("dashscope_api_key"),
    base_url=os.getenv("dashscope_base_url"),
)

# Chat 客户端（DeepSeek）—— 当前阶段暂不用，提前配好
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-chat")
chat_client = OpenAI(
    api_key=os.getenv("deepseek_api_key"),
    base_url=os.getenv("deepseek_base_url"),
)

# ChromaDB
CHROMA_DIR = "data/chroma_db"
COLLECTION_NAME = "chartermate_docs"
chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)


def get_embedding(text: str) -> List[float]:
    """获取单条文本的 embedding"""
    text = text.replace("\n", " ")
    response = embedding_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text,
    )
    return response.data[0].embedding


def get_embeddings_batch(texts: List[str], batch_size: int = 20) -> List[List[float]]:
    """批量获取 embedding"""
    all_embeddings = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        batch = [t.replace("\n", " ") for t in batch]
        print(f"  🔄 向量化 {i+1}-{min(i+batch_size, len(texts))}/{len(texts)}")
        response = embedding_client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=batch,
        )
        all_embeddings.extend([d.embedding for d in response.data])
    return all_embeddings


def build_index(chunks: List[Dict], rebuild: bool = False):
    """将分块数据向量化并存入 ChromaDB"""
    if rebuild:
        try:
            chroma_client.delete_collection(COLLECTION_NAME)
            print(f"🗑️ 已删除旧索引")
        except Exception:
            pass

    collection = chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "CharterMate 文档知识库"}
    )

    ids = [str(c["chunk_id"]) for c in chunks]
    documents = [c["text"] for c in chunks]
    metadatas = [
        {"page": c["page"], "source": c["source"]}
        for c in chunks
    ]

    print(f"📊 开始向量化 {len(documents)} 个 chunk...")
    embeddings = get_embeddings_batch(documents)

    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas,
    )

    print(f"✅ 索引构建完成: {collection.count()} 条记录")
    return collection


def get_collection():
    """获取已有的 collection"""
    return chroma_client.get_collection(COLLECTION_NAME)


if __name__ == "__main__":
    from app.services.parser import parse_all_docs
    from app.services.chunker import chunk_documents

    print("=" * 50)
    print("CharterMate - 索引构建")
    print(f"Embedding: {EMBEDDING_MODEL} (阿里百炼)")
    print(f"Chat: {LLM_MODEL} (DeepSeek)")
    print("=" * 50)

    # 解析
    skip_config = {"恒大地产集团员工手册.pdf": [3]}
    paragraphs = parse_all_docs(skip_pages=skip_config)
    print(f"\n📄 解析: {len(paragraphs)} 个段落")

    # 分块
    chunks = chunk_documents(paragraphs)
    print(f"🧩 分块: {len(chunks)} 个 chunk")

    # 向量化 + 入库
    build_index(chunks, rebuild=True)