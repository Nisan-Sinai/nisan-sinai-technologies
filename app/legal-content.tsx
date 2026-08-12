import Link from "next/link";
import LatinText from "./latin-text";
import SiteFooter from "./site-footer";
import { contact, getContent } from "@/lib/content";
import { splitOnEmailToken } from "@/lib/rich-text";
import { forwardArrow, localePath, type Locale } from "@/lib/i18n";

/** Policy prose carries an {email} token so the address stays a real link. */
function Prose({ text }: { text: string }) {
  return (
    <p>
      {splitOnEmailToken(text).map((segment, index) =>
        segment.type === "email" ? (
          <a href={`mailto:${contact.email}`} key={index} lang="en">
            {contact.email}
          </a>
        ) : (
          <LatinText key={index} text={segment.value} />
        ),
      )}
    </p>
  );
}

/**
 * The privacy policy and the accessibility statement are the same document
 * shape, so they share a renderer. Both carry the site footer, which is what
 * makes the accessibility statement reachable from anywhere on the site.
 */
export default function LegalContent({
  locale,
  document,
}: {
  locale: Locale;
  document: "privacy" | "accessibility";
}) {
  const t = getContent(locale);
  const page = t[document];

  return (
    <>
      <a className="skip-link" href="#legal-content">
        {t.skipLink}
      </a>

      <main className="legal-page" id="legal-content">
        <Link className="legal-back" href={localePath(locale, "/")}>
          {page.back} <span aria-hidden="true">{forwardArrow(locale)}</span>
        </Link>

        <article>
          <span className="section-kicker">{page.kicker}</span>
          <h1>{page.title}</h1>
          <p className="legal-updated">{page.updated}</p>
          <p className="legal-intro">{page.intro}</p>

          {page.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.body ? <Prose text={section.body} /> : null}
              {section.items ? (
                <ul className="legal-list">
                  {section.items.map((item) => (
                    <li key={item}>
                      <LatinText text={item} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
