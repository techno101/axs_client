"use client";

import { useEffect, useMemo, useState } from "react";
import { PaymentResultPanel } from "@/components/booking/payment-result-panel";
import { createHttpPublicClient, PublicApiError } from "@/lib/api/http-client";
import type { PaymentResult } from "@/lib/api/types";

export function LivePaymentResult({ reference, apiOrigin }: { reference: string; apiOrigin: string }) {
  const client = useMemo(() => createHttpPublicClient(apiOrigin), [apiOrigin]);
  const [result, setResult] = useState<PaymentResult>({ reference, state: "pending", fieldName: "Pending server response", blockLabel: "Pending server response", bookingDate: "Pending", amountMinor: 0, currency: "MYR", lastCheckedAt: "Checking verified backend state…" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let timer: number | undefined;
    const poll = async () => {
      const accessToken = window.sessionStorage.getItem(`axs:order:${reference}`);
      if (!accessToken) {
        if (active) setError("This browser no longer has the private status handle for this order. Keep the confirmed email once it is available.");
        return;
      }
      try {
        const status = await client.getOrderStatus(reference, accessToken);
        const state: PaymentResult["state"] = status.status === "confirmed" && status.paymentStatus === "paid" ? "confirmed" : status.status === "expired" || status.paymentStatus === "expired" ? "expired" : status.status === "payment_failed" || status.paymentStatus === "failed" ? "failed" : "pending";
        if (!active) return;
        const first = status.occurrences[0];
        setResult({ reference, state, fieldName: status.occurrences.length === 1 ? first?.fieldName ?? "Selected field" : `${status.occurrences.length} field sessions`, blockLabel: status.occurrences.length === 1 ? `${first?.label ?? "Selected session"} · ${first?.startsAt ?? ""}–${first?.endsAt ?? ""}` : "One payment for the complete order", bookingDate: status.occurrences.length === 1 ? first?.bookingDate ?? "Pending" : "Multiple dates", amountMinor: status.totalAmountMinor, currency: "MYR", lastCheckedAt: `Verified backend state · ${new Date().toLocaleTimeString("en-MY")}` });
        setError(null);
        if (state === "pending") timer = window.setTimeout(poll, 3_000);
      } catch (pollError) {
        if (active) {
          setError(pollError instanceof PublicApiError ? pollError.message : "Booking status could not be checked. Check your connection; the last verified state remains visible.");
          timer = window.setTimeout(poll, 5_000);
        }
      }
    };
    void poll();
    return () => { active = false; if (timer) window.clearTimeout(timer); };
  }, [client, reference]);

  return <div>{error ? <p className="booking-error" role="alert">{error}</p> : null}<PaymentResultPanel result={result} /></div>;
}
