import Brand from "./brand";
import ExternalLink from "./external-link";
import { contact, getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Shared by the home page and the policy pages: the accessibility statement
 * has to be reachable from every page, not only from the one that links to it.
 */
export default function SiteFooter({ locale }: { locale: Locale }) {
  const t = getContent(locale);
  const adminLabel = locale === "he" ? "כניסה לניהול" : "Admin login";

  return (
    <footer className="site-footer">
      <a
        className="brand footer-brand"
        href={localePath(locale, "/")}
        aria-label={t.brand.topAria}
      >
        <Brand locale={locale} />
      </a>
      <p>{t.footer.tagline}</p>
      <nav aria-label={t.footer.navAria}>
        <a href={`mailto:${contact.email}`}>{t.footer.email}</a>
        <a href={`tel:${contact.phoneHref}`}>{t.footer.phone}</a>
        <ExternalLink href="https://www.linkedin.com/in/nisansinai" hint={t.newTabHint}>
          <span lang="en">LinkedIn</span>
        </ExternalLink>
        <a href={localePath(locale, "/privacy")}>{t.footer.privacy}</a>
        <a href={localePath(locale, "/accessibility")}>{t.footer.accessibility}</a>
        <a className="admin-entry-link" href="/admin" aria-label={adminLabel}>
          {adminLabel}
        </a>
      </nav>
      <small>{t.footer.rights}</small>
    </footer>
  );
}
