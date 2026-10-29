import { founderProfile } from "@/lib/business";
import LanguageSwitch from "./language-switch";
import Breadcrumbs from "./breadcrumbs";
import Link from "next/link";
import { notFound } from "next/navigation";
import LatinText from "./latin-text";
import SiteFooter from "./site-footer";
import { getContent } from "@/lib/content";
import { formatPostDate, getPost, getPosts } from "@/lib/blog";
import { forwardArrow, localePath, type Locale } from "@/lib/i18n";
import { buildArticleStructuredData } from "@/lib/structured-data";
import { resolveSiteUrl } from "@/lib/site-url";

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

        <div className="article-tools">
          <LanguageSwitch locale={locale} path={`/blog/${post.slug}`} />
        </div>
        <Breadcrumbs locale={locale} items={[
          { name: `${t.brand.name} ${t.brand.suffix}`, path: localePath(locale, "/") },
          { name: t.blog.kicker, path: localePath(locale, "/blog") },
          { name: post.title, path: localePath(locale, `/blog/${post.slug}`) },
        ]} />
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
          <p className="article-byline">
            {locale === "he" ? "מאת " : "By "}<a href={founderProfile} rel="author">{t.brand.name}</a>
            {" · "}{locale === "he" ? "עודכן: " : "Updated: "}
            <time dateTime={post.modified}>{formatPostDate(locale, post.modified)}</time>
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
          {post.sources.length > 0 && (
            <section aria-labelledby="article-sources">
              <h2 id="article-sources">{locale === "he" ? "מקורות לקריאה נוספת" : "Sources and further reading"}</h2>
              <ul className="legal-list">
                {post.sources.map((source) => <li key={source.url}><a href={source.url}><LatinText text={source.title} /></a></li>)}
              </ul>
            </section>
          )}
        </article>
        <aside className="article-related" aria-labelledby="related-title">
          <h2 id="related-title">{locale === "he" ? "מדריכים נוספים" : "Related guides"}</h2>
          <ul className="legal-list">
            {getPosts(locale).filter((related) => related.slug !== slug).map((related) => (
              <li key={related.slug}><Link href={localePath(locale, `/blog/${related.slug}`)}><LatinText text={related.title} /></Link></li>
            ))}
          </ul>
          <Link href={`${localePath(locale, "/")}#contact`}>{t.nav.cta}</Link>
        </aside>
      </main>

      <SiteFooter locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildArticleStructuredData(locale, resolveSiteUrl(), post))
            .replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
