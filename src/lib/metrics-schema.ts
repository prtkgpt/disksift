import "server-only";
import { prisma } from "@/lib/prisma";

let initialized = false;

export async function ensureMetricsSchema() {
  if (initialized) return;
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "DownloadEvent" (
    "id" TEXT PRIMARY KEY, "edition" TEXT NOT NULL, "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "DownloadEvent_edition_createdAt_idx" ON "DownloadEvent"("edition", "createdAt")`);
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "CleanupReport" (
    "id" TEXT PRIMARY KEY, "installationHash" TEXT NOT NULL, "bytesCleaned" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "CleanupReport_createdAt_idx" ON "CleanupReport"("createdAt")`);
  initialized = true;
}
