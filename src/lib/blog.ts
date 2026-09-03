import { prisma } from "@/lib/prisma";

export type PublicPost = {
  id: string; slug: string; title: string; excerpt: string; body: string;
  category: string; tags: string[]; authorName: string; publishedAt: Date; updatedAt: Date;
};

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

export async function getPublishedPosts(limit = 100): Promise<PublicPost[]> {
  if (!hasDatabase()) return [];
  try {
    return await prisma.blogPost.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" }, take: limit,
    }) as PublicPost[];
  } catch (error) {
    console.error("Could not load blog posts", error);
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<PublicPost | null> {
  if (!hasDatabase()) return null;
  try {
    return await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
    }) as PublicPost | null;
  } catch (error) {
    console.error("Could not load blog post", error);
    return null;
  }
}
