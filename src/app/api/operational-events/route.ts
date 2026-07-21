import { NextRequest, NextResponse } from "next/server";

const buckets = new Map<string, { count: number; resetAt: number }>();
const categories = new Set(["client_ui_error", "booking_failure", "payment_failure", "contract_mismatch"]);
const detailKeys = new Set(["errorName", "safeMessage", "causeCode", "operation", "retryable", "retryAfterSeconds", "state", "attempt", "provider", "environment"]);
const secretKey = /pass(word)?|pin|cookie|session|token|secret|authorization|api.?key|database.?url|connection.?string|card|cvv/i;
const secretValue = /(?:bearer\s+|postgres(?:ql)?:\/\/|x-business-api-key|hitpay[-_ ]?(?:api)?[-_ ]?key)/i;

function limited(key: string) {
  const now = Date.now(); const current = buckets.get(key);
  const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + 5 * 60_000 } : current;
  bucket.count += 1; buckets.set(key, bucket); return bucket.count <= 20;
}

function safeValue(value: unknown, depth = 0): unknown {
  if (depth > 5) return "[TRUNCATED]";
  if (typeof value === "string") return secretValue.test(value) ? "[REDACTED]" : value.slice(0, 500);
  if (typeof value === "number" || typeof value === "boolean" || value === null) return value;
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => safeValue(item, depth + 1));
  if (!value || typeof value !== "object") return "[UNSUPPORTED]";
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).slice(0, 30).map(([key, item]) => [key, secretKey.test(key) ? "[REDACTED]" : safeValue(item, depth + 1)]));
}

function safeDetails(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return safeValue(Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([key]) => detailKeys.has(key)))) as Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(length) && length > 8_192) return NextResponse.json({ error: "Invalid report." }, { status: 413 });
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!limited(forwarded)) return NextResponse.json({ error: "Too many reports." }, { status: 429 });
  const token = process.env.OBSERVABILITY_INGEST_TOKEN?.trim();
  const origin = process.env.NEXT_PUBLIC_API_ORIGIN?.trim();
  if (!token || token.length < 32 || !origin) return NextResponse.json({ accepted: false }, { status: 202 });
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > 8_192) return NextResponse.json({ error: "Invalid report." }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(raw || "null") as unknown; } catch { return NextResponse.json({ error: "Invalid report." }, { status: 422 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid report." }, { status: 422 });
  const event = body as Record<string, unknown>;
  if (!categories.has(String(event.category)) || !/^[A-Z][A-Z0-9_]{1,119}$/.test(String(event.errorCode)) || typeof event.summary !== "string" || event.summary.trim().length < 1 || event.summary.length > 240) return NextResponse.json({ error: "Invalid report." }, { status: 422 });
  try {
    const response = await fetch(new URL("/v1/observability/events", origin), { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "X-Observability-Source": "axs_client", "X-Request-Id": crypto.randomUUID() }, body: JSON.stringify({ category: event.category, errorCode: event.errorCode, summary: String(safeValue(event.summary)).slice(0, 240), routeOrScreen: typeof event.routeOrScreen === "string" ? String(safeValue(event.routeOrScreen)).slice(0, 240) : "public", correlationId: typeof event.correlationId === "string" ? event.correlationId.slice(0, 120) : undefined, releaseVersion: process.env.APP_VERSION?.slice(0, 80), technicalDetails: safeDetails(event.technicalDetails) }) });
    return NextResponse.json({ accepted: response.ok }, { status: response.ok ? 202 : 502 });
  } catch { return NextResponse.json({ accepted: false }, { status: 202 }); }
}
