#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import process from "node:process";

const root = resolve(process.argv.find((arg, index) => index > 1 && !arg.startsWith("--")) ?? ".");
const strict = process.argv.includes("--strict");
const extensions = new Set([".html", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".css"]);
const ignored = new Set([".git", "node_modules", "dist", "build", "out", ".next", ".tmp"]);
const checks = [
  ["unseeded random", /\bMath\.random\s*\(/g],
  ["wall clock", /\b(?:Date\.now|performance\.now)\s*\(/g],
  ["system random", /\bcrypto\.getRandomValues\s*\(/g],
  ["network request", /\b(?:fetch|XMLHttpRequest)\b/g],
  ["remote script", /<script[^>]+src\s*=\s*["']https?:/gi],
  ["remote font", /@font-face[\s\S]{0,500}?url\s*\(\s*["']?https?:/gi],
  ["locale-dependent output", /\b(?:Intl\.|toLocaleString\s*\()/g],
  ["sort requires review", /\.sort\s*\(/g],
  ["for-in order requires review", /\bfor\s*\([^)]*\bin\b[^)]*\)/g],
  ["viewport composition input", /\bwindow\.(?:innerWidth|innerHeight)\b/g],
];

async function filesUnder(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(path)));
    else if (extensions.has(extname(entry.name))) files.push(path);
  }
  return files;
}

const findings = [];
for (const file of await filesUnder(root)) {
  const source = await readFile(file, "utf8");
  const lines = source.split(/\r?\n/);
  for (const [label, pattern] of checks) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(source))) {
      const line = source.slice(0, match.index).split(/\r?\n/).length;
      if (lines[line - 1]?.includes("genart-allow")) continue;
      findings.push({ file, line, label, sample: match[0] });
      if (!pattern.global) break;
    }
  }
}

console.log(`${findings.length} review finding(s) in ${root}`);
for (const finding of findings) {
  console.log(`  ${finding.file}:${finding.line}  ${finding.label}  ${finding.sample}`);
}
if (findings.length) console.log("\nReview each hit; add `genart-allow` on a legitimate line with a reason.");
process.exit(strict && findings.length ? 1 : 0);
