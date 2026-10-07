/**
 * account.ts — strings for the account page, the registration form and the
 * sign-in states, in the three languages.
 *
 * The wording mirrors the shared branding package's catalogue
 * (`branding/locales/*.yaml`, `account.home.*`): the account service, the
 * learning platform and this website say the same things with the same
 * names. The French and Arabic sentences were written for the lab and await
 * the same editorial review (`branding/REVIEW.md`).
 */
import type { Lang } from "./site.ts";

export type AccountStrings = {
  title: string;
  heading: string;
  intro: string;
  signedInAs: string;
  email: string;
  goToLearning: string;
  changeEmail: string;
  changePassword: string;
  signOut: string;
  browseWorkshops: string;
  signInNeeded: string;
  signIn: string;
  signInDenied: string;
  support: string;
  register: {
    title: string;
    heading: string;
    intro: string;
    offering: string;
    asLearner: string;
    submit: string;
    noteIdentity: string;
    noteNoAccess: string;
    sent: string;
    sentRef: string;
    nextSteps: string;
    errors: Record<
      "identity-refused" | "offering-not-found" | "request-rejected" | "unavailable" | "misconfigured",
      string
    >;
    resendVerification: string;
  };
};

export const accountStrings: Record<Lang, AccountStrings> = {
  en: {
    title: "Your ASA account",
    heading: "Your ASA account",
    intro:
      "This is where you manage your account. Having an account does not by itself mean you are registered for a course.",
    signedInAs: "Signed in as",
    email: "Email address",
    goToLearning: "Go to the learning platform",
    changeEmail: "Change your email address",
    changePassword: "Change your password",
    signOut: "Sign out",
    browseWorkshops: "Browse the workshops",
    signInNeeded: "Sign in with your ASA account to continue.",
    signIn: "Sign in",
    signInDenied: "Sign-in was not completed. You can try again.",
    support: "Need help? Email",
    register: {
      title: "Register for a course",
      heading: "Register for a course",
      intro:
        "Your request will be reviewed by ASA. You will be told the outcome by email; access to the learning platform is granted only once a registration is accepted.",
      offering: "Course offering",
      asLearner: "Registering as",
      submit: "Send my registration request",
      noteIdentity:
        "Your name and email address come from your ASA account. To correct them, contact ASA; you can change your email address yourself from your account.",
      noteNoAccess:
        "Sending a request does not register you and does not open the learning platform.",
      sent: "Your registration request has been received.",
      sentRef: "Reference",
      nextSteps: "ASA will review it and write to you at your account's email address.",
      errors: {
        "identity-refused":
          "Your ASA account cannot submit a registration request yet. Confirm your email address at the account service and try again.",
        "offering-not-found": "This course offering is not available for registration.",
        "request-rejected": "Registration is not open for this course offering.",
        unavailable: "Registration is temporarily unavailable. Please try again in a few minutes.",
        misconfigured: "Registration is unavailable on this site at the moment.",
      },
      resendVerification: "Resend the confirmation email",
    },
  },
  fr: {
    title: "Votre compte ASA",
    heading: "Votre compte ASA",
    intro:
      "C'est ici que vous gérez votre compte. Avoir un compte ne signifie pas, en soi, être inscrit à un cours.",
    signedInAs: "Connecté en tant que",
    email: "Adresse e-mail",
    goToLearning: "Aller à la plateforme d'apprentissage",
    changeEmail: "Changer votre adresse e-mail",
    changePassword: "Changer votre mot de passe",
    signOut: "Se déconnecter",
    browseWorkshops: "Voir les ateliers",
    signInNeeded: "Connectez-vous avec votre compte ASA pour continuer.",
    signIn: "Se connecter",
    signInDenied: "La connexion n'a pas abouti. Vous pouvez réessayer.",
    support: "Besoin d'aide ? Écrivez à",
    register: {
      title: "S'inscrire à un cours",
      heading: "S'inscrire à un cours",
      intro:
        "Votre demande sera examinée par ASA. Vous serez informé du résultat par e-mail ; l'accès à la plateforme d'apprentissage n'est ouvert qu'une fois l'inscription acceptée.",
      offering: "Session de cours",
      asLearner: "Inscription au nom de",
      submit: "Envoyer ma demande d'inscription",
      noteIdentity:
        "Votre nom et votre adresse e-mail proviennent de votre compte ASA. Pour les corriger, contactez ASA ; vous pouvez changer votre adresse e-mail vous-même depuis votre compte.",
      noteNoAccess:
        "Envoyer une demande ne vous inscrit pas et n'ouvre pas la plateforme d'apprentissage.",
      sent: "Votre demande d'inscription a bien été reçue.",
      sentRef: "Référence",
      nextSteps: "ASA l'examinera et vous écrira à l'adresse e-mail de votre compte.",
      errors: {
        "identity-refused":
          "Votre compte ASA ne peut pas encore envoyer de demande d'inscription. Confirmez votre adresse e-mail auprès du service de compte, puis réessayez.",
        "offering-not-found": "Cette session de cours n'est pas ouverte à l'inscription.",
        "request-rejected": "Les inscriptions ne sont pas ouvertes pour cette session.",
        unavailable: "L'inscription est momentanément indisponible. Réessayez dans quelques minutes.",
        misconfigured: "L'inscription n'est pas disponible sur ce site pour le moment.",
      },
      resendVerification: "Renvoyer l'e-mail de confirmation",
    },
  },
  ar: {
    title: "حسابك في ASA",
    heading: "حسابك في ASA",
    intro: "هنا تدير حسابك. امتلاك حساب لا يعني بحد ذاته أنك مسجّل في دورة.",
    signedInAs: "مسجّل الدخول باسم",
    email: "البريد الإلكتروني",
    goToLearning: "الانتقال إلى منصة التعلّم",
    changeEmail: "تغيير بريدك الإلكتروني",
    changePassword: "تغيير كلمة المرور",
    signOut: "تسجيل الخروج",
    browseWorkshops: "تصفّح الورشات",
    signInNeeded: "سجّل الدخول بحساب ASA للمتابعة.",
    signIn: "تسجيل الدخول",
    signInDenied: "لم يكتمل تسجيل الدخول. يمكنك المحاولة مرة أخرى.",
    support: "هل تحتاج إلى مساعدة؟ راسل",
    register: {
      title: "التسجيل في دورة",
      heading: "التسجيل في دورة",
      intro:
        "ستراجع ASA طلبك. ستُبلَّغ بالنتيجة عبر البريد الإلكتروني؛ ولا يُفتح الوصول إلى منصة التعلّم إلا بعد قبول التسجيل.",
      offering: "دورة",
      asLearner: "التسجيل باسم",
      submit: "إرسال طلب التسجيل",
      noteIdentity:
        "اسمك وبريدك الإلكتروني مأخوذان من حسابك في ASA. لتصحيحهما تواصل مع ASA؛ ويمكنك تغيير بريدك الإلكتروني بنفسك من حسابك.",
      noteNoAccess: "إرسال الطلب لا يعني تسجيلك ولا يفتح منصة التعلّم.",
      sent: "تم استلام طلب التسجيل.",
      sentRef: "المرجع",
      nextSteps: "ستراجعه ASA وتراسلك على البريد الإلكتروني المرتبط بحسابك.",
      errors: {
        "identity-refused":
          "لا يمكن لحسابك في ASA إرسال طلب تسجيل بعد. أكّد بريدك الإلكتروني في خدمة الحساب ثم أعد المحاولة.",
        "offering-not-found": "هذه الدورة غير متاحة للتسجيل.",
        "request-rejected": "التسجيل غير مفتوح لهذه الدورة.",
        unavailable: "التسجيل غير متاح مؤقتًا. أعد المحاولة بعد دقائق.",
        misconfigured: "التسجيل غير متاح على هذا الموقع حاليًا.",
      },
      resendVerification: "إعادة إرسال رسالة التأكيد",
    },
  },
};
