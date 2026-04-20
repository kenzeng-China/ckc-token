# CKCloud API documentation

This document describes CKCloud’s user authentication and API Key management interface. These interfaces use **SIWE (Sign-In with Ethereum)** for authentication, allowing users to log in and manage their own API Keys through their Ethereum wallet.

---

## Table of contents

1. [Overview](#overview)
2. [SIWE Login Principle](#siwe-Login Principle)
3. [API interface](#api-interface)
- [3.1 Get login message](#31-Get login message)
- [3.2 Verify signature and log in](#32-Verify signature and log in)
- [3.3 Create API Key](#33-Create-api-key)
- [3.4 Get API Key list](#34-get-api-key-list)
- [3.5 Delete API Key](#35-Delete-api-key)
4. [Complete sample code](#Complete sample code)
5. [FAQ](#FAQ)

---

## Overview

### What is SIWE?

**SIWE (Sign-In with Ethereum)** is a decentralized authentication standard that allows users to log into websites using an Ethereum wallet (such as MetaMask) without the need for traditional usernames and passwords.

### core process

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIWE login process │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Front-end Back-end Wallet │
│   │                             │                          │        │
│ │ 1. Connect wallet │ │ │
│   │ ──────────────────────────────────────────────────────>         │
│   │ <──────────────────────────────────────────────────────         │
│ │ Return to wallet address │ │ │
│   │                             │                          │        │
│ │ 2. Request login message │ │ │
│   │ ─────────────────────────>  │                          │        │
│   │ <─────────────────────────  │                          │        │
│ │ Return SIWE message │ │ │
│   │                             │                          │        │
│ │ 3. Request wallet signature │ │ │
│   │ ──────────────────────────────────────────────────────>         │
│   │ <──────────────────────────────────────────────────────         │
│ │ Return signature │ │ │
│   │                             │                          │        │
│ │ 4. Submit verification │ │ │
│   │ ─────────────────────────>  │                          │        │
│   │ <─────────────────────────  │                          │        │
│ │ Set Cookie and log in successfully │ │ │
│   │                             │                          │        │
└─────────────────────────────────────────────────────────────────────┘
```

### Authentication method description

|endpoint type|Authentication method|illustrate|
|---------|---------|------|
|Login related|No certification required|Used to obtain messages and verify signatures|
|API key management|Cookie JWT|Automatically carried through cookies after successful login|
|API calls|API Key|Carry `Authorization: Bearer *** in the request header|

---

## SIWE login principle

### Why do I need two-step verification?

SIWE's security is based on the following principles:

1. **Server generated message**: To prevent replay attacks, the message contains random nonce and timestamp
2. **User private key signature**: Proves that the user indeed owns the wallet address
3. **Server verification signature**: Verify that the signature matches the address and complete the identity confirmation.

### SIWE message format

SIWE message follows [EIP-4361](https:// eips.ethereum.org/EIPS/eip-4361) standard, the format is as follows:

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

**Field Description**:

|Field|illustrate|
|-----|------|
|`domain`|Request a signed domain name to prevent phishing attacks|
|`address`|User wallet address|
|`nonce`|Random string to prevent replay attacks|
|`issued-at`|Message generation time|
|`expiration-time`|Message expiration time|

---

## API interface

### Basic information

- **Base URL**: `https://t.ckcloudai.com`
- **Content-Type**: `application/json`

---

### 3.1 Get login information

Get the text of the message used for SIWE login that requires the user to sign using the wallet.

#### request information

|project|value|
|-----|-----|
| **URL** | `/v1/login/siwe/message` |
| **Method** | `POST` |
|**Certification**|No certification required|

#### Request parameters

```json
{
    "Pubkey": "0x774b3f6C5a6F8e2D9A1B3C4d5E6f7A8b9C0D1e2F"
}
```

|Parameter name|type|Required|illustrate|
|-------|------|------|------|
|`Pubkey`|string|yes|User wallet address, must start with `0x`|

#### response parameters

**Successful response (HTTP 200)**:

```json
{
    "Message": "t.ckcloudai.com wants you to sign in with your Ethereum account:\n0x774b3f6C5a6F8e2D9A1B3C4d5E6f7A8b9C0D1e2F\n\nURI: https://t.ckcloudai.com\nVersion: 1\nChain ID: 1\nNonce: a1b2c3d4e5f6\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T10:45:00Z"
}
```

|Parameter name|type|illustrate|
|-------|------|------|
|`Message`|string|Login message in SIWE format for wallet signing|

**Error response**:

|HTTP status code|response body|illustrate|
|------------|--------|------|
|400|`{"error": "invalid request"}`|Invalid request parameter|
|500|`{"error": "failed to generate message"}`|Server internal error|

#### JavaScript call example

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

### 3.2 Verify signature and log in

Submit the signed message and the login cookie will be set after successful verification.

#### request information

|project|value|
|-----|-----|
| **URL** | `/v1/login/siwe/verify` |
| **Method** | `POST` |
|**Certification**|No certification required|

#### Request parameters

```json
{
    "Message": "t.ckcloudai.com wants you to sign in with your Ethereum account:\n0x...",
    "Signature": "0x7d299b8c4a1f3e5d7c9b2a4f6e8d1c3b5a7f9e2d4c6b8a0f2e4d6c8b0a2f4e6d..."
}
```

|Parameter name|type|Required|illustrate|
|-------|------|------|------|
|`Message`|string|yes|Raw message obtained from `/message` interface|
|`Signature`|string|yes|Wallet signature result, hexadecimal format|

#### response parameters

**Successful response (HTTP 200)**:

```json
{
    "Pubkey": "0x774b3f6C5a6F8e2D9A1B3C4d5E6f7A8b9C0D1e2F"
}
```

|Parameter name|type|illustrate|
|-------|------|------|
|`Pubkey`|string|Verified wallet address|

**Important**: response sets `Set-Cookie` header，subsequent requests must carry this Cookie：

```
Set-Cookie: ckcloud=eyJhbG...VCJ9...; Path=/; HttpOnly; Secure
```

**Error response**:

|HTTP status code|response body|illustrate|
|------------|--------|------|
|400|`{"error": "invalid request"}`|Invalid request parameter|
|401|`{"error": "invalid signature"}`|Signature verification failed|
|500|`{"error": "failed to create user"}`|Failed to create user|

#### JavaScript call example

```javascript
async function verifyAndLogin(message, signature) {
    const response = await fetch('https://t.ckcloudai.com/v1/login/siwe/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',  // Important: Allow carrying and receiving cookies
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

### 3.3 Create API Key

Create a new API Key for subsequent API call authentication.

#### request information

|project|value|
|-----|-----|
| **URL** | `/v1/api-key/create` |
| **Method** | `POST` |
|**Certification**|Cookie JWT (requires SIWE login first)|

#### Request parameters

```json
{
    "Name": "my-api-key"
}
```

|Parameter name|type|Required|illustrate|
|-------|------|------|------|
|`Name`|string|yes|The name of the API Key for identification purposes|

#### response parameters

**Successful response (HTTP 200)**:

```json
{
    "ApiKey": "***"
}
```

|Parameter name|type|illustrate|
|-------|------|------|
|`ApiKey`|string|The generated API Key starts with `sk-`, **Please keep it properly**|

> ⚠️ **Important Note**: API Key only returns the complete value when created, and will be desensitized when querying the list later. Please save immediately after creation.

**Error response**:

|HTTP status code|response body|illustrate|
|------------|--------|------|
|400|`{"error": "invalid request"}`|Invalid request parameter|
|401|`{"error": "unauthorized"}`|Not logged in or cookie has expired|
|500|`{"error": "failed to generate API key"}`|Build failed|
|500|`{"error": "failed to save API key"}`|Save failed|

#### JavaScript call example

```javascript
async function createApiKey(name) {
    const response = await fetch('https://t.ckcloudai.com/v1/api-key/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',  // Carrying login cookies
        body: JSON.stringify({
            Name: name
        })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Failed to create API key');
    }
    
    // ⚠️ Please save the API Key, the complete value cannot be viewed again later
    console.log('Your API Key:', data.ApiKey);
    return data.ApiKey;
}
```

---

### 3.4 Get API Key list

Get the list of all API Keys of the current user in pages.

#### request information

|project|value|
|-----|-----|
| **URL** | `/v1/api-key/list` |
| **Method** | `GET` |
|**Certification**|Cookie JWT (requires SIWE login first)|

#### query parameters

|Parameter name|type|Required|default value|illustrate|
|-------|------|------|--------|------|
|`Page`|integer|no|1|Page number, starting from 1|
|`Limit`|integer|no|20|Quantity per page|

#### Request example

```
GET /v1/api-key/list?Page=1&Limit=20
```

#### response parameters

**Successful response (HTTP 200)**:

```json
{
    "Keys": [
        {
            "Id": 1165098538693787650,
            "Name": "production",
            "ApiKey": "***",
            "CreatedAt": 1775659056
        },
        {
            "Id": 1165098867007389698,
            "Name": "development",
            "ApiKey": "***",
            "CreatedAt": 1775659156
        }
    ],
    "Total": 2,
    "Limit": 20,
    "CurrentPage": 1,
    "TotalPages": 1
}
```

|Parameter name|type|illustrate|
|-------|------|------|
|`Keys`|array|API Key List|
|`Keys[].Id`|integer|The unique identifier of the API Key, used for deletion operations|
|`Keys[].Name`|string|API key name|
|`Keys[].ApiKey`|string|**Desensitized** API Key (only the first 8 digits and the last 3 digits are displayed)|
|`Keys[].CreatedAt`|integer|Creation time (Unix timestamp, seconds)|
|`Total`|integer|Total number of records|
|`Limit`|integer|Current page size|
|`CurrentPage`|integer|Current page number|
|`TotalPages`|integer|Total pages|

**Error response**:

|HTTP status code|response body|illustrate|
|------------|--------|------|
|401|`{"error": "unauthorized"}`|Not logged in or cookie has expired|
|500|`{"error": "failed to list API keys"}`|Query failed|

#### JavaScript call example

```javascript
async function listApiKeys(page = 1, limit = 20) {
    const response = await fetch(
        `https://t.ckcloudai.com/v1/api-key/list?Page=${page}&Limit=${limit}`,
        {
            method: 'GET',
            credentials: 'include'  // Carrying login cookies
        }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Failed to list API keys');
    }
    
    return data;
}

// Usage example
const result = await listApiKeys(1, 10);
console.log(`Total ${result.Total} API Keys`);
result.Keys.forEach(key => {
    console.log(`- [${key.Name}] ${key.ApiKey}`);
});
```

---

### 3.5 Delete API Key

Delete the specified API Key.

#### request information

|project|value|
|-----|-----|
| **URL** | `/v1/api-key/delete` |
| **Method** | `POST` |
|**Certification**|Cookie JWT (requires SIWE login first)|

#### Request parameters

```json
{
    "Id": 1165098538693787650
}
```

|Parameter name|type|Required|illustrate|
|-------|------|------|------|
|`Id`|integer|yes|API Key ID to be deleted (obtained from list interface)|

#### response parameters

**Successful response (HTTP 200)**:

```json
{
    "Id": 1165098538693787650
}
```

|Parameter name|type|illustrate|
|-------|------|------|
|`Id`|integer|Deleted API Key ID|

**Error response**:

|HTTP status code|response body|illustrate|
|------------|--------|------|
|400|`{"error": "invalid request"}`|Invalid request parameter|
|401|`{"error": "unauthorized"}`|Not logged in or cookie has expired|
|500|`{"error": "failed to delete API key"}`|Deletion failed (probably not authorized to delete)|

#### JavaScript call example

```javascript
async function deleteApiKey(id) {
    const response = await fetch('https://t.ckcloudai.com/v1/api-key/delete', {
