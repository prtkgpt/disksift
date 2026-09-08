import { NextResponse } from "next/server";
import { adminIsConfigured, createAdminSession, setAdminCookie, validateAdminCredentials } from "@/lib/admin-auth";
import { withinRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    if (!adminIsConfigured()) return NextResponse.json({ error: "Admin login is not configured." }, { status: 503 });
    if (!await withinRateLimit(request, "blog-admin-login", 10, 15 * 60)) return NextResponse.json({ error: "Too many sign-in attempts. Try again in 15 minutes." }, { status: 429 });
    const { email = "", password = "" } = await request.json();
    if (!validateAdminCredentials(String(email), String(password))) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    await setAdminCookie(createAdminSession());
    return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Admin login is temporarily unavailable." }, { status: 503 });
  }
}
