import Image from "next/image";
import Link from "next/link";
import { MarketingMotion } from "@/components/motion/marketing-motion";
import { VenueMap } from "@/components/map/venue-map";
import { ArrowRightIcon, ArrowUpRightIcon, PinIcon } from "@/components/ui/icons";
import type { BookingBlock, FaqItem, Field } from "@/lib/api/types";
import { images } from "@/lib/content";
import { formatMoney } from "@/lib/format";
import { homeCopy, type SiteLocale } from "@/lib/site-copy";

type Props = {
  locale: SiteLocale;
  fields: Field[];
  blocks: BookingBlock[];
  faqs: FaqItem[];
  degraded: boolean;
};

export function HomeExperience({ locale, fields, blocks, faqs, degraded }: Props) {
  const copy = homeCopy[locale];
  const displayFaqs = locale === "bm" ? copy.faqFallback : (faqs.length ? faqs.slice(0, 4) : copy.faqFallback);
  const sessionBlocks = blocks.filter((block, index, all) => all.findIndex((item) => item.id === block.id) === index).slice(0, 2);

  return (
    <MarketingMotion>
      <div className="dusk-home">
        <svg className="dusk-pitch-route" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
          <path className="dusk-pitch-route__ghost" d="M87 0 C87 110 14 95 14 215 S88 330 88 440 S13 560 13 680 S87 795 87 1000" />
          <path className="dusk-pitch-route__path" pathLength="1" d="M87 0 C87 110 14 95 14 215 S88 330 88 440 S13 560 13 680 S87 795 87 1000" />
        </svg>

        <section className="dusk-hero" aria-labelledby="dusk-hero-title">
          <Image className="dusk-hero__image" src={images.heroAerial} alt="Two ArmourX Sports football fields in Sunway City, Iskandar Puteri" fill priority sizes="100vw" />
          <div className="dusk-hero__wash" aria-hidden="true" />
          <div className="dusk-hero__horizon" aria-hidden="true" />
          <div className="shell dusk-hero__layout">
            <div className="dusk-hero__copy">
              <p className="dusk-kicker">{copy.eyebrow}</p>
              <h1 id="dusk-hero-title">
                <span className="dusk-hero__mask"><span className="dusk-hero__line">{copy.heroTitle[0]}</span></span>
                <span className="dusk-hero__mask"><span className="dusk-hero__line dusk-hero__line--lit">{copy.heroTitle[1]}</span></span>
              </h1>
              <p className="dusk-hero__intro">{copy.heroIntro}</p>
              <div className="dusk-hero__actions">
                <Link className="dusk-action dusk-action--primary" href="/book">
                  <span>{copy.primaryAction}</span><ArrowRightIcon />
                </Link>
                <Link className="dusk-action dusk-action--quiet" href="#fields">
                  <span>{copy.secondaryAction}</span><ArrowRightIcon />
                </Link>
              </div>
            </div>
            <aside className="dusk-hero__sessions" aria-label={copy.availabilityLabel}>
              <p>{copy.availabilityLabel}</p>
              {sessionBlocks.map((block) => (
                <div key={block.id}>
                  <span>{block.id === "MORNING" ? copy.morning : copy.evening}</span>
                  <strong>{block.startsAt}–{block.endsAt}</strong>
                  <b>{formatMoney(block.amountMinor)}</b>
                </div>
              ))}
              <small>{copy.fullSession}</small>
            </aside>
          </div>
        </section>

        {degraded ? <div className="shell dusk-service-note" role="status">{copy.degraded}</div> : null}

        <section className="dusk-journey" aria-labelledby="journey-title">
          <div className="shell dusk-journey__intro dusk-reveal">
            <p className="dusk-kicker dusk-kicker--dark">{copy.journeyEyebrow}</p>
            <h2 id="journey-title">{copy.journeyTitle}</h2>
            <p>{copy.journeyIntro}</p>
          </div>
          <div className="shell dusk-session-track dusk-reveal">
            <article className="dusk-session dusk-session--day">
              <span className="dusk-session__sun" aria-hidden="true" />
              <div><p>{copy.daylight}</p><h3>{formatMoney(sessionBlocks[0]?.amountMinor ?? 60000)}</h3><span>{copy.daylightCopy}</span></div>
            </article>
            <div className="dusk-session-track__line" aria-hidden="true"><i /><i /></div>
            <article className="dusk-session dusk-session--night">
              <span className="dusk-session__light" aria-hidden="true" />
              <div><p>{copy.floodlights}</p><h3>{formatMoney(sessionBlocks[1]?.amountMinor ?? 80000)}</h3><span>{copy.floodlightsCopy}</span></div>
            </article>
          </div>
          <p className="shell dusk-pricing-note dusk-reveal">{copy.pricingNote}</p>
        </section>

        <section className="dusk-fields" id="fields" aria-labelledby="fields-title">
          <div className="shell dusk-section-head dusk-reveal">
            <div><p className="dusk-kicker dusk-kicker--dark">{copy.fieldsEyebrow}</p><h2 id="fields-title">{copy.fieldsTitle}</h2></div>
            <p>{copy.fieldsIntro}</p>
          </div>
          <div className="shell dusk-field-pair">
            {fields.slice(0, 2).map((field, index) => (
              <article className="dusk-field-card dusk-reveal" key={field.id}>
                <Link href={`/fields/${field.slug}`} aria-label={`${copy.viewField}: ${field.name}`}>
                  <div className="dusk-field-card__media">
                    <Image src={field.image} alt={field.imageAlt} fill sizes="(max-width: 767px) 100vw, 50vw" />
                    <span className="dusk-field-card__mark" aria-hidden="true"><i /><i /></span>
                  </div>
                  <div className="dusk-field-card__copy">
                    <div><span>{locale === "bm" ? `Padang ${index + 1}` : field.shortName}</span><h3>{locale === "bm" ? `Padang ${index + 1}` : field.name}</h3></div>
                    <span className="dusk-field-card__link">{copy.viewField}<ArrowUpRightIcon /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="dusk-facilities" aria-labelledby="facilities-title">
          <div className="shell dusk-facilities__layout">
            <div className="dusk-facilities__portrait dusk-reveal">
              <Image src={images.nightPlayer} alt="Football player under the ArmourX Sports floodlights" fill sizes="(max-width: 767px) 100vw, 38vw" />
              <span aria-hidden="true">AXS</span>
            </div>
            <div>
              <div className="dusk-reveal"><p className="dusk-kicker">{copy.facilitiesEyebrow}</p><h2 id="facilities-title">{copy.facilitiesTitle}</h2><p className="dusk-facilities__intro">{copy.facilitiesIntro}</p></div>
              <div className="dusk-facility-list">
                {copy.facilities.map((item) => <article className="dusk-reveal" key={item.title}><h3>{item.title}</h3><p>{item.copy}</p></article>)}
              </div>
            </div>
          </div>
        </section>

        <section className="dusk-location" id="venue" aria-labelledby="location-title">
          <div className="shell dusk-location__layout">
            <div className="dusk-location__copy dusk-reveal">
              <p className="dusk-kicker dusk-kicker--dark">{copy.locationEyebrow}</p>
              <h2 id="location-title">{copy.locationTitle}</h2>
              <p>{copy.locationIntro}</p>
              <a className="dusk-action dusk-action--ink" href="https://maps.google.com/?q=1.3940655,103.6340126" target="_blank" rel="noreferrer">
                <PinIcon /><span>{copy.directions}</span><ArrowUpRightIcon />
              </a>
            </div>
            <div className="dusk-location__map dusk-reveal"><VenueMap /></div>
          </div>
        </section>

        <section className="dusk-faq" id="faq" aria-labelledby="faq-title">
          <div className="shell dusk-faq__layout">
            <div className="dusk-reveal"><p className="dusk-kicker dusk-kicker--dark">{copy.faqEyebrow}</p><h2 id="faq-title">{copy.faqTitle}</h2><p>{copy.faqIntro}</p></div>
            <div className="dusk-faq__list dusk-reveal">
              {displayFaqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}<span aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className="dusk-final" aria-labelledby="final-title">
          <Image src={images.texturedPitch} alt="ArmourX Sports football pitch from above" fill sizes="100vw" />
          <div className="dusk-final__wash" aria-hidden="true" />
          <div className="shell dusk-final__content dusk-reveal">
            <p className="dusk-kicker">{copy.finalEyebrow}</p>
            <h2 id="final-title">{copy.finalTitle}</h2>
            <p>{copy.finalIntro}</p>
            <Link className="dusk-action dusk-action--primary" href="/book"><span>{copy.primaryAction}</span><ArrowRightIcon /></Link>
          </div>
        </section>
      </div>
    </MarketingMotion>
  );
}
