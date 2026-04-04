"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  // Role-based routing
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role;

  if (role === "pro") {
    return redirect("/dashboard");
  } else {
    return redirect("/client/dashboard");
  }
}

export async function signUpAction(formData: FormData) {
  const origin = (await headers()).get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const nin = formData.get("nin") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const supabase = await createClient();

  if (!email || !password) {
    return redirect("/auth/sign-up?error=Email and password are required");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        nin: nin,
        phone: phone,
        role: role,
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`);
  }

  // Force-insert profile row so Pros appear on search immediately
  if (data?.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      role: role,
      nin: nin,
    });

    if (profileError) {
      console.error("Profile insert error:", profileError.message);
    }
  }

  return redirect("/auth/login?message=Account created successfully! Log in to continue.");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/auth/login");
}
