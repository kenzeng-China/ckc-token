# Quick Start

> Get started with ckc-token API in 5 minutes

## Prerequisites

- A valid `CKC_TOKEN_API_KEY`
- Basic knowledge of HTTP requests
- (Optional) `curl` or `jq` installed

## Step 1: Get Your API Key

If you don't have an API Key yet, please contact the administrator to obtain one.

## Step 2: Set Environment Variable

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

## Step 3: Make Your First Request

### Using Chat Completions API

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

### Using Responses API

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

## Step 4: Parse the Response

### Chat Completions Response Format

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

### Responses API Response Format

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

## Using Example Code

### Curl Examples

```bash
# Clone the repository
git clone https://github.com/kenzeng-China/ckc-token.git
cd ckc-token

# Run examples
export CKC_TOKEN_API_KEY=your_api_key
bash examples/curl/chat-completions.sh
bash examples/curl/responses.sh
```

### TypeScript Examples

```bash
cd examples/typescript/fetch
npm install
CKC_TOKEN_API_KEY=your_api_key npx tsx src/basic/example.ts
```

### Python Examples

```bash
pip install requests
CKC_TOKEN_API_KEY=your_api_key python examples/python/chat_completions.py
```

## Common Issues

### Q: Request returns 401 Unauthorized

**A:** Check if the API Key is correctly set:

```bash
echo $CKC_TOKEN_API_KEY  # Should display your API Key
```

### Q: Request returns 400 Bad Request

**A:** Check if the request body format is correct:
- Ensure `Content-Type: application/json` header is set
- Validate JSON format (use `jq` to verify)
- Ensure required fields `model` and `messages`/`input` are provided

### Q: How to see detailed error information?

**A:** The error response body contains detailed information:

```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "Missing required field: model",
    "code": "missing_field"
  }
}
```

## Next Steps

- 📖 Read the [API Reference](../api/) documentation
- 📚 Check out [Product Introduction](product-introduction.md)

---

**Ready?** Start building your AI application! 🚀
