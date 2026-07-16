import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { configuredApiOrigin, createHttpPublicClient } from "@/lib/api/http-client";
import { images } from "@/lib/content";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Own the pitch",
  description:
    "Discover ArmourXSports and preview complete morning or evening football field blocks.",
};
export const dynamic = "force-dynamic";

const facilities = [
  ["01", "Floodlit play", "Balanced light across the full field"],
  ["02", "Team-ready", "Shelters and changing access"],
  ["03", "Easy arrival", "On-site parking and clear entry"],
  ["04", "Full block", "Six hours without hourly handovers"],
];

export default async function HomePage() {
  const publicClient = createHttpPublicClient(configuredApiOrigin());
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
          src={images.nightStadium}
          alt="Floodlit stadium viewed from above at night"
          fill
          priority
          sizes="100vw"
        />
        <div className="home-hero__veil" aria-hidden="true" />
        <div className="home-hero__floodlight home-hero__floodlight--one" aria-hidden="true" />
        <div className="home-hero__floodlight home-hero__floodlight--two" aria-hidden="true" />
        <div className="home-hero__net" aria-hidden="true" />
        <div className="shell home-hero__content">
          <div className="home-hero__copy">
            <p className="eyebrow eyebrow--light">
              <span aria-hidden="true" />
              Two fields · Complete blocks
            </p>
            <h1>
              Own the <em>pitch.</em>
            </h1>
            <p>
              Built for match days that need room to breathe. Choose your field, take the full block,
              and bring the team.
            </p>
            <div className="home-hero__actions">
              <ButtonLink href="/book">Book a field</ButtonLink>
              <Link className="hero-text-link" href="#fields">
                Explore the ground
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
            <span>Quick start</span>
            <strong>Plan your match day</strong>
          </div>
          <div className="hero-booking-bar__detail">
            <CalendarIcon />
            <span>
              <small>Booking window</small>
              Up to 90 days ahead
            </span>
          </div>
          <div className="hero-booking-bar__detail">
            <ClockIcon />
            <span>
              <small>Two daily blocks</small>
              09:00–15:00 · 15:00–21:00
            </span>
          </div>
          <Link href="/book" aria-label="Check field availability">
            Check availability
            <ArrowUpRightIcon />
          </Link>
        </div>
      </section>

      <section className="home-intro">
        <div className="shell home-intro__grid">
          <div className="home-intro__statement">
            <p>Football, uninterrupted.</p>
            <h2>Six hours. One field. Every minute belongs to your team.</h2>
          </div>
          <div className="home-intro__aside">
            <span className="oversized-x" aria-hidden="true">X</span>
            <p>
              No hourly shuffle and no fragmented schedule. ArmourXSports launches with two full fields
              and two clear daily windows.
            </p>
            <Link href="/about">
              Why complete blocks
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="fields-showcase" id="fields">
        <div className="shell">
          <div className="fields-showcase__top">
            <SectionHeading
              eyebrow="Choose your ground"
              title={<>Two fields.<br />One standard.</>}
              intro="A consistent full-block format, with a distinct match-day feel on each pitch."
            />
            <ButtonLink href="/fields" variant="dark">View both fields</ButtonLink>
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
              <span>One booking</span>
              <strong>Full field access</strong>
            </div>
          </div>
          <div className="pricing-section__content">
            <SectionHeading
              eyebrow="Simple block pricing"
              title={<>Pick your<br />rhythm.</>}
              intro="Launch pricing is fixed by complete block. The live service will always confirm the authoritative amount before a hold is created."
              tone="light"
            />
            <div className="price-list">
              {blocks.map((block, index) => (
                <div className="price-row" key={block.id}>
                  <span className="price-row__index">0{index + 1}</span>
                  <div>
                    <p>{block.label}</p>
                    <strong>{block.startsAt}—{block.endsAt}</strong>
                  </div>
                  <span className="price-row__price">{formatMoney(block.amountMinor)}</span>
                </div>
              ))}
            </div>
            <ButtonLink href="/book">Check availability</ButtonLink>
          </div>
        </div>
      </section>

      <section className="facilities-section">
        <div className="shell">
          <SectionHeading
            eyebrow="Ready around the pitch"
            title={<>The details that<br />keep play moving.</>}
            intro="A focused venue experience for teams, organisers and spectators. Final venue facts will be confirmed before production launch."
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
            <p className="eyebrow eyebrow--light"><span aria-hidden="true" />Inside the lines</p>
            <h2 id="gallery-title">Match-day atmosphere.</h2>
          </div>
          <p>Temporary licensed demo imagery. Venue photography will replace it before launch.</p>
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
              eyebrow="Find the ground"
              title={<>Your next<br />kick-off starts here.</>}
              intro="The verified venue address, directions and contact channels are awaiting owner confirmation. The final route will use approved information only."
            />
            <div className="location-placeholder">
              <PinIcon />
              <div>
                <strong>ArmourXSports venue</strong>
                <span>Address pending confirmation</span>
              </div>
            </div>
            <ButtonLink href="/contact" variant="dark">Contact the venue</ButtonLink>
          </div>
          <div className="map-art" role="img" aria-label="Stylised map placeholder; venue address pending confirmation">
            <div className="map-art__roads" aria-hidden="true" />
            <div className="map-art__pitch" aria-hidden="true"><span /></div>
            <div className="map-art__pin"><PinIcon /><span>AXS</span></div>
            <p>Verified map coming before launch</p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="shell faq-section__grid">
          <div>
            <SectionHeading
              eyebrow="Good to know"
              title={<>Before<br />the whistle.</>}
              intro="The essentials for planning a block. Final operational policy remains clearly marked until approved."
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
          <p>Bring the squad.</p>
          <h2>Make the field yours.</h2>
          <ButtonLink href="/book">Book a field</ButtonLink>
        </div>
      </section>
    </>
  );
}
