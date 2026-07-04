import assert from "node:assert/strict";
import explainHandler from "../api/ai/explain.js";
import runtimeKeyHandler from "../api/ai/runtime-key.js";
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

const runtimeKeyResponse = await callHandler(runtimeKeyHandler, {
  method: "POST",
  body: { apiKey: "sk-test-local-runtime-key-1234567890" },
});
assert.equal(runtimeKeyResponse.statusCode, 200);
assert.equal(runtimeKeyResponse.body.keySource, "browser-session");

const explainWithoutKey = await callHandler(explainHandler, {
  method: "POST",
  headers: { "x-ai-mode": "deepseek" },
  body: sample,
});
assert.equal(explainWithoutKey.statusCode, 401);
assert.equal(explainWithoutKey.body.code, "api-key-required");

console.log("API checks passed (mock, DeepSeek request shape, key prompt path, Vercel handlers).");

async function callHandler(handler, request) {
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  await handler(
    {
      method: request.method || "GET",
      headers: request.headers || {},
      body: request.body,
    },
    response
  );
  return response;
}
