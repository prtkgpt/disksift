import { getPublishedPosts } from "@/lib/blog";
const xml = (value: string) => value.replace(/[<>&'\"]/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[char]!));
export async function GET() {
  const posts = await getPublishedPosts();
  const items = posts.map(post => `<item><title>${xml(post.title)}</title><link>https://disksift.com/blog/${post.slug}</link><guid>https://disksift.com/blog/${post.slug}</guid><description>${xml(post.excerpt)}</description><pubDate>${post.publishedAt.toUTCString()}</pubDate><author>hello@disksift.com (${xml(post.authorName)})</author></item>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>DiskSift Field Notes</title><link>https://disksift.com/blog</link><description>Practical Mac storage guides.</description>${items}</channel></rss>`, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
