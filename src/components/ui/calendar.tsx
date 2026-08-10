"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type CalendarProps = {
  selected?: Date | null;
  onSelect: (date: Date) => void;
  min?: Date;
  max?: Date;
  className?: string;
};

function startOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-MY", { month: "long", year: "numeric" }).format(date);
}

function buildGrid(month: Date): Array<{ date: Date | null; inMonth: boolean }> {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<{ date: Date | null; inMonth: boolean }> = [];
  for (let i = 0; i < offset; i += 1) cells.push({ date: null, inMonth: false });
  for (let day = 1; day <= daysInMonth; day += 1) cells.push({ date: new Date(month.getFullYear(), month.getMonth(), day), inMonth: true });
  while (cells.length % 7 !== 0) cells.push({ date: null, inMonth: false });
  return cells;
}

export function Calendar({ selected, onSelect, min, max, className }: CalendarProps) {
  const today = startOfDay(new Date());
  const [month, setMonth] = React.useState(() => (selected ?? today).getTime() > today.getTime() ? selected ?? today : today);
  const selectedDay = selected ? startOfDay(selected) : null;

  const moveMonth = (delta: number) => {
    setMonth((current) => {
      const next = new Date(current.getFullYear(), current.getMonth() + delta, 1);
      if (min && next < new Date(min.getFullYear(), min.getMonth(), 1)) return current;
      if (max) {
        const maxMonth = new Date(max.getFullYear(), max.getMonth(), 1);
        if (next > maxMonth) return current;
      }
      return next;
    });
  };

  const isDisabled = (date: Date) => (min && date < startOfDay(min)) || (max && date > startOfDay(max));

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
          return (
            <button
              key={day.toISOString()}
              type="button"
              role="gridcell"
              disabled={disabled}
              aria-selected={isSelected}
              aria-label={new Intl.DateTimeFormat("en-MY", { day: "2-digit", month: "long", year: "numeric" }).format(day)}
              onClick={() => onSelect(day)}
              className={cn(
                "h-9 w-9 rounded-md text-xs font-semibold transition-colors",
                disabled && "cursor-not-allowed text-[var(--line)] line-through",
                !disabled && !isSelected && "text-[var(--ink)] hover:bg-[var(--paper)]",
                isToday && !isSelected && "text-[var(--grass)]",
                isSelected && "bg-[var(--ink)] text-white",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
