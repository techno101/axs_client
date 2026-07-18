import { afterEach, describe, expect, it, vi } from "vitest";
import { createHttpPublicClient } from "@/lib/api/http-client";

const meta = { requestId: "test-request", serverTime: "2026-07-16T00:00:00.000Z", timezone: "Asia/Kuala_Lumpur" };
function response<T>(data: T, status = 200) {
  return Response.json({ data, meta, error: null }, { status });
}

afterEach(() => {
  vi.unstubAllGlobals();
  sessionStorage.clear();
});

describe("live public contract adapter", () => {
  it("maps the explicit online-payment capability from public config", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => response({ timezone: "Asia/Kuala_Lumpur", bookingWindowDays: 90, cutoffMinutes: 60, onlineHoldMinutes: 10, currency: "MYR", blocks: [], onlinePayment: { enabled: false, publicMessage: "Online payment is awaiting verification." } })));
    await expect(createHttpPublicClient("http://localhost:4000").getConfig()).resolves.toEqual({ blocks: [], onlinePayment: { enabled: false, publicMessage: "Online payment is awaiting verification." } });
  });

  it("sends hold mutations with the pinned v1 payload and idempotency key", async () => {
    const fetch = vi.fn(async () => response({ token: "h".repeat(43), expiresAt: "2026-07-18T04:10:00.000Z", fieldId: "FIELD_01", blockCode: "MORNING", bookingDate: "2026-07-18", amountMinor: 60000, currency: "MYR", state: "active" }, 201));
    vi.stubGlobal("fetch", fetch);
    const client = createHttpPublicClient("http://127.0.0.1:4000");
    await expect(client.createHold({ fieldId: "FIELD_01", blockCode: "MORNING", bookingDate: "2026-07-18" }, "hold-idempotency-0001")).resolves.toMatchObject({ state: "active", amountMinor: 60000 });
    expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:4000/v1/public/holds", expect.objectContaining({ method: "POST", headers: expect.objectContaining({ "Idempotency-Key": "hold-idempotency-0001" }) }));
  });

  it("derives the result page only from the access-token protected backend status", async () => {
    const fetch = vi.fn(async () => response({ reference: "AXS-REAL1234", fieldId: "FIELD_02", blockCode: "EVENING", bookingDate: "2026-07-18", amountMinor: 80000, currency: "MYR", bookingStatus: "confirmed", paymentStatus: "paid" }));
    vi.stubGlobal("fetch", fetch);
    sessionStorage.setItem("axs:booking:AXS-REAL1234", "browser-held-access-token");
    const result = await createHttpPublicClient("http://localhost:4000").getPaymentResult("AXS-REAL1234");
    expect(result).toMatchObject({ state: "confirmed", fieldName: "Field 2", blockLabel: "Evening block · 15:00–21:00" });
    expect(fetch).toHaveBeenCalledWith(
      expect.not.stringContaining("accessToken="),
      expect.objectContaining({ headers: expect.objectContaining({ "X-Booking-Access-Token": "browser-held-access-token" }) }),
    );
  });

  it("preserves safe server errors", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ data: null, meta, error: { code: "SLOT_UNAVAILABLE", message: "That block is no longer available." } }, { status: 409 })));
    await expect(createHttpPublicClient("http://localhost:4000").getAvailability("2026-07-18")).rejects.toMatchObject({ status: 409, code: "SLOT_UNAVAILABLE" });
  });
});
