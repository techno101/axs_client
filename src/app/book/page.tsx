import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { createServerPublicClient } from "@/lib/api/server-client";
import { blocks as fallbackBlocks, fields as fallbackFields } from "@/lib/content";
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
  let fields = fallbackFields;
  let blocks = fallbackBlocks;
  let availability: Awaited<ReturnType<typeof publicClient.getAvailability>> = [];
  let addons: Awaited<ReturnType<typeof publicClient.getConfig>>["addons"] = [];
  let onlinePayment: Awaited<ReturnType<typeof publicClient.getConfig>>["onlinePayment"] = { enabled: false };
  try {
    const [liveFields, liveConfig, liveAvailability] = await Promise.all([
      publicClient.getFields(),
      publicClient.getConfig(),
      publicClient.getAvailability(initialDate),
    ]);
    fields = liveFields.length ? liveFields : fallbackFields;
    blocks = liveConfig.slots.length ? liveConfig.slots : fallbackBlocks;
    availability = liveAvailability;
    addons = liveConfig.addons;
    onlinePayment = liveConfig.onlinePayment;
  } catch {
    // The booking service is unreachable; keep the page usable with local field and session defaults.
  }

  return (
    <>
      <section className="booking-intro">
        <p className="booking-intro__eyebrow">Book your spot</p>
        <h1>Two pitches. Pick a date, pick a time.</h1>
        <p>Field 1 and Field 2 run the same sessions &mdash; choose either, or both when your group needs the space. Availability is checked live before payment.</p>
      </section>
      <BookingWizard fields={fields} blocks={blocks} availability={availability} addons={addons} onlinePayment={onlinePayment} businessDate={businessDate} initialDate={initialDate} />
    </>
  );
}
