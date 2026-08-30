const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');

function currentTheme() {
  return root.dataset.theme === "dark" ? "dark" : "light";
}

function updateThemeUi() {
  const theme = currentTheme();
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", theme === "dark" ? "切换为浅色主题" : "切换为深色主题");
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }
  themeColor?.setAttribute("content", theme === "dark" ? "#0d171c" : "#f2efe8");
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  try {
    localStorage.setItem("fde-theme", nextTheme);
  } catch (_) {}
  updateThemeUi();
});

updateThemeUi();

function activateTab(tablist, nextTab, focus = false) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panelIds = tabs.map((tab) => tab.getAttribute("aria-controls")).filter(Boolean);

  tabs.forEach((tab) => {
    const selected = tab === nextTab;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  panelIds.forEach((id) => {
    const panel = document.getElementById(id);
    if (!panel) return;
    const active = id === nextTab.getAttribute("aria-controls");
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });

  if (focus) nextTab.focus();
}

document.querySelectorAll('[role="tablist"][data-tabs]').forEach((tablist) => {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const selected = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
  if (!selected) return;
  activateTab(tablist, selected);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tablist, tab));
    tab.addEventListener("keydown", (event) => {
      const index = tabs.indexOf(tab);
      let nextIndex = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      if (nextIndex === null) return;
      event.preventDefault();
      activateTab(tablist, tabs[nextIndex], true);
    });
  });
});

const revealItems = [...document.querySelectorAll(".reveal")];
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -6%" }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const navLinks = [...document.querySelectorAll(".top-nav a")];
const navTargets = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const current = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-current", current);
        if (current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-25% 0px -65%", threshold: [0, 0.1, 0.35] }
  );
  navTargets.forEach((section) => navObserver.observe(section));
}

const progressBar = document.querySelector("#read-progress-bar");
let progressFrame = null;

function updateReadProgress() {
  progressFrame = null;
  if (!progressBar) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
  progressBar.style.width = `${progress * 100}%`;
}

window.addEventListener(
  "scroll",
  () => {
    if (progressFrame !== null) return;
    progressFrame = requestAnimationFrame(updateReadProgress);
  },
  { passive: true }
);

window.addEventListener("resize", updateReadProgress, { passive: true });
updateReadProgress();

const glossaryQuery = document.querySelector("#glossary-query");
const glossaryCards = [...document.querySelectorAll("#glossary-list [data-glossary]")];
const glossaryEmpty = document.querySelector("#glossary-empty");

function filterGlossary() {
  const query = glossaryQuery?.value.trim().toLocaleLowerCase() || "";
  let visibleCount = 0;

  glossaryCards.forEach((card) => {
    const searchableText = `${card.dataset.glossary || ""} ${card.textContent || ""}`.toLocaleLowerCase();
    const visible = !query || searchableText.includes(query);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  if (glossaryEmpty) glossaryEmpty.hidden = visibleCount > 0;
}

glossaryQuery?.addEventListener("input", filterGlossary);
filterGlossary();

const fitLab = document.querySelector("#fit-lab");
const fitCheckboxes = [...document.querySelectorAll("[data-fit]")];
const fitResult = document.querySelector("#fit-result");
const fitResultLabel = document.querySelector("#fit-result-label");
const fitResultTitle = document.querySelector("#fit-result-title");
const fitResultCopy = document.querySelector("#fit-result-copy");
const fitReset = document.querySelector("#fit-reset");

const fitStates = {
  empty: {
    label: "尚未判断",
    title: "先勾选任务的真实条件",
    copy: "不要从“我想做 Agent”开始；从任务是否开放、可验证和可控开始。",
  },
  guarded: {
    label: "先收窄边界",
    title: "暂不适合自治 Agent",
    copy: "先改成只读、草稿或人工审批；补齐可验证结果和可逆动作后，再讨论自治。",
  },
  workflow: {
    label: "稳定优先",
    title: "固定 Workflow 更合适",
    copy: "任务路径相对明确。用确定性步骤获得更低成本、更强审计和更稳定的结果。",
  },
  agent: {
    label: "受控试点",
    title: "适合受控 Agent Pilot",
    copy: "任务需要动态决策，同时具备验证和安全边界；从小范围、有限工具和明确停止条件开始。",
  },
};

function updateFitResult() {
  if (!fitResult) return;
  const checked = fitCheckboxes.filter((input) => input.checked);
  const dynamicCount = checked.filter((input) => input.dataset.fit === "dynamic").length;
  const verifiable = fitCheckboxes.find((input) => input.dataset.fit === "verifiable")?.checked;
  const reversible = fitCheckboxes.find((input) => input.dataset.fit === "reversible")?.checked;
  const tolerable = fitCheckboxes.find((input) => input.dataset.fit === "tolerable")?.checked;

  let state = "empty";
  if (checked.length > 0 && (!verifiable || !reversible || !tolerable)) state = "guarded";
  else if (checked.length > 0 && dynamicCount >= 2) state = "agent";
  else if (checked.length > 0) state = "workflow";

  const content = fitStates[state];
  fitResult.dataset.state = state;
  if (fitResultLabel) fitResultLabel.textContent = content.label;
  if (fitResultTitle) fitResultTitle.textContent = content.title;
  if (fitResultCopy) fitResultCopy.textContent = content.copy;
}

fitCheckboxes.forEach((input) => input.addEventListener("change", updateFitResult));
fitReset?.addEventListener("click", () => {
  fitCheckboxes.forEach((input) => { input.checked = false; });
  updateFitResult();
  fitLab?.querySelector("input")?.focus();
});
updateFitResult();

const readinessCheckboxes = [...document.querySelectorAll("[data-readiness]")];
const readinessScore = document.querySelector("#readiness-score");
const readinessLabel = document.querySelector("#readiness-label");
const readinessBar = document.querySelector("#readiness-bar");
const readinessTrack = document.querySelector(".readiness-track");
const readinessNextTitle = document.querySelector("#readiness-next-title");
const readinessNextCopy = document.querySelector("#readiness-next-copy");
const readinessReset = document.querySelector("#readiness-reset");
const readinessStorageKey = "fde-readiness-evidence-v1";

const readinessCopies = {
  "evidence-engineering": "先补能够运行和测试的工程证据，再叠加模型能力。",
  "evidence-agent": "让模型通过窄工具完成闭环，并记录停止条件与失败恢复。",
  "evidence-eval": "把“效果不错”变成可重复的任务、评分和最终状态检查。",
  "evidence-discovery": "从真实工作和基线出发，避免为不存在的问题优化 Agent。",
  "evidence-safety": "证明你知道系统怎样失败，以及如何限制、监控和撤销动作。",
  "evidence-story": "把已有证据压缩成面试官能追问、你能具体展开的真实故事。",
};

function saveReadiness() {
  const selectedIds = readinessCheckboxes.filter((input) => input.checked).map((input) => input.id);
  try {
    localStorage.setItem(readinessStorageKey, JSON.stringify(selectedIds));
  } catch (_) {}
}

function updateReadiness(save = true) {
  const completed = readinessCheckboxes.filter((input) => input.checked).length;
  const total = readinessCheckboxes.length || 6;
  const labels = ["从第一项真实证据开始", "已有起点，继续形成闭环", "已有起点，继续形成闭环", "能力正在形成闭环", "能力正在形成闭环", "只差最后一块证据", "六类证据已经齐全"];
  const nextInput = readinessCheckboxes.find((input) => !input.checked);
  const nextLabel = nextInput?.closest("label");

  if (readinessScore) readinessScore.textContent = `${completed}/${total}`;
  if (readinessLabel) readinessLabel.textContent = labels[completed] || labels[0];
  if (readinessBar) readinessBar.style.width = `${(completed / total) * 100}%`;
  readinessTrack?.setAttribute("aria-valuenow", String(completed));

  if (completed === total) {
    if (readinessNextTitle) readinessNextTitle.textContent = "用一次完整模拟验证整套证据";
    if (readinessNextCopy) readinessNextCopy.textContent = "让他人连续追问业务、工程、安全和结果，找出仍然含糊的连接处。";
  } else if (nextInput && nextLabel) {
    if (readinessNextTitle) readinessNextTitle.textContent = nextLabel.dataset.next || "补齐下一项证据";
    if (readinessNextCopy) readinessNextCopy.textContent = readinessCopies[nextInput.id] || "完成一项可以打开、演示或具体讲清的真实产出。";
  }

  if (save) saveReadiness();
}

try {
  const savedReadiness = JSON.parse(localStorage.getItem(readinessStorageKey) || "[]");
  if (Array.isArray(savedReadiness)) {
    readinessCheckboxes.forEach((input) => { input.checked = savedReadiness.includes(input.id); });
  }
} catch (_) {}

readinessCheckboxes.forEach((input) => input.addEventListener("change", () => updateReadiness(true)));
readinessReset?.addEventListener("click", () => {
  readinessCheckboxes.forEach((input) => { input.checked = false; });
  try { localStorage.removeItem(readinessStorageKey); } catch (_) {}
  updateReadiness(false);
  readinessCheckboxes[0]?.focus();
});
updateReadiness(false);
