"use client";

import { useEffect, useState } from "react";

const WORD = "ARMOURX SPORTS";
const FALLBACK_MS = 30_000;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function finishBoot() {
  document.documentElement.setAttribute("data-boot-done", "1");
  document.documentElement.classList.remove("boot-locked");
  document.body.style.overflow = "";
  document.dispatchEvent(new Event("boot:done"));
}

/**
 * Real boot progress: the overlay stays until every eagerly-loaded image on
 * the page (hero, first-screen assets) has actually finished loading and the
 * page fonts are ready. The percentage is the true loaded/total share, so a
 * slow network or a slow hero keeps the loader visible proportionally longer,
 * and a fully-loaded page never shows it twice.
 */
export function BootLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("boot-locked");
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (document.documentElement.getAttribute("data-boot-done")) return;
      window.setTimeout(finishBoot, 260);
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    const tracked = new Set<HTMLImageElement>();
    let completeCount = 0;
    let fontsReady = false;
    let finished = false;

    const update = () => {
      if (finished) return;
      const total = tracked.size + (fontsReady ? 1 : 0);
      if (total === 0) {
        finish();
        return;
      }
      const share = (completeCount + (fontsReady ? 1 : 0)) / total;
      setProgress((current) => Math.max(current, Math.min(99, Math.round(share * 100))));
      if (completeCount >= tracked.size && fontsReady) {
        finished = true;
        finish();
      }
    };

    const markLoaded = () => {
      completeCount += 1;
      update();
    };

    const scan = () => {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>("img[loading='eager']"));
      for (const image of images) {
        if (tracked.has(image)) continue;
        tracked.add(image);
        if (image.complete) completeCount += 1;
        else {
          image.addEventListener("load", markLoaded, { once: true });
          image.addEventListener("error", markLoaded, { once: true });
        }
      }
      update();
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { fontsReady = true; update(); }).catch(() => { fontsReady = true; update(); });
    } else {
      fontsReady = true;
    }

    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    const fallback = window.setTimeout(finish, FALLBACK_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div className="boot-loader" aria-hidden="true">
      <p className="boot-word" aria-label={WORD}>
        {WORD.split("").map((char, index) => (
          <span key={`${char}-${index}`}>{char === " " ? "\u00A0" : char}</span>
        ))}
      </p>
      <span className="boot-progress" aria-hidden="true">
        <span className="boot-progress__fill" style={{ width: `${progress}%` }} />
      </span>
      <span className="boot-percent">{progress}%</span>
    </div>
  );
}
