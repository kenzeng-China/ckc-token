# 错误码说明

> ckc-token API 错误码和处理指南

## 错误响应格式

所有错误响应都遵循统一格式：

```json
{
  "error": {
    "type": "error_type",
    "message": "Human-readable error message",
    "code": "error_code"
  }
}
```

## HTTP 状态码

| 状态码 | 类别 | 说明 |
|--------|------|------|
| 200 | 成功 | 请求成功 |
| 400 | 客户端错误 | 请求格式错误或参数无效 |
| 401 | 认证错误 | API Key 无效或缺失 |
| 403 | 权限错误 | 无权访问该资源 |
| 404 | 未找到 | 请求的资源不存在 |
| 429 | 限流 | 请求频率超限 |
| 500 | 服务器错误 | 服务器内部错误 |
| 502 | 网关错误 | 上游服务不可用 |
| 503 | 服务不可用 | 服务暂时不可用 |

---

## 详细错误码

### 认证错误 (401)

#### `invalid_api_key`

API Key 格式无效或不存在。

```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "Invalid API key provided",
    "code": "invalid_api_key"
  }
}
```

**解决方案：**
- 检查 API Key 是否正确复制
- 确认 API Key 未被撤销
- 确保 `Authorization: Bearer xxx` 格式正确

#### `missing_api_key`

未提供 API Key。

```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "Missing Authorization header",
    "code": "missing_api_key"
  }
}
```

**解决方案：**
- 添加 `Authorization` 头
- 格式：`Authorization: Bearer YOUR_API_KEY`

---

### 请求错误 (400)

#### `invalid_request_error`

请求格式错误。

```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "Invalid JSON in request body",
    "code": "invalid_request_error"
  }
}
```

**解决方案：**
- 检查 JSON 格式是否正确
- 确保设置了 `Content-Type: application/json`

#### `missing_field`

缺少必填字段。

```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "Missing required field: model",
    "code": "missing_field"
  }
}
```

**解决方案：**
- Chat Completions: 必须提供 `model` 和 `messages`
- Responses API: 必须提供 `model` 和 `input`

#### `invalid_model`

模型名称无效。

```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "Model 'gpt-999' does not exist",
    "code": "invalid_model"
  }
}
```

**解决方案：**
- 使用有效的模型名称，如 `gpt-5.2`
- 参考 [API 文档](api-reference.md) 查看支持的模型

#### `invalid_message_format`

消息格式错误。

```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "Message must have 'role' and 'content' fields",
    "code": "invalid_message_format"
  }
}
```

**解决方案：**
- 确保每个消息包含 `role` 和 `content`
- `role` 必须是 `system`、`user` 或 `assistant`

#### `invalid_temperature`

温度参数超出范围。

```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "temperature must be between 0 and 2",
    "code": "invalid_temperature"
  }
}
```

**解决方案：**
- 设置 `temperature` 在 0 到 2 之间

---

### 权限错误 (403)

#### `insufficient_quota`

账户额度不足。

```json
{
  "error": {
    "type": "permission_error",
    "message": "Insufficient quota for this request",
    "code": "insufficient_quota"
  }
}
```

**解决方案：**
- 检查账户余额
- 联系管理员充值或升级套餐

#### `model_access_denied`

无权使用该模型。

```json
{
  "error": {
    "type": "permission_error",
    "message": "You do not have access to model 'gpt-5.2'",
    "code": "model_access_denied"
  }
}
```

**解决方案：**
- 检查套餐是否支持该模型
- 联系管理员升级权限

---

### 限流错误 (429)

#### `rate_limit_exceeded`

请求频率超限。

```json
{
  "error": {
    "type": "rate_limit_error",
    "message": "Rate limit exceeded. Please retry after 60 seconds.",
    "code": "rate_limit_exceeded"
  }
}
```

**响应头：**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699000060
```

**解决方案：**
- 等待 `X-RateLimit-Reset` 时间后重试
- 实现请求队列或限流控制
- 考虑升级套餐获取更高限额

#### `token_limit_exceeded`

Token 消耗超限。

```json
{
  "error": {
    "type": "rate_limit_error",
    "message": "Token limit exceeded. Current usage: 100000, Limit: 50000",
    "code": "token_limit_exceeded"
  }
}
```

**解决方案：**
- 减少 `max_tokens` 设置
- 缩短输入文本
- 等待配额重置或升级套餐

---

### 服务器错误 (5xx)

#### `server_error`

服务器内部错误。

```json
{
  "error": {
    "type": "server_error",
    "message": "An internal error occurred. Please try again.",
    "code": "server_error"
  }
}
```

**解决方案：**
- 稍后重试
- 如果持续出现，联系技术支持

#### `model_overloaded`

模型过载。

```json
{
  "error": {
    "type": "server_error",
    "message": "Model is currently overloaded. Please retry.",
    "code": "model_overloaded"
  }
}
```

**解决方案：**
- 等待几秒后重试
- 使用指数退避策略

---

## 错误处理最佳实践

### 1. 检查响应状态码

```python
import requests

response = requests.post(url, headers=headers, json=data)

if response.status_code == 200:
    # 成功
    return response.json()
elif response.status_code == 401:
    # 认证错误
    raise AuthenticationError("Invalid API key")
elif response.status_code == 429:
    # 限流
    retry_after = response.headers.get('X-RateLimit-Reset')
    raise RateLimitError(f"Retry after {retry_after}s")
else:
    # 其他错误
    error = response.json().get('error', {})
    raise APIError(error.get('message', 'Unknown error'))
```

### 2. 实现重试机制

```python
import time
import random

def call_with_retry(func, max_retries=3, base_delay=1):
    for attempt in range(max_retries):
        try:
            return func()
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            # 指数退避 + 随机抖动
            delay = base_delay * (2 ** attempt) + random.random()
            time.sleep(delay)
        except ServerError as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(base_delay * (attempt + 1))
```

### 3. 记录错误详情

```python
import logging

def handle_error(response):
    try:
        error_data = response.json()
        error = error_data.get('error', {})
        logging.error(
            f"API Error: code={error.get('code')}, "
            f"type={error.get('type')}, "
            f"message={error.get('message')}"
        )
    except:
        logging.error(f"HTTP Error: {response.status_code}")
```

### 4. 用户友好的错误提示

```python
ERROR_MESSAGES = {
    'invalid_api_key': 'API Key 无效，请检查配置',
    'insufficient_quota': '账户额度不足，请联系管理员',
    'rate_limit_exceeded': '请求过于频繁，请稍后重试',
    'model_overloaded': '服务繁忙，请稍后重试',
}

def get_user_message(error_code):
    return ERROR_MESSAGES.get(error_code, '发生未知错误，请稍后重试')
```

---

## 常见问题排查

| 问题 | 可能原因 | 排查步骤 |
|------|----------|----------|
| 401 错误 | API Key 错误 | 检查 Key 是否正确、是否过期 |
| 400 错误 | 请求格式错误 | 验证 JSON 格式、检查必填字段 |
| 429 错误 | 请求过快 | 添加请求间隔、实现队列 |
| 500 错误 | 服务器问题 | 重试、联系技术支持 |
| 空响应 | max_tokens 太小 | 增加 max_tokens 值 |

---

## 技术支持

遇到无法解决的问题？

1. 检查本文档和 [API 参考](api-reference.md)
2. 查看请求和响应的完整日志
3. 联系技术支持，提供：
   - 错误码和错误信息
   - 请求时间
   - 请求 ID（响应中的 `id` 字段）
