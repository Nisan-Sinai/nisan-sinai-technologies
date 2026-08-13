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
  readingTime: string;
  intro: string;
  sections: BlogSection[];
};

const he: BlogPost[] = [
  {
    slug: "website-cost-israel",
    title: "כמה באמת עולה אתר לעסק בישראל",
    excerpt:
      "למה אותה בקשה מקבלת הצעות של 3,000 ושל 30,000 שקל, ואיך לקרוא את ההפרש הזה בלי לנחש.",
    date: "2026-08-13",
    readingTime: "6 דקות קריאה",
    intro:
      "כמעט כל בעל עסק שפונה אליי כבר קיבל שתי הצעות מחיר שרחוקות זו מזו פי חמישה, ולא ברור לו למה. ההפרש כמעט אף פעם לא נובע מכך שמישהו מנסה לעבוד עליו. הוא נובע מכך ששתי ההצעות מתארות שני מוצרים שונים לגמרי שנקראים באותו שם.",
    sections: [
      {
        title: "שלוש שכבות מחיר, לא אחת",
        body: [
          "בשוק הישראלי ב-2026 יש שלוש שכבות ברורות. תבנית מוכנה שמותאמת מעט נעה בין 1,500 ל-5,000 שקל. אתר מקצועי עם עיצוב שנבנה לעסק נע בין 8,000 ל-15,000. אתר שנכתב בקוד, עם אינטגרציות למערכות שכבר קיימות אצלכם, נע בין 15,000 ל-30,000 ומעלה.",
          "כשמשווים הצעה מהשכבה הראשונה להצעה מהשכבה השלישית ומתייחסים אליהן כאל אותו דבר, ההפרש נראה שרירותי. הוא לא. הוא בדיוק מה שההפרש בין המוצרים.",
        ],
      },
      {
        title: "מה באמת מזיז את המחיר",
        body: [
          "שלושה דברים קובעים את רוב ההפרש: כמה מהעיצוב נבנה עבורכם לעומת נלקח מתבנית, כמה מהאתר צריך לדבר עם מערכות אחרות, וכמה תוכן צריך לכתוב מאפס. מספר העמודים, בניגוד לאינטואיציה, כמעט לא משפיע.",
          "שאלה שכדאי לשאול כל מציע: מה קורה כשאני רוצה לשנות משהו בעוד שנה. התשובה מגלה יותר על המחיר האמיתי מכל שורה בהצעה.",
        ],
      },
      {
        title: "העלות שאף אחד לא מציג בהצעה",
        body: [
          "אתר הוא לא הוצאה חד-פעמית. אחסון, דומיין, גיבויים ותעודת אבטחה מסתכמים ב-100 עד 500 שקל לחודש. חבילת תחזוקה מנוהלת נעה בין 200 ל-450 לחודש.",
          "כאן יש הבדל אמיתי בין הטכנולוגיות: אתר תבנית דורש עדכוני תוספים תכופים, ולכן תחזוקה יקרה יותר לאורך זמן. אתר שנכתב בקוד לא סוחב תוספים של אחרים, ולכן התחזוקה שלו זולה יותר. חלק מההפרש בעלות ההקמה חוזר בשנים שאחריה.",
        ],
      },
      {
        title: "איך להשוות שתי הצעות בלי לנחש",
        body: [
          "בקשו משתי ההצעות לפרט שלושה דברים: מה נבנה בהתאמה ומה מגיע מתבנית, מה כלול בנגישות ובאיזה תקן, ומה עולה שינוי אחרי ההשקה. אם הצעה אחת עונה על השלושה והשנייה לא, כבר לא צריך להשוות מחירים.",
          "והצעה שלא מזכירה נגישות בכלל היא לא ההצעה הזולה. היא ההצעה שהעבירה אליכם סיכון משפטי בלי לומר את זה.",
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
    readingTime: "5 דקות קריאה",
    intro:
      "הנגישות היא הנושא שבעלי עסקים הכי מופתעים לגלות שהוא חל עליהם, ובדרך כלל מגלים את זה מאוחר. הנה התמונה, בלי הפחדות ובלי הבטחות מוגזמות.",
    sections: [
      {
        title: "מה החוק אומר",
        body: [
          "תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013 מחייבות אתרים שמספקים שירות לציבור לעמוד בתקן הישראלי ת״י 5568, שמבוסס על WCAG ברמה AA.",
          "החובה חלה על כמעט כל עסק שיש לו אתר שפונה ללקוחות, כולל אתר תדמית פשוט. זה לא רק לגופים ציבוריים.",
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
          "התקנות דורשות גם הצהרת נגישות באתר: לאיזה תקן הוא עומד, מה עדיין לא נגיש אם יש כזה, ומי רכז הנגישות שאפשר לפנות אליו עם דרך התקשרות אמיתית.",
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
          "זה עולה אלפי שקלים בודדים במקום עשרות אלפים, ופותר את רוב הכאב האמיתי. אצל חלק ניכר מהעסקים שפונים אליי בבקשה למערכת חדשה, זו התשובה הנכונה.",
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
    slug: "website-cost-israel",
    title: "What a business website actually costs in Israel",
    excerpt:
      "Why the same brief comes back quoted at ₪3,000 and at ₪30,000, and how to read that gap without guessing.",
    date: "2026-08-13",
    readingTime: "6 min read",
    intro:
      "Almost every business owner who calls me has already received two quotes that are five times apart, and cannot see why. The gap is almost never someone trying it on. It is that the two quotes describe two completely different products that happen to share a name.",
    sections: [
      {
        title: "Three price tiers, not one",
        body: [
          "The Israeli market in 2026 has three clear tiers. A ready template with light customisation runs ₪1,500 to ₪5,000. A professional site with a design built for the business runs ₪8,000 to ₪15,000. A site written in code, with integrations into systems you already run, runs ₪15,000 to ₪30,000 and up.",
          "Compare a quote from the first tier against one from the third as though they were the same thing and the gap looks arbitrary. It is not. It is exactly the difference between the products.",
        ],
      },
      {
        title: "What actually moves the price",
        body: [
          "Three things account for most of the difference: how much of the design is built for you rather than taken from a template, how much the site has to talk to other systems, and how much content has to be written from nothing. Page count, counter-intuitively, barely matters.",
          "One question worth asking everyone who quotes: what happens when I want to change something a year from now. The answer tells you more about the real cost than any line in the quote.",
        ],
      },
      {
        title: "The cost nobody puts in the quote",
        body: [
          "A website is not a one-off expense. Hosting, domain, backups and a certificate come to ₪100–₪500 a month. A managed maintenance package runs ₪200–₪450 a month.",
          "There is a real difference between technologies here. A template site needs frequent plugin updates, so it costs more to maintain over time. A site written in code carries nobody else's plugins, so maintenance is cheaper. Some of the higher build cost comes back in the years after launch.",
        ],
      },
      {
        title: "Comparing two quotes without guessing",
        body: [
          "Ask both quotes to spell out three things: what is custom-built and what comes from a template, what accessibility is included and against which standard, and what a change costs after launch. If one answers all three and the other does not, you no longer have prices to compare.",
          "And a quote that never mentions accessibility is not the cheap quote. It is the quote that moved a legal risk onto you without saying so.",
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
    readingTime: "5 min read",
    intro:
      "Accessibility is the requirement business owners are most surprised to learn applies to them, and they usually learn it late. Here is the picture, without scare tactics and without overpromising.",
    sections: [
      {
        title: "What the law says",
        body: [
          "The Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 5773-2013 require websites providing a service to the public to meet the Israeli standard IS 5568, which is based on WCAG level AA.",
          "The duty covers almost any business with a customer-facing site, including a simple marketing site. It is not limited to public bodies.",
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
          "The regulations also require a statement on the site: which standard it meets, what is still not accessible if anything, and who the accessibility coordinator is, with a way to actually reach them.",
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
          "That costs a few thousand shekels rather than tens of thousands, and solves most of the actual pain. For a good share of the businesses who come to me asking for a new system, this is the right answer.",
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
