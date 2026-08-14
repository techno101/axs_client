import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowUpRightIcon, CheckIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { createServerPublicClient } from "@/lib/api/server-client";
import { images } from "@/lib/content";
import { formatMoney, formatTimePair12 } from "@/lib/format";

export const metadata: Metadata = {
  title: "The fields",
  description: "Two full-size football fields at ArmourX Sports, Sunway City. Field 1 and Field 2. Compare and book.",
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
        eyebrow="The pitches"
        title={<>Field&nbsp;1 and<br /><em>Field&nbsp;2.</em></>}
        intro="Two full-size pitches. Same venue. Same pricing. Both floodlit. Book the one you prefer — or both."
        image={images.fieldsHero}
        imageAlt="Aerial view of the two ArmourX Sports pitches in Iskandar Puteri"
      />
      <section className="field-listing-section">
        <div className="shell">
          <SectionHeading
            eyebrow="What is available"
            title={<>Both fields.<br />Full-size.<br />Game-ready.</>}
            intro="Every session is six hours. Morning 9AM–3PM or evening 3PM–9PM. RM 600 or RM 800. The whole field. No sharing. No time-splitting."
          />
          <div className="field-listing">
            {fields.map((field) => (
              <article className="field-listing__row" key={field.id}>
                <div className={`field-listing__image field-listing__image--${field.id.toLowerCase()}`}>
                  <Image src={field.image} alt={field.imageAlt} fill sizes="(max-width: 800px) 100vw, 48vw" />
                </div>
                <div className="field-listing__copy">
                  <p className="eyebrow"><span aria-hidden="true" />{field.shortName}</p>
                  <h2>{field.name}</h2>
                  <p>{field.description}</p>
                  {field.features.length ? <ul>{field.features.map((feature) => <li key={feature}><CheckIcon />{feature}</li>)}</ul> : <p>Full-size. Floodlit. Game-ready.</p>}
                  <Link href={`/fields/${field.slug}`}>
                    {field.shortName} details
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
            <p className="eyebrow eyebrow--light"><span aria-hidden="true" />Daily sessions</p>
            <h2>Morning or evening.<br />Your choice.</h2>
          </div>
          <div className="block-comparison__rows">
            {blocks.map((block) => (
              <div key={`${block.fieldId}-${block.id}`}>
                <span>{block.label}</span>
                <strong>{formatTimePair12(block.startsAt, block.endsAt)}</strong>
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
