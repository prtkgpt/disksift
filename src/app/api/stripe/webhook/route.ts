import type Stripe from "stripe";
import type { NextRequest } from "next/server";
import { getStripe, stripeIsLive } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { ensurePaymentSchema } from "@/lib/payment-schema";
import { fulfillProSession } from "@/lib/fulfill-pro";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook not configured", { status: 503 });
  let stripe: ReturnType<typeof getStripe>;
  try { stripe = getStripe(); } catch { return new Response("Stripe not configured", { status: 503 }); }
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await req.text(), signature, secret); }
  catch { return new Response("Invalid signature", { status: 400 }); }
  if (event.livemode !== stripeIsLive()) return new Response("Wrong Stripe mode", { status: 400 });

  try {
    await ensurePaymentSchema();
    if (await prisma.stripeWebhookEvent.findUnique({ where: { id: event.id } })) return new Response(null, { status: 200 });

    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = await stripe.checkout.sessions.retrieve(event.data.object.id);
      if (session.payment_status === "paid") await fulfillProSession(session);
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object;
      const intentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      if (charge.refunded && intentId) {
        const purchases = await prisma.proPurchase.findMany({ where: { stripeIntentId: intentId }, select: { id: true } });
        await prisma.$transaction([
          prisma.licenseActivation.deleteMany({ where: { purchaseId: { in: purchases.map(item => item.id) } } }),
          prisma.proPurchase.updateMany({ where: { stripeIntentId: intentId }, data: { status: "REFUNDED", refundedAt: new Date() } })
        ]);
      }
    }

    await prisma.stripeWebhookEvent.create({ data: { id: event.id, type: event.type } });
    return new Response(null, { status: 200 });
  } catch {
    try { if (await prisma.stripeWebhookEvent.findUnique({ where: { id: event.id } })) return new Response(null, { status: 200 }); }
    catch { /* Stripe will retry database outages. */ }
    return new Response("Fulfillment temporarily unavailable", { status: 500 });
  }
}
