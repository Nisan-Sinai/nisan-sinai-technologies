import LegalContent from "../../../legal-content";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { getContent } from "@/lib/content";

const copy = getContent("en").privacy;

export const metadata = buildPageMetadata("en", "/privacy", copy.metaTitle, copy.metaDescription);

export default function EnglishPrivacyPage() {
  return <LegalContent locale="en" document="privacy" />;
}
