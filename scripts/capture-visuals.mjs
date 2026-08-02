import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const output = path.resolve("output/playwright");
await mkdir(output, { recursive: true });

const captures = [
  { name: "home-desktop-1440", route: "/", width: 1440, height: 1000, fullPage: true },
  { name: "home-bm-desktop-1440", route: "/bm", width: 1440, height: 1000, fullPage: true },
  { name: "home-laptop-1024", route: "/", width: 1024, height: 900, fullPage: true },
  { name: "home-tablet-768", route: "/", width: 768, height: 900, fullPage: true },
  { name: "home-mobile-390", route: "/", width: 390, height: 844, fullPage: true },
  { name: "home-bm-mobile-390", route: "/bm", width: 390, height: 844, fullPage: true },
  { name: "home-mobile-360", route: "/", width: 360, height: 800, fullPage: true },
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
    // Disposable database fixtures may reference reserved CDN or Admin media hosts.
    // Keep visual verification deterministic without requesting an external image host.
    const fixtureImage = () =>
      ({
        contentType: "image/svg+xml",
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#1c5e51"/></svg>',
      });
    await page.route("https://cdn.example.test/**", (route) =>
      route.fulfill(fixtureImage()),
    );
    await page.route("https://admin.example.invalid/**", (route) =>
      route.fulfill(fixtureImage()),
    );
    await page.route(/\/_next\/image\?.*cdn\.example\.test/, (route) =>
      route.fulfill({
        ...fixtureImage(),
      }),
    );
    await page.route(/\/_next\/image\?.*admin\.example\.invalid/, (route) =>
      route.fulfill({
        ...fixtureImage(),
      }),
    );
    await page.goto(`${baseUrl}${capture.route}`, { waitUntil: "domcontentloaded" });
    if (capture.route === "/book") {
      await page.waitForLoadState("networkidle");
      await page.locator(".booking-wizard").waitFor();
      await page.getByRole("button", { name: /choose field/i }).click();
      await page.getByRole("button", { name: /choose session/i }).click();
      await page.getByText("Online booking is unavailable right now.").waitFor();
      const availableBlock = page.locator(".slot-card--available").first();
      if (await availableBlock.isEnabled()) await availableBlock.click();
    }
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 500));
    });
    // Next Image lazily loads after intersection. Visit each image explicitly so a full-page
    // capture verifies real assets instead of timing out on below-the-fold placeholders.
    for (const image of await page.locator("img").all()) await image.scrollIntoViewIfNeeded();
    const imagesReady = await page
      .waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0), undefined, { timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    if (!imagesReady) {
      const unloaded = await page.locator("img").evaluateAll((images) =>
        images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => ({ alt: image.alt, src: image.currentSrc || image.getAttribute("src") })),
      );
      throw new Error(`${capture.name} contains unloaded images: ${JSON.stringify(unloaded)}`);
    }
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
