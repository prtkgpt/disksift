import "server-only";
import { prisma } from "@/lib/prisma";

let initialized = false;

export async function ensurePaymentSchema() {
  if (initialized) return;
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ProPurchase" (
    "id" TEXT PRIMARY KEY, "stripeSessionId" TEXT NOT NULL UNIQUE,
    "stripeIntentId" TEXT NOT NULL UNIQUE, "customerEmail" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL, "currency" TEXT NOT NULL,
    "product" TEXT NOT NULL DEFAULT 'disksift_pro', "maxDevices" INTEGER NOT NULL DEFAULT 3,
    "majorVersion" INTEGER NOT NULL DEFAULT 1, "livemode" BOOLEAN NOT NULL DEFAULT false,
    "licenseKeyHash" TEXT NOT NULL UNIQUE, "licenseKeyLast4" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE', "emailSentAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "ProPurchase" ADD COLUMN IF NOT EXISTS "licenseKeyHash" TEXT`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "ProPurchase" ADD COLUMN IF NOT EXISTS "licenseKeyLast4" TEXT`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "ProPurchase" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'ACTIVE'`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "ProPurchase" ADD COLUMN IF NOT EXISTS "emailSentAt" TIMESTAMP(3)`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "ProPurchase" ADD COLUMN IF NOT EXISTS "refundedAt" TIMESTAMP(3)`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "ProPurchase_licenseKeyHash_key" ON "ProPurchase"("licenseKeyHash")`);
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "StripeWebhookEvent" (
    "id" TEXT PRIMARY KEY, "type" TEXT NOT NULL, "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "LicenseActivation" (
    "id" TEXT PRIMARY KEY, "purchaseId" TEXT NOT NULL REFERENCES "ProPurchase"("id") ON DELETE CASCADE,
    "deviceHash" TEXT NOT NULL, "deviceName" TEXT,
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "LicenseActivation_purchaseId_deviceHash_key" ON "LicenseActivation"("purchaseId", "deviceHash")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "LicenseActivation_purchaseId_idx" ON "LicenseActivation"("purchaseId")`);
  initialized = true;
}
