"use client";

import { useEffect } from "react";
import { reportOperationalEvent } from "@/lib/operational-reporting";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { reportOperationalEvent({ category: "client_ui_error", errorCode: "CLIENT_RENDER_ERROR", summary: error.message || "The public interface could not render this screen.", routeOrScreen: "public" }); }, [error]);
  return <html><body><main><h1>Something went wrong</h1><p>Please try again. Your booking is confirmed only by the verified backend status page.</p><button type="button" onClick={reset}>Try again</button></main></body></html>;
}
