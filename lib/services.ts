import type { Locale } from "./i18n";

type ServiceCopy = {
  title: string;
  description: string;
  sections: { heading: string; text: string }[];
};

type Service = Record<Locale, ServiceCopy> & {
  card: string;
  guide: string;
  project: number;
};

export const services = {
  "website-development": {
    card: "01",
    guide: "website-cost-israel",
    project: 0,
    he: {
      title: "בניית אתרים לעסקים בנתניה ובשרון",
      description: "ניסן סיני בונה אתרי תדמית, דפי נחיתה וחנויות לעסקים בנתניה, בשרון ובכל הארץ. השוו בין סוגי האתרים וקראו מה להכין לפני הצעת מחיר.",
      sections: [
        { heading: "איזה אתר מתאים לעסק?", text: "אתר תדמית מתאים כשלקוחות צריכים להבין מה אתם מציעים, לראות עבודות ולבחור איך לפנות. דף נחיתה מתאים להצעה אחת עם פעולה ברורה. חנות אונליין מתאימה כשלקוחות צריכים לדפדף במוצרים ולהזמין בעצמם." },
        { heading: "מה מתכננים לפני שמתחילים לבנות?", text: "מתחילים בשירותים שהלקוחות מחפשים ובפעולה שתרצו שיבצעו: פנייה בוואטסאפ, מילוי טופס או הזמנה. אם יש לכם אתר קיים, עוברים גם על הכתובות שכבר מביאות מבקרים כדי לתכנן מה לשמור ולמה להגדיר הפניה." },
        { heading: "מה כדאי לשלוח כדי לקבל הצעת מחיר?", text: "שלחו קישור לאתר הקיים אם יש, תיאור של קהל היעד, רשימה ראשונית של עמודים ודוגמאות לסגנון שאתם אוהבים. ציינו אם תצטרכו עברית ואנגלית, חנות או חיבור לכלי שכבר משמש את העסק. הפרטים האלה עוזרים להפריד בין מה שדרוש להשקה לבין מה שאפשר להוסיף בהמשך." },
      ],
    },
    en: {
      title: "Business website development in Netanya and the Sharon region",
      description: "Nisan Sinai builds business websites, landing pages and online stores for companies in Netanya, the Sharon region and across Israel. Compare formats and prepare for a quote.",
      sections: [
        { heading: "Which type of website fits your business?", text: "A business website helps customers understand your services, see your work and choose how to get in touch. A landing page fits one offer with a clear action. An online store fits businesses whose customers need to browse products and place orders themselves." },
        { heading: "What should you plan before development?", text: "Start with the services people look for and the action they should take: a WhatsApp message, a form submission or an order. If you have an existing site, review the URLs that already attract visitors so you can plan which ones to keep and where to set up redirects." },
        { heading: "What should you send when asking for a quote?", text: "Share your existing site if you have one, describe your audience, list the pages you expect to need and include examples of designs you like. Mention whether you need Hebrew and English, a store or an integration with a tool you already use. This helps identify what the launch needs and what can come later." },
      ],
    },
  },
  "custom-business-software": {
    card: "05",
    guide: "custom-system-or-off-the-shelf",
    project: 2,
    he: {
      title: "פיתוח מערכות לעסקים בהתאמה אישית",
      description: "פיתוח מערכות CRM, כלי תפעול, פורטלים ודשבורדים לעסקים בישראל. קראו איך לאפיין תהליך עסקי ולבדוק מתי מערכת מותאמת מצדיקה את ההשקעה.",
      sections: [
        { heading: "מתי מערכת מותאמת מתאימה לעסק?", text: "אם הצוות מעתיק שוב ושוב מידע בין גיליונות וכלים, מתקשה לעקוב אחרי סטטוס טיפול או צריך הרשאות שונות לכל תפקיד, כדאי למפות את התהליך. כשהדרישות נפוצות, פתרון מדף עשוי להספיק. אם נדרשים מסכים, כללים או חיבורים ייחודיים, אפשר לבחון פיתוח מותאם." },
        { heading: "איך מתחילים באפיון?", text: "בוחרים תהליך אחד, כמו טיפול בליד חדש, ורושמים מי מקבל אותו, מה צריך לתעד ומתי העבודה נחשבת גמורה. מפרידים בין דרישות כמו ייבוא נתונים והרשאות לבין שיפורים שאפשר לדחות. כך אפשר להגדיר גרסה ראשונה שהצוות יוכל לנסות בעבודה יומיומית." },
        { heading: "מה להכין לשיחת אפיון?", text: "הכינו דוגמה אחת של תהליך קיים ללא פרטי לקוחות, רשימת כלים שהמערכת תצטרך להתחבר אליהם, ואיזה דוח או מסך חסר לכם היום. ציינו מי ישתמש במערכת ומי יתחזק אותה לאחר ההשקה." },
      ],
    },
    en: {
      title: "Custom business software development in Israel",
      description: "Custom CRM, operations tools, portals and dashboards for Israeli businesses. Learn how to scope a workflow and decide whether custom development makes sense.",
      sections: [
        { heading: "When does custom software make sense?", text: "Map the workflow if your team repeatedly copies data between spreadsheets and tools, struggles to track progress or needs different access for each role. An off-the-shelf product may cover common requirements. Explore custom development when you need specific screens, rules or integrations." },
        { heading: "How do you scope a first version?", text: "Pick one workflow, such as following up on a new lead. Note who receives it, what they record and when the work is complete. Separate requirements such as data import and access control from improvements that can wait. This gives the team a first version it can test in everyday work." },
        { heading: "What should you bring to a discovery call?", text: "Bring one example of an existing workflow with customer details removed, the tools the system would need to connect to, and the report or screen you are missing today. Identify who will use the system and who will maintain it after launch." },
      ],
    },
  },
} satisfies Record<string, Service>;

export type ServiceSlug = keyof typeof services;
export const serviceSlugs = Object.keys(services) as ServiceSlug[];
export const servicePath = (slug: ServiceSlug) => `/services/${slug}`;

export function serviceForCard(number: string) {
  return serviceSlugs.find((slug) => services[slug].card === number);
}
