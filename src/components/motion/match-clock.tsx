"use client";

import { useEffect, useRef, useState } from "react";

type MatchClockProps = {
  enabled: boolean;
};

export function MatchClock({ enabled }: MatchClockProps) {
  const ringRef = useRef<SVGCircleElement>(null);
  const [minute, setMinute] = useState(0);
  const shownRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const radius = 26;
    const circumference = 2 * Math.PI * radius;

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const next = Math.round(progress * 90);
      if (next !== minute) {
        setMinute(next);
        shownRef.current = next > 1;
      }
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(circumference * (1 - progress));
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled, minute]);

  if (!enabled) return null;

  return (
    <div className="match-clock" aria-hidden="true">
      <svg viewBox="0 0 60 60" width="60" height="60">
        <circle className="match-clock__track" cx="30" cy="30" r="26" />
        <circle
          ref={ringRef}
          className="match-clock__progress"
          cx="30"
          cy="30"
          r="26"
          strokeDasharray="163.36"
          strokeDashoffset="163.36"
        />
      </svg>
      <span className="match-clock__minute">{minute}&prime;</span>
      <span className="match-clock__label">FULL&nbsp;TIME</span>
    </div>
  );
}
