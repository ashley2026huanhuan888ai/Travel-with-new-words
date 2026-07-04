export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ code: "method-not-allowed", error: "POST required." });
    return;
  }

  const body = await readBody(request);
  const apiKey = String(body.apiKey || "").trim();
  if (apiKey.length < 16) {
    response.status(400).json({ code: "invalid-api-key", error: "DeepSeek API Key is too short." });
    return;
  }

  response.status(200).json({
    aiExplainMode: "deepseek",
    provider: "deepseek",
    model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
    keyConfigured: true,
    keySource: "browser-session",
    requiresApiKey: false,
    acceptsRuntimeKey: true,
  });
}

async function readBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}
