import Link from "next/link";
import { getPost } from "@/lib/blog";
import { serviceArea } from "@/lib/business";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { buildPageMetadata, siteUrl } from "@/lib/seo-metadata";
import { servicePath, services, type ServiceSlug } from "@/lib/services";
import Breadcrumbs from "./breadcrumbs";
import LanguageSwitch from "./language-switch";
import LatinText from "./latin-text";
import SiteFooter from "./site-footer";

export function buildServiceMetadata(locale: Locale, slug: ServiceSlug) {
  const { title, description } = services[slug][locale];
  const { brand } = getContent(locale);
  return buildPageMetadata(locale, servicePath(slug), `${title} | ${brand.name} ${brand.suffix}`, description);
}

export default function ServicePage({ locale, slug }: { locale: Locale; slug: ServiceSlug }) {
  const t = getContent(locale);
  const service = services[slug];
  const { title, description, sections } = service[locale];
  const home = localePath(locale, "/");
  const path = servicePath(slug);
  const url = new URL(localePath(locale, path), siteUrl).href;
  const project = t.projects.items[service.project];
  const guide = getPost(locale, service.guide);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    url,
    name: title,
    description,
    provider: {
      "@type": "ProfessionalService",
      "@id": new URL("/#business", siteUrl).href,
      name: `${t.brand.name} ${t.brand.suffix}`,
      url: new URL("/", siteUrl).href,
    },
    areaServed: serviceArea,
  };

  return (
    <>
      <a className="skip-link" href="#service-content">{t.skipLink}</a>
      <main className="legal-page" id="service-content">
        <div className="article-tools"><LanguageSwitch locale={locale} path={path} /></div>
        <Breadcrumbs locale={locale} items={[
          { name: `${t.brand.name} ${t.brand.suffix}`, path: home },
          { name: title, path: localePath(locale, path) },
        ]} />
        <h1>{title}</h1>
        <p className="legal-intro"><LatinText text={description} /></p>
        <Link className="button button-primary" href={`${home}#contact`}>{t.nav.cta}</Link>
        {sections.map(({ heading, text }) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <p><LatinText text={text} /></p>
          </section>
        ))}
        <section aria-labelledby="service-project">
          <h2 id="service-project">{locale === "he" ? "דוגמה מתיק העבודות" : "Example from the portfolio"}</h2>
          <h3><LatinText text={project.title} /></h3>
          <p><LatinText text={project.description} /></p>
          <Link href={`${home}#projects`}>{t.nav.projects}</Link>
        </section>
        {guide && (
          <aside className="article-related" aria-labelledby="service-guide">
            <h2 id="service-guide">{locale === "he" ? "מדריך לפני שמתחילים" : "A guide before you start"}</h2>
            <p><Link href={localePath(locale, `/blog/${guide.slug}`)}><LatinText text={guide.title} /></Link></p>
          </aside>
        )}
      </main>
      <SiteFooter locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }} />
    </>
  );
}
