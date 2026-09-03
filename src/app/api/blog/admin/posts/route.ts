import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const statuses = new Set(["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET() {
  if (!isAdminSessionValid()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  if (!isAdminSessionValid()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const input = await request.json();
  const title = String(input.title ?? "").trim();
  const slug = String(input.slug ?? "").trim().toLowerCase();
  const excerpt = String(input.excerpt ?? "").trim();
  const body = String(input.body ?? "").trim();
  const category = String(input.category ?? "Mac Storage").trim();
  const status = String(input.status ?? "DRAFT");
  if (!title || !excerpt || !body || !slugPattern.test(slug) || !statuses.has(status)) {
    return NextResponse.json({ error: "Title, valid slug, excerpt, body, and status are required." }, { status: 400 });
  }
  const publishedAt = status === "PUBLISHED"
    ? (input.publishedAt ? new Date(input.publishedAt) : new Date())
    : input.publishedAt ? new Date(input.publishedAt) : null;
  const data = {
    title, slug, excerpt, body, category, status: status as "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED",
    tags: Array.isArray(input.tags) ? input.tags.map(String).map((x: string) => x.trim()).filter(Boolean) : [],
    authorName: "Prateek G.", publishedAt,
  };
  const post = input.id
    ? await prisma.blogPost.update({ where: { id: String(input.id) }, data })
    : await prisma.blogPost.create({ data });
  revalidatePath("/blog"); revalidatePath(`/blog/${slug}`); revalidatePath("/sitemap.xml");
  return NextResponse.json(post);
}
