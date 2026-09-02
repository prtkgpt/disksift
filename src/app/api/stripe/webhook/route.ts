import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return new Response(message, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      // TODO: mark booking as paid
      break;
    case "payment_intent.succeeded":
      // TODO: store payment record
      break;
    default:
      break;
  }

  return new Response(null, { status: 200 });
}
