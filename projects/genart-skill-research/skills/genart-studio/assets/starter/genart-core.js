const DEFAULT_HASH = `0x${"c0de".repeat(16)}`;

export const TRAITS = {
  Palette: [
    ["Ember", 45],
    ["Ash", 30],
    ["Verdant", 18],
    ["Aurora", 7],
  ],
  Density: [
    ["Sparse", 25],
    ["Balanced", 55],
    ["Dense", 20],
  ],
  Gesture: [
    ["Orbital", 42],
    ["Current", 36],
    ["Lattice", 22],
  ],
};

const PALETTES = {
  Ember: { background: "#120f0e", inks: ["#ff4b3e", "#ff8a3d", "#ffd7a5", "#f6365b"] },
  Ash: { background: "#0b1118", inks: ["#78b7ff", "#d8e8ff", "#3f7fc5", "#91d7ff"] },
  Verdant: { background: "#08130f", inks: ["#55e6a5", "#c0ffd9", "#159872", "#9ecb52"] },
  Aurora: { background: "#100c1d", inks: ["#ab78ff", "#ff5bbd", "#62e7ff", "#f5dd72"] },
};

const DENSITY_COUNTS = { Sparse: 90, Balanced: 210, Dense: 410 };

export function normalizeHash(value) {
  const clean = String(value ?? "").replace(/^0x/i, "").replace(/[^0-9a-f]/gi, "").toLowerCase();
  if (!clean) return DEFAULT_HASH;
  return `0x${clean.padStart(64, "0").slice(-64)}`;
}

export function randomHash() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes); // genart-allow: chooses which seed to view, never how it draws
  return `0x${[...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export function seedFromHash(hash) {
  const hex = normalizeHash(hash).slice(2);
  const state = new Uint32Array(4);
  for (let index = 0; index < 8; index += 1) {
    const word = Number.parseInt(hex.slice(index * 8, index * 8 + 8), 16) >>> 0;
    state[index % 4] = (Math.imul(state[index % 4] ^ word, 0x9e3779b1) + index) >>> 0;
  }
  if (!(state[0] | state[1] | state[2] | state[3])) state[3] = 1;
  return state;
}

export function sfc32(input) {
  let [a, b, c, d] = input;
  return () => {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    const total = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + total) | 0;
    return (total >>> 0) / 4294967296;
  };
}

function fnv1a(label) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < label.length; index += 1) {
    hash ^= label.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function stream(hash, label) {
  const base = seedFromHash(hash);
  const key = fnv1a(label);
  const mixed = [0, 1, 2, 3].map(
    (index) => (base[index] ^ Math.imul(key + index, 0x9e3779b1)) >>> 0,
  );
  if (!(mixed[0] | mixed[1] | mixed[2] | mixed[3])) mixed[3] = 1;
  const random = sfc32(mixed);
  for (let index = 0; index < 12; index += 1) random();
  return random;
}

function weighted(random, entries) {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let cursor = random() * total;
  for (const [value, weight] of entries) {
    cursor -= weight;
    if (cursor < 0) return value;
  }
  return entries.at(-1)[0];
}

export function featuresFor(hash, mode = "deterministic") {
  const random = mode === "broken" ? Math.random : stream(hash, "features");
  return Object.fromEntries(
    Object.entries(TRAITS).map(([trait, entries]) => [trait, weighted(random, entries)]),
  );
}

function setupCanvas(canvas, size, background) {
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas 2D context unavailable");
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = background;
  context.fillRect(0, 0, size, size);
  context.scale(size, size);
  context.lineCap = "round";
  context.lineJoin = "round";
  return context;
}

function drawOrbital(context, random, count, inks) {
  for (let index = 0; index < count; index += 1) {
    const x = random();
    const y = random();
    const radius = 0.008 + random() ** 2 * 0.13;
    const stretch = 0.55 + random() * 0.9;
    const rotation = random() * Math.PI;
    context.strokeStyle = inks[(random() * inks.length) | 0];
    context.globalAlpha = 0.46 + random() * 0.46;
    context.lineWidth = 0.0012 + random() * 0.0027;
    context.beginPath();
    context.ellipse(x, y, radius, radius * stretch, rotation, 0, Math.PI * 2);
    context.stroke();
  }
}

function drawCurrent(context, random, count, inks) {
  for (let index = 0; index < count; index += 1) {
    const x = random();
    const y = random();
    const span = 0.06 + random() * 0.22;
    const bend = (random() - 0.5) * 0.28;
    context.strokeStyle = inks[(random() * inks.length) | 0];
    context.globalAlpha = 0.42 + random() * 0.5;
    context.lineWidth = 0.001 + random() * 0.0032;
    context.beginPath();
    context.moveTo(x - span, y);
    context.bezierCurveTo(x - span * 0.3, y + bend, x + span * 0.3, y - bend, x + span, y);
    context.stroke();
  }
}

function drawLattice(context, random, count, inks) {
  for (let index = 0; index < count; index += 1) {
    const x = random();
    const y = random();
    const angle = ((random() * 6) | 0) * (Math.PI / 3);
    const length = 0.025 + random() * 0.15;
    context.strokeStyle = inks[(random() * inks.length) | 0];
    context.globalAlpha = 0.38 + random() * 0.5;
    context.lineWidth = 0.001 + random() * 0.0028;
    context.beginPath();
    context.moveTo(x - Math.cos(angle) * length, y - Math.sin(angle) * length);
    context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    context.stroke();
  }
}

export function renderArtwork(canvas, options = {}) {
  const hash = normalizeHash(options.hash);
  const mode = options.mode === "broken" ? "broken" : "deterministic";
  const size = Math.max(160, Math.min(1800, Number(options.size) || 720));
  const traits = featuresFor(hash, mode);
  const palette = PALETTES[traits.Palette];
  const random = mode === "broken" ? Math.random : stream(hash, "layout");
  const context = setupCanvas(canvas, size, palette.background);
  const count = DENSITY_COUNTS[traits.Density];

  if (traits.Gesture === "Orbital") drawOrbital(context, random, count, palette.inks);
  if (traits.Gesture === "Current") drawCurrent(context, random, count, palette.inks);
  if (traits.Gesture === "Lattice") drawLattice(context, random, count, palette.inks);

  context.globalAlpha = 1;
  return { hash, mode, size, features: traits };
}

export async function pixelDigest(canvas) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas pixels unavailable");
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const snapshot = pixels.buffer.slice(pixels.byteOffset, pixels.byteOffset + pixels.byteLength);
  const digest = await crypto.subtle.digest("SHA-256", snapshot);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function deriveHashes(count, seedOfSeeds) {
  const random = stream(normalizeHash(seedOfSeeds), "collection");
  return Array.from({ length: count }, () => {
    const hex = Array.from({ length: 64 }, () => "0123456789abcdef"[(random() * 16) | 0]).join("");
    return `0x${hex}`;
  });
}

export function censusFeatures(count, seedOfSeeds) {
  const hashes = deriveHashes(count, seedOfSeeds);
  const counts = Object.fromEntries(Object.keys(TRAITS).map((trait) => [trait, {}]));
  for (const hash of hashes) {
    const values = featuresFor(hash, "deterministic");
    for (const [trait, value] of Object.entries(values)) {
      counts[trait][value] = (counts[trait][value] ?? 0) + 1;
    }
  }
  return { total: hashes.length, counts };
}

export function targetPercent(trait, value) {
  const entries = TRAITS[trait];
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  return (100 * entries.find(([name]) => name === value)[1]) / total;
}
