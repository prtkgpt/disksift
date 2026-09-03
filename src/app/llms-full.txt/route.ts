import { getPublishedPosts } from "@/lib/blog";
export async function GET() {
  const posts = await getPublishedPosts();
  const articles = posts.map(post => `\n---\n\n# ${post.title}\n\nAuthor: ${post.authorName}\nPublished: ${post.publishedAt.toISOString()}\nURL: https://disksift.com/blog/${post.slug}\n\n${post.excerpt}\n\n${post.body}`).join("\n");
  return new Response(`# DiskSift — full content\n\nDiskSift is a native, Apple-notarized Mac storage analyzer. It scans locally and does not upload filenames, paths, file contents, folder structures, duplicate fingerprints, or scan results. The free edition provides storage analysis and manual cleanup actions. DiskSift Pro is planned as a $19.99 one-time purchase for up to three personal Macs. DiskSift for iPhone is coming soon.\n${articles}`, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300" } });
}
