import "server-only";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendTransactionalEmail } from "@/lib/email";
import { ensurePaymentSchema } from "@/lib/payment-schema";
import { licenseKeyForSession, licenseKeyHash } from "@/lib/license";
import { getProPriceId, isPaidProSession, PRO } from "@/lib/pro-purchase";
import { getStripe } from "@/lib/stripe";

export async function fulfillProSession(session: Stripe.Checkout.Session) {
  await ensurePaymentSchema();
  const stripe = getStripe();
  const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 2 });
  if (!isPaidProSession(session, items, getProPriceId())) throw new Error("Purchase validation failed");
  const email = session.customer_details?.email?.trim().toLowerCase();
  const intentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  if (!email || !intentId) throw new Error("Missing purchase details");
  const key = licenseKeyForSession(session.id);
  const purchase = await prisma.proPurchase.upsert({
    where: { stripeSessionId: session.id }, update: {
      customerEmail: email, licenseKeyHash: licenseKeyHash(key), licenseKeyLast4: key.slice(-4)
    },
    create: {
      stripeSessionId: session.id, stripeIntentId: intentId, customerEmail: email,
      amountCents: PRO.amount, currency: PRO.currency, product: PRO.product,
      maxDevices: PRO.maxDevices, majorVersion: PRO.majorVersion, livemode: session.livemode,
      licenseKeyHash: licenseKeyHash(key), licenseKeyLast4: key.slice(-4), status: "ACTIVE"
    }
  });
  await emailLicenseOnce(purchase.id, session.id, email, key);
  return { purchase, key };
}

async function emailLicenseOnce(purchaseId: string, sessionId: string, email: string, key: string) {
  const purchase = await prisma.proPurchase.findUnique({
    where: { id: purchaseId },
    select: { emailSentAt: true }
  });
  if (purchase?.emailSentAt) return;
  await sendTransactionalEmail({
      to: email,
      subject: "Your DiskSift Pro license is ready",
      text: `Hi,\n\nThank you for purchasing DiskSift Pro. Your payment is complete and Pro is ready to activate.\n\nLicense key: ${key}\n\nActivate DiskSift Pro:\n1. Download or open DiskSift.\n2. Choose DiskSift → Settings → Enter license key.\n3. Paste the key above and select Activate.\n\nYour license covers up to three personal Macs.\n\nDownload DiskSift: https://www.disksift.com/downloads/DiskSift.dmg\n\nPlease keep this email for your records. If you do not see a DiskSift email in your inbox, check your spam or junk folder. If you run into any issue or would like to share feedback, contact hello@disksift.com.\n\n— The DiskSift team`,
      html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#25232a;max-width:600px;margin:auto"><div style="padding:28px;border:1px solid #e8e3ef;border-radius:16px"><p style="color:#7b48dc;font-weight:700">DISKSIFT PRO</p><h1 style="font-size:28px;line-height:1.2">Your license is ready</h1><p>Thank you for purchasing DiskSift Pro. Your payment is complete and Pro is ready to activate.</p><p style="margin-bottom:8px"><strong>Your license key</strong></p><div style="font:700 18px ui-monospace,SFMono-Regular,Menlo,monospace;padding:16px;background:#f3efff;border-radius:10px;word-break:break-all">${key}</div><h2 style="font-size:18px;margin-top:28px">Activate DiskSift Pro</h2><ol><li>Download or open DiskSift.</li><li>Choose <strong>DiskSift → Settings → Enter license key</strong>.</li><li>Paste your key and select <strong>Activate</strong>.</li></ol><p>Your license covers up to three personal Macs.</p><p><a href="https://www.disksift.com/downloads/DiskSift.dmg" style="display:inline-block;background:#7546d8;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:9px">Download DiskSift for Mac</a></p><hr style="border:0;border-top:1px solid #e8e3ef;margin:28px 0"><p style="font-size:14px;color:#666">Please keep this email for your records. If you do not see a DiskSift email in your inbox, check your spam or junk folder. If you run into any issue or would like to share feedback, email <a href="mailto:hello@disksift.com">hello@disksift.com</a>.</p></div></div>`,
      idempotencyKey: `license/${sessionId}`
  });
  await prisma.proPurchase.update({ where: { id: purchaseId }, data: { emailSentAt: new Date() } });
}
