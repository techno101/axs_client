import type { AvailabilitySlot, PublicClient } from "@/lib/api/types";
import { articles, blocks, faqs, fields } from "@/lib/content";

const availability: AvailabilitySlot[] = [
  { fieldId: "FIELD_01", blockId: "MORNING", status: "available" },
  {
    fieldId: "FIELD_01",
    blockId: "EVENING",
    status: "held",
    publicMessage: "Temporarily held",
  },
  { fieldId: "FIELD_02", blockId: "MORNING", status: "booked" },
  {
    fieldId: "FIELD_02",
    blockId: "EVENING",
    status: "blocked",
    publicMessage: "Unavailable",
  },
];

const wait = async <T>(value: T): Promise<T> => Promise.resolve(value);

export const mockPublicClient: Pick<PublicClient, "getFields" | "getField" | "getBlocks" | "getAvailability" | "getPaymentResult" | "getArticles" | "getArticle" | "getFaqs"> = {
  getFields: () => wait(fields),
  getField: (slug) => wait(fields.find((field) => field.slug === slug) ?? null),
  getBlocks: () => wait(blocks),
  getAvailability: () => wait(availability),
  getPaymentResult: (reference) =>
    wait({
      reference,
      state: "pending",
      fieldName: "Armour Field One",
      blockLabel: "Morning block · 09:00–15:00",
      bookingDate: "18 July 2026",
      amountMinor: 60000,
      currency: "MYR",
      lastCheckedAt: "Mock adapter · not connected",
    }),
  getArticles: () => wait(articles),
  getArticle: (slug) => wait(articles.find((article) => article.slug === slug) ?? null),
  getFaqs: () => wait(faqs),
};
