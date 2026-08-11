import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Manual browser walkthrough for the ArmourX Sports client.
 * Starts nothing itself — run with the dev server + fixture up:
 *   node scripts/fixture-admin.mjs & npx next dev -p 4173
 *   node scripts/walkthrough.mjs
 * Exits non-zero on any console error or missing section.
 */
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const out = path.resolve("output/walkthrough");
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
let failures = 0;

const check = (label, ok) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failures += 1;
};

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[console.error] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));

  const response = await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  check("home HTTP 200", response?.status() === 200);

  await page.waitForTimeout(3200);
  check("loader cleared", !(await page.locator(".boot-loader").isVisible().catch(() => true)));
  check("hero visible", await page.locator(".match-hero").isVisible().catch(() => false));
  check("kickoff title visible", await page.locator(".kickoff-title .kickoff-char").first().evaluate((el) => getComputedStyle(el).opacity !== "0").catch(() => false));
  await page.screenshot({ path: path.join(out, "01-hero.png") });

  for (const s of [".match-pitches", ".match-sessions", ".match-gallery", ".match-team", ".match-location", ".match-faq", ".match-final"]) {
    const el = page.locator(s);
    const visible = await el.isVisible().catch(() => false);
    check(`${s} visible`, visible);
    if (visible) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
    }
  }
  await page.screenshot({ path: path.join(out, "02-full.png") });

  await page.locator(".site-header__menu").click();
  await page.waitForTimeout(900);
  check("menu opens", await page.locator(".site-menu").evaluate((el) => el.classList.contains("menu-open")).catch(() => false));
  check("menu has 6 links", (await page.locator(".menu-line").count()) === 6);
  await page.screenshot({ path: path.join(out, "03-menu.png") });
  await page.locator(".site-menu__close").click();
  await page.waitForTimeout(600);
  check("menu closes", !(await page.locator(".site-menu").evaluate((el) => el.classList.contains("menu-open")).catch(() => true)));

  await page.locator(".match-faq").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator(".match-faq summary").nth(1).click();
  await page.waitForTimeout(600);
  check("FAQ item 2 opens", await page.locator(".match-faq summary").nth(1).evaluate((el) => el.parentElement?.hasAttribute("open")).catch(() => false));

  check("counter ran (value 2)", (await page.locator(".countup-value").first().textContent().catch(() => "0")) === "2");

  const bm = await page.goto(`${baseUrl}/bm`, { waitUntil: "domcontentloaded" });
  check("BM HTTP 200", bm?.status() === 200);
  await page.waitForTimeout(2800);
  check("BM hero visible", await page.locator(".match-hero").isVisible().catch(() => false));

  for (const route of ["/fields", "/fields/field-one", "/about", "/contact", "/faq", "/articles", "/book", "/booking/find"]) {
    const r = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
    check(`${route} HTTP ${r?.status()}`, r?.status() === 200);
  }

  console.log("---");
  console.log("Console errors:", errors.length);
  errors.forEach((e) => console.log("  " + e.slice(0, 300)));
  check("no console errors", errors.length === 0);
  check("OVERALL", failures === 0);
  process.exit(failures === 0 ? 0 : 1);
} finally {
  await browser.close();
}
