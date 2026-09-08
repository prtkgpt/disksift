import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensurePaymentSchema } from "@/lib/payment-schema";
import { deviceHash, licenseKeyHash, normalizeLicenseKey } from "@/lib/license";
import { withinRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!await withinRateLimit(request, "license-activation", 60, 60 * 60)) return NextResponse.json({ valid: false, message: "Too many activation attempts. Try again later." }, { status: 429, headers: { "cache-control": "no-store" } });
    const input = await request.json();
    const licenseKey = normalizeLicenseKey(String(input.licenseKey ?? ""));
    const deviceId = String(input.deviceId ?? "").trim();
    const deviceName = String(input.deviceName ?? "").trim().slice(0, 100) || null;
    if (!/^DISKSIFT-PRO-(?:[A-Z0-9]{4}-){4}[A-Z0-9]{4}$/.test(licenseKey) || deviceId.length < 16 || deviceId.length > 200) {
      return NextResponse.json({ valid: false, message: "Enter a valid DiskSift Pro license key." }, { status: 400, headers: { "cache-control": "no-store" } });
    }
    await ensurePaymentSchema();
    const purchase = await prisma.proPurchase.findUnique({ where: { licenseKeyHash: licenseKeyHash(licenseKey) }, include: { activations: true } });
    if (!purchase || purchase.status !== "ACTIVE") return NextResponse.json({ valid: false, message: "This license is invalid or inactive." }, { status: 403, headers: { "cache-control": "no-store" } });
    const hash = deviceHash(deviceId);
    const existing = purchase.activations.find(item => item.deviceHash === hash);
    if (!existing && purchase.activations.length >= purchase.maxDevices) {
      return NextResponse.json({ valid: false, message: `This license is already active on ${purchase.maxDevices} Macs. Contact hello@disksift.com to reset a device.` }, { status: 409, headers: { "cache-control": "no-store" } });
    }
    if (existing) await prisma.licenseActivation.update({ where: { id: existing.id }, data: { deviceName } });
    else await prisma.licenseActivation.create({ data: { purchaseId: purchase.id, deviceHash: hash, deviceName } });
    return NextResponse.json({ valid: true, plan: "pro", majorVersion: purchase.majorVersion, maxDevices: purchase.maxDevices }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ valid: false, message: "License activation is temporarily unavailable." }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
