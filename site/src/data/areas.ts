import type { ImageMetadata } from "astro";
import academicSupportIcon from "../assets/images/academic-support-icon.png";
import aiIcon from "../assets/images/ai-icon.png";
import dentistryIcon from "../assets/images/dentistry-icon.png";
import medicineIcon from "../assets/images/medicine-icon.png";
import programmingIcon from "../assets/images/programming-icon.png";
import softSkillsIcon from "../assets/images/soft-skills-icon.png";

export type Lang = "en" | "fr" | "ar";

export type AreaTranslation = {
    title: string;
    tagline: string;
    description: string;
    topics: string[];
};

export type Area = {
    slug: string;
    icon: ImageMetadata;
    t: Record<Lang, AreaTranslation>;
};

export const areas: Area[] = [
    {
        slug: "ai",
        icon: aiIcon,
        t: {
            en: {
                title: "Artificial Intelligence",
                tagline: "Shape the future with intelligent systems",
                description:
                    "Our AI program covers machine learning, deep learning, NLP, and computer vision. Students gain hands-on experience building real-world AI solutions across industries.",
                topics: [
                    "Machine Learning",
                    "Deep Learning",
                    "NLP",
                    "Computer Vision",
                    "AI Ethics",
                ],
            },
            fr: {
                title: "Intelligence Artificielle",
                tagline: "Façonnez l'avenir avec des systèmes intelligents",
                description:
                    "Notre programme en IA couvre l'apprentissage automatique, l'apprentissage profond, le TAL et la vision par ordinateur. Les étudiants acquièrent une expérience pratique dans des solutions IA réelles.",
                topics: [
                    "Apprentissage automatique",
                    "Apprentissage profond",
                    "TAL",
                    "Vision par ordinateur",
                    "Éthique de l'IA",
                ],
            },
            ar: {
                title: "الذكاء الاصطناعي",
                tagline: "شكّل المستقبل بالأنظمة الذكية",
                description:
                    "يغطي برنامجنا في الذكاء الاصطناعي التعلم الآلي والتعلم العميق ومعالجة اللغة الطبيعية ورؤية الحاسوب. يكتسب الطلاب خبرة عملية في بناء حلول ذكاء اصطناعي حقيقية.",
                topics: [
                    "التعلم الآلي",
                    "التعلم العميق",
                    "معالجة اللغة الطبيعية",
                    "رؤية الحاسوب",
                    "أخلاقيات الذكاء الاصطناعي",
                ],
            },
        },
    },
    {
        slug: "medicine",
        icon: medicineIcon,
        t: {
            en: {
                title: "Medicine",
                tagline: "Excellence in medical education and practice",
                description:
                    "Comprehensive support for medical students covering anatomy, physiology, pharmacology, and clinical skills to prepare for exams and professional practice.",
                topics: [
                    "Anatomy",
                    "Physiology",
                    "Pharmacology",
                    "Clinical Skills",
                    "Medical Ethics",
                ],
            },
            fr: {
                title: "Médecine",
                tagline:
                    "L'excellence dans la formation et la pratique médicale",
                description:
                    "Un soutien complet pour les étudiants en médecine couvrant l'anatomie, la physiologie, la pharmacologie et les compétences cliniques pour préparer les examens et la pratique professionnelle.",
                topics: [
                    "Anatomie",
                    "Physiologie",
                    "Pharmacologie",
                    "Compétences cliniques",
                    "Éthique médicale",
                ],
            },
            ar: {
                title: "الطب",
                tagline: "التميز في التعليم والممارسة الطبية",
                description:
                    "دعم شامل لطلاب الطب يغطي علم التشريح وعلم وظائف الأعضاء والصيدلة والمهارات السريرية للتحضير للامتحانات والممارسة المهنية.",
                topics: [
                    "علم التشريح",
                    "علم وظائف الأعضاء",
                    "الصيدلة",
                    "المهارات السريرية",
                    "أخلاقيات الطب",
                ],
            },
        },
    },
    {
        slug: "dentistry",
        icon: dentistryIcon,
        t: {
            en: {
                title: "Dentistry",
                tagline: "Building skilled dental professionals",
                description:
                    "From dental anatomy to clinical procedures, we support dentistry students at every stage of their education with expert guidance and practice materials.",
                topics: [
                    "Dental Anatomy",
                    "Oral Pathology",
                    "Prosthodontics",
                    "Orthodontics",
                    "Clinical Practice",
                ],
            },
            fr: {
                title: "Dentisterie",
                tagline:
                    "Former des professionnels dentaires compétents",
                description:
                    "De l'anatomie dentaire aux procédures cliniques, nous accompagnons les étudiants en dentisterie à chaque étape de leur formation avec des conseils d'experts et des supports pratiques.",
                topics: [
                    "Anatomie dentaire",
                    "Pathologie buccale",
                    "Prothèse dentaire",
                    "Orthodontie",
                    "Pratique clinique",
                ],
            },
            ar: {
                title: "طب الأسنان",
                tagline: "تأهيل متخصصين أكفاء في طب الأسنان",
                description:
                    "من تشريح الأسنان إلى الإجراءات السريرية، ندعم طلاب طب الأسنان في كل مرحلة من مراحل تعليمهم بإرشادات متخصصة ومواد تدريبية.",
                topics: [
                    "تشريح الأسنان",
                    "أمراض الفم",
                    "تركيبات الأسنان",
                    "تقويم الأسنان",
                    "الممارسة السريرية",
                ],
            },
        },
    },
    {
        slug: "programming",
        icon: programmingIcon,
        t: {
            en: {
                title: "Programming",
                tagline: "Code your way to a better future",
                description:
                    "Learn modern programming from fundamentals to advanced concepts. We cover web development, software engineering, data structures, and more.",
                topics: [
                    "Web Development",
                    "Data Structures",
                    "Algorithms",
                    "Software Engineering",
                    "Databases",
                ],
            },
            fr: {
                title: "Programmation",
                tagline:
                    "Codez votre chemin vers un avenir meilleur",
                description:
                    "Apprenez la programmation moderne des fondamentaux aux concepts avancés. Nous couvrons le développement web, le génie logiciel, les structures de données et plus encore.",
                topics: [
                    "Développement web",
                    "Structures de données",
                    "Algorithmes",
                    "Génie logiciel",
                    "Bases de données",
                ],
            },
            ar: {
                title: "البرمجة",
                tagline:
                    "افتح طريقك نحو مستقبل أفضل بالكود",
                description:
                    "تعلّم البرمجة الحديثة من الأساسيات إلى المفاهيم المتقدمة. نغطي تطوير الويب وهندسة البرمجيات وهياكل البيانات والمزيد.",
                topics: [
                    "تطوير الويب",
                    "هياكل البيانات",
                    "الخوارزميات",
                    "هندسة البرمجيات",
                    "قواعد البيانات",
                ],
            },
        },
    },
    {
        slug: "academic-support",
        icon: academicSupportIcon,
        t: {
            en: {
                title: "Academic Support",
                tagline: "Achieve your full academic potential",
                description:
                    "Personalized tutoring and study strategies across all university disciplines. We help students overcome challenges and excel in their coursework.",
                topics: [
                    "Study Skills",
                    "Exam Preparation",
                    "Research Methods",
                    "Essay Writing",
                    "Time Management",
                ],
            },
            fr: {
                title: "Soutien Académique",
                tagline:
                    "Atteignez votre plein potentiel académique",
                description:
                    "Tutorat personnalisé et stratégies d'étude dans toutes les disciplines universitaires. Nous aidons les étudiants à surmonter les difficultés et à exceller dans leurs cours.",
                topics: [
                    "Méthodes de travail",
                    "Préparation aux examens",
                    "Méthodes de recherche",
                    "Rédaction",
                    "Gestion du temps",
                ],
            },
            ar: {
                title: "الدعم الأكاديمي",
                tagline: "حقّق كامل إمكاناتك الأكاديمية",
                description:
                    "دروس خصوصية مخصصة واستراتيجيات دراسية في جميع التخصصات الجامعية. نساعد الطلاب على تجاوز الصعوبات والتفوق في مقرراتهم.",
                topics: [
                    "مهارات الدراسة",
                    "التحضير للامتحانات",
                    "مناهج البحث",
                    "كتابة المقالات",
                    "إدارة الوقت",
                ],
            },
        },
    },
    {
        slug: "soft-skills",
        icon: softSkillsIcon,
        t: {
            en: {
                title: "Soft Skills",
                tagline: "The skills that set you apart",
                description:
                    "Develop the interpersonal and professional skills essential for career success. From communication to leadership, we prepare you for the real world.",
                topics: [
                    "Communication",
                    "Leadership",
                    "Teamwork",
                    "Public Speaking",
                    "Critical Thinking",
                ],
            },
            fr: {
                title: "Compétences Transversales",
                tagline:
                    "Les compétences qui font la différence",
                description:
                    "Développez les compétences interpersonnelles et professionnelles essentielles à la réussite professionnelle. De la communication au leadership, nous vous préparons au monde réel.",
                topics: [
                    "Communication",
                    "Leadership",
                    "Travail en équipe",
                    "Prise de parole en public",
                    "Pensée critique",
                ],
            },
            ar: {
                title: "المهارات الشخصية",
                tagline:
                    "المهارات التي تميّزك عن الآخرين",
                description:
                    "طوّر المهارات الشخصية والمهنية الضرورية للنجاح الوظيفي. من التواصل إلى القيادة، نعدّك لمواجهة العالم الحقيقي.",
                topics: [
                    "التواصل",
                    "القيادة",
                    "العمل الجماعي",
                    "الخطابة العامة",
                    "التفكير النقدي",
                ],
            },
        },
    },
];

// Helper to get a localized area — use this in your pages
export function getLocalizedArea(area: Area, lang: Lang) {
    return {
        slug: area.slug,
        icon: area.icon,
        ...area.t[lang],
    };
}

// Helper to get all areas localized
export function getLocalizedAreas(lang: Lang) {
    return areas.map(area => getLocalizedArea(area, lang));
}