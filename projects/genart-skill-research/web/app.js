import {
  censusFeatures,
  deriveHashes,
  normalizeHash,
  pixelDigest,
  randomHash,
  renderArtwork,
  targetPercent,
} from "./genart-core.js";
import { SCENARIOS, renderScenario } from "./scenario-core.js";
import { auditCaseRoutes, CASE_HASH, caseTraits, renderCase } from "./case-core.js";
import { LENSES } from "./lens-core.js";
import { renderCinematicLens } from "./lens-cinematic.js";
import {
  APPLICATIONS,
  BRAND_DEFAULTS,
  buildBrandManifest,
  buildBrandSvg,
  normalizeBrandInputs,
  renderApplication,
  renderBrandComparison,
} from "./application-core.js";

window.__consoleErrors = [];
const originalConsoleError = console.error.bind(console);
console.error = (...args) => {
  window.__consoleErrors.push(args.map(String).join(" "));
  originalConsoleError(...args);
};
window.addEventListener("error", (event) => window.__consoleErrors.push(event.message));
window.addEventListener("unhandledrejection", (event) => {
  window.__consoleErrors.push(String(event.reason?.message || event.reason || "Unhandled promise rejection"));
});

const query = new URLSearchParams(location.search);
const forceNoCanvas = query.get("noCanvas") === "1";
const initialSeed = normalizeHash(query.get("hash") || `0x${"c0de".repeat(16)}`);
const initialBrand = normalizeBrandInputs({
  brandName: query.get("brand") || BRAND_DEFAULTS.brandName,
  headline: query.get("headline") || BRAND_DEFAULTS.headline,
  primary: query.get("primary") || BRAND_DEFAULTS.primary,
  accent: query.get("accent") || BRAND_DEFAULTS.accent,
  campaignId: query.get("campaign") || BRAND_DEFAULTS.campaignId,
});

const state = {
  seed: initialSeed,
  mode: "deterministic",
  size: 720,
  theme: localStorage.getItem("genart-theme") || "light",
  scenario: SCENARIOS[query.get("scenario")] ? query.get("scenario") : "world",
  lens: LENSES[query.get("lens")] ? query.get("lens") : "support",
  application: APPLICATIONS[query.get("application")] ? query.get("application") : "game",
  brand: initialBrand,
  caseVersion: "release",
  caseStage: 0,
};

const elements = {
  html: document.documentElement,
  themeButton: document.querySelector("#theme-toggle"),
  seedInput: document.querySelector("#seed-input"),
  seedShort: document.querySelector("#seed-short"),
  canvas: document.querySelector("#live-canvas"),
  canvasFallback: document.querySelector("#canvas-fallback"),
  rerenderButton: document.querySelector("#rerender-seed"),
  randomButton: document.querySelector("#random-seed"),
  downloadButton: document.querySelector("#download-png"),
  checkButton: document.querySelector("#run-check"),
  checkStatus: document.querySelector("#check-status"),
  checkRuns: document.querySelector("#check-runs"),
  featureList: document.querySelector("#feature-list"),
  digest: document.querySelector("#pixel-digest"),
  renderTime: document.querySelector("#render-time"),
  bufferSize: document.querySelector("#buffer-size"),
  sizeSelect: document.querySelector("#render-size"),
  modeButtons: [...document.querySelectorAll("button[data-mode]")],
  grid: document.querySelector("#collection-grid"),
  gridButton: document.querySelector("#refresh-grid"),
  censusButton: document.querySelector("#run-census"),
  censusStatus: document.querySelector("#census-status"),
  censusCharts: document.querySelector("#census-charts"),
  caseSteps: [...document.querySelectorAll("[data-case-step]")],
  caseCanvas: document.querySelector("#case-canvas"),
  caseFallback: document.querySelector("#case-fallback"),
  caseSeed: document.querySelector("#case-seed"),
  caseReplay: document.querySelector("#case-replay"),
  caseFix: document.querySelector("#case-fix"),
  caseAudit: document.querySelector("#case-audit"),
  caseVersion: document.querySelector("#case-version"),
  caseRouteStatus: document.querySelector("#case-route-status"),
  casePhase: document.querySelector("#case-phase"),
  caseResultTitle: document.querySelector("#case-result-title"),
  caseResultCopy: document.querySelector("#case-result-copy"),
  caseWorld: document.querySelector("#case-world"),
  caseEnemy: document.querySelector("#case-enemy"),
  caseLoot: document.querySelector("#case-loot"),
  caseVfx: document.querySelector("#case-vfx"),
  caseReplayStatus: document.querySelector("#case-replay-status"),
  caseReplayRuns: document.querySelector("#case-replay-runs"),
  caseIdentityStatus: document.querySelector("#case-identity-status"),
  caseEnemyCheck: document.querySelector("#case-enemy-check"),
  caseLootCheck: document.querySelector("#case-loot-check"),
  caseAuditStatus: document.querySelector("#case-audit-status"),
  caseAuditBefore: document.querySelector("#case-audit-before"),
  caseAuditAfter: document.querySelector("#case-audit-after"),
  caseAuditBeforeBar: document.querySelector(".audit-before"),
  caseAuditAfterBar: document.querySelector(".audit-after"),
  lensSection: document.querySelector("#role-lenses"),
  lensWorkbench: document.querySelector(".lens-workbench"),
  lensButtons: [...document.querySelectorAll("button[data-lens]")],
  lensPanel: document.querySelector("#lens-panel"),
  lensCanvas: document.querySelector("#lens-canvas"),
  lensFallback: document.querySelector("#lens-fallback"),
  lensCode: document.querySelector("#lens-code"),
  lensSeed: document.querySelector("#lens-seed"),
  lensDigest: document.querySelector("#lens-digest"),
  lensRenderTime: document.querySelector("#lens-render-time"),
  lensKicker: document.querySelector("#lens-kicker"),
  lensTitle: document.querySelector("#lens-title"),
  lensQuestion: document.querySelector("#lens-question"),
  lensSummary: document.querySelector("#lens-summary"),
  lensInput: document.querySelector("#lens-input"),
  lensEvidence: document.querySelector("#lens-evidence"),
  lensDecision: document.querySelector("#lens-decision"),
  lensImpactLabel: document.querySelector("#lens-impact-label"),
  lensImpact: document.querySelector("#lens-impact"),
  lensChain: [...document.querySelectorAll("[data-lens-chain]")],
  applicationWorkbench: document.querySelector(".application-workbench"),
  applicationButtons: [...document.querySelectorAll("button[data-application]")],
  applicationPanel: document.querySelector("#application-panel"),
  applicationCanvas: document.querySelector("#application-canvas"),
  applicationFallback: document.querySelector("#application-fallback"),
  applicationCode: document.querySelector("#application-code"),
  applicationSeed: document.querySelector("#application-seed"),
  applicationDigest: document.querySelector("#application-digest"),
  applicationRenderTime: document.querySelector("#application-render-time"),
  applicationReplay: document.querySelector("#application-replay"),
  applicationRandom: document.querySelector("#application-random"),
  applicationKicker: document.querySelector("#application-kicker"),
  applicationTitle: document.querySelector("#application-title"),
  applicationSummary: document.querySelector("#application-summary"),
  applicationInput: document.querySelector("#application-input"),
  applicationOutput: document.querySelector("#application-output"),
  applicationValue: document.querySelector("#application-value"),
  applicationFormats: document.querySelector("#application-formats"),
  brandProduction: document.querySelector("#brand-production"),
  brandControls: document.querySelector("#brand-controls"),
  brandName: document.querySelector("#brand-name"),
  brandHeadline: document.querySelector("#brand-headline"),
  brandCampaignId: document.querySelector("#brand-campaign-id"),
  brandPrimary: document.querySelector("#brand-primary"),
  brandAccent: document.querySelector("#brand-accent"),
  brandEditStatus: document.querySelector("#brand-edit-status"),
  brandReset: document.querySelector("#brand-reset"),
  brandComparison: document.querySelector("#brand-comparison"),
  brandRunComparison: document.querySelector("#brand-run-comparison"),
  brandStableCanvas: document.querySelector("#brand-stable-canvas"),
  brandBrokenCanvas: document.querySelector("#brand-broken-canvas"),
  brandStableStatus: document.querySelector("#brand-stable-status"),
  brandBrokenStatus: document.querySelector("#brand-broken-status"),
  brandStableRuns: document.querySelector("#brand-stable-runs"),
  brandBrokenRuns: document.querySelector("#brand-broken-runs"),
  brandComparisonNote: document.querySelector("#brand-comparison-note"),
  brandDownloadButtons: [...document.querySelectorAll("[data-brand-download]")],
  scenarioButtons: [...document.querySelectorAll("button[data-scenario]")],
  scenarioPanel: document.querySelector("#scenario-panel"),
  scenarioCanvas: document.querySelector("#scenario-canvas"),
  scenarioFallback: document.querySelector("#scenario-fallback"),
  scenarioCode: document.querySelector("#scenario-code"),
  scenarioSeed: document.querySelector("#scenario-seed"),
  scenarioDigest: document.querySelector("#scenario-digest"),
  scenarioRerender: document.querySelector("#scenario-rerender"),
  scenarioRandom: document.querySelector("#scenario-random"),
  scenarioKicker: document.querySelector("#scenario-kicker"),
  scenarioTitle: document.querySelector("#scenario-title"),
  scenarioSummary: document.querySelector("#scenario-summary"),
  scenarioFeatures: document.querySelector("#scenario-features"),
  scenarioAngles: Object.fromEntries(
    ["input", "output", "verify", "value", "extend", "boundary"].map((key) => [
      key,
      document.querySelector(`#scenario-angle-${key}`),
    ]),
  ),
  copyButtons: [...document.querySelectorAll("[data-copy]")],
};

function hasCanvas() {
  if (forceNoCanvas) return false;
  try {
    return Boolean(elements.canvas?.getContext?.("2d"));
  } catch {
    return false;
  }
}

const canvasAvailable = hasCanvas();
let studioBusy = false;
let scenarioBusy = false;
let caseBusy = false;
let caseReleaseResult = null;
let lensRenderToken = 0;
let applicationRenderToken = 0;
let applicationBusy = false;
let brandComparisonBusy = false;
let brandInputFrame = 0;
let lastApplicationDigest = "";

function syncUrl() {
  const params = new URLSearchParams();
  params.set("hash", state.seed);
  params.set("scenario", state.scenario);
  params.set("lens", state.lens);
  params.set("application", state.application);
  if (state.brand.brandName !== BRAND_DEFAULTS.brandName) params.set("brand", state.brand.brandName);
  if (state.brand.headline !== BRAND_DEFAULTS.headline) params.set("headline", state.brand.headline);
  if (state.brand.primary !== BRAND_DEFAULTS.primary) params.set("primary", state.brand.primary);
  if (state.brand.accent !== BRAND_DEFAULTS.accent) params.set("accent", state.brand.accent);
  if (state.brand.campaignId !== BRAND_DEFAULTS.campaignId) params.set("campaign", state.brand.campaignId);
  if (forceNoCanvas) params.set("noCanvas", "1");
  history.replaceState(null, "", `${location.pathname}?${params}${location.hash}`);
}

function setStudioBusy(busy) {
  studioBusy = busy;
  const renderControls = [
    elements.seedInput,
    elements.rerenderButton,
    elements.randomButton,
    elements.sizeSelect,
    ...elements.modeButtons,
  ];
  for (const control of renderControls) control.disabled = busy;
  elements.checkButton.disabled = busy || !canvasAvailable;
  elements.downloadButton.disabled = busy || !canvasAvailable;
}

function setTheme(theme) {
  state.theme = theme === "dark" ? "dark" : "light";
  elements.html.dataset.theme = state.theme;
  elements.themeButton.setAttribute("aria-pressed", String(state.theme === "dark"));
  elements.themeButton.querySelector("span").textContent = state.theme === "dark" ? "切换浅色" : "切换深色";
  localStorage.setItem("genart-theme", state.theme);
}

function syncModeButtons() {
  for (const button of elements.modeButtons) {
    const selected = button.dataset.mode === state.mode;
    button.setAttribute("aria-pressed", String(selected));
    button.classList.toggle("is-active", selected);
  }
  document.body.dataset.mode = state.mode;
}

function renderFeatures(features) {
  elements.featureList.replaceChildren(
    ...Object.entries(features).map(([label, value]) => {
      const item = document.createElement("li");
      item.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
      return item;
    }),
  );
}

function syncCaseSteps() {
  for (const [index, step] of elements.caseSteps.entries()) {
    step.classList.toggle("is-active", state.caseStage < 5 && index === state.caseStage);
    step.classList.toggle("is-complete", index < state.caseStage || state.caseStage === 5);
  }
  document.querySelector("#case-study").dataset.stage = String(state.caseStage);
}

function setCaseBusy(busy) {
  caseBusy = busy;
  elements.caseReplay.disabled = busy || !canvasAvailable;
  elements.caseFix.disabled = busy || !canvasAvailable || state.caseStage < 2;
  elements.caseAudit.disabled = busy || !canvasAvailable || state.caseStage < 3;
}

function setCaseStage(stage) {
  state.caseStage = stage;
  syncCaseSteps();
  setCaseBusy(caseBusy);
}

function renderCaseStreams(traits) {
  elements.caseSeed.textContent = `${CASE_HASH.slice(0, 12)}…${CASE_HASH.slice(-6)}`;
  elements.caseWorld.textContent = `${traits.world.biome} · T${traits.world.threat}`;
  elements.caseEnemy.textContent = traits.enemy.id;
  elements.caseEnemy.title = traits.enemy.id;
  elements.caseLoot.textContent = traits.loot.id;
  elements.caseLoot.title = traits.loot.id;
  elements.caseVfx.textContent = traits.vfx.atmosphere;
}

function resetCaseEvidence() {
  elements.caseReplayStatus.textContent = "等待操作";
  elements.caseReplayRuns.innerHTML = "<li><span>RUN 1</span><code>—</code></li><li><span>RUN 2</span><code>—</code></li><li><span>RUN 3</span><code>—</code></li>";
  elements.caseIdentityStatus.textContent = "等待修复";
  for (const item of [elements.caseEnemyCheck, elements.caseLootCheck]) {
    item.textContent = "—";
    item.classList.remove("is-preserved");
  }
  elements.caseAuditStatus.textContent = "尚未运行";
  elements.caseAuditBefore.textContent = "—";
  elements.caseAuditAfter.textContent = "—";
  elements.caseAuditBeforeBar.style.setProperty("--audit-width", "0%");
  elements.caseAuditAfterBar.style.setProperty("--audit-width", "0%");
}

function renderCaseStudy() {
  const traits = caseTraits(CASE_HASH);
  renderCaseStreams(traits);

  if (!canvasAvailable) {
    elements.caseCanvas.hidden = true;
    elements.caseFallback.hidden = false;
    elements.caseVersion.textContent = "release / v1.4.2";
    elements.caseRouteStatus.textContent = "BLOCKED";
    elements.caseRouteStatus.classList.add("is-blocked");
    setCaseBusy(false);
    return null;
  }

  elements.caseCanvas.hidden = false;
  elements.caseFallback.hidden = true;
  const result = renderCase(elements.caseCanvas, CASE_HASH, state.caseVersion);
  if (state.caseVersion === "release") caseReleaseResult = result;
  const fixed = state.caseVersion === "fixed";
  elements.caseVersion.textContent = fixed ? "candidate / v1.4.3" : "release / v1.4.2";
  elements.caseRouteStatus.textContent = result.blocked ? "BLOCKED" : "PASS";
  elements.caseRouteStatus.classList.toggle("is-blocked", result.blocked);

  if (fixed) {
    elements.casePhase.textContent = "候选修复已应用";
    elements.caseResultTitle.textContent = "出口恢复，原世界身份保留。";
    elements.caseResultCopy.textContent = "候选版本只改变 route 判定；enemy、loot 和 vfx 仍从原命名子流读取，因此不会因修门而重抽整张世界。";
    const enemyStable = caseReleaseResult?.identities.enemy === result.identities.enemy;
    const lootStable = caseReleaseResult?.identities.loot === result.identities.loot;
    elements.caseIdentityStatus.textContent = enemyStable && lootStable ? "PRESERVED" : "DRIFT";
    elements.caseEnemyCheck.textContent = enemyStable ? "相同" : "改变";
    elements.caseLootCheck.textContent = lootStable ? "相同" : "改变";
    elements.caseEnemyCheck.classList.toggle("is-preserved", enemyStable);
    elements.caseLootCheck.classList.toggle("is-preserved", lootStable);
  } else {
    elements.casePhase.textContent = "玩家现场已恢复";
    elements.caseResultTitle.textContent = "第 7 房间出口被封死。";
    elements.caseResultCopy.textContent = "因为世界 seed 控制完整输出，我们恢复的不只是地图截图，还包括当时的怪物、掉落和雾效。";
  }
  return result;
}

async function replayCaseStudy() {
  if (caseBusy || !canvasAvailable) return;
  state.caseVersion = "release";
  setCaseStage(1);
  setCaseBusy(true);
  resetCaseEvidence();
  renderCaseStudy();
  elements.caseReplayStatus.textContent = "RUNNING";
  elements.caseReplayRuns.replaceChildren();
  try {
    const digests = [];
    for (let index = 0; index < 3; index += 1) {
      const canvas = document.createElement("canvas");
      renderCase(canvas, CASE_HASH, "release");
      const digest = await pixelDigest(canvas);
      digests.push(digest);
      const item = document.createElement("li");
      item.innerHTML = `<span>RUN ${index + 1}</span><code>${digest.slice(0, 10)}</code>`;
      elements.caseReplayRuns.append(item);
    }
    const passed = new Set(digests).size === 1;
    elements.caseReplayStatus.textContent = passed ? "PASS · 3/3" : "FAIL";
    elements.casePhase.textContent = "故障已稳定复现并隔离";
    elements.caseResultTitle.textContent = passed ? "三次都是同一堵墙。" : "现场无法稳定复现。";
    elements.caseResultCopy.textContent = passed
      ? "像素摘要完全一致；world、enemy、loot、vfx 子流也稳定。故障来自 route 规则，而不是随机数漂移。"
      : "需要先修复随机源，才能判断 route 规则。";
    setCaseStage(passed ? 2 : 1);
  } finally {
    setCaseBusy(false);
  }
}

function applyCaseFix() {
  if (caseBusy || !canvasAvailable || state.caseStage < 2) return;
  state.caseVersion = "fixed";
  renderCaseStudy();
  setCaseStage(3);
}

async function auditCaseStudy() {
  if (caseBusy || !canvasAvailable || state.caseStage < 3) return;
  setCaseBusy(true);
  elements.caseAuditStatus.textContent = "RUNNING 10,000…";
  await new Promise((resolve) => requestAnimationFrame(resolve));
  try {
    const started = performance.now();
    const result = auditCaseRoutes(10000, CASE_HASH);
    const elapsed = performance.now() - started;
    elements.caseAuditBefore.textContent = `${result.releaseBlocked} / ${result.total}`;
    elements.caseAuditAfter.textContent = `${result.fixedBlocked} / ${result.total}`;
    elements.caseAuditBeforeBar.style.setProperty("--audit-width", `${(100 * result.releaseBlocked) / result.total}%`);
    elements.caseAuditAfterBar.style.setProperty("--audit-width", `${(100 * result.fixedBlocked) / result.total}%`);
    elements.caseAuditStatus.textContent = `PASS · ${elapsed.toFixed(0)} ms`;
    elements.casePhase.textContent = "发布门禁通过";
    elements.caseResultTitle.textContent = "10,000 个世界中，封路问题归零。";
    elements.caseResultCopy.textContent = `旧规则命中 ${result.releaseBlocked} 个失败 seed；候选规则为 0。修复现在有系列级证据，而不只是“这个 seed 看起来好了”。`;
    setCaseStage(5);
  } finally {
    setCaseBusy(false);
  }
}

function syncLensTabs() {
  for (const button of elements.lensButtons) {
    const selected = button.dataset.lens === state.lens;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  }
  for (const item of elements.lensChain) item.classList.toggle("is-active", item.dataset.lensChain === state.lens);
  const selected = elements.lensButtons.find((button) => button.dataset.lens === state.lens);
  if (selected) elements.lensPanel.setAttribute("aria-labelledby", selected.id);
  elements.lensSection.dataset.lens = state.lens;
}

function renderLensDetail(lens) {
  elements.lensCode.textContent = lens.code;
  elements.lensSeed.textContent = `${state.seed.slice(0, 12)}…${state.seed.slice(-6)}`;
  elements.lensKicker.textContent = lens.role;
  elements.lensTitle.textContent = lens.title;
  elements.lensQuestion.textContent = lens.question;
  elements.lensSummary.textContent = lens.summary;
  elements.lensInput.textContent = lens.input;
  elements.lensEvidence.replaceChildren(
    ...lens.evidence.map((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      return item;
    }),
  );
  elements.lensDecision.textContent = lens.decision;
  elements.lensImpactLabel.textContent = lens.impactLabel;
  elements.lensImpact.textContent = lens.impact;
  elements.lensCanvas.setAttribute("aria-label", `${lens.role}视角生成场景`);
}

async function renderRoleLens() {
  const token = ++lensRenderToken;
  const lens = LENSES[state.lens];
  elements.lensWorkbench.classList.remove("is-settled");
  elements.lensWorkbench.classList.add("is-entering");
  syncLensTabs();
  renderLensDetail(lens);
  syncUrl();

  if (!canvasAvailable) {
    elements.lensCanvas.hidden = true;
    elements.lensFallback.hidden = false;
    elements.lensDigest.textContent = "Canvas unavailable";
    elements.lensDigest.removeAttribute("title");
    elements.lensRenderTime.textContent = "UNAVAILABLE";
    elements.lensWorkbench.classList.remove("is-entering");
    elements.lensWorkbench.classList.add("is-settled");
    return;
  }

  elements.lensCanvas.hidden = false;
  elements.lensFallback.hidden = true;
  elements.lensDigest.textContent = "calculating…";
  elements.lensDigest.removeAttribute("title");
  const started = performance.now();
  renderCinematicLens(elements.lensCanvas, state.lens, state.seed);
  const drawElapsed = performance.now() - started;
  const digest = await pixelDigest(elements.lensCanvas);
  if (token !== lensRenderToken) return;
  elements.lensDigest.textContent = `${digest.slice(0, 12)}…`;
  elements.lensDigest.title = digest;
  elements.lensRenderTime.textContent = `${drawElapsed.toFixed(1)} ms`;
  requestAnimationFrame(() => {
    if (token !== lensRenderToken) return;
    elements.lensWorkbench.classList.remove("is-entering");
    elements.lensWorkbench.classList.add("is-settled");
  });
}

function syncApplicationTabs() {
  for (const button of elements.applicationButtons) {
    const selected = button.dataset.application === state.application;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  }
  const selected = elements.applicationButtons.find((button) => button.dataset.application === state.application);
  if (selected) elements.applicationPanel.setAttribute("aria-labelledby", selected.id);
  elements.applicationWorkbench.dataset.application = state.application;
  elements.brandProduction.hidden = state.application !== "brand";
  elements.brandProduction.classList.toggle("is-unavailable", !canvasAvailable);
}

function renderApplicationDetail(application) {
  elements.applicationCode.textContent = application.code;
  elements.applicationSeed.textContent = `SEED ${state.seed.slice(0, 12)}…${state.seed.slice(-6)}`;
  elements.applicationKicker.textContent = `${application.short} / ${application.micro}`;
  elements.applicationTitle.textContent = application.title;
  elements.applicationSummary.textContent = application.summary;
  elements.applicationInput.textContent = application.input;
  elements.applicationOutput.textContent = application.output;
  elements.applicationValue.textContent = application.value;
  elements.applicationFormats.replaceChildren(
    ...application.formats.map((format) => {
      const item = document.createElement("span");
      item.textContent = format;
      return item;
    }),
  );
  elements.applicationCanvas.setAttribute("aria-label", `${application.short}产品演示`);
}

function setApplicationBusy(busy) {
  applicationBusy = busy;
  elements.applicationReplay.disabled = busy || brandComparisonBusy || !canvasAvailable;
  elements.applicationRandom.disabled = busy || brandComparisonBusy || !canvasAvailable;
  elements.brandRunComparison.disabled = busy || brandComparisonBusy || !canvasAvailable;
  for (const control of elements.brandControls.querySelectorAll("input, button")) {
    control.disabled = brandComparisonBusy;
  }
  for (const button of elements.brandDownloadButtons) {
    button.disabled = busy || brandComparisonBusy || !canvasAvailable || state.application !== "brand";
  }
}

function syncBrandForm() {
  elements.brandName.value = state.brand.brandName;
  elements.brandHeadline.value = state.brand.headline;
  elements.brandCampaignId.value = state.brand.campaignId;
  elements.brandPrimary.value = state.brand.primary;
  elements.brandAccent.value = state.brand.accent;
}

function readBrandForm() {
  return normalizeBrandInputs({
    brandName: elements.brandName.value,
    headline: elements.brandHeadline.value,
    campaignId: elements.brandCampaignId.value,
    primary: elements.brandPrimary.value,
    accent: elements.brandAccent.value,
  });
}

function brandRunRows() {
  return "<li><span>RUN 1</span><code>—</code></li><li><span>RUN 2</span><code>—</code></li><li><span>RUN 3</span><code>—</code></li>";
}

function resetBrandComparisonEvidence() {
  elements.brandStableStatus.className = "brand-compare-status is-idle";
  elements.brandStableStatus.textContent = "等待检查";
  elements.brandBrokenStatus.className = "brand-compare-status is-idle";
  elements.brandBrokenStatus.textContent = "等待检查";
  elements.brandStableRuns.innerHTML = brandRunRows();
  elements.brandBrokenRuns.innerHTML = brandRunRows();
  elements.brandComparisonNote.textContent = "运行后会分别比较 3 次像素摘要：左侧应完全相同，右侧会发生漂移。";
}

function scheduleBrandRender() {
  cancelAnimationFrame(brandInputFrame);
  brandInputFrame = requestAnimationFrame(() => {
    brandInputFrame = 0;
    void renderApplicationProduct();
  });
}

function handleBrandInput() {
  state.brand = readBrandForm();
  elements.brandEditStatus.textContent = "参数已进入 Seed 渲染管线；画面与交付文件同步更新。";
  resetBrandComparisonEvidence();
  scheduleBrandRender();
}

function resetBrandInputs() {
  state.brand = normalizeBrandInputs(BRAND_DEFAULTS);
  syncBrandForm();
  elements.brandEditStatus.textContent = "已恢复演示默认参数。";
  resetBrandComparisonEvidence();
  scheduleBrandRender();
}

async function renderApplicationProduct() {
  const token = ++applicationRenderToken;
  const application = APPLICATIONS[state.application];
  syncApplicationTabs();
  renderApplicationDetail(application);
  syncUrl();
  elements.applicationWorkbench.classList.remove("is-settled");
  elements.applicationWorkbench.classList.add("is-entering");

  if (!canvasAvailable) {
    elements.applicationCanvas.hidden = true;
    elements.applicationFallback.hidden = false;
    elements.applicationDigest.textContent = "Canvas unavailable";
    elements.applicationDigest.removeAttribute("title");
    elements.applicationRenderTime.textContent = "UNAVAILABLE";
    elements.applicationWorkbench.classList.remove("is-entering");
    elements.applicationWorkbench.classList.add("is-settled");
    lastApplicationDigest = "";
    if (state.application === "brand") {
      elements.brandStableStatus.className = "brand-compare-status is-idle";
      elements.brandStableStatus.textContent = "不可用";
      elements.brandBrokenStatus.className = "brand-compare-status is-idle";
      elements.brandBrokenStatus.textContent = "不可用";
      elements.brandComparisonNote.textContent = "当前浏览器不支持 Canvas；参数和责任边界仍可阅读，渲染、比对与下载已安全停用。";
    }
    setApplicationBusy(false);
    return;
  }

  setApplicationBusy(true);
  elements.applicationCanvas.hidden = false;
  elements.applicationFallback.hidden = true;
  elements.applicationDigest.textContent = "calculating…";
  elements.applicationDigest.removeAttribute("title");
  const started = performance.now();
  const result = renderApplication(elements.applicationCanvas, state.application, state.seed, state.brand);
  const elapsed = performance.now() - started;
  elements.applicationWorkbench.style.setProperty("--application-accent", result.palette[0]);
  if (state.application === "brand") {
    renderBrandComparison(elements.brandStableCanvas, state.seed, state.brand, "stable");
    renderBrandComparison(elements.brandBrokenCanvas, state.seed, state.brand, "broken");
  }
  const digest = await pixelDigest(elements.applicationCanvas);
  if (token !== applicationRenderToken) return;
  lastApplicationDigest = digest;
  elements.applicationDigest.textContent = `${digest.slice(0, 12)}…`;
  elements.applicationDigest.title = digest;
  elements.applicationRenderTime.textContent = `${elapsed.toFixed(1)} ms`;
  requestAnimationFrame(() => {
    if (token !== applicationRenderToken) return;
    elements.applicationWorkbench.classList.remove("is-entering");
    elements.applicationWorkbench.classList.add("is-settled");
    setApplicationBusy(false);
  });
}

function appendBrandRun(list, index, digest) {
  const item = document.createElement("li");
  item.innerHTML = `<span>RUN ${index + 1}</span><code title="${digest}">${digest.slice(0, 12)}</code>`;
  list.append(item);
}

async function runBrandComparison() {
  if (!canvasAvailable || applicationBusy || brandComparisonBusy || state.application !== "brand") return;
  brandComparisonBusy = true;
  setApplicationBusy(applicationBusy);
  elements.brandStableStatus.className = "brand-compare-status is-running";
  elements.brandStableStatus.textContent = "运行 3 次…";
  elements.brandBrokenStatus.className = "brand-compare-status is-running";
  elements.brandBrokenStatus.textContent = "运行 3 次…";
  elements.brandStableRuns.replaceChildren();
  elements.brandBrokenRuns.replaceChildren();
  elements.brandComparisonNote.textContent = "正在用相同 Seed 和相同业务参数重复生成…";

  try {
    if (document.fonts?.load) await document.fonts.load("850 46px Inter", state.brand.headline);
    if (document.fonts?.ready) await document.fonts.ready;
    const warmupCanvas = document.createElement("canvas");
    renderBrandComparison(warmupCanvas, state.seed, state.brand, "stable");
    await pixelDigest(warmupCanvas);
    const stableDigests = [];
    const brokenDigests = [];
    for (let index = 0; index < 3; index += 1) {
      const stableCanvas = document.createElement("canvas");
      renderBrandComparison(stableCanvas, state.seed, state.brand, "stable");
      const stableDigest = await pixelDigest(stableCanvas);
      stableDigests.push(stableDigest);
      appendBrandRun(elements.brandStableRuns, index, stableDigest);
      elements.brandStableCanvas.width = stableCanvas.width;
      elements.brandStableCanvas.height = stableCanvas.height;
      elements.brandStableCanvas.getContext("2d").drawImage(stableCanvas, 0, 0);

      const brokenCanvas = document.createElement("canvas");
      renderBrandComparison(brokenCanvas, state.seed, state.brand, "broken");
      const brokenDigest = await pixelDigest(brokenCanvas);
      brokenDigests.push(brokenDigest);
      appendBrandRun(elements.brandBrokenRuns, index, brokenDigest);
      elements.brandBrokenCanvas.width = brokenCanvas.width;
      elements.brandBrokenCanvas.height = brokenCanvas.height;
      elements.brandBrokenCanvas.getContext("2d").drawImage(brokenCanvas, 0, 0);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    const stableCount = new Set(stableDigests).size;
    const brokenCount = new Set(brokenDigests).size;
    elements.brandStableStatus.className = `brand-compare-status ${stableCount === 1 ? "is-pass" : "is-drift"}`;
    elements.brandStableStatus.textContent = stableCount === 1 ? "PASS · 1 个结果" : `DRIFT · ${stableCount} 个结果`;
    elements.brandBrokenStatus.className = `brand-compare-status ${brokenCount > 1 ? "is-drift" : "is-pass"}`;
    elements.brandBrokenStatus.textContent = brokenCount > 1 ? `DRIFT · ${brokenCount} 个结果` : "意外相同";
    elements.brandComparisonNote.textContent = `有 Skill：3 次得到 ${stableCount} 个像素摘要；无 Skill：3 次得到 ${brokenCount} 个。差异不是“更艺术”，而是结果能否重放、审计和批量交付。`;
  } finally {
    brandComparisonBusy = false;
    setApplicationBusy(applicationBusy);
  }
}

function downloadNamePart(value, fallback) {
  const slug = String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || fallback;
}

function clickDownload(href, filename, revoke = false) {
  const anchor = document.createElement("a");
  anchor.download = filename;
  anchor.href = href;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  if (revoke) setTimeout(() => URL.revokeObjectURL(href), 1000);
}

function downloadBrandAsset(type) {
  if (!canvasAvailable || applicationBusy || brandComparisonBusy || state.application !== "brand") return;
  const brandPart = downloadNamePart(state.brand.brandName, "brand");
  const campaignPart = downloadNamePart(state.brand.campaignId, "campaign");
  const seedPart = state.seed.slice(2, 12);
  const baseName = `${brandPart}_${campaignPart}_${seedPart}`;

  if (type === "png") {
    clickDownload(elements.applicationCanvas.toDataURL("image/png"), `${baseName}.png`);
    return;
  }

  const isSvg = type === "svg";
  const content = isSvg
    ? buildBrandSvg(state.seed, state.brand)
    : JSON.stringify(buildBrandManifest(state.seed, state.brand, lastApplicationDigest), null, 2);
  const blob = new Blob([content], { type: isSvg ? "image/svg+xml;charset=utf-8" : "application/json;charset=utf-8" });
  clickDownload(URL.createObjectURL(blob), `${baseName}.${isSvg ? "svg" : "json"}`, true);
}

function setScenarioBusy(busy) {
  scenarioBusy = busy;
  elements.scenarioRerender.disabled = busy || !canvasAvailable;
  elements.scenarioRandom.disabled = busy || !canvasAvailable;
}

function syncScenarioButtons() {
  for (const button of elements.scenarioButtons) {
    const selected = button.dataset.scenario === state.scenario;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  }
  const selected = elements.scenarioButtons.find((button) => button.dataset.scenario === state.scenario);
  if (selected) elements.scenarioPanel.setAttribute("aria-labelledby", selected.id);
}

function renderScenarioDetails(features = null) {
  const scenario = SCENARIOS[state.scenario];
  elements.scenarioCode.textContent = scenario.code;
  elements.scenarioSeed.textContent = `${state.seed.slice(0, 12)}…${state.seed.slice(-6)}`;
  elements.scenarioKicker.textContent = scenario.code;
  elements.scenarioTitle.textContent = scenario.title;
  elements.scenarioSummary.textContent = scenario.summary;
  elements.scenarioCanvas.setAttribute("aria-label", `${scenario.title}生成案例`);
  for (const [key, value] of Object.entries(scenario.angles)) elements.scenarioAngles[key].textContent = value;

  const entries = features ? Object.entries(features) : [["State", "Canvas unavailable"]];
  elements.scenarioFeatures.replaceChildren(
    ...entries.map(([label, value]) => {
      const item = document.createElement("li");
      item.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
      return item;
    }),
  );
}

async function renderScenarioCase() {
  if (scenarioBusy) return;
  syncScenarioButtons();
  syncUrl();
  renderScenarioDetails();

  if (!canvasAvailable) {
    elements.scenarioCanvas.hidden = true;
    elements.scenarioFallback.hidden = false;
    elements.scenarioDigest.textContent = "Canvas unavailable";
    setScenarioBusy(false);
    return;
  }

  setScenarioBusy(true);
  try {
    elements.scenarioCanvas.hidden = false;
    elements.scenarioFallback.hidden = true;
    elements.scenarioDigest.textContent = "calculating…";
    elements.scenarioDigest.removeAttribute("title");
    const result = renderScenario(elements.scenarioCanvas, state.scenario, state.seed);
    renderScenarioDetails(result.features);
    const digest = await pixelDigest(elements.scenarioCanvas);
    elements.scenarioDigest.textContent = `${digest.slice(0, 12)}…`;
    elements.scenarioDigest.title = digest;
  } finally {
    setScenarioBusy(false);
  }
}

async function refreshSeedSurfaces() {
  resetBrandComparisonEvidence();
  await renderLive();
  await Promise.all([renderScenarioCase(), renderRoleLens(), renderApplicationProduct()]);
}

async function renderLive({ resetCheck = true } = {}) {
  if (studioBusy) return;
  setStudioBusy(true);
  try {
  state.seed = normalizeHash(elements.seedInput.value);
  elements.seedInput.value = state.seed;
  elements.seedShort.textContent = `${state.seed.slice(0, 12)}…${state.seed.slice(-6)}`;
  syncUrl();

  if (!canvasAvailable) {
    elements.canvas.hidden = true;
    elements.canvasFallback.hidden = false;
    elements.digest.textContent = "Canvas unavailable";
    return;
  }

  elements.canvas.hidden = false;
  elements.canvasFallback.hidden = true;
  const started = performance.now();
  const result = renderArtwork(elements.canvas, state);
  const elapsed = performance.now() - started;
  renderFeatures(result.features);
  elements.renderTime.textContent = `${elapsed.toFixed(1)} ms`;
  elements.bufferSize.textContent = `${result.size} × ${result.size}`;
  elements.digest.textContent = "calculating…";
  const digest = await pixelDigest(elements.canvas);
  elements.digest.textContent = `${digest.slice(0, 12)}…`;
  elements.digest.title = digest;

  if (resetCheck) {
    elements.checkStatus.className = "status-chip status-idle";
    elements.checkStatus.textContent = "等待检查";
    elements.checkRuns.replaceChildren();
  }
  } finally {
    setStudioBusy(false);
  }
}

async function runDeterminismCheck() {
  if (!canvasAvailable || studioBusy) return;
  setStudioBusy(true);
  elements.checkStatus.className = "status-chip status-running";
  elements.checkStatus.textContent = "运行 3 次…";
  elements.checkRuns.replaceChildren();

  try {
    const digests = [];
    const featureRuns = [];
    for (let index = 0; index < 3; index += 1) {
      const canvas = document.createElement("canvas");
      const result = renderArtwork(canvas, state);
      const digest = await pixelDigest(canvas);
      digests.push(digest);
      featureRuns.push(JSON.stringify(result.features));
      const item = document.createElement("li");
      item.innerHTML = `<span>RUN ${index + 1}</span><code>${digest.slice(0, 12)}</code>`;
      elements.checkRuns.append(item);
    }

    const pixelsStable = new Set(digests).size === 1;
    const featuresStable = new Set(featureRuns).size === 1;
    const passed = pixelsStable && featuresStable;
    elements.checkStatus.className = `status-chip ${passed ? "status-pass" : "status-fail"}`;
    elements.checkStatus.textContent = passed ? "PASS · 像素与特征一致" : "FAIL · 同 seed 发生漂移";
  } finally {
    setStudioBusy(false);
  }
}

function buildCollection() {
  if (!canvasAvailable) {
    elements.grid.innerHTML = '<p class="inline-fallback">Canvas 不可用；系列说明仍可阅读，但实时作品网格已停用。</p>';
    return;
  }
  const hashes = deriveHashes(12, state.seed);
  const fragment = document.createDocumentFragment();
  for (const hash of hashes) {
    const card = document.createElement("article");
    card.className = "edition-card";
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    const result = renderArtwork(canvas, { hash, mode: "deterministic", size: 240 });
    const label = document.createElement("div");
    label.innerHTML = `<code>${hash.slice(0, 10)}…</code><span>${result.features.Palette} · ${result.features.Density} · ${result.features.Gesture}</span>`;
    card.append(canvas, label);
    fragment.append(card);
  }
  elements.grid.replaceChildren(fragment);
}

function renderCensus(result) {
  const fragment = document.createDocumentFragment();
  for (const [trait, values] of Object.entries(result.counts)) {
    const section = document.createElement("section");
    section.className = "trait-chart";
    const heading = document.createElement("h3");
    heading.textContent = trait;
    section.append(heading);
    for (const [value, count] of Object.entries(values).sort((a, b) => b[1] - a[1])) {
      const actual = (100 * count) / result.total;
      const target = targetPercent(trait, value);
      const row = document.createElement("div");
      row.className = "chart-row";
      row.innerHTML = `
        <div class="chart-label"><span>${value}</span><strong>${actual.toFixed(1)}%</strong></div>
        <div class="chart-track" aria-label="${value} 实测 ${actual.toFixed(1)}%，目标 ${target.toFixed(1)}%">
          <i style="--actual:${actual}%"></i><b style="--target:${target}%"></b>
        </div>
        <small>目标 ${target.toFixed(0)}% · ${count} / ${result.total}</small>`;
      section.append(row);
    }
    fragment.append(section);
  }
  elements.censusCharts.replaceChildren(fragment);
}

function runCensus() {
  elements.censusButton.disabled = true;
  elements.censusStatus.textContent = "正在计算 5,000 个 seed…";
  requestAnimationFrame(() => {
    const started = performance.now();
    const result = censusFeatures(5000, state.seed);
    renderCensus(result);
    const elapsed = performance.now() - started;
    elements.censusStatus.textContent = `完成 · 5,000 个 seed · ${elapsed.toFixed(0)} ms`;
    elements.censusButton.disabled = false;
  });
}

async function copyText(button) {
  const target = document.querySelector(button.dataset.copy);
  if (!target) return;
  const text = target.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
    button.dataset.originalLabel ??= button.textContent;
    button.textContent = "已复制";
    button.classList.add("is-copied");
    setTimeout(() => {
      button.textContent = button.dataset.originalLabel;
      button.classList.remove("is-copied");
    }, 1600);
  } catch {
    button.textContent = "复制失败，请手动选择";
  }
}

function downloadCanvas() {
  if (!canvasAvailable) return;
  const anchor = document.createElement("a");
  anchor.download = `genart_${state.seed.slice(2, 12)}_${state.size}.png`;
  anchor.href = elements.canvas.toDataURL("image/png");
  anchor.click();
}

elements.themeButton.addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));
elements.seedInput.addEventListener("change", () => void refreshSeedSurfaces());
elements.seedInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") void refreshSeedSurfaces();
});
elements.rerenderButton.addEventListener("click", () => void refreshSeedSurfaces());
elements.randomButton.addEventListener("click", () => {
  elements.seedInput.value = randomHash();
  void refreshSeedSurfaces();
});
elements.downloadButton.addEventListener("click", downloadCanvas);
elements.checkButton.addEventListener("click", runDeterminismCheck);
elements.gridButton.addEventListener("click", buildCollection);
elements.censusButton.addEventListener("click", runCensus);
elements.sizeSelect.addEventListener("change", () => {
  state.size = Number(elements.sizeSelect.value);
  renderLive();
});
for (const button of elements.modeButtons) {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    syncModeButtons();
    renderLive();
  });
}
for (const button of elements.lensButtons) {
  button.addEventListener("click", () => {
    state.lens = button.dataset.lens;
    void renderRoleLens();
  });
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = elements.lensButtons.indexOf(button);
    let next = current;
    if (event.key === "ArrowLeft") next = (current - 1 + elements.lensButtons.length) % elements.lensButtons.length;
    if (event.key === "ArrowRight") next = (current + 1) % elements.lensButtons.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = elements.lensButtons.length - 1;
    const target = elements.lensButtons[next];
    target.focus();
    state.lens = target.dataset.lens;
    void renderRoleLens();
  });
}
for (const button of elements.applicationButtons) {
  button.addEventListener("click", () => {
    state.application = button.dataset.application;
    void renderApplicationProduct();
  });
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = elements.applicationButtons.indexOf(button);
    let next = current;
    if (event.key === "ArrowLeft") next = (current - 1 + elements.applicationButtons.length) % elements.applicationButtons.length;
    if (event.key === "ArrowRight") next = (current + 1) % elements.applicationButtons.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = elements.applicationButtons.length - 1;
    const target = elements.applicationButtons[next];
    target.focus();
    state.application = target.dataset.application;
    void renderApplicationProduct();
  });
}
elements.applicationReplay.addEventListener("click", () => void renderApplicationProduct());
elements.applicationRandom.addEventListener("click", () => {
  elements.seedInput.value = randomHash();
  void refreshSeedSurfaces();
});
elements.brandControls.addEventListener("submit", (event) => event.preventDefault());
for (const input of [elements.brandName, elements.brandHeadline, elements.brandCampaignId, elements.brandPrimary, elements.brandAccent]) {
  input.addEventListener("input", handleBrandInput);
  input.addEventListener("change", () => {
    state.brand = readBrandForm();
    syncBrandForm();
    scheduleBrandRender();
  });
}
elements.brandReset.addEventListener("click", resetBrandInputs);
elements.brandRunComparison.addEventListener("click", () => void runBrandComparison());
for (const button of elements.brandDownloadButtons) {
  button.addEventListener("click", () => downloadBrandAsset(button.dataset.brandDownload));
}
for (const button of elements.scenarioButtons) {
  button.addEventListener("click", () => {
    if (scenarioBusy) return;
    state.scenario = button.dataset.scenario;
    void renderScenarioCase();
  });
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    if (scenarioBusy) return;
    event.preventDefault();
    const current = elements.scenarioButtons.indexOf(button);
    let next = current;
    if (event.key === "ArrowLeft") next = (current - 1 + elements.scenarioButtons.length) % elements.scenarioButtons.length;
    if (event.key === "ArrowRight") next = (current + 1) % elements.scenarioButtons.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = elements.scenarioButtons.length - 1;
    const target = elements.scenarioButtons[next];
    target.focus();
    state.scenario = target.dataset.scenario;
    void renderScenarioCase();
  });
}
elements.scenarioRerender.addEventListener("click", () => void renderScenarioCase());
elements.scenarioRandom.addEventListener("click", () => {
  elements.seedInput.value = randomHash();
  void refreshSeedSurfaces();
});
elements.caseReplay.addEventListener("click", () => void replayCaseStudy());
elements.caseFix.addEventListener("click", applyCaseFix);
elements.caseAudit.addEventListener("click", () => void auditCaseStudy());
for (const button of elements.copyButtons) button.addEventListener("click", () => copyText(button));

setTheme(state.theme);
syncModeButtons();
elements.seedInput.value = state.seed;
syncBrandForm();
resetBrandComparisonEvidence();
syncCaseSteps();
resetCaseEvidence();
renderCaseStudy();
setCaseBusy(false);
await renderLive();
buildCollection();
await renderRoleLens();
await renderApplicationProduct();
await renderScenarioCase();
