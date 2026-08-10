"use client";

import type { AvailabilityStatus, BookingBlock } from "@/lib/api/types";
import { formatMoney, formatTimePair12 } from "@/lib/format";

type SlotCardProps = {
  block: BookingBlock;
  status: AvailabilityStatus;
  fieldName: string;
  selected?: boolean;
  compact?: boolean;
  onSelect?: () => void;
};

const statusLabel: Record<AvailabilityStatus, string> = {
  available: "Available",
  held: "On hold",
  booked: "Booked",
  blocked: "Blocked",
  closed: "Closed",
  past: "Past",
};

const statusDot: Record<AvailabilityStatus, string> = {
  available: "bg-[var(--success)]",
  held: "bg-[var(--warning)]",
  booked: "bg-[var(--danger)]",
  blocked: "bg-[var(--muted)]",
  closed: "bg-[var(--muted)]",
  past: "bg-[var(--muted)]",
};

export function SlotCard({ block, status, fieldName, selected = false, onSelect }: SlotCardProps) {
  const disabled = status !== "available" || !onSelect;
  return (
    <button
      className={`slot-card slot-card--${status}${selected ? " slot-card--selected" : ""}`}
      type="button"
      disabled={disabled}
      aria-pressed={status === "available" ? selected : undefined}
      onClick={onSelect}
    >
      <span className="slot-card__top">
        <span className="slot-card__status">
          <i className={`slot-card__dot ${statusDot[status]}`} aria-hidden="true" />
          {statusLabel[status]}
        </span>
        <span className="slot-card__field">{fieldName}</span>
      </span>
      <span className="slot-card__time">{formatTimePair12(block.startsAt, block.endsAt)}</span>
      <span className="slot-card__bottom">
        <span>{block.label}</span>
        <strong>{formatMoney(block.amountMinor)}</strong>
      </span>
    </button>
  );
}
