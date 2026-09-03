import { getPublishedPosts } from "@/lib/blog";
export const metadata = { title: "Prateek G. — DiskSift" };
export default async function AuthorPage() {
  const posts = (await getPublishedPosts()).filter(post => post.authorName === "Prateek G.");
  return <main className="author-page shell"><a className="brand" href="/">DiskSift</a><section><div className="author-avatar">PG</div><div><div className="section-kicker">AUTHOR</div><h1>Prateek G.</h1><p>Founder and builder of DiskSift. Prateek writes practical guides about understanding and managing Mac storage.</p></div></section><h2>Articles</h2>{posts.map(post => <article key={post.id}><a href={`/blog/${post.slug}`}>{post.title}</a><span>{post.category}</span></article>)}</main>;
}
