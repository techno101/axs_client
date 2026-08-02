import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const fixturePath = process.env.E2E_FIXTURE_PATH;
const bookingFixtures = fixturePath ? JSON.parse(await readFile(fixturePath, "utf8")) : null;
const routes = ["/", "/bm", "/book", "/booking/find", "/contact", "/sign-up", "/sign-in", "/verify-email", "/forgot-password", "/reset-password", "/this-route-does-not-exist"];
if (bookingFixtures) routes.push(...Object.values(bookingFixtures).map((fixture) => `/booking/result?reference=${fixture.reference}`));
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
if (bookingFixtures) {
  await page.addInitScript((fixtures) => {
    for (const fixture of Object.values(fixtures)) window.sessionStorage.setItem(`axs:booking:${fixture.reference}`, fixture.accessToken);
  }, bookingFixtures);
}

try {
  for (const route of routes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    if (result.violations.length) {
      const details = result.violations
        .map((violation) => {
          const nodes = violation.nodes
            .map((node) => `  ${node.target.join(" ")}\n  ${node.failureSummary ?? ""}`)
            .join("\n");
          return `${violation.id}: ${violation.help} (${violation.nodes.length} nodes)\n${nodes}`;
        })
        .join("\n");
      throw new Error(`Accessibility violations on ${route}:\n${details}`);
    }
    process.stdout.write(`PASS axe ${route}\n`);
  }
} finally {
  await context.close();
  await browser.close();
}
