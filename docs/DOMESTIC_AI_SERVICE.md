# Domestic AI Explanation Service

The app should not call a domestic model provider directly from the phone or browser. The mobile client calls our backend endpoint, and the backend owns provider keys, routing, rate limits, and audit logs.

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

First provider class: domestic model service.

The backend should expose a stable `/api/ai/explain` contract and map it to the selected domestic model provider internally. Keep provider keys in backend environment variables, never in the WebApp or iOS bundle.
