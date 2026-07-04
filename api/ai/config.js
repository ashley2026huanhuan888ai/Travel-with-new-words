export default function handler(request, response) {
  response.status(200).json({
    aiExplainMode: process.env.AI_EXPLAIN_MODE || "mock",
    provider: "deepseek",
    model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
    keyConfigured: Boolean(process.env.DEEPSEEK_API_KEY),
    keySource: process.env.DEEPSEEK_API_KEY ? "env" : "none",
    requiresApiKey: process.env.AI_EXPLAIN_MODE === "deepseek" && !process.env.DEEPSEEK_API_KEY,
    acceptsRuntimeKey: true,
  });
}
