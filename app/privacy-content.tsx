import Link from "next/link";
import { getContent } from "@/lib/content";
import { forwardArrow, localePath, type Locale } from "@/lib/i18n";

export default function PrivacyContent({ locale }: { locale: Locale }) {
  const t = getContent(locale).privacy;

  return (
    <main className="legal-page">
      <Link className="legal-back" href={localePath(locale, "/")}>
        {t.back} <span aria-hidden="true">{forwardArrow(locale)}</span>
      </Link>
      <article>
        <span className="section-kicker">{t.kicker}</span>
        <h1>{t.title}</h1>
        <p className="legal-updated">{t.updated}</p>

        {t.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>
    </main>
  );
}
