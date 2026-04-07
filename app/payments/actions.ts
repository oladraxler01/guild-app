"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Create a Stripe Checkout Session for a job's budget.
 * Called by the Client from the chat page.
 */
export async function createCheckoutSession(jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Fetch the job
  const { data: job, error } = await supabase
    .from("job_requests")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error || !job) throw new Error("Job not found.");
  if (job.client_id !== user.id) throw new Error("Only the client can pay for this job.");
  if (!job.budget || job.budget <= 0) throw new Error("This job has no budget set.");
  if (job.payment_status === "funded" || job.payment_status === "released") {
    throw new Error("This job has already been paid for.");
  }

  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Guild Escrow: ${job.title}`,
            description: `Secure payment for job #${jobId.slice(0, 8)}`,
          },
          unit_amount: Math.round(job.budget * 100), // cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/payments/success?session_id={CHECKOUT_SESSION_ID}&job_id=${jobId}`,
    cancel_url: `${origin}/messages/${jobId}`,
    metadata: {
      job_id: jobId,
      client_id: user.id,
      pro_id: job.pro_id,
    },
  });

  // Insert payment record
  await supabase.from("payments").insert({
    job_id: jobId,
    client_id: user.id,
    pro_id: job.pro_id,
    amount: job.budget,
    stripe_payment_intent_id: session.id,
    status: "pending",
  });

  if (session.url) {
    redirect(session.url);
  }
}

/**
 * Pro marks a job as complete after work is done.
 */
export async function markJobComplete(jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: job } = await supabase
    .from("job_requests")
    .select("*")
    .eq("id", jobId)
    .single();

  if (!job) throw new Error("Job not found.");
  if (job.pro_id !== user.id) throw new Error("Only the assigned Pro can mark this as complete.");

  await supabase
    .from("job_requests")
    .update({ payment_status: "awaiting_release" })
    .eq("id", jobId);

  revalidatePath("/dashboard");
  revalidatePath("/client/dashboard");
  revalidatePath(`/messages/${jobId}`);
  return { success: true };
}

/**
 * Client releases escrowed funds to the Pro.
 */
export async function releasePayment(jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: job } = await supabase
    .from("job_requests")
    .select("*")
    .eq("id", jobId)
    .single();

  if (!job) throw new Error("Job not found.");
  if (job.client_id !== user.id) throw new Error("Only the client can release funds.");

  // Update payment status
  await supabase
    .from("payments")
    .update({ status: "released" })
    .eq("job_id", jobId);

  // Update job status
  await supabase
    .from("job_requests")
    .update({
      status: "completed",
      payment_status: "released",
    })
    .eq("id", jobId);

  revalidatePath("/dashboard");
  revalidatePath("/client/dashboard");
  revalidatePath(`/messages/${jobId}`);
  return { success: true };
}
