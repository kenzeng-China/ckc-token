# CKCloud API 文档

本文档描述了 CKCloud 的用户认证与 API Key 管理接口。这些接口采用 **SIWE (Sign-In with Ethereum)** 进行身份验证，允许用户通过以太坊钱包登录并管理自己的 API Key。

---

## 目录

1. [概述](#概述)
2. [SIWE 登录原理](#siwe-登录原理)
3. [API 接口](#api-接口)
   - [3.1 获取登录消息](#31-获取登录消息)
   - [3.2 验证签名并登录](#32-验证签名并登录)
   - [3.3 创建 API Key](#33-创建-api-key)
   - [3.4 获取 API Key 列表](#34-获取-api-key-列表)
   - [3.5 删除 API Key](#35-删除-api-key)
4. [完整示例代码](#完整示例代码)
5. [常见问题](#常见问题)

---

## 概述

### 什么是 SIWE？

**SIWE (Sign-In with Ethereum)** 是一种去中心化的身份验证标准，允许用户使用以太坊钱包（如 MetaMask）登录网站，而无需传统的用户名和密码。

### 核心流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SIWE 登录流程                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  前端                          后端                       钱包        │
│   │                             │                          │        │
│   │  1. 连接钱包                 │                          │         │
│   │ ──────────────────────────────────────────────────────>         │
│   │ <──────────────────────────────────────────────────────         │
│   │   返回钱包地址                │                          │        │
│   │                             │                          │        │
│   │  2. 请求登录消息              │                          │        │
│   │ ─────────────────────────>  │                          │        │
│   │ <─────────────────────────  │                          │        │
│   │   返回 SIWE 消息              │                          │        │
│   │                             │                          │        │
│   │  3. 请求钱包签名              │                          │        │
│   │ ──────────────────────────────────────────────────────>         │
│   │ <──────────────────────────────────────────────────────         │
│   │   返回签名                   │                          │        │
│   │                             │                          │        │
│   │  4. 提交验证                 │                          │        │
│   │ ─────────────────────────>  │                          │        │
│   │ <─────────────────────────  │                          │        │
│   │   设置 Cookie，登录成功       │                          │        │
│   │                             │                          │        │
└─────────────────────────────────────────────────────────────────────┘
```

### 认证方式说明

| 端点类型 | 认证方式 | 说明 |
|---------|---------|------|
| 登录相关 | 无需认证 | 用于获取消息和验证签名 |
| API Key 管理 | Cookie JWT | 登录成功后通过 Cookie 自动携带 |
| API 调用 | API Key | 在请求头中携带 `Authorization: Bearer sk-xxx` |

---

## SIWE 登录原理

### 为什么需要两步验证？

SIWE 的安全性建立在以下原则：

1. **服务器生成消息**：防止重放攻击，消息中包含随机 nonce 和时间戳
2. **用户私钥签名**：证明用户确实拥有该钱包地址
3. **服务器验证签名**：验证签名与地址匹配，完成身份确认

### SIWE 消息格式

SIWE 消息遵循 [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) 标准，格式如下：

```
t.ckcloudai.com wants you to sign in with your Ethereum account:
0x774b3f6C5a6F8e2D9A1B3C4d5E6f7A8b9C0D1e2F

URI: https://t.ckcloudai.com
Version: 1
Chain ID: 1
Nonce: a1b2c3d4e5f6
Issued At: 2024-01-15T10:30:00Z
Expiration Time: 2024-01-15T10:45:00Z
```

**字段说明**：

| 字段 | 说明 |
|-----|------|
| `domain` | 请求签名的域名，防止钓鱼攻击 |
| `address` | 用户钱包地址 |
| `nonce` | 随机字符串，防止重放攻击 |
| `issued-at` | 消息生成时间 |
| `expiration-time` | 消息过期时间 |

---

## API 接口

### 基础信息

- **Base URL**: `https://t.ckcloudai.com`
- **Content-Type**: `application/json`

---

### 3.1 获取登录消息

获取用于 SIWE 登录的消息文本，该消息需要用户使用钱包签名。

#### 请求信息

| 项目 | 值 |
|-----|-----|
| **URL** | `/v1/login/siwe/message` |
| **Method** | `POST` |
| **认证** | 无需认证 |

#### 请求参数

```json
{
    "Pubkey": "0x774b3f6C5a6F8e2D9A1B3C4d5E6f7A8b9C0D1e2F"
}
```

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `Pubkey` | string | 是 | 用户钱包地址，需以 `0x` 开头 |

#### 响应参数

**成功响应 (HTTP 200)**:

```json
{
    "Message": "t.ckcloudai.com wants you to sign in with your Ethereum account:\n0x774b3f6C5a6F8e2D9A1B3C4d5E6f7A8b9C0D1e2F\n\nURI: https://t.ckcloudai.com\nVersion: 1\nChain ID: 1\nNonce: a1b2c3d4e5f6\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T10:45:00Z"
}
```

| 参数名 | 类型 | 说明 |
|-------|------|------|
| `Message` | string | SIWE 格式的登录消息，用于钱包签名 |

**错误响应**:

| HTTP 状态码 | 响应体 | 说明 |
|------------|--------|------|
| 400 | `{"error": "invalid request"}` | 请求参数无效 |
| 500 | `{"error": "failed to generate message"}` | 服务器内部错误 |

#### JavaScript 调用示例

```javascript
async function getLoginMessage(address) {
    const response = await fetch('https://t.ckcloudai.com/v1/login/siwe/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Pubkey: address
        })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Failed to get message');
    }
    
    return data.Message;
}
```

---

### 3.2 验证签名并登录

提交签名后的消息，验证成功后将设置登录 Cookie。

#### 请求信息

| 项目 | 值 |
|-----|-----|
| **URL** | `/v1/login/siwe/verify` |
| **Method** | `POST` |
| **认证** | 无需认证 |

#### 请求参数

```json
{
    "Message": "t.ckcloudai.com wants you to sign in with your Ethereum account:\n0x...",
    "Signature": "0x7d299b8c4a1f3e5d7c9b2a4f6e8d1c3b5a7f9e2d4c6b8a0f2e4d6c8b0a2f4e6d..."
}
```

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `Message` | string | 是 | 从 `/message` 接口获取的原始消息 |
| `Signature` | string | 是 | 钱包签名结果，十六进制格式 |

#### 响应参数

**成功响应 (HTTP 200)**:

```json
{
    "Pubkey": "0x774b3f6C5a6F8e2D9A1B3C4d5E6f7A8b9C0D1e2F"
}
```

| 参数名 | 类型 | 说明 |
|-------|------|------|
| `Pubkey` | string | 验证通过的钱包地址 |

**重要**: 响应会设置 `Set-Cookie` 头，后续请求需携带此 Cookie：

```
Set-Cookie: ckcloud=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; Secure
```

**错误响应**:

| HTTP 状态码 | 响应体 | 说明 |
|------------|--------|------|
| 400 | `{"error": "invalid request"}` | 请求参数无效 |
| 401 | `{"error": "invalid signature"}` | 签名验证失败 |
| 500 | `{"error": "failed to create user"}` | 创建用户失败 |

#### JavaScript 调用示例

```javascript
async function verifyAndLogin(message, signature) {
    const response = await fetch('https://t.ckcloudai.com/v1/login/siwe/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',  // 重要：允许携带和接收 Cookie
        body: JSON.stringify({
            Message: message,
            Signature: signature
        })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
    }
    
    return data.Pubkey;
}
```

---

### 3.3 创建 API Key

创建新的 API Key，用于后续 API 调用认证。

#### 请求信息

| 项目 | 值 |
|-----|-----|
| **URL** | `/v1/api-key/create` |
| **Method** | `POST` |
| **认证** | Cookie JWT（需先完成 SIWE 登录） |

#### 请求参数

```json
{
    "Name": "my-api-key"
}
```

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `Name` | string | 是 | API Key 的名称，用于标识用途 |

#### 响应参数

**成功响应 (HTTP 200)**:

```json
{
    "ApiKey": "sk-B5M9GCYZmw4ytzShXCNvppyrpQ5E7G1EdRdzZ4gG6Qhu"
}
```

| 参数名 | 类型 | 说明 |
|-------|------|------|
| `ApiKey` | string | 生成的 API Key，以 `sk-` 开头，**请妥善保存** |

> ⚠️ **重要提示**: API Key 仅在创建时返回完整值，后续查询列表时会进行脱敏处理。请创建后立即保存。

**错误响应**:

| HTTP 状态码 | 响应体 | 说明 |
|------------|--------|------|
| 400 | `{"error": "invalid request"}` | 请求参数无效 |
| 401 | `{"error": "unauthorized"}` | 未登录或 Cookie 已过期 |
| 500 | `{"error": "failed to generate API key"}` | 生成失败 |
| 500 | `{"error": "failed to save API key"}` | 保存失败 |

#### JavaScript 调用示例

```javascript
async function createApiKey(name) {
    const response = await fetch('https://t.ckcloudai.com/v1/api-key/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',  // 携带登录 Cookie
        body: JSON.stringify({
            Name: name
        })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Failed to create API key');
    }
    
    // ⚠️ 请保存 API Key，后续无法再次查看完整值
    console.log('Your API Key:', data.ApiKey);
    return data.ApiKey;
}
```

---

### 3.4 获取 API Key 列表

分页获取当前用户的所有 API Key 列表。

#### 请求信息

| 项目 | 值 |
|-----|-----|
| **URL** | `/v1/api-key/list` |
| **Method** | `GET` |
| **认证** | Cookie JWT（需先完成 SIWE 登录） |

#### 查询参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|--------|------|
| `Page` | integer | 否 | 1 | 页码，从 1 开始 |
| `Limit` | integer | 否 | 20 | 每页数量 |

#### 请求示例

```
GET /v1/api-key/list?Page=1&Limit=20
```

#### 响应参数

**成功响应 (HTTP 200)**:

```json
{
    "Keys": [
        {
            "Id": 1165098538693787650,
            "Name": "production",
            "ApiKey": "sk-9de...fa6",
            "CreatedAt": 1775659056
        },
        {
            "Id": 1165098867007389698,
            "Name": "development",
            "ApiKey": "sk-B5M...Qhu",
            "CreatedAt": 1775659156
        }
    ],
    "Total": 2,
    "Limit": 20,
    "CurrentPage": 1,
    "TotalPages": 1
}
```

| 参数名 | 类型 | 说明 |
|-------|------|------|
| `Keys` | array | API Key 列表 |
| `Keys[].Id` | integer | API Key 的唯一标识符，用于删除操作 |
| `Keys[].Name` | string | API Key 名称 |
| `Keys[].ApiKey` | string | **脱敏后的** API Key（仅显示前 8 位和后 3 位） |
| `Keys[].CreatedAt` | integer | 创建时间（Unix 时间戳，秒） |
| `Total` | integer | 总记录数 |
| `Limit` | integer | 当前页大小 |
| `CurrentPage` | integer | 当前页码 |
| `TotalPages` | integer | 总页数 |

**错误响应**:

| HTTP 状态码 | 响应体 | 说明 |
|------------|--------|------|
| 401 | `{"error": "unauthorized"}` | 未登录或 Cookie 已过期 |
| 500 | `{"error": "failed to list API keys"}` | 查询失败 |

#### JavaScript 调用示例

```javascript
async function listApiKeys(page = 1, limit = 20) {
    const response = await fetch(
        `https://t.ckcloudai.com/v1/api-key/list?Page=${page}&Limit=${limit}`,
        {
            method: 'GET',
            credentials: 'include'  // 携带登录 Cookie
        }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Failed to list API keys');
    }
    
    return data;
}

// 使用示例
const result = await listApiKeys(1, 10);
console.log(`共 ${result.Total} 个 API Key`);
result.Keys.forEach(key => {
    console.log(`- [${key.Name}] ${key.ApiKey}`);
});
```

---

### 3.5 删除 API Key

删除指定的 API Key。

#### 请求信息

| 项目 | 值 |
|-----|-----|
| **URL** | `/v1/api-key/delete` |
| **Method** | `POST` |
| **认证** | Cookie JWT（需先完成 SIWE 登录） |

#### 请求参数

```json
{
    "Id": 1165098538693787650
}
```

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `Id` | integer | 是 | 要删除的 API Key ID（从列表接口获取） |

#### 响应参数

**成功响应 (HTTP 200)**:

```json
{
    "Id": 1165098538693787650
}
```

| 参数名 | 类型 | 说明 |
|-------|------|------|
| `Id` | integer | 已删除的 API Key ID |

**错误响应**:

| HTTP 状态码 | 响应体 | 说明 |
|------------|--------|------|
| 400 | `{"error": "invalid request"}` | 请求参数无效 |
| 401 | `{"error": "unauthorized"}` | 未登录或 Cookie 已过期 |
| 500 | `{"error": "failed to delete API key"}` | 删除失败（可能无权删除） |

#### JavaScript 调用示例

```javascript
async function deleteApiKey(id) {
    const response = await fetch('https://t.ckcloudai.com/v1/api-key/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            Id: id
        })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Failed to delete API key');
    }
    
    return data.Id;
}
```

---

## 完整示例代码

### 方式一：使用 MetaMask（推荐）

以下是一个完整的登录并创建 API Key 的示例：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CKCloud 登录示例</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 { color: #333; margin-bottom: 24px; }
        .step {
            margin: 16px 0;
            padding: 16px;
            background: #f9f9f9;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        }
        .step h3 { margin: 0 0 8px 0; color: #007bff; }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 8px;
            margin-top: 8px;
        }
        button:hover { background: #0056b3; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        button.success { background: #28a745; }
        .status {
            margin-top: 16px;
            padding: 12px;
            border-radius: 6px;
            background: #e7f3ff;
        }
        .status.error { background: #ffe7e7; color: #c00; }
        .status.success { background: #e7ffe7; color: #060; }
        .log {
            margin-top: 16px;
            padding: 12px;
            background: #1e1e1e;
            color: #0f0;
            border-radius: 6px;
            font-family: monospace;
            font-size: 12px;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
        }
        input {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 CKCloud 钱包登录示例</h1>
        
        <div class="step">
            <h3>步骤 1: 连接钱包</h3>
            <p>点击按钮连接您的 MetaMask 钱包</p>
            <button onclick="connectWallet()">连接 MetaMask</button>
        </div>
        
        <div class="step">
            <h3>步骤 2: 获取登录消息</h3>
            <p>从服务器获取需要签名的消息</p>
            <button onclick="getMessage()" id="btnMsg" disabled>获取消息</button>
        </div>
        
        <div class="step">
            <h3>步骤 3: 签名消息</h3>
            <p>使用钱包对消息进行签名（MetaMask 会弹出确认窗口）</p>
            <button onclick="signMessage()" id="btnSign" disabled>签名消息</button>
        </div>
        
        <div class="step">
            <h3>步骤 4: 验证并登录</h3>
            <p>提交签名完成登录验证</p>
            <button onclick="verify()" id="btnVerify" disabled>验证登录</button>
        </div>
        
        <div class="step">
            <h3>步骤 5: 创建 API Key</h3>
            <input type="text" id="keyName" placeholder="输入 API Key 名称" value="my-key">
            <button onclick="createKey()" id="btnCreate" disabled>创建 API Key</button>
        </div>
        
        <div id="status" class="status">请先连接钱包开始</div>
        <div id="log" class="log"></div>
    </div>

    <script>
        // 配置
        const BASE_URL = 'https://t.ckcloudai.com';
        
        // 状态变量
        let walletAddress = null;
        let siweMessage = null;
        let signature = null;
        
        // 工具函数
        function log(msg) {
            const logEl = document.getElementById('log');
            const time = new Date().toLocaleTimeString();
            logEl.textContent += `[${time}] ${msg}\n`;
            logEl.scrollTop = logEl.scrollHeight;
        }
        
        function setStatus(msg, type = '') {
            const statusEl = document.getElementById('status');
            statusEl.textContent = msg;
            statusEl.className = 'status ' + type;
        }
        
        function enableButton(id, enable = true) {
            document.getElementById(id).disabled = !enable;
        }
        
        // 步骤 1: 连接钱包
        async function connectWallet() {
            if (!window.ethereum) {
                setStatus('❌ 未检测到 MetaMask！请先安装 MetaMask 扩展。', 'error');
                return;
            }
            
            try {
                log('正在请求钱包连接...');
                const accounts = await ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                walletAddress = accounts[0];
                log(`✅ 已连接钱包: ${walletAddress}`);
                setStatus(`✅ 钱包已连接: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`, 'success');
                
                enableButton('btnMsg', true);
            } catch (error) {
                log(`❌ 连接失败: ${error.message}`);
                setStatus('❌ 连接失败: ' + error.message, 'error');
            }
        }
        
        // 步骤 2: 获取登录消息
        async function getMessage() {
            try {
                log('正在获取登录消息...');
                
                const response = await fetch(`${BASE_URL}/v1/login/siwe/message`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Pubkey: walletAddress })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || '请求失败');
                }
                
                siweMessage = data.Message;
                log('✅ 已获取登录消息:');
                log(siweMessage);
                setStatus('✅ 已获取登录消息，请进行签名', 'success');
                
                enableButton('btnSign', true);
            } catch (error) {
                log(`❌ 获取消息失败: ${error.message}`);
                setStatus('❌ 获取消息失败: ' + error.message, 'error');
            }
        }
        
        // 步骤 3: 签名消息
        async function signMessage() {
            try {
                log('正在请求签名...');
                log('请在 MetaMask 弹窗中确认签名');
                
                // 使用 personal_sign 方法进行签名
                signature = await ethereum.request({
                    method: 'personal_sign',
                    params: [siweMessage, walletAddress]
                });
                
                log(`✅ 签名成功: ${signature.slice(0, 20)}...${signature.slice(-10)}`);
                setStatus('✅ 签名完成，请提交验证', 'success');
                
                enableButton('btnVerify', true);
            } catch (error) {
                log(`❌ 签名失败: ${error.message}`);
                setStatus('❌ 签名失败: ' + error.message, 'error');
            }
        }
        
        // 步骤 4: 验证并登录
        async function verify() {
            try {
                log('正在验证签名...');
                
                const response = await fetch(`${BASE_URL}/v1/login/siwe/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',  // 重要: 允许接收 Cookie
                    body: JSON.stringify({
                        Message: siweMessage,
                        Signature: signature
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || '验证失败');
                }
                
                log(`✅ 登录成功! 用户地址: ${data.Pubkey}`);
                setStatus('✅ 登录成功！现在可以创建 API Key', 'success');
                
                enableButton('btnCreate', true);
            } catch (error) {
                log(`❌ 验证失败: ${error.message}`);
                setStatus('❌ 验证失败: ' + error.message, 'error');
            }
        }
        
        // 步骤 5: 创建 API Key
        async function createKey() {
            const name = document.getElementById('keyName').value || 'my-key';
            
            try {
                log(`正在创建 API Key，名称: ${name}...`);
                
                const response = await fetch(`${BASE_URL}/v1/api-key/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ Name: name })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || '创建失败');
                }
                
                log(`✅ API Key 创建成功!`);
                log(`🔑 请立即保存: ${data.ApiKey}`);
                log(`⚠️ 此 Key 仅显示一次，请妥善保管！`);
                setStatus(`✅ API Key 已创建！请查看日志并保存。`, 'success');
                
                // 可以在这里复制到剪贴板
                // navigator.clipboard.writeText(data.ApiKey);
            } catch (error) {
                log(`❌ 创建失败: ${error.message}`);
                setStatus('❌ 创建失败: ' + error.message, 'error');
            }
        }
        
        // 监听钱包切换
        if (window.ethereum) {
            ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    log('钱包已断开连接');
                    walletAddress = null;
                    resetButtons();
                } else {
                    walletAddress = accounts[0];
                    log(`钱包已切换: ${walletAddress}`);
                }
            });
        }
        
        function resetButtons() {
            ['btnMsg', 'btnSign', 'btnVerify', 'btnCreate'].forEach(id => {
                enableButton(id, false);
            });
        }
    </script>
</body>
</html>
```

### 方式二：使用 ethers.js 库

如果您使用 React/Vue 等框架开发，推荐使用 ethers.js：

```javascript
import { ethers } from 'ethers';

const BASE_URL = 'https://t.ckcloudai.com';

class CKCloudAuth {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.address = null;
    }
    
    // 初始化钱包连接
    async connect() {
        if (!window.ethereum) {
            throw new Error('请安装 MetaMask');
        }
        
        this.provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await this.provider.send('eth_requestAccounts', []);
        this.signer = await this.provider.getSigner();
        this.address = accounts[0];
        
        return this.address;
    }
    
    // 完整登录流程
    async login() {
        if (!this.signer) {
            await this.connect();
        }
        
        // 1. 获取消息
        const msgResponse = await fetch(`${BASE_URL}/v1/login/siwe/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Pubkey: this.address })
        });
        
        const { Message } = await msgResponse.json();
        
        // 2. 签名
        const signature = await this.signer.signMessage(Message);
        
        // 3. 验证
        const verifyResponse = await fetch(`${BASE_URL}/v1/login/siwe/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                Message: Message,
                Signature: signature
            })
        });
        
        const { Pubkey } = await verifyResponse.json();
        return Pubkey;
    }
    
    // 创建 API Key
    async createApiKey(name) {
        const response = await fetch(`${BASE_URL}/v1/api-key/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ Name: name })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data.ApiKey;
    }
    
    // 获取 API Key 列表
    async listApiKeys(page = 1, limit = 20) {
        const response = await fetch(
            `${BASE_URL}/v1/api-key/list?Page=${page}&Limit=${limit}`,
            { credentials: 'include' }
        );
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    }
    
    // 删除 API Key
    async deleteApiKey(id) {
        const response = await fetch(`${BASE_URL}/v1/api-key/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ Id: id })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data.Id;
    }
}

// 使用示例
async function main() {
    const auth = new CKCloudAuth();
    
    try {
        // 登录
        const address = await auth.login();
        console.log('登录成功:', address);
        
        // 创建 API Key
        const apiKey = await auth.createApiKey('my-app-key');
        console.log('API Key:', apiKey);
        
        // 列出所有 Key
        const keys = await auth.listApiKeys();
        console.log('我的 API Keys:', keys);
        
    } catch (error) {
        console.error('操作失败:', error.message);
    }
}

main();
```

---

## 常见问题

### Q1: 为什么需要两次请求才能完成登录？

SIWE 采用挑战-响应模式：
1. **获取消息**：服务器生成包含随机 nonce 的消息，防止重放攻击
2. **验证签名**：证明用户确实拥有该钱包的私钥

这种设计确保了安全性，同时无需用户暴露私钥。

### Q2: Cookie 会过期吗？

是的，Cookie 中包含的 JWT Token 有有效期（默认配置）。过期后需要重新执行 SIWE 登录流程。

### Q3: API Key 忘记了怎么办？

API Key 仅在创建时显示完整值。如果忘记了，需要：
1. 删除旧的 Key
2. 创建新的 Key
3. 更新您的应用程序配置

### Q4: 可以创建多少个 API Key？

目前没有限制，但建议根据使用场景合理命名和管理。

### Q5: 如何使用 API Key 调用接口？

创建 API Key 后，可以在调用 LLM API 时使用：

```bash
curl https://t.ckcloudai.com/v1/chat/completions \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Q6: 跨域请求需要注意什么？

确保：
- 使用 `credentials: 'include'` 以携带 Cookie
- 服务端已配置正确的 CORS 策略
- 使用 HTTPS 协议（生产环境）

### Q7: 用户切换钱包地址怎么办？

前端应监听 `accountsChanged` 事件，当用户切换钱包时：
1. 清除当前登录状态
2. 重新执行登录流程

```javascript
ethereum.on('accountsChanged', (accounts) => {
    // 检测到钱包切换，需要重新登录
    window.location.reload();
});
```

---

## 联系支持

如有问题，请联系技术支持团队。

---

*文档最后更新: 2024年*
