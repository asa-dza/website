/**
 * Navigation configuration
 *
 * This module centralizes the definition of the site's main navigation links
 * for all supported languages. Instead of hardcoding navigation items inside
 * the header component, the links are defined here and imported where needed.
 *
 * Rationale:
 * - Keeps navigation structure in a single source of truth.
 * - Simplifies maintenance when links change.
 * - Makes multilingual navigation easier to manage.
 * - Prevents duplication across components and layouts.
 *
 * The `nav` object maps each language code ("ar", "fr", "en") to an array
 * of navigation links. Each link consists of a label (display text) and
 * an href (URL path).
 *
 * Components such as the Header can import this module and select the
 * appropriate navigation list based on the current language.
 */

export type NavLink = {
    label: string;
    href: string;
};

export const nav: Record<"ar" | "fr" | "en", NavLink[]> = {
    ar: [
        { label: "الرئيسية", href: "/ar/" },
        { label: "الورشات", href: "/ar/workshops/" },
        { label: "المجالات", href: "/ar/areas/" },
        { label: "من نحن", href: "/ar/about/" },
        { label: "اتصل بنا", href: "/ar/contact/" },
        { label: "حسابي", href: "/ar/account/" },
    ],
    fr: [
        { label: "Accueil", href: "/fr/" },
        { label: "Ateliers", href: "/fr/workshops/" },
        { label: "Domaines", href: "/fr/areas/" },
        { label: "À propos", href: "/fr/about/" },
        { label: "Contact", href: "/fr/contact/" },
        { label: "Mon compte", href: "/fr/account/" },
    ],
    en: [
        { label: "Home", href: "/en/" },
        { label: "Workshops", href: "/en/workshops/" },
        { label: "Areas", href: "/en/areas/" },
        { label: "About", href: "/en/about/" },
        { label: "Contact", href: "/en/contact/" },
        { label: "Account", href: "/en/account/" },
    ],
};