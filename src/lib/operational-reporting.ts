export function reportOperationalEvent(input: { category: "client_ui_error" | "booking_failure" | "payment_failure" | "contract_mismatch"; errorCode: string; summary: string; routeOrScreen?: string; correlationId?: string; technicalDetails?: Record<string, unknown> }) {
  if (typeof window === "undefined") return;
  void fetch("/api/operational-events", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true, body: JSON.stringify({ ...input, summary: input.summary.replace(/(?:bearer\s+|password|pin|token|secret|authorization|cookie)/gi, "[redacted]").slice(0, 240) }) }).catch(() => undefined);
}
