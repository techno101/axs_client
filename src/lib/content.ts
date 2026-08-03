import type { Article, BookingBlock, FaqItem, Field } from "@/lib/api/types";

export const images = {
  venueOverview: "/images/venue/venue-overview.webp",
  homeHero: "/images/venue/home-hero.webp",
  aboutHero: "/images/venue/about-hero.webp",
  bookingHero: "/images/venue/booking-hero.webp",
  notesHero: "/images/venue/notes-hero.webp",
  fieldOne: "/images/venue/field-one.webp",
  fieldTwo: "/images/venue/field-two.webp",
  articleBooking: "/images/venue/article-booking.webp",
  articleSessions: "/images/venue/article-sessions.webp",
  articleChecklist: "/images/venue/article-checklist.webp",
} as const;

export const fields: Field[] = [
  {
    id: "FIELD_01",
    slug: "field-one",
    name: "Field 1",
    shortName: "Field 1",
    description: "A bookable football field at the ArmourX Sports ground in Iskandar Puteri.",
    surface: "Football field",
    facilityFacts: [],
    image: images.fieldOne,
    imageAlt: "A match in progress at ArmourX Sports, Iskandar Puteri",
    features: ["Morning session", "Evening session"],
  },
  {
    id: "FIELD_02",
    slug: "field-two",
    name: "Field 2",
    shortName: "Field 2",
    description: "A bookable football field at the ArmourX Sports ground in Iskandar Puteri.",
    surface: "Football field",
    facilityFacts: [],
    image: images.fieldTwo,
    imageAlt: "Players moving the ball at ArmourX Sports, Iskandar Puteri",
    features: ["Morning session", "Evening session"],
  },
];

export const blocks: BookingBlock[] = [
  {
    fieldId: "FIELD_01",
    id: "MORNING",
    label: "Morning session",
    startsAt: "09:00",
    endsAt: "15:00",
    amountMinor: 60000,
    currency: "MYR",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    fieldId: "FIELD_01",
    id: "EVENING",
    label: "Evening session",
    startsAt: "15:00",
    endsAt: "21:00",
    amountMinor: 80000,
    currency: "MYR",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
  },
];

export const faqs: FaqItem[] = [
  {
    question: "Do I book by the hour?",
    answer:
      "No. Bookings use complete six-hour sessions: 09:00–15:00 or 15:00–21:00 for one field.",
  },
  {
    question: "How long is a selected slot held?",
    answer:
      "Your selected field and session are held for ten minutes while you complete the booking details and payment.",
  },
  {
    question: "Can I book without an account?",
    answer:
      "Yes. Guest booking is supported. Your name and phone are required; email and team name are optional.",
  },
  {
    question: "When is an online payment confirmed?",
    answer:
      "After payment is verified. The booking result page shows the current confirmation status.",
  },
  {
    question: "What are the cancellation and refund terms?",
    answer:
      "Contact the ArmourX Sports team with your booking reference. Cancellation and refund requests are assessed manually.",
  },
];

export const articles: Article[] = [
  {
    slug: "how-booking-status-is-verified",
    category: "Booking guide",
    title: "How booking confirmation works",
    excerpt: "What happens between choosing a session and seeing your field confirmed.",
    readTime: "4 min read",
    publishedLabel: "Field notes · 12 July 2026",
    image: images.articleBooking,
    imageAlt: "A player carrying the ball at ArmourX Sports",
    body: [
      {
        heading: "Availability is checked live",
        paragraphs: [
          "The booking page shows the latest field, date and session availability. Your selection is checked again before payment.",
          "A selection is held briefly while checkout is completed. If it expires, return to availability and choose again.",
        ],
      },
      {
        heading: "Payment redirects are not confirmation",
        paragraphs: [
          "The result page checks the payment status for you. A return from the payment page is not confirmation on its own.",
        ],
      },
    ],
  },
  {
    slug: "morning-or-evening-block",
    category: "Booking guide",
    title: "Morning or evening: choose the right block",
    excerpt:
      "Compare the two fixed booking windows and their current prices.",
    readTime: "3 min read",
    publishedLabel: "Booking guide · 10 July 2026",
    image: images.articleSessions,
    imageAlt: "Two players contesting the ball at ArmourX Sports",
    body: [
      {
        heading: "Morning, 09:00–15:00",
        paragraphs: [
          "The morning session runs from 09:00 to 15:00 at RM600.",
        ],
      },
      {
        heading: "Evening, 15:00–21:00",
        paragraphs: [
          "The evening session runs from 15:00 to 21:00 at RM800. The current total is shown again before payment.",
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
    image: images.articleChecklist,
    imageAlt: "A player preparing a pass at ArmourX Sports",
    body: [
      {
        heading: "Prepare before checking out",
        paragraphs: [
          "Agree the preferred field, session and backup date first. Keep the booking contact’s phone and email ready so checkout can be completed without delay.",
        ],
      },
    ],
  },
];
