"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendMessage(formData: FormData, jobId: string) {
  const content = formData.get("content") as string;

  if (!content || !content.trim()) {
    return { error: "Message cannot be empty." };
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("messages").insert({
    job_id: jobId,
    sender_id: user.id,
    content: content.trim(),
  });

  if (error) {
    return { error: `Message sending failed: ${error.message}` };
  }

  revalidatePath(`/messages/${jobId}`);
  return { success: true };
}
