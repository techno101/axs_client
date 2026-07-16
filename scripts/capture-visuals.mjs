import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const output = path.resolve("output/playwright");
await mkdir(output, { recursive: true });

const captures = [
  { name: "home-desktop-1440", route: "/", width: 1440, height: 1000, fullPage: true },
  { name: "home-mobile-390", route: "/", width: 390, height: 844, fullPage: true },
  { name: "booking-desktop-1440", route: "/book", width: 1440, height: 1000, fullPage: true },
  { name: "booking-mobile-390", route: "/book", width: 390, height: 844, fullPage: true },
  { name: "fields-tablet-1024", route: "/fields", width: 1024, height: 900, fullPage: true },
];

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const capture of captures) {
    const context = await browser.newContext({
      viewport: { width: capture.width, height: capture.height },
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}${capture.route}`, { waitUntil: "domcontentloaded" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForFunction(
      () => [...document.images].every((image) => image.complete && image.naturalWidth > 0),
      { timeout: 10_000 },
    );
    await page.screenshot({
      path: path.join(output, `${capture.name}.png`),
      fullPage: capture.fullPage,
      animations: "disabled",
    });
    const brokenImages = await page.locator("img").evaluateAll((images) =>
      images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.alt),
    );
    if (brokenImages.length) {
      throw new Error(`${capture.name} contains broken images: ${brokenImages.join(", ")}`);
    }
    process.stdout.write(`CAPTURED ${capture.name}.png\n`);
    await context.close();
  }
} finally {
  await browser.close();
}
