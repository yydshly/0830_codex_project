document.documentElement.classList.add("js");

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
})[character]);

const uploadPlans = [
  {
    id: "upload-preserve",
    label: "多人 · 保留同画面",
    description: "先检测全部主体，再用一个共享主光向量重建同一画面。",
    format: "source ratio / 4:3",
    tasks: 1,
    lightingBranch: "Multiple subjects · coherent image-space key vector",
    keyDirection: "to be diagnosed",
    formatOptions: [
      { id: "source-ratio", label: "源比例", ratio: "source", use: "关系优先" },
      { id: "landscape-4x3", label: "横版 4:3", ratio: "4:3", use: "家庭交付" }
    ],
    rules: [
      { origin: "Skill", label: "主体前提", value: "运行检测与人工确认后，锁定人数、左右顺序、关系和可见解剖" },
      { origin: "Diagnostics", label: "布光分支", value: "所有主体、投影和背景衰减必须共享一个 image-space 主光向量" },
      { origin: "Format", label: "构图", value: "裁切破坏关系时先扩展影棚，不删除、合并或镜像主体" },
      { origin: "Final check", label: "拒收条件", value: "检测未确认、人物数变化、身份漂移、双重光向或分割边缘" }
    ]
  },
  {
    id: "upload-split",
    label: "多人 · 分别制作",
    description: "检测后为每位主体创建独立身份锁与生成任务，不是像素无损提取。",
    format: "source-adaptive portrait",
    tasks: "subject count",
    lightingBranch: "Per-subject geometry diagnosis",
    keyDirection: "per task",
    formatOptions: [
      { id: "portrait-source", label: "人物源比例", ratio: "source", use: "最小改动" },
      { id: "portrait-3x4", label: "竖版 3:4", ratio: "3:4", use: "独立肖像" }
    ],
    rules: [
      { origin: "Skill", label: "任务拆分", value: "检测与人工确认后，为每个主体单独重述身份、年龄、服饰和可见解剖" },
      { origin: "Diagnostics", label: "布光选择", value: "按每位主体的正脸、三分之四、侧脸或宠物几何分别选择分支" },
      { origin: "Format", label: "构图", value: "裁切触及头发、耳朵、下巴、手、爪或尾巴时扩展影棚" },
      { origin: "Final check", label: "拒收条件", value: "身份/年龄/物种改变、身体部位被发明，或背景与主光方向冲突" }
    ]
  },
  {
    id: "upload-brand",
    label: "单人 · 品牌套图",
    description: "人工确认一个主体后，为四种用途编译独立格式任务。",
    format: "1:1 + 4:5 + 3:4 + 16:9",
    tasks: 4,
    lightingBranch: "Human geometry to be diagnosed",
    keyDirection: "to be diagnosed",
    formatOptions: [
      { id: "avatar", label: "头像 1:1", ratio: "1:1", use: "中央安全区" },
      { id: "social", label: "社交 4:5", ratio: "4:5", use: "社交帖子" },
      { id: "editorial", label: "编辑 3:4", ratio: "3:4", use: "专访人物" },
      { id: "cover", label: "封面 16:9", ratio: "16:9", use: "横版负空间" }
    ],
    rules: [
      { origin: "Skill", label: "身份锁", value: "人工确认主体后，每个格式重述身份、表情、服饰、发型和可见配件" },
      { origin: "Diagnostics", label: "布光分支", value: "按真实人脸几何选择闭环、改良或侧面低调分支，不画假三角" },
      { origin: "Format", label: "用途适配", value: "1:1 中央 80% 安全区；4:5/3:4 保持完整轮廓；16:9 沿视线留白" },
      { origin: "Final check", label: "拒收条件", value: "身份漂移、皮肤纹理夸张、裁切关键部位、背景噪声或伪光斑" }
    ]
  }
];

const state = {
  data: null,
  viewMode: "product",
  researchStage: "0",
  scenarioFilter: "all",
  fixtureId: "family",
  planId: "preserve",
  selectedOutputIds: new Set(),
  activeOutputId: null,
  step: 1,
  maxStep: 1,
  approval: null,
  upload: null,
  uploadUrl: null,
  downloadUrl: null,
  taskCounter: 1
};

const dom = {};

function cacheDom() {
  Object.assign(dom, {
    workbench: $("#workbench"),
    loadError: $("#load-error"),
    retryLoad: $("#retry-load"),
    taskNumber: $("#task-number"),
    taskState: $("#task-state span:last-child"),
    themeToggle: $("#theme-toggle"),
    modeStatus: $("#mode-status"),
    modeButtons: $$('[data-mode-target]'),
    viewSections: $$('[data-view]'),
    modeJumps: $$('[data-mode-jump]'),
    researchTabs: $$('[data-research-stage]'),
    researchPanels: $$('[data-research-panel]'),
    scenarioFilters: $$('[data-scenario-filter]'),
    scenarioCards: $$('.scenario-card[data-scenario-type]'),
    architectureCurrent: $("#architecture-current"),
    architecturePacket: $("#architecture-packet"),
    tabs: $$("[data-fixture]"),
    sourceFigure: $(".source-figure"),
    sourceImage: $("#source-image"),
    sourceKind: $("#source-kind"),
    sourceCaption: $("#source-caption"),
    subjectOverlay: $("#subject-overlay"),
    uploadBox: $("#upload-box"),
    photoUpload: $("#photo-upload"),
    uploadFeedback: $("#upload-feedback"),
    subjectList: $("#subject-list"),
    subjectPlanSource: $("#subject-plan-source"),
    inputBoundary: $("#input-boundary"),
    fixtureDescription: $("#fixture-description"),
    inputFact: $("#input-fact"),
    subjectFact: $("#subject-fact"),
    inputViewport: $("#input-viewport"),
    stepButtons: $$(".step-nav [data-step]"),
    stepNav: $(".step-nav"),
    stepPanels: $$("[data-step-panel]"),
    decisionStepLabel: $("#decision-step-label"),
    decisionTitle: $("#decision-title"),
    planChoices: $("#plan-choices"),
    formatChoices: $("#format-choices"),
    formatFieldset: $("#format-fieldset"),
    planSummary: $("#plan-summary"),
    ruleBranch: $("#rule-branch"),
    ruleCount: $("#rule-count"),
    ruleList: $("#rule-list"),
    promptSummary: $("#prompt-summary"),
    evidenceLabel: $("#evidence-label"),
    stageTitle: $("#stage-title"),
    evidenceBadge: $("#evidence-badge"),
    evidenceCanvas: $("#evidence-canvas"),
    stageImage: $("#stage-image"),
    outputGrid: $("#output-grid"),
    canvasEmpty: $("#canvas-empty"),
    canvasStamp: $("#canvas-stamp"),
    stageCaption: $("#stage-caption"),
    evidenceMeta: $("#evidence-meta"),
    formatRail: $("#format-rail"),
    reviewPassCount: $("#review-pass-count"),
    reviewPartialCount: $("#review-partial-count"),
    qaList: $("#qa-list"),
    rejectedEvidence: $("#rejected-evidence"),
    rejectedImage: $("#rejected-image"),
    rejectedReason: $("#rejected-reason"),
    approvalFieldset: $(".approval-fieldset"),
    approveButton: $("[data-decision='approved']"),
    rejectButton: $("[data-decision='rejected']"),
    approvalFeedback: $("#approval-feedback"),
    toDelivery: $("#to-delivery"),
    jsonPreview: $("#json-preview"),
    deliveryState: $("#delivery-state"),
    downloadJson: $("#download-json"),
    copyJson: $("#copy-json"),
    resetTask: $("#reset-task"),
    copyFeedback: $("#copy-feedback")
  });
}

function modeFromLocation() {
  const hash = window.location.hash.toLowerCase();
  if (["#explore", "#scenarios", "#scenario-lab", "#products", "#product-directions"].includes(hash)) return "explore";
  if (hash === "#architecture") return "architecture";
  return "product";
}

function setViewMode(mode, { focus = false, updateUrl = true } = {}) {
  if (!["product", "explore", "architecture"].includes(mode)) return;
  state.viewMode = mode;
  document.documentElement.dataset.mode = mode;
  const labels = {
    product: "产品模式 · 完成一个任务",
    explore: "探索模式 · 复盘过程与证据",
    architecture: "架构模式 · 拆清责任与路线"
  };
  dom.modeStatus.textContent = labels[mode];
  dom.modeButtons.forEach((button) => {
    const selected = button.dataset.modeTarget === mode;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected && focus) button.focus({ preventScroll: true });
  });
  dom.viewSections.forEach((section) => {
    section.hidden = section.dataset.view !== mode;
  });
  if (mode === "architecture") renderArchitecturePacket();
  if (updateUrl) {
    const nextHash = mode === "product" ? "#product" : mode === "explore" ? "#explore" : "#architecture";
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
  }
}

function setResearchStage(stage, { focus = false } = {}) {
  const target = String(stage);
  if (!dom.researchTabs.some((button) => button.dataset.researchStage === target)) return;
  state.researchStage = target;
  dom.researchTabs.forEach((button) => {
    const selected = button.dataset.researchStage === target;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected && focus) button.focus({ preventScroll: true });
  });
  dom.researchPanels.forEach((panel) => {
    panel.hidden = panel.dataset.researchPanel !== target;
  });
}

function setScenarioFilter(filter) {
  if (!["all", "image", "process", "framework"].includes(filter)) return;
  state.scenarioFilter = filter;
  dom.scenarioFilters.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.scenarioFilter === filter));
  });
  dom.scenarioCards.forEach((card) => {
    card.hidden = filter !== "all" && card.dataset.scenarioType !== filter;
  });
}

function currentFixture() {
  return state.fixtureId === "upload"
    ? null
    : state.data.fixtures.find((fixture) => fixture.id === state.fixtureId);
}

function availablePlans() {
  const fixture = currentFixture();
  return fixture ? fixture.plans : uploadPlans;
}

function currentPlan() {
  const plans = availablePlans();
  return plans.find((plan) => plan.id === state.planId) || plans[0];
}

function outputOptions(plan = currentPlan()) {
  return plan.outputs || plan.formatOptions || [];
}

function selectedOutputs(plan = currentPlan()) {
  return outputOptions(plan).filter((output) => state.selectedOutputIds.has(output.id));
}

function setDefaultSelection(plan) {
  const options = outputOptions(plan);
  state.selectedOutputIds = new Set(options.map((output) => output.id));
  state.activeOutputId = options[0]?.id || null;
}

function resetFlow({ keepFixture = true } = {}) {
  if (state.downloadUrl) {
    URL.revokeObjectURL(state.downloadUrl);
    state.downloadUrl = null;
  }
  state.step = 1;
  state.maxStep = 1;
  state.approval = null;
  if (!keepFixture) {
    state.fixtureId = "family";
  }
  const fixture = currentFixture();
  state.planId = fixture ? fixture.plans[0].id : uploadPlans[0].id;
  setDefaultSelection(currentPlan());
  renderAll();
}

function setFixture(fixtureId) {
  if (state.downloadUrl) {
    URL.revokeObjectURL(state.downloadUrl);
    state.downloadUrl = null;
  }
  state.fixtureId = fixtureId;
  const fixture = currentFixture();
  state.planId = fixture ? fixture.plans[0].id : uploadPlans[0].id;
  state.step = 1;
  state.maxStep = 1;
  state.approval = null;
  setDefaultSelection(currentPlan());
  renderAll();
}

function renderAll() {
  dom.workbench.dataset.activeStep = String(state.step);
  renderTaskHeader();
  renderInput();
  renderStepNavigation();
  renderDecisionPanel();
  renderScene();
  renderArchitecturePacket();
}

function renderArchitecturePacket() {
  if (!state.data || !dom.architectureCurrent || !dom.architecturePacket) return;
  const fixture = currentFixture();
  const plan = currentPlan();
  const outputs = selectedOutputs(plan);
  const qa = qaForCurrentPlan();
  const passCount = qa.filter((item) => item.status === "pass").length;
  const reviewCount = qa.filter((item) => item.status === "partial" || item.status === "not-applicable").length;
  const taskCount = fixture
    ? outputs.length || plan.tasks
    : plan.id === "upload-brand" ? outputs.length : plan.tasks;
  const inputLabel = fixture ? `${fixture.label} fixture` : state.upload ? state.upload.name : "本地上传计划";
  const subjectLabel = fixture ? `${fixture.subjects.length} subjects` : "subjects pending";
  dom.architectureCurrent.innerHTML = `<span>${escapeHtml(inputLabel)}</span><strong>${escapeHtml(plan.label)}</strong><small>${escapeHtml(subjectLabel)} · ${escapeHtml(taskCount)} ${typeof taskCount === "number" ? "task(s)" : ""}</small>`;

  const detectionTitle = fixture ? "跳过运行时检测" : "等待检测与人工确认";
  const detectionNote = fixture ? "使用预标注研究 fixture" : "当前只有本地预览；没有上传";
  const skillTitle = plan.lightingBranch;
  const skillNote = `${plan.rules.length} 组规则 · ${plan.keyDirection}`;
  const modelTitle = fixture ? "本工作台未调用" : "尚未连接模型";
  const modelNote = fixture ? `${outputs.length} 份已保存候选证据` : "generation pending · 0 candidate";
  const qaTitle = fixture ? `${qa.length} 项人工检查` : "自动 QA 尚未运行";
  const qaNote = fixture ? `${passCount} pass · ${reviewCount} review` : "identity / anatomy / background pending";
  const deliveryTitle = state.approval ? `人工决定：${state.approval}` : "人工决定仍为 pending";
  const deliveryNote = "结构化任务 JSON · 本地下载/复制";
  const rows = [
    ["检测层", detectionTitle, detectionNote],
    ["Skill 层", skillTitle, skillNote],
    ["模型层", modelTitle, modelNote],
    ["QA 层", qaTitle, qaNote],
    ["交付层", deliveryTitle, deliveryNote]
  ];
  dom.architecturePacket.innerHTML = rows.map(([layer, title, note]) => `<li><span>${escapeHtml(layer)}</span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(note)}</small></li>`).join("");
}

function renderTaskHeader() {
  dom.taskNumber.textContent = `#PWB-${String(state.taskCounter).padStart(3, "0")}`;
  const labels = {
    1: "等待确认输入",
    2: "正在规划任务",
    3: "Skill 规则已编译",
    4: state.approval ? `人工决定：${state.approval === "approved" ? "批准" : "拒收"}` : "等待人工质检",
    5: "任务说明可交付"
  };
  dom.taskState.textContent = labels[state.step];
}

function renderInput() {
  const fixture = currentFixture();
  const isUpload = !fixture;

  dom.tabs.forEach((tab) => {
    const selected = tab.dataset.fixture === state.fixtureId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  dom.inputViewport.setAttribute("aria-labelledby", `fixture-${state.fixtureId}`);

  dom.uploadBox.hidden = !isUpload;
  dom.subjectOverlay.replaceChildren();
  dom.subjectList.replaceChildren();

  if (fixture) {
    dom.sourceFigure.hidden = false;
    dom.sourceImage.src = fixture.source.asset;
    dom.sourceImage.alt = fixture.source.alt;
    dom.sourceKind.textContent = "真实 fixture";
    dom.sourceCaption.textContent = `预标注 ${fixture.subjects.length} 位主体`;
    dom.subjectPlanSource.textContent = "来自预标注 fixture";
    dom.inputBoundary.textContent = "框选位置是记录好的 fixture，不是运行时检测。";
    dom.fixtureDescription.textContent = fixture.description;
    dom.inputFact.textContent = `${fixture.label} fixture`;
    dom.subjectFact.textContent = `${fixture.subjects.length} 位 · 预标注`;

    fixture.subjects.forEach((subject, index) => {
      const box = document.createElement("div");
      box.className = "subject-box";
      box.style.cssText = `left:${subject.bounds.x}%;top:${subject.bounds.y}%;width:${subject.bounds.width}%;height:${subject.bounds.height}%`;
      box.innerHTML = `<span>${String.fromCharCode(65 + index)}</span>`;
      dom.subjectOverlay.append(box);

      const card = document.createElement("article");
      card.className = "subject-card";
      card.innerHTML = `<header><strong>${subject.label}</strong><span>已记录</span></header><p>${subject.locks.join(" · ")}</p>`;
      dom.subjectList.append(card);
    });
  } else {
    const hasUpload = Boolean(state.uploadUrl);
    dom.sourceFigure.hidden = !hasUpload;
    if (hasUpload) {
      dom.sourceImage.src = state.uploadUrl;
      dom.sourceImage.alt = `本地上传预览：${state.upload.name}`;
      dom.sourceKind.textContent = "本地预览";
      dom.sourceCaption.textContent = "尚未运行主体检测";
    }
    dom.subjectPlanSource.textContent = "等待检测与人工确认";
    dom.inputBoundary.textContent = "文件只在当前浏览器内存中预览；没有上传、检测或生成。";
    dom.fixtureDescription.textContent = hasUpload
      ? "文件预览已就绪。你可以编译待执行任务，但候选与自动 QA 会保持为空。"
      : "选择本地图片后，只建立待检测、待生成的任务计划；不会显示伪造候选。";
    dom.inputFact.textContent = hasUpload ? state.upload.name : "尚未选择文件";
    dom.subjectFact.textContent = "待检测 · 待人工确认";

    const card = document.createElement("article");
    card.className = "subject-card is-pending";
    card.innerHTML = "<header><strong>主体计划</strong><span>待确认</span></header><p>检测/分割属于我们要补齐的系统，不属于上游 Skill。</p>";
    dom.subjectList.append(card);
  }

  const confirmButton = $("[data-step-panel='1'] [data-next-step='2']");
  confirmButton.disabled = isUpload && !state.upload;
}

function renderStepNavigation() {
  let currentButton = null;
  dom.stepButtons.forEach((button) => {
    const step = Number(button.dataset.step);
    button.disabled = step > state.maxStep;
    button.classList.toggle("is-complete", step < state.step && step <= state.maxStep);
    if (step === state.step) {
      button.setAttribute("aria-current", "step");
      currentButton = button;
    } else {
      button.removeAttribute("aria-current");
    }
  });
  if (currentButton) {
    requestAnimationFrame(() => {
      const targetLeft = currentButton.offsetLeft - (dom.stepNav.clientWidth - currentButton.offsetWidth) / 2;
      dom.stepNav.scrollTo({ left: Math.max(0, targetLeft), behavior: "auto" });
    });
  }
}

function renderDecisionPanel() {
  const titles = {
    1: "确认素材与主体计划",
    2: "选择任务结构与画幅",
    3: "检查编译后的 Skill 规则",
    4: "人工审核候选与失败项",
    5: "导出可追溯任务说明"
  };
  dom.decisionStepLabel.textContent = `STEP ${String(state.step).padStart(2, "0")}`;
  dom.decisionTitle.textContent = titles[state.step];
  dom.stepPanels.forEach((panel) => {
    panel.hidden = Number(panel.dataset.stepPanel) !== state.step;
  });

  if (state.step === 2) renderPlanning();
  if (state.step === 3) renderRules();
  if (state.step === 4) renderReview();
  if (state.step === 5) renderDelivery();
}

function renderPlanning() {
  const plans = availablePlans();
  dom.planChoices.replaceChildren();
  plans.forEach((plan) => {
    const label = document.createElement("label");
    label.className = "choice-card";
    const taskLabel = typeof plan.tasks === "number" ? `${plan.tasks} 个任务` : "按主体数";
    label.innerHTML = `<input type="radio" name="plan" value="${plan.id}" ${plan.id === currentPlan().id ? "checked" : ""}><span><strong>${plan.label}</strong><small>${plan.description}</small></span><span>${taskLabel}</span>`;
    dom.planChoices.append(label);
  });

  renderFormatChoices();
  renderPlanSummary();
}

function renderFormatChoices() {
  const plan = currentPlan();
  const options = outputOptions(plan);
  dom.formatChoices.replaceChildren();
  dom.formatFieldset.hidden = options.length === 0;

  options.forEach((option) => {
    const label = document.createElement("label");
    label.className = "format-choice";
    const ratio = option.ratio || plan.format;
    const helper = option.use || option.dimensions || "交付面";
    label.innerHTML = `<input type="checkbox" name="format" value="${option.id}" ${state.selectedOutputIds.has(option.id) ? "checked" : ""}><span><strong>${option.label}</strong><br>${ratio} · ${helper}</span>`;
    dom.formatChoices.append(label);
  });
}

function renderPlanSummary() {
  const plan = currentPlan();
  const selected = selectedOutputs(plan);
  const taskCount = currentFixture()
    ? selected.length || plan.tasks
    : plan.id === "upload-brand" ? selected.length : plan.tasks;
  dom.planSummary.innerHTML = `<span>当前计划</span><strong>${plan.label} · ${taskCount} ${typeof taskCount === "number" ? "个任务" : ""}</strong><small>${plan.lightingBranch}</small>`;
}

function renderRules() {
  const plan = currentPlan();
  dom.ruleBranch.textContent = plan.lightingBranch;
  dom.ruleCount.textContent = `${plan.rules.length} rules`;
  dom.ruleList.replaceChildren();
  plan.rules.forEach((rule, index) => {
    const item = document.createElement("article");
    item.className = "rule-item";
    item.innerHTML = `<span class="rule-origin" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><div><strong>${rule.label} <span>· ${rule.origin}</span></strong><p>${rule.value}</p></div>`;
    dom.ruleList.append(item);
  });
  dom.promptSummary.textContent = buildPromptSummary();
}

function buildPromptSummary() {
  const fixture = currentFixture();
  const plan = currentPlan();
  const subjectLocks = fixture
    ? fixture.subjects.flatMap((subject) => subject.locks)
    : ["pending detection", "pending identity confirmation"];
  const selected = selectedOutputs(plan);
  return [
    "Use case: identity-preserve, lighting-weather",
    "Asset type: format-adaptive Rembrandt-lit studio hero portrait",
    `Input: ${fixture ? `${fixture.label} fixture` : "local file; detection pending"}`,
    `Subject locks: ${subjectLocks.join(" / ")}`,
    `Task structure: ${plan.label}`,
    `Lighting branch: ${plan.lightingBranch}`,
    `Key direction: ${plan.keyDirection}`,
    `Delivery: ${selected.map((item) => item.ratio || item.label).join(" + ") || plan.format}`,
    "Studio: smooth neutral deep-charcoal-to-ink field; no texture or halo",
    `Failure checks: ${plan.rules.at(-1).value}`,
    "Generation status: not invoked by this workbench"
  ].join("\n");
}

function qaForCurrentPlan() {
  const plan = currentPlan();
  if (currentFixture()) return plan.qa;
  return [
    { id: "preview", label: "本地文件预览", status: "pass", note: "文件仅在当前浏览器内存中可见" },
    { id: "detection", label: "主体检测与身份确认", status: "partial", note: "待接检测/分割系统并由人确认" },
    { id: "candidate", label: "生成候选", status: "not-applicable", note: "静态 MVP 没有调用宿主图像模型" },
    { id: "automatic-qa", label: "自动相似度与背景检查", status: "not-applicable", note: "需接人脸/关键点/背景指标后执行" }
  ];
}

function renderReview() {
  const plan = currentPlan();
  const qa = qaForCurrentPlan();
  const passCount = qa.filter((item) => item.status === "pass").length;
  const partialCount = qa.filter((item) => item.status !== "pass").length;
  dom.reviewPassCount.textContent = String(passCount);
  dom.reviewPartialCount.textContent = String(partialCount);
  dom.qaList.replaceChildren();

  qa.forEach((item) => {
    const article = document.createElement("article");
    article.className = `qa-item is-${item.status}`;
    const symbol = item.status === "pass" ? "✓" : item.status === "partial" ? "!" : "—";
    const statusLabel = state.data.statusVocabulary[item.status] || item.status;
    article.innerHTML = `<span class="qa-status" aria-hidden="true">${symbol}</span><div><strong>${item.label}<span>${item.status}</span></strong><p>${item.note} · ${statusLabel}</p></div>`;
    dom.qaList.append(article);
  });

  const hasRejected = Boolean(plan.rejectedOutput);
  dom.rejectedEvidence.hidden = !hasRejected;
  if (hasRejected) {
    dom.rejectedImage.src = plan.rejectedOutput.asset;
    dom.rejectedImage.alt = plan.rejectedOutput.alt;
    dom.rejectedReason.textContent = plan.rejectedOutput.reason;
  }

  const isUpload = !currentFixture();
  dom.approveButton.textContent = isUpload ? "确认计划待执行" : "批准进入交付";
  dom.rejectButton.textContent = isUpload ? "取消这个计划" : "拒收并保留原因";
  dom.approveButton.setAttribute("aria-pressed", String(state.approval === "approved"));
  dom.rejectButton.setAttribute("aria-pressed", String(state.approval === "rejected"));
  dom.toDelivery.disabled = !state.approval;

  if (!state.approval) {
    dom.approvalFeedback.textContent = isUpload ? "尚未确认待执行计划。" : "尚未作出人工决定。";
  } else if (state.approval === "approved") {
    dom.approvalFeedback.textContent = isUpload
      ? "计划已确认；候选、自动 QA 与最终审批仍为待执行。"
      : "已批准当前证据进入交付；部分项仍保留人工复核记录。";
  } else {
    dom.approvalFeedback.textContent = isUpload
      ? "计划已取消；任务 JSON 会保留取消状态与系统缺口。"
      : "当前候选已拒收；任务 JSON 会保留失败项与人工决定。";
  }
}

function renderDelivery() {
  const spec = buildJobSpec();
  const json = JSON.stringify(spec, null, 2);
  dom.jsonPreview.textContent = json;
  if (state.downloadUrl) URL.revokeObjectURL(state.downloadUrl);
  state.downloadUrl = URL.createObjectURL(new Blob([json], { type: "application/json" }));
  dom.downloadJson.href = state.downloadUrl;
  dom.downloadJson.download = `portrait-workbench-${String(state.taskCounter).padStart(3, "0")}.json`;
  const approved = state.approval === "approved";
  const isUpload = !currentFixture();
  const icon = $(".delivery-state > span", dom.deliveryState);
  const title = $("strong", dom.deliveryState);
  const body = $("p", dom.deliveryState);
  icon.textContent = approved ? "✓" : "×";
  title.textContent = approved
    ? isUpload ? "待执行计划已编译" : "已批准任务说明"
    : "拒收记录已编译";
  body.textContent = isUpload
    ? "没有候选图；JSON 明确保留 detection / generation pending。"
    : "包含 fixture、Skill 规则、候选证据、QA 与人工决定。";
  dom.deliveryState.style.background = approved ? "var(--pass-soft)" : "var(--fail-soft)";
  dom.deliveryState.style.color = approved ? "var(--pass)" : "var(--fail)";
}

function renderScene() {
  const fixture = currentFixture();
  const plan = currentPlan();
  const isReview = state.step >= 4;
  const outputs = selectedOutputs(plan);

  dom.stageImage.hidden = true;
  dom.outputGrid.hidden = true;
  dom.outputGrid.replaceChildren();
  dom.canvasEmpty.hidden = true;
  dom.formatRail.replaceChildren();

  if (!isReview) {
    if (fixture) {
      dom.stageImage.hidden = false;
      dom.stageImage.src = fixture.source.asset;
      dom.stageImage.alt = fixture.source.alt;
      dom.evidenceLabel.textContent = state.step === 3 ? "RULE SOURCE" : "SOURCE EVIDENCE";
      dom.stageTitle.textContent = `${fixture.label} · ${state.step === 3 ? "规则输入" : "原始输入"}`;
      dom.evidenceBadge.textContent = state.step === 3 ? "compiled" : "fixture";
      dom.stageCaption.textContent = state.step === 3
        ? "规则已依据主体几何、身份锁和交付用途编译；此时仍未调用图像模型。"
        : "先确认输入和预标注主体，再决定保留同画面、分别制作或多画幅交付。";
      dom.evidenceMeta.innerHTML = `<span>${fixture.subjects.length} subjects</span><span>source ratio</span><span>manual fixture</span>`;
    } else if (state.uploadUrl) {
      dom.stageImage.hidden = false;
      dom.stageImage.src = state.uploadUrl;
      dom.stageImage.alt = `本地上传预览：${state.upload.name}`;
      dom.evidenceLabel.textContent = state.step === 3 ? "PENDING RULE SOURCE" : "LOCAL PREVIEW";
      dom.stageTitle.textContent = state.step === 3 ? "规则计划 · 等待检测" : "本地输入 · 仅预览";
      dom.evidenceBadge.textContent = "local only";
      dom.stageCaption.textContent = "图片没有离开浏览器；主体检测、身份确认和生成都没有运行。";
      dom.evidenceMeta.innerHTML = "<span>detection pending</span><span>generation pending</span><span>not uploaded</span>";
    } else {
      dom.canvasEmpty.hidden = false;
      dom.evidenceLabel.textContent = "EMPTY INPUT";
      dom.stageTitle.textContent = "等待本地图片";
      dom.evidenceBadge.textContent = "no file";
      dom.stageCaption.textContent = "选择一张图片后，工作台只建立本地预览和待执行计划。";
      dom.evidenceMeta.innerHTML = "<span>no upload</span><span>no model</span>";
    }
    dom.canvasStamp.textContent = state.step === 3 ? "规则已编译 · 未调用模型" : "原始输入 · 尚未生成";
    return;
  }

  if (!fixture || outputs.length === 0) {
    dom.canvasEmpty.hidden = false;
    dom.evidenceLabel.textContent = "CAPABILITY BOUNDARY";
    dom.stageTitle.textContent = "候选为空 · 计划仍可导出";
    dom.evidenceBadge.textContent = "not generated";
    dom.stageCaption.textContent = "静态 MVP 不调用图像模型，因此上传路径不会伪造候选或 QA 结果。";
    dom.evidenceMeta.innerHTML = "<span>detection pending</span><span>generation pending</span><span>qa pending</span>";
    dom.canvasStamp.textContent = "真实空状态 · 等待系统接入";
    return;
  }

  const familySplit = fixture.id === "family" && plan.id === "split";
  const visibleOutputs = familySplit
    ? outputs
    : [outputs.find((output) => output.id === state.activeOutputId) || outputs[0]];
  dom.outputGrid.hidden = false;
  dom.outputGrid.classList.toggle("is-single", visibleOutputs.length === 1);
  dom.outputGrid.replaceChildren();
  visibleOutputs.forEach((output) => {
    const figure = document.createElement("figure");
    figure.className = "output-card";
    figure.innerHTML = `<img src="${output.asset}" alt="${output.alt}" loading="eager"><figcaption><span>${output.label}</span><span>${output.dimensions || output.ratio || "fixture"}</span></figcaption>`;
    dom.outputGrid.append(figure);
  });

  if (outputs.length > 1 && !familySplit) {
    outputs.forEach((output) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "format-thumb";
      button.dataset.outputId = output.id;
      button.setAttribute("aria-pressed", String(output.id === state.activeOutputId));
      button.setAttribute("aria-label", `查看${output.label}`);
      button.innerHTML = `<img src="${output.asset}" alt=""><span>${output.ratio || output.label}</span>`;
      dom.formatRail.append(button);
    });
  }

  dom.evidenceLabel.textContent = state.step === 5 ? "DELIVERY EVIDENCE" : "REAL CANDIDATE";
  dom.stageTitle.textContent = `${fixture.label} · ${plan.label}`;
  dom.evidenceBadge.textContent = "saved evidence";
  dom.stageCaption.textContent = familySplit
    ? "两个独立生成任务各自保留身份锁；它们不是从原图无损抠出的像素。"
    : "显示的是研究项目已保存的真实候选；工作台没有在运行时重新生成。";
  dom.evidenceMeta.innerHTML = `<span>${outputs.length} selected outputs</span><span>manual QA</span><span>${state.approval || "pending decision"}</span>`;
  dom.canvasStamp.textContent = state.step === 5 ? `交付记录 · ${state.approval}` : "候选证据 · 人工复核";
}

function buildJobSpec() {
  const fixture = currentFixture();
  const plan = currentPlan();
  const outputs = selectedOutputs(plan);
  const subjects = fixture
    ? fixture.subjects.map((subject) => ({ id: subject.id, label: subject.label, locks: subject.locks }))
    : [{ id: "pending", status: "detection-and-human-confirmation-required" }];
  const qa = qaForCurrentPlan();

  return {
    schema_version: "portrait-workbench-job/1",
    task_id: `PWB-${String(state.taskCounter).padStart(3, "0")}`,
    created_at: new Date().toISOString(),
    input: fixture
      ? {
          kind: "fixture",
          fixture_id: fixture.id,
          asset: fixture.source.asset,
          subject_source: "pre-annotated research evidence",
          detection_status: "not-run-at-runtime"
        }
      : {
          kind: "local-file",
          name: state.upload?.name || null,
          type: state.upload?.type || null,
          size_bytes: state.upload?.size || null,
          local_only: true,
          uploaded_to_server: false,
          detection_status: "pending"
        },
    product: fixture?.id || "user-selected-plan",
    subjects,
    plan: {
      id: plan.id,
      label: plan.label,
      task_count: fixture ? outputs.length || plan.tasks : plan.id === "upload-brand" ? outputs.length : plan.tasks,
      delivery_formats: outputs.map((output) => ({ id: output.id, ratio: output.ratio || plan.format, use: output.use || output.label })),
      output_strategy: fixture?.id === "family" && plan.id === "split" ? "independent-generative-tasks-not-lossless-extraction" : "identity-locked-format-tasks"
    },
    skill_packet: {
      source: "rembrandt-portrait-lighting",
      use_case: ["identity-preserve", "lighting-weather"],
      lighting_branch: plan.lightingBranch,
      key_direction: plan.keyDirection,
      rules: plan.rules,
      retry_policy: "one targeted retry only for an observable named defect"
    },
    generation: {
      owner: "host-image-model",
      invoked_by_this_workbench: false,
      status: fixture ? "candidate-evidence-already-saved" : "pending"
    },
    candidate_evidence: fixture
      ? outputs.map((output) => ({ id: output.id, asset: output.asset, dimensions: output.dimensions || null }))
      : [],
    quality_review: {
      mode: fixture ? "recorded-manual-evidence" : "pending",
      checks: qa
    },
    human_decision: {
      status: state.approval || "pending",
      scope: fixture ? "candidate-review" : "plan-confirmation-only"
    },
    capability_boundaries: [
      "no runtime detection or segmentation",
      "no image model call",
      "no automatic identity similarity score",
      "no server upload, storage, account or rights workflow"
    ],
    provenance: {
      upstream: state.data.sourceSkill.upstream,
      fixture_revision: state.data.revision,
      license_note: "Upstream snapshot did not contain a standalone LICENSE; review before commercial use."
    }
  };
}

function goToStep(step) {
  if (step > state.maxStep + 1) return;
  if (step === 5 && !state.approval) return;
  state.step = step;
  state.maxStep = Math.max(state.maxStep, step);
  renderAll();
  const panel = $(`[data-step-panel='${step}']`);
  const firstFocusable = $("input:checked, button:not(:disabled), summary", panel);
  if (firstFocusable) firstFocusable.focus({ preventScroll: true });
}

function handlePlanChange(event) {
  const input = event.target.closest("input[name='plan']");
  if (!input) return;
  state.planId = input.value;
  state.approval = null;
  setDefaultSelection(currentPlan());
  renderPlanning();
  renderScene();
  renderArchitecturePacket();
}

function handleFormatChange(event) {
  const input = event.target.closest("input[name='format']");
  if (!input) return;
  if (input.checked) {
    state.selectedOutputIds.add(input.value);
  } else if (state.selectedOutputIds.size > 1) {
    state.selectedOutputIds.delete(input.value);
  } else {
    input.checked = true;
    return;
  }
  if (!state.selectedOutputIds.has(state.activeOutputId)) {
    state.activeOutputId = Array.from(state.selectedOutputIds)[0];
  }
  state.approval = null;
  renderPlanSummary();
  renderScene();
  renderArchitecturePacket();
}

function handleDecision(decision) {
  state.approval = decision;
  state.maxStep = Math.max(state.maxStep, 4);
  renderTaskHeader();
  renderStepNavigation();
  renderReview();
  renderScene();
  renderArchitecturePacket();
}

function validateUpload(file) {
  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowedTypes.has(file.type)) return "请选择 JPG、PNG 或 WebP 图片。";
  if (file.size > 12 * 1024 * 1024) return "文件超过 12 MB；请选择更小的本地图片。";
  return "";
}

function handleUpload(file) {
  if (!file) return;
  const error = validateUpload(file);
  if (error) {
    dom.uploadFeedback.textContent = error;
    dom.photoUpload.value = "";
    return;
  }
  const reader = new FileReader();
  dom.uploadFeedback.textContent = "正在本地读取图片…";
  reader.addEventListener("load", () => {
    state.upload = { name: file.name, type: file.type, size: file.size };
    state.uploadUrl = String(reader.result);
    state.approval = null;
    dom.uploadFeedback.textContent = `本地预览已就绪：${file.name}。没有上传、检测或生成。`;
    renderAll();
  });
  reader.addEventListener("error", () => {
    dom.uploadFeedback.textContent = "浏览器无法读取这个文件，请更换图片。";
  });
  reader.readAsDataURL(file);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  dom.themeToggle.setAttribute("aria-pressed", String(isDark));
  dom.themeToggle.setAttribute("aria-label", isDark ? "切换到亮色主题" : "切换到深色主题");
  try {
    localStorage.setItem("portrait-workbench-theme", theme);
  } catch (_) {
    // Local storage is optional; theme still changes for the current session.
  }
}

function initialTheme() {
  try {
    const stored = localStorage.getItem("portrait-workbench-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch (_) {
    // Fall through to system preference.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (_) {
      // Fall back to a temporary selection when clipboard permission is denied.
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy command was rejected");
}

function bindEvents() {
  dom.themeToggle.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  dom.modeButtons.forEach((button) => {
    button.addEventListener("click", () => setViewMode(button.dataset.modeTarget));
    button.addEventListener("keydown", (event) => {
      const index = dom.modeButtons.indexOf(button);
      let nextIndex = null;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % dom.modeButtons.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + dom.modeButtons.length) % dom.modeButtons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = dom.modeButtons.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      setViewMode(dom.modeButtons[nextIndex].dataset.modeTarget, { focus: true });
    });
  });

  dom.modeJumps.forEach((button) => {
    button.addEventListener("click", () => {
      setViewMode(button.dataset.modeJump, { focus: true });
      document.querySelector(".mode-switcher").scrollIntoView({ block: "start", behavior: "smooth" });
    });
  });

  dom.researchTabs.forEach((button) => {
    button.addEventListener("click", () => setResearchStage(button.dataset.researchStage));
    button.addEventListener("keydown", (event) => {
      const index = dom.researchTabs.indexOf(button);
      let nextIndex = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % dom.researchTabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + dom.researchTabs.length) % dom.researchTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = dom.researchTabs.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      setResearchStage(dom.researchTabs[nextIndex].dataset.researchStage, { focus: true });
    });
  });

  dom.scenarioFilters.forEach((button) => {
    button.addEventListener("click", () => setScenarioFilter(button.dataset.scenarioFilter));
  });

  dom.tabs.forEach((tab) => {
    tab.addEventListener("click", () => setFixture(tab.dataset.fixture));
    tab.addEventListener("keydown", (event) => {
      const index = dom.tabs.indexOf(tab);
      let nextIndex = null;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % dom.tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + dom.tabs.length) % dom.tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = dom.tabs.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      dom.tabs[nextIndex].focus();
      setFixture(dom.tabs[nextIndex].dataset.fixture);
    });
  });

  dom.stepButtons.forEach((button) => {
    button.addEventListener("click", () => goToStep(Number(button.dataset.step)));
  });

  $$('[data-next-step]').forEach((button) => {
    button.addEventListener("click", () => goToStep(Number(button.dataset.nextStep)));
  });

  dom.planChoices.addEventListener("change", handlePlanChange);
  dom.formatChoices.addEventListener("change", handleFormatChange);
  dom.formatRail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-output-id]");
    if (!button) return;
    state.activeOutputId = button.dataset.outputId;
    renderScene();
  });

  dom.approveButton.addEventListener("click", () => handleDecision("approved"));
  dom.rejectButton.addEventListener("click", () => handleDecision("rejected"));
  dom.photoUpload.addEventListener("change", () => handleUpload(dom.photoUpload.files[0]));
  dom.downloadJson.addEventListener("click", () => {
    dom.copyFeedback.textContent = "任务 JSON 已下载；图片文件不会被包含或上传。";
  });
  dom.copyJson.addEventListener("click", async () => {
    try {
      await copyText(JSON.stringify(buildJobSpec(), null, 2));
      dom.copyFeedback.textContent = "任务 JSON 已复制。";
    } catch (_) {
      dom.copyFeedback.textContent = "浏览器拒绝了剪贴板权限，请使用下载按钮。";
    }
  });
  dom.resetTask.addEventListener("click", () => {
    state.taskCounter += 1;
    dom.copyFeedback.textContent = "";
    resetFlow();
    dom.workbench.scrollIntoView({ block: "start", behavior: "smooth" });
  });
  dom.retryLoad.addEventListener("click", loadData);
  window.addEventListener("resize", renderStepNavigation, { passive: true });
}

async function loadData() {
  dom.loadError.hidden = true;
  try {
    const response = await fetch("data/workbench-fixtures.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.fixtures) || data.fixtures.length < 2) throw new Error("Invalid fixture manifest");
    state.data = data;
    state.planId = data.fixtures[0].plans[0].id;
    setDefaultSelection(currentPlan());
    dom.workbench.hidden = false;
    dom.workbench.inert = false;
    dom.workbench.setAttribute("aria-busy", "false");
    renderAll();
    setViewMode(state.viewMode, { updateUrl: false });
  } catch (error) {
    dom.workbench.hidden = true;
    dom.workbench.inert = true;
    dom.workbench.setAttribute("aria-busy", "true");
    dom.loadError.hidden = false;
    console.error("Unable to load workbench fixtures", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  state.viewMode = modeFromLocation();
  setTheme(initialTheme());
  setViewMode(state.viewMode, { updateUrl: false });
  setResearchStage(state.researchStage);
  setScenarioFilter(state.scenarioFilter);
  bindEvents();
  loadData();
});
