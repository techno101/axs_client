import { describe, expect, it } from "vitest";
import { pinnedPublicContract } from "@/lib/api/contract-info";

describe("pinned public API contract", () => {
  it("uses the frozen v1 artifact without importing admin source", () => {
    expect(pinnedPublicContract.version).toBe("1.18.0");
    expect(pinnedPublicContract.timezone).toBe("Asia/Kuala_Lumpur");
    expect(pinnedPublicContract.checksum).toBe("22102e26c956948532334fdf8a06fa0fe1f14809cdc3f802ce0beb97856c9a37");
  });
});
