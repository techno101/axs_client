"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertIcon, CheckIcon, ClockIcon } from "@/components/ui/icons";
import { PaymentPill } from "@/components/ui/status-pill";
import { createHttpPublicClient } from "@/lib/api/http-client";
import type { PaymentResult, PaymentState } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";
import { customerApi, type CustomerSessionView } from "@/lib/customer-api";

const copy: Record<PaymentState, { title: string; body: string }> = {
  pending: { title: "Confirming your booking…", body: "Keep this page open, or come back later with your booking reference. The result updates the moment everything is settled." },
  confirmed: { title: "Your field is confirmed.", body: "Save your booking reference and bring it with you on the day." },
  failed: { title: "Payment was not completed.", body: "The field is not reserved yet. You can book again whenever you're ready." },
  expired: { title: "That slot has gone.", body: "No field is reserved. Head back to availability and pick a new session." },
};

function BookingReferenceActions({ references }: { references: string[] }) {
  const client = useMemo(() => createHttpPublicClient(), []);
  const [notice, setNotice] = useState("");
  const [ownerSession, setOwnerSession] = useState<boolean | null>(null);
  useEffect(() => { void customerApi<CustomerSessionView>("session").then(({ account }) => setOwnerSession(account.status !== "suspended")).catch(() => setOwnerSession(false)); }, []);
  async function copyReference(reference: string) {
    try { await navigator.clipboard.writeText(reference); setNotice(`${reference} copied.`); }
    catch { setNotice(`Copy ${reference} manually.`); }
  }
  async function download(reference: string) {
    if (ownerSession === null) {
      setNotice("Checking your account for this booking.");
      return;
    }
    try {
      let blob: Blob;
      if (ownerSession) {
        const response = await fetch(`/api/customer/bookings/${encodeURIComponent(reference)}/download`, { credentials: "same-origin", cache: "no-store" });
        if (!response.ok) throw new Error("owner download denied");
        blob = await response.blob();
      } else {
        const lookup = await client.findBooking(reference);
        blob = await client.downloadGuestBooking(reference, lookup.lookupGrant);
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `ArmourXSports-booking-${reference}.pdf`; anchor.click();
      URL.revokeObjectURL(url);
      setNotice(`Your booking PDF for ${reference} is ready.`);
    } catch { setNotice("That download is not ready just now. Try Find a booking instead."); }
  }
  if (!references.length) return null;
  return <section className="booking-reference-actions" aria-label="Booking references"><h3>Save every booking reference</h3>{references.map((reference) => <div key={reference}><code>{reference}</code><button type="button" onClick={() => void copyReference(reference)}>Copy</button><button type="button" onClick={() => void download(reference)} disabled={ownerSession === null}>Download</button></div>)}{notice ? <p role="status">{notice}</p> : null}</section>;
}

export function PaymentResultPanel({ result }: { result: PaymentResult }) {
  const stateCopy = copy[result.state];
  return (
    <div className={`payment-result-card payment-result-card--${result.state}`}>
      <div className="payment-result-card__status-icon" aria-hidden="true">{result.state === "confirmed" ? <CheckIcon /> : result.state === "pending" ? <ClockIcon /> : <AlertIcon />}</div>
      <PaymentPill state={result.state} />
      <h2>{stateCopy.title}</h2><p>{stateCopy.body}</p>
      <dl><div><dt>Order reference</dt><dd>{result.reference}</dd></div><div><dt>Field</dt><dd>{result.fieldName}</dd></div><div><dt>Date</dt><dd>{result.bookingDate}</dd></div><div><dt>Block</dt><dd>{result.blockLabel}</dd></div><div><dt>Amount</dt><dd>{formatMoney(result.amountMinor)}</dd></div></dl>
      {result.guestEmailOmitted ? <p className="booking-error" role="alert"><strong>No email was provided.</strong> Save or download every booking reference before leaving this page; no email copy was sent.</p> : result.bookingReferences?.length ? <p role="status">Every booking reference was sent to the booking email address.</p> : null}
      <BookingReferenceActions references={result.bookingReferences ?? []} />
      <div className="payment-result-card__actions"><Link href="/booking/find">Find a booking</Link><Link href="/book">Back to availability</Link></div>
      <p className="payment-result-card__checked">{result.lastCheckedAt}</p>
    </div>
  );
}
