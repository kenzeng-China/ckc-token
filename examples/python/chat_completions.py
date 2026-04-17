#!/usr/bin/env python3
"""
Example: ckc-token Chat Completions API using Python requests

Usage:
    export CKC_TOKEN_API_KEY=your_api_key
    python examples/python/chat_completions.py
"""

import os
import sys
import json
import requests

# API Configuration
CKC_TOKEN_API_URL = "https://api.ckc-token.com/v1/chat/completions"


def main():
    # Check for API key
    api_key = os.environ.get("CKC_TOKEN_API_KEY")
    if not api_key:
        print("Error: CKC_TOKEN_API_KEY environment variable is not set.")
        print("Please set it with: export CKC_TOKEN_API_KEY=your_api_key")
        sys.exit(1)

    # Request payload
    request_body = {
        "model": "gpt-5.2",
        "messages": [
            {
                "role": "user",
                "content": "Hello, what can you do?"
            }
        ]
    }

    print("=== ckc-token Chat Completions Python Example ===")
    print()
    print(f"URL: {CKC_TOKEN_API_URL}")
    print(f"Model: {request_body['model']}")
    print(f"Message: {request_body['messages'][0]['content']}")
    print()

    try:
        # Make the request
        response = requests.post(
            CKC_TOKEN_API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "X-Title": "ckc-token Python Example",
            },
            json=request_body,
            timeout=60
        )

        # Check for errors
        if not response.ok:
            error_data = response.json() if response.content else {}
            error = error_data.get("error", {})
            print(f"Error ({response.status_code}):")
            print(f"  Type: {error.get('type', 'unknown')}")
            print(f"  Message: {error.get('message', response.text)}")
            print(f"  Code: {error.get('code', 'unknown')}")
            sys.exit(1)

        # Parse response
        data = response.json()

        # Display results
        print("Response:")
        print(f"  Status: {response.status_code}")
        print(f"  Model: {data.get('model')}")
        print()
        print("Generated content:")
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        print(f"  {content}")
        print()
        print("Usage stats:")
        usage = data.get("usage", {})
        print(f"  Prompt tokens: {usage.get('prompt_tokens', 0)}")
        print(f"  Completion tokens: {usage.get('completion_tokens', 0)}")
        print(f"  Total tokens: {usage.get('total_tokens', 0)}")

        # Optional: Show raw response
        if os.environ.get("DEBUG"):
            print()
            print("Full response object:")
            print(json.dumps(data, indent=2))

    except requests.exceptions.Timeout:
        print("Error: Request timed out")
        sys.exit(1)
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
