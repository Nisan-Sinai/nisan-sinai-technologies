import { buildStructuredData } from "@/lib/structured-data";
import type { Locale } from "@/lib/i18n";
import { siteUrl } from "./site-shell";

export default function StructuredData({ locale }: { locale: Locale }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own dictionary, never from user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildStructuredData(locale, siteUrl.toString())),
      }}
    />
  );
}
