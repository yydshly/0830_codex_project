import { normalizeHash, stream } from "./genart-core.js";

export const APPLICATIONS = {
  game: {
    code: "01 / PLAYABLE WORLD",
    short: "游戏关卡",
    micro: "GAME",
    title: "生成结果直接成为可玩的关卡。",
    summary: "地图、角色、敌人、掉落和出口由独立子流生成；产品消费的是 Tilemap 与实体配置，不是抽象光效。",
    input: "世界 seed · Biome · 难度 · 关卡规则",
    output: "俯视关卡 · 敌人编队 · 掉落点 · HUD",
    formats: ["TILEMAP JSON", "ENTITY JSON", "PNG PREVIEW"],
    value: "玩家报一个 seed，就能恢复他真正玩到的现场。",
  },
  brand: {
    code: "02 / CAMPAIGN SYSTEM",
    short: "品牌活动",
    micro: "BRAND",
    title: "一个活动身份，自动适配多个渠道。",
    summary: "同一个 campaign seed 在桌面 KV、手机故事和商品卡中复用构图基因，同时遵守品牌颜色与安全区。",
    input: "Campaign seed · 品牌 token · 文案安全区",
    output: "桌面 KV · 9:16 Story · 商品卡",
    formats: ["SVG", "PNG @2X", "CMS JSON"],
    value: "不是批量随机出图，而是批量生产可识别的同一活动。",
  },
  product: {
    code: "03 / PERSONAL PRODUCT",
    short: "个性商品",
    micro: "PRODUCT",
    title: "每个订单都有可恢复的专属纹样。",
    summary: "名字、订单号和 seed 共同驱动包装、标签与生产文件；补发时可以精确重建，而不是寻找旧截图。",
    input: "订单 seed · 姓名 · SKU · 生产色域",
    output: "包装盒 · 瓶身标签 · 印刷纹样 · 订单凭证",
    formats: ["PRINT SVG", "CMYK PDF", "ORDER JSON"],
    value: "个性化从一次性效果，变成可以履约和补发的产品数据。",
  },
  data: {
    code: "04 / DATA STORY",
    short: "数据报告",
    micro: "DATA",
    title: "真实指标决定报告的视觉语言。",
    summary: "增长、活跃、地区和风险不只是数字：它们映射到面积、轨迹、密度和颜色，形成年度报告与数据摘要。",
    input: "业务指标 · 地区 · 时间范围 · 报告 seed",
    output: "年度封面 · 指标图 · 地区摘要 · 分享卡",
    formats: ["PDF", "SVG CHART", "SOCIAL PNG"],
    value: "每期报告保持品牌一致，同时让真实数据进入视觉结构。",
  },
  media: {
    code: "05 / MEDIA KIT",
    short: "媒体内容",
    micro: "MEDIA",
    title: "一个栏目，持续产出不重复的内容资产。",
    summary: "播客封面、视频缩略图和节目卡共享栏目 Seed；每一期拥有变化，但仍能一眼识别归属。",
    input: "栏目 seed · 期数 · 嘉宾 · 标题长度",
    output: "播客封面 · 视频缩略图 · 播放页 · 动态背景",
    formats: ["1:1 PNG", "16:9 PNG", "MOTION JSON"],
    value: "内容团队可以规模化生产，而不会失去栏目识别度。",
  },
  identity: {
    code: "06 / UI IDENTITY",
    short: "UI 身份",
    micro: "IDENTITY",
    title: "生成视觉成为产品界面的一部分。",
    summary: "用户 seed 生成头像背景、会员卡、徽章和主题 token；前端消费的是稳定参数与组件资产。",
    input: "用户 seed · 等级 · 成就 · 主题偏好",
    output: "头像 · 会员卡 · 徽章 · UI 主题 token",
    formats: ["CSS TOKENS", "SVG BADGE", "PROFILE JSON"],
    value: "个性化可跨设备恢复，也能在升级后保持用户身份。",
  },
};

const TAU = Math.PI * 2;
const PALETTES = [
  ["#ff5a48", "#ffcc65", "#5df0ca", "#111724"],
  ["#7c5cff", "#55d9ff", "#f7f1dc", "#11121c"],
  ["#e7ff59", "#f48bc4", "#5f43ff", "#15131a"],
  ["#ff764d", "#ffe1bb", "#4a77ff", "#121725"],
];

export const BRAND_DEFAULTS = Object.freeze({
  brandName: "AERO",
  headline: "MOVE BEYOND",
  primary: "#ff6b4f",
  accent: "#536eff",
  campaignId: "A/26",
});

function cleanText(value, fallback, maxLength) {
  const clean = String(value ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
  return (clean || fallback).slice(0, maxLength);
}

function cleanColor(value, fallback) {
  const color = String(value ?? "").trim().toLowerCase();
  return /^#[0-9a-f]{6}$/.test(color) ? color : fallback;
}

export function normalizeBrandInputs(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  return {
    brandName: cleanText(source.brandName, BRAND_DEFAULTS.brandName, 18),
    headline: cleanText(source.headline, BRAND_DEFAULTS.headline, 28),
    primary: cleanColor(source.primary, BRAND_DEFAULTS.primary),
    accent: cleanColor(source.accent, BRAND_DEFAULTS.accent),
    campaignId: cleanText(source.campaignId, BRAND_DEFAULTS.campaignId, 12),
  };
}

function pick(random, values) {
  return values[Math.floor(random() * values.length) % values.length];
}

function setup(canvas) {
  canvas.width = 1280;
  canvas.height = 760;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas 2D context unavailable");
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.lineCap = "round";
  context.lineJoin = "round";
  return context;
}

function roundRect(context, x, y, width, height, radius, fill, stroke = null, lineWidth = 1) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = lineWidth;
    context.stroke();
  }
}

function text(context, value, x, y, size = 18, color = "#fff", weight = 500, align = "left") {
  context.fillStyle = color;
  context.font = `${weight} ${size}px Inter, Arial, sans-serif`;
  context.textAlign = align;
  context.textBaseline = "alphabetic";
  context.fillText(value, x, y);
}

function mono(context, value, x, y, size = 13, color = "#fff", align = "left") {
  context.fillStyle = color;
  context.font = `600 ${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;
  context.textAlign = align;
  context.textBaseline = "alphabetic";
  context.fillText(value, x, y);
}

function line(context, x1, y1, x2, y2, color, width = 1) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
}

function glowCircle(context, x, y, radius, color, alpha = 1) {
  context.save();
  context.globalAlpha = alpha;
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.22, `${color}bb`);
  gradient.addColorStop(1, `${color}00`);
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, TAU);
  context.fill();
  context.restore();
}

function signal(context, random, x, y, width, height, palette, density = 9) {
  context.save();
  context.beginPath();
  context.rect(x, y, width, height);
  context.clip();
  for (let index = 0; index < density; index += 1) {
    const color = palette[index % 3];
    const sx = x + random() * width;
    const sy = y + random() * height;
    const radius = width * (0.18 + random() * 0.42);
    glowCircle(context, sx, sy, radius, color, 0.32 + random() * 0.25);
  }
  context.globalCompositeOperation = "screen";
  for (let index = 0; index < 6; index += 1) {
    context.beginPath();
    const startY = y + height * (0.1 + random() * 0.8);
    context.moveTo(x - 40, startY);
    context.bezierCurveTo(
      x + width * 0.24,
      startY - height * (0.8 * random()),
      x + width * 0.66,
      startY + height * (0.8 * random()),
      x + width + 40,
      y + height * (0.1 + random() * 0.8),
    );
    context.strokeStyle = `${palette[index % 3]}${index % 2 ? "66" : "bb"}`;
    context.lineWidth = 2 + random() * 9;
    context.stroke();
  }
  context.restore();
}

function appHeader(context, label, seed, palette, dark = true) {
  const bg = dark ? "#090d16" : "#f4f0e7";
  context.fillStyle = bg;
  context.fillRect(0, 0, 1280, 760);
  context.fillStyle = palette[0];
  context.fillRect(0, 0, 9, 760);
  mono(context, label, 42, 45, 13, dark ? "#edf4ff" : "#161923");
  mono(context, `SEED ${seed.slice(2, 12).toUpperCase()}`, 1238, 45, 12, dark ? "#8994a8" : "#6f6a61", "right");
  line(context, 42, 66, 1238, 66, dark ? "#283142" : "#d6cfc2");
}

function drawGame(context, random, seed, palette) {
  appHeader(context, "LIVE BUILD / SECTOR 07", seed, palette, true);
  roundRect(context, 42, 92, 852, 618, 22, "#101726", "#2b394f", 2);
  roundRect(context, 918, 92, 320, 618, 22, "#0e1420", "#2b394f", 2);
  mono(context, "PLAYABLE MAP", 70, 128, 12, "#7f8da5");
  text(context, "EMBER VAULT", 70, 162, 28, "#f3f7ff", 760);
  mono(context, "OBJECTIVE  /  FIND THE EXIT", 866, 127, 11, palette[1], "right");

  const cols = 11;
  const rows = 7;
  const cellW = 66;
  const cellH = 66;
  const ox = 92;
  const oy = 196;
  const rooms = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const edge = row === 0 || col === 0 || row === rows - 1 || col === cols - 1;
      const open = !edge && random() > 0.23;
      rooms.push(open);
      roundRect(
        context,
        ox + col * cellW,
        oy + row * cellH,
        cellW - 7,
        cellH - 7,
        8,
        open ? "#172438" : "#0a0f19",
        open ? "#28405e" : "#141c29",
      );
      if (open && random() > 0.82) {
        glowCircle(context, ox + col * cellW + 29, oy + row * cellH + 29, 23, palette[0], 0.52);
        context.fillStyle = palette[0];
        context.beginPath();
        context.arc(ox + col * cellW + 29, oy + row * cellH + 29, 5, 0, TAU);
        context.fill();
      }
    }
  }

  const playerX = ox + cellW * 2 + 29;
  const playerY = oy + cellH * 4 + 29;
  glowCircle(context, playerX, playerY, 40, palette[2], 0.7);
  context.fillStyle = palette[2];
  context.beginPath();
  context.moveTo(playerX, playerY - 13);
  context.lineTo(playerX + 11, playerY + 13);
  context.lineTo(playerX - 11, playerY + 13);
  context.closePath();
  context.fill();
  mono(context, "YOU", playerX, playerY + 32, 9, "#d9fff5", "center");

  const exitX = ox + cellW * 9 + 29;
  const exitY = oy + cellH * 1 + 29;
  context.strokeStyle = palette[1];
  context.lineWidth = 4;
  context.strokeRect(exitX - 13, exitY - 13, 26, 26);
  mono(context, "EXIT", exitX, exitY + 35, 9, palette[1], "center");

  mono(context, "RUN STATUS", 946, 132, 11, "#7f8da5");
  text(context, "LIVE", 1188, 134, 14, palette[2], 800, "right");
  const stats = [
    ["ROOMS", String(18 + Math.floor(random() * 15))],
    ["ENEMIES", String(6 + Math.floor(random() * 10))],
    ["LOOT", String(3 + Math.floor(random() * 6))],
    ["DANGER", `${38 + Math.floor(random() * 55)}%`],
  ];
  stats.forEach(([label, value], index) => {
    roundRect(context, 946, 158 + index * 70, 264, 54, 10, "#151e2d");
    mono(context, label, 964, 181 + index * 70, 10, "#76849a");
    text(context, value, 1190, 194 + index * 70, 22, index === 3 ? palette[0] : "#f0f5ff", 760, "right");
  });
  mono(context, "LOADOUT", 946, 470, 11, "#7f8da5");
  [palette[0], palette[1], palette[2]].forEach((color, index) => {
    roundRect(context, 946 + index * 88, 490, 72, 72, 12, "#141d2a", "#33445c");
    glowCircle(context, 982 + index * 88, 526, 25, color, 0.5);
    text(context, ["✦", "◆", "●"][index], 982 + index * 88, 535, 24, color, 700, "center");
  });
  roundRect(context, 946, 590, 264, 86, 12, "#171d27", palette[1], 1.5);
  mono(context, "REPLAY HANDLE", 964, 616, 10, "#8793a5");
  mono(context, seed.slice(0, 20), 964, 644, 13, "#f4f6fb");
  mono(context, "RESTORES THIS RUN", 964, 662, 9, palette[1]);
  return { Rooms: stats[0][1], Enemies: stats[1][1], Danger: stats[3][1] };
}

function headlineLines(value) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const pivot = Math.ceil(words.length / 2);
    return [words.slice(0, pivot).join(" "), words.slice(pivot).join(" ")].filter(Boolean);
  }
  if (value.length > 10) return [value.slice(0, Math.ceil(value.length / 2)), value.slice(Math.ceil(value.length / 2))];
  return [value];
}

function campaignArtwork(context, random, x, y, width, height, palette, brand, compact = false) {
  brand = normalizeBrandInputs(brand);
  roundRect(context, x, y, width, height, compact ? 18 : 24, "#11131a");
  context.save();
  context.beginPath();
  context.roundRect(x, y, width, height, compact ? 18 : 24);
  context.clip();
  signal(context, random, x, y, width, height, palette, compact ? 5 : 9);
  context.restore();
  mono(context, brand.campaignId.toUpperCase(), x + 24, y + 34, compact ? 10 : 12, "#ffffff");
  const lines = headlineLines(brand.headline.toUpperCase());
  const fontSize = compact ? (brand.headline.length > 16 ? 20 : 26) : (brand.headline.length > 20 ? 42 : 54);
  const baseY = y + height * 0.63 - (lines.length > 1 ? 0 : fontSize * 0.3);
  lines.slice(0, 2).forEach((value, index) => text(context, value, x + 24, baseY + index * fontSize * 0.92, fontSize, "#ffffff", 840));
  mono(context, `${brand.brandName.toUpperCase()} / NEW SEASON`, x + 26, y + height - 26, compact ? 8 : 11, "#ffffffcc");
}

function drawBrand(context, random, seed, palette, input = {}) {
  const brand = normalizeBrandInputs(input);
  appHeader(context, "CAMPAIGN DELIVERY / 3 SURFACES", seed, palette, false);
  text(context, brand.headline.toUpperCase(), 42, 117, brand.headline.length > 22 ? 27 : 34, "#15171d", 820);
  mono(context, "ONE CAMPAIGN SEED → THREE CHANNEL-SAFE OUTPUTS", 1238, 112, 11, "#6d685f", "right");
  campaignArtwork(context, random, 42, 146, 690, 488, palette, brand, false);
  roundRect(context, 758, 146, 206, 488, 30, "#191b22", "#353942", 2);
  roundRect(context, 770, 162, 182, 454, 22, "#0f1116");
  campaignArtwork(context, random, 776, 168, 170, 440, palette, brand, true);
  roundRect(context, 990, 146, 248, 232, 20, "#ffffff", "#d7d0c4");
  signal(context, random, 1004, 160, 220, 128, palette, 4);
  mono(context, "PRODUCT DROP", 1008, 316, 10, "#777167");
  text(context, `${brand.brandName.toUpperCase()} 02`, 1008, 346, brand.brandName.length > 12 ? 19 : 25, "#17191f", 780);
  roundRect(context, 990, 402, 248, 232, 20, "#151820");
  mono(context, "CHANNEL CHECK", 1012, 434, 10, "#7f8797");
  [["DESKTOP KV", "PASS"], ["STORY 9:16", "PASS"], ["SHOP CARD", "PASS"]].forEach(([label, value], index) => {
    line(context, 1012, 466 + index * 50, 1216, 466 + index * 50, "#303744");
    mono(context, label, 1012, 492 + index * 50, 10, "#d9dde6");
    mono(context, value, 1216, 492 + index * 50, 10, palette[2], "right");
  });
  mono(context, "DESKTOP 16:9", 42, 672, 10, "#777167");
  mono(context, "STORY 9:16", 758, 672, 10, "#777167");
  mono(context, "COMMERCE 1:1", 990, 672, 10, "#777167");
  return { Channels: "3", SafeZones: "PASS", Campaign: brand.campaignId.toUpperCase(), Brand: brand.brandName };
}

function drawProduct(context, random, seed, palette) {
  appHeader(context, "PERSONALIZATION ORDER / READY FOR PRODUCTION", seed, palette, false);
  text(context, "MIRA / EDITION 042", 42, 119, 32, "#171922", 820);
  mono(context, "RESTORABLE ORDER ID", 1238, 112, 11, "#746e64", "right");
  signal(context, random, 42, 148, 1196, 512, palette, 12);
  const cardBg = "#f7f2e7";
  roundRect(context, 88, 190, 360, 410, 18, cardBg, "#ffffff99", 2);
  mono(context, "PERSONAL / 042", 118, 226, 11, "#6f6960");
  text(context, "MIRA", 118, 288, 54, "#171922", 850);
  line(context, 118, 315, 416, 315, "#c8c0b4");
  const motifRandom = stream(seed, "application/product/motif");
  for (let index = 0; index < 7; index += 1) {
    const radius = 24 + motifRandom() * 68;
    context.strokeStyle = `${palette[index % 3]}cc`;
    context.lineWidth = 7 + motifRandom() * 15;
    context.beginPath();
    context.arc(270, 420, radius, motifRandom() * TAU, motifRandom() * TAU + Math.PI * 1.25);
    context.stroke();
  }
  mono(context, `ORDER ${seed.slice(2, 10).toUpperCase()}`, 118, 565, 11, "#6f6960");

  context.save();
  context.translate(605, 205);
  context.fillStyle = "#f6f0e5";
  context.beginPath();
  context.moveTo(0, 75);
  context.lineTo(210, 0);
  context.lineTo(356, 80);
  context.lineTo(150, 160);
  context.closePath();
  context.fill();
  context.fillStyle = "#ded6c7";
  context.beginPath();
  context.moveTo(150, 160);
  context.lineTo(356, 80);
  context.lineTo(356, 300);
  context.lineTo(150, 390);
  context.closePath();
  context.fill();
  context.fillStyle = "#fffaf0";
  context.beginPath();
  context.moveTo(0, 75);
  context.lineTo(150, 160);
  context.lineTo(150, 390);
  context.lineTo(0, 290);
  context.closePath();
  context.fill();
  context.strokeStyle = palette[0];
  context.lineWidth = 18;
  context.beginPath();
  context.moveTo(24, 125);
  context.bezierCurveTo(84, 96, 86, 260, 126, 320);
  context.stroke();
  mono(context, "MIRA", 28, 272, 18, "#171922");
  context.restore();

  roundRect(context, 1020, 180, 170, 420, 64, "#ece6dc", "#ffffffaa", 2);
  roundRect(context, 1038, 242, 134, 238, 18, "#171922");
  signal(context, random, 1048, 252, 114, 218, palette, 5);
  mono(context, "MIRA", 1105, 514, 13, "#171922", "center");
  mono(context, "BATCH 042", 1105, 536, 9, "#746e64", "center");
  mono(context, "PRINT SVG", 42, 698, 11, "#6f6960");
  mono(context, "PACKAGE MOCKUP", 605, 698, 11, "#6f6960");
  mono(context, "LABEL SYSTEM", 1020, 698, 11, "#6f6960");
  return { Customer: "MIRA", Batch: "042", Restore: "READY" };
}

function drawData(context, random, seed, palette) {
  appHeader(context, "ANNUAL SIGNAL / 2026 REPORT", seed, palette, true);
  const growth = 18 + Math.floor(random() * 29);
  const active = 62 + Math.floor(random() * 34);
  const regions = 8 + Math.floor(random() * 9);
  const risk = 8 + Math.floor(random() * 24);
  roundRect(context, 42, 94, 320, 616, 22, "#eef0e8");
  mono(context, "ANNUAL REPORT / 2026", 70, 134, 11, "#61665f");
  text(context, "SIGNAL", 70, 222, 48, "#11151b", 860);
  text(context, "IN MOTION", 70, 268, 48, "#11151b", 860);
  signal(context, random, 70, 305, 264, 280, palette, 8);
  mono(context, `DATA SEED ${seed.slice(2, 8).toUpperCase()}`, 70, 654, 10, "#61665f");

  roundRect(context, 386, 94, 852, 616, 22, "#101723", "#29364a", 2);
  mono(context, "EXECUTIVE DASHBOARD", 416, 132, 11, "#7f8da4");
  const metrics = [["GROWTH", `+${growth}%`], ["ACTIVE", `${active}K`], ["REGIONS", String(regions)], ["RISK", `${risk}%`]];
  metrics.forEach(([label, value], index) => {
    const x = 416 + index * 194;
    roundRect(context, x, 154, 170, 100, 14, "#161f2e");
    mono(context, label, x + 18, 184, 10, "#75839a");
    text(context, value, x + 18, 230, 30, index === 3 ? palette[0] : "#f2f6ff", 820);
  });

  roundRect(context, 416, 280, 506, 390, 16, "#121b29");
  mono(context, "12 MONTH TRAJECTORY", 440, 315, 10, "#75839a");
  const points = Array.from({ length: 12 }, (_, index) => ({ x: 448 + index * 40, y: 600 - random() * 220 - index * 5 }));
  context.beginPath();
  points.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
  context.strokeStyle = palette[1];
  context.lineWidth = 4;
  context.stroke();
  points.forEach((point) => {
    glowCircle(context, point.x, point.y, 16, palette[1], 0.42);
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(point.x, point.y, 3.5, 0, TAU);
    context.fill();
  });
  for (let index = 0; index < 5; index += 1) line(context, 440, 360 + index * 58, 896, 360 + index * 58, "#223047");

  roundRect(context, 946, 280, 264, 390, 16, "#121b29");
  mono(context, "REGION MIX", 970, 315, 10, "#75839a");
  for (let index = 0; index < 7; index += 1) {
    const value = 0.22 + random() * 0.76;
    mono(context, `R${String(index + 1).padStart(2, "0")}`, 970, 358 + index * 41, 9, "#8a97aa");
    roundRect(context, 1008, 344 + index * 41, 172, 18, 9, "#202b3d");
    roundRect(context, 1008, 344 + index * 41, 172 * value, 18, 9, palette[index % 3]);
  }
  return { Growth: `+${growth}%`, Active: `${active}K`, Regions: String(regions), Risk: `${risk}%` };
}

function drawMedia(context, random, seed, palette) {
  appHeader(context, "EDITORIAL SERIES / EPISODE 028", seed, palette, true);
  campaignArtwork(context, random, 42, 100, 430, 430, palette, BRAND_DEFAULTS, false);
  roundRect(context, 42, 552, 430, 158, 18, "#131a27", "#2c394e");
  text(context, "THE SIGNAL ROOM", 66, 592, 22, "#f2f5fb", 780);
  mono(context, "EP 028 · WITH LIN ZHOU", 66, 620, 10, palette[1]);
  line(context, 66, 658, 438, 658, "#3a4658", 4);
  line(context, 66, 658, 276, 658, palette[0], 4);
  text(context, "▶", 66, 690, 22, "#ffffff", 700);
  mono(context, "18:24 / 42:10", 438, 686, 10, "#8793a7", "right");

  roundRect(context, 504, 100, 734, 328, 20, "#111620", "#2b374a");
  signal(context, random, 518, 114, 706, 300, palette, 8);
  roundRect(context, 538, 132, 98, 30, 15, "#0c1018cc");
  mono(context, "EPISODE 28", 587, 152, 9, "#ffffff", "center");
  text(context, "CAN CODE", 548, 324, 42, "#ffffff", 850);
  text(context, "HAVE A MEMORY?", 548, 366, 42, "#ffffff", 850);
  roundRect(context, 1082, 346, 114, 42, 21, palette[0]);
  mono(context, "WATCH 14:08", 1139, 372, 10, "#11131a", "center");

  mono(context, "NEXT ASSETS", 504, 468, 11, "#7e8b9f");
  for (let index = 0; index < 3; index += 1) {
    const x = 504 + index * 250;
    roundRect(context, x, 492, 224, 162, 14, "#131b29");
    signal(context, random, x + 8, 500, 208, 104, palette, 3);
    mono(context, `EP 0${29 + index}`, x + 16, 628, 9, "#c9d0dc");
  }
  mono(context, "1:1 PODCAST", 42, 742, 10, "#7e8b9f");
  mono(context, "16:9 VIDEO", 504, 742, 10, "#7e8b9f");
  return { Episode: "028", Assets: "5", Identity: "LOCKED" };
}

function drawIdentity(context, random, seed, palette) {
  appHeader(context, "PROFILE SYSTEM / USER IDENTITY", seed, palette, false);
  roundRect(context, 42, 96, 360, 614, 26, "#111722");
  signal(context, random, 58, 112, 328, 216, palette, 7);
  glowCircle(context, 222, 300, 82, palette[1], 0.8);
  context.fillStyle = "#f5f0e7";
  context.beginPath();
  context.arc(222, 300, 52, 0, TAU);
  context.fill();
  text(context, "YL", 222, 316, 38, "#151922", 850, "center");
  text(context, "YUN LI", 222, 388, 28, "#f0f4fb", 820, "center");
  mono(context, "LEVEL 27 · EXPLORER", 222, 416, 10, palette[2], "center");
  [["WORLDS", "128"], ["BADGES", "16"], ["STREAK", "42D"]].forEach(([label, value], index) => {
    const x = 72 + index * 102;
    mono(context, label, x, 496, 8, "#78869b", "center");
    text(context, value, x, 530, 20, "#f1f5fc", 760, "center");
  });
  roundRect(context, 72, 570, 300, 82, 18, "#192334", palette[1], 1.5);
  mono(context, "PROFILE SEED", 92, 600, 9, "#7f8da1");
  mono(context, seed.slice(2, 18).toUpperCase(), 92, 627, 12, "#f4f7fc");

  roundRect(context, 430, 96, 808, 286, 24, "#f7f2e8", "#d7d0c4");
  mono(context, "MEMBERSHIP CARD / AURORA", 462, 134, 10, "#6f6960");
  signal(context, random, 454, 154, 760, 202, palette, 9);
  text(context, "AURORA", 480, 246, 44, "#ffffff", 850);
  mono(context, "MEMBER 0027", 480, 322, 12, "#ffffff");
  mono(context, "VALID ACROSS DEVICES", 1184, 322, 10, "#ffffff", "right");

  roundRect(context, 430, 410, 492, 300, 24, "#f7f2e8", "#d7d0c4");
  mono(context, "ACHIEVEMENT BADGES", 462, 448, 10, "#6f6960");
  for (let index = 0; index < 4; index += 1) {
    const x = 494 + index * 104;
    glowCircle(context, x, 540, 54, palette[index % 3], 0.42);
    context.fillStyle = "#151922";
    context.beginPath();
    for (let point = 0; point < 6; point += 1) {
      const angle = -Math.PI / 2 + point * TAU / 6;
      const px = x + Math.cos(angle) * 34;
      const py = 540 + Math.sin(angle) * 34;
      point ? context.lineTo(px, py) : context.moveTo(px, py);
    }
    context.closePath();
    context.fill();
    mono(context, String(index + 1).padStart(2, "0"), x, 546, 12, "#ffffff", "center");
  }
  mono(context, "ORIGIN", 494, 624, 9, "#6f6960", "center");
  mono(context, "STREAK", 598, 624, 9, "#6f6960", "center");
  mono(context, "MAKER", 702, 624, 9, "#6f6960", "center");
  mono(context, "RARE", 806, 624, 9, "#6f6960", "center");

  roundRect(context, 950, 410, 288, 300, 24, "#111722");
  mono(context, "THEME TOKENS", 978, 448, 10, "#7b899d");
  palette.slice(0, 3).forEach((color, index) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(998 + index * 72, 510, 24, 0, TAU);
    context.fill();
  });
  [["SURFACE", "#111722"], ["ACCENT", palette[0]], ["SIGNAL", palette[1]], ["STATUS", palette[2]]].forEach(([label, value], index) => {
    mono(context, label, 978, 586 + index * 27, 9, "#7b899d");
    mono(context, value.toUpperCase(), 1208, 586 + index * 27, 9, "#e7ecf4", "right");
  });
  return { Level: "27", Badges: "16", Theme: "AURORA" };
}

const DRAWERS = { game: drawGame, brand: drawBrand, product: drawProduct, data: drawData, media: drawMedia, identity: drawIdentity };

function brandPalette(input) {
  const brand = normalizeBrandInputs(input);
  return [brand.primary, brand.accent, "#f7e7c8", "#11121c"];
}

export function renderBrandComparison(canvas, hash, input = {}, mode = "stable") {
  const seed = normalizeHash(hash);
  const brand = normalizeBrandInputs(input);
  const palette = brandPalette(brand);
  const random = mode === "broken" ? Math.random : stream(seed, "brand-comparison/stable");
  canvas.width = 640;
  canvas.height = 360;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas 2D context unavailable");
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "#10131a";
  context.fillRect(0, 0, 640, 360);
  signal(context, random, 0, 0, 640, 360, palette, 7);
  roundRect(context, 24, 22, 110, 28, 14, "#090c12bb");
  mono(context, mode === "stable" ? "SEEDED STREAM" : "MATH.RANDOM", 79, 41, 9, "#ffffff", "center");
  mono(context, brand.campaignId.toUpperCase(), 30, 86, 11, "#ffffff");
  const lines = headlineLines(brand.headline.toUpperCase());
  lines.slice(0, 2).forEach((value, index) => text(context, value, 30, 226 + index * 48, value.length > 16 ? 34 : 46, "#ffffff", 850));
  mono(context, `${brand.brandName.toUpperCase()} / CHANNEL PREVIEW`, 30, 330, 10, "#ffffffcc");
  return { seed, brand, mode };
}

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]);
}

export function buildBrandSvg(hash, input = {}) {
  const seed = normalizeHash(hash);
  const brand = normalizeBrandInputs(input);
  const random = stream(seed, "brand-export/svg");
  const lines = headlineLines(brand.headline.toUpperCase());
  const paths = Array.from({ length: 6 }, (_, index) => {
    const y1 = Math.round(160 + random() * 520);
    const c1 = Math.round(260 + random() * 260);
    const c2 = Math.round(850 + random() * 320);
    const y2 = Math.round(120 + random() * 620);
    const color = index % 2 ? brand.accent : brand.primary;
    const width = Math.round(8 + random() * 24);
    return `<path d="M-80 ${y1} C${c1} ${y1 - 260}, ${c2} ${y2 + 260}, 1680 ${y2}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${(0.34 + random() * 0.5).toFixed(2)}"/>`;
  }).join("");
  const headline = lines.slice(0, 2).map((lineValue, index) => `<text x="90" y="${570 + index * 104}" fill="#fff" font-family="Arial, sans-serif" font-size="92" font-weight="800">${escapeXml(lineValue)}</text>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="${escapeXml(brand.headline)} campaign visual">
  <defs>
    <radialGradient id="g1" cx="20%" cy="30%" r="85%"><stop stop-color="${brand.primary}"/><stop offset="1" stop-color="#11131a"/></radialGradient>
    <radialGradient id="g2" cx="80%" cy="70%" r="70%"><stop stop-color="${brand.accent}" stop-opacity=".85"/><stop offset="1" stop-color="#11131a" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1600" height="900" rx="44" fill="#11131a"/>
  <rect width="1600" height="900" rx="44" fill="url(#g1)" opacity=".82"/>
  <rect width="1600" height="900" rx="44" fill="url(#g2)"/>
  ${paths}
  <text x="92" y="108" fill="#fff" font-family="monospace" font-size="24" font-weight="700">${escapeXml(brand.campaignId.toUpperCase())}</text>
  ${headline}
  <text x="92" y="838" fill="#fff" opacity=".82" font-family="monospace" font-size="22">${escapeXml(brand.brandName.toUpperCase())} / SEED ${escapeXml(seed.slice(2, 14).toUpperCase())}</text>
</svg>`;
}

export function buildBrandManifest(hash, input = {}, digest = "") {
  const seed = normalizeHash(hash);
  const brand = normalizeBrandInputs(input);
  return {
    schema: "genart-brand-manifest/v1",
    seed,
    inputs: brand,
    outputs: [
      { id: "desktop-kv", format: "svg", aspect: "16:9", file: "desktop-kv.svg" },
      { id: "story", format: "png", aspect: "9:16", file: "story-9x16.png" },
      { id: "commerce-card", format: "png", aspect: "1:1", file: "product-card.png" },
    ],
    pixelDigest: digest,
    deterministic: true,
    streams: ["application/brand", "application/brand/palette", "brand-export/svg"],
  };
}

export function renderApplication(canvas, id, hash, options = {}) {
  if (!APPLICATIONS[id]) throw new Error(`Unknown application: ${id}`);
  const seed = normalizeHash(hash);
  const random = stream(seed, `application/${id}`);
  const palette = id === "brand" ? brandPalette(options) : pick(stream(seed, `application/${id}/palette`), PALETTES);
  const context = setup(canvas);
  const features = DRAWERS[id](context, random, seed, palette, options);
  return { id, seed, palette, features, inputs: id === "brand" ? normalizeBrandInputs(options) : null };
}
