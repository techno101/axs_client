"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, onScroll } from "animejs";

type CountUpProps = {
  to: number;
  suffix?: string;
  label?: string;
};

export function CountUp({ to, suffix = "", label }: CountUpProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root || reduced) return;

    const numberEl = root.querySelector<HTMLElement>(".countup-value");
    if (!numberEl) return;

    const scope = createScope({ root }).add(() => {
      const animation = animate(numberEl, {
        innerText: [0, to],
        duration: 1400,
        ease: "out(3)",
        autoplay: false,
        modifier: (value) => Math.round(Number(value)).toString(),
      });

      onScroll({
        target: root,
        enter: "bottom 85%",
        repeat: false,
        onEnter: () => animation.play(),
      });
    });

    return () => scope.revert();
  }, [to]);

  return (
    <div className="countup" ref={rootRef}>
      <span className="countup-value">{0}</span>
      <span className="countup-suffix">{suffix}</span>
      {label ? <span className="countup-label">{label}</span> : null}
    </div>
  );
}
