import type { Metadata } from "next";
import BlogPost from "../../../../blog-post";
import { buildMetadata } from "../../../../site-shell";
import { getPost, getSlugs } from "@/lib/blog";

const SEO_TITLES: Record<string, string> = {
  "custom-system-or-off-the-shelf": "Custom system or off-the-shelf: when to choose each",
};

export function generateStaticParams() {
  return getSlugs("en").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("en", slug);
  const base = buildMetadata("en", `/blog/${slug}`);
  if (!post) return base;
  const title = SEO_TITLES[slug] ?? post.title;

  return {
    ...base,
    title: { absolute: title },
    description: post.excerpt,
    openGraph: {
      ...base.openGraph,
      title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPost locale="en" slug={slug} />;
}
