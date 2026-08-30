const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(
  path.resolve(__dirname, "../../genart-skill-research/node_modules/playwright"),
);

const baseUrl = process.env.AI_DESIGN_SKILLS_URL || "http://127.0.0.1:4178/";
const showcaseUrl = new URL("showcase.html", baseUrl).href;
const evidenceDir = path.resolve(__dirname, "../docs/evidence");
fs.mkdirSync(evidenceDir, { recursive: true });

const checks = [];
const check = (name, pass, detail = "") => checks.push({ name, pass: Boolean(pass), detail });

async function revealPage(page) {
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  for (let y = 0; y < pageHeight; y += Math.max(420, viewportHeight * 0.72)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(45);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(180);
}

async function openShowcase(browser, options) {
  const context = await browser.newContext({
    viewport: options.viewport,
    reducedMotion: options.reducedMotion || "no-preference",
    colorScheme: "dark",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(showcaseUrl, { waitUntil: "networkidle" });

  check(`${options.name}: HTTP 200`, response && response.status() === 200, response?.status());
  check(`${options.name}: no runtime errors`, errors.length === 0, errors.join(" | "));
  check(
    `${options.name}: no horizontal overflow`,
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    await page.evaluate(() => `${document.documentElement.scrollWidth}/${window.innerWidth}`),
  );
  check(
    `${options.name}: resources stay local`,
    await page.evaluate(() =>
      performance.getEntriesByType("resource").every((entry) => new URL(entry.name).origin === location.origin),
    ),
  );

  return { context, page, errors };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await openShowcase(browser, {
      name: "showcase desktop",
      viewport: { width: 1440, height: 1000 },
    });
    const page = desktop.page;

    check("desktop: distinctive hero CTA visible", await page.locator('.hero-actions a[href="#review-demo"]').isVisible());
    check("desktop: tagline words created", (await page.locator(".tagline-text .word").count()) === 12);
    await page.screenshot({ path: path.join(evidenceDir, "showcase-hero.png") });

    const menuButton = page.locator("#menu-toggle");
    await menuButton.focus();
    await menuButton.click();
    await page.waitForTimeout(120);
    check(
      "menu: opens as foreground layer",
      (await menuButton.getAttribute("aria-expanded")) === "true" &&
        (await page.locator("#menu-overlay").getAttribute("aria-hidden")) === "false" &&
        (await page.locator("body").getAttribute("class"))?.includes("menu-open"),
    );
    check("menu: first link receives focus", await page.locator("#menu-overlay a").first().evaluate((node) => node === document.activeElement));
    check(
      "menu: hamburger morphs to X",
      await menuButton.locator("span").first().evaluate((node) => getComputedStyle(node).transform !== "none"),
    );
    await page.screenshot({ path: path.join(evidenceDir, "showcase-menu.png") });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(320);
    check(
      "menu: Escape closes and restores focus",
      (await menuButton.getAttribute("aria-expanded")) === "false" &&
        (await page.locator("#menu-overlay").getAttribute("aria-hidden")) === "true" &&
        (await menuButton.evaluate((node) => node === document.activeElement)),
    );

    const tagline = page.locator(".tagline-section");
    await tagline.evaluate((node) => window.scrollTo(0, node.offsetTop - window.innerHeight * 0.35));
    await page.waitForTimeout(180);
    const totalWords = await page.locator(".tagline-text .word").count();
    const activeWords = await page.locator(".tagline-text .word.is-active").count();
    check("tagline: scroll activates words in reading order", activeWords > 0 && activeWords < totalWords, `${activeWords}/${totalWords}`);
    await page.screenshot({ path: path.join(evidenceDir, "showcase-tagline.png") });

    await page.locator("#review-demo").scrollIntoViewIfNeeded();
    const runButton = page.locator("#run-review");
    await runButton.click();
    check(
      "review: exposes loading state",
      (await page.locator("#review-output").getAttribute("aria-busy")) === "true" &&
        (await runButton.isDisabled()),
    );
    await page.waitForTimeout(1350);
    check(
      "review: produces honest recoverable result",
      (await page.locator("#review-output").getAttribute("aria-busy")) === "false" &&
        (await page.locator("#review-output").innerText()).includes("需要补充证据") &&
        (await runButton.innerText()) === "重新运行样例",
    );
    await page.locator(".review-workbench").screenshot({ path: path.join(evidenceDir, "showcase-review-result.png") });

    await page.locator("#faq details").first().locator("summary").click();
    check("faq: objection answer opens", await page.locator("#faq details").first().getAttribute("open") !== null);
    await revealPage(page);
    check(
      "desktop: scroll reveals every content block",
      await page.locator(".reveal").evaluateAll((nodes) => nodes.every((node) => node.classList.contains("is-visible"))),
    );
    await page.screenshot({ path: path.join(evidenceDir, "showcase-desktop.png"), fullPage: true });
    await desktop.context.close();

    const tablet = await openShowcase(browser, {
      name: "showcase tablet",
      viewport: { width: 768, height: 1024 },
    });
    check("tablet: product preview visible", await tablet.page.locator(".hero-product").isVisible());
    check("tablet: review workbench visible", await tablet.page.locator(".review-workbench").isVisible());
    await tablet.context.close();

    const mobile = await openShowcase(browser, {
      name: "showcase mobile",
      viewport: { width: 390, height: 844 },
    });
    check("mobile: island navigation visible", await mobile.page.locator(".island-nav").isVisible());
    check("mobile: primary CTA visible", await mobile.page.locator('.hero-actions a[href="#review-demo"]').isVisible());
    await mobile.page.locator("#menu-toggle").click();
    check("mobile: full screen menu visible", await mobile.page.locator("#menu-overlay").isVisible());
    await mobile.page.keyboard.press("Escape");
    await revealPage(mobile.page);
    await mobile.page.screenshot({ path: path.join(evidenceDir, "showcase-mobile.png"), fullPage: true });
    await mobile.context.close();

    const reduced = await openShowcase(browser, {
      name: "showcase reduced motion",
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    check(
      "reduced motion: all tagline words remain visible",
      (await reduced.page.locator(".tagline-text .word.is-active").count()) ===
        (await reduced.page.locator(".tagline-text .word").count()),
    );
    check(
      "reduced motion: reveal content remains visible",
      await reduced.page.locator(".hero-copy").evaluate((node) => getComputedStyle(node).opacity === "1"),
    );
    await reduced.context.close();

    const entryContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const entryPage = await entryContext.newPage();
    await entryPage.goto(baseUrl, { waitUntil: "networkidle" });
    const entry = entryPage.locator('a[href="./showcase.html"]').first();
    check("observatory: distinctive scenario entry exists", await entry.isVisible());
    await entry.click();
    await entryPage.waitForLoadState("networkidle");
    check("observatory: entry opens showcase", entryPage.url() === showcaseUrl, entryPage.url());
    await entryContext.close();

    const failed = checks.filter((item) => !item.pass);
    console.log(JSON.stringify({ showcaseUrl, checks, failed: failed.length }, null, 2));
    process.exitCode = failed.length ? 1 : 0;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
