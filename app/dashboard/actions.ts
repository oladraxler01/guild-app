"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();

  // Get current logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const bio = formData.get("bio") as string | null;
  const servicesStr = formData.get("services") as string | null;
  const servicesMatchArray = servicesStr ? servicesStr.split(",").map((s) => s.trim()).filter(Boolean) : null;
  const rateStr = formData.get("rate") as string | null;
  const rate = rateStr ? parseFloat(rateStr) : null;

  // Process Images
  const files = formData.getAll("portfolio_images") as File[];
  const newPortfolioUrls: string[] = [];

  for (const file of files) {
    if (file.size === 0 || file.name === "" || file.name === "undefined") continue;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, file);

    if (uploadError) {
      if (uploadError.message.includes("Bucket not found")) {
         throw new Error("Bucket 'portfolio' does not exist. Please create a public storage bucket named 'portfolio' in Supabase.");
      }
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);
    newPortfolioUrls.push(publicUrlData.publicUrl);
  }

  // To preserve old portfolio urls, we should ideally fetch the current profile, 
  // but for simplicity in this specific request we'll just append to them or just set the new ones.
  // Actually, we'll fetch existing first.
  const { data: existingProfile } = await supabase.from("profiles").select("portfolio_urls").eq("id", user.id).single();
  const priorUrls = Array.isArray(existingProfile?.portfolio_urls) ? existingProfile.portfolio_urls : [];
  
  const mergedUrls = [...priorUrls, ...newPortfolioUrls];

  const { error } = await supabase
    .from("profiles")
    .update({
      bio: bio || null,
      services: servicesMatchArray,
      hourly_rate: rate,
      portfolio_urls: mergedUrls.length > 0 ? mergedUrls : null,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function handleJobAction(jobId: string, actionStatus: 'active' | 'declined') {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Authentication failed." };

  const { error } = await supabase
    .from("job_requests")
    .update({ status: actionStatus })
    .eq("id", jobId)
    .eq("pro_id", user.id);
  
  if (error) {
    return { error: `Failed to ${actionStatus} job: ${error.message}` };
  }

  if (actionStatus === "active") {
    const { redirect } = await import("next/navigation");
    redirect(`/messages/${jobId}`);
  } else {
    revalidatePath("/dashboard");
    return { success: true };
  }
}
