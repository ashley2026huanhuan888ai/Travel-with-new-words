import { storage } from "./storage.js?v=19";
import { createAiExplanationAdapter, getAiProviderLabel } from "./ai.js?v=18";
import { createOcrAdapter, getOcrProviderLabel, ocrProviderOptions } from "./ocr.js?v=18";

const icons = {
  home: "M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  book: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3z M5 4v19",
  camera: "M4 8h4l1.5-2h5L16 8h4v11H4z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  review: "M7 4h10v16l-5-3-5 3z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0",
  cloud: "M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5-1.8A5 5 0 0 0 7 18z",
  gear: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M4 12h2 M18 12h2 M12 4v2 M12 18v2 M5.6 5.6 7 7 M17 17l1.4 1.4 M18.4 5.6 17 7 M7 17l-1.4 1.4",
  search: "M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z M16 16l5 5",
  back: "M15 18l-6-6 6-6",
  edit: "M4 20h4l11-11-4-4L4 16z M13 6l4 4",
  more: "M5 12h.01 M12 12h.01 M19 12h.01",
  flash: "M13 2 4 14h7l-1 8 9-12h-7z",
  image: "M4 5h16v14H4z M7 15l3-3 3 3 2-2 3 3 M8 9h.01",
  check: "M5 12l4 4L19 6",
  volume: "M4 10h4l5-4v12l-5-4H4z M16 9c1 1 1.5 2 1.5 3S17 14 16 15",
  pin: "M12 21s7-5.5 7-12A7 7 0 1 0 5 9c0 6.5 7 12 7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  calendar: "M6 3v4 M18 3v4 M4 8h16 M5 5h14v16H5z",
  export: "M12 3v12 M8 7l4-4 4 4 M5 15v5h14v-5",
  lock: "M7 10V7a5 5 0 0 1 10 0v3 M5 10h14v11H5z",
};

const seedMemories = [
  {
    id: "mem-ramen",
    original: "特製味噌ラーメン",
    translation: "特制味噌拉面",
    literal: "特别制作的味噌拉面",
    language: "日文",
    level: "表达",
    weight: 92,
    topic: "餐饮",
    scene: "餐厅点餐",
    tone: "中性",
    difficulty: "B1",
    usage: "菜单里常见的菜名表达，适合记住“特製”和“味噌”的组合。",
    example: "この特製味噌ラーメンは人気があります。 / 这款特制味噌拉面很受欢迎。",
    similar: ["味噌汁", "醤油ラーメン", "おすすめメニュー"],
    mistake: "不要把“特製”理解成免费或套餐，它只是特别制作/招牌风味。",
    location: "日本 · 东京",
    story: "2026 年 7 月在东京站附近的小巷拉面店菜单上看到，排队很长但很值得。",
    status: "待复习",
    occurrences: 2,
    createdAt: "2026-07-02 18:36",
    source: "菜单",
    thumb: "menu",
    occurrenceRecords: [
      {
        sourceImageId: "",
        createdAt: "2026-07-02 18:36",
        location: "日本 · 东京",
        source: "东京餐厅菜单",
        scene: "餐厅点餐",
        note: "第一次在拉面店菜单上看到，系统保留为旅行场景记忆。",
      },
      {
        sourceImageId: "",
        createdAt: "2026-07-02 20:18",
        location: "日本 · 东京",
        source: "同类菜单",
        scene: "餐厅点餐",
        note: "第二次出现时合并到同一表达，累计频率。",
      },
    ],
  },
  {
    id: "mem-exit",
    original: "出口（東口）",
    translation: "出口（东口）",
    literal: "出去的口，东侧出口",
    language: "日文",
    level: "短语",
    weight: 84,
    topic: "交通",
    scene: "车站指路",
    tone: "指示",
    difficulty: "A1",
    usage: "车站、商场、地下通道里高频出现，用来判断方向。",
    example: "東口から出てください。 / 请从东口出去。",
    similar: ["入口", "西口", "改札口"],
    mistake: "“口”在这里不是嘴，而是出入口。",
    location: "日本 · 东京",
    story: "在东京地铁换乘时看到，帮助确认酒店方向。",
    status: "已掌握",
    occurrences: 5,
    createdAt: "2026-07-02 16:12",
    source: "路牌",
    thumb: "sign",
    occurrenceRecords: [
      {
        sourceImageId: "",
        createdAt: "2026-07-02 16:12",
        location: "日本 · 东京",
        source: "地铁路牌",
        scene: "车站指路",
        note: "换乘时用于确认酒店方向。",
      },
    ],
  },
  {
    id: "mem-howto",
    original: "How to use",
    translation: "使用方法",
    literal: "如何使用",
    language: "英文",
    level: "短语",
    weight: 68,
    topic: "购物",
    scene: "商品说明",
    tone: "说明",
    difficulty: "A1",
    usage: "包装、说明书、机器界面常见标题。",
    example: "Read how to use this product before opening it. / 打开前先阅读使用方法。",
    similar: ["Instructions", "Directions", "User guide"],
    mistake: "不要逐字翻成“怎么去使用”，中文里说“使用方法”更自然。",
    location: "手动地点未填",
    story: "在药妆店购买小家电时拍下说明书。",
    status: "待复习",
    occurrences: 1,
    createdAt: "2026-07-01 21:05",
    source: "说明书",
    thumb: "manual",
    occurrenceRecords: [
      {
        sourceImageId: "",
        createdAt: "2026-07-01 21:05",
        location: "手动地点未填",
        source: "商品说明书",
        scene: "商品说明",
        note: "购买小家电时拍下说明文字。",
      },
    ],
  },
];

const captureSuggestions = [
  {
    original: "特製味噌ラーメン",
    translation: "特制味噌拉面",
    literal: "特别制作的味噌拉面",
    detail: "浓郁的味噌汤底，配叉烧、溏心蛋、笋干。",
    chips: ["拉面", "味噌汤底", "叉烧", "溏心蛋", "笋干"],
  },
  {
    original: "辛味噌ラーメン",
    translation: "辣味噌拉面",
    literal: "辣味的味噌拉面",
    detail: "带辣味的味噌汤底，适合能吃辣的人。",
    chips: ["辣味", "点餐", "菜单"],
  },
  {
    original: "餃子（6個）",
    translation: "饺子（6 个）",
    literal: "六个饺子",
    detail: "常作为拉面店配菜，通常是煎饺。",
    chips: ["配菜", "数量", "煎饺"],
  },
];

const manualTranslationHints = [
  ["no smoking", "禁止吸烟", "不允许吸烟"],
  ["cash only", "只收现金", "只能使用现金付款"],
  ["card only", "只支持刷卡", "只能使用银行卡或电子支付"],
  ["tax free", "免税", "购物时可申请免税"],
  ["take away", "外带", "带走，不在店内食用"],
  ["dine in", "堂食", "在店内食用"],
  ["mind the gap", "小心站台间隙", "提醒乘客注意站台和车厢之间的空隙"],
  ["keep out", "禁止进入", "不要进入该区域"],
  ["entrance", "入口", "进入的地方"],
  ["exit", "出口", "离开的地方"],
  ["reservation", "预约", "提前保留位置或服务"],
  ["boarding gate", "登机口", "登机时前往的门"],
  ["check-in", "办理入住/值机", "酒店入住或航班值机"],
  ["how to use", "使用方法", "说明如何使用"],
  ["特製味噌ラーメン", "特制味噌拉面", "特别制作的味噌拉面"],
  ["辛味噌ラーメン", "辣味噌拉面", "带辣味的味噌拉面"],
  ["餃子", "饺子", "日式煎饺或饺子"],
];

const manualSourceLanguageOptions = [
  { id: "auto", label: "自动识别", hint: "不预设" },
  { id: "ja", label: "日文", hint: "日本" },
  { id: "en", label: "英文", hint: "英语区" },
  { id: "ko", label: "韩文", hint: "韩国" },
  { id: "th", label: "泰文", hint: "泰国" },
  { id: "fr", label: "法文", hint: "法国" },
  { id: "es", label: "西班牙文", hint: "西语区" },
  { id: "zh", label: "中文", hint: "中文内容" },
];

const manualTargetLanguageOptions = [
  { id: "zh", label: "中文", hint: "默认" },
  { id: "en", label: "英文", hint: "英文输出" },
  { id: "ja", label: "日文", hint: "日文输出" },
  { id: "ko", label: "韩文", hint: "韩文输出" },
  { id: "th", label: "泰文", hint: "泰文输出" },
];

const exportFields = [
  ["original", "原文"],
  ["translation", "译文"],
  ["literal", "直译"],
  ["language", "语言"],
  ["topic", "主题"],
  ["scene", "场景"],
  ["location", "地点"],
  ["story", "地点故事"],
  ["status", "复习状态"],
  ["occurrences", "出现次数"],
  ["source", "来源"],
  ["createdAt", "时间"],
];

const exportScopes = [
  ["all", "全部记忆"],
  ["filtered", "当前筛选结果"],
  ["review", "待复习"],
  ["mastered", "已掌握"],
  ["withImages", "有来源图片"],
];

const defaultExportOptions = {
  open: false,
  format: "csv",
  scope: "all",
  fields: {
    original: true,
    translation: true,
    literal: false,
    language: true,
    topic: true,
    scene: true,
    location: true,
    story: true,
    status: true,
    occurrences: true,
    source: true,
    createdAt: false,
  },
};

const defaultState = {
  activeTab: "home",
  detailId: null,
  search: "",
  filter: "全部",
  lastImportName: "",
  lastSourceImageId: "",
  manualInput: {
    text: "",
    previewReady: false,
    previewDraft: null,
    translating: false,
  },
  toast: "",
  storageReady: false,
  settings: {
    autoSave: true,
    previewBeforeSave: false,
    privacyBlur: false,
    location: true,
    cloudAfterLimit: true,
    cloudUploadEnabled: false,
    ocrProvider: "apple-vision",
    aiProvider: "domestic-model-service",
    aiNetworkEnabled: false,
    domesticAiEndpoint: "/api/ai/explain",
    reviewMode: "travel-diary",
    manualSourceLanguage: "auto",
    manualTargetLanguage: "zh",
  },
  reviewRevealed: false,
  editingMemory: null,
  moreMemorySheet: false,
  memories: seedMemories,
  queue: [],
  sourceImages: [],
  imageUrls: {},
  exportOptions: structuredClone(defaultExportOptions),
  runtimeAiKey: "",
  aiConnection: {
    status: "unknown",
    message: "",
    checkedAt: "",
    keySource: "",
    model: "",
  },
  apiKeyDialog: {
    open: false,
    apiKey: "",
    message: "",
    pendingAction: "",
  },
};

let state = structuredClone(defaultState);

function saveState() {
  storage.saveSettings(state.settings).catch(() => {});
}

function getOcrAdapter() {
  return createOcrAdapter({
    provider: state.settings.ocrProvider,
    cloudEnabled: state.settings.cloudUploadEnabled,
    allowMockFallback: true,
  });
}

function getAiAdapter() {
  return createAiExplanationAdapter({
    provider: state.settings.aiProvider,
    domesticModelEndpoint: state.settings.domesticAiEndpoint,
    allowNetwork: state.settings.aiNetworkEnabled === true,
    requestDeepSeek: state.settings.aiNetworkEnabled === true,
    runtimeApiKey: state.runtimeAiKey,
  });
}

async function hydrateState() {
  try {
    const data = await storage.loadAppData(seedMemories, defaultState.settings);
    const mergedSettings = { ...defaultState.settings, ...data.settings };
    // 迁移旧 Apple Vision 设置为 local-mock（Web 环境不可用）
    if (mergedSettings.ocrProvider === "apple-vision") {
      mergedSettings.ocrProvider = "local-mock";
      await storage.saveSettings(mergedSettings);
    }
    state = {
      ...state,
      settings: mergedSettings,
      memories: sortMemories(data.memories.length ? data.memories : seedMemories),
      queue: sortQueue(data.queue),
      sourceImages: sortSourceImages(data.sourceImages || []),
      imageUrls: createImageUrlMap(data.sourceImages || []),
      storageReady: true,
    };
  } catch (error) {
    state.toast = "本机数据库暂不可用，已切换为临时演示数据。";
    state.storageReady = false;
  }
}

function icon(name, className = "") {
  const path = icons[name] || icons.home;
  return `<svg class="${className}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"></path></svg>`;
}

function statusBar() {
  return `
    <div class="status-bar">
      <span>9:41</span>
      <div class="status-icons"><span class="signal"></span><span>5G</span><span class="battery"></span></div>
    </div>
  `;
}

function topbar(title, subtitle = "", actions = "", options = "") {
  return `
    <header class="topbar ${options}">
      <div class="title-stack">
        <h1 class="title">${title}</h1>
        ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}
      </div>
      <div class="icon-row">${actions}</div>
    </header>
  `;
}

function nav() {
  const tabs = [
    ["home", "首页", "home"],
    ["library", "记忆", "book"],
    ["capture", "拍照翻译", "camera", "capture"],
    ["review", "复习", "review"],
    ["settings", "我的", "user"],
  ];
  return `
    <nav class="bottom-nav" aria-label="主导航">
      ${tabs
        .map(([id, label, iconName, special]) => {
          const active =
            state.activeTab === id ||
            (id === "library" && state.activeTab === "detail") ||
            (id === "capture" && state.activeTab === "manual");
          return `
            <button class="nav-item ${active ? "active" : ""} ${special || ""}" data-tab="${id}">
              <span class="tab-icon-wrap">${icon(iconName, "tab-icon")}</span>
              <span>${label}</span>
            </button>
          `;
        })
        .join("")}
    </nav>
  `;
}

function render() {
  const app = document.querySelector("#app");
  const screen = {
    home: homeScreen,
    capture: captureScreen,
    manual: manualScreen,
    library: libraryScreen,
    detail: detailScreen,
    review: reviewScreen,
    settings: settingsScreen,
  }[state.activeTab]();

  app.innerHTML = `
    <section class="screen">
      ${statusBar()}
      <input id="photoInput" class="file-input" type="file" accept="image/*" capture="environment" />
      ${screen}
      ${nav()}
      ${state.exportOptions.open ? exportSheet() : ""}
      ${state.apiKeyDialog.open ? apiKeyDialog() : ""}
      ${state.editingMemory ? editMemoryDialog() : ""}
      ${state.moreMemorySheet ? moreMemorySheet() : ""}
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
  bindEvents(app);
}

function homeScreen() {
  const counts = getCounts();
  return `
    ${topbar(
      "译忆 · 出国随身翻译记忆本",
      "",
      `<button class="icon-button" data-action="export" aria-label="导出">${icon("cloud")}</button><button class="icon-button" data-tab="settings" aria-label="设置">${icon("gear")}</button>`,
      "borderless"
    )}
    <div class="content">
      <button class="hero-action" data-tab="capture">
        <span class="camera-mark">${icon("camera")}</span>
        <span><strong>拍照翻译</strong><span>识别菜单 / 路牌 / 说明书等</span></span>
      </button>

      <button class="manual-entry-card" data-tab="manual">
        <span class="manual-mark">${icon("edit")}</span>
        <span><strong>输入文字翻译</strong><span>单词、短语、句子、段落都保存到同一个记忆库</span></span>
      </button>

      <div class="grid-two">
        <div class="panel trip-card">
          <div>
            <p class="panel-title">最近旅行地</p>
            <strong>日本 · 东京</strong>
            <p>7月2日 · 自动记录城市</p>
          </div>
          <span class="tokyo-thumb" aria-hidden="true"></span>
        </div>
        <div class="panel queue-card">
          <p class="panel-title">离线队列</p>
          <div class="queue-count">${icon("cloud", "meta-icon")}<strong>${counts.queue}</strong></div>
          <p class="subtitle">待联网整理</p>
          <button class="link-button queue-action" data-action="process-queue">补整理</button>
        </div>
      </div>

      <div class="section-head">
        <h2>今日记忆</h2>
        <button class="link-button" data-tab="library">查看全部</button>
      </div>
      <div class="stat-grid">
        <div class="stat green"><span>已收集</span><strong>${counts.total}</strong><span>条</span></div>
        <div class="stat yellow"><span>待复习</span><strong>${counts.review}</strong><span>条</span></div>
        <div class="stat blue"><span>已掌握</span><strong>${counts.mastered}</strong><span>条</span></div>
      </div>

      <div class="review-strip">
        <div><strong>今日待复习</strong><span>旅行日记回顾 + 搜索型知识库</span></div>
        <button class="primary-button coral-button" data-tab="review">开始复习</button>
      </div>

      <div class="section-head">
        <h2>最近保存的记忆</h2>
        <button class="link-button" data-tab="library">查看全部</button>
      </div>
      <div class="memory-list">
        ${state.memories
          .slice(0, 3)
          .map(
            (memory) => `
          <button class="memory-row" data-detail="${memory.id}">
            <span class="${thumbClass(memory.thumb)}" aria-hidden="true"></span>
            <span><strong>${memory.translation}</strong><span>${memory.source} · ${memory.language} · ${memory.scene}</span></span>
            <small>${memory.status}</small>
          </button>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function captureScreen() {
  const selected = captureSuggestions[0];
  const sourceImage = state.lastSourceImageId ? state.sourceImages.find((item) => item.id === state.lastSourceImageId) : null;
  const hasOcr = sourceImage?.ocrStatus === "done" || sourceImage?.ocr?.status === "done";
  const ocrFailed = sourceImage?.ocrStatus === "failed";
  const isProcessing = Boolean(sourceImage && !hasOcr && !ocrFailed);
  const weightedBlocks = sourceImage?.weightedOcrBlocks || sourceImage?.recommendedKeyBlocks || [];
  const detectedCount = hasOcr ? sourceImage?.ocr?.blocks?.length || 0 : 0;
  const savedCount = hasOcr ? weightedBlocks.length || detectedCount : 0;
  const imageUrl = sourceImage ? state.imageUrls[sourceImage.id] : "";
  const topBlock = hasOcr ? weightedBlocks[0] || sourceImage?.ocr?.blocks?.[0] || null : null;
  const policyTitle = sourceImage
    ? hasOcr
      ? `${savedCount} 条 OCR 文字已自动入库`
      : ocrFailed
        ? "图片已保存，文字识别未完成"
        : "图片已保存，正在识别文字"
    : "还没有选择照片";
  const policyBody = sourceImage
    ? hasOcr
      ? "全部识别内容都会保存，系统按置信度、长度和层级分配权重，权重高的优先复习。"
      : ocrFailed
        ? sourceImage.lastOcrError || "当前环境没有可用 OCR 能力。图片已保存，可以重试或手动输入文字继续翻译。"
        : "正在调用当前 OCR 管线；如果离线或服务不可用，会保留图片并显示原因。"
    : "点击拍照后会直接进入识别，不需要再手动保存。";
  const resultChips = sourceImage
    ? hasOcr
      ? ["OCR", "自动入库", "已识别"]
      : ocrFailed
        ? ["图片已保存", "待 OCR", "可手动输入"]
        : ["OCR", "处理中", "离线队列"]
    : ["拍照", "OCR", "记忆卡片"];
  return `
    ${topbar(
      `<button class="icon-button" data-tab="home" aria-label="关闭">${icon("back")}</button> 拍照 → 翻译`,
      "",
      `<button class="icon-button" data-tab="manual" aria-label="输入文字">${icon("edit")}</button><button class="icon-button" data-action="open-camera" aria-label="拍照或导入图片">${icon("image")}</button>`,
      ""
    )}
    <div class="content">
      ${
        sourceImage
          ? `
        <div class="capture-stage">
          <div class="photo-frame imported" aria-label="来源照片预览">${imageUrl ? `<img class="capture-photo" src="${imageUrl}" alt="来源照片" />` : ""}</div>
          ${weightedBlocks
            .slice(0, 3)
            .map(
              (block, index) => `
            <div class="scan-card selected imported-card imported-${index + 1}">
              <h3>${escapeHtml(clipText(block.text, 28))}</h3>
              <p>${escapeHtml(block.translationHint || `权重 ${block.memoryWeight || memoryWeightForBlock(block)}`)}</p>
              <span class="scan-check">${icon("check")}</span>
            </div>
          `
            )
            .join("")}
          <div class="capture-tools">
            <button class="active">自动识别</button>
            <button class="${ocrFailed ? "error" : ""}">${hasOcr ? "已入库" : ocrFailed ? "未识别" : "识别中"}</button>
          </div>
        </div>
      `
          : `
        <div class="capture-empty">
          <span class="camera-mark">${icon("camera")}</span>
          <h2>拍照或选择图片后开始翻译</h2>
          <p>会保存来源图片，自动 OCR，识别到的文字会立刻生成记忆卡片。</p>
          <button class="primary-button wide-button" data-action="open-camera">拍照 / 选择照片</button>
        </div>
      `
      }

      <div class="ai-sheet">
        <div class="ai-sheet-head">
          <span>${sourceImage ? "照片翻译结果" : "等待照片"}</span>
          <button class="link-button" data-action="open-camera">${sourceImage ? "重新拍照" : "打开相机"}</button>
        </div>
        <div class="source-policy ${ocrFailed ? "warning" : isProcessing ? "pending" : ""}">
          <strong>${policyTitle}</strong>
          <span>${escapeHtml(policyBody)}</span>
        </div>
        <div class="translation-result">
          <small>${escapeHtml(topBlock?.text || (ocrFailed ? "等待文字内容" : selected.original))} ${icon("volume", "meta-icon")}</small>
          <h2>${escapeHtml(topBlock?.translationHint || (ocrFailed ? "未完成识别" : selected.translation))}</h2>
          <p>${escapeHtml(sourceImage ? sourceOcrSummary({ sourceImageId: sourceImage.id }) : "请选择真实照片开始 OCR 翻译。")}</p>
          <div class="chip-row">${resultChips.map((chip) => `<span class="chip">${chip}</span>`).join("")}</div>
        </div>
        <div class="capture-actions">
          ${
            sourceImage && !hasOcr
              ? `<button class="secondary-button" data-action="manual-from-image">手动输入文字</button><button class="primary-button" data-action="retry-ocr">重试识别</button>`
              : `<button class="secondary-button" data-action="open-camera">${sourceImage ? "重新拍照" : "拍照"}</button><button class="primary-button" data-tab="library">${sourceImage ? "查看记忆" : "查看记忆库"}</button>`
          }
        </div>
      </div>
    </div>
  `;
}

function manualScreen() {
  const text = state.manualInput.text || "";
  const normalizedText = normalizeManualText(text);
  const blocks = splitManualText(normalizedText);
  const previewReady = state.manualInput.previewReady && normalizedText;
  const preview = previewReady ? state.manualInput.previewDraft || buildManualMemoryDraft(normalizedText, blocks) : null;
  const inputLanguage = getManualLanguageOption("source", state.settings.manualSourceLanguage);
  const outputLanguage = getManualLanguageOption("target", state.settings.manualTargetLanguage);
  const language = getManualInputLanguageLabel();
  const scene = normalizedText ? inferManualScene(normalizedText) : "旅行场景";
  const levelSummary = summarizeManualLevels(blocks);
  const samples = ["No smoking in this area.", "辛味噌ラーメンをください。", "Cash only"];

  return `
    ${topbar(
      `<button class="icon-button" data-tab="home" aria-label="返回">${icon("back")}</button> 输入文字翻译`,
      "保存到记忆库，自动生成复习卡片",
      `<button class="icon-button" data-tab="capture" aria-label="拍照翻译">${icon("camera")}</button>`
    )}
    <div class="content">
      <form class="manual-form" data-manual-form>
        <label class="manual-text-field">
          <span>要翻译的文字</span>
          <textarea data-manual-text rows="7" spellcheck="false" placeholder="输入单词、短语、句子或一整段外语">${escapeHtml(text)}</textarea>
        </label>

        <div class="manual-sample-row">
          ${samples.map((sample) => `<button type="button" data-manual-sample="${escapeAttr(sample)}">${escapeHtml(sample)}</button>`).join("")}
        </div>

        <div class="manual-language-panel">
          ${manualLanguageSelector("输入语言", "source", manualSourceLanguageOptions, inputLanguage.id)}
          ${manualLanguageSelector("输出语言", "target", manualTargetLanguageOptions, outputLanguage.id)}
        </div>

        <div class="manual-meta-grid">
          <span><strong>${language}</strong><small>输入</small></span>
          <span><strong>${outputLanguage.label}</strong><small>输出</small></span>
          <span><strong>${scene}</strong><small>场景</small></span>
        </div>

        <div class="source-policy manual-policy">
          <strong>${previewReady ? "译文已生成，可以保存" : normalizedText ? "点击翻译，先生成译文" : "选择语言后输入文字"}</strong>
          <span>${normalizedText ? `${levelSummary}。未知内容会先调用 DeepSeek 翻译；没有 Key 时会直接弹出填写界面。` : "支持单词、短语、句子和段落。翻译成功后再保存到记忆库。"}</span>
        </div>

        ${
          preview
            ? `
          <div class="translation-result manual-result">
            <small>${escapeHtml(preview.level)} · ${escapeHtml(preview.language)}</small>
            <h2>${escapeHtml(preview.translation)}</h2>
            <p>${escapeHtml(preview.usage)}</p>
            <div class="chip-row">${preview.similar.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}</div>
          </div>
        `
            : ""
        }

        <div class="capture-actions">
          <button class="secondary-button" type="button" data-action="${previewReady ? "edit-manual" : "clear-manual"}">${previewReady ? "返回修改" : "清空"}</button>
          <button class="primary-button" type="submit" ${state.manualInput.translating ? "disabled" : ""}>${state.manualInput.translating ? "翻译中..." : previewReady ? "保存到记忆库" : "翻译"}</button>
        </div>
      </form>

      ${
        previewReady && blocks.length
          ? `
        <div class="detail-block">
          <h3>自动拆分</h3>
          <div class="level-list">${blocks.map((block) => manualBlockItem(block)).join("")}</div>
        </div>
      `
          : ""
      }
    </div>
  `;
}

function libraryScreen() {
  const filters = ["全部", "餐饮", "交通", "购物", "手动输入", "待复习", "已掌握"];
  const memories = filteredMemories();
  return `
    ${topbar("记忆库", "按语言、地点、场景和来源检索", `<button class="icon-button" data-tab="manual" aria-label="手动添加记忆">${icon("edit")}</button><button class="icon-button" data-action="export" aria-label="导出">${icon("export")}</button>`)}
    <div class="content">
      <label class="search-field">
        ${icon("search")}
        <input data-search value="${escapeAttr(state.search)}" placeholder="搜索原文、译文、场景或地点" />
      </label>
      <div class="filter-row">
        ${filters.map((filter) => `<button class="filter-chip ${state.filter === filter ? "active" : ""}" data-filter="${filter}">${filter}</button>`).join("")}
      </div>
      <div class="memory-list">
        ${memories
          .map(
            (memory) => `
          <button class="memory-card" data-detail="${memory.id}">
            <span class="memory-card-head">
              <span>
                <h3>${memory.translation}</h3>
                <p>${memory.original} · ${memory.usage}</p>
              </span>
              <small class="meta-pill">${memory.status}</small>
            </span>
            <span class="memory-meta">
              <span class="meta-pill">${memory.language}</span>
              <span class="meta-pill">${memory.topic}</span>
              <span class="meta-pill">${memory.location}</span>
              <span class="meta-pill">出现 ${memory.occurrences} 次</span>
            </span>
          </button>
        `
          )
          .join("") || `<div class="panel"><p class="subtitle">没有找到匹配的记忆。</p></div>`}
      </div>
    </div>
  `;
}

function detailScreen() {
  const memory = state.memories.find((item) => item.id === state.detailId) || state.memories[0];
  return `
    ${topbar(
      `<button class="icon-button" data-tab="library" aria-label="返回">${icon("back")}</button> 记忆详情`,
      "",
      `<button class="icon-button" data-action="edit-memory" aria-label="编辑">${icon("edit")}</button><button class="icon-button" data-action="more-memory" aria-label="更多">${icon("more")}</button>`
    )}
    <div class="content">
      <div class="detail-block">
        <h3>原文（${memory.language}） ${icon("volume", "meta-icon")}</h3>
        <strong>${memory.original}</strong>
        <p>${memory.literal}</p>
      </div>
      <div class="detail-block">
        <h3>自然译文 ${icon("volume", "meta-icon")}</h3>
        <strong style="color: var(--green)">${memory.translation}</strong>
        <p>${memory.usage}</p>
      </div>
      <div class="detail-block soft">
        <h3>直译参考</h3>
        <p>${memory.literal}</p>
      </div>
      <div class="detail-grid">
        <div class="mini-panel"><span>使用场景</span><strong>${memory.scene}</strong></div>
        <div class="mini-panel"><span>语气/风格</span><strong>${memory.tone}</strong></div>
        <div class="mini-panel"><span>难度</span><strong>${memory.difficulty}</strong></div>
      </div>
      ${memory.contentBlocks?.length ? contentLevelBlock(memory) : ""}
      <div class="detail-block">
        <h3>例句</h3>
        <p>${memory.example}</p>
      </div>
      <div class="detail-block">
        <h3>相似表达</h3>
        <div class="chip-row">${(memory.similar || []).map((item) => `<span class="chip">${item}</span>`).join("")}</div>
      </div>
      <div class="detail-block">
        <h3>易错点</h3>
        <p>${memory.mistake}</p>
      </div>
      <div class="detail-block">
        <h3>${memory.sourceKind === "manual-text" ? "文本来源" : "来源截图"}</h3>
        <div class="source-row">
          <p>${sourceDescription(memory)}</p>
          ${sourcePreview(memory)}
        </div>
      </div>
      <div class="detail-block">
        <h3>每次出现记录</h3>
        <div class="occurrence-list">${occurrenceTimeline(memory)}</div>
      </div>
      <div class="detail-block">
        <h3>地点故事</h3>
        <div class="source-row">
          <p>${memory.story}</p>
          <span class="tokyo-thumb" aria-hidden="true"></span>
        </div>
      </div>
      <div class="detail-block">
        <h3>复习状态</h3>
        <div class="status-actions">
          <button class="status-action red" data-status="忘记了">忘记了</button>
          <button class="status-action yellow" data-status="模糊">模糊</button>
          <button class="status-action blue" data-status="待复习">记得</button>
          <button class="status-action green" data-status="已掌握">完全掌握</button>
        </div>
      </div>
    </div>
  `;
}

function reviewScreen() {
  const memory = state.memories.find((item) => item.status !== "已掌握") || state.memories[0];
  const answerVisible = state.reviewRevealed;
  return `
    ${topbar("复习", "旅行日记回忆模式")}
    <div class="content">
      <div class="review-card">
        <span class="${thumbClass(memory.thumb)}" aria-hidden="true"></span>
        <span class="review-kicker">${memory.location} · ${memory.scene}</span>
        <h2>${memory.story}</h2>
        <p>回想当时来源里的外语表达、译文意思和使用场景。</p>
        <div class="detail-block ${answerVisible ? "" : "answer-hidden"}">
          <h3>${answerVisible ? "回忆答案" : "答案已隐藏"}</h3>
          ${
            answerVisible
              ? `
          <strong>${memory.original} → ${memory.translation}</strong>
          <p>${memory.usage}</p>
        `
              : `<p>先根据旅行场景自己想一遍，再查看答案。</p>`
          }
        </div>
        ${answerVisible ? "" : `<button class="secondary-button wide-button" data-action="reveal-review">看答案</button>`}
        <div class="detail-block">
          <h3>当时为什么要记</h3>
          <strong>${memory.translation}</strong>
          <p>${memory.mistake}</p>
        </div>
        <div class="review-controls">
          <button class="secondary-button" data-status="待复习" data-review-id="${memory.id}">还要复习</button>
          <button class="primary-button" data-status="已掌握" data-review-id="${memory.id}">已掌握</button>
        </div>
      </div>
      <div class="section-head">
        <h2>旅行轨迹</h2>
      </div>
      <div class="memory-list">
        ${state.memories
          .slice(0, 3)
          .map(
            (item) => `
          <button class="memory-row" data-detail="${item.id}">
            <span class="${thumbClass(item.thumb)}" aria-hidden="true"></span>
            <span><strong>${item.location}</strong><span>${item.translation} · ${item.scene}</span></span>
            <small>${item.topic}</small>
          </button>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function aiStatusSummary() {
  const checkedAt = state.aiConnection.checkedAt ? `上次检测：${formatShortDate(state.aiConnection.checkedAt)}` : "";
  if (state.aiConnection.status === "checking") {
    return {
      tone: "pending",
      title: "正在检测 AI 配置",
      body: "正在读取后端配置；如果本次页面已有 Key，会由你点击检测时发起一次同源测试请求。",
      meta: checkedAt,
    };
  }
  if (state.runtimeAiKey) {
    const verified = state.aiConnection.status === "verified";
    return {
      tone: verified ? "ready" : "pending",
      title: verified ? "本次手机页面 Key 已验证" : "本次手机页面已填写 DeepSeek Key",
      body: verified
        ? state.aiConnection.message || "已通过同源 /api/ai/explain 返回真实 AI 响应。"
        : "Key 只保存在当前页面内存里；刷新、关闭页面或重新部署后需要重新填写。可点击检测确认接口是否可用。",
      meta: [state.aiConnection.model ? `模型：${state.aiConnection.model}` : "", checkedAt].filter(Boolean).join(" · "),
    };
  }
  if (state.aiConnection.status === "server-key") {
    return {
      tone: "ready",
      title: "后端环境已配置 DeepSeek Key",
      body: state.aiConnection.message || "这台手机当前页面没有单独填写 Key，但同源后端已有环境 Key。",
      meta: [state.aiConnection.model ? `模型：${state.aiConnection.model}` : "", checkedAt].filter(Boolean).join(" · "),
    };
  }
  if (state.aiConnection.status === "missing-key") {
    return {
      tone: "warning",
      title: "当前页面没有 DeepSeek Key",
      body: state.aiConnection.message || "本次手机页面没有 Key，后端环境也未显示已配置；需要填写后才能做真实 AI 深度解释。",
      meta: checkedAt,
    };
  }
  if (state.aiConnection.status === "error") {
    return {
      tone: "warning",
      title: "AI 配置检测失败",
      body: state.aiConnection.message || "没有拿到可确认的 AI 状态。",
      meta: checkedAt,
    };
  }
  return {
    tone: state.settings.aiNetworkEnabled ? "pending" : "neutral",
    title: state.settings.aiNetworkEnabled ? "联网 AI 已开启，等待确认 Key 状态" : "联网 AI 未开启",
    body: state.settings.aiNetworkEnabled
      ? "如果你已经在这台手机页面填过 Key，这里会显示为已填写；否则请点击检测或重新填写。"
      : "当前使用本地/接口兜底；要用 DeepSeek 深度解释，需要填写 Key 或配置后端环境 Key。",
    meta: "",
  };
}

function hasAiKeyAvailable() {
  return Boolean(state.runtimeAiKey || state.aiConnection.status === "server-key");
}

function settingsScreen() {
  const ocrAdapter = getOcrAdapter();
  const aiAdapter = getAiAdapter();
  const aiStatus = aiStatusSummary();
  return `
    ${topbar("我的", "本地免费使用，云账户通过订阅扩容")}
    <div class="content">
      <div class="panel">
        <p class="panel-title">本地存储</p>
        <div class="storage-bar"><span></span></div>
        <p class="subtitle">已保存 ${state.memories.length} 条记忆，${state.sourceImages.length} 张来源图片，${getCounts().queue} 项待联网整理。超过设定量后可切换云存储。</p>
      </div>
      <div class="panel provider-panel" data-testid="ocr-provider-panel">
        <p class="panel-title">OCR 管线</p>
        <p class="subtitle">当前：${ocrAdapter.label} · ${ocrAdapter.mode}。本机优先；未开启云账户时不会上传图片。</p>
        <div class="provider-grid">
          ${ocrProviderOptions
            .map(
              (provider) => `
            <button class="provider-option ${state.settings.ocrProvider === provider.id ? "active" : ""}" data-ocr-provider="${provider.id}" data-testid="ocr-provider-${provider.id}">
              <strong>${provider.label}</strong>
              <span>${provider.description}</span>
            </button>
          `
            )
            .join("")}
        </div>
      </div>
      <div class="panel provider-panel">
        <p class="panel-title">AI 中文解释</p>
        <p class="subtitle">当前：${aiAdapter.label} · ${aiAdapter.mode}。Key 状态以这台手机当前页面会话为准。</p>
        <div class="ai-status-card ${aiStatus.tone}">
          <strong>${escapeHtml(aiStatus.title)}</strong>
          <span>${escapeHtml(aiStatus.body)}</span>
          ${aiStatus.meta ? `<small>${escapeHtml(aiStatus.meta)}</small>` : ""}
        </div>
        <div class="split-actions">
          <button class="secondary-button" data-action="open-api-key">${state.runtimeAiKey ? "更新 DeepSeek API Key" : "填写 DeepSeek API Key"}</button>
          <button class="primary-button" data-action="test-ai-connection">检测 AI 配置</button>
        </div>
      </div>
      <div class="panel provider-panel">
        <p class="panel-title">云账户订阅版</p>
        <div class="cloud-priority-grid">
          <span>AI 深度解释</span>
          <span>大容量图片存储</span>
        </div>
        <p class="subtitle">本地免费使用；订阅版优先解决深度解释和来源图片长期保存。</p>
      </div>

      <div class="settings-list">
        ${settingRow("autoSave", "自动保存翻译内容", "拍照识别后自动入库，减少手动操作")}
        ${settingRow("previewBeforeSave", "保存前预览确认", "开启后先显示预览，再确认入库")}
        ${settingRow("privacyBlur", "隐私模式", "优先处理地址、二维码、聊天头像和昵称")}
        ${settingRow("location", "按旅行城市记录地点", "开启后默认记录城市，不每次询问")}
        ${settingRow("cloudAfterLimit", "超出本地容量后使用云存储", "云同步、扩容和高级 AI 整理通过订阅实现")}
        ${settingRow("cloudUploadEnabled", "云账户开启后允许上传识别", "关闭时云端 OCR 只走接口占位，不上传来源图片")}
        ${settingRow("aiNetworkEnabled", "允许联网 AI 深度解释", "开启后调用同源 /api/ai/explain；本地 mock 不出网，DeepSeek Key 只放后端")}
      </div>

      <div class="section-head">
        <h2>导出与分享</h2>
      </div>
      <div class="settings-list">
        <button class="setting-row" data-action="process-queue"><span><strong>处理离线队列</strong><span>模拟有网后补充 AI 整理、分类和同步状态</span></span>${icon("cloud")}</button>
        <button class="setting-row" data-action="export-csv"><span><strong>导出 CSV 表格</strong><span>适合表格整理和二次分析</span></span>${icon("export")}</button>
        <button class="setting-row" data-action="export-md"><span><strong>导出 Markdown</strong><span>适合笔记和本地知识库</span></span>${icon("export")}</button>
        <button class="setting-row" data-action="memory-book"><span><strong>生成 QQ/微信旅行语言回忆册</strong><span>按城市、日期和场景生成分享内容</span></span>${icon("book")}</button>
      </div>
    </div>
  `;
}

function apiKeyDialog() {
  return `
    <div class="sheet-backdrop" data-action="close-api-key" aria-hidden="true"></div>
    <section class="api-key-modal" role="dialog" aria-modal="true" aria-label="填写 DeepSeek API Key">
      <div class="sheet-grip" aria-hidden="true"></div>
      <div class="sheet-head">
        <div>
          <h2>填写 DeepSeek API Key</h2>
          <p>${state.apiKeyDialog.message || "需要真实 AI 解释时才会用到。Key 只保存在本次手机页面会话里。"}</p>
        </div>
        <button class="icon-button" data-action="close-api-key" aria-label="关闭">${icon("back")}</button>
      </div>
      <form class="api-key-form" data-api-key-form>
        <label class="api-key-field">
          <span>API Key</span>
          <input data-api-key-input type="password" autocomplete="off" spellcheck="false" value="${escapeAttr(state.apiKeyDialog.apiKey)}" placeholder="sk-..." />
        </label>
        <p class="subtitle">不会写入 IndexedDB、导出文件或 iOS 包。刷新页面或重新打开后需要重新填写。</p>
        <div class="sheet-actions">
          <button class="secondary-button" type="button" data-action="close-api-key">取消</button>
          <button class="primary-button" type="submit">保存并继续</button>
        </div>
      </form>
    </section>
  `;
}

function settingRow(key, title, desc) {
  return `
    <button class="setting-row" data-toggle="${key}">
      <span><strong>${title}</strong><span>${desc}</span></span>
      <span class="toggle ${state.settings[key] ? "on" : ""}" aria-hidden="true"></span>
    </button>
  `;
}

function exportSheet() {
  const options = state.exportOptions;
  const exportMemories = getExportMemories(options.scope);
  const selectedFieldCount = getSelectedExportFields().length;
  const formats = [
    ["csv", "CSV 表格"],
    ["markdown", "Markdown"],
    ["memoryBook", "QQ/微信回忆册"],
  ];

  return `
    <div class="sheet-backdrop" data-action="close-export" aria-hidden="true"></div>
    <section class="export-sheet" role="dialog" aria-modal="true" aria-label="选择导出内容">
      <div class="sheet-grip" aria-hidden="true"></div>
      <div class="sheet-head">
        <div>
          <h2>选择导出内容</h2>
          <p>${exportMemories.length} 条记忆 · ${selectedFieldCount} 个字段</p>
        </div>
        <button class="icon-button" data-action="close-export" aria-label="关闭">${icon("back")}</button>
      </div>

      <div class="export-section">
        <h3>导出格式</h3>
        <div class="segmented">
          ${formats
            .map(
              ([format, label]) => `
            <button class="${options.format === format ? "active" : ""}" data-export-format="${format}">${label}</button>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="export-section">
        <h3>导出范围</h3>
        <div class="export-chip-grid">
          ${exportScopes
            .map(([scope, label]) => {
              const count = getExportMemories(scope).length;
              return `<button class="export-chip ${options.scope === scope ? "active" : ""}" data-export-scope="${scope}">${label}<span>${count}</span></button>`;
            })
            .join("")}
        </div>
      </div>

      <div class="export-section">
        <h3>导出字段</h3>
        <div class="field-grid">
          ${exportFields
            .map(([field, label]) => {
              const selected = options.fields[field];
              return `
                <button class="field-toggle ${selected ? "active" : ""}" data-export-field="${field}">
                  <span class="check-box">${selected ? icon("check") : ""}</span>
                  <span>${label}</span>
                </button>
              `;
            })
            .join("")}
        </div>
      </div>

      <div class="sheet-actions">
        <button class="secondary-button" data-action="close-export">取消</button>
        <button class="primary-button" data-action="run-export">导出所选内容</button>
      </div>
    </section>
  `;
}

function getCounts() {
  return {
    total: state.memories.length,
    review: state.memories.filter((item) => item.status !== "已掌握").length,
    mastered: state.memories.filter((item) => item.status === "已掌握").length,
    queue: state.queue.filter((task) => task.status === "pending").length,
  };
}

function sortMemories(memories) {
  return [...memories].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function sortQueue(queue) {
  return [...queue].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function sortSourceImages(sourceImages) {
  return [...sourceImages].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function createImageUrlMap(sourceImages) {
  return sourceImages.reduce((urls, image) => {
    if (image.blob) urls[image.id] = URL.createObjectURL(image.blob);
    return urls;
  }, {});
}

function appendUnique(values, value) {
  if (!value || values.includes(value)) return values;
  return [...values, value];
}

function filteredMemories() {
  const query = state.search.trim().toLowerCase();
  return state.memories.filter((memory) => {
    const filterMatch =
      state.filter === "全部" ||
      memory.topic === state.filter ||
      memory.status === state.filter ||
      memory.source === state.filter;
    const haystack = [memory.original, memory.translation, memory.language, memory.topic, memory.scene, memory.location, memory.story]
      .join(" ")
      .toLowerCase();
    return filterMatch && (!query || haystack.includes(query));
  });
}

function thumbClass(type) {
  return {
    menu: "menu-thumb",
    sign: "sign-thumb",
    manual: "manual-thumb",
  }[type] || "menu-thumb";
}

function sourcePreview(memory) {
  const imageUrl = memory.sourceImageId ? state.imageUrls[memory.sourceImageId] : "";
  if (imageUrl) {
    return `<span class="source-image-preview"><img src="${imageUrl}" alt="来源图片局部预览" /></span>`;
  }
  return `<span class="${thumbClass(memory.thumb)}" aria-hidden="true"></span>`;
}

function sourceOcrSummary(memory) {
  const sourceImage = memory.sourceImageId ? state.sourceImages.find((item) => item.id === memory.sourceImageId) : null;
  if (!sourceImage) return "";
  if (sourceImage.ocr?.status === "done") {
    const ocr = sourceImage.ocr;
    const fallback = ocr.fallbackFrom ? `${getOcrProviderLabel(ocr.fallbackFrom)} 不可用，已用${ocr.providerLabel || getOcrProviderLabel(ocr.provider)}。` : `使用${ocr.providerLabel || getOcrProviderLabel(ocr.provider)}。`;
    const reason = ocr.fallbackReason ? ` ${ocr.fallbackReason}` : "";
    const savedCount = sourceImage.weightedOcrBlocks?.length || sourceImage.recommendedKeyBlocks?.length || ocr.blocks.length || 0;
    return ` OCR 已识别 ${ocr.blocks.length} 个文字块，自动入库 ${savedCount} 条并按权重排序，${fallback}${reason}`;
  }
  if (sourceImage.ocrStatus === "failed") {
    return sourceImage.lastOcrError || " OCR 还没有完成。图片已保存，可以重试或手动输入文字。";
  }
  return " OCR 等待离线队列处理。";
}

function occurrenceTimeline(memory) {
  const records = getOccurrenceRecords(memory);
  return records
    .map(
      (record, index) => `
        <div class="occurrence-item">
          <span class="occurrence-index">${index + 1}</span>
          <span>
            <strong>${record.location || memory.location}</strong>
            <span>${formatShortDate(record.createdAt || memory.createdAt)} · ${record.source || memory.source} · ${record.scene || memory.scene}</span>
            <small>${record.note || "保留这次出现的来源和场景。"}</small>
          </span>
        </div>
      `
    )
    .join("");
}

function getOccurrenceRecords(memory) {
  if (memory.occurrenceRecords?.length) return memory.occurrenceRecords;
  return [
    {
      sourceImageId: memory.sourceImageId || "",
      createdAt: memory.createdAt,
      location: memory.location,
      source: memory.source,
      scene: memory.scene,
      note: memory.story,
    },
  ];
}

function contentLevelBlock(memory) {
  return `
    <div class="detail-block">
      <h3>内容层级</h3>
      <div class="level-list">${(memory.contentBlocks || []).map((block) => manualBlockItem(block)).join("")}</div>
    </div>
  `;
}

function sourceDescription(memory) {
  if (memory.sourceKind === "manual-text") {
    const blockCount = memory.contentBlocks?.length || 1;
    const pending = memory.pending ? " 正在等待 AI 生成自然译法和学习解释。" : "";
    return `${memory.source || "手动输入"} · 已保存原文和 ${blockCount} 个层级内容。已出现 ${memory.occurrences || 1} 次。${pending}`;
  }
  return `${memory.source} · 原图默认隐藏，只展示文字区域。已出现 ${memory.occurrences} 次。${sourceOcrSummary(memory)}`;
}

function normalizeManualText(value) {
  return String(value || "")
    .replace(/\r\n?/gu, "\n")
    .replace(/[ \t]+/gu, " ")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();
}

function splitManualText(text) {
  if (!text) return [];
  const blocks = [];
  if (text.length > 80 || text.includes("\n")) {
    addManualBlock(blocks, text, "paragraph", 100);
  }

  const sentences = text.match(/[^。！？!?；;.\n]+[。！？!?；;.]?/gu) || [];
  sentences
    .map((item) => item.trim())
    .filter((item) => item.length >= 2)
    .slice(0, 6)
    .forEach((item) => addManualBlock(blocks, item, inferManualLevel(item), item.length > 24 ? 88 : 82));

  text
    .split(/[\n。！？!?；;.,，、:：()（）"“”]+/u)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2 && item.length <= 36 && item !== text)
    .slice(0, 8)
    .forEach((item) => addManualBlock(blocks, item, "phrase", 72));

  const wordMatches =
    text.match(/[A-Za-z][A-Za-z'-]{1,}|[\p{Script=Hiragana}\p{Script=Katakana}ー]{2,}|[\p{Script=Hangul}]{2,}|[\p{Script=Han}]{1,4}|[ก-๙]{2,}/gu) || [];
  wordMatches
    .map((item) => item.trim())
    .filter((item) => item.length >= 2 && item.length <= 18)
    .slice(0, 10)
    .forEach((item) => addManualBlock(blocks, item, "word", 58));

  if (blocks.length === 0) addManualBlock(blocks, text, inferManualLevel(text), 82);
  return blocks.sort((a, b) => b.weight - a.weight).slice(0, 12);
}

function addManualBlock(blocks, text, level, weight) {
  const normalized = normalizeManualText(text);
  if (!normalized) return;
  const key = normalized.toLocaleLowerCase();
  if (blocks.some((block) => block.key === key)) return;
  const levelValue = typeof level === "string" ? level : inferManualLevel(normalized);
  blocks.push({
    id: `manual-block-${blocks.length + 1}`,
    key,
    text: normalized,
    level: levelValue,
    levelLabel: manualLevelLabel(levelValue),
    language: getManualInputLanguageLabel(),
    weight,
  });
}

function inferManualLevel(text) {
  const normalized = normalizeManualText(text);
  if (normalized.includes("\n") || normalized.length > 80) return "paragraph";
  if (/[。！？!?；;.]/u.test(normalized) || normalized.split(/\s+/u).length > 6 || normalized.length > 36) return "sentence";
  if (normalized.split(/\s+/u).length > 1 || normalized.length > 6) return "phrase";
  return "word";
}

function manualLevelLabel(level) {
  return {
    word: "单词",
    phrase: "短语",
    sentence: "句子",
    paragraph: "段落",
  }[level] || "表达";
}

function summarizeManualLevels(blocks) {
  if (!blocks.length) return "输入后会自动拆成单词、短语、句子和表达层级。";
  const counts = blocks.reduce((result, block) => {
    result[block.levelLabel] = (result[block.levelLabel] || 0) + 1;
    return result;
  }, {});
  return Object.entries(counts)
    .map(([label, count]) => `${label} ${count}`)
    .join(" · ");
}

function manualBlockItem(block) {
  return `
    <span class="level-item">
      <small>${escapeHtml(block.levelLabel)} · 权重 ${block.weight}</small>
      <strong>${escapeHtml(clipText(block.text, 80))}</strong>
    </span>
  `;
}

function buildManualMemoryDraft(text, blocks = splitManualText(text)) {
  const language = getManualInputLanguageLabel();
  const targetLanguage = getManualOutputLanguageLabel();
  const targetLanguageCode = state.settings.manualTargetLanguage || "zh";
  const scene = inferManualScene(text);
  const translation = quickTranslateManualText(text);
  const level = manualLevelLabel(inferManualLevel(text));
  const similar = blocks
    .filter((block) => block.text !== text)
    .slice(0, 5)
    .map((block) => block.text);
  return {
    original: text,
    translation: translation.text,
    literal: translation.literal,
    language,
    targetLanguage,
    targetLanguageCode,
    level,
    weight: blocks[0]?.weight || 82,
    topic: manualTopicForScene(scene),
    scene,
    tone: "中性",
    difficulty: inferManualDifficulty(text),
    usage: translation.known
      ? `${scene}里可以直接理解为“${translation.text}”。`
      : `已保存原文和拆分层级；填写 DeepSeek Key 后会补充自然${targetLanguage}译法、使用场景、例句和易错点。`,
    example: `${clipText(text, 72)} / ${translation.known ? translation.text : `等待 DeepSeek 生成${targetLanguage}译法`}`,
    similar: similar.length ? similar : [level, scene],
    mistake: translation.known ? "不要只背中文，要连同出现的场景一起记。" : "长句和段落不要只逐词硬背，先理解整句语气和使用场景。",
    contentBlocks: blocks,
    translationPending: !translation.known,
  };
}

function quickTranslateManualText(text) {
  const normalized = normalizeManualText(text);
  const lower = normalized.toLocaleLowerCase();
  const targetLanguage = getManualLanguageOption("target", state.settings.manualTargetLanguage);
  const targetIsChinese = targetLanguage.id === "zh";
  const match = targetIsChinese ? manualTranslationHints.find(([source]) => lower.includes(source.toLocaleLowerCase())) : null;
  if (match) {
    return {
      text: match[1],
      literal: match[2],
      known: true,
    };
  }
  if (targetIsChinese && /[\u4e00-\u9fff]/u.test(normalized) && !/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(normalized)) {
    return {
      text: "已是中文内容",
      literal: normalized,
      known: true,
    };
  }
  return {
    text: `待翻译成${targetLanguage.label}：${clipText(normalized, 18)}`,
    literal: "等待生成直译参考",
    known: false,
  };
}

function getManualLanguageOption(kind, id) {
  const options = kind === "target" ? manualTargetLanguageOptions : manualSourceLanguageOptions;
  return options.find((item) => item.id === id) || options[0];
}

function getManualInputLanguageLabel() {
  return getManualLanguageOption("source", state.settings.manualSourceLanguage).label;
}

function getManualOutputLanguageLabel() {
  return getManualLanguageOption("target", state.settings.manualTargetLanguage).label;
}

function manualLanguageSelector(title, kind, options, selectedId) {
  return `
    <section class="manual-language-group" aria-label="${escapeAttr(title)}">
      <div class="manual-language-head">
        <strong>${escapeHtml(title)}</strong>
        <span>${kind === "source" ? "不预设英文" : "选择后保持"}</span>
      </div>
      <div class="manual-language-row">
        ${options
          .map(
            (option) => `
          <button type="button" class="${option.id === selectedId ? "active" : ""}" data-manual-language-kind="${kind}" data-manual-language="${option.id}">
            <strong>${escapeHtml(option.label)}</strong>
            <small>${escapeHtml(option.hint)}</small>
          </button>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

function inferManualLanguage(text) {
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text)) return "日文";
  if (/[\p{Script=Hangul}]/u.test(text)) return "韩文";
  if (/[ก-๙]/u.test(text)) return "泰文";
  if (/[A-Za-z]/u.test(text)) return "英文";
  if (/[\u4e00-\u9fff]/u.test(text)) return "中文/汉字";
  return "自动识别";
}

function inferManualScene(text) {
  const lower = text.toLocaleLowerCase();
  if (/ラーメン|menu|restaurant|spicy|take away|dine in|餐|菜单|咖啡|饭|食/u.test(lower)) return "餐厅点餐";
  if (/exit|entrance|station|platform|boarding gate|gate|出口|入口|站|机场|登机/u.test(lower)) return "交通指路";
  if (/cash only|tax free|sale|price|coupon|购物|免税|付款|现金/u.test(lower)) return "购物付款";
  if (/how to use|instruction|warning|caution|manual|説明|说明|使用|注意/u.test(lower)) return "商品说明";
  if (/check-in|hotel|passport|booking|reservation|酒店|护照|预约/u.test(lower)) return "住宿出行";
  return "旅行场景";
}

function manualTopicForScene(scene, fallback = "旅行") {
  return {
    餐厅点餐: "餐饮",
    交通指路: "交通",
    购物付款: "购物",
    商品说明: "购物",
    住宿出行: "旅行",
  }[scene] || fallback;
}

function inferManualDifficulty(text) {
  const length = normalizeManualText(text).length;
  if (length <= 16) return "A1";
  if (length <= 48) return "A2";
  if (length <= 120) return "B1";
  return "B2";
}

function clipText(value, maxLength = 40) {
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function recommendKeyBlocks(blocks = []) {
  return [...blocks]
    .filter((block) => block.text && block.confidence >= 0.86)
    .sort((a, b) => blockPriorityScore(b) - blockPriorityScore(a))
    .slice(0, 2);
}

function rankOcrBlocks(blocks = []) {
  return [...blocks]
    .filter((block) => normalizeManualText(block.text))
    .map((block) => ({
      ...block,
      memoryWeight: memoryWeightForBlock(block),
    }))
    .sort((a, b) => b.memoryWeight - a.memoryWeight);
}

function memoryWeightForBlock(block) {
  return Math.max(1, Math.min(100, Math.round(blockPriorityScore(block) * 6.5)));
}

function blockPriorityScore(block) {
  const levelBoost = { expression: 4, phrase: 3, sentence: 2, word: 1 }[block.level] || 1;
  const lengthBoost = Math.min(String(block.text || "").length / 10, 4);
  return block.confidence * 10 + levelBoost + lengthBoost;
}

function formatShortDate(value) {
  if (!value) return "时间未记录";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function bindEvents(root) {
  root.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      if (state.activeTab !== "detail") state.detailId = null;
      saveState();
      render();
    });
  });

  root.querySelectorAll("[data-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = "detail";
      state.detailId = button.dataset.detail;
      saveState();
      render();
    });
  });

  root.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      saveState();
      render();
    });
  });

  root.querySelector("[data-search]")?.addEventListener("input", (event) => {
    state.search = event.target.value;
    saveState();
    render();
  });

  root.querySelector("[data-api-key-input]")?.addEventListener("input", (event) => {
    state.apiKeyDialog.apiKey = event.target.value;
  });

  root.querySelector("[data-api-key-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveRuntimeApiKey();
  });

  root.querySelector("[data-manual-text]")?.addEventListener("input", (event) => {
    state.manualInput.text = event.target.value;
    state.manualInput.previewReady = false;
    state.manualInput.previewDraft = null;
  });

  root.querySelector("[data-manual-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (state.manualInput.previewReady) {
      await addManualMemory();
    } else {
      await previewManualMemory();
    }
  });

  root.querySelectorAll("[data-manual-sample]").forEach((button) => {
    button.addEventListener("click", () => {
      state.manualInput.text = button.dataset.manualSample || "";
      state.manualInput.previewReady = false;
      state.manualInput.previewDraft = null;
      render();
    });
  });

  root.querySelectorAll("[data-manual-language]").forEach((button) => {
    button.addEventListener("click", async () => {
      const kind = button.dataset.manualLanguageKind;
      const value = button.dataset.manualLanguage;
      if (kind === "source") {
        state.settings.manualSourceLanguage = value;
      } else {
        state.settings.manualTargetLanguage = value;
      }
      state.manualInput.previewReady = false;
      state.manualInput.previewDraft = null;
      await storage.saveSettings(state.settings);
      render();
      toast(`${kind === "source" ? "输入语言" : "输出语言"}已设为：${button.querySelector("strong").textContent}`);
    });
  });

  root.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.toggle;
      state.settings[key] = !state.settings[key];
      await storage.saveSettings(state.settings);
      toast(`${state.settings[key] ? "已开启" : "已关闭"}：${button.querySelector("strong").textContent}`);
    });
  });

  root.querySelectorAll("[data-ocr-provider]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.settings.ocrProvider = button.dataset.ocrProvider;
      await storage.saveSettings(state.settings);
      toast(`已切换 OCR：${getOcrProviderLabel(state.settings.ocrProvider)}`);
    });
  });

  root.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.reviewId || state.detailId;
      await updateStatus(id, button.dataset.status);
    });
  });

  root.querySelector("#photoInput")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await storeImportedImage(file);
  });

  root.querySelectorAll("[data-export-format]").forEach((button) => {
    button.addEventListener("click", () => {
      state.exportOptions.format = button.dataset.exportFormat;
      render();
    });
  });

  root.querySelectorAll("[data-export-scope]").forEach((button) => {
    button.addEventListener("click", () => {
      state.exportOptions.scope = button.dataset.exportScope;
      render();
    });
  });

  root.querySelectorAll("[data-export-field]").forEach((button) => {
    button.addEventListener("click", () => {
      const field = button.dataset.exportField;
      state.exportOptions.fields[field] = !state.exportOptions.fields[field];
      render();
    });
  });

  root.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action));
  });
}

async function handleAction(action) {
  if (action === "save-capture" || action === "preview-save" || action === "accept-all") {
    await addCapturedMemory(action);
    return;
  }
  if (action === "clear-manual") {
    state.manualInput = { text: "", previewReady: false, previewDraft: null, translating: false };
    render();
    return;
  }
  if (action === "edit-manual") {
    state.manualInput.previewReady = false;
    state.manualInput.previewDraft = null;
    render();
    return;
  }
  if (action === "open-camera") {
    triggerPhotoInput();
    return;
  }
  if (action === "retry-ocr") {
    await retryCurrentOcr();
    return;
  }
  if (action === "manual-from-image") {
    state.activeTab = "manual";
    state.manualInput = { text: "", previewReady: false, previewDraft: null, translating: false };
    render();
    toast("请把图片里的文字输入或粘贴到这里，会按当前语言设置翻译");
    return;
  }
  if (action === "process-queue") {
    await processOfflineQueue();
    return;
  }
  if (action === "export" || action === "export-csv") {
    openExportPanel("csv");
    return;
  }
  if (action === "export-md") {
    openExportPanel("markdown");
    return;
  }
  if (action === "memory-book") {
    openExportPanel("memoryBook");
    return;
  }
  if (action === "close-export") {
    state.exportOptions.open = false;
    render();
    return;
  }
  if (action === "open-api-key") {
    openApiKeyDialog("填写后会切到 DeepSeek 真实解释；Key 只保存在本次手机页面会话。");
    return;
  }
  if (action === "close-api-key") {
    closeApiKeyDialog();
    return;
  }
  if (action === "test-ai-connection") {
    await testAiConnection();
    return;
  }
  if (action === "run-export") {
    runSelectedExport();
    return;
  }
  if (action === "reveal-review") {
    state.reviewRevealed = true;
    render();
    return;
  }
  if (action === "edit-memory") {
    openEditMemoryDialog();
    return;
  }
  if (action === "more-memory") {
    openMoreMemorySheet();
    return;
  }
  if (action === "close-edit-memory") {
    state.editingMemory = null;
    render();
    return;
  }
  if (action === "save-edit-memory") {
    await saveEditMemory();
    return;
  }
  if (action === "close-more-memory") {
    state.moreMemorySheet = false;
    render();
    return;
  }
  if (action === "delete-memory") {
    await deleteCurrentMemory();
    return;
  }
  if (action === "mark-memory-mastered") {
    await markCurrentMemoryMastered();
    return;
  }
}

function triggerPhotoInput() {
  const input = document.querySelector("#photoInput");
  if (!input) {
    toast("相机入口暂不可用，请刷新页面后重试");
    return;
  }
  input.value = "";
  input.click();
}

async function retryCurrentOcr() {
  const sourceImage = getCurrentSourceImage();
  if (!sourceImage) {
    toast("没有可重试的来源图片");
    return;
  }
  sourceImage.ocrStatus = "processing";
  sourceImage.lastOcrError = "";
  sourceImage.updatedAt = new Date().toISOString();
  await saveAndReplaceSourceImage(sourceImage);
  render();
  toast("正在重新识别图片文字");
  try {
    const generatedMemoryCount = await recognizeAndStoreSourceImage(sourceImage);
    await markOcrTaskDone(sourceImage.id);
    state.queue = sortQueue(await storage.clearCompletedQueue());
    render();
    toast(`照片已识别，自动入库 ${generatedMemoryCount} 条文字`);
  } catch (error) {
    await markSourceImageOcrFailed(sourceImage, error);
    render();
    toast(readableErrorMessage(error, "OCR 识别失败，请重试"));
  }
}

async function addCapturedMemory(action) {
  const suggestion = captureSuggestions[0];
  const existing = state.memories.find((item) => item.original === suggestion.original);
  const now = new Date().toISOString();
  const sourceImageId = state.lastSourceImageId || "";
  let memory;
  if (existing) {
    existing.occurrences += 1;
    existing.createdAt = now;
    existing.story = "2026 年 7 月在东京餐厅菜单上再次看到，系统已合并为同一表达并保留新场景。";
    existing.pending = true;
    existing.source = state.lastImportName || existing.source || "菜单";
    existing.sourceImageId = sourceImageId || existing.sourceImageId || "";
    existing.sourceImageIds = appendUnique(existing.sourceImageIds || [], sourceImageId);
    existing.occurrenceRecords = [
      ...(existing.occurrenceRecords || []),
      {
        sourceImageId,
        createdAt: now,
        location: state.settings.location ? "日本 · 东京" : "可手动填写",
        source: state.lastImportName || existing.source || "菜单",
        scene: existing.scene,
        note: "再次出现时合并为同一表达，并保留这次场景。",
      },
    ];
    memory = existing;
  } else {
    memory = {
      id: `mem-${Date.now()}`,
      original: suggestion.original,
      translation: suggestion.translation,
      literal: suggestion.literal,
      language: "日文",
      level: "表达",
      weight: 92,
      topic: "餐饮",
      scene: "餐厅点餐",
      tone: "中性",
      difficulty: "B1",
      usage: "菜单里常见的菜名表达，适合记住“特製”和“味噌”的组合。",
      example: "この特製味噌ラーメンは人気があります。 / 这款特制味噌拉面很受欢迎。",
      similar: ["味噌汁", "醤油ラーメン", "おすすめメニュー"],
      mistake: "不要把“特製”理解成免费或套餐，它只是特别制作/招牌风味。",
      location: state.settings.location ? "日本 · 东京" : "可手动填写",
      story: "2026 年 7 月在东京餐厅菜单上看到。",
      status: "待复习",
      occurrences: 1,
      createdAt: now,
      source: state.lastImportName || "菜单",
      thumb: "menu",
      pending: true,
      sourceImageId,
      sourceImageIds: sourceImageId ? [sourceImageId] : [],
      occurrenceRecords: [
        {
          sourceImageId,
          createdAt: now,
          location: state.settings.location ? "日本 · 东京" : "可手动填写",
          source: state.lastImportName || "菜单",
          scene: "餐厅点餐",
          note: "OCR 内容会全部入库，系统按权重安排复习优先级。",
        },
      ],
    };
    state.memories.unshift(memory);
  }
  await storage.saveMemory(memory);
  const task = {
    id: `task-${Date.now()}`,
    type: "ai-enrich-capture",
    memoryId: memory.id,
    sourceImageId,
    title: `补整理：${memory.translation}`,
  };
  state.queue.unshift(await storage.enqueueTask(task));
  state.memories = sortMemories(state.memories);
  const label = action === "accept-all" ? "已确认全部 OCR 内容入库" : "已保存记忆";
  toast(`${label}，已进入离线队列，联网后补充 AI 整理`);
}

async function previewManualMemory() {
  const text = normalizeManualText(state.manualInput.text);
  if (!text) {
    toast("请先输入要翻译的文字");
    return;
  }
  const blocks = splitManualText(text);
  let draft = buildManualMemoryDraft(text, blocks);
  if (draft.translationPending) {
    if (state.settings.aiProvider === "domestic-model-service" && !hasAiKeyAvailable()) {
      state.manualInput.text = text;
      state.manualInput.previewReady = false;
      state.manualInput.previewDraft = null;
      openApiKeyDialog("输入文字需要先翻译。填写 DeepSeek API Key 后，会直接生成译文预览；Key 只保存在本次页面会话。", "translate-manual");
      return;
    }

    state.manualInput = { ...state.manualInput, text, translating: true, previewReady: false, previewDraft: null };
    render();
    try {
      draft = await enrichManualDraft(draft, text, blocks);
    } catch (error) {
      state.manualInput = { ...state.manualInput, translating: false, previewReady: false, previewDraft: null };
      render();
      toast(error instanceof Error ? error.message : "翻译失败，请稍后重试");
      return;
    }
  }
  state.manualInput.text = text;
  state.manualInput.previewDraft = draft;
  state.manualInput.previewReady = true;
  state.manualInput.translating = false;
  render();
  toast("已生成译文预览，确认后保存到记忆库");
}

async function addManualMemory() {
  const text = normalizeManualText(state.manualInput.text);
  if (!text) {
    toast("请先输入要翻译的文字");
    return;
  }
  if (!state.manualInput.previewReady) {
    previewManualMemory();
    return;
  }

  const blocks = splitManualText(text);
  const draft = state.manualInput.previewDraft?.original === text ? state.manualInput.previewDraft : buildManualMemoryDraft(text, blocks);
  if (draft.translationPending) {
    await previewManualMemory();
    return;
  }
  const now = new Date().toISOString();
  const location = state.settings.location ? "当前旅行城市" : "可手动填写";
  const existing = state.memories.find((item) => normalizeManualText(item.original).toLocaleLowerCase() === text.toLocaleLowerCase());
  let memory;

  if (existing) {
    existing.occurrences = (existing.occurrences || 0) + 1;
    existing.createdAt = now;
    existing.pending = true;
    existing.sourceKind = existing.sourceKind || "manual-text";
    existing.source = existing.source || "手动输入";
    existing.language = draft.language;
    existing.targetLanguage = draft.targetLanguage;
    existing.targetLanguageCode = draft.targetLanguageCode;
    existing.translation = draft.translation;
    existing.literal = draft.literal;
    existing.contentBlocks = draft.contentBlocks;
    existing.fullText = text;
    existing.occurrenceRecords = [
      ...(existing.occurrenceRecords || []),
      {
        sourceImageId: "",
        createdAt: now,
        location,
        source: "手动输入",
        scene: draft.scene,
        note: "再次手动输入时合并到同一条记忆，并保留这次上下文。",
      },
    ];
    memory = existing;
  } else {
    memory = {
      id: `mem-manual-${Date.now()}`,
      ...draft,
      location,
      story: `${formatShortDate(now)} 手动输入这段文字，保存为可复习的旅行语言记忆。`,
      status: "待复习",
      occurrences: 1,
      createdAt: now,
      source: "手动输入",
      sourceKind: "manual-text",
      thumb: "manual",
      pending: true,
      fullText: text,
      occurrenceRecords: [
        {
          sourceImageId: "",
          createdAt: now,
          location,
          source: "手动输入",
          scene: draft.scene,
          note: "由手动输入保存；系统自动拆分为词、短语、句子或段落层级。",
        },
      ],
    };
    state.memories.unshift(memory);
  }

  await storage.saveMemory(memory);
  const task = await storage.enqueueTask({
    id: `task-${Date.now()}-manual-ai`,
    type: "ai-enrich-manual",
    memoryId: memory.id,
    title: `翻译整理：${clipText(text, 20)}`,
  });
  state.queue = sortQueue([task, ...state.queue]);
  state.memories = sortMemories(state.memories);
  state.manualInput = { text: "", previewReady: false, previewDraft: null, translating: false };
  state.activeTab = "manual";
  state.detailId = null;
  toast("已保存到记忆库，并加入复习与深度解释队列");
}

async function enrichManualDraft(draft, text, blocks) {
  const enrichment = await getAiAdapter().enrichMemory(
    {
      ...draft,
      sourceKind: "manual-text",
      fullText: text,
      pending: true,
    },
    {
      inputMode: "manual-text",
      manualText: text,
      contentBlocks: blocks,
    }
  );
  if (enrichment.status === "api-key-required") {
    openApiKeyDialog("需要 DeepSeek API Key 才能翻译这段文字。保存后会继续生成译文预览。", "translate-manual");
    throw new Error("需要填写 DeepSeek API Key 才能翻译");
  }
  if (enrichment.status === "provider-error") {
    throw new Error(enrichment.error || "DeepSeek 翻译失败");
  }
  return applyEnrichmentToDraft(draft, enrichment);
}

function applyEnrichmentToDraft(draft, enrichment) {
  const sections = enrichment.sections || {};
  return {
    ...draft,
    translation: sections.natural || draft.translation,
    literal: sections.literal || draft.literal,
    scene: sections.scene || draft.scene,
    topic: sections.scene ? manualTopicForScene(sections.scene, draft.topic) : draft.topic,
    tone: sections.tone || draft.tone,
    usage: enrichment.usage || draft.usage,
    example: sections.example || draft.example,
    similar: Array.isArray(sections.similar) && sections.similar.length ? sections.similar : draft.similar,
    mistake: sections.mistake || draft.mistake,
    pending: false,
    translationPending: false,
    aiStatus: enrichment.status,
    aiExplanation: sections,
    aiProvider: enrichment.provider,
    aiProviderLabel: getAiProviderLabel(enrichment.provider),
    aiModelProvider: enrichment.modelProvider || "",
    aiModel: enrichment.model || "",
    aiServerMode: enrichment.serverMode || "",
    aiResponseId: enrichment.providerResponseId || "",
    enrichedAt: enrichment.enrichedAt,
  };
}

function getCurrentSourceImage() {
  return state.lastSourceImageId ? state.sourceImages.find((item) => item.id === state.lastSourceImageId) : null;
}

async function saveAndReplaceSourceImage(sourceImage) {
  await storage.saveSourceImage(sourceImage);
  state.sourceImages = sortSourceImages(
    state.sourceImages.some((item) => item.id === sourceImage.id)
      ? state.sourceImages.map((item) => (item.id === sourceImage.id ? sourceImage : item))
      : [sourceImage, ...state.sourceImages]
  );
}

async function markSourceImageOcrFailed(sourceImage, error) {
  sourceImage.ocrStatus = "failed";
  sourceImage.lastOcrError = readableErrorMessage(error, "OCR 识别失败，请重试");
  sourceImage.updatedAt = new Date().toISOString();
  await saveAndReplaceSourceImage(sourceImage);
}

async function markOcrTaskDone(sourceImageId) {
  const task = state.queue.find((item) => item.type === "ocr-source-image" && item.sourceImageId === sourceImageId);
  if (!task) return;
  await storage.updateTask({ ...task, status: "done", completedAt: new Date().toISOString(), lastError: "" });
}

function readableErrorMessage(error, fallback) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

async function storeImportedImage(file) {
  const now = new Date().toISOString();
  const sourceImage = {
    id: `img-${Date.now()}`,
    kind: "camera-or-upload",
    originalName: file.name || "相机照片",
    mimeType: file.type || "image/*",
    size: file.size,
    blob: file,
    createdAt: now,
    privacyBlur: state.settings.privacyBlur,
    locationMode: state.settings.location ? "city-auto" : "manual-optional",
    displayName: file.name || "相机照片",
    ocrStatus: "processing",
    lastOcrError: "",
  };

  await storage.saveSourceImage(sourceImage);
  const task = await storage.enqueueTask({
    id: `task-${Date.now()}-ocr`,
    type: "ocr-source-image",
    sourceImageId: sourceImage.id,
    title: `OCR 待处理：${sourceImage.displayName}`,
  });

  state.lastImportName = sourceImage.displayName;
  state.lastSourceImageId = sourceImage.id;
  state.sourceImages = sortSourceImages([sourceImage, ...state.sourceImages]);
  state.imageUrls[sourceImage.id] = URL.createObjectURL(file);
  state.queue = sortQueue([task, ...state.queue]);
  state.activeTab = "capture";
  render();
  toast(`已保存来源图片：${sourceImage.displayName}，正在识别文字`);
  try {
    const generatedMemoryCount = await recognizeAndStoreSourceImage(sourceImage);
    await storage.updateTask({ ...task, status: "done", completedAt: new Date().toISOString(), lastError: "" });
    state.queue = sortQueue(await storage.clearCompletedQueue());
    render();
    toast(`照片已识别，自动入库 ${generatedMemoryCount} 条文字`);
  } catch (error) {
    await markSourceImageOcrFailed(sourceImage, error);
    await storage.updateTask({ ...task, status: "pending", lastError: readableErrorMessage(error, "OCR failed") });
    state.queue = sortQueue(await storage.clearCompletedQueue());
    render();
    toast(readableErrorMessage(error, "OCR 识别失败，请重试"));
  }
}

async function updateStatus(id, status) {
  const memory = state.memories.find((item) => item.id === id);
  if (memory) {
    memory.status = status;
    state.reviewRevealed = false;
    await storage.saveMemory(memory);
    toast(`已标记为：${status}`);
  }
}

function applyEnrichmentToMemory(memory, enrichment) {
  const sections = enrichment.sections || {};
  if (sections.natural) memory.translation = sections.natural;
  if (sections.literal) memory.literal = sections.literal;
  if (sections.scene) {
    memory.scene = sections.scene;
    memory.topic = manualTopicForScene(sections.scene, "") || memory.topic;
  }
  if (sections.tone) memory.tone = sections.tone;
  if (sections.example) memory.example = sections.example;
  if (Array.isArray(sections.similar) && sections.similar.length) memory.similar = sections.similar;
  if (sections.mistake) memory.mistake = sections.mistake;
  memory.pending = false;
  memory.enrichedAt = enrichment.enrichedAt;
  memory.aiProvider = enrichment.provider;
  memory.aiProviderLabel = getAiProviderLabel(enrichment.provider);
  memory.aiStatus = enrichment.status;
  memory.aiExplanation = sections;
  memory.aiModelProvider = enrichment.modelProvider || "";
  memory.aiModel = enrichment.model || "";
  memory.aiServerMode = enrichment.serverMode || "";
  memory.aiResponseId = enrichment.providerResponseId || "";
  memory.usage = enrichment.usage || memory.usage;
}

async function processOfflineQueue() {
  const pendingTasks = state.queue.filter((task) => task.status === "pending");
  if (pendingTasks.length === 0) {
    toast("离线队列已清空，没有待处理任务");
    return;
  }
  let blockedByApiKey = false;
  let processedCount = 0;
  let generatedMemoryCount = 0;
  let failedOcrCount = 0;
  for (const task of pendingTasks) {
      if (task.type === "ocr-source-image") {
        const sourceImage = state.sourceImages.find((item) => item.id === task.sourceImageId) || (await storage.getSourceImage(task.sourceImageId));
        if (sourceImage) {
          sourceImage.ocrStatus = "processing";
          sourceImage.lastOcrError = "";
          await saveAndReplaceSourceImage(sourceImage);
          try {
            generatedMemoryCount += await recognizeAndStoreSourceImage(sourceImage);
          } catch (error) {
            failedOcrCount += 1;
            await markSourceImageOcrFailed(sourceImage, error);
            await storage.updateTask({ ...task, status: "pending", lastError: readableErrorMessage(error, "OCR failed") });
            continue;
          }
        }
      }

      if (task.type === "ai-enrich-capture" || task.type === "ai-enrich-manual") {
        const memory = state.memories.find((item) => item.id === task.memoryId);
        if (memory) {
          if (task.type === "ai-enrich-manual" && state.settings.aiProvider === "domestic-model-service" && !hasAiKeyAvailable()) {
            blockedByApiKey = true;
            await storage.updateTask({ ...task, status: "pending", lastError: "DeepSeek API Key required." });
            openApiKeyDialog("补整理需要 DeepSeek API Key，保存后会继续生成真实翻译、中文解释、例句和复习卡片。", "process-queue");
            break;
          }
          const sourceImage =
            memory.sourceImageId ? state.sourceImages.find((item) => item.id === memory.sourceImageId) || (await storage.getSourceImage(memory.sourceImageId)) : null;
          const enrichment = await getAiAdapter().enrichMemory(memory, {
            sourceImage,
            ocr: sourceImage?.ocr,
            inputMode: memory.sourceKind || "camera",
            manualText: memory.sourceKind === "manual-text" ? memory.fullText || memory.original : "",
            contentBlocks: memory.contentBlocks || [],
          });
          if (enrichment.status === "api-key-required") {
            blockedByApiKey = true;
            await storage.updateTask({ ...task, status: "pending", lastError: enrichment.error || "DeepSeek API Key required." });
            openApiKeyDialog("需要 DeepSeek API Key 才能继续真实 AI 深度解释。保存后会继续处理离线队列。", "process-queue");
            break;
          }
          applyEnrichmentToMemory(memory, enrichment);
          await storage.saveMemory(memory);
        }
      }
      await storage.updateTask({ ...task, status: "done", completedAt: new Date().toISOString() });
      processedCount += 1;
  }
  state.queue = sortQueue(await storage.clearCompletedQueue());
  if (blockedByApiKey) {
    toast(processedCount ? `已处理 ${processedCount} 项，剩余 AI 整理需要填写 DeepSeek API Key` : "需要填写 DeepSeek API Key 才能继续 AI 整理");
    return;
  }
  const generatedText = generatedMemoryCount ? `，自动入库 ${generatedMemoryCount} 条 OCR 内容并按权重排序` : "";
  if (failedOcrCount) {
    toast(processedCount ? `已处理 ${processedCount} 项${generatedText}，${failedOcrCount} 张图片还不能识别` : `${failedOcrCount} 张图片还不能识别，请在图片页查看原因或手动输入`);
    return;
  }
  toast(`已处理 ${processedCount} 项：OCR 识别和 AI 整理状态已更新${generatedText}`);
}

async function recognizeAndStoreSourceImage(sourceImage) {
  const ocr = await getOcrAdapter().recognize(sourceImage);
  sourceImage.ocr = ocr;
  sourceImage.weightedOcrBlocks = rankOcrBlocks(ocr.blocks);
  sourceImage.recommendedKeyBlocks = sourceImage.weightedOcrBlocks;
  sourceImage.ocrStatus = "done";
  sourceImage.lastOcrError = "";
  sourceImage.updatedAt = new Date().toISOString();
  await saveAndReplaceSourceImage(sourceImage);
  return createMemoriesFromOcrSource(sourceImage);
}

async function createMemoriesFromOcrSource(sourceImage) {
  const blocks = sourceImage.weightedOcrBlocks?.length ? sourceImage.weightedOcrBlocks : rankOcrBlocks(sourceImage.ocr?.blocks || []);
  const newMemoryIds = [];
  for (const block of blocks) {
    const memory = buildMemoryFromOcrBlock(block, sourceImage);
    const existing = state.memories.find((item) => normalizeManualText(item.original).toLocaleLowerCase() === normalizeManualText(memory.original).toLocaleLowerCase());
    const savedMemory = existing ? mergeOcrOccurrence(existing, memory, block, sourceImage) : memory;
    if (!existing) {
      state.memories.unshift(savedMemory);
      newMemoryIds.push(savedMemory.id);
    }
    await storage.saveMemory(savedMemory);
    const task = await storage.enqueueTask({
      id: `task-${Date.now()}-${block.id || newMemoryIds.length}-ocr-ai`,
      type: "ai-enrich-capture",
      memoryId: savedMemory.id,
      sourceImageId: sourceImage.id,
      title: `OCR 整理：${clipText(savedMemory.translation || savedMemory.original, 20)}`,
    });
    state.queue = sortQueue([task, ...state.queue]);
  }

  if (blocks.length) {
    sourceImage.generatedMemoryIds = [...new Set([...(sourceImage.generatedMemoryIds || []), ...blocks.map((block) => block.id || block.text)])];
    await storage.saveSourceImage(sourceImage);
    state.sourceImages = sortSourceImages(state.sourceImages.map((item) => (item.id === sourceImage.id ? sourceImage : item)));
    state.memories = sortMemories(state.memories);
  }
  return newMemoryIds.length;
}

function buildMemoryFromOcrBlock(block, sourceImage) {
  const now = new Date().toISOString();
  const original = normalizeManualText(block.text);
  const translation = block.translationHint || quickTranslateManualText(original).text;
  const literal = block.translationHint || quickTranslateManualText(original).literal;
  const scene = inferManualScene([original, sourceImage.ocr?.text || "", sourceImage.displayName || ""].join(" "));
  const language = ocrLanguageLabel(block.language || sourceImage.ocr?.detectedLanguages?.[0] || original);
  const level = manualLevelLabel(block.level || inferManualLevel(original));
  const sourceName = sourceImage.displayName || sourceImage.originalName || "来源图片";
  return {
    id: `mem-ocr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    original,
    translation,
    literal,
    language,
    level,
    weight: block.memoryWeight || memoryWeightForBlock(block),
    topic: manualTopicForScene(scene),
    scene,
    tone: "中性",
    difficulty: inferManualDifficulty(original),
    usage: block.translationHint ? `${scene}里可以理解为“${translation}”。` : "OCR 已自动入库；点“补整理”后会生成自然译法、使用场景、例句和易错点。",
    example: `${original} / ${block.translationHint ? translation : "等待补整理生成自然译法"}`,
    similar: buildOcrSimilar(block, sourceImage),
    mistake: "不要只看 OCR 单词，要结合来源图片中的位置和当时场景一起记。",
    location: state.settings.location ? "当前旅行城市" : "可手动填写",
    story: `${formatShortDate(now)} 从${sourceName}识别到这条外语内容，已自动保存为记忆。`,
    status: "待复习",
    occurrences: 1,
    createdAt: now,
    source: sourceName,
    sourceKind: "ocr-image",
    thumb: thumbForOcrSource(sourceImage),
    pending: true,
    sourceImageId: sourceImage.id,
    sourceImageIds: [sourceImage.id],
    ocrBlockId: block.id || "",
    occurrenceRecords: [
      {
        sourceImageId: sourceImage.id,
        createdAt: now,
        location: state.settings.location ? "当前旅行城市" : "可手动填写",
        source: sourceName,
        scene,
        note: "真实 OCR 识别后由系统推荐为重点，并自动保存到记忆库。",
      },
    ],
  };
}

function mergeOcrOccurrence(existing, memory, block, sourceImage) {
  const hasSameSource = (existing.occurrenceRecords || []).some((record) => record.sourceImageId === sourceImage.id && record.ocrBlockId === block.id);
  if (!hasSameSource) {
    existing.occurrences = (existing.occurrences || 0) + 1;
    existing.createdAt = memory.createdAt;
    existing.pending = true;
    existing.sourceImageId = existing.sourceImageId || sourceImage.id;
    existing.sourceImageIds = appendUnique(existing.sourceImageIds || [], sourceImage.id);
    existing.occurrenceRecords = [
      ...(existing.occurrenceRecords || []),
      {
        ...memory.occurrenceRecords[0],
        ocrBlockId: block.id || "",
        note: "OCR 再次识别到同一表达，已合并并保留这次来源。",
      },
    ];
  }
  return existing;
}

function buildOcrSimilar(block, sourceImage) {
  const sourceBlocks = sourceImage.ocr?.blocks || [];
  return sourceBlocks
    .map((item) => item.text)
    .filter((text) => text && text !== block.text)
    .slice(0, 4);
}

function ocrLanguageLabel(language) {
  const text = String(language || "");
  if (text.startsWith("ja") || /[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text)) return "日文";
  if (text.startsWith("en") || /[A-Za-z]/u.test(text)) return "英文";
  if (text.startsWith("ko") || /[\p{Script=Hangul}]/u.test(text)) return "韩文";
  if (text.startsWith("zh") || /[\u4e00-\u9fff]/u.test(text)) return "中文/汉字";
  return "自动识别";
}

function thumbForOcrSource(sourceImage) {
  const name = `${sourceImage.displayName || ""} ${sourceImage.originalName || ""}`.toLocaleLowerCase();
  if (/exit|station|sign|路牌|车站|地铁/u.test(name)) return "sign";
  if (/manual|how|说明|包装/u.test(name)) return "manual";
  return "menu";
}

async function testAiConnection() {
  state.aiConnection = {
    status: "checking",
    message: "正在检测 AI 配置",
    checkedAt: new Date().toISOString(),
    keySource: state.runtimeAiKey ? "browser-session" : "",
    model: "",
  };
  render();

  try {
    const configResponse = await fetch("/api/ai/config");
    const config = await configResponse.json().catch(() => ({}));
    if (!configResponse.ok) throw new Error(config.error || "AI 配置接口不可用");

    if (state.runtimeAiKey) {
      const testResponse = await fetch(state.settings.domesticAiEndpoint || "/api/ai/explain", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-runtime-ai-key": state.runtimeAiKey,
          "x-ai-mode": "deepseek",
        },
        body: JSON.stringify(buildAiConnectionTestPayload()),
      });
      const testResult = await testResponse.json().catch(() => ({}));
      if (!testResponse.ok) throw new Error(testResult.error || `DeepSeek 测试失败：${testResponse.status}`);
      state.settings.aiNetworkEnabled = true;
      await storage.saveSettings(state.settings);
      state.aiConnection = {
        status: "verified",
        message: "本次手机页面 Key 可用，真实 AI 解释接口已返回。",
        checkedAt: new Date().toISOString(),
        keySource: "browser-session",
        model: testResult.model || config.model || "",
      };
      render();
      toast("DeepSeek 连接已验证");
      return;
    }

    if (config.keyConfigured) {
      state.settings.aiNetworkEnabled = true;
      await storage.saveSettings(state.settings);
      state.aiConnection = {
        status: "server-key",
        message: "后端环境已配置 DeepSeek Key；这台手机当前页面没有单独填写 Key。",
        checkedAt: new Date().toISOString(),
        keySource: config.keySource || "env",
        model: config.model || "",
      };
    } else {
      state.aiConnection = {
        status: "missing-key",
        message: "当前页面没有本次会话 Key，后端环境也未显示已配置 Key。",
        checkedAt: new Date().toISOString(),
        keySource: "none",
        model: config.model || "",
      };
    }
    render();
    toast(state.aiConnection.message);
  } catch (error) {
    state.aiConnection = {
      status: "error",
      message: error instanceof Error ? error.message : "AI 配置检测失败",
      checkedAt: new Date().toISOString(),
      keySource: state.runtimeAiKey ? "browser-session" : "",
      model: "",
    };
    render();
    toast(state.aiConnection.message);
  }
}

function buildAiConnectionTestPayload() {
  return {
    locale: "zh-CN",
    memory: {
      original: "Cash only",
      translation: "只收现金",
      literal: "仅现金",
      language: "英文",
      targetLanguage: "中文",
      scene: "购物付款",
      tone: "提示",
      difficulty: "基础",
    },
    source: {
      inputMode: "manual-text",
      manualText: "Cash only",
      contentBlocks: [{ text: "Cash only", level: "phrase" }],
      location: "测试",
      story: "AI 连接检测",
      sourceImageId: "",
    },
    requiredSections: ["literal", "natural", "scene", "tone", "example", "similar", "mistake"],
  };
}

function openApiKeyDialog(message = "", pendingAction = "") {
  state.apiKeyDialog = {
    open: true,
    apiKey: "",
    message,
    pendingAction,
  };
  render();
}

function closeApiKeyDialog() {
  state.apiKeyDialog = {
    open: false,
    apiKey: "",
    message: "",
    pendingAction: "",
  };
  render();
}

async function saveRuntimeApiKey() {
  const apiKey = state.apiKeyDialog.apiKey.trim();
  if (!apiKey) {
    toast("请先填写 DeepSeek API Key");
    return;
  }
  try {
    const response = await fetch("/api/ai/runtime-key", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ apiKey }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "API Key 保存失败");
    const pendingAction = state.apiKeyDialog.pendingAction;
    state.runtimeAiKey = apiKey;
    state.settings.aiNetworkEnabled = true;
    state.aiConnection = {
      status: "runtime-key",
      message: "本次手机页面已填写 DeepSeek Key；可点击检测 AI 配置确认接口可用。",
      checkedAt: new Date().toISOString(),
      keySource: result.keySource || "browser-session",
      model: result.model || "",
    };
    await storage.saveSettings(state.settings);
    closeApiKeyDialog();
    toast(`DeepSeek API Key 已保存在本次页面会话，当前模式：${result.aiExplainMode}`);
    if (pendingAction === "process-queue") {
      await processOfflineQueue();
    } else if (pendingAction === "translate-manual") {
      await previewManualMemory();
    }
  } catch (error) {
    toast(error instanceof Error ? error.message : "API Key 保存失败");
  }
}

function toast(message) {
  state.toast = message;
  saveState();
  render();
  window.setTimeout(() => {
    state.toast = "";
    render();
  }, 2400);
}

function openExportPanel(format = "csv") {
  state.exportOptions = {
    ...state.exportOptions,
    open: true,
    format,
  };
  render();
}

function runSelectedExport() {
  const memories = getExportMemories(state.exportOptions.scope);
  const fields = getSelectedExportFields();
  if (memories.length === 0) {
    toast("当前选择范围没有可导出的记忆");
    return;
  }
  if (fields.length === 0) {
    toast("请至少选择一个导出字段");
    return;
  }

  const format = state.exportOptions.format;
  const scopeLabel = exportScopes.find(([scope]) => scope === state.exportOptions.scope)?.[1] || "所选";
  if (format === "csv") {
    download("travel-language-memory-selected.csv", toCsv(memories, fields));
  } else if (format === "markdown") {
    download("travel-language-memory-selected.md", toMarkdown(memories, fields));
  } else {
    download("wechat-qq-travel-language-memory-selected.md", toMemoryBook(memories, fields));
  }
  state.exportOptions.open = false;
  toast(`已导出：${scopeLabel} · ${memories.length} 条 · ${fields.length} 个字段`);
}

function getExportMemories(scope) {
  if (scope === "filtered") return filteredMemories();
  if (scope === "review") return state.memories.filter((item) => item.status !== "已掌握");
  if (scope === "mastered") return state.memories.filter((item) => item.status === "已掌握");
  if (scope === "withImages") return state.memories.filter((item) => item.sourceImageId || item.sourceImageIds?.length);
  return state.memories;
}

function getSelectedExportFields() {
  return exportFields.filter(([field]) => state.exportOptions.fields[field]);
}

function exportFieldValue(memory, field) {
  const value = memory[field];
  if (field === "source") {
    const image = memory.sourceImageId ? state.sourceImages.find((item) => item.id === memory.sourceImageId) : null;
    return image?.displayName || value || "";
  }
  if (field === "occurrences") return String(value || 0);
  if (Array.isArray(value)) return value.join(" / ");
  return value ?? "";
}

function toCsv(memories, fields) {
  const rows = [fields.map(([, label]) => label), ...memories.map((item) => fields.map(([field]) => exportFieldValue(item, field)))];
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function toMarkdown(memories, fields) {
  return `# 旅行语言记忆库\n\n${memories
    .map(
      (item) => `## ${item.translation}\n\n${fields.map(([field, label]) => `- ${label}：${exportFieldValue(item, field)}`).join("\n")}\n`
    )
    .join("\n")}`;
}

function toMemoryBook(memories, fields) {
  return `# QQ/微信旅行语言回忆册草稿\n\n旅行地：日本 · 东京\n\n## 本次旅行常见表达\n\n${memories
    .map((item, index) => {
      const fieldLines = fields
        .filter(([field]) => !["original", "translation"].includes(field))
        .map(([field, label]) => `   - ${label}：${exportFieldValue(item, field)}`)
        .join("\n");
      return `${index + 1}. ${item.original} → ${item.translation}\n${fieldLines}`;
    })
    .join("\n\n")}`;
}

function download(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function escapeAttr(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js?v=19").catch(() => {});
}

/* ===== 记忆详情页：编辑弹窗 ===== */
function editMemoryDialog() {
  const memory = state.editingMemory;
  if (!memory) return "";
  return `
    <div class="sheet-backdrop" data-action="close-edit-memory" aria-hidden="true"></div>
    <div class="sheet edit-sheet">
      <div class="sheet-header">
        <h3>编辑记忆</h3>
        <button class="icon-button" data-action="close-edit-memory" aria-label="关闭">${icon("x")}</button>
      </div>
      <div class="sheet-body">
        <label>原文<textarea rows="2" data-edit-field="original">${escapeHtml(memory.original)}</textarea></label>
        <label>自然译文<textarea rows="2" data-edit-field="translation">${escapeHtml(memory.translation)}</textarea></label>
        <label>直译参考<textarea rows="2" data-edit-field="literal">${escapeHtml(memory.literal)}</textarea></label>
        <label>使用场景<input data-edit-field="scene" value="${escapeHtml(memory.scene)}" /></label>
        <label>语气/风格<input data-edit-field="tone" value="${escapeHtml(memory.tone)}" /></label>
        <label>例句<textarea rows="2" data-edit-field="example">${escapeHtml(memory.example)}</textarea></label>
        <label>易错点<textarea rows="2" data-edit-field="mistake">${escapeHtml(memory.mistake)}</textarea></label>
        <label>用法说明<textarea rows="2" data-edit-field="usage">${escapeHtml(memory.usage)}</textarea></label>
      </div>
      <div class="sheet-footer">
        <button class="secondary-button" data-action="close-edit-memory">取消</button>
        <button class="primary-button" data-action="save-edit-memory">保存</button>
      </div>
    </div>
    <style>
      .edit-sheet { max-height: 85vh; overflow-y: auto; }
      .edit-sheet .sheet-body label { display: block; margin-bottom: 12px; font-size: 13px; color: var(--gray); }
      .edit-sheet .sheet-body input,
      .edit-sheet .sheet-body textarea { width: 100%; margin-top: 4px; padding: 8px; border: 1px solid var(--gray-light); border-radius: 8px; font-size: 14px; background: var(--bg); color: var(--text); }
      .edit-sheet .sheet-body textarea { resize: vertical; min-height: 48px; }
      .edit-sheet .sheet-footer { display: flex; gap: 12px; justify-content: flex-end; padding: 12px 0 0; }
    </style>
  `;
}

function openEditMemoryDialog() {
  const memory = state.memories.find((item) => item.id === state.detailId);
  if (!memory) { toast("找不到当前记忆"); return; }
  state.editingMemory = memory;
  render();
}

async function saveEditMemory() {
  const memory = state.editingMemory;
  if (!memory) return;
  const fields = document.querySelectorAll("[data-edit-field]");
  fields.forEach((field) => {
    memory[field.dataset.editField] = field.value;
  });
  memory.updatedAt = new Date().toISOString();
  await storage.saveMemory(memory);
  state.editingMemory = null;
  toast("记忆已更新");
  render();
}

/* ===== 记忆详情页：更多操作底部菜单 ===== */
function moreMemorySheet() {
  const memory = state.memories.find((item) => item.id === state.detailId);
  if (!memory) return "";
  return `
    <div class="sheet-backdrop" data-action="close-more-memory" aria-hidden="true"></div>
    <div class="action-sheet">
      <button class="action-sheet-item" data-action="mark-memory-mastered">标记为已掌握</button>
      <button class="action-sheet-item danger" data-action="delete-memory">删除记忆</button>
      <button class="action-sheet-item cancel" data-action="close-more-memory">取消</button>
    </div>
    <style>
      .action-sheet {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
        background: var(--bg-card); border-radius: 16px 16px 0 0;
        padding: 8px 16px 24px; display: flex; flex-direction: column; gap: 4px;
      }
      .action-sheet-item {
        width: 100%; padding: 14px; border: none; background: none;
        font-size: 16px; text-align: center; color: var(--text);
        border-radius: 12px; cursor: pointer;
      }
      .action-sheet-item:active { background: var(--gray-light); }
      .action-sheet-item.danger { color: #e53935; }
      .action-sheet-item.cancel { color: var(--gray); margin-top: 4px; border-top: 6px solid var(--gray-light); padding-top: 18px; }
    </style>
  `;
}

function openMoreMemorySheet() {
  state.moreMemorySheet = true;
  render();
}

async function deleteCurrentMemory() {
  const memory = state.memories.find((item) => item.id === state.detailId);
  if (!memory) { toast("找不到当前记忆"); return; }
  state.moreMemorySheet = false;
  state.memories = state.memories.filter((item) => item.id !== state.detailId);
  await storage.removeMemory(memory.id);
  state.detailId = null;
  state.activeTab = "library";
  toast("记忆已删除");
  render();
}

async function markCurrentMemoryMastered() {
  const memory = state.memories.find((item) => item.id === state.detailId);
  if (!memory) { toast("找不到当前记忆"); return; }
  state.moreMemorySheet = false;
  memory.status = "已掌握";
  await storage.saveMemory(memory);
  toast("已标记为已掌握");
  render();
}

render();
hydrateState().then(render);
