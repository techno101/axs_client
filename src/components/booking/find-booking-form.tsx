"use client";

import { useMemo, useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/ui/icons";
import { PaymentPill } from "@/components/ui/status-pill";
import { createHttpPublicClient } from "@/lib/api/http-client";
import type { PublicBookingStatus } from "@/lib/api/types";

export function FindBookingForm({ apiOrigin }: { apiOrigin: string }) {
  const client = useMemo(() => createHttpPublicClient(apiOrigin), [apiOrigin]);
  const [result, setResult] = useState<PublicBookingStatus | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      setResult(await client.findBooking(String(form.get("reference") ?? "").trim().toUpperCase(), String(form.get("phone") ?? "")));
      setState("idle");
    } catch (error) {
      setResult(null);
      setMessage(error instanceof Error ? error.message : "The booking could not be found.");
      setState("error");
    }
  };

  const paymentState = result?.bookingStatus === "confirmed" && result.paymentStatus === "paid" ? "confirmed" : result?.bookingStatus === "expired" || result?.paymentStatus === "expired" ? "expired" : result?.bookingStatus === "payment_failed" || result?.paymentStatus === "failed" ? "failed" : "pending";

  return (
    <div className="booking-finder">
      <form onSubmit={submit}>
        <div className="field-control"><label htmlFor="booking-reference">Booking reference</label><input id="booking-reference" name="reference" required pattern="AXS-[A-Z0-9]{6,12}" placeholder="e.g. AXS-7K4M2P" autoComplete="off" /></div>
        <div className="field-control"><label htmlFor="booking-phone">Mobile number used for booking</label><input id="booking-phone" name="phone" required inputMode="tel" autoComplete="tel" placeholder="e.g. 012 345 6789" /></div>
        <button className="finder-submit" type="submit" disabled={state === "loading"}><SearchIcon />{state === "loading" ? "Checking…" : "Find booking"}</button>
        <p>Both details are required. Repeated attempts are rate limited.</p>
        {state === "error" ? <p className="booking-error" role="alert">{message}</p> : null}
      </form>
      <div className="finder-result" aria-live="polite">
        {result ? <><div><span>Verified result</span><PaymentPill state={paymentState} /></div><h2>{result.reference}</h2><dl><div><dt>Field</dt><dd>{result.fieldId === "FIELD_01" ? "Field 1" : "Field 2"}</dd></div><div><dt>Date</dt><dd>{result.bookingDate}</dd></div><div><dt>Block</dt><dd>{result.blockCode === "MORNING" ? "09:00–15:00" : "15:00–21:00"}</dd></div></dl><p>This privacy-limited result contains no payment identifiers or customer data.</p></> : <div className="finder-empty"><SearchIcon /><strong>Your booking will appear here</strong><span>Enter both details to run a secure lookup.</span></div>}
      </div>
    </div>
  );
}
