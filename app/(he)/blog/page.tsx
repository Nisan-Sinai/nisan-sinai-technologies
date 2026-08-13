import BlogIndex from "../../blog-index";
import { buildMetadata } from "../../site-shell";
import { getContent } from "@/lib/content";

const copy = getContent("he").blog;

const base = buildMetadata("he", "/blog");

export const metadata = {
  ...base,
  title: copy.indexTitle,
  description: copy.indexDescription,
  openGraph: {
    ...base.openGraph,
    title: copy.indexTitle,
    description: copy.indexDescription,
  },
};

export default function BlogPage() {
  return <BlogIndex locale="he" />;
}
