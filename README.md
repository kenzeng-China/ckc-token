# ckc-token

> OpenAI-Compatible AI API Service - Simple, Fast, Powerful

ckc-token is an AI service compatible with OpenAI API format, allowing you to easily call various large language models without complex configuration.

## ✨ Features

- 🔄 **OpenAI Compatible** - Seamless replacement for existing OpenAI calls, just change the API URL
- 🚀 **Fast Response** - Optimized architecture for low latency and high throughput
- 🔐 **Simple Auth** - Start with just an API Key
- 📦 **Multi-Model Support** - Supports GPT-5.2 and more
- 💬 **Dual API Support** - Chat Completions API + Responses API

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Product Introduction](docs/product-introduction.md) | Core features and use cases |
| [Quick Start](docs/getting-started.md) | 5-minute getting started guide |

## 📁 API Reference

See the [`api/`](api/) directory for detailed API documentation.

## 🚀 Quick Start

### 1. Set API Key

```bash
export CKC_TOKEN_API_KEY=your_api_key_here
```

### 2. Make a Request

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

## 📂 Project Structure

```
ckc-token/
├── README.md                    # Project overview
├── LICENSE                      # MIT License
├── docs/                        # Documentation
│   ├── product-introduction.md  # Product introduction & use cases
│   └── getting-started.md       # Quick start guide
├── api/                         # API reference documentation
└── examples/                    # Sample code
    ├── curl/                    # Shell script examples
    ├── typescript/              # TypeScript examples
    └── python/                  # Python examples
```

## 📖 Examples

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

## 🔧 Supported Models

| Model | Description |
|-------|-------------|
| `gpt-5.2` | Latest GPT-5.2 model with powerful reasoning |

## 📝 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/v1/chat/completions` | Chat Completions API (OpenAI compatible) |
| `/v1/responses` | Responses API (simplified interface) |

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Issues and Pull Requests are welcome!

---

**ckc-token power** © 2024 - Present by kenzeng-China
