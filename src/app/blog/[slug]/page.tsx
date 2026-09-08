import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownArticle from "@/components/MarkdownArticle";
import { getPublishedPost } from "@/lib/blog";
import { BlogCta, SiteFooter } from "@/components/BlogCta";

export const revalidate = 300;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  return post ? { title: `${post.title} — DiskSift`, description: post.excerpt, alternates: { canonical: `/blog/${post.slug}` } } : {};
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug); if (!post) notFound();
  const url = `https://disksift.com/blog/${post.slug}`;
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, datePublished: post.publishedAt.toISOString(), dateModified: post.updatedAt.toISOString(), mainEntityOfPage: url, author: { "@type": "Person", name: post.authorName, url: "https://disksift.com/authors/prateek-g" }, publisher: { "@type": "Organization", name: "DiskSift", url: "https://disksift.com" } };
  return <main className="article-page" id="top"><nav className="blog-nav shell"><Link className="brand" href="/">DiskSift</Link><Link href="/blog">← All guides</Link></nav><article><header><span>{post.category}</span><h1>{post.title}</h1><p>{post.excerpt}</p><div>By <Link href="/authors/prateek-g">{post.authorName}</Link> · <time>{post.publishedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time></div></header><MarkdownArticle source={post.body} /></article><div className="shell"><BlogCta /></div><SiteFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /></main>;
}
