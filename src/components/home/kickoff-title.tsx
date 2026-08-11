"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, stagger, type TargetsParam } from "animejs";

type KickoffTitleProps = {
  title: string;
  accent?: string;
};

export function KickoffTitle({ title, accent }: KickoffTitleProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;

    if (reduced) {
      root.classList.add("kickoff-title--static");
      return;
    }

    // Safety net: never leave the title invisible.
    const fallback = window.setTimeout(() => root.classList.add("kickoff-title--static"), 2200);

    const start = () => {
      window.clearTimeout(fallback);
      try {
        const scope = createScope({ root }).add(() => {
          animate(root.querySelectorAll<HTMLElement>(".kickoff-char") as TargetsParam, {
            translateY: ["120%", "0%"],
            rotateX: [-90, 0],
            duration: 900,
            delay: stagger(45, { start: 120 }),
            ease: "out(4)",
          });
        });
        return () => scope.revert();
      } catch {
        root.classList.add("kickoff-title--static");
        return undefined;
      }
    };

    if (document.documentElement.getAttribute("data-boot-done") === "1") {
      return start();
    }
    let cleanup: (() => void) | undefined;
    const onBoot = () => {
      document.removeEventListener("boot:done", onBoot);
      cleanup = start();
    };
    document.addEventListener("boot:done", onBoot);
    return () => {
      document.removeEventListener("boot:done", onBoot);
      window.clearTimeout(fallback);
      cleanup?.();
    };
  }, [title]);

  const words = title.split(" ");

  return (
    <h1 id="match-hero-title" className="kickoff-title" ref={rootRef} aria-label={title}>
      {words.map((word, wordIndex) => (
        <span className="kickoff-word" key={`${word}-${wordIndex}`} aria-hidden="true">
          {word.split("").map((char, charIndex) => {
            const isAccent = accent ? word.toLowerCase().startsWith(accent.toLowerCase()) : false;
            return (
              <span className={`kickoff-char${isAccent ? " kickoff-char--accent" : ""}`} key={`${char}-${charIndex}`}>
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
