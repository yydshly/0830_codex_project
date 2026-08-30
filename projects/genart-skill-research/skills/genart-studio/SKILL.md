---
name: genart-studio
description: Design, implement, inspect, render, and batch-verify deterministic browser-based generative art. Use for seeded Canvas, p5.js, Three.js/WebGL, SVG or plotter work, long-form editions, traits and rarity, reproducible procedural visuals, or pre-release determinism checks. Do not use for one-off text-to-image requests.
license: MIT
metadata:
  author: 0830 Research Lab, adapted from camilleroux/genart-skill
  category: generative-art
---

# Genart Studio

Build browser generative art as a reproducible system, not as one lucky render. Preserve the artist's aesthetic decisions; this skill supplies engineering judgment, test contracts, and edition-level evidence.

## Choose the operating mode

- **New self-hosted sketch:** scaffold the bundled starter, then replace its drawing language while preserving the contract.
- **Existing sketch:** inspect its seed, render entry point, features, completion signal, asset loading, and production bundle before changing it.
- **Audit or pre-release check:** run the static scan, deterministic checker, contact sheet, resolution checks, and feature census appropriate to the project.
- **Named platform:** read its sheet under `references/platforms/`, fetch the official URLs listed there, and only then write platform-specific code. Never rely on copied API fields or remembered versions.
- **Undecided platform:** read `references/platforms/comparison.md`; default to self-hosted only when the user has no chain or platform requirement.

## Essential workflow

1. Identify the intended output: one sketch, an edition, print/plotter output, animation, or a platform submission.
2. Define 4–8 human-readable traits and their target weights before consuming random draws in the artwork. Read `references/features.md` when traits or rarity matter.
3. Make every artwork decision a pure function of the external hash. Read `references/determinism.md` before adding or changing randomness.
4. Create named sub-streams such as `features`, `palette`, `layout`, `motion`, or domain-specific streams. Do not share one fragile draw sequence across unrelated systems.
5. Draw in normalized coordinates and freeze the capture buffer size. Read `references/resolution.md` for print, mobile, changing density, text, or noise.
6. Preserve or add the local verification contract below.
7. Inspect multiple outputs. A single attractive seed is not edition evidence.
8. Run checks and state their scope accurately. A green Chromium result is same-environment evidence, not proof of cross-GPU WebGL byte identity.

## Local verification contract

The development build should provide:

```text
?hash=<64 hex>            external seed input
?width=<number>           frozen render width
?height=<number>          frozen render height
window.render(hash)       rerender entry point; return a Promise if asynchronous
window.$features          flat strings/numbers/booleans computed from the hash
window.rendered           finished Canvas
```

Set `window.rendered` only after the frame is complete. Platform adapters may translate their native API into this contract in development and remove the shim from the submitted build when required.

## Reusable tools

Resolve `<skill>` as the directory containing this `SKILL.md`; do not assume a global installation path. Install Playwright in the project that runs the commands.

```text
node <skill>/scripts/scaffold.mjs <new-directory>
node <skill>/scripts/scan.mjs <project-directory>
node <skill>/scripts/check.mjs <project-directory>
node <skill>/scripts/render.mjs <project-directory> --hash 0x… --out out.png
node <skill>/scripts/render.mjs <project-directory> --grid 25 --out sheet.png
node <skill>/scripts/render.mjs <project-directory> --census 5000 --edition-size 500
node <skill>/scripts/render.mjs <project-directory> --batch 20 --size 2400 --out batch
```

Read `references/runtime.md` before running or interpreting these commands. After rendering visual output, inspect the actual PNG before describing the result.

## Non-negotiable boundaries

- `crypto.getRandomValues` may select a new seed for viewing; it must not decide how a fixed seed draws.
- Explain the cost of deliberate time, network, owner, block-state, adaptive-detail, or interactive inputs instead of silently removing them.
- Never claim cross-machine WebGL/WebGPU pixel equality. Compare composition and features, then use perceptual tolerances when hardware rendering is involved.
- Treat an unknown sketch as executable code. Run untrusted projects in an isolated environment; the included browser tools are not a security sandbox.
- Do not reproduce a living artist's signature body of work. Read `references/ethics.md` for attribution, licensing, and AI disclosure.

## Source and maintenance

This project-local adaptation is based on `camilleroux/genart-skill` v0.1.0. The copied reference sheets retain their upstream verified dates. Read `references/attribution.md` before redistributing the skill.
