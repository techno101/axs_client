import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const routes = [
  "/",
  "/bm",
  "/fields",
  "/fields/field-one",
  "/fields/field-two",
  "/book",
  "/booking/find",
  "/about",
  "/contact",
  "/faq",
  "/articles",
  "/privacy",
  "/terms",
  "/policies/booking",
  "/policies/refund",
  "/maintenance",
  "/error",
  "/sign-up",
  "/sign-in",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/google/return",
  "/account",
  "/account/profile",
  "/account/security",
];
const fixturePath = process.env.E2E_FIXTURE_PATH;
const bookingFixtures = fixturePath ? JSON.parse(await readFile(fixturePath, "utf8")) : null;
const expectOnlinePayment = process.env.E2E_EXPECT_ONLINE_PAYMENT === "true";

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
page.on("console", (message) => {
  // A missing customer session is an expected guest-state check, not a browser failure.
  if (message.type() === "error" && !/status of 401 \(Unauthorized\)/.test(message.text())) consoleErrors.push(message.text());
});
const fixtureImage = {
  contentType: "image/svg+xml",
  body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#1c5e51"/></svg>',
};
await page.route("https://cdn.example.test/**", (route) => route.fulfill(fixtureImage));
await page.route("https://admin.example.invalid/**", (route) => route.fulfill(fixtureImage));

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

  for (const locale of [
    { path: "/", lang: "en-MY", canonical: "https://www.armourxsports.com" },
    { path: "/bm", lang: "ms-MY", canonical: "https://www.armourxsports.com/bm" },
  ]) {
    await page.goto(`${baseUrl}${locale.path}`, { waitUntil: "domcontentloaded" });
    if ((await page.locator("html").getAttribute("lang")) !== locale.lang) {
      throw new Error(`${locale.path} did not render html lang=${locale.lang}`);
    }
    if ((await page.locator('link[rel="canonical"]').getAttribute("href")) !== locale.canonical) {
      throw new Error(`${locale.path} did not render canonical ${locale.canonical}`);
    }
    for (const hreflang of ["en", "ms-MY"]) {
      if ((await page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`).count()) !== 1) {
        throw new Error(`${locale.path} did not render one ${hreflang} alternate link`);
      }
    }
  }
  process.stdout.write("PASS localized document language, canonical, and hreflang metadata\n");

  const sitemapResponse = await page.request.get(`${baseUrl}/sitemap.xml`);
  if (!sitemapResponse.ok()) throw new Error(`Sitemap returned ${sitemapResponse.status()}`);
  const sitemap = await sitemapResponse.text();
  for (const url of ["https://www.armourxsports.com/", "https://www.armourxsports.com/bm"]) {
    if (!sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`Sitemap is missing ${url}`);
  }
  process.stdout.write("PASS English and Bahasa Melayu sitemap entries\n");

  const notFound = await page.goto(`${baseUrl}/this-route-does-not-exist`, { waitUntil: "domcontentloaded" });
  if (notFound?.status() !== 404) throw new Error(`Unknown route returned ${notFound?.status()} instead of 404`);
  if ((await page.getByRole("heading", { name: /could not find this page/i }).count()) !== 1) throw new Error("Custom 404 view did not render");
  process.stdout.write("PASS custom 404\n");
  consoleErrors.length = 0;

  for (const width of [360, 390, 720, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    for (const route of ["/", "/bm", "/fields", "/book", "/sign-up", "/sign-in"]) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      // Dev mode injects CSS at runtime, so wait for layout styles to land before measuring.
      await page.evaluate(() => document.fonts?.ready?.catch(() => undefined));
      await page.waitForFunction(() => {
        const imgs = Array.from(document.querySelectorAll(".brand-mark img"));
        return imgs.length > 0 && imgs.every((img) => parseFloat(getComputedStyle(img).width) < 400);
      }, { timeout: 8_000 }).catch(() => undefined);
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
  const menuButton = page.locator(".site-header__menu");
  await menuButton.click();
  if (!(await page.locator(".site-menu").evaluate((element) => element.classList.contains("menu-open")))) {
    throw new Error("Mobile navigation did not open");
  }
  await page.locator(".site-menu__close").click();
  if (await page.locator(".site-menu").evaluate((element) => element.classList.contains("menu-open"))) {
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

  const pickSessionsTab = page.getByRole("button", { name: /pick sessions/i });
  await pickSessionsTab.focus();
  await page.keyboard.press("Enter");
  if (!(await pickSessionsTab.evaluate((element) => element === document.activeElement))) {
    throw new Error("Booking phase did not stay keyboard focusable");
  }
  process.stdout.write("PASS keyboard navigation interaction\n");

  for (const route of ["/", "/bm", "/fields", "/book"]) {
    // A 1024px layout at 200% browser zoom has a 512px effective CSS viewport.
    // Set that viewport directly so media queries participate as they do in a real zoomed browser.
    await page.setViewportSize({ width: 512, height: 900 });
    await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
    if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) throw new Error(`${route} overflows at 200% zoom`);
  }
  process.stdout.write("PASS 200% zoom reflow on core public routes\n");

  if (bookingFixtures) {
    await page.addInitScript((fixtures) => {
      for (const fixture of Object.values(fixtures)) window.sessionStorage.setItem(`axs:booking:${fixture.reference}`, fixture.accessToken);
    }, bookingFixtures);
    const expected = { pending: /verifying your payment/i, confirmed: /field is confirmed/i, failed: /payment was not completed/i, expired: /booking hold expired/i };
    for (const [state, fixture] of Object.entries(bookingFixtures)) {
      await page.goto(`${baseUrl}/booking/result?reference=${fixture.reference}`, { waitUntil: "domcontentloaded" });
      await page.getByRole("heading", { name: expected[state] }).waitFor();
    }
    process.stdout.write("PASS real persisted pending, confirmed, failed, and expired result states\n");
  }

  const bookingPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  bookingPage.on("console", (message) => {
    if (message.type() === "error" && !/status of 401 \(Unauthorized\)/.test(message.text())) consoleErrors.push(message.text());
  });
  try {
    await bookingPage.goto(`${baseUrl}/book`, { waitUntil: "networkidle" });
    await bookingPage.getByRole("button", { name: /available/i }).first().click();
    if (!expectOnlinePayment) {
      await bookingPage.getByText("1 session").waitFor();
      const disabledAction = bookingPage.getByRole("button", { name: /continue/i });
      if (!(await disabledAction.isDisabled())) throw new Error("Disabled production mode exposed the hold action");
      if (!(await bookingPage.getByText(/online booking will open again soon/i).isVisible())) throw new Error("Disabled mode did not explain the no-reservation boundary");
      process.stdout.write("PASS production-default disabled mode stops before public hold creation\n");
    } else {
      await bookingPage.getByRole("button", { name: /continue/i }).click();
      await bookingPage.getByRole("heading", { name: /your details/i }).waitFor();
      await bookingPage.unrouteAll({ behavior: "wait" });
      await bookingPage.route("**/v1/public/hold-groups", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        await route.continue();
      });
      await bookingPage.context().setOffline(true);
      await bookingPage.getByRole("button", { name: /proceed to secure payment/i }).click();
      await bookingPage.getByRole("alert").waitFor();
      await bookingPage.context().setOffline(false);
      await bookingPage.waitForTimeout(1_000);
      const detailsHeading = bookingPage.getByRole("heading", { name: /your details/i });
      if (!(await detailsHeading.isVisible())) {
        const retry = bookingPage.getByRole("button", { name: /proceed to secure payment/i });
        if (await retry.count()) await retry.click();
      }
      await detailsHeading.waitFor({ timeout: 30_000 });
      process.stdout.write("PASS enabled test mode offline error and delayed-network recovery during hold creation\n");
    }
  } finally {
    await bookingPage.context().setOffline(false);
    await bookingPage.close();
  }

  if (consoleErrors.length) throw new Error(`Browser console errors:\n${consoleErrors.join("\n")}`);
} finally {
  await browser.close();
}
