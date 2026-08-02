import { describe, expect, it } from "vitest";
import { pinnedPublicContract } from "@/lib/api/contract-info";

describe("pinned public API contract", () => {
  it("uses the frozen v1 artifact without importing admin source", () => {
    expect(pinnedPublicContract.version).toBe("1.15.0");
    expect(pinnedPublicContract.timezone).toBe("Asia/Kuala_Lumpur");
    expect(pinnedPublicContract.checksum).toBe("fb56a46557d58a0709761d5dbe5ddb7059d6f907a34b77c605fdf2d690bc6341");
  });
});
