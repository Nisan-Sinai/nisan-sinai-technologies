import BlogIndex from "../../blog-index";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { getContent } from "@/lib/content";

const copy = getContent("he").blog;

export const metadata = buildPageMetadata("he", "/blog", "מדריכים לפיתוח אתרים ומערכות | ניסן סיני טכנולוגיות", copy.indexDescription);

export default function BlogPage() {
  return <BlogIndex locale="he" />;
}
