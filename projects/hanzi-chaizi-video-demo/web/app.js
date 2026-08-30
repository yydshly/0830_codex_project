const demos = [
  {
    video: document.querySelector("#demo-video"),
    button: document.querySelector("#play-demo"),
    status: document.querySelector("#video-status"),
    dotClass: "status-dot",
    playLabel: "播放上游样片",
    pauseLabel: "暂停上游样片",
    fallbackLabel: "视频未加载，请使用右侧下载链接",
  },
  {
    video: document.querySelector("#mang-demo-video"),
    button: document.querySelector("#play-mang-demo"),
    status: document.querySelector("#mang-video-status"),
    dotClass: "second-status-dot",
    playLabel: "播放我们的“忙”字演示",
    pauseLabel: "暂停我们的“忙”字演示",
    fallbackLabel: "演示未加载，请使用右侧下载链接",
  },
  {
    video: document.querySelector("#effects-demo-video"),
    button: document.querySelector("#play-effects-demo"),
    status: document.querySelector("#effects-video-status"),
    dotClass: "effects-status-dot",
    playLabel: "播放扩展效果实验室",
    pauseLabel: "暂停扩展效果实验室",
    fallbackLabel: "效果视频未加载，请使用右侧下载链接",
  },
  {
    video: document.querySelector("#name-blessing-video"),
    button: document.querySelector("#play-name-blessing"),
    status: document.querySelector("#name-blessing-video-status"),
    dotClass: "name-video-dot",
    playLabel: "播放“沐阳”真实样片",
    pauseLabel: "暂停“沐阳”真实样片",
    fallbackLabel: "姓名祝福样片未加载，配置与即时预览仍可使用",
  },
  {
    video: document.querySelector("#wedding-story-video"),
    button: document.querySelector("#play-wedding-story-video"),
    status: document.querySelector("#wedding-story-video-status"),
    dotClass: "wedding-video-dot",
    playLabel: "播放婚礼真实样片",
    pauseLabel: "暂停婚礼真实样片",
    fallbackLabel: "婚礼样片未加载，互动分镜和项目配置仍可使用",
  },
  {
    video: document.querySelector("#wedding-screen-video"),
    button: document.querySelector("#play-wedding-screen-video"),
    status: document.querySelector("#wedding-screen-video-status"),
    dotClass: "wedding-screen-video-dot",
    playLabel: "播放 16:9 大屏成片",
    pauseLabel: "暂停 16:9 大屏成片",
    fallbackLabel: "大屏成片未加载，模拟请帖、迎宾海报和 RSVP 仍可使用",
  },
].filter(({ video, button, status }) => video && button && status);

const updateStatus = ({ status, dotClass }, message, state = "") => {
  status.textContent = "";
  const dot = document.createElement("span");
  dot.className = `${dotClass} ${state}`.trim();
  dot.setAttribute("aria-hidden", "true");
  status.append(dot, document.createTextNode(` ${message}`));
};

const updateButton = ({ button, playLabel, pauseLabel }, isPlaying) => {
  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = isPlaying ? "❚❚" : "▶";
  button.replaceChildren(icon, document.createTextNode(` ${isPlaying ? pauseLabel : playLabel}`));
};

for (const demo of demos) {
  const { video, button, fallbackLabel } = demo;

  const showReady = () => {
    updateStatus(demo, `视频已就绪 · ${video.duration.toFixed(2)} 秒`, "ready");
  };

  video.addEventListener("loadedmetadata", showReady);
  video.addEventListener("error", () => updateStatus(demo, fallbackLabel, "error"));
  for (const source of video.querySelectorAll("source")) {
    source.addEventListener("error", () => updateStatus(demo, fallbackLabel, "error"));
  }
  video.addEventListener("play", () => {
    for (const otherVideo of document.querySelectorAll("video")) {
      if (otherVideo !== video && !otherVideo.paused) otherVideo.pause();
    }
    updateButton(demo, true);
  });
  video.addEventListener("pause", () => updateButton(demo, false));
  video.addEventListener("ended", () => updateButton(demo, false));

  button.addEventListener("click", async () => {
    video.scrollIntoView({ behavior: "smooth", block: "center" });
    if (!video.paused) {
      video.pause();
      return;
    }

    try {
      await video.play();
    } catch {
      video.controls = true;
      updateStatus(demo, "请使用视频内的播放按钮", "error");
    }
  });

  updateButton(demo, false);
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) showReady();
}

const scenarioExamples = {
  culture: {
    number: "场景 01",
    maturity: "真实成片已验证",
    maturityClass: "",
    audience: "内容创作者 / 教师",
    title: "“忙”字一字一条文化短视频",
    description: "把一个汉字、四句脚本、逐笔动画、趣味拆分、旁白和字幕组合成可直接发布的竖屏内容。",
    input: "“忙”＋四句文案＋音色",
    output: "12.78 秒 9:16 MP4",
    needed: "批量选字、审核和栏目模板",
    previewLabel: "竖屏栏目样片",
    previewTime: "12",
    kicker: "今日汉字 / 忙",
    character: "忙",
    components: "忄＋亡 → 心＋亡",
    caption: "心有所向，虽忙不茫。",
    feedback: "逐笔书写 · 拆分 · TTS · 字幕",
    boundary: "这是现有“忙”字真实成片的网页缩略表达；趣味拆字仍需明确标注，不等于历史字源。",
    video: "assets/mang-heart-direction.mp4",
    poster: "assets/mang-poster.webp",
    proofCaption: "真实媒体证据 · “忙”字完整成片",
    proofMessage: "正在播放我们的“忙”字真实成片。",
  },
  lesson: {
    number: "场景 02",
    maturity: "教学视觉已演示",
    maturityClass: "",
    audience: "学校 / 对外汉语教师",
    title: "“永”字笔顺与发音微课",
    description: "把田字格、笔画编号、当前笔高亮、拼音和语音讲解组合成一段课堂可播放的示范。",
    input: "“永”＋拼音 yǒng＋教学文案",
    output: "笔顺微课 / 课堂投屏",
    needed: "课程分级、练习题和教学审核",
    previewLabel: "识字课件",
    previewTime: "08",
    kicker: "第 3 笔 / 跟着方向写",
    character: "永",
    components: "笔画 1–5 · 当前笔高亮",
    caption: "yǒng · 永远的永",
    feedback: "田字格 · 笔顺编号 · 中文发音",
    boundary: "笔顺视觉与声音已经演示；它还不是完整课程，尚无题库、分级和学习记录。",
    video: "assets/scenario-clips/scenario-lesson.mp4?v=2",
    poster: "assets/scenario-clips/scenario-lesson.webp",
    proofCaption: "真实媒体证据 · 笔顺教学片段",
    proofMessage: "正在播放效果实验室的笔顺教学短片。",
  },
  gift: {
    number: "场景 03",
    maturity: "视觉包装概念",
    maturityClass: "is-concept",
    audience: "品牌 / 活动 / 个人用户",
    title: "“安”字祝福卡与品牌开场",
    description: "将姓名或品牌中的一个字，套入指定语气、材质和字幕模板，生成节日祝福或开场片。",
    input: "“安”＋祝福语＋品牌色",
    output: "个性祝福卡 / 5 秒开场",
    needed: "模板编辑器、品牌资产和批量生成",
    previewLabel: "个性化开场",
    previewTime: "05",
    kicker: "为你选一字 / 安",
    character: "安",
    components: "名字或品牌字 → 材质模板",
    caption: "愿所行皆安，所遇皆暖。",
    feedback: "创意释义 · 非字源结论",
    boundary: "当前只演示视觉包装思路；姓名或品牌联想属于创意文案，不能包装成汉字本义。",
    video: "assets/scenario-clips/scenario-gift.mp4?v=2",
    poster: "assets/scenario-clips/scenario-gift.webp",
    proofCaption: "能力证据 · 墨迹 / 粉笔 / 霓虹材质",
    proofMessage: "正在播放材质风格证据短片；个性化流程仍是产品概念。",
  },
  exhibit: {
    number: "场景 04",
    maturity: "结构效果已演示",
    maturityClass: "is-needed",
    audience: "博物馆 / 出版 / 文化机构",
    title: "“明”字结构展项与轻科普",
    description: "在展屏或出版物二维码内容中，用部件分色、拆开和磁吸组合解释可见结构，再附来源卡片。",
    input: "“明”＋结构标注＋来源版本",
    output: "展屏循环 / 轻科普视频",
    needed: "权威来源、编辑审核和版本记录",
    previewLabel: "文化展陈",
    previewTime: "10",
    kicker: "结构观察 / 左右结构",
    character: "明",
    components: "日 ＋ 月 → 明",
    caption: "先看结构，再读有来源的解释。",
    feedback: "来源字段 · 编辑审核 · 版本记录",
    boundary: "部件动画已有真实效果；任何历史字源与演变解释都必须绑定权威资料并通过人工审核。",
    video: "assets/scenario-clips/scenario-exhibit.mp4?v=2",
    poster: "assets/scenario-clips/scenario-exhibit.webp",
    proofCaption: "真实媒体证据 · “明”字部件磁吸",
    proofMessage: "正在播放“明”字部件磁吸证据短片。",
  },
  family: {
    number: "场景 05",
    maturity: "字族效果已演示",
    maturityClass: "",
    audience: "语文教师 / 词汇学习者",
    title: "“青”声旁字族比较课",
    description: "把清、情、晴、请放在同一时间轴中，共享部件保持同色，差异部件逐个替换，形成系列内容。",
    input: "清 / 情 / 晴 / 请＋例词",
    output: "字族比较视频 / 词汇卡",
    needed: "字族数据、例词库和难度分级",
    previewLabel: "偏旁字族课",
    previewTime: "15",
    kicker: "共同声旁 / 青",
    character: "清",
    components: "清 · 情 · 晴 · 请",
    caption: "共享“青”，比较不同形旁。",
    feedback: "系列模板 · 部件分色 · 例词扩展",
    boundary: "四字比较已有真实视觉片段；要规模化仍需可靠的字族关系、例词与教学分级数据。",
    video: "assets/scenario-clips/scenario-family.mp4?v=2",
    poster: "assets/scenario-clips/scenario-family.webp",
    proofCaption: "真实媒体证据 · 清 / 情 / 晴 / 请",
    proofMessage: "正在播放清、情、晴、请字族证据短片。",
  },
  practice: {
    number: "场景 06",
    maturity: "界面概念验证",
    maturityClass: "is-concept",
    audience: "儿童 / 初学者 / 教育 App",
    title: "从示范动画延伸到互动跟写",
    description: "先播放标准中心线，再接收用户触控笔迹，比较路径、方向和顺序并给出可理解的纠错反馈。",
    input: "参考路径＋用户触控笔迹",
    output: "路径相似度＋纠错提示",
    needed: "真实输入、识别模型和学习记录",
    previewLabel: "互动跟写概念",
    previewTime: "21",
    kicker: "跟写反馈 / 第 3 笔",
    character: "永",
    components: "示范路径 → 用户笔迹 → 偏差提示",
    caption: "沿蓝色路径书写，再查看偏差。",
    feedback: "界面概念 · 尚无真实笔迹识别",
    boundary: "当前视频只证明反馈界面可以怎样表达，不包含真实触控输入、笔迹识别、评分或学习记录。",
    video: "assets/scenario-clips/scenario-practice.mp4?v=2",
    poster: "assets/scenario-clips/scenario-practice.webp",
    proofCaption: "概念证据 · 互动跟写反馈界面",
    proofMessage: "正在播放互动跟写界面概念短片。",
  },
};

const scenarioTabs = Array.from(document.querySelectorAll(".scenario-tab"));
const scenarioPanel = document.querySelector("#scenario-panel");
const scenarioPreview = document.querySelector("#scenario-preview");
const scenarioPreviewButton = document.querySelector("#play-scenario-preview");
const scenarioProofButton = document.querySelector("#play-scenario-proof");
const scenarioProofMedia = document.querySelector("#scenario-proof-media");
const scenarioProofVideo = document.querySelector("#scenario-proof-video");
const scenarioProofCaption = document.querySelector("#scenario-proof-caption");
const scenarioStatus = document.querySelector("#scenario-action-status");
let scenarioPreviewTimer;

const scenarioFields = {
  number: document.querySelector("#scenario-number"),
  maturity: document.querySelector("#scenario-maturity"),
  audience: document.querySelector("#scenario-audience"),
  title: document.querySelector("#scenario-title"),
  description: document.querySelector("#scenario-description"),
  input: document.querySelector("#scenario-input"),
  output: document.querySelector("#scenario-output"),
  needed: document.querySelector("#scenario-needed"),
  previewLabel: document.querySelector("#scenario-preview-label"),
  previewTime: document.querySelector("#scenario-preview-time"),
  kicker: document.querySelector("#scenario-canvas-kicker"),
  character: document.querySelector("#scenario-main-char"),
  components: document.querySelector("#scenario-components"),
  caption: document.querySelector("#scenario-caption"),
  feedback: document.querySelector("#scenario-feedback"),
  boundary: document.querySelector("#scenario-boundary"),
};

const selectScenario = (key) => {
  const example = scenarioExamples[key];
  const selectedTab = scenarioTabs.find((tab) => tab.dataset.scenario === key);
  if (!example || !selectedTab || !scenarioPanel || !scenarioPreview) return;

  clearTimeout(scenarioPreviewTimer);
  scenarioPreview.classList.remove("is-playing");
  if (scenarioProofVideo) scenarioProofVideo.pause();
  if (scenarioProofMedia) scenarioProofMedia.hidden = true;
  scenarioPreview.dataset.scene = key;
  scenarioPreview.setAttribute("aria-label", `${selectedTab.querySelector("strong").textContent}网页示例`);
  scenarioPanel.setAttribute("aria-labelledby", selectedTab.id);

  for (const tab of scenarioTabs) {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-selected", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  }

  for (const [field, element] of Object.entries(scenarioFields)) {
    if (element && example[field] !== undefined) element.textContent = example[field];
  }
  scenarioFields.maturity.className = `scenario-maturity ${example.maturityClass}`.trim();
  scenarioStatus.textContent = `已切换场景：${example.title}。可播放网页示例，或查看对应媒体证据。`;
  scenarioPreviewButton.innerHTML = '<span aria-hidden="true">▶</span> 播放网页示例';
  scenarioProofButton.innerHTML = '播放视频证据 <span aria-hidden="true">↘</span>';
};

for (const [index, tab] of scenarioTabs.entries()) {
  tab.addEventListener("click", () => selectScenario(tab.dataset.scenario));
  tab.addEventListener("keydown", (event) => {
    const last = scenarioTabs.length - 1;
    let targetIndex = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") targetIndex = index === last ? 0 : index + 1;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") targetIndex = index === 0 ? last : index - 1;
    else if (event.key === "Home") targetIndex = 0;
    else if (event.key === "End") targetIndex = last;
    else return;
    event.preventDefault();
    const target = scenarioTabs[targetIndex];
    selectScenario(target.dataset.scenario);
    target.focus();
  });
}

scenarioPreviewButton?.addEventListener("click", () => {
  const selected = scenarioTabs.find((tab) => tab.getAttribute("aria-selected") === "true");
  const example = selected ? scenarioExamples[selected.dataset.scenario] : null;
  if (!example || !scenarioPreview) return;

  clearTimeout(scenarioPreviewTimer);
  if (scenarioProofVideo) scenarioProofVideo.pause();
  if (scenarioProofMedia) scenarioProofMedia.hidden = true;
  scenarioPreview.classList.remove("is-playing");
  void scenarioPreview.offsetWidth;
  scenarioPreview.classList.add("is-playing");
  scenarioPreviewButton.innerHTML = '<span aria-hidden="true">❚❚</span> 正在播放示例';
  scenarioStatus.textContent = `正在播放：${example.title}。`;

  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 60 : 3000;
  scenarioPreviewTimer = window.setTimeout(() => {
    scenarioPreview.classList.remove("is-playing");
    scenarioPreviewButton.innerHTML = '<span aria-hidden="true">↻</span> 重新播放网页示例';
    scenarioStatus.textContent = `${example.title}网页示例播放完成。`;
  }, duration);
});

scenarioProofButton?.addEventListener("click", async () => {
  const selected = scenarioTabs.find((tab) => tab.getAttribute("aria-selected") === "true");
  const example = selected ? scenarioExamples[selected.dataset.scenario] : null;
  if (!example || !scenarioProofVideo || !scenarioProofMedia) return;

  clearTimeout(scenarioPreviewTimer);
  scenarioPreview?.classList.remove("is-playing");
  scenarioProofMedia.hidden = false;
  if (scenarioProofCaption) scenarioProofCaption.textContent = example.proofCaption;
  scenarioProofVideo.poster = example.poster;
  const nextSource = new URL(example.video, window.location.href).href;
  if (scenarioProofVideo.currentSrc !== nextSource) {
    scenarioProofVideo.src = example.video;
    scenarioProofVideo.load();
  }
  try {
    await scenarioProofVideo.play();
    scenarioProofButton.innerHTML = '正在播放视频证据 <span aria-hidden="true">❚❚</span>';
    scenarioStatus.textContent = example.proofMessage;
  } catch {
    scenarioProofVideo.controls = true;
    scenarioStatus.textContent = `${example.proofMessage} 请使用视频内的播放按钮。`;
  }
});

scenarioProofVideo?.addEventListener("play", () => {
  for (const video of document.querySelectorAll("video")) {
    if (video !== scenarioProofVideo && !video.paused) video.pause();
  }
});

for (const eventName of ["pause", "ended"]) {
  scenarioProofVideo?.addEventListener(eventName, () => {
    scenarioProofButton.innerHTML = '播放视频证据 <span aria-hidden="true">↻</span>';
  });
}

scenarioProofVideo?.addEventListener("error", () => {
  if (scenarioProofMedia) scenarioProofMedia.hidden = true;
  scenarioProofButton.innerHTML = '视频证据未加载 <span aria-hidden="true">!</span>';
  scenarioStatus.textContent = "场景证据短片未加载，网页示例和能力边界仍可使用。";
});

const workbenchFallbackCatalog = {
  version: 0,
  catalog: [
    {
      character: "忙",
      pinyin: "máng",
      decomposition: "忄＋亡",
      componentCut: 3,
      defaultScene: "culture",
      title: "忙而不乱，心有所向",
      caption: "一笔一画写下忙，也提醒自己别忘了方向。",
    },
  ],
  scenes: [{id: "culture", label: "文化短视频", kicker: "一字一故事", output: "9:16 竖屏栏目"}],
  templates: [
    {
      id: "editorial",
      label: "编辑蓝白",
      background: "#eaf3f8",
      surface: "#f8fbff",
      ink: "#112b4a",
      muted: "#56728b",
      accent: "#ff735f",
    },
  ],
  sample: {
    character: "忙",
    scene: "culture",
    template: "editorial",
    title: "忙而不乱，心有所向",
    caption: "一笔一画写下忙，也提醒自己别忘了方向。",
    accent: "#ff735f",
  },
};

const workbenchElements = {
  form: document.querySelector("#workbench-form"),
  loadStatus: document.querySelector("#workbench-load-status"),
  formStatus: document.querySelector("#workbench-form-status"),
  character: document.querySelector("#workbench-character"),
  scene: document.querySelector("#workbench-scene"),
  template: document.querySelector("#workbench-template"),
  title: document.querySelector("#workbench-title"),
  caption: document.querySelector("#workbench-caption"),
  accent: document.querySelector("#workbench-accent"),
  accentValue: document.querySelector("#workbench-color-value"),
  reset: document.querySelector("#reset-workbench"),
  download: document.querySelector("#download-workbench-config"),
  retry: document.querySelector("#retry-workbench-catalog"),
  preview: document.querySelector("#workbench-preview"),
  previewOutput: document.querySelector("#workbench-preview-output"),
  previewKicker: document.querySelector("#workbench-preview-kicker"),
  previewTitle: document.querySelector("#workbench-preview-title"),
  previewPinyin: document.querySelector("#workbench-preview-pinyin"),
  previewCharacter: document.querySelector("#workbench-preview-character"),
  previewDecomposition: document.querySelector("#workbench-preview-decomposition"),
  previewCaption: document.querySelector("#workbench-preview-caption"),
  previewScene: document.querySelector("#workbench-preview-scene"),
  previewTemplate: document.querySelector("#workbench-preview-template"),
  previewAccent: document.querySelector("#workbench-preview-accent"),
  configSummary: document.querySelector("#workbench-config-summary"),
};

let workbenchCatalog = workbenchFallbackCatalog;
let workbenchPreviewTimer;

const setWorkbenchControlsDisabled = (disabled) => {
  for (const control of [
    workbenchElements.character,
    workbenchElements.scene,
    workbenchElements.template,
    workbenchElements.title,
    workbenchElements.caption,
    workbenchElements.accent,
    workbenchElements.reset,
    workbenchElements.download,
  ]) {
    if (control) control.disabled = disabled;
  }
};

const populateWorkbenchSelect = (select, items, getValue, getLabel) => {
  if (!select) return;
  select.textContent = "";
  for (const item of items) {
    const option = document.createElement("option");
    option.value = getValue(item);
    option.textContent = getLabel(item);
    select.append(option);
  }
};

const getWorkbenchConfig = () => ({
  character: workbenchElements.character?.value ?? "忙",
  scene: workbenchElements.scene?.value ?? "culture",
  template: workbenchElements.template?.value ?? "editorial",
  title: workbenchElements.title?.value.trim() ?? "",
  caption: workbenchElements.caption?.value.trim() ?? "",
  accent: workbenchElements.accent?.value ?? "#ff735f",
});

const setWorkbenchFields = (config) => {
  if (workbenchElements.character) workbenchElements.character.value = config.character;
  if (workbenchElements.scene) workbenchElements.scene.value = config.scene;
  if (workbenchElements.template) workbenchElements.template.value = config.template;
  if (workbenchElements.title) workbenchElements.title.value = config.title;
  if (workbenchElements.caption) workbenchElements.caption.value = config.caption;
  if (workbenchElements.accent) workbenchElements.accent.value = config.accent;
};

const renderWorkbenchPreview = (message = "预览已更新。") => {
  const config = getWorkbenchConfig();
  const character = workbenchCatalog.catalog.find((item) => item.character === config.character) ?? workbenchCatalog.catalog[0];
  const scene = workbenchCatalog.scenes.find((item) => item.id === config.scene) ?? workbenchCatalog.scenes[0];
  const template = workbenchCatalog.templates.find((item) => item.id === config.template) ?? workbenchCatalog.templates[0];
  const titleValid = config.title.length > 0;
  const captionValid = config.caption.length > 0;

  workbenchElements.title?.setAttribute("aria-invalid", String(!titleValid));
  workbenchElements.caption?.setAttribute("aria-invalid", String(!captionValid));
  if (workbenchElements.download) workbenchElements.download.disabled = !(titleValid && captionValid);

  if (workbenchElements.preview) {
    workbenchElements.preview.dataset.template = template.id;
    workbenchElements.preview.style.setProperty("--preview-bg", template.background);
    workbenchElements.preview.style.setProperty("--preview-surface", template.surface);
    workbenchElements.preview.style.setProperty("--preview-ink", template.ink);
    workbenchElements.preview.style.setProperty("--preview-muted", template.muted);
    workbenchElements.preview.style.setProperty("--preview-accent", config.accent);
    clearTimeout(workbenchPreviewTimer);
    workbenchElements.preview.classList.remove("is-updating");
    void workbenchElements.preview.offsetWidth;
    workbenchElements.preview.classList.add("is-updating");
    workbenchPreviewTimer = window.setTimeout(() => workbenchElements.preview?.classList.remove("is-updating"), 320);
  }

  if (workbenchElements.previewOutput) workbenchElements.previewOutput.textContent = scene.output;
  if (workbenchElements.previewKicker) workbenchElements.previewKicker.textContent = `${scene.kicker} / ${scene.label}`;
  if (workbenchElements.previewTitle) workbenchElements.previewTitle.textContent = config.title || "请输入视频标题";
  if (workbenchElements.previewPinyin) workbenchElements.previewPinyin.textContent = character.pinyin;
  if (workbenchElements.previewCharacter) workbenchElements.previewCharacter.textContent = character.character;
  if (workbenchElements.previewDecomposition) workbenchElements.previewDecomposition.textContent = character.decomposition;
  if (workbenchElements.previewCaption) workbenchElements.previewCaption.textContent = config.caption || "请输入核心文案";
  if (workbenchElements.previewScene) workbenchElements.previewScene.textContent = scene.label;
  if (workbenchElements.previewTemplate) workbenchElements.previewTemplate.textContent = template.label;
  if (workbenchElements.previewAccent) workbenchElements.previewAccent.textContent = config.accent;
  if (workbenchElements.accentValue) workbenchElements.accentValue.textContent = config.accent;
  if (workbenchElements.configSummary) {
    workbenchElements.configSummary.textContent = `${config.character} · ${config.scene} · ${config.template} · ${config.accent}`;
  }
  if (workbenchElements.formStatus) {
    workbenchElements.formStatus.textContent = titleValid && captionValid ? message : "标题和核心文案不能为空。";
  }
};

const applyWorkbenchCatalog = (catalog, isFallback) => {
  workbenchCatalog = catalog;
  populateWorkbenchSelect(workbenchElements.character, catalog.catalog, (item) => item.character, (item) => `${item.character} · ${item.pinyin}`);
  populateWorkbenchSelect(workbenchElements.scene, catalog.scenes, (item) => item.id, (item) => item.label);
  populateWorkbenchSelect(workbenchElements.template, catalog.templates, (item) => item.id, (item) => item.label);
  setWorkbenchFields(catalog.sample);
  setWorkbenchControlsDisabled(false);
  if (workbenchElements.retry) workbenchElements.retry.hidden = !isFallback;
  if (workbenchElements.loadStatus) {
    workbenchElements.loadStatus.className = `workbench-status ${isFallback ? "is-fallback" : "is-ready"}`;
    workbenchElements.loadStatus.innerHTML = `<span aria-hidden="true"></span> ${isFallback ? "目录读取失败，已启用内置回退配置" : `配置目录已就绪 · ${catalog.catalog.length} 个字 · ${catalog.templates.length} 套模板`}`;
  }
  renderWorkbenchPreview(isFallback ? "当前使用内置回退配置，可编辑并重试目录。" : "配置目录已载入，可以开始编辑。 ");
};

const loadWorkbenchCatalog = async (url) => {
  if (!workbenchElements.form) return;
  setWorkbenchControlsDisabled(true);
  if (workbenchElements.loadStatus) {
    workbenchElements.loadStatus.className = "workbench-status";
    workbenchElements.loadStatus.innerHTML = '<span aria-hidden="true"></span> 正在读取汉字配置目录';
  }
  try {
    const response = await fetch(url, {cache: "no-store"});
    if (!response.ok) throw new Error(`catalog ${response.status}`);
    const catalog = await response.json();
    if (!Array.isArray(catalog.catalog) || catalog.catalog.length < 1 || !Array.isArray(catalog.templates)) {
      throw new Error("invalid catalog");
    }
    applyWorkbenchCatalog(catalog, false);
  } catch {
    applyWorkbenchCatalog(workbenchFallbackCatalog, true);
  }
};

workbenchElements.character?.addEventListener("change", () => {
  const character = workbenchCatalog.catalog.find((item) => item.character === workbenchElements.character.value);
  if (!character) return;
  workbenchElements.scene.value = character.defaultScene;
  workbenchElements.title.value = character.title;
  workbenchElements.caption.value = character.caption;
  renderWorkbenchPreview(`已载入“${character.character}”的目录默认文案。`);
});

workbenchElements.template?.addEventListener("change", () => {
  const template = workbenchCatalog.templates.find((item) => item.id === workbenchElements.template.value);
  if (template && workbenchElements.accent) workbenchElements.accent.value = template.accent;
  renderWorkbenchPreview("视觉模板和默认强调色已更新。 ");
});

for (const field of [workbenchElements.scene, workbenchElements.title, workbenchElements.caption, workbenchElements.accent]) {
  field?.addEventListener("input", () => renderWorkbenchPreview());
  field?.addEventListener("change", () => renderWorkbenchPreview());
}

workbenchElements.reset?.addEventListener("click", () => {
  const character = workbenchCatalog.catalog.find((item) => item.character === workbenchElements.character.value) ?? workbenchCatalog.catalog[0];
  const template = workbenchCatalog.templates.find((item) => item.id === workbenchElements.template.value) ?? workbenchCatalog.templates[0];
  setWorkbenchFields({
    character: character.character,
    scene: character.defaultScene,
    template: template.id,
    title: character.title,
    caption: character.caption,
    accent: template.accent,
  });
  renderWorkbenchPreview(`已恢复“${character.character}”的目录默认值。`);
});

workbenchElements.download?.addEventListener("click", () => {
  const config = getWorkbenchConfig();
  if (!config.title || !config.caption) return;
  const blob = new Blob([`${JSON.stringify(config, null, 2)}\n`], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `hanzi-${config.character}-workbench.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  workbenchElements.formStatus.textContent = `已导出 ${anchor.download}；其字段可直接作为 ConfigurableHanzi 的 props。`;
});

workbenchElements.retry?.addEventListener("click", () => loadWorkbenchCatalog(workbenchElements.retry.dataset.catalogUrl));
loadWorkbenchCatalog("data/hanzi-workbench.json?v=1");

const workbenchVideo = document.querySelector("#workbench-demo-video");
const workbenchVideoButton = document.querySelector("#play-workbench-demo");
const workbenchVideoStatus = document.querySelector("#workbench-video-status");

const updateWorkbenchVideoButton = (isPlaying) => {
  if (!workbenchVideoButton) return;
  workbenchVideoButton.innerHTML = `<span aria-hidden="true">${isPlaying ? "❚❚" : "▶"}</span> ${isPlaying ? "暂停配置样片" : "播放配置样片"}`;
};

workbenchVideo?.addEventListener("loadedmetadata", () => {
  if (!workbenchVideoStatus) return;
  workbenchVideoStatus.className = "is-ready";
  workbenchVideoStatus.innerHTML = `<span aria-hidden="true"></span> 配置样片已就绪 · ${workbenchVideo.duration.toFixed(2)} 秒`;
});
workbenchVideo?.addEventListener("play", () => {
  for (const video of document.querySelectorAll("video")) {
    if (video !== workbenchVideo && !video.paused) video.pause();
  }
  updateWorkbenchVideoButton(true);
});
workbenchVideo?.addEventListener("pause", () => updateWorkbenchVideoButton(false));
workbenchVideo?.addEventListener("ended", () => updateWorkbenchVideoButton(false));
workbenchVideo?.addEventListener("error", () => {
  if (!workbenchVideoStatus) return;
  workbenchVideoStatus.className = "is-error";
  workbenchVideoStatus.innerHTML = '<span aria-hidden="true"></span> 配置样片未加载，表单与 JSON 导出仍可使用';
});
workbenchVideoButton?.addEventListener("click", async () => {
  if (!workbenchVideo) return;
  if (!workbenchVideo.paused) {
    workbenchVideo.pause();
    return;
  }
  try {
    await workbenchVideo.play();
  } catch {
    workbenchVideo.controls = true;
    if (workbenchVideoStatus) workbenchVideoStatus.textContent = "请使用视频内的播放按钮。";
  }
});

updateWorkbenchVideoButton(false);
if (workbenchVideo?.readyState >= HTMLMediaElement.HAVE_METADATA) {
  workbenchVideo.dispatchEvent(new Event("loadedmetadata"));
}

const nameProductFallbackCatalog = {
  version: 0,
  supportedCharacters: ["沐", "阳"],
  occasions: [
    {
      id: "birthday",
      label: "生日纪念",
      kicker: "为你的名字点亮这一岁",
      defaultBlessing: "愿心有清泉，所行有光。",
    },
  ],
  styles: [
    {
      id: "aurora",
      label: "鎏金星河",
      background: "#080d28",
      surface: "#121a3f",
      ink: "#fff7dc",
      muted: "#a8b4dc",
      primary: "#f6d47a",
      secondary: "#8dd9ff",
      accent: "#ff6f91",
    },
  ],
  sample: {
    name: "沐阳",
    occasion: "birthday",
    style: "aurora",
    blessing: "愿心有清泉，所行有光。",
    signature: "赠予每一个闪闪发光的你",
    date: "2026.08.30",
    accent: "#f6d47a",
  },
};

const nameProductElements = {
  section: document.querySelector("#name-blessing"),
  form: document.querySelector("#name-blessing-form"),
  loadStatus: document.querySelector("#name-product-load-status"),
  formStatus: document.querySelector("#name-product-form-status"),
  name: document.querySelector("#name-product-name"),
  occasion: document.querySelector("#name-product-occasion"),
  style: document.querySelector("#name-product-style"),
  blessing: document.querySelector("#name-product-blessing"),
  signature: document.querySelector("#name-product-signature"),
  date: document.querySelector("#name-product-date"),
  accent: document.querySelector("#name-product-accent"),
  accentValue: document.querySelector("#name-product-color-value"),
  replay: document.querySelector("#replay-name-preview"),
  reset: document.querySelector("#reset-name-product"),
  download: document.querySelector("#download-name-product"),
  retry: document.querySelector("#retry-name-product"),
  preview: document.querySelector("#name-preview"),
  stars: document.querySelector("#name-preview-stars"),
  previewStyle: document.querySelector("#name-preview-style"),
  previewKicker: document.querySelector("#name-preview-kicker"),
  previewTitle: document.querySelector("#name-preview-title"),
  previewCharacters: document.querySelector("#name-preview-characters"),
  previewBlessing: document.querySelector("#name-preview-blessing"),
  previewSignature: document.querySelector("#name-preview-signature"),
  previewDate: document.querySelector("#name-preview-date"),
  summary: document.querySelector("#name-product-config-summary"),
};

let nameProductCatalog = nameProductFallbackCatalog;
let namePreviewTimer;

const createNamePreviewStars = () => {
  if (!nameProductElements.stars || nameProductElements.stars.childElementCount > 0) return;
  for (let index = 0; index < 26; index += 1) {
    const star = document.createElement("span");
    star.style.setProperty("--star-x", `${(index * 37 + 11) % 96}%`);
    star.style.setProperty("--star-y", `${(index * 61 + 7) % 94}%`);
    star.style.setProperty("--star-size", `${2 + ((index * 5) % 6)}px`);
    star.style.setProperty("--star-speed", `${2.6 + ((index * 7) % 18) / 10}s`);
    star.style.setProperty("--star-delay", `${-((index * 13) % 30) / 10}s`);
    nameProductElements.stars.append(star);
  }
};

const setNameProductControlsDisabled = (disabled) => {
  for (const control of [
    nameProductElements.name,
    nameProductElements.occasion,
    nameProductElements.style,
    nameProductElements.blessing,
    nameProductElements.signature,
    nameProductElements.date,
    nameProductElements.accent,
    nameProductElements.replay,
    nameProductElements.reset,
    nameProductElements.download,
  ]) {
    if (control) control.disabled = disabled;
  }
};

const populateNameProductSelect = (select, items) => {
  if (!select) return;
  select.textContent = "";
  for (const item of items) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    select.append(option);
  }
};

const getNameProductConfig = () => ({
  name: nameProductElements.name?.value.trim() ?? "",
  occasion: nameProductElements.occasion?.value ?? "birthday",
  style: nameProductElements.style?.value ?? "aurora",
  blessing: nameProductElements.blessing?.value.trim() ?? "",
  signature: nameProductElements.signature?.value.trim() ?? "",
  date: nameProductElements.date?.value.trim() ?? "",
  accent: nameProductElements.accent?.value ?? "#f6d47a",
});

const setNameProductFields = (config) => {
  if (nameProductElements.name) nameProductElements.name.value = config.name;
  if (nameProductElements.occasion) nameProductElements.occasion.value = config.occasion;
  if (nameProductElements.style) nameProductElements.style.value = config.style;
  if (nameProductElements.blessing) nameProductElements.blessing.value = config.blessing;
  if (nameProductElements.signature) nameProductElements.signature.value = config.signature;
  if (nameProductElements.date) nameProductElements.date.value = config.date;
  if (nameProductElements.accent) nameProductElements.accent.value = config.accent;
};

const replayNamePreview = () => {
  if (!nameProductElements.preview) return;
  clearTimeout(namePreviewTimer);
  nameProductElements.preview.classList.remove("is-playing");
  void nameProductElements.preview.offsetWidth;
  nameProductElements.preview.classList.add("is-playing");
  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 60 : 1500;
  namePreviewTimer = window.setTimeout(() => nameProductElements.preview?.classList.remove("is-playing"), duration);
};

const renderNameProductPreview = (message = "姓名高光预览已更新。", replay = false) => {
  const config = getNameProductConfig();
  const occasion = nameProductCatalog.occasions.find((item) => item.id === config.occasion) ?? nameProductCatalog.occasions[0];
  const style = nameProductCatalog.styles.find((item) => item.id === config.style) ?? nameProductCatalog.styles[0];
  const validName = /^[\u3400-\u9fff]{2,4}$/.test(config.name);
  const validBlessing = config.blessing.length > 0;
  const validSignature = config.signature.length > 0;
  const isValid = validName && validBlessing && validSignature;

  nameProductElements.name?.setAttribute("aria-invalid", String(!validName));
  nameProductElements.blessing?.setAttribute("aria-invalid", String(!validBlessing));
  nameProductElements.signature?.setAttribute("aria-invalid", String(!validSignature));
  if (nameProductElements.download) nameProductElements.download.disabled = !isValid;

  if (nameProductElements.preview) {
    nameProductElements.preview.dataset.style = style.id;
    nameProductElements.preview.style.setProperty("--preview-name-bg", style.background);
    nameProductElements.preview.style.setProperty("--preview-name-surface", style.surface);
    nameProductElements.preview.style.setProperty("--preview-name-ink", style.ink);
    nameProductElements.preview.style.setProperty("--preview-name-muted", style.muted);
    nameProductElements.preview.style.setProperty("--preview-name-primary", style.primary);
    nameProductElements.preview.style.setProperty("--preview-name-secondary", style.secondary);
    nameProductElements.preview.style.setProperty("--preview-name-accent", config.accent);
  }
  if (nameProductElements.previewStyle) nameProductElements.previewStyle.textContent = style.label;
  if (nameProductElements.previewKicker) nameProductElements.previewKicker.textContent = occasion.kicker;
  if (nameProductElements.previewTitle) nameProductElements.previewTitle.textContent = `为「${config.name || "姓名"}」写一束专属的光`;
  if (nameProductElements.previewCharacters) {
    nameProductElements.previewCharacters.textContent = "";
    for (const character of config.name || "姓名") {
      const span = document.createElement("span");
      span.textContent = character;
      nameProductElements.previewCharacters.append(span);
    }
    nameProductElements.previewCharacters.setAttribute("aria-label", `姓名：${config.name || "未填写"}`);
  }
  if (nameProductElements.previewBlessing) nameProductElements.previewBlessing.textContent = config.blessing || "请输入一句专属祝福";
  if (nameProductElements.previewSignature) nameProductElements.previewSignature.textContent = config.signature || "请填写署名";
  if (nameProductElements.previewDate) nameProductElements.previewDate.textContent = config.date || "纪念日待定";
  if (nameProductElements.accentValue) nameProductElements.accentValue.textContent = config.accent;
  if (nameProductElements.summary) nameProductElements.summary.textContent = `${config.name || "未命名"} · ${config.occasion} · ${config.style} · ${config.accent}`;
  if (nameProductElements.formStatus) {
    nameProductElements.formStatus.textContent = isValid ? message : "请输入 2–4 个汉字，并补全祝福语和署名。";
  }
  if (replay) replayNamePreview();
};

const applyNameProductCatalog = (catalog, isFallback) => {
  nameProductCatalog = catalog;
  populateNameProductSelect(nameProductElements.occasion, catalog.occasions);
  populateNameProductSelect(nameProductElements.style, catalog.styles);
  setNameProductFields(catalog.sample);
  setNameProductControlsDisabled(false);
  if (nameProductElements.retry) nameProductElements.retry.hidden = !isFallback;
  if (nameProductElements.loadStatus) {
    nameProductElements.loadStatus.className = `name-product-status ${isFallback ? "is-fallback" : "is-ready"}`;
    nameProductElements.loadStatus.innerHTML = `<span aria-hidden="true"></span> ${isFallback ? "产品目录读取失败，已启用内置示例" : `产品配置已就绪 · ${catalog.occasions.length} 个场景 · ${catalog.styles.length} 套风格`}`;
  }
  renderNameProductPreview(isFallback ? "当前使用内置示例，可继续编辑并重试。" : "“沐阳”产品示例已载入。", true);
};

const loadNameProductCatalog = async (url) => {
  if (!nameProductElements.form) return;
  setNameProductControlsDisabled(true);
  if (nameProductElements.loadStatus) {
    nameProductElements.loadStatus.className = "name-product-status";
    nameProductElements.loadStatus.innerHTML = '<span aria-hidden="true"></span> 正在读取祝福产品配置';
  }
  try {
    const response = await fetch(url, {cache: "no-store"});
    if (!response.ok) throw new Error(`name catalog ${response.status}`);
    const catalog = await response.json();
    if (!Array.isArray(catalog.occasions) || catalog.occasions.length < 1 || !Array.isArray(catalog.styles) || catalog.styles.length < 1) {
      throw new Error("invalid name catalog");
    }
    applyNameProductCatalog(catalog, false);
  } catch {
    applyNameProductCatalog(nameProductFallbackCatalog, true);
  }
};

nameProductElements.occasion?.addEventListener("change", () => {
  const occasion = nameProductCatalog.occasions.find((item) => item.id === nameProductElements.occasion.value);
  if (occasion && nameProductElements.blessing) nameProductElements.blessing.value = occasion.defaultBlessing;
  renderNameProductPreview("祝福场景和推荐文案已更新。", true);
});

nameProductElements.style?.addEventListener("change", () => {
  const style = nameProductCatalog.styles.find((item) => item.id === nameProductElements.style.value);
  if (style && nameProductElements.accent) nameProductElements.accent.value = style.accent;
  renderNameProductPreview("视觉风格和推荐高光色已更新。", true);
});

for (const field of [
  nameProductElements.name,
  nameProductElements.blessing,
  nameProductElements.signature,
  nameProductElements.date,
  nameProductElements.accent,
]) {
  field?.addEventListener("input", () => renderNameProductPreview());
  field?.addEventListener("change", () => renderNameProductPreview());
}

nameProductElements.replay?.addEventListener("click", () => {
  replayNamePreview();
  if (nameProductElements.formStatus) nameProductElements.formStatus.textContent = "姓名高光动画已重新播放。";
});

nameProductElements.reset?.addEventListener("click", () => {
  setNameProductFields(nameProductCatalog.sample);
  renderNameProductPreview("已恢复“沐阳”产品示例。", true);
});

nameProductElements.download?.addEventListener("click", () => {
  const config = getNameProductConfig();
  if (nameProductElements.download.disabled) return;
  const payload = {
    ...config,
    renderingBoundary: "即时预览使用网页字体；真实逐笔渲染需字符已接入笔画数据。",
  };
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `name-blessing-${config.name}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  if (nameProductElements.formStatus) nameProductElements.formStatus.textContent = `已导出 ${anchor.download}；可交给渲染服务生成正式视频。`;
});

nameProductElements.retry?.addEventListener("click", () => loadNameProductCatalog(nameProductElements.retry.dataset.catalogUrl));
createNamePreviewStars();
loadNameProductCatalog("data/name-blessing.json?v=1");

const weddingProjectFallback = {
  version: 1,
  projectId: "wedding-zhangshuai-dong-20260912",
  title: "两姓成礼 · 一字一生",
  couple: {
    groomDisplayName: "张帅",
    brideDisplayName: "董小姐",
    strokeCharacters: ["张", "董"],
  },
  date: {iso: "2026-09-12", display: "2026.09.12"},
  location: "延安",
  vow: "从此长路并肩，四季共赴。",
  closing: "良辰已定，敬候相见。",
  simulation: {
    status: "DEMO_ONLY",
    label: "演示资料 · 正式使用前请由新人确认",
    brideFullName: "董雅宁",
    ceremonyTime: "11:58",
    venue: "延安 · 山河礼宴厅（演示场地）",
    address: "宝塔区婚礼演示地址（请替换）",
    contact: "138 **** 0912",
    dressCode: "暖金 / 酒红",
    countdownDays: 13,
    timeline: [
      {date: "2021.09", title: "初见", copy: "在朋友的秋日聚会里相遇。此段为演示故事，请替换为真实经历。"},
      {date: "2023.05", title: "并肩", copy: "从一次同行，走成许多次共同决定。此段为演示故事。"},
      {date: "2026.09", title: "成礼", copy: "在延安，把往后的四季写进同一天。日期来自当前演示假设。"},
    ],
    photoScenes: [
      {id: "first-meet", eyebrow: "AI SIMULATED PHOTO 01", title: "秋日初见", caption: "AI 生成虚构人物 · 不代表真实新人照片", asset: "assets/wedding-ai/01-first-meet.webp", alt: "虚构成年新人在延安风格的秋日山谷相遇，AI 模拟素材"},
      {id: "together", eyebrow: "AI SIMULATED PHOTO 02", title: "山河同行", caption: "AI 生成虚构人物 · 正式版替换授权照片", asset: "assets/wedding-ai/02-together.webp", alt: "同一对虚构成年新人并肩走在延安风格的金色山路上，AI 模拟素材"},
      {id: "promise", eyebrow: "AI SIMULATED PHOTO 03", title: "良辰约定", caption: "AI 生成虚构人物 · 不生成或识别真人身份", asset: "assets/wedding-ai/03-promise.webp", alt: "同一对虚构成年新人在酒红背景前分享戒指盒，AI 模拟素材"},
    ],
    mediaPolicy: {fictionalIdentity: true, aiGenerated: true, realPersonReferenceUsed: false, label: "AI 模拟素材 · 非真实新人"},
  },
  stages: [
    {id: "prologue", index: "01", label: "延安序章", title: "一场婚礼，从延安的九月开始", copy: "暖砂山形与一束金光先建立地点和时间，让宾客进入这段故事。"},
    {id: "surnames", index: "02", label: "两姓入场", title: "张与董，各自成字，也彼此靠近", copy: "真实笔画先后写出两个姓氏；完整展示名负责确认人物身份。"},
    {id: "meeting", index: "03", label: "红线相遇", title: "两条路，在同一个时刻交汇", copy: "笔画尾迹延伸为红线和同心圆，表达相遇，不解释为汉字字源。"},
    {id: "ceremony", index: "04", label: "姓名成礼", title: "张帅 × 董小姐", copy: "姓名、婚期与延安共同成为婚礼主视觉，可适配请帖和现场大屏。"},
    {id: "finale", index: "05", label: "祝福定格", title: "从此长路并肩，四季共赴", copy: "以良辰邀请收束，形成可截图、可分享、可继续渲染的最终画面。"},
  ],
  formats: [
    {id: "landscape", label: "婚礼大屏", ratio: "16:9", use: "酒店开场与仪式转场"},
    {id: "portrait", label: "微信请帖", ratio: "9:16", use: "朋友圈、私聊与手机播放"},
    {id: "welcome", label: "迎宾海报", ratio: "4:5", use: "签到台、立牌与电子屏"},
  ],
  assumptions: [
    "年份按当前临近日期采用 2026 年，可在正式制作前修改。",
    "董小姐是用户提供的对外展示称谓，不代表已获得其完整姓名。",
    "未使用新人照片、电话号码、酒店名称或其他未提供信息。",
  ],
};

const weddingElements = {
  section: document.querySelector("#wedding-case"),
  loadStatus: document.querySelector("#wedding-load-status"),
  factCouple: document.querySelector("#wedding-fact-couple"),
  factDate: document.querySelector("#wedding-fact-date"),
  factLocation: document.querySelector("#wedding-fact-location"),
  formatButtons: Array.from(document.querySelectorAll("[data-wedding-format]")),
  tabs: Array.from(document.querySelectorAll("[data-wedding-stage]")),
  stage: document.querySelector("#wedding-stage"),
  stageFormat: document.querySelector("#wedding-stage-format"),
  stageLabel: document.querySelector("#wedding-stage-label"),
  stageTitle: document.querySelector("#wedding-stage-title"),
  stageDescription: document.querySelector("#wedding-stage-description"),
  stageVow: document.querySelector("#wedding-stage-vow"),
  stageDate: document.querySelector("#wedding-stage-date"),
  stageLocation: document.querySelector("#wedding-stage-location"),
  stageProgress: document.querySelector("#wedding-stage-progress"),
  stageCaptionTitle: document.querySelector("#wedding-stage-caption-title"),
  play: document.querySelector("#play-wedding-storyboard"),
  pause: document.querySelector("#pause-wedding-storyboard"),
  replay: document.querySelector("#replay-wedding-storyboard"),
  download: document.querySelector("#download-wedding-project"),
  retry: document.querySelector("#retry-wedding-project"),
  status: document.querySelector("#wedding-story-status"),
  simCountdown: document.querySelector("#sim-countdown"),
  simGroomName: document.querySelector("#sim-groom-name"),
  simBrideName: document.querySelector("#sim-bride-name"),
  simDate: document.querySelector("#sim-date"),
  simTime: document.querySelector("#sim-time"),
  simVenue: document.querySelector("#sim-venue"),
  simAddress: document.querySelector("#sim-address"),
  simDress: document.querySelector("#sim-dress"),
  simContact: document.querySelector("#sim-contact"),
  simPhotos: Array.from(document.querySelectorAll("[data-sim-photo]")),
};

let weddingProject = weddingProjectFallback;
let weddingStageIndex = 0;
let weddingTimer = null;

weddingElements.simPhotos.forEach((card) => {
  const image = card.querySelector("img");
  image?.addEventListener("error", () => card.classList.add("is-image-error"));
  image?.addEventListener("load", () => card.classList.remove("is-image-error"));
});

const getWeddingStage = (index) => weddingProject.stages[index] ?? weddingProject.stages[0];

const setWeddingPlaying = (isPlaying) => {
  if (weddingElements.play) weddingElements.play.disabled = isPlaying;
  if (weddingElements.pause) weddingElements.pause.disabled = !isPlaying;
};

const pauseWeddingStoryboard = (message = "分镜已暂停。") => {
  if (weddingTimer) window.clearInterval(weddingTimer);
  weddingTimer = null;
  setWeddingPlaying(false);
  if (weddingElements.status && message) weddingElements.status.textContent = message;
};

const renderWeddingStage = (index, message = "") => {
  const stage = getWeddingStage(index);
  weddingStageIndex = Math.max(0, weddingProject.stages.indexOf(stage));
  if (weddingElements.stage) weddingElements.stage.dataset.stage = stage.id;
  if (weddingElements.stageLabel) weddingElements.stageLabel.textContent = `${stage.index} / ${stage.label}`;
  if (weddingElements.stageTitle) weddingElements.stageTitle.textContent = stage.title;
  if (weddingElements.stageDescription) weddingElements.stageDescription.textContent = stage.copy;
  if (weddingElements.stageProgress) weddingElements.stageProgress.textContent = `第 ${weddingStageIndex + 1} 幕，共 ${weddingProject.stages.length} 幕`;
  if (weddingElements.stageCaptionTitle) weddingElements.stageCaptionTitle.textContent = stage.label;
  weddingElements.tabs.forEach((button) => {
    const selected = button.dataset.weddingStage === stage.id;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  if (weddingElements.status && message) weddingElements.status.textContent = message;
};

const playWeddingStoryboard = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    pauseWeddingStoryboard("");
    renderWeddingStage(weddingProject.stages.length - 1, "已按减少动效偏好直接展示祝福定格。可逐幕查看文案。");
    return;
  }
  if (weddingStageIndex >= weddingProject.stages.length - 1) renderWeddingStage(0);
  pauseWeddingStoryboard("");
  setWeddingPlaying(true);
  if (weddingElements.status) weddingElements.status.textContent = `正在播放第 ${weddingStageIndex + 1} 幕：${getWeddingStage(weddingStageIndex).label}`;
  weddingTimer = window.setInterval(() => {
    const next = weddingStageIndex + 1;
    if (next >= weddingProject.stages.length) {
      pauseWeddingStoryboard("五幕婚礼故事播放完成，画面已停在祝福定格。");
      return;
    }
    renderWeddingStage(next, `正在播放第 ${next + 1} 幕：${getWeddingStage(next).label}`);
  }, 2200);
};

const setWeddingFormat = (format) => {
  const selected = format === "landscape" ? "landscape" : "portrait";
  weddingElements.formatButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.weddingFormat === selected)));
  if (weddingElements.stage) {
    weddingElements.stage.classList.toggle("is-landscape", selected === "landscape");
    weddingElements.stage.classList.toggle("is-portrait", selected === "portrait");
  }
  if (weddingElements.stageFormat) weddingElements.stageFormat.textContent = selected === "landscape" ? "16:9" : "9:16";
  if (weddingElements.status) weddingElements.status.textContent = selected === "landscape" ? "已切换婚礼大屏构图；故事与信息保持不变。" : "已切换微信请帖构图；适合手机分享。";
};

const applyWeddingProject = (project, isFallback) => {
  const simulation = project.simulation ?? weddingProjectFallback.simulation;
  weddingProject = {...project, simulation};
  if (weddingElements.factCouple) weddingElements.factCouple.textContent = `${project.couple.groomDisplayName} × ${project.couple.brideDisplayName}`;
  if (weddingElements.factDate) weddingElements.factDate.textContent = project.date.display;
  if (weddingElements.factLocation) weddingElements.factLocation.textContent = project.location;
  if (weddingElements.stageVow) weddingElements.stageVow.textContent = project.vow;
  if (weddingElements.stageDate) weddingElements.stageDate.textContent = project.date.display;
  if (weddingElements.stageLocation) weddingElements.stageLocation.textContent = project.location;
  if (weddingElements.simCountdown) weddingElements.simCountdown.textContent = String(simulation.countdownDays);
  if (weddingElements.simGroomName) weddingElements.simGroomName.textContent = project.couple.groomDisplayName;
  if (weddingElements.simBrideName) weddingElements.simBrideName.textContent = simulation.brideFullName;
  if (weddingElements.simDate) weddingElements.simDate.textContent = project.date.display;
  if (weddingElements.simTime) weddingElements.simTime.textContent = simulation.ceremonyTime;
  if (weddingElements.simVenue) weddingElements.simVenue.textContent = simulation.venue;
  if (weddingElements.simAddress) weddingElements.simAddress.textContent = simulation.address;
  if (weddingElements.simDress) weddingElements.simDress.textContent = simulation.dressCode;
  if (weddingElements.simContact) weddingElements.simContact.textContent = simulation.contact;
  simulation.timeline.forEach((entry, index) => {
    const date = document.querySelector(`#sim-timeline-date-${index}`);
    const title = document.querySelector(`#sim-timeline-title-${index}`);
    const copy = document.querySelector(`#sim-timeline-copy-${index}`);
    if (date) date.textContent = entry.date;
    if (title) title.textContent = entry.title;
    if (copy) copy.textContent = entry.copy;
  });
  weddingElements.simPhotos.forEach((card, index) => {
    const scene = simulation.photoScenes[index];
    if (!scene) return;
    const eyebrow = card.querySelector(":scope > span");
    const title = card.querySelector(":scope > strong");
    const caption = card.querySelector(":scope > small");
    const image = card.querySelector(":scope > img");
    if (eyebrow) eyebrow.textContent = scene.eyebrow;
    if (title) title.textContent = scene.title;
    if (caption) caption.textContent = scene.caption;
    if (image && scene.asset) image.src = scene.asset;
    if (image && scene.alt) image.alt = scene.alt;
  });
  weddingElements.tabs.forEach((button, index) => {
    const stage = project.stages[index];
    if (!stage) return;
    button.dataset.weddingStage = stage.id;
    const number = button.querySelector("span");
    button.replaceChildren();
    if (number) {
      number.textContent = stage.index;
      button.append(number);
    }
    button.append(document.createTextNode(stage.label));
  });
  if (weddingElements.download) weddingElements.download.disabled = false;
  if (weddingElements.retry) weddingElements.retry.hidden = !isFallback;
  if (weddingElements.loadStatus) {
    weddingElements.loadStatus.className = `wedding-load-status ${isFallback ? "is-fallback" : "is-ready"}`;
    weddingElements.loadStatus.innerHTML = `<span aria-hidden="true"></span> ${isFallback ? "项目配置读取失败，已启用内置婚礼案例" : `案例配置已就绪 · ${project.stages.length} 幕 · ${project.formats.length} 种交付`}`;
  }
  renderWeddingStage(0, isFallback ? "当前使用内置案例，可继续体验并重新读取配置。" : "婚礼案例与模拟完整交付资料已载入。先播放五幕创意，或查看下方三端成品。");
};

const loadWeddingProject = async (url) => {
  if (!weddingElements.section) return;
  pauseWeddingStoryboard("");
  if (weddingElements.download) weddingElements.download.disabled = true;
  if (weddingElements.loadStatus) {
    weddingElements.loadStatus.className = "wedding-load-status";
    weddingElements.loadStatus.innerHTML = '<span aria-hidden="true"></span> 正在读取婚礼项目配置';
  }
  try {
    const response = await fetch(url, {cache: "no-store"});
    if (!response.ok) throw new Error(`wedding project ${response.status}`);
    const project = await response.json();
    if (!project.couple?.groomDisplayName || !project.couple?.brideDisplayName || !Array.isArray(project.stages) || project.stages.length !== 5 || !Array.isArray(project.formats) || !project.simulation?.brideFullName) {
      throw new Error("invalid wedding project");
    }
    applyWeddingProject(project, false);
  } catch {
    applyWeddingProject(weddingProjectFallback, true);
  }
};

weddingElements.formatButtons.forEach((button) => button.addEventListener("click", () => setWeddingFormat(button.dataset.weddingFormat)));
weddingElements.tabs.forEach((button, index) => {
  button.addEventListener("click", () => {
    pauseWeddingStoryboard("");
    renderWeddingStage(index, `已选择第 ${index + 1} 幕：${getWeddingStage(index).label}`);
  });
  button.addEventListener("keydown", (event) => {
    const keys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + weddingElements.tabs.length) % weddingElements.tabs.length;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % weddingElements.tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = weddingElements.tabs.length - 1;
    weddingElements.tabs[next]?.focus();
    pauseWeddingStoryboard("");
    renderWeddingStage(next, `已选择第 ${next + 1} 幕：${getWeddingStage(next).label}`);
  });
});
weddingElements.play?.addEventListener("click", playWeddingStoryboard);
weddingElements.pause?.addEventListener("click", () => pauseWeddingStoryboard());
weddingElements.replay?.addEventListener("click", () => {
  pauseWeddingStoryboard("");
  renderWeddingStage(0);
  playWeddingStoryboard();
});
weddingElements.download?.addEventListener("click", () => {
  const payload = {
    ...weddingProject,
    selectedPreview: weddingElements.stage?.classList.contains("is-landscape") ? "landscape" : "portrait",
    renderingBoundary: "张／董使用已接入的真实笔画数据；董雅宁、场地、时间、地址、联系方式、故事与抽象照片均为 DEMO_ONLY 模拟资料，正式发布前必须替换确认。",
  };
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "wedding-张帅-董小姐-20260912.json";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  if (weddingElements.status) weddingElements.status.textContent = `已导出 ${anchor.download}；可复用到微信请帖、婚礼大屏和迎宾海报。`;
});
weddingElements.retry?.addEventListener("click", () => loadWeddingProject(weddingElements.retry.dataset.catalogUrl));
loadWeddingProject("data/wedding-zhangshuai-dong.json?v=3");

const weddingRsvpElements = {
  form: document.querySelector("#wedding-rsvp"),
  name: document.querySelector("#rsvp-name"),
  attendanceGroup: document.querySelector("#rsvp-attendance-group"),
  partySize: document.querySelector("#rsvp-party-size"),
  blessing: document.querySelector("#rsvp-blessing"),
  status: document.querySelector("#wedding-rsvp-status"),
  result: document.querySelector("#wedding-rsvp-result"),
  resultTitle: document.querySelector("#wedding-rsvp-result-title"),
  resultCopy: document.querySelector("#wedding-rsvp-result-copy"),
  welcomeImage: document.querySelector("#wedding-welcome-image"),
};

const getRsvpAttendance = () => weddingRsvpElements.form?.querySelector('input[name="attendance"]:checked')?.value ?? "";

const syncRsvpPartySize = () => {
  if (!weddingRsvpElements.partySize) return;
  const isAttending = getRsvpAttendance() === "yes";
  weddingRsvpElements.partySize.disabled = !isAttending;
  if (!isAttending) weddingRsvpElements.partySize.value = "1";
};

weddingRsvpElements.form?.addEventListener("change", (event) => {
  if (event.target?.name === "attendance") {
    weddingRsvpElements.attendanceGroup?.removeAttribute("aria-invalid");
    syncRsvpPartySize();
  }
});

weddingRsvpElements.name?.addEventListener("input", () => weddingRsvpElements.name.removeAttribute("aria-invalid"));

weddingRsvpElements.form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const guestName = weddingRsvpElements.name?.value.trim() ?? "";
  const attendance = getRsvpAttendance();
  const errors = [];
  weddingRsvpElements.name?.removeAttribute("aria-invalid");
  weddingRsvpElements.attendanceGroup?.removeAttribute("aria-invalid");

  if (!guestName) {
    errors.push("请填写您的称呼");
    weddingRsvpElements.name?.setAttribute("aria-invalid", "true");
  }
  if (!attendance) {
    errors.push("请选择是否到场");
    weddingRsvpElements.attendanceGroup?.setAttribute("aria-invalid", "true");
  }
  if (errors.length) {
    if (weddingRsvpElements.status) {
      weddingRsvpElements.status.textContent = errors.join("；");
      weddingRsvpElements.status.classList.add("is-error");
    }
    if (!guestName) weddingRsvpElements.name?.focus();
    else weddingRsvpElements.form?.querySelector('input[name="attendance"]')?.focus();
    return;
  }

  const partySize = weddingRsvpElements.partySize?.value ?? "1";
  const blessing = weddingRsvpElements.blessing?.value.trim();
  const attendanceCopy = attendance === "yes" ? `${partySize} 位欣然赴约` : "遥寄祝福";
  if (weddingRsvpElements.resultTitle) weddingRsvpElements.resultTitle.textContent = `${guestName}，回执已生成`;
  if (weddingRsvpElements.resultCopy) weddingRsvpElements.resultCopy.textContent = `${attendanceCopy}。${blessing ? `祝福：${blessing}` : "愿良辰顺遂，山河共欢。"}`;
  if (weddingRsvpElements.result) {
    weddingRsvpElements.result.hidden = false;
    weddingRsvpElements.result.focus();
  }
  if (weddingRsvpElements.status) {
    weddingRsvpElements.status.textContent = "本地回执已生成；没有向任何服务器提交。";
    weddingRsvpElements.status.classList.remove("is-error");
  }
});

weddingRsvpElements.form?.addEventListener("reset", () => {
  window.setTimeout(() => {
    weddingRsvpElements.name?.removeAttribute("aria-invalid");
    weddingRsvpElements.attendanceGroup?.removeAttribute("aria-invalid");
    if (weddingRsvpElements.result) weddingRsvpElements.result.hidden = true;
    if (weddingRsvpElements.status) {
      weddingRsvpElements.status.textContent = "请选择是否到场并填写称呼。";
      weddingRsvpElements.status.classList.remove("is-error");
    }
    syncRsvpPartySize();
  });
});

weddingRsvpElements.welcomeImage?.addEventListener("error", () => {
  weddingRsvpElements.welcomeImage.alt = "迎宾海报未能加载；仍可使用下方高清 PNG 下载链接。";
  const caption = weddingRsvpElements.welcomeImage.closest("figure")?.querySelector("figcaption");
  if (caption) caption.textContent = "海报预览未加载；高清 PNG 下载仍可用。";
});

syncRsvpPartySize();
