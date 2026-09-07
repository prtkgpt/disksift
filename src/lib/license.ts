import "server-only";
import { createHash, createHmac } from "crypto";

function secret() {
  const value = process.env.DISKSIFT_LICENSE_SECRET ?? "";
  if (value.length < 32) throw new Error("DISKSIFT_LICENSE_SECRET must be at least 32 characters");
  return value;
}

export function licenseKeyForSession(sessionId: string) {
  const raw = createHmac("sha256", secret()).update(`license:${sessionId}`).digest("base64url")
    .toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
  return `DISKSIFT-PRO-${raw.match(/.{1,4}/g)!.join("-")}`;
}

export function normalizeLicenseKey(value: string) { return value.trim().toUpperCase(); }
export function licenseKeyHash(value: string) {
  return createHash("sha256").update(normalizeLicenseKey(value)).digest("hex");
}
export function deviceHash(value: string) {
  return createHmac("sha256", secret()).update(`device:${value}`).digest("hex");
}
