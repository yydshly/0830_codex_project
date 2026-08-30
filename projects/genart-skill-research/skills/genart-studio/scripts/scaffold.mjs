#!/usr/bin/env node
import { cp, mkdir, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const targetArg = process.argv[2];
if (!targetArg || targetArg.startsWith("--")) {
  console.error("usage: node scaffold.mjs <new-directory>");
  process.exit(2);
}

const target = resolve(targetArg);
const source = resolve(dirname(fileURLToPath(import.meta.url)), "../assets/starter");

await mkdir(target, { recursive: true });
if ((await readdir(target)).length) {
  console.error(`refusing to write into non-empty directory: ${target}`);
  process.exit(1);
}

await cp(source, target, { recursive: true, errorOnExist: true });
console.log(`genart starter created: ${target}`);
console.log(`open ${target}/index.html through a local HTTP server, then run check.mjs against it`);
