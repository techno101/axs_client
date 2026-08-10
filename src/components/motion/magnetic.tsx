"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * strength;
    const y = (event.clientY - rect.top - rect.height / 2) * strength;
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onLeave = () => {
    const element = ref.current;
    if (!element) return;
    element.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <div ref={ref} className={`magnetic${className ? ` ${className}` : ""}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
