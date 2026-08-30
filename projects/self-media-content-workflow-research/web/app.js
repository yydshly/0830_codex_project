const SKILLS = {
  workflow: {
    number: "00 / CORE",
    status: "编排能力",
    title: "总控工作流",
    summary: "识别请求类型，只加载必要模块，并管理方向、平台、标题、终稿和发布授权。",
    input: "想法、链接、素材、数据或“继续上次任务”",
    process: "路由请求、推进状态、触发质量门、发现可用工具",
    output: "任务卡、阶段产物、状态和下一步唯一动作",
    dependency: "核心流程无厂商硬依赖；外部动作按环境适配",
    boundary: "终稿确认不等于发布授权；任何外部写操作都要单独确认。",
  },
  brief: {
    number: "01 / BRIEF",
    status: "Agent 能力",
    title: "创作简报",
    summary: "把一句话选题或一份素材收敛为目标受众、内容目标、核心判断、证据和禁区。",
    input: "模糊想法、产品、链接、素材或初步要求",
    process: "先查上下文，只问最多 3 个真正改变方向的问题",
    output: "一张可快速确认的创作简报",
    dependency: "主要依赖 Agent 推理和现有项目资料",
    boundary: "方向未确认前不写完整正文；用户可以采用合理默认值。",
  },
  strategy: {
    number: "02 / STRATEGY",
    status: "Agent 能力",
    title: "内容策略",
    summary: "把账号定位和业务目标转成栏目、选题池、内容配比与可执行日历。",
    input: "账号阶段、受众、目标、历史内容、产能和商业边界",
    process: "定位承诺 → 内容类型 → 选题池 → 栏目 → 日历",
    output: "账号档案、2–4 个栏目、选题池与周期排期",
    dependency: "历史数据越完整，策略假设越可靠",
    boundary: "不套固定内容比例；数据不足时先建立基线。",
  },
  radar: {
    number: "03 / RADAR",
    status: "条件能力",
    title: "热点与竞品雷达",
    summary: "研究热点窗口、关键词需求和竞品结构，再转成有一手差异的原创选题。",
    input: "研究问题、平台、时间范围、链接或样本",
    process: "有限采样、结构拆解、模式判断、原创转化",
    output: "研究范围、结构发现、原创选题和验证动作",
    dependency: "需要联网搜索、浏览器或用户提供的公开材料",
    boundary: "只读采集；不用主账号批量抓取，不自动互动或洗稿。",
  },
  copy: {
    number: "04 / COPY",
    status: "Agent 能力",
    title: "平台原生文案",
    summary: "共享母题和证据，但为每个平台重写标题、第一屏、结构、视觉与行动。",
    input: "已确认简报、证据包、目标平台和账号调性",
    process: "先筛标题，再按平台分别设计停留、证据顺序和行动",
    output: "X、小红书、公众号和短视频发布文案",
    dependency: "主要依赖 Agent；精确平台规格需发布时核验",
    boundary: "如果多平台稿只有长短差异，工作流会判定失败并重写。",
  },
  video: {
    number: "05 / VIDEO",
    status: "条件能力",
    title: "短视频",
    summary: "把一个核心判断转成前 3 秒钩子、口播、分镜、字幕和画面任务。",
    input: "平台、时长、出镜方式、真实素材、判断和行动",
    process: "选择结构、校准时长、建立文案到画面映射",
    output: "可拍摄方案；工具与授权具备时可继续制作成片",
    dependency: "真人剪辑、数字人和字幕合成需要运行时媒体工具",
    boundary: "无原片默认停在方案；数字人头像和声音必须由用户手动上传。",
  },
  analytics: {
    number: "06 / ANALYTICS",
    status: "Agent + 数据",
    title: "内容数据复盘",
    summary: "以同平台、同类型和相近窗口建立基线，区分信号、归因和待验证假设。",
    input: "后台截图、CSV、表格、公开数据或只读连接器",
    process: "校验字段 → 比较基线 → 证据分级归因 → 设计实验",
    output: "单篇、周度或月度复盘，以及下一轮唯一实验",
    dependency: "需要真实数据输入；仓库不自带数据采集服务",
    boundary: "相关性不等于因果；缺失字段留空，不估算。",
  },
  delivery: {
    number: "07 / DELIVERY",
    status: "文件能力",
    title: "内容交付",
    summary: "把初稿、定稿、发布包和复盘作为里程碑保存，并回读验证文件与素材路径。",
    input: "各阶段完整产物、项目目录规范和版本状态",
    process: "保存、递增版本、回读、核验路径、更新内容索引",
    output: "可验证的成品文件、发布清单与内容注册表",
    dependency: "需要 Agent 具备工作区文件读写能力",
    boundary: "小改动不滥建版本；不会静默覆盖已经确认的定稿。",
  },
  wechat: {
    number: "08 / WECHAT",
    status: "外部适配器",
    title: "公众号草稿发布",
    summary: "将确认过的 Markdown 排版成公众号富文本，上传封面和文内图片并写入草稿箱。",
    input: "带 frontmatter 的终稿、封面、图片、主题与草稿授权",
    process: "本地渲染预览 → 路径检查 → wenyan 写入草稿箱",
    output: "公众号草稿及人工核对清单",
    dependency: "需要 wenyan CLI、AppID/AppSecret 和 IP 白名单",
    boundary: "只创建草稿，不调用群发接口；凭据不写入任务卡或仓库。",
  },
};

const skillButtons = [...document.querySelectorAll("[data-skill]")];
const skillFields = {
  number: document.querySelector("#detail-number"),
  status: document.querySelector("#detail-status"),
  title: document.querySelector("#detail-title"),
  summary: document.querySelector("#detail-summary"),
  input: document.querySelector("#detail-input"),
  process: document.querySelector("#detail-process"),
  output: document.querySelector("#detail-output"),
  dependency: document.querySelector("#detail-dependency"),
  boundary: document.querySelector("#detail-boundary"),
};

function applySkill(key) {
  const skill = SKILLS[key];
  if (!skill) return;

  Object.entries(skillFields).forEach(([field, element]) => {
    element.textContent = skill[field];
  });

  skillButtons.forEach((button) => {
    const isActive = button.dataset.skill === key;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

skillButtons.forEach((button) => {
  button.addEventListener("click", () => applySkill(button.dataset.skill));
});

const sampleTabs = [...document.querySelectorAll("[data-sample-tab]")];
const samplePanels = [...document.querySelectorAll("[data-sample-panel]")];

function activateSample(key, moveFocus = false) {
  sampleTabs.forEach((tab) => {
    const isActive = tab.dataset.sampleTab === key;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    if (isActive && moveFocus) tab.focus();
  });

  samplePanels.forEach((panel) => {
    panel.hidden = panel.dataset.samplePanel !== key;
  });
}

sampleTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateSample(tab.dataset.sampleTab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + sampleTabs.length) % sampleTabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % sampleTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = sampleTabs.length - 1;
    activateSample(sampleTabs[nextIndex].dataset.sampleTab, true);
  });
});

const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = themeToggle.querySelector(".theme-label");
const storedTheme = window.localStorage.getItem("self-media-research-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function applyTheme(theme) {
  const normalized = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = normalized;
  const isDark = normalized === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "切换到浅色主题" : "切换到深色主题");
  themeLabel.textContent = isDark ? "浅色" : "深色";
  window.localStorage.setItem("self-media-research-theme", normalized);
}

themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

applyTheme(storedTheme || preferredTheme);
applySkill("workflow");
activateSample("xhs");
