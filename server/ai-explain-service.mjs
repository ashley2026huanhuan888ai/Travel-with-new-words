const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-v4-flash";
const REQUIRED_SECTIONS = ["literal", "natural", "scene", "tone", "example", "similar", "mistake"];

export async function createAiExplainResponse(payload, options = {}) {
  validateExplainPayload(payload);
  const mode = options.mode || process.env.AI_EXPLAIN_MODE || "mock";
  if (mode === "deepseek") {
    return explainWithDeepSeek(payload, options);
  }
  return buildMockExplanation(payload);
}

export function buildDeepSeekChatRequest(payload, options = {}) {
  const model = options.model || process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL;
  const temperature = Number(options.temperature ?? process.env.DEEPSEEK_TEMPERATURE ?? 1);
  const request = {
    model,
    messages: buildMessages(payload),
    response_format: { type: "json_object" },
    temperature,
    max_tokens: Number(options.maxTokens ?? process.env.DEEPSEEK_MAX_TOKENS ?? 1200),
    stream: false,
  };
  const thinkingType = options.thinkingType || process.env.DEEPSEEK_THINKING;
  if (thinkingType) request.thinking = { type: thinkingType };
  return request;
}

export function buildMockExplanation(payload) {
  const { memory, source = {} } = payload;
  const original = clean(memory.original);
  const translation = clean(memory.translation);
  const language = clean(memory.language) || "外语";
  const scene = clean(memory.scene) || inferScene(source.ocrText);
  const natural = translation || original;
  const literal = clean(memory.literal) || natural;
  return normalizeExplanationResponse(
    {
      usage: `${scene}里可以把“${original || natural}”记成“${natural}”。这是本地 mock 解释，用来验证入库、复习和导出闭环。`,
      sections: {
        literal,
        natural,
        scene,
        tone: clean(memory.tone) || "中性",
        example: buildExample(original, natural, language),
        similar: buildSimilar(memory, source),
        mistake: `不要只背中文“${natural}”，要连同${scene}、来源图片和当时场景一起记。`,
      },
    },
    payload,
    { mode: "mock", model: "local-mock", status: "mocked", uploadAttempted: false }
  );
}

export async function explainWithDeepSeek(payload, options = {}) {
  const apiKey = options.apiKey || process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    const error = new Error("DEEPSEEK_API_KEY is required when AI_EXPLAIN_MODE=deepseek.");
    error.statusCode = 401;
    error.code = "api-key-required";
    throw error;
  }

  const baseUrl = (options.baseUrl || process.env.DEEPSEEK_BASE_URL || DEFAULT_DEEPSEEK_BASE_URL).replace(/\/+$/u, "");
  const requestBody = buildDeepSeekChatRequest(payload, options);
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await response.text();
  if (!response.ok) {
    const error = new Error(`DeepSeek API returned ${response.status}: ${responseText.slice(0, 300)}`);
    error.statusCode = 502;
    throw error;
  }

  const completion = JSON.parse(responseText);
  const content = completion.choices?.[0]?.message?.content || "";
  const parsed = parseModelJson(content);
  return normalizeExplanationResponse(parsed, payload, {
    mode: "deepseek",
    model: requestBody.model,
    status: "enriched",
    uploadAttempted: true,
    providerResponseId: completion.id || "",
  });
}

export function normalizeExplanationResponse(data, payload, metadata = {}) {
  const { memory, source = {} } = payload;
  const rawSections = data.sections || data;
  const fallback = {
    literal: clean(memory.literal) || clean(memory.translation) || clean(memory.original),
    natural: clean(memory.translation) || clean(memory.original),
    scene: clean(memory.scene) || inferScene(source.ocrText),
    tone: clean(memory.tone) || "中性",
    example: buildExample(memory.original, memory.translation, memory.language),
    similar: buildSimilar(memory, source),
    mistake: "结合来源场景一起记，避免脱离语境死记。",
  };
  const sections = REQUIRED_SECTIONS.reduce((result, key) => {
    result[key] = key === "similar" ? normalizeSimilar(rawSections[key] ?? fallback[key]) : clean(rawSections[key]) || fallback[key];
    return result;
  }, {});
  return {
    provider: "deepseek",
    mode: metadata.mode || "mock",
    model: metadata.model || DEFAULT_DEEPSEEK_MODEL,
    status: metadata.status || "enriched",
    uploadAttempted: metadata.uploadAttempted === true,
    providerResponseId: metadata.providerResponseId || "",
    enrichedAt: new Date().toISOString(),
    usage: clean(data.usage) || `${sections.scene}里常见的表达，建议结合来源图片和当时经历一起复习。`,
    sections,
  };
}

function validateExplainPayload(payload) {
  if (!payload || typeof payload !== "object") {
    throwBadRequest("Request body must be a JSON object.");
  }
  if (!payload.memory || typeof payload.memory !== "object") {
    throwBadRequest("Request body must include memory.");
  }
  if (!clean(payload.memory.original) && !clean(payload.memory.translation)) {
    throwBadRequest("memory.original or memory.translation is required.");
  }
}

function buildMessages(payload) {
  return [
    {
      role: "system",
      content:
        "你是面向中国出境旅行者的语言记忆教练。请只输出合法 JSON，不要输出 Markdown。JSON 必须包含 usage 和 sections；sections 必须包含 literal、natural、scene、tone、example、similar、mistake。如果中文译文为空、明显是占位，或用户是手动输入原文，请先给出自然中文译法。",
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          task: "解释相机翻译或手动输入的词、短语、句子、段落或表达，帮助用户真正理解和记住。",
          outputExample: {
            usage: "菜单里常见的菜名表达。",
            sections: {
              literal: "特别制作的味噌拉面",
              natural: "特制味噌拉面",
              scene: "餐厅点餐",
              tone: "中性",
              example: "この特製味噌ラーメンは人気があります。 / 这款特制味噌拉面很受欢迎。",
              similar: ["味噌汁", "醤油ラーメン"],
              mistake: "不要把“特製”理解成免费或套餐。",
            },
          },
          input: payload,
        },
        null,
        2
      ),
    },
  ];
}

function parseModelJson(content) {
  const text = clean(content).replace(/^```json\s*/iu, "").replace(/```$/u, "");
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
    throw new Error("DeepSeek response did not contain valid JSON.");
  }
}

function clean(value) {
  return String(value ?? "").trim();
}

function inferScene(ocrText = "") {
  const text = clean(ocrText);
  if (/[¥円]|ラーメン|menu|菜单|餐/u.test(text)) return "餐厅点餐";
  if (/出口|入口|station|platform|路|站/u.test(text)) return "交通指路";
  if (/how to use|instructions|使用方法|说明/u.test(text)) return "商品说明";
  return "旅行场景";
}

function buildExample(original, translation, language) {
  const left = clean(original) || clean(language) || "这个表达";
  const right = clean(translation) || "对应的自然中文";
  return `${left} / ${right}`;
}

function buildSimilar(memory, source) {
  if (Array.isArray(memory.similar) && memory.similar.length) return memory.similar.slice(0, 5).map(clean).filter(Boolean);
  const original = clean(memory.original);
  const ocrText = clean(source.ocrText);
  const candidates = [original, ...ocrText.split(/\s+/u)].filter((item) => item && item !== original);
  return candidates.slice(0, 3);
}

function normalizeSimilar(value) {
  if (Array.isArray(value)) return value.map(clean).filter(Boolean).slice(0, 8);
  return clean(value)
    .split(/[、,，\n]/u)
    .map(clean)
    .filter(Boolean)
    .slice(0, 8);
}

function throwBadRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
}
