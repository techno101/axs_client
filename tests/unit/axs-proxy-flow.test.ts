import { afterEach, describe, expect, it, vi } from "vitest";
import { createHttpPublicClient } from "@/lib/api/http-client";
import { handleAxsProxy } from "@/server/axs-proxy/handler";

const clientOrigin = "https://bookings.example.test";
const adminOrigin = "https://operations.example.test";
const proxyConfig = { clientOrigin, adminOrigin, proxySecret: "f".repeat(48) };
const meta = { requestId: "fixture-request", serverTime: "2026-07-30T00:00:00.000Z", timezone: "Asia/Kuala_Lumpur" };

function ok(data: unknown, status = 200) {
  return Response.json({ data, meta, error: null }, { status });
}

afterEach(() => vi.unstubAllGlobals());

describe("controlled same-origin booking fixture", () => {
  it("carries public reads, grouped hold, order, payment attempt and protected result through the BFF", async () => {
    const upstream = vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
      const url = new URL(String(input));
      const headers = new Headers(init?.headers);
      if (init?.method !== "GET") {
        expect(headers.get("x-axs-client-proxy-secret")).toBe(proxyConfig.proxySecret);
        expect(headers.get("idempotency-key")).toMatch(/idempotency/);
      }
      if (url.pathname === "/v1/public/fields") return ok([]);
      if (url.pathname === "/v1/public/hold-groups") {
        return ok({ token: "h".repeat(43), expiresAt: "2026-07-30T00:10:00.000Z", state: "active", occurrences: [], totalAmountMinor: 140000, currency: "MYR" }, 201);
      }
      if (url.pathname === "/v1/public/orders") {
        return ok({ id: "11111111-1111-1111-1111-111111111111", reference: "AXO-TEST123", totalAmountMinor: 140000, currency: "MYR", status: "payment_pending", paymentStatus: "created", occurrences: [], accessToken: "a".repeat(43) }, 201);
      }
      if (url.pathname === "/v1/public/orders/AXO-TEST123/payment-attempts") {
        return ok({ id: "22222222-2222-2222-2222-222222222222", orderReference: "AXO-TEST123", provider: "hitpay", environment: "sandbox", status: "created", amountMinor: 140000, currency: "MYR", redirectUrl: "https://sandbox.hit-pay.com/checkout/test" }, 201);
      }
      if (url.pathname === "/v1/public/orders/AXO-TEST123/status") {
        expect(headers.get("x-booking-access-token")).toBe("a".repeat(43));
        return ok({ reference: "AXO-TEST123", status: "payment_pending", paymentStatus: "created", totalAmountMinor: 140000, currency: "MYR", occurrences: [] });
      }
      return Response.json({ data: null, meta, error: { code: "NOT_FOUND", message: "Fixture route missing." } }, { status: 404 });
    });

    vi.stubGlobal("fetch", vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
      const url = new URL(String(input), clientOrigin);
      const headers = new Headers(init?.headers);
      if ((init?.method ?? "GET") !== "GET") headers.set("Origin", clientOrigin);
      const body = typeof init?.body === "string" ? init.body : undefined;
      const proxyRequest = new Request(url, { ...init, headers, body });
      const segments = url.pathname.slice("/api/axs/".length).split("/");
      return handleAxsProxy(proxyRequest, segments, proxyConfig, upstream);
    }));

    const client = createHttpPublicClient(`${clientOrigin}/api/axs`);
    await expect(client.getFields()).resolves.toEqual([]);
    const hold = await client.createHoldGroup({ occurrences: [{ fieldId: "FIELD_01", blockCode: "MORNING", bookingDate: "2026-08-01" }] }, "hold-idempotency-0001");
    const order = await client.createOrder({ holdToken: hold.token, customer: { name: "Fixture Customer", phone: "+60123456789", email: "fixture@example.test" } }, "order-idempotency-0001");
    expect(order.accessToken).toBe("a".repeat(43));
    await expect(client.createOrderPaymentAttempt(order.reference, { method: "online_provider", returnPath: "/booking/result?reference=AXO-TEST123" }, "payment-idempotency-0001")).resolves.toMatchObject({ status: "created" });
    await expect(client.getOrderStatus(order.reference, order.accessToken!)).resolves.toMatchObject({ reference: "AXO-TEST123", status: "payment_pending" });
  });
});
