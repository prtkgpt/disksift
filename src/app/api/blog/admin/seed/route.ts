import { NextResponse } from "next/server";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { articleDrafts } from "@/data/article-drafts";
import { prisma } from "@/lib/prisma";
import { ensureBlogSchema } from "@/lib/blog-schema";

export async function POST() {
  if (!isAdminSessionValid()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureBlogSchema();
  await prisma.$transaction(articleDrafts.map(draft => prisma.blogPost.upsert({
    where: { slug: draft.slug },
    create: { ...draft, authorName: "Prateek G.", status: "DRAFT" },
    update: { ...draft, authorName: "Prateek G.", status: "DRAFT", publishedAt: null },
  })));
  return NextResponse.json({ written: articleDrafts.length });
}
