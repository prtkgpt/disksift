import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureMetricsSchema } from "@/lib/metrics-schema";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const edition = request.nextUrl.searchParams.get("edition") === "pro" ? "pro" : "free";
  const rawSource = request.nextUrl.searchParams.get("source") ?? "website";
  const source = /^[a-z0-9-]{1,40}$/i.test(rawSource) ? rawSource : "website";
  try {
    await ensureMetricsSchema();
    await prisma.$executeRaw`INSERT INTO "DownloadEvent" ("id", "edition", "source") VALUES (${randomUUID()}, ${edition}, ${source})`;
  } catch {
    // Metrics must never prevent a download.
  }
  return NextResponse.redirect(new URL("/downloads/DiskSift.dmg", request.url), 307);
}
