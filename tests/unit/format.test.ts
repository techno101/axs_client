import { describe, expect, it } from "vitest";
import { addDays, formatMoney, toMalaysiaDateInput } from "@/lib/format";

describe("public formatting helpers", () => {
  it("formats integer sen as whole-ringgit MYR", () => {
    expect(formatMoney(60000)).toBe("RM 600");
    expect(formatMoney(80000)).toBe("RM 800");
  });

  it("adds calendar days without mutating the source", () => {
    const source = new Date("2026-07-15T00:00:00+08:00");
    const result = addDays(source, 3);
    expect(source.getDate()).toBe(15);
    expect(result.getDate()).toBe(18);
  });

  it("formats date inputs in Malaysia time", () => {
    const instant = new Date("2026-07-14T16:30:00.000Z");
    expect(toMalaysiaDateInput(instant)).toBe("2026-07-15");
  });
});
