import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const output = path.resolve("output/playwright");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
try {
  const normal = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  const page = await normal.newPage();
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.addInitScript(() => {
    window.__axsMetrics = { lcp: 0, cls: 0, longTasks: 0 };
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      window.__axsMetrics.lcp = entries.at(-1)?.startTime ?? window.__axsMetrics.lcp;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__axsMetrics.cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => { window.__axsMetrics.longTasks += list.getEntries().length; }).observe({ type: "longtask", buffered: true });
  });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  if (!(await page.locator("html").evaluate((element) => element.classList.contains("lenis")))) throw new Error("Fine-pointer normal-motion mode did not enable Lenis.");
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 1100);
  await page.waitForTimeout(1200);
  const after = await page.evaluate(() => window.scrollY);
  if (after <= before + 400) throw new Error(`Smooth scrolling did not progress: ${before} -> ${after}`);
  await page.screenshot({ path: path.join(output, "home-normal-motion.png"), animations: "allow" });
  const metrics = await page.evaluate(() => window.__axsMetrics);
  if (metrics.lcp > 2500) throw new Error(`Local LCP ${metrics.lcp.toFixed(1)}ms exceeds 2500ms target.`);
  if (metrics.cls >= 0.1) throw new Error(`Local CLS ${metrics.cls.toFixed(3)} exceeds 0.1 target.`);
  if (consoleErrors.length) throw new Error(`Normal-motion console errors:\n${consoleErrors.join("\n")}`);
  process.stdout.write(`PASS normal motion and smooth scroll (LCP ${metrics.lcp.toFixed(1)}ms, CLS ${metrics.cls.toFixed(3)}, long tasks ${metrics.longTasks})\n`);
  await normal.close();

  const reduced = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await reducedPage.waitForTimeout(400);
  if (await reducedPage.locator("html").evaluate((element) => element.classList.contains("lenis"))) throw new Error("Reduced-motion mode instantiated Lenis.");
  await reducedPage.evaluate(() => window.scrollTo(0, 900));
  if ((await reducedPage.evaluate(() => window.scrollY)) < 800) throw new Error("Reduced-motion mode did not preserve native scrolling.");
  const hidden = await reducedPage.locator(".dusk-reveal").evaluateAll((elements) => elements.filter((element) => Number.parseFloat(getComputedStyle(element).opacity) < 0.99).length);
  if (hidden) throw new Error(`Reduced-motion mode left ${hidden} reveal elements hidden.`);
  await reducedPage.screenshot({ path: path.join(output, "home-reduced-motion.png"), animations: "disabled" });
  process.stdout.write("PASS reduced motion uses native scroll and leaves content visible\n");
  await reduced.close();
} finally {
  await browser.close();
}
