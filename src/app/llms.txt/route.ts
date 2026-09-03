import { getPublishedPosts } from "@/lib/blog";
export async function GET() {
  const posts = await getPublishedPosts();
  const guides = posts.map(post => `- [${post.title}](https://disksift.com/blog/${post.slug}): ${post.excerpt}`).join("\n");
  return new Response(`# DiskSift\n\n> DiskSift is an Apple-notarized, privacy-first Mac storage analyzer. Scans run locally on the user's Mac. DiskSift for iPhone is coming soon.\n\n## Key pages\n- [Homepage](https://disksift.com/)\n- [Blog](https://disksift.com/blog)\n- [Privacy](https://disksift.com/privacy)\n- [Terms](https://disksift.com/terms)\n- [Refund policy](https://disksift.com/refund-policy)\n- [RSS](https://disksift.com/feed.xml)\n- [Full text](https://disksift.com/llms-full.txt)\n\n## Published guides\n${guides || "No guides published yet."}\n`, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300" } });
}
