import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureMetricsSchema } from "@/lib/metrics-schema";

export const runtime = "nodejs";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const secret = process.env.DISKSIFT_LICENSE_SECRET ?? "";
    if (secret.length < 32) throw new Error("Metrics unavailable");
    const input = await request.json();
    const id = String(input.eventId ?? "");
    const installationId = String(input.installationId ?? "");
    const bytes = Number(input.bytesCleaned);
    if (!uuid.test(id) || !uuid.test(installationId) || !Number.isSafeInteger(bytes) || bytes < 1024 || bytes > 1_000_000_000_000) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await ensureMetricsSchema();
    const installationHash = createHmac("sha256", secret).update(`impact:${installationId}`).digest("hex");
    const recent = await prisma.$queryRaw<Array<{ count: bigint }>>`SELECT COUNT(*)::bigint AS count FROM "CleanupReport" WHERE "installationHash" = ${installationHash} AND "createdAt" > NOW() - INTERVAL '24 hours'`;
    if (Number(recent[0]?.count ?? 0) >= 100) return NextResponse.json({ ok: true });
    await prisma.$executeRaw`INSERT INTO "CleanupReport" ("id", "installationHash", "bytesCleaned") VALUES (${id}, ${installationHash}, ${BigInt(bytes)}) ON CONFLICT ("id") DO NOTHING`;
    return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
