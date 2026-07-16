import Image from "next/image";
import type { ReactNode } from "react";
import { images } from "@/lib/content";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  image?: string;
  imageAlt?: string;
  compact?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  intro,
  image = images.nightStadium,
  imageAlt = "Floodlit stadium viewed from above at night",
  compact = false,
}: PageHeroProps) {
  return (
    <section className={`page-hero${compact ? " page-hero--compact" : ""}`}>
      <Image className="page-hero__image" src={image} alt={imageAlt} fill priority sizes="100vw" />
      <div className="page-hero__scrim" aria-hidden="true" />
      <div className="pitch-grid" aria-hidden="true" />
      <div className="shell page-hero__content">
        <p className="eyebrow eyebrow--light">
          <span aria-hidden="true" />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}
