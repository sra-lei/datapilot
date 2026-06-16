"""
CharterMate - 文档可解析性验证脚本
用途：快速验证所有文档能否提取文字，发现表格、乱码等问题
"""
import os
import fitz  # PyMuPDF

DOCS_DIR = "data/docs"

def check_pdf(filepath):
    doc = fitz.open(filepath)
    page_count = doc.page_count  # 先存起来
    print(f"总页数: {page_count}")

    total_chars = 0
    empty_pages = []
    table_like_pages = []

    for i, page in enumerate(doc):
        text = page.get_text()
        chars = len(text.strip())
        total_chars += chars

        if chars == 0:
            empty_pages.append(i + 1)
            print(f"  ⚠️ 第{i+1}页: 无法提取文字（可能是扫描件或图片型PDF）")

        if text.count("  ") > 10 and any(c.isdigit() for c in text):
            table_like_pages.append(i + 1)

        if i == 0:
            print(f"  第1页样本:\n  {text[:200].replace(chr(10), chr(10)+'  ')}")
            if len(text) > 200:
                print(f"  ...(共 {chars} 字符)")

    doc.close()

    # 用 page_count 替代 doc.page_count
    print(f"\n📊 总字符数: {total_chars}")
    print(f"📊 平均每页: {total_chars // max(page_count, 1)} 字符")

    if empty_pages:
        print(f"⚠️ 无法提取文字的页码: {empty_pages}")
    else:
        print("✅ 所有页面均可提取文字")

    if table_like_pages:
        print(f"📋 疑似含表格的页码: {table_like_pages}")
        print("   → 第二阶段需重点关注这些页面的表格提取质量")

    return {
        "file": os.path.basename(filepath),
        "pages": page_count,
        "chars": total_chars,
        "empty_pages": empty_pages,
        "table_pages": table_like_pages,
    }


def main():
    if not os.path.exists(DOCS_DIR):
        print(f"❌ 目录不存在: {DOCS_DIR}")
        print("请创建 data/docs/ 文件夹并放入文档")
        return

    pdf_files = [f for f in os.listdir(DOCS_DIR) if f.lower().endswith(".pdf")]
    word_files = [f for f in os.listdir(DOCS_DIR) if f.lower().endswith((".docx", ".doc"))]

    if not pdf_files and not word_files:
        print(f"❌ data/docs/ 中没有找到 PDF 或 Word 文档")
        return

    print(f"📁 找到 {len(pdf_files)} 个 PDF, {len(word_files)} 个 Word 文档\n")

    results = []

    for pdf_file in pdf_files:
        result = check_pdf(os.path.join(DOCS_DIR, pdf_file))
        results.append(result)

    for word_file in word_files:
        print(f"\n📝 {word_file} (Word 文档，将在第一阶段用 python-docx 解析)")

    # 总结
    print(f"\n{'='*60}")
    print("📋 总结")
    print(f"{'='*60}")

    all_chars = sum(r["chars"] for r in results)
    all_empty = [r["file"] for r in results if r["empty_pages"]]
    all_tables = [r["file"] for r in results if r["table_pages"]]

    print(f"文档总数: {len(pdf_files) + len(word_files)}")
    print(f"PDF 总字符数: {all_chars}")
    print(f"PDF 含表格: {len(all_tables)} 份")

    if all_empty:
        print(f"⚠️ 有扫描件/图片型文档: {all_empty}")
        print("   → 第零阶段处理: 手动转文字或用 OCR 工具")
    else:
        print("✅ 所有文档均可直接提取文字，无需 OCR")

    if all_chars < 1000:
        print("⚠️ 总字符数偏少，建议补充更多文档")
    elif all_chars > 5000:
        print("✅ 文字量充足，可以开始第一阶段")

    print(f"\n📝 请将以上输出复制保存到 data/doc_parsing_issues.md")


if __name__ == "__main__":
    main()