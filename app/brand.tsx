import Image from "next/image";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

/** The wordmark, shared by the header, the footer and the policy pages. */
export default function Brand({ locale }: { locale: Locale }) {
  const brand = getContent(locale).brand;

  return (
    <>
      <Image
        className="brand-mark"
        src="/app-icon-192.png"
        alt={`${brand.name} ${brand.suffix}`}
        width={48}
        height={48}
        unoptimized
      />
      <span className="brand-copy" aria-hidden="true">
        <strong>{brand.name}</strong>{" "}
        <small>{brand.suffix}</small>
      </span>
    </>
  );
}
