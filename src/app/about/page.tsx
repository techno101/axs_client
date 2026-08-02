import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Why we built this",
  description: "No phone calls. No WhatsApp chaos. No double bookings. Just football.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Why we exist"
        title={<>No phone calls.<br />No WhatsApp chaos.<br /><em>Just football.</em></>}
        intro="ArmourXSports started the way most things do. Someone was tired of the old way. The group chat. The double bookings. The 'is the field free?' anxiety. We fixed it."
        image={images.nightPlayer}
        imageAlt="Football player on a field at night"
      />
      <section className="about-story">
        <div className="shell about-story__grid">
          <SectionHeading
            eyebrow="The pitch"
            title={<>Two fields.<br />Two blocks.<br />That&apos;s it.</>}
            intro="We didn&apos;t overcomplicate it. Morning block 9 to 3. Evening block 3 to 9. Pick a field. Pick a window. Done."
          />
          <div className="about-story__body">
            <p>Every block is yours for 2 hours. Nobody else touches it. The server confirms it. The WhatsApp group can stop asking &apos;field dah booked ke belum?&apos;</p>
            <p>Full venue specs, surface details, and facility inventory are on the way. We won&apos;t publish guesses. When it&apos;s here, it&apos;s real.</p>
          </div>
        </div>
      </section>
      <section className="about-visual">
        <div className="shell about-visual__frame">
          <Image src={images.aerialPitch} alt="Aerial view of a football field" fill sizes="100vw" />
          <div><span>02 fields</span><span>02 blocks</span><span>00 excuses</span></div>
        </div>
      </section>
      <section className="values-section">
        <div className="shell">
          <p className="eyebrow"><span aria-hidden="true" />The three rules</p>
          <div className="value-grid">
            <article><span>01</span><h2>Respect the time.</h2><p>Booking takes seconds. Not phone calls. Not favours. You have 2 hours. Don&apos;t waste them on logistics.</p></article>
            <article><span>02</span><h2>Respect the game.</h2><p>Availability is real-time. Pricing is fixed. Payment is direct. What you see is what you get. No dark patterns. No bait-and-switch.</p></article>
            <article><span>03</span><h2>Respect the player.</h2><p>Whether you&apos;re the best on the pitch or the first one subbed off. The field doesn&apos;t judge. Neither do we. Everyone gets their 2 hours.</p></article>
          </div>
          <ButtonLink href="/book" variant="dark">Book a field</ButtonLink>
        </div>
      </section>
    </>
  );
}
