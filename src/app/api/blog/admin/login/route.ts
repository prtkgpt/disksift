import { NextResponse } from "next/server";
import { adminIsConfigured, createAdminSession, setAdminCookie, validateAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!adminIsConfigured()) return NextResponse.json({ error: "Admin login is not configured." }, { status: 503 });
  const { email = "", password = "" } = await request.json();
  if (!validateAdminCredentials(String(email), String(password))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  setAdminCookie(createAdminSession());
  return NextResponse.json({ ok: true });
}
