export function formatMoney(amountMinor: number, currency = "MYR") {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100);
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toMalaysiaDateInput(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Converts an "HH:MM" string to Malaysia 12-hour display, e.g. "15:00" -> "3 PM". */
export function formatTime12(value: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value ?? "").trim());
  if (!match) return value;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const suffix = hours < 12 ? "AM" : "PM";
  const hour = hours % 12 || 12;
  return minutes === 0 ? `${hour} ${suffix}` : `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** Converts an "HH:MM-HH:MM" range to Malaysia 12-hour display, e.g. "09:00-15:00" -> "9 AM – 3 PM". */
export function formatTimeRange12(range: string, separator = "-"): string {
  const [start, end] = String(range ?? "").split(separator);
  if (!end) return formatTime12(start);
  return `${formatTime12(start)} – ${formatTime12(end)}`;
}

export function formatTimePair12(start: string, end: string): string {
  return `${formatTime12(start)} – ${formatTime12(end)}`;
}
