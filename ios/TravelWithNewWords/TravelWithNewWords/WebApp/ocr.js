const menuBlocks = [
  {
    id: "block-menu-1",
    text: "特製味噌ラーメン",
    translationHint: "特制味噌拉面",
    confidence: 0.96,
    language: "ja",
    level: "expression",
    box: { x: 0.14, y: 0.2, width: 0.58, height: 0.12 },
  },
  {
    id: "block-menu-2",
    text: "濃厚な味噌スープにチャーシュー、味玉、メンマ入り",
    translationHint: "浓郁的味噌汤底，配叉烧、溏心蛋、笋干",
    confidence: 0.91,
    language: "ja",
    level: "sentence",
    box: { x: 0.14, y: 0.35, width: 0.62, height: 0.16 },
  },
  {
    id: "block-menu-3",
    text: "餃子（6個）",
    translationHint: "饺子（6 个）",
    confidence: 0.94,
    language: "ja",
    level: "phrase",
    box: { x: 0.14, y: 0.58, width: 0.38, height: 0.11 },
  },
];

const manualBlocks = [
  {
    id: "block-manual-1",
    text: "How to use",
    translationHint: "使用方法",
    confidence: 0.97,
    language: "en",
    level: "phrase",
    box: { x: 0.12, y: 0.18, width: 0.42, height: 0.12 },
  },
  {
    id: "block-manual-2",
    text: "Read instructions before use.",
    translationHint: "使用前请阅读说明",
    confidence: 0.9,
    language: "en",
    level: "sentence",
    box: { x: 0.12, y: 0.36, width: 0.66, height: 0.12 },
  },
];

export const ocrProviderOptions = [
  {
    id: "apple-vision",
    label: "Apple Vision OCR",
    mode: "ios-native-bridge",
    description: "iOS 原生壳可调用 Apple Vision；普通网页不可用时会明确提示，不做假识别。",
  },
  {
    id: "browser-text-detector",
    label: "浏览器本机 OCR",
    mode: "offline-browser",
    description: "仅在支持 TextDetector 的浏览器中可用；不可用时会保留图片等待重试。",
  },
  {
    id: "cloud-interface",
    label: "云端 OCR 接口",
    mode: "cloud-interface",
    description: "需要配置真实 OCR 供应商；未开启云账户时不会上传图片。",
  },
  {
    id: "local-mock",
    label: "模拟兜底",
    mode: "offline-simulated",
    description: "用于离线演示和无 OCR 能力环境的稳定兜底。",
  },
];

export function createOcrAdapter(options = {}) {
  const provider = options.provider || "local-mock";
  const providerConfig = getOcrProvider(provider);
  const allowMockFallback = options.allowMockFallback === true;
  return {
    provider,
    label: providerConfig.label,
    mode: providerConfig.mode,
    supportsOffline: provider !== "cloud-interface",
    cloudEnabled: Boolean(options.cloudEnabled),
    async recognize(sourceImage) {
      if (provider === "apple-vision") {
        return recognizeWithAppleVisionBridge(sourceImage).catch((error) => {
          if (allowMockFallback) {
            return recognizeWithFallback(sourceImage, {
              fallbackFrom: provider,
              fallbackReason: error.message || "Apple Vision 桥接暂不可用，已使用模拟兜底。",
              nativeBridgeAttempted: true,
            });
          }
          throw createUnavailableError(
            "Apple Vision OCR 当前不可用",
            error,
            "图片已保存。请在 iOS App 原生壳中使用 Apple Vision、配置云端 OCR，或先手动输入图片中的文字。"
          );
        });
      }

      if (provider === "browser-text-detector") {
        return recognizeWithBrowserTextDetector(sourceImage).catch((error) => {
          if (allowMockFallback) {
            return recognizeWithFallback(sourceImage, {
              fallbackFrom: provider,
              fallbackReason: error.message || "浏览器暂不支持本机 OCR，已使用模拟兜底。",
            });
          }
          throw createUnavailableError(
            "浏览器本机 OCR 当前不可用",
            error,
            "图片已保存。请换用支持 TextDetector 的浏览器、配置云端 OCR，或先手动输入图片中的文字。"
          );
        });
      }

      if (provider === "cloud-interface") {
        return recognizeWithCloudInterface(sourceImage, options);
      }

      return recognizeWithMock(sourceImage, { provider });
    },
  };
}

export function getOcrProviderLabel(provider) {
  return getOcrProvider(provider).label;
}

function getOcrProvider(provider) {
  return ocrProviderOptions.find((item) => item.id === provider) || ocrProviderOptions.find((item) => item.id === "local-mock");
}

async function recognizeWithAppleVisionBridge(sourceImage) {
  const bridge = globalThis.webkit?.messageHandlers?.appleVisionOcr;
  if (!bridge) {
    throw new Error("当前不是 iOS 原生壳，暂不能调用 Apple Vision OCR。");
  }
  if (!sourceImage.blob) {
    throw new Error("来源图片暂不能交给 Apple Vision OCR。");
  }

  const requestId = `apple-vision-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const imageDataUrl = await blobToDataUrl(sourceImage.blob);
  const nativeResult = await postAppleVisionRequest(bridge, {
    requestId,
    sourceImageId: sourceImage.id,
    sourceName: sourceImage.displayName || sourceImage.originalName || "来源图片",
    mimeType: sourceImage.mimeType || sourceImage.blob.type || "image/jpeg",
    imageDataUrl,
    recognitionLanguages: ["ja-JP", "en-US", "zh-Hans"],
  });
  const blocks = normalizeNativeBlocks(nativeResult.blocks || []);
  if (blocks.length === 0) {
    throw new Error("Apple Vision OCR 未识别到文字。");
  }

  return buildOcrResult(sourceImage, blocks, {
    provider: "apple-vision",
    mode: "ios-native-bridge",
    nativeBridgeAttempted: true,
  });
}

async function recognizeWithBrowserTextDetector(sourceImage) {
  if (!("TextDetector" in globalThis)) {
    throw new Error("浏览器暂不支持本机 TextDetector OCR。");
  }
  if (!sourceImage.blob || !("createImageBitmap" in globalThis)) {
    throw new Error("来源图片暂不能交给浏览器本机 OCR。");
  }

  const bitmap = await createImageBitmap(sourceImage.blob);
  const detector = new globalThis.TextDetector();
  const detected = await detector.detect(bitmap);
  const blocks = detected
    .map((item, index) => detectedTextToBlock(item, index, bitmap))
    .filter((block) => block.text);

  if (blocks.length === 0) {
    throw new Error("浏览器本机 OCR 未识别到文字。");
  }

  return buildOcrResult(sourceImage, blocks, {
    provider: "browser-text-detector",
    mode: "offline-browser",
  });
}

async function recognizeWithCloudInterface(sourceImage, options) {
  if (!options.cloudEnabled) {
    throw createUnavailableError("云端 OCR 未开启", null, "图片已保存且没有上传。请开启云端 OCR，或先手动输入图片中的文字。");
  }

  if (typeof options.cloudRecognize !== "function") {
    throw createUnavailableError("云端 OCR 供应商尚未配置", null, "图片已保存。请配置真实 OCR 接口后重试，或先手动输入图片中的文字。");
  }

  return options.cloudRecognize(sourceImage);
}

function createUnavailableError(title, error, action) {
  const reason = error?.message ? `：${error.message}` : "";
  const unavailableError = new Error(`${title}${reason}。${action}`);
  unavailableError.code = "ocr-unavailable";
  return unavailableError;
}

function recognizeWithFallback(sourceImage, meta = {}) {
  return recognizeWithMock(sourceImage, {
    provider: "local-mock",
    mode: "offline-simulated",
    ...meta,
  });
}

function recognizeWithMock(sourceImage, meta = {}) {
  return buildOcrResult(sourceImage, inferBlocks(sourceImage), {
    provider: meta.provider || "local-mock",
    mode: meta.mode || "offline-simulated",
    ...meta,
  });
}

function buildOcrResult(sourceImage, blocks, meta) {
  const provider = meta.provider || "local-mock";
  return {
    provider,
    providerLabel: getOcrProviderLabel(provider),
    mode: meta.mode || getOcrProvider(provider).mode,
    status: "done",
    recognizedAt: new Date().toISOString(),
    sourceImageId: sourceImage.id,
    sourceName: sourceImage.displayName || sourceImage.originalName || "来源图片",
    detectedLanguages: [...new Set(blocks.map((block) => block.language))],
    text: blocks.map((block) => block.text).join("\n"),
    blocks,
    fallbackFrom: meta.fallbackFrom || "",
    fallbackReason: meta.fallbackReason || "",
    requiresCloudAccount: Boolean(meta.requiresCloudAccount),
    requiresProviderConfig: Boolean(meta.requiresProviderConfig),
    cloudUploadAttempted: Boolean(meta.cloudUploadAttempted),
    nativeBridgeAttempted: Boolean(meta.nativeBridgeAttempted),
  };
}

function inferBlocks(sourceImage) {
  const name = `${sourceImage.displayName || ""} ${sourceImage.originalName || ""}`.toLowerCase();
  if (name.includes("how") || name.includes("manual") || name.includes("说明")) {
    return cloneBlocks(manualBlocks);
  }
  return cloneBlocks(menuBlocks);
}

function cloneBlocks(blocks) {
  return blocks.map((block) => ({
    ...block,
    box: { ...block.box },
  }));
}

function detectedTextToBlock(item, index, bitmap) {
  const rawBox = item.boundingBox || {};
  const bitmapWidth = bitmap.width || 1;
  const bitmapHeight = bitmap.height || 1;
  return {
    id: `block-browser-${index + 1}`,
    text: item.rawValue || item.text || "",
    translationHint: "",
    confidence: 0.82,
    language: "auto",
    level: "sentence",
    box: {
      x: clamp01((rawBox.x || 0) / bitmapWidth),
      y: clamp01((rawBox.y || 0) / bitmapHeight),
      width: clamp01((rawBox.width || bitmapWidth) / bitmapWidth),
      height: clamp01((rawBox.height || 24) / bitmapHeight),
    },
  };
}

function clamp01(value) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    if (!("FileReader" in globalThis)) {
      reject(new Error("当前环境暂不能读取图片数据。"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("读取图片失败。"));
    reader.readAsDataURL(blob);
  });
}

function postAppleVisionRequest(bridge, payload) {
  return new Promise((resolve, reject) => {
    const pending = getAppleVisionPendingMap();
    const timeout = globalThis.setTimeout(() => {
      delete pending[payload.requestId];
      reject(new Error("Apple Vision OCR 响应超时。"));
    }, 15000);

    pending[payload.requestId] = {
      resolve: (result) => {
        globalThis.clearTimeout(timeout);
        delete pending[payload.requestId];
        resolve(result || {});
      },
      reject: (message) => {
        globalThis.clearTimeout(timeout);
        delete pending[payload.requestId];
        reject(new Error(message || "Apple Vision OCR 失败。"));
      },
    };

    bridge.postMessage(payload);
  });
}

function getAppleVisionPendingMap() {
  const pending = (globalThis.__travelMemoryAppleVisionPending ||= {});
  globalThis.__resolveTravelMemoryAppleVisionOcr ||= (requestId, result) => pending[requestId]?.resolve(result);
  globalThis.__rejectTravelMemoryAppleVisionOcr ||= (requestId, message) => pending[requestId]?.reject(message);
  return pending;
}

function normalizeNativeBlocks(blocks) {
  return blocks
    .map((block, index) => ({
      id: block.id || `block-apple-${index + 1}`,
      text: String(block.text || "").trim(),
      translationHint: block.translationHint || "",
      confidence: Number.isFinite(block.confidence) ? block.confidence : 0.9,
      language: block.language || "auto",
      level: block.level || inferLevel(block.text || ""),
      box: normalizeBox(block.box),
    }))
    .filter((block) => block.text);
}

function normalizeBox(box = {}) {
  return {
    x: clamp01(Number(box.x) || 0),
    y: clamp01(Number(box.y) || 0),
    width: clamp01(Number(box.width) || 0.6),
    height: clamp01(Number(box.height) || 0.08),
  };
}

function inferLevel(text) {
  const trimmed = String(text).trim();
  if (trimmed.length <= 4) return "word";
  if (trimmed.length <= 14) return "phrase";
  return "sentence";
}
