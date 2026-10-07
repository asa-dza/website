/**
 * workshops.ts — the sample workshop records the site renders today.
 *
 * These are invented records, not content: no workshop here has been offered,
 * and the dates are in the future on purpose. They exist so the workshop
 * routes, the cards, the detail pages and the three-language plumbing can be
 * built and looked at before ERPNext is the source of this data.
 *
 * They live under `src/data/fixtures/` rather than in `src/lib/workshops.ts`
 * so that the retrieval layer stays readable: `lib/workshops.ts` is the module
 * pages import, and it is now the types, the labels and the three lookup
 * functions rather than those plus 260 lines of literal records. Nothing here
 * is imported by a page directly; `lib/workshops.ts` is the only reader, and
 * it is what decides whether this data is used at all.
 *
 * `published: false` (or a missing `published`) hides a record from every
 * lookup. That filtering is done by the callers in `lib/workshops.ts`, not
 * here, so this file stays a plain list.
 *
 * The `Workshop` type is imported as a type only, so this file's dependency on
 * `lib/workshops.ts` is erased at compile time and there is no import cycle at
 * runtime.
 */
import type { Workshop } from "../../lib/workshops";

export const TEST_WORKSHOPS: Workshop[] = [
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
