import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const live = process.env.STRIPE_MODE === "live";
  const expected = live ? /^(sk|rk)_live_/ : /^(sk|rk)_test_/;
  if (!stripeSecretKey || !expected.test(stripeSecretKey)) {
    throw new Error(`STRIPE_SECRET_KEY must be a ${live ? "live" : "test"}-mode key`);
  }
  if (live && process.env.ALLOW_LIVE_PAYMENTS !== "true") throw new Error("Live payments are disabled");

  if (stripe) return stripe;
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20"
  });

  return stripe;
}

export function stripeIsLive() { return process.env.STRIPE_MODE === "live"; }
