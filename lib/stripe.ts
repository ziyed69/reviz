import Stripe from "stripe";

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY manquant. Ajoute-le dans .env.local ou Vercel.");
  }
  return new Stripe(key, { apiVersion: "2024-06-20" });
}
