"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { availabilityDotLevel, type AvailabilityDot, type AvailabilityDaySummary } from "@/lib/api/types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type CalendarProps = {
  selected?: Date | null;
  onSelect: (date: Date) => void;
  min?: Date;
  max?: Date;
  availability?: Record<string, AvailabilityDaySummary>;
  businessDate?: string;
  onMonthChange?: (year: number, month: number) => void;
  className?: string;
};

const dotClass: Record<AvailabilityDot, string> = {
  full: "bg-[var(--success)]",
  partial: "bg-[var(--warning)]",
  none: "bg-[var(--danger)]",
  past: "bg-[var(--line)]",
};

function startOfUtcDay(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-MY", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

function buildGrid(month: Date): Array<{ date: Date | null; dateKey: string }> {
  const year = month.getUTCFullYear();
  const monthIndex = month.getUTCMonth();
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cells: Array<{ date: Date | null; dateKey: string }> = [];
  for (let i = 0; i < offset; i += 1) cells.push({ date: null, dateKey: "" });
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(Date.UTC(year, monthIndex, day));
    cells.push({ date, dateKey: `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, dateKey: "" });
  return cells;
}

export function Calendar({ selected, onSelect, min, max, availability, businessDate, onMonthChange, className }: CalendarProps) {
  const today = startOfUtcDay(new Date());
  const selectedDay = selected ? startOfUtcDay(selected) : null;
  const [month, setMonth] = React.useState(() => {
    const start = startOfUtcDay(selected ?? today);
    return start.getTime() > today.getTime() ? start : today;
  });

  const moveMonth = (delta: number) => {
    setMonth((current) => {
      const next = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + delta, 1));
      if (min && next < new Date(Date.UTC(min.getFullYear(), min.getMonth(), 1))) return current;
      if (max) {
        const maxMonth = new Date(Date.UTC(max.getFullYear(), max.getMonth(), 1));
        if (next > maxMonth) return current;
      }
      onMonthChange?.(next.getUTCFullYear(), next.getUTCMonth() + 1);
      return next;
    });
  };

  const isDisabled = (date: Date) => (min && date < startOfUtcDay(min)) || (max && date > startOfUtcDay(max));

  return (
    <div className={cn("w-[280px] select-none", className)} role="grid" aria-label="Choose a date">
      <div className="mb-3 flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon" aria-label="Previous month" onClick={() => moveMonth(-1)}>
          <ChevronLeft />
        </Button>
        <p className="text-sm font-bold text-[var(--ink)]">{monthLabel(month)}</p>
        <Button type="button" variant="ghost" size="icon" aria-label="Next month" onClick={() => moveMonth(1)}>
          <ChevronRight />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => <span key={day} className="pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{day}</span>)}
        {buildGrid(month).map((cell, index) => {
          if (!cell.date) return <span key={`empty-${index}`} />;
          const day = cell.date;
          const disabled = isDisabled(day);
          const isToday = day.getTime() === today.getTime();
          const isSelected = selectedDay?.getTime() === day.getTime();
          const level: AvailabilityDot | null = availability && businessDate
            ? availabilityDotLevel(cell.dateKey, availability[cell.dateKey], businessDate)
            : null;
          return (
            <button
              key={day.toISOString()}
              type="button"
              role="gridcell"
              disabled={disabled}
              aria-selected={isSelected}
              aria-label={new Intl.DateTimeFormat("en-MY", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(day)}
              onClick={() => onSelect(day)}
              className={cn(
                "relative flex h-10 w-9 flex-col items-center justify-center rounded-md text-xs font-semibold transition-colors",
                disabled && "cursor-not-allowed text-[var(--line)] line-through",
                !disabled && !isSelected && "text-[var(--ink)] hover:bg-[var(--paper)]",
                isToday && !isSelected && "text-[var(--grass)]",
                isSelected && "bg-[var(--ink)] text-white",
              )}
            >
              {day.getUTCDate()}
              {level ? <i className={cn("mt-0.5 h-1.5 w-1.5 rounded-full", dotClass[level])} aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
