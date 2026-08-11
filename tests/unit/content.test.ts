import { describe, expect, it } from "vitest";
import { blocks, fields } from "@/lib/content";

describe("local display content", () => {
  it("keeps approved field identifiers, neutral names and authoritative block prices", () => {
    expect(fields.map((field) => ({ id: field.id, name: field.name }))).toEqual([
      { id: "FIELD_01", name: "Field 1" },
      { id: "FIELD_02", name: "Field 2" },
    ]);
    expect(blocks.map((block) => block.amountMinor)).toEqual([60000, 80000]);
  });

  it("uses approved venue facts without exposing internal content status", () => {
    expect(fields.every((field) => field.description.includes("full-size football pitch"))).toBe(true);
    expect(fields.every((field) => !field.description.toLowerCase().includes("pending"))).toBe(true);
    expect(fields.every((field) => field.facilityFacts.length > 0)).toBe(true);
  });
});
