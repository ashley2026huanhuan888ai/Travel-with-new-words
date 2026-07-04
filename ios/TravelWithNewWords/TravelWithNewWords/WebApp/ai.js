export const aiProviderOptions = [
  {
    id: "real-model-interface",
    label: "真实 AI 模型接口",
    mode: "provider-required",
    description: "准备接真实模型；未配置供应商时保持本地占位，不上传内容。",
  },
  {
    id: "adapter-only",
    label: "AI 中文解释接口",
    mode: "interface-only",
    description: "先固定数据结构，不连接真实模型，不上传图片或文本。",
  },
];

export function createAiExplanationAdapter(options = {}) {
  const provider = options.provider || "real-model-interface";
  const providerConfig = getAiProvider(provider);
  return {
    provider,
    label: providerConfig.label,
    mode: providerConfig.mode,
    async enrichMemory(memory, context = {}) {
      if (provider === "real-model-interface" && typeof options.generateExplanation === "function") {
        return options.generateExplanation(memory, context);
      }
      const sections = buildExplanationSections(memory, context);
      return {
        provider,
        providerLabel: providerConfig.label,
        mode: providerConfig.mode,
        status: provider === "real-model-interface" ? "provider-unconfigured" : "interface-ready",
        uploadAttempted: false,
        providerRequired: provider === "real-model-interface",
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

function buildUsage(memory) {
  const baseUsage = String(memory.usage || "").replace(/\s*(AI 中文解释接口已预留。|真实 AI 模型接口已预留。).*$/u, "");
  return `${baseUsage} 真实 AI 模型接口已预留。后续模型会补充直译、自然译法、使用场景、语气、例句、相似表达和易错点。`;
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
