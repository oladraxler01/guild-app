"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function sendJobRequest(formData: FormData, proId: string) {
  const supabase = await createClient();

  // 1. Authenticate the Client
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to send a job request." };
  }

  // 2. Extract Data
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const budgetStr = formData.get("budget") as string;
  const budget = budgetStr ? parseFloat(budgetStr) : null;

  if (!title) {
    return { error: "Job title is required." };
  }

  // 3. Insert into job_requests
  const { error } = await supabase.from("job_requests").insert({
    client_id: user.id,
    pro_id: proId,
    title,
    description: description || null,
    budget,
  });

  if (error) {
    return { error: `Job request failed: ${error.message}` };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function startInquiryChat(proId: string, formData?: FormData) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to send a message." };
  }

  // Create an immediate 'active' job request for pure messaging
  const { data, error } = await supabase.from("job_requests").insert({
    client_id: user.id,
    pro_id: proId,
    title: "General Inquiry",
    description: "I would like to discuss potential work with you.",
    status: "active" // Skip the Dashboard acceptance process so they can chat immediately
  }).select("id").single();

  if (error || !data) {
    return { error: `Failed to initiate chat: ${error?.message}` };
  }

  redirect(`/messages/${data.id}`);
}
