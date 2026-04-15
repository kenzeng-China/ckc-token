#!/usr/bin/env bash
#
# Example: ckc-token Chat Completions API using curl
#
# Usage:
#   export CKC_TOKEN_API_KEY=your-api-key
#   bash examples/curl/chat-completions.sh

set -euo pipefail

CKC_TOKEN_API_URL="https://t.ckcloudai.com/v1/chat/completions"

if [ -z "${CKC_TOKEN_API_KEY:-}" ]; then
  echo "Error: CKC_TOKEN_API_KEY environment variable is not set."
  echo "Please set it with: export CKC_TOKEN_API_KEY=your-api-key"
  exit 1
fi

echo "=== ckc-token Chat Completions curl Example ==="
echo ""
echo "URL: ${CKC_TOKEN_API_URL}"
echo ""

curl -sS "${CKC_TOKEN_API_URL}" \
  -H "Authorization: Bearer ${CKC_TOKEN_API_KEY}" \
  -H "Content-Type: application/json" \
  -H "X-Title: ckc-token curl Example" \
  -d '{
    "model": "gpt-5.2",
    "messages": [
      {
        "role": "user",
        "content": "Hello, what can you do?"
      }
    ]
  }' | jq .

echo ""
echo "Tip: Remove '| jq .' to see raw JSON output."