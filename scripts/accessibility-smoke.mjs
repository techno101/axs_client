import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const routes = ["/", "/book", "/booking/result?reference=AXS-ACCESSIBILITY", "/booking/find", "/contact", "/this-route-does-not-exist"];
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

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
