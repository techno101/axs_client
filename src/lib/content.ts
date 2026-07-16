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
    name: "Armour Field One",
    shortName: "Field 01",
    description:
      "Our show field for fast, full-pitch football under a crisp floodlight canopy.",
    surface: "Premium synthetic turf",
    size: "Full field block",
    image: images.nightStadium,
    imageAlt: "Floodlit stadium viewed from above at night",
    features: ["Even lighting", "Team shelters", "Pitch-side access", "On-site parking"],
  },
  {
    id: "FIELD_02",
    slug: "field-two",
    name: "Armour Field Two",
    shortName: "Field 02",
    description:
      "A focused match setting with the same full-block format and easy venue access.",
    surface: "Competition synthetic turf",
    size: "Full field block",
    image: images.aerialPitch,
    imageAlt: "Aerial view of a green football pitch inside a stadium",
    features: ["Full block booking", "Floodlights", "Changing access", "Spectator edge"],
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
      "The booking service creates a 10-minute server-controlled hold before customer details are submitted.",
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
    slug: "build-a-six-hour-match-day",
    category: "Match day",
    title: "Make a six-hour field block feel effortless",
    excerpt:
      "A practical run sheet for warm-up, rotations, hydration and the moments between matches.",
    readTime: "4 min read",
    publishedLabel: "Field notes · 12 July 2026",
    image: images.nightPlayer,
    imageAlt: "Football player on a lit pitch at night",
    body: [
      {
        heading: "Start with the shape of the day",
        paragraphs: [
          "A full block gives teams room to arrive, warm up, play and reset without compressing every decision into an hourly handover.",
          "Share a simple run sheet before players travel: arrival window, warm-up, kick-off order, recovery breaks and the named person responsible for timekeeping.",
        ],
      },
      {
        heading: "Protect the useful minutes",
        paragraphs: [
          "Keep equipment staged, rotate with clear signals and make water accessible away from active touchlines. The best match-day plan is visible enough that nobody needs to ask what happens next.",
        ],
      },
    ],
  },
  {
    slug: "morning-or-evening-block",
    category: "Booking guide",
    title: "Morning or evening: choose the right block",
    excerpt:
      "Two fixed windows, two different rhythms. Compare the practical fit before your team commits.",
    readTime: "3 min read",
    publishedLabel: "Booking guide · 10 July 2026",
    image: images.aerialPitch,
    imageAlt: "Aerial view of a green football pitch",
    body: [
      {
        heading: "Morning, 09:00–15:00",
        paragraphs: [
          "The RM600 morning block suits training days, youth fixtures and groups that want the rest of the evening free.",
        ],
      },
      {
        heading: "Evening, 15:00–21:00",
        paragraphs: [
          "The RM800 evening block carries the session into floodlit play and often fits working teams better. Live checkout always uses the authoritative API amount.",
        ],
      },
    ],
  },
  {
    slug: "captains-booking-checklist",
    category: "Team craft",
    title: "The captain’s pre-booking checklist",
    excerpt:
      "Confirm the date, decision-maker and contact details before the ten-minute hold begins.",
    readTime: "2 min read",
    publishedLabel: "Team craft · 8 July 2026",
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
