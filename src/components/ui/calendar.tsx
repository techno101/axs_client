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
    <div className={cn("w-[320px] select-none p-1", className)} role="grid" aria-label="Choose a date">
      <div className="mb-3 flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon" aria-label="Previous month" onClick={() => moveMonth(-1)}>
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </Button>
        <p className="text-base font-extrabold text-slate-900">{monthLabel(month)}</p>
        <Button type="button" variant="ghost" size="icon" aria-label="Next month" onClick={() => moveMonth(1)}>
          <ChevronRight className="h-5 w-5 text-slate-700" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => <span key={day} className="pb-2 text-xs font-extrabold uppercase tracking-wider text-slate-600">{day}</span>)}
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
                "relative flex h-11 w-10 flex-col items-center justify-center rounded-lg text-sm transition-all",
                disabled && "cursor-not-allowed text-slate-400 bg-slate-50/70 font-semibold",
                !disabled && !isSelected && "text-slate-900 font-extrabold hover:bg-slate-100 hover:text-slate-950",
                isToday && !isSelected && "ring-2 ring-emerald-500 font-black text-emerald-800 bg-emerald-50/60",
                isSelected && "bg-slate-950 text-white font-black shadow-md ring-2 ring-slate-950",
              )}
            >
              <span className="text-[14px] font-extrabold leading-tight">{day.getUTCDate()}</span>
              {level && !disabled ? (
                <span
                  className={cn(
                    "mt-1 h-1.5 w-1.5 rounded-full transition-all",
                    level === "full" && "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.7)]",
                    level === "partial" && "bg-amber-500",
                    (level === "none" || level === "past") && "bg-transparent",
                    isSelected && "bg-white",
                  )}
                  aria-hidden="true"
                />
              ) : (
                <span className="mt-1 h-1.5 w-1.5" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
