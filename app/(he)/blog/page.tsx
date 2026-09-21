import BlogIndex from "../../blog-index";
import { buildMetadata } from "../../site-shell";
import { getContent } from "@/lib/content";

const copy = getContent("he").blog;

const base = buildMetadata("he", "/blog");
const title = "מדריכים לפיתוח אתרים ומערכות | ניסן סיני טכנולוגיות";

export const metadata = {
  ...base,
  title: { absolute: title },
  description: copy.indexDescription,
  openGraph: {
    ...base.openGraph,
    title,
    description: copy.indexDescription,
  },
};

export default function BlogPage() {
  return <BlogIndex locale="he" />;
}
