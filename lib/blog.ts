import { locales, type Locale } from "./i18n";

/**
 * A post is the same shape as a policy document on purpose: a title, a date and
 * a run of headed sections. That lets the blog reuse the renderer and the
 * styles the legal pages already have, instead of inventing a second layout.
 */
export type BlogSection = { title: string; body: string[] };

export type BlogPost = {
  /** Stable across languages, so /blog/x and /en/blog/x are the same article. */
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date, used for <time>, the sitemap and the article structured data. */
  date: string;
  modified: string;
  sources: { title: string; url: string }[];
  readingTime: string;
  intro: string;
  sections: BlogSection[];
};

const he: BlogPost[] = [
  {
  "slug": "business-search-ai-visibility",
  "title": "איך להכין אתר עסקי לחיפוש ולתשובות AI",
  "excerpt": "בדיקות מעשיות לתוכן, סריקה, זהות עסקית ומדידה — ומה llms.txt יכול ולא יכול לעשות.",
  "date": "2026-10-29",
  "modified": "2026-10-29",
  "readingTime": "4 דקות קריאה",
  "intro": "כדי שמנוע חיפוש או עוזר AI יוכל להציג עסק, הוא צריך למצוא תוכן ציבורי, להבין מי העסק ומה הוא מציע ולהצליב מידע אמין. הדרך המעשית מתחילה באתר ברור ונגיש, ולא בהבטחה להופיע בכל תשובה.",
  "sections": [
    {
      "title": "התחילו משאלות של לקוחות",
      "body": [
        "כתבו בשפה ברורה מה השירות, למי הוא מתאים, מה כלול בתהליך ואיך יוצרים קשר. למשל, בעמוד על מערכת CRM כדאי להסביר אילו פעולות רוצים לנהל, איזה מידע עובר מהמערכת הקיימת ומי יקבל הרשאות. תשובה טובה עוזרת לאדם להחליט אם לפנות.",
        "הציגו פרויקטים לפי מה שבאמת נבנה, וסמנו הדגמות כדוגמאות. פרסמו המלצות רק לאחר קבלתן ואישורן. ציינו מחבר ותאריך עדכון במדריך כאשר התוכן השתנה בפועל."
      ]
    },
    {
      "title": "בדקו שאפשר להגיע לתוכן",
      "body": [
        "פתחו את האתר ללא התחברות ובדקו שהטקסט והקישורים קיימים ב־HTML. לכל עמוד ציבורי צריכה להיות כתובת יציבה, כותרת ותיאור מתאימים ו־canonical תקין. באתר דו־לשוני נדרשות כתובות נפרדות וקישורי hreflang הדדיים.",
        "בדקו את robots.txt, את מפת האתר ואת ההגדרות של שרת האחסון. גישה לסורק תלויה גם בחומת האש. אל תפתחו אזורי ניהול או נתוני לקוחות לצורך אינדוקס; בקרת גישה נשענת על אימות והרשאות."
      ]
    },
    {
      "title": "שמרו על זהות עסקית עקבית",
      "body": [
        "השתמשו באותו שם עסק ובאותם פרטי קשר באתר ובפרופילים הרשמיים. נתוני Schema.org צריכים לתאר בדיוק את המידע הגלוי: העסק, המייסד, השירותים ואזור השירות. אל תוסיפו כתובת, דירוג או שעות פתיחה שאינם קיימים.",
        "llms.txt יכול לרכז מידע וקישורים עבור כלים שבוחרים לקרוא אותו. הוא אינו תקן שמבטיח הופעה ב־AI ואינו תחליף לתוכן האתר. Google מציינת שאין צורך בו לצורך הופעה בחיפוש שלה."
      ]
    },
    {
      "title": "מדדו לפני שמרחיבים",
      "body": [
        "הגישו sitemap ב־Google Search Console וב־Bing Webmaster Tools, ובדקו שגיאות אינדוקס וכתובות שנבחרו כקנוניות. עקבו אחר חשיפות, לחיצות ופניות לאורך זמן. עצם פתיחת האתר לסריקה אינה מבטיחה אינדוקס, דירוג או ציטוט.",
        "ביצועים ונגישות נבדקים במובייל ובמחשב. בדיקת מעבדה מסייעת לאתר בעיות, ואילו Core Web Vitals בפועל מחייבים נתוני משתמשים אמיתיים. הגדירו מראש מה תבדקו שוב לאחר כל שינוי באתר."
      ]
    }
  ],
  "sources": [
    {
      "title": "Google Search — AI optimization guide",
      "url": "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide"
    },
    {
      "title": "OpenAI crawlers",
      "url": "https://developers.openai.com/api/docs/bots"
    },
    {
      "title": "Bing Webmaster Tools",
      "url": "https://www.bing.com/webmasters/about"
    }
  ]
},
  {
    slug: "website-cost-israel",
    title: "מה משפיע על עלות אתר לעסק בישראל",
    excerpt:
      "למה אותה בקשה יכולה להוביל להצעות מחיר שונות מאוד, ואיך להשוות ביניהן בצורה חכמה.",
    date: "2026-08-13",
    modified: "2026-10-29",
    sources: [],
    readingTime: "6 דקות קריאה",
    intro:
      "הצעות מחיר לאתר יכולות לתאר מוצרים שונים: עמוד תדמית, חנות או מערכת עם הרשאות וחיבורים לנתונים. כדי להשוות ביניהן, צריך להתחיל מהיקף העבודה, מתוצרי המסירה ומהתחזוקה, ולא מהסכום בלבד.",
    sections: [
      {
        title: "שלוש שכבות מחיר, לא אחת",
        body: [
          "השוואה מתחילה בסוג הפתרון: אתר שמבוסס על תבנית עם התאמות קלות, אתר בעיצוב ייעודי לעסק, או מערכת שנכתבת בקוד ומשתלבת עם מערכות קיימות. לכל אפשרות רמת מורכבות אחרת, ולכן המחיר נקבע לפי האפיון ולא לפי שם השירות בלבד.",
          "כשמשווים הצעה מהשכבה הראשונה להצעה מהשכבה השלישית ומתייחסים אליהן כאל אותו דבר, ההפרש נראה שרירותי. הוא לא. הוא בדיוק מה שההפרש בין המוצרים.",
        ],
      },
      {
        title: "מה באמת מזיז את המחיר",
        body: [
          "בדקו את היקף העיצוב, מספר העמודים וסוגי התוכן, כתיבה ותרגום, הרשאות, סל קניות וחיבורים למערכות אחרות. גם בדיקות, נגישות והעברת תכנים קיימים דורשים זמן. בקשו לפרט אילו משימות כלולות ומה מתומחר בנפרד.",
          "שאלה שכדאי לשאול כל מציע: מה קורה כשאני רוצה לשנות משהו בעוד שנה. התשובה מגלה יותר על המחיר האמיתי מכל שורה בהצעה.",
        ],
      },
      {
        title: "העלות שאף אחד לא מציג בהצעה",
        body: [
          "אתר הוא לא הוצאה חד-פעמית. חשוב להביא בחשבון גם אחסון, דומיין, גיבויים, אבטחה ותחזוקה שוטפת. העלויות משתנות לפי המערכת, היקף השימוש ורמת השירות הנדרשת.",
          "גם מערכת מבוססת תבנית וגם פיתוח מותאם דורשים עדכונים ובדיקות אבטחה. בקשו הצעת תחזוקה שמפרטת את האחריות לגיבויים, לעדכוני ספריות, לתקלות ולשחזור. עלות התחזוקה תלויה במערכת ובהסכם, ואין טכנולוגיה שפטורה ממנה.",
        ],
      },
      {
        title: "איך להשוות שתי הצעות בלי לנחש",
        body: [
          "בקשו משתי ההצעות לפרט שלושה דברים: מה נבנה בהתאמה ומה מגיע מתבנית, מה כלול בנגישות ובאיזה תקן, ומה עולה שינוי אחרי ההשקה. אם הצעה אחת עונה על השלושה והשנייה לא, כבר לא צריך להשוות מחירים.",
          "בקשו לציין במפורש מה נבדק בנגישות, אילו מגבלות ידועות קיימות ומי מטפל בתיקונים. כך ניתן להשוות תוצרים ואחריות, בנוסף למחיר.",
        ],
      },
    ],
  },
  {
    slug: "website-accessibility-israel",
    title: "נגישות אתרים: מה החוק בישראל באמת דורש ממך",
    excerpt:
      "התקן, למי הוא חל, מה תוסף נגישות פותר ומה הוא לא פותר, ולמה זה לא נגמר בהתקנה.",
    date: "2026-08-13",
    modified: "2026-10-29",
    sources: [{ title: "נגישות אתרי אינטרנט — נציבות שוויון זכויות", url: "https://www.gov.il/he/pages/website_accessibility" }, { title: "W3C — Web Accessibility Initiative", url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/" }],
    readingTime: "5 דקות קריאה",
    intro:
      "הנגישות היא הנושא שבעלי עסקים הכי מופתעים לגלות שהוא חל עליהם, ובדרך כלל מגלים את זה מאוחר. הנה התמונה, בלי הפחדות ובלי הבטחות מוגזמות.",
    sections: [
      {
        title: "מה החוק אומר",
        body: [
          "תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013 מחייבות אתרים שמספקים שירות לציבור לעמוד בתקן הישראלי ת״י 5568, שמבוסס על WCAG ברמה AA.",
          "תחולת החובה, ההקלות והפטורים תלויה בסוג השירות ובנסיבות העסק. מדריך נציבות שוויון זכויות לאנשים עם מוגבלות מפרט את התנאים. לפני קביעה משפטית לגבי עסק מסוים, יש לבדוק את ההנחיות העדכניות ואת המקרה שלו.",
        ],
      },
      {
        title: "מה תוסף נגישות פותר, ומה לא",
        body: [
          "תוסף שמוסיף סרגל עם הגדלת טקסט וניגודיות עוזר לחלק מהמשתמשים, והוא זול ומהיר. מה שהוא לא עושה הוא לתקן את הבעיות שיושבות במבנה העמוד עצמו.",
          "תמונה בלי טקסט חלופי, שדה טופס בלי תווית מקושרת, סדר כותרות שבור, ניגודיות צבע נמוכה בעיצוב, או ניווט שאי אפשר לעבור בו במקלדת — כל אלה נשארים בדיוק כמו שהיו אחרי התקנת התוסף. הם נמצאים בקוד, ורק שינוי בקוד מתקן אותם.",
        ],
      },
      {
        title: "הצהרת הנגישות",
        body: [
          "הצהרת נגישות צריכה לתאר את ההתאמות, המגבלות הידועות ודרך לפנייה בנושא נגישות. פרטי רכז נגישות נדרשים כאשר קיימת חובת מינוי. הנוסח צריך להתאים למצב האתר ולהנחיות הרלוונטיות.",
          "הצהרה גנרית שהועתקה מאתר אחר ולא מתארת את האתר שלכם היא לא הצהרה. במקרה של תלונה היא לא תעזור.",
        ],
      },
      {
        title: "מה לעשות בפועל",
        body: [
          "הדרך הזולה היא לבנות נגיש מההתחלה, כי אז זה כמעט לא מוסיף עלות. הדרך היקרה היא לבנות ואז להנגיש בדיעבד, כי חלק מהתיקונים דורשים לגעת בעיצוב עצמו.",
          "אם כבר יש לכם אתר: הריצו בדיקה אוטומטית, תקנו קודם את מה שהיא מסמנת כחמור וקריטי, ורק אחר כך עברו לבדיקה ידנית עם מקלדת בלבד. שילוב של בדיקה אוטומטית ובדיקה ידנית תופס הרבה יותר מכל אחת מהן לבד.",
        ],
      },
    ],
  },
  {
    slug: "custom-system-or-off-the-shelf",
    title: "מתי כדאי מערכת מותאמת ומתי מספיק פתרון מדף",
    excerpt:
      "מערכת מדף עולה פחות ומתחילה מיד. הנה שלושת הסימנים שבהם היא כבר עולה לכם יותר.",
    date: "2026-08-13",
    modified: "2026-10-29",
    sources: [],
    readingTime: "5 דקות קריאה",
    intro:
      "העצה הכנה לרוב העסקים היא להתחיל עם מערכת מדף. היא זולה, היא עובדת מחר, ומישהו אחר מתחזק אותה. השאלה המעניינת היא מתי היא מפסיקה להשתלם — ולזה יש סימנים ברורים.",
    sections: [
      {
        title: "מתי מערכת מדף היא התשובה הנכונה",
        body: [
          "אם התהליך שלכם דומה לזה של עסקים אחרים בתחום, אם מספר המשתמשים קטן, ואם אתם עדיין משנים את דרך העבודה שלכם — מערכת מדף עדיפה כמעט תמיד.",
          "מערכת מותאמת שנבנית סביב תהליך שעוד לא התייצב היא הדרך היקרה ביותר לגלות שהתהליך היה צריך להשתנות.",
        ],
      },
      {
        title: "שלושת הסימנים שהגיע הזמן",
        body: [
          "הראשון: אתם מעתיקים מידע ידנית בין שתי מערכות באופן קבוע. כל העתקה כזאת היא זמן ששולמתם עליו וטעות שממתינה לקרות.",
          "השני: אתם משלמים על מערכת לפי משתמש, והמחיר החודשי כבר מתקרב לעלות של פיתוח פרוס על שנתיים.",
          "השלישי, והחשוב מכולם: שיניתם את דרך העבודה שלכם כדי להתאים למערכת, במקום ההפך. זה הסימן שהמערכת כבר עולה לכם יותר ממה שהיא חוסכת.",
        ],
      },
      {
        title: "האפשרות שבאמצע",
        body: [
          "לרוב לא צריך לבחור. אפשר להשאיר את מערכת המדף במקום שבה היא טובה, ולכתוב שכבת אוטומציה שמחברת אותה למה שחסר.",
          "כדי לבדוק את הכדאיות, מפו פעולה חוזרת אחת, בדקו אם המערכות מספקות API מתאים והגדירו כיצד מטפלים בשגיאות ובמידע כפול. העלות והחיסכון תלויים בחיבור ובנפח העבודה; כדאי למדוד אותם בניסוי קטן לפני הרחבה.",
        ],
      },
      {
        title: "אם בכל זאת בונים",
        body: [
          "בנו את החלק הכי כואב קודם, והריצו אותו לצד המערכת הקיימת עד שהוא מוכיח את עצמו. אל תעבירו הכול ביום אחד.",
          "וודאו מראש שהמידע שלכם ניתן לייצוא. מערכת שאי אפשר לצאת ממנה היא הסיכון האמיתי, בין אם קניתם אותה ובין אם בניתם אותה.",
        ],
      },
    ],
  },
];

const en: BlogPost[] = [
  {
  "slug": "business-search-ai-visibility",
  "title": "Preparing a business website for search and AI answers",
  "excerpt": "Practical checks for content, crawling, business identity and measurement, including the limits of llms.txt.",
  "date": "2026-10-29",
  "modified": "2026-10-29",
  "readingTime": "4 min read",
  "intro": "A search engine or AI assistant needs to find public content, understand the business and its services, and corroborate reliable information. Start with a clear, accessible website and measurable checks rather than promises of appearing in every answer.",
  "sections": [
    {
      "title": "Answer the questions customers actually ask",
      "body": [
        "Explain the service, who it suits, what the process includes and how to get in touch. For a CRM project, describe the workflows, migration of existing records and access permissions. A useful answer helps someone decide whether to contact you.",
        "Describe projects by what was actually built and label demonstrations as examples. Publish testimonials only after receiving them and obtaining permission. Show an author and a genuine revision date when an article changes."
      ]
    },
    {
      "title": "Make public content reachable",
      "body": [
        "Open the website without signing in and check that text and links are present in HTML. Each public page needs a stable URL, relevant title and description, and a correct canonical. Bilingual sites need separate URLs and reciprocal hreflang links.",
        "Review robots.txt, the sitemap and hosting settings. Firewall rules also affect crawler access. Keep administration and customer data protected by authentication and permissions; indexing is not a reason to expose them."
      ]
    },
    {
      "title": "Keep business identity consistent",
      "body": [
        "Use the same business name and contact details on the website and official profiles. Schema.org data should reflect visible facts: the business, founder, services and service area. Do not add an invented address, rating or opening hours.",
        "An llms.txt file can collect information and links for tools that choose to read it. It does not guarantee inclusion in AI answers or replace HTML. Google says this file is not required for visibility in its search features."
      ]
    },
    {
      "title": "Measure before expanding",
      "body": [
        "Submit the sitemap to Google Search Console and Bing Webmaster Tools. Review indexing errors and selected canonicals, then track impressions, clicks and enquiries over time. Allowing crawling does not guarantee indexing, rankings or citations.",
        "Check performance and accessibility on desktop and mobile. Lab tests help diagnose issues; real Core Web Vitals require field data from actual users. Decide which checks must run after each website change."
      ]
    }
  ],
  "sources": [
    {
      "title": "Google Search — AI optimization guide",
      "url": "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide"
    },
    {
      "title": "OpenAI crawlers",
      "url": "https://developers.openai.com/api/docs/bots"
    },
    {
      "title": "Bing Webmaster Tools",
      "url": "https://www.bing.com/webmasters/about"
    }
  ]
},
  {
    slug: "website-cost-israel",
    title: "What shapes the cost of a business website in Israel",
    excerpt:
      "Why the same brief can attract very different quotes, and how to compare them with confidence.",
    date: "2026-08-13",
    modified: "2026-10-29",
    sources: [],
    readingTime: "6 min read",
    intro:
      "Website quotes can describe different products: a brochure page, an online store, or a system with permissions and data integrations. Compare scope, deliverables and maintenance before comparing the final amount.",
    sections: [
      {
        title: "Three price tiers, not one",
        body: [
          "Start by comparing the type of solution: a template with light customisation, a bespoke design for your business, or a coded system integrated with your existing tools. Each involves a different level of complexity, so pricing follows discovery rather than a service label alone.",
          "Compare a quote from the first tier against one from the third as though they were the same thing and the gap looks arbitrary. It is not. It is exactly the difference between the products.",
        ],
      },
      {
        title: "What actually moves the price",
        body: [
          "Review design scope, page count and content types, writing and translation, permissions, checkout and integrations. Testing, accessibility and content migration also take time. Ask which tasks are included and which are priced separately.",
          "One question worth asking everyone who quotes: what happens when I want to change something a year from now. The answer tells you more about the real cost than any line in the quote.",
        ],
      },
      {
        title: "The cost nobody puts in the quote",
        body: [
          "A website is not a one-off expense. Hosting, domain registration, backups, security and ongoing maintenance should also be considered. Costs vary with the system, usage and service level required.",
          "Template-based and custom-built systems both need updates and security checks. Ask who owns backups, dependency updates, incident response and recovery. Maintenance cost depends on the system and agreement; no technology removes that responsibility.",
        ],
      },
      {
        title: "Comparing two quotes without guessing",
        body: [
          "Ask both quotes to spell out three things: what is custom-built and what comes from a template, what accessibility is included and against which standard, and what a change costs after launch. If one answers all three and the other does not, you no longer have prices to compare.",
          "Ask what accessibility checks are included, which limitations are known, and who handles remediation. That lets you compare deliverables and responsibilities as well as price.",
        ],
      },
    ],
  },
  {
    slug: "website-accessibility-israel",
    title: "Website accessibility: what Israeli law actually requires",
    excerpt:
      "The standard, who it applies to, what an accessibility widget fixes, what it does not, and why it does not end at installation.",
    date: "2026-08-13",
    modified: "2026-10-29",
    sources: [{ title: "Website accessibility — Israeli Commission for Equal Rights", url: "https://www.gov.il/he/pages/website_accessibility" }, { title: "W3C — Web Accessibility Initiative", url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/" }],
    readingTime: "5 min read",
    intro:
      "Accessibility is the requirement business owners are most surprised to learn applies to them, and they usually learn it late. Here is the picture, without scare tactics and without overpromising.",
    sections: [
      {
        title: "What the law says",
        body: [
          "The Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 5773-2013 require websites providing a service to the public to meet the Israeli standard IS 5568, which is based on WCAG level AA.",
          "Applicability, reduced requirements and exemptions depend on the service and business circumstances. The Commission for Equal Rights of Persons with Disabilities publishes the relevant guidance. Check the current requirements and the individual case before making a legal determination.",
        ],
      },
      {
        title: "What a widget fixes, and what it does not",
        body: [
          "A toolbar that adds text resizing and contrast options genuinely helps some users, and it is cheap and fast. What it does not do is repair the problems that sit in the structure of the page itself.",
          "An image with no alternative text, a form field with no associated label, a broken heading order, low colour contrast in the design, or navigation you cannot move through with a keyboard — all of these survive the widget untouched. They live in the code, and only a change to the code fixes them.",
        ],
      },
      {
        title: "The accessibility statement",
        body: [
          "An accessibility statement should describe adjustments, known limitations and a way to report accessibility issues. Coordinator details are required where appointment is mandatory. The statement must reflect the actual site and applicable guidance.",
          "A generic statement copied from another site, describing a site that is not yours, is not a statement. It will not help if a complaint arrives.",
        ],
      },
      {
        title: "What to do in practice",
        body: [
          "The cheap route is building accessibly from the start, where it adds almost nothing to the cost. The expensive route is building first and retrofitting, because some of the fixes reach back into the design itself.",
          "If you already have a site: run an automated scan, fix what it flags as serious and critical first, and only then move to a manual pass using the keyboard alone. Automated and manual testing together catch far more than either does by itself.",
        ],
      },
    ],
  },
  {
    slug: "custom-system-or-off-the-shelf",
    title: "When a custom system is worth it, and when off-the-shelf is enough",
    excerpt:
      "Off-the-shelf costs less and works tomorrow. Here are the three signs it has started costing you more.",
    date: "2026-08-13",
    modified: "2026-10-29",
    sources: [],
    readingTime: "5 min read",
    intro:
      "The honest advice for most businesses is to start with an off-the-shelf system. It is cheap, it works tomorrow, and somebody else maintains it. The interesting question is when it stops paying for itself — and that has clear signs.",
    sections: [
      {
        title: "When off-the-shelf is the right answer",
        body: [
          "If your process resembles other businesses in your field, if the number of users is small, and if you are still changing how you work — off-the-shelf wins almost every time.",
          "A custom system built around a process that has not settled is the most expensive way there is to discover the process needed to change.",
        ],
      },
      {
        title: "The three signs it is time",
        body: [
          "First: you routinely copy information between two systems by hand. Every one of those copies is time you paid for and a mistake waiting to happen.",
          "Second: you pay per user, and the monthly bill is approaching what building it would cost spread over two years.",
          "Third, and the most important: you changed how you work to fit the system rather than the other way round. That is the sign it now costs more than it saves.",
        ],
      },
      {
        title: "The option in the middle",
        body: [
          "Usually you do not have to choose. Leave the off-the-shelf system where it is good, and write an automation layer that connects it to whatever is missing.",
          "To evaluate this option, map one recurring task, check that the systems offer suitable APIs, and define handling for errors and duplicate records. Cost and savings depend on the integration and workload; measure them in a small pilot before expanding.",
        ],
      },
      {
        title: "If you do build",
        body: [
          "Build the most painful part first and run it alongside the existing system until it proves itself. Do not move everything in one day.",
          "And confirm up front that your data can be exported. A system you cannot leave is the real risk, whether you bought it or built it.",
        ],
      },
    ],
  },
];

const posts: Record<Locale, BlogPost[]> = { he, en };

/**
 * The ISO date is what the markup and the sitemap need; it is not what a reader
 * wants to look at. Rendered in UTC so the server and the browser cannot
 * disagree about which day it is.
 */
export function formatPostDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** Newest first, which is the order both the index and the home page want. */
export function getPosts(locale: Locale): BlogPost[] {
  return [...posts[locale]].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(locale: Locale, slug: string): BlogPost | undefined {
  return posts[locale].find((post) => post.slug === slug);
}

/** Every slug, for generateStaticParams and for the sitemap. */
export function getSlugs(locale: Locale): string[] {
  return posts[locale].map((post) => post.slug);
}

/**
 * A slug missing from one language would 404 on that side of the site while
 * working on the other, so the two lists have to stay identical.
 */
export function slugsMatchAcrossLocales(): boolean {
  const [first, ...rest] = locales.map((locale) => getSlugs(locale).sort());
  return rest.every(
    (list) =>
      list.length === first.length &&
      list.every((slug, index) => slug === first[index]),
  );
}
