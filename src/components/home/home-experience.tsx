import Image from "next/image";
import Link from "next/link";
import { KickoffTitle } from "@/components/home/kickoff-title";
import { MatchAccordion } from "@/components/home/match-accordion";
import { VenueMap } from "@/components/map/venue-map";
import { CountUp } from "@/components/motion/count-up";
import { MarketingMotion } from "@/components/motion/marketing-motion";
import { Magnetic } from "@/components/motion/magnetic";
import { MatchClock } from "@/components/motion/match-clock";

import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, PinIcon } from "@/components/ui/icons";
import type { AvailabilityDaySummary, BookingBlock, FaqItem, Field, SiteConfigView } from "@/lib/api/types";
import { formatTimePair12 } from "@/lib/format";
import { availabilityDotLevel } from "@/lib/api/types";
import { homeCopy, type SiteLocale } from "@/lib/site-copy";

type Props = {
  locale: SiteLocale;
  fields: Field[];
  blocks: BookingBlock[];
  faqs: FaqItem[];
  availability: AvailabilityDaySummary[];
  siteConfig: SiteConfigView | null;
  businessDate: string;
  degraded: boolean;
};

const heroShots = [
  { src: "/images/matchday/hero/hero-1.webp", alt: "A player about to strike the ball at ArmourX Sports", tilt: -1.6 },
  { src: "/images/matchday/hero/hero-2.webp", alt: "A player leaping to head the ball at ArmourX Sports", tilt: 1.2 },
  { src: "/images/matchday/hero/hero-3.webp", alt: "Shooting the ball at full force at ArmourX Sports", tilt: 1.8 },
  { src: "/images/matchday/hero/hero-4.webp", alt: "A proper match in progress at ArmourX Sports", tilt: -1.2 },
];

const galleryShots = [
  { src: "/images/matchday/gallery/gallery-01.webp", alt: "Two opponents pushing for the ball at ArmourX Sports", caption: "Tussle" },
  { src: "/images/matchday/gallery/gallery-02.webp", alt: "A flying kick surrounded by players at ArmourX Sports", caption: "Full stretch" },
  { src: "/images/matchday/gallery/gallery-03.webp", alt: "A shot about to be blocked at ArmourX Sports", caption: "Stopped?" },
  { src: "/images/matchday/gallery/gallery-04.webp", alt: "A heavy challenge that stays on its feet at ArmourX Sports", caption: "Holding firm" },
  { src: "/images/matchday/gallery/gallery-05.webp", alt: "Taking on and evading two defenders at ArmourX Sports", caption: "Past the pair" },
  { src: "/images/matchday/gallery/gallery-06.webp", alt: "Three v three with the referee in frame at ArmourX Sports", caption: "End to end" },
  { src: "/images/matchday/gallery/gallery-07.webp", alt: "A player rushing forward with the ball at ArmourX Sports", caption: "On the break" },
  { src: "/images/matchday/gallery/gallery-08.webp", alt: "Players passing the ball between them at ArmourX Sports", caption: "One touch" },
  { src: "/images/matchday/gallery/gallery-09.webp", alt: "A player tired and tensed after a long spell at ArmourX Sports", caption: "Gassed" },
  { src: "/images/matchday/gallery/gallery-10.webp", alt: "A player walking between the play with a proper pose at ArmourX Sports", caption: "In charge" },
  { src: "/images/matchday/gallery/gallery-11.webp", alt: "Extreme pushing and dribbling in a duel at ArmourX Sports", caption: "No quarter" },
  { src: "/images/matchday/gallery/gallery-12.webp", alt: "Beating the defender's grasp with the ball at ArmourX Sports", caption: "Slipped away" },
  { src: "/images/matchday/gallery/gallery-13.webp", alt: "A player walking with the referee behind at ArmourX Sports", caption: "Walking it off" },
  { src: "/images/matchday/gallery/gallery-14.webp", alt: "A player weighing up the pass at ArmourX Sports", caption: "Picking the pass" },
];

export function HomeExperience({ locale, fields, blocks, faqs, availability, siteConfig, businessDate, degraded }: Props) {
  const copy = homeCopy[locale];
  const bookingDataReady = fields.length > 0 && blocks.length > 0 && faqs.length > 0;
  const summaryByDate = Object.fromEntries(availability.map((day) => [day.date, day]));
  const quickDates = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(`${businessDate}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  });
  const quickDot: Record<string, string> = {
    full: "availability-light--full",
    partial: "availability-light--partial",
    none: "availability-light--none",
    past: "availability-light--past",
  };

  // Builder overrides: configured sections replace the committed defaults.
  const heroSection = siteConfig?.sections.find((section) => section.section === "hero" && section.enabled);
  const heroAssetShots = heroSection?.assets.length
    ? heroSection.assets.map((asset) => ({ src: asset.imageUrl, alt: asset.caption || "ArmourX Sports", tilt: 0 }))
    : heroShots;
  const heroVideoUrl = typeof heroSection?.config.videoUrl === "string" && heroSection.config.videoUrl ? heroSection.config.videoUrl : null;
  const heroIntro = typeof heroSection?.config.heroIntro === "string" && heroSection.config.heroIntro ? heroSection.config.heroIntro : copy.heroIntro;
  const primaryAction = typeof heroSection?.config.primaryAction === "string" && heroSection.config.primaryAction ? heroSection.config.primaryAction : copy.primaryAction;
  const gallerySection = siteConfig?.sections.find((section) => section.section === "gallery" && section.enabled);
  const galleryFrames = gallerySection?.assets.length
    ? gallerySection.assets.map((asset) => ({ src: asset.imageUrl, alt: asset.caption || "ArmourX Sports", caption: asset.caption }))
    : galleryShots;
  const galleryEnabled = gallerySection ? gallerySection.enabled : true;

  return (
    <MarketingMotion>
      <div className="match-home">
        <MatchClock enabled />
        <section className="match-hero match-hero--clean" aria-labelledby="match-hero-title">
          <div className="shell match-hero__layout">
            <div className="match-hero__shots" aria-hidden="true">
              {heroVideoUrl ? (
                <video className="match-hero__video" src={heroVideoUrl} autoPlay muted loop playsInline preload="metadata" />
              ) : (
                heroAssetShots.map((shot, index) => (
                  <figure className="match-hero__shot" style={{ "--shot-tilt": `${shot.tilt}deg` } as React.CSSProperties} key={shot.src}>
                    <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 900px) 12vw, 44vw" priority={index < 2} />
                  </figure>
                ))
              )}

            </div>
            <div className="match-hero__copy">
              <p className="match-label">{copy.eyebrow}</p>
              <KickoffTitle title={copy.heroTitle} />
              <p className="match-hero__intro">{heroIntro}</p>
              <Magnetic>
                <Link className="match-button match-button--bright" href="/book">
                  <span>{primaryAction}</span>
                  <ArrowRightIcon />
                </Link>
              </Magnetic>              <div className="hero-quick" aria-label="Quick booking">
                <p className="hero-quick__label">Check today and the next few days</p>
                <div className="hero-quick__strip">
                  {quickDates.map((date, index) => {
                    const level = availabilityDotLevel(date, summaryByDate[date], businessDate);
                    return (
                      <Link className="hero-quick__day" href={`/book?date=${date}`} key={date}>
                        <i className={`availability-light availability-light--top ${quickDot[level]}`} aria-hidden="true" />
                        <span>{index === 0 ? "Today" : new Intl.DateTimeFormat("en-MY", { weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00.000Z`))}</span>
                        <strong>{new Intl.DateTimeFormat("en-MY", { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00.000Z`))}</strong>
                      </Link>
                    );
                  })}
                </div>
                <p className="hero-quick__legend"><span className="availability-light availability-light--full" /> Open · <span className="availability-light availability-light--partial" /> Filling · <span className="availability-light availability-light--none" /> Full</p>
              </div>
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
            <Image src="/images/venue/field-aerial-landscape.jpg" alt="Aerial landscape view of the ArmourX Sports pitches in Iskandar Puteri" fill priority sizes="100vw" />
          </div>
          <div className="match-pitches__stats" aria-label="Venue at a glance">
            <span className="match-pitches__stat"><CountUp to={2} /><small>full-size pitches</small></span>
            <span className="match-pitches__stat"><CountUp to={6} suffix="hr" /><small>sessions</small></span>
          </div>
          <div className="shell match-pitches__layout">
            <div className="match-pitches__copy">
              <p className="match-label">{copy.eyebrow}</p>
              <h2 id="pitches-title">{copy.groundTitle}</h2>
              <p>{copy.groundIntro}</p>
            </div>
            <Link className="match-button match-button--ink" href="/fields">
              <span>See the pitches</span>
              <ArrowRightIcon />
            </Link>
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
              <Image src="/images/matchday/sessions/session-day.webp" alt="A bright daytime session on the ArmourX Sports pitch" fill sizes="(max-width: 767px) 100vw, 50vw" />
              <span className="match-session-card__wash" aria-hidden="true" />
              <span className="match-session-card__body">
                <small>Morning</small>
                <strong>{formatTimePair12("09:00", "15:00")}</strong>
                <b>RM600</b>
                <i>Book morning <ArrowRightIcon /></i>
              </span>
            </a>
            <a className="match-session-card match-session-card--night" href="/book">
              <Image src="/images/matchday/sessions/session-night.webp" alt="An evening session at dusk at ArmourX Sports" fill sizes="(max-width: 767px) 100vw, 50vw" />
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
              {copy.bookingSteps.map((step, index) => (
                <li key={step.title}>
                  <span className="match-booking__number">0{index + 1}</span>
                  <div className="match-booking__content">
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
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
            <Image src="/images/matchday/team/team-1.webp" alt="Teams and a referee in the middle of a match at the ArmourX Sports venue" fill sizes="(max-width: 767px) 100vw, 44vw" />
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

        {galleryEnabled ? <section className="match-gallery match-reveal" id="gallery" aria-labelledby="gallery-title">
          <div className="shell match-gallery__head">
            <div>
              <p className="match-label match-label--ink">Matchday Gallery</p>
              <h2 id="gallery-title">Football, as it happens.</h2>
            </div>
            <div className="match-gallery__head-side">
              <p>Game Day Vibes | See the pace, the passion, and the pitch in action.</p>
              <div className="match-gallery__nav" aria-label="Gallery carousel controls">
                <button className="match-gallery__nav-btn match-gallery__nav-btn--prev" aria-label="Previous photos" type="button">
                  <ArrowLeftIcon />
                </button>
                <button className="match-gallery__nav-btn match-gallery__nav-btn--next" aria-label="Next photos" type="button">
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
          <div className="match-gallery__viewport">
            <div className="match-gallery__track" tabIndex={0} role="region" aria-label="Matchday gallery — Venue in action">
              {galleryFrames.map((image, index) => (
                <figure className="match-gallery__figure" style={{ "--gallery-i": index % 5 } as React.CSSProperties} key={`${image.src}-${index}`}>
                  <div className="match-gallery__card">
                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 80vw, 400px" quality={90} loading={index > 2 ? "lazy" : undefined} />
                    <span className="match-gallery__sheen" aria-hidden="true" />
                    <span className="match-gallery__badge" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <figcaption><span>{image.caption}</span></figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section> : null}

        <section className="match-location match-reveal" id="venue" aria-labelledby="location-title">
          <div className="shell match-location__layout">
            <div>
              <h2 id="location-title">{copy.locationTitle}</h2>
              <p>{copy.locationIntro}</p>
              <a className="match-button match-button--ink" href="https://maps.app.goo.gl/NAeYpPYdnV4r9wK77" target="_blank" rel="noreferrer">
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
            <MatchAccordion items={faqs.length ? faqs : copy.faqFallback} />
          </div>
        </section>

        <section className="match-final" aria-labelledby="final-title">
          <div className="match-final__media match-cut-media">
            <Image src="/images/matchday/team/team-3.webp" alt="" fill sizes="100vw" />
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
