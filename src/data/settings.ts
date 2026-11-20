/**
 * Zentrale Site-Einstellungen (ehemals Jekyll _data/settings.yml).
 */

export interface MenuItem {
  title: string;
  url?: string;
  submenu?: { title: string; url: string }[];
}

export const site = {
  title: "Retreats in Österreich",
  description:
    "Finde dein nächstes Retreat ganz in deiner Nähe. Unsere Vision ist es Retreats in Österreich leichter auffindbar zu machen und die Retreat-Organisatoren bei der Orga-Arbeit zu unterstützen.",
  /** Fallback og:image for pages without their own image. */
  defaultImage:
    "/images/stockphotos/generic/yogi-pose stephanie-greene-1aB-1s4BIEo-unsplash.jpg",
} as const;

export const author = {
  name: "Hallo, ich bin Lukas.",
  bio: "Mein Ziel ist es, die Retreat-Szene in Österreich besser zu vernetzen und die tollen regionalen Retreats, die wir haben, leichter auffindbar zu machen.",
  avatar: "/images/01-lukas.jpg",
} as const;

export const menu: MenuItem[] = [
  { title: "Retreat-Suchende", url: "/retreats/" },
  { title: "Retreat-Anbieter", url: "/retreat-anbieter/" },
  {
    title: "Über uns",
    submenu: [
      { url: "/philosophie/", title: "Was, wie, warum?" },
      { url: "/ueber-uns/", title: "Wer steckt dahinter" },
      { url: "/team/", title: "Unser Netzwerk" },
    ],
  },
  { title: "Kontakt", url: "/kontakt/" },
];

export const footerMenu: MenuItem[] = [
  { title: "Start", url: "/" },
  { title: "Über uns", url: "/ueber-uns/" },
  { title: "Impressum", url: "/impressum/" },
  { title: "Kontakt", url: "/kontakt/" },
];

export const hero = {
  title:
    "Unsere Vision ist es Retreats in Österreich leichter auffindbar zu machen und Organisatoren bei der Umsetzung zu unterstützen.",
} as const;

export const blog = {
  upcomingTitle: "Bevorstehende Retreats",
  upcomingDescription:
    "Wenn du dir unsicher bist, welches Retreat zu dir passt, melde dich – wir helfen gerne weiter.",
  /** Shown instead of the list when there are no upcoming retreats at all. */
  upcomingEmpty:
    "Neue Termine sind in Planung. Schau gerne bald wieder vorbei.",
  pastTitle: "Bisherige Retreats",
  /** Max. number of featured retreats in the hero (the soonest ones). */
  featuredLimit: 2,
  /** Visible cards before "Mehr laden". */
  upcomingInitial: 6,
  pastInitial: 3,
  /** Cards revealed per click on "Mehr laden". */
  loadMoreStep: 6,
  loadMoreLabel: "Mehr laden",
  /** Status badges on retreat cards. */
  statusPast: "Vergangen",
  statusSoon: "Buchung bald möglich",
  statusWaitlist: "Warteliste",
} as const;

export const mailchimp = {
  /** Newsletter box in the footer (disabled since July 2026). */
  enable: false,
  identifier:
    "retreats-in-oesterreich.us8.list-manage.com/subscribe/post?u=445350db8e4e179a39d000d7b&amp;id=6fa7268942&amp;f_id=008e14e1f0",
  title: "Interesse geweckt?",
  description:
    "Trage dich gerne in unseren E-Mail Verteiler ein. Du hörst ein paar Mal im Jahr von uns, immer wenn es Neuigkeiten gibt.",
  inputText: "Deine E-Mail",
  buttonText: "Abonnieren",
  backgroundImage:
    "/images/stockphotos/generic/yogi-pose stephanie-greene-1aB-1s4BIEo-unsplash.jpg",
} as const;

export const contact = {
  formspree: "https://formspree.io/f/xanepgej",
  email: "retreats.near.you@gmail.com",
} as const;

/** Testimonial slider on retreat pages (`testimonials` in the frontmatter). */
export const testimonials = {
  eyebrow: "Stimmen aus unseren Retreats",
  title: "Was bleibt, wenn der letzte Ton verklingt",
  previousLabel: "Vorheriges Zitat",
  nextLabel: "Nächstes Zitat",
} as const;

/**
 * Booking call-to-action (BookingBlock.astro) for retreats with
 * `booking.url` that are bookable, i.e. show no waitlist.
 */
export const bookingCta = {
  title: "Bereit für deine Auszeit?",
  text: "Die Plätze sind begrenzt – sichere dir jetzt deinen Platz.",
  buttonText: "Jetzt Platz sichern",
} as const;

/**
 * Waitlist (Brevo). Shown automatically on past retreats; on upcoming ones
 * only with `waitlist: true` (fully booked) or `waitlist: soon` (date fixed,
 * booking not open yet) in the frontmatter. `waitlist: false` hides it
 * everywhere.
 */
export const waitlist = {
  /**
   * Action URL of the Brevo form (`https://….sibforms.com/serve/…`).
   * `null` = waitlist disabled.
   */
  brevoFormAction:
    "https://a7352418.sibforms.com/serve/MUIFAC0ZlO7fqkuxXvS7XgDaed0a5BOvjAPBBqVbI6ZSNhYHk_ibpz2zTgErnHh5yboHm0DFBtywXR--MOA4wuybzZKGaMqo2qvHYVFkCHmGE0uh_-ybrfnE-pdqk5E5TJ0PDWPrk_4GGSaByZifSZphG0kditpq8afGOlTLx57N3LiwILPt1LOdfwZ82iRDlFV80lw_WjKvQzNy2g==" as
      string | null,
  /** Page Brevo redirects to after submitting (configure it in Brevo). */
  thankYouUrl: "/warteliste-danke/",
  titlePast: "Termin verpasst? Sei beim nächsten Mal dabei.",
  titleOpen: "Retreat ausgebucht? Komm auf die Warteliste.",
  titleSoon:
    "Du willst unbedingt dabei sein?\nSichere dir einen der ersten Plätze.",
  descriptionPast:
    "Trag dich ein und du hörst von uns, sobald der nächste Termin feststeht – ganz unverbindlich.",
  descriptionOpen:
    "Wird ein Platz frei oder gibt es einen Zusatztermin, erfährst du es als Erste:r.",
  descriptionSoon:
    "Trag dich ein und du erfährst als Erstes, sobald die Buchung startet. Vormerken kostet nichts. Vorfreude auch nicht.",
  buttonText: "Auf die Warteliste",
  consentText:
    "Du bekommst eine Bestätigungs-Mail. Wir schreiben dir nur zu diesem Retreat, Abmeldung jederzeit mit einem Klick. Versand über Brevo (EU).",
};

/**
 * Google Tag Manager: only loaded after cookie consent.
 * Set to `'GTM-MX94S3GK'` to enable analytics (including the cookie banner).
 */
export const googleTagManagerId: string | null = null;
