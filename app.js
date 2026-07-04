import { storage } from "./storage.js?v=7";
import { createAiExplanationAdapter, getAiProviderLabel } from "./ai.js?v=7";
import { createOcrAdapter, getOcrProviderLabel, ocrProviderOptions } from "./ocr.js?v=7";

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

const exportFields = [
  ["original", "原文"],
  ["translation", "中文译文"],
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
    domesticAiEndpoint: "",
    reviewMode: "travel-diary",
  },
  reviewRevealed: false,
  memories: seedMemories,
  queue: [],
  sourceImages: [],
  imageUrls: {},
  exportOptions: structuredClone(defaultExportOptions),
};

let state = structuredClone(defaultState);

function saveState() {
  storage.saveSettings(state.settings).catch(() => {});
}

function getOcrAdapter() {
  return createOcrAdapter({
    provider: state.settings.ocrProvider,
    cloudEnabled: state.settings.cloudUploadEnabled,
  });
}

function getAiAdapter() {
  return createAiExplanationAdapter({
    provider: state.settings.aiProvider,
    domesticModelEndpoint: state.settings.domesticAiEndpoint,
    allowNetwork: state.settings.aiNetworkEnabled === true,
  });
}

async function hydrateState() {
  try {
    const data = await storage.loadAppData(seedMemories, defaultState.settings);
    state = {
      ...state,
      settings: { ...defaultState.settings, ...data.settings },
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
          const active = state.activeTab === id || (id === "library" && state.activeTab === "detail");
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
    library: libraryScreen,
    detail: detailScreen,
    review: reviewScreen,
    settings: settingsScreen,
  }[state.activeTab]();

  app.innerHTML = `
    <section class="screen">
      ${statusBar()}
      ${screen}
      ${nav()}
      ${state.exportOptions.open ? exportSheet() : ""}
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
  const recommendedBlocks = sourceImage?.recommendedKeyBlocks || [];
  const detectedCount = sourceImage?.ocr?.blocks?.length || 3;
  const recommendedCount = recommendedBlocks.length || 1;
  return `
    ${topbar(
      `<button class="icon-button" data-tab="home" aria-label="关闭">${icon("back")}</button> 日文 → 中文`,
      "",
      `<button class="icon-button" aria-label="闪光灯">${icon("flash")}</button><label class="icon-button" for="photoInput" aria-label="导入图片">${icon("image")}</label>`,
      ""
    )}
    <input id="photoInput" class="file-input" type="file" accept="image/*" capture="environment" />
    <div class="content">
      <div class="capture-stage">
        <div class="photo-frame" aria-label="菜单照片预览"></div>
        <div class="scan-card selected one"><h3>${selected.original}</h3><p>¥1,280<br />濃厚な味噌スープにチャーシュー、味玉、メンマ入り</p><span class="scan-check">${icon("check")}</span></div>
        <div class="scan-card two"><h3>辛味噌ラーメン</h3><p>¥1,180<br />ピリ辛の味噌スープが癖になる一杯</p><span class="scan-check"></span></div>
        <div class="scan-card three"><h3>餃子（6個）</h3><p>¥480<br />外はパリッと、中はジューシー</p><span class="scan-check"></span></div>
        <div class="capture-tools">
          <button class="active">划线选择</button>
          <button>框选区域</button>
        </div>
      </div>

      <div class="ai-sheet">
        <div class="ai-sheet-head">
          <span>系统推荐重点</span>
          <button class="link-button" data-action="accept-all">全选</button>
        </div>
        <div class="source-policy">
          <strong>${recommendedCount} 条重点会生成记忆</strong>
          <span>其余 ${Math.max(detectedCount - recommendedCount, 0)} 条文字保留在来源记录里，可在详情回看。</span>
        </div>
        <div class="translation-result">
          <small>${selected.original} ${icon("volume", "meta-icon")}</small>
          <h2>${selected.translation}</h2>
          <p>${selected.detail}</p>
          <div class="chip-row">${selected.chips.map((chip) => `<span class="chip">${chip}</span>`).join("")}</div>
        </div>
        <div class="capture-actions">
          <button class="secondary-button" data-action="preview-save">预览后入库</button>
          <button class="primary-button" data-action="save-capture">保存重点</button>
        </div>
      </div>
    </div>
  `;
}

function libraryScreen() {
  const filters = ["全部", "餐饮", "交通", "购物", "待复习", "已掌握"];
  const memories = filteredMemories();
  return `
    ${topbar("记忆库", "按语言、地点、场景和来源检索", `<button class="icon-button" data-action="export">${icon("export")}</button>`)}
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
      `<button class="icon-button" aria-label="编辑">${icon("edit")}</button><button class="icon-button" aria-label="更多">${icon("more")}</button>`
    )}
    <div class="content">
      <div class="detail-block">
        <h3>原文（${memory.language}） ${icon("volume", "meta-icon")}</h3>
        <strong>${memory.original}</strong>
        <p>${memory.literal}</p>
      </div>
      <div class="detail-block">
        <h3>自然中文翻译 ${icon("volume", "meta-icon")}</h3>
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
      <div class="detail-block">
        <h3>例句</h3>
        <p>${memory.example}</p>
      </div>
      <div class="detail-block">
        <h3>相似表达</h3>
        <div class="chip-row">${memory.similar.map((item) => `<span class="chip">${item}</span>`).join("")}</div>
      </div>
      <div class="detail-block">
        <h3>易错点</h3>
        <p>${memory.mistake}</p>
      </div>
      <div class="detail-block">
        <h3>来源截图</h3>
        <div class="source-row">
          <p>${memory.source} · 原图默认隐藏，只展示文字区域。已出现 ${memory.occurrences} 次。${sourceOcrSummary(memory)}</p>
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
        <p>回想当时照片里的外语表达、中文意思和使用场景。</p>
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

function settingsScreen() {
  const ocrAdapter = getOcrAdapter();
  const aiAdapter = getAiAdapter();
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
        <p class="subtitle">当前：${aiAdapter.label} · ${aiAdapter.mode}。通过后端接口接国内模型；未配置接口或未开启联网前不上传内容。</p>
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
        ${settingRow("aiNetworkEnabled", "允许联网 AI 深度解释", "未配置我们的国内模型后端前，即使开启也不会上传内容")}
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
      memory.status === state.filter;
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
    const keyCount = sourceImage.recommendedKeyBlocks?.length || 0;
    return ` OCR 已识别 ${ocr.blocks.length} 个文字块，推荐重点 ${keyCount} 条，${fallback}${reason}`;
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

function recommendKeyBlocks(blocks = []) {
  return [...blocks]
    .filter((block) => block.text && block.confidence >= 0.86)
    .sort((a, b) => blockPriorityScore(b) - blockPriorityScore(a))
    .slice(0, 2);
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
  if (action === "run-export") {
    runSelectedExport();
    return;
  }
  if (action === "reveal-review") {
    state.reviewRevealed = true;
    render();
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
          note: "由系统推荐为重点内容，其余 OCR 文字保存在来源记录。",
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
  const label = action === "accept-all" ? "已接受全部 AI 推荐重点" : "已保存重点记忆";
  toast(`${label}，已进入离线队列，联网后补充 AI 整理`);
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
  toast(`已保存来源图片：${sourceImage.displayName}，并加入 OCR 离线队列`);
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

async function processOfflineQueue() {
  const pendingTasks = state.queue.filter((task) => task.status === "pending");
  if (pendingTasks.length === 0) {
    toast("离线队列已清空，没有待处理任务");
    return;
  }
  await Promise.all(
    pendingTasks.map(async (task) => {
      if (task.type === "ocr-source-image") {
        const sourceImage = state.sourceImages.find((item) => item.id === task.sourceImageId) || (await storage.getSourceImage(task.sourceImageId));
        if (sourceImage) {
          const ocr = await getOcrAdapter().recognize(sourceImage);
          sourceImage.ocr = ocr;
          sourceImage.recommendedKeyBlocks = recommendKeyBlocks(ocr.blocks);
          sourceImage.ocrStatus = "done";
          sourceImage.updatedAt = new Date().toISOString();
          await storage.saveSourceImage(sourceImage);
          state.sourceImages = sortSourceImages(state.sourceImages.map((item) => (item.id === sourceImage.id ? sourceImage : item)));
        }
      }

      if (task.type === "ai-enrich-capture") {
        const memory = state.memories.find((item) => item.id === task.memoryId);
        if (memory) {
          const sourceImage =
            memory.sourceImageId ? state.sourceImages.find((item) => item.id === memory.sourceImageId) || (await storage.getSourceImage(memory.sourceImageId)) : null;
          const enrichment = await getAiAdapter().enrichMemory(memory, {
            sourceImage,
            ocr: sourceImage?.ocr,
          });
          memory.pending = false;
          memory.enrichedAt = enrichment.enrichedAt;
          memory.aiProvider = enrichment.provider;
          memory.aiProviderLabel = getAiProviderLabel(enrichment.provider);
          memory.aiStatus = enrichment.status;
          memory.aiExplanation = enrichment.sections;
          memory.usage = enrichment.usage;
          await storage.saveMemory(memory);
        }
      }
      await storage.updateTask({ ...task, status: "done", completedAt: new Date().toISOString() });
    })
  );
  state.queue = sortQueue(await storage.clearCompletedQueue());
  toast(`已处理 ${pendingTasks.length} 项：OCR 识别和 AI 整理状态已更新`);
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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js?v=7").catch(() => {});
}

render();
hydrateState().then(render);
