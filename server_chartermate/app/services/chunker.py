"""
CharterMate - 智能分块模块
策略：
1. 短段落（<300字符）→ 合并相邻段落，直到接近上限
2. 长段落（>800字符）→ 按句子边界切割，带重叠
3. 保留元数据（页码、来源）
"""
import re
from typing import List, Dict

# 分块参数
CHUNK_SIZE = 500        # 目标块大小（字符数）
CHUNK_OVERLAP = 80      # 重叠字符数
MAX_CHUNK_SIZE = 800    # 硬上限


def split_long_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """按句子边界切割长文本，相邻块有重叠"""
    # 按句号、分号、换行等自然断点切分
    sentences = re.split(r'(?<=[。；！？\n])\s*', text)
    sentences = [s.strip() for s in sentences if s.strip()]

    chunks = []
    current = ""

    for sentence in sentences:
        # 如果当前块加上新句子不超限，直接追加
        if len(current) + len(sentence) <= size:
            current += sentence
        else:
            # 当前块已满，保存
            if current:
                chunks.append(current.strip())
            # 新块从上一块的末尾开始（重叠）
            if overlap > 0 and current:
                overlap_text = current[-overlap:]
                # 从重叠部分的第一个句子边界开始
                boundary = re.search(r'[。；！？]', overlap_text)
                if boundary:
                    current = overlap_text[boundary.start()+1:] + sentence
                else:
                    current = sentence
            else:
                current = sentence

    if current.strip():
        chunks.append(current.strip())

    return chunks


def merge_short_paragraphs(paragraphs: List[Dict], min_size: int = 200) -> List[Dict]:
    """合并过短的相邻段落（同页优先）"""
    merged = []
    buffer = {"text": "", "page": None, "source": None}

    for para in paragraphs:
        # 初始化 buffer
        if buffer["page"] is None:
            buffer = {
                "text": para["text"],
                "page": para["page"],
                "source": para["source"],
            }
            continue

        # 同页且 buffer 还不够长，继续合并
        if para["page"] == buffer["page"] and len(buffer["text"]) < min_size:
            buffer["text"] += "\n" + para["text"]
        else:
            # 保存当前 buffer，开始新的
            if buffer["text"]:
                merged.append(buffer)
            buffer = {
                "text": para["text"],
                "page": para["page"],
                "source": para["source"],
            }

    # 最后一个 buffer
    if buffer["text"]:
        merged.append(buffer)

    return merged


def chunk_documents(paragraphs: List[Dict]) -> List[Dict]:
    """
    主分块函数

    输入: 解析后的段落列表
    输出: 分块列表，每块包含 text, page, source, chunk_id
    """
    # 第一步：合并过短的段落
    merged = merge_short_paragraphs(paragraphs, min_size=200)

    # 第二步：对每个段落判断是否需要进一步切割
    chunks = []
    chunk_id = 0

    for para in merged:
        text = para["text"]
        text_len = len(text)

        if text_len <= MAX_CHUNK_SIZE:
            # 长度合适，直接作为一个块
            chunks.append({
                "chunk_id": chunk_id,
                "text": text,
                "page": para["page"],
                "source": para["source"],
            })
            chunk_id += 1
        else:
            # 太长，按句子切割
            sub_chunks = split_long_text(text)
            for sub in sub_chunks:
                if len(sub) > 20:  # 过滤太短的碎片
                    chunks.append({
                        "chunk_id": chunk_id,
                        "text": sub,
                        "page": para["page"],
                        "source": para["source"],
                    })
                    chunk_id += 1

    return chunks


if __name__ == "__main__":
    from app.services.parser import parse_all_docs

    skip_config = {"恒大地产集团员工手册.pdf": [3]}
    paragraphs = parse_all_docs(skip_pages=skip_config)
    print(f"📄 解析得到 {len(paragraphs)} 个段落\n")

    chunks = chunk_documents(paragraphs)
    print(f"🧩 分块得到 {len(chunks)} 个 chunk\n")

    # 统计信息
    lengths = [len(c["text"]) for c in chunks]
    print(f"📊 块大小统计:")
    print(f"  最小: {min(lengths)} 字符")
    print(f"  最大: {max(lengths)} 字符")
    print(f"  平均: {sum(lengths)//len(lengths)} 字符")
    print(f"  <200 的块: {sum(1 for l in lengths if l < 200)}")
    print(f"  >800 的块: {sum(1 for l in lengths if l > 800)}")

    # 展示样本
    print(f"\n📌 第1块 (第{chunks[0]['page']}页):")
    print(f"  {chunks[0]['text'][:200]}...")
    print(f"\n📌 第{min(10, len(chunks))}块 (第{chunks[9]['page']}页):")
    print(f"  {chunks[9]['text'][:200]}...")