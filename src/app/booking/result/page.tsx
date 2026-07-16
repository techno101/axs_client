import type { Metadata } from "next";
import { LivePaymentResult } from "@/components/booking/live-payment-result";
import { PageHero } from "@/components/layout/page-hero";
import { configuredApiOrigin } from "@/lib/api/http-client";

export const metadata: Metadata = {
  title: "Booking status",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BookingResultPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const query = await searchParams;
  const reference = query.reference && /^AXS-[A-Z0-9]{6,12}$/.test(query.reference) ? query.reference : "AXS-PENDING";
  return (
    <>
      <PageHero compact eyebrow="Authoritative status" title={<>Booking<br />status.</>} intro="Browser return parameters never prove payment. This page polls the verified backend booking and payment state using a private browser-held access token." />
      <section className="payment-result-section">
        <div className="shell payment-result-section__grid">
          <LivePaymentResult reference={reference} apiOrigin={configuredApiOrigin()} />
          <aside><p className="eyebrow"><span aria-hidden="true" />Payment integrity</p><h2>Backend state decides.</h2><p>The redirect improves the customer experience only. A verified, amount-matched, idempotent Billplz callback is required before this page can show confirmation.</p></aside>
        </div>
      </section>
    </>
  );
}
