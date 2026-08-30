import { normalizeHash, stream } from "./genart-core.js";

export const LENSES = {
  support: {
    code: "01 / PLAYER SUPPORT",
    nav: "玩家 / 客服",
    role: "玩家支持与客服",
    title: "把“偶现卡关”变成可转交的事件包。",
    question: "玩家不懂生成算法，怎样让他用最低成本提交一个可复现现场？",
    summary: "客服只收集世界 seed、版本和一句现象描述；技术团队即可恢复地图、怪物、掉落与氛围，不再追问录屏和设备运气。",
    input: "世界 seed、线上版本、玩家一句话描述",
    evidence: ["同 seed 3 次重放像素一致", "现场包含地图 / 怪物 / 掉落 / VFX", "事件编号 GA-2048 可跨团队引用"],
    decision: "确认是可复现的生成规则缺陷，升级给工程与 QA，而不是让玩家反复尝试。",
    impactLabel: "支持效率",
    impact: "1 个 seed 代替完整录屏；事件现场约 42 秒恢复。",
  },
  art: {
    code: "02 / TECHNICAL ART",
    nav: "技术美术",
    role: "技术美术与创意导演",
    title: "艺术不是一张图，而是一组可锁定的系统特征。",
    question: "修复玩法规则时，怎样确保色彩、轮廓与氛围没有被意外重抽？",
    summary: "将 palette、silhouette、atmosphere 暴露为 traits。技术美术可以明确哪些视觉身份必须保持，哪些参数允许版本化演进。",
    input: "艺术方向、traits 词表、允许变化的参数范围",
    evidence: ["Palette：Ember Mine", "Silhouette：Vault Moth", "Atmosphere：Cold Static"],
    decision: "批准 route 修复；三项艺术身份保持，不需要重新做艺术评审。",
    impactLabel: "艺术一致性",
    impact: "玩法修复与视觉身份解耦，避免一次修门触发整个世界重抽。",
  },
  engineering: {
    code: "03 / GAME ENGINEERING",
    nav: "游戏工程",
    role: "游戏与生成系统工程",
    title: "命名随机流把修改范围限制在一个模块。",
    question: "为什么修一条 route 规则，不会让怪物、掉落和粒子一起变化？",
    summary: "根 seed 派生 world、enemy、loot、vfx 子流。每个模块只消费自己的随机序列，新增或删除 world 抽样不会推动其他模块的随机游标。",
    input: "根 seed、子流命名约定、模块版本",
    evidence: ["world.route：v1.4.2 → v1.4.3", "enemy ID：PRESERVED", "loot ID：PRESERVED"],
    decision: "只发布 route 规则差异；保留其余子流快照，缩小代码审查和回归范围。",
    impactLabel: "变更半径",
    impact: "1 / 4 子流发生变化；其余三个输出不漂移。",
  },
  qa: {
    code: "04 / QA & DATA",
    nav: "QA / 数据",
    role: "质量工程与数据分析",
    title: "从“这个 seed 修好了”升级到系列级证据。",
    question: "单个坏地图通过后，怎样证明候选规则没有在其他随机世界制造新问题？",
    summary: "先用三次像素重放建立可复现基线，再跑 10,000 seed 路线不变量。单例回归与群体普查共同构成发布门禁。",
    input: "固定 fixture、像素摘要、路线不变量、样本规模",
    evidence: ["重放：PASS 3 / 3", "release：809 / 10,000 BLOCKED", "candidate：0 / 10,000 BLOCKED"],
    decision: "候选版本满足单 seed 回归和系列不变量，可以进入发布候选。",
    impactLabel: "风险覆盖",
    impact: "从人工查看 1 张图，扩大为自动审查 10,000 个世界。",
  },
  production: {
    code: "05 / PRODUCTION",
    nav: "制作 / 发行",
    role: "制作管理与内容发行",
    title: "每个视觉结果都带版本、证据和回滚坐标。",
    question: "团队怎样批准、交付和回滚一个包含大量随机内容的版本？",
    summary: "seed、生成器版本、traits、像素摘要和审计报告组成可追溯资产包。制作人批准的是一套可重建规则，而不是一批失去来源的截图。",
    input: "候选 build、资产清单、审批规则、发布门禁",
    evidence: ["Incident：GA-2048", "Candidate：v1.4.3", "Audit：PASS · 10,000 seeds"],
    decision: "签署候选版本并保留 v1.4.2 回滚坐标；下游可按 seed 重建所需尺寸。",
    impactLabel: "交付完整性",
    impact: "一个规则包覆盖多尺寸、多渠道和后续重建，不依赖散落图片。",
  },
  boundary: {
    code: "06 / DECISION BOUNDARY",
    nav: "适用边界",
    role: "产品与技术选型",
    title: "不是所有图片任务都需要这套系统。",
    question: "什么时候值得引入 genart-skill，什么时候普通图片生成已经足够？",
    summary: "价值来自“程序化 + 系列化 + 必须负责”。如果只要一张一次性图片、无需重放或批量审查，引入完整协议只会增加成本。",
    input: "内容是否程序化、是否成系列、是否需要重放与验收",
    evidence: ["适合：地图 / 装备 / VFX / 批量品牌视觉", "谨慎：跨 GPU 像素严格一致", "不适合：一次性文生图或纯手绘资产"],
    decision: "当至少需要重放、批量或规则审查之一时采用；一次性固定图片不采用。",
    impactLabel: "选型结论",
    impact: "把它当生成系统工程能力，而不是通用绘画模型。",
  },
};

const WIDTH = 960;
const HEIGHT = 640;
const colors = {
  bg: "#090e15",
  panel: "#101923",
  grid: "#182431",
  line: "#385064",
  text: "#f5f0e8",
  muted: "#91a3b5",
  coral: "#ff625e",
  blue: "#59b9ff",
  mint: "#4ee0a5",
  violet: "#bc82ff",
  amber: "#f1bb6b",
};

function rect(ctx, x, y, w, h, fill = colors.panel, stroke = colors.line) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  }
}

function label(ctx, text, x, y, size = 18, color = colors.text, align = "left", weight = 600) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function line(ctx, x1, y1, x2, y2, color = colors.line, width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function dot(ctx, x, y, color, radius = 7) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawBase(ctx, lens, hash) {
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  for (let x = 0; x <= WIDTH; x += 40) line(ctx, x, 0, x, HEIGHT, colors.grid, 1);
  for (let y = 0; y <= HEIGHT; y += 40) line(ctx, 0, y, WIDTH, y, colors.grid, 1);
  rect(ctx, 24, 22, 912, 64, "#0c131c", colors.line);
  label(ctx, lens.code, 48, 54, 17, colors.coral, "left", 700);
  label(ctx, `${hash.slice(0, 12)}…${hash.slice(-6)}`, 912, 54, 15, colors.muted, "right", 500);
}

function drawSupport(ctx) {
  const cards = [
    ["PLAYER", "ROOM 07", colors.blue],
    ["WORLD SEED", "0xc0de…c0de", colors.amber],
    ["BUILD", "v1.4.2", colors.violet],
    ["ROUTE", "BLOCKED", colors.coral],
  ];
  cards.forEach(([key, value, color], index) => {
    const x = 24 + index * 228;
    rect(ctx, x, 112, 204, 118);
    label(ctx, key, x + 18, 140, 13, colors.muted);
    label(ctx, value, x + 18, 184, 21, color, "left", 700);
  });
  label(ctx, "ONE SEED → COMPLETE INCIDENT", 24, 276, 17, colors.text);
  line(ctx, 92, 346, 868, 346, colors.line, 4);
  [
    [92, "REPORT", colors.blue],
    [350, "REPLAY 3×", colors.amber],
    [608, "ISOLATE", colors.violet],
    [868, "HANDOFF", colors.mint],
  ].forEach(([x, text, color]) => {
    dot(ctx, x, 346, color, 13);
    label(ctx, text, x, 386, 14, color, "center", 700);
  });
  rect(ctx, 24, 440, 284, 150);
  rect(ctx, 338, 440, 284, 150);
  rect(ctx, 652, 440, 284, 150);
  label(ctx, "INPUT", 46, 468, 13, colors.muted);
  label(ctx, "1 SEED", 46, 520, 34, colors.text, "left", 800);
  label(ctx, "REPRODUCE", 360, 468, 13, colors.muted);
  label(ctx, "42 SEC", 360, 520, 34, colors.amber, "left", 800);
  label(ctx, "STATUS", 674, 468, 13, colors.muted);
  label(ctx, "ESCALATE", 674, 520, 30, colors.mint, "left", 800);
}

function drawArt(ctx, random) {
  label(ctx, "LOCKED ART IDENTITY", 24, 124, 17, colors.text);
  const palette = ["#101923", "#1e3847", "#ff625e", "#59b9ff", "#4ee0a5"];
  palette.forEach((color, index) => rect(ctx, 24 + index * 76, 156, 64, 92, color, null));
  label(ctx, "PALETTE / EMBER MINE", 24, 278, 14, colors.amber);
  rect(ctx, 430, 118, 250, 300, "#0c131c", colors.line);
  ctx.save();
  ctx.translate(555, 260);
  ctx.strokeStyle = colors.blue;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 76, 62, 0, 0, Math.PI * 2);
  ctx.stroke();
  for (const side of [-1, 1]) {
    line(ctx, side * 42, -50, side * 86, -100, colors.blue, 5);
    line(ctx, side * 58, 20, side * 105, 58, colors.blue, 5);
  }
  [-26, 0, 26].forEach((x) => dot(ctx, x, -4, colors.violet, 8));
  ctx.restore();
  label(ctx, "SILHOUETTE", 555, 386, 14, colors.muted, "center");
  label(ctx, "VAULT MOTH", 555, 448, 22, colors.blue, "center", 800);
  rect(ctx, 712, 118, 224, 430, "#0c131c", colors.line);
  for (let index = 0; index < 14; index += 1) {
    const y = 145 + index * 26;
    const bend = 16 + random() * 52;
    ctx.strokeStyle = index % 3 === 0 ? colors.violet : colors.line;
    ctx.lineWidth = index % 3 === 0 ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(730, y);
    ctx.bezierCurveTo(770, y - bend, 860, y + bend, 918, y);
    ctx.stroke();
  }
  label(ctx, "ATMOSPHERE", 824, 514, 14, colors.muted, "center");
  label(ctx, "COLD STATIC", 824, 578, 19, colors.violet, "center", 800);
  rect(ctx, 24, 334, 370, 214);
  label(ctx, "REVIEW RESULT", 46, 366, 13, colors.muted);
  label(ctx, "ROUTE CHANGED", 46, 416, 25, colors.coral, "left", 800);
  label(ctx, "ART TRAITS PRESERVED", 46, 468, 20, colors.mint, "left", 800);
  label(ctx, "NO RE-REVIEW REQUIRED", 46, 510, 14, colors.text);
}

function drawEngineering(ctx) {
  const centerX = 180;
  rect(ctx, 40, 248, 280, 126, "#111b27", colors.amber);
  label(ctx, "ROOT HASH", centerX, 278, 13, colors.muted, "center");
  label(ctx, "0xc0de…c0de", centerX, 330, 22, colors.amber, "center", 800);
  const nodes = [
    ["world", "ROUTE v1.4.3", colors.coral, 448, 128],
    ["enemy", "VAULT-MOTH-ebe7", colors.blue, 448, 246],
    ["loot", "DROP-FAE7E1", colors.violet, 448, 364],
    ["vfx", "COLD STATIC", colors.mint, 448, 482],
  ];
  nodes.forEach(([name, value, color, x, y]) => {
    line(ctx, 320, 311, x, y + 48, color, 3);
    rect(ctx, x, y, 444, 96, "#0d151f", color);
    label(ctx, name, x + 20, y + 28, 14, color, "left", 800);
    label(ctx, value, x + 20, y + 64, 18, colors.text, "left", 700);
    label(ctx, name === "world" ? "CHANGED" : "PRESERVED", x + 420, y + 48, 13, color, "right", 700);
  });
  label(ctx, "1 / 4 STREAMS CHANGED", 40, 548, 18, colors.mint, "left", 800);
  label(ctx, "修改 world 抽样不会推动其他模块的随机游标", 40, 584, 15, colors.muted);
}

function drawQa(ctx) {
  label(ctx, "REPLAY FIXTURE", 24, 124, 16, colors.text);
  [1, 2, 3].forEach((run, index) => {
    const x = 24 + index * 300;
    rect(ctx, x, 152, 276, 116);
    label(ctx, `RUN ${run}`, x + 18, 180, 13, colors.muted);
    label(ctx, "ffae6847c1", x + 18, 222, 22, colors.blue, "left", 800);
    label(ctx, "PASS", x + 252, 180, 13, colors.mint, "right", 800);
  });
  label(ctx, "SERIES AUDIT / 10,000 SEEDS", 24, 322, 16, colors.text);
  rect(ctx, 24, 350, 912, 220, "#0c131c", colors.line);
  label(ctx, "RELEASE / BLOCKED", 52, 390, 14, colors.muted);
  label(ctx, "809", 890, 390, 25, colors.coral, "right", 800);
  rect(ctx, 52, 420, 836, 26, colors.grid, null);
  rect(ctx, 52, 420, Math.round(836 * 0.0809), 26, colors.coral, null);
  label(ctx, "CANDIDATE / BLOCKED", 52, 486, 14, colors.muted);
  label(ctx, "0", 890, 486, 25, colors.mint, "right", 800);
  rect(ctx, 52, 516, 836, 26, colors.grid, null);
  line(ctx, 52, 529, 888, 529, colors.mint, 3);
  label(ctx, "GATE: PASS", 888, 594, 17, colors.mint, "right", 800);
}

function drawProduction(ctx) {
  const stages = [
    ["INCIDENT", "GA-2048", colors.coral],
    ["CANDIDATE", "v1.4.3", colors.blue],
    ["ART REVIEW", "PRESERVED", colors.violet],
    ["AUDIT", "10K PASS", colors.mint],
    ["RELEASE", "SIGNED", colors.amber],
  ];
  stages.forEach(([name, value, color], index) => {
    const x = 24 + index * 182;
    rect(ctx, x, 154, 158, 180, "#0d151f", color);
    label(ctx, `0${index + 1}`, x + 18, 182, 13, color);
    label(ctx, name, x + 18, 232, 14, colors.muted);
    label(ctx, value, x + 18, 282, 18, colors.text, "left", 800);
    if (index < stages.length - 1) {
      line(ctx, x + 158, 244, x + 182, 244, color, 3);
      dot(ctx, x + 170, 244, color, 5);
    }
  });
  label(ctx, "TRACEABLE ASSET PACKAGE", 24, 392, 16, colors.text);
  const assets = ["seed.json", "traits.json", "pixel.sha256", "audit.json"];
  assets.forEach((asset, index) => {
    const x = 24 + index * 228;
    rect(ctx, x, 426, 204, 104);
    label(ctx, asset, x + 18, 462, 16, colors.amber, "left", 700);
    label(ctx, "VERSIONED + REBUILDABLE", x + 18, 500, 11, colors.muted);
  });
  label(ctx, "ROLLBACK: release / v1.4.2", 24, 584, 15, colors.muted);
  label(ctx, "SHIP CANDIDATE / v1.4.3", 936, 584, 17, colors.mint, "right", 800);
}

function drawBoundary(ctx) {
  label(ctx, "DECISION MAP", 24, 124, 16, colors.text);
  rect(ctx, 92, 154, 776, 368, "#0c131c", colors.line);
  line(ctx, 480, 154, 480, 522, colors.line, 3);
  line(ctx, 92, 338, 868, 338, colors.line, 3);
  label(ctx, "ONE-OFF", 92, 554, 13, colors.muted, "left");
  label(ctx, "SERIES", 868, 554, 13, colors.muted, "right");
  label(ctx, "LOW ACCOUNTABILITY", 480, 584, 13, colors.muted, "center");
  label(ctx, "MUST REPLAY / AUDIT", 480, 114, 13, colors.muted, "center");
  label(ctx, "普通图片工具", 286, 430, 20, colors.muted, "center", 700);
  label(ctx, "批量但无需重放", 674, 430, 18, colors.amber, "center", 700);
  label(ctx, "固定资产版本", 286, 246, 18, colors.blue, "center", 700);
  rect(ctx, 526, 186, 296, 104, "#132820", colors.mint);
  label(ctx, "GENART-SKILL FIT", 674, 218, 14, colors.mint, "center", 800);
  label(ctx, "程序化 · 系列 · 可负责", 674, 258, 17, colors.text, "center", 700);
  dot(ctx, 748, 210, colors.mint, 6);
  label(ctx, "采用条件：重放 / 批量 / 规则审查，至少命中一项", 480, 610, 14, colors.text, "center", 700);
}

export function renderLens(canvas, id, hash) {
  const lensId = LENSES[id] ? id : "support";
  const normalized = normalizeHash(hash);
  const random = stream(normalized, `role-lens:${lensId}`);
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  drawBase(ctx, LENSES[lensId], normalized);
  if (lensId === "support") drawSupport(ctx);
  if (lensId === "art") drawArt(ctx, random);
  if (lensId === "engineering") drawEngineering(ctx);
  if (lensId === "qa") drawQa(ctx);
  if (lensId === "production") drawProduction(ctx);
  if (lensId === "boundary") drawBoundary(ctx);
  return { id: lensId, lens: LENSES[lensId] };
}
