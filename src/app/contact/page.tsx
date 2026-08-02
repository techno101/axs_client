import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import { PinIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact ArmourX Sports",
  description: "Get in touch with ArmourX Sports SDN BHD. Booking questions, venue enquiries, partnerships.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Get in touch"
        title={<>Questions?<br /><em>We answer.</em></>}
        intro="Fill in the form and we will get back to you within 24 hours. For booking issues, include your booking reference if you have one."
      />
      <section className="contact-section">
        <div className="shell contact-section__grid">
          <div className="contact-details">
            <p className="eyebrow"><span aria-hidden="true" />Reach us directly</p>
            <h2>Real people.<br />Real answers.</h2>
            <p>No ticket numbers. No automated replies. Write to us and we will respond — usually within a day.</p>
            <div><PinIcon /><span><strong>ArmourX Sports SDN BHD</strong>LOT 165132, Persiaran Medini 3<br />Sunway City, 79250 Iskandar Puteri<br />Johor Darul Ta&apos;zim</span></div>
            <div style={{ marginTop: 16 }}><span><strong>Email</strong><br />armourxsports@gmail.com</span></div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
