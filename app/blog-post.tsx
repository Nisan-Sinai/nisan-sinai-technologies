import Link from "next/link";
import { notFound } from "next/navigation";
import LatinText from "./latin-text";
import SiteFooter from "./site-footer";
import { getContent } from "@/lib/content";
import { formatPostDate, getPost } from "@/lib/blog";
import { forwardArrow, localePath, type Locale } from "@/lib/i18n";

const ARTICLE_CONTEXT: Record<Locale, string> = {
  he: "הדוגמאות במדריך נועדו לעזור לכם לשאול שאלות מדויקות יותר ולהשוות חלופות לפי הצורך העסקי, העלות והתחזוקה לאורך זמן.",
  en: "The examples in this guide are intended to help you ask better questions and compare options by business need, cost and long-term maintenance.",
};

export default function BlogPost({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const t = getContent(locale);
  const post = getPost(locale, slug);
  if (!post) notFound();

  return (
    <>
      <a className="skip-link" href="#post-content">
        {t.skipLink}
      </a>

      <main className="legal-page" id="post-content">
        <Link className="legal-back" href={localePath(locale, "/blog")}>
          {t.blog.back} <span aria-hidden="true">{forwardArrow(locale)}</span>
        </Link>

        <article>
          <span className="section-kicker">{t.blog.kicker}</span>
          <h1>
            <LatinText text={post.title} />
          </h1>
          <p className="post-meta legal-updated">
            <time dateTime={post.date}>{formatPostDate(locale, post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
          </p>
          <p className="legal-intro">
            <LatinText text={post.intro} />
          </p>
          <p>
            <LatinText text={ARTICLE_CONTEXT[locale]} />
          </p>

          {post.sections.map((section) => (
            <section key={section.title}>
              <h2>
                <LatinText text={section.title} />
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>
                  <LatinText text={paragraph} />
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
