"""
CharterMate - 生成模块
负责：检索 → 构建 Prompt → 调用 DeepSeek → 置信度分级
"""
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# DeepSeek Chat 客户端
chat_client = OpenAI(
    api_key=os.getenv("deepseek_api_key"),
    base_url=os.getenv("deepseek_base_url"),
)
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-chat")

# Prompt 模板
SYSTEM_PROMPT = """你是公司内部政策助手，基于以下【参考资料】回答问题。

要求：
- 如果资料中有明确答案，用简洁的列表或步骤说明，并注明出处（页码）。
- 如果资料不包含答案，直接说"该问题在现有手册中未找到，建议联系HR部门"。
- 不要编造资料外的任何信息，不要猜测。
- 回答保持专业、简洁，不超过300字。"""


def retrieve(query: str, top_k: int = 5):
    """检索相关文档块"""
    from app.services.embedder import get_collection, get_embedding

    collection = get_collection()
    query_embedding = get_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )

    docs = []
    for i in range(len(results["documents"][0])):
        distance = results["distances"][0][i] if results.get("distances") else 1.0
        # ChromaDB 余弦距离: 0=完全匹配, 2=完全相反
        # 转换为相似度: distance 越小越相似
        similarity = 1 - (distance / 2)  # 归一化到 0~1
        docs.append({
            "text": results["documents"][0][i],
            "page": results["metadatas"][0][i].get("page", "未知"),
            "source": results["metadatas"][0][i].get("source", "未知"),
            "score": round(similarity, 2),
        })

    return docs


def classify_confidence(docs: list) -> str:
    """
    基于检索质量判断置信度
    高置信：Top1 相似度高，且与 Top2 差距明显 → 资料高度相关
    中置信：Top1 有一定相关性
    低置信：Top1 相似度也低 → 资料可能不相关
    """
    if not docs:
        return "🔴 低"

    top_score = docs[0].get("score", 0)

    if top_score > 0.7:
        return "🟢 高"
    elif top_score > 0.5:
        return "🟡 中"
    else:
        return "🔴 低"


def generate_answer(question: str):
    """主问答函数"""
    # 1. 检索
    docs = retrieve(question, top_k=5)

    if not docs:
        return {
            "answer": "未找到相关资料，建议联系HR部门。",
            "confidence": "🔴 低",
            "sources": [],
        }

    # 2. 构建上下文
    context_parts = []
    for i, doc in enumerate(docs):
        context_parts.append(f"[资料{i+1} 第{doc['page']}页] {doc['text']}")
    context = "\n\n".join(context_parts)

    # 3. 调用 LLM
    try:
        response = chat_client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"【参考资料】\n{context}\n\n【用户问题】\n{question}"},
            ],
            max_tokens=600,
            temperature=0.3,
        )
        answer = response.choices[0].message.content
    except Exception as e:
        return {
            "answer": f"系统错误：{str(e)}",
            "confidence": "🔴 低",
            "sources": [],
        }

    # 4. 置信度
    confidence = classify_confidence(docs)

    # 5. 来源
    sources = []
    for doc in docs[:3]:
        sources.append(f"第{doc['page']}页 (相似度: {doc.get('score', 'N/A'):.2f})" if doc.get('score') else f"第{doc['page']}页")

    return {
        "answer": answer,
        "confidence": confidence,
        "sources": sources,
    }

def generate_answer_stream(question: str):
    """流式问答——逐 token 返回"""
    # 1. 检索
    docs = retrieve(question, top_k=5)

    if not docs:
        yield "未找到相关资料，建议联系HR部门。"
        return

    # 2. 构建上下文
    context_parts = []
    for i, doc in enumerate(docs):
        context_parts.append(f"[资料{i+1} 第{doc['page']}页] {doc['text']}")
    context = "\n\n".join(context_parts)

    # 3. 流式调用 LLM
    try:
        response = chat_client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"【参考资料】\n{context}\n\n【用户问题】\n{question}"},
            ],
            max_tokens=600,
            temperature=0.3,
            stream=True,
        )

        for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    except Exception as e:
        yield f"系统错误：{str(e)}"

if __name__ == "__main__":
    print("=" * 50)
    print("🏢 CharterMate - 员工手册智能问答")
    print("输入 'quit' 退出，输入 'detail' 查看检索详情")
    print("=" * 50)

    while True:
        question = input("\n❓ 请输入问题: ").strip()

        if not question:
            continue

        if question.lower() == "quit":
            print("👋 再见！")
            break

        result = generate_answer(question)

        print(f"\n📋 {result['confidence']}置信度")
        print(f"📝 {result['answer']}")

        if question.lower() == "detail":
            print(f"\n📚 参考来源:")
            for s in result["sources"]:
                print(f"  - {s}")