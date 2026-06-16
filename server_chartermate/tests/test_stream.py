"""测试流式接口"""
import requests

url = "http://localhost:8000/api/v1/chat/stream"
data = {"question": "考勤迟到怎么扣钱？"}

print("🔄 流式响应:\n")

with requests.post(url, json=data, stream=True) as resp:
    for line in resp.iter_lines():
        if line:
            line = line.decode("utf-8")
            if line.startswith("data: "):
                content = line[6:]
                if content == "[DONE]":
                    print("\n\n✅ 完成")
                else:
                    print(content, end="", flush=True)