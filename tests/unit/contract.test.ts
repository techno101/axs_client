import { describe, expect, it } from "vitest";
import { pinnedPublicContract } from "@/lib/api/contract-info";

describe("pinned public API contract", () => {
  it("uses the frozen v1 artifact without importing admin source", () => {
    expect(pinnedPublicContract.version).toBe("1.14.0");
    expect(pinnedPublicContract.timezone).toBe("Asia/Kuala_Lumpur");
    expect(pinnedPublicContract.checksum).toBe("8dfca65cd62b789c09099abf354bbbc936d0f5651ccf557e8eb95921cd5ccc9f");
  });
});
