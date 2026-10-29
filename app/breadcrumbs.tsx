import { buildBreadcrumbStructuredData } from "@/lib/structured-data";
import { resolveSiteUrl } from "@/lib/site-url";
import type { Locale } from "@/lib/i18n";

export default function Breadcrumbs({ locale, items }: {
  locale: Locale;
  items: { name: string; path: string }[];
}) {
  return (
    <>
      <nav className="breadcrumbs" aria-label={locale === "he" ? "נתיב ניווט" : "Breadcrumb"}>
        <ol>
          {items.map((item, index) => (
            <li key={item.path}>
              {index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <a href={item.path}>{item.name}</a>}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildBreadcrumbStructuredData(resolveSiteUrl(), items)).replace(/</g, "\\u003c"),
      }} />
    </>
  );
}
