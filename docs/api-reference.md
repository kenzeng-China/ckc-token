# API 参考文档

> ckc-token API 完整参考

## 基础信息

| 项目 | 值 |
|------|-----|
| 基础 URL | `https://api.ckc-token.com` |
| 认证方式 | Bearer Token (API Key) |
| 请求格式 | JSON |
| 响应格式 | JSON |

## 认证

所有请求都需要在 `Authorization` 头中携带 API Key：

```http
Authorization: Bearer YOUR_API_KEY
```

## 通用请求头

| 头名称 | 必需 | 说明 |
|--------|------|------|
| `Authorization` | ✅ | Bearer Token 认证 |
| `Content-Type` | ✅ | 必须为 `application/json` |
| `X-Title` | ❌ | 应用标识，用于追踪和调试 |

---

## Chat Completions API

对话补全接口，支持多轮对话，完全兼容 OpenAI 格式。

### 端点

```
POST /v1/chat/completions
```

### 请求参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `model` | string | ✅ | 模型名称，如 `gpt-5.2` |
| `messages` | array | ✅ | 消息数组 |
| `temperature` | number | ❌ | 采样温度，0-2，默认 1 |
| `max_tokens` | integer | ❌ | 最大生成 token 数 |
| `stream` | boolean | ❌ | 是否流式输出，默认 false |
| `top_p` | number | ❌ | nucleus 采样参数 |
| `stop` | string/array | ❌ | 停止序列 |

### Messages 格式

```json
{
  "role": "system|user|assistant",
  "content": "消息内容"
}
```

| 角色 | 说明 |
|------|------|
| `system` | 系统提示词，设定 AI 行为 |
| `user` | 用户消息 |
| `assistant` | AI 助手的回复（用于多轮对话） |

### 请求示例

**基础请求：**

```bash
curl -X POST "https://api.ckc-token.com/v1/chat/completions" \
  -H "Authorization: Bearer $CKC_TOKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.2",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

**带系统提示词：**

```bash
curl -X POST "https://api.ckc-token.com/v1/chat/completions" \
  -H "Authorization: Bearer $CKC_TOKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.2",
    "messages": [
      {"role": "system", "content": "You are a helpful coding assistant."},
      {"role": "user", "content": "Write a Python function to sort a list."}
    ]
  }'
```

**多轮对话：**

```bash
curl -X POST "https://api.ckc-token.com/v1/chat/completions" \
  -H "Authorization: Bearer $CKC_TOKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.2",
    "messages": [
      {"role": "user", "content": "My name is Alice."},
      {"role": "assistant", "content": "Nice to meet you, Alice!"},
      {"role": "user", "content": "What is my name?"}
    ]
  }'
```

**带参数控制：**

```bash
curl -X POST "https://api.ckc-token.com/v1/chat/completions" \
  -H "Authorization: Bearer $CKC_TOKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.2",
    "messages": [{"role": "user", "content": "Tell me a joke"}],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

### 响应格式

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1699000000,
  "model": "gpt-5.2",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 15,
    "total_tokens": 25
  }
}
```

### 响应字段说明

| 字段 | 说明 |
|------|------|
| `id` | 请求唯一标识 |
| `object` | 对象类型，固定为 `chat.completion` |
| `model` | 使用的模型 |
| `choices[].message.content` | 生成的回复内容 |
| `choices[].finish_reason` | 结束原因：`stop`(正常结束)、`length`(达到 max_tokens) |
| `usage.prompt_tokens` | 输入 token 数 |
| `usage.completion_tokens` | 输出 token 数 |
| `usage.total_tokens` | 总 token 数 |

---

## Responses API

简化的响应接口，适用于单次请求场景。

### 端点

```
POST /v1/responses
```

### 请求参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `model` | string | ✅ | 模型名称，如 `gpt-5.2` |
| `input` | string | ✅ | 输入文本 |

### 请求示例

```bash
curl -X POST "https://api.ckc-token.com/v1/responses" \
  -H "Authorization: Bearer $CKC_TOKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.2",
    "input": "What is the capital of France?"
  }'
```

### 响应格式

```json
{
  "id": "resp-xyz789",
  "model": "gpt-5.2",
  "output": [
    {
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "The capital of France is Paris."
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 12,
    "output_tokens": 8,
    "total_tokens": 20
  }
}
```

### 响应字段说明

| 字段 | 说明 |
|------|------|
| `id` | 请求唯一标识 |
| `model` | 使用的模型 |
| `output[].content[].text` | 生成的文本内容 |
| `usage.input_tokens` | 输入 token 数 |
| `usage.output_tokens` | 输出 token 数 |
| `usage.total_tokens` | 总 token 数 |

---

## 支持的模型

| 模型 ID | 说明 | 上下文长度 |
|---------|------|------------|
| `gpt-5.2` | 最新 GPT-5.2 模型 | 128K |

---

## 速率限制

| 类型 | 限制 |
|------|------|
| 请求频率 | 根据套餐不同 |
| Token 消耗 | 根据套餐不同 |

超出限制时返回 `429 Too Many Requests`，响应头包含：

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699000000
```

---

## 错误处理

详见 [错误码说明](error-codes.md)

---

## 最佳实践

### 1. 设置应用标识

```http
X-Title: MyApp-Production
```

便于追踪和调试问题。

### 2. 合理设置 max_tokens

避免不必要的 token 消耗：

```json
{
  "model": "gpt-5.2",
  "messages": [...],
  "max_tokens": 500
}
```

### 3. 错误重试

对于临时性错误（如 429、503），实现指数退避重试：

```python
import time
import random

def call_with_retry(func, max_retries=3):
    for i in range(max_retries):
        try:
            return func()
        except RateLimitError:
            wait = (2 ** i) + random.random()
            time.sleep(wait)
    raise Exception("Max retries exceeded")
```

### 4. 流式输出

对于长回复，使用 `stream: true` 获得更快的首字响应：

```json
{
  "model": "gpt-5.2",
  "messages": [...],
  "stream": true
}
```
