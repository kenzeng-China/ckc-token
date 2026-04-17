# ckc-token

> OpenAI-Compatible AI API Service - Simple, Fast, Powerful

ckc-token 是一个兼容 OpenAI API 格式的 AI 服务，让你可以轻松调用各种大语言模型，无需复杂的配置。

## ✨ 特性

- 🔄 **OpenAI 兼容** - 无缝替换现有 OpenAI 调用，只需更改 API 地址
- 🚀 **快速响应** - 优化的服务架构，低延迟高吞吐
- 🔐 **简单认证** - 仅需 API Key 即可开始使用
- 📦 **多模型支持** - 支持 GPT-5.2 等多种模型
- 💬 **双 API 支持** - Chat Completions API + Responses API

## 📚 文档

| 文档 | 说明 |
|------|------|
| [产品介绍](docs/product-introduction.md) | 了解 ckc-token 的核心功能和使用场景 |
| [快速开始](docs/getting-started.md) | 5 分钟快速上手指南 |
| [API 参考](docs/api-reference.md) | 完整的 API 文档和参数说明 |
| [错误码说明](docs/error-codes.md) | 返回码和错误处理指南 |

## 🚀 快速开始

### 1. 设置 API Key

```bash
export CKC_TOKEN_API_KEY=your_api_key_here
```

### 2. 发起请求

**Chat Completions API:**

```bash
curl -X POST "https://api.ckc-token.com/v1/chat/completions" \
  -H "Authorization: Bearer $CKC_TOKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.2",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

**Responses API:**

```bash
curl -X POST "https://api.ckc-token.com/v1/responses" \
  -H "Authorization: Bearer $CKC_TOKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.2",
    "input": "Hello!"
  }'
```

## 📁 项目结构

```
ckc-token/
├── README.md                    # 项目说明（本文件）
├── LICENSE                      # MIT License
├── docs/                        # 文档目录
│   ├── product-introduction.md  # 产品介绍
│   ├── getting-started.md       # 快速开始
│   ├── api-reference.md         # API 详细文档
│   └── error-codes.md           # 错误码说明
└── examples/                    # 示例代码
    ├── curl/                    # Shell 脚本示例
    ├── typescript/              # TypeScript 示例
    └── python/                  # Python 示例
```

## 📖 示例代码

### Curl

```bash
export CKC_TOKEN_API_KEY=your_api_key
bash examples/curl/chat-completions.sh
bash examples/curl/responses.sh
```

### TypeScript

```bash
cd examples/typescript/fetch
npm install
CKC_TOKEN_API_KEY=your_api_key npx tsx src/basic/example.ts
```

### Python

```bash
pip install requests
CKC_TOKEN_API_KEY=your_api_key python examples/python/chat_completions.py
```

## 🔧 支持的模型

| 模型 | 说明 |
|------|------|
| `gpt-5.2` | 最新 GPT-5.2 模型，强大的推理能力 |

## 📝 API 端点

| 端点 | 说明 |
|------|------|
| `/v1/chat/completions` | Chat Completions API（OpenAI 兼容） |
| `/v1/responses` | Responses API（简化接口） |

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**ckc-token power** © 2024 - Present by kenzeng-China
