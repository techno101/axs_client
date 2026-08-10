import type { AvailabilityStatus, PaymentState } from "@/lib/api/types";

const availabilityLabels: Record<AvailabilityStatus, string> = {
  available: "Available",
  held: "On hold",
  booked: "Booked",
  blocked: "Blocked",
  closed: "Closed",
  past: "Past",
};

const paymentLabels: Record<PaymentState, string> = {
  pending: "Pending verification",
  confirmed: "Booking confirmed",
  failed: "Payment failed",
  expired: "Hold expired",
};

export function AvailabilityPill({ status }: { status: AvailabilityStatus }) {
  return <span className={`status-dot status-dot--${status}`}>{availabilityLabels[status]}</span>;
}

export function PaymentPill({ state }: { state: PaymentState }) {
  return <span className={`status-dot status-dot--${state}`}>{paymentLabels[state]}</span>;
}
