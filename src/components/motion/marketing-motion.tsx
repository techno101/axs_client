"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

function LenisGsapConnector({ enabled }: { enabled: boolean }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!enabled || !lenis) return;

    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [enabled, lenis]);

  return null;
}

function MotionStage({ children, enabled }: { children: React.ReactNode; enabled: boolean }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!enabled || !scope.current) return;

    const root = scope.current;
    const action = root.querySelector<HTMLElement>(".match-sessions");
    const sessionCards = root.querySelectorAll<HTMLElement>(".match-session-card");
    const actionCopy = root.querySelector<HTMLElement>(".match-sessions__head");
    const teamMedia = root.querySelector<HTMLElement>(".match-team__media");
    const finalHeading = root.querySelector<HTMLElement>(".match-final h2");
    const finalMedia = root.querySelector<HTMLElement>(".match-final__media");
    const pitchesMedia = root.querySelector<HTMLElement>(".match-pitches__media");
    const pitchesCopy = root.querySelector<HTMLElement>(".match-pitches__copy");

    // Hero copy is always visible — never gate it behind timelines or boot events.

    const reveal = (selector: string) => {
      const element = root.querySelector<HTMLElement>(selector);
      if (!element) return;
      gsap.from(element, {
        y: 26,
        opacity: 0,
        duration: 0.62,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 82%", once: true },
      });
    };

    reveal(".match-pitches");
    reveal(".match-booking");
    reveal(".match-team__layout");
    reveal(".match-location");
    reveal(".match-faq");
    reveal(".match-final");

    const mediaQueries = gsap.matchMedia();
    mediaQueries.add("(min-width: 900px)", () => {
      // Continuous flow: the aerial slides up over the hero as one shot.
      if (pitchesMedia && pitchesCopy) {
        gsap.fromTo(pitchesMedia, { yPercent: 14, scale: 1.12 }, {
          yPercent: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ".match-pitches", start: "top bottom", end: "top top", scrub: 0.9 },
        });
        gsap.fromTo(pitchesCopy, { yPercent: 30 }, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: ".match-pitches", start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      }

      if (!action || !actionCopy) return;

      gsap.from(sessionCards, {
        y: 60,
        clipPath: "inset(12% 6% 12% 6%)",
        opacity: 0.4,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.16,
        scrollTrigger: { trigger: action, start: "top 78%", once: true },
      });

      gsap.from(actionCopy, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: action, start: "top 82%", once: true },
      });
    });

    if (teamMedia) {
      gsap.fromTo(teamMedia, { clipPath: "inset(12% 8% 12% 8%)", scale: 1.06 }, {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: teamMedia, start: "top 85%", end: "top 35%", scrub: 0.8 },
      });
    }

    if (finalHeading) {
      gsap.fromTo(finalHeading, { scale: 0.94, opacity: 0.6 }, {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: ".match-final", start: "top 85%", end: "top 30%", scrub: 0.7 },
      });
    }
    if (finalMedia) {
      gsap.fromTo(finalMedia, { scale: 1.18 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: ".match-final", start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", refresh);
      mediaQueries.revert();
    };
  }, { scope, dependencies: [enabled], revertOnUpdate: true });

  return <div ref={scope} className={enabled ? undefined : "motion-stage--static"}>{children}</div>;
}

export function MarketingMotion({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(finePointer.matches && !reducedMotion.matches);
    update();
    finePointer.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      finePointer.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  if (!enabled) return <MotionStage enabled={false}>{children}</MotionStage>;

  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.09, smoothWheel: true, syncTouch: false }}>
      <LenisGsapConnector enabled />
      <MotionStage enabled>{children}</MotionStage>
    </ReactLenis>
  );
}
