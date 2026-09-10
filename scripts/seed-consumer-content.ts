import { PrismaClient } from "@prisma/client";
import { consumerSeoArticles, developerArticleSlugs } from "../src/data/consumer-seo-articles.ts";

const prisma = new PrismaClient();
const publishPriority = process.argv.includes("--publish-priority");

async function main() {
  const now = new Date();
  let published = 0;

  for (const article of consumerSeoArticles) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: article.slug } });
    const shouldPublish = publishPriority && article.priority;
    await prisma.blogPost.upsert({
      where: { slug: article.slug },
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        category: article.category,
        tags: article.tags,
        authorName: article.authorName,
        status: shouldPublish ? "PUBLISHED" : "REVIEW",
        publishedAt: shouldPublish ? now : null,
      },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        category: article.category,
        tags: article.tags,
        authorName: article.authorName,
        ...(shouldPublish ? { status: "PUBLISHED" as const, publishedAt: existing?.publishedAt ?? now } : {}),
      },
    });
    if (shouldPublish) published++;
  }

  if (publishPriority) {
    await prisma.blogPost.updateMany({
      where: { slug: { in: developerArticleSlugs }, status: "PUBLISHED" },
      data: { status: "DRAFT", publishedAt: null },
    });
  }

  console.log(JSON.stringify({ seeded: consumerSeoArticles.length, published, developerPostsMovedToDraft: publishPriority }));
}

main().finally(async () => prisma.$disconnect());
