import LegalContent from "../../legal-content";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { getContent } from "@/lib/content";

const copy = getContent("he").privacy;

export const metadata = buildPageMetadata("he", "/privacy", copy.metaTitle, copy.metaDescription);

export default function PrivacyPage() {
  return <LegalContent locale="he" document="privacy" />;
}
