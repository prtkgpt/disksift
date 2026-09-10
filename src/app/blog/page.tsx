import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog";
import { BlogCta, SiteFooter } from "@/components/BlogCta";

export const metadata: Metadata = {
  title: "Mac Storage Help: Safe, Simple Cleanup Guides — DiskSift",
  description: "Plain-English guides for a full Mac: find large files, understand System Data, review duplicates, and free storage without deleting important files.",
  alternates: { canonical: "/blog" },
  openGraph: { type:"website", url:"/blog", title:"Mac Storage Help — DiskSift", description:"Safe, practical answers for Mac storage problems." },
};
export const revalidate = 300;
export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <main className="blog-page" id="top"><nav className="blog-nav shell"><Link className="brand" href="/">DiskSift</Link><div><Link href="/">Product</Link><a href="/feed.xml">RSS</a><a className="nav-cta" href="/downloads/DiskSift.dmg">Download</a></div></nav><header className="blog-hero shell"><div className="section-kicker">PLAIN-ENGLISH MAC STORAGE HELP</div><h1>Your Mac is full.<br/>Let&apos;s find out why.</h1><p>Practical answers for everyday Mac owners—find the files using your storage, understand what is safe to remove, and avoid damaging important data.</p></header><section className="blog-grid shell">{posts.length ? posts.map(post => <article key={post.id}><span>{post.category}</span><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><footer><Link href="/authors/prateek-g">{post.authorName}</Link><time>{post.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time></footer></article>) : <div className="blog-empty"><h2>Guides are being prepared.</h2><p>Our first practical Mac storage guides will appear here after editorial review.</p></div>}</section><div className="shell"><BlogCta /></div><SiteFooter /></main>;
}
