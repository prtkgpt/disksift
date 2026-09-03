import { redirect } from "next/navigation";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog CMS — DiskSift", robots: { index: false, follow: false } };
export default async function BlogAdminPage() {
  if (!isAdminSessionValid()) redirect("/blog/admin-login");
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
  return <AdminDashboard initialPosts={JSON.parse(JSON.stringify(posts))} />;
}
