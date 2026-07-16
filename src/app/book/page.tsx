import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { PageHero } from "@/components/layout/page-hero";
import { configuredApiOrigin, createHttpPublicClient } from "@/lib/api/http-client";
import { images } from "@/lib/content";
import { toMalaysiaDateInput } from "@/lib/format";

export const metadata: Metadata = {
  title: "Book a field",
  description: "Preview the accessible ArmourXSports field booking route.",
};

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const apiOrigin = configuredApiOrigin();
  const businessDate = toMalaysiaDateInput(new Date());
  const initial = new Date(`${businessDate}T00:00:00.000Z`);
  initial.setUTCDate(initial.getUTCDate() + 2);
  const initialDate = initial.toISOString().slice(0, 10);
  const publicClient = createHttpPublicClient(apiOrigin);
  const [fields, blocks, availability] = await Promise.all([
    publicClient.getFields(),
    publicClient.getBlocks(),
    publicClient.getAvailability(initialDate),
  ]);

  return (
    <>
      <PageHero
        compact
        eyebrow="Live booking"
        title={<>Build your<br />match day.</>}
        intro="Choose a date, field and complete block. Availability, price, holds and payment state are confirmed by the ArmourXSports API."
        image={images.nightPlayer}
        imageAlt="Player on a football pitch under floodlights"
      />
      <BookingWizard fields={fields} blocks={blocks} availability={availability} apiOrigin={apiOrigin} businessDate={businessDate} initialDate={initialDate} />
    </>
  );
}
