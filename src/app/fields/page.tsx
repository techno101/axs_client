import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowUpRightIcon, CheckIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { createServerPublicClient } from "@/lib/api/server-client";
import { images } from "@/lib/content";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "The fields",
  description: "Two fields. One venue. Floodlit. Full-size. Compare and book your block.",
};
export const dynamic = "force-dynamic";

export default async function FieldsPage() {
  const publicClient = createServerPublicClient();
  const [fields, blocks] = await Promise.all([
    publicClient.getFields(),
    publicClient.getBlocks(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="The fields"
        title={<>Two fields.<br /><em>One venue.</em></>}
        intro="Floodlit. Full-size. Game-ready. Compare both fields and pick your block."
        image={images.aerialPitch}
        imageAlt="Aerial view of a green football pitch inside a stadium"
      />
      <section className="field-listing-section">
        <div className="shell">
          <SectionHeading
              eyebrow="Field inventory"
              title={<>What&apos;s<br />available.</>}
              intro="Real venue photos on the way. For now, book the field you want — the pitch is the same either way."
          />
          <div className="field-listing">
            {fields.map((field, index) => (
              <article className="field-listing__row" key={field.id}>
                <div className="field-listing__image">
                  <Image src={field.image} alt={field.imageAlt} fill sizes="(max-width: 800px) 100vw, 48vw" />
                  <span>0{index + 1}</span>
                </div>
                <div className="field-listing__copy">
                  <p className="eyebrow"><span aria-hidden="true" />{field.shortName}</p>
                  <h2>{field.name}</h2>
                  <p>{field.description}</p>
                  {field.features.length ? <ul>{field.features.map((feature) => <li key={feature}><CheckIcon />{feature}</li>)}</ul> : <p>Full specs coming soon. Floodlit. Full-size. Game-ready.</p>}
                  <Link href={`/fields/${field.slug}`}>
                    Explore {field.shortName}
                    <ArrowUpRightIcon />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="block-comparison">
        <div className="shell block-comparison__grid">
          <div>
            <p className="eyebrow eyebrow--light"><span aria-hidden="true" />Fixed launch blocks</p>
            <h2>Compare the two<br />booking blocks.</h2>
          </div>
          <div className="block-comparison__rows">
            {blocks.map((block) => (
              <div key={`${block.fieldId}-${block.id}`}>
                <span>{block.label}</span>
                <strong>{block.startsAt}—{block.endsAt}</strong>
                <b>{formatMoney(block.amountMinor)}</b>
              </div>
            ))}
            <ButtonLink href="/book">Check availability</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
