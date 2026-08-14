"use client";

import { useEffect, useMemo, useState } from "react";
import { PaymentResultPanel } from "@/components/booking/payment-result-panel";
import { createHttpPublicClient, PublicApiError } from "@/lib/api/http-client";
import { formatTimePair12 } from "@/lib/format";
import type { PaymentResult } from "@/lib/api/types";
import { reportOperationalEvent } from "@/lib/operational-reporting";

export function LivePaymentResult({ reference }: { reference: string }) {
  const client = useMemo(() => createHttpPublicClient(), []);
  const [result, setResult] = useState<PaymentResult>({ reference, state: "pending", fieldName: "Your field", blockLabel: "Your session", bookingDate: "Your date", amountMinor: 0, currency: "MYR", lastCheckedAt: "Confirming your booking…", guestEmailOmitted: typeof window !== "undefined" && window.sessionStorage.getItem(`axs:order-email:${reference}`) === "missing" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let timer: number | undefined;
    const poll = async () => {
      const accessToken = window.sessionStorage.getItem(`axs:order:${reference}`);
      if (!accessToken) {
        if (active) setError("This browser no longer has the details for this booking. Keep the confirmation email — it will have everything.");
        return;
      }
      try {
        const status = await client.getOrderStatus(reference, accessToken);
        const state: PaymentResult["state"] = status.status === "confirmed" && status.paymentStatus === "paid" ? "confirmed" : status.status === "expired" || status.paymentStatus === "expired" ? "expired" : status.status === "payment_failed" || status.paymentStatus === "failed" ? "failed" : "pending";
        if (!active) return;
        const first = status.occurrences[0];
        setResult({
          reference,
          state,
          fieldName: status.occurrences.length === 1 ? first?.fieldName ?? "Selected field" : `${status.occurrences.length} field sessions`,
          blockLabel: status.occurrences.length === 1 ? `${first?.label ?? "Selected session"} · ${formatTimePair12(first?.startsAt ?? "", first?.endsAt ?? "")}` : "One payment for the complete order",
          bookingDate: status.occurrences.length === 1 ? first?.bookingDate ?? "Pending" : "Multiple dates",
          amountMinor: status.totalAmountMinor,
          currency: "MYR",
          lastCheckedAt: `Status checked · ${new Date().toLocaleTimeString("en-MY")}`,
          bookingReferences: status.occurrences.map((occurrence) => occurrence.reference).filter((value): value is string => Boolean(value)),
          guestEmailOmitted: window.sessionStorage.getItem(`axs:order-email:${reference}`) === "missing",
        });
        setError(null);
        if (state === "pending") timer = window.setTimeout(poll, 3_000);
      } catch (pollError) {
        if (active) {
          const message = pollError instanceof PublicApiError ? "We couldn't check your booking just now. Please try again in a moment." : "We couldn't check your booking just now. Please try again in a moment.";
          setError(message);
          reportOperationalEvent({ category: "payment_failure", errorCode: "PAYMENT_STATUS_UNAVAILABLE", summary: message, routeOrScreen: "booking/result" });
          timer = window.setTimeout(poll, 5_000);
        }
      }
    };
    void poll();
    return () => { active = false; if (timer) window.clearTimeout(timer); };
  }, [client, reference]);

  return <div>{error ? <p className="booking-error" role="alert">{error}</p> : null}<PaymentResultPanel result={result} /></div>;
}
