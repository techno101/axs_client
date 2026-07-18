import type { Article, BookingBlock, FaqItem, Field } from "@/lib/api/types";

export const images = {
  nightStadium: "/images/demo/night-stadium.jpg",
  aerialPitch: "/images/demo/aerial-pitch.jpg",
  nightPlayer: "/images/demo/night-player.jpg",
  texturedPitch: "/images/demo/textured-pitch.jpg",
} as const;

export const fields: Field[] = [
  {
    id: "FIELD_01",
    slug: "field-one",
    name: "Field 1",
    shortName: "Field 1",
    description:
      "Field details and approved venue specifications are pending owner confirmation.",
    surface: "Venue specification pending",
    facilityFacts: [],
    image: images.nightStadium,
    imageAlt: "Floodlit stadium viewed from above at night",
    features: ["09:00–15:00 block", "15:00–21:00 block", "Venue details pending"],
  },
  {
    id: "FIELD_02",
    slug: "field-two",
    name: "Field 2",
    shortName: "Field 2",
    description:
      "Field details and approved venue specifications are pending owner confirmation.",
    surface: "Venue specification pending",
    facilityFacts: [],
    image: images.aerialPitch,
    imageAlt: "Aerial view of a green football pitch inside a stadium",
    features: ["09:00–15:00 block", "15:00–21:00 block", "Venue details pending"],
  },
];

export const blocks: BookingBlock[] = [
  {
    id: "MORNING",
    label: "Morning block",
    startsAt: "09:00",
    endsAt: "15:00",
    amountMinor: 60000,
    currency: "MYR",
  },
  {
    id: "EVENING",
    label: "Evening block",
    startsAt: "15:00",
    endsAt: "21:00",
    amountMinor: 80000,
    currency: "MYR",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "Do I book by the hour?",
    answer:
      "No. Launch bookings use complete blocks only: 09:00–15:00 or 15:00–21:00 for one field.",
  },
  {
    question: "How long is a selected slot held?",
    answer:
      "When online payment is enabled, the booking service creates a 10-minute server-controlled hold before customer details are submitted. No hold is created while online payment is disabled.",
  },
  {
    question: "Can I book without an account?",
    answer:
      "Yes. Guest booking is supported. Name, phone and email are required for an online booking; team name is optional.",
  },
  {
    question: "When is an online payment confirmed?",
    answer:
      "Only after the backend verifies the payment. A browser redirect never confirms a booking by itself.",
  },
  {
    question: "What are the cancellation and refund terms?",
    answer:
      "Those policies are awaiting owner approval. The published policy pages will show the final approved terms before launch.",
  },
];

export const articles: Article[] = [
  {
    slug: "how-booking-status-is-verified",
    category: "Booking guide",
    title: "How booking status is verified",
    excerpt:
      "Why availability, holds and payment confirmation always come from the ArmourXSports API.",
    readTime: "4 min read",
    publishedLabel: "Field notes · 12 July 2026",
    image: images.nightPlayer,
    imageAlt: "Football player on a lit pitch at night",
    body: [
      {
        heading: "Availability is server-authoritative",
        paragraphs: [
          "The booking page displays the latest field, date and block state returned by the API. A browser cannot reserve inventory without a server-created hold.",
          "A hold expires on the server clock. Refreshing or changing browser state cannot extend it.",
        ],
      },
      {
        heading: "Payment redirects are not confirmation",
        paragraphs: [
          "The result page polls the protected booking status. Only a verified provider callback can move an online booking to confirmed and paid.",
        ],
      },
    ],
  },
  {
    slug: "morning-or-evening-block",
    category: "Booking guide",
    title: "Morning or evening: choose the right block",
    excerpt:
      "Compare the two fixed booking windows and their authoritative prices.",
    readTime: "3 min read",
    publishedLabel: "Booking guide · 10 July 2026",
    image: images.aerialPitch,
    imageAlt: "Aerial view of a green football pitch",
    body: [
      {
        heading: "Morning, 09:00–15:00",
        paragraphs: [
          "The morning block runs from 09:00 to 15:00 and the authoritative launch price is RM600.",
        ],
      },
      {
        heading: "Evening, 15:00–21:00",
        paragraphs: [
          "The evening block runs from 15:00 to 21:00 and the authoritative launch price is RM800. Live checkout always uses the API amount.",
        ],
      },
    ],
  },
  {
    slug: "captains-booking-checklist",
    category: "Booking guide",
    title: "Pre-booking checklist",
    excerpt:
      "Confirm the date, decision-maker and contact details before the ten-minute hold begins.",
    readTime: "2 min read",
    publishedLabel: "Booking guide · 8 July 2026",
    image: images.texturedPitch,
    imageAlt: "Aerial view of a football pitch surrounded by buildings",
    body: [
      {
        heading: "Prepare before checking out",
        paragraphs: [
          "Agree the preferred field, block and backup date first. Keep the booking contact’s phone and email ready so the server-controlled hold is used for confirmation, not coordination.",
        ],
      },
    ],
  },
];
