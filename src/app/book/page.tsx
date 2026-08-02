import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { PageHero } from "@/components/layout/page-hero";
import { createServerPublicClient } from "@/lib/api/server-client";
import { images } from "@/lib/content";
import { toMalaysiaDateInput } from "@/lib/format";

export const metadata: Metadata = {
  title: "Book a field",
  description: "Choose a date, field and complete block using live ArmourXSports availability.",
};

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const businessDate = toMalaysiaDateInput(new Date());
  const initial = new Date(`${businessDate}T00:00:00.000Z`);
  initial.setUTCDate(initial.getUTCDate() + 2);
  const initialDate = initial.toISOString().slice(0, 10);
  const publicClient = createServerPublicClient();
  const [fields, config, availability] = await Promise.all([
    publicClient.getFields(),
    publicClient.getConfig(),
    publicClient.getAvailability(initialDate),
  ]);

  return (
    <>
      <PageHero
        compact
        eyebrow="Book now"
        title={<>Pick your<em>game.</em></>}
        intro="Select a date, choose Field 1 or Field 2, pick morning or evening. Confirmed instantly. RM 600 or RM 800 for six hours."
        image={images.nightPlayer}
        imageAlt="Player on a football pitch under floodlights"
      />
      <BookingWizard fields={fields} blocks={config.slots} availability={availability} onlinePayment={config.onlinePayment} businessDate={businessDate} initialDate={initialDate} />
    </>
  );
}
