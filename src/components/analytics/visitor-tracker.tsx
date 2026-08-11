"use client";

import { useEffect, useState } from "react";
import { reportOperationalEvent } from "@/lib/operational-reporting";

const CONSENT_KEY = "axs_consent";

/**
 * Privacy-safe visitor tracking: a session is only recorded after the user
 * accepts the cookie notice; IPs are stored hashed on the server. Also reports
 * broken images with page and browser context so the owner sees failures
 * before a customer messages them.
 */
export function VisitorTracker() {
  const [consent, setConsent] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(CONSENT_KEY);
  });

  useEffect(() => {
    const reportImageFailures = (event: Event) => {
      const target = event.target as HTMLImageElement | null;
      if (!target || target.tagName !== "IMG" || !target.src) return;
      reportOperationalEvent({
        category: "client_ui_error",
        errorCode: "IMAGE_LOAD_FAILED",
        summary: `Image failed to load: ${target.src.slice(0, 200)}`,
        routeOrScreen: window.location.pathname,
      });
    };
    window.addEventListener("error", reportImageFailures, true);
    return () => window.removeEventListener("error", reportImageFailures, true);
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;
    let stopped = false;
    const start = async () => {
      try {
        const response = await fetch("/api/axs/v1/public/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ consent: true, pagePath: window.location.pathname }),
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = await response.json() as { data?: { token?: string } };
        const token = payload.data?.token;
        if (!token || stopped) return;
        const beat = () => {
          void fetch("/api/axs/v1/public/visitors/heartbeat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, pagePath: window.location.pathname }),
            cache: "no-store",
          }).catch(() => undefined);
        };
        beat();
        const interval = window.setInterval(beat, 60_000);
        window.addEventListener("pagehide", beat, { once: true });
        return () => { stopped = true; window.clearInterval(interval); };
      } catch {
        /* tracking is best-effort */
      }
    };
    void start();
    return () => { stopped = true; };
  }, [consent]);

  if (consent !== null) return null;

  return (
    <div className="consent-bar" role="region" aria-label="Cookie notice">
      <p>We use a small cookie to keep your booking session safe and understand which pages are useful. No personal data is sold or shared.</p>
      <div className="consent-bar__actions">
        <button type="button" onClick={() => { window.localStorage.setItem(CONSENT_KEY, "declined"); setConsent("declined"); }}>Decline</button>
        <button type="button" className="consent-bar__accept" onClick={() => { window.localStorage.setItem(CONSENT_KEY, "accepted"); setConsent("accepted"); }}>Accept</button>
      </div>
    </div>
  );
}
