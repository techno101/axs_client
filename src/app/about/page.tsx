import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our ground",
  description: "Confirmed booking rules and owner-pending venue information for ArmourXSports.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our ground"
        title={<>Confirmed facts.<br />No invented details.</>}
        intro="ArmourXSports currently offers complete field blocks. Final venue history, facilities and local details remain pending owner approval."
        image={images.nightPlayer}
        imageAlt="Football player on a field at night"
      />
      <section className="about-story">
        <div className="shell about-story__grid">
          <SectionHeading
            eyebrow="The idea"
            title={<>A clear booking<br />model.</>}
            intro="The current inventory uses two field records and two daily blocks: morning from 09:00 to 15:00, or evening from 15:00 to 21:00."
          />
          <div className="about-story__body">
            <p>The public interface shows availability, price, hold and payment states from the authoritative API. It does not decide or confirm those states in the browser.</p>
            <p>Final venue history, ownership story and local details are awaiting approved content. This page does not invent them.</p>
          </div>
        </div>
      </section>
      <section className="about-visual">
        <div className="shell about-visual__frame">
          <Image src={images.aerialPitch} alt="Aerial view of a football field" fill sizes="100vw" />
          <div><span>02 fields</span><span>02 blocks</span><span>01 clear experience</span></div>
        </div>
      </section>
      <section className="values-section">
        <div className="shell">
          <p className="eyebrow"><span aria-hidden="true" />What guides the experience</p>
          <div className="value-grid">
            <article><span>01</span><h2>Clarity over clutter.</h2><p>Only the states and decisions a customer needs, with no retail, POS or hourly-booking noise.</p></article>
            <article><span>02</span><h2>Authority stays server-side.</h2><p>Availability, pricing and payment confirmation never depend on browser assumptions.</p></article>
            <article><span>03</span><h2>Access is part of craft.</h2><p>Keyboard, focus, motion, contrast and touch behavior are design requirements—not cleanup.</p></article>
          </div>
          <ButtonLink href="/book" variant="dark">Book a field</ButtonLink>
        </div>
      </section>
    </>
  );
}
