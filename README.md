# ckc-token

ckc-token power

## Examples

```
examples/
├── curl/              - Shell script examples
├── typescript/        - TypeScript examples
│   └── fetch/         - Raw fetch API examples
└── docs/              - Feature documentation (TODO)
```

### Curl

Minimal examples using `curl` to call the ckc-token API. Requires [jq](https://jqlang.github.io/jq/) for pretty-printing (optional).

**Chat Completions:**

```bash
export CKC_TOKEN_API_KEY=your-api-key
bash examples/curl/chat-completions.sh
```

**Responses API:**

```bash
export CKC_TOKEN_API_KEY=your-api-key
bash examples/curl/responses.sh
```

### TypeScript - Raw Fetch

A minimal example using the native `fetch` API to call the ckc-token API.

**Chat Completions:**

```bash
cd examples/typescript/fetch
npm install
CKC_TOKEN_API_KEY=your-api-key npx tsx src/basic/example.ts
```

**Responses API:**

```bash
cd examples/typescript/fetch
npm install
CKC_TOKEN_API_KEY=your-api-key npx tsx src/basic/responses-example.ts
```
