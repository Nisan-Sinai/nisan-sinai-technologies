import type { Metadata } from "next";
import BlogPost from "../../../../blog-post";
import { buildMetadata } from "../../../../site-shell";
import { getPost, getSlugs } from "@/lib/blog";

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

  return {
    ...base,
    title: post.title,
    description: post.excerpt,
    openGraph: {
      ...base.openGraph,
      title: post.title,
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
