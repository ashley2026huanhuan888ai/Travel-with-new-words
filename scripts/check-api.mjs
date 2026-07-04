import assert from "node:assert/strict";
import { buildDeepSeekChatRequest, createAiExplainResponse } from "../server/ai-explain-service.mjs";

const sample = {
  locale: "zh-CN",
  memory: {
    original: "特製味噌ラーメン",
    translation: "特制味噌拉面",
    literal: "特别制作的味噌拉面",
    language: "日文",
    scene: "餐厅点餐",
    tone: "中性",
    difficulty: "B1",
  },
  source: {
    ocrText: "特製味噌ラーメン\n濃厚な味噌スープ",
    location: "日本 · 东京",
    story: "2026 年 7 月在东京餐厅菜单上看到。",
  },
};

const mockResponse = await createAiExplainResponse(sample, { mode: "mock" });
assert.equal(mockResponse.provider, "deepseek");
assert.equal(mockResponse.mode, "mock");
assert.equal(mockResponse.status, "mocked");
assert.equal(mockResponse.uploadAttempted, false);
assert.ok(mockResponse.usage.includes("本地 mock"));
assert.equal(mockResponse.sections.natural, "特制味噌拉面");
assert.ok(Array.isArray(mockResponse.sections.similar));

const deepSeekRequest = buildDeepSeekChatRequest(sample, { model: "deepseek-v4-flash" });
assert.equal(deepSeekRequest.model, "deepseek-v4-flash");
assert.equal(deepSeekRequest.response_format.type, "json_object");
assert.equal(deepSeekRequest.stream, false);
assert.ok(JSON.stringify(deepSeekRequest.messages).toLowerCase().includes("json"));
assert.ok(JSON.stringify(deepSeekRequest.messages).includes("literal"));
assert.ok(JSON.stringify(deepSeekRequest.messages).includes("mistake"));

await assert.rejects(() => createAiExplainResponse({}, { mode: "mock" }), /memory/iu);
await assert.rejects(
  () => createAiExplainResponse(sample, { mode: "deepseek", apiKey: "" }),
  (error) => error.code === "api-key-required" && error.statusCode === 401
);

console.log("API checks passed (mock response + DeepSeek request shape + API key required path).");
