import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our ground",
  description: "The booking idea and match-day philosophy behind ArmourXSports.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our ground"
        title={<>Football needs<br />room to breathe.</>}
        intro="ArmourXSports is shaped around complete field blocks, clear choices and the belief that a match day should never feel rushed."
        image={images.nightPlayer}
        imageAlt="Football player on a field at night"
      />
      <section className="about-story">
        <div className="shell about-story__grid">
          <SectionHeading
            eyebrow="The idea"
            title={<>Fewer handovers.<br />Better football.</>}
            intro="At launch, two fields and two daily blocks keep the offer deliberately clear: morning from 09:00 to 15:00, or evening from 15:00 to 21:00."
          />
          <div className="about-story__body">
            <p>Teams can train, run fixtures, build rotations and leave breathing room around the football. The client interface is designed with the same principle—every state says what it means, every action has a purpose.</p>
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
          <ButtonLink href="/book" variant="dark">Build your match day</ButtonLink>
        </div>
      </section>
    </>
  );
}
