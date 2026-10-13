import BlogIndex from "../../../blog-index";
import { buildMetadata } from "../../../site-shell";
import { getContent } from "@/lib/content";

const copy = getContent("en").blog;

const base = buildMetadata("en", "/blog");
const title = "Web & software guides | Nisan Sinai Technologies";

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
  return <BlogIndex locale="en" />;
}
