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
  /** Fallback für og:image, wenn eine Seite kein eigenes Bild hat. */
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
  pastTitle: "Bisherige Retreats",
} as const;

export const mailchimp = {
  enable: true,
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

/**
 * Google Tag Manager: wird nur nach Cookie-Zustimmung geladen.
 * Auf `'GTM-MX94S3GK'` setzen, um Analytics (inkl. Cookie-Banner) zu aktivieren.
 */
export const googleTagManagerId: string | null = null;
