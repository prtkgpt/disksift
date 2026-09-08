import "server-only";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";

let initialized = false;

async function ensureSchema() {
  if (initialized) return;
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "RequestRateLimit" (
    "bucket" TEXT NOT NULL, "subjectHash" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL, "count" INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY ("bucket", "subjectHash", "windowStart")
  )`);
  initialized = true;
}

function secret() {
  const value = process.env.RATE_LIMIT_SECRET || process.env.DISKSIFT_LICENSE_SECRET || process.env.BLOG_SESSION_SECRET || "";
  if (value.length < 32) throw new Error("Rate limiting is not configured");
  return value;
}

function clientAddress(request: Request) {
  return (request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim().slice(0, 200);
}

export async function withinRateLimit(request: Request, bucket: string, limit: number, windowSeconds: number) {
  await ensureSchema();
  const subjectHash = createHmac("sha256", secret()).update(`${bucket}:${clientAddress(request)}`).digest("hex");
  const windowMs = windowSeconds * 1000;
  const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs);
  const rows = await prisma.$queryRaw<Array<{ count: number }>>`
    INSERT INTO "RequestRateLimit" ("bucket", "subjectHash", "windowStart", "count")
    VALUES (${bucket}, ${subjectHash}, ${windowStart}, 1)
    ON CONFLICT ("bucket", "subjectHash", "windowStart")
    DO UPDATE SET "count" = "RequestRateLimit"."count" + 1
    RETURNING "count"`;
  return Number(rows[0]?.count ?? limit + 1) <= limit;
}
