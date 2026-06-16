"""快速测试 /chat 接口"""
import requests

url = "http://localhost:8000/api/v1/chat"
data = {"question": "年假有几天？"}

resp = requests.post(url, json=data)
print(f"状态码: {resp.status_code}")

if resp.status_code == 200:
    result = resp.json()
    print(f"置信度: {result.get('confidence')}")
    print(f"回答: {result.get('answer', '')[:200]}...")
    print(f"Trace ID: {result.get('trace_id')}")
else:
    print(f"错误响应: {resp.text}")