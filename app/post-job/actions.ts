"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function postOpenJobAction(formData: FormData) {
  const supabase = await createClient();

  // 1. Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // If not logged in, redirect to login with a message? 
    // For now, let's just redirect to login.
    redirect("/auth/sign-up?role=client&message=Please sign up to post your job.");
  }

  // 2. Extract description
  const description = formData.get("description") as string;
  if (!description || description.length < 10) {
    return { error: "Please provide a more detailed description (at least 10 characters)." };
  }

  // 3. Generate a title from the description
  // Take first 50 chars and make sure it doesn't cut a word in half if possible
  let title = description.substring(0, 60).trim();
  if (description.length > 60) {
    const lastSpace = title.lastIndexOf(" ");
    if (lastSpace > 20) {
      title = title.substring(0, lastSpace);
    }
    title += "...";
  }

  try {
    const { error } = await supabase
      .from("job_requests")
      .insert({
        client_id: user.id,
        pro_id: null,
        title: title,
        description: description,
        status: "pending",
        payment_status: "pending",
      });

    if (error) throw error;
  } catch (err: any) {
    console.error("Error posting job:", err);
    return { error: "Failed to post job. Please try again." };
  }

  // 5. Revalidate and Redirect
  revalidatePath("/browse-jobs");
  revalidatePath("/client/dashboard");
  redirect("/browse-jobs");
}
