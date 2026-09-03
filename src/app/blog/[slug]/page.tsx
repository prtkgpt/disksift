import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownArticle from "@/components/MarkdownArticle";
import { getPublishedPost } from "@/lib/blog";

export const revalidate = 300;
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPublishedPost(params.slug);
  return post ? { title: `${post.title} — DiskSift`, description: post.excerpt, alternates: { canonical: `/blog/${post.slug}` } } : {};
}
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await getPublishedPost(params.slug); if (!post) notFound();
  const url = `https://disksift.com/blog/${post.slug}`;
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, datePublished: post.publishedAt.toISOString(), dateModified: post.updatedAt.toISOString(), mainEntityOfPage: url, author: { "@type": "Person", name: post.authorName, url: "https://disksift.com/authors/prateek-g" }, publisher: { "@type": "Organization", name: "DiskSift", url: "https://disksift.com" } };
  return <main className="article-page"><nav className="blog-nav shell"><a className="brand" href="/">DiskSift</a><a href="/blog">← All guides</a></nav><article><header><span>{post.category}</span><h1>{post.title}</h1><p>{post.excerpt}</p><div>By <a href="/authors/prateek-g">{post.authorName}</a> · <time>{post.publishedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time></div></header><MarkdownArticle source={post.body} /></article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /></main>;
}
