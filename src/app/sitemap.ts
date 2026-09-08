import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://disksift.com";
  const staticPages = ["", "/blog", "/build-in-public", "/privacy", "/terms", "/refund-policy", "/authors/prateek-g"].map(path => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === "/blog" || path === "/build-in-public" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .7 }));
  const posts = await getPublishedPosts();
  return [...staticPages, ...posts.map(post => ({ url: `${base}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: "monthly" as const, priority: .7 }))];
}
