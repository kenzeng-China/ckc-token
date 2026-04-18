     1|# CKCloud API documentation
     2|
     3|This document describes CKCloud’s user authentication and API Key management interface. These interfaces use **SIWE (Sign-In with Ethereum)** for authentication, allowing users to log in and manage their own API Keys through their Ethereum wallet.
     4|
     5|---
     6|
     7|## Table of contents
     8|
     9|1. [Overview](#overview)
    10|2. [SIWE Login Principle](#siwe-Login Principle)
    11|3. [API interface](#api-interface)
    12|- [3.1 Get login message](#31-Get login message)
    13|- [3.2 Verify signature and log in](#32-Verify signature and log in)
    14|- [3.3 Create API Key](#33-Create-api-key)
    15|- [3.4 Get API Key list](#34-get-api-key-list)
    16|- [3.5 Delete API Key](#35-Delete-api-key)
    17|4. [Complete sample code](#Complete sample code)
    18|5. [FAQ](#FAQ)
    19|
    20|---
    21|
    22|## Overview
    23|
    24|### What is SIWE?
    25|
    26|**SIWE (Sign-In with Ethereum)** is a decentralized authentication standard that allows users to log into websites using an Ethereum wallet (such as MetaMask) without the need for traditional usernames and passwords.
    27|
    28|### core process
    29|
    30|```
    31|┌─────────────────────────────────────────────────────────────────────┐
    32|│ SIWE login process │
    33|├─────────────────────────────────────────────────────────────────────┤
    34|│                                                                     │
    35|│ Front-end Back-end Wallet │
    36|│   │                             │                          │        │
    37|│ │ 1. Connect wallet │ │ │
    38|│   │ ──────────────────────────────────────────────────────>         │
    39|│   │ <──────────────────────────────────────────────────────         │
    40|│ │ Return to wallet address │ │ │
    41|│   │                             │                          │        │
    42|│ │ 2. Request login message │ │ │
    43|│   │ ─────────────────────────>  │                          │        │
    44|│   │ <─────────────────────────  │                          │        │
    45|│ │ Return SIWE message │ │ │
    46|│   │                             │                          │        │
    47|│ │ 3. Request wallet signature │ │ │
    48|│   │ ──────────────────────────────────────────────────────>         │
    49|│   │ <──────────────────────────────────────────────────────         │
    50|│ │ Return signature │ │ │
    51|│   │                             │                          │        │
    52|│ │ 4. Submit verification │ │ │
    53|│   │ ─────────────────────────>  │                          │        │
    54|│   │ <─────────────────────────  │                          │        │
    55|│ │ Set Cookie and log in successfully │ │ │
    56|│   │                             │                          │        │
    57|└─────────────────────────────────────────────────────────────────────┘
    58|```
    59|
    60|### Authentication method description
    61|
    62||endpoint type|Authentication method|illustrate|
    63||---------|---------|------|
    64||Login related|No certification required|Used to obtain messages and verify signatures|
    65||API key management|Cookie JWT|Automatically carried through cookies after successful login|
    66||API calls|API Key|Carry `Authorization: Bearer *** in the request header|
    67|
    68|---
    69|
    70|## SIWE login principle
    71|
    72|### Why do I need two-step verification?
    73|
    74|SIWE's security is based on the following principles:
    75|
    76|1. **Server generated message**: To prevent replay attacks, the message contains random nonce and timestamp
    77|2. **User private key signature**: Proves that the user indeed owns the wallet address
    78|3. **Server verification signature**: Verify that the signature matches the address and complete the identity confirmation.
    79|
    80|### SIWE message format
    81|
    82|SIWE message follows [EIP-4361](https:// eips.ethereum.org/EIPS/eip-4361) standard, the format is as follows:
    83|
    84|```
    85|t.ckcloudai.com wants you to sign in with your Ethereum account:
    86|0x774b3f6C5a6F8e2D9A1B3C4d5E6f7A8b9C0D1e2F
    87|
    88|URI: https://t.ckcloudai.com
    89|Version: 1
    90|Chain ID: 1
    91|Nonce: a1b2c3d4e5f6
    92|Issued At: 2024-01-15T10:30:00Z
    93|Expiration Time: 2024-01-15T10:45:00Z
    94|```
    95|
    96|**Field Description**:
    97|
    98||Field|illustrate|
    99||-----|------|
   100||`domain`|Request a signed domain name to prevent phishing attacks|
   101||`address`|User wallet address|
   102||`nonce`|Random string to prevent replay attacks|
   103||`issued-at`|Message generation time|
   104||`expiration-time`|Message expiration time|
   105|
   106|---
   107|
   108|## API interface
   109|
   110|### Basic information
   111|
   112|- **Base URL**: `https://t.ckcloudai.com`
   113|- **Content-Type**: `application/json`
   114|
   115|---
   116|
   117|### 3.1 Get login information
   118|
   119|Get the text of the message used for SIWE login that requires the user to sign using the wallet.
   120|
   121|#### request information
   122|
   123||project|value|
   124||-----|-----|
   125|| **URL** | `/v1/login/siwe/message` |
   126|| **Method** | `POST` |
   127||**Certification**|No certification required|
   128|
   129|#### Request parameters
   130|
   131|```json
   132|{
   133|    "Pubkey": "0x774b3f6C5a6F8e2D9A1B3C4d5E6f7A8b9C0D1e2F"
   134|}
   135|```
   136|
   137||Parameter name|type|Required|illustrate|
   138||-------|------|------|------|
   139||`Pubkey`|string|yes|User wallet address, must start with `0x`|
   140|
   141|#### response parameters
   142|
   143|**Successful response (HTTP 200)**:
   144|
   145|```json
   146|{
   147|    "Message": "t.ckcloudai.com wants you to sign in with your Ethereum account:\n0x774b3f6C5a6F8e2D9A1B3C4d5E6f7A8b9C0D1e2F\n\nURI: https://t.ckcloudai.com\nVersion: 1\nChain ID: 1\nNonce: a1b2c3d4e5f6\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T10:45:00Z"
   148|}
   149|```
   150|
   151||Parameter name|type|illustrate|
   152||-------|------|------|
   153||`Message`|string|Login message in SIWE format for wallet signing|
   154|
   155|**Error response**:
   156|
   157||HTTP status code|response body|illustrate|
   158||------------|--------|------|
   159||400|`{"error": "invalid request"}`|Invalid request parameter|
   160||500|`{"error": "failed to generate message"}`|Server internal error|
   161|
   162|#### JavaScript call example
   163|
   164|```javascript
   165|async function getLoginMessage(address) {
   166|    const response = await fetch('https://t.ckcloudai.com/v1/login/siwe/message', {
   167|        method: 'POST',
   168|        headers: {
   169|            'Content-Type': 'application/json'
   170|        },
   171|        body: JSON.stringify({
   172|            Pubkey: address
   173|        })
   174|    });
   175|    
   176|    const data = await response.json();
   177|    
   178|    if (!response.ok) {
   179|        throw new Error(data.error || 'Failed to get message');
   180|    }
   181|    
   182|    return data.Message;
   183|}
   184|```
   185|
   186|---
   187|
   188|### 3.2 Verify signature and log in
   189|
   190|Submit the signed message and the login cookie will be set after successful verification.
   191|
   192|#### request information
   193|
   194||project|value|
   195||-----|-----|
   196|| **URL** | `/v1/login/siwe/verify` |
   197|| **Method** | `POST` |
   198||**Certification**|No certification required|
   199|
   200|#### Request parameters
   201|
   202|```json
   203|{
   204|    "Message": "t.ckcloudai.com wants you to sign in with your Ethereum account:\n0x...",
   205|    "Signature": "0x7d299b8c4a1f3e5d7c9b2a4f6e8d1c3b5a7f9e2d4c6b8a0f2e4d6c8b0a2f4e6d..."
   206|}
   207|```
   208|
   209||Parameter name|type|Required|illustrate|
   210||-------|------|------|------|
   211||`Message`|string|yes|Raw message obtained from `/message` interface|
   212||`Signature`|string|yes|Wallet signature result, hexadecimal format|
   213|
   214|#### response parameters
   215|
   216|**Successful response (HTTP 200)**:
   217|
   218|```json
   219|{
   220|    "Pubkey": "0x774b3f6C5a6F8e2D9A1B3C4d5E6f7A8b9C0D1e2F"
   221|}
   222|```
   223|
   224||Parameter name|type|illustrate|
   225||-------|------|------|
   226||`Pubkey`|string|Verified wallet address|
   227|
   228|**Important**: response sets `Set-Cookie` header，subsequent requests must carry this Cookie：
   229|
   230|```
   231|Set-Cookie: ckcloud=eyJhbG...VCJ9...; Path=/; HttpOnly; Secure
   232|```
   233|
   234|**Error response**:
   235|
   236||HTTP status code|response body|illustrate|
   237||------------|--------|------|
   238||400|`{"error": "invalid request"}`|Invalid request parameter|
   239||401|`{"error": "invalid signature"}`|Signature verification failed|
   240||500|`{"error": "failed to create user"}`|Failed to create user|
   241|
   242|#### JavaScript call example
   243|
   244|```javascript
   245|async function verifyAndLogin(message, signature) {
   246|    const response = await fetch('https://t.ckcloudai.com/v1/login/siwe/verify', {
   247|        method: 'POST',
   248|        headers: {
   249|            'Content-Type': 'application/json'
   250|        },
   251|        credentials: 'include',  // Important: Allow carrying and receiving cookies
   252|        body: JSON.stringify({
   253|            Message: message,
   254|            Signature: signature
   255|        })
   256|    });
   257|    
   258|    const data = await response.json();
   259|    
   260|    if (!response.ok) {
   261|        throw new Error(data.error || 'Verification failed');
   262|    }
   263|    
   264|    return data.Pubkey;
   265|}
   266|```
   267|
   268|---
   269|
   270|### 3.3 Create API Key
   271|
   272|Create a new API Key for subsequent API call authentication.
   273|
   274|#### request information
   275|
   276||project|value|
   277||-----|-----|
   278|| **URL** | `/v1/api-key/create` |
   279|| **Method** | `POST` |
   280||**Certification**|Cookie JWT (requires SIWE login first)|
   281|
   282|#### Request parameters
   283|
   284|```json
   285|{
   286|    "Name": "my-api-key"
   287|}
   288|```
   289|
   290||Parameter name|type|Required|illustrate|
   291||-------|------|------|------|
   292||`Name`|string|yes|The name of the API Key for identification purposes|
   293|
   294|#### response parameters
   295|
   296|**Successful response (HTTP 200)**:
   297|
   298|```json
   299|{
   300|    "ApiKey": "***"
   301|}
   302|```
   303|
   304||Parameter name|type|illustrate|
   305||-------|------|------|
   306||`ApiKey`|string|The generated API Key starts with `sk-`, **Please keep it properly**|
   307|
   308|> ⚠️ **Important Note**: API Key only returns the complete value when created, and will be desensitized when querying the list later. Please save immediately after creation.
   309|
   310|**Error response**:
   311|
   312||HTTP status code|response body|illustrate|
   313||------------|--------|------|
   314||400|`{"error": "invalid request"}`|Invalid request parameter|
   315||401|`{"error": "unauthorized"}`|Not logged in or cookie has expired|
   316||500|`{"error": "failed to generate API key"}`|Build failed|
   317||500|`{"error": "failed to save API key"}`|Save failed|
   318|
   319|#### JavaScript call example
   320|
   321|```javascript
   322|async function createApiKey(name) {
   323|    const response = await fetch('https://t.ckcloudai.com/v1/api-key/create', {
   324|        method: 'POST',
   325|        headers: {
   326|            'Content-Type': 'application/json'
   327|        },
   328|        credentials: 'include',  // Carrying login cookies
   329|        body: JSON.stringify({
   330|            Name: name
   331|        })
   332|    });
   333|    
   334|    const data = await response.json();
   335|    
   336|    if (!response.ok) {
   337|        throw new Error(data.error || 'Failed to create API key');
   338|    }
   339|    
   340|    // ⚠️ Please save the API Key, the complete value cannot be viewed again later
   341|    console.log('Your API Key:', data.ApiKey);
   342|    return data.ApiKey;
   343|}
   344|```
   345|
   346|---
   347|
   348|### 3.4 Get API Key list
   349|
   350|Get the list of all API Keys of the current user in pages.
   351|
   352|#### request information
   353|
   354||project|value|
   355||-----|-----|
   356|| **URL** | `/v1/api-key/list` |
   357|| **Method** | `GET` |
   358||**Certification**|Cookie JWT (requires SIWE login first)|
   359|
   360|#### query parameters
   361|
   362||Parameter name|type|Required|default value|illustrate|
   363||-------|------|------|--------|------|
   364||`Page`|integer|no|1|Page number, starting from 1|
   365||`Limit`|integer|no|20|Quantity per page|
   366|
   367|#### Request example
   368|
   369|```
   370|GET /v1/api-key/list?Page=1&Limit=20
   371|```
   372|
   373|#### response parameters
   374|
   375|**Successful response (HTTP 200)**:
   376|
   377|```json
   378|{
   379|    "Keys": [
   380|        {
   381|            "Id": 1165098538693787650,
   382|            "Name": "production",
   383|            "ApiKey": "***",
   384|            "CreatedAt": 1775659056
   385|        },
   386|        {
   387|            "Id": 1165098867007389698,
   388|            "Name": "development",
   389|            "ApiKey": "***",
   390|            "CreatedAt": 1775659156
   391|        }
   392|    ],
   393|    "Total": 2,
   394|    "Limit": 20,
   395|    "CurrentPage": 1,
   396|    "TotalPages": 1
   397|}
   398|```
   399|
   400||Parameter name|type|illustrate|
   401||-------|------|------|
   402||`Keys`|array|API Key List|
   403||`Keys[].Id`|integer|The unique identifier of the API Key, used for deletion operations|
   404||`Keys[].Name`|string|API key name|
   405||`Keys[].ApiKey`|string|**Desensitized** API Key (only the first 8 digits and the last 3 digits are displayed)|
   406||`Keys[].CreatedAt`|integer|Creation time (Unix timestamp, seconds)|
   407||`Total`|integer|Total number of records|
   408||`Limit`|integer|Current page size|
   409||`CurrentPage`|integer|Current page number|
   410||`TotalPages`|integer|Total pages|
   411|
   412|**Error response**:
   413|
   414||HTTP status code|response body|illustrate|
   415||------------|--------|------|
   416||401|`{"error": "unauthorized"}`|Not logged in or cookie has expired|
   417||500|`{"error": "failed to list API keys"}`|Query failed|
   418|
   419|#### JavaScript call example
   420|
   421|```javascript
   422|async function listApiKeys(page = 1, limit = 20) {
   423|    const response = await fetch(
   424|        `https://t.ckcloudai.com/v1/api-key/list?Page=${page}&Limit=${limit}`,
   425|        {
   426|            method: 'GET',
   427|            credentials: 'include'  // Carrying login cookies
   428|        }
   429|    );
   430|    
   431|    const data = await response.json();
   432|    
   433|    if (!response.ok) {
   434|        throw new Error(data.error || 'Failed to list API keys');
   435|    }
   436|    
   437|    return data;
   438|}
   439|
   440|// Usage example
   441|const result = await listApiKeys(1, 10);
   442|console.log(`Total ${result.Total} API Keys`);
   443|result.Keys.forEach(key => {
   444|    console.log(`- [${key.Name}] ${key.ApiKey}`);
   445|});
   446|```
   447|
   448|---
   449|
   450|### 3.5 Delete API Key
   451|
   452|Delete the specified API Key.
   453|
   454|#### request information
   455|
   456||project|value|
   457||-----|-----|
   458|| **URL** | `/v1/api-key/delete` |
   459|| **Method** | `POST` |
   460||**Certification**|Cookie JWT (requires SIWE login first)|
   461|
   462|#### Request parameters
   463|
   464|```json
   465|{
   466|    "Id": 1165098538693787650
   467|}
   468|```
   469|
   470||Parameter name|type|Required|illustrate|
   471||-------|------|------|------|
   472||`Id`|integer|yes|API Key ID to be deleted (obtained from list interface)|
   473|
   474|#### response parameters
   475|
   476|**Successful response (HTTP 200)**:
   477|
   478|```json
   479|{
   480|    "Id": 1165098538693787650
   481|}
   482|```
   483|
   484||Parameter name|type|illustrate|
   485||-------|------|------|
   486||`Id`|integer|Deleted API Key ID|
   487|
   488|**Error response**:
   489|
   490||HTTP status code|response body|illustrate|
   491||------------|--------|------|
   492||400|`{"error": "invalid request"}`|Invalid request parameter|
   493||401|`{"error": "unauthorized"}`|Not logged in or cookie has expired|
   494||500|`{"error": "failed to delete API key"}`|Deletion failed (probably not authorized to delete)|
   495|
   496|#### JavaScript call example
   497|
   498|```javascript
   499|async function deleteApiKey(id) {
   500|    const response = await fetch('https://t.ckcloudai.com/v1/api-key/delete', {
   501|