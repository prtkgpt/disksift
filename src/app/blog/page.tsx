import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog";
import { BlogCta, SiteFooter } from "@/components/BlogCta";

export const metadata: Metadata = { title: "Mac Storage Guides — DiskSift", description: "Practical, privacy-conscious guides for understanding and cleaning up Mac storage." };
export const revalidate = 300;
export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <main className="blog-page" id="top"><nav className="blog-nav shell"><Link className="brand" href="/">DiskSift</Link><div><Link href="/">Product</Link><a href="/feed.xml">RSS</a><a className="nav-cta" href="/downloads/DiskSift.dmg">Download</a></div></nav><header className="blog-hero shell"><div className="section-kicker">DISKSIFT FIELD NOTES</div><h1>Make sense of your Mac.</h1><p>Clear, tested guidance for finding what consumes storage and deciding what is safe to remove.</p></header><section className="blog-grid shell">{posts.length ? posts.map(post => <article key={post.id}><span>{post.category}</span><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><footer><Link href="/authors/prateek-g">{post.authorName}</Link><time>{post.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time></footer></article>) : <div className="blog-empty"><h2>Guides are being prepared.</h2><p>Our first practical Mac storage guides will appear here after editorial review.</p></div>}</section><div className="shell"><BlogCta /></div><SiteFooter /></main>;
}
