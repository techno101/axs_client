import { chromium } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const routes = [
  "/",
  "/fields",
  "/fields/field-one",
  "/fields/field-two",
  "/book",
  "/booking/result?fixture=pending",
  "/booking/result?fixture=confirmed",
  "/booking/result?fixture=failed",
  "/booking/result?fixture=expired",
  "/booking/find",
  "/about",
  "/contact",
  "/faq",
  "/articles",
  "/articles/build-a-six-hour-match-day",
  "/privacy",
  "/terms",
  "/policies/booking",
  "/policies/refund",
  "/maintenance",
  "/error",
];

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});

try {
  for (const route of routes) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
    if (!response?.ok()) throw new Error(`${route} returned ${response?.status() ?? "no response"}`);
    if ((await page.locator("h1").count()) !== 1) throw new Error(`${route} must render exactly one h1`);
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflows) throw new Error(`${route} has horizontal overflow at 1280px`);
    process.stdout.write(`PASS ${route}\n`);
  }

  if (consoleErrors.length) throw new Error(`Browser console errors:\n${consoleErrors.join("\n")}`);
  consoleErrors.length = 0;

  const notFound = await page.goto(`${baseUrl}/this-route-does-not-exist`, { waitUntil: "domcontentloaded" });
  if (notFound?.status() !== 404) throw new Error(`Unknown route returned ${notFound?.status()} instead of 404`);
  if ((await page.getByRole("heading", { name: /outside the lines/i }).count()) !== 1) throw new Error("Custom 404 view did not render");
  process.stdout.write("PASS custom 404\n");

  for (const width of [360, 390, 720, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    for (const route of ["/", "/fields", "/book"]) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      if (overflows) {
        const offenders = await page.evaluate(() =>
          [...document.querySelectorAll("body *")]
            .map((element) => ({
              selector: `${element.tagName.toLowerCase()}${element.className ? `.${String(element.className).trim().replaceAll(" ", ".")}` : ""}`,
              left: Math.round(element.getBoundingClientRect().left),
              right: Math.round(element.getBoundingClientRect().right),
            }))
            .filter((element) => element.left < -1 || element.right > window.innerWidth + 1)
            .slice(0, 8),
        );
        throw new Error(`${route} has horizontal overflow at ${width}px: ${JSON.stringify(offenders)}`);
      }
    }
    process.stdout.write(`PASS responsive overflow ${width}px\n`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  const mobileMenu = page.locator(".mobile-menu");
  await mobileMenu.locator("summary").click();
  if (!(await mobileMenu.locator(".mobile-menu__panel").isVisible())) {
    throw new Error("Mobile navigation did not open");
  }
  await mobileMenu.locator("summary").click();
  if (await mobileMenu.locator(".mobile-menu__panel").isVisible()) {
    throw new Error("Mobile navigation did not close");
  }
  process.stdout.write("PASS mobile navigation interaction\n");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/book`, { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Tab");
  const skipLinkFocused = await page.locator(".skip-link").evaluate(
    (element) => element === document.activeElement,
  );
  if (!skipLinkFocused) throw new Error("Skip link was not the first keyboard focus target");

  const chooseField = page.getByRole("button", { name: /choose field/i });
  await chooseField.focus();
  await page.keyboard.press("Enter");
  if (!(await page.getByRole("heading", { name: /select a field/i }).isVisible())) {
    throw new Error("Booking step did not advance from the keyboard");
  }
  process.stdout.write("PASS keyboard navigation interaction\n");
} finally {
  await browser.close();
}
