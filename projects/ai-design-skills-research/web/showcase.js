const menuToggle = document.querySelector("#menu-toggle");
const menuOverlay = document.querySelector("#menu-overlay");
const menuLinks = [...menuOverlay.querySelectorAll("a")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let lastMenuFocus = null;

function openMenu() {
  lastMenuFocus = document.activeElement;
  menuOverlay.hidden = false;
  menuOverlay.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "关闭导航菜单");
  document.body.classList.add("menu-open");
  requestAnimationFrame(() => {
    menuOverlay.classList.add("is-open");
    menuLinks[0].focus();
  });
}

function closeMenu({ restoreFocus = true } = {}) {
  menuOverlay.classList.remove("is-open");
  menuOverlay.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "打开导航菜单");
  document.body.classList.remove("menu-open");
  const finish = () => {
    menuOverlay.hidden = true;
    if (restoreFocus && lastMenuFocus instanceof HTMLElement) lastMenuFocus.focus();
  };
  if (reduceMotion.matches) finish();
  else window.setTimeout(finish, 260);
}

menuToggle.addEventListener("click", () => {
  if (menuToggle.getAttribute("aria-expanded") === "true") closeMenu();
  else openMenu();
});

menuLinks.forEach((link) => link.addEventListener("click", () => closeMenu({ restoreFocus: false })));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((node) => {
  if (reduceMotion.matches) node.classList.add("is-visible");
  else revealObserver.observe(node);
});

const taglineSection = document.querySelector("[data-tagline]");
const taglineText = document.querySelector(".tagline-text");
const words = taglineSection.dataset.tagline.split(" ").filter(Boolean);
taglineText.innerHTML = words.map((word, index) => `<span class="word" data-word="${index}" aria-hidden="true">${word}</span>`).join("");
const wordNodes = [...taglineText.querySelectorAll(".word")];
let taglineFrame = 0;

function updateTagline() {
  taglineFrame = 0;
  if (reduceMotion.matches) {
    wordNodes.forEach((word) => word.classList.add("is-active"));
    return;
  }
  const rect = taglineSection.getBoundingClientRect();
  const start = window.innerHeight * 0.72;
  const distance = Math.max(rect.height * 0.52, 1);
  const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));
  const activeCount = Math.ceil(progress * wordNodes.length);
  wordNodes.forEach((word, index) => word.classList.toggle("is-active", index < activeCount));
}

function scheduleTagline() {
  if (taglineFrame) return;
  taglineFrame = requestAnimationFrame(updateTagline);
}

window.addEventListener("scroll", scheduleTagline, { passive: true });
window.addEventListener("resize", scheduleTagline);
reduceMotion.addEventListener("change", updateTagline);
updateTagline();

const runButton = document.querySelector("#run-review");
const reviewOutput = document.querySelector("#review-output");
const reviewLog = document.querySelector("#review-log");
let running = false;

const loadingMarkup = `
  <div class="review-loading">
    <div class="review-progress"><span id="review-progress"></span></div>
    <h3>正在核对发布条件</h3>
    <p id="loading-label">读取变更范围</p>
    <div class="review-skeleton" aria-hidden="true"><span></span><span></span><span></span></div>
  </div>`;

const resultMarkup = `
  <div class="review-result">
    <span>有条件继续</span>
    <h3>两个条件已确认，一个条件需要补充证据。</h3>
    <ul class="result-list">
      <li><b>✓</b><div>变更范围已写明<small>管理端权限缓存，不影响公开页面。</small></div></li>
      <li><b>✓</b><div>验证步骤已记录<small>演示环境完成角色切换检查。</small></div></li>
      <li><b>!</b><div>回滚条件缺少证据<small>请补充旧缓存策略恢复后的验证记录。</small></div></li>
    </ul>
  </div>`;

function setReviewStep(step) {
  const progress = document.querySelector("#review-progress");
  const label = document.querySelector("#loading-label");
  const states = [
    ["34%", "读取变更范围"],
    ["68%", "核对验证证据"],
    ["100%", "确认回滚条件"],
  ];
  if (progress) progress.style.setProperty("--progress", states[step][0]);
  if (label) label.textContent = states[step][1];
  reviewLog.innerHTML += `<li class="is-done">${states[step][1]}</li>`;
}

runButton.addEventListener("click", async () => {
  if (running) return;
  running = true;
  runButton.disabled = true;
  runButton.textContent = "正在审核";
  reviewOutput.setAttribute("aria-busy", "true");
  reviewOutput.innerHTML = loadingMarkup;
  reviewLog.innerHTML = "";

  const delay = reduceMotion.matches ? 20 : 380;
  for (let step = 0; step < 3; step += 1) {
    setReviewStep(step);
    await new Promise((resolve) => window.setTimeout(resolve, delay));
  }

  reviewOutput.innerHTML = resultMarkup;
  reviewOutput.setAttribute("aria-busy", "false");
  reviewLog.innerHTML += '<li class="is-done">形成候选结论</li>';
  runButton.disabled = false;
  runButton.textContent = "重新运行样例";
  running = false;
});

