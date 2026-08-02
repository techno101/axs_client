"use client";

import { useEffect } from "react";
import { reportOperationalEvent } from "@/lib/operational-reporting";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { reportOperationalEvent({ category: "client_ui_error", errorCode: "CLIENT_RENDER_ERROR", summary: error.message || "The page could not load.", routeOrScreen: "public" }); }, [error]);
  return <section className="system-view"><div className="system-view__grid" aria-hidden="true" /><div className="system-view__content"><p>Play interrupted</p><h1>Game paused.</h1><span>We could not load this page. Check your booking status before trying again.</span><div><button className="system-retry" type="button" onClick={reset}>Try again</button><a className="customer-secondary" href="/booking/find">Find booking</a></div></div></section>;
}
