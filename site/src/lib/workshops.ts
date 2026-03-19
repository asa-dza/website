const USE_TEST_DATA = true;
export type Lang = "en" | "fr" | "ar";

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
export type WorkshopLanguage = "en" | "fr" | "ar";

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
    registrationUrl?: string;
    featured?: boolean;
    published?: boolean;
};

const TEST_WORKSHOPS: Workshop[] = [
    {
        slug: "ml-foundations",
        areaSlug: "ai",
        t: {
            en: {
                title: "Foundations of Machine Learning",
                summary: "Core concepts and practical intuition.",
                description:
                    "An intensive introduction to supervised learning, model evaluation, and generalization.",
                audienceDescription:
                    "Students and professionals with basic programming knowledge.",
                outcomes: [
                    "Understand key ML concepts",
                    "Train simple models",
                    "Evaluate performance",
                ],
                image: {
                    src: "/assets/images/workshops/ml-foundations-en.png",
                    alt: "Participants attending a machine learning workshop",
                },
                instructors: [
                    {
                        name: "Amina Rahal",
                        honorific: "Dr.",
                        role: "AI Specialist",
                        biography:
                            "Dr. Amina Rahal works on applied artificial intelligence and teaches introductory and intermediate machine learning.",
                        photo: {
                            src: "/assets/images/instructors/amina-rahal.png",
                            alt: "Portrait of Dr. Amina Rahal",
                        },
                    },
                    {
                        name: "Karim Bensaid",
                        honorific: "Dr.",
                        role: "Data Science Lecturer",
                    },
                ],
                venue: "Algiers Center",
            },

            fr: {
                title: "Fondements du Machine Learning",
                summary: "Concepts fondamentaux et intuition pratique.",
                description:
                    "Introduction aux modèles supervisés et à leur évaluation.",
                image: {
                    src: "/assets/images/workshops/ml-foundations-fr.png",
                    alt: "Participants à un atelier de machine learning",
                },
                instructors: [
                    {
                        name: "Amina Rahal",
                        honorific: "Dr",
                        role: "Spécialiste IA",
                        biography:
                            "Dr Amina Rahal travaille sur l’intelligence artificielle appliquée et enseigne le machine learning.",
                        photo: {
                            src: "/assets/images/instructors/amina-rahal.png",
                            alt: "Portrait de Dr Amina Rahal",
                        },
                    },
                    {
                        name: "Karim Bensaid",
                        honorific: "Dr",
                        role: "Enseignant en science des données",
                    },
                ],
                venue: "Centre d'Alger",
            },

            ar: {
                title: "أساسيات تعلم الآلة",
                summary: "مفاهيم أساسية وفهم عملي.",
                description: "مقدمة في النماذج والإحصاء التطبيقي.",
                image: {
                    src: "/assets/images/workshops/ml-foundations-ar.png",
                    alt: "مشاركون في ورشة حول تعلم الآلة",
                },
                instructors: [
                    {
                        name: "أمينة رحال",
                        honorific: "د.",
                        role: "متخصصة في الذكاء الاصطناعي",
                        biography:
                            "تعمل الدكتورة أمينة رحال في مجال الذكاء الاصطناعي التطبيقي وتدرّس أساسيات تعلم الآلة.",
                        photo: {
                            src: "/assets/images/instructors/amina-rahal.png",
                            alt: "صورة الدكتورة أمينة رحال",
                        },
                    },
                    {
                        name: "كريم بن سعيد",
                        honorific: "د.",
                        role: "محاضر في علم البيانات",
                    },
                ],
                venue: "مركز الجزائر",
            },
        },
        startAt: "2026-10-15T17:00:00",
        endAt: "2026-10-20T20:00:00",
        deliveryFormat: "hybrid",
        registrationStatus: "open",
        deliveryStatus: "scheduled",
        deliveryLanguages: ["en", "fr"],
        registrationUrl: "#",
        featured: true,
        published: true,
    },

    {
        slug: "academic-writing",
        areaSlug: "academic-support",
        t: {
            en: {
                title: "Academic Writing Excellence",
                summary: "Structure, clarity, and rigor in writing.",
                description:
                    "Develop high-quality academic writing skills for reports, theses, and publications.",
                outcomes: [
                    "Structure arguments",
                    "Improve clarity",
                    "Avoid common mistakes",
                ],
                instructors: [
                    {
                        name: "Leila Haddad",
                        honorific: "Dr.",
                        role: "Academic Skills Trainer",
                        biography:
                            "Dr. Leila Haddad supports students and researchers in academic writing, argument development, and document organization.",
                    },
                ],
                venue: "Oran Campus",
            },

            fr: {
                title: "Rédaction Académique",
                summary: "Structure et clarté.",
                description: "Améliorer la qualité des écrits académiques.",
                instructors: [
                    {
                        name: "Leila Haddad",
                        honorific: "Dr",
                        role: "Formatrice en compétences académiques",
                        biography:
                            "Dr Leila Haddad accompagne les étudiants et chercheurs en rédaction académique et en structuration des idées.",
                    },
                ],
                venue: "Campus d'Oran",
            },

            ar: {
                title: "الكتابة الأكاديمية",
                summary: "تنظيم ووضوح.",
                description: "تطوير مهارات الكتابة الأكاديمية.",
                instructors: [
                    {
                        name: "ليلى حداد",
                        honorific: "د.",
                        role: "مدربة مهارات أكاديمية",
                        biography:
                            "تساعد الدكتورة ليلى حداد الطلبة والباحثين على تطوير الكتابة الأكاديمية وبناء الحجج وتنظيم الوثائق.",
                    },
                ],
                venue: "حرم وهران",
            },
        },
        startAt: "2026-11-01T09:00:00",
        deliveryFormat: "in-person",
        registrationStatus: "open",
        deliveryStatus: "scheduled",
        deliveryLanguages: ["ar"],
        registrationUrl: "#",
        published: true,
    },

    {
        slug: "python-data-analysis",
        areaSlug: "programming",
        t: {
            en: {
                title: "Python for Data Analysis",
                summary: "From data to insight using Python.",
                description:
                    "Hands-on workshop covering NumPy, pandas, and visualization.",
                outcomes: [
                    "Manipulate datasets",
                    "Perform analysis",
                    "Visualize results",
                ],
                image: {
                    src: "/assets/images/workshops/python-data-analysis-en.png",
                    alt: "Laptop screen showing Python data analysis work",
                },
                instructors: [
                    {
                        name: "Samir Touati",
                        honorific: "Dr.",
                        photo: {
                            src: "/assets/images/instructors/samir-touati.png",
                            alt: "Portrait of Dr. Samir Touati",
                        },
                    },
                ],
                venue: "Online",
            },

            fr: {
                title: "Python pour l'Analyse de Données",
                summary: "Analyse pratique avec Python.",
                description: "Manipulation et visualisation de données.",
                image: {
                    src: "/assets/images/workshops/python-data-analysis-fr.png",
                    alt: "Ordinateur affichant une analyse de données avec Python",
                },
                instructors: [
                    {
                        name: "Samir Touati",
                        honorific: "Dr",
                        photo: {
                            src: "/assets/images/instructors/samir-touati.png",
                            alt: "Portrait de Dr Samir Touati",
                        },
                    },
                ],
                venue: "En ligne",
            },

            ar: {
                title: "بايثون لتحليل البيانات",
                summary: "تحليل عملي للبيانات.",
                description: "استخدام الأدوات الأساسية للتحليل.",
                image: {
                    src: "/assets/images/workshops/python-data-analysis-ar.png",
                    alt: "حاسوب يعرض عملاً في تحليل البيانات باستخدام بايثون",
                },
                instructors: [
                    {
                        name: "سمير تواتي",
                        honorific: "د.",
                        photo: {
                            src: "/assets/images/instructors/samir-touati.png",
                            alt: "صورة الدكتور سمير تواتي",
                        },
                    },
                ],
                venue: "عن بعد",
            },
        },
        startAt: "2026-12-05T14:00:00",
        deliveryFormat: "online",
        registrationStatus: "closed",
        deliveryStatus: "scheduled",
        deliveryLanguages: ["en"],
        registrationUrl: "#",
        published: true,
    },
];

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