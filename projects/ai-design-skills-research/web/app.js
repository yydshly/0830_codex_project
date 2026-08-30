const angles = {
  strategy: {
    kicker: "Strategy",
    title: "先收紧目标，再安排页面",
    badge: "决策能力",
    summary: "它先追问受众、Offer、转化动作、异议和流量来源，把“做一个官网”变成一条可判断的转化任务。",
    input: `<p>“给上线哨兵做一个看起来专业的官网。”</p>`,
    rule: `<ul><li>一个 Offer</li><li>一个受众</li><li>一个主要动作</li><li>证明靠近主张</li></ul>`,
    output: `<ul><li>首屏：结果 + 受众 + CTA</li><li>中段：收益、步骤、证明</li><li>尾段：异议、风险逆转、最终 CTA</li></ul>`,
    limit: `<p>不能替代用户研究，也不能证明这个 Offer 真的有市场。</p>`,
  },
  copy: {
    kicker: "Copywriting",
    title: "把模糊形容词改成可行动表达",
    badge: "表达能力",
    summary: "它要求收益优先、CTA 写明用户会得到什么，并禁止“赋能、无缝、革新体验”等没有信息量的套话。",
    input: `<p>“智能、快速、无缝地革新您的发布流程。”</p>`,
    rule: `<ul><li>结果 + 受众</li><li>动词 + 用户所得</li><li>功能必须解释为收益</li><li>不要使用 Learn more</li></ul>`,
    output: `<p><strong>把每次上线前的风险判断，收拢成一页可追溯结论。</strong><br />CTA：查看样例审核</p>`,
    limit: `<p>没有真实证据时只能写草案；不能凭空生成客户评价和效果数字。</p>`,
  },
  visual: {
    kicker: "Visual system",
    title: "把任意取值压缩成封闭设计空间",
    badge: "一致性能力",
    summary: "字体、字号、间距、圆角、暗色背景、图标和缓动曲线都有明确选择范围，减少代理每个组件重新发明视觉值。",
    input: `<p>三个卡片分别使用 18px、19px、21px；圆角和间距随手填写。</p>`,
    rule: `<ul><li>字号对齐 Tailwind 阶梯</li><li>间距来自固定 Token</li><li>嵌套圆角按几何关系计算</li><li>视觉值不临时发明</li></ul>`,
    output: `<p>页面更容易保持节奏、对齐和层级一致，跨组件修改也更可控。</p>`,
    limit: `<p>字体禁用清单和禁止背景渐变属于作者品味，不是通用设计真理。</p>`,
  },
  state: {
    kicker: "Interaction states",
    title: "把默认画面扩展为完整使用过程",
    badge: "完整度能力",
    summary: "它要求每个交互元素考虑 Hover、Active、Focus、Loading、Empty 和 Error，并禁止死链接和 window.alert。",
    input: `<p>审核列表在数据未返回、没有结果或请求失败时应该显示什么？</p>`,
    rule: `<ul><li>骨架形状接近真实布局</li><li>空状态给出开始动作</li><li>错误具体且可恢复</li><li>焦点始终可见</li></ul>`,
    output: `<p>用户在等待、无数据和失败时仍然知道系统发生了什么、下一步能做什么。</p>`,
    limit: `<p>规则只提醒代理；没有浏览器测试时，不能保证键盘和状态转换真的可用。</p>`,
  },
  ship: {
    kicker: "Ship checklist",
    title: "把容易忘记的收尾工作纳入完成定义",
    badge: "交付能力",
    summary: "404、法律链接、表单校验、跳到正文、favicon、meta、alt 和语义化 HTML 都进入最后检查。",
    input: `<p>页面视觉完成，但表单可以提交空邮箱，分享没有标题，键盘用户无法跳过导航。</p>`,
    rule: `<ul><li>表单客户端校验</li><li>title 与社交 meta</li><li>图片 alt</li><li>语义结构与返回路径</li></ul>`,
    output: `<p>交付从“看起来完成”推进到“具备基本发布完整性”。</p>`,
    limit: `<p>Checklist 不是法律、SEO 或无障碍认证，仍需相应工具和专业复核。</p>`,
  },
  boundary: {
    kicker: "Boundary",
    title: "增加判断约束，不增加执行工具",
    badge: "能力边界",
    summary: "当前仓库没有组件、模板、浏览器、Figma 连接或测试脚本。真正的代码和验证仍由宿主代理与工具完成。",
    input: `<p>期待“安装后自动出现高级动效组件和可发布页面”。</p>`,
    rule: `<p>Skill 只把领域知识和工作规程加载进上下文。</p>`,
    output: `<ul><li>更有结构的方案</li><li>更一致的候选代码</li><li>更完整的检查清单</li></ul>`,
    limit: `<p>它不是 UI 库、模型微调、MCP 工具或设计质量保证系统。</p>`,
  },
};

const comparisons = {
  copy: {
    baseline: `<h3>革新您的发布工作流</h3><p>快速、智能、无缝。释放团队潜力，迈向下一代交付体验。</p><span class="mini-button">了解更多</span><small class="proof-line">深受现代团队信赖</small>`,
    guided: `<h3>把每次上线前的风险判断，收拢成一页可追溯结论</h3><p>面向需要统一发布判断的小型软件团队，把检查、异议和负责人放进同一页。</p><span class="mini-button">查看样例审核</span><small class="proof-line">演示阶段：真实客户证据待补</small>`,
    baselineNote: "问题：受众不明、结果模糊、CTA 不说明用户会得到什么，证明也没有来源。",
    guidedNote: "变化：标题指向具体结果，CTA 对应唯一动作；证据缺失被诚实标记。",
  },
  structure: {
    baseline: `<div class="structure-map"><span>Hero：大标题 + 两个 CTA</span><span>三栏功能卡片</span><span data-weak="true">更多功能卡片</span><span data-weak="true">页脚</span></div>`,
    guided: `<div class="structure-map"><span>Hero：结果 + 受众 + CTA + 证明位</span><span>问题 → 方案</span><span>3–5 个结果导向收益</span><span>三步使用流程</span><span>安全与接入异议</span><span>FAQ + 风险逆转 + 最终 CTA</span></div>`,
    baselineNote: "问题：页面按常见组件堆叠，没有形成说服路径，也没有集中处理异议。",
    guidedNote: "变化：结构承担完整论证；证明、异议和风险逆转不再埋在页尾。",
  },
  visual: {
    baseline: `<div class="token-board"><div><strong>19px</strong>任意正文字号</div><div><strong>13px / 27px</strong>不统一间距</div><div><strong>6 / 18 / 30px</strong>随机圆角</div><div><strong>all 300ms</strong>默认过渡</div></div>`,
    guided: `<div class="token-board"><div><strong>16 / 18 / 20px</strong>字号阶梯</div><div><strong>8 / 12 / 16 / 24px</strong>间距 Token</div><div><strong>outer − gap</strong>嵌套圆角</div><div><strong>明确 easing</strong>状态变化动效</div></div>`,
    baselineNote: "问题：每个组件单独决定视觉值，页面很容易出现细小但累积的漂移。",
    guidedNote: "变化：设计选择被压缩到封闭集合；但具体 Token 仍应替换为项目品牌值。",
  },
};

const states = {
  success: {
    html: `<div><p class="field-label">最近审核</p><ul class="review-list"><li><div><strong>支付回调重试</strong><small>负责人：林澈 · 已记录 2 项上线条件</small></div><em>可继续</em></li><li><div><strong>权限缓存调整</strong><small>负责人：周弈 · 等待安全复核</small></div><em>待复核</em></li><li><div><strong>移动端结算入口</strong><small>负责人：顾夏 · 回滚路径已确认</small></div><em>可继续</em></li></ul></div>`,
    explanation: "用真实内容层级、负责人和状态标签表达结果，不依赖颜色 alone，也不制造虚构成效数字。",
  },
  loading: {
    html: `<div class="skeleton" aria-label="正在加载审核列表"><span></span><span></span><span></span><span></span></div>`,
    explanation: "骨架形状接近即将出现的列表，减少布局跳动；reduced-motion 下脉冲动画会被关闭。",
  },
  empty: {
    html: `<div class="state-message"><span class="state-symbol" aria-hidden="true">＋</span><h3>还没有审核记录</h3><p>从一个待发布的变更开始，先记录负责人、风险和回滚条件。</p><button type="button">创建第一条审核</button></div>`,
    explanation: "空状态解释为什么为空，并给出一个明确开始动作，不把空白面板交给用户猜测。",
  },
  error: {
    html: `<div class="state-message"><span class="state-symbol" aria-hidden="true">!</span><h3>审核列表暂时无法载入</h3><p>本地草稿未受影响。请检查连接后重试。</p><button type="button">重新载入</button></div>`,
    explanation: "错误信息具体说明影响范围和恢复动作；不使用“Oops”或阻塞式 alert。",
  },
};

const scenarios = {
  saas: {
    label: "高适配",
    score: 94,
    name: "SaaS 或 AI 产品发布页",
    why: "产品有清晰受众、单一 Offer 和主要转化动作时，Part A 的信息架构与 Part B 的完成度检查可以直接形成从 Brief 到代码的基线。",
    use: ["Hero、收益、步骤、证明、FAQ 的完整论证", "单一 CTA 与风险逆转", "状态和发布检查"],
    avoid: ["未经替换的作者字体与颜色", "没有真实来源的效果数字", "每个页面都强制逐词滚动动画"],
    prompt: "为面向独立开发团队的发布审核 SaaS 设计落地页。先按 Skill 输出结构、文案、SEO 和布局理由，再分节实现。所有证明必须有来源。",
  },
  waitlist: {
    label: "高适配",
    score: 90,
    name: "候补名单或下载页",
    why: "高意图访问者通常只需要理解一个承诺并完成一个动作，Skill 的极简转化页类型可以避免不必要的栏目堆叠。",
    use: ["极简转化布局", "明确交换价值", "表单校验与隐私说明"],
    avoid: ["为了显得完整增加十二个区块", "虚构已有用户和候补人数", "让次要社交链接抢走 CTA"],
    prompt: "为一份开发者发布检查清单设计候补页。唯一动作是提交邮箱，明确用户将得到什么，并补齐验证、隐私和成功状态。",
  },
  campaign: {
    label: "高适配",
    score: 92,
    name: "广告投放对应的活动页",
    why: "Skill 明确要求页面承诺与广告来源保持一致，并建议短期广告页 noindex，适合控制信息差与减少跳失。",
    use: ["广告标题与 Hero 信息匹配", "单一主要动作", "短期页面 noindex 判断"],
    avoid: ["添加与广告无关的产品全景", "多个价格与下载入口竞争", "把活动时限写成常青 SEO 内容"],
    prompt: "根据这条广告承诺构建单目标活动页。Hero 必须镜像广告信息，说明 noindex 理由，并把证明放在对应主张旁。",
  },
  redesign: {
    label: "需搭配",
    score: 68,
    name: "已有网站的设计升级",
    why: "原 Skill 偏向从零构建。现有网站首先需要诊断结构、组件和品牌债务，再局部采用 Token、状态和发布清单。作者也提供单独的 redesign companion。",
    use: ["视觉 Token 审核", "缺失状态和发布项", "分节修改、保持 diff 可审查"],
    avoid: ["未经诊断重写整个站点", "覆盖现有 Design Token", "把落地页结构强塞给全部路由"],
    prompt: "先审查现有站点并报告问题，不修改代码。批准后按优先级修复；只在营销页使用 landing-page-design 的结构规则。",
  },
  dashboard: {
    label: "部分适配",
    score: 48,
    name: "业务后台与数据工作台",
    why: "状态完整性、Token 和无障碍检查仍然有用，但 Dashboard 服务的是持续任务，不是一次转化。单一 CTA、长叙事和强制 tagline 动画会干扰操作。",
    use: ["Loading、Empty、Error、Focus", "一致字号、间距和圆角", "语义 HTML 与键盘路径"],
    avoid: ["把主任务改写成营销漏斗", "强制大字 Hero 和逐词 reveal", "所有页面只保留一个动作"],
    prompt: "仅借用该 Skill 的视觉 Token、交互状态和发布检查。保留 Dashboard 的多任务信息架构，不套用落地页转化结构。",
  },
  webgl: {
    label: "低适配",
    score: 28,
    name: "沉浸式 WebGL 产品体验",
    why: "它没有场景图、渲染预算、输入控制、降级或 GPU 性能方法。可以借用外围文案和发布检查，但核心体验需要专门的 WebGL 与交互 Skill。",
    use: ["入口文案与 CTA", "页面 meta、alt 替代说明和返回路径", "非 WebGL 的可用降级界面"],
    avoid: ["用普通落地页分节拆散持续场景", "把 CSS 入场动效当成渲染架构", "忽略移动 GPU 和降级"],
    prompt: "仅用 landing-page-design 规划外围文案和发布信息；持续 3D 场景、控制和性能由专门的 WebGL 方案负责。",
  },
};

const extensions = {
  knowledge: {
    kicker: "Current state",
    name: "知识层：把设计经验写成工作规程",
    summary: "当前仓库停留在这一层。元数据负责触发，Markdown 正文负责流程、规则、禁止项和 checklist。",
    assets: ["SKILL.md", "触发描述", "设计规则与输出契约"],
    proof: ["人工审阅生成结果", "检查代理是否遵守规则", "没有自动 PASS/FAIL"],
  },
  config: {
    kicker: "Brand adaptation",
    name: "配置层：把个人审美改成项目品牌 Profile",
    summary: "把字体、颜色、间距、圆角、图标、语气和动效从长文中抽离，让同一工作流服务不同产品。",
    assets: ["brand-profile.json", "中文与 RTL 规则", "框架适配映射"],
    proof: ["Token 可追溯", "不同品牌不互相污染", "视觉值不再硬编码在通用规则里"],
  },
  verify: {
    kicker: "Deterministic QA",
    name: "验证层：让程序检查，而不是让模型自我保证",
    summary: "增加 Token linter、内容真实性检查、axe、Playwright、死链和 meta 验证，把主观 checklist 转为可重复证据。",
    assets: ["lint-design-tokens", "audit-content", "verify-page", "浏览器 fixtures"],
    proof: ["明确 PASS/FAIL", "桌面、平板、手机截图", "键盘、主题、reduced-motion 记录"],
  },
  product: {
    kicker: "Outcome loop",
    name: "产品层：连接真实证据、分析事件和实验",
    summary: "当页面接入真实素材、事件埋点和 A/B 测试，才能从“规则看起来合理”推进到“业务效果可测量”。",
    assets: ["真实证明与来源台账", "事件与漏斗定义", "实验变体与发布 Manifest"],
    proof: ["真实用户行为", "实验假设与样本记录", "版本、素材、指标可追溯"],
  },
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function activateTab(button, group) {
  group.forEach((item) => {
    const selected = item === button;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
}

function bindArrowNavigation(group, onActivate) {
  group.forEach((button, index) => {
    button.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % group.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + group.length) % group.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = group.length - 1;
      group[next].focus();
      onActivate(group[next]);
    });
  });
}

function renderAngle(key) {
  const item = angles[key];
  $("#angle-kicker").textContent = item.kicker;
  $("#angle-title").textContent = item.title;
  $("#angle-badge").textContent = item.badge;
  $("#angle-summary").textContent = item.summary;
  $("#angle-input").innerHTML = item.input;
  $("#angle-rule").innerHTML = item.rule;
  $("#angle-output").innerHTML = item.output;
  $("#angle-limit").innerHTML = item.limit;
}

function renderComparison(key) {
  const item = comparisons[key];
  $("#baseline-preview").innerHTML = item.baseline;
  $("#guided-preview").innerHTML = item.guided;
  $("#baseline-note").textContent = item.baselineNote;
  $("#guided-note").textContent = item.guidedNote;
}

function renderState(key) {
  const item = states[key];
  $("#state-screen").innerHTML = item.html;
  $("#state-explanation").textContent = item.explanation;
}

function renderScenario(key) {
  const item = scenarios[key];
  $("#fit-label").textContent = item.label;
  $("#fit-bar").style.width = `${item.score}%`;
  $("#scenario-name").textContent = item.name;
  $("#scenario-why").textContent = item.why;
  $("#scenario-use").innerHTML = item.use.map((entry) => `<li>${entry}</li>`).join("");
  $("#scenario-avoid").innerHTML = item.avoid.map((entry) => `<li>${entry}</li>`).join("");
  $("#scenario-prompt").textContent = item.prompt;
}

function renderExtension(key) {
  const item = extensions[key];
  $("#extension-kicker").textContent = item.kicker;
  $("#extension-name").textContent = item.name;
  $("#extension-summary").textContent = item.summary;
  $("#extension-assets").innerHTML = item.assets.map((entry) => `<li>${entry}</li>`).join("");
  $("#extension-proof").innerHTML = item.proof.map((entry) => `<li>${entry}</li>`).join("");
}

function bindTabs(selector, dataKey, render) {
  const group = $$(selector);
  const activate = (button) => {
    activateTab(button, group);
    render(button.dataset[dataKey]);
  };
  group.forEach((button) => button.addEventListener("click", () => activate(button)));
  bindArrowNavigation(group, activate);
  return group;
}

function initTheme() {
  const saved = localStorage.getItem("ads-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (prefersDark ? "dark" : "light");
  const toggle = $("#theme-toggle");

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ads-theme", theme);
    const next = theme === "light" ? "深色" : "亮色";
    toggle.setAttribute("aria-label", `切换到${next}主题`);
    $("#theme-icon").textContent = theme === "light" ? "◐" : "◑";
  };

  setTheme(initial);
  toggle.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));
}

initTheme();
bindTabs("[data-angle]", "angle", renderAngle);
bindTabs("[data-compare]", "compare", renderComparison);
bindTabs("[data-state]", "state", renderState);
bindTabs("[data-scenario]", "scenario", renderScenario);
bindTabs("[data-extension]", "extension", renderExtension);

renderAngle("strategy");
renderComparison("copy");
renderState("success");
renderScenario("saas");
renderExtension("knowledge");

