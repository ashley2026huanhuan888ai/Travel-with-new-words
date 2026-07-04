# Domestic AI Explanation Service

The app should not call a domestic model provider directly from the phone or browser. The mobile client calls our backend endpoint, and the backend owns provider keys, routing, rate limits, and audit logs.

First provider: DeepSeek.

Local default: mock mode. This lets the product loop work without an API key:

```text
npm run dev
```

DeepSeek mode:

```text
AI_EXPLAIN_MODE=deepseek DEEPSEEK_API_KEY=your_key npm run dev
```

If DeepSeek mode is active but no key is configured, `/api/ai/explain` returns:

```json
{
  "code": "api-key-required",
  "error": "DEEPSEEK_API_KEY is required when AI_EXPLAIN_MODE=deepseek."
}
```

The WebApp catches this and opens the DeepSeek API Key dialog. Submitting the dialog calls:

```text
POST /api/ai/runtime-key
```

The runtime key is kept only in the local server process memory. It is not written into IndexedDB, exported files, the static WebApp, or the iOS bundle.

Optional environment variables:

```text
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_TEMPERATURE=1
DEEPSEEK_MAX_TOKENS=1200
```

## Client Endpoint

Default client endpoint:

```text
POST /api/ai/explain
```

Request shape:

```json
{
  "locale": "zh-CN",
  "memory": {
    "original": "特製味噌ラーメン",
    "translation": "特制味噌拉面",
    "literal": "特别制作的味噌拉面",
    "language": "日文",
    "scene": "餐厅点餐",
    "tone": "中性",
    "difficulty": "B1"
  },
  "source": {
    "ocrText": "特製味噌ラーメン\n濃厚な味噌スープ...",
    "location": "日本 · 东京",
    "story": "2026 年 7 月在东京餐厅菜单上看到。"
  },
  "requiredSections": [
    "literal",
    "natural",
    "scene",
    "tone",
    "example",
    "similar",
    "mistake"
  ]
}
```

Response shape:

```json
{
  "usage": "菜单里常见的菜名表达...",
  "sections": {
    "literal": "特别制作的味噌拉面",
    "natural": "特制味噌拉面",
    "scene": "餐厅点餐",
    "tone": "中性",
    "example": "この特製味噌ラーメンは人気があります。 / 这款特制味噌拉面很受欢迎。",
    "similar": ["味噌汁", "醤油ラーメン"],
    "mistake": "不要把“特製”理解成免费或套餐。"
  }
}
```

## Backend Provider Notes

The backend maps the stable `/api/ai/explain` contract to DeepSeek internally. Keep provider keys in backend environment variables, never in the WebApp or iOS bundle.

DeepSeek request shape used by the backend:

```json
{
  "model": "deepseek-v4-flash",
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ],
  "response_format": { "type": "json_object" },
  "temperature": 1,
  "max_tokens": 1200,
  "stream": false
}
```

The model prompt explicitly asks for JSON with:

```text
usage
sections.literal
sections.natural
sections.scene
sections.tone
sections.example
sections.similar
sections.mistake
```
