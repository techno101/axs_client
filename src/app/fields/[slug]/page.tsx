import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { CheckIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { createServerPublicClient } from "@/lib/api/server-client";
import { formatMoney } from "@/lib/format";

type FieldDetailProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function client() { return createServerPublicClient(); }

export async function generateMetadata({ params }: FieldDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const field = await client().getField(slug);
  return field
    ? { title: field.name, description: field.description }
    : { title: "Field not found" };
}

export default async function FieldDetailPage({ params }: FieldDetailProps) {
  const { slug } = await params;
  const publicClient = client();
  const [field, blocks] = await Promise.all([
    publicClient.getField(slug),
    publicClient.getBlocks(),
  ]);

  if (!field) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${field.shortName} · Full block booking`}
        title={field.name}
        intro={field.description}
        image={field.image}
        imageAlt={field.imageAlt}
      />
      <section className="field-detail-intro">
        <div className="shell field-detail-intro__grid">
          <SectionHeading
            eyebrow="Field information"
            title={<>Current venue<br />details.</>}
            intro="The field name and presentation details come from the live API. Anything not yet verified remains visibly pending."
          />
          <div className="field-fact-grid">
            <div><span>Surface</span><strong>{field.surface}</strong></div>
            {field.facilityFacts.map((fact) => <div key={`${fact.label}-${fact.value}`}><span>{fact.label}</span><strong>{fact.value}</strong></div>)}
            {!field.facilityFacts.length ? <div><span>Facility facts</span><strong>Pending owner confirmation</strong></div> : null}
          </div>
        </div>
      </section>
      <section className="field-detail-media">
        <div className="shell field-detail-media__grid">
          <div className="field-detail-media__image">
            <Image src={field.image} alt={field.imageAlt} fill sizes="(max-width: 800px) 100vw, 60vw" />
          </div>
          <aside>
            <p className="eyebrow"><span aria-hidden="true" />What is included</p>
            {field.features.length ? <ul>{field.features.map((feature) => <li key={feature}><CheckIcon />{feature}</li>)}</ul> : <p>Verified feature details are pending owner confirmation.</p>}
            <p className="field-detail-media__note">Venue features remain owner-controlled and must be verified before publication.</p>
          </aside>
        </div>
      </section>
      <section className="field-detail-booking">
        <div className="shell field-detail-booking__grid">
          <div>
            <p className="eyebrow eyebrow--light"><span aria-hidden="true" />Book {field.shortName}</p>
            <h2>Choose a complete block.</h2>
          </div>
          <div>
            {blocks.filter((block) => block.fieldId === field.id).map((block) => (
              <div className="field-block-line" key={`${block.fieldId}-${block.id}`}>
                <span>{block.label}</span>
                <strong>{block.startsAt}—{block.endsAt}</strong>
                <b>{formatMoney(block.amountMinor)}</b>
              </div>
            ))}
            <ButtonLink href="/book">Book this field</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
