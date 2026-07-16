"use client";

import { AvailabilityPill } from "@/components/ui/status-pill";
import type { AvailabilityStatus, BookingBlock } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";

type SlotCardProps = {
  block: BookingBlock;
  status: AvailabilityStatus;
  fieldName: string;
  selected?: boolean;
  compact?: boolean;
  onSelect?: () => void;
};

const statusHelp: Record<AvailabilityStatus, string> = {
  available: "Ready to request a hold",
  held: "Temporarily held by another booking",
  booked: "Already booked",
  blocked: "Unavailable for public booking",
  closed: "Venue closed for this block",
  past: "This block has already started",
};

export function SlotCard({
  block,
  status,
  fieldName,
  selected = false,
  compact = false,
  onSelect,
}: SlotCardProps) {
  const disabled = status !== "available" || !onSelect;
  return (
    <button
      className={`slot-card slot-card--${status}${selected ? " slot-card--selected" : ""}${compact ? " slot-card--compact" : ""}`}
      type="button"
      disabled={disabled}
      aria-pressed={status === "available" ? selected : undefined}
      onClick={onSelect}
    >
      <span className="slot-card__top">
        <AvailabilityPill status={status} />
        <span className="slot-card__field">{fieldName}</span>
      </span>
      <span className="slot-card__time">{block.startsAt}<i>—</i>{block.endsAt}</span>
      <span className="slot-card__bottom">
        <span>{block.label}</span>
        <strong>{formatMoney(block.amountMinor)}</strong>
      </span>
      <span className="slot-card__help">{statusHelp[status]}</span>
    </button>
  );
}
