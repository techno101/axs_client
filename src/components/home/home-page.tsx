import { HomeExperience } from "@/components/home/home-experience";
import { createServerPublicClient } from "@/lib/api/server-client";
import { blocks as fallbackBlocks, faqs as fallbackFaqs, fields as fallbackFields } from "@/lib/content";
import type { SiteLocale } from "@/lib/site-copy";

export async function HomePage({ locale }: { locale: SiteLocale }) {
  const client = createServerPublicClient();
  const [fieldResult, blockResult, faqResult] = await Promise.allSettled([
    client.getFields(),
    client.getBlocks(),
    client.getFaqs(),
  ]);

  const degraded = [fieldResult, blockResult, faqResult].some((result) => result.status === "rejected");

  return (
    <HomeExperience
      locale={locale}
      fields={fieldResult.status === "fulfilled" && fieldResult.value.length ? fieldResult.value : fallbackFields}
      blocks={blockResult.status === "fulfilled" && blockResult.value.length ? blockResult.value : fallbackBlocks}
      faqs={faqResult.status === "fulfilled" && faqResult.value.length ? faqResult.value : fallbackFaqs}
      degraded={degraded}
    />
  );
}
