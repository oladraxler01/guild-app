import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-on-surface-variant">Unable to load profile. Please try again.</p>
      </div>
    );
  }

  const profileData = {
    id: profile.id,
    first_name: profile.first_name || null,
    last_name: profile.last_name || null,
    bio: profile.bio || null,
    services: Array.isArray(profile.services) ? profile.services : null,
    hourly_rate: profile.hourly_rate || null,
    avatar_url: profile.avatar_url || null,
    portfolio_urls: Array.isArray(profile.portfolio_urls) ? profile.portfolio_urls : null,
    nin: profile.nin || null,
    location: profile.location || null,
  };

  return <ProfileForm profile={profileData} email={user.email || ""} />;
}
