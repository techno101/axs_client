import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { loadClientProxyConfig, type ClientProxyConfig } from "@/server/axs-proxy/config";

const SESSION_COOKIE = "axs_customer_session";
const CSRF_COOKIE = "axs_customer_csrf";
const GOOGLE_COOKIE = "axs_customer_google_attempt";
const HANDOFF_COOKIE = "axs_customer_google_handoff";
const MAX_BODY = 12 * 1024;

type RouteRule = { method: string; upstream: string; mutation?: boolean; session?: boolean; csrf?: boolean; body?: boolean; binary?: boolean };

const rules: Record<string, RouteRule> = {
  register: { method: "POST", upstream: "register", mutation: true, body: true },
  login: { method: "POST", upstream: "login", mutation: true, body: true },
  logout: { method: "POST", upstream: "logout", mutation: true, session: true, csrf: true },
  session: { method: "GET", upstream: "session", session: true },
  "verification/confirm": { method: "POST", upstream: "verification/confirm", mutation: true, body: true },
  "verification/resend": { method: "POST", upstream: "verification/resend", mutation: true, body: true },
  "password/forgot": { method: "POST", upstream: "password/forgot", mutation: true, body: true },
  "password/reset": { method: "POST", upstream: "password/reset", mutation: true, body: true },
  "password/set": { method: "POST", upstream: "password/set", mutation: true, session: true, csrf: true, body: true },
  profile: { method: "GET", upstream: "profile", session: true },
  "profile/update": { method: "PATCH", upstream: "profile", mutation: true, session: true, csrf: true, body: true },
  "google/start": { method: "POST", upstream: "google/start", mutation: true, body: true },
  "google/exchange": { method: "POST", upstream: "google/exchange", mutation: true, body: true },
  "google/complete-profile": { method: "POST", upstream: "google/complete-profile", mutation: true, body: true },
  "google/link/start": { method: "POST", upstream: "google/link/start", mutation: true, session: true, csrf: true, body: true },
  "google/unlink": { method: "DELETE", upstream: "google/unlink", mutation: true, session: true, csrf: true },
  "account/deactivate": { method: "POST", upstream: "account/deactivate", mutation: true, session: true, csrf: true },
  "account/delete": { method: "POST", upstream: "account/delete", mutation: true, session: true, csrf: true },
};

const LEGACY_BOOKING_REFERENCE = /^AXS-[A-Z0-9]{6,12}$/;
const MODERN_BOOKING_REFERENCE = /^AXS-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}(?:-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}){3}$/;

function bookingRule(segments: string[]): RouteRule | null {
  if (segments.length === 1 && segments[0] === "bookings") return { method: "GET", upstream: "bookings", session: true };
  if (segments.length >= 2 && segments[0] === "bookings" && (LEGACY_BOOKING_REFERENCE.test(segments[1]) || MODERN_BOOKING_REFERENCE.test(segments[1]))) {
    if (segments.length === 2) return { method: "GET", upstream: `bookings/${segments[1]}`, session: true };
    if (segments.length === 3 && segments[2] === "download") return { method: "GET", upstream: `bookings/${segments[1]}/download`, session: true, binary: true };
    if (segments.length === 3 && segments[2] === "reschedule") return { method: "POST", upstream: `bookings/${segments[1]}/reschedule`, mutation: true, session: true, csrf: true, body: true };
  }
  return null;
}

type GoogleAttempt = { state: string; verifier: string; nonce: string };

function noStore(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}

function originIsTrusted(request: Request, expected: string): boolean {
  const origin = request.headers.get("origin");
  if (origin) return origin === expected;
  const referer = request.headers.get("referer");
  try { return Boolean(referer) && new URL(referer!).origin === expected; } catch { return false; }
}

function contextFor(request: Request, secret: string): string {
  const raw = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "unknown";
  return `v1:${createHmac("sha256", secret).update(raw.slice(0, 128)).digest("hex")}`;
}

function requestId(request: Request): string {
  const supplied = request.headers.get("x-request-id")?.trim();
  return supplied && /^[A-Za-z0-9._:-]{8,120}$/.test(supplied) ? supplied : randomUUID();
}

function cookieOptions(config: ClientProxyConfig, expires?: Date) {
  return { httpOnly: true, secure: config.clientOrigin.startsWith("https://"), sameSite: "lax" as const, path: "/", ...(expires ? { expires } : {}) };
}

function csrfCookieOptions(config: ClientProxyConfig, expires?: Date) {
  return { httpOnly: false, secure: config.clientOrigin.startsWith("https://"), sameSite: "lax" as const, path: "/", ...(expires ? { expires } : {}) };
}

function clearSession(response: NextResponse, config: ClientProxyConfig) {
  response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(config), maxAge: 0 });
  response.cookies.set(CSRF_COOKIE, "", { ...csrfCookieOptions(config), maxAge: 0 });
}

function cookieValue(request: Request, name: string): string | null {
  const encoded = request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];
  if (!encoded) return null;
  try { return decodeURIComponent(encoded); } catch { return null; }
}

function setSession(response: NextResponse, config: ClientProxyConfig, session: Record<string, unknown>) {
  const token = typeof session.sessionToken === "string" ? session.sessionToken : "";
  const csrf = typeof session.csrfToken === "string" ? session.csrfToken : "";
  const absolute = typeof session.absoluteExpiresAt === "string" ? new Date(session.absoluteExpiresAt) : null;
  if (!/^[A-Za-z0-9_-]{40,256}$/.test(token) || !/^[A-Za-z0-9_-]{40,256}$/.test(csrf) || !absolute || Number.isNaN(absolute.getTime())) return false;
  response.cookies.set(SESSION_COOKIE, token, cookieOptions(config, absolute));
  response.cookies.set(CSRF_COOKIE, csrf, csrfCookieOptions(config, absolute));
  return true;
}

function safeSession(session: Record<string, unknown>) {
  return {
    account: session.account,
    idleExpiresAt: session.idleExpiresAt,
    absoluteExpiresAt: session.absoluteExpiresAt,
  };
}

function sanitize(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;
  const envelope = payload as { data?: unknown };
  if (!envelope.data || typeof envelope.data !== "object") return payload;
  if (Array.isArray(envelope.data)) return payload;
  const data = { ...(envelope.data as Record<string, unknown>) };
  delete data.verificationToken;
  delete data.resetToken;
  delete data.handoff;
  if (data.session && typeof data.session === "object") data.session = safeSession(data.session as Record<string, unknown>);
  return { ...(payload as Record<string, unknown>), data };
}

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(length) && length > MAX_BODY) return null;
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY) return null;
  try {
    const body = text ? JSON.parse(text) : {};
    return body && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch { return null; }
}

async function upstream(request: Request, config: ClientProxyConfig, route: RouteRule, body?: Record<string, unknown>) {
  const headers = new Headers({ Accept: "application/json", "X-Request-Id": requestId(request), "X-AXS-Client-Proxy-Secret": config.proxySecret, "X-AXS-Client-Context": contextFor(request, config.proxySecret), "X-AXS-Client-Origin": config.clientOrigin });
  const session = cookieValue(request, SESSION_COOKIE);
  if (route.session && session) headers.set("X-AXS-Customer-Session", session);
  if (route.csrf) {
    const csrf = request.headers.get("x-csrf-token")?.trim();
    if (csrf && csrf.length <= 256 && csrf === cookieValue(request, CSRF_COOKIE)) headers.set("X-CSRF-Token", csrf);
  }
  if (body) headers.set("Content-Type", "application/json");
  const destination = new URL(`/v1/customer/${route.upstream}`, config.adminOrigin);
  const response = await fetch(destination, { method: route.method, headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(8_000) });
  if (route.binary) return { status: response.status, body: response.body, contentType: response.headers.get("content-type"), disposition: response.headers.get("content-disposition") };
  const payload = await response.json().catch(() => ({ data: null, error: { code: "SERVICE_UNAVAILABLE", message: "The account service returned an invalid response." } }));
  return { status: response.status, payload };
}

export async function handleCustomerBff(request: Request, segments: string[], config = loadClientProxyConfig()): Promise<NextResponse> {
  const key = segments.join("/");
  const route = rules[key] ?? bookingRule(segments);
  if (!route || request.method !== route.method || segments.some((part) => !part || part === "." || part === ".." || /[\\/]/.test(part))) return noStore({ data: null, error: { code: "NOT_FOUND", message: "This account route is not available." } }, 404);
  if (key === "session") {
    const session = cookieValue(request, SESSION_COOKIE);
    if (!session) return noStore({ data: { account: null }, meta: {}, error: null }, 200);
  }
  if (route.mutation && !originIsTrusted(request, config.clientOrigin)) return noStore({ data: null, error: { code: "CSRF_INVALID", message: "Cross-site account requests are not allowed." } }, 403);
  let body: Record<string, unknown> | undefined;
  if (route.body) {
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return noStore({ data: null, error: { code: "VALIDATION_ERROR", message: "Content-Type must be application/json." } }, 415);
    body = await readBody(request) ?? undefined;
    if (!body) return noStore({ data: null, error: { code: "VALIDATION_ERROR", message: "The account request is invalid." } }, 400);
  }
  try {
    if (route.binary) {
      const result = await upstream(request, config, route);
      if (result.status >= 200 && result.status < 300 && result.body) {
        const response = new NextResponse(result.body, { status: result.status, headers: { "Content-Type": result.contentType ?? "application/pdf", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
        if (result.disposition) response.headers.set("Content-Disposition", result.disposition);
        return response;
      }
      return noStore({ data: null, error: { code: "NOT_FOUND", message: "Booking not found." } }, result.status === 401 ? 401 : 404);
    }
    if (key === "google/start" || key === "google/link/start") {
      const verifier = randomBytes(48).toString("base64url");
      const nonce = randomBytes(32).toString("base64url");
      const codeChallenge = createHash("sha256").update(verifier).digest("base64url");
      const result = await upstream(request, config, route, { ...body, codeChallenge, nonce, nonceHash: createHash("sha256").update(nonce).digest("hex") });
      const authorizationUrl = result.payload && typeof result.payload === "object" ? ((result.payload as { data?: { authorizationUrl?: unknown; state?: unknown } }).data?.authorizationUrl) : null;
      const state = result.payload && typeof result.payload === "object" ? ((result.payload as { data?: { state?: unknown } }).data?.state) : null;
      const response = noStore(sanitize(result.payload), result.status);
      if (typeof authorizationUrl === "string" && typeof state === "string") {
        response.cookies.set(GOOGLE_COOKIE, Buffer.from(JSON.stringify({ state, verifier, nonce } satisfies GoogleAttempt)).toString("base64url"), { ...cookieOptions(config), maxAge: 600 });
      }
      return response;
    }
    if (key === "google/exchange" || key === "google/complete-profile") {
      const handoff = cookieValue(request, HANDOFF_COOKIE);
      const result = await upstream(request, config, route, { handoff: handoff ?? "", ...body });
      const response = noStore(sanitize(result.payload), result.status);
      const data = result.payload && typeof result.payload === "object" ? (result.payload as { data?: Record<string, unknown> }).data : null;
      if (data?.session && typeof data.session === "object") {
        if (setSession(response, config, data.session as Record<string, unknown>)) {
          response.cookies.set(HANDOFF_COOKIE, "", { ...cookieOptions(config), maxAge: 0 });
          response.cookies.set(GOOGLE_COOKIE, "", { ...cookieOptions(config), maxAge: 0 });
          return response;
        }
        // The upstream session failed validation — never fake a signed-in state.
        return noStore({ data: null, error: { code: "SESSION_INVALID", message: "We could not start your session. Please try signing in again." } }, 502);
      }
      response.cookies.set(HANDOFF_COOKIE, "", { ...cookieOptions(config), maxAge: 0 });
      response.cookies.set(GOOGLE_COOKIE, "", { ...cookieOptions(config), maxAge: 0 });
      return response;
    }
    const result = await upstream(request, config, route, body);
    const response = noStore(sanitize(result.payload), result.status);
    const data = result.payload && typeof result.payload === "object" ? (result.payload as { data?: Record<string, unknown> }).data : null;
    if (data?.session && typeof data.session === "object") setSession(response, config, data.session as Record<string, unknown>);
    if (key === "logout" || key === "password/set" || key === "profile/update" || key === "google/unlink" || key === "account/deactivate" || key === "account/delete" || data?.suspended === true || data?.state === "suspended") clearSession(response, config);
    return response;
  } catch {
    return noStore({ data: null, error: { code: "SERVICE_UNAVAILABLE", message: "The account service is temporarily unavailable." } }, 502);
  }
}

function decodeGoogleAttempt(value: string | undefined): GoogleAttempt | null {
  if (!value || value.length > 2_048) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<GoogleAttempt>;
    return typeof parsed.state === "string" && typeof parsed.verifier === "string" && typeof parsed.nonce === "string" ? parsed as GoogleAttempt : null;
  } catch { return null; }
}

export async function completeGoogleCallback(request: Request, config = loadClientProxyConfig()): Promise<NextResponse> {
  const attempt = decodeGoogleAttempt(cookieValue(request, GOOGLE_COOKIE) ?? undefined);
  const state = new URL(request.url).searchParams.get("state") ?? "";
  const code = new URL(request.url).searchParams.get("code") ?? "";
  let target = new URL("/google/return?status=failed", config.clientOrigin);
  try {
    if (!attempt || state !== attempt.state || !code) throw new Error("invalid callback");
    const result = await upstream(request, config, { method: "POST", upstream: "google/callback", body: true }, { state, code, verifier: attempt.verifier, nonce: attempt.nonce });
    const data = result.payload && typeof result.payload === "object" ? (result.payload as { data?: Record<string, unknown> }).data : null;
    const response = NextResponse.redirect(target);
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(GOOGLE_COOKIE, "", { ...cookieOptions(config), maxAge: 0 });
    if (data?.state === "handoff" && typeof data.handoff === "string") {
      response.cookies.set(HANDOFF_COOKIE, data.handoff, { ...cookieOptions(config), maxAge: 300 });
      target = new URL("/google/return?status=complete", config.clientOrigin);
      response.headers.set("Location", target.toString());
    } else if (data?.state === "profile_required" && typeof data.handoff === "string") {
      response.cookies.set(HANDOFF_COOKIE, data.handoff, { ...cookieOptions(config), maxAge: 900 });
      const prefill = new URLSearchParams({ status: "profile_required" });
      if (typeof data.email === "string") prefill.set("email", data.email);
      if (typeof data.displayName === "string") prefill.set("name", data.displayName);
      target = new URL(`/google/return?${prefill.toString()}`, config.clientOrigin);
      response.headers.set("Location", target.toString());
    } else if (typeof data?.state === "string") {
      target = new URL(`/google/return?status=${encodeURIComponent(data.state)}`, config.clientOrigin);
      response.headers.set("Location", target.toString());
    }
    return response;
  } catch {
    const response = NextResponse.redirect(target);
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(GOOGLE_COOKIE, "", { ...cookieOptions(config), maxAge: 0 });
    return response;
  }
}
