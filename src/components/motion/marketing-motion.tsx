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
    const heroMedia = root.querySelector<HTMLElement>(".match-hero__media");
    const heroCopy = root.querySelector<HTMLElement>(".match-hero__copy");
    const heroAvailability = root.querySelector<HTMLElement>(".match-hero__availability");
    const action = root.querySelector<HTMLElement>(".match-sessions");
    const sessionCards = root.querySelectorAll<HTMLElement>(".match-session-card");
    const actionCopy = root.querySelector<HTMLElement>(".match-sessions__head");
    const teamMedia = root.querySelector<HTMLElement>(".match-team__media");
    const finalHeading = root.querySelector<HTMLElement>(".match-final h2");
    const finalMedia = root.querySelector<HTMLElement>(".match-final__media");
    const pitchesMedia = root.querySelector<HTMLElement>(".match-pitches__media");
    const pitchesCopy = root.querySelector<HTMLElement>(".match-pitches__copy");
    const gallery = root.querySelector<HTMLElement>(".match-gallery");
    const galleryTrack = root.querySelector<HTMLElement>(".match-gallery__track");
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
      .fromTo(openingFrames, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.48, stagger: 0.07 })
      .to(openingFrames, { scale: (index) => index === 0 ? 1.02 : 0.9, xPercent: (index) => index === 0 ? 1 : index % 2 ? 10 : -10, yPercent: (index) => index === 0 ? -1 : index % 2 ? 6 : -6, duration: 0.88, stagger: 0.03 }, 0.7)
      .to(opening, { autoAlpha: 0, duration: 0.44, ease: "power2.inOut" }, 1.75)
      // Hero copy enters only after the boot loader has fully unmounted.
      .add(() => {
        if (document.documentElement.getAttribute("data-boot-done") === "1") return;
        intro.pause();
        const waitBoot = () => {
          if (document.documentElement.getAttribute("data-boot-done") === "1") {
            document.removeEventListener("boot:done", waitBoot);
            intro.resume();
          }
        };
        document.addEventListener("boot:done", waitBoot);
        window.setTimeout(waitBoot, 3000);
      }, 1.85)
      .fromTo(heroCopy, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, "+=0.05")
      .fromTo(heroAvailability, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, "+=0.05");

    const interactionEvents: Array<keyof WindowEventMap> = ["wheel", "touchstart", "pointerdown", "keydown"];
    interactionEvents.forEach((eventName) => window.addEventListener(eventName, settle, { passive: eventName !== "keydown", once: true }));

    const mediaElements = gsap.utils.toArray<HTMLImageElement>(".match-cut-media img", root);
    mediaElements.forEach((image) => image.addEventListener("error", settle, { once: true }));

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
      if (heroMedia) {
        gsap.to(heroMedia, {
          yPercent: 16,
          ease: "none",
          scrollTrigger: { trigger: ".match-hero", start: "top top", end: "bottom top", scrub: 0.6 },
        });
      }

      const heroCopyEl = root.querySelector<HTMLElement>(".match-hero__copy");
      if (heroCopyEl) {
        gsap.to(heroCopyEl, {
          yPercent: -34,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: ".match-hero", start: "top top", end: "bottom top", scrub: 0.6 },
        });
      }

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

      if (gallery && galleryTrack) {
        const galleryTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: gallery,
            start: "top top",
            end: () => `+=${galleryTrack.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
        });
        galleryTimeline.to(galleryTrack, { x: () => -(galleryTrack.scrollWidth - window.innerWidth), ease: "none", duration: 1 });
      }
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
      interactionEvents.forEach((eventName) => window.removeEventListener(eventName, settle));
      mediaElements.forEach((image) => image.removeEventListener("error", settle));
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
