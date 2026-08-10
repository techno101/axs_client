import Image from "next/image";
import Link from "next/link";
import { KickoffTitle } from "@/components/home/kickoff-title";
import { MatchAccordion } from "@/components/home/match-accordion";
import { VenueMap } from "@/components/map/venue-map";
import { CountUp } from "@/components/motion/count-up";
import { MarketingMotion } from "@/components/motion/marketing-motion";
import { Magnetic } from "@/components/motion/magnetic";
import { MatchClock } from "@/components/motion/match-clock";
import { ArrowRightIcon, ArrowUpRightIcon, PinIcon } from "@/components/ui/icons";
import type { BookingBlock, FaqItem, Field } from "@/lib/api/types";
import { formatTimePair12 } from "@/lib/format";
import { homeCopy, type SiteLocale } from "@/lib/site-copy";

type Props = {
  locale: SiteLocale;
  fields: Field[];
  blocks: BookingBlock[];
  faqs: FaqItem[];
  degraded: boolean;
};

const heroShots = [
  { src: "/images/venue/field-one.webp", alt: "Field 1 at ArmourX Sports in Iskandar Puteri", tilt: -1.6 },
  { src: "/images/venue/session-day.webp", alt: "A bright daytime session on the ArmourX Sports pitch", tilt: 1.2 },
  { src: "/images/venue/session-night.webp", alt: "An evening session at dusk at ArmourX Sports", tilt: 1.8 },
  { src: "/images/venue/field-two.webp", alt: "Field 2 at ArmourX Sports in Iskandar Puteri", tilt: -1.2 },
];

const galleryShots = [
  { src: "/images/venue/gallery-1.webp", alt: "A player striking the ball with a full swing at ArmourX Sports", caption: "Full swing" },
  { src: "/images/venue/gallery-2.webp", alt: "Two players contesting the ball at ArmourX Sports", caption: "Fifty-fifty" },
  { src: "/images/venue/gallery-3.webp", alt: "A player shielding the ball from a defender at ArmourX Sports", caption: "First touch" },
  { src: "/images/venue/gallery-4.webp", alt: "A player dribbling past a defender at ArmourX Sports", caption: "Past the man" },
  { src: "/images/venue/gallery-5.webp", alt: "A player evading two opponents at ArmourX Sports", caption: "Two beaten" },
  { src: "/images/venue/gallery-6.webp", alt: "A close challenge between two players at ArmourX Sports", caption: "No give" },
  { src: "/images/venue/opening-a.webp", alt: "The ArmourX Sports pitch ready for kick-off", caption: "Kick-off" },
  { src: "/images/venue/opening-b.webp", alt: "Players warming up on the ArmourX Sports pitch", caption: "Warm-up" },
  { src: "/images/venue/opening-c.webp", alt: "A match in motion at ArmourX Sports", caption: "In motion" },
  { src: "/images/venue/pitches-aerial.webp", alt: "Aerial view of the two ArmourX Sports pitches", caption: "The venue" },
  { src: "/images/venue/field-one.webp", alt: "Field 1 with players in the middle third", caption: "Field 1" },
  { src: "/images/venue/field-two.webp", alt: "Field 2 with a match in progress", caption: "Field 2" },
  { src: "/images/venue/contact-photo.webp", alt: "A player preparing to strike the ball at ArmourX Sports", caption: "Ready" },
  { src: "/images/venue/home-community.webp", alt: "Teams and a referee in the middle of a match at the ArmourX Sports venue", caption: "The team" },
  { src: "/images/venue/session-day.webp", alt: "A bright daytime session on the ArmourX Sports pitch", caption: "Morning" },
  { src: "/images/venue/session-night.webp", alt: "An evening session at dusk at ArmourX Sports", caption: "Night" },
];

export function HomeExperience({ locale, fields, blocks, faqs, degraded }: Props) {
  const copy = homeCopy[locale];
  const bookingDataReady = fields.length > 0 && blocks.length > 0 && faqs.length > 0;

  return (
    <MarketingMotion>
      <div className="match-home">
        <MatchClock enabled />
        <section className="match-hero match-hero--clean" aria-labelledby="match-hero-title">
          <div className="shell match-hero__layout">
            <div className="match-hero__shots" aria-hidden="true">
              {heroShots.map((shot, index) => (
                <figure className="match-hero__shot" style={{ "--shot-tilt": `${shot.tilt}deg` } as React.CSSProperties} key={shot.src}>
                  <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 900px) 12vw, 44vw" priority={index < 2} />
                </figure>
              ))}
            </div>
            <div className="match-hero__copy">
              <p className="match-label">{copy.eyebrow}</p>
              <KickoffTitle title={copy.heroTitle} />
              <p className="match-hero__intro">{copy.heroIntro}</p>
              <Magnetic>
                <Link className="match-button match-button--bright" href="/book">
                  <span>{copy.primaryAction}</span>
                  <ArrowRightIcon />
                </Link>
              </Magnetic>
              <ul className="match-hero__chips" aria-label="Sessions">
                <li><span>Morning</span><strong>{formatTimePair12("09:00", "15:00")}</strong></li>
                <li><span>Evening</span><strong>{formatTimePair12("15:00", "21:00")}</strong></li>
                <li><span>Full pitch</span><strong>Six hours</strong></li>
              </ul>
            </div>
            <p className="match-hero__availability" role="status">{bookingDataReady ? copy.bookingStatusLive : copy.bookingStatusFallback}</p>
          </div>
        </section>

        {degraded ? <div className="shell match-service-note" role="status">{copy.degraded}</div> : null}

        <section className="match-pitches match-reveal" id="pitches" aria-labelledby="pitches-title">
          <div className="match-pitches__media match-cut-media">
            <Image src="/images/venue/pitches-aerial.webp" alt="Aerial view of the two ArmourX Sports pitches in Iskandar Puteri" fill priority sizes="100vw" />
          </div>
          <div className="match-pitches__markers" aria-hidden="true">
            <span className="match-pitches__marker match-pitches__marker--one"><CountUp to={2} label="full-size pitches" /></span>
            <span className="match-pitches__marker match-pitches__marker--two"><CountUp to={6} suffix="hr" label="sessions" /></span>
            <span className="match-pitches__marker match-pitches__marker--three"><CountUp to={90} suffix="d" label="booking window" /></span>
          </div>
          <div className="shell match-pitches__layout">
            <div className="match-pitches__copy">
              <p className="match-label">{copy.eyebrow}</p>
              <h2 id="pitches-title">{copy.groundTitle}</h2>
              <p>{copy.groundIntro}</p>
            </div>
            <Magnetic>
              <Link className="match-button match-button--ink" href="/fields">
                <span>See the pitches</span>
                <ArrowRightIcon />
              </Link>
            </Magnetic>
          </div>
        </section>

        <section className="match-sessions" aria-labelledby="sessions-title">
          <div className="shell match-sessions__head">
            <div>
              <p className="match-label">Morning · Evening</p>
              <h2 id="sessions-title">{copy.actionTitle}</h2>
            </div>
            <p>{copy.actionIntro}</p>
          </div>
          <div className="match-sessions__grid">
            <a className="match-session-card match-session-card--day" href="/book">
              <Image src="/images/venue/session-day.webp" alt="A bright daytime session on the ArmourX Sports pitch" fill sizes="(max-width: 767px) 100vw, 50vw" />
              <span className="match-session-card__wash" aria-hidden="true" />
              <span className="match-session-card__body">
                <small>Morning</small>
                <strong>{formatTimePair12("09:00", "15:00")}</strong>
                <b>RM600</b>
                <i>Book morning <ArrowRightIcon /></i>
              </span>
            </a>
            <a className="match-session-card match-session-card--night" href="/book">
              <Image src="/images/venue/session-night.webp" alt="An evening session at dusk at ArmourX Sports" fill sizes="(max-width: 767px) 100vw, 50vw" />
              <span className="match-session-card__wash" aria-hidden="true" />
              <span className="match-session-card__body">
                <small>Evening</small>
                <strong>{formatTimePair12("15:00", "21:00")}</strong>
                <b>RM800</b>
                <i>Book evening <ArrowRightIcon /></i>
              </span>
            </a>
          </div>
        </section>

        <section className="match-booking match-reveal" aria-labelledby="booking-title">
          <div className="shell">
            <div className="match-booking__head">
              <div>
                <h2 id="booking-title">{copy.bookingTitle}</h2>
                <p>{copy.bookingIntro}</p>
              </div>
            </div>
            <ol className="match-booking__steps">
              {copy.bookingSteps.map((step) => (
                <li key={step.title}>
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
            <Image src="/images/venue/home-community.webp" alt="Teams and a referee in the middle of a match at the ArmourX Sports venue" fill sizes="(max-width: 767px) 100vw, 44vw" />
          </div>
          <div className="match-team__layout match-reveal">
            <div>
              <h2 id="team-title">{copy.teamTitle}</h2>
              <p>{copy.teamIntro}</p>
            </div>
            <ul aria-label={copy.teamTitle}>
              {copy.audiences.map((audience, index) => <li key={audience} style={{ "--audience-i": index } as React.CSSProperties}>{audience}</li>)}
            </ul>
          </div>
        </section>

        <section className="match-gallery match-reveal" aria-labelledby="gallery-title">
          <div className="shell match-gallery__head">
            <div>
              <p className="match-label match-label--ink">Matchday</p>
              <h2 id="gallery-title">Football, as it happens.</h2>
            </div>
            <p>Real sessions at the venue — tackles, headers, sprints and team moments captured on the pitch.</p>
          </div>
          <div className="match-gallery__track" tabIndex={0} role="region" aria-label="Matchday gallery — scrollable">
            {galleryShots.map((image, index) => (
              <figure className="match-gallery__figure" style={{ "--gallery-i": index % 5 } as React.CSSProperties} key={image.src}>
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 62vw, 300px" />
                <figcaption><span>{image.caption}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="match-location match-reveal" id="venue" aria-labelledby="location-title">
          <div className="shell match-location__layout">
            <div>
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
              <h2 id="faq-title">{copy.faqTitle}</h2>
              <p>{copy.faqIntro}</p>
            </div>
            <MatchAccordion items={copy.faqFallback} />
          </div>
        </section>

        <section className="match-final" aria-labelledby="final-title">
          <div className="match-final__media match-cut-media">
            <Image src="/images/venue/home-action.webp" alt="" fill sizes="100vw" />
          </div>
          <div className="match-final__shade" aria-hidden="true" />
          <div className="shell match-final__layout match-reveal">
            <p className="match-label">Full time</p>
            <h2 id="final-title">{copy.finalTitle}</h2>
            <p>{copy.finalIntro}</p>
            <Magnetic>
              <Link className="match-button match-button--bright" href="/book">
                <span>{copy.primaryAction}</span>
                <ArrowRightIcon />
              </Link>
            </Magnetic>
          </div>
        </section>
      </div>
    </MarketingMotion>
  );
}
