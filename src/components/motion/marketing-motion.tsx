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
    const opening = root.querySelector<HTMLElement>(".match-cut-opening");
    const openingFrames = gsap.utils.toArray<HTMLElement>(".match-cut-opening__frame", root);
    const media = root.querySelector<HTMLElement>(".match-hero__media");
    const actionWords = gsap.utils.toArray<HTMLElement>(".match-action__verbs span", root);
    let settled = false;

    const settle = () => {
      if (settled) return;
      settled = true;
      intro.pause();
      gsap.to(opening, { autoAlpha: 0, duration: 0.18, ease: "power1.out", overwrite: true });
      gsap.set(openingFrames, { clearProps: "transform" });
      ScrollTrigger.refresh();
    };

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .fromTo(openingFrames, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.09 })
      .to(openingFrames, { scale: (index) => index === 0 ? 1.04 : 0.88, xPercent: (index) => index === 0 ? 2 : index % 2 ? 14 : -14, yPercent: (index) => index === 0 ? -2 : index % 2 ? 8 : -8, duration: 1.2, stagger: 0.04 }, 1.05)
      .to(opening, { autoAlpha: 0, duration: 0.62, ease: "power2.inOut" }, 2.65);

    const interactionEvents: Array<keyof WindowEventMap> = ["wheel", "touchstart", "pointerdown", "keydown"];
    interactionEvents.forEach((eventName) => window.addEventListener(eventName, settle, { passive: eventName !== "keydown", once: true }));

    const mediaElements = gsap.utils.toArray<HTMLImageElement>(".match-cut-media img", root);
    mediaElements.forEach((image) => image.addEventListener("error", settle, { once: true }));

    gsap.utils.toArray<HTMLElement>(".match-reveal", root).forEach((element) => {
      gsap.from(element, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 82%", once: true },
      });
    });

    const mediaQueries = gsap.matchMedia();
    mediaQueries.add("(min-width: 900px)", () => {
      if (!media || actionWords.length === 0) return;
      gsap.set(actionWords, { autoAlpha: 0, yPercent: 18 });
      gsap.set(actionWords[0], { autoAlpha: 1, yPercent: 0 });

      const actionTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".match-action",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      actionWords.slice(1).forEach((word, index) => {
        actionTimeline
          .to(actionWords[index], { autoAlpha: 0, yPercent: -18, duration: 0.75, ease: "none" })
          .to(word, { autoAlpha: 1, yPercent: 0, duration: 0.75, ease: "none" }, "<");
      });

      actionTimeline.to(media, { scale: 1.035, duration: 0.75, ease: "none" }, 0);
    });

    ScrollTrigger.refresh();

    return () => {
      interactionEvents.forEach((eventName) => window.removeEventListener(eventName, settle));
      mediaElements.forEach((image) => image.removeEventListener("error", settle));
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
