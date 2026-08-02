import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { VenueMap } from "@/components/map/venue-map";
import { ButtonLink } from "@/components/ui/button-link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  PinIcon,
} from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { createServerPublicClient } from "@/lib/api/server-client";
import { images } from "@/lib/content";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Take your 2 hours.",
  description:
    "Complete pitch blocks. Live availability. No phone calls. No overlaps. Just football.",
};
export const dynamic = "force-dynamic";

const facilities = [
  ["01", "Morning or evening", "9 to 3. Or 3 to 9. Your call."],
  ["02", "Book in seconds", "Pick a field. Pick a block. Done."],
  ["03", "No account needed", "Book as a guest. Or sign up and track everything."],
  ["04", "One venue. Two fields.", "Floodlit. Full-size. Game-ready."],
];

export default async function HomePage() {
  const publicClient = createServerPublicClient();
  const [fields, blocks, faqs] = await Promise.all([
    publicClient.getFields(),
    publicClient.getBlocks(),
    publicClient.getFaqs(),
  ]);

  return (
    <>
      <section className="home-hero">
        <Image
          className="home-hero__image"
          src={images.heroAerial}
          alt="ArmourXSports venue aerial view"
          fill
          priority
          sizes="100vw"
        />
        <div className="home-hero__veil" aria-hidden="true" />
        <div className="home-hero__net" aria-hidden="true" />
        <div className="shell home-hero__content">
          <div className="home-hero__copy">
            <p className="eyebrow eyebrow--light">
              <span aria-hidden="true" />
              Field blocks. No chaos.
            </p>
            <h1>
              Take your<em>2&nbsp;hours.</em>
            </h1>
            <p>
              You give 22 to everyone else. Work. Traffic. Obligations.
              These 2 are yours. Book them. Defend them. Play.
            </p>
            <div className="home-hero__actions">
              <ButtonLink href="/book">Book a field</ButtonLink>
              <Link className="hero-text-link" href="#fields">
                Explore fields
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true">
            <span>AXS</span>
            <strong>01</strong>
          </div>
        </div>
        <div className="shell hero-booking-bar">
          <div className="hero-booking-bar__intro">
            <span>How it works</span>
            <strong>Three steps. No phone calls.</strong>
          </div>
          <div className="hero-booking-bar__detail">
            <CalendarIcon />
            <span>
              <small>Pick a date</small>
              Up to 90 days ahead
            </span>
          </div>
          <div className="hero-booking-bar__detail">
            <ClockIcon />
            <span>
              <small>Pick a block</small>
              09:00–15:00 · 15:00–21:00
            </span>
          </div>
          <Link href="/book" aria-label="Check field availability">
            Book now
            <ArrowUpRightIcon />
          </Link>
        </div>
      </section>

      <section className="home-intro">
        <div className="shell home-intro__grid">
          <div className="home-intro__statement">
            <p>Booking doesn&apos;t need to be complicated.</p>
            <h2>One field. One block.<br />One confirmation.<br />Then you play.</h2>
          </div>
          <div className="home-intro__aside">
            <span className="oversized-x" aria-hidden="true">X</span>
            <p>
              No phone calls. No WhatsApp negotiations. No showing up to find somebody else on your pitch.
              Pick a window. Book. Done. The field is yours for 2 hours.
            </p>
            <Link href="/about">
              Why we built this
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="fields-showcase" id="fields">
        <div className="shell">
          <div className="fields-showcase__top">
            <SectionHeading
              eyebrow="The fields"
              title={<>Two fields.<br />One venue.<br />Under the lights.</>}
              intro="Field 1 and Field 2. Same location. Floodlit. Full-size. Game-ready."
            />
            <ButtonLink href="/fields" variant="dark">Compare fields</ButtonLink>
          </div>
          <div className="field-editorial-grid">
            {fields.map((field, index) => (
              <article className={`field-editorial-card field-editorial-card--${index + 1}`} key={field.id}>
                <Link href={`/fields/${field.slug}`} aria-label={`View ${field.name}`}>
                  <div className="field-editorial-card__image">
                    <Image src={field.image} alt={field.imageAlt} fill sizes="(max-width: 800px) 100vw, 55vw" />
                    <div className="image-vignette" aria-hidden="true" />
                    <span className="field-editorial-card__number">0{index + 1}</span>
                  </div>
                  <div className="field-editorial-card__copy">
                    <div>
                      <p>{field.shortName}</p>
                      <h3>{field.name}</h3>
                    </div>
                    <span className="round-link"><ArrowUpRightIcon /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div className="shell pricing-section__grid">
          <div className="pricing-section__visual">
            <Image src={images.nightPlayer} alt="Football player on a lit pitch at night" fill sizes="(max-width: 800px) 100vw, 48vw" />
            <div className="pricing-section__visual-copy">
              <span>One price</span>
              <strong>Full field. Bring your squad.</strong>
            </div>
          </div>
          <div className="pricing-section__content">
            <SectionHeading
              eyebrow="Transparent pricing"
              title={<>RM 60 mornings.<br />RM 80 evenings.</>}
              intro="The field doesn&apos;t charge by the player. Bring 10. Bring 20. The price stays the same."
              tone="light"
            />
            <div className="price-list">
              {blocks.map((block, index) => (
                <div className="price-row" key={`${block.fieldId}-${block.id}`}>
                  <span className="price-row__index">0{index + 1}</span>
                  <div>
                    <p>{block.label}</p>
                    <strong>{block.startsAt}—{block.endsAt}</strong>
                  </div>
                  <span className="price-row__price">{formatMoney(block.amountMinor)}</span>
                </div>
              ))}
            </div>
            <ButtonLink href="/book">Book your slot</ButtonLink>
          </div>
        </div>
      </section>

      <section className="facilities-section">
        <div className="shell">
          <SectionHeading
            eyebrow="The experience"
            title={<>Built for<br />the game.</>}
            intro="Not a generic calendar. Purpose-built for football blocks. Everything you need. Nothing you don&apos;t."
          />
          <div className="facility-list">
            {facilities.map(([index, title, description]) => (
              <article key={index}>
                <span>{index}</span>
                <div className="facility-icon" aria-hidden="true"><CheckIcon /></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-title">
        <div className="shell gallery-section__header">
          <div>
            <p className="eyebrow eyebrow--light"><span aria-hidden="true" />The venue</p>
            <h2 id="gallery-title">Where the game lives.</h2>
          </div>
          <p>Real venue photography. No stock images. No filters. Just the pitch as it is.</p>
        </div>
        <div className="gallery-ribbon">
          <figure className="gallery-ribbon__wide">
            <Image src={images.nightStadium} alt="Lit stadium at night" fill sizes="65vw" />
          </figure>
          <figure>
            <Image src={images.aerialPitch} alt="Green football field viewed from above" fill sizes="35vw" />
          </figure>
          <figure>
            <Image src={images.nightPlayer} alt="Player on a football field under floodlights" fill sizes="35vw" />
          </figure>
        </div>
      </section>

      <section className="location-section">
        <div className="shell location-section__grid">
          <div className="location-copy">
            <SectionHeading
              eyebrow="Find us"
              title={<>One venue.<br />Two fields.<br />No confusion.</>}
              intro="ArmourXSports, Sunway City. Exact address and directions on the way. The pitch is real. The map proves it."
            />
            <div className="location-placeholder">
              <PinIcon />
              <div>
                <strong>ArmourXSports</strong>
                <span>Sunway City · Kuala Lumpur</span>
              </div>
            </div>
            <ButtonLink href="/contact" variant="dark">Get in touch</ButtonLink>
          </div>
          <div className="map-art">
            <VenueMap />
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="shell faq-section__grid">
          <div>
            <SectionHeading
              eyebrow="Quick answers"
              title={<>Before<br />you play.</>}
              intro="The stuff you actually want to know. No marketing fluff. No fine print hidden at the bottom."
            />
            <ButtonLink href="/faq" variant="dark">View all FAQs</ButtonLink>
          </div>
          <div className="accordion-list">
            {faqs.slice(0, 4).map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>
                  <span>0{index + 1}</span>
                  {faq.question}
                  <span className="accordion-plus" aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <Image src={images.texturedPitch} alt="Football pitch viewed from above" fill sizes="100vw" />
        <div className="final-cta__scrim" aria-hidden="true" />
        <div className="shell final-cta__content">
          <p>The group chat is waiting for someone to book.</p>
          <h2>Be that someone.</h2>
          <ButtonLink href="/book">Book a field</ButtonLink>
        </div>
      </section>
    </>
  );
}
