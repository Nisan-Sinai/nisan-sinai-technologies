import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

/** The wordmark, shared by the header, the footer and the policy pages. */
export default function Brand({ locale }: { locale: Locale }) {
  const brand = getContent(locale).brand;

  return (
    <>
      <span className="brand-mark" aria-hidden="true">
        NS<span>.</span>
      </span>
      <span className="brand-copy">
        <strong>{brand.name}</strong>
        <small>{brand.suffix}</small>
      </span>
    </>
  );
}
