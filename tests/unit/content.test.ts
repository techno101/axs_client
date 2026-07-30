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

  it("marks venue specifications as pending instead of inventing facilities", () => {
    expect(fields.every((field) => field.description.includes("pending owner confirmation"))).toBe(true);
  });
});
