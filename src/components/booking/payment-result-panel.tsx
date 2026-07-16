import Link from "next/link";
import { AlertIcon, CheckIcon, ClockIcon } from "@/components/ui/icons";
import { PaymentPill } from "@/components/ui/status-pill";
import type { PaymentResult, PaymentState } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";

const copy: Record<PaymentState, { title: string; body: string }> = {
  pending: {
    title: "We are verifying your payment.",
    body: "Keep this page open or return later with your booking reference. Only the verified backend state can confirm the field.",
  },
  confirmed: {
    title: "Your field is confirmed.",
    body: "The authoritative booking state is confirmed. A production receipt and approved arrival guidance will appear here.",
  },
  failed: {
    title: "Payment was not completed.",
    body: "The field is not confirmed. The live service may offer a new payment attempt only when the booking remains eligible.",
  },
  expired: {
    title: "The booking hold expired.",
    body: "No field is reserved. Return to availability to request a new server-controlled hold.",
  },
};

export function PaymentResultPanel({ result }: { result: PaymentResult }) {
  const stateCopy = copy[result.state];
  return (
    <div className={`payment-result-card payment-result-card--${result.state}`}>
      <div className="payment-result-card__status-icon" aria-hidden="true">
        {result.state === "confirmed" ? <CheckIcon /> : result.state === "pending" ? <ClockIcon /> : <AlertIcon />}
      </div>
      <PaymentPill state={result.state} />
      <h2>{stateCopy.title}</h2>
      <p>{stateCopy.body}</p>
      <dl>
        <div><dt>Reference</dt><dd>{result.reference}</dd></div>
        <div><dt>Field</dt><dd>{result.fieldName}</dd></div>
        <div><dt>Date</dt><dd>{result.bookingDate}</dd></div>
        <div><dt>Block</dt><dd>{result.blockLabel}</dd></div>
        <div><dt>Amount</dt><dd>{formatMoney(result.amountMinor)}</dd></div>
      </dl>
      <div className="payment-result-card__actions">
        <Link href="/booking/find">Find a booking</Link>
        <Link href="/book">Back to availability</Link>
      </div>
      <p className="payment-result-card__checked">{result.lastCheckedAt}</p>
    </div>
  );
}
