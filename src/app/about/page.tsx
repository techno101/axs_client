import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "About ArmourX Sports",
  description: "ArmourX Sports SDN BHD — two full-size football fields in Sunway City, Iskandar Puteri, Johor. Book online.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={<>Two fields.<br />One venue.<br /><em>Your game.</em></>}
        intro="ArmourX Sports SDN BHD operates two full-size football fields in Sunway City, Iskandar Puteri. Book a field online in under a minute — availability is checked in real time."
        image={images.aboutHero}
        imageAlt="Football action at ArmourX Sports in Iskandar Puteri"
      />
      <section className="about-story">
        <div className="shell about-story__grid">
          <SectionHeading
            eyebrow="How it started"
            title={<>Booking, minus<br />the phone calls.</>}
            intro="Coordinating a session used to mean messages across three different apps, hoping the field was free, and finding out the slot was already taken."
          />
          <div className="about-story__body">
            <p>We own the fields and run the booking system. When a booking is confirmed, that field and session are yours — availability updates for everyone at the same time, so nobody is left guessing.</p>
            <p>ArmourX Sports SDN BHD is a registered Malaysian company. We operate from our own venue at Sunway City, Iskandar Puteri, Johor. Two fields. Full-size sessions. Live availability.</p>
          </div>
        </div>
      </section>
      <section className="about-visual">
        <div className="shell about-visual__frame">
          <Image src={images.aboutPitches} alt="Aerial view of both ArmourX Sports pitches in Iskandar Puteri" fill sizes="100vw" />
          <div><span>2 fields</span><span>6-hour sessions</span><span>1 venue</span></div>
        </div>
        <div className="shell about-visual__frame about-visual__frame--second">
          <Image src={images.aboutOffice} alt="The ArmourX Sports office at Sunway City, Iskandar Puteri" fill sizes="100vw" />
        </div>
      </section>
      <section className="values-section">
        <div className="shell">
          <p className="eyebrow"><span aria-hidden="true" />How we operate</p>
          <div className="value-grid">
            <article><span>01</span><h2>Book &amp; confirm. In minutes.</h2><p>Pick a date, choose a session and confirm. Availability is checked in real time before your booking is saved.</p></article>
            <article><span>02</span><h2>Fixed pricing. No surprises.</h2><p>RM 600 for the morning. RM 800 for the evening. The whole field for six hours. No per-person charges.</p></article>
            <article><span>03</span><h2>Owned &amp; operated by us.</h2><p>We are not a marketplace. We own the venue and maintain the fields. When something needs attention, we fix it ourselves.</p></article>
          </div>
          <ButtonLink href="/book" variant="dark">Book your spot</ButtonLink>
        </div>
      </section>
    </>
  );
}
