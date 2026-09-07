import { redirect } from "next/navigation";
import { isAdminSessionValid } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Blog Admin — DiskSift", robots: { index: false, follow: false } };
export default async function AdminLoginPage() {
  if (await isAdminSessionValid()) redirect("/blog/admin");
  return <main className="cms-login"><LoginForm /></main>;
}
