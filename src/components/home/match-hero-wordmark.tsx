"use client";

import Image from "next/image";
import { useState } from "react";
import type { SiteLocale } from "@/lib/site-copy";

export function MatchHeroWordmark({ locale, title }: { locale: SiteLocale; title: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <h1 id="match-hero-title" className={`match-hero__title${failed ? " match-hero__title--fallback" : ""}`} aria-label={title}>
      <span className="match-hero__title-fallback" aria-hidden="true">{title}</span>
      {!failed ? <Image className="match-hero__title-art" src={locale === "bm" ? "/images/matchcut/hero-title-bm.png" : "/images/matchcut/hero-title-en.png"} alt="" fill priority sizes="(max-width: 767px) 92vw, 70vw" onError={() => setFailed(true)} /> : null}
    </h1>
  );
}
