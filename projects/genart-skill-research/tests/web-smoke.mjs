import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { chromium } from "playwright";

const base = process.env.GENART_WEB_URL ?? "http://127.0.0.1:4197";
const browser = await chromium.launch();

async function openPage(viewport, options = {}) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  if (options.reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
  page.setDefaultTimeout(45_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(options.url ?? base, { waitUntil: "networkidle" });
  if (!options.skipGrid) await page.waitForSelector(".edition-card:nth-child(12)");
  return { context, page, errors };
}

async function clickControl(page, selector) {
  const control = page.locator(selector);
  await control.scrollIntoViewIfNeeded();
  await control.click();
}

async function captureDownload(page, selector) {
  const control = page.locator(selector);
  await control.scrollIntoViewIfNeeded();
  const [download] = await Promise.all([page.waitForEvent("download"), control.click()]);
  return download;
}

async function waitForScenario(page, id) {
  await page.waitForFunction(
    (scenario) => {
      const selected = document.querySelector(`button[data-scenario="${scenario}"]`);
      const digest = document.querySelector("#scenario-digest");
      return selected?.getAttribute("aria-selected") === "true" && digest?.title?.length === 64;
    },
    id,
  );
}

async function waitForLens(page, id) {
  await page.waitForFunction(
    (lens) => {
      const selected = document.querySelector(`button[data-lens="${lens}"]`);
      const digest = document.querySelector("#lens-digest");
      return selected?.getAttribute("aria-selected") === "true" && digest?.title?.length === 64;
    },
    id,
  );
}

async function waitForApplication(page, id) {
  await page.waitForFunction(
    (application) => {
      const selected = document.querySelector(`button[data-application="${application}"]`);
      const digest = document.querySelector("#application-digest");
      return selected?.getAttribute("aria-selected") === "true" && digest?.title?.length === 64;
    },
    id,
  );
}

const desktop = await openPage({ width: 1440, height: 1000 });
assert.match(await desktop.page.locator("h1").textContent(), /线条艺术/, "hero should first explain the visible line-art result");
assert.match(await desktop.page.locator(".hero-lead").textContent(), /教 AI 编写生成艺术代码/, "hero should explain the Skill in plain language");
assert.match(await desktop.page.locator(".statement-band").textContent(), /我们实现的线条生成艺术/, "page should distinguish our generator from the upstream Skill");
assert.equal(await desktop.page.locator("#case-study").getAttribute("data-stage"), "0", "complete case should start at the incident");
assert.match(await desktop.page.locator("#case-route-status").textContent(), /BLOCKED/);
assert.equal(await desktop.page.locator("#case-fix").isDisabled(), true, "fix should require deterministic replay first");
assert.equal(await desktop.page.locator("#case-audit").isDisabled(), true, "audit should require a candidate fix first");
const caseEnemy = await desktop.page.locator("#case-enemy").textContent();
const caseLoot = await desktop.page.locator("#case-loot").textContent();
assert.notEqual(caseEnemy, "—", "complete case should expose a named enemy identity");
assert.notEqual(caseLoot, "—", "complete case should expose a named loot identity");

await clickControl(desktop.page, "#case-replay");
await desktop.page.waitForFunction(() => document.querySelector("#case-replay-status").textContent.includes("PASS"));
assert.equal(await desktop.page.locator("#case-replay-runs li").count(), 3, "incident replay should show three matching runs");
assert.equal(await desktop.page.locator("#case-study").getAttribute("data-stage"), "2", "successful replay should isolate the route rule");
assert.equal(await desktop.page.locator("#case-fix").isEnabled(), true);

await clickControl(desktop.page, "#case-fix");
assert.match(await desktop.page.locator("#case-route-status").textContent(), /PASS/);
assert.match(await desktop.page.locator("#case-identity-status").textContent(), /PRESERVED/);
assert.equal(await desktop.page.locator("#case-enemy").textContent(), caseEnemy, "route fix should preserve enemy identity");
assert.equal(await desktop.page.locator("#case-loot").textContent(), caseLoot, "route fix should preserve loot identity");
assert.equal(await desktop.page.locator("#case-study").getAttribute("data-stage"), "3");

await clickControl(desktop.page, "#case-audit");
await desktop.page.waitForFunction(() => document.querySelector("#case-audit-status").textContent.includes("PASS"));
assert.match(await desktop.page.locator("#case-audit-before").textContent(), /\d+ \/ 10000/);
assert.equal((await desktop.page.locator("#case-audit-before").textContent()).startsWith("0 "), false, "release audit should find blocked seeds");
assert.equal(await desktop.page.locator("#case-audit-after").textContent(), "0 / 10000", "candidate audit should eliminate blocked routes");
assert.equal(await desktop.page.locator("#case-study").getAttribute("data-stage"), "5");

assert.equal(await desktop.page.locator("button[data-lens]").count(), 6, "role workbench should expose six perspectives");
await waitForLens(desktop.page, "support");
const immersiveMetrics = await desktop.page.evaluate(() => {
  const canvas = document.querySelector("#lens-canvas").getBoundingClientRect();
  const detail = document.querySelector(".lens-detail").getBoundingClientRect();
  return {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    detailWidth: detail.width,
    tabsPosition: getComputedStyle(document.querySelector(".lens-tabs")).position,
    detailPosition: getComputedStyle(document.querySelector(".lens-detail")).position,
    hasLegacyHandoff: Boolean(document.querySelector(".lens-handoff")),
  };
});
assert.ok(immersiveMetrics.canvasWidth > 1200, "desktop role scene should be a full-width visual anchor");
assert.ok(immersiveMetrics.canvasHeight > 700, "desktop role scene should retain cinematic depth");
assert.ok(immersiveMetrics.canvasWidth > immersiveMetrics.detailWidth, "scene should dominate the foreground HUD");
assert.equal(immersiveMetrics.tabsPosition, "absolute", "role controls should sit in the scene foreground");
assert.equal(immersiveMetrics.detailPosition, "absolute", "role explanation should be an in-scene HUD on desktop");
assert.equal(immersiveMetrics.hasLegacyHandoff, false, "legacy table-like handoff chain should be removed");
await desktop.page.evaluate(() => {
  window.__lensStageStates = [];
  const stage = document.querySelector(".lens-workbench");
  new MutationObserver(() => window.__lensStageStates.push(stage.className)).observe(stage, { attributes: true, attributeFilter: ["class"] });
});
const lensDigests = new Set();
const lensTitles = new Set();
for (const id of ["support", "art", "engineering", "qa", "production", "boundary"]) {
  await clickControl(desktop.page, `button[data-lens="${id}"]`);
  await waitForLens(desktop.page, id);
  lensDigests.add(await desktop.page.locator("#lens-digest").getAttribute("title"));
  lensTitles.add(await desktop.page.locator("#lens-title").textContent());
  assert.equal(await desktop.page.locator("#lens-evidence li").count(), 3, `${id} should expose three concrete evidence points`);
  assert.notEqual((await desktop.page.locator("#lens-input").textContent()).trim(), "", `${id} should state its input`);
  assert.notEqual((await desktop.page.locator("#lens-decision").textContent()).trim(), "", `${id} should state a decision`);
  const renderMs = Number.parseFloat(await desktop.page.locator("#lens-render-time").textContent());
  assert.ok(Number.isFinite(renderMs) && renderMs < 200, `${id} cinematic render should stay below 200ms (got ${renderMs})`);
}
assert.equal(lensDigests.size, 6, "each role perspective should render a distinct deterministic evidence view");
assert.equal(lensTitles.size, 6, "each role perspective should answer a different question");
const lensStageStates = await desktop.page.evaluate(() => window.__lensStageStates);
assert.equal(lensStageStates.some((value) => value.includes("is-entering")), true, "role switching should expose an entering scene state");
assert.equal(lensStageStates.some((value) => value.includes("is-settled")), true, "role switching should settle the scene after rendering");
await clickControl(desktop.page, 'button[data-lens="support"]');
await waitForLens(desktop.page, "support");
const supportDigest = await desktop.page.locator("#lens-digest").getAttribute("title");
await clickControl(desktop.page, 'button[data-lens="support"]');
await waitForLens(desktop.page, "support");
assert.equal(await desktop.page.locator("#lens-digest").getAttribute("title"), supportDigest, "same role and seed should replay exactly");

assert.equal(await desktop.page.locator("button[data-application]").count(), 6, "product stage should expose six real delivery surfaces");
await waitForApplication(desktop.page, "game");
const applicationMetrics = await desktop.page.evaluate(() => {
  const canvas = document.querySelector("#application-canvas").getBoundingClientRect();
  const bridge = document.querySelector(".application-bridge").getBoundingClientRect();
  return { canvasWidth: canvas.width, canvasHeight: canvas.height, bridgeHeight: bridge.height };
});
assert.ok(applicationMetrics.canvasWidth > 1300, "desktop product result should be a full-width visual anchor");
assert.ok(applicationMetrics.canvasHeight > 760, "desktop product result should retain enough depth to read the mockup");
assert.ok(applicationMetrics.canvasHeight > applicationMetrics.bridgeHeight, "product result should dominate its explanation bridge");
await desktop.page.evaluate(() => {
  window.__applicationStageStates = [];
  const stage = document.querySelector(".application-workbench");
  new MutationObserver(() => window.__applicationStageStates.push(stage.className)).observe(stage, { attributes: true, attributeFilter: ["class"] });
});
const applicationDigests = new Set();
const applicationTitles = new Set();
for (const id of ["game", "brand", "product", "data", "media", "identity"]) {
  await clickControl(desktop.page, `button[data-application="${id}"]`);
  await waitForApplication(desktop.page, id);
  applicationDigests.add(await desktop.page.locator("#application-digest").getAttribute("title"));
  applicationTitles.add(await desktop.page.locator("#application-title").textContent());
  assert.equal(await desktop.page.locator("#application-formats span").count(), 3, `${id} should expose three concrete delivery formats`);
  assert.notEqual((await desktop.page.locator("#application-input").textContent()).trim(), "", `${id} should expose business input`);
  assert.notEqual((await desktop.page.locator("#application-output").textContent()).trim(), "", `${id} should expose final output`);
  assert.notEqual((await desktop.page.locator("#application-value").textContent()).trim(), "", `${id} should expose product value`);
  const renderMs = Number.parseFloat(await desktop.page.locator("#application-render-time").textContent());
  assert.ok(Number.isFinite(renderMs) && renderMs < 200, `${id} product render should stay below 200ms (got ${renderMs})`);
}
assert.equal(applicationDigests.size, 6, "one seed should create six distinct product surfaces");
assert.equal(applicationTitles.size, 6, "six product surfaces should communicate different outcomes");
const applicationStageStates = await desktop.page.evaluate(() => window.__applicationStageStates);
assert.equal(applicationStageStates.some((value) => value.includes("is-entering")), true, "product switching should expose an entering state");
assert.equal(applicationStageStates.some((value) => value.includes("is-settled")), true, "product switching should settle after rendering");
await clickControl(desktop.page, 'button[data-application="game"]');
await waitForApplication(desktop.page, "game");
const productGameDigest = await desktop.page.locator("#application-digest").getAttribute("title");
await clickControl(desktop.page, "#application-replay");
await waitForApplication(desktop.page, "game");
assert.equal(await desktop.page.locator("#application-digest").getAttribute("title"), productGameDigest, "same product seed should replay exactly");
const applicationSeedBefore = await desktop.page.locator("#seed-input").inputValue();
await clickControl(desktop.page, "#application-random");
await desktop.page.waitForFunction((previous) => document.querySelector("#seed-input").value !== previous, applicationSeedBefore);
await waitForApplication(desktop.page, "game");
assert.notEqual(await desktop.page.locator("#application-digest").getAttribute("title"), productGameDigest, "new seed should change the product result");

await clickControl(desktop.page, 'button[data-application="brand"]');
await waitForApplication(desktop.page, "brand");
assert.equal(await desktop.page.locator(".capability-attribution article").count(), 3, "attribution should separate library, model, and browser responsibilities");
assert.match(await desktop.page.locator(".capability-attribution").textContent(), /库负责/);
assert.match(await desktop.page.locator(".capability-attribution").textContent(), /模型负责/);
assert.match(await desktop.page.locator(".capability-attribution").textContent(), /浏览器负责/);
assert.equal(await desktop.page.locator("#brand-production").isVisible(), true, "brand application should reveal the production loop");
assert.equal(await desktop.page.locator("#principle-anatomy").isVisible(), true, "brand production should explain the generator and Skill layers before controls");
assert.match(await desktop.page.locator("#principle-title").textContent(), /线条是画面，Skill 是方法/);
assert.match(await desktop.page.locator("#principle-anatomy").textContent(), /极简线条 \/ 光带生成器/);
assert.equal(await desktop.page.locator(".principle-recipe li").count(), 4, "principle anatomy should expose the four ingredients in the current visual");
assert.equal(await desktop.page.locator(".principle-step").count(), 3, "principle anatomy should separate generator, Skill, and runtime layers");
assert.equal(await desktop.page.locator(".generator-swap li").count(), 6, "principle anatomy should show replaceable generator directions");
assert.match(await desktop.page.locator(".generator-swap").textContent(), /方法层仍然成立/);
assert.equal(await desktop.page.locator("#brand-controls input").count(), 5, "brand production should expose five business inputs");

const brandDigestBefore = await desktop.page.locator("#application-digest").getAttribute("title");
await desktop.page.locator("#brand-name").fill("NOVA");
await desktop.page.locator("#brand-headline").fill("BUILD THE SIGNAL");
await desktop.page.locator("#brand-campaign-id").fill("N/31");
await desktop.page.locator("#brand-primary").evaluate((input) => {
  input.value = "#f0445c";
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
await desktop.page.locator("#brand-accent").evaluate((input) => {
  input.value = "#37a9ff";
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
await desktop.page.waitForFunction(
  (previous) => {
    const params = new URL(location.href).searchParams;
    return document.querySelector("#application-digest").title.length === 64
      && document.querySelector("#application-digest").title !== previous
      && params.get("brand") === "NOVA"
      && params.get("headline") === "BUILD THE SIGNAL"
      && params.get("campaign") === "N/31"
      && params.get("primary") === "#f0445c"
      && params.get("accent") === "#37a9ff";
  },
  brandDigestBefore,
);
const editedBrandDigest = await desktop.page.locator("#application-digest").getAttribute("title");
assert.match(desktop.page.url(), /brand=NOVA/);
assert.match(desktop.page.url(), /headline=BUILD\+THE\+SIGNAL/);
assert.match(desktop.page.url(), /primary=%23f0445c/);
assert.match(desktop.page.url(), /accent=%2337a9ff/);
assert.match(desktop.page.url(), /campaign=N%2F31/);
await clickControl(desktop.page, "#application-replay");
await waitForApplication(desktop.page, "brand");
assert.equal(await desktop.page.locator("#application-digest").getAttribute("title"), editedBrandDigest, "edited brand inputs should replay exactly");

await clickControl(desktop.page, "#brand-run-comparison");
await desktop.page.waitForFunction(() => document.querySelector("#brand-stable-status").textContent.includes("PASS"));
assert.match(await desktop.page.locator("#brand-broken-status").textContent(), /DRIFT/);
const stableBrandRuns = await desktop.page.locator("#brand-stable-runs code").evaluateAll((nodes) => nodes.map((node) => node.title));
const brokenBrandRuns = await desktop.page.locator("#brand-broken-runs code").evaluateAll((nodes) => nodes.map((node) => node.title));
assert.equal(stableBrandRuns.length, 3);
assert.equal(new Set(stableBrandRuns).size, 1, "seeded brand output should have one digest across three runs");
assert.equal(brokenBrandRuns.length, 3);
assert.ok(new Set(brokenBrandRuns).size > 1, "Math.random brand output should drift across three runs");

const pngDownload = await captureDownload(desktop.page, '[data-brand-download="png"]');
assert.match(pngDownload.suggestedFilename(), /^nova_n-31_[a-f0-9]{10}\.png$/);
const pngBytes = await readFile(await pngDownload.path());
assert.deepEqual([...pngBytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], "PNG download should contain a real PNG signature");

const svgDownload = await captureDownload(desktop.page, '[data-brand-download="svg"]');
assert.match(svgDownload.suggestedFilename(), /^nova_n-31_[a-f0-9]{10}\.svg$/);
const svgContent = await readFile(await svgDownload.path(), "utf8");
assert.match(svgContent, /BUILD THE SIGNAL/);
assert.match(svgContent, /#f0445c/);
assert.match(svgContent, /#37a9ff/);

const manifestDownload = await captureDownload(desktop.page, '[data-brand-download="manifest"]');
assert.match(manifestDownload.suggestedFilename(), /^nova_n-31_[a-f0-9]{10}\.json$/);
const manifest = JSON.parse(await readFile(await manifestDownload.path(), "utf8"));
assert.equal(manifest.schema, "genart-brand-manifest/v1");
assert.equal(manifest.inputs.brandName, "NOVA");
assert.equal(manifest.inputs.headline, "BUILD THE SIGNAL");
assert.equal(manifest.inputs.campaignId, "N/31");
assert.equal(manifest.pixelDigest, editedBrandDigest);
assert.equal(manifest.outputs.length, 3);
assert.equal(manifest.deterministic, true);

await clickControl(desktop.page, "#brand-reset");
await desktop.page.waitForFunction(() => document.querySelector("#brand-name").value === "AERO" && document.querySelector("#application-digest").title.length === 64);
assert.equal(await desktop.page.locator("#brand-headline").inputValue(), "MOVE BEYOND");
assert.equal(await desktop.page.locator("#brand-campaign-id").inputValue(), "A/26");

assert.equal(await desktop.page.locator("button[data-scenario]").count(), 6, "scenario atlas should expose six use cases");
await waitForScenario(desktop.page, "world");
const scenarioDigests = new Set();
const scenarioTitles = new Set();
for (const id of ["world", "loot", "monster", "brand", "edition", "qa"]) {
  await clickControl(desktop.page, `button[data-scenario="${id}"]`);
  await waitForScenario(desktop.page, id);
  scenarioDigests.add(await desktop.page.locator("#scenario-digest").getAttribute("title"));
  scenarioTitles.add(await desktop.page.locator("#scenario-title").textContent());
  assert.equal(await desktop.page.locator("#scenario-features li").count(), 3, `${id} should expose three traits`);
}
assert.equal(scenarioDigests.size, 6, "each scenario should render a distinct visual for one seed");
assert.equal(scenarioTitles.size, 6, "each scenario should explain a distinct use case");

await clickControl(desktop.page, 'button[data-scenario="world"]');
await waitForScenario(desktop.page, "world");
const worldDigest = await desktop.page.locator("#scenario-digest").getAttribute("title");
await clickControl(desktop.page, "#scenario-rerender");
await waitForScenario(desktop.page, "world");
assert.equal(await desktop.page.locator("#scenario-digest").getAttribute("title"), worldDigest, "same scenario seed should replay exactly");
const seedBefore = await desktop.page.locator("#seed-input").inputValue();
await clickControl(desktop.page, "#scenario-random");
await desktop.page.waitForFunction((previous) => document.querySelector("#seed-input").value !== previous, seedBefore);
await waitForScenario(desktop.page, "world");
assert.notEqual(await desktop.page.locator("#scenario-digest").getAttribute("title"), worldDigest, "new seed should change the scenario visual");

await clickControl(desktop.page, "#run-check");
await desktop.page.waitForFunction(() => document.querySelector("#check-status").textContent.includes("PASS"));
assert.equal(await desktop.page.locator("#check-runs li").count(), 3, "stable check should show three runs");

await clickControl(desktop.page, '[data-mode="broken"]');
await clickControl(desktop.page, "#run-check");
await desktop.page.waitForFunction(() => document.querySelector("#check-status").textContent.includes("FAIL"));
assert.equal(await desktop.page.locator("#check-runs li").count(), 3, "broken check should show three runs");

await clickControl(desktop.page, "#run-census");
await desktop.page.waitForFunction(() => document.querySelector("#census-status").textContent.includes("完成"));
assert.equal(await desktop.page.locator(".trait-chart").count(), 3, "census should render all trait charts");

await clickControl(desktop.page, "#theme-toggle");
assert.equal(await desktop.page.locator("html").getAttribute("data-theme"), "dark");
await clickControl(desktop.page, "#theme-toggle");
assert.equal(await desktop.page.locator("html").getAttribute("data-theme"), "light", "dark-to-light transition should restore the editorial theme");
assert.deepEqual(desktop.errors, []);

for (const viewport of [
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
]) {
  const surface = await openPage(viewport);
  const overflow = await surface.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${viewport.width}px viewport should not overflow horizontally (got ${overflow})`);
  const productCanvas = await surface.page.locator("#application-canvas").boundingBox();
  assert.ok(productCanvas?.width > viewport.width * 0.82, `${viewport.width}px product canvas should remain visually dominant`);
  if (viewport.width === 390) assert.ok(productCanvas?.height > 320, "mobile product canvas should not collapse into a thumbnail");
  await clickControl(surface.page, 'button[data-application="brand"]');
  await waitForApplication(surface.page, "brand");
  assert.equal(await surface.page.locator("#brand-production").isVisible(), true, `${viewport.width}px should expose the brand production loop`);
  assert.equal(await surface.page.locator("#principle-anatomy").isVisible(), true, `${viewport.width}px should keep the principle anatomy readable`);
  const brandOverflow = await surface.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(brandOverflow <= 1, `${viewport.width}px brand production should not overflow horizontally (got ${brandOverflow})`);
  assert.equal(await surface.page.locator(".capability-attribution article").count(), 3);
  assert.deepEqual(surface.errors, []);
  await surface.context.close();
}

const keyboard = await openPage({ width: 768, height: 900 });
await keyboard.page.keyboard.press("Tab");
assert.equal(await keyboard.page.evaluate(() => document.activeElement?.classList.contains("skip-link")), true);
await keyboard.page.keyboard.press("Enter");
assert.equal(await keyboard.page.evaluate(() => location.hash), "#main-content");
await keyboard.page.locator("#run-check").focus();
await keyboard.page.keyboard.press("Enter");
await keyboard.page.waitForFunction(() => document.querySelector("#check-status").textContent.includes("PASS"));
await keyboard.page.locator("#case-replay").focus();
await keyboard.page.keyboard.press("Enter");
await keyboard.page.waitForFunction(() => document.querySelector("#case-replay-status").textContent.includes("PASS"));
assert.equal(await keyboard.page.locator("#case-fix").isEnabled(), true);
await keyboard.page.locator('button[data-lens="support"]').focus();
await keyboard.page.keyboard.press("ArrowRight");
await waitForLens(keyboard.page, "art");
assert.equal(await keyboard.page.evaluate(() => document.activeElement?.dataset.lens), "art");
await keyboard.page.keyboard.press("End");
await waitForLens(keyboard.page, "boundary");
assert.equal(await keyboard.page.evaluate(() => document.activeElement?.dataset.lens), "boundary");
await keyboard.page.locator('button[data-application="game"]').focus();
await keyboard.page.keyboard.press("ArrowRight");
await waitForApplication(keyboard.page, "brand");
assert.equal(await keyboard.page.evaluate(() => document.activeElement?.dataset.application), "brand");
await keyboard.page.keyboard.press("End");
await waitForApplication(keyboard.page, "identity");
assert.equal(await keyboard.page.evaluate(() => document.activeElement?.dataset.application), "identity");
await keyboard.page.locator('button[data-scenario="world"]').focus();
await keyboard.page.keyboard.press("ArrowRight");
await waitForScenario(keyboard.page, "loot");
assert.equal(await keyboard.page.evaluate(() => document.activeElement?.dataset.scenario), "loot");
await keyboard.page.keyboard.press("End");
await waitForScenario(keyboard.page, "qa");
assert.equal(await keyboard.page.evaluate(() => document.activeElement?.dataset.scenario), "qa");
assert.deepEqual(keyboard.errors, []);
await keyboard.context.close();

const reduced = await openPage(
  { width: 390, height: 844 },
  { reducedMotion: true },
);
assert.equal(await reduced.page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), true);
assert.equal(await reduced.page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "auto");
assert.equal(await reduced.page.evaluate(() => getComputedStyle(document.querySelector("#lens-canvas")).transitionDuration), "0s");
assert.equal(await reduced.page.evaluate(() => getComputedStyle(document.querySelector("#application-canvas")).transitionDuration), "0s");
await reduced.context.close();

const fallback = await openPage(
  { width: 768, height: 900 },
  { url: `${base}/?noCanvas=1`, skipGrid: true },
);
assert.equal(await fallback.page.locator("#canvas-fallback").isVisible(), true);
assert.equal(await fallback.page.locator("#run-check").isDisabled(), true);
assert.equal(await fallback.page.locator("#download-png").isDisabled(), true);
assert.equal(await fallback.page.locator("#scenario-fallback").isVisible(), true);
assert.equal(await fallback.page.locator("#scenario-rerender").isDisabled(), true);
assert.equal(await fallback.page.locator("#case-fallback").isVisible(), true);
assert.equal(await fallback.page.locator("#case-replay").isDisabled(), true);
assert.equal(await fallback.page.locator("#case-fix").isDisabled(), true);
assert.equal(await fallback.page.locator("#case-audit").isDisabled(), true);
assert.equal(await fallback.page.locator("#lens-fallback").isVisible(), true);
assert.match(await fallback.page.locator("#lens-digest").textContent(), /Canvas unavailable/);
await clickControl(fallback.page, 'button[data-lens="art"]');
assert.equal(await fallback.page.locator("#role-lenses").getAttribute("data-lens"), "art");
assert.match(await fallback.page.locator("#lens-title").textContent(), /艺术/);
assert.equal(await fallback.page.locator("#lens-evidence li").count(), 3);
assert.equal(await fallback.page.locator("#application-fallback").isVisible(), true);
assert.equal(await fallback.page.locator("#application-replay").isDisabled(), true);
assert.equal(await fallback.page.locator("#application-random").isDisabled(), true);
await clickControl(fallback.page, 'button[data-application="brand"]');
assert.match(await fallback.page.locator("#application-title").textContent(), /活动/);
assert.equal(await fallback.page.locator("#application-formats span").count(), 3);
assert.equal(await fallback.page.locator("#brand-production").isVisible(), true);
assert.equal(await fallback.page.locator("#principle-anatomy").isVisible(), true);
assert.match(await fallback.page.locator("#principle-anatomy").textContent(), /它不是 genart-skill 内置的画风/);
assert.equal(await fallback.page.locator("#brand-run-comparison").isDisabled(), true);
assert.equal(await fallback.page.locator('[data-brand-download="png"]').isDisabled(), true);
assert.equal(await fallback.page.locator('[data-brand-download="svg"]').isDisabled(), true);
assert.equal(await fallback.page.locator('[data-brand-download="manifest"]').isDisabled(), true);
assert.equal(await fallback.page.locator(".capability-attribution article").count(), 3);
assert.match(await fallback.page.locator("#brand-comparison-note").textContent(), /Canvas/);
await clickControl(fallback.page, 'button[data-scenario="loot"]');
assert.match(await fallback.page.locator("#scenario-title").textContent(), /装备/);
assert.deepEqual(fallback.errors, []);
await fallback.context.close();

await desktop.context.close();
await browser.close();
console.log("web smoke passed: complete incident case, six role lenses, six product surfaces, generator/Skill/runtime principle anatomy, editable brand production, stable/broken comparison, real PNG/SVG/Manifest downloads, six scenarios, deterministic replay, census, theme, keyboard, 1440/768/390, reduced motion, fallback");
