export const aiProviderOptions = [
  {
    id: "domestic-model-service",
    label: "国内模型服务",
    mode: "backend-proxy",
    description: "通过我们的后端接口调用国内模型；前端不保存供应商密钥。",
  },
  {
    id: "adapter-only",
    label: "AI 中文解释接口",
    mode: "interface-only",
    description: "先固定数据结构，不连接真实模型，不上传图片或文本。",
  },
];

export function createAiExplanationAdapter(options = {}) {
  const providerConfig = getAiProvider(options.provider);
  const provider = providerConfig.id;
  return {
    provider,
    label: providerConfig.label,
    mode: providerConfig.mode,
    async enrichMemory(memory, context = {}) {
      if (typeof options.generateExplanation === "function") {
        return options.generateExplanation(memory, context);
      }
      if (provider === "domestic-model-service") {
        return enrichWithDomesticModel(memory, context, providerConfig, options);
      }
      const sections = buildExplanationSections(memory, context);
      return {
        provider,
        providerLabel: providerConfig.label,
        mode: providerConfig.mode,
        status: "interface-ready",
        uploadAttempted: false,
        providerRequired: false,
        enrichedAt: new Date().toISOString(),
        usage: buildUsage(memory),
        sections,
      };
    },
  };
}

export function getAiProviderLabel(provider) {
  return getAiProvider(provider).label;
}

function getAiProvider(provider) {
  return aiProviderOptions.find((item) => item.id === provider) || aiProviderOptions[0];
}

async function enrichWithDomesticModel(memory, context, providerConfig, options) {
  const endpoint = options.domesticModelEndpoint || options.endpoint || "";
  if (!endpoint || options.allowNetwork !== true) {
    return buildFallbackEnrichment(memory, context, providerConfig, "backend-required", false);
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildDomesticModelPayload(memory, context)),
    });
    if (!response.ok) {
      throw new Error(`Domestic model endpoint returned ${response.status}`);
    }
    const data = await response.json();
    return normalizeModelResponse(data, memory, context, providerConfig);
  } catch (error) {
    return {
      ...buildFallbackEnrichment(memory, context, providerConfig, "provider-error", true),
      error: error instanceof Error ? error.message : "Domestic model request failed.",
    };
  }
}

export function buildDomesticModelPayload(memory, context = {}) {
  return {
    locale: "zh-CN",
    memory: {
      original: memory.original || "",
      translation: memory.translation || "",
      literal: memory.literal || "",
      language: memory.language || "",
      scene: memory.scene || "",
      tone: memory.tone || "",
      difficulty: memory.difficulty || "",
    },
    source: {
      ocrText: context.ocr?.text || "",
      location: memory.location || context.sourceImage?.location || "",
      story: memory.story || "",
      sourceImageId: memory.sourceImageId || context.sourceImage?.id || "",
    },
    requiredSections: ["literal", "natural", "scene", "tone", "example", "similar", "mistake"],
  };
}

function normalizeModelResponse(data, memory, context, providerConfig) {
  const fallbackSections = buildExplanationSections(memory, context);
  const sections = {
    ...fallbackSections,
    ...(data.sections || {}),
  };
  return {
    provider: providerConfig.id,
    providerLabel: providerConfig.label,
    mode: providerConfig.mode,
    status: "enriched",
    uploadAttempted: true,
    providerRequired: true,
    enrichedAt: data.enrichedAt || new Date().toISOString(),
    usage: data.usage || buildUsage(memory),
    sections,
  };
}

function buildFallbackEnrichment(memory, context, providerConfig, status, uploadAttempted) {
  return {
    provider: providerConfig.id,
    providerLabel: providerConfig.label,
    mode: providerConfig.mode,
    status,
    uploadAttempted,
    providerRequired: true,
    enrichedAt: new Date().toISOString(),
    usage: buildUsage(memory),
    sections: buildExplanationSections(memory, context),
  };
}

function buildUsage(memory) {
  const baseUsage = String(memory.usage || "").replace(/\s*(AI 中文解释接口已预留。|真实 AI 模型接口已预留。|国内模型服务接口已预留。).*$/u, "");
  return `${baseUsage} 国内模型服务接口已预留。后续模型会补充直译、自然译法、使用场景、语气、例句、相似表达和易错点。`;
}

function buildExplanationSections(memory, context) {
  const ocrText = context.ocr?.text || "";
  return {
    literal: memory.literal || "",
    natural: memory.translation || "",
    scene: memory.scene || "",
    tone: memory.tone || "",
    example: memory.example || "",
    similar: memory.similar || [],
    mistake: memory.mistake || "",
    sourceContext: ocrText ? ocrText.split("\n").slice(0, 3).join(" / ") : memory.source || "",
  };
}
