"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function postBidAction(formData: FormData) {
  const supabase = await createClient();

  // 1. Get current user (must be a Pro ideally, but we'll check simply for any user first)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in to submit a bid." };
  }

  // 2. Extract Fields
  const jobId = formData.get("job_id") as string;
  const amountStr = formData.get("amount") as string;
  const timeline = formData.get("timeline") as string;
  const proposal = formData.get("proposal") as string;

  if (!jobId) return { error: "Job ID missing." };
  if (!proposal || proposal.length < 10) return { error: "Please provide a more detailed proposal (min 10 chars)." };

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) return { error: "Please provide a valid bid amount." };

  // 3. Insert into job_bids
  try {
    const { error } = await supabase
      .from("job_bids")
      .insert({
        job_id: jobId,
        pro_id: user.id,
        amount: amount,
        timeline: timeline,
        proposal: proposal,
      });

    if (error) {
      if (error.message.includes("relation \"job_bids\" does not exist")) {
        return { error: "Database migration pending. Please ensure the 'job_bids' table is created." };
      }
      throw error;
    }
  } catch (err: any) {
    console.error("Error submitting bid:", err);
    return { error: "Failed to submit bid: " + err.message };
  }

  // 4. Revalidate
  revalidatePath(`/jobs/${jobId}`);
  return { success: true };
}
