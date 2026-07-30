import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const routes = [
  "/",
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

  const notFound = await page.goto(`${baseUrl}/this-route-does-not-exist`, { waitUntil: "domcontentloaded" });
  if (notFound?.status() !== 404) throw new Error(`Unknown route returned ${notFound?.status()} instead of 404`);
  if ((await page.getByRole("heading", { name: /could not find this page/i }).count()) !== 1) throw new Error("Custom 404 view did not render");
  process.stdout.write("PASS custom 404\n");

  for (const width of [360, 390, 720, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    for (const route of ["/", "/fields", "/book", "/sign-up", "/sign-in"]) {
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

  for (const route of ["/", "/fields", "/book"]) {
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

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/book`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /choose field/i }).click();
  await page.getByRole("button", { name: /^0?2.*field 2/i }).click();
  await page.getByRole("button", { name: /choose block/i }).click();
  await page.getByRole("button", { name: /available/i }).first().click();
  if (!expectOnlinePayment) {
    const disabledAction = page.getByRole("button", { name: /online payment unavailable/i });
    if (!(await disabledAction.isDisabled())) throw new Error("Disabled production mode exposed the hold action");
    if (!(await page.getByText(/no field block has been held/i).isVisible())) throw new Error("Disabled mode did not explain the no-hold boundary");
    process.stdout.write("PASS production-default disabled mode stops before public hold creation\n");
  } else {
    await page.unrouteAll({ behavior: "wait" });
    await page.route("**/v1/public/holds", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await route.continue();
    });
    await page.context().setOffline(true);
    await page.getByRole("button", { name: /add details/i }).click();
    await page.getByRole("alert").waitFor();
    await page.context().setOffline(false);
    await page.waitForTimeout(1_000);
    const customerStep = page.getByRole("heading", { name: /who is booking/i });
    if (!(await customerStep.isVisible())) {
      const retry = page.getByRole("button", { name: /add details/i });
      if (await retry.count()) await retry.click();
    }
    await customerStep.waitFor({ timeout: 30_000 });
    process.stdout.write("PASS enabled test mode offline error and delayed-network recovery during hold creation\n");
  }
} finally {
  await browser.close();
}
