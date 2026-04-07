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
    redirect("/auth/sign-up?role=client&message=Please sign up to post your job.");
  }

  // 2. Extract and Validate Fields
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const location_type = formData.get("location_type") as string;
  const budgetStr = formData.get("budget") as string;
  const timeline = formData.get("timeline") as string;
  const complexity = formData.get("complexity") as string;
  const skillsStr = formData.get("skills") as string;

  if (!title || title.length < 5) return { error: "Job title is too short." };
  if (!description || description.length < 20) return { error: "Please provide a more detailed description (min 20 chars)." };
  
  const budget = parseFloat(budgetStr);
  if (isNaN(budget) || budget <= 0) return { error: "Please provide a valid budget." };

  const skills = skillsStr ? skillsStr.split(",").map(s => s.trim()).filter(Boolean) : [];

  // 3. Insert into job_requests
  try {
    const { error } = await supabase
      .from("job_requests")
      .insert({
        client_id: user.id,
        pro_id: null, // Open Job
        title: title,
        description: description,
        category: category,
        location_type: location_type,
        budget: budget,
        timeline: timeline,
        complexity: complexity,
        skills: skills,
        status: "pending",
        payment_status: "pending",
      });

    if (error) throw error;
  } catch (err: any) {
    console.error("Error posting job:", err);
    return { error: "Failed to post job: " + err.message };
  }

  // 4. Revalidate and Redirect
  revalidatePath("/browse-jobs");
  revalidatePath("/client/dashboard");
  redirect("/browse-jobs");
}
