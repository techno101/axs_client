import { afterEach, describe, expect, it, vi } from "vitest";
import { createHttpPublicClient } from "@/lib/api/http-client";

const meta = { requestId: "test-request", serverTime: "2026-07-16T00:00:00.000Z", timezone: "Asia/Kuala_Lumpur" };
function response<T>(data: T, status = 200) { return Response.json({ data, meta, error: null }, { status }); }

afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });

describe("live public contract adapter", () => {
  it("maps the explicit online-payment capability and data-driven slots from public config", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => response({ timezone: "Asia/Kuala_Lumpur", bookingWindowDays: 90, cutoffMinutes: 60, onlineHoldMinutes: 10, currency: "MYR", slots: [{ fieldId: "FIELD_01", code: "MORNING", label: "Morning", startsAt: "09:00", endsAt: "15:00", amountMinor: 60000, currency: "MYR", weekdays: [0, 1, 2, 3, 4, 5, 6] }], onlinePayment: { enabled: false, publicMessage: "Online payment is awaiting verification." } })));
    await expect(createHttpPublicClient("http://localhost:4000").getConfig()).resolves.toEqual({ slots: [{ fieldId: "FIELD_01", id: "MORNING", label: "Morning", startsAt: "09:00", endsAt: "15:00", amountMinor: 60000, currency: "MYR", weekdays: [0, 1, 2, 3, 4, 5, 6] }], onlinePayment: { enabled: false, publicMessage: "Online payment is awaiting verification." } });
  });

  it("sends hold mutations with the pinned v1 payload and idempotency key", async () => {
    const fetch = vi.fn(async () => response({ token: "h".repeat(43), expiresAt: "2026-07-18T04:10:00.000Z", fieldId: "FIELD_01", blockCode: "MORNING", bookingDate: "2026-07-18", amountMinor: 60000, currency: "MYR", state: "active" }, 201));
    vi.stubGlobal("fetch", fetch);
    const client = createHttpPublicClient("http://127.0.0.1:4000");
    await expect(client.createHold({ fieldId: "FIELD_01", blockCode: "MORNING", bookingDate: "2026-07-18" }, "hold-idempotency-0001")).resolves.toMatchObject({ state: "active", amountMinor: 60000 });
    expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:4000/v1/public/holds", expect.objectContaining({ method: "POST", headers: expect.objectContaining({ "Idempotency-Key": "hold-idempotency-0001" }) }));
  });

  it("sends one aggregate order mutation with the grouped-hold token", async () => {
    const fetch = vi.fn(async () => response({ id: "11111111-1111-1111-1111-111111111111", reference: "AXO-REAL1234", totalAmountMinor: 140000, currency: "MYR", status: "payment_pending", paymentStatus: "created", occurrences: [], accessToken: "o".repeat(43) }, 201));
    vi.stubGlobal("fetch", fetch);
    const client = createHttpPublicClient("http://127.0.0.1:4000");
    await expect(client.createOrder({ holdToken: "h".repeat(43), customer: { name: "Order Customer", phone: "+60123456789", email: "order@example.test" } }, "order-idempotency-0001")).resolves.toMatchObject({ reference: "AXO-REAL1234", totalAmountMinor: 140000 });
    expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:4000/v1/public/orders", expect.objectContaining({ method: "POST", headers: expect.objectContaining({ "Idempotency-Key": "order-idempotency-0001" }) }));
  });

  it("derives the result page only from the access-token protected backend status", async () => {
    const fetch = vi.fn(async () => response({ reference: "AXS-REAL1234", fieldId: "FIELD_02", blockCode: "EVENING", bookingDate: "2026-07-18", amountMinor: 80000, currency: "MYR", bookingStatus: "confirmed", paymentStatus: "paid" }));
    vi.stubGlobal("fetch", fetch);
    sessionStorage.setItem("axs:booking:AXS-REAL1234", "browser-held-access-token");
    const result = await createHttpPublicClient("http://localhost:4000").getPaymentResult("AXS-REAL1234");
    expect(result).toMatchObject({ state: "confirmed", fieldName: "FIELD_02", blockLabel: "EVENING" });
    expect(fetch).toHaveBeenCalledWith(expect.not.stringContaining("accessToken="), expect.objectContaining({ headers: expect.objectContaining({ "X-Booking-Access-Token": "browser-held-access-token" }) }));
  });

  it("preserves safe server errors", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ data: null, meta, error: { code: "SLOT_UNAVAILABLE", message: "That slot is no longer available." } }, { status: 409 })));
    await expect(createHttpPublicClient("http://localhost:4000").getAvailability("2026-07-18")).rejects.toMatchObject({ status: 409, code: "SLOT_UNAVAILABLE" });
  });
});
