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
});
