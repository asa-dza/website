/**
 * site.ts — Site identity configuration
 *
 * Centralized definition of the site's name, localized full name,
 * tagline, and contact information.
 */
export type Lang = "ar" | "fr" | "en";

export const LANGS: readonly Lang[] = ["ar", "fr", "en"];

/** Whether a value names one of the site's languages. */
export function isLang(value: unknown): value is Lang {
  return value === "ar" || value === "fr" || value === "en";
}

export const siteName = "ASA";

export const siteFullName: Record<Lang, string> = {
  ar: "أكاديمية الدراسات المتقدمة",
  fr: "Advanced Studies Academy",
  en: "Advanced Studies Academy",
};

export const siteType: Record<Lang, string> = {
  ar: "مركز التطوير المهني",
  fr: "Centre de développement professionnel",
  en: "Professional Learning Center",
};

export const siteTagline: Record<Lang, string> = {
  ar: "نصوغ العقول ونبني المستقبل",
  fr: "Façonner les esprits, bâtir l'avenir",
  en: "Forging Minds, Engineering Futures",
};

export const siteDescription: Record<Lang, string> = {
  ar: "أكاديمية الدراسات المتقدمة — مركز للتطوير المهني يركز على مجالات مثل تقنيات الذكاء الاصطناعي والعلوم الصحية والبرمجة وتنمية الكفاءات المهنية",
  fr: "Advanced Studies Academy — centre de développement professionnel proposant des ateliers avancés en intelligence artificielle, sciences de la santé, programmation et développement des compétences professionnelles",
  en: "Advanced Studies Academy — professional learning center offering advanced workshops in artificial intelligence, health sciences, programming, and professional skill development",
};

export const siteUrl = "https://asadza.com";

export const siteContact = {
  emails: {
    info: "info@asadza.com",
    admin: "admin@asadza.com",
  },

  phone: {
    ar: "سيُعلن عنه لاحقًا",
    fr: "À venir",
    en: "Coming soon",
  },

  address: {
    ar: "سيُعلن عنه لاحقًا",
    fr: "À venir",
    en: "Coming soon",
  },
};