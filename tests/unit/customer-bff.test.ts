import { describe, expect, it, vi } from "vitest";
import { handleCustomerBff } from "@/server/customer-bff/handler";

const config = { adminOrigin: "https://admin.example.test", clientOrigin: "https://client.example.test", proxySecret: "z".repeat(48) };

describe("same-origin customer BFF", () => {
  it("rejects cross-site account mutations before it reaches Admin", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    const response = await handleCustomerBff(new Request("https://client.example.test/api/customer/login", { method: "POST", headers: { Origin: "https://attacker.example", "Content-Type": "application/json" }, body: "{}" }), ["login"], config);
    expect(response.status).toBe(403);
    expect(fetcher).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("sets opaque Client-origin cookies and removes raw session and email tokens from browser output", async () => {
    const rawSession = "s".repeat(43);
    const rawCsrf = "c".repeat(43);
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { accepted: true, verificationToken: "v".repeat(43), session: { account: { id: "a", email: "person@example.test", displayName: "Person", phone: "+60123456789", age: 20, status: "pending", verifiedAt: null, passwordSet: true, googleLinked: false }, sessionToken: rawSession, csrfToken: rawCsrf, idleExpiresAt: "2030-01-01T00:00:00.000Z", absoluteExpiresAt: "2030-01-20T00:00:00.000Z" } }, meta: {}, error: null }), { status: 202, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetcher);
    const response = await handleCustomerBff(new Request("https://client.example.test/api/customer/register", { method: "POST", headers: { Origin: config.clientOrigin, "Content-Type": "application/json", "X-Forwarded-For": "203.0.113.7" }, body: JSON.stringify({ email: "person@example.test" }) }), ["register"], config);
    const text = await response.text();
    expect(response.status).toBe(202);
    expect(text).not.toContain(rawSession);
    expect(text).not.toContain(rawCsrf);
    expect(text).not.toContain("verificationToken");
    expect(response.headers.get("set-cookie")).toContain("axs_customer_session=");
    expect(fetcher.mock.calls[0][1].headers.get("X-AXS-Client-Proxy-Secret")).toBe(config.proxySecret);
    vi.unstubAllGlobals();
  });

  it("forwards only the exact owner-booking reschedule mutation with the Client cookie and CSRF proof", async () => {
    const reference = "AXS-ABCD-EFGH-JKMN-PRST";
    const session = "s".repeat(43);
    const csrf = "c".repeat(43);
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { reference, fieldId: "FIELD_02", blockCode: "MORNING", bookingDate: "2026-08-20", amountMinor: 60000, currency: "MYR" }, meta: {}, error: null }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetcher);
    const request = new Request(`https://client.example.test/api/customer/bookings/${reference}/reschedule`, { method: "POST", headers: { Origin: config.clientOrigin, "Content-Type": "application/json", Cookie: `axs_customer_session=${session}; axs_customer_csrf=${csrf}`, "X-CSRF-Token": csrf }, body: JSON.stringify({ fieldId: "FIELD_02", blockCode: "MORNING", bookingDate: "2026-08-20", reason: "Team availability changed" }) });
    const response = await handleCustomerBff(request, ["bookings", reference, "reschedule"], config);
    expect(response.status).toBe(200);
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [destination, init] = fetcher.mock.calls[0];
    expect(String(destination)).toBe(`https://admin.example.test/v1/customer/bookings/${reference}/reschedule`);
    expect(init.method).toBe("POST");
    expect(init.headers.get("X-AXS-Customer-Session")).toBe(session);
    expect(init.headers.get("X-CSRF-Token")).toBe(csrf);
    expect(JSON.parse(init.body)).toMatchObject({ fieldId: "FIELD_02", blockCode: "MORNING", bookingDate: "2026-08-20" });
    vi.unstubAllGlobals();
  });

  it("returns 200 with null account for unauthenticated guest session probe without calling upstream", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    const response = await handleCustomerBff(new Request("https://client.example.test/api/customer/session", { method: "GET" }), ["session"], config);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toEqual({ account: null });
    expect(fetcher).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
