export type SiteLocale = "en" | "bm";

type HomeCopy = {
  localeLabel: string;
  languageName: string;
  eyebrow: string;
  heroTitle: [string, string];
  heroIntro: string;
  primaryAction: string;
  secondaryAction: string;
  availabilityLabel: string;
  morning: string;
  evening: string;
  fullSession: string;
  journeyEyebrow: string;
  journeyTitle: string;
  journeyIntro: string;
  daylight: string;
  daylightCopy: string;
  floodlights: string;
  floodlightsCopy: string;
  pricingNote: string;
  fieldsEyebrow: string;
  fieldsTitle: string;
  fieldsIntro: string;
  viewField: string;
  facilitiesEyebrow: string;
  facilitiesTitle: string;
  facilitiesIntro: string;
  facilities: Array<{ title: string; copy: string }>;
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
    eyebrow: "Sunway City · Iskandar Puteri · Johor",
    heroTitle: ["The field", "is yours."],
    heroIntro:
      "Two full-size football fields. Six uninterrupted hours. Choose daylight or play under the floodlights.",
    primaryAction: "Find your session",
    secondaryAction: "Meet the fields",
    availabilityLabel: "Booking opens up to 90 days ahead",
    morning: "Morning",
    evening: "Evening",
    fullSession: "Full field · six hours",
    journeyEyebrow: "One day. Two ways to play.",
    journeyTitle: "From daylight to floodlights.",
    journeyIntro:
      "The price changes with the light, not the size of your squad. Every booking gives your group the entire field for the full session.",
    daylight: "Own the morning",
    daylightCopy: "09:00–15:00 · clear daylight and a full six-hour run.",
    floodlights: "Take the evening",
    floodlightsCopy: "15:00–21:00 · the same full field under LED floodlights.",
    pricingNote: "No per-player fees. No add-ons at checkout.",
    fieldsEyebrow: "Twin fields",
    fieldsTitle: "Pick your side.",
    fieldsIntro:
      "Field 1 and Field 2 share the same venue, facilities and pricing. Choose either one—or bring enough players for both.",
    viewField: "View field",
    facilitiesEyebrow: "Included with every booking",
    facilitiesTitle: "Arrive ready. Leave refreshed.",
    facilitiesIntro: "Everything your group needs sits beside the touchline.",
    facilities: [
      { title: "Parking on-site", copy: "Park beside the venue and get the team moving." },
      { title: "Changing rooms", copy: "Changing rooms, showers and toilets are available on-site." },
      { title: "LED floodlights", copy: "Evening sessions stay bright from kickoff to full time." },
      { title: "Seating and drinks", copy: "Benches, water and refreshments are ready for players and supporters." },
    ],
    locationEyebrow: "Your next game starts here",
    locationTitle: "Sunway City, Iskandar Puteri.",
    locationIntro:
      "LOT 165132, Persiaran Medini 3, Sunway City, 79250 Iskandar Puteri, Johor Darul Ta'zim.",
    directions: "Get directions",
    faqEyebrow: "Before kickoff",
    faqTitle: "The useful answers.",
    faqIntro: "Clear information before you choose a field and pay.",
    faqFallback: [
      { question: "Do I book by the hour?", answer: "No. Each booking is one complete six-hour morning or evening session." },
      { question: "Can I book without an account?", answer: "Yes. Guest booking remains available; an account keeps your history and receipts together." },
      { question: "When is my field confirmed?", answer: "Your booking is confirmed after payment is verified. The result page always shows the current status." },
      { question: "Can I book both fields?", answer: "Yes. Add each available field session to your booking before checkout." },
    ],
    finalEyebrow: "Two fields. One decision.",
    finalTitle: "Bring the team.",
    finalIntro: "Choose the date. Choose the light. The field is yours.",
    degraded: "Live availability is taking longer than expected. You can still explore the venue and try booking again shortly.",
  },
  bm: {
    localeLabel: "Bahasa Melayu",
    languageName: "English",
    eyebrow: "Sunway City · Iskandar Puteri · Johor",
    heroTitle: ["Padang ini", "milik anda."],
    heroIntro:
      "Dua padang bola sepak bersaiz penuh. Enam jam tanpa gangguan. Pilih waktu siang atau bermain di bawah lampu limpah.",
    primaryAction: "Cari sesi anda",
    secondaryAction: "Lihat padang",
    availabilityLabel: "Tempahan dibuka sehingga 90 hari lebih awal",
    morning: "Pagi",
    evening: "Petang",
    fullSession: "Seluruh padang · enam jam",
    journeyEyebrow: "Satu hari. Dua cara untuk bermain.",
    journeyTitle: "Dari siang ke lampu limpah.",
    journeyIntro:
      "Harga berubah mengikut waktu, bukan jumlah pemain. Setiap tempahan memberikan seluruh padang kepada kumpulan anda untuk satu sesi penuh.",
    daylight: "Kuasai waktu pagi",
    daylightCopy: "09:00–15:00 · cahaya siang dan enam jam penuh untuk bermain.",
    floodlights: "Ambil sesi petang",
    floodlightsCopy: "15:00–21:00 · padang penuh yang sama di bawah lampu limpah LED.",
    pricingNote: "Tiada caj setiap pemain. Tiada tambahan tersembunyi semasa pembayaran.",
    fieldsEyebrow: "Dua padang",
    fieldsTitle: "Pilih padang anda.",
    fieldsIntro:
      "Padang 1 dan Padang 2 berkongsi lokasi, kemudahan dan harga yang sama. Pilih satu—atau bawa pemain yang cukup untuk kedua-duanya.",
    viewField: "Lihat padang",
    facilitiesEyebrow: "Termasuk dalam setiap tempahan",
    facilitiesTitle: "Datang bersedia. Pulang dengan selesa.",
    facilitiesIntro: "Semua keperluan kumpulan anda tersedia di tepi padang.",
    facilities: [
      { title: "Parkir di lokasi", copy: "Parkir berhampiran venue dan mulakan permainan tanpa berlengah." },
      { title: "Bilik persalinan", copy: "Bilik persalinan, pancuran mandi dan tandas tersedia di lokasi." },
      { title: "Lampu limpah LED", copy: "Sesi petang kekal terang dari sepak mula hingga tamat." },
      { title: "Tempat duduk dan minuman", copy: "Bangku, air dan minuman tersedia untuk pemain serta penyokong." },
    ],
    locationEyebrow: "Perlawanan seterusnya bermula di sini",
    locationTitle: "Sunway City, Iskandar Puteri.",
    locationIntro:
      "LOT 165132, Persiaran Medini 3, Sunway City, 79250 Iskandar Puteri, Johor Darul Ta'zim.",
    directions: "Dapatkan arah",
    faqEyebrow: "Sebelum sepak mula",
    faqTitle: "Jawapan yang anda perlukan.",
    faqIntro: "Maklumat jelas sebelum anda memilih padang dan membuat pembayaran.",
    faqFallback: [
      { question: "Adakah tempahan dibuat mengikut jam?", answer: "Tidak. Setiap tempahan ialah satu sesi pagi atau petang selama enam jam." },
      { question: "Bolehkah saya menempah tanpa akaun?", answer: "Ya. Tempahan tetamu masih tersedia; akaun menyimpan sejarah dan resit anda di satu tempat." },
      { question: "Bilakah padang saya disahkan?", answer: "Tempahan disahkan selepas pembayaran disahkan. Halaman keputusan sentiasa memaparkan status semasa." },
      { question: "Bolehkah saya menempah kedua-dua padang?", answer: "Ya. Tambah setiap sesi padang yang tersedia sebelum pembayaran." },
    ],
    finalEyebrow: "Dua padang. Satu keputusan.",
    finalTitle: "Bawa pasukan anda.",
    finalIntro: "Pilih tarikh. Pilih waktu. Padang ini milik anda.",
    degraded: "Ketersediaan langsung mengambil masa lebih lama. Anda masih boleh melihat venue dan cuba membuat tempahan sebentar lagi.",
  },
};

export const shellCopy: Record<SiteLocale, ShellCopy> = {
  en: {
    navLabel: "Primary navigation",
    menu: "Menu",
    closeMenu: "Close navigation",
    fields: "Fields",
    about: "About",
    notes: "Field notes",
    faq: "FAQ",
    contact: "Contact",
    signIn: "Sign in",
    findBooking: "Find booking",
    book: "Book a field",
    switchLanguage: "View this site in Bahasa Melayu",
    footerIntro: "Two full-size football fields in Sunway City, Iskandar Puteri. Your field, for the full session.",
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
    book: "Tempah padang",
    switchLanguage: "View this site in English",
    footerIntro: "Dua padang bola sepak bersaiz penuh di Sunway City, Iskandar Puteri. Seluruh padang untuk sesi anda.",
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
