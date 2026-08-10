"use client";

import { useMemo, useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/ui/icons";
import { PaymentPill } from "@/components/ui/status-pill";
import { createHttpPublicClient } from "@/lib/api/http-client";
import { formatTimePair12 } from "@/lib/format";
import type { GuestBookingLookup } from "@/lib/api/types";

export function FindBookingForm() {
  const client = useMemo(() => createHttpPublicClient(), []);
  const [result, setResult] = useState<GuestBookingLookup | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      setResult(await client.findBooking(String(form.get("reference") ?? "").trim().toUpperCase()));
      setState("idle");
    } catch (error) {
      setResult(null);
      setMessage(error instanceof Error ? error.message : "The booking could not be found.");
      setState("error");
    }
  };

  async function download() {
    if (!result) return;
    try {
      const blob = await client.downloadGuestBooking(result.booking.reference, result.lookupGrant);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `ArmourXSports-booking-${result.booking.reference}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The private download is no longer available. Run the lookup again.");
      setState("error");
    }
  }

  const booking = result?.booking;
  const paymentState = booking?.bookingStatus === "confirmed" && booking.paymentStatus === "paid" ? "confirmed" : booking?.bookingStatus === "expired" || booking?.paymentStatus === "expired" ? "expired" : booking?.bookingStatus === "payment_failed" || booking?.paymentStatus === "failed" ? "failed" : "pending";

  return (
    <div className="booking-finder">
      <form onSubmit={submit}>
        <div className="field-control"><label htmlFor="booking-reference">Booking reference</label><input id="booking-reference" name="reference" required pattern="AXS-(?:[A-Z0-9]{6,12}|[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}(?:-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}){3})" placeholder="e.g. AXS-7K4M-2P8R-5T9W-3Y6Z" autoComplete="off" /></div>
        <button className="finder-submit" type="submit" disabled={state === "loading"}><SearchIcon />{state === "loading" ? "Checking…" : "Find booking"}</button>
        <p>Only your booking reference is needed. Results are privacy-limited and repeated attempts are rate limited.</p>
        {state === "error" ? <p className="booking-error" role="alert">{message}</p> : null}
      </form>
      <div className="finder-result" aria-live="polite">
        {booking ? <><div><span>Private result</span><PaymentPill state={paymentState} /></div><h2>{booking.reference}</h2><dl><div><dt>Field</dt><dd>{booking.fieldName}</dd></div><div><dt>Date</dt><dd>{booking.bookingDate}</dd></div><div><dt>Block</dt><dd>{booking.blockLabel} · {formatTimePair12(booking.startsAt, booking.endsAt)}</dd></div><div><dt>Booking name</dt><dd>{booking.customerName}</dd></div><div><dt>Phone</dt><dd>{booking.customerPhone}</dd></div></dl><button className="customer-secondary" type="button" onClick={download}>Download masked PDF</button><p>This privacy-limited result contains no email, internal identifiers, attendance or provider data.</p></> : <div className="finder-empty"><SearchIcon /><strong>Your booking will appear here</strong><span>Enter the booking reference to run a secure lookup.</span></div>}
      </div>
    </div>
  );
}
