# 快速开始

> 5 分钟上手 ckc-token API

## 前置要求

- 一个有效的 `CKC_TOKEN_API_KEY`
- 基本的 HTTP 请求知识
- （可选）已安装 `curl` 或 `jq`

## 第一步：获取 API Key

如果你还没有 API Key，请联系管理员获取。

## 第二步：设置环境变量

**Linux / macOS:**

```bash
export CKC_TOKEN_API_KEY=your_api_key_here
```

**Windows (PowerShell):**

```powershell
$env:CKC_TOKEN_API_KEY="your_api_key_here"
```

**Windows (CMD):**

```cmd
set CKC_TOKEN_API_KEY=your_api_key_here
```

## 第三步：发起第一次请求

### 使用 Chat Completions API

```bash
curl -X POST "https://api.ckc-token.com/v1/chat/completions" \
  -H "Authorization: Bearer $CKC_TOKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Title: My-First-App" \
  -d '{
    "model": "gpt-5.2",
    "messages": [
      {
        "role": "user",
        "content": "Hello, what can you do?"
      }
    ]
  }'
```

### 使用 Responses API

```bash
curl -X POST "https://api.ckc-token.com/v1/responses" \
  -H "Authorization: Bearer $CKC_TOKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Title: My-First-App" \
  -d '{
    "model": "gpt-5.2",
    "input": "Hello, what can you do?"
  }'
```

## 第四步：解析响应

### Chat Completions 响应格式

```json
{
  "id": "resp_abc123",
  "object": "chat.completion",
  "model": "gpt-5.2",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! I'm an AI assistant..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 42,
    "total_tokens": 57
  }
}
```

### Responses API 响应格式

```json
{
  "id": "resp_xyz789",
  "model": "gpt-5.2",
  "output": [
    {
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "Hello! I'm an AI assistant..."
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 15,
    "output_tokens": 42,
    "total_tokens": 57
  }
}
```

## 使用示例代码

### Curl 示例

```bash
# 克隆仓库
git clone https://github.com/kenzeng-China/ckc-token.git
cd ckc-token

# 运行示例
export CKC_TOKEN_API_KEY=your_api_key
bash examples/curl/chat-completions.sh
```

### TypeScript 示例

```bash
cd examples/typescript/fetch
npm install
CKC_TOKEN_API_KEY=your_api_key npx tsx src/basic/example.ts
```

### Python 示例

```bash
pip install requests
CKC_TOKEN_API_KEY=your_api_key python examples/python/chat_completions.py
```

## 常见问题

### Q: 请求返回 401 Unauthorized

**A:** 检查 API Key 是否正确设置：

```bash
echo $CKC_TOKEN_API_KEY  # 应该显示你的 API Key
```

### Q: 请求返回 400 Bad Request

**A:** 检查请求体格式是否正确，确保：
- `Content-Type: application/json` 头已设置
- JSON 格式正确（可用 `jq` 验证）
- 必填字段 `model` 和 `messages`/`input` 已提供

### Q: 如何查看详细错误信息？

**A:** 错误响应体包含详细信息：

```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "Missing required field: model",
    "code": "missing_field"
  }
}
```

## 下一步

- 📖 阅读 [API 参考文档](api-reference.md)
- 🔍 了解 [错误码说明](error-codes.md)
- 📚 查看 [产品介绍](product-introduction.md)

---

**准备好了吗？** 开始构建你的 AI 应用吧！ 🚀
