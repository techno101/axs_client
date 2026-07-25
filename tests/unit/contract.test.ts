import { describe, expect, it } from "vitest";
import { pinnedPublicContract } from "@/lib/api/contract-info";

describe("pinned public API contract", () => {
  it("uses the frozen v1 artifact without importing admin source", () => {
    expect(pinnedPublicContract.version).toBe("1.12.0");
    expect(pinnedPublicContract.timezone).toBe("Asia/Kuala_Lumpur");
    expect(pinnedPublicContract.checksum).toMatch(/^[a-f0-9]{64}$/);
  });
});
