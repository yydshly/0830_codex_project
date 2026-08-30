import { normalizeHash, stream } from "./genart-core.js";

export const SCENARIOS = {
  world: {
    code: "01 / GAME WORLD",
    short: "游戏地图",
    title: "Roguelike 地牢与关卡",
    summary: "让地图拓扑、房间密度、危险等级都由外部 seed 决定；玩家提交编号，开发者即可恢复同一世界。",
    angles: {
      input: "世界 seed、难度、Biome 配置",
      output: "房间、走廊、出生点、出口与危险区",
      verify: "固定测试 seed 检查连通性；A-B-A 排除全局污染",
      value: "线上异常可以精确回放，版本更新也能保留世界身份",
      extend: "接入 Three.js Tilemap、NavMesh、敌人/宝箱命名子流",
      boundary: "可复现不代表一定可玩，仍需路径和难度规则验收",
    },
  },
  loot: {
    code: "02 / LOOT SYSTEM",
    short: "装备掉落",
    title: "装备、词缀与稀有度",
    summary: "把掉落表从“写了 5%”升级为可普查的实际系统，同时让每件装备可以通过 seed 重新生成。",
    angles: {
      input: "掉落 seed、玩家阶段、loot table 权重",
      output: "装备类型、稀有度、主属性与词缀组合",
      verify: "10 万 seed census 对照目标概率，检查非法词缀组合",
      value: "平衡改动有统计证据，客服可以复现玩家掉落",
      extend: "接入背包、经济系统、服务器权威 seed 与反作弊签名",
      boundary: "客户端演示不等于安全掉落，正式游戏需要服务器裁决",
    },
  },
  monster: {
    code: "03 / CREATURE",
    short: "怪物外观",
    title: "怪物形态与战斗身份",
    summary: "将身体、眼睛、角、行为气质拆成独立随机流；调整 AI 时不会无意改变怪物外观。",
    angles: {
      input: "怪物 seed、物种规则、区域等级",
      output: "轮廓、附肢、配色、变异和战斗气质",
      verify: "联系表检查轮廓辨识度，固定 seed 做视觉回归",
      value: "大量个体保持同一世界观，同时能定位某个异常怪物",
      extend: "驱动 Three.js 骨骼、材质、招式表与音频反馈",
      boundary: "程序化外观仍需美术规则；不能自动保证动画和碰撞质量",
    },
  },
  brand: {
    code: "04 / BRAND SYSTEM",
    short: "品牌视觉",
    title: "跨渠道品牌海报系统",
    summary: "一个 campaign seed 生成同源但不重复的封面、社交海报和活动视觉，并保持调色板与版式规则。",
    angles: {
      input: "campaign seed、品牌 token、渠道画幅",
      output: "版式、图形节奏、色彩和安全区变体",
      verify: "批量联系表检查品牌一致性、文字安全区和失败版式",
      value: "同一活动快速扩展多渠道素材，仍保留可追溯版本",
      extend: "接入 SVG、Satori、印刷出血、动态海报和 CMS",
      boundary: "算法负责系统化变化，不负责品牌策略和最终文案审批",
    },
  },
  edition: {
    code: "05 / EDITION",
    short: "数字发行",
    title: "生成艺术系列与收藏发行",
    summary: "每件作品由 hash 决定，traits 可查询、稀有度可统计，高分辨率版本可以在需要时重新渲染。",
    angles: {
      input: "作品 hash、edition 规则、traits 权重",
      output: "唯一作品、metadata、预览图与高分辨率导出",
      verify: "系列联系表、traits census、重复渲染和分辨率检查",
      value: "发行前看见整个系统，而不是只挑少数英雄 seed",
      extend: "接入 Art Blocks/Verse、自托管画廊、绘图机和印刷",
      boundary: "工程完整性不等于艺术原创性、审美质量或市场价值",
    },
  },
  qa: {
    code: "06 / REGRESSION QA",
    short: "系统质检",
    title: "创意代码回归与版本差异",
    summary: "用固定 seed 作为视觉 fixture；算法升级后比较像素、traits 和构图，区分有意演进与意外漂移。",
    angles: {
      input: "固定 seed 集、基线版本、候选版本",
      output: "像素摘要、特征差异、失败 seed 与审查清单",
      verify: "同 seed 三次、不同 seed、A-B-A、批量截图与感知差异",
      value: "把依赖肉眼的创意代码变更纳入持续集成和发布门禁",
      extend: "跨浏览器矩阵、GPU 容差、PR 截图 diff 与失败归档",
      boundary: "Canvas 字节一致只证明固定环境；WebGL 需感知容差",
    },
  },
};

const TAU = Math.PI * 2;

function pick(random, values) {
  return values[Math.floor(random() * values.length) % values.length];
}

function setup(canvas, width = 960, height = 640, background = "#081019") {
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas 2D context unavailable");
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  context.lineCap = "round";
  context.lineJoin = "round";
  return context;
}

function labelFrame(context, scenario, hash, color = "#eff5ff") {
  context.save();
  context.fillStyle = color;
  context.font = "700 14px ui-monospace, monospace";
  context.fillText(SCENARIOS[scenario].code, 34, 36);
  context.textAlign = "right";
  context.globalAlpha = 0.7;
  context.fillText(`${hash.slice(0, 12)}…${hash.slice(-6)}`, 926, 36);
  context.restore();
}

function drawWorld(canvas, hash) {
  const traitsRandom = stream(hash, "scenario:world:traits");
  const layout = stream(hash, "scenario:world:layout");
  const biome = pick(traitsRandom, ["Obsidian Keep", "Moss Archive", "Salt Vault", "Ember Mine"]);
  const topology = pick(traitsRandom, ["Branching", "Looped", "Hub", "Gauntlet"]);
  const danger = pick(traitsRandom, ["Low", "Rising", "Severe"]);
  const features = { Biome: biome, Topology: topology, Danger: danger };
  const context = setup(canvas, 960, 640, "#071019");
  labelFrame(context, "world", hash);

  context.strokeStyle = "#142a3b";
  context.lineWidth = 1;
  for (let x = 44; x < 930; x += 32) {
    context.beginPath();
    context.moveTo(x, 64);
    context.lineTo(x, 600);
    context.stroke();
  }
  for (let y = 64; y < 610; y += 32) {
    context.beginPath();
    context.moveTo(44, y);
    context.lineTo(928, y);
    context.stroke();
  }

  const rooms = Array.from({ length: danger === "Severe" ? 11 : 9 }, () => ({
    x: 74 + layout() * 760,
    y: 92 + layout() * 420,
    width: 74 + layout() * 110,
    height: 54 + layout() * 92,
  }));
  const centers = rooms.map((room) => [room.x + room.width / 2, room.y + room.height / 2]);

  context.strokeStyle = "#55a8dd";
  context.lineWidth = 18;
  context.globalAlpha = 0.28;
  context.beginPath();
  context.moveTo(...centers[0]);
  for (let index = 1; index < centers.length; index += 1) {
    const [x, y] = centers[index];
    const previous = centers[index - 1];
    context.lineTo(x, previous[1]);
    context.lineTo(x, y);
  }
  context.stroke();

  rooms.forEach((room, index) => {
    const accent = index === 0 ? "#5ce3a4" : index === rooms.length - 1 ? "#ff635b" : "#9dd7ff";
    context.globalAlpha = 1;
    context.fillStyle = "#0d2232";
    context.strokeStyle = accent;
    context.lineWidth = index === 0 || index === rooms.length - 1 ? 3 : 1.5;
    context.fillRect(room.x, room.y, room.width, room.height);
    context.strokeRect(room.x, room.y, room.width, room.height);
    context.fillStyle = accent;
    context.beginPath();
    context.arc(room.x + 14, room.y + 14, 4, 0, TAU);
    context.fill();
  });

  const [startX, startY] = centers[0];
  const [exitX, exitY] = centers.at(-1);
  context.font = "700 12px ui-monospace, monospace";
  context.fillStyle = "#5ce3a4";
  context.fillText("SPAWN", startX - 22, startY + 4);
  context.fillStyle = "#ff635b";
  context.fillText("EXIT", exitX - 16, exitY + 4);

  context.fillStyle = "#0b1824";
  context.fillRect(44, 566, 884, 42);
  context.fillStyle = "#91a8b8";
  context.font = "12px ui-monospace, monospace";
  context.fillText(`${biome.toUpperCase()}  /  ${topology.toUpperCase()}  /  DANGER ${danger.toUpperCase()}`, 60, 592);
  return features;
}

function drawLoot(canvas, hash) {
  const traits = stream(hash, "scenario:loot:traits");
  const visual = stream(hash, "scenario:loot:visual");
  const rarity = pick(traits, ["Common", "Rare", "Rare", "Epic", "Legendary"]);
  const archetype = pick(traits, ["Blade", "Bow", "Ward", "Relic"]);
  const affix = pick(traits, ["of Echoes", "of Cinders", "of the Deep", "of Renewal"]);
  const features = { Rarity: rarity, Archetype: archetype, Affix: affix };
  const colors = {
    Common: "#b9c5ce",
    Rare: "#65b9ff",
    Epic: "#bc79ff",
    Legendary: "#ffb347",
  };
  const accent = colors[rarity];
  const context = setup(canvas, 960, 640, "#0a0d13");
  labelFrame(context, "loot", hash);

  for (let index = 0; index < 42; index += 1) {
    context.fillStyle = accent;
    context.globalAlpha = 0.08 + visual() * 0.3;
    context.fillRect(visual() * 960, 70 + visual() * 500, 2, 2);
  }
  context.globalAlpha = 1;
  context.fillStyle = "#111821";
  context.strokeStyle = "#2d3948";
  context.lineWidth = 2;
  context.fillRect(74, 76, 812, 500);
  context.strokeRect(74, 76, 812, 500);

  context.fillStyle = accent;
  context.fillRect(74, 76, 12, 500);
  context.font = "800 18px ui-monospace, monospace";
  context.fillText(rarity.toUpperCase(), 112, 120);
  context.fillStyle = "#f4f7fb";
  context.font = "800 36px system-ui, sans-serif";
  context.fillText(`${archetype} ${affix}`, 112, 166);

  context.save();
  context.translate(316, 342);
  context.strokeStyle = accent;
  context.fillStyle = `${accent}33`;
  context.lineWidth = 8;
  if (archetype === "Blade") {
    context.beginPath();
    context.moveTo(-28, 120);
    context.lineTo(38, -126);
    context.lineTo(68, -154);
    context.lineTo(56, -100);
    context.lineTo(2, 132);
    context.closePath();
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(-66, 84);
    context.lineTo(42, 112);
    context.stroke();
  } else if (archetype === "Bow") {
    context.beginPath();
    context.arc(-10, 0, 132, -1.05, 1.05);
    context.stroke();
    context.beginPath();
    context.moveTo(56, -114);
    context.lineTo(56, 114);
    context.moveTo(-88, 0);
    context.lineTo(116, 0);
    context.stroke();
  } else if (archetype === "Ward") {
    context.beginPath();
    context.moveTo(0, -140);
    context.lineTo(112, -70);
    context.lineTo(82, 96);
    context.lineTo(0, 148);
    context.lineTo(-82, 96);
    context.lineTo(-112, -70);
    context.closePath();
    context.fill();
    context.stroke();
  } else {
    context.beginPath();
    for (let index = 0; index < 10; index += 1) {
      const angle = -Math.PI / 2 + (index * TAU) / 10;
      const radius = index % 2 ? 58 : 138;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (!index) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
    context.fill();
    context.stroke();
  }
  context.restore();

  context.font = "700 12px ui-monospace, monospace";
  context.fillStyle = "#92a2b4";
  context.fillText("ROLLED STATS", 544, 246);
  const stats = ["POWER", "SPEED", "CONTROL"];
  stats.forEach((stat, index) => {
    const value = 32 + Math.floor(visual() * 66);
    const y = 292 + index * 72;
    context.fillStyle = "#aab8c6";
    context.fillText(stat, 544, y);
    context.fillStyle = "#202a36";
    context.fillRect(544, y + 16, 246, 10);
    context.fillStyle = accent;
    context.fillRect(544, y + 16, 2.46 * value, 10);
    context.textAlign = "right";
    context.fillText(String(value), 824, y + 24);
    context.textAlign = "left";
  });
  context.fillStyle = "#92a2b4";
  context.fillText("DROP ID", 544, 514);
  context.fillStyle = "#f4f7fb";
  context.fillText(hash.slice(2, 18).toUpperCase(), 644, 514);
  return features;
}

function drawMonster(canvas, hash) {
  const traits = stream(hash, "scenario:monster:traits");
  const anatomy = stream(hash, "scenario:monster:anatomy");
  const species = pick(traits, ["Mireling", "Glassback", "Ash Warden", "Night Grazer"]);
  const temperament = pick(traits, ["Skittish", "Territorial", "Predatory"]);
  const mutation = pick(traits, ["Crown Horns", "Twin Core", "Many Eyes", "Spore Veil"]);
  const features = { Species: species, Temperament: temperament, Mutation: mutation };
  const context = setup(canvas, 960, 640, "#07110f");
  labelFrame(context, "monster", hash, "#d8fff0");
  const accent = pick(traits, ["#55e6a5", "#75c9ff", "#ff715f", "#c68cff"]);

  context.strokeStyle = "#15332a";
  context.lineWidth = 1;
  for (let y = 88; y <= 568; y += 40) {
    context.beginPath();
    context.moveTo(64, y);
    context.lineTo(896, y);
    context.stroke();
  }
  context.save();
  context.translate(476, 342);
  context.fillStyle = "#0e251f";
  context.strokeStyle = accent;
  context.lineWidth = 4;
  const bodyWidth = 210 + anatomy() * 80;
  const bodyHeight = 230 + anatomy() * 90;
  context.beginPath();
  context.ellipse(0, 40, bodyWidth / 2, bodyHeight / 2, 0, 0, TAU);
  context.fill();
  context.stroke();

  const limbCount = 3 + Math.floor(anatomy() * 4);
  context.lineWidth = 12;
  for (let side of [-1, 1]) {
    for (let index = 0; index < limbCount; index += 1) {
      const y = -60 + (index * 170) / Math.max(1, limbCount - 1);
      const reach = 120 + anatomy() * 80;
      context.beginPath();
      context.moveTo(side * bodyWidth * 0.38, y);
      context.quadraticCurveTo(side * reach, y + (anatomy() - 0.5) * 70, side * (reach + 46), y + 42);
      context.stroke();
    }
  }

  const eyeCount = mutation === "Many Eyes" ? 7 : 2 + Math.floor(anatomy() * 3);
  for (let index = 0; index < eyeCount; index += 1) {
    const angle = -2.7 + (index * 2.2) / Math.max(1, eyeCount - 1);
    const x = Math.cos(angle) * bodyWidth * 0.25;
    const y = -50 + Math.sin(angle) * 56;
    context.fillStyle = "#07110f";
    context.strokeStyle = accent;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(x, y, 10 + anatomy() * 8, 0, TAU);
    context.fill();
    context.stroke();
    context.fillStyle = accent;
    context.beginPath();
    context.arc(x, y, 3, 0, TAU);
    context.fill();
  }

  if (mutation === "Crown Horns" || mutation === "Spore Veil") {
    context.lineWidth = 5;
    for (let side of [-1, 1]) {
      context.beginPath();
      context.moveTo(side * 48, -112);
      context.quadraticCurveTo(side * 104, -210, side * 142, -158);
      context.stroke();
    }
  }
  context.restore();

  context.fillStyle = "#d8fff0";
  context.font = "800 30px system-ui, sans-serif";
  context.fillText(species, 64, 598);
  context.fillStyle = accent;
  context.font = "700 12px ui-monospace, monospace";
  context.textAlign = "right";
  context.fillText(`${temperament.toUpperCase()} / ${mutation.toUpperCase()}`, 896, 598);
  return features;
}

function drawBrand(canvas, hash) {
  const traits = stream(hash, "scenario:brand:traits");
  const layout = stream(hash, "scenario:brand:layout");
  const campaign = pick(traits, ["SIGNAL/01", "NEW TERRAIN", "AFTERLIGHT", "COMMON FUTURES"]);
  const composition = pick(traits, ["Split", "Stack", "Offset Grid", "Monument"]);
  const channel = pick(traits, ["Social 4:5", "Launch 16:9", "Cover 1:1"]);
  const features = { Campaign: campaign, Layout: composition, Channel: channel };
  const palettes = [
    ["#f5efe3", "#111216", "#ff4b42", "#2a63ff"],
    ["#101116", "#f4f0e8", "#b7ff4a", "#6a54ff"],
    ["#f1d85c", "#101116", "#ff5d96", "#f4f0e8"],
  ];
  const [background, ink, accent, secondary] = pick(traits, palettes);
  const context = setup(canvas, 960, 640, background);
  labelFrame(context, "brand", hash, ink);
  context.fillStyle = accent;
  context.fillRect(64, 72, 16 + layout() * 160, 16);
  context.fillStyle = ink;
  context.font = "900 86px system-ui, sans-serif";
  context.textBaseline = "top";
  const words = campaign.split(" ");
  words.forEach((word, index) => context.fillText(word, 64 + (index % 2) * 84, 116 + index * 92));

  context.save();
  context.translate(726, 324);
  context.rotate((layout() - 0.5) * 0.8);
  context.fillStyle = secondary;
  context.fillRect(-116, -116, 232, 232);
  context.strokeStyle = ink;
  context.lineWidth = 12;
  context.strokeRect(-92, -92, 184, 184);
  context.fillStyle = accent;
  context.beginPath();
  context.arc(0, 0, 48 + layout() * 50, 0, TAU);
  context.fill();
  context.restore();

  context.strokeStyle = `${ink}66`;
  context.lineWidth = 1;
  context.setLineDash([6, 7]);
  context.strokeRect(44, 56, 872, 528);
  context.setLineDash([]);
  context.fillStyle = ink;
  context.font = "700 13px ui-monospace, monospace";
  context.fillText(`${composition.toUpperCase()} / ${channel.toUpperCase()} / SAFE AREA`, 64, 558);
  return features;
}

function drawEdition(canvas, hash) {
  const traits = stream(hash, "scenario:edition:traits");
  const geometry = stream(hash, "scenario:edition:geometry");
  const paletteName = pick(traits, ["Nocturne", "Mineral", "Signal", "Verdigris"]);
  const motif = pick(traits, ["Fold", "Orbit", "Strata", "Bloom"]);
  const rarity = pick(traits, ["Open", "Open", "Limited", "Rare"]);
  const features = { Palette: paletteName, Motif: motif, Scarcity: rarity };
  const palettes = {
    Nocturne: ["#080b12", "#e8efff", "#638dff", "#ff4b5f"],
    Mineral: ["#101314", "#d7d1c4", "#b3794d", "#77b8a0"],
    Signal: ["#0f1014", "#f2efdf", "#ff4b42", "#2e6bff"],
    Verdigris: ["#07120f", "#d7f2e7", "#54d49c", "#e1b95b"],
  };
  const [background, paper, accent, secondary] = palettes[paletteName];
  const context = setup(canvas, 960, 640, background);
  labelFrame(context, "edition", hash, paper);
  context.save();
  context.translate(480, 324);
  for (let layer = 0; layer < 34; layer += 1) {
    const angle = geometry() * TAU;
    const radius = 40 + geometry() * 250;
    const x = Math.cos(angle) * radius * 0.88;
    const y = Math.sin(angle) * radius * 0.62;
    const width = 28 + geometry() * 170;
    const height = 12 + geometry() * 82;
    context.strokeStyle = layer % 3 ? accent : secondary;
    context.globalAlpha = 0.32 + geometry() * 0.55;
    context.lineWidth = 1 + geometry() * 5;
    context.beginPath();
    if (motif === "Orbit") {
      context.ellipse(x, y, width, height, angle, 0, TAU);
    } else if (motif === "Strata") {
      context.moveTo(-360, y);
      context.bezierCurveTo(-120, y - height, 120, y + height, 360, y);
    } else if (motif === "Bloom") {
      context.arc(x, y, width * 0.46, 0, TAU);
    } else {
      context.moveTo(x - width, y - height);
      context.lineTo(x + width, y + height);
      context.lineTo(x + width * 0.25, y + height * 1.8);
    }
    context.stroke();
  }
  context.restore();
  context.globalAlpha = 1;
  context.fillStyle = paper;
  context.font = "800 30px system-ui, sans-serif";
  context.fillText(`${motif} / ${paletteName}`, 54, 590);
  context.textAlign = "right";
  context.font = "700 12px ui-monospace, monospace";
  context.fillText(`EDITION ${Number.parseInt(hash.slice(-6), 16) % 1000} · ${rarity.toUpperCase()}`, 906, 590);
  return features;
}

function drawQa(canvas, hash) {
  const traits = stream(hash, "scenario:qa:traits");
  const fixture = stream(hash, "scenario:qa:fixture");
  const coverage = pick(traits, ["12 seeds", "32 seeds", "100 seeds"]);
  const drift = pick(traits, ["None", "Layout +3px", "Palette changed", "Feature mismatch"]);
  const verdict = drift === "None" ? "PASS" : "REVIEW";
  const features = { Coverage: coverage, Drift: drift, Verdict: verdict };
  const context = setup(canvas, 960, 640, "#080b10");
  labelFrame(context, "qa", hash);
  const nodes = Array.from({ length: 8 }, () => ({
    x: 30 + fixture() * 280,
    y: 66 + fixture() * 270,
    radius: 10 + fixture() * 34,
    accent: fixture() > 0.33,
    alpha: 0.45 + fixture() * 0.45,
  }));

  const panel = (x, title, changed) => {
    context.fillStyle = "#0e141d";
    context.strokeStyle = changed ? "#ff645e" : "#334150";
    context.lineWidth = changed ? 2 : 1;
    context.fillRect(x, 98, 354, 390);
    context.strokeRect(x, 98, 354, 390);
    context.fillStyle = "#8ea0b4";
    context.font = "700 12px ui-monospace, monospace";
    context.fillText(title, x + 20, 128);
    nodes.forEach((node, index) => {
      const px = x + node.x + (changed && drift.includes("Layout") ? 3 : 0);
      const py = 98 + node.y;
      context.strokeStyle = changed && drift.includes("Palette")
        ? "#ff9b67"
        : node.accent ? "#66a9e8" : "#d4e9ff";
      context.globalAlpha = node.alpha;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(px, py, node.radius + (changed && drift.includes("Feature") && index === 0 ? 8 : 0), 0, TAU);
      context.stroke();
    });
    context.globalAlpha = 1;
  };
  panel(76, "BASELINE / v1.4.2", false);
  panel(530, "CANDIDATE / v1.5.0", drift !== "None");

  context.fillStyle = verdict === "PASS" ? "#54e0a0" : "#ff645e";
  context.font = "900 32px ui-monospace, monospace";
  context.fillText(verdict, 76, 554);
  context.fillStyle = "#9aabba";
  context.font = "12px ui-monospace, monospace";
  context.fillText(`${coverage.toUpperCase()} / ${drift.toUpperCase()} / PIXEL + FEATURES`, 214, 552);
  return features;
}

const RENDERERS = { world: drawWorld, loot: drawLoot, monster: drawMonster, brand: drawBrand, edition: drawEdition, qa: drawQa };

export function renderScenario(canvas, scenario, inputHash) {
  const id = SCENARIOS[scenario] ? scenario : "world";
  const hash = normalizeHash(inputHash);
  const features = RENDERERS[id](canvas, hash);
  return { scenario: id, hash, features, width: canvas.width, height: canvas.height };
}
