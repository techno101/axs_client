import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import { PinIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Get in touch",
  description: "Questions about bookings, the venue, or anything else. Real people. Real answers.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Contact us"
        title={<>Talk to us.<br /><em>Not a bot.</em></>}
        intro="Questions, feedback, or partnership enquiries. We respond within 24 hours. Real people. Real answers."
      />
      <section className="contact-section">
        <div className="shell contact-section__grid">
          <div className="contact-details">
            <p className="eyebrow"><span aria-hidden="true" />Reach us</p>
            <h2>One form.<br />Direct response.</h2>
            <p>No ticket numbers. No automated replies. Fill in the form and we&apos;ll get back to you. Usually within a day.</p>
            <div><PinIcon /><span><strong>ArmourXSports</strong>Sunway City · Kuala Lumpur<br />Full address and phone coming soon</span></div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
