import LegalContent from "../../../legal-content";
import { getContent } from "@/lib/content";

const copy = getContent("en").privacy;

export const metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: "/en/privacy", languages: { he: "/privacy", en: "/en/privacy" } },
};

export default function EnglishPrivacyPage() {
  return <LegalContent locale="en" document="privacy" />;
}
