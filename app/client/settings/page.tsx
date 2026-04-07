import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default async function ClientSettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  if (user.user_metadata?.role === "pro") {
    redirect("/dashboard/settings");
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
    <div className="bg-[#fef3ff] text-[#3a264b] min-h-screen font-['Plus_Jakarta_Sans']">

      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#ffffff]/70 backdrop-blur-xl shadow-[0px_0px_32px_rgba(58,38,75,0.06)]">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-[#3a264b]">Guild</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/client/dashboard" className="text-base tracking-tight text-[#69537b] hover:bg-[#edd3ff]/50 transition-colors px-3 py-1 rounded-lg">My Jobs</Link>
              <Link href="/find-a-pro" className="text-base tracking-tight text-[#69537b] hover:bg-[#edd3ff]/50 transition-colors px-3 py-1 rounded-lg">Find a Pro</Link>
              <Link href="/client/settings" className="text-base tracking-tight text-[#702ae1] font-bold border-b-2 border-[#702ae1]">Settings</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-[#702ae1] hover:bg-[#edd3ff]/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container-high flex items-center justify-center">
              {profile?.avatar_url ? (
                <img alt="Profile" className="w-full h-full object-cover" src={profile.avatar_url} />
              ) : (
                <span className="text-xl font-bold text-primary">{firstName.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-24 md:pb-16 px-6 max-w-3xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#3a264b] tracking-tight">My Profile & Settings</h1>
            <p className="text-[#69537b] mt-1">Manage your personal information and security preferences.</p>
          </div>
          <Link href="/client/dashboard" className="text-sm font-bold text-[#702ae1] hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Jobs
          </Link>
        </div>

        {/* Personal Information */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#edd3ff]/30">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#69537b] uppercase tracking-wider">Full Name</label>
              <div className="bg-[#fef3ff] border border-[#edd3ff]/50 rounded-xl px-4 py-3 text-[#3a264b] font-medium">{fullName}</div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#69537b] uppercase tracking-wider">Email Address</label>
              <div className="bg-[#fef3ff] border border-[#edd3ff]/50 rounded-xl px-4 py-3 text-[#3a264b] font-medium">{user.email || "—"}</div>
            </div>
          </div>
          <div className="space-y-1.5 mb-6">
            <label className="text-xs font-semibold text-[#69537b] uppercase tracking-wider">Phone Number</label>
            <div className="bg-[#fef3ff] border border-[#edd3ff]/50 rounded-xl px-4 py-3 text-[#3a264b] font-medium">{user.user_metadata?.phone || "Not provided"}</div>
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
                {hasNin ? `Identity verified on ${memberSince}` : "Complete your NIN verification for enhanced trust."}
              </p>
            </div>
            {hasNin ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Verified</span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Pending</span>
            )}
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
            <button type="submit" className="flex items-center gap-2 text-red-500 font-bold text-sm hover:text-red-600 transition-colors active:scale-95">
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 bg-[#fef3ff] border-t border-[#edd3ff]/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#3a264b]">Guild</span>
            <span className="text-[10px] uppercase tracking-widest text-[#69537b]">© 2024</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-xs uppercase tracking-widest text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">Support</a>
            <a className="text-xs uppercase tracking-widest text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">Terms</a>
            <a className="text-xs uppercase tracking-widest text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-white/80 backdrop-blur-lg border-t border-[#edd3ff] px-4 py-3 flex justify-around items-center z-50">
        <Link href="/client/dashboard" className="flex flex-col items-center gap-0.5 text-[#69537b]">
          <span className="material-symbols-outlined text-xl">work</span>
          <span className="text-[10px] font-bold">Jobs</span>
        </Link>
        <Link href="/find-a-pro" className="flex flex-col items-center gap-0.5 text-[#69537b]">
          <span className="material-symbols-outlined text-xl">search</span>
          <span className="text-[10px] font-bold">Find Pro</span>
        </Link>
        <Link href="/client/settings" className="flex flex-col items-center gap-0.5 text-[#702ae1]">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
          <span className="text-[10px] font-bold">Settings</span>
        </Link>
      </div>
    </div>
  );
}
