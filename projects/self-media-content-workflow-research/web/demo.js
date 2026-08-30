const stageButtons = [...document.querySelectorAll("[data-stage]")];
const stagePanels = [...document.querySelectorAll("[data-stage-panel]")];
const nextStageButton = document.querySelector("#next-stage");
const currentStep = document.querySelector("#current-step");
const currentStatus = document.querySelector("#current-status");
const progressValue = document.querySelector("#progress-value");
const progressTrack = document.querySelector(".progress-track");
const stageAnnouncer = document.querySelector("#stage-announcer");
const visitedCount = document.querySelector("#visited-count");
const approvalVisitedCount = document.querySelector("#approval-visited-count");
const startDemoLink = document.querySelector("#start-demo");

const outputButtons = [...document.querySelectorAll("[data-output]")];
const outputPanels = [...document.querySelectorAll("[data-output-panel]")];
const themeButton = document.querySelector("#demo-theme-toggle");

let activeStageIndex = 0;
const visitedStages = new Set();
let approvalReady = false;
let runtimeReady = false;
let activeRevision = null;

function syncVisitedStages() {
  const count = visitedStages.size;
  visitedCount.textContent = String(count);
  approvalVisitedCount.textContent = String(count);
  if (approvalReady) updateApprovalEligibility();
}

function activateStage(stageName, options = {}) {
  const nextIndex = stageButtons.findIndex((button) => button.dataset.stage === stageName);
  if (nextIndex < 0) return;

  activeStageIndex = nextIndex;
  stageButtons.forEach((button, index) => {
    const selected = index === nextIndex;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });

  stagePanels.forEach((panel) => {
    panel.hidden = panel.dataset.stagePanel !== stageName;
  });

  const activeButton = stageButtons[nextIndex];
  const step = activeButton.dataset.step;
  const stageLabel = activeButton.querySelector("strong").textContent;
  const isFirstVisit = !visitedStages.has(stageName);
  visitedStages.add(stageName);
  activeButton.classList.add("is-seen");
  activeButton.dataset.visited = "true";
  syncVisitedStages();
  if (runtimeReady && isFirstVisit) appendRunEvent("STAGE_REVIEWED", `${step} · ${stageLabel}阶段已检查`);
  if (runtimeReady && activeRevision && visitedStages.size === stageButtons.length && approvalWorkspace.dataset.decision === "revising") {
    markRevisionReady();
  }
  currentStep.textContent = `${step} / 09`;
  currentStatus.textContent = activeButton.dataset.status;
  progressValue.style.width = `${((nextIndex + 1) / stageButtons.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(nextIndex + 1));
  stageAnnouncer.textContent = `已切换到第 ${nextIndex + 1} 阶段：${stageLabel}。${activeButton.dataset.status}。`;

  const isLast = nextIndex === stageButtons.length - 1;
  nextStageButton.innerHTML = isLast
    ? "进入人工审核 <span aria-hidden=\"true\">→</span>"
    : "下一阶段 <span aria-hidden=\"true\">→</span>";

  if (options.updateHash !== false) {
    history.replaceState(null, "", `#stage-${stageName}`);
  }
  if (options.focus) activeButton.focus();
  if (options.reveal) activeButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}

stageButtons.forEach((button, index) => {
  button.addEventListener("click", () => activateStage(button.dataset.stage));
  button.addEventListener("keydown", (event) => {
    const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
    const backward = event.key === "ArrowUp" || event.key === "ArrowLeft";
    if (!forward && !backward && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();

    let targetIndex = index;
    if (forward) targetIndex = (index + 1) % stageButtons.length;
    if (backward) targetIndex = (index - 1 + stageButtons.length) % stageButtons.length;
    if (event.key === "Home") targetIndex = 0;
    if (event.key === "End") targetIndex = stageButtons.length - 1;
    activateStage(stageButtons[targetIndex].dataset.stage, { focus: true, reveal: true });
  });
});

nextStageButton.addEventListener("click", () => {
  if (activeStageIndex === stageButtons.length - 1) {
    history.replaceState(null, "", "#approval");
    restoreAnchor("#approval");
    stageAnnouncer.textContent = "9 个阶段已浏览，已进入人工审核台。所有决定仅在当前页面演练。";
    return;
  }
  const nextIndex = (activeStageIndex + 1) % stageButtons.length;
  activateStage(stageButtons[nextIndex].dataset.stage, { reveal: true });
});

startDemoLink.addEventListener("click", () => {
  activateStage("idea", { updateHash: false });
  stageAnnouncer.textContent = "完整演示已启动。当前是第 1 阶段：想法。";
});

function activateOutput(outputName, options = {}) {
  const nextIndex = outputButtons.findIndex((button) => button.dataset.output === outputName);
  if (nextIndex < 0) return;
  outputButtons.forEach((button, index) => {
    const selected = index === nextIndex;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  outputPanels.forEach((panel) => {
    panel.hidden = panel.dataset.outputPanel !== outputName;
  });
  if (options.focus) outputButtons[nextIndex].focus();
}

outputButtons.forEach((button, index) => {
  button.addEventListener("click", () => activateOutput(button.dataset.output));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let targetIndex = index;
    if (event.key === "ArrowRight") targetIndex = (index + 1) % outputButtons.length;
    if (event.key === "ArrowLeft") targetIndex = (index - 1 + outputButtons.length) % outputButtons.length;
    if (event.key === "Home") targetIndex = 0;
    if (event.key === "End") targetIndex = outputButtons.length - 1;
    activateOutput(outputButtons[targetIndex].dataset.output, { focus: true });
  });
});

function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeButton.setAttribute("aria-pressed", String(dark));
  themeButton.setAttribute("aria-label", dark ? "切换到浅色主题" : "切换到深色主题");
  themeButton.querySelector(".theme-label").textContent = dark ? "浅色" : "深色";
}

function readStoredTheme() {
  try {
    return window.localStorage.getItem("self-media-theme");
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    window.localStorage.setItem("self-media-theme", theme);
  } catch {
    // Theme still works for this session when storage is unavailable.
  }
}

themeButton.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  storeTheme(nextTheme);
});

const preferredTheme = readStoredTheme()
  || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(preferredTheme);

const initialHash = window.location.hash;
const requestedStage = initialHash.startsWith("#stage-")
  ? initialHash.replace("#stage-", "")
  : "idea";
activateStage(requestedStage, { updateHash: false });
activateOutput("xhs");

function restoreAnchor(hash) {
  let anchor = null;
  if (hash.startsWith("#stage-")) anchor = document.querySelector("#workbench");
  if (hash === "#scenario" || hash === "#workbench" || hash === "#approval" || hash === "#case-closure" || hash === "#artifact-index") anchor = document.querySelector(hash);
  if (anchor) {
    const offset = Number.parseFloat(getComputedStyle(anchor).scrollMarginTop) || 88;
    const top = window.scrollY + anchor.getBoundingClientRect().top - offset;
    window.scrollTo({ top, behavior: "instant" });
  }
}

if (document.readyState === "complete") {
  setTimeout(() => restoreAnchor(initialHash), 0);
} else {
  window.addEventListener("load", () => setTimeout(() => restoreAnchor(initialHash), 0), { once: true });
}

window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  if (hash.startsWith("#stage-")) {
    activateStage(hash.replace("#stage-", ""), { updateHash: false });
  }
  setTimeout(() => restoreAnchor(hash), 0);
});

const approvalWorkspace = document.querySelector(".approval-workspace");
const approvalForm = document.querySelector("#approval-form");
const approvalChecks = [...document.querySelectorAll("[data-approval-check]")];
const approvalState = document.querySelector("#approval-state");
const approvalStateCopy = document.querySelector("#approval-state-copy");
const approvalFeedback = document.querySelector("#approval-feedback");
const approveButton = document.querySelector("#approve-button");
const returnButton = document.querySelector("#return-button");
const returnReason = document.querySelector("#return-reason");
const decisionReceipt = document.querySelector("#decision-receipt");
const receiptId = document.querySelector("#receipt-id");
const receiptDecision = document.querySelector("#receipt-decision");
const receiptPlatform = document.querySelector("#receipt-platform");
const receiptChecks = document.querySelector("#receipt-checks");
const receiptNext = document.querySelector("#receipt-next");
const resetApprovalButton = document.querySelector("#reset-approval");
const revisionRouteButton = document.querySelector("#revision-route");
const restartDemoButton = document.querySelector("#restart-demo");
const runEventLog = document.querySelector("#run-event-log");
const runLogAnnouncer = document.querySelector("#run-log-announcer");

let runEventSequence = 0;

const platformNames = {
  xiaohongshu: "小红书",
  wechat: "公众号",
  video: "短视频",
};

const revisionRoutes = {
  FACT: { stage: "evidence", label: "证据", invalidateFrom: 2 },
  ASSET: { stage: "assets", label: "素材", invalidateFrom: 5 },
  PLATFORM: { stage: "platform", label: "平台", invalidateFrom: 3 },
  COMPLIANCE: { stage: "quality", label: "质检", invalidateFrom: 6 },
};

function getSelectedPlatform() {
  return approvalForm.querySelector('input[name="primary-platform"]:checked')?.value || "";
}

function getApprovalCheckCount() {
  return approvalChecks.filter((checkbox) => checkbox.checked).length;
}

function appendRunEvent(type, detail, variant = "") {
  runEventSequence += 1;
  const item = document.createElement("li");
  if (variant) item.classList.add(`is-${variant}`);

  const sequence = document.createElement("span");
  sequence.textContent = String(runEventSequence).padStart(2, "0");
  const eventName = document.createElement("strong");
  eventName.textContent = type;
  const description = document.createElement("p");
  description.textContent = detail;
  const writeState = document.createElement("small");
  writeState.textContent = "WRITE 0";

  item.append(sequence, eventName, description, writeState);
  runEventLog.append(item);
  runEventLog.scrollTop = runEventLog.scrollHeight;
  runLogAnnouncer.textContent = `运行事件 ${runEventSequence}：${type}。${detail}。外部写入 0。`;
}

function clearRunLog() {
  runEventSequence = 0;
  runEventLog.replaceChildren();
  runLogAnnouncer.textContent = "";
}

function updateApprovalEligibility() {
  const platform = getSelectedPlatform();
  const checkCount = getApprovalCheckCount();
  const missingStages = stageButtons.length - visitedStages.size;
  const stagesReady = missingStages === 0;
  approveButton.disabled = !(stagesReady && platform && checkCount === approvalChecks.length);
  returnButton.disabled = !returnReason.value;

  if (!approveButton.disabled) {
    approvalFeedback.textContent = `9 / 9 阶段已检查，已选择${platformNames[platform]}，4 / 4 项确认完成，可以生成本地批准回执。`;
  } else if (!stagesReady) {
    approvalFeedback.textContent = `还需检查 ${missingStages} 个阶段；${platform ? `已选择${platformNames[platform]}` : "尚未选择主平台"}，当前完成 ${checkCount} / 4 项确认。`;
  } else if (returnReason.value) {
    approvalFeedback.textContent = `9 / 9 阶段已检查且已选择退回原因；也可继续选择主平台并完成 4 / 4 项确认后批准。`;
  } else {
    approvalFeedback.textContent = `9 / 9 阶段已检查；${platform ? `已选择${platformNames[platform]}` : "请再选择主平台"}，当前完成 ${checkCount} / 4 项确认。`;
  }
}

function issueDecision(type) {
  const platform = getSelectedPlatform();
  const platformLabel = platformNames[platform] || "未选择";
  const checkCount = getApprovalCheckCount();
  const approved = type === "approved";
  const reasonCode = returnReason.value;
  const reasonLabel = returnReason.options[returnReason.selectedIndex]?.text || "未说明";
  const revisionRoute = revisionRoutes[reasonCode];
  if ((approved && approveButton.disabled) || (!approved && returnButton.disabled)) return;

  activeRevision = approved ? null : { ...revisionRoute, reasonCode, reasonLabel };
  revisionRouteButton.hidden = approved;
  if (!approved) {
    revisionRouteButton.textContent = `回到${revisionRoute.label}阶段修订`;
    revisionRouteButton.dataset.stage = revisionRoute.stage;
  }

  approvalWorkspace.dataset.decision = approved ? "approved" : "returned";
  approvalState.textContent = approved ? "READY_FOR_DRAFT_HANDOFF" : "CHANGES_REQUESTED";
  approvalStateCopy.textContent = approved
    ? `本地演练已批准 ${platformLabel} 进入草稿准备；仍未连接真实账号。`
    : `内容已退回修改：${reasonLabel}。`;
  receiptId.textContent = approved
    ? `DEMO-RL-001-APPROVED-${platform.toUpperCase()}`
    : `DEMO-RL-001-RETURNED-${reasonCode}`;
  receiptDecision.textContent = approved ? "批准进入本地草稿准备" : `退回修改 · ${reasonLabel}`;
  receiptPlatform.textContent = platformLabel;
  receiptChecks.textContent = `${checkCount} / ${approvalChecks.length}`;
  receiptNext.textContent = approved
    ? `完成 ${platformLabel} 的最终素材和预览核验，再单独申请账号授权。`
    : `回到${revisionRoute.label}阶段修订；该阶段及其下游必须重新检查。`;
  decisionReceipt.hidden = false;
  approvalFeedback.textContent = approved
    ? "本地批准回执已生成；外部写入仍为 0。"
    : "退回回执已生成；可以根据原因继续修订。";
  appendRunEvent(
    approved ? "HUMAN_APPROVED" : "CHANGES_REQUESTED",
    approved ? `${platformLabel}进入本地草稿准备` : reasonLabel,
    approved ? "decision" : "return",
  );
  decisionReceipt.focus({ preventScroll: true });
  decisionReceipt.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function markRevisionReady() {
  const revisionLabel = activeRevision?.label || "目标";
  approvalWorkspace.dataset.decision = "awaiting";
  approvalState.textContent = "AWAITING_USER";
  approvalStateCopy.textContent = `${revisionLabel}阶段及下游已重新检查到 9 / 9；请重新完成四项人工确认。`;
  appendRunEvent("REVISION_READY_FOR_REVIEW", `${revisionLabel}返工链路已重新检查到 9 / 9`, "decision");
  activeRevision = null;
  updateApprovalEligibility();
}

function startRevision() {
  if (!activeRevision) return;
  const revision = { ...activeRevision };
  approvalWorkspace.dataset.decision = "revising";
  approvalState.textContent = "REVISION_IN_PROGRESS";
  approvalStateCopy.textContent = `${revision.reasonLabel}；正在从${revision.label}阶段重新检查受影响链路。`;

  stageButtons.slice(revision.invalidateFrom).forEach((button) => {
    visitedStages.delete(button.dataset.stage);
    button.classList.remove("is-seen");
    delete button.dataset.visited;
  });
  approvalChecks.forEach((checkbox) => { checkbox.checked = false; });
  returnReason.value = "";
  if (revision.reasonCode === "PLATFORM") {
    approvalForm.querySelectorAll('input[name="primary-platform"]').forEach((radio) => { radio.checked = false; });
  }
  decisionReceipt.hidden = true;
  revisionRouteButton.hidden = true;
  syncVisitedStages();
  appendRunEvent("REVISION_STARTED", `${revision.reasonCode} → ${revision.label}阶段；下游检查已失效`, "return");
  activateStage(revision.stage, { updateHash: false });
  history.replaceState(null, "", `#stage-${revision.stage}`);
  restoreAnchor(`#stage-${revision.stage}`);
  stageAnnouncer.textContent = `已按退回原因进入${revision.label}阶段。该阶段及其下游需要重新检查。`;
  setTimeout(() => stageButtons[revision.invalidateFrom].focus(), 0);
}

function resetApprovalState({ logEvent = true, focus = false } = {}) {
  activeRevision = null;
  approvalForm.reset();
  approvalWorkspace.dataset.decision = "awaiting";
  approvalState.textContent = "AWAITING_USER";
  approvalStateCopy.textContent = "等待内容负责人完成 9 / 9 阶段检查、选择主平台并完成四项确认。";
  decisionReceipt.hidden = true;
  revisionRouteButton.hidden = true;
  updateApprovalEligibility();
  if (logEvent) appendRunEvent("HUMAN_GATE_RESET", "审核表单和本地回执已清空");
  if (focus) approvalForm.querySelector('input[name="primary-platform"]').focus();
}

function restartDemo() {
  runtimeReady = false;
  visitedStages.clear();
  stageButtons.forEach((button) => {
    button.classList.remove("is-seen");
    delete button.dataset.visited;
  });
  resetApprovalState({ logEvent: false });
  clearRunLog();
  runtimeReady = true;
  appendRunEvent("DEMO_RESTARTED", "会话状态已清空，重新从第 1 阶段开始");
  activateStage("idea", { updateHash: false });
  history.replaceState(null, "", "#stage-idea");
  restoreAnchor("#stage-idea");
  stageAnnouncer.textContent = "完整演示已重启。当前是第 1 阶段：想法；已检查 1 / 9。";
  setTimeout(() => stageButtons[0].focus(), 0);
}

approvalForm.addEventListener("submit", (event) => event.preventDefault());
approvalForm.addEventListener("change", updateApprovalEligibility);
approveButton.addEventListener("click", () => issueDecision("approved"));
returnButton.addEventListener("click", () => issueDecision("returned"));
revisionRouteButton.addEventListener("click", startRevision);
resetApprovalButton.addEventListener("click", () => resetApprovalState({ focus: true }));
restartDemoButton.addEventListener("click", restartDemo);

approvalReady = true;
runtimeReady = true;
appendRunEvent("DEMO_READY", "单一场景已载入，等待逐阶段检查");
appendRunEvent(
  "STAGE_REVIEWED",
  `${stageButtons[activeStageIndex].dataset.step} · ${stageButtons[activeStageIndex].querySelector("strong").textContent}阶段已检查`,
);
updateApprovalEligibility();
