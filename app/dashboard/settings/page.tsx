import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const firstName = profile?.first_name || user.user_metadata?.first_name || "User";
  const lastName = profile?.last_name || user.user_metadata?.last_name || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const hasNin = !!profile?.nin;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">My Profile & Settings</h1>
        <p className="text-on-surface-variant mt-1">Manage your personal information and security preferences.</p>
      </div>

      {/* Personal Information Card */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#edd3ff]/30">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center border-2 border-primary-container">
              {profile?.avatar_url ? (
                <img alt="Avatar" className="w-full h-full object-cover" src={profile.avatar_url} />
              ) : (
                <span className="text-2xl font-bold text-primary">{firstName.charAt(0)}</span>
              )}
            </div>
            {hasNin && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#702ae1] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#3a264b]">{fullName}</h2>
            <p className="text-sm text-[#69537b]">Member since {memberSince}</p>
          </div>
        </div>

        {/* Info Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#69537b] uppercase tracking-wider">Full Name</label>
            <div className="bg-[#fef3ff] border border-[#edd3ff]/50 rounded-xl px-4 py-3 text-[#3a264b] font-medium">
              {fullName}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#69537b] uppercase tracking-wider">Email Address</label>
            <div className="bg-[#fef3ff] border border-[#edd3ff]/50 rounded-xl px-4 py-3 text-[#3a264b] font-medium">
              {user.email || "—"}
            </div>
          </div>
        </div>
        <div className="space-y-1.5 mb-6">
          <label className="text-xs font-semibold text-[#69537b] uppercase tracking-wider">Phone Number</label>
          <div className="bg-[#fef3ff] border border-[#edd3ff]/50 rounded-xl px-4 py-3 text-[#3a264b] font-medium">
            {user.user_metadata?.phone || "Not provided"}
          </div>
        </div>
        <div className="flex justify-end">
          <button className="px-8 py-3 rounded-full bg-gradient-to-br from-[#702ae1] to-[#b28cff] text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            Update Details
          </button>
        </div>
      </section>

      {/* Security & Identity */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#edd3ff]/30">
        <h3 className="text-lg font-bold text-[#3a264b] flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-[#702ae1]">verified_user</span>
          Security & Identity
        </h3>
        <div className="flex items-center gap-4 p-4 bg-[#fef3ff] rounded-xl border border-[#edd3ff]/30">
          <div className="w-10 h-10 rounded-full bg-[#702ae1]/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#702ae1]">fingerprint</span>
          </div>
          <div className="flex-grow">
            <p className="font-bold text-[#3a264b] text-sm">NIN Verification</p>
            <p className="text-xs text-[#69537b]">
              {hasNin
                ? `Identity verified on ${memberSince}`
                : "Please complete your NIN verification for enhanced trust."}
            </p>
          </div>
          {hasNin ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Verified</span>
          ) : (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Pending</span>
          )}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#edd3ff]/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#3a264b]">Payment Methods</h3>
          <button className="text-sm font-bold text-[#702ae1] flex items-center gap-1 hover:underline">
            <span className="material-symbols-outlined text-sm">add</span> Add New
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-[#fef3ff] rounded-xl border border-[#edd3ff]/30">
            <div className="w-10 h-10 rounded-xl bg-[#edd3ff] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#702ae1] text-xl">credit_card</span>
            </div>
            <div className="flex-grow">
              <p className="font-bold text-[#3a264b] text-sm">Visa ending in 4242</p>
              <p className="text-xs text-[#69537b]">Expires 12/26</p>
            </div>
            <span className="px-3 py-1 bg-[#702ae1]/10 text-[#702ae1] text-[10px] font-bold rounded-full uppercase tracking-wider">Default</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-[#fef3ff] rounded-xl border border-[#edd3ff]/30">
            <div className="w-10 h-10 rounded-xl bg-[#edd3ff] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#702ae1] text-xl">smartphone</span>
            </div>
            <div className="flex-grow">
              <p className="font-bold text-[#3a264b] text-sm">Mobile Money</p>
              <p className="text-xs text-[#69537b]">+1(555) •••3456</p>
            </div>
            <button className="p-1 text-[#69537b] hover:text-[#3a264b] transition-colors">
              <span className="material-symbols-outlined text-sm">more_vert</span>
            </button>
          </div>
        </div>
      </section>

      {/* Appearance / Theme Toggle */}
      <ThemeToggle />

      {/* Account Settings */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#edd3ff]/30">
        <h3 className="text-lg font-bold text-[#3a264b] mb-6">Account Settings</h3>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#fef3ff] transition-colors text-left group">
            <span className="material-symbols-outlined text-[#702ae1]">lock</span>
            <span className="flex-grow font-medium text-[#3a264b] text-sm">Change Password</span>
            <span className="material-symbols-outlined text-[#bda3d1] text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
          <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#fef3ff] transition-colors text-left group">
            <span className="material-symbols-outlined text-[#702ae1]">notifications_active</span>
            <span className="flex-grow font-medium text-[#3a264b] text-sm">Notification Preferences</span>
            <span className="material-symbols-outlined text-[#bda3d1] text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
          <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#fef3ff] transition-colors text-left group">
            <span className="material-symbols-outlined text-[#702ae1]">language</span>
            <span className="flex-grow font-medium text-[#3a264b] text-sm">Language & Region</span>
            <span className="material-symbols-outlined text-[#bda3d1] text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>
      </section>

      {/* Sign Out */}
      <div className="flex justify-center pt-4">
        <form action={signOutAction as any}>
          <button
            type="submit"
            className="flex items-center gap-2 text-red-500 font-bold text-sm hover:text-red-600 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
