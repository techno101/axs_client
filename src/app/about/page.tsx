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
        intro="ArmourX Sports SDN BHD operates two full-size football fields in Sunway City, Iskandar Puteri. We built this platform so booking a field takes seconds — not phone calls, not WhatsApp groups, not guesswork."
        image={images.aboutHero}
        imageAlt="Football action at ArmourX Sports in Iskandar Puteri"
      />
      <section className="about-story">
        <div className="shell about-story__grid">
          <SectionHeading
            eyebrow="How it started"
            title={<>We were tired of<br />the old way.</>}
            intro="Coordinating a football session meant messages across three different apps, hoping the field was free, and praying nobody double-booked your slot."
          />
          <div className="about-story__body">
            <p>We own the fields and run the booking system. Once your booking is confirmed, that field and session are yours. The WhatsApp group can stop asking &lsquo;siapa booked?&rsquo;</p>
            <p>ArmourX Sports SDN BHD is a registered Malaysian company. We operate from our own venue at Sunway City, Iskandar Puteri, Johor. Two fields. Full facilities. Live availability. That&apos;s it.</p>
          </div>
        </div>
      </section>
      <section className="about-visual">
        <div className="shell about-visual__frame">
          <Image src={images.venueOverview} alt="The ArmourX Sports ground in Iskandar Puteri" fill sizes="100vw" />
          <div><span>2 fields</span><span>6-hour sessions</span><span>1 venue</span></div>
        </div>
      </section>
      <section className="values-section">
        <div className="shell">
          <p className="eyebrow"><span aria-hidden="true" />How we operate</p>
          <div className="value-grid">
            <article><span>01</span><h2>Book &amp; confirm. No drama.</h2><p>Pick your date, field, and session time. Confirmed instantly. Your slot is yours. Nobody else touches it. No phone calls required.</p></article>
            <article><span>02</span><h2>Fair pricing. No surprises.</h2><p>RM 600 for the morning. RM 800 for the evening. The whole field for six hours. Bring as many players as you want. No per-person charges.</p></article>
            <article><span>03</span><h2>Owned &amp; operated by us.</h2><p>We are not a marketplace. We own the venue. We maintain the fields. When something needs attention, we fix it — not a third party three towns away.</p></article>
          </div>
          <ButtonLink href="/book" variant="dark">Book your spot</ButtonLink>
        </div>
      </section>
    </>
  );
}
