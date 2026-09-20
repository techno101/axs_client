import { chromium } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const routes = ["/", "/book", "/fields", "/booking/find", "/contact", "/sign-in", "/sign-up"];

function parseRgb(colorStr, defaultBg = [255, 255, 255]) {
  if (!colorStr) return null;
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (!match) return null;
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  const a = match[4] !== undefined ? Number(match[4]) : 1;
  if (a < 1) {
    return [
      Math.round(r * a + defaultBg[0] * (1 - a)),
      Math.round(g * a + defaultBg[1] * (1 - a)),
      Math.round(b * a + defaultBg[2] * (1 - a)),
    ];
  }
  return [r, g, b];
}

function luminance([r, g, b]) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(rgb1, rgb2) {
  const lum1 = luminance(rgb1);
  const lum2 = luminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

try {
  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    console.log(`Auditing buttons on ${route}...`);

    const buttons = await page.locator("button, [role='button']").all();
    let checkedCount = 0;

    for (const btn of buttons) {
      const isVisible = await btn.isVisible().catch(() => false);
      if (!isVisible) continue;

      const styles = await btn.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          text: el.innerText.trim().slice(0, 30),
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          width: rect.width,
          height: rect.height,
        };
      });

      if (styles.width === 0 || styles.height === 0 || !styles.text) continue;

      const fgRgb = parseRgb(styles.color);
      const bgRgb = parseRgb(styles.backgroundColor);

      if (fgRgb && bgRgb && styles.backgroundColor !== "rgba(0, 0, 0, 0)") {
        const diff = Math.abs(fgRgb[0] - bgRgb[0]) + Math.abs(fgRgb[1] - bgRgb[1]) + Math.abs(fgRgb[2] - bgRgb[2]);
        if (diff < 15) {
          throw new Error(
            `CRITICAL CONTRAST VIOLATION on ${route} for button "${styles.text}": color (${styles.color}) and backgroundColor (${styles.backgroundColor}) are virtually identical!`
          );
        }

        const ratio = contrastRatio(fgRgb, bgRgb);
        if (ratio < 3.0) {
          console.warn(`[WARNING] Low contrast ratio on ${route} for button "${styles.text}": ${ratio.toFixed(2)}:1 (fg: ${styles.color}, bg: ${styles.backgroundColor})`);
        }
      }

      checkedCount++;
    }

    console.log(`✓ ${route}: verified ${checkedCount} buttons.`);
  }

  // Interactive verification on /book
  console.log("\nAuditing booking wizard interactive serialized flow on /book...");
  await page.goto(`${baseUrl}/book`, { waitUntil: "domcontentloaded" });

  // Verify step 1 and step 2 are present
  const stepFieldTitle = await page.locator("#step-field-title").innerText();
  if (!stepFieldTitle.toLowerCase().includes("select field")) {
    throw new Error(`Expected Step 1 title "Select Field", found: "${stepFieldTitle}"`);
  }

  const stepTimingTitle = await page.locator("#step-timing-title").innerText();
  if (!stepTimingTitle.toLowerCase().includes("select timing")) {
    throw new Error(`Expected Step 2 title "Select Timing", found: "${stepTimingTitle}"`);
  }

  // Check timing meter exists
  const meter = page.locator("[data-testid='timing-meter-FIELD_01']");
  await meter.waitFor({ state: "visible", timeout: 5000 });
  console.log("✓ Field 1 timing meter visible.");

  // Check pricing & tax analysis table
  const pricingTable = page.locator(".pricing-analysis-table");
  const tableText = await pricingTable.innerText();
  if (!/pricing & tax analysis/i.test(tableText) || !/8% sst/i.test(tableText)) {
    throw new Error(`Pricing table missing SST tax breakdown. Content: ${tableText}`);
  }
  console.log("✓ Pricing & tax analysis table verified with Malaysian SST 8%.");

  // Verify Add to Basket button styling and contrast
  const actionButton = page.locator(".pricing-actions-pane button");
  const btnStyles = await actionButton.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      color: computed.color,
      backgroundColor: computed.backgroundColor,
      text: el.innerText,
    };
  });
  console.log(`✓ Add to basket button text: "${btnStyles.text}" | color: ${btnStyles.color} | bg: ${btnStyles.backgroundColor}`);

  const fgRgb = parseRgb(btnStyles.color);
  const bgRgb = parseRgb(btnStyles.backgroundColor);
  if (fgRgb && bgRgb) {
    const ratio = contrastRatio(fgRgb, bgRgb);
    console.log(`✓ Add to basket contrast ratio: ${ratio.toFixed(2)}:1 (WCAG AA standard is 4.5:1)`);
    if (ratio < 4.5) {
      throw new Error(`Add to basket button fails WCAG AA: contrast ratio is ${ratio.toFixed(2)}:1`);
    }
  }

  // Test "Both Fields" toggle
  const bothBtn = page.locator(".field-select-btn", { hasText: "Both Fields" });
  await bothBtn.click();
  await page.locator("[data-testid='timing-meter-FIELD_02']").waitFor({ state: "visible", timeout: 5000 });
  console.log("✓ Both fields timing meters active and visible.");

  console.log("\nALL BUTTON CONTRAST AND BOOKING WIZARD CHECKS PASSED!");
} finally {
  await context.close();
  await browser.close();
}
