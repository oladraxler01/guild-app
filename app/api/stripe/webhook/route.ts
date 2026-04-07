import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // If no webhook secret configured, just handle based on session
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // For development without a webhook secret
      event = JSON.parse(body);
    }
  } catch (err) {
    const error = err as Error;
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const jobId = session.metadata?.job_id;

    if (jobId) {
      const supabase = await createClient();

      // Update payment to escrow
      await supabase
        .from("payments")
        .update({ status: "escrow" })
        .eq("job_id", jobId);

      // Update job payment status
      await supabase
        .from("job_requests")
        .update({ payment_status: "funded" })
        .eq("id", jobId);
    }
  }

  return NextResponse.json({ received: true });
}
