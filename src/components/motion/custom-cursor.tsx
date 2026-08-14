"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover)");

    const enabled = () => finePointer.matches && hover.matches && !reducedMotion.matches && window.innerWidth >= 1024;
    if (!enabled()) return;

    const state = { x: -100, y: -100, visible: false, hot: false, active: false };
    let ringX = -100;
    let ringY = -100;
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      state.x = event.clientX;
      state.y = event.clientY;
      state.visible = true;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%)`;
    };

    const onPointerDown = () => { state.active = true; };
    const onPointerUp = () => { state.active = false; };
    const onPointerLeave = () => { state.visible = false; };

    const onOver = (event: Event) => {
      const target = event.target as HTMLElement;
      const hot = Boolean(target.closest("a, button, summary, [role='button'], label, input, textarea, select"));
      state.hot = hot;
      document.documentElement.classList.toggle("axs-cursor-hot", hot);
    };

    const tick = () => {
      ringX += (state.x - ringX) * 0.2;
      ringY += (state.y - ringY) * 0.2;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${state.active ? 0.85 : 1})`;
        ringRef.current.style.opacity = state.visible ? "1" : "0";
      }
      if (dotRef.current) dotRef.current.style.opacity = state.visible ? "1" : "0";
      frame = window.requestAnimationFrame(tick);
    };

    const onChange = () => {
      if (!enabled()) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
        document.documentElement.removeEventListener("pointerleave", onPointerLeave);
        document.removeEventListener("mouseover", onOver);
        window.cancelAnimationFrame(frame);
        document.documentElement.classList.remove("axs-cursor-hot");
        if (ringRef.current) ringRef.current.style.opacity = "0";
        if (dotRef.current) dotRef.current.style.opacity = "0";
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("mouseover", onOver, { passive: true });
    finePointer.addEventListener("change", onChange);
    reducedMotion.addEventListener("change", onChange);
    hover.addEventListener("change", onChange);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("mouseover", onOver);
      finePointer.removeEventListener("change", onChange);
      reducedMotion.removeEventListener("change", onChange);
      hover.removeEventListener("change", onChange);
      window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("axs-cursor-hot");
    };
  }, []);

  return (
    <div className="axs-cursor" aria-hidden="true">
      <div className="axs-cursor__dot" ref={dotRef} />
      <div className="axs-cursor__ring" ref={ringRef} />
    </div>
  );
}
