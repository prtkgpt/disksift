import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownArticle from "@/components/MarkdownArticle";
import { getPublishedPost, getRelatedPosts } from "@/lib/blog";
import { BlogCta, SiteFooter } from "@/components/BlogCta";

export const revalidate = 300;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  return post ? {
    title: `${post.title} — DiskSift`, description:post.excerpt, keywords:post.tags,
    alternates: { canonical:`/blog/${post.slug}` },
    openGraph: { type:"article", url:`/blog/${post.slug}`, title:post.title, description:post.excerpt, publishedTime:post.publishedAt.toISOString(), modifiedTime:post.updatedAt.toISOString(), authors:[post.authorName] },
    twitter: { card:"summary", title:post.title, description:post.excerpt },
  } : {};
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug); if (!post) notFound();
  const related = await getRelatedPosts(post.category, post.slug);
  const url = `https://www.disksift.com/blog/${post.slug}`;
  const jsonLd = [
    { "@context":"https://schema.org", "@type":"Article", headline:post.title, description:post.excerpt, datePublished:post.publishedAt.toISOString(), dateModified:post.updatedAt.toISOString(), mainEntityOfPage:url, author:{ "@type":"Person", name:post.authorName, url:"https://www.disksift.com/authors/prateek-g" }, publisher:{ "@type":"Organization", name:"DiskSift", url:"https://www.disksift.com" } },
    { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[{ "@type":"ListItem", position:1, name:"DiskSift", item:"https://www.disksift.com" },{ "@type":"ListItem", position:2, name:"Mac Storage Guides", item:"https://www.disksift.com/blog" },{ "@type":"ListItem", position:3, name:post.title, item:url }] },
  ];
  return <main className="article-page" id="top"><nav className="blog-nav shell"><Link className="brand" href="/">DiskSift</Link><Link href="/blog">← All guides</Link></nav><article><header><span>{post.category}</span><h1>{post.title}</h1><p>{post.excerpt}</p><div>By <Link href="/authors/prateek-g">{post.authorName}</Link> · <time>{post.publishedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time></div></header><MarkdownArticle source={post.body} /></article>{related.length > 0 && <section className="related-guides shell"><div className="section-kicker">KEEP READING</div><h2>Related guides</h2><div>{related.map(item=><article key={item.id}><span>{item.category}</span><h3><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3><p>{item.excerpt}</p></article>)}</div></section>}<div className="shell"><BlogCta /></div><SiteFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /></main>;
}
