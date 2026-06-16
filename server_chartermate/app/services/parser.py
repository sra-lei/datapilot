"""
CharterMate - 文档解析模块
负责：PDF 读取 → 文本提取 → 基础清洗 → 输出结构化段落列表
"""
import re
import fitz  # PyMuPDF
from pathlib import Path
from typing import List, Dict


def clean_text(text: str) -> str:
    """清洗提取出的文本"""
    # 移除多余空白行（保留单个换行）
    text = re.sub(r'\n\s*\n', '\n', text)
    # 移除页眉页脚常见格式（如 "第X页" 单独一行）
    text = re.sub(r'^\s*第\s*\d+\s*页\s*$', '', text, flags=re.MULTILINE)
    # 移除首尾空白
    text = text.strip()
    return text


def is_garbled_text(text: str) -> bool:
    """检测文本是否为乱码（包含过多替换字符或异常Unicode）"""
    if not text:
        return True
    # 统计有效中文字符和乱码特征
    chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', text))
    replacement_chars = text.count('\ufffd')
    # 如果替换字符超过10%或者完全没有中文且替换字符较多，认为是乱码
    return replacement_chars > len(text) * 0.1 or (chinese_chars == 0 and replacement_chars > 5)


def extract_text_with_ocr(page, dpi: int = 300) -> str:
    """
    通过 OCR 从 PDF 页面提取文本
    将页面渲染为图像后使用 pytesseract 识别
    """
    try:
        import pytesseract
        from PIL import Image
        import io

        # 设置 Tesseract 中文语言包路径（如果需要自定义）
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

        # 将页面渲染为图像
        mat = fitz.Matrix(dpi / 72, dpi / 72)
        pix = page.get_pixmap(matrix=mat)
        img_data = pix.tobytes("png")
        img = Image.open(io.BytesIO(img_data))

        # 使用 OCR 提取文本，指定中文
        text = pytesseract.image_to_string(img, lang='chi_sim+eng')
        return text
    except ImportError:
        return ""
    except Exception:
        return ""


def parse_pdf(filepath: str, skip_pages: list = None) -> List[Dict]:
    """
    解析单个 PDF 文件，按自然段落切分
    支持多种文本提取策略，处理中文编码问题
    """
    if skip_pages is None:
        skip_pages = []

    doc = fitz.open(filepath)
    filename = Path(filepath).name
    paragraphs = []

    for i, page in enumerate(doc):
        page_num = i + 1

        if page_num in skip_pages:
            continue

        # 策略1: 尝试标准文本提取
        text = page.get_text()

        # 策略2: 如果文本看起来是乱码，尝试 blocks 方式提取
        if is_garbled_text(text):
            blocks = page.get_text("blocks")
            if blocks:
                # 按垂直位置排序blocks，合并同一段落的文本
                block_texts = []
                for block in blocks:
                    if len(block) >= 5:  # blocks格式: x0,y0,x1,y1,text,block_no,block_type
                        block_text = block[4].strip() if block[4] else ""
                        if block_text and not is_garbled_text(block_text):
                            block_texts.append((block[1], block_text))  # (y0, text)
                if block_texts:
                    block_texts.sort(key=lambda x: x[0])
                    text = " ".join([t for _, t in block_texts])

        # 策略3: 如果仍然是乱码，尝试 OCR
        if is_garbled_text(text):
            ocr_text = extract_text_with_ocr(page)
            if ocr_text:
                text = ocr_text

        text = clean_text(text)

        if not text:
            continue

        # 先按空白行切段落
        raw_paras = re.split(r'\n\s*\n', text)

        for para in raw_paras:
            # 合并段落内部的单换行
            para = re.sub(r'(?<!\n)\n(?!\n)', ' ', para)
            para = re.sub(r'\s+', ' ', para)
            para = para.strip()

            # 降低阈值，过滤过短的（页码、页眉残留）
            if len(para) > 5:
                paragraphs.append({
                    "text": para,
                    "page": page_num,
                    "source": filename,
                })

    doc.close()
    return paragraphs


def parse_all_docs(docs_dir: str = "data/docs", skip_pages: dict = None) -> List[Dict]:
    """
    解析 docs 目录下的所有文档

    参数:
        docs_dir: 文档目录路径
        skip_pages: 每份文档要跳过的页码，如 {"恒大地产集团员工手册.pdf": [3]}

    返回:
        所有文档的段落列表
    """
    if skip_pages is None:
        skip_pages = {}

    docs_path = Path(docs_dir)
    if not docs_path.exists():
        raise FileNotFoundError(f"文档目录不存在: {docs_dir}")

    all_paragraphs = []
    supported = [".pdf", ".docx"]

    for filepath in docs_path.iterdir():
        if filepath.suffix.lower() not in supported:
            continue

        filename = filepath.name
        pages_to_skip = skip_pages.get(filename, [])

        if filepath.suffix.lower() == ".pdf":
            paragraphs = parse_pdf(str(filepath), skip_pages=pages_to_skip)
            all_paragraphs.extend(paragraphs)
            print(f"✅ {filename}: 提取 {len(paragraphs)} 个段落")
        # .docx 暂不处理，后续再加

    return all_paragraphs


if __name__ == "__main__":
    # 快速测试
    skip_config = {
        "恒大地产集团员工手册.pdf": [3]  # 第3页是扫描件，跳过
    }
    paragraphs = parse_all_docs(skip_pages=skip_config)

    print(f"\n📊 总计提取 {len(paragraphs)} 个段落")
    if paragraphs:
        print(f"\n📄 第1段样本 (第{paragraphs[0]['page']}页):")
        print(f"  {paragraphs[0]['text'][:150]}...")
        print(f"\n📄 第5段样本 (第{paragraphs[4]['page']}页):")
        print(f"  {paragraphs[4]['text'][:150]}...")