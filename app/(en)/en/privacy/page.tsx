import LegalContent from "../../../legal-content";
import { buildMetadata } from "../../../site-shell";
import { getContent } from "@/lib/content";

const copy = getContent("en").privacy;

const base = buildMetadata("en", "/privacy");

export const metadata = {
  ...base,
  title: copy.metaTitle,
  description: copy.metaDescription,
  openGraph: {
    ...base.openGraph,
    title: copy.metaTitle,
    description: copy.metaDescription,
  },
};

export default function EnglishPrivacyPage() {
  return <LegalContent locale="en" document="privacy" />;
}
