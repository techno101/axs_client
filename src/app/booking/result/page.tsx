import type { Metadata } from "next";
import { LivePaymentResult } from "@/components/booking/live-payment-result";
import { PageHero } from "@/components/layout/page-hero";
import { images } from "@/lib/content";

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
