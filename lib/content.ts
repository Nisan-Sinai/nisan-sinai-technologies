import type { Locale } from "./i18n";

export type Capability = { label: string; value: string };
export type Service = {
  number: string;
  title: string;
  description: string;
  tags: string[];
};
export type ProcessStep = { number: string; title: string; text: string };
export type Project = {
  meta: string;
  year: string;
  title: string;
  description: string;
  points: [string, string, string];
  linkLabel: string;
  href?: string;
  previewLabel: string;
  /** Short strings drawn inside the mock interface, so it reads in-language. */
  preview: { kicker: string; headline: string; cta: string; tags: [string, string, string] };
};
export type AboutValue = { number: string; title: string; text: string };
export type ServiceOption = { value: string; label: string };

export type SiteContent = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    twitterDescription: string;
    keywords: string[];
    ogLocale: string;
  };
  brand: { name: string; suffix: string; homeAria: string; topAria: string };
  skipLink: string;
  nav: {
    aria: string;
    services: string;
    projects: string;
    process: string;
    about: string;
    cta: string;
  };
  languageSwitch: { label: string; toName: string; aria: string };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    proofAria: string;
    proof: [string, string, string];
    visualAria: string;
    coreKicker: string;
    coreTitle: string;
    coreStatus: string;
    signalLabel: string;
    scrollCue: string;
    scrollCueAria: string;
    capabilities: Capability[];
  };
  strip: { aria: string; lead: string; items: string[] };
  services: {
    aria: string;
    kicker: string;
    title: string;
    lead: string;
    tagsAria: (title: string) => string;
    items: Service[];
  };
  projects: {
    kicker: string;
    title: string;
    lead: string;
    items: [Project, Project, Project];
  };
  process: { kicker: string; title: string; lead: string; steps: ProcessStep[] };
  about: {
    kicker: string;
    title: string;
    text: string;
    badge: string;
    values: [AboutValue, AboutValue, AboutValue];
  };
  tech: { aria: string; label: string; items: string[] };
  contact: {
    kicker: string;
    title: string;
    lead: string;
    emailLabel: string;
    phoneLabel: string;
  };
  form: {
    name: string;
    namePlaceholder: string;
    business: string;
    businessPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    service: string;
    servicePlaceholder: string;
    serviceOptions: ServiceOption[];
    message: string;
    messagePlaceholder: string;
    honeypot: string;
    consentBefore: string;
    consentLink: string;
    consentAfter: string;
    submit: string;
    submitting: string;
    success: string;
    errorBefore: string;
    errorAfter: string;
  };
  footer: { tagline: string; email: string; phone: string; privacy: string; rights: string };
  privacy: {
    metaTitle: string;
    metaDescription: string;
    back: string;
    kicker: string;
    title: string;
    updated: string;
    sections: { title: string; body: string }[];
  };
};

const EMAIL = "nisan.sinai5@gmail.com";
const PHONE_DISPLAY = "058-7170978";

const he: SiteContent = {
  meta: {
    title: "ניסן סיני טכנולוגיות | אתרים ומערכות לעסקים",
    description:
      "פיתוח אתרים, מערכות CRM ו-ERP, אוטומציות ופתרונות תוכנה בהתאמה אישית לעסקים.",
    ogTitle: "ניסן סיני טכנולוגיות | אתרים ומערכות לעסקים",
    ogDescription:
      "אתרים, CRM, ERP, אוטומציות ומערכות Web בהתאמה אישית לעסקים קטנים ובינוניים.",
    twitterDescription: "פיתוח דיגיטלי מקצה לקצה לעסקים קטנים ובינוניים.",
    keywords: [
      "פיתוח אתרים",
      "מערכות CRM",
      "מערכות ERP",
      "אוטומציות לעסקים",
      "פיתוח תוכנה",
      "ניסן סיני",
    ],
    ogLocale: "he_IL",
  },
  brand: {
    name: "ניסן סיני",
    suffix: "טכנולוגיות",
    homeAria: "ניסן סיני טכנולוגיות - דף הבית",
    topAria: "חזרה לראש העמוד",
  },
  skipLink: "דילוג לתוכן המרכזי",
  nav: {
    aria: "ניווט ראשי",
    services: "שירותים",
    projects: "פרויקטים",
    process: "איך זה עובד",
    about: "אודות",
    cta: "בואו נדבר",
  },
  languageSwitch: { label: "EN", toName: "English", aria: "Switch to English" },
  hero: {
    eyebrow: "פיתוח דיגיטלי מקצה לקצה לעסקים",
    titleLead: "אני בונה את",
    titleAccent: "הטכנולוגיה",
    titleTail: "שהעסק שלך צריך.",
    lead: "אתרים, מערכות CRM ו־ERP, אוטומציות ופיתוח בהתאמה אישית — מרעיון מדויק למוצר מהיר, נגיש ועובד באמת.",
    primaryCta: "בואו נבנה משהו מעולה",
    secondaryCta: "לפרויקטים שלי",
    proofAria: "הדרך שלי לפרויקט מוצלח",
    proof: ["אפיון מדויק", "פיתוח חכם", "בדיקות והשקה"],
    visualAria: "המחשה של מערכת עסקית מחוברת",
    coreKicker: "CORE",
    coreTitle: "העסק שלך",
    coreStatus: "מערכת פעילה",
    signalLabel: "ביצועים",
    scrollCue: "גלו עוד",
    scrollCueAria: "המשך לשירותים",
    capabilities: [
      { label: "אתרים", value: "Web" },
      { label: "מערכות ניהול", value: "CRM" },
      { label: "תהליכים עסקיים", value: "ERP" },
      { label: "אוטומציות", value: "AUTO" },
    ],
  },
  strip: {
    aria: "השירותים שלי",
    lead: "פתרונות שנבנים סביב העסק שלך",
    items: ["WEB", "CRM", "ERP", "AUTOMATION"],
  },
  services: {
    aria: "השירותים שלי",
    kicker: "מה אני בונה",
    title: "טכנולוגיה שמסדרת את העסק.",
    lead: "כל פתרון מתחיל בבעיה עסקית אמיתית — ורק אחר כך בטכנולוגיה. המטרה היא מערכת ברורה, מהירה ונוחה שהצוות באמת רוצה לעבוד איתה.",
    tagsAria: (title: string) => `תחומים ב${title}`,
    items: [
      {
        number: "01",
        title: "אתרים וחנויות אונליין",
        description:
          "אתרי תדמית, דפי נחיתה וחנויות מהירות שמציגים את העסק נכון והופכים ביקורים לפניות ומכירות.",
        tags: ["UX/UI", "E-commerce", "SEO"],
      },
      {
        number: "02",
        title: "מערכות CRM",
        description:
          "ניהול לקוחות, לידים, משימות ותהליכי מכירה במערכת אחת שמתאימה בדיוק לאופן שבו העסק שלך עובד.",
        tags: ["Leads", "Customers", "Workflows"],
      },
      {
        number: "03",
        title: "מערכות ERP וניהול",
        description:
          "מלאי, הזמנות, תפעול, דוחות והרשאות — פתרונות שמרכזים את העסק וחוסכים עבודה ידנית.",
        tags: ["Operations", "Reports", "Roles"],
      },
      {
        number: "04",
        title: "אוטומציות ואינטגרציות",
        description:
          "חיבור בין מערכות, API ותהליכים אוטומטיים שמונעים כפילויות, מקצרים זמני עבודה ומפחיתים טעויות.",
        tags: ["API", "Automation", "Integration"],
      },
      {
        number: "05",
        title: "מערכות Web בהתאמה אישית",
        description:
          "פורטלים, דשבורדים וכלים עסקיים שלא נכנסים לתבנית מוכנה — מאופיינים ונבנים סביב הצורך האמיתי.",
        tags: ["Full-stack", "Dashboards", "SaaS"],
      },
      {
        number: "06",
        title: "AI לעסקים",
        description:
          "שילוב בינה מלאכותית במקום שבו היא באמת מועילה: חיפוש חכם, ניתוח מידע ועוזרים לתהליכים עסקיים.",
        tags: ["AI", "Agents", "Data"],
      },
    ],
  },
  projects: {
    kicker: "פרויקטים נבחרים",
    title: "מערכות שכבר עובדות בעולם האמיתי.",
    lead: "שלושה מוצרים שונים, עם מכנה משותף אחד: תהליך מורכב שהפך לחוויה פשוטה וברורה למשתמש.",
    items: [
      {
        meta: "01 / EVENT COMMERCE",
        year: "2026",
        title: "LD Event Design",
        description:
          "סטודיו לעיצוב אירועים — חתונות, חינה, בר/בת מצווה וברית. הלקוח מרכיב חבילה, חותם על הסכם דיגיטלי ושולח הזמנה, והכול מנוהל מממשק אחד.",
        points: [
          "הרכבת חבילה בהתאמה אישית",
          "הסכם והזמנה דיגיטליים",
          "ניהול תוכן, מדיה והזמנות",
        ],
        linkLabel: "CASE STUDY",
        previewLabel: "הדמיית ממשק LD Event Design",
        preview: {
          kicker: "עיצוב אירועים",
          headline: "האירוע שלך, בעיצוב אישי.",
          cta: "להרכבת חבילה",
          tags: ["חתונה", "חינה", "בר מצווה"],
        },
      },
      {
        meta: "02 / E-COMMERCE",
        year: "2026",
        title: "Shel‑Yah",
        description:
          "סטודיו ליצירות אפוקסי בעבודת יד — שעוני קיר, שלטי כניסה ומתנות. חנות מלאה עם קטלוג, סל, חשבון לקוח והזמנות בהתאמה אישית.",
        points: [
          "קטלוג וסל קנייה מלאים",
          "הזמנות בהתאמה אישית",
          "חשבון לקוח ואזור אישי",
        ],
        linkLabel: "לאתר הפעיל",
        href: "https://shel-yah-web.vercel.app/",
        previewLabel: "הדמיית ממשק Shel-Yah",
        preview: {
          kicker: "עבודת יד · בעיצוב אישי",
          headline: "אומנות אפוקסי שמספרת סיפור.",
          cta: "לקטלוג",
          tags: ["שעוני קיר", "שלטי כניסה", "מתנות"],
        },
      },
      {
        meta: "03 / EVENT PLATFORM",
        year: "2026",
        title: "מערכת אישורי הגעה",
        description:
          "פלטפורמה לניהול אירועים, מוזמנים ואישורי הגעה — כולל קישורים אישיים, דשבורד, סינון וסידורי הושבה.",
        points: [
          "ניהול אירועים ומוזמנים",
          "קישורי RSVP אישיים",
          "דשבורד ונתונים בזמן אמת",
        ],
        linkLabel: "לאתר הפעיל",
        href: "https://arrival-confirmations.vercel.app/",
        previewLabel: "הדמיית מערכת אישורי ההגעה",
        preview: {
          kicker: "מרכז ניהול",
          headline: "אישורי הגעה בזמן אמת",
          cta: "לדשבורד",
          tags: ["מוזמנים", "אישרו", "הושבה"],
        },
      },
    ],
  },
  process: {
    kicker: "איך זה עובד",
    title: "מהרעיון למערכת שעובדת.",
    lead: "תהליך שקוף ופרקטי. בכל שלב יודעים מה בונים, למה בונים אותו ומה צריך לקרות כדי להתקדם.",
    steps: [
      {
        number: "01",
        title: "מבינים את העסק",
        text: "שיחה ממוקדת על המטרה, המשתמשים והתהליך העסקי שצריך לשפר.",
      },
      {
        number: "02",
        title: "מתכננים את הפתרון",
        text: "אפיון ברור, מסכים, זרימות משתמש ותכנית עבודה שאפשר לקבל עליה החלטות.",
      },
      {
        number: "03",
        title: "בונים ובודקים",
        text: "פיתוח מדורג, בדיקות אמיתיות והתאמות עד שהכול מרגיש פשוט ועובד חלק.",
      },
      {
        number: "04",
        title: "עולים לאוויר",
        text: "השקה מסודרת, חיבור התשתיות והמשך ליווי כשהמוצר כבר פוגש משתמשים.",
      },
    ],
  },
  about: {
    kicker: "מי עומד מאחורי המוצר",
    title: "נעים להכיר, אני ניסן סיני.",
    text: "מפתח Full‑Stack שאוהב לקחת רעיון, להבין את הבעיה שמאחוריו ולהפוך אותו למוצר דיגיטלי מדויק. אני משלב חשיבה עסקית, חוויית משתמש ופיתוח מקצה לקצה — כדי שהתוצאה לא רק תיראה טוב, אלא באמת תעבוד.",
    badge: "FULL‑STACK DEVELOPER",
    values: [
      {
        number: "01",
        title: "תקשורת ישירה",
        text: "מדברים איתי, לא עם שרשרת של אנשי קשר.",
      },
      {
        number: "02",
        title: "חשיבה מערכתית",
        text: "רואה את כל התהליך, מהמשתמש ועד הנתונים.",
      },
      {
        number: "03",
        title: "אחריות לתוצאה",
        text: "בדיקות, נגישות וביצועים הם חלק מהבנייה.",
      },
    ],
  },
  tech: {
    aria: "טכנולוגיות",
    label: "TECH STACK",
    items: ["TypeScript", "React", "Next.js", "Node.js", "Supabase", "PostgreSQL"],
  },
  contact: {
    kicker: "יש לך רעיון?",
    title: "בואו נהפוך אותו למשהו שעובד.",
    lead: "ספרו לי בקצרה מה העסק צריך. אחזור אליכם כדי להבין את המטרה ולבדוק מה הדרך הנכונה לבנות אותה.",
    emailLabel: "אימייל ישיר",
    phoneLabel: "טלפון",
  },
  form: {
    name: "שם מלא *",
    namePlaceholder: "איך לפנות אליך?",
    business: "שם העסק",
    businessPlaceholder: "שם העסק שלך",
    phone: "טלפון *",
    phonePlaceholder: "050-0000000",
    email: "אימייל",
    emailPlaceholder: "name@business.co.il",
    service: "מה תרצו לבנות?",
    servicePlaceholder: "בחרו סוג פרויקט",
    serviceOptions: [
      { value: "website", label: "אתר או חנות" },
      { value: "crm", label: "מערכת CRM" },
      { value: "erp", label: "מערכת ERP או ניהול" },
      { value: "automation", label: "אוטומציה או אינטגרציה" },
      { value: "custom", label: "מערכת בהתאמה אישית" },
      { value: "other", label: "משהו אחר" },
    ],
    message: "כמה מילים על הפרויקט *",
    messagePlaceholder: "מה האתגר, למי המערכת מיועדת ומה חשוב לכם להשיג?",
    honeypot: "אתר",
    consentBefore: "אני מאשר/ת שימוש בפרטים לצורך חזרה אליי בהתאם ל",
    consentLink: "מדיניות הפרטיות",
    consentAfter: ".",
    submit: "שליחת הפרטים",
    submitting: "שולח...",
    success: "תודה! הפרטים התקבלו ואחזור אליך בהקדם.",
    errorBefore: "השליחה לא הצליחה כרגע. אפשר לפנות אליי ישירות ב־",
    errorAfter: ".",
  },
  footer: {
    tagline: "אתרים · מערכות · אוטומציות · פתרונות דיגיטליים",
    email: "אימייל",
    phone: "טלפון",
    privacy: "פרטיות",
    rights: "© 2026 ניסן סיני טכנולוגיות. כל הזכויות שמורות.",
  },
  privacy: {
    metaTitle: "מדיניות פרטיות",
    metaDescription: "מדיניות הפרטיות של אתר ניסן סיני טכנולוגיות.",
    back: "חזרה לאתר",
    kicker: "פרטיות",
    title: "מדיניות פרטיות",
    updated: "עודכן לאחרונה: אוגוסט 2026",
    sections: [
      {
        title: "איזה מידע נאסף?",
        body: "כאשר משאירים פרטים בטופס יצירת הקשר, נשמרים הפרטים שנמסרו מרצון: שם, שם עסק, טלפון, אימייל, סוג השירות ותוכן הפנייה.",
      },
      {
        title: "למה המידע משמש?",
        body: "המידע משמש רק לצורך חזרה לפונה, בירור הצורך ומתן מידע או הצעה. אין שימוש בפרטים לדיוור המוני ואין העברה שלהם לצד שלישי למטרות שיווק.",
      },
      {
        title: "איפה המידע נשמר?",
        body: "הפניות נשמרות בבסיס נתונים מאובטח בענן, עם הרשאות מוגבלות שמאפשרות כתיבה בלבד מהאתר. אין גישה ציבורית לקריאת הפניות.",
      },
      {
        title: "כמה זמן?",
        body: "הפרטים נשמרים כל עוד הם נדרשים לצורך הקשר העסקי. אפשר לבקש מחיקה בכל רגע ופנייה כזו תטופל.",
      },
      {
        title: "יצירת קשר",
        body: "לכל שאלה או בקשה בנוגע למידע אפשר לפנות אליי בכתובת {email}.",
      },
    ],
  },
};

const en: SiteContent = {
  meta: {
    title: "Nisan Sinai Technologies | Websites and business systems",
    description:
      "Website development, CRM and ERP systems, automations and custom software for growing businesses.",
    ogTitle: "Nisan Sinai Technologies | Websites and business systems",
    ogDescription:
      "Websites, CRM, ERP, automations and custom web systems for small and mid-sized businesses.",
    twitterDescription: "End-to-end digital development for small and mid-sized businesses.",
    keywords: [
      "web development",
      "CRM systems",
      "ERP systems",
      "business automation",
      "software development",
      "Nisan Sinai",
    ],
    ogLocale: "en_US",
  },
  brand: {
    name: "Nisan Sinai",
    suffix: "Technologies",
    homeAria: "Nisan Sinai Technologies - home",
    topAria: "Back to top",
  },
  skipLink: "Skip to main content",
  nav: {
    aria: "Main navigation",
    services: "Services",
    projects: "Projects",
    process: "How it works",
    about: "About",
    cta: "Let's talk",
  },
  languageSwitch: { label: "עב", toName: "עברית", aria: "מעבר לעברית" },
  hero: {
    eyebrow: "End-to-end digital development for business",
    titleLead: "I build the",
    titleAccent: "technology",
    titleTail: "your business needs.",
    lead: "Websites, CRM and ERP systems, automations and custom development — from a precise idea to a product that is fast, accessible and genuinely works.",
    primaryCta: "Let's build something great",
    secondaryCta: "See my work",
    proofAria: "How I run a project",
    proof: ["Precise scoping", "Smart development", "Testing and launch"],
    visualAria: "Illustration of a connected business system",
    coreKicker: "CORE",
    coreTitle: "Your business",
    coreStatus: "System live",
    signalLabel: "Performance",
    scrollCue: "Explore",
    scrollCueAria: "Continue to services",
    capabilities: [
      { label: "Websites", value: "Web" },
      { label: "Management", value: "CRM" },
      { label: "Operations", value: "ERP" },
      { label: "Automations", value: "AUTO" },
    ],
  },
  strip: {
    aria: "My services",
    lead: "Solutions built around your business",
    items: ["WEB", "CRM", "ERP", "AUTOMATION"],
  },
  services: {
    aria: "My services",
    kicker: "What I build",
    title: "Technology that puts the business in order.",
    lead: "Every solution starts with a real business problem — technology comes second. The goal is a clear, fast system the team actually wants to use.",
    tagsAria: (title: string) => `Areas covered by ${title}`,
    items: [
      {
        number: "01",
        title: "Websites and online stores",
        description:
          "Brand sites, landing pages and fast storefronts that present the business properly and turn visits into enquiries and sales.",
        tags: ["UX/UI", "E-commerce", "SEO"],
      },
      {
        number: "02",
        title: "CRM systems",
        description:
          "Customers, leads, tasks and sales pipelines in one system, shaped around the way your business actually works.",
        tags: ["Leads", "Customers", "Workflows"],
      },
      {
        number: "03",
        title: "ERP and operations",
        description:
          "Inventory, orders, operations, reports and permissions — solutions that centralise the business and cut out manual work.",
        tags: ["Operations", "Reports", "Roles"],
      },
      {
        number: "04",
        title: "Automations and integrations",
        description:
          "Connecting systems, APIs and automated processes that remove duplication, shorten turnaround and reduce mistakes.",
        tags: ["API", "Automation", "Integration"],
      },
      {
        number: "05",
        title: "Custom web systems",
        description:
          "Portals, dashboards and internal tools that do not fit an off-the-shelf template — scoped and built around the real need.",
        tags: ["Full-stack", "Dashboards", "SaaS"],
      },
      {
        number: "06",
        title: "AI for business",
        description:
          "Bringing AI in where it genuinely helps: smart search, data analysis and assistants for business processes.",
        tags: ["AI", "Agents", "Data"],
      },
    ],
  },
  projects: {
    kicker: "Selected work",
    title: "Systems already running in the real world.",
    lead: "Three different products with one thing in common: a complex process turned into a simple, clear experience.",
    items: [
      {
        meta: "01 / EVENT COMMERCE",
        year: "2026",
        title: "LD Event Design",
        description:
          "An event-design studio — weddings, henna, bar and bat mitzvahs. Clients assemble a package, sign a digital agreement and place the order, all managed from one interface.",
        points: [
          "Made-to-order package builder",
          "Digital agreement and ordering",
          "Content, media and order management",
        ],
        linkLabel: "CASE STUDY",
        previewLabel: "LD Event Design interface mockup",
        preview: {
          kicker: "EVENT DESIGN",
          headline: "Your event, designed around you.",
          cta: "Build a package",
          tags: ["Weddings", "Henna", "Mitzvahs"],
        },
      },
      {
        meta: "02 / E-COMMERCE",
        year: "2026",
        title: "Shel‑Yah",
        description:
          "A studio for handmade epoxy art — wall clocks, entrance signs and gifts. A full storefront with catalogue, cart, customer accounts and made-to-order commissions.",
        points: [
          "Full catalogue and cart",
          "Made-to-order commissions",
          "Customer accounts and dashboard",
        ],
        linkLabel: "Visit the live site",
        href: "https://shel-yah-web.vercel.app/",
        previewLabel: "Shel-Yah interface mockup",
        preview: {
          kicker: "HANDMADE · MADE TO ORDER",
          headline: "Epoxy art that tells a story.",
          cta: "View catalogue",
          tags: ["Wall clocks", "Signs", "Gifts"],
        },
      },
      {
        meta: "03 / EVENT PLATFORM",
        year: "2026",
        title: "RSVP platform",
        description:
          "A platform for managing events, guests and arrival confirmations — including personal links, a dashboard, filtering and seating.",
        points: [
          "Event and guest management",
          "Personal RSVP links",
          "Live dashboard and data",
        ],
        linkLabel: "Visit the live site",
        href: "https://arrival-confirmations.vercel.app/",
        previewLabel: "RSVP platform mockup",
        preview: {
          kicker: "CONTROL CENTRE",
          headline: "Live arrival confirmations",
          cta: "Open dashboard",
          tags: ["Guests", "Confirmed", "Seating"],
        },
      },
    ],
  },
  process: {
    kicker: "How it works",
    title: "From an idea to a system that works.",
    lead: "A transparent, practical process. At every stage you know what is being built, why, and what has to happen to move forward.",
    steps: [
      {
        number: "01",
        title: "Understand the business",
        text: "A focused conversation about the goal, the users and the process that needs improving.",
      },
      {
        number: "02",
        title: "Design the solution",
        text: "Clear scoping, screens, user flows and a plan you can actually make decisions on.",
      },
      {
        number: "03",
        title: "Build and test",
        text: "Staged development, real testing and adjustments until everything feels simple and runs smoothly.",
      },
      {
        number: "04",
        title: "Go live",
        text: "An orderly launch, infrastructure wired up, and continued support once the product meets real users.",
      },
    ],
  },
  about: {
    kicker: "Who is behind the product",
    title: "Good to meet you, I'm Nisan Sinai.",
    text: "A full-stack developer who likes taking an idea, understanding the problem behind it and turning it into a precise digital product. I combine business thinking, user experience and end-to-end development — so the result does not just look good, it genuinely works.",
    badge: "FULL‑STACK DEVELOPER",
    values: [
      {
        number: "01",
        title: "Direct communication",
        text: "You talk to me, not to a chain of account managers.",
      },
      {
        number: "02",
        title: "Systems thinking",
        text: "I see the whole process, from the user through to the data.",
      },
      {
        number: "03",
        title: "Accountable for the result",
        text: "Testing, accessibility and performance are part of the build.",
      },
    ],
  },
  tech: {
    aria: "Technologies",
    label: "TECH STACK",
    items: ["TypeScript", "React", "Next.js", "Node.js", "Supabase", "PostgreSQL"],
  },
  contact: {
    kicker: "Got an idea?",
    title: "Let's turn it into something that works.",
    lead: "Tell me briefly what the business needs. I'll get back to you to understand the goal and work out the right way to build it.",
    emailLabel: "Direct email",
    phoneLabel: "Phone",
  },
  form: {
    name: "Full name *",
    namePlaceholder: "What should I call you?",
    business: "Business name",
    businessPlaceholder: "Your business name",
    phone: "Phone *",
    phonePlaceholder: "050-0000000",
    email: "Email",
    emailPlaceholder: "name@business.co.il",
    service: "What would you like to build?",
    servicePlaceholder: "Choose a project type",
    serviceOptions: [
      { value: "website", label: "Website or store" },
      { value: "crm", label: "CRM system" },
      { value: "erp", label: "ERP or operations system" },
      { value: "automation", label: "Automation or integration" },
      { value: "custom", label: "Custom system" },
      { value: "other", label: "Something else" },
    ],
    message: "A few words about the project *",
    messagePlaceholder: "What is the challenge, who is it for, and what matters most?",
    honeypot: "Website",
    consentBefore: "I agree to my details being used to get back to me, in line with the ",
    consentLink: "privacy policy",
    consentAfter: ".",
    submit: "Send details",
    submitting: "Sending...",
    success: "Thank you! Your details came through and I'll be in touch shortly.",
    errorBefore: "That didn't go through. You can reach me directly at ",
    errorAfter: ".",
  },
  footer: {
    tagline: "Websites · Systems · Automations · Digital solutions",
    email: "Email",
    phone: "Phone",
    privacy: "Privacy",
    rights: "© 2026 Nisan Sinai Technologies. All rights reserved.",
  },
  privacy: {
    metaTitle: "Privacy policy",
    metaDescription: "The privacy policy of the Nisan Sinai Technologies website.",
    back: "Back to the site",
    kicker: "Privacy",
    title: "Privacy policy",
    updated: "Last updated: August 2026",
    sections: [
      {
        title: "What is collected?",
        body: "When you leave details in the contact form, the details you volunteer are stored: name, business name, phone, email, service type and the content of your message.",
      },
      {
        title: "What is it used for?",
        body: "The information is used only to get back to you, understand the need and provide information or a proposal. It is not used for bulk mailing and is not passed to third parties for marketing.",
      },
      {
        title: "Where is it stored?",
        body: "Enquiries are stored in a secured cloud database with restricted permissions that allow writes from the site only. There is no public read access to enquiries.",
      },
      {
        title: "For how long?",
        body: "Details are kept for as long as they are needed for the business conversation. You can request deletion at any time and such a request will be honoured.",
      },
      {
        title: "Contact",
        body: "For any question or request about your data, write to me at {email}.",
      },
    ],
  },
};

const dictionaries: Record<Locale, SiteContent> = { he, en };

export const contact = { email: EMAIL, phoneDisplay: PHONE_DISPLAY, phoneHref: "+972587170978" };

export function getContent(locale: Locale): SiteContent {
  return dictionaries[locale];
}
