import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { PageHero } from "@/components/layout/page-hero";
import { createServerPublicClient } from "@/lib/api/server-client";
import { images } from "@/lib/content";
import { toMalaysiaDateInput } from "@/lib/format";

export const metadata: Metadata = {
  title: "Book your spot",
  description: "Choose a date and check current ArmourXSports availability before payment.",
};

export const dynamic = "force-dynamic";

function validBookingDate(value: string, businessDate: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= businessDate && value <= new Date(new Date(`${businessDate}T00:00:00.000Z`).getTime() + 90 * 86_400_000).toISOString().slice(0, 10);
}

export default async function BookPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date: requestedDate } = await searchParams;
  const businessDate = toMalaysiaDateInput(new Date());
  const initial = new Date(`${businessDate}T00:00:00.000Z`);
  initial.setUTCDate(initial.getUTCDate() + 2);
  const initialDate = requestedDate && validBookingDate(requestedDate, businessDate) ? requestedDate : initial.toISOString().slice(0, 10);
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
        eyebrow="Book your spot"
        title={<>Choose your<em>availability.</em></>}
        intro="Choose a date, check the available booking options, and review the details before payment."
        image={images.bookingHero}
        imageAlt="A player preparing to strike the ball at ArmourX Sports"
      />
      <BookingWizard fields={fields} blocks={config.slots} availability={availability} addons={config.addons} onlinePayment={config.onlinePayment} businessDate={businessDate} initialDate={initialDate} />
    </>
  );
}
