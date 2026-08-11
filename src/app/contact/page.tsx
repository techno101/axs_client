import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import { PinIcon } from "@/components/ui/icons";
import { images } from "@/lib/content";

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
        intro="Send us a message about bookings, sessions or the venue. Include your booking reference if your question is about an existing booking."
        image={images.contactPhoto}
        imageAlt="The ArmourX Sports venue in Iskandar Puteri"
      />
      <section className="contact-section">
        <div className="shell contact-section__grid">
          <div className="contact-details">
            <p className="eyebrow"><span aria-hidden="true" />Reach us directly</p>
            <h2>Questions about<br />a booking?</h2>
            <p>Send us a message by email. We reply to every message and include next steps for booking, payment and venue questions.</p>
            <div><PinIcon /><span><strong>ArmourX Sports SDN BHD</strong>LOT 165132, Persiaran Medini 3<br />Sunway City, 79250 Iskandar Puteri<br />Johor Darul Ta&apos;zim</span></div>
            <div style={{ marginTop: 16 }}><span><strong>Email</strong><br />armourxsports@gmail.com</span></div>
          </div>
          <ContactForm />
        </div>
        <div className="shell contact-visual">
          <Image src={images.aboutOffice} alt="The ArmourX Sports office at Sunway City, Iskandar Puteri" fill sizes="100vw" />
        </div>
      </section>
    </>
  );
}
