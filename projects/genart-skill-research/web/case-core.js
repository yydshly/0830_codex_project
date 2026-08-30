import { deriveHashes, normalizeHash, stream } from "./genart-core.js";

export const CASE_HASH = `0x${"c0de".repeat(16)}`;

const TAU = Math.PI * 2;

function pick(random, values) {
  return values[Math.floor(random() * values.length) % values.length];
}

export function routeBugFor(inputHash) {
  const hash = normalizeHash(inputHash);
  return Number.parseInt(hash.slice(-2), 16) % 13 === 1;
}

export function caseTraits(inputHash) {
  const hash = normalizeHash(inputHash);
  const world = stream(hash, "case:world");
  const enemy = stream(hash, "case:enemy");
  const loot = stream(hash, "case:loot");
  const vfx = stream(hash, "case:vfx");
  const enemySpecies = pick(enemy, ["Mire Stalker", "Glass Hound", "Ash Warden", "Vault Moth"]);
  const lootType = pick(loot, ["Rare Ward", "Echo Blade", "Ember Relic", "Verdant Bow"]);
  return {
    world: {
      biome: pick(world, ["Ashen Vault", "Moss Archive", "Salt Engine", "Ember Mine"]),
      topology: pick(world, ["Branching", "Looped", "Hub-and-spoke"]),
      threat: 3 + Math.floor(world() * 6),
    },
    enemy: {
      species: enemySpecies,
      level: 8 + Math.floor(enemy() * 23),
      id: `${enemySpecies.replaceAll(" ", "-").toUpperCase()}-${Math.floor(enemy() * 65535).toString(16).padStart(4, "0")}`,
      accent: pick(enemy, ["#56e0a2", "#6ebaff", "#ff755f", "#bd83ff"]),
    },
    loot: {
      type: lootType,
      rarity: lootType.includes("Rare") ? "Rare" : pick(loot, ["Rare", "Epic", "Legendary"]),
      id: `DROP-${Math.floor(loot() * 0xffffff).toString(16).padStart(6, "0").toUpperCase()}`,
    },
    vfx: {
      atmosphere: pick(vfx, ["Blue Fog", "Ember Dust", "Spore Drift", "Cold Static"]),
      intensity: 0.2 + vfx() * 0.5,
    },
  };
}

function setup(canvas) {
  canvas.width = 1120;
  canvas.height = 720;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas 2D context unavailable");
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "#070c12";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";
  return context;
}

function drawPlayer(context, x, y) {
  context.save();
  context.translate(x, y);
  context.fillStyle = "#eef6ff";
  context.strokeStyle = "#66a9ff";
  context.lineWidth = 3;
  context.beginPath();
  context.arc(0, -8, 9, 0, TAU);
  context.fill();
  context.beginPath();
  context.moveTo(0, 2);
  context.lineTo(0, 24);
  context.moveTo(-13, 12);
  context.lineTo(13, 12);
  context.moveTo(0, 24);
  context.lineTo(-10, 38);
  context.moveTo(0, 24);
  context.lineTo(10, 38);
  context.stroke();
  context.restore();
}

function drawEnemy(context, x, y, traits) {
  context.save();
  context.translate(x, y);
  context.fillStyle = `${traits.accent}24`;
  context.strokeStyle = traits.accent;
  context.lineWidth = 3;
  context.beginPath();
  context.ellipse(0, 0, 31, 24, 0, 0, TAU);
  context.fill();
  context.stroke();
  for (const side of [-1, 1]) {
    context.beginPath();
    context.moveTo(side * 18, -15);
    context.lineTo(side * 34, -34);
    context.stroke();
  }
  context.fillStyle = traits.accent;
  for (const xOffset of [-11, 0, 11]) {
    context.beginPath();
    context.arc(xOffset, -2, 3, 0, TAU);
    context.fill();
  }
  context.restore();
}

function drawLoot(context, x, y, rarity) {
  const accent = rarity === "Legendary" ? "#ffba52" : rarity === "Epic" ? "#bd83ff" : "#65b9ff";
  context.save();
  context.translate(x, y);
  context.fillStyle = "#101b27";
  context.strokeStyle = accent;
  context.lineWidth = 3;
  context.fillRect(-21, -13, 42, 30);
  context.strokeRect(-21, -13, 42, 30);
  context.beginPath();
  context.arc(0, -13, 21, Math.PI, TAU);
  context.stroke();
  context.fillStyle = accent;
  context.fillRect(-3, -2, 6, 9);
  context.restore();
}

export function renderCase(canvas, inputHash, version = "release") {
  const hash = normalizeHash(inputHash);
  const traits = caseTraits(hash);
  const layout = stream(hash, "case:layout");
  const particles = stream(hash, "case:vfx:particles");
  const context = setup(canvas);
  const releaseBug = routeBugFor(hash);
  const blocked = version === "release" && releaseBug;

  const palette = {
    "Blue Fog": ["#07101b", "#173554", "#6ebaff"],
    "Ember Dust": ["#130c0b", "#4a241a", "#ff755f"],
    "Spore Drift": ["#07120e", "#15392c", "#56e0a2"],
    "Cold Static": ["#0b0e16", "#29334a", "#a8bcff"],
  }[traits.vfx.atmosphere];
  context.fillStyle = palette[0];
  context.fillRect(0, 0, 1120, 720);

  context.strokeStyle = `${palette[2]}20`;
  context.lineWidth = 1;
  for (let x = 38; x < 1080; x += 34) {
    context.beginPath();
    context.moveTo(x, 76);
    context.lineTo(x, 628);
    context.stroke();
  }
  for (let y = 84; y < 640; y += 34) {
    context.beginPath();
    context.moveTo(38, y);
    context.lineTo(1082, y);
    context.stroke();
  }

  const rooms = Array.from({ length: 9 }, (_, index) => ({
    x: 86 + index * 111 + (layout() - 0.5) * 34,
    y: 190 + layout() * 270,
    width: 74 + layout() * 44,
    height: 68 + layout() * 54,
  }));
  const centers = rooms.map((room) => [room.x + room.width / 2, room.y + room.height / 2]);
  const gateIndex = 5;

  context.strokeStyle = palette[1];
  context.lineWidth = 22;
  context.globalAlpha = 0.62;
  for (let index = 1; index < centers.length; index += 1) {
    const [fromX, fromY] = centers[index - 1];
    const [toX, toY] = centers[index];
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo((fromX + toX) / 2, fromY);
    context.lineTo((fromX + toX) / 2, toY);
    context.lineTo(toX, toY);
    context.stroke();
  }
  context.globalAlpha = 1;

  rooms.forEach((room, index) => {
    context.fillStyle = "#0d1924";
    context.strokeStyle = index === 0 ? "#6ebaff" : index === rooms.length - 1 ? "#56e0a2" : "#56728a";
    context.lineWidth = index === 0 || index === rooms.length - 1 ? 3 : 1.5;
    context.fillRect(room.x, room.y, room.width, room.height);
    context.strokeRect(room.x, room.y, room.width, room.height);
    context.fillStyle = context.strokeStyle;
    context.beginPath();
    context.arc(room.x + 12, room.y + 12, 3, 0, TAU);
    context.fill();
  });

  for (let index = 0; index < 80; index += 1) {
    context.fillStyle = palette[2];
    context.globalAlpha = traits.vfx.intensity * (0.18 + particles() * 0.48);
    context.beginPath();
    context.arc(42 + particles() * 1036, 92 + particles() * 520, 1 + particles() * 3, 0, TAU);
    context.fill();
  }
  context.globalAlpha = 1;

  const player = centers[0];
  const enemy = centers[4];
  const chest = centers[2];
  const exit = centers.at(-1);
  drawPlayer(context, player[0], player[1]);
  drawEnemy(context, enemy[0], enemy[1], traits.enemy);
  drawLoot(context, chest[0], chest[1], traits.loot.rarity);

  context.fillStyle = "#56e0a2";
  context.font = "800 12px ui-monospace, monospace";
  context.textAlign = "center";
  context.fillText("EXIT", exit[0], exit[1] + 4);
  context.textAlign = "left";

  const gateFrom = centers[gateIndex - 1];
  const gateTo = centers[gateIndex];
  const gateX = (gateFrom[0] + gateTo[0]) / 2;
  const gateY = (gateFrom[1] + gateTo[1]) / 2;
  if (blocked) {
    context.strokeStyle = "#ff5f58";
    context.lineWidth = 12;
    context.beginPath();
    context.moveTo(gateX - 22, gateY - 28);
    context.lineTo(gateX + 22, gateY + 28);
    context.moveTo(gateX + 22, gateY - 28);
    context.lineTo(gateX - 22, gateY + 28);
    context.stroke();
    context.fillStyle = "#ff5f58";
    context.font = "800 12px ui-monospace, monospace";
    context.fillText("SEALED EXIT / ROOM 07", gateX - 76, gateY - 42);
  } else {
    context.strokeStyle = "#56e0a2";
    context.lineWidth = 5;
    context.beginPath();
    context.arc(gateX, gateY, 18, 0, TAU);
    context.stroke();
    context.beginPath();
    context.moveTo(gateX - 8, gateY);
    context.lineTo(gateX - 1, gateY + 8);
    context.lineTo(gateX + 11, gateY - 9);
    context.stroke();
  }

  context.fillStyle = "#080d13dd";
  context.fillRect(34, 28, 1052, 54);
  context.fillStyle = blocked ? "#ff7168" : "#56e0a2";
  context.font = "800 13px ui-monospace, monospace";
  context.fillText(blocked ? "LIVE INCIDENT · ROUTE BLOCKED" : "CANDIDATE BUILD · ROUTE PASS", 54, 61);
  context.textAlign = "right";
  context.fillStyle = "#9aabba";
  context.fillText(`${version.toUpperCase()} / ${hash.slice(0, 12)}…${hash.slice(-6)}`, 1064, 61);
  context.textAlign = "left";

  context.fillStyle = "#080d13e8";
  context.fillRect(34, 634, 1052, 60);
  context.fillStyle = "#9aabba";
  context.font = "11px ui-monospace, monospace";
  context.fillText(`WORLD  ${traits.world.biome} / THREAT ${traits.world.threat}`, 54, 660);
  context.fillText(`ENEMY  ${traits.enemy.id}`, 390, 660);
  context.fillText(`LOOT  ${traits.loot.id}`, 748, 660);
  context.fillStyle = palette[2];
  context.fillText(`VFX  ${traits.vfx.atmosphere}`, 54, 681);

  return {
    hash,
    version,
    blocked,
    features: {
      World: `${traits.world.biome} · T${traits.world.threat}`,
      Enemy: `${traits.enemy.species} · Lv.${traits.enemy.level}`,
      Loot: `${traits.loot.rarity} · ${traits.loot.type}`,
      Atmosphere: traits.vfx.atmosphere,
      Route: blocked ? "BLOCKED" : "PASS",
    },
    identities: { enemy: traits.enemy.id, loot: traits.loot.id },
  };
}

export function auditCaseRoutes(count = 10000, seedOfSeeds = CASE_HASH) {
  const hashes = deriveHashes(count, seedOfSeeds);
  const releaseBlocked = hashes.reduce((total, hash) => total + Number(routeBugFor(hash)), 0);
  return { total: hashes.length, releaseBlocked, fixedBlocked: 0 };
}
