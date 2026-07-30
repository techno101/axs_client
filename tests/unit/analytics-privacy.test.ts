import { describe, expect, it } from "vitest";
import { analyticsAllowedOnPath, privacySafeAnalyticsEvent } from "@/lib/analytics-privacy";

describe("privacy-safe analytics boundary", () => {
  it("drops result and lookup routes that can contain booking identifiers", () => {
    expect(analyticsAllowedOnPath("/booking/result")).toBe(false);
    expect(analyticsAllowedOnPath("/booking/find")).toBe(false);
    expect(analyticsAllowedOnPath("/sign-up")).toBe(false);
    expect(analyticsAllowedOnPath("/account/security")).toBe(false);
    expect(analyticsAllowedOnPath("/google/return")).toBe(false);
    expect(privacySafeAnalyticsEvent({ type: "pageview", url: "https://example.test/booking/result?reference=AXS-PRIVATE" })).toBeNull();
  });

  it("removes queries and fragments from all other page views", () => {
    expect(privacySafeAnalyticsEvent({ type: "pageview", url: "https://example.test/fields/field-one?name=private#customer" })).toEqual({ type: "pageview", url: "https://example.test/fields/field-one" });
  });
});
