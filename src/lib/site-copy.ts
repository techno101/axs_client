export type SiteLocale = "en" | "bm";

type HomeCopy = {
  localeLabel: string;
  languageName: string;
  eyebrow: string;
  heroTitle: string;
  heroIntro: string;
  primaryAction: string;
  groundTitle: string;
  groundIntro: string;
  actionTitle: string;
  actionIntro: string;
  bookingTitle: string;
  bookingIntro: string;
  bookingSteps: Array<{ title: string; copy: string }>;
  bookingStatusLive: string;
  bookingStatusFallback: string;
  teamTitle: string;
  teamIntro: string;
  audiences: [string, string, string, string];
  locationTitle: string;
  locationIntro: string;
  directions: string;
  faqTitle: string;
  faqIntro: string;
  faqFallback: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalIntro: string;
  degraded: string;
};

type ShellCopy = {
  navLabel: string;
  menu: string;
  closeMenu: string;
  fields: string;
  about: string;
  notes: string;
  faq: string;
  contact: string;
  signIn: string;
  findBooking: string;
  book: string;
  switchLanguage: string;
  footerIntro: string;
  explore: string;
  support: string;
  policies: string;
  bookingPolicy: string;
  refundPolicy: string;
  privacy: string;
  terms: string;
  location: string;
  currency: string;
  skip: string;
};

export const homeCopy: Record<SiteLocale, HomeCopy> = {
  en: {
    localeLabel: "English",
    languageName: "Bahasa Melayu",
    eyebrow: "Iskandar Puteri, Johor",
    heroTitle: "THE PITCH IS YOURS.",
    heroIntro: "Two full-size pitches in Iskandar Puteri. Pick a day, lock a session, bring your team.",
    primaryAction: "Book your spot",
    groundTitle: "Two pitches. One venue.",
    groundIntro: "Two full-size pitches side by side in Iskandar Puteri. Morning or evening sessions. Book one, or book both when your group needs the space.",
    actionTitle: "Day or night.",
    actionIntro: "Six hours on the pitch, whichever side of the day fits. Morning or evening — book the one your team can make.",
    bookingTitle: "Pick. Book. Play.",
    bookingIntro: "Choose a date, select what is available, and continue to payment.",
    bookingSteps: [
      { title: "Pick a date", copy: "Start with the day your group can make." },
      { title: "Choose availability", copy: "The booking page shows the available pitches and times." },
      { title: "Continue", copy: "Review the booking details before payment." },
    ],
    bookingStatusLive: "Current booking data is connected. Availability and prices are shown in booking.",
    bookingStatusFallback: "Availability and prices are shown in booking.",
    teamTitle: "Bring your team.",
    teamIntro: "Friends. Clubs. Schools. Work teams.",
    audiences: ["Friends", "Clubs", "Schools", "Work teams"],
    locationTitle: "Find the pitch.",
    locationIntro: "LOT 165132, Persiaran Medini 3, Sunway City, 79250 Iskandar Puteri, Johor.",
    directions: "Get directions",
    faqTitle: "Before you book.",
    faqIntro: "Booking, payment and venue answers in one place.",
    faqFallback: [
      { question: "How do I book?", answer: "Choose a date and an available pitch from Book your spot." },
      { question: "Can I book as a guest?", answer: "Yes. Guest booking remains available." },
      { question: "When is a booking confirmed?", answer: "The result page shows the current status after payment is verified." },
      { question: "Where is the venue?", answer: "Use the directions link for the current map pin." },
    ],
    finalTitle: "Book your spot.",
    finalIntro: "Pick the date. Send the link. Get the team together.",
    degraded: "Live booking data is taking longer than expected. You can still open Book your spot and try again shortly.",
  },
  bm: {
    localeLabel: "Bahasa Melayu",
    languageName: "English",
    eyebrow: "Iskandar Puteri, Johor",
    heroTitle: "PADANG INI MILIK ANDA.",
    heroIntro: "Dua padang bersaiz penuh di Iskandar Puteri. Pilih hari, kunci sesi, bawa pasukan anda.",
    primaryAction: "Tempah slot anda",
    groundTitle: "Dua padang. Satu venue.",
    groundIntro: "Dua padang bersaiz penuh bersebelahan di Iskandar Puteri. Sesi pagi atau petang. Tempah satu, atau kedua-duanya jika kumpulan anda perlukan lebih ruang.",
    actionTitle: "Pagi atau malam.",
    actionIntro: "Enam jam di padang, mengikut masa yang sesuai. Pagi atau petang — tempah sesi yang boleh dihadiri pasukan anda.",
    bookingTitle: "Pilih. Tempah. Main.",
    bookingIntro: "Pilih tarikh, pilih slot yang tersedia, dan teruskan ke pembayaran.",
    bookingSteps: [
      { title: "Pilih tarikh", copy: "Mulakan dengan hari yang sesuai untuk kumpulan anda." },
      { title: "Pilih ketersediaan", copy: "Halaman tempahan memaparkan padang dan masa yang tersedia." },
      { title: "Teruskan", copy: "Semak butiran tempahan sebelum pembayaran." },
    ],
    bookingStatusLive: "Data tempahan semasa disambungkan. Ketersediaan dan harga dipaparkan dalam tempahan.",
    bookingStatusFallback: "Ketersediaan dan harga dipaparkan dalam tempahan.",
    teamTitle: "Bawa pasukan anda.",
    teamIntro: "Rakan. Kelab. Sekolah. Pasukan kerja.",
    audiences: ["Rakan", "Kelab", "Sekolah", "Pasukan kerja"],
    locationTitle: "Cari padang.",
    locationIntro: "LOT 165132, Persiaran Medini 3, Sunway City, 79250 Iskandar Puteri, Johor.",
    directions: "Dapatkan arah",
    faqTitle: "Sebelum anda menempah.",
    faqIntro: "Jawapan tempahan, pembayaran dan venue di satu tempat.",
    faqFallback: [
      { question: "Bagaimana saya menempah?", answer: "Pilih tarikh dan padang yang tersedia melalui Tempah slot anda." },
      { question: "Bolehkah saya menempah sebagai tetamu?", answer: "Ya. Tempahan tetamu masih tersedia." },
      { question: "Bilakah tempahan disahkan?", answer: "Halaman keputusan memaparkan status semasa selepas pembayaran disahkan." },
      { question: "Di mana lokasi padang?", answer: "Gunakan pautan arah untuk pin peta semasa." },
    ],
    finalTitle: "Tempah slot anda.",
    finalIntro: "Pilih tarikh. Kongsi pautan. Kumpulkan pasukan.",
    degraded: "Data tempahan langsung mengambil masa lebih lama. Anda masih boleh membuka Tempah slot anda dan cuba lagi sebentar lagi.",
  },
};

export const shellCopy: Record<SiteLocale, ShellCopy> = {
  en: {
    navLabel: "Primary navigation",
    menu: "Menu",
    closeMenu: "Close navigation",
    fields: "Pitches",
    about: "About",
    notes: "Field notes",
    faq: "FAQ",
    contact: "Contact",
    signIn: "Sign in",
    findBooking: "Find booking",
    book: "Book your spot",
    switchLanguage: "View this site in Bahasa Melayu",
    footerIntro: "Football at ArmourX Sports in Iskandar Puteri. Check availability and book online.",
    explore: "Explore",
    support: "Support",
    policies: "Policies",
    bookingPolicy: "Booking policy",
    refundPolicy: "Refund policy",
    privacy: "Privacy",
    terms: "Terms",
    location: "Iskandar Puteri, Johor",
    currency: "Asia/Kuala_Lumpur · MYR",
    skip: "Skip to main content",
  },
  bm: {
    navLabel: "Navigasi utama",
    menu: "Menu",
    closeMenu: "Tutup navigasi",
    fields: "Padang",
    about: "Tentang kami",
    notes: "Catatan padang",
    faq: "Soalan lazim",
    contact: "Hubungi",
    signIn: "Log masuk",
    findBooking: "Cari tempahan",
    book: "Tempah slot anda",
    switchLanguage: "View this site in English",
    footerIntro: "Bola sepak di ArmourX Sports, Iskandar Puteri. Semak ketersediaan dan tempah dalam talian.",
    explore: "Terokai",
    support: "Bantuan",
    policies: "Polisi",
    bookingPolicy: "Polisi tempahan",
    refundPolicy: "Polisi bayaran balik",
    privacy: "Privasi",
    terms: "Terma",
    location: "Iskandar Puteri, Johor",
    currency: "Asia/Kuala_Lumpur · MYR",
    skip: "Langkau ke kandungan utama",
  },
};

export function localeFromPath(pathname: string): SiteLocale {
  return pathname === "/bm" || pathname.startsWith("/bm/") ? "bm" : "en";
}

export function homeHref(locale: SiteLocale) {
  return locale === "bm" ? "/bm" : "/";
}
