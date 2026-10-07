/**
 * workshops.ts — workshop types, translated labels, and retrieval.
 *
 * This is the module the workshop pages import. It holds the shape of a
 * workshop, the label tables that turn an enum value into words in each
 * language, and the three lookups a page needs: the list, one record by slug,
 * and the slugs `getStaticPaths` builds routes from.
 *
 * The sample records themselves live in `../data/fixtures/workshops.ts`. They
 * were moved out of this file, not changed: this module still decides whether
 * they are used and still does the `published` filtering, so the answers the
 * pages get are the same ones.
 *
 * The lookups are `async` although nothing here awaits. That is deliberate and
 * worth keeping: the eventual source is the integration service over HTTP, and
 * an async signature now means that change does not reach the pages.
 */
import type { Lang } from "../i18n/site.ts";
import { TEST_WORKSHOPS } from "../data/fixtures/workshops";

/**
 * Whether the sample records are served.
 *
 * With this `false` every lookup below answers as though there were no
 * workshops — an empty list, a null record, no slugs — rather than throw. That
 * is the behaviour a real source has to preserve.
 */
const USE_TEST_DATA = true;

/**
 * The site has one definition of its languages, in `i18n/site.ts`. It is
 * re-exported here so a caller that needs the type alongside these functions
 * does not have to reach for a second module, and so this file does not keep a
 * second copy of the same union.
 */
export type { Lang };

export type LocalizedImage = {
    src: string;
    alt?: string;
};

export type WorkshopInstructor = {
    name: string;
    honorific?: string;   // Dr., Prof., Mr., د., etc.
    role?: string;        // AI Specialist, Lecturer, Trainer, etc.
    biography?: string;
    photo?: {
        src: string;
        alt?: string;
    };
};

export type WorkshopTranslation = {
    title: string;
    summary: string;
    description: string;
    audienceDescription?: string;
    outcomes?: string[];
    instructors?: WorkshopInstructor[];
    venue?: string;
    image?: LocalizedImage;
};

export type WorkshopDeliveryFormat = "in-person" | "online" | "hybrid";
export type WorkshopRegistrationStatus = "open" | "full" | "closed";
export type WorkshopDeliveryStatus = "scheduled" | "completed" | "cancelled";
// A workshop is delivered in one or more of the site's own languages, so this
// is that same union rather than a second copy of it. The name is kept
// because it reads correctly at the use site: `deliveryLanguages`.
export type WorkshopLanguage = Lang;

export const workshopDeliveryFormatLabels = {
    en: {
        "in-person": "In Person",
        online: "Online",
        hybrid: "Hybrid",
    },
    fr: {
        "in-person": "En présentiel",
        online: "En ligne",
        hybrid: "Hybride",
    },
    ar: {
        "in-person": "حضوري",
        online: "عن بعد",
        hybrid: "هجينة",
    },
} as const;

export const workshopRegistrationStatusLabels = {
    en: {
        open: "Open",
        full: "Full",
        closed: "Closed",
    },
    fr: {
        open: "Ouvert",
        full: "Complet",
        closed: "Fermé",
    },
    ar: {
        open: "مفتوح",
        full: "ممتلئ",
        closed: "مغلق",
    },
} as const;

export const workshopDeliveryStatusLabels = {
    en: {
        scheduled: "Scheduled",
        completed: "Completed",
        cancelled: "Cancelled",
    },
    fr: {
        scheduled: "Programmé",
        completed: "Terminé",
        cancelled: "Annulé",
    },
    ar: {
        scheduled: "مجدولة",
        completed: "مكتملة",
        cancelled: "ملغاة",
    },
} as const;

export const workshopDeliveryLanguageLabels = {
    en: {
        en: "English",
        fr: "French",
        ar: "Arabic",
    },
    fr: {
        en: "Anglais",
        fr: "Français",
        ar: "Arabe",
    },
    ar: {
        en: "الإنجليزية",
        fr: "الفرنسية",
        ar: "العربية",
    },
} as const;

export function getWorkshopDeliveryFormatLabel(
    lang: Lang,
    value: WorkshopDeliveryFormat,
) {
    return workshopDeliveryFormatLabels[lang][value];
}

export function getWorkshopRegistrationStatusLabel(
    lang: Lang,
    value: WorkshopRegistrationStatus,
) {
    return workshopRegistrationStatusLabels[lang][value];
}

export function getWorkshopDeliveryStatusLabel(
    lang: Lang,
    value: WorkshopDeliveryStatus,
) {
    return workshopDeliveryStatusLabels[lang][value];
}

export function getWorkshopDeliveryLanguageLabel
    (
        lang: Lang,
        value: Lang,
    ) {
    return workshopDeliveryLanguageLabels[lang][value];
}

export type Workshop = {
    slug: string;
    areaSlug: string;
    t: Record<Lang, WorkshopTranslation>;
    startAt: string;        // ISO datetime, e.g. 2026-10-15T17:00:00
    endAt?: string;         // ISO datetime
    deliveryFormat: WorkshopDeliveryFormat;
    registrationStatus: WorkshopRegistrationStatus;
    deliveryStatus: WorkshopDeliveryStatus;
    deliveryLanguages: WorkshopLanguage[];
    /**
     * The registration system's Course Offering code this workshop is sold
     * as. When set, the registration link is this site's own authenticated
     * form for that offering; `registrationUrl` is then unused.
     */
    offeringCode?: string;
    registrationUrl?: string;
    featured?: boolean;
    published?: boolean;
};

export async function getAllWorkshops(): Promise<Workshop[]> {
    if (!USE_TEST_DATA) {
        return [];
    }

    return TEST_WORKSHOPS.filter((w) => w.published);
}

export async function getWorkshopBySlug(slug: string): Promise<Workshop | null> {
    if (!USE_TEST_DATA) {
        return null;
    }

    return TEST_WORKSHOPS.find((w) => w.slug === slug && w.published) ?? null;
}

export async function getWorkshopSlugs(): Promise<string[]> {
    if (!USE_TEST_DATA) {
        return [];
    }

    return TEST_WORKSHOPS.filter((w) => w.published).map((w) => w.slug);
}

/**
 * Where a workshop's "Register" link goes, in one language: this site's own
 * registration form for the offering when a code is known, otherwise the
 * external address the record carries, otherwise nowhere.
 */
export function registrationUrl(workshop: Workshop, lang: Lang): string | undefined {
    if (workshop.offeringCode) {
        return `/${lang}/register/${encodeURIComponent(workshop.offeringCode)}/`;
    }
    return workshop.registrationUrl && workshop.registrationUrl !== "#"
        ? workshop.registrationUrl
        : undefined;
}
