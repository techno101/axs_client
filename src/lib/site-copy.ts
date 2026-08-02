export type SiteLocale = "en" | "bm";

type HomeCopy = {
  localeLabel: string;
  languageName: string;
  eyebrow: string;
  heroTitle: string;
  heroIntro: string;
  primaryAction: string;
  groundEyebrow: string;
  groundTitle: string;
  groundIntro: string;
  actionEyebrow: string;
  actionTitle: string;
  actionIntro: string;
  actionWords: [string, string, string, string];
  bookingEyebrow: string;
  bookingTitle: string;
  bookingIntro: string;
  bookingSteps: Array<{ title: string; copy: string }>;
  bookingStatusLive: string;
  bookingStatusFallback: string;
  teamEyebrow: string;
  teamTitle: string;
  teamIntro: string;
  audiences: [string, string, string, string];
  locationEyebrow: string;
  locationTitle: string;
  locationIntro: string;
  directions: string;
  faqEyebrow: string;
  faqTitle: string;
  faqIntro: string;
  faqFallback: Array<{ question: string; answer: string }>;
  finalEyebrow: string;
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
    heroTitle: "BOOK YOUR SPOT.",
    heroIntro: "Football in Iskandar Puteri. Pick a date, choose an available pitch, and book.",
    primaryAction: "Book your spot",
    groundEyebrow: "The ground",
    groundTitle: "THE GROUND.",
    groundIntro: "Two adjacent pitches at one Iskandar Puteri venue. Book one, or check both when your group needs more space.",
    actionEyebrow: "Matchday",
    actionTitle: "GET THE BALL MOVING.",
    actionIntro: "No story to sell. Just the game in front of you.",
    actionWords: ["RUN", "PRESS", "PASS", "SHOOT"],
    bookingEyebrow: "Booking",
    bookingTitle: "PICK. BOOK. PLAY.",
    bookingIntro: "Choose a date, select what is available, and continue to payment.",
    bookingSteps: [
      { title: "Pick a date", copy: "Start with the day your group can make." },
      { title: "Choose availability", copy: "The booking page shows the available pitches and times." },
      { title: "Continue", copy: "Review the booking details before payment." },
    ],
    bookingStatusLive: "Current booking data is connected. Availability and prices are shown in booking.",
    bookingStatusFallback: "Availability and prices are shown in booking.",
    teamEyebrow: "Your people",
    teamTitle: "BRING YOUR TEAM.",
    teamIntro: "Friends. Clubs. Schools. Work teams.",
    audiences: ["Friends", "Clubs", "Schools", "Work teams"],
    locationEyebrow: "Location",
    locationTitle: "FIND THE GROUND.",
    locationIntro: "LOT 165132, Persiaran Medini 3, Sunway City, 79250 Iskandar Puteri, Johor.",
    directions: "Get directions",
    faqEyebrow: "Before you go",
    faqTitle: "KNOW BEFORE YOU GO.",
    faqIntro: "Booking, payment and venue answers in one place.",
    faqFallback: [
      { question: "How do I book?", answer: "Choose a date and an available pitch from Book your spot." },
      { question: "Can I book as a guest?", answer: "Yes. Guest booking remains available." },
      { question: "When is a booking confirmed?", answer: "The result page shows the current status after payment is verified." },
      { question: "Where is the ground?", answer: "Use the directions link for the current map pin." },
    ],
    finalEyebrow: "Ready when you are",
    finalTitle: "BOOK YOUR SPOT.",
    finalIntro: "Pick the date. Send the link. Get the team together.",
    degraded: "Live booking data is taking longer than expected. You can still open Book your spot and try again shortly.",
  },
  bm: {
    localeLabel: "Bahasa Melayu",
    languageName: "English",
    eyebrow: "Iskandar Puteri, Johor",
    heroTitle: "TEMPAH SLOT ANDA.",
    heroIntro: "Bola sepak di Iskandar Puteri. Pilih tarikh, pilih padang yang tersedia, dan tempah.",
    primaryAction: "Tempah slot anda",
    groundEyebrow: "Padang",
    groundTitle: "PADANG.",
    groundIntro: "Dua padang bersebelahan di satu lokasi di Iskandar Puteri. Tempah satu, atau semak kedua-duanya jika kumpulan anda perlukan lebih ruang.",
    actionEyebrow: "Hari perlawanan",
    actionTitle: "MULAKAN PERMAINAN.",
    actionIntro: "Tiada cerita untuk dijual. Hanya permainan di hadapan anda.",
    actionWords: ["LARI", "TEKAN", "HANTAR", "REMBAT"],
    bookingEyebrow: "Tempahan",
    bookingTitle: "PILIH. TEMPAH. MAIN.",
    bookingIntro: "Pilih tarikh, pilih slot yang tersedia, dan teruskan ke pembayaran.",
    bookingSteps: [
      { title: "Pilih tarikh", copy: "Mulakan dengan hari yang sesuai untuk kumpulan anda." },
      { title: "Pilih ketersediaan", copy: "Halaman tempahan memaparkan padang dan masa yang tersedia." },
      { title: "Teruskan", copy: "Semak butiran tempahan sebelum pembayaran." },
    ],
    bookingStatusLive: "Data tempahan semasa disambungkan. Ketersediaan dan harga dipaparkan dalam tempahan.",
    bookingStatusFallback: "Ketersediaan dan harga dipaparkan dalam tempahan.",
    teamEyebrow: "Orang anda",
    teamTitle: "BAWA PASUKAN ANDA.",
    teamIntro: "Rakan. Kelab. Sekolah. Pasukan kerja.",
    audiences: ["Rakan", "Kelab", "Sekolah", "Pasukan kerja"],
    locationEyebrow: "Lokasi",
    locationTitle: "CARI PADANG.",
    locationIntro: "LOT 165132, Persiaran Medini 3, Sunway City, 79250 Iskandar Puteri, Johor.",
    directions: "Dapatkan arah",
    faqEyebrow: "Sebelum anda datang",
    faqTitle: "TAHU SEBELUM ANDA DATANG.",
    faqIntro: "Jawapan tempahan, pembayaran dan venue di satu tempat.",
    faqFallback: [
      { question: "Bagaimana saya menempah?", answer: "Pilih tarikh dan padang yang tersedia melalui Tempah slot anda." },
      { question: "Bolehkah saya menempah sebagai tetamu?", answer: "Ya. Tempahan tetamu masih tersedia." },
      { question: "Bilakah tempahan disahkan?", answer: "Halaman keputusan memaparkan status semasa selepas pembayaran disahkan." },
      { question: "Di mana lokasi padang?", answer: "Gunakan pautan arah untuk pin peta semasa." },
    ],
    finalEyebrow: "Bila-bila anda sedia",
    finalTitle: "TEMPAH SLOT ANDA.",
    finalIntro: "Pilih tarikh. Kongsi pautan. Kumpulkan pasukan.",
    degraded: "Data tempahan langsung mengambil masa lebih lama. Anda masih boleh membuka Tempah slot anda dan cuba lagi sebentar lagi.",
  },
};

export const shellCopy: Record<SiteLocale, ShellCopy> = {
  en: {
    navLabel: "Primary navigation",
    menu: "Menu",
    closeMenu: "Close navigation",
    fields: "Ground",
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
