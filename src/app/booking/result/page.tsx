import type { Metadata } from "next";
import { LivePaymentResult } from "@/components/booking/live-payment-result";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Booking status",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BookingResultPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const query = await searchParams;
  const reference = query.reference && /^AXO-[A-Z0-9]{6,16}$/.test(query.reference) ? query.reference : "AXO-PENDING";
  return (
    <>
      <PageHero compact eyebrow="Booking status" title={<>Your order<br />status.</>} intro="Keep this page open after checkout. It checks your payment and shows when the field is confirmed." />
      <section className="payment-result-section">
        <div className="shell payment-result-section__grid">
          <LivePaymentResult reference={reference} />
          <aside><p className="eyebrow"><span aria-hidden="true" />How confirmation works</p><h2>Verified before confirmed.</h2><p>Returning from the payment page does not confirm a booking by itself. This page shows your field as confirmed only after the payment has been verified on the server.</p></aside>
        </div>
      </section>
    </>
  );
}
