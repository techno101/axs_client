"use client";

import { useEffect, useRef } from "react";

type CursorState = { x: number; y: number; active: boolean; visible: boolean };

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const state: CursorState = { x: -100, y: -100, active: false, visible: false };
    let ringX = -100;
    let ringY = -100;
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      state.x = event.clientX;
      state.y = event.clientY;
      state.visible = true;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%)`;
      document.documentElement.classList.add("axs-cursor-on");
    };

    const onPointerDown = () => { state.active = true; };
    const onPointerUp = () => { state.active = false; };
    const onPointerLeave = () => { state.visible = false; };

    const tick = () => {
      ringX += (state.x - ringX) * 0.18;
      ringY += (state.y - ringY) * 0.18;
      if (ringRef.current) {
        const scale = state.active ? 0.8 : state.visible ? 1 : 0;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.opacity = state.visible ? "1" : "0";
      }
      if (dotRef.current) dotRef.current.style.opacity = state.visible ? "1" : "0";
      frame = window.requestAnimationFrame(tick);
    };

    const onOver = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest("a, button, summary, input, textarea, select, label, [role='button']")) {
        document.documentElement.classList.add("axs-cursor-hot");
      } else {
        document.documentElement.classList.remove("axs-cursor-hot");
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("mouseover", onOver, { passive: true });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("mouseover", onOver);
      window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("axs-cursor-on", "axs-cursor-hot");
    };
  }, []);

  return (
    <div className="axs-cursor" aria-hidden="true">
      <div className="axs-cursor__dot" ref={dotRef} />
      <div className="axs-cursor__ring" ref={ringRef} />
    </div>
  );
}
