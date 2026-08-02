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
    if (!enabled) return;

    const hero = gsap.timeline({ defaults: { ease: "power4.out" } });
    hero
      .from(".dusk-hero__image", { scale: 1.055, duration: 1.5 })
      .from(".dusk-hero__line", { yPercent: 110, opacity: 0, duration: 0.85, stagger: 0.11 }, 0.12)
      .from(".dusk-hero__intro, .dusk-hero__actions, .dusk-hero__sessions", {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
      }, 0.42);

    gsap.utils.toArray<HTMLElement>(".dusk-reveal").forEach((element) => {
      gsap.from(element, {
        y: 34,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 86%", once: true },
      });
    });

    gsap.fromTo(".dusk-pitch-route__path", {
      strokeDashoffset: 1,
    }, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".dusk-home",
        start: "12% top",
        end: "88% bottom",
        scrub: 0.35,
      },
    });

    gsap.to(".dusk-hero__image", {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: ".dusk-hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.35,
      },
    });

    ScrollTrigger.refresh();
  }, { scope, dependencies: [enabled], revertOnUpdate: true });

  return <div ref={scope}>{children}</div>;
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

  return <ReactLenis root options={{ autoRaf: false, lerp: 0.09, smoothWheel: true, syncTouch: false }}><LenisGsapConnector enabled /><MotionStage enabled>{children}</MotionStage></ReactLenis>;
}
