import { describe, expect, it } from "vitest";
import { pinnedPublicContract } from "@/lib/api/contract-info";

describe("pinned public API contract", () => {
  it("uses the frozen v1 artifact without importing admin source", () => {
    expect(pinnedPublicContract.version).toBe("1.21.0");
    expect(pinnedPublicContract.timezone).toBe("Asia/Kuala_Lumpur");
    expect(pinnedPublicContract.checksum).toBe("88638d8d343ef915d8865e9a12ce4dcda208ff1a096ac833b235ad7d100e5546");
  });
});
