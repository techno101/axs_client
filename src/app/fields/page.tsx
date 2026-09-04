import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PaymentBadges } from "@/components/ui/payment-badges";
import { formatTimePair12 } from "@/lib/format";

export const metadata: Metadata = {
  title: "The Pitches & Venue",
  description: "Two tournament-grade 11-a-side football pitches at ArmourX Sports, Sunway Iskandar Puteri, Johor. All-weather 3G turf, pro LED floodlights, and 6-hour exclusive sessions.",
};

export const dynamic = "force-dynamic";

export default function FieldsPage() {
  const sessions = [
    {
      code: "MORNING",
      label: "Morning Session",
      hours: formatTimePair12("09:00", "15:00"),
      duration: "6 Hours",
      price: "RM 600",
      description: "Full daylight football. Ideal for club friendlies, weekend leagues, and academy tournaments.",
    },
    {
      code: "EVENING",
      label: "Evening & Night Session",
      hours: formatTimePair12("15:00", "21:00"),
      duration: "6 Hours",
      price: "RM 800",
      description: "Extends from late afternoon through golden hour and under the pro match floodlights.",
    },
  ];

  const pitchSpecs = [
    {
      title: "FIFA-Standard Dimensions",
      detail: "Full 11-a-side regulation match layout with precision touchlines, penalty areas, center circle, and generous safety run-off perimeters.",
    },
    {
      title: "Pro 3G All-Weather Turf",
      detail: "High-density resilient monofilament blades with shock-absorbing performance infill for natural ball roll, consistent bounce, and player joint safety.",
    },
    {
      title: "High-Lux LED Floodlights",
      detail: "Evenly distributed high-power mast illumination delivering crisp, shadow-reduced visibility for competitive night kickoffs.",
    },
    {
      title: "Rapid Tropical Drainage",
      detail: "Sub-surface engineered drainage designed to clear tropical Johor downpours within minutes—no waterlogged patches or cancelled sessions.",
    },
  ];

  const amenities = [
    { label: "Covered Player Dugouts", note: "Dedicated team benches for squads and coaching staff." },
    { label: "Changing & Shower Facilities", note: "Clean, private amenities for home and visiting teams." },
    { label: "Spectator Viewing Perimeter", note: "Raised touchline vantage points for supporters and guests." },
    { label: "Secure Drive-In Parking", note: "Spacious on-site parking directly adjacent to the pitches." },
  ];

  return (
    <div className="fields-experience">
      {/* Stadium Aerial Hero */}
      <section className="fields-hero">
        <div className="shell fields-hero__inner">
          <div className="fields-hero__copy">
            <span className="fields-eyebrow">The ArmourX Pitch Complex</span>
            <h1 className="fields-hero__title">Two Tournament Pitches.<br />One Premier Venue.</h1>
            <p className="fields-hero__intro">
              Located in Sunway Iskandar Puteri, Johor. Two identical, full-size 11-a-side artificial turf pitches engineered for serious match play, floodlit for night kickoffs, and reserved exclusively for your squad.
            </p>
            <div className="fields-hero__actions">
              <ButtonLink href="/book" variant="lime">Book your pitch</ButtonLink>
              <a className="fields-hero__secondary" href="#venue-specs">
                <span>Explore pitch specifications</span>
                <ArrowRightIcon />
              </a>
            </div>
          </div>

          <div className="fields-hero__media">
            <div className="fields-hero__frame">
              <Image
                src="/images/venue/proper-perpendicular-aerial.jpg"
                alt="Direct perpendicular aerial view of the ArmourX Sports football pitch complex in Iskandar Puteri"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 55vw"
                quality={92}
              />
              <div className="fields-hero__badge">
                <b>2 Full-Size Pitches</b>
                <span>Sunway Iskandar Puteri</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pitch Specs & Engineering */}
      <section className="fields-specs" id="venue-specs">
        <div className="shell">
          <div className="fields-specs__head">
            <span className="fields-eyebrow">Matchday Architecture</span>
            <h2>Engineered for 90 Minutes of Pure Football.</h2>
            <p>
              Both pitches at ArmourX Sports are built to the exact same high-level standard. You never need to worry about which pitch you get—both offer identical tournament-grade surfaces, lighting, and dimensions.
            </p>
          </div>

          <div className="fields-specs__grid">
            {pitchSpecs.map((spec) => (
              <article className="fields-spec-card" key={spec.title}>
                <div className="fields-spec-card__marker" aria-hidden="true" />
                <h3>{spec.title}</h3>
                <p>{spec.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Session Structure */}
      <section className="fields-sessions">
        <div className="shell">
          <div className="fields-sessions__head">
            <span className="fields-eyebrow">Exclusive Booking Structure</span>
            <h2>Six Full Hours. The Whole Pitch is Yours.</h2>
            <p>
              No pitch sharing. No time splitting. Every ArmourX booking gives your group 6 dedicated hours to warm up, run tactical drills, play competitive matches, and host presentations without feeling rushed.
            </p>
          </div>

          <div className="fields-sessions__cards">
            {sessions.map((session) => (
              <div className="fields-session-card" key={session.code}>
                <div className="fields-session-card__head">
                  <span className="fields-session-card__tag">{session.duration}</span>
                  <h3>{session.label}</h3>
                  <strong className="fields-session-card__hours">{session.hours}</strong>
                </div>
                <p className="fields-session-card__desc">{session.description}</p>
                <div className="fields-session-card__foot">
                  <div className="fields-session-card__price">
                    <span className="fields-session-card__amount">{session.price}</span>
                    <small>per 6-hour session</small>
                  </div>
                  <Link className="fields-session-card__btn" href="/book">
                    <span>Reserve slot</span>
                    <ArrowRightIcon />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Amenities */}
      <section className="fields-amenities">
        <div className="shell">
          <div className="fields-amenities__head">
            <span className="fields-eyebrow">Matchday Experience</span>
            <h2>Complete Venue Amenities</h2>
          </div>

          <div className="fields-amenities__list">
            {amenities.map((item) => (
              <div className="fields-amenity-item" key={item.label}>
                <h4>{item.label}</h4>
                <p>{item.note}</p>
              </div>
            ))}
          </div>

          {/* Payment support strip */}
          <div className="fields-payment-strip">
            <PaymentBadges title="Supported Payment Methods for Online Checkout" />
          </div>

          <div className="fields-cta-banner">
            <div>
              <h3>Ready to lock in your matchday?</h3>
              <p>Check live dates and session availability in real time.</p>
            </div>
            <ButtonLink href="/book" variant="lime">Book your pitch now</ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
