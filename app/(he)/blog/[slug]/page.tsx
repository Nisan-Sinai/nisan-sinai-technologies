import type { Metadata } from "next";
import BlogPost from "../../../blog-post";
import { buildArticleMetadata } from "@/lib/seo-metadata";
import { notFound } from "next/navigation";
import { getPost, getSlugs } from "@/lib/blog";

export function generateStaticParams() {
  return getSlugs("he").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("he", slug);
  if (!post) notFound();
  return buildArticleMetadata("he", post);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPost locale="he" slug={slug} />;
}
