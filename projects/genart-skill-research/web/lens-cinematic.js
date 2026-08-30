import { normalizeHash, stream } from "./genart-core.js";
import { LENSES } from "./lens-core.js";

const WIDTH = 1280;
const HEIGHT = 760;
const TAU = Math.PI * 2;

const palettes = {
  support: ["#5bc0ff", "#ff5c58", "#ffd07a", "#4ee0a5"],
  art: ["#ff4f91", "#9a72ff", "#4bcfff", "#ffb65e"],
  engineering: ["#55bdff", "#8c74ff", "#4ee0a5", "#ff5c58"],
  qa: ["#45f0b3", "#51a8ff", "#ff5f65", "#edf5ff"],
  production: ["#ffbd64", "#ff5e7d", "#6b8cff", "#4ee0c2"],
  boundary: ["#a77bff", "#48c8ff", "#ff5b71", "#55e0a4"],
};

function between(random, min, max) {
  return min + random() * (max - min);
}

function line(ctx, x1, y1, x2, y2, color, width = 1, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function glow(ctx, x, y, radius, color, core = "#ffffff", alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, core);
  gradient.addColorStop(0.08, color);
  gradient.addColorStop(0.36, `${color}80`);
  gradient.addColorStop(1, `${color}00`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function ring(ctx, x, y, rx, ry, color, rotation = 0, width = 2, alpha = 0.8) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function text(ctx, value, x, y, size = 14, color = "#dce9f5", align = "left", weight = 700) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(value, x, y);
  ctx.restore();
}

function panel(ctx, x, y, width, height, stroke = "#41566b", fill = "#0a1019d9") {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
}

function background(ctx, random, colors) {
  const wash = ctx.createRadialGradient(930, 330, 20, 850, 380, 720);
  wash.addColorStop(0, `${colors[0]}26`);
  wash.addColorStop(0.42, `${colors[1]}12`);
  wash.addColorStop(1, "#03060b00");
  ctx.fillStyle = "#03060b";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (let index = 0; index < 180; index += 1) {
    const x = between(random, 0, WIDTH);
    const y = between(random, 0, HEIGHT);
    const radius = between(random, 0.4, 2.2);
    ctx.globalAlpha = between(random, 0.15, 0.75);
    ctx.fillStyle = colors[index % colors.length];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "#22324466";
  ctx.lineWidth = 1;
  for (let x = 40; x < WIDTH; x += 80) line(ctx, x, 0, x, HEIGHT, "#223244", 1, 0.22);
  for (let y = 40; y < HEIGHT; y += 80) line(ctx, 0, y, WIDTH, y, "#223244", 1, 0.22);
}

function seedCore(ctx, random, x, y, colors, scale = 1) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  glow(ctx, x, y, 150 * scale, colors[0], "#ffffff", 0.92);
  glow(ctx, x, y, 84 * scale, colors[1], "#ffffff", 0.9);
  for (let index = 0; index < 5; index += 1) {
    ring(
      ctx,
      x,
      y,
      (96 + index * 24) * scale,
      (30 + index * 12) * scale,
      colors[index % colors.length],
      between(random, -1.1, 1.1),
      index === 0 ? 3 : 1.5,
      0.72,
    );
  }
  for (let index = 0; index < 22; index += 1) {
    const angle = between(random, 0, TAU);
    const distance = between(random, 82, 210) * scale;
    const px = x + Math.cos(angle) * distance;
    const py = y + Math.sin(angle) * distance * 0.48;
    glow(ctx, px, py, between(random, 5, 13) * scale, colors[index % colors.length], "#ffffff", 0.8);
  }
  ctx.restore();
}

function drawSupport(ctx, random, colors) {
  seedCore(ctx, random, 930, 360, colors, 1.05);
  ctx.save();
  ctx.translate(650, 360);
  ctx.rotate(-0.08);
  for (let index = 0; index < 8; index += 1) {
    const x = index * 70;
    const y = Math.sin(index * 1.2) * 75;
    line(ctx, x, y, x + 70, Math.sin((index + 1) * 1.2) * 75, colors[0], 10, 0.16);
    line(ctx, x, y, x + 70, Math.sin((index + 1) * 1.2) * 75, colors[0], 2.5, 0.95);
    glow(ctx, x, y, 16, index === 5 ? colors[1] : colors[0], "#ffffff", 0.92);
  }
  ctx.restore();

  const rooms = [
    [500, 170, 116, 84, colors[0], "PLAYER"],
    [638, 258, 126, 94, colors[2], "LOOT"],
    [770, 166, 132, 98, colors[3], "ENEMY"],
    [894, 486, 160, 104, colors[1], "ROOM 07"],
  ];
  rooms.forEach(([x, y, w, h, color, name]) => {
    panel(ctx, x, y, w, h, color, "#07101acc");
    glow(ctx, x + 22, y + 22, 13, color, "#ffffff", 0.9);
    text(ctx, name, x + 18, y + h - 18, 11, color);
  });
  line(ctx, 1036, 510, 1116, 468, colors[1], 16, 0.15);
  line(ctx, 1036, 510, 1116, 468, colors[1], 3, 1);
  glow(ctx, 1118, 468, 60, colors[1], "#ffffff", 0.88);
  text(ctx, "BLOCKED EXIT", 1118, 546, 13, colors[1], "center", 800);
  text(ctx, "ONE SEED REBUILDS THE WHOLE INCIDENT", 470, 666, 15, "#b9ccdc");
}

function drawArt(ctx, random, colors) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let index = 0; index < 26; index += 1) {
    const color = colors[index % colors.length];
    const startY = between(random, 60, 700);
    const amplitude = between(random, 70, 240);
    const phase = between(random, 0, TAU);
    ctx.globalAlpha = between(random, 0.22, 0.72);
    ctx.strokeStyle = color;
    ctx.lineWidth = between(random, 1.2, 6.5);
    ctx.shadowColor = color;
    ctx.shadowBlur = between(random, 8, 28);
    ctx.beginPath();
    ctx.moveTo(330, startY);
    for (let x = 330; x <= 1320; x += 34) {
      const t = (x - 330) / 990;
      const y = startY + Math.sin(t * between(random, 4, 8) + phase) * amplitude * (0.22 + t * 0.5);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
  seedCore(ctx, random, 920, 350, colors, 0.78);
  for (let index = 0; index < 5; index += 1) {
    const x = 420 + index * 62;
    glow(ctx, x, 618, 32, colors[index % colors.length], "#ffffff", 0.88);
  }
  text(ctx, "PALETTE / SILHOUETTE / ATMOSPHERE", 420, 674, 14, "#d8e6f2");
  text(ctx, "ART IDENTITY", 1160, 120, 13, colors[0], "right", 800);
}

function drawEngineering(ctx, random, colors) {
  seedCore(ctx, random, 690, 370, colors, 0.78);
  const nodes = [
    [1010, 155, "WORLD", "ROUTE v1.4.3", colors[3], "CHANGED"],
    [1085, 318, "ENEMY", "VAULT-MOTH", colors[0], "PRESERVED"],
    [1030, 490, "LOOT", "DROP-FAE7E1", colors[1], "PRESERVED"],
    [830, 620, "VFX", "COLD STATIC", colors[2], "PRESERVED"],
  ];
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  nodes.forEach(([x, y, name, value, color, status], index) => {
    const angle = Math.atan2(y - 370, x - 690);
    const startX = 690 + Math.cos(angle) * 120;
    const startY = 370 + Math.sin(angle) * 60;
    line(ctx, startX, startY, x, y, color, index === 0 ? 5 : 2.5, index === 0 ? 1 : 0.72);
    glow(ctx, x, y, index === 0 ? 54 : 38, color, "#ffffff", 0.82);
    panel(ctx, x - 110, y - 36, 220, 72, color, "#07101aee");
    text(ctx, name, x - 92, y - 12, 11, color);
    text(ctx, value, x - 92, y + 14, 14, "#f3f8ff", "left", 800);
    text(ctx, status, x + 92, y - 12, 9, color, "right", 800);
  });
  ctx.restore();
  text(ctx, "ROOT SEED", 690, 362, 12, "#dce8f3", "center");
  text(ctx, "1 / 4 STREAMS CHANGED", 430, 660, 16, colors[2], "left", 800);
}

function miniWorld(ctx, random, x, y, color, failed = false) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  glow(ctx, x, y, 42, failed ? "#ff5f65" : color, "#ffffff", failed ? 0.9 : 0.55);
  for (let index = 0; index < 3; index += 1) {
    ring(ctx, x, y, 26 + index * 8, 10 + index * 4, color, between(random, -1, 1), 1.2, 0.62);
  }
  ctx.restore();
  if (failed) {
    line(ctx, x - 13, y - 13, x + 13, y + 13, "#ffffff", 3);
    line(ctx, x + 13, y - 13, x - 13, y + 13, "#ffffff", 3);
  }
}

function drawQa(ctx, random, colors) {
  const positions = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 5; col += 1) positions.push([490 + col * 150, 170 + row * 180]);
  }
  positions.forEach(([x, y], index) => miniWorld(ctx, random, x, y, colors[index % 2], index === 3 || index === 11));
  const sweep = ctx.createLinearGradient(430, 0, 1200, 0);
  sweep.addColorStop(0, "#4ee0a500");
  sweep.addColorStop(0.5, "#4ee0a588");
  sweep.addColorStop(1, "#4ee0a500");
  ctx.fillStyle = sweep;
  ctx.fillRect(430, 86, 770, 12);
  ctx.fillRect(430, 640, 770, 4);
  text(ctx, "10,000 SEED SCAN", 470, 102, 15, colors[0], "left", 800);
  text(ctx, "RELEASE 809 BLOCKED", 470, 684, 13, colors[2]);
  text(ctx, "CANDIDATE 0 BLOCKED", 1160, 684, 13, colors[0], "right", 800);
  panel(ctx, 1010, 116, 172, 70, colors[0], "#07110fdd");
  text(ctx, "GATE PASS", 1096, 151, 17, colors[0], "center", 800);
}

function artworkFrame(ctx, random, x, y, width, height, colorA, colorB, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.shadowColor = colorA;
  ctx.shadowBlur = 28;
  panel(ctx, -width / 2, -height / 2, width, height, "#eaf4ff", "#080c13e8");
  ctx.beginPath();
  ctx.rect(-width / 2 + 10, -height / 2 + 10, width - 20, height - 20);
  ctx.clip();
  for (let index = 0; index < 9; index += 1) {
    ring(ctx, between(random, -width / 3, width / 3), between(random, -height / 3, height / 3), between(random, 18, 70), between(random, 8, 38), index % 2 ? colorA : colorB, between(random, -1, 1), between(random, 1, 4), 0.8);
  }
  ctx.restore();
}

function drawProduction(ctx, random, colors) {
  const frames = [
    [500, 280, 190, 270, -0.16],
    [690, 255, 220, 310, -0.06],
    [900, 260, 230, 320, 0.05],
    [1100, 300, 190, 270, 0.14],
  ];
  frames.forEach(([x, y, w, h, rotation], index) => artworkFrame(ctx, random, x, y, w, h, colors[index % colors.length], colors[(index + 1) % colors.length], rotation));
  const beam = ctx.createLinearGradient(380, 0, 1210, 0);
  beam.addColorStop(0, "#ffbd6400");
  beam.addColorStop(0.5, "#ffbd6499");
  beam.addColorStop(1, "#4ee0c200");
  ctx.fillStyle = beam;
  ctx.fillRect(360, 548, 860, 10);
  ["SEED", "TRAITS", "DIGEST", "AUDIT", "SHIP"].forEach((value, index) => {
    const x = 430 + index * 182;
    glow(ctx, x, 554, 18, colors[index % colors.length], "#ffffff", 0.9);
    text(ctx, value, x, 598, 11, colors[index % colors.length], "center", 800);
  });
  text(ctx, "REBUILDABLE EDITION WALL", 1180, 674, 14, "#dce8f3", "right", 800);
}

function drawBoundary(ctx, random, colors) {
  ctx.save();
  const split = ctx.createLinearGradient(420, 0, 1220, 0);
  split.addColorStop(0, "#87909a12");
  split.addColorStop(0.44, "#87909a08");
  split.addColorStop(0.46, `${colors[0]}18`);
  split.addColorStop(1, `${colors[1]}20`);
  ctx.fillStyle = split;
  ctx.fillRect(370, 70, 850, 620);
  ctx.restore();

  panel(ctx, 420, 210, 240, 330, "#647180", "#0b1017cc");
  text(ctx, "ONE-OFF IMAGE", 540, 574, 13, "#82909e", "center", 800);
  for (let index = 0; index < 8; index += 1) ring(ctx, 540, 370, 60 + index * 5, 24 + index * 2, "#71808f", between(random, -0.8, 0.8), 1, 0.28);

  seedCore(ctx, random, 950, 360, colors, 1.22);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let index = 0; index < 34; index += 1) {
    const angle = between(random, 0, TAU);
    const x = 950 + Math.cos(angle) * between(random, 180, 310);
    const y = 360 + Math.sin(angle) * between(random, 90, 240);
    glow(ctx, x, y, between(random, 3, 10), colors[index % colors.length], "#ffffff", 0.75);
    if (index % 3 === 0) line(ctx, 950, 360, x, y, colors[index % colors.length], 1, 0.2);
  }
  ctx.restore();
  text(ctx, "REPLAYABLE SERIES", 950, 674, 15, colors[3], "center", 800);
  text(ctx, "PROGRAMMATIC / SERIES / ACCOUNTABLE", 950, 84, 12, "#dce8f3", "center", 800);
  line(ctx, 690, 120, 690, 630, "#8194a6", 1.5, 0.4);
}

export function renderCinematicLens(canvas, id, hash) {
  const lensId = LENSES[id] ? id : "art";
  const normalized = normalizeHash(hash);
  const random = stream(normalized, `cinematic-lens:${lensId}`);
  const colors = palettes[lensId];
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  background(ctx, random, colors);
  if (lensId === "support") drawSupport(ctx, random, colors);
  if (lensId === "art") drawArt(ctx, random, colors);
  if (lensId === "engineering") drawEngineering(ctx, random, colors);
  if (lensId === "qa") drawQa(ctx, random, colors);
  if (lensId === "production") drawProduction(ctx, random, colors);
  if (lensId === "boundary") drawBoundary(ctx, random, colors);
  return { id: lensId, lens: LENSES[lensId] };
}
