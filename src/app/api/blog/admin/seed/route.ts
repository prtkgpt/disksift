import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { articleDrafts } from "@/data/article-drafts";
import { consumerSeoArticles, developerArticleSlugs } from "@/data/consumer-seo-articles";
import { prisma } from "@/lib/prisma";
import { ensureBlogSchema } from "@/lib/blog-schema";

export async function POST() {
  if (!await isAdminSessionValid()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureBlogSchema();
  const now = new Date();
  const prioritySlugs = consumerSeoArticles.filter(article => article.priority).map(article => article.slug);
  const existingPriority = await prisma.blogPost.findMany({
    where: { slug:{ in:prioritySlugs } }, select:{ slug:true, publishedAt:true },
  });
  const publishedDates = new Map(existingPriority.map(post => [post.slug, post.publishedAt]));

  const draftWrites = articleDrafts.map(draft => prisma.blogPost.upsert({
    where: { slug: draft.slug },
    create: { slug:draft.slug, title:draft.title, excerpt:draft.excerpt, body:draft.body, category:draft.category, tags:[...draft.tags], authorName:"Prateek G.", status:"REVIEW" },
    update: { title:draft.title, excerpt:draft.excerpt, body:draft.body, category:draft.category, tags:[...draft.tags], authorName:"Prateek G." },
  }));
  const consumerWrites = consumerSeoArticles.map(article => prisma.blogPost.upsert({
    where: { slug:article.slug },
    create: { slug:article.slug, title:article.title, excerpt:article.excerpt, body:article.body, category:article.category, tags:article.tags, authorName:article.authorName, status:article.priority ? "PUBLISHED" : "REVIEW", publishedAt:article.priority ? now : null },
    update: { title:article.title, excerpt:article.excerpt, body:article.body, category:article.category, tags:article.tags, authorName:article.authorName, ...(article.priority ? { status:"PUBLISHED" as const, publishedAt:publishedDates.get(article.slug) ?? now } : {}) },
  }));
  await prisma.$transaction([
    ...draftWrites,
    ...consumerWrites,
    prisma.blogPost.updateMany({ where:{ slug:{ in:developerArticleSlugs }, status:"PUBLISHED" }, data:{ status:"DRAFT", publishedAt:null } }),
  ]);
  revalidatePath("/blog"); revalidatePath("/sitemap.xml"); revalidatePath("/feed.xml"); revalidatePath("/llms.txt"); revalidatePath("/llms-full.txt");
  for (const slug of prioritySlugs) revalidatePath(`/blog/${slug}`);
  return NextResponse.json({ written:articleDrafts.length + consumerSeoArticles.length, consumerArticles:consumerSeoArticles.length, published:prioritySlugs.length, review:consumerSeoArticles.length-prioritySlugs.length });
}
