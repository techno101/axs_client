"use client";

import { useEffect } from "react";
import { reportOperationalEvent } from "@/lib/operational-reporting";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { reportOperationalEvent({ category: "client_ui_error", errorCode: "CLIENT_RENDER_ERROR", summary: error.message || "The page could not load.", routeOrScreen: "public" }); }, [error]);
  return <html><body><main><h1>Game paused.</h1><p>Something broke on our end. We&apos;re fixing it. Your booking is safe — check your booking status page.</p><button type="button" onClick={reset}>Try again</button></main></body></html>;
}
