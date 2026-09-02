import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe() {
  if (stripe) return stripe;

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY env var");
  }

  stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20"
  });

  return stripe;
}
