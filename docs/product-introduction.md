# 产品介绍

> ckc-token - OpenAI 兼容的 AI API 服务

## 概述

ckc-token 是一个高性能、易集成的 AI API 服务，完全兼容 OpenAI API 格式。无论你是个人开发者还是企业团队，都能快速将 AI 能力集成到你的应用中。

## 🎯 设计理念

### 简单至上

- **零配置迁移** - 已有 OpenAI 代码？只需更改 API 地址即可
- **单一认证** - 仅需 API Key，无需复杂的 OAuth 流程
- **清晰文档** - 每个接口都有详细说明和示例代码

### 开发者友好

- **标准格式** - 遵循 OpenAI API 规范，生态兼容
- **多语言支持** - 提供 Curl、TypeScript、Python 等示例
- **详细错误信息** - 错误返回包含清晰的描述和解决建议

## 🌟 核心功能

### 1. Chat Completions API

最常用的对话接口，支持多轮对话：

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

**适用场景：**
- 多轮对话机器人
- 上下文相关的问答系统
- 需要系统提示词的应用

### 2. Responses API

简化的单次请求接口：

```json
{
  "model": "gpt-5.2",
  "input": "What is the capital of France?"
}
```

**适用场景：**
- 单次问答
- 批量处理任务
- 无需上下文的简单请求

## 💡 使用场景

### 聊天机器人

```python
# 构建智能客服机器人
response = requests.post(
    "https://api.ckc-token.com/v1/chat/completions",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "model": "gpt-5.2",
        "messages": [
            {"role": "system", "content": "你是专业的客服助手"},
            {"role": "user", "content": user_question}
        ]
    }
)
```

### 内容生成

```typescript
// 自动生成产品描述
const response = await fetch(API_URL, {
  method: 'POST',
  headers: { Authorization: `Bearer ${API_KEY}` },
  body: JSON.stringify({
    model: 'gpt-5.2',
    messages: [{
      role: 'user',
      content: `为以下产品写一段吸引人的描述：${productInfo}`
    }]
  })
});
```

### 代码助手

```bash
# 代码审查和优化建议
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "model": "gpt-5.2",
    "messages": [{
      "role": "user",
      "content": "Review this code and suggest improvements:\n```python\n' "$CODE" '\n```"
    }]
  }'
```

## 🔒 安全特性

- **API Key 认证** - 每个请求都需要有效的 API Key
- **请求追踪** - 通过 `X-Title` 头标识应用来源
- **安全传输** - 强制 HTTPS 加密

## 📊 性能特点

| 指标 | 说明 |
|------|------|
| 响应延迟 | 通常 < 2s（取决于模型和输入长度） |
| 并发支持 | 支持多并发请求 |
| Token 计费 | 仅按实际使用计费 |

## 🆚 与 OpenAI API 对比

| 特性 | OpenAI | ckc-token |
|------|--------|-----------|
| API 格式 | OpenAI 格式 | ✅ 完全兼容 |
| Chat Completions | ✅ | ✅ |
| Responses API | ❌ | ✅ 额外支持 |
| 认证方式 | API Key | API Key |
| 迁移成本 | - | ⚡ 几乎为零 |

## 🚀 为什么选择 ckc-token？

1. **快速上手** - 5 分钟完成首次调用
2. **零学习成本** - 熟悉 OpenAI API 即可使用
3. **灵活选择** - 两种 API 满足不同需求
4. **持续更新** - 支持最新模型能力

---

下一步：查看 [快速开始指南](getting-started.md)
