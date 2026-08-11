import { getContent } from "@/lib/content";
import { alternateLocale, localePath, type Locale } from "@/lib/i18n";

/**
 * Sends the visitor to the same page in the other language. The two locales
 * have separate root layouts, so this is a plain anchor: the document has to
 * reload to pick up the new lang and dir.
 */
export default function LanguageSwitch({
  locale,
  path = "/",
}: {
  locale: Locale;
  path?: string;
}) {
  const other = alternateLocale(locale);
  const copy = getContent(locale).languageSwitch;

  return (
    <a
      className="language-switch"
      href={localePath(other, path)}
      lang={other}
      hrefLang={other}
      aria-label={copy.aria}
      title={copy.toName}
    >
      {copy.label}
    </a>
  );
}
