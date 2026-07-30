import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import { PinIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact route preview for ArmourXSports venue and booking questions.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Contact ArmourXSports"
        title={<>Contact details<br />are pending.</>}
        intro="Approved phone, email, venue address and support hours are still pending. This route keeps every placeholder explicit."
      />
      <section className="contact-section">
        <div className="shell contact-section__grid">
          <div className="contact-details">
            <p className="eyebrow"><span aria-hidden="true" />Contact channels</p>
            <h2>Venue details coming before launch.</h2>
            <p>We will publish only verified business contact information. For now, use the form to inspect the intended interaction.</p>
            <div><PinIcon /><span><strong>ArmourXSports venue</strong>Address pending owner confirmation</span></div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
