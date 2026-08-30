import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const source = resolve("upstream/tests/fixture/index.html");
const target = resolve(".tmp/broken-fixture/index.html");

const original = await readFile(source, "utf8");
const broken = original.replaceAll(/stream\(hash, "[a-z]*"\)/g, "Math.random");

await mkdir(dirname(target), { recursive: true });
await writeFile(target, broken);

console.log(`derived nondeterministic fixture: ${target}`);
