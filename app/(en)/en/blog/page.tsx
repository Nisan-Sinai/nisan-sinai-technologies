import BlogIndex from "../../../blog-index";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { getContent } from "@/lib/content";

const copy = getContent("en").blog;

export const metadata = buildPageMetadata("en", "/blog", "Web & software guides | Nisan Sinai Technologies", copy.indexDescription);

export default function BlogPage() {
  return <BlogIndex locale="en" />;
}
