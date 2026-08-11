import { HomeExperience } from "@/components/home/home-experience";
import { createServerPublicClient } from "@/lib/api/server-client";
import { blocks as fallbackBlocks, faqs as fallbackFaqs, fields as fallbackFields } from "@/lib/content";
import type { SiteLocale } from "@/lib/site-copy";
import { toMalaysiaDateInput } from "@/lib/format";

function addIsoDays(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export async function HomePage({ locale }: { locale: SiteLocale }) {
  const client = createServerPublicClient();
  const businessDate = toMalaysiaDateInput(new Date());
  const [fieldResult, blockResult, faqResult, summaryResult, configResult] = await Promise.allSettled([
    client.getFields(),
    client.getBlocks(),
    client.getFaqs(),
    client.getAvailabilitySummary(businessDate, addIsoDays(businessDate, 4)),
    client.getSiteConfig("client"),
  ]);

  const degraded = [fieldResult, blockResult, faqResult].some((result) => result.status === "rejected");

  return (
    <HomeExperience
      locale={locale}
      fields={fieldResult.status === "fulfilled" && fieldResult.value.length ? fieldResult.value : fallbackFields}
      blocks={blockResult.status === "fulfilled" && blockResult.value.length ? blockResult.value : fallbackBlocks}
      faqs={faqResult.status === "fulfilled" && faqResult.value.length ? faqResult.value : fallbackFaqs}
      availability={summaryResult.status === "fulfilled" ? summaryResult.value : []}
      siteConfig={configResult.status === "fulfilled" ? configResult.value : null}
      businessDate={businessDate}
      degraded={degraded}
    />
  );
}
