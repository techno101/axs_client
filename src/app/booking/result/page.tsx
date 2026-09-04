import type { Metadata } from "next";
import { LivePaymentResult } from "@/components/booking/live-payment-result";
import { PageHero } from "@/components/layout/page-hero";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Booking status",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function extractOrderReference(query: Record<string, string | string[] | undefined>): string {
  const candidates: string[] = [];
  for (const key of ["order", "reference"]) {
    const val = query[key];
    if (typeof val === "string") {
      candidates.push(val);
    } else if (Array.isArray(val)) {
      candidates.push(...val);
    }
  }
  for (const item of candidates) {
    const trimmed = item.trim();
    if (/^AXO-[A-Z0-9-]{6,24}$/i.test(trimmed)) {
      return trimmed.toUpperCase();
    }
  }
  return "AXO-PENDING";
}

export default async function BookingResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const reference = extractOrderReference(query);
  return (
    <>
      <PageHero compact eyebrow="Booking status" title={<>Your order<br />status.</>} intro="Keep this page open after checkout. It shows when your field is locked in." image={images.homeHero} />
      <section className="payment-result-section">
        <div className="shell payment-result-section__grid">
          <LivePaymentResult reference={reference} />
          <aside><p className="eyebrow"><span aria-hidden="true" />How it works</p><h2>You&apos;re confirmed the moment it&apos;s done.</h2><p>Your field shows as confirmed right here as soon as the payment goes through — and your confirmation email will have everything too.</p></aside>
        </div>
      </section>
    </>
  );
}
