import { getPublishedPosts } from "@/lib/blog";
import Link from "next/link";
export const metadata = { title: "Prateek G. — DiskSift" };
export default async function AuthorPage() {
  const posts = (await getPublishedPosts()).filter(post => post.authorName === "Prateek G.");
  return <main className="author-page shell"><Link className="brand" href="/">DiskSift</Link><section><div className="author-avatar">PG</div><div><div className="section-kicker">AUTHOR</div><h1>Prateek G.</h1><p>Founder and builder of DiskSift. Prateek writes practical guides about understanding and managing Mac storage.</p></div></section><h2>Articles</h2>{posts.map(post => <article key={post.id}><Link href={`/blog/${post.slug}`}>{post.title}</Link><span>{post.category}</span></article>)}</main>;
}
