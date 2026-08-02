import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { createServerPublicClient } from "@/lib/api/server-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Confirmed booking facts and clearly marked pending policies for ArmourXSports.",
};

export default async function FaqPage() {
  const faqs = await createServerPublicClient().getFaqs();
  return (
    <>
      <PageHero
        compact
        eyebrow="Good to know"
        title={<>Questions,<br />answered clearly.</>}
        intro="Clear answers about sessions, payment, guest booking and the venue."
      />
      <section className="faq-page-section">
        <div className="shell faq-page-section__grid">
          <aside><span>01</span><strong>Booking</strong><span>02</span><strong>Payment</strong><span>03</span><strong>Policy</strong></aside>
          <div className="accordion-list accordion-list--large">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary><span>0{index + 1}</span>{faq.question}<span className="accordion-plus" aria-hidden="true" /></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
