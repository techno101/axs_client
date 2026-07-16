import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { AlertIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Error preview", robots: { index: false } };

export default function ErrorPreviewPage() {
  return (
    <section className="system-view system-view--error">
      <div className="system-view__grid" aria-hidden="true" />
      <div className="system-view__content">
        <div className="system-view__icon"><AlertIcon /></div><p>Error state preview</p><h1>That pass did not connect.</h1><span>Nothing has been charged or booked. Try the route again or return to a safe starting point.</span><div><ButtonLink href="/book">Try booking again</ButtonLink><ButtonLink href="/" variant="outline">Return home</ButtonLink></div>
      </div>
    </section>
  );
}
