import { describe, expect, it, vi } from "vitest";
import { readClientProxyConfig } from "@/server/axs-proxy/config";
import { handleAxsProxy } from "@/server/axs-proxy/handler";

const secret = "s".repeat(48);
const config = {
  adminOrigin: "https://operations.example.test",
  clientOrigin: "https://bookings.example.test",
  proxySecret: secret,
};

function request(path: string, init: RequestInit = {}) {
  return new Request(`https://bookings.example.test/api/axs/${path}`, init);
}

function mutation(path: string, headers: Record<string, string> = {}, body = "{}") {
  return request(path, {
    method: "POST",
    headers: { Origin: config.clientOrigin, "Content-Type": "application/json", ...headers },
    body,
  });
}

describe("same-origin AXS proxy", () => {
  it("accepts secure hosted origins and local HTTP only outside production", () => {
    expect(readClientProxyConfig({
      NODE_ENV: "production",
      AXS_ADMIN_API_ORIGIN: config.adminOrigin,
      PUBLIC_APP_ORIGIN: config.clientOrigin,
      AXS_CLIENT_PROXY_SECRET: secret,
    })).toEqual(config);
    expect(readClientProxyConfig({
      NODE_ENV: "development",
      AXS_ADMIN_API_ORIGIN: "http://127.0.0.1:3000",
      PUBLIC_APP_ORIGIN: "http://localhost:3001",
      AXS_CLIENT_PROXY_SECRET: secret,
    }).adminOrigin).toBe("http://127.0.0.1:3000");
    expect(() => readClientProxyConfig({
      NODE_ENV: "production",
      AXS_ADMIN_API_ORIGIN: "http://127.0.0.1:3000",
      PUBLIC_APP_ORIGIN: config.clientOrigin,
      AXS_CLIENT_PROXY_SECRET: secret,
    })).toThrow(/HTTPS/);
    expect(() => readClientProxyConfig({
      NODE_ENV: "production",
      AXS_ADMIN_API_ORIGIN: config.adminOrigin,
      PUBLIC_APP_ORIGIN: config.clientOrigin,
    })).toThrow(/AXS_CLIENT_PROXY_SECRET/);
  });

  it.each([
    ["v1/admin/users", ["v1", "admin", "users"]],
    ["v1/pos/login", ["v1", "pos", "login"]],
    ["v1/webhooks/hitpay", ["v1", "webhooks", "hitpay"]],
    ["v1/public/../../admin", ["v1", "public", "..", "..", "admin"]],
  ])("rejects non-allowlisted path %s", async (path, segments) => {
    const response = await handleAxsProxy(request(path), segments, config, vi.fn());
    expect(response.status).toBe(404);
  });

  it("rejects unsupported methods and cross-site mutations", async () => {
    const unsupported = await handleAxsProxy(request("v1/public/config", { method: "PUT" }), ["v1", "public", "config"], config, vi.fn());
    expect(unsupported.status).toBe(405);
    const crossSite = await handleAxsProxy(mutation("v1/public/orders", { Origin: "https://evil.example" }), ["v1", "public", "orders"], config, vi.fn());
    expect(crossSite.status).toBe(403);
  });

  it("forwards only required mutation headers and never logs the secret", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const upstream = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      expect(headers.get("idempotency-key")).toBe("order-idempotency-0001");
      expect(headers.get("x-axs-client-proxy-secret")).toBe(secret);
      expect(headers.get("x-axs-client-context")).toMatch(/^v1:[a-f0-9]{64}$/);
      expect(headers.get("authorization")).toBeNull();
      expect(headers.get("cookie")).toBeNull();
      expect(headers.get("x-forwarded-for")).toBeNull();
      return Response.json({ data: { reference: "AXO-TEST123" }, meta: {}, error: null }, { status: 201 });
    });
    const response = await handleAxsProxy(
      mutation("v1/public/orders", {
        "Idempotency-Key": "order-idempotency-0001",
        Authorization: "Bearer browser-value",
        Cookie: "browser=value",
        "X-Forwarded-For": "203.0.113.9",
      }),
      ["v1", "public", "orders"],
      config,
      upstream,
    );
    expect(response.status).toBe(201);
    expect(log).not.toHaveBeenCalled();
    log.mockRestore();
  });

  it("forwards booking access only to a protected status route", async () => {
    const upstream = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      expect(headers.get("x-booking-access-token")).toBe("a".repeat(43));
      expect(headers.get("x-axs-client-proxy-secret")).toBe(secret);
      return Response.json({ data: { reference: "AXO-TEST123" }, meta: {}, error: null });
    });
    const response = await handleAxsProxy(
      request("v1/public/orders/AXO-TEST123/status", { headers: { "X-Booking-Access-Token": "a".repeat(43) } }),
      ["v1", "public", "orders", "AXO-TEST123", "status"],
      config,
      upstream,
    );
    expect(response.status).toBe(200);
  });

  it("enforces the body limit and normalizes invalid or unavailable upstream responses", async () => {
    const tooLarge = await handleAxsProxy(
      mutation("v1/public/orders", { "Content-Length": "65537" }),
      ["v1", "public", "orders"],
      config,
      vi.fn(),
    );
    expect(tooLarge.status).toBe(413);

    const invalid = await handleAxsProxy(
      request("v1/public/config"),
      ["v1", "public", "config"],
      config,
      vi.fn(async () => new Response("<html>bad gateway</html>", { status: 502 })),
    );
    expect(invalid.status).toBe(502);
    await expect(invalid.json()).resolves.toMatchObject({ error: { code: "SERVICE_UNAVAILABLE" } });

    const unavailable = await handleAxsProxy(
      request("v1/public/config"),
      ["v1", "public", "config"],
      config,
      vi.fn(async () => { throw new Error("connection details must not escape"); }),
    );
    expect(unavailable.status).toBe(502);
  });

  it("times out a stalled upstream request with a customer-safe response", async () => {
    const stalled = vi.fn((_url: URL | RequestInfo, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
    }));
    const response = await handleAxsProxy(request("v1/public/config"), ["v1", "public", "config"], config, stalled, 5);
    expect(response.status).toBe(502);
  });

  it("rewrites Admin-owned media URLs to the same-origin media route", async () => {
    const response = await handleAxsProxy(
      request("v1/public/fields"),
      ["v1", "public", "fields"],
      config,
      vi.fn(async () => Response.json({ data: [{ imageUrl: `${config.adminOrigin}/api/v1/public/media/11111111-1111-1111-1111-111111111111` }], meta: {}, error: null })),
    );
    await expect(response.json()).resolves.toMatchObject({ data: [{ imageUrl: "/api/axs/v1/public/media/11111111-1111-1111-1111-111111111111" }] });
  });
});
