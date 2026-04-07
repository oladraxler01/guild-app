import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2024-12-18.acacia", // Use a stable version if basil is throwing or just keep what works
  typescript: true,
});
