import { createHmac, randomUUID } from "node:crypto";
import { loadClientProxyConfig, type ClientProxyConfig } from "@/server/axs-proxy/config";

const MAX_BODY_BYTES = 64 * 1024;
const UPSTREAM_TIMEOUT_MS = 8_000;
const REQUEST_ID = /^[A-Za-z0-9._:-]{8,120}$/;
const LEGACY_BOOKING_REFERENCE = /^AXS-[A-Z0-9]{6,12}$/;
const MODERN_BOOKING_REFERENCE = /^AXS-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}(?:-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}){3}$/;
const ORDER_REFERENCE = /^AXO-[A-Z0-9]{6,16}$/;
const TOKEN = /^[A-Za-z0-9_-]{32,256}$/;
const SLUG = /^[a-z0-9][a-z0-9-]{0,119}$/;
const MEDIA_ID = /^[0-9a-f]{8}-[0-9a-f-]{27,45}$/i;

type RouteRule = {
  methods: readonly string[];
  privateResponse?: boolean;
  idempotency?: boolean;
  bookingAccess?: boolean;
  lookupGrant?: boolean;
  customerSession?: boolean;
  binary?: boolean;
  jsonBody?: boolean;
};

function ruleFor(segments: string[]): RouteRule | null {
  if (segments[0] !== "v1" || segments[1] !== "public") return null;
  const rest = segments.slice(2);
  if (rest.length === 1 && ["config", "fields", "availability", "articles", "faqs", "site-config"].includes(rest[0])) return { methods: ["GET"] };
  if (rest.length === 2 && rest[0] === "availability" && rest[1] === "summary") return { methods: ["GET"] };
  if (rest.length === 2 && rest[0] === "fields" && SLUG.test(rest[1])) return { methods: ["GET"] };
  if (rest.length === 2 && rest[0] === "articles" && SLUG.test(rest[1])) return { methods: ["GET"] };
  if (rest.length === 2 && rest[0] === "pages" && SLUG.test(rest[1])) return { methods: ["GET"] };
  if (rest.length === 2 && rest[0] === "media" && MEDIA_ID.test(rest[1])) return { methods: ["GET"] };
  if (rest.length === 1 && ["holds", "hold-groups", "bookings", "orders", "visitors"].includes(rest[0])) {
    return { methods: ["POST"], privateResponse: true, idempotency: rest[0] !== "visitors", jsonBody: true };
  }
  if (rest.length === 2 && rest[0] === "visitors" && rest[1] === "heartbeat") {
    return { methods: ["POST"], privateResponse: true, jsonBody: true };
  }
  if (rest.length === 1 && ["holds", "hold-groups", "bookings", "orders"].includes(rest[0])) {
    return { methods: ["POST"], privateResponse: true, idempotency: true, jsonBody: true, customerSession: ["bookings", "orders"].includes(rest[0]) };
  }
  if (rest.length === 2 && rest[0] === "bookings" && rest[1] === "find") {
    return { methods: ["POST"], privateResponse: true, jsonBody: true };
  }
  if (rest.length === 3 && ((rest[0] === "bookings" && (LEGACY_BOOKING_REFERENCE.test(rest[1]) || MODERN_BOOKING_REFERENCE.test(rest[1]))) || (rest[0] === "orders" && ORDER_REFERENCE.test(rest[1]))) && rest[2] === "status") {
    return { methods: ["GET"], privateResponse: true, bookingAccess: true };
  }
  if (rest.length === 3 && ((rest[0] === "bookings" && (LEGACY_BOOKING_REFERENCE.test(rest[1]) || MODERN_BOOKING_REFERENCE.test(rest[1]))) || (rest[0] === "orders" && ORDER_REFERENCE.test(rest[1]))) && rest[2] === "payment-attempts") {
    return { methods: ["POST"], privateResponse: true, idempotency: true, jsonBody: true };
  }
  if (rest.length === 3 && rest[0] === "bookings" && (LEGACY_BOOKING_REFERENCE.test(rest[1]) || MODERN_BOOKING_REFERENCE.test(rest[1])) && rest[2] === "download") {
    return { methods: ["GET"], privateResponse: true, lookupGrant: true, binary: true };
  }
  if (rest.length === 2 && ["holds", "hold-groups"].includes(rest[0]) && TOKEN.test(rest[1])) {
    return { methods: ["DELETE"], privateResponse: true };
  }
  return null;
}

function envelope(status: number, code: string, message: string, requestId: string): Response {
  return Response.json(
    { data: null, meta: { requestId }, error: { code, message } },
    { status, headers: { "Cache-Control": "private, no-store", "X-Request-Id": requestId } },
  );
}

function requestIdentifier(request: Request): string {
  const supplied = request.headers.get("x-request-id")?.trim();
  return supplied && REQUEST_ID.test(supplied) ? supplied : randomUUID();
}

function trustedBrowserOrigin(request: Request, expected: string): boolean {
  const origin = request.headers.get("origin");
  if (origin) return origin === expected;
  const referer = request.headers.get("referer");
  if (!referer) return false;
  try {
    return new URL(referer).origin === expected;
  } catch {
    return false;
  }
}

function clientContext(request: Request, secret: string): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate = forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
  return `v1:${createHmac("sha256", secret).update(candidate.slice(0, 128)).digest("hex")}`;
}

function invalidRawPath(request: Request): boolean {
  const pathname = new URL(request.url).pathname.toLowerCase();
  return pathname.includes("%2e") || pathname.includes("%2f") || pathname.includes("%5c") || pathname.includes("\\");
}

function safeQuery(segments: string[], search: string): boolean {
  if (!search) return true;
  const path = segments.join("/");
  const params = new URLSearchParams(search);
  if (path === "v1/public/availability") {
    return [...params.keys()].every((key) => key === "date") && /^\d{4}-\d{2}-\d{2}$/.test(params.get("date") ?? "");
  }
  if (path === "v1/public/availability/summary") {
    return [...params.keys()].every((key) => key === "from" || key === "to")
      && /^\d{4}-\d{2}-\d{2}$/.test(params.get("from") ?? "")
      && /^\d{4}-\d{2}-\d{2}$/.test(params.get("to") ?? "");
  }
  return false;
}

function customerSessionCookie(request: Request): string | null {
  const encoded = request.headers.get("cookie")?.match(/(?:^|;\s*)axs_customer_session=([^;]+)/)?.[1];
  if (!encoded) return null;
  try {
    const value = decodeURIComponent(encoded);
    return /^[A-Za-z0-9_-]{40,256}$/.test(value) ? value : null;
  } catch { return null; }
}

async function bodyFor(request: Request, rule: RouteRule, requestId: string): Promise<string | Response | undefined> {
  if (!rule.jsonBody && request.method !== "DELETE") return undefined;
  if (rule.jsonBody && !request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return envelope(415, "VALIDATION_ERROR", "Content-Type must be application/json.", requestId);
  }
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return envelope(413, "VALIDATION_ERROR", "Request body is too large.", requestId);
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return envelope(413, "VALIDATION_ERROR", "Request body is too large.", requestId);
  }
  if (rule.jsonBody) {
    try {
      JSON.parse(raw);
    } catch {
      return envelope(400, "VALIDATION_ERROR", "Request body must be valid JSON.", requestId);
    }
  }
  return raw;
}

function rewrittenJson(value: unknown, config: ClientProxyConfig): unknown {
  if (typeof value === "string") {
    const prefixes = [
      `${config.adminOrigin}/api/v1/public/media/`,
      `${config.adminOrigin}/v1/public/media/`,
    ];
    const prefix = prefixes.find((candidate) => value.startsWith(candidate));
    return prefix ? `/api/axs/v1/public/media/${value.slice(prefix.length)}` : value;
  }
  if (Array.isArray(value)) return value.map((item) => rewrittenJson(item, config));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, rewrittenJson(item, config)]));
  }
  return value;
}

export async function handleAxsProxy(
  request: Request,
  segments: string[],
  config: ClientProxyConfig = loadClientProxyConfig(),
  fetchImpl: typeof fetch = fetch,
  timeoutMs = UPSTREAM_TIMEOUT_MS,
): Promise<Response> {
  const requestId = requestIdentifier(request);
  if (invalidRawPath(request) || segments.some((segment) => !segment || segment === "." || segment === ".." || segment.includes("/") || segment.includes("\\"))) {
    return envelope(404, "NOT_FOUND", "The requested booking route is not available.", requestId);
  }
  const rule = ruleFor(segments);
  if (!rule) return envelope(404, "NOT_FOUND", "The requested booking route is not available.", requestId);
  if (!rule.methods.includes(request.method)) {
    const response = envelope(405, "METHOD_NOT_ALLOWED", "That method is not available for this booking route.", requestId);
    response.headers.set("Allow", rule.methods.join(", "));
    return response;
  }
  const incomingUrl = new URL(request.url);
  if (!safeQuery(segments, incomingUrl.search)) return envelope(422, "VALIDATION_ERROR", "The request query is invalid.", requestId);
  if (request.method !== "GET" && !trustedBrowserOrigin(request, config.clientOrigin)) {
    return envelope(403, "FORBIDDEN", "Cross-site booking requests are not allowed.", requestId);
  }

  const body = await bodyFor(request, rule, requestId);
  if (body instanceof Response) return body;
  const headers = new Headers({ Accept: "application/json", "X-Request-Id": requestId });
  if (rule.jsonBody) headers.set("Content-Type", "application/json");
  if (rule.idempotency) {
    const value = request.headers.get("idempotency-key")?.trim();
    if (value && value.length <= 128) headers.set("Idempotency-Key", value);
  }
  if (rule.bookingAccess) {
    const value = request.headers.get("x-booking-access-token")?.trim();
    if (value && value.length <= 256) headers.set("X-Booking-Access-Token", value);
  }
  if (rule.lookupGrant) {
    const value = request.headers.get("x-booking-lookup-grant")?.trim();
    if (value && /^[A-Za-z0-9_-]{40,256}$/.test(value)) headers.set("X-Booking-Lookup-Grant", value);
  }
  if (rule.customerSession) {
    const session = customerSessionCookie(request);
    if (session) headers.set("X-AXS-Customer-Session", session);
  }
  if (rule.privateResponse || request.method !== "GET") {
    headers.set("X-AXS-Client-Proxy-Secret", config.proxySecret);
    headers.set("X-AXS-Client-Context", clientContext(request, config.proxySecret));
  }

  const upstream = new URL(`/${segments.join("/")}${incomingUrl.search}`, config.adminOrigin);
  let response: Response;
  try {
    response = await fetchImpl(upstream, {
      method: request.method,
      headers,
      body: typeof body === "string" && request.method !== "GET" ? body : undefined,
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch {
    return envelope(502, "SERVICE_UNAVAILABLE", "The booking service is temporarily unavailable.", requestId);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (rule.binary && response.ok) {
    const outputHeaders = new Headers({
      "Content-Type": contentType || "application/octet-stream",
      "Cache-Control": "private, no-store",
      "X-Request-Id": requestId,
      "X-Content-Type-Options": "nosniff",
    });
    const disposition = response.headers.get("content-disposition");
    if (disposition) outputHeaders.set("Content-Disposition", disposition);
    return new Response(response.body, { status: response.status, headers: outputHeaders });
  }
  if (segments[2] === "media" && response.ok) {
    const outputHeaders = new Headers({ "Content-Type": contentType || "application/octet-stream", "X-Request-Id": requestId });
    outputHeaders.set("Cache-Control", response.headers.get("cache-control") ?? "public, max-age=300");
    return new Response(response.body, { status: response.status, headers: outputHeaders });
  }
  let payload: unknown;
  try {
    payload = JSON.parse(await response.text());
  } catch {
    return envelope(502, "SERVICE_UNAVAILABLE", "The booking service returned an invalid response.", requestId);
  }
  const outputHeaders = new Headers({ "Content-Type": "application/json", "X-Request-Id": requestId });
  outputHeaders.set("Cache-Control", rule.privateResponse || request.method !== "GET" ? "private, no-store" : (response.headers.get("cache-control") ?? "public, max-age=30"));
  return new Response(JSON.stringify(rewrittenJson(payload, config)), { status: response.status, headers: outputHeaders });
}
