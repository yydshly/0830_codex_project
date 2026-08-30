const SIZE = 14;

const COLORS = {
  background: { code: "W01", name: "奶油白", hex: "#efe6d7" },
  outline: { code: "E18", name: "深咖", hex: "#3d342e" },
  primary: { code: "A07", name: "珊瑚", hex: "#e56d52" },
  primaryLight: { code: "A05", name: "浅杏", hex: "#f0a875" },
  primaryDark: { code: "A09", name: "砖红", hex: "#b94a3b" },
  accent: { code: "F07", name: "明黄", hex: "#efbd4e" },
  secondary: { code: "C14", name: "松绿", hex: "#4f8c7f" },
  secondaryLight: { code: "C10", name: "浅绿", hex: "#9cbe8f" },
  center: { code: "E08", name: "栗色", hex: "#75483c" },
  white: { code: "W02", name: "亮白", hex: "#fffaf0" },
};

const MODES = {
  source: {
    label: "原图示意",
    note: "这里仍是一张屏幕图片：颜色可以连续变化，也没有“每格一颗”和实体品牌色号的约束。",
  },
  fine: {
    label: "写实模式",
    note: "每个格子取原图覆盖区域的平均色，再匹配最接近的品牌拼豆色号。",
  },
  rough: {
    label: "主色模式",
    note: "优先选择每格里占比最大的颜色，并合并相近明暗，减少零碎色和采购种类。",
  },
  simple: {
    label: "清晰模式",
    note: "检测高对比边缘并保护深色轮廓，让很小的图案仍然容易辨认。",
  },
};

const PATTERNS = {
  cat: "猫咪",
  heart: "爱心",
  flower: "小花",
};

let activePattern = "cat";
let activeMode = "fine";

function inBounds(x, y) {
  return x >= 0 && y >= 0 && x < SIZE && y < SIZE;
}

function catMask(x, y) {
  const head = Math.pow((x - 6.5) / 5.1, 2) + Math.pow((y - 7.5) / 4.7, 2) <= 1;
  const leftEar = y >= 1 && y <= 5 && x >= 1.5 && x <= 2.2 + y;
  const rightEar = y >= 1 && y <= 5 && x <= 11.5 && x >= 10.8 - y;
  return head || leftEar || rightEar;
}

function heartMask(x, y) {
  const leftLobe = Math.pow(x - 4.3, 2) + Math.pow(y - 4.2, 2) <= 9.2;
  const rightLobe = Math.pow(x - 8.7, 2) + Math.pow(y - 4.2, 2) <= 9.2;
  const lower = y >= 4 && y <= 12 && Math.abs(x - 6.5) <= (12.4 - y) * 0.72;
  return leftLobe || rightLobe || lower;
}

function flowerPart(x, y) {
  const circles = [
    [6.5, 2.8, 2.35],
    [3.7, 5.2, 2.35],
    [9.3, 5.2, 2.35],
    [4.7, 7.7, 2.25],
    [8.3, 7.7, 2.25],
  ];
  const petal = circles.some(([cx, cy, radius]) => Math.pow(x - cx, 2) + Math.pow(y - cy, 2) <= radius * radius);
  const center = Math.pow(x - 6.5, 2) + Math.pow(y - 5.8, 2) <= 2.15 * 2.15;
  const stem = y >= 8 && y <= 13 && (x === 6 || x === 7);
  const leftLeaf = y >= 9 && y <= 11 && x >= 3 && x <= 6 && x + y >= 13;
  const rightLeaf = y >= 10 && y <= 12 && x >= 7 && x <= 10 && x - y <= -2;

  if (center) return "center";
  if (petal) return "petal";
  if (stem || leftLeaf || rightLeaf) return "green";
  return "background";
}

function maskFor(pattern, x, y) {
  if (pattern === "cat") return catMask(x, y);
  if (pattern === "heart") return heartMask(x, y);
  return flowerPart(x, y) !== "background";
}

function isBoundary(pattern, x, y) {
  if (!maskFor(pattern, x, y)) return false;
  return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;
    return !inBounds(nx, ny) || !maskFor(pattern, nx, ny);
  });
}

function semanticRole(pattern, x, y) {
  if (!maskFor(pattern, x, y)) return "background";

  if (pattern === "cat") {
    if (isBoundary(pattern, x, y)) return "outline";
    if ((x === 5 || x === 8) && (y === 7 || y === 8)) return "outline";
    if ((x === 6 || x === 7) && y === 9) return "center";
    if ((x === 3 || x === 10) && y === 9) return "accent";
    if (y <= 4 || (x <= 4 && y <= 7)) return "primaryLight";
    if (y >= 10 || x >= 9) return "primaryDark";
    return "primary";
  }

  if (pattern === "heart") {
    if (isBoundary(pattern, x, y)) return "outline";
    if (x <= 4 && y <= 5) return "primaryLight";
    if (y >= 9 || x >= 9) return "primaryDark";
    if ((x + y) % 11 === 0) return "white";
    return "primary";
  }

  const part = flowerPart(x, y);
  if (isBoundary(pattern, x, y)) return "outline";
  if (part === "center") return y < 6 ? "accent" : "center";
  if (part === "green") return y % 2 === 0 ? "secondaryLight" : "secondary";
  return x + y < 10 ? "primaryLight" : "primary";
}

function roughRole(role) {
  if (["primaryLight", "primaryDark", "white"].includes(role)) return "primary";
  if (role === "secondaryLight") return "secondary";
  if (role === "center") return "outline";
  return role;
}

function simpleRole(pattern, role, x, y) {
  if (role === "background") return role;
  if (isBoundary(pattern, x, y)) return "outline";
  if (["primaryLight", "primaryDark", "white"].includes(role)) return "primary";
  if (role === "secondaryLight") return "secondary";
  if (role === "center") return "outline";
  return role;
}

function colorFor(pattern, mode, x, y) {
  const role = semanticRole(pattern, x, y);
  if (mode === "rough") return COLORS[roughRole(role)];
  if (mode === "simple") return COLORS[simpleRole(pattern, role, x, y)];
  return COLORS[role];
}

function createGrid(pattern, mode) {
  const cells = [];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      cells.push(colorFor(pattern, mode, x, y));
    }
  }
  return cells;
}

function updateUsage(cells) {
  const counts = new Map();
  cells.forEach((color) => {
    const previous = counts.get(color.code) || { color, count: 0 };
    previous.count += 1;
    counts.set(color.code, previous);
  });

  const entries = [...counts.values()].sort((a, b) => b.count - a.count);
  const usageList = document.querySelector("#usage-list");
  usageList.replaceChildren();

  entries.forEach(({ color, count }) => {
    const chip = document.createElement("span");
    chip.className = "usage-chip";
    chip.title = color.name;

    const swatch = document.createElement("i");
    swatch.style.setProperty("--chip-color", color.hex);

    const code = document.createElement("b");
    code.textContent = color.code;

    const quantity = document.createElement("span");
    quantity.textContent = `×${count}`;

    chip.append(swatch, code, quantity);
    usageList.append(chip);
  });

  document.querySelector("#distinct-colors").textContent = String(entries.length);
  document.querySelector("#total-beads").textContent = String(cells.length);
}

function renderBoard() {
  const board = document.querySelector("#bead-board");
  const cells = createGrid(activePattern, activeMode);
  const fragment = document.createDocumentFragment();

  cells.forEach((color, index) => {
    const bead = document.createElement("span");
    bead.className = "bead";
    bead.style.setProperty("--bead-color", color.hex);
    bead.style.animationDelay = `${Math.min(index * 2, 220)}ms`;
    bead.setAttribute("aria-hidden", "true");
    fragment.append(bead);
  });

  board.replaceChildren(fragment);
  board.classList.toggle("source-view", activeMode === "source");
  board.classList.add("is-updating");
  window.setTimeout(() => board.classList.remove("is-updating"), 480);

  const patternLabel = PATTERNS[activePattern];
  const modeLabel = MODES[activeMode].label;
  board.setAttribute("aria-label", `14 乘 14 的${patternLabel}，${modeLabel}`);
  document.querySelector("#board-title").textContent = `${patternLabel} · ${modeLabel}`;
  document.querySelector("#mode-note").textContent = MODES[activeMode].note;
  updateUsage(cells);
}

function activateButton(button, selector) {
  document.querySelectorAll(selector).forEach((candidate) => {
    candidate.setAttribute("aria-pressed", String(candidate === button));
  });
}

document.querySelectorAll("[data-pattern]").forEach((button) => {
  button.addEventListener("click", () => {
    activePattern = button.dataset.pattern;
    activateButton(button, "[data-pattern]");
    renderBoard();
  });
});

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    activeMode = button.dataset.mode;
    activateButton(button, "[data-mode]");
    renderBoard();
  });
});

renderBoard();

const SAMPLE_CASES = {
  portrait: {
    kicker: "SCENE 01 · PRIVATE PORTRAIT",
    title: "把人物插画变成可采购、可摆放的图纸",
    description: "适合家庭照片、头像插画和小规模定制。它不会“理解人物”，而是把肤色、头发、五官和背景压到有限网格与品牌色号。",
    scenario: {
      user: "小型定制商",
      job: "客户发来头像，当天确认拼豆方案",
      constraint: "35×35、最多 16 色、4 块底板内",
      done: "得到可报价初稿，再人工确认五官与肤色",
      journey: [
        { title: "客户头像", note: "收到创作素材", state: "done" },
        { title: "Pindo 初稿", note: "15 色 · 1,225 格", state: "done" },
        { title: "人工校图", note: "确认五官与肤色", state: "boundary" },
        { title: "报价初稿", note: "4 块底板内", state: "ready" },
      ],
    },
    proof: "上游实测 · 5b6c85c",
    inputLabel: "原创人物插画",
    input: "assets/samples/portrait-gradient.svg",
    inputAlt: "本研究原创的人物渐变插画输入",
    variantLabel: "创作模式",
    variantAria: "切换人物插画创作模式",
    defaultVariant: "fine",
    judgment: "可以快速得到可制作初稿；肖像辨识度优先时应比较写实与清晰，而不是只看模式名字。",
    variants: {
      fine: {
        label: "写实",
        runNote: "MARD · 35×35 · 最多 16 色",
        outputLabel: "写实模式图纸",
        output: "assets/samples/portrait-fine-35.png",
        outputAlt: "Pindo 写实模式生成的 35 乘 35 拼豆图纸",
        metrics: ["35×35", "15", "1,225", "4"],
        usage: ["M08 ×240", "P18 ×154", "B22 ×136", "F01 ×109", "H06 ×100"],
        boundary: "三种模式在该参数下都实际使用 15 色；“主色”改变颜色分配，但不保证自动减少最终色数。",
      },
      rough: {
        label: "主色",
        runNote: "MARD · 35×35 · 最多 16 色",
        outputLabel: "主色模式图纸",
        output: "assets/samples/portrait-rough-35.png",
        outputAlt: "Pindo 主色模式生成的 35 乘 35 拼豆图纸",
        metrics: ["35×35", "15", "1,225", "4"],
        usage: ["M08 ×218", "F01 ×197", "P18 ×158", "B22 ×155", "H16 ×148"],
        boundary: "主色模式明显重分配了大色块，但此样例仍为 15 色；它是采样策略，不是“必然少色”的开关。",
      },
      simple: {
        label: "清晰",
        runNote: "MARD · 35×35 · 最多 16 色",
        outputLabel: "清晰模式图纸",
        output: "assets/samples/portrait-simple-35.png",
        outputAlt: "Pindo 清晰模式生成的 35 乘 35 拼豆图纸",
        metrics: ["35×35", "15", "1,225", "4"],
        usage: ["F01 ×209", "M08 ×207", "B22 ×154", "H16 ×148", "P18 ×121"],
        boundary: "清晰模式保护高对比轮廓，但小尺寸下的五官仍取决于输入构图与网格数，不能补回不存在的细节。",
      },
    },
  },
  pixel: {
    kicker: "SCENE 02 · PIXEL ASSET",
    title: "让低分辨率素材保持轮廓，同时压住采购色数",
    description: "适合像素角色、徽章、小挂件和游戏周边。输入本来就接近拼豆网格，Pindo 的主要价值是映射品牌色号并给出数量。",
    scenario: {
      user: "家长与孩子",
      job: "周末一小时完成一个角色挂件",
      constraint: "16×16、最多 8 色、单块底板、少换色",
      done: "6 色、256 颗，备齐材料后可直接照图制作",
      journey: [
        { title: "像素角色", note: "轮廓和尺寸已知", state: "done" },
        { title: "限制色数", note: "最多 8 色", state: "done" },
        { title: "材料清单", note: "实际 6 色 · 256 颗", state: "done" },
        { title: "亲子制作", note: "1 块底板可完成", state: "ready" },
      ],
    },
    proof: "上游实测 · 原创 16×16",
    inputLabel: "原创像素吉祥物",
    input: "assets/samples/pixel-mascot.svg",
    inputAlt: "本研究原创的 16 乘 16 像素吉祥物输入",
    variantLabel: "测试配置",
    variantAria: "像素素材测试配置",
    defaultVariant: "simple",
    judgment: "这是 Pindo 最稳妥的一类输入：硬边、低色数、尺寸已知，输出可以直接进入备料检查。",
    variants: {
      simple: {
        label: "清晰 · 最多 8 色",
        runNote: "MARD · 清晰 · 16×16 · 最多 8 色",
        outputLabel: "6 色品牌图纸",
        output: "assets/samples/pixel-mascot-simple-16.png",
        outputAlt: "Pindo 生成的 16 乘 16 六色像素吉祥物拼豆图纸",
        metrics: ["16×16", "6", "256", "1"],
        usage: ["C12 ×131", "H13 ×40", "P16 ×31", "A08 ×28", "P19 ×16", "A26 ×10"],
        boundary: "同一输入若保留默认最多 16 色，实测会用到 14 色；像素素材也要主动设色数上限。",
      },
    },
  },
  recognize: {
    kicker: "SCENE 03 · GRID RECOGNITION",
    title: "把旧网格图纸重新计算成品牌色号和颗数",
    description: "适合只有图片、没有源数据的旧图纸。程序识别格线与格子颜色，不是读取格内文字，因此尺寸正确性必须人工复核。",
    scenario: {
      user: "工作坊老师",
      job: "复刻纸质旧图，准备一组同款活动材料",
      constraint: "已知原图 12×12，拍照可能倾斜，尺寸不能猜",
      done: "人工确认 12×12 后，才能相信用量并批量备料",
      journey: [
        { title: "旧图照片", note: "已知 12×12", state: "done" },
        { title: "自动识别", note: "却报告 13×13", state: "boundary" },
        { title: "人工核对", note: "需要确认行列", state: "boundary" },
        { title: "暂缓备料", note: "当前结果不可直接用", state: "blocked" },
      ],
    },
    proof: "真实识别 · 已知输入 12×12",
    inputLabel: "正视网格爱心",
    input: "assets/samples/grid-heart.svg",
    inputAlt: "本研究原创的 12 乘 12 正视网格爱心图纸",
    variantLabel: "拍摄状态",
    variantAria: "切换旧图纸拍摄状态",
    defaultVariant: "front",
    judgment: "可以作为旧图纸数字化的起点，但自动识别不是最终真值；先核对行列，再相信色号与数量。",
    variants: {
      front: {
        label: "正视 · 自动",
        runNote: "自动网格 · 已知 12×12 输入",
        inputLabel: "正视网格爱心",
        input: "assets/samples/grid-heart.svg",
        inputAlt: "本研究原创的 12 乘 12 正视网格爱心图纸",
        outputLabel: "自动报告 13×13",
        output: "assets/samples/grid-heart-auto-13.png",
        outputAlt: "Pindo 将已知 12 乘 12 输入自动识别为 13 乘 13 的输出",
        metrics: ["13×13（输入 12×12）", "4", "169", "1"],
        usage: ["自动网格", "4 个色号", "169 格", "尺寸误判 +1"],
        boundary: "页面提示“已自动识别网格”，但把已知 12×12 报成 13×13；成功提示不等于尺寸正确。",
      },
      skewed: {
        label: "倾斜 9° · 手工",
        runNote: "裁边回退 · 手工填写 12×12",
        inputLabel: "倾斜 9° 网格爱心",
        input: "assets/samples/grid-heart-skewed.svg",
        inputAlt: "本研究原创的倾斜九度 12 乘 12 网格爱心图纸",
        outputLabel: "手工指定 12×12",
        output: "assets/samples/grid-heart-skewed-manual-12.png",
        outputAlt: "Pindo 对倾斜九度输入手工指定 12 乘 12 后的输出",
        metrics: ["12×12（手工）", "5", "144", "1"],
        usage: ["F13 红", "H18 白", "H15 灰", "G05 黄", "H11 深灰"],
        boundary: "旋转 9° 后自动网格失败并回退到均分；斜线和背景被采进格子，额外产生近似色。",
        scenario: {
          done: "手工指定 12×12 后可继续，但多出的近似色仍需校正",
          journey: [
            { title: "倾斜照片", note: "旋转 9°", state: "done" },
            { title: "自动回退", note: "未可靠识别网格", state: "boundary" },
            { title: "手工填写", note: "指定 12×12", state: "done" },
            { title: "近似清单", note: "5 色 · 仍需校色", state: "ready" },
          ],
        },
      },
    },
  },
  focus: {
    kicker: "SCENE 04 · MAKING FOCUS",
    title: "按颜色和连通区域推进大图制作",
    description: "适合制作阶段分批摆豆、记录进度。Focus 页能把一次点击扩展到同色连通区域，减少逐颗确认的操作量。",
    scenario: {
      user: "分多天制作大图的玩家",
      job: "今天收工，明天回来立刻知道从哪里继续",
      constraint: "当前只验证 12×12 夹具，主生成页没有入口与数据写入",
      done: "夹具中一次完成背景 98 颗；真实项目续做尚未接通",
      journey: [
        { title: "已有图纸", note: "12×12 测试夹具", state: "done" },
        { title: "手工注入", note: "主流程缺少这一步", state: "boundary" },
        { title: "连通区点击", note: "背景 98 颗完成", state: "done" },
        { title: "进度 68%", note: "仅夹具可运行", state: "blocked" },
      ],
    },
    proof: "路由实测 · 手工注入夹具",
    inputLabel: "12×12 三色测试夹具",
    input: "assets/samples/grid-heart.svg",
    inputAlt: "用于 Focus 页面测试的三色网格夹具示意",
    variantLabel: "集成状态",
    variantAria: "Focus 集成测试状态",
    defaultVariant: "fixture",
    judgment: "制作辅助逻辑有价值，尤其适合大面积背景；但固定提交还不能从主生成页自然进入这一步。",
    focus: true,
    variants: {
      fixture: {
        label: "手工注入后可运行",
        runNote: "/focus · 12×12 · 3 色 · 144 格",
        outputLabel: "背景区一次完成 98 颗",
        output: "assets/samples/grid-heart-auto-13.png",
        outputAlt: "Focus 页面连通区域进度测试的图纸背景",
        metrics: ["12×12 夹具", "3", "144", "1"],
        usage: ["H18 98/98", "总进度 98/144", "一次点击", "68%"],
        boundary: "直接打开 /focus 会提示没有图纸数据；源码中能找到读取 pindo-focus-data 的代码，但固定提交未找到主流程写入和入口。",
      },
    },
  },
};

const sampleTabs = [...document.querySelectorAll("[data-sample-case]")];
const samplePanel = document.querySelector("#sample-panel");
const activeSampleVariants = Object.fromEntries(
  Object.entries(SAMPLE_CASES).map(([id, sample]) => [id, sample.defaultVariant]),
);

function setSampleText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderSample(caseId, variantId = activeSampleVariants[caseId]) {
  const sample = SAMPLE_CASES[caseId];
  const variant = sample?.variants[variantId];
  if (!samplePanel || !sample || !variant) return;
  const scenario = { ...sample.scenario, ...variant.scenario };
  const scenarioJourney = variant.scenario?.journey || sample.scenario.journey;

  activeSampleVariants[caseId] = variantId;
  samplePanel.dataset.activeSample = caseId;

  sampleTabs.forEach((tab) => {
    const selected = tab.dataset.sampleCase === caseId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) samplePanel.setAttribute("aria-labelledby", tab.id);
  });

  setSampleText("#sample-proof", sample.proof);
  setSampleText("#sample-run-note", variant.runNote);
  setSampleText("#sample-input-label", variant.inputLabel || sample.inputLabel);
  setSampleText("#sample-output-label", variant.outputLabel);
  setSampleText("#sample-variant-label", sample.variantLabel);
  setSampleText("#sample-kicker", sample.kicker);
  setSampleText("#sample-title", sample.title);
  setSampleText("#sample-description", sample.description);
  setSampleText("#scenario-user", scenario.user);
  setSampleText("#scenario-job", scenario.job);
  setSampleText("#scenario-constraint", scenario.constraint);
  setSampleText("#scenario-done", scenario.done);
  setSampleText("#sample-size", variant.metrics[0]);
  setSampleText("#sample-colors", variant.metrics[1]);
  setSampleText("#sample-cells", variant.metrics[2]);
  setSampleText("#sample-boards", variant.metrics[3]);
  setSampleText("#sample-judgment", sample.judgment);
  setSampleText("#sample-boundary", variant.boundary);

  const inputImage = document.querySelector("#sample-input-image");
  const outputImage = document.querySelector("#sample-output-image");
  const inputLink = document.querySelector("#sample-input-link");
  const inputSource = variant.input || sample.input;
  const inputAlt = variant.inputAlt || sample.inputAlt;
  inputImage.src = inputSource;
  inputImage.alt = inputAlt;
  outputImage.src = variant.output;
  outputImage.alt = variant.outputAlt;
  inputLink.href = inputSource;

  const usage = document.querySelector("#sample-usage");
  usage.replaceChildren(
    ...variant.usage.map((item) => {
      const row = document.createElement("li");
      row.textContent = item;
      return row;
    }),
  );

  const journey = document.querySelector("#scenario-journey");
  journey.replaceChildren(
    ...scenarioJourney.map((step, index) => {
      const item = document.createElement("li");
      item.className = `is-${step.state}`;

      const number = document.createElement("span");
      number.textContent = String(index + 1).padStart(2, "0");

      const title = document.createElement("strong");
      title.textContent = step.title;

      const note = document.createElement("small");
      note.textContent = step.note;

      item.append(number, title, note);
      return item;
    }),
  );

  const variants = document.querySelector("#sample-variants");
  variants.setAttribute("aria-label", sample.variantAria);
  variants.replaceChildren(
    ...Object.entries(sample.variants).map(([id, item]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.sampleVariant = id;
      button.setAttribute("aria-pressed", String(id === variantId));
      button.textContent = item.label;
      return button;
    }),
  );

  document.querySelector("#focus-progress-demo").hidden = !sample.focus;
}

sampleTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderSample(tab.dataset.sampleCase));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % sampleTabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + sampleTabs.length) % sampleTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = sampleTabs.length - 1;

    const nextTab = sampleTabs[nextIndex];
    renderSample(nextTab.dataset.sampleCase);
    nextTab.focus();
  });
});

document.querySelector("#sample-variants")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sample-variant]");
  if (!button) return;
  renderSample(samplePanel.dataset.activeSample, button.dataset.sampleVariant);
});

renderSample("portrait");

const QUALITY_PASSES = {
  structure: {
    priority: "P0 · STRUCTURE FIDELITY",
    scope: "算法 + 人工确认",
    kicker: "QUALITY PASS 01 · KEEP WHAT MATTERS",
    title: "关键结构保护",
    symptom: "像素化之后人物还在，但眼睛、嘴和脸型可能失去辨识度。",
    root: "当前算法按颜色、明暗和局部对比采样，不知道哪些格子承载人物身份。",
    image: "assets/samples/portrait-simple-35.png",
    imageAlt: "Pindo 清晰模式生成的 35 乘 35 人物拼豆图纸",
    proofLabel: "当前实测 · 35×35 人物图纸",
    proofValue: "三种模式均为 15 色，仍需人工比较",
    nowTitle: "模式只能更换采样策略",
    now: "写实、主色、清晰会改变颜色分配，但不能保证关键五官被保留。",
    targetTitle: "先标关键区域，再生成",
    target: "眼睛、嘴和脸部边界获得更高权重；低置信度区域必须由用户确认。",
    layers: [
      { kind: "算法增强", title: "主体分割 + 关键结构保护", note: "人脸、宠物或文字边缘按多尺度采样" },
      { kind: "用户控制", title: "原图叠加 + 关键区域锁定", note: "框选必须保留的眼睛、嘴和轮廓" },
      { kind: "质量门槛", title: "辨识度检查", note: "导出前展示关键区域差异与低置信度" },
    ],
    metric: "首次方案接受率、关键区域改动次数",
    product: "P0 · 图纸修复工作台",
  },
  palette: {
    priority: "P1 · PALETTE OPTIMIZATION",
    scope: "算法 + 库存约束",
    kicker: "QUALITY PASS 02 · USE COLORS YOU OWN",
    title: "库存感知的色板收敛",
    symptom: "图案能看懂，但近似色太多，找豆、换色和采购成本一起上升。",
    root: "当前限色主要约束理论颜色数，没有把用户库存、品牌规格、缺色替代和袋装成本一起纳入优化。",
    image: "assets/samples/pixel-mascot-simple-16.png",
    imageAlt: "Pindo 生成的 16 乘 16 六色像素吉祥物图纸",
    proofLabel: "当前实测 · 同一 16×16 像素素材",
    proofValue: "最多 16 色时用 14 色；限制 8 色后实际为 6 色",
    nowTitle: "用户事后发现颜色过多",
    now: "生成结果只告诉你用了什么色，没有先判断这些色是否已有、买得到或值得增加。",
    targetTitle: "库存和预算参与生成",
    target: "只在可用色板中寻找辨识度、色差、成本和换色次数之间的更优解。",
    layers: [
      { kind: "算法增强", title: "库存约束色板优化", note: "把感知色差、色数、成本和换色次数联合评分" },
      { kind: "用户控制", title: "锁定品牌、已有色与预算", note: "允许指定必用、禁用和可替代的颜色" },
      { kind: "质量门槛", title: "BOM 与缺色检查", note: "导出前给出袋数、损耗、缺口和替代影响" },
    ],
    metric: "同等辨识度下的实际色数、缺料次数和材料成本",
    product: "P1 · 库存与成本规划",
  },
  grid: {
    priority: "P0 · GRID CONFIDENCE",
    scope: "几何校正 + 质量门槛",
    kicker: "QUALITY PASS 03 · NEVER GUESS SILENTLY",
    title: "网格校正与置信度",
    symptom: "页面提示识别成功，但行列一旦错一格，后面的色号、颗数和采购都会全部错。",
    root: "当前网格检测依赖稳定横纵线和间距；旋转、透视、裁边或粗线会让边界计数与均分回退产生误判。",
    image: "assets/samples/grid-heart-auto-13.png",
    imageAlt: "Pindo 将已知 12 乘 12 旧图自动报告为 13 乘 13 的实测输出",
    proofLabel: "当前实测 · 已知 12×12 输入",
    proofValue: "自动报告 13×13；旋转 9° 后回退手工均分",
    nowTitle: "成功提示掩盖尺寸不确定性",
    now: "用户看不到算法检测了哪些线，也不知道结果是否接近失败边界。",
    targetTitle: "不确定时必须显式确认",
    target: "先校正旋转与透视，展示候选网格；低置信度时阻止直接统计和批量备料。",
    layers: [
      { kind: "算法增强", title: "旋转 / 透视校正 + 线簇评分", note: "联合边界、间距和交点稳定性选择候选网格" },
      { kind: "用户控制", title: "可拖动网格与已知尺寸", note: "允许输入 12×12，并直接调整首尾边界" },
      { kind: "质量门槛", title: "尺寸一致性与置信度", note: "尺寸冲突或置信度低时，必须确认后再统计" },
    ],
    metric: "尺寸误判拦截率、人工校正时间、批量备料返工率",
    product: "P0 · 旧图数字化工作台",
  },
  repair: {
    priority: "P0 · EDITABLE FINAL",
    scope: "数据模型 + 编辑器",
    kicker: "QUALITY PASS 04 · DRAFT TO FINAL",
    title: "从自动初稿到可编辑终稿",
    symptom: "结果只差几格时，用户仍只能换参数重生成，无法在当前方案上继续修。",
    root: "当前交付物更接近一次性 Canvas 图片，缺少稳定图纸数据、撤销、版本和质量检查。",
    image: "assets/samples/portrait-fine-35.png",
    imageAlt: "Pindo 写实模式生成的 35 乘 35 人物拼豆图纸",
    proofLabel: "当前实测 · 人物自动初稿",
    proofValue: "能导出图纸，但无法逐格把它修成最终版本",
    nowTitle: "每次修改都重新生成",
    now: "用户很难保留已经满意的区域，也无法清楚比较这次调整究竟改坏了哪里。",
    targetTitle: "自动生成成为编辑起点",
    target: "图纸以可版本化数据保存，支持逐格编辑、区域换色、撤销和前后差异确认。",
    layers: [
      { kind: "算法增强", title: "Pattern JSON + 异常建议", note: "稳定保存格子、色号、来源和孤立区域提示" },
      { kind: "用户控制", title: "画笔、填充、换色、撤销", note: "锁定满意区域，并在同一版本上完成修正" },
      { kind: "质量门槛", title: "版本差异 + 导出审批", note: "确认尺寸、色数、异常和材料变化后生成终稿" },
    ],
    metric: "一次生成后完成修正的比例、重生成次数、终稿返工率",
    product: "P0 · 图纸修复工作台",
  },
};

const qualityTabs = [...document.querySelectorAll("[data-quality-pass]")];
const qualityPanel = document.querySelector("#quality-panel");

function setQualityText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderQualityPass(passId) {
  const pass = QUALITY_PASSES[passId];
  if (!pass || !qualityPanel) return;

  qualityPanel.dataset.activeQuality = passId;
  qualityTabs.forEach((tab) => {
    const selected = tab.dataset.qualityPass === passId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) qualityPanel.setAttribute("aria-labelledby", tab.id);
  });

  setQualityText("#quality-priority", pass.priority);
  setQualityText("#quality-scope", pass.scope);
  setQualityText("#quality-kicker", pass.kicker);
  setQualityText("#quality-title", pass.title);
  setQualityText("#quality-symptom", pass.symptom);
  setQualityText("#quality-root", pass.root);
  setQualityText("#quality-proof-label", pass.proofLabel);
  setQualityText("#quality-proof-value", pass.proofValue);
  setQualityText("#quality-now-title", pass.nowTitle);
  setQualityText("#quality-now", pass.now);
  setQualityText("#quality-target-title", pass.targetTitle);
  setQualityText("#quality-target", pass.target);
  setQualityText("#quality-metric", pass.metric);
  setQualityText("#quality-product", pass.product);

  const image = document.querySelector("#quality-image");
  image.src = pass.image;
  image.alt = pass.imageAlt;

  const stack = document.querySelector("#quality-stack");
  stack.replaceChildren(
    ...pass.layers.map((layer, index) => {
      const item = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = `${String(index + 1).padStart(2, "0")} · ${layer.kind}`;
      const title = document.createElement("strong");
      title.textContent = layer.title;
      const note = document.createElement("small");
      note.textContent = layer.note;
      item.append(label, title, note);
      return item;
    }),
  );
}

qualityTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderQualityPass(tab.dataset.qualityPass));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % qualityTabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) nextIndex = (index - 1 + qualityTabs.length) % qualityTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = qualityTabs.length - 1;

    const nextTab = qualityTabs[nextIndex];
    renderQualityPass(nextTab.dataset.qualityPass);
    nextTab.focus();
  });
});

renderQualityPass("structure");

const MATERIAL_WORLDS = {
  flower: {
    category: "LIVING MATERIAL · 活体材料",
    horizon: "产品跨度 · 近场",
    kicker: "WORLD 01 · FLOWER MOSAIC",
    title: "花朵不是圆形像素，而是会呼吸的单元",
    description: "花头大小不一、朝向不同，还会随时间变化。系统需要先选择花材，再根据轮廓、密度和观赏时长生成插花网格。",
    image: "assets/materials/flower-mosaic.webp",
    imageAlt: "由真实花朵排列成侧脸轮廓的跨材料方向概念照",
    visualLabel: "方向概念 · 鲜花头像装置",
    visualState: "元素会生长、萎蔫，也会替换",
    unit: "2–6 cm 花头 / 枝材",
    layout: "簇状、放射、层叠",
    join: "花泥、网架、花艺铁丝",
    life: "鲜花 6–24h；干花数周",
    risk: "同一颜色会受季节、批次和萎蔫影响；方案必须提供替代花材与现场补花策略。",
    scenes: "婚礼花墙、品牌快闪、纪念仪式、橱窗陈列",
    output: "花材桶数、替代花清单、分区插花图与保鲜时间表",
    metric: "现场安装时间、替代率、24 小时观赏完整度",
    capabilities: [
      { kind: "元素目录", title: "花径、枝长、季节与新鲜度", note: "同色花材也不是可直接互换的色块" },
      { kind: "约束求解", title: "碰撞、朝向与密度规划", note: "让轮廓成立，同时保留花头呼吸空间" },
      { kind: "施工交付", title: "分区插花图与补花节奏", note: "按现场顺序而不是按屏幕像素输出" },
    ],
    product: "鲜花装置设计器 + 花材采购与施工单",
  },
  fruit: {
    category: "EDIBLE MATERIAL · 可食材料",
    horizon: "产品跨度 · 邻近",
    kicker: "WORLD 02 · EDIBLE MOSAIC",
    title: "水果能拼画面，但先要解决卫生、切型和食用时限",
    description: "草莓、葡萄和柑橘的颜色很鲜明，却有完全不同的尺寸、含水量和氧化速度。它更像一份可食用陈列计划，而不是一张静态图纸。",
    image: "assets/materials/fruit-mosaic.webp",
    imageAlt: "由草莓、奇异果、柑橘、蓝莓和葡萄排列成鸟形的跨材料方向概念照",
    visualLabel: "方向概念 · 水果飞鸟餐台",
    visualState: "每一块都可食，也都有保鲜倒计时",
    unit: "整果、切片、果粒、串签",
    layout: "平铺、鳞片叠放、串联",
    join: "托盘凹槽、果签、可食胶",
    life: "常温 1–4h；冷藏当日",
    risk: "切面氧化、汁液渗出、过敏原和交叉污染都会改变排布与制作顺序。",
    scenes: "宴会餐台、亲子食育、品牌品鉴、蛋糕与甜品装饰",
    output: "切型尺寸、份数、食材采购单、冷链批次与上桌时间轴",
    metric: "食材浪费率、上桌完整度、制作时长与安全检查通过率",
    capabilities: [
      { kind: "食材目录", title: "尺寸、熟度、含水量与过敏原", note: "颜色之外还必须知道能不能一起摆" },
      { kind: "约束求解", title: "氧化、承重与汁液隔离", note: "先排易损食材，再规划稳定底层" },
      { kind: "制作交付", title: "分批切配与冷链时间线", note: "输出厨房可以执行的顺序和份量" },
    ],
    product: "可食艺术编排器 + 食材备料与食品安全清单",
  },
  leaf: {
    category: "BIO MATERIAL · 自然材料",
    horizon: "产品跨度 · 邻近",
    kicker: "WORLD 03 · BOTANICAL MOSAIC",
    title: "叶片与种子让作品拥有季节、纹理和可降解性",
    description: "叶片不是规整方块，颜色也会随干燥改变。系统需要识别叶形、纹理方向和含水状态，把不规则自然物组织成可复刻的生态拼贴。",
    image: "assets/materials/leaf-mosaic.webp",
    imageAlt: "由真实叶片、蕨类和种子排列成鱼形的跨材料方向概念照",
    visualLabel: "方向概念 · 四季叶片鱼",
    visualState: "材料来自自然，也可以回到自然",
    unit: "叶片、蕨叶、果壳与种子",
    layout: "顺纹层叠、放射、轮廓镶边",
    join: "压制、环保胶、线缝、标本针",
    life: "鲜叶数日；压叶数月",
    risk: "采集伦理、叶色干燥偏移、虫害和脆裂决定它能否用于课堂或长期陈列。",
    scenes: "生态课堂、博物馆活动、季节橱窗、社区共创",
    output: "采集范围、叶形模板、压制步骤、替代物种与回收说明",
    metric: "本地材料使用率、复刻成功率、保存完整度与可降解比例",
    capabilities: [
      { kind: "自然物目录", title: "叶形、纹理、采集地与干燥色", note: "屏幕绿和干燥后的绿要分开记录" },
      { kind: "约束求解", title: "顺纹排布与脆裂风险", note: "轮廓边缘优先使用稳定、可裁切叶片" },
      { kind: "教学交付", title: "采集、压制、拼贴与归还", note: "把制作过程变成可学习的生态任务" },
    ],
    product: "自然拼贴课程工具 + 本地材料图谱",
  },
  tile: {
    category: "DURABLE MATERIAL · 耐久材料",
    horizon: "产品跨度 · 中场",
    kicker: "WORLD 04 · ARCHITECTURAL MOSAIC",
    title: "瓷砖与木片把图纸升级成真正的空间施工图",
    description: "材料变得耐久之后，重点从逐颗摆放转向基层尺寸、裁切、灰缝、转角和承重。输出必须能被设计师、材料商与施工人员共同使用。",
    image: "assets/materials/tile-mosaic.webp",
    imageAlt: "由蓝色、青色、珊瑚色和米色瓷砖排列成海浪的跨材料方向概念照",
    visualLabel: "方向概念 · 建筑瓷砖海浪",
    visualState: "图案会留在墙面，也必须经得住施工",
    unit: "马赛克砖、木片、异形边角",
    layout: "正交、曲线贴合、错缝",
    join: "瓷砖胶、灰缝、背网",
    life: "室内 5–15 年；可维护",
    risk: "曲线裁切、伸缩缝、基层平整度和重量会让屏幕上成立的图案无法直接施工。",
    scenes: "公共壁画、店铺门头、儿童空间、家具表面",
    output: "铺贴分区、裁切编号、材料面积、损耗、胶与灰缝清单",
    metric: "裁切率、材料损耗、现场偏差、每平方米工时",
    capabilities: [
      { kind: "建材目录", title: "规格、厚度、表面与批次色", note: "同一色号也要处理釉面和尺寸偏差" },
      { kind: "约束求解", title: "曲线转译、灰缝与边角裁切", note: "把轮廓优化为可铺贴的模块组合" },
      { kind: "施工交付", title: "分区放样图与编号 BOM", note: "输出每块材料的位置、裁切和安装顺序" },
    ],
    product: "空间马赛克设计器 + 建材 BOM 与放样图",
  },
  light: {
    category: "DYNAMIC MATERIAL · 动态材料",
    horizon: "产品跨度 · 远场",
    kicker: "WORLD 05 · LIGHT PIXEL",
    title: "灯光像素让静态图纸变成会变化的时间画布",
    description: "LED 单元可以换色和运动，但每个点都需要地址、电源和刷新逻辑。系统不只生成一帧图案，还要生成接线、功耗与动画时间线。",
    image: "assets/materials/light-mosaic.webp",
    imageAlt: "由实体 LED 光点排列成蝴蝶的跨材料方向概念照",
    visualLabel: "方向概念 · 互动蝴蝶灯墙",
    visualState: "像素会发光，也会消耗电力和带宽",
    unit: "可寻址 LED 点阵 / 灯带段",
    layout: "规则点阵、灯带路径、分区模组",
    join: "卡槽、线束、控制器与电源",
    life: "数万小时；需散热维护",
    risk: "功耗、压降、散热、刷新率和坏点冗余共同决定装置能否稳定运行。",
    scenes: "互动展墙、舞台背景、店铺橱窗、城市灯光装置",
    output: "像素地址图、接线分区、功耗预算、动画帧与故障替换表",
    metric: "峰值功耗、帧率、坏点恢复时间与互动停留时长",
    capabilities: [
      { kind: "硬件目录", title: "亮度、功耗、协议与防护等级", note: "颜色映射必须服从真实灯珠和供电能力" },
      { kind: "时空求解", title: "布线、压降与动画编排", note: "同时优化一帧画面和整段时间变化" },
      { kind: "运行交付", title: "地址表、控制文件与维护模式", note: "从施工接线一直覆盖到现场运维" },
    ],
    product: "动态像素编排器 + 灯光施工与运行控制台",
  },
  button: {
    category: "TACTILE MATERIAL · 触觉材料",
    horizon: "产品跨度 · 近场",
    kicker: "WORLD 06 · TACTILE MOSAIC",
    title: "纽扣与布片把颜色图变成可触摸、可拆换的表面",
    description: "不同尺寸、孔位和材质的纽扣天然适合重复利用，也能形成触觉层次。系统需要考虑缝线路径、布料拉力和可触摸辨识度。",
    image: "assets/materials/button-mosaic.webp",
    imageAlt: "由木质、贝壳和树脂纽扣排列成猫形的跨材料方向概念照",
    visualLabel: "方向概念 · 纽扣猫触觉拼贴",
    visualState: "不只用眼睛看，也可以用手去读",
    unit: "纽扣、布片、绒线与缝珠",
    layout: "大小嵌套、疏密分区、触觉轮廓",
    join: "手缝、机缝、魔术贴与按扣",
    life: "可拆洗、可修补、长期复用",
    risk: "孔位、厚度、布料拉力和小件安全决定作品能否穿戴、清洗或供儿童触摸。",
    scenes: "服装配饰、触觉绘本、康复训练、旧衣改造",
    output: "纽扣分类、缝线路径、布料加固、拆洗与替换说明",
    metric: "旧料复用率、制作时间、触觉识别率与维修次数",
    capabilities: [
      { kind: "触觉目录", title: "直径、厚度、孔位与表面纹理", note: "系统需要理解手感，而不只是屏幕颜色" },
      { kind: "约束求解", title: "缝线路径、拉力与小件安全", note: "让结构可穿戴、可清洗并避免局部坠重" },
      { kind: "制作交付", title: "针法、线长与可拆换分区", note: "把材料复用和后续维修纳入图纸" },
    ],
    product: "触觉拼贴编辑器 + 缝制路径与循环材料库",
  },
};

const materialTabs = [...document.querySelectorAll("[data-material-world]")];
const materialPanel = document.querySelector("#material-panel");

function setMaterialText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderMaterialWorld(materialId) {
  const material = MATERIAL_WORLDS[materialId];
  if (!material || !materialPanel) return;

  materialPanel.dataset.activeMaterial = materialId;
  materialTabs.forEach((tab) => {
    const selected = tab.dataset.materialWorld === materialId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) materialPanel.setAttribute("aria-labelledby", tab.id);
  });

  setMaterialText("#material-category", material.category);
  setMaterialText("#material-horizon", material.horizon);
  setMaterialText("#material-kicker", material.kicker);
  setMaterialText("#material-title", material.title);
  setMaterialText("#material-description", material.description);
  setMaterialText("#material-visual-label", material.visualLabel);
  setMaterialText("#material-visual-state", material.visualState);
  setMaterialText("#material-unit", material.unit);
  setMaterialText("#material-layout", material.layout);
  setMaterialText("#material-join", material.join);
  setMaterialText("#material-life", material.life);
  setMaterialText("#material-risk", material.risk);
  setMaterialText("#material-scenes", material.scenes);
  setMaterialText("#material-output", material.output);
  setMaterialText("#material-metric", material.metric);
  setMaterialText("#material-product", material.product);

  const image = document.querySelector("#material-image");
  if (image) {
    image.src = material.image;
    image.alt = material.imageAlt;
  }

  const capabilities = document.querySelector("#material-capabilities");
  if (capabilities) {
    capabilities.replaceChildren(
      ...material.capabilities.map((capability, index) => {
        const item = document.createElement("li");
        const label = document.createElement("span");
        label.textContent = `${String(index + 1).padStart(2, "0")} · ${capability.kind}`;
        const title = document.createElement("strong");
        title.textContent = capability.title;
        const note = document.createElement("small");
        note.textContent = capability.note;
        item.append(label, title, note);
        return item;
      }),
    );
  }
}

materialTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderMaterialWorld(tab.dataset.materialWorld));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % materialTabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) nextIndex = (index - 1 + materialTabs.length) % materialTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = materialTabs.length - 1;

    const nextTab = materialTabs[nextIndex];
    renderMaterialWorld(nextTab.dataset.materialWorld);
    nextTab.focus();
  });
});

renderMaterialWorld("flower");

const PRODUCT_LINES = {
  creator: {
    priority: "P1 · 最先验证",
    horizon: "个人用户 / 小型卖家",
    kicker: "PRODUCT 01 · CREATOR TOOL",
    title: "Pindo Creator",
    promise: "一款能把图片修成可制作图纸，并持续管理作品、材料与进度的个人创作工具。",
    user: "手作爱好者、定制卖家、重度创作者",
    payer: "个人用户或小型工作室",
    job: "更快得到可制作终稿，并减少返工和缺料",
    alternative: "手工描格、Excel、通用像素软件与纸笔清单",
    loop: [
      { title: "生成初稿", note: "图片进入确定性图纸" },
      { title: "修成终稿", note: "逐格编辑与版本确认" },
      { title: "准备材料", note: "库存、缺料与成本" },
      { title: "完成作品", note: "进度、导出与项目归档" },
    ],
    modules: ["可编辑图纸与原图对照", "个人材料库存与缺料提醒", "制作进度、断点续做与项目库", "高清图纸、PDF 与专业导出"],
    business: "免费基础版 + Pro 订阅 / 买断",
    channel: "模板搜索、教程内容、创作者分享、材料品牌联运",
    metric: "每周完成作品数与免费到付费转化率",
    dependency: "P0 可编辑图纸、稳定项目格式、库存与 Focus 接通",
    verdict: "这是最小入口产品：单个用户不依赖供应链或机构采购，就能验证“愿不愿意为完成作品付费”。",
    revenueStage: "tool",
  },
  merchant: {
    priority: "P2 · 交易变现",
    horizon: "材料商 / 定制商家",
    kicker: "PRODUCT 02 · MERCHANT SYSTEM",
    title: "Pindo Merchant",
    promise: "让材料商和定制商家把一张图纸变成可报价、可下单、可拣货、可履约的商品。",
    user: "拼豆材料店、手作商家、定制成品卖家",
    payer: "商家、品牌或供应商",
    job: "缩短从客户图片到报价、备料和订单交付的时间",
    alternative: "客服人工估价、表格库存、手工分包与多个电商后台",
    loop: [
      { title: "接收需求", note: "客户图片、尺寸与预算" },
      { title: "生成报价", note: "终稿、BOM、工时与毛利" },
      { title: "下单履约", note: "SKU、拣货、分包与状态" },
      { title: "售后复购", note: "缺料、替代与模板复用" },
    ],
    modules: ["客户需求单与在线报价", "SKU、库存、替代色和供应商目录", "拣货、分包、标签与订单导出", "毛利、缺料、售后与复购看板"],
    business: "商家订阅 + 交易服务费 + 材料包毛利",
    channel: "材料品牌合作、商家直销、供应商渠道与电商服务市场",
    metric: "报价到下单转化率、履约错误率与单均毛利",
    dependency: "可信终稿与 BOM、标准 SKU、供应商库存和订单状态",
    verdict: "Merchant 比 Creator 更接近交易收入，但必须先证明 BOM 准确；否则只会把估算错误带进履约。",
    revenueStage: "commerce",
  },
  workshop: {
    priority: "P2 · 机构复用",
    horizon: "学校 / 场馆 / 工作坊",
    kicker: "PRODUCT 03 · WORKSHOP SAAS",
    title: "Pindo Workshop",
    promise: "把一次手工活动变成可排课、可备料、可分组、可复用的机构课程产品。",
    user: "学校、博物馆、社区中心与工作坊主理人",
    payer: "机构、场馆或活动主办方",
    job: "在固定人数和课时内稳定完成活动，并复用课程与材料方案",
    alternative: "教师个人教案、微信群协作、手工点料和现场口头分工",
    loop: [
      { title: "创建课程", note: "年龄、课时、目标与安全" },
      { title: "批量备课", note: "分组任务、材料包与教案" },
      { title: "现场执行", note: "签到、进度、补位与合成" },
      { title: "复盘复用", note: "作品档案、反馈与下一场" },
    ],
    modules: ["课程模板、年龄与安全规则", "班级、角色、分区和难度管理", "批量材料包、教师台与参与者任务", "机构项目库、成果档案与复用分析"],
    business: "按席位 / 场地年费 + 按场活动包",
    channel: "区域教培伙伴、学校与场馆直销、课程内容合作",
    metric: "课时内完成率、课程复用次数与机构续费率",
    dependency: "多人权限、批量分包、儿童隐私、安全规则与进度同步",
    verdict: "Workshop 验证的是可重复服务而非单次创作；它和 Creator 共用底座，却拥有更稳定的年度付费方。",
    revenueStage: "saas",
  },
  projects: {
    priority: "P3 · 专业高客单",
    horizon: "活动 / 空间 / 展陈团队",
    kicker: "PRODUCT 04 · PROJECT SOLUTION",
    title: "Pindo Projects",
    promise: "面向大型装置与空间项目，管理方案、报价、审批、施工、验收和维护。",
    user: "活动公司、空间设计公司、展陈团队与品牌市场部",
    payer: "项目甲方、总包或专业设计机构",
    job: "让跨材料项目在预算、工期、安全和现场条件内按时交付",
    alternative: "CAD / 设计软件 + 报价表 + 项目群 + 人工施工编号",
    loop: [
      { title: "方案与估算", note: "尺寸、材料、预算与风险" },
      { title: "协同审批", note: "客户、设计、采购与施工" },
      { title: "现场交付", note: "分区、工序、验收与变更" },
      { title: "维护归档", note: "替换、保养与资产记录" },
    ],
    modules: ["项目空间、版本审批与角色权限", "专业约束、报价、排期与风险清单", "施工分区、工序、变更和验收", "维护计划、替换记录与项目资产库"],
    business: "团队 SaaS + 项目许可 + 实施与交付服务费",
    channel: "行业直销、设计机构伙伴、展会与标杆项目",
    metric: "报价周期、项目毛利、按期交付率与变更成本",
    dependency: "专业材料规范、责任边界、现场流程与行业交付伙伴",
    verdict: "Projects 客单高但交付重，适合在工具和机构产品验证后进入，不应作为最初商业化入口。",
    revenueStage: "solution",
  },
  platform: {
    priority: "P3 · 生态放大",
    horizon: "品牌 / 开发者 / 供应商",
    kicker: "PRODUCT 05 · OPEN PLATFORM",
    title: "Pindo Platform",
    promise: "把图纸引擎、材料规格、插件、模板与供应服务开放给品牌、软件和开发者。",
    user: "材料品牌、供应商、设计软件团队与垂直开发者",
    payer: "企业客户、平台伙伴和第三方开发者",
    job: "把 Pindo 能力嵌入自己的产品，并发布可验证的材料与模板",
    alternative: "自研图像转换、私有规格表、一次性接口与封闭供应数据",
    loop: [
      { title: "接入能力", note: "API、SDK 与项目格式" },
      { title: "发布规格", note: "ElementSpec、约束与版本" },
      { title: "分发交易", note: "插件、模板、材料与授权" },
      { title: "监控治理", note: "用量、质量、版权与结算" },
    ],
    modules: ["图纸 / BOM / 约束 API 与 SDK", "ElementSpec 注册、版本与认证", "插件、模板和供应市场", "用量计费、版权治理、审核与结算"],
    business: "API 用量费 + 企业授权 + 认证费 + 市场抽成",
    channel: "开发者生态、企业联盟、材料品牌和软件集成伙伴",
    metric: "活跃集成数、API 用量、伙伴留存与平台交易额",
    dependency: "稳定开放规格、开发者文档、内容治理、结算与知识产权机制",
    verdict: "Platform 是结果，不是起点：只有前四条产品线持续产生可信项目、规格与交易，它才有网络效应。",
    revenueStage: "platform",
  },
};

const productLineTabs = [...document.querySelectorAll("[data-product-line]")];
const productLinePanel = document.querySelector("#product-line-panel");

function setProductLineText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderProductLine(lineId) {
  const line = PRODUCT_LINES[lineId];
  if (!line || !productLinePanel) return;

  productLinePanel.dataset.activeLine = lineId;
  productLineTabs.forEach((tab) => {
    const selected = tab.dataset.productLine === lineId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) productLinePanel.setAttribute("aria-labelledby", tab.id);
  });

  setProductLineText("#product-line-priority", line.priority);
  setProductLineText("#product-line-horizon", line.horizon);
  setProductLineText("#product-line-kicker", line.kicker);
  setProductLineText("#product-line-title", line.title);
  setProductLineText("#product-line-promise", line.promise);
  setProductLineText("#product-line-user", line.user);
  setProductLineText("#product-line-payer", line.payer);
  setProductLineText("#product-line-job", line.job);
  setProductLineText("#product-line-alternative", line.alternative);
  setProductLineText("#product-line-business", line.business);
  setProductLineText("#product-line-channel", line.channel);
  setProductLineText("#product-line-metric", line.metric);
  setProductLineText("#product-line-dependency", line.dependency);
  setProductLineText("#product-line-verdict", line.verdict);

  document.querySelectorAll("[data-revenue-stage]").forEach((stage) => {
    if (stage.dataset.revenueStage === line.revenueStage) stage.setAttribute("aria-current", "step");
    else stage.removeAttribute("aria-current");
  });

  const loop = document.querySelector("#product-line-loop");
  if (loop) {
    loop.replaceChildren(
      ...line.loop.map((step, index) => {
        const item = document.createElement("li");
        const number = document.createElement("span");
        const title = document.createElement("strong");
        const note = document.createElement("small");
        number.textContent = String(index + 1).padStart(2, "0");
        title.textContent = step.title;
        note.textContent = step.note;
        item.append(number, title, note);
        return item;
      }),
    );
  }

  const modules = document.querySelector("#product-line-modules");
  if (modules) {
    modules.replaceChildren(
      ...line.modules.map((label) => {
        const item = document.createElement("li");
        item.textContent = label;
        return item;
      }),
    );
  }
}

productLineTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderProductLine(tab.dataset.productLine));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % productLineTabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) nextIndex = (index - 1 + productLineTabs.length) % productLineTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = productLineTabs.length - 1;

    const nextTab = productLineTabs[nextIndex];
    renderProductLine(nextTab.dataset.productLine);
    nextTab.focus();
  });
});

renderProductLine("creator");

const PRODUCT_DIRECTIONS = {
  edit: {
    priority: "P0 · FOUNDATION",
    audience: "个人创作者 / 定制打样",
    kicker: "DIRECTION A · PATTERN REPAIR",
    title: "图纸修复工作台",
    promise: "自动生成不再是终点。用户能对照原图修轮廓、改色、删杂点，并在导出前确认尺寸与异常。",
    evidence: "人物三种模式都实际使用 15 色；用户缺的不是第四个模式，而是可撤销、可比较的逐格修正。",
    modules: ["原图叠加与前后对照", "画笔、区域填色与整图换色", "撤销、版本比较与图纸 JSON", "尺寸、孤立色和低置信度警告"],
    metricTitle: "一次生成后即可完成修正",
    metric: "减少反复切模式；导出前发现尺寸错误和孤立杂色。",
    scores: { impact: 5, effort: 3, leverage: 3 },
    verdict: "这是共同底座：图纸没修对，库存、Focus 和模板市场都会放大错误。",
    image: "assets/samples/portrait-simple-35.png",
    imageAlt: "Pindo 清晰模式生成的人物拼豆图纸，用于说明图纸修复工作台",
    previewLabel: "真实问题载体 · 人物图纸",
    previewState: "从不可编辑到可修正",
  },
  material: {
    priority: "P1 · MATERIAL PLANNING",
    audience: "家庭玩家 / 材料商 / 工作坊",
    kicker: "DIRECTION B · INVENTORY & COST",
    title: "库存与成本规划",
    promise: "先告诉 Pindo 家里有什么、预算多少，再生成买得到的图纸；缺色时直接比较替代方案与成品影响。",
    evidence: "16×16 像素素材在最多 8 色时只用 6 色，保留默认 16 色上限却会产生 14 个近似色；色数必须受库存和预算约束。",
    modules: ["个人库存与品牌规格管理", "只用已有颜色重新匹配", "缺色替代与色差预览", "袋数、损耗、底板和采购成本"],
    metricTitle: "生成前就知道缺什么、花多少",
    metric: "减少中途缺料；提高库存利用率，并能比较相似度与成本。",
    scores: { impact: 5, effort: 4, leverage: 5 },
    verdict: "这是最自然的商业入口：先做好可信 BOM，再谈材料包和下单。",
    image: "assets/samples/pixel-mascot-simple-16.png",
    imageAlt: "Pindo 六色像素吉祥物图纸，用于说明库存和成本规划",
    previewLabel: "真实问题载体 · 6 色 / 256 格",
    previewState: "从理论数量到可采购 BOM",
  },
  make: {
    priority: "P1 · MAKING ASSISTANT",
    audience: "大图玩家 / 亲子活动 / 工作坊",
    kicker: "DIRECTION C · FINISH THE BUILD",
    title: "制作执行助手",
    promise: "从生成页直接进入制作状态，按底板、颜色或连通区域推进；暂停后回来，马上知道下一步做哪里。",
    evidence: "Focus 手工注入后一次点击能完成背景 98 颗、总进度 68%，但主生成页没有数据写入和入口。",
    modules: ["生成页一键进入 Focus", "按底板、颜色、行列或区域推进", "计时、撤销完成与断点续做", "手机扫码、分板 PDF 与成品归档"],
    metricTitle: "返回项目 10 秒内继续制作",
    metric: "提高中大型项目完成率；减少摆错、重复计数和丢失进度。",
    scores: { impact: 4, effort: 2, leverage: 3 },
    verdict: "这条路线已有部分代码，适合在 P0 数据结构稳定后快速接通。",
    image: "assets/samples/grid-heart-auto-13.png",
    imageAlt: "Pindo 网格爱心图纸，用于说明制作执行助手",
    previewLabel: "已有能力证据 · Focus 98 / 144",
    previewState: "从孤立路由到可续做流程",
  },
  grow: {
    priority: "P2 · CREATOR & COMMERCE",
    audience: "图纸创作者 / 定制商家 / 活动机构",
    kicker: "DIRECTION D · REUSE & GROW",
    title: "模板、分享与材料包经营",
    promise: "把一次性图纸变成可版本化、可 remix、可交付的项目资产，并进一步生成活动备料和材料包报价。",
    evidence: "当前只能导出孤立图片，无法保存可编辑版本、复用来源或把理论颗数转成批量备料与报价。",
    modules: ["私有项目库、模板与版本", "可 remix 副本与来源标记", "分享链接、二维码和品牌 PDF", "材料包 BOM、报价与订单导出"],
    metricTitle: "同一图纸能被复用和交付",
    metric: "观察模板复用、材料包转化，以及工作坊批量备料时间。",
    scores: { impact: 4, effort: 5, leverage: 5 },
    verdict: "不能先做社区再补基础：它依赖稳定图纸 JSON、库存和制作链路。",
    image: "assets/samples/portrait-fine-35.png",
    imageAlt: "Pindo 人物拼豆图纸，用于说明模板、分享和材料包经营",
    previewLabel: "未来交付物 · 可版本图纸",
    previewState: "从一次导出到可经营资产",
  },
};

const productTabs = [...document.querySelectorAll("[data-product-goal]")];
const productPanel = document.querySelector("#product-panel");

function setProductText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function updateProductScore(name, value) {
  setProductText(`#product-${name}`, `${value} / 5`);
  const meter = document.querySelector(`#product-${name}-meter`);
  if (meter) {
    meter.value = value;
    meter.textContent = `${value}/5`;
  }
}

function renderProductDirection(goalId) {
  const direction = PRODUCT_DIRECTIONS[goalId];
  if (!direction || !productPanel) return;

  productPanel.dataset.activeProduct = goalId;
  productTabs.forEach((tab) => {
    const selected = tab.dataset.productGoal === goalId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) productPanel.setAttribute("aria-labelledby", tab.id);
  });

  setProductText("#product-priority", direction.priority);
  setProductText("#product-audience", direction.audience);
  setProductText("#product-kicker", direction.kicker);
  setProductText("#product-direction-title", direction.title);
  setProductText("#product-promise", direction.promise);
  setProductText("#product-evidence", direction.evidence);
  setProductText("#product-metric-title", direction.metricTitle);
  setProductText("#product-metric", direction.metric);
  setProductText("#product-verdict", direction.verdict);
  setProductText("#product-preview-label", direction.previewLabel);
  setProductText("#product-preview-state", direction.previewState);

  const preview = document.querySelector("#product-preview-image");
  preview.src = direction.image;
  preview.alt = direction.imageAlt;

  const modules = document.querySelector("#product-modules");
  modules.replaceChildren(
    ...direction.modules.map((label) => {
      const item = document.createElement("li");
      item.textContent = label;
      return item;
    }),
  );

  updateProductScore("impact", direction.scores.impact);
  updateProductScore("effort", direction.scores.effort);
  updateProductScore("leverage", direction.scores.leverage);
}

productTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderProductDirection(tab.dataset.productGoal));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % productTabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) nextIndex = (index - 1 + productTabs.length) % productTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = productTabs.length - 1;

    const nextTab = productTabs[nextIndex];
    renderProductDirection(nextTab.dataset.productGoal);
    nextTab.focus();
  });
});

renderProductDirection("edit");

const EMOTION_PRODUCT_GROUPS = {
  ritual: {
    priority: "P0 · 最高频入口",
    moment: "晨间选择 · 睡前回看",
    kicker: "EMOTIONAL JOB 01 · NOTICE MYSELF",
    title: "把“今天怎么样”放在看得见的地方。",
    intro: "不要求写长日记，也不把用户困在 App 里。每天只移动一块颜色，几秒完成记录；一个月后，情绪与成长自然形成可回看的图案。",
    touchpoint: "起床、早餐、下班回家与睡前",
    job: "降低表达门槛，让人看见自己的变化而不被评分",
    image: "assets/emotion-products/daily-ritual.webp",
    imageAlt: "桌面上的磁吸情绪日历与每日成长拼图写实概念产品",
    caption: "情绪日历 + 成长拼图",
    verdict: "这是最适合先做的方向：使用频率高、无需复杂供应链，也最容易验证“情绪可视化是否真的帮助用户坚持”。",
    products: [
      { id: "mood-calendar", label: "PRODUCT 01", name: "情绪日历", delivery: "成品 + 可替换主题块", description: "每天选一块颜色记录心情，周末或月末得到一张属于自己的情绪图谱。", mechanism: "心情 → 色彩与位置", business: "桌面硬件 + 季度主题包", metric: "30 天记录完成率" },
      { id: "growth-mosaic", label: "PRODUCT 02", name: "成长拼图", delivery: "成品底板 + 年度补充包", description: "阅读、睡眠或运动每完成一天就增加一块，抽象图案随着习惯慢慢长出来。", mechanism: "习惯数据 → 每日一块", business: "底板成品 + 年度补充包", metric: "连续 8 周完成率" },
    ],
  },
  together: {
    priority: "P1 · 关系型硬件",
    moment: "下班回家 · 异地想念",
    kicker: "EMOTIONAL JOB 02 · FEEL TOGETHER",
    title: "不是提醒你有消息，而是让你感到有人在。",
    intro: "灯光和实体模块比通知更柔和。一个人改变一块颜色，另一个人的灯或留言板随之回应，让远距离关系拥有可触摸、不过度打扰的共同痕迹。",
    touchpoint: "床头、客厅、家庭出入口与异地两端",
    job: "用低打扰的方式确认陪伴，把一次联系变成持续共同创作",
    image: "assets/emotion-products/relationship-light.webp",
    imageAlt: "床头情绪氛围灯与墙上关系留言板写实概念产品",
    caption: "情绪氛围灯 + 关系留言板",
    verdict: "这组产品的价值不在灯本身，而在“双人或家庭持续互动”。先验证每周互相留下颜色的次数，再决定是否承担联网硬件和账户体系。",
    products: [
      { id: "companion-light", label: "PRODUCT 03", name: "情绪氛围灯", delivery: "联网成品灯 + 光效主题", description: "把一句问候、当天心情或共同照片转成柔和光色，回家时无需打开手机也能感知陪伴。", mechanism: "心情 / 问候 → 光色与节奏", business: "硬件 + 光效主题订阅", metric: "每周主动点亮夜数" },
      { id: "relationship-board", label: "PRODUCT 04", name: "关系留言板", delivery: "成对硬件 + 家庭账户", description: "两个人在各自一端增加颜色模块，变化同步到另一端，逐渐形成只属于这段关系的图案。", mechanism: "双方动作 → 共享图案", business: "双件套 + 家庭会员", metric: "双人每周互动次数" },
    ],
  },
  comfort: {
    priority: "P2 · 高频小物",
    moment: "通勤、会议前 · 独处恢复",
    kicker: "EMOTIONAL JOB 03 · REGULATE & EXPRESS",
    title: "情绪说不清时，先给身体一个可以握住的反馈。",
    intro: "有些产品不需要屏幕和复杂解释。触感、重量与颜色可以成为微小但随手可得的调节工具，也能通过佩戴物表达“今天想安静一点”。",
    touchpoint: "口袋、办公桌、书包、手机与衣物",
    job: "帮助身体稳定下来，并让状态表达更轻、更不尴尬",
    image: "assets/emotion-products/tactile-expression.webp",
    imageAlt: "桌面触觉减压物与可替换情绪挂件写实概念产品",
    caption: "触觉减压物 + 情绪徽章与挂件",
    verdict: "这是适合快速试产的消费品方向，但必须用真实压力场景验证，而不是只看“好不好看”；触觉材料安全与耐久是进入门槛。",
    products: [
      { id: "tactile-comfort", label: "PRODUCT 05", name: "触觉减压物", delivery: "成品主体 + 可替换触感模块", description: "在焦虑或注意力涣散时，通过按压、滚动、重量和不同表面提供安静、可重复的感官反馈。", mechanism: "压力状态 → 触感与阻尼", business: "主体硬件 + 触感模块包", metric: "压力场景重复使用率" },
      { id: "mood-charms", label: "PRODUCT 06", name: "情绪徽章与挂件", delivery: "成品饰品 + 可换面片", description: "挂在包、手机或衣物上，用颜色和材质表达今天的社交状态，也可以作为朋友之间的小型礼物。", mechanism: "情绪状态 → 可佩戴符号", business: "饰品套装 + 联名系列", metric: "每周更换与赠送频次" },
    ],
  },
  memory: {
    priority: "P2 · 礼赠与定制",
    moment: "纪念日、搬家 · 宠物与亲人回忆",
    kicker: "EMOTIONAL JOB 04 · KEEP WHAT MATTERS",
    title: "把照片和旧物，变成可以继续陪伴的东西。",
    intro: "记忆产品的核心不是像素化本身，而是保留“为什么重要”。照片可以成为光与图案，旧衣、纽扣和布料可以被设计成成品，适合摆放、触摸、赠送和传承。",
    touchpoint: "客厅相框、书桌、纪念日礼物与家庭收藏",
    job: "保存关系证据，让不可重复的物件以新的形式继续存在",
    image: "assets/emotion-products/memory-reuse.webp",
    imageAlt: "宠物照片记忆相框与旧衣再生纪念画写实概念产品",
    caption: "记忆相框 + 记忆再生产品",
    verdict: "这组客单价和礼赠价值更高，但个性化履约更重。适合在图案编辑、材料规格和小批量生产稳定后进入，而不是最先启动。",
    products: [
      { id: "memory-frame", label: "PRODUCT 07", name: "记忆相框", delivery: "个性化成品 + 数字主题", description: "将家庭、宠物或旅行照片保留为一侧原始影像、一侧色彩拼图，让记忆在熟悉和抽象之间切换。", mechanism: "照片 → 构图、色板与微光", business: "按件定制 + 节日礼盒", metric: "送礼复购与二次定制率" },
      { id: "memory-reuse", label: "PRODUCT 08", name: "记忆再生产品", delivery: "寄料设计服务 + 成品返还", description: "把旧衣、纽扣或一段布料重新设计为装框作品、挂饰或软装，让材料本身携带的记忆继续被看见。", mechanism: "旧物故事 → 材料构图", business: "设计服务费 + 成品费", metric: "交付满意度与家庭追加订单" },
    ],
  },
};

const emotionTabs = [...document.querySelectorAll("[data-emotion-group]")];
const emotionPanel = document.querySelector("#emotion-panel");

function setEmotionText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function createEmotionFact(label, value) {
  const wrapper = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value;
  wrapper.append(term, description);
  return wrapper;
}

function createEmotionProductCard(product) {
  const card = document.createElement("article");
  card.className = "emotion-product-card";
  card.dataset.emotionProduct = product.id;

  const heading = document.createElement("div");
  const label = document.createElement("span");
  const title = document.createElement("strong");
  const delivery = document.createElement("small");
  label.textContent = product.label;
  title.textContent = product.name;
  delivery.textContent = product.delivery;
  heading.append(label, title, delivery);

  const description = document.createElement("p");
  description.textContent = product.description;

  const facts = document.createElement("dl");
  facts.append(
    createEmotionFact("转译机制", product.mechanism),
    createEmotionFact("收费方式", product.business),
    createEmotionFact("验证指标", product.metric),
  );

  card.append(heading, description, facts);
  return card;
}

function renderEmotionProductGroup(groupId) {
  const group = EMOTION_PRODUCT_GROUPS[groupId];
  if (!group || !emotionPanel) return;

  emotionPanel.dataset.activeEmotion = groupId;
  emotionTabs.forEach((tab) => {
    const selected = tab.dataset.emotionGroup === groupId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) emotionPanel.setAttribute("aria-labelledby", tab.id);
  });

  setEmotionText("#emotion-priority", group.priority);
  setEmotionText("#emotion-moment", group.moment);
  setEmotionText("#emotion-kicker", group.kicker);
  setEmotionText("#emotion-title", group.title);
  setEmotionText("#emotion-intro", group.intro);
  setEmotionText("#emotion-touchpoint", group.touchpoint);
  setEmotionText("#emotion-job", group.job);
  setEmotionText("#emotion-image-caption", group.caption);
  setEmotionText("#emotion-verdict", group.verdict);

  const image = document.querySelector("#emotion-image");
  if (image) {
    image.src = group.image;
    image.alt = group.imageAlt;
  }

  const cards = document.querySelector("#emotion-product-cards");
  if (cards) cards.replaceChildren(...group.products.map(createEmotionProductCard));
}

emotionTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderEmotionProductGroup(tab.dataset.emotionGroup));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % emotionTabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) nextIndex = (index - 1 + emotionTabs.length) % emotionTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = emotionTabs.length - 1;

    const nextTab = emotionTabs[nextIndex];
    renderEmotionProductGroup(nextTab.dataset.emotionGroup);
    nextTab.focus();
  });
});

renderEmotionProductGroup("ritual");

const MEMORY_ATMOSPHERES = {
  single: {
    kicker: "PINDO ONE · CLOSE COMPANION",
    complexity: "实现复杂度 · 低",
    title: "一盏灯，轮流承接许多记忆。",
    promise: "它不是常亮相框，而是一个安静焦点：灯始终微亮，每次只让一个人物、宠物、物品或名字从柔光中出现。",
    windows: "固定 1 个灯窗；灯窗数量与记忆数量完全解耦。",
    rhythm: "每 8–20 秒随机更换一段内容，避免连续重复。",
    space: "床头、书桌、纪念角与小户型独居空间。",
    role: "最容易落地的入门款、礼物款与付费 MVP。",
  },
  nine: {
    kicker: "PINDO NINE · SHARED MEMORY",
    complexity: "实现复杂度 · 中",
    title: "九盏一起亮，记忆错峰出现。",
    promise: "不是九张照片一起跳，而是九盏灯始终构成一个光场；每次只有 1–3 个灯窗显出人物或物件，随后再安静换到别处。",
    windows: "固定 3 × 3，九盏全部保持基础光。",
    rhythm: "每次错峰更新 1–3 窗，避免整面同步换屏。",
    space: "客厅边柜、共享卧室、玄关与家庭餐区。",
    role: "品牌标志款，也是家庭关系的核心形态。",
  },
  constellation: {
    kicker: "PINDO CONSTELLATION · SPATIAL MEMORY",
    complexity: "实现复杂度 · 高",
    title: "记忆离开格子，在空间里形成星群。",
    promise: "所有节点保持低亮呼吸，少量人物和物件在不同位置稀疏显影；节点数量与房间一起生长，不必被九宫格限制。",
    windows: "模块化 3–24 个节点；优先提供 5、9、15 三种预设。",
    rhythm: "约 20%–40% 节点显影，内容沿星群缓慢游走。",
    space: "电视墙、楼梯墙、酒店、咖啡馆、婚礼与展陈空间。",
    role: "高端定制、空间装置与 B2B 情绪体验产品。",
  },
};

const memoryAtmosphereTabs = [...document.querySelectorAll("[data-memory-atmosphere]")];
const memoryAtmospherePanel = document.querySelector("#memory-atmosphere-panel");

function setMemoryAtmosphereText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderMemoryAtmosphere(atmosphereId) {
  const atmosphere = MEMORY_ATMOSPHERES[atmosphereId];
  if (!atmosphere || !memoryAtmospherePanel) return;

  memoryAtmospherePanel.dataset.activeMemoryAtmosphere = atmosphereId;
  memoryAtmosphereTabs.forEach((tab) => {
    const selected = tab.dataset.memoryAtmosphere === atmosphereId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) memoryAtmospherePanel.setAttribute("aria-labelledby", tab.id);
  });

  setMemoryAtmosphereText("#memory-atmosphere-kicker", atmosphere.kicker);
  setMemoryAtmosphereText("#memory-atmosphere-complexity", atmosphere.complexity);
  setMemoryAtmosphereText("#memory-atmosphere-title", atmosphere.title);
  setMemoryAtmosphereText("#memory-atmosphere-promise", atmosphere.promise);
  setMemoryAtmosphereText("#memory-atmosphere-windows", atmosphere.windows);
  setMemoryAtmosphereText("#memory-atmosphere-rhythm", atmosphere.rhythm);
  setMemoryAtmosphereText("#memory-atmosphere-space", atmosphere.space);
  setMemoryAtmosphereText("#memory-atmosphere-role", atmosphere.role);
}

memoryAtmosphereTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderMemoryAtmosphere(tab.dataset.memoryAtmosphere));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % memoryAtmosphereTabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) nextIndex = (index - 1 + memoryAtmosphereTabs.length) % memoryAtmosphereTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = memoryAtmosphereTabs.length - 1;
    const nextTab = memoryAtmosphereTabs[nextIndex];
    renderMemoryAtmosphere(nextTab.dataset.memoryAtmosphere);
    nextTab.focus();
  });
});

renderMemoryAtmosphere("nine");

const MEMORY_LAMP_STORAGE_KEY = "pindo-memory-lamp-v1";
const MEMORY_CYCLE_PREFS_KEY = "pindo-memory-lamp-cycle-v1";
const MEMORY_CYCLE_INTERVALS = [5000, 8000, 15000];
const MEMORY_SHOWCASE_DURATION = 30000;
const MEMORY_SHOWCASE_INTERVAL = 5000;
const MEMORY_BEAN_ROLES = [
  { id: "meeting", name: "相遇", prompt: "我们从哪里开始", color: "#f4d18b", glow: "rgba(244, 209, 139, 0.72)" },
  { id: "ordinary", name: "日常", prompt: "最普通却想留下的一天", color: "#e8a58d", glow: "rgba(232, 165, 141, 0.68)" },
  { id: "gratitude", name: "感谢", prompt: "一直想认真说的谢谢", color: "#b9c880", glow: "rgba(185, 200, 128, 0.68)" },
  { id: "support", name: "支持", prompt: "你曾经接住我的时刻", color: "#b7a5c9", glow: "rgba(183, 165, 201, 0.68)" },
  { id: "repair", name: "和好", prompt: "我们重新走近的一次", color: "#e7ae68", glow: "rgba(231, 174, 104, 0.68)" },
  { id: "growth", name: "成长", prompt: "因为彼此发生的改变", color: "#f1d9a6", glow: "rgba(241, 217, 166, 0.72)" },
  { id: "longing", name: "想念", prompt: "不在身边时最想念什么", color: "#a8bea3", glow: "rgba(168, 190, 163, 0.68)" },
  { id: "promise", name: "约定", prompt: "我们想一起做到的事情", color: "#adc5d8", glow: "rgba(173, 197, 216, 0.68)" },
  { id: "future", name: "未来", prompt: "留给还没发生的故事", color: "#d97d79", glow: "rgba(217, 125, 121, 0.68)" },
];

const MEMORY_LAMP_DEMO = [
  { contentType: "photo", displayText: "我们的第一张合照", imageData: "assets/memory-lamp/demo-couple-memory.webp", title: "雨天第一次见面", date: "2021-06-18", author: "共同", note: "那天两个人都没有带伞，后来共用了一把。", attachment: "first-rain.jpg" },
  { contentType: "names", displayText: "阿琳 · 阿宇", imageData: "", title: "周日晚上的面", date: "2022-03-13", author: "我", note: "没有特别的安排，只是一起吃一碗热面。", attachment: "" },
  { contentType: "object", displayText: "车站出口", imageData: "", title: "谢谢你来接我", date: "2022-11-04", author: "对方", note: "我说不用来，你还是站在车站出口。", attachment: "station-voice.m4a" },
  { contentType: "phrase", displayText: "我在", imageData: "", title: "最难的时候", date: "2023-02-21", author: "我", note: "你没有替我解决，只是一直听我说完。", attachment: "" },
  { contentType: "phrase", displayText: "重新晚安", imageData: "", title: "重新说晚安", date: "2023-09-08", author: "共同", note: "我们都先承认害怕失去，而不是继续争谁对。", attachment: "" },
  { contentType: "object", displayText: "共同的钥匙", imageData: "", title: "第一次搬家", date: "2024-01-27", author: "共同", note: "纸箱很多，房间很小，但终于有了共同的钥匙。", attachment: "new-home.jpg" },
  { contentType: "emotion", displayText: "", imageData: "", title: "相隔一千公里", date: "2024-08-16", author: "对方", note: "最想念的是你关灯前会回头看我一眼。", attachment: "goodnight.m4a" },
  { contentType: "phrase", displayText: "每年看一次海", imageData: "", title: "每年看一次海", date: "2025-01-01", author: "我", note: "不要求去很远，只要每年都一起站在海边。", attachment: "" },
  { contentType: "phrase", displayText: "未完待续", imageData: "", title: "留给未来", date: "", author: "共同", note: "这一颗先不写完，等下一件值得记住的事发生。", attachment: "" },
];

const memoryBeanButtons = [...document.querySelectorAll("[data-memory-bean]")];
const memoryLampWorkbench = document.querySelector("#memory-lamp-workbench");
const memoryBeanForm = document.querySelector("#memory-bean-form");
const memoryBeanContentTypeInput = document.querySelector("#memory-bean-content-type");
const memoryBeanDisplayTextInput = document.querySelector("#memory-bean-display-text");
const memoryBeanTitleInput = document.querySelector("#memory-bean-title");
const memoryBeanDateInput = document.querySelector("#memory-bean-date");
const memoryBeanAuthorInput = document.querySelector("#memory-bean-author");
const memoryBeanNoteInput = document.querySelector("#memory-bean-note");
const memoryBeanAttachmentInput = document.querySelector("#memory-bean-attachment");
const memoryCycleModeButtons = [...document.querySelectorAll("[data-memory-cycle-mode]")];
const memoryCycleIntervalInput = document.querySelector("#memory-cycle-interval");
const memoryCycleToggleButton = document.querySelector("#memory-cycle-toggle");
const memoryCycleNextButton = document.querySelector("#memory-cycle-next");
const memoryCycleStatus = document.querySelector("#memory-cycle-status");
const memoryRunShowcaseButton = document.querySelector("#memory-run-showcase");
const memoryShowcaseLock = document.querySelector("#memory-showcase-lock");
const memoryLoadDemoButton = document.querySelector("#memory-load-demo");
const memoryClearAllButton = document.querySelector("#memory-clear-all");

function emptyMemoryLampRecords() {
  return MEMORY_BEAN_ROLES.map((role) => ({ roleId: role.id, contentType: "emotion", displayText: "", imageData: "", title: "", date: "", author: "我", note: "", attachment: "" }));
}

function loadMemoryLampRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(MEMORY_LAMP_STORAGE_KEY) || "null");
    if (!Array.isArray(saved) || saved.length !== MEMORY_BEAN_ROLES.length) return emptyMemoryLampRecords();
    return MEMORY_BEAN_ROLES.map((role, index) => ({
      roleId: role.id,
      contentType: ["emotion", "names", "photo", "object", "phrase"].includes(saved[index]?.contentType) ? saved[index].contentType : "emotion",
      displayText: typeof saved[index]?.displayText === "string" ? saved[index].displayText : "",
      imageData: typeof saved[index]?.imageData === "string" ? saved[index].imageData : "",
      title: typeof saved[index]?.title === "string" ? saved[index].title : "",
      date: typeof saved[index]?.date === "string" ? saved[index].date : "",
      author: ["我", "对方", "共同"].includes(saved[index]?.author) ? saved[index].author : "我",
      note: typeof saved[index]?.note === "string" ? saved[index].note : "",
      attachment: typeof saved[index]?.attachment === "string" ? saved[index].attachment : "",
    }));
  } catch {
    return emptyMemoryLampRecords();
  }
}

let memoryLampRecords = loadMemoryLampRecords();
let selectedMemoryBean = 0;
let presentedMemoryBean = 0;
let pendingMemoryAttachment = memoryLampRecords[0]?.attachment || "";
let pendingMemoryImageData = memoryLampRecords[0]?.imageData || "";
let memoryCycleTimer = null;
let memoryCycleRunning = false;
let memoryCyclePauseReason = "已暂停 · 手动查看";
let memoryRandomQueue = [];
let memoryCyclePhase = "reveal";
let memoryCycleEpoch = 0;
let memoryShowcaseSnapshot = null;
let memoryShowcaseEndTimer = null;
let memoryShowcaseDeadline = 0;
let memoryShowcaseSession = 0;
let memoryShowcaseRevealIndices = [];

function loadMemoryCyclePreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(MEMORY_CYCLE_PREFS_KEY) || "null");
    return {
      mode: ["sequence", "random"].includes(saved?.mode) ? saved.mode : "sequence",
      interval: MEMORY_CYCLE_INTERVALS.includes(Number(saved?.interval)) ? Number(saved.interval) : 8000,
    };
  } catch {
    return { mode: "sequence", interval: 8000 };
  }
}

const initialMemoryCyclePreferences = loadMemoryCyclePreferences();
let memoryCycleMode = initialMemoryCyclePreferences.mode;
let memoryCycleInterval = initialMemoryCyclePreferences.interval;

function memoryBeanIsFilled(record) {
  return Boolean(record && (record.title || record.note || record.displayText || record.imageData || record.attachment));
}

function memoryContentTypeLabel(type) {
  return ({ emotion: "情绪柔光", names: "名字", photo: "照片", object: "纪念物", phrase: "一句话" })[type] || "情绪柔光";
}

function updateMemoryDisplayHint() {
  const hint = document.querySelector("#memory-display-hint");
  if (!hint || !memoryBeanContentTypeInput) return;
  const messages = {
    emotion: "待机和触碰都以光色表达，不显示具体内容。",
    names: "待机时名字隐在柔光里；触碰后变清晰，几秒后退回光。",
    photo: "照片会被裁成小尺寸柔光画面；当前演示只在浏览器本地生成预览。",
    object: "可写入“红色雨伞、共同钥匙”等物品，也可以上传物品照片作为灯内画面。",
    phrase: "只显示一句很短的话，避免灯变成持续滚动的信息屏。",
  };
  hint.textContent = messages[memoryBeanContentTypeInput.value] || messages.emotion;
  if (memoryBeanDisplayTextInput) {
    const placeholders = { emotion: "无需填写", names: "例如：阿琳 · 阿宇", photo: "例如：我们的第一张合照", object: "例如：红色雨伞", phrase: "例如：我在 / 未完待续" };
    memoryBeanDisplayTextInput.placeholder = placeholders[memoryBeanContentTypeInput.value] || "";
    memoryBeanDisplayTextInput.disabled = memoryBeanContentTypeInput.value === "emotion";
  }
}

function persistMemoryLampRecords() {
  try {
    localStorage.setItem(MEMORY_LAMP_STORAGE_KEY, JSON.stringify(memoryLampRecords));
    return true;
  } catch {
    return false;
  }
}

function setMemoryLampStatus(message) {
  const status = document.querySelector("#memory-bean-status");
  if (status) status.textContent = message;
}

function getFilledMemoryBeanIndices() {
  return memoryLampRecords.reduce((indices, record, index) => {
    if (memoryBeanIsFilled(record)) indices.push(index);
    return indices;
  }, []);
}

function refreshMemoryShowcaseRevealIndices(preferredCount = null) {
  if (!isMemoryShowcaseActive()) {
    memoryShowcaseRevealIndices = [];
    return;
  }
  const filled = getFilledMemoryBeanIndices();
  if (!filled.length) {
    memoryShowcaseRevealIndices = [];
    return;
  }
  const others = filled.filter((index) => index !== presentedMemoryBean);
  for (let index = others.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [others[index], others[swapIndex]] = [others[swapIndex], others[index]];
  }
  const revealCount = Math.min(filled.length, preferredCount ?? (1 + Math.floor(Math.random() * 3)));
  memoryShowcaseRevealIndices = [presentedMemoryBean, ...others.slice(0, Math.max(0, revealCount - 1))];
}

function isMemoryShowcaseActive() {
  return memoryShowcaseSnapshot !== null;
}

function cloneMemoryRecords(records) {
  return records.map((record) => ({ ...record }));
}

function readMemoryLampStorage() {
  try {
    return { available: true, value: localStorage.getItem(MEMORY_LAMP_STORAGE_KEY) };
  } catch {
    return { available: false, value: null };
  }
}

function setMemoryShowcaseFormLock(active, snapshot = memoryShowcaseSnapshot) {
  if (!memoryBeanForm) return;
  const controls = [...memoryBeanForm.querySelectorAll("input, select, textarea, button")];
  if (active && snapshot) {
    snapshot.formControlStates = controls.map((control) => ({ control, disabled: control.disabled }));
    controls.forEach((control) => { control.disabled = true; });
    memoryBeanForm.dataset.showcaseActive = "true";
    memoryBeanForm.setAttribute("aria-disabled", "true");
    if (memoryShowcaseLock) memoryShowcaseLock.hidden = false;
    return;
  }
  (snapshot?.formControlStates || []).forEach(({ control, disabled }) => {
    if (control?.isConnected) control.disabled = disabled;
  });
  memoryBeanForm.dataset.showcaseActive = "false";
  memoryBeanForm.removeAttribute("aria-disabled");
  if (memoryShowcaseLock) memoryShowcaseLock.hidden = true;
}

function persistMemoryCyclePreferences() {
  try {
    localStorage.setItem(MEMORY_CYCLE_PREFS_KEY, JSON.stringify({ mode: memoryCycleMode, interval: memoryCycleInterval }));
  } catch {
    // The lamp remains usable when browser storage is unavailable.
  }
}

function clearMemoryCycleTimer() {
  memoryCycleEpoch += 1;
  if (memoryCycleTimer !== null) window.clearTimeout(memoryCycleTimer);
  memoryCycleTimer = null;
}

function resetMemoryRandomQueue() {
  const queue = [...getFilledMemoryBeanIndices()];
  for (let index = queue.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [queue[index], queue[swapIndex]] = [queue[swapIndex], queue[index]];
  }
  if (queue.length > 1 && queue[0] === presentedMemoryBean) queue.push(queue.shift());
  memoryRandomQueue = queue;
}

function getNextPresentedMemoryBean() {
  const filled = getFilledMemoryBeanIndices();
  if (filled.length < 2) return filled[0] ?? selectedMemoryBean;

  if (memoryCycleMode === "sequence") {
    const currentPosition = filled.indexOf(presentedMemoryBean);
    return filled[(currentPosition + 1 + filled.length) % filled.length];
  }

  memoryRandomQueue = memoryRandomQueue.filter((index) => filled.includes(index));
  if (!memoryRandomQueue.length) resetMemoryRandomQueue();
  if (memoryRandomQueue.length > 1 && memoryRandomQueue[0] === presentedMemoryBean) memoryRandomQueue.push(memoryRandomQueue.shift());
  return memoryRandomQueue.shift() ?? filled.find((index) => index !== presentedMemoryBean) ?? filled[0];
}

function renderMemoryCycleControls() {
  const filledCount = getFilledMemoryBeanIndices().length;
  const canCycle = filledCount >= 2;
  const showcaseActive = isMemoryShowcaseActive();
  const modeLabel = memoryCycleMode === "random" ? "随机播放" : "顺序播放";
  const seconds = Math.round(memoryCycleInterval / 1000);

  if (memoryLampWorkbench) {
    memoryLampWorkbench.dataset.cycleState = memoryCycleRunning ? "running" : "paused";
    memoryLampWorkbench.dataset.showcaseState = showcaseActive ? "running" : "idle";
  }
  memoryCycleModeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.memoryCycleMode === memoryCycleMode));
    button.disabled = showcaseActive;
  });
  if (memoryCycleIntervalInput) {
    memoryCycleIntervalInput.value = String(memoryCycleInterval);
    memoryCycleIntervalInput.disabled = showcaseActive;
  }
  if (memoryCycleToggleButton) {
    memoryCycleToggleButton.disabled = !canCycle || showcaseActive;
    memoryCycleToggleButton.setAttribute("aria-pressed", String(memoryCycleRunning));
    memoryCycleToggleButton.textContent = memoryCycleRunning ? "暂停循环" : "开始循环";
  }
  if (memoryCycleNextButton) memoryCycleNextButton.disabled = !canCycle;
  if (memoryRunShowcaseButton) {
    memoryRunShowcaseButton.setAttribute("aria-pressed", String(showcaseActive));
    memoryRunShowcaseButton.textContent = showcaseActive ? "结束演示并恢复" : "直接演示 Nine 30 秒";
  }
  if (memoryLoadDemoButton) memoryLoadDemoButton.disabled = showcaseActive;
  if (memoryClearAllButton) memoryClearAllButton.disabled = showcaseActive;
  if (memoryCycleStatus) {
    if (showcaseActive) memoryCycleStatus.textContent = "Nine 30 秒错峰演示中 · 结束后自动恢复你的内容";
    else if (!canCycle) memoryCycleStatus.textContent = "至少写入两颗记忆后可循环";
    else if (memoryCycleRunning && document.hidden) memoryCycleStatus.textContent = "页面隐藏 · 自动停表";
    else if (memoryCycleRunning) memoryCycleStatus.textContent = `${modeLabel}中 · ${seconds} 秒一段`;
    else memoryCycleStatus.textContent = memoryCyclePauseReason;
  }
}

function renderMemoryPresentation(announce = false) {
  if (!memoryLampWorkbench) return;

  memoryLampWorkbench.dataset.cyclePhase = memoryCyclePhase;

  memoryBeanButtons.forEach((button, index) => {
    const record = memoryLampRecords[index];
    const role = MEMORY_BEAN_ROLES[index];
    const filled = memoryBeanIsFilled(record);
    const isPresenting = index === presentedMemoryBean;
    const isShowcaseRevealed = isMemoryShowcaseActive() && memoryShowcaseRevealIndices.includes(index);
    const isRevealed = filled && memoryCyclePhase === "reveal" && (isPresenting || isShowcaseRevealed);
    button.dataset.previewing = String(isPresenting);
    button.dataset.showcaseRevealed = String(isShowcaseRevealed && !isPresenting);
    button.dataset.revealState = isRevealed ? "revealed" : "glow";
    button.dataset.hasImage = String(Boolean(record?.imageData) && ["photo", "object"].includes(record?.contentType));
    if (isPresenting) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
    if (!filled) button.setAttribute("aria-label", `${role.name}：尚未写入，触碰后可编辑`);
    else if (isRevealed && record.contentType === "emotion") button.setAttribute("aria-label", `${role.name}：情绪柔光正在亮起`);
    else if (isRevealed) button.setAttribute("aria-label", `${role.name}：正在显影，${record.title || "已写入记忆"}`);
    else if (isPresenting) button.setAttribute("aria-label", `${role.name}：已写入，当前正在退回柔光`);
    else button.setAttribute("aria-label", `${role.name}：已写入，触碰查看`);
  });

  const role = MEMORY_BEAN_ROLES[presentedMemoryBean];
  const record = memoryLampRecords[presentedMemoryBean];
  const stateContainer = document.querySelector(".memory-lamp-state");
  const stateTitle = document.querySelector("#memory-lamp-state-title");
  const stateNote = document.querySelector("#memory-lamp-state-note");
  const phaseLabel = document.querySelector("#memory-cycle-phase-label");
  if (stateContainer) stateContainer.setAttribute("aria-live", announce ? "polite" : "off");
  if (phaseLabel) {
    if (!memoryCycleRunning) phaseLabel.textContent = "手动查看";
    else if (memoryCyclePhase === "glow") phaseLabel.textContent = "柔光停顿";
    else if (isMemoryShowcaseActive()) phaseLabel.textContent = `${Math.max(1, memoryShowcaseRevealIndices.length)} 窗显影`;
    else phaseLabel.textContent = "记忆显影";
  }
  if (memoryBeanIsFilled(record) && memoryCycleRunning && memoryCyclePhase === "glow") {
    if (stateTitle) stateTitle.textContent = `${role.name} · 退回柔光`;
    if (stateNote) stateNote.textContent = "刚刚的记忆正在融回灯光里，下一颗豆即将醒来。";
  } else if (memoryBeanIsFilled(record) && record.contentType === "emotion") {
    if (stateTitle) stateTitle.textContent = `${role.name} · 情绪柔光`;
    if (stateNote) stateNote.textContent = "这颗记忆只用光色表达，不在灯面显示具体内容。";
  } else if (memoryBeanIsFilled(record)) {
    if (stateTitle) stateTitle.textContent = `${role.name} · ${record.title || "已写入记忆"}`;
    if (stateNote) {
      const dateText = record.date ? `在 ${record.date}` : "";
      const attachmentText = record.attachment ? ` · 附件 ${record.attachment}` : "";
      const displayText = record.contentType === "emotion" ? "情绪柔光" : `${memoryContentTypeLabel(record.contentType)}“${record.displayText || record.title}”`;
      stateNote.textContent = `${record.author}${dateText}写下：${record.note || "这颗豆保存了一份附件"} · 灯内呈现为${displayText}${attachmentText}`;
    }
  } else {
    if (stateTitle) stateTitle.textContent = `${role.name}还没有记忆。`;
    if (stateNote) stateNote.textContent = role.prompt;
  }
}

function renderMemoryLamp({ syncForm = true, announcePresentation = false } = {}) {
  if (!memoryLampWorkbench) return;

  const filledCount = memoryLampRecords.filter(memoryBeanIsFilled).length;
  memoryLampWorkbench.dataset.filledCount = String(filledCount);
  memoryLampWorkbench.dataset.complete = String(filledCount === MEMORY_BEAN_ROLES.length);

  const count = document.querySelector("#memory-lamp-count");
  if (count) count.textContent = `${filledCount} / ${MEMORY_BEAN_ROLES.length}`;

  memoryBeanButtons.forEach((button, index) => {
    const role = MEMORY_BEAN_ROLES[index];
    const record = memoryLampRecords[index];
    const selected = index === selectedMemoryBean;
    const filled = memoryBeanIsFilled(record);
    button.setAttribute("aria-pressed", String(selected));
    button.dataset.filled = String(filled);
    button.dataset.contentType = record.contentType;
    button.style.setProperty("--bean-color", role.color);
    button.style.setProperty("--bean-glow", role.glow);
    button.style.setProperty("--memory-photo", record.imageData ? `url("${record.imageData}")` : "none");
    button.title = filled ? `${role.name}：已写入，触碰查看` : `${role.name}：等待写入`;
    const state = button.querySelector("small");
    if (state) state.textContent = filled ? (record.title || "已写入") : "等待写入";
    const display = button.querySelector("em");
    if (display) {
      if (!filled) display.textContent = "柔光";
      else if (record.contentType === "photo") display.textContent = record.displayText || "两人照片";
      else if (record.contentType === "emotion") display.textContent = "情绪柔光";
      else display.textContent = record.displayText || memoryContentTypeLabel(record.contentType);
    }
  });

  const role = MEMORY_BEAN_ROLES[selectedMemoryBean];
  const record = memoryLampRecords[selectedMemoryBean];
  const number = document.querySelector("#memory-bean-number");
  const roleName = document.querySelector("#memory-bean-role");
  const color = document.querySelector("#memory-bean-color");
  if (number) number.textContent = `MEMORY BEAN ${String(selectedMemoryBean + 1).padStart(2, "0")}`;
  if (roleName) roleName.textContent = `${role.name} · ${role.prompt}`;
  if (color) {
    color.style.setProperty("--bean-color", role.color);
    color.style.setProperty("--bean-glow", role.glow);
  }

  if (syncForm) {
    if (memoryBeanContentTypeInput) memoryBeanContentTypeInput.value = record.contentType;
    if (memoryBeanDisplayTextInput) memoryBeanDisplayTextInput.value = record.displayText;
    if (memoryBeanTitleInput) memoryBeanTitleInput.value = record.title;
    if (memoryBeanDateInput) memoryBeanDateInput.value = record.date;
    if (memoryBeanAuthorInput) memoryBeanAuthorInput.value = record.author;
    if (memoryBeanNoteInput) memoryBeanNoteInput.value = record.note;
    if (memoryBeanAttachmentInput) memoryBeanAttachmentInput.value = "";
    pendingMemoryAttachment = record.attachment;
    pendingMemoryImageData = record.imageData;
    updateMemoryDisplayHint();

    const attachmentName = document.querySelector("#memory-bean-attachment-name");
    if (attachmentName) attachmentName.textContent = record.attachment ? `已记录：${record.attachment}（文件未上传）` : "文件不会上传，只记录名称";
  }

  renderMemoryPresentation(announcePresentation);
  renderMemoryCycleControls();
}

function pauseMemoryCycle(reason = "已暂停 · 手动查看") {
  memoryCycleRunning = false;
  memoryCyclePauseReason = reason;
  memoryCyclePhase = "reveal";
  clearMemoryCycleTimer();
  const stateContainer = document.querySelector(".memory-lamp-state");
  if (stateContainer) stateContainer.setAttribute("aria-live", "polite");
  renderMemoryPresentation(false);
  renderMemoryCycleControls();
}

function scheduleMemoryCycle() {
  clearMemoryCycleTimer();
  if (!memoryCycleRunning || document.hidden) return;
  const epoch = memoryCycleEpoch;
  const glowGap = Math.min(1800, Math.max(900, Math.round(memoryCycleInterval * 0.18)));
  const delay = memoryCyclePhase === "reveal" ? memoryCycleInterval - glowGap : glowGap;
  memoryCycleTimer = window.setTimeout(() => {
    memoryCycleTimer = null;
    if (epoch !== memoryCycleEpoch || !memoryCycleRunning || document.hidden) return;
    if (memoryCyclePhase === "reveal") memoryCyclePhase = "glow";
    else {
      presentedMemoryBean = getNextPresentedMemoryBean();
      memoryCyclePhase = "reveal";
      refreshMemoryShowcaseRevealIndices();
    }
    renderMemoryPresentation(false);
    scheduleMemoryCycle();
  }, delay);
}

function advanceMemoryCycle(announce = false) {
  if (getFilledMemoryBeanIndices().length < 2) {
    pauseMemoryCycle("至少写入两颗记忆后可循环");
    return false;
  }
  presentedMemoryBean = getNextPresentedMemoryBean();
  memoryCyclePhase = "reveal";
  refreshMemoryShowcaseRevealIndices();
  renderMemoryPresentation(announce);
  return true;
}

function startMemoryCycle() {
  const filled = getFilledMemoryBeanIndices();
  if (filled.length < 2) {
    memoryCyclePauseReason = "至少写入两颗记忆后可循环";
    renderMemoryCycleControls();
    return;
  }
  if (!filled.includes(presentedMemoryBean)) presentedMemoryBean = filled[0];
  memoryCycleRunning = true;
  memoryCyclePhase = "reveal";
  memoryCyclePauseReason = "已暂停 · 手动查看";
  resetMemoryRandomQueue();
  renderMemoryPresentation(true);
  renderMemoryCycleControls();
  scheduleMemoryCycle();
}

function clearMemoryShowcaseEndTimer() {
  if (memoryShowcaseEndTimer !== null) window.clearTimeout(memoryShowcaseEndTimer);
  memoryShowcaseEndTimer = null;
}

function scheduleMemoryShowcaseEnd(session) {
  clearMemoryShowcaseEndTimer();
  const delay = Math.max(0, memoryShowcaseDeadline - Date.now());
  memoryShowcaseEndTimer = window.setTimeout(() => {
    memoryShowcaseEndTimer = null;
    if (session !== memoryShowcaseSession || !isMemoryShowcaseActive()) return;
    endMemoryShowcase("timeout");
  }, delay);
}

function startMemoryShowcase() {
  if (isMemoryShowcaseActive()) return;

  const storage = readMemoryLampStorage();
  memoryShowcaseSnapshot = {
    records: cloneMemoryRecords(memoryLampRecords),
    selectedMemoryBean,
    presentedMemoryBean,
    cycleRunning: memoryCycleRunning,
    cyclePauseReason: memoryCyclePauseReason,
    cycleMode: memoryCycleMode,
    cycleInterval: memoryCycleInterval,
    cyclePhase: memoryCyclePhase,
    randomQueue: [...memoryRandomQueue],
    storage,
    focusElement: document.activeElement,
    formControlStates: [],
  };

  const session = memoryShowcaseSession + 1;
  memoryShowcaseSession = session;
  clearMemoryCycleTimer();
  clearMemoryShowcaseEndTimer();
  memoryShowcaseDeadline = Date.now() + MEMORY_SHOWCASE_DURATION;
  memoryLampRecords = MEMORY_BEAN_ROLES.map((role, index) => ({ roleId: role.id, ...MEMORY_LAMP_DEMO[index] }));
  presentedMemoryBean = 0;
  memoryCycleMode = "random";
  memoryCycleInterval = MEMORY_SHOWCASE_INTERVAL;
  memoryCyclePhase = "reveal";
  memoryCycleRunning = true;
  memoryCyclePauseReason = "演示中 · 不会保存临时示例";
  memoryRandomQueue = [];
  resetMemoryRandomQueue();
  refreshMemoryShowcaseRevealIndices(3);
  setMemoryShowcaseFormLock(true);
  renderMemoryLamp({ syncForm: false, announcePresentation: true });
  scheduleMemoryCycle();
  scheduleMemoryShowcaseEnd(session);
}

function endMemoryShowcase(reason = "manual") {
  if (!isMemoryShowcaseActive()) return;

  const snapshot = memoryShowcaseSnapshot;
  memoryShowcaseSession += 1;
  clearMemoryCycleTimer();
  clearMemoryShowcaseEndTimer();
  memoryShowcaseDeadline = 0;

  const currentStorage = readMemoryLampStorage();
  const storageChangedElsewhere = snapshot.storage.available && currentStorage.available && snapshot.storage.value !== currentStorage.value;
  memoryLampRecords = storageChangedElsewhere ? loadMemoryLampRecords() : cloneMemoryRecords(snapshot.records);
  selectedMemoryBean = snapshot.selectedMemoryBean;
  presentedMemoryBean = snapshot.presentedMemoryBean;
  memoryCycleMode = snapshot.cycleMode;
  memoryCycleInterval = snapshot.cycleInterval;
  memoryCyclePhase = snapshot.cyclePhase;
  memoryCycleRunning = snapshot.cycleRunning;
  memoryCyclePauseReason = snapshot.cyclePauseReason;
  memoryRandomQueue = [...snapshot.randomQueue];
  memoryShowcaseRevealIndices = [];
  setMemoryShowcaseFormLock(false, snapshot);
  memoryShowcaseSnapshot = null;
  if (storageChangedElsewhere) {
    const filled = getFilledMemoryBeanIndices();
    if (memoryCycleRunning && !filled.includes(presentedMemoryBean)) {
      presentedMemoryBean = filled[0] ?? selectedMemoryBean;
      memoryCyclePhase = "reveal";
    }
    if (memoryCycleRunning && filled.length < 2) {
      memoryCycleRunning = false;
      memoryCyclePhase = "reveal";
      memoryCyclePauseReason = "内容不足 · 自动循环已暂停";
    }
  }
  renderMemoryLamp({ syncForm: false, announcePresentation: true });
  if (memoryCycleRunning) scheduleMemoryCycle();
  const message = reason === "timeout" ? "30 秒演示结束，已恢复你的原有内容" : "演示已结束，已恢复你的原有内容";
  setMemoryLampStatus(message);
  const activeElement = document.activeElement;
  const activeIsBody = !activeElement || activeElement === document.body;
  const activeWasLocked = snapshot.formControlStates.some(({ control }) => control === activeElement);
  const activeIsShowcaseButton = activeElement === memoryRunShowcaseButton;
  if (!document.hidden && (activeIsBody || activeWasLocked || activeIsShowcaseButton) && snapshot.focusElement?.isConnected && typeof snapshot.focusElement.focus === "function") {
    snapshot.focusElement.focus();
  }
}

function reconcileMemoryCycleAfterRecordsChange() {
  const filled = getFilledMemoryBeanIndices();
  memoryRandomQueue = [];
  if (memoryCycleRunning && !filled.includes(presentedMemoryBean)) {
    presentedMemoryBean = filled[0] ?? selectedMemoryBean;
    memoryCyclePhase = "reveal";
  }
  if (filled.length < 2 && memoryCycleRunning) pauseMemoryCycle("内容不足 · 自动循环已暂停");
  else if (!memoryCycleRunning && filled.length >= 2 && /至少写入|内容不足/.test(memoryCyclePauseReason)) memoryCyclePauseReason = "已暂停 · 可以开始循环";
  else if (memoryCycleRunning) scheduleMemoryCycle();
}

function selectMemoryBean(index, focus = false) {
  if (!MEMORY_BEAN_ROLES[index]) return;
  if (isMemoryShowcaseActive()) {
    presentedMemoryBean = index;
    memoryCyclePhase = "reveal";
    resetMemoryRandomQueue();
    refreshMemoryShowcaseRevealIndices();
    renderMemoryPresentation(true);
    scheduleMemoryCycle();
    if (focus) memoryBeanButtons[index]?.focus();
    return;
  }
  pauseMemoryCycle(`已暂停 · 正在手动查看“${MEMORY_BEAN_ROLES[index].name}”`);
  selectedMemoryBean = index;
  presentedMemoryBean = index;
  memoryCyclePhase = "reveal";
  renderMemoryLamp({ announcePresentation: true });
  if (focus) memoryBeanButtons[index]?.focus();
}

memoryBeanButtons.forEach((button, index) => {
  button.addEventListener("click", () => selectMemoryBean(index));
  button.addEventListener("keydown", (event) => {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = Math.min(8, index + 1);
    if (event.key === "ArrowLeft") nextIndex = Math.max(0, index - 1);
    if (event.key === "ArrowDown") nextIndex = Math.min(8, index + 3);
    if (event.key === "ArrowUp") nextIndex = Math.max(0, index - 3);
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = 8;
    selectMemoryBean(nextIndex, true);
  });
});

memoryCycleModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isMemoryShowcaseActive()) return;
    const nextMode = button.dataset.memoryCycleMode;
    if (!["sequence", "random"].includes(nextMode)) return;
    memoryCycleMode = nextMode;
    memoryRandomQueue = [];
    persistMemoryCyclePreferences();
    renderMemoryCycleControls();
    if (memoryCycleRunning) scheduleMemoryCycle();
  });
});

memoryCycleIntervalInput?.addEventListener("change", () => {
  if (isMemoryShowcaseActive()) return;
  const nextInterval = Number(memoryCycleIntervalInput.value);
  memoryCycleInterval = MEMORY_CYCLE_INTERVALS.includes(nextInterval) ? nextInterval : 8000;
  persistMemoryCyclePreferences();
  renderMemoryCycleControls();
  if (memoryCycleRunning) scheduleMemoryCycle();
});

memoryCycleToggleButton?.addEventListener("click", () => {
  if (isMemoryShowcaseActive()) return;
  if (memoryCycleRunning) pauseMemoryCycle("已暂停 · 保留当前灯语");
  else startMemoryCycle();
});

memoryCycleNextButton?.addEventListener("click", () => {
  if (!advanceMemoryCycle(true)) return;
  if (memoryCycleRunning) scheduleMemoryCycle();
});

memoryRunShowcaseButton?.addEventListener("click", () => {
  if (isMemoryShowcaseActive()) endMemoryShowcase("manual");
  else startMemoryShowcase();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) clearMemoryCycleTimer();
  else if (isMemoryShowcaseActive() && Date.now() >= memoryShowcaseDeadline) {
    endMemoryShowcase("timeout");
    return;
  } else if (memoryCycleRunning) scheduleMemoryCycle();
  renderMemoryCycleControls();
});

function createMemoryImagePreview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read-failed"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("decode-failed"));
      image.onload = () => {
        const maxEdge = 360;
        const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("canvas-failed"));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

memoryBeanContentTypeInput?.addEventListener("change", updateMemoryDisplayHint);

memoryBeanAttachmentInput?.addEventListener("change", async () => {
  const file = memoryBeanAttachmentInput.files?.[0];
  pendingMemoryAttachment = file?.name || memoryLampRecords[selectedMemoryBean].attachment || "";
  const attachmentName = document.querySelector("#memory-bean-attachment-name");
  if (file?.type.startsWith("image/")) {
    if (attachmentName) attachmentName.textContent = `正在生成 ${file.name} 的本地灯内预览…`;
    try {
      pendingMemoryImageData = await createMemoryImagePreview(file);
      if (memoryBeanContentTypeInput && memoryBeanContentTypeInput.value === "emotion") memoryBeanContentTypeInput.value = "photo";
      updateMemoryDisplayHint();
      if (attachmentName) attachmentName.textContent = `已生成：${file.name}（照片未上传）`;
    } catch {
      if (attachmentName) attachmentName.textContent = `无法读取 ${file.name}，仅记录文件名`;
    }
  } else if (attachmentName) {
    attachmentName.textContent = pendingMemoryAttachment ? `将记录：${pendingMemoryAttachment}（文件不会上传）` : "文件不会上传，只记录名称";
  }
});

memoryBeanForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (isMemoryShowcaseActive()) return;
  memoryLampRecords[selectedMemoryBean] = {
    roleId: MEMORY_BEAN_ROLES[selectedMemoryBean].id,
    contentType: memoryBeanContentTypeInput?.value || "emotion",
    displayText: memoryBeanDisplayTextInput?.value.trim() || "",
    imageData: pendingMemoryImageData,
    title: memoryBeanTitleInput?.value.trim() || "",
    date: memoryBeanDateInput?.value || "",
    author: memoryBeanAuthorInput?.value || "我",
    note: memoryBeanNoteInput?.value.trim() || "",
    attachment: pendingMemoryAttachment,
  };
  const saved = persistMemoryLampRecords();
  reconcileMemoryCycleAfterRecordsChange();
  renderMemoryLamp();
  setMemoryLampStatus(saved ? `已写入第 ${selectedMemoryBean + 1} 颗“${MEMORY_BEAN_ROLES[selectedMemoryBean].name}”豆` : "浏览器拒绝本地保存，但当前页面状态已更新");
});

document.querySelector("#memory-clear-current")?.addEventListener("click", () => {
  if (isMemoryShowcaseActive()) return;
  memoryLampRecords[selectedMemoryBean] = emptyMemoryLampRecords()[selectedMemoryBean];
  persistMemoryLampRecords();
  reconcileMemoryCycleAfterRecordsChange();
  renderMemoryLamp();
  setMemoryLampStatus(`已清空第 ${selectedMemoryBean + 1} 颗“${MEMORY_BEAN_ROLES[selectedMemoryBean].name}”豆`);
});

memoryLoadDemoButton?.addEventListener("click", () => {
  if (isMemoryShowcaseActive()) return;
  memoryLampRecords = MEMORY_BEAN_ROLES.map((role, index) => ({ roleId: role.id, ...MEMORY_LAMP_DEMO[index] }));
  persistMemoryLampRecords();
  reconcileMemoryCycleAfterRecordsChange();
  renderMemoryLamp();
  setMemoryLampStatus("已载入两个人的九颗示例记忆，关系灯完整点亮");
});

memoryClearAllButton?.addEventListener("click", () => {
  if (isMemoryShowcaseActive()) return;
  if (!window.confirm("确定清空当前浏览器里保存的九颗记忆吗？")) return;
  pauseMemoryCycle("已暂停 · 记忆已清空");
  memoryLampRecords = emptyMemoryLampRecords();
  selectedMemoryBean = 0;
  presentedMemoryBean = 0;
  memoryRandomQueue = [];
  try {
    localStorage.removeItem(MEMORY_LAMP_STORAGE_KEY);
  } catch {
    // The in-memory clear still succeeds when browser storage is unavailable.
  }
  renderMemoryLamp();
  setMemoryLampStatus("九颗记忆已全部清空");
});

renderMemoryLamp();

if (new URLSearchParams(window.location.search).get("demo") === "emotion") {
  window.requestAnimationFrame(() => startMemoryShowcase());
}

const DEMAND_TARGETS = {
  "memory-gift": {
    priority: "P0 · 最接近当前能力",
    window: "7–21 天明确送礼期限",
    kicker: "TARGET 01 · MEMORY MOSAIC GIFT",
    title: "记忆马赛克礼物",
    promise: "帮一个已经决定要送礼的人，把最有意义的一张照片，做成不像通用照片周边的实体纪念物。",
    job: "“纪念日快到了。我有照片，也知道要送给谁，但不想再送相框、杯子或模板化定制。”",
    alternative: "定制照片墙、数字油画、积木画、拼豆代做和个性化礼盒。",
    delivery: "上传照片后给出三版可编辑预览，确认后交付装框成品或完整材料包。",
    trigger: "收礼人、纪念日和交付日期都明确；决策不是“要不要”，而是“送什么更像他”。",
    gap: "Pindo 还缺图纸精修、可制造 BOM、订单报价、打样与履约伙伴。",
    validation: "先获得 20 个非熟人付费订单；预览到订金转化 ≥ 15%，准时交付 ≥ 95%，成品“像本人”评分 ≥ 4/5。门槛是测试目标，不是现有业绩。",
    evidence: "Etsy 的 2025 趋势报告基于平台搜索与销售数据，把个性化、感性礼物列为主要购买驱动。它证明类目存在，不证明用户会买 Pindo。",
    source: "https://www.etsy.com/ca/seller-handbook/article/1417223353768",
    sourceLabel: "Etsy 2025 趋势数据 ↗",
    image: "assets/product-lines/emotional-gift.webp",
    imageAlt: "由有意义照片生成的实体像素纪念画与礼盒概念效果图",
    caption: "一张有意义的照片，变成可以送出的实体作品",
    steps: [
      ["上传照片与送礼日期", "先判断题材和交付风险"],
      ["生成三版可编辑预览", "用户确认脸、轮廓与色板"],
      ["支付订金再精修", "用真金白银筛掉伪需求"],
      ["成品 / 材料包按时交付", "记录满意度与转介绍"],
    ],
  },
  "memory-reuse": {
    priority: "P1 · 需求强，交付较重",
    window: "整理旧物、毕业、纪念与告别",
    kicker: "TARGET 02 · MEMORY REUSE SERVICE",
    title: "旧物记忆再生",
    promise: "把舍不得穿、又一直占着衣柜的旧衣，变成每天能够看见和使用的记忆作品。",
    job: "“这些衣服我不会再穿，但每一件都有故事。直接扔掉舍不得，继续收着又没有意义。”",
    alternative: "收纳箱、旧衣纪念被、记忆熊、布艺拼贴、捐赠或长期闲置。",
    delivery: "用户寄送旧衣或先上传照片，Pindo 辅助规划色块与构图，人工确认后交付布艺挂画、靠垫或小型纪念毯。",
    trigger: "搬家、断舍离、毕业、亲人或宠物纪念会把“以后再处理”变成必须做的决定。",
    gap: "需要布料识别、材料约束、人工排版、不可逆裁剪确认和稳定的纺织制作伙伴。",
    validation: "先以礼宾服务完成 10 个付费订单；寄送到下单转化 ≥ 50%，返工 ≤ 10%，用户愿意推荐 ≥ 70%。先验证服务，不先开发平台。",
    evidence: "Project Repat 官方称超过 50 万客户使用旧 T 恤纪念被服务，并持续出现毕业、旅行、亲人纪念等付费场景。",
    source: "https://www.projectrepat.com/pages/reviews",
    sourceLabel: "Project Repat 客户证据 ↗",
    image: "assets/emotion-products/memory-reuse.webp",
    imageAlt: "旧衣布片被重新组合成家庭纪念织物作品的概念效果图",
    caption: "旧衣不是材料包，而是一段不愿意丢掉的生活",
    steps: [
      ["先传照片做可行性评估", "不合适的面料先说清"],
      ["选择必须保留的图案", "用户锁定不可替代记忆"],
      ["确认构图再寄送旧物", "不可逆裁剪前二次确认"],
      ["人工制作并返还余料", "建立信任与可追溯交付"],
    ],
  },
  together: {
    priority: "P1 · 先验证共同写入",
    window: "异地伴侣、亲子与跨城家人",
    kicker: "TARGET 03 · PINDO NINE MEMORY LAMP",
    title: "九豆记忆灯",
    promise: "两个人共同写满相遇、日常、感谢、支持、和好、成长、想念、约定和未来，九颗记忆最后组成一盏关系灯。",
    job: "“我们都很忙，不想把联系变成打卡，但希望每天有一个很轻的方式知道对方想起了我。”",
    alternative: "聊天置顶、早晚安消息、共享相册、情侣 App、触碰手环和联网留言盒。",
    delivery: "先用网页验证九种关系角色和共同写入，再制作一块底板、九颗可寻址 LED 与九个被动柔光豆的单灯原型。",
    trigger: "异地开始、周年纪念、共同搬家或家庭成员跨城，会形成一起写满九颗的明确理由。",
    gap: "需要配对、隐私、触摸映射、本地存储、删除权和硬件可靠性；第一版不应给九颗豆分别塞入完整电子系统。",
    validation: "招募 30 对真实关系用户；邀请后共同写入 ≥ 60%，两周内写满 5 颗以上 ≥ 35%，愿意为实体灯支付订金 ≥ 10%。达标后再做联网硬件。",
    evidence: "Lovebox 官方称联网留言盒已售出 35 万台以上，说明低打扰表达存在付费需求；Pindo 的共同拼图形式仍需独立验证。",
    source: "https://buy.lovebox.love/",
    sourceLabel: "Lovebox 官方成交信号 ↗",
    image: "assets/memory-lamp/nine-memory-lamp-content.webp",
    imageAlt: "九颗可写入记忆的柔光豆拼成一盏关系灯的概念效果图",
    caption: "九颗豆是九把记忆钥匙，底座负责存储、触摸与灯光",
    steps: [
      ["邀请一个具体的人", "建立一对一关系空间"],
      ["共同写入九种记忆", "每颗只回答一个关系问题"],
      ["记忆映射为九种光", "触碰豆即可回看对应内容"],
      ["为实体灯支付订金", "用购买决定是否进入硬件"],
    ],
  },
};

const demandTargetTabs = [...document.querySelectorAll("[data-demand-target]")];
const demandTargetPanel = document.querySelector("#demand-target-panel");

function setDemandTargetText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderDemandTarget(targetId) {
  const target = DEMAND_TARGETS[targetId];
  if (!target || !demandTargetPanel) return;

  demandTargetPanel.dataset.activeDemandTarget = targetId;
  demandTargetTabs.forEach((tab) => {
    const selected = tab.dataset.demandTarget === targetId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) demandTargetPanel.setAttribute("aria-labelledby", tab.id);
  });

  setDemandTargetText("#demand-target-priority", target.priority);
  setDemandTargetText("#demand-target-window", target.window);
  setDemandTargetText("#demand-target-kicker", target.kicker);
  setDemandTargetText("#demand-target-title", target.title);
  setDemandTargetText("#demand-target-promise", target.promise);
  setDemandTargetText("#demand-target-job", target.job);
  setDemandTargetText("#demand-target-alternative", target.alternative);
  setDemandTargetText("#demand-target-delivery", target.delivery);
  setDemandTargetText("#demand-target-trigger", target.trigger);
  setDemandTargetText("#demand-target-gap", target.gap);
  setDemandTargetText("#demand-target-validation", target.validation);
  setDemandTargetText("#demand-target-evidence", target.evidence);
  setDemandTargetText("#demand-target-caption", target.caption);

  const image = document.querySelector("#demand-target-image");
  if (image) {
    image.src = target.image;
    image.alt = target.imageAlt;
  }

  const source = document.querySelector("#demand-target-source");
  if (source) {
    source.href = target.source;
    source.textContent = target.sourceLabel;
  }

  const flow = document.querySelector("#demand-mvp-flow");
  if (flow) {
    flow.replaceChildren(
      ...target.steps.map(([title, note], index) => {
        const item = document.createElement("li");
        const number = document.createElement("span");
        const strong = document.createElement("strong");
        const small = document.createElement("small");
        number.textContent = String(index + 1).padStart(2, "0");
        strong.textContent = title;
        small.textContent = note;
        item.append(number, strong, small);
        return item;
      }),
    );
  }
}

demandTargetTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderDemandTarget(tab.dataset.demandTarget));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % demandTargetTabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) nextIndex = (index - 1 + demandTargetTabs.length) % demandTargetTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = demandTargetTabs.length - 1;

    const nextTab = demandTargetTabs[nextIndex];
    renderDemandTarget(nextTab.dataset.demandTarget);
    nextTab.focus();
  });
});

renderDemandTarget("memory-gift");

const LIFE_PRODUCT_LINES = {
  ritual: {
    priority: "P3 · 留存假设",
    format: "成品硬件 + 主题订阅",
    kicker: "PRODUCT LINE 01 · RITUAL",
    title: "Pindo Ritual · 日常仪式",
    promise: "把一天的开始和结束，变成看得见的温柔动作。",
    personality: "温暖、克制、不催促；像一件会回应人的家具，而不是新的打卡器。",
    value: "用几秒钟的动作帮助用户感知状态、完成切换，并让长期变化自然留下痕迹。",
    scene: "晨起选色、下班归家、睡前放松，以及周末回看这一周。",
    products: "情绪日历、晨间心情钟、睡眠仪式灯、餐桌感谢器。",
    business: "桌面或床头成品 + 季节主题包 + 光效与声音内容。",
    input: "心情、睡眠与每日习惯",
    translate: "转成颜色、图案、光与节奏",
    returnValue: "每天十秒，逐渐形成个人生活图谱",
    verdict: "高频不等于高意愿。除非用户愿意连续使用并购买主题，否则它只是一个好看的留存假设。",
    image: "assets/emotion-products/daily-ritual.webp",
    imageAlt: "桌面上的情绪日历与成长拼图日常仪式产品概念效果图",
    caption: "情绪日历、晨间心情钟与睡眠仪式灯",
  },
  family: {
    priority: "P2 · 硬件假设",
    format: "成对硬件 + 家庭账户",
    kicker: "PRODUCT LINE 02 · TOGETHER",
    title: "Pindo Together · 家庭关系",
    promise: "不制造更多通知，只让“有人想着我”被安静地感知。",
    personality: "无声但有回应；像一盏懂得关系分寸的灯，亲密却不过度打扰。",
    value: "把触碰、问候和共同习惯沉淀成关系痕迹，让陪伴在异地和忙碌中仍然存在。",
    scene: "下班回家、异地伴侣互相点亮、家庭餐桌感谢，以及长辈床头回应。",
    products: "家庭共同画布、异地触碰灯、归家情绪门牌、餐桌感谢器。",
    business: "双件套或家庭套装 + 家庭账户 + 关系主题内容。",
    input: "触碰、问候、共同照片与家庭状态",
    translate: "转成共享光色与共同生长的图案",
    returnValue: "每次轻量互动，都为关系增加一块记忆",
    verdict: "真正的壁垒不是灯，而是多人持续参与形成的关系账户和共同记忆。",
    image: "assets/emotion-products/relationship-light.webp",
    imageAlt: "床头陪伴灯与墙上家庭共同画布产品概念效果图",
    caption: "家庭共同画布、异地触碰灯与归家情绪门牌",
  },
  voice: {
    priority: "P1 · 定制服务测试",
    format: "定制服务 + 记忆硬件",
    kicker: "PRODUCT LINE 03 · VOICE",
    title: "Pindo Voice · 声音记忆",
    promise: "保存的不只是故事内容，而是那个熟悉的人如何说出它。",
    personality: "像老收音机和首饰盒之间的物件；可靠、安静、有代际感，不像智能音箱。",
    value: "让亲人的声音、语气和人生故事拥有可触摸的入口，降低家庭记忆采集门槛。",
    scene: "生日或纪念日赠礼、家庭团聚口述、长辈故事保存，以及孩子睡前听亲人声音。",
    products: "声音记忆盒、家族故事书、语音纪念牌、可触发录音的记忆模块。",
    business: "按件定制 + 采访整理服务 + 家庭故事增补。",
    input: "语音、照片、人物关系与故事片段",
    translate: "整理成主题、色板与可触发的实体模块",
    returnValue: "触碰一个记忆块，就重新听见一个人",
    verdict: "情绪价值强、软件服务可先行，是无需复杂联网硬件就能验证付费的纪念产品。",
    image: "assets/product-lines/voice-memory.webp",
    imageAlt: "胡桃木声音记忆盒与陶瓷语音模块产品概念效果图",
    caption: "声音记忆盒、家族故事书与语音纪念模块",
  },
  scent: {
    priority: "P2 · 耗材复购",
    format: "扩香设备 + 气味胶囊",
    kicker: "PRODUCT LINE 04 · SCENT",
    title: "Pindo Scent · 气味记忆",
    promise: "让一段旅行、一个季节或一个人，以气味重新回到空间里。",
    personality: "像一件低调的家用电器，而不是香薰摆件；干净、可信、可长期留在卧室。",
    value: "利用气味与情境的强关联，帮助用户完成放松、归家和纪念等空间切换。",
    scene: "睡前恢复、旅行回忆、搬家后的熟悉感、纪念日，以及酒店个性化房间。",
    products: "记忆气味机、场景香氛胶囊、城市气味卡、纪念日气味礼盒。",
    business: "设备 + 胶囊耗材 + 季节订阅 + 联名气味系列。",
    input: "照片、地点、季节、人物与使用时段",
    translate: "转成气味配方、强度与空间时间表",
    returnValue: "在熟悉时刻自动恢复一段场景",
    verdict: "复购潜力高，但配方、安全、供应链与过敏信息必须在硬件扩张前被验证。",
    image: "assets/product-lines/scent-memory.webp",
    imageAlt: "陶瓷气味记忆机与多色气味胶囊产品概念效果图",
    caption: "记忆气味机、场景香氛胶囊与季节订阅",
  },
  kids: {
    priority: "P1 · 家庭内容",
    format: "成长套件 + 内容包",
    kicker: "PRODUCT LINE 05 · KIDS",
    title: "Pindo Kids · 亲子成长",
    promise: "让孩子先用颜色和触感表达，再慢慢学会说清自己的感受。",
    personality: "友好但不幼稚；像能陪家庭很多年的木质教具，而不是一次性练习册。",
    value: "降低亲子情绪对话门槛，把睡前交流、习惯成长和家庭共同记录变成轻量仪式。",
    scene: "睡前十分钟、放学回家、家庭冲突后的复盘，以及周末成长回看。",
    products: "情绪认知板、睡前表达盒、成长任务卡、家庭成长地图。",
    business: "家庭套件 + 年龄阶段内容包 + 学校或机构版本。",
    input: "孩子选择、家庭事件、习惯与共同照片",
    translate: "转成颜色、触感模块和可回答的问题",
    returnValue: "一次放置，引出一段更容易开始的对话",
    verdict: "家庭留存和内容延展清晰，但必须坚持隐私、非评分和非医疗诊断边界。",
    image: "assets/product-lines/parent-child-growth.webp",
    imageAlt: "亲子在木桌上使用情绪认知板与睡前表达盒产品概念效果图",
    caption: "情绪认知板、睡前表达盒与家庭成长地图",
  },
  pet: {
    priority: "P2 · 陪伴硬件",
    format: "联网设备 + 影像服务",
    kicker: "PRODUCT LINE 06 · PET",
    title: "Pindo Pet · 宠物陪伴",
    promise: "离开家时，不只远程看见宠物，也给彼此保留一个熟悉的回应。",
    personality: "温和、圆润、像家中的安静伙伴；功能清楚，但不把宠物空间变成监控室。",
    value: "把离家、归家、声音与日常活动转成稳定的陪伴仪式，并积累人与宠物的共同记忆。",
    scene: "早晨离家、午间远程回应、宠物独处、下班归家，以及成长纪念。",
    products: "宠物离家陪伴器、声音互动盒、活动记忆灯、成长纪念册。",
    business: "设备 + 影像存储 + 宠物成长内容 + 耗材选配。",
    input: "离家动作、声音、活动影像与宠物习惯",
    translate: "转成光、熟悉声音与可控的奖励反馈",
    returnValue: "主人离开后仍保留一致、可预期的陪伴",
    verdict: "场景真实但硬件与动物安全要求高，应在家庭产品和设备能力稳定后进入。",
    image: "assets/product-lines/pet-companion.webp",
    imageAlt: "狗狗旁的宠物陪伴设备、触觉模块与奖励抽屉产品概念效果图",
    caption: "宠物离家陪伴器、声音互动盒与成长影像服务",
  },
  moments: {
    priority: "P1 · 高客单服务",
    format: "活动装置 + 带走纪念品",
    kicker: "PRODUCT LINE 07 · MOMENTS",
    title: "Pindo Moments · 人生仪式",
    promise: "让到场的每个人留下一个动作，共同完成一件只属于这次相聚的作品。",
    personality: "有仪式感但不过度奢华；像现代纪念装置，也能拆分成每个人带走的小物。",
    value: "把婚礼、毕业、团聚和告别中的多人参与转成共同作品，让一次事件拥有可延续的实体证据。",
    scene: "婚礼签到、毕业纪念、家庭团聚、周年庆、社区活动与告别仪式。",
    products: "共同记忆墙、来宾拼合装置、纪念色块、活动后装框作品。",
    business: "活动方案费 + 装置租售 + 纪念品生产 + 现场服务。",
    input: "来宾选择、祝福、照片与事件主题",
    translate: "转成多人可参与的色块与生成构图",
    returnValue: "现场共同完成，活动后继续被收藏和赠送",
    verdict: "高情绪价值与高客单并存，适合先以服务验证，再逐步把装置模块标准化。",
    image: "assets/product-lines/life-ceremony.webp",
    imageAlt: "来宾共同放置彩色模块完成人生仪式记忆墙产品概念效果图",
    caption: "共同记忆墙、来宾拼合装置与带走纪念品",
  },
  gift: {
    priority: "P0 · 商业切入口",
    format: "在线生成 + 柔性定制",
    kicker: "PRODUCT LINE 08 · GIFT",
    title: "Pindo Gift · 情绪礼物",
    promise: "把“我想送得更像他”变成一套可以直接下单的个性化产品。",
    personality: "有设计感但不炫技；像被认真挑选过的私人礼物，而不是印上照片的通用周边。",
    value: "把照片、语音和故事快速转成一致的色板、材质与礼物组合，降低私人定制决策成本。",
    scene: "生日、纪念日、宠物纪念、乔迁、异地问候，以及临时但重要的感谢。",
    products: "照片微光框、语音纪念块、织物挂件、记忆卡与组合礼盒。",
    business: "在线方案生成 + 按件定制 + 节日礼盒 + 品牌合作。",
    input: "收礼人照片、声音、关系与送礼预算",
    translate: "生成专属色板、图案、材质和产品组合",
    returnValue: "从犹豫送什么，到获得一套真正像对方的礼物",
    verdict: "最容易连接现有图案能力与真实交易，可先用人工服务补齐供应链，再逐步产品化。",
    image: "assets/product-lines/emotional-gift.webp",
    imageAlt: "由照片、语音模块、织物挂件和纪念卡组成的情绪礼物盒概念效果图",
    caption: "个性化微光框、语音纪念块、织物挂件与礼盒",
  },
  spaces: {
    priority: "P3 · B2B 方案",
    format: "空间装置 + 内容维护",
    kicker: "PRODUCT LINE 09 · SPACES",
    title: "Pindo Spaces · 空间体验",
    promise: "让房间不只是被装饰，而能根据人的到来、状态与记忆产生回应。",
    personality: "建筑化、安静、可维护；像灯光和软装系统的一部分，不像短期展览特效。",
    value: "把个体情绪语言扩展到酒店、疗愈空间和商业场所，形成可定制、可重复部署的氛围系统。",
    scene: "酒店睡眠房、疗愈空间、品牌体验店、安静咖啡馆与社区公共空间。",
    products: "情绪光墙、房间仪式套件、空间气味模块、入住个性化主题。",
    business: "项目设计费 + 硬件安装 + 年度内容和维护服务。",
    input: "空间用途、客人偏好、时间与场景事件",
    translate: "编排光、图案、气味与触发规则",
    returnValue: "同一空间在不同人和时刻呈现不同情绪状态",
    verdict: "展示力和客单价高，但销售、施工与运维都更重，应该建立在标准化家庭模块之后。",
    image: "assets/product-lines/space-experience.webp",
    imageAlt: "精品酒店房间内的模块化情绪光墙与床头氛围设备产品概念效果图",
    caption: "情绪光墙、房间仪式套件与空间气味系统",
  },
  studio: {
    priority: "P3 · 创作者生态",
    format: "创作工具 + 模板市场",
    kicker: "PRODUCT LINE 10 · STUDIO",
    title: "Pindo Studio · 创作者平台",
    promise: "让设计师不只生成一张图，而能把创意变成可制造、可销售的产品系列。",
    personality: "专业、开放、材料感强；连接数字设计桌和真实工作室，而不是只做灵感社区。",
    value: "把跨材料图案、规格、生产和销售连接成创作生态，让外部创作者扩展 Pindo 的内容与产品边界。",
    scene: "独立设计师工作室、材料品牌联名、小型制造打样、主题包发布与作品销售。",
    products: "跨材料编辑器、样品包、制造规格库、主题市场与创作者店铺。",
    business: "专业订阅 + 素材与主题分成 + 打样和制造服务费。",
    input: "创意、图案、材料规格与目标产品",
    translate: "生成可编辑设计、BOM、打样文件与商品内容",
    returnValue: "一个创意跨材料落地，并进入真实销售循环",
    verdict: "平台不是起点；只有自营产品验证设计、制造和交易闭环后，开放生态才有可信规则。",
    image: "assets/product-lines/creator-platform.webp",
    imageAlt: "设计师在数字图案编辑器旁比较材料样品与实体产品的创作者平台概念效果图",
    caption: "跨材料编辑器、样品包、制造规格库与主题市场",
  },
};

const lifeLineTabs = [...document.querySelectorAll("[data-life-line]")];
const lifeLinePanel = document.querySelector("#life-line-panel");

function setLifeLineText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderLifeProductLine(lineId) {
  const line = LIFE_PRODUCT_LINES[lineId];
  if (!line || !lifeLinePanel) return;

  lifeLinePanel.dataset.activeLifeLine = lineId;
  lifeLineTabs.forEach((tab) => {
    const selected = tab.dataset.lifeLine === lineId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) lifeLinePanel.setAttribute("aria-labelledby", tab.id);
  });

  setLifeLineText("#life-line-priority", line.priority);
  setLifeLineText("#life-line-format", line.format);
  setLifeLineText("#life-line-kicker", line.kicker);
  setLifeLineText("#life-line-title", line.title);
  setLifeLineText("#life-line-promise", line.promise);
  setLifeLineText("#life-line-personality", line.personality);
  setLifeLineText("#life-line-value", line.value);
  setLifeLineText("#life-line-scene", line.scene);
  setLifeLineText("#life-line-products", line.products);
  setLifeLineText("#life-line-business", line.business);
  setLifeLineText("#life-line-input", line.input);
  setLifeLineText("#life-line-translate", line.translate);
  setLifeLineText("#life-line-return", line.returnValue);
  setLifeLineText("#life-line-verdict", line.verdict);
  setLifeLineText("#life-line-caption", line.caption);

  const image = document.querySelector("#life-line-image");
  if (image) {
    image.src = line.image;
    image.alt = line.imageAlt;
  }
}

lifeLineTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderLifeProductLine(tab.dataset.lifeLine));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % lifeLineTabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) nextIndex = (index - 1 + lifeLineTabs.length) % lifeLineTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lifeLineTabs.length - 1;

    const nextTab = lifeLineTabs[nextIndex];
    renderLifeProductLine(nextTab.dataset.lifeLine);
    nextTab.focus();
  });
});

renderLifeProductLine("gift");
