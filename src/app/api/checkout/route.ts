import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProPriceId, getSiteUrl, PRO, validateProPrice } from "@/lib/pro-purchase";
import { stripeIsLive } from "@/lib/stripe";
import { withinRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const siteUrl = getSiteUrl();
    if (req.headers.get("origin") !== siteUrl) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }
    if (!await withinRateLimit(req, "checkout", 20, 60 * 60)) return NextResponse.json({ error: "Too many checkout attempts. Try again later." }, { status: 429 });
    const stripe = getStripe();
    const priceId = getProPriceId();
    validateProPrice(await stripe.prices.retrieve(priceId));
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_creation: "always",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { product: PRO.product, max_devices: String(PRO.maxDevices), major_version: String(PRO.majorVersion) },
      payment_intent_data: { metadata: { product: PRO.product } },
      custom_text: { submit: { message: "DiskSift Pro: one payment for up to three personal Macs, with updates for major version 1." } },
      success_url: `${siteUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/buy?canceled=1`
    });
    if (session.livemode !== stripeIsLive() || !session.url) throw new Error("Invalid checkout session");
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Checkout is unavailable. Please try again later." }, { status: 503 });
  }
}
