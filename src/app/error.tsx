"use client";

import { AlertIcon } from "@/components/ui/icons";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="system-view system-view--error">
      <div className="system-view__grid" aria-hidden="true" />
      <div className="system-view__content">
        <div className="system-view__icon"><AlertIcon /></div><p>Route error</p><h1>That pass did not connect.</h1><span>Nothing has been charged or booked. Retry this view or return through the main navigation.</span><div><button className="system-retry" type="button" onClick={reset}>Try again</button></div>
      </div>
    </section>
  );
}
