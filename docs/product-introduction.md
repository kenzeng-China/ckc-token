# Product Introduction

> ckc-token - OpenAI Compatible AI API Service

## Overview

ckc-token is a high-performance, easy-to-integrate AI API service that is fully compatible with the OpenAI API format. Whether you're an individual developer or an enterprise team, you can quickly integrate AI capabilities into your applications.

## 🎯 Design Philosophy

### Simplicity First

- **Zero-Config Migration** - Already using OpenAI? Just change the API URL
- **Single Authentication** - Only an API Key is needed, no complex OAuth flows
- **Clear Documentation** - Every endpoint has detailed explanations and sample code

### Developer Friendly

- **Standard Format** - Follows OpenAI API specification for ecosystem compatibility
- **Multi-Language Support** - Examples in Curl, TypeScript, Python, and more
- **Detailed Error Messages** - Error responses include clear descriptions and solutions

## 🌟 Core Features

### 1. Chat Completions API

The most commonly used conversational interface, supporting multi-turn dialogue:

```json
{
  "model": "gpt-5.2",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"},
    {"role": "assistant", "content": "Hi there!"},
    {"role": "user", "content": "How are you?"}
  ]
}
```

**Use Cases:**
- Multi-turn chatbots
- Context-aware Q&A systems
- Applications requiring system prompts

### 2. Responses API

Simplified single-request interface:

```json
{
  "model": "gpt-5.2",
  "input": "What is the capital of France?"
}
```

**Use Cases:**
- Single Q&A queries
- Batch processing tasks
- Simple requests without context

## 💡 Use Cases

### Chatbot

```python
# Build an intelligent customer service bot
response = requests.post(
    "https://api.ckc-token.com/v1/chat/completions",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "model": "gpt-5.2",
        "messages": [
            {"role": "system", "content": "You are a professional customer service assistant"},
            {"role": "user", "content": user_question}
        ]
    }
)
```

### Content Generation

```typescript
// Auto-generate product descriptions
const response = await fetch(API_URL, {
  method: 'POST',
  headers: { Authorization: `Bearer ${API_KEY}` },
  body: JSON.stringify({
    model: 'gpt-5.2',
    messages: [{
      role: 'user',
      content: `Write an attractive description for this product: ${productInfo}`
    }]
  })
});
```

### Code Assistant

```bash
# Code review and optimization suggestions
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "model": "gpt-5.2",
    "messages": [{
      "role": "user",
      "content": "Review this code and suggest improvements:\n```python\n'"$CODE"'\n```"
    }]
  }'
```

## 🔒 Security Features

- **API Key Authentication** - Every request requires a valid API Key
- **Request Tracking** - Identify your application via `X-Title` header
- **Secure Transport** - Enforced HTTPS encryption

## 📊 Performance

| Metric | Description |
|--------|-------------|
| Response Latency | Typically < 2s (depends on model and input length) |
| Concurrency | Supports multiple concurrent requests |
| Token Billing | Pay only for actual usage |

## 🆚 Comparison with OpenAI API

| Feature | OpenAI | ckc-token |
|---------|--------|-----------|
| API Format | OpenAI format | ✅ Fully compatible |
| Chat Completions | ✅ | ✅ |
| Responses API | ❌ | ✅ Additional support |
| Authentication | API Key | API Key |
| Migration Cost | - | ⚡ Nearly zero |

## 🚀 Why Choose ckc-token?

1. **Quick Start** - Complete your first call in 5 minutes
2. **Zero Learning Curve** - If you know OpenAI API, you're ready
3. **Flexible Choice** - Two APIs for different needs
4. **Continuous Updates** - Support for the latest model capabilities

---

Next: Check out the [Quick Start Guide](getting-started.md)
