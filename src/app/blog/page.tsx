import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = { title: "Mac Storage Guides — DiskSift", description: "Practical, privacy-conscious guides for understanding and cleaning up Mac storage." };
export const revalidate = 300;
export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <main className="blog-page"><nav className="blog-nav shell"><a className="brand" href="/">DiskSift</a><div><a href="/">Product</a><a href="/feed.xml">RSS</a><a className="nav-cta" href="/downloads/DiskSift.dmg">Download</a></div></nav><header className="blog-hero shell"><div className="section-kicker">DISKSIFT FIELD NOTES</div><h1>Make sense of your Mac.</h1><p>Clear, tested guidance for finding what consumes storage and deciding what is safe to remove.</p></header><section className="blog-grid shell">{posts.length ? posts.map(post => <article key={post.id}><span>{post.category}</span><h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2><p>{post.excerpt}</p><footer><a href="/authors/prateek-g">{post.authorName}</a><time>{post.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time></footer></article>) : <div className="blog-empty"><h2>Guides are being prepared.</h2><p>Our first practical Mac storage guides will appear here after editorial review.</p></div>}</section></main>;
}
