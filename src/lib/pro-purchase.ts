import type Stripe from "stripe";
import { stripeIsLive } from "@/lib/stripe";

export const PRO = { product: "disksift_pro", amount: 1299, currency: "usd", maxDevices: 3, majorVersion: 1 } as const;

export function getProPriceId() {
  const id = process.env.STRIPE_PRO_PRICE_ID?.trim() || process.env.STRIPE_PRICE_ID?.trim();
  if (!id?.startsWith("price_")) throw new Error("Missing STRIPE_PRO_PRICE_ID");
  return id;
}

export function getSiteUrl() {
  const url = new URL(process.env.SITE_URL || "http://localhost:3000");
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" ||
      (url.protocol !== "https:" && !(url.protocol === "http:" && url.hostname === "localhost"))) {
    throw new Error("SITE_URL must be an HTTPS origin (or http://localhost for testing)");
  }
  return url.origin;
}

export function validateProPrice(price: Stripe.Price) {
  if (price.livemode !== stripeIsLive() || !price.active || price.type !== "one_time" || price.recurring ||
      price.currency !== PRO.currency || price.unit_amount !== PRO.amount || price.billing_scheme !== "per_unit") {
    throw new Error("Expected an active USD 12.99 one-time Price in the configured Stripe mode");
  }
}

// Entitlements come from server constants, never client-supplied metadata.
export function isPaidProSession(session: Stripe.Checkout.Session, items: Stripe.ApiList<Stripe.LineItem>, priceId: string) {
  const item = items.data[0];
  return session.livemode === stripeIsLive() && session.mode === "payment" && session.status === "complete" &&
    session.payment_status === "paid" && session.currency === PRO.currency &&
    session.amount_total === PRO.amount && session.metadata?.product === PRO.product &&
    !items.has_more && items.data.length === 1 && item.quantity === 1 &&
    item.price?.id === priceId && item.price.unit_amount === PRO.amount &&
    item.price.currency === PRO.currency && item.price.livemode === stripeIsLive() && item.price.type === "one_time";
}
