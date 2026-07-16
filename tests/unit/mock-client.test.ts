import { describe, expect, it } from "vitest";
import { mockPublicClient } from "@/lib/api/mock-client";

describe("mock public API client", () => {
  it("exposes only the two approved launch fields and blocks", async () => {
    const [fields, blocks] = await Promise.all([
      mockPublicClient.getFields(),
      mockPublicClient.getBlocks(),
    ]);
    expect(fields.map((field) => field.id)).toEqual(["FIELD_01", "FIELD_02"]);
    expect(blocks.map((block) => block.amountMinor)).toEqual([60000, 80000]);
  });

  it("maps the complete public availability fixture", async () => {
    const slots = await mockPublicClient.getAvailability("2026-07-18");
    expect(slots).toHaveLength(4);
    expect(new Set(slots.map((slot) => slot.status))).toEqual(
      new Set(["available", "held", "booked", "blocked"]),
    );
  });

  it("returns a pending payment fixture without browser confirmation authority", async () => {
    const result = await mockPublicClient.getPaymentResult("AXS-TEST");
    expect(result).toMatchObject({ reference: "AXS-TEST", state: "pending" });
  });
});
