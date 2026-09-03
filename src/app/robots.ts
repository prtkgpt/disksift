import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/blog/admin", "/blog/admin-login", "/api/"] }], sitemap: "https://disksift.com/sitemap.xml" };
}
