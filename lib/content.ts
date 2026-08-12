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
};
export type AboutValue = { number: string; title: string; text: string };
export type ServiceOption = { value: string; label: string };

/**
 * Both policy pages are the same shape: a heading, a date, an opening
 * paragraph and numbered sections that carry prose, a list, or both. Sharing
 * the type keeps the two documents renderable by one component and keeps a
 * missing translation a compile error rather than an empty page.
 */
export type LegalSection = { title: string; body?: string; items?: string[] };
export type LegalDocument = {
  metaTitle: string;
  metaDescription: string;
  back: string;
  kicker: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

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
  /** Read out after a link that leaves the site, so the jump is not a surprise. */
  newTabHint: string;
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
  footer: {
    tagline: string;
    email: string;
    phone: string;
    privacy: string;
    accessibility: string;
    admin: string;
    rights: string;
    navAria: string;
  };
  privacy: LegalDocument;
  accessibility: LegalDocument;
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
  newTabHint: "(נפתח בכרטיסייה חדשה)",
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
          "אתר ומערכת הזמנות ל־LD Event Design — סטודיו לעיצוב אירועים. הלקוחות בוחרים חבילת עיצוב, מוסיפים פריטים, חותמים על הסכם דיגיטלי ושולחים הזמנה — והכול מנוהל מאזור ניהול אחד.",
        points: [
          "חבילות ומוצרים בהתאמה אישית",
          "סל, הסכם והזמנה דיגיטליים",
          "ניהול הזמנות, תמונות ותוכן",
        ],
        linkLabel: "לאתר הפעיל",
        href: "https://ld-event-design.vercel.app/",
        previewLabel: "הדמיית ממשק LD Event Design",
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
    accessibility: "נגישות",
    admin: "כניסה לניהול",
    rights: "© 2026 ניסן סיני טכנולוגיות. כל הזכויות שמורות.",
    navAria: "קישורים בתחתית העמוד",
  },
  privacy: {
    metaTitle: "מדיניות פרטיות",
    metaDescription:
      "איזה מידע נאסף באתר ניסן סיני טכנולוגיות, למה הוא משמש, למי הוא מועבר ואילו זכויות עומדות לך לפי חוק הגנת הפרטיות.",
    back: "חזרה לאתר",
    kicker: "פרטיות",
    title: "מדיניות פרטיות",
    updated: "עודכן לאחרונה: 12 באוגוסט 2026",
    intro:
      "העמוד הזה מסביר איזה מידע אישי נאסף באתר, למה הוא משמש, למי הוא מועבר, כמה זמן הוא נשמר ואילו זכויות עומדות לך לפי חוק הגנת הפרטיות, התשמ״א-1981 ותקנותיו.",
    sections: [
      {
        title: "מי אחראי למידע",
        body: "בעל המאגר והאחראי על המידע הוא ניסן סיני, ניסן סיני טכנולוגיות, ישראל. לכל פנייה בנושא פרטיות אפשר לפנות ישירות בכתובת {email} או בטלפון 058-7170978.",
      },
      {
        title: "איזה מידע נאסף",
        body: "רק מה שנמסר מרצון בטופס יצירת הקשר: שם מלא, שם העסק, טלפון, כתובת אימייל, סוג השירות המבוקש ותוכן הפנייה, יחד עם מועד השליחה. אין חובה חוקית למסור את הפרטים והמסירה נעשית מרצון בלבד, אך בלי שם וטלפון לא ניתן לחזור אליך. האתר אינו אוסף מידע נוסף עליך ואינו רוכש מידע מגורמים אחרים.",
      },
      {
        title: "למה המידע משמש",
        body: "אך ורק כדי לחזור אל הפונה, להבין את הצורך ולהציע מענה או הצעת מחיר. אין דיוור פרסומי, אין ניתוח פרופיל, ואין מכירה, השכרה או העברה של הפרטים לצד שלישי למטרות שיווק.",
      },
      {
        title: "למי המידע מועבר",
        body: "האתר מתארח אצל חברת Vercel Inc, והפניות נשמרות אצל חברת Supabase Inc. שתי החברות משמשות כספקיות תשתית בלבד, מעבדות את המידע לפי הוראותיי ואינן רשאיות לעשות בו שימוש עצמאי. השרתים נמצאים מחוץ לישראל, במדינות שרמת ההגנה בהן על מידע אישי אינה נופלת מזו הנהוגה בישראל, בהתאם לתקנות הגנת הפרטיות (העברת מידע אל מאגרי מידע שמחוץ לגבולות המדינה), התשס״א-2001. מעבר לכך המידע לא מועבר לאיש, למעט אם הדבר יידרש על פי דין או צו של רשות מוסמכת.",
      },
      {
        title: "איך המידע מאובטח",
        body: "הפניות נשמרות בבסיס נתונים שמופעלת עליו הגנת Row Level Security: לאתר יש הרשאת כתיבה בלבד, ואין שום אפשרות ציבורית לקרוא, לשנות או למחוק פניות. כל התעבורה מוצפנת ב־HTTPS, והמפתח שהאתר עושה בו שימוש הוא מפתח ציבורי שאינו מאפשר קריאת מידע. תקינות ההרשאות האלה נבדקת אוטומטית בכל שינוי בקוד.",
      },
      {
        title: "עוגיות ומעקב",
        body: "האתר אינו משתמש בעוגיות מעקב, אינו מריץ כלי אנליטיקה של צד שלישי ואינו משתף מידע עם רשתות פרסום או רשתות חברתיות. השרת רושם נתוני גישה טכניים בסיסיים, כמו כתובת IP ומועד הבקשה, לצורכי אבטחה ותפעול בלבד.",
      },
      {
        title: "כמה זמן המידע נשמר",
        body: "פנייה נשמרת עד 24 חודשים ממועד הקשר האחרון, או עד לקבלת בקשת מחיקה — המוקדם מביניהם. פנייה שהבשילה להתקשרות עסקית נשמרת למשך התקופה שהדין מחייב לשמור בה מסמכי עסקה.",
      },
      {
        title: "הזכויות שלך",
        body: "לפי חוק הגנת הפרטיות עומדות לך הזכויות הבאות, וכל בקשה תיענה בתוך 30 יום ממועד קבלתה. לפנייה: {email}.",
        items: [
          "זכות עיון — לבקש לקבל את המידע שמוחזק עליך (סעיף 13 לחוק).",
          "זכות תיקון — לבקש לתקן מידע שאינו נכון, שלם, ברור או מעודכן (סעיף 14 לחוק).",
          "זכות מחיקה — לבקש למחוק מידע שאינו נדרש עוד למטרה שלשמה נאסף.",
          "ביטול הסכמה — לחזור בך מההסכמה בכל עת, בלי שהדבר יפגע בחוקיות השימוש שנעשה עד אותו מועד.",
          "זכות תלונה — לפנות לרשות להגנת הפרטיות במשרד המשפטים אם לדעתך המידע לא טופל כראוי.",
        ],
      },
      {
        title: "קטינים",
        body: "האתר מיועד לפניות עסקיות ואינו מיועד לשימוש מתחת לגיל 16. אם יתברר שנאסף מידע על קטין ללא הסכמת אחראי, המידע יימחק מיד עם היוודע הדבר.",
      },
      {
        title: "שינויים במדיניות",
        body: "כל עדכון יפורסם בעמוד הזה יחד עם תאריך עדכון חדש בראשו. שימוש באתר לאחר פרסום עדכון מהווה הסכמה לנוסח המעודכן.",
      },
      {
        title: "יצירת קשר",
        body: "לכל שאלה, בקשה או תלונה בנושא פרטיות אפשר לפנות אליי בכתובת {email}.",
      },
    ],
  },
  accessibility: {
    metaTitle: "הצהרת נגישות",
    metaDescription:
      "הצהרת הנגישות של אתר ניסן סיני טכנולוגיות: התקן שלפיו האתר נבנה, ההתאמות שבוצעו ופרטי רכז הנגישות.",
    back: "חזרה לאתר",
    kicker: "נגישות",
    title: "הצהרת נגישות",
    updated: "עודכן לאחרונה: 12 באוגוסט 2026",
    intro:
      "אני רואה בנגישות האתר חלק מהמקצוע ולא תוספת לו. האתר תוכנן ונבנה כדי לאפשר שימוש מלא ונוח גם לאנשים עם מוגבלות, והוא נבדק מחדש בכל שינוי בקוד.",
    sections: [
      {
        title: "התקן שלפיו האתר נבנה",
        body: "האתר נבנה ונבדק לעמידה בתקן הישראלי ת״י 5568 ברמה AA, המבוסס על הנחיות WCAG 2.0 של ארגון W3C, בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013.",
      },
      {
        title: "מה נעשה באתר",
        items: [
          "מבנה סמנטי מלא: היררכיית כותרות תקינה, ואזורי ניווט, תוכן וכותרת תחתונה מסומנים לקורא מסך.",
          "ניווט מלא במקלדת בלבד, עם סימון ברור של הרכיב שבפוקוס וקישור דילוג ישיר אל התוכן.",
          "יחסי ניגודיות העומדים בדרישות רמה AA בכל טקסט ובכל רכיב ממשק, בשתי השפות.",
          "טקסט חלופי לכל תמונה, תווית ברורה לכל שדה בטופס והשלמה אוטומטית של פרטי קשר.",
          "תמיכה בהגדלת טקסט עד 200% ובשינוי מרווחי טקסט, בלי אובדן תוכן ובלי גלילה אופקית.",
          "התאמה מלאה לכל גודל מסך, מרוחב 320 פיקסלים ועד מסך רחב.",
          "כיבוד העדפת המערכת להפחתת אנימציות, למי שתנועה על המסך מפריעה לו.",
          "סימון שפה של מילים בלועזית בתוך טקסט עברי, כדי שקורא מסך יבטא אותן נכון.",
        ],
      },
      {
        title: "איך הנגישות נבדקת",
        body: "כל שינוי בקוד עובר בדיקת נגישות אוטומטית בכלי axe-core בכל עמודי האתר, בשתי השפות ובשלושה גדלי מסך, כחלק מתהליך הבנייה — שינוי שמפר את התקן אינו יכול לעלות לאוויר. בנוסף מתבצעת בדיקה ידנית של ניווט במקלדת ושל סדר הקריאה.",
      },
      {
        title: "מגבלות ידועות",
        body: "האתר מפנה לאתרים חיצוניים של לקוחות. אתרים אלה אינם בשליטתי ורמת הנגישות שלהם היא באחריות בעליהם. אם נתקלת בעמוד או ברכיב באתר הזה שאינו נגיש, אשמח מאוד לשמוע — כל פנייה כזו מטופלת.",
      },
      {
        title: "אופן מתן השירות",
        body: "השירות ניתן מרחוק, בטלפון, באימייל ובפגישות מקוונות, ואין מקום פיזי לקבלת קהל. אפשר לתאם פגישה באמצעי שנוח לך, כולל שיחה בלבד או התכתבות בלבד.",
      },
      {
        title: "רכז הנגישות",
        body: "רכז הנגישות הוא ניסן סיני. לפניות בנושא נגישות האתר: {email} או בטלפון 058-7170978. אשיב לכל פנייה בנושא נגישות בתוך 7 ימי עבודה לכל היותר, ואם נדרש תיקון — אבצע אותו בהקדם האפשרי ואעדכן אותך כשהושלם.",
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
  newTabHint: "(opens in a new tab)",
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
          "Website and ordering system for LD Event Design, an event-design studio. Clients choose a design package, add items, sign a digital agreement and submit the order — all managed from one admin area.",
        points: [
          "Custom packages and add-ons",
          "Cart, digital agreement and ordering",
          "Orders, images and content management",
        ],
        linkLabel: "Live site",
        href: "https://ld-event-design.vercel.app/",
        previewLabel: "LD Event Design interface mockup",
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
    accessibility: "Accessibility",
    admin: "Admin login",
    rights: "© 2026 Nisan Sinai Technologies. All rights reserved.",
    navAria: "Footer links",
  },
  privacy: {
    metaTitle: "Privacy policy",
    metaDescription:
      "What the Nisan Sinai Technologies site collects, what it is used for, who it is shared with, and the rights you hold under Israeli privacy law.",
    back: "Back to the site",
    kicker: "Privacy",
    title: "Privacy policy",
    updated: "Last updated: 12 August 2026",
    intro:
      "This page explains what personal data the site collects, what it is used for, who it is passed to, how long it is kept and the rights you hold under the Israeli Protection of Privacy Law, 5741-1981 and its regulations.",
    sections: [
      {
        title: "Who is responsible for the data",
        body: "The database owner and controller is Nisan Sinai, Nisan Sinai Technologies, Israel. For anything to do with privacy, write to {email} or call 058-7170978.",
      },
      {
        title: "What is collected",
        body: "Only what you volunteer in the contact form: full name, business name, phone, email address, the type of service you are asking about and the content of your message, together with the time it was sent. You are under no legal obligation to provide any of it and doing so is entirely voluntary, but without a name and a phone number there is no way to get back to you. The site collects nothing else about you and buys no data from anyone.",
      },
      {
        title: "What it is used for",
        body: "Only to get back to you, understand what you need and offer an answer or a quote. There is no marketing mail, no profiling, and no sale, rental or transfer of your details to third parties for marketing.",
      },
      {
        title: "Who it is shared with",
        body: "The site is hosted by Vercel Inc. and enquiries are stored with Supabase Inc. Both act purely as infrastructure providers, process the data on my instructions and may not use it for their own purposes. Their servers are outside Israel, in countries whose level of protection for personal data is no lower than Israel's, in line with the Protection of Privacy Regulations (Transfer of Data to Databases Abroad), 5761-2001. Beyond that the data goes to no one, unless disclosure is required by law or by order of a competent authority.",
      },
      {
        title: "How it is secured",
        body: "Enquiries are stored in a database with Row Level Security enabled: the site holds insert permission only, and there is no public way to read, change or delete an enquiry. All traffic is encrypted over HTTPS, and the key the site uses is a publishable key that cannot read data. These permissions are verified automatically on every code change.",
      },
      {
        title: "Cookies and tracking",
        body: "The site sets no tracking cookies, runs no third-party analytics and shares nothing with advertising or social networks. The server keeps basic technical access records, such as IP address and request time, for security and operations only.",
      },
      {
        title: "How long it is kept",
        body: "An enquiry is kept for up to 24 months from the last contact, or until you ask for it to be deleted, whichever comes first. An enquiry that turned into a business engagement is kept for as long as the law requires transaction records to be kept.",
      },
      {
        title: "Your rights",
        body: "Israeli privacy law gives you the rights below. Every request is answered within 30 days of receipt. To exercise any of them, write to {email}.",
        items: [
          "Access — to ask for the data held about you (section 13 of the Law).",
          "Correction — to ask that data which is inaccurate, incomplete, unclear or out of date be corrected (section 14).",
          "Erasure — to ask that data no longer needed for the purpose it was collected for be deleted.",
          "Withdrawal of consent — to withdraw at any time, without affecting the lawfulness of use made before you did.",
          "Complaint — to approach the Privacy Protection Authority at the Ministry of Justice if you believe your data was mishandled.",
        ],
      },
      {
        title: "Minors",
        body: "The site is aimed at business enquiries and is not intended for use by anyone under 16. If it turns out that data about a minor was collected without a guardian's consent, it will be deleted as soon as that becomes known.",
      },
      {
        title: "Changes to this policy",
        body: "Any update is published on this page with a new date at the top. Continuing to use the site after an update means accepting the updated text.",
      },
      {
        title: "Contact",
        body: "For any question, request or complaint about privacy, write to me at {email}.",
      },
    ],
  },
  accessibility: {
    metaTitle: "Accessibility statement",
    metaDescription:
      "The accessibility statement for the Nisan Sinai Technologies site: the standard it was built to, the adjustments made, and the accessibility coordinator's details.",
    back: "Back to the site",
    kicker: "Accessibility",
    title: "Accessibility statement",
    updated: "Last updated: 12 August 2026",
    intro:
      "I treat accessibility as part of the craft rather than something bolted on afterwards. This site was designed and built so that people with disabilities can use all of it comfortably, and it is re-tested on every code change.",
    sections: [
      {
        title: "The standard it was built to",
        body: "The site is built and tested against Israeli Standard 5568 at level AA, which is based on the W3C's WCAG 2.0 guidelines, in line with the Equal Rights for Persons with Disabilities Regulations (Service Accessibility Adjustments), 5773-2013.",
      },
      {
        title: "What was done",
        items: [
          "Full semantic structure: a correct heading hierarchy, with navigation, main content and footer marked up for screen readers.",
          "Complete keyboard-only navigation, a clearly marked focus indicator and a skip link straight to the content.",
          "Contrast ratios that meet level AA on every piece of text and every interface element, in both languages.",
          "Alternative text on every image, a clear label on every form field, and autocomplete on contact details.",
          "Support for text enlarged to 200% and for altered text spacing, with no loss of content and no horizontal scrolling.",
          "A layout that holds at every screen size, from 320 pixels wide to a wide desktop.",
          "The system preference for reduced motion is respected, for anyone who finds movement on screen difficult.",
          "Latin words inside Hebrew text are marked with their own language so a screen reader pronounces them correctly.",
        ],
      },
      {
        title: "How accessibility is tested",
        body: "Every code change runs an automated accessibility check with axe-core across every page of the site, both languages and three screen sizes, as part of the build — a change that breaks the standard cannot reach production. Keyboard navigation and reading order are also checked by hand.",
      },
      {
        title: "Known limitations",
        body: "The site links out to clients' own sites. Those are not under my control and their accessibility is their owners' responsibility. If you run into a page or an element on this site that is not accessible, I would genuinely like to hear about it — every such report is acted on.",
      },
      {
        title: "How the service is provided",
        body: "The service is delivered remotely, by phone, email and online meetings; there is no physical office receiving visitors. You are welcome to arrange a meeting in whatever form suits you, including voice only or text only.",
      },
      {
        title: "Accessibility coordinator",
        body: "The accessibility coordinator is Nisan Sinai. For anything to do with the accessibility of this site: {email} or 058-7170978. I answer accessibility enquiries within 7 working days at the latest, and where a fix is needed I make it as soon as I can and let you know once it is done.",
      },
    ],
  },
};

const dictionaries: Record<Locale, SiteContent> = { he, en };

export const contact = { email: EMAIL, phoneDisplay: PHONE_DISPLAY, phoneHref: "+972587170978" };

export function getContent(locale: Locale): SiteContent {
  return dictionaries[locale];
}
