import { createAiExplainResponse } from "../../server/ai-explain-service.mjs";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ code: "method-not-allowed", error: "POST required." });
    return;
  }

  try {
    const payload = await readBody(request);
    const runtimeApiKey = getHeader(request, "x-runtime-ai-key");
    const requestedMode = getHeader(request, "x-ai-mode") === "deepseek" || runtimeApiKey ? "deepseek" : process.env.AI_EXPLAIN_MODE || "mock";
    const result = await createAiExplainResponse(payload, {
      mode: requestedMode,
      apiKey: runtimeApiKey || process.env.DEEPSEEK_API_KEY,
    });
    response.status(200).json(result);
  } catch (error) {
    response.status(error.statusCode || 500).json({
      code: error.code || "server-error",
      error: error.message || "Internal server error.",
    });
  }
}

async function readBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function getHeader(request, name) {
  const value = request.headers[name] || request.headers[name.toLowerCase()];
  return Array.isArray(value) ? String(value[0] || "").trim() : String(value || "").trim();
}
