from dotenv import load_dotenv
import os
from openai import OpenAI, APIStatusError

load_dotenv()

# 测试阿里百炼 Embedding
print('🔍 测试阿里百炼 Embedding...')
client = OpenAI(
    api_key=os.getenv('dashscope_api_key'),
    base_url=os.getenv('dashscope_base_url'),
)
try:
    resp = client.embeddings.create(model='text-embedding-v2', input='你好')
    print(f'  ✅ 向量维度: {len(resp.data[0].embedding)}')
except APIStatusError as e:
    print(f'  ❌ 错误: {e.message}')
    if e.status_code == 402:
        print('  💡 提示: 阿里百炼账户余额不足，请充值后重试')

# 测试 DeepSeek Chat
print('🔍 测试 DeepSeek Chat...')
client2 = OpenAI(
    api_key=os.getenv('deepseek_api_key'),
    base_url=os.getenv('deepseek_base_url'),
)
try:
    resp2 = client2.chat.completions.create(
        model='deepseek-chat',
        messages=[{'role': 'user', 'content': '回复OK'}],
        max_tokens=10,
    )
    print(f'  ✅ 回复: {resp2.choices[0].message.content}')
except APIStatusError as e:
    print(f'  ❌ 错误: {e.message}')
    if e.status_code == 402:
        print('  💡 提示: DeepSeek账户余额不足，请充值后重试')

print('\n测试完成')