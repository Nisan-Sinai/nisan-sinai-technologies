import Link from "next/link";
import LatinText from "./latin-text";
import SiteFooter from "./site-footer";
import { getContent } from "@/lib/content";
import { formatPostDate, getPosts } from "@/lib/blog";
import { forwardArrow, localePath, type Locale } from "@/lib/i18n";

const BLOG_CONTEXT: Record<Locale, readonly string[]> = {
  he: [
    "בעמוד הזה ריכזתי מדריכים מעשיים לבעלי עסקים שרוצים להבין טוב יותר מה הם מקבלים כשבונים אתר, מערכת CRM או ERP, אוטומציה או פתרון תוכנה מותאם. המטרה היא לפרק החלטות טכנולוגיות לשאלות שאפשר לבדוק בפועל: מה משפיע על המחיר, מה כדאי לדרוש מספק, איך להבדיל בין פתרון מדף למערכת מותאמת, ואילו דרישות של אבטחה ונגישות צריך לקחת בחשבון כבר בשלב התכנון ולא רק אחרי העלייה לאוויר.",
    "כל מדריך נכתב כדי לעזור לפני שיחת אפיון, קבלת הצעת מחיר או שינוי מערכת קיימת. במקום רשימות כלליות של יתרונות וחסרונות, הדגש הוא על סימנים מעשיים, עלויות נסתרות, תחזוקה לטווח ארוך והחלטות שמשפיעות על העסק גם אחרי ההשקה. אפשר להתחיל מהנושא שהכי קרוב לצורך שלכם כרגע, ולהשתמש בשאלות ובדוגמאות שבמאמרים כבסיס לשיחה מסודרת עם מפתח, ספק תוכנה או צוות פנימי.",
  ],
  en: [
    "This page collects practical guides for business owners who want to understand what they are really buying when they commission a website, CRM or ERP system, automation, or custom software. The aim is to turn technical choices into questions you can verify: what drives cost, what a supplier should specify, when an off-the-shelf product is enough, when custom development becomes worthwhile, and which accessibility, security and maintenance requirements should be planned before launch rather than patched in later.",
    "Each guide is written to be useful before a discovery call, a quotation, or a change to an existing system. Instead of generic lists of pros and cons, the focus is on practical signals, hidden costs, long-term maintenance and decisions that still matter months after launch. Start with the topic closest to your current need and use the examples and questions in the articles as a checklist for a clearer conversation with a developer, software vendor or internal team.",
  ],
};

/** The list of posts. Same page furniture as the policy pages. */
export default function BlogIndex({ locale }: { locale: Locale }) {
  const t = getContent(locale);
  const posts = getPosts(locale);
  const arrow = forwardArrow(locale);

  return (
    <>
      <a className="skip-link" href="#blog-content">
        {t.skipLink}
      </a>

      <main className="legal-page" id="blog-content">
        <Link className="legal-back" href={localePath(locale, "/")}>
          {t.privacy.back} <span aria-hidden="true">{arrow}</span>
        </Link>

        <span className="section-kicker">{t.blog.kicker}</span>
        <h1>{t.blog.indexTitle}</h1>
        <p className="legal-intro">{t.blog.lead}</p>
        {BLOG_CONTEXT[locale].map((paragraph) => (
          <p key={paragraph}>
            <LatinText text={paragraph} />
          </p>
        ))}

        {posts.length === 0 ? (
          <p>{t.blog.empty}</p>
        ) : (
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="post-card">
                  <h2>
                    <Link href={localePath(locale, `/blog/${post.slug}`)}>
                      <LatinText text={post.title} />
                    </Link>
                  </h2>
                  <p className="post-meta">
                    <time dateTime={post.date}>{formatPostDate(locale, post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime}</span>
                  </p>
                  <p className="post-excerpt">
                    <LatinText text={post.excerpt} />
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
