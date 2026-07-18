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
      const accessToken = window.sessionStorage.getItem(`axs:booking:${reference}`);
      if (!accessToken) {
        if (active) setError("This browser no longer has the private access token for this booking. Use Find a booking with the booking phone number.");
        return;
      }
      try {
        const status = await client.getBookingStatus(reference, accessToken);
        const state: PaymentResult["state"] = status.bookingStatus === "confirmed" && status.paymentStatus === "paid" ? "confirmed" : status.bookingStatus === "expired" || status.paymentStatus === "expired" ? "expired" : status.bookingStatus === "payment_failed" || status.paymentStatus === "failed" ? "failed" : "pending";
        if (!active) return;
        setResult({ reference, state, fieldName: status.fieldId === "FIELD_01" ? "Field 1" : "Field 2", blockLabel: status.blockCode === "MORNING" ? "Morning block · 09:00–15:00" : "Evening block · 15:00–21:00", bookingDate: status.bookingDate, amountMinor: status.amountMinor, currency: "MYR", lastCheckedAt: `Verified backend state · ${new Date().toLocaleTimeString("en-MY")}` });
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
