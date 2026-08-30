document.documentElement.classList.add("has-js");

const sceneNames = {
  brand: "01 品牌互动 · 吉祥物身份合同、社群语义与多格式交付。",
  personal: "02 个人表达 · 宠物身份保持、日常情绪与长期增量包。",
  kids: "03 儿童内容 · 故事角色、温和反馈与亲子审批。",
  product: "04 商品营销 · 产品卖点、发布节奏与品牌合规。",
  education: "05 教育知识 · 步骤顺序、知识正确性与轻量循环。",
  migration: "06 资产迁移 · 输入探测、确定性后处理与多端交付。"
};

const sceneTabs = [...document.querySelectorAll(".scene-tab")];
const scenePanels = [...document.querySelectorAll("[data-scene-panel]")];
const sceneStatus = document.querySelector(".scene-status");

function selectScene(index, moveFocus = false) {
  const selectedTab = sceneTabs[index];
  const scene = selectedTab.dataset.scene;

  sceneTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  scenePanels.forEach((panel) => {
    const active = panel.dataset.scenePanel === scene;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });

  sceneStatus.textContent = `当前场景：${sceneNames[scene]}`;
  if (moveFocus) selectedTab.focus();
}

sceneTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectScene(index));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % sceneTabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) nextIndex = (index - 1 + sceneTabs.length) % sceneTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = sceneTabs.length - 1;
    selectScene(nextIndex, true);
  });
});

selectScene(0);

const videoSamples = {
  dragon: {
    name: "毛毡小龙庆祝",
    source: "assets/scenes/felt-dragon-celebrate.png",
    alt: "用于生成视频提示词的毛毡小龙透明静态贴纸",
    action: "先轻微屈膝蓄力，再原地小幅跳起并举起双臂庆祝，落地后挥手一次",
    identity: "严格保持毛毡小龙的绿色毛毡材质、圆角轮廓、橙色腹部、短角、五官、四肢比例和中心构图",
    note: "毛毡材质允许少量纹理变化；小幅原地庆祝适合检验连续肢体动作和回环质量。",
    badge: "推荐样例 · 连续动作清晰"
  },
  dog: {
    name: "黑色长毛犬挥爪",
    source: "assets/our-dog/dog-core.png",
    alt: "用于生成视频提示词的黑色长毛犬透明静态贴纸",
    action: "先眨眼，再抬起左前爪轻轻挥手一次，最后回到端坐姿势",
    identity: "严格保持黑色长卷毛、垂耳、长吻部、灰色格纹胸背、蓝色挂饰、身体比例和端坐构图",
    note: "黑色卷毛会放大逐帧纹理闪烁和身份漂移；提示词会强化毛发、胸背和挂饰的身份锁定。",
    badge: "压力样例 · 身份锚点较多"
  },
  earbuds: {
    name: "翻译耳机声波传递",
    source: "assets/scenes/earbuds-live-translation.png",
    alt: "用于生成视频提示词的翻译耳机透明产品贴纸",
    action: "产品完全固定，仅让青色声波经过中心转为橙色并到达右侧",
    identity: "严格锁定耳机、充电盒的几何结构、尺寸比例、材质、颜色、开合角度和原始位置",
    note: "产品几何必须逐帧锁死；商业交付更推荐固定底图叠加程序化声波，视频模型只用于对照实验。",
    badge: "产品样例 · 结构必须固定"
  }
};

const videoSampleButtons = [...document.querySelectorAll(".video-sample-button")];
const videoActionIntent = document.querySelector("#video-action-intent");
const videoDuration = document.querySelector("#video-duration");
const videoAmplitude = document.querySelector("#video-amplitude");
const videoLoop = document.querySelector("#video-loop");
const videoSourcePreview = document.querySelector("#video-source-preview");
const videoSourceBadge = document.querySelector("#video-source-badge");
const videoSampleNote = document.querySelector("#video-sample-note");
const videoPositivePrompt = document.querySelector("#video-positive-prompt");
const videoNegativePrompt = document.querySelector("#video-negative-prompt");
const videoTaskState = document.querySelector("#video-task-state");
const videoCopyPrompt = document.querySelector("#video-copy-prompt");
const videoDownloadTask = document.querySelector("#video-download-task");
const videoSourceDownload = document.querySelector("#video-source-download");
const videoDriverLive = document.querySelector("#video-driver-live");
let selectedVideoSample = "dragon";

function buildPositivePrompt() {
  const sample = videoSamples[selectedVideoSample];
  const amplitude = videoAmplitude.value === "small" ? "动作幅度小而克制" : "动作幅度中等但不过度夸张";
  const ending = videoLoop.checked
    ? "动作完成后自然回到与首帧一致的起始姿态，使首尾可以平滑衔接"
    : "动作完成后自然停在结束姿态，不强求首尾回环";
  const motion = videoActionIntent.value.trim() || sample.action;
  return `${sample.identity}。以所附源图作为唯一主体参考，不改变原有造型。${motion}。${amplitude}，在 ${videoDuration.value} 秒内只完成这一组动作；${ending}。镜头完全固定，禁止推近、拉远、平移、旋转、倾斜和抖动；主体身体中心、脚底基线和整体构图保持稳定。动作自然、简洁、适合聊天贴纸。若平台不能输出真实透明通道，统一使用纯色 #00FF00 背景，无阴影、渐变或纹理。`;
}

function buildNegativePrompt() {
  const sample = videoSamples[selectedVideoSample];
  const subjectRule = selectedVideoSample === "earbuds" ? "不要弯曲、融化、重组或复制任何产品部件；" : "不要增加肢体、重复配件或改变五官；";
  return `${subjectRule}不要改变${sample.name}的身份、颜色、材质、比例和现有配件；不要增加角色、物体、文字、字幕、边框、阴影或背景元素；不要出现镜头运动、主体持续漂移、缩放、变形、闪烁或越出画面；不要用棋盘格模拟透明，不要产生白边、黑边或半透明脏边。`;
}

function currentPromptBundle() {
  const sample = videoSamples[selectedVideoSample];
  return {
    version: 2,
    kind: "user-driven-video-prompt-bundle",
    capability: "prompt-generation-only",
    sample: selectedVideoSample,
    sample_name: sample.name,
    source_image: sample.source,
    motion_intent: videoActionIntent.value.trim() || sample.action,
    duration_seconds: Number(videoDuration.value),
    amplitude: videoAmplitude.value,
    loop: videoLoop.checked ? "return-to-start" : "free-ending",
    positive_prompt: buildPositivePrompt(),
    negative_prompt: buildNegativePrompt(),
    suggested_settings: {
      mode: "image-to-video",
      camera: "locked",
      background: "transparent-if-supported-otherwise-#00FF00"
    },
    manual_handoff: [
      "保留或下载源图",
      "复制正向提示词与负向约束",
      "在用户选择的视频平台上传源图并粘贴提示词",
      "由用户设置平台参数、点击生成并评审结果"
    ],
    external_request_made: false,
    video_generated_here: false
  };
}

function copyablePrompt() {
  return `正向提示词：\n${buildPositivePrompt()}\n\n负向约束：\n${buildNegativePrompt()}\n\n建议参数：图生视频 · ${videoDuration.value} 秒 · ${videoAmplitude.options[videoAmplitude.selectedIndex].text} · ${videoLoop.checked ? "回到起始姿态" : "自由结束"}`;
}

function renderVideoDriver() {
  const sample = videoSamples[selectedVideoSample];
  videoSampleButtons.forEach((button) => {
    const active = button.dataset.videoSample === selectedVideoSample;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  videoSourcePreview.src = sample.source;
  videoSourcePreview.alt = sample.alt;
  videoSourceBadge.textContent = sample.badge;
  videoSourceDownload.href = sample.source;
  videoSourceDownload.download = `${selectedVideoSample}-source.png`;
  videoSampleNote.textContent = sample.note;
  videoPositivePrompt.textContent = buildPositivePrompt();
  videoNegativePrompt.textContent = buildNegativePrompt();
  videoTaskState.textContent = "READY TO COPY";
  videoCopyPrompt.disabled = false;
  videoDownloadTask.disabled = false;
  videoDriverLive.textContent = `当前：${sample.name} · ${videoDuration.value} 秒提示词已生成 · 未调用任何视频服务。`;
}

videoSampleButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    selectedVideoSample = button.dataset.videoSample;
    videoActionIntent.value = videoSamples[selectedVideoSample].action;
    renderVideoDriver();
  });
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % videoSampleButtons.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + videoSampleButtons.length) % videoSampleButtons.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = videoSampleButtons.length - 1;
    selectedVideoSample = videoSampleButtons[nextIndex].dataset.videoSample;
    videoActionIntent.value = videoSamples[selectedVideoSample].action;
    videoSampleButtons[nextIndex].focus();
    renderVideoDriver();
  });
});

[videoDuration, videoAmplitude, videoLoop].forEach((control) => control.addEventListener("change", renderVideoDriver));
videoActionIntent.addEventListener("input", renderVideoDriver);

videoDownloadTask.addEventListener("click", () => {
  const bundle = currentPromptBundle();
  const blob = new Blob([`${JSON.stringify(bundle, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${selectedVideoSample}-video-prompt.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  videoTaskState.textContent = "PROMPT JSON DOWNLOADED";
  videoDriverLive.textContent = `已下载 ${videoSamples[selectedVideoSample].name} 提示词包；视频生成仍由你完成。`;
});

videoCopyPrompt.addEventListener("click", async () => {
  const prompt = copyablePrompt();
  try {
    await navigator.clipboard.writeText(prompt);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = prompt;
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  videoTaskState.textContent = "PROMPT COPIED";
  videoDriverLive.textContent = "完整提示词已复制；下一步由你在所选视频平台上传源图并粘贴。";
});

document.querySelector("#video-driver-form").addEventListener("submit", (event) => event.preventDefault());
renderVideoDriver();

const ourEffectNames = {
  core: "01 身份贴纸化 · 对应静图生成与审批入口。",
  kinetic: "02 动势轨迹 · 仓库外的动作视觉扩展。",
  dream: "03 睡眠氛围 · 仓库外的情绪视觉扩展。",
  local: "04 语义循环 · 上游 keypose-local 路线实际编码。"
};

const ourEffectTabs = [...document.querySelectorAll(".our-effect-tab")];
const ourEffectPanels = [...document.querySelectorAll("[data-our-effect-panel]")];
const ourEffectStatus = document.querySelector(".our-effect-status");

function selectOurEffect(index, moveFocus = false) {
  const selectedTab = ourEffectTabs[index];
  const effect = selectedTab.dataset.ourEffect;

  ourEffectTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  ourEffectPanels.forEach((panel) => {
    const active = panel.dataset.ourEffectPanel === effect;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });

  ourEffectStatus.textContent = `当前效果：${ourEffectNames[effect]}`;
  if (moveFocus) selectedTab.focus();
}

ourEffectTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectOurEffect(index));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % ourEffectTabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + ourEffectTabs.length) % ourEffectTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = ourEffectTabs.length - 1;
    selectOurEffect(nextIndex, true);
  });
});

selectOurEffect(0);

const exampleNames = {
  character: "01 角色图做整包 · 从角色身份到动态 ZIP。",
  sheet: "02 已有图板动画化 · 检测真实网格并跳过重复审批。",
  video: "03 整板视频切成单格 · 抽帧、分割、透明和循环编码。",
  independent: "04 独立贴纸批处理 · 不伪造网格，逐张归一交付。",
  local: "05 完全本地降级 · 不上传素材，只做诚实的轻量循环。"
};

const exampleTabs = [...document.querySelectorAll(".example-tab")];
const examplePanels = [...document.querySelectorAll("[data-example-panel]")];
const exampleStatus = document.querySelector(".example-status");

function selectExample(index, moveFocus = false) {
  const selectedTab = exampleTabs[index];
  const example = selectedTab.dataset.example;

  exampleTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  examplePanels.forEach((panel) => {
    const active = panel.dataset.examplePanel === example;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });

  exampleStatus.textContent = `当前样例：${exampleNames[example]}`;
  if (moveFocus) selectedTab.focus();
}

exampleTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectExample(index));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % exampleTabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) nextIndex = (index - 1 + exampleTabs.length) % exampleTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = exampleTabs.length - 1;
    selectExample(nextIndex, true);
  });
});

selectExample(0);

const stageNames = {
  intake: "01 输入建档 · 明确素材类型和独立工作区。",
  static: "02 静图建形 · 生成后以实际像素和实际网格为准。",
  approval: "03 审批锁版 · 哈希绑定当前图板和布局。",
  routing: "04 能力路由 · 探测、选择，并只执行一条路线。",
  process: "05 媒体加工 · 切格、去背和循环编码。",
  delivery: "06 质检交付 · 媒体、报告和审计轨迹一起打包。"
};

const stageTabs = [...document.querySelectorAll(".stage-tab")];
const stagePanels = [...document.querySelectorAll("[data-stage-panel]")];
const stageStatus = document.querySelector(".stage-status");

function selectStage(index, moveFocus = false) {
  const selectedTab = stageTabs[index];
  const stage = selectedTab.dataset.stage;

  stageTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  stagePanels.forEach((panel) => {
    const active = panel.dataset.stagePanel === stage;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });

  stageStatus.textContent = `当前阶段：${stageNames[stage]}`;
  if (moveFocus) selectedTab.focus();
}

stageTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectStage(index));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % stageTabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + stageTabs.length) % stageTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = stageTabs.length - 1;
    selectStage(nextIndex, true);
  });
});

selectStage(0);

const filterButtons = [...document.querySelectorAll(".filter-button")];
const capabilityCards = [...document.querySelectorAll(".capability-card")];
const filterStatus = document.querySelector(".filter-status");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    capabilityCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.layer === filter;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    const label = button.childNodes[0].textContent.trim();
    filterStatus.textContent = `当前显示${label} ${visibleCount} 项能力。`;
  });
});
