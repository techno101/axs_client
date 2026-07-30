"use client";

export type CustomerAccount = { id: string; email: string; displayName: string; phone: string; age: number; status: "pending" | "active" | "suspended"; verifiedAt: string | null; passwordSet: boolean; googleLinked: boolean };
export type CustomerSessionView = { account: CustomerAccount; idleExpiresAt?: string; absoluteExpiresAt?: string };

type Envelope<T> = { data: T | null; error: null | { code: string; message: string; fieldErrors?: Record<string, string> } };

export class CustomerApiError extends Error {
  constructor(readonly code: string, message: string, readonly fieldErrors?: Record<string, string>) { super(message); }
}

function csrf() {
  return document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("axs_customer_csrf="))?.slice("axs_customer_csrf=".length) ?? "";
}

export async function customerApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.method && init.method !== "GET") {
    headers.set("Content-Type", "application/json");
    const token = csrf();
    if (token) headers.set("X-CSRF-Token", token);
  }
  const response = await fetch(`/api/customer/${path}`, { ...init, headers, credentials: "same-origin", cache: "no-store" });
  const payload = await response.json().catch(() => null) as Envelope<T> | null;
  if (!response.ok || !payload?.data) throw new CustomerApiError(payload?.error?.code ?? "SERVICE_UNAVAILABLE", payload?.error?.message ?? "The account service is temporarily unavailable.", payload?.error?.fieldErrors);
  return payload.data;
}

export function postCustomer<T>(path: string, body: Record<string, unknown> = {}) { return customerApi<T>(path, { method: "POST", body: JSON.stringify(body) }); }
