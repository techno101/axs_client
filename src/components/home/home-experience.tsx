import Image from "next/image";
import Link from "next/link";
import { MatchHeroWordmark } from "@/components/home/match-hero-wordmark";
import { VenueMap } from "@/components/map/venue-map";
import { MarketingMotion } from "@/components/motion/marketing-motion";
import { ArrowRightIcon, ArrowUpRightIcon, PinIcon } from "@/components/ui/icons";
import type { BookingBlock, FaqItem, Field } from "@/lib/api/types";
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
  const bookingDataReady = fields.length > 0 && blocks.length > 0 && faqs.length > 0;

  return (
    <MarketingMotion>
      <div className="match-home">
        <section className="match-hero" aria-labelledby="match-hero-title">
          <div className="match-cut-opening" aria-hidden="true" inert>
            <div className="match-cut-opening__frame match-cut-opening__frame--lead">
              <Image src="/images/venue/home-hero.webp" alt="" fill priority sizes="(max-width: 767px) 92vw, 44vw" />
            </div>
            <div className="match-cut-opening__frame match-cut-opening__frame--detail-a">
              <Image src="/images/venue/home-hero.webp" alt="" fill sizes="180px" />
            </div>
            <div className="match-cut-opening__frame match-cut-opening__frame--detail-b">
              <Image src="/images/venue/home-hero.webp" alt="" fill sizes="180px" />
            </div>
            <div className="match-cut-opening__frame match-cut-opening__frame--detail-c">
              <Image src="/images/venue/home-hero.webp" alt="" fill sizes="180px" />
            </div>
          </div>

          <div className="match-hero__media match-cut-media">
            <Image src="/images/venue/home-hero.webp" alt="Community football at the ArmourX Sports ground in Iskandar Puteri" fill priority sizes="100vw" />
          </div>
          <div className="match-hero__shade" aria-hidden="true" />

          <div className="shell match-hero__layout">
            <div className="match-hero__copy">
              <p className="match-label">{copy.eyebrow}</p>
              <MatchHeroWordmark locale={locale} title={copy.heroTitle} />
              <p className="match-hero__intro">{copy.heroIntro}</p>
              <Link className="match-button match-button--bright" href="/book">
                <span>{copy.primaryAction}</span>
                <ArrowRightIcon />
              </Link>
            </div>
            <p className="match-hero__availability" role="status">{bookingDataReady ? copy.bookingStatusLive : copy.bookingStatusFallback}</p>
          </div>
        </section>

        {degraded ? <div className="shell match-service-note" role="status">{copy.degraded}</div> : null}

        <section className="match-ground match-reveal" id="ground" aria-labelledby="ground-title">
          <div className="shell match-ground__layout">
            <p className="match-label match-label--ink">{copy.groundEyebrow}</p>
            <h2 id="ground-title">{copy.groundTitle}</h2>
            <p>{copy.groundIntro}</p>
          </div>
        </section>

        <section className="match-action" aria-labelledby="action-title">
          <div className="match-action__media match-cut-media">
            <Image src="/images/venue/home-action.webp" alt="A player carrying the ball at the ArmourX Sports ground" fill sizes="(max-width: 767px) 100vw, 68vw" />
          </div>
          <div className="shell match-action__layout">
            <div className="match-action__copy">
              <p className="match-label">{copy.actionEyebrow}</p>
              <h2 id="action-title">{copy.actionTitle}</h2>
              <p>{copy.actionIntro}</p>
            </div>
            <div className="match-action__verbs" aria-hidden="true">
              {copy.actionWords.map((word) => <span key={word}>{word}</span>)}
            </div>
          </div>
        </section>

        <section className="match-booking match-reveal" aria-labelledby="booking-title">
          <div className="shell">
            <div className="match-booking__head">
              <p className="match-label match-label--ink">{copy.bookingEyebrow}</p>
              <h2 id="booking-title">{copy.bookingTitle}</h2>
              <p>{copy.bookingIntro}</p>
            </div>
            <ol className="match-booking__steps">
              {copy.bookingSteps.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </li>
              ))}
            </ol>
            <Link className="match-button match-button--ink" href="/book">
              <span>{copy.primaryAction}</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </section>

        <section className="match-team" aria-labelledby="team-title">
          <div className="match-team__media match-cut-media">
            <Image src="/images/venue/home-community.webp" alt="A community football match at the ArmourX Sports ground" fill sizes="(max-width: 767px) 100vw, 58vw" />
          </div>
          <div className="shell match-team__layout match-reveal">
            <div>
              <p className="match-label">{copy.teamEyebrow}</p>
              <h2 id="team-title">{copy.teamTitle}</h2>
              <p>{copy.teamIntro}</p>
            </div>
            <ul aria-label={copy.teamTitle}>
              {copy.audiences.map((audience) => <li key={audience}>{audience}</li>)}
            </ul>
          </div>
        </section>

        <section className="match-location match-reveal" id="venue" aria-labelledby="location-title">
          <div className="shell match-location__layout">
            <div>
              <p className="match-label match-label--ink">{copy.locationEyebrow}</p>
              <h2 id="location-title">{copy.locationTitle}</h2>
              <p>{copy.locationIntro}</p>
              <a className="match-button match-button--ink" href="https://maps.google.com/?q=1.3940655,103.6340126" target="_blank" rel="noreferrer">
                <PinIcon />
                <span>{copy.directions}</span>
                <ArrowUpRightIcon />
              </a>
            </div>
            <div className="match-location__map"><VenueMap /></div>
          </div>
        </section>

        <section className="match-faq match-reveal" id="faq" aria-labelledby="faq-title">
          <div className="shell match-faq__layout">
            <div>
              <p className="match-label">{copy.faqEyebrow}</p>
              <h2 id="faq-title">{copy.faqTitle}</h2>
              <p>{copy.faqIntro}</p>
            </div>
            <div className="match-faq__list">
              {copy.faqFallback.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>{faq.question}<span aria-hidden="true" /></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="match-final" aria-labelledby="final-title">
          <div className="shell match-final__layout match-reveal">
            <p className="match-label">{copy.finalEyebrow}</p>
            <h2 id="final-title">{copy.finalTitle}</h2>
            <p>{copy.finalIntro}</p>
            <Link className="match-button match-button--bright" href="/book">
              <span>{copy.primaryAction}</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </section>
      </div>
    </MarketingMotion>
  );
}
