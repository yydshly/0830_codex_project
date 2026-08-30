const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(
  path.resolve(__dirname, "../../genart-skill-research/node_modules/playwright"),
);

const baseUrl = process.env.AI_DESIGN_SKILLS_URL || "http://127.0.0.1:4178/";
const evidenceDir = path.resolve(__dirname, "../docs/evidence");
fs.mkdirSync(evidenceDir, { recursive: true });

const checks = [];
const check = (name, pass, detail = "") => checks.push({ name, pass: Boolean(pass), detail });

async function inspectPage(browser, options) {
  const context = await browser.newContext({
    viewport: options.viewport,
    colorScheme: options.colorScheme || "light",
    reducedMotion: options.reducedMotion || "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });

  check(`${options.name}: HTTP 200`, response && response.status() === 200, response?.status());
  check(`${options.name}: meaningful content`, (await page.locator("body").innerText()).trim().length > 1200);
  check(`${options.name}: no runtime errors`, errors.length === 0, errors.join(" | "));
  check(
    `${options.name}: no horizontal overflow`,
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    await page.evaluate(() => `${document.documentElement.scrollWidth}/${window.innerWidth}`),
  );

  await page.screenshot({
    path: path.join(evidenceDir, options.screenshot),
    fullPage: true,
  });

  return { page, context, errors };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await inspectPage(browser, {
      name: "desktop light",
      viewport: { width: 1440, height: 1000 },
      screenshot: "desktop-light.png",
    });
    const page = desktop.page;

    check("desktop: six capability angles", (await page.locator("[data-angle]").count()) === 6);
    check("desktop: six scenarios", (await page.locator("[data-scenario]").count()) === 6);
    check("desktop: four extension layers", (await page.locator("[data-extension]").count()) === 4);
    check(
      "desktop: persistent scenario demo entry is explicit",
      (await page.locator(".demo-header-link").isVisible()) &&
        (await page.locator(".demo-header-link").innerText()).includes("场景演示"),
    );
    check(
      "desktop: hero scenario CTA is explicit",
      (await page.locator('.hero-actions a[href="./showcase.html"]').isVisible()) &&
        (await page.locator('.hero-actions a[href="./showcase.html"]').innerText()).includes("上线哨兵"),
    );
    await page.screenshot({ path: path.join(evidenceDir, "entry-desktop.png") });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.55));
    await page.waitForTimeout(120);
    check(
      "desktop: scenario entry remains visible while scrolling",
      await page.locator(".demo-header-link").evaluate((node) => node.getBoundingClientRect().top >= 0),
    );
    await page.locator(".demo-header-link").focus();
    check(
      "keyboard: scenario entry receives visible focus",
      await page.locator(".demo-header-link").evaluate(
        (node) => node === document.activeElement && getComputedStyle(node).outlineStyle !== "none",
      ),
    );

    await page.locator('[data-angle="strategy"]').focus();
    await page.keyboard.press("ArrowRight");
    check(
      "keyboard: arrow changes capability tab",
      (await page.locator('[data-angle="copy"]').getAttribute("aria-selected")) === "true" &&
        (await page.locator("#angle-title").innerText()).includes("模糊形容词"),
    );

    await page.locator('[data-compare="structure"]').click();
    check(
      "comparison: structure sample updates",
      (await page.locator("#guided-preview").innerText()).includes("风险逆转"),
    );

    await page.locator('[data-state="error"]').click();
    check(
      "state: error is specific and recoverable",
      (await page.locator("#state-screen").innerText()).includes("本地草稿未受影响") &&
        (await page.locator("#state-screen button").innerText()) === "重新载入",
    );

    await page.locator('[data-scenario="dashboard"]').click();
    check(
      "scenario: dashboard boundary renders",
      (await page.locator("#scenario-name").innerText()).includes("业务后台") &&
        (await page.locator("#fit-label").innerText()) === "部分适配",
    );

    await page.locator('[data-extension="verify"]').click();
    check(
      "extension: verification layer renders",
      (await page.locator("#extension-name").innerText()).includes("程序检查"),
    );

    const themeToggle = page.locator("#theme-toggle");
    await themeToggle.click();
    check(
      "theme: light to dark",
      (await page.locator("html").getAttribute("data-theme")) === "dark",
    );
    await page.screenshot({ path: path.join(evidenceDir, "desktop-dark.png"), fullPage: true });
    await desktop.context.close();

    const tablet = await inspectPage(browser, {
      name: "tablet",
      viewport: { width: 768, height: 1024 },
      screenshot: "tablet-light.png",
    });
    check(
      "tablet: primary journey controls visible",
      await tablet.page.locator('[data-angle="strategy"]').isVisible(),
    );
    check("tablet: persistent scenario demo entry visible", await tablet.page.locator(".demo-header-link").isVisible());
    await tablet.context.close();

    const mobile = await inspectPage(browser, {
      name: "mobile",
      viewport: { width: 390, height: 844 },
      screenshot: "mobile-light.png",
    });
    check("mobile: hero CTA visible", await mobile.page.locator('.hero-actions a[href="#lab"]').isVisible());
    check("mobile: persistent scenario demo entry visible", await mobile.page.locator(".demo-header-link").isVisible());
    check(
      "mobile: scenario demo entry targets showcase",
      (await mobile.page.locator(".demo-header-link").getAttribute("href")) === "./showcase.html",
    );
    await mobile.page.screenshot({ path: path.join(evidenceDir, "entry-mobile.png") });
    check("mobile: horizontal angle rail visible", await mobile.page.locator(".angle-tabs").isVisible());
    await mobile.context.close();

    const reduced = await inspectPage(browser, {
      name: "reduced motion",
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
      screenshot: "mobile-reduced-motion.png",
    });
    await reduced.page.locator('[data-state="loading"]').click();
    const animationDuration = await reduced.page.locator(".skeleton span").first().evaluate(
      (node) => getComputedStyle(node).animationDuration,
    );
    check(
      "reduced motion: skeleton animation collapsed",
      animationDuration === "0.00001s" ||
        animationDuration === "1e-05s" ||
        animationDuration === "0.01ms" ||
        animationDuration === "0s",
      animationDuration,
    );
    await reduced.context.close();

    const failed = checks.filter((item) => !item.pass);
    console.log(JSON.stringify({ baseUrl, checks, failed: failed.length }, null, 2));
    process.exitCode = failed.length ? 1 : 0;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
