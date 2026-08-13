import Link from "next/link";
import LatinText from "./latin-text";
import SiteFooter from "./site-footer";
import { getContent } from "@/lib/content";
import { formatPostDate, getPosts } from "@/lib/blog";
import { forwardArrow, localePath, type Locale } from "@/lib/i18n";

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
