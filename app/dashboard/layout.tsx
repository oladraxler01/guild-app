import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";
import { DashboardSidebar } from "./DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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

  const firstName = profile?.first_name || user.user_metadata?.first_name || "Pro";
  const lastName = profile?.last_name || user.user_metadata?.last_name || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return (
    <div className="min-h-screen bg-[#fef3ff] text-[#3a264b] font-['Plus_Jakarta_Sans']">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-[#ffffff]/70 backdrop-blur-xl shadow-[0px_0px_32px_rgba(58,38,75,0.06)]">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-full">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-[#3a264b]">Guild</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                className="text-base tracking-tight text-[#702ae1] font-bold border-b-2 border-[#702ae1]"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="text-base tracking-tight text-[#69537b] hover:bg-[#edd3ff]/50 transition-colors px-3 py-1 rounded-lg"
                href="/find-a-pro"
              >
                Marketplace
              </Link>
              <Link
                className="text-base tracking-tight text-[#69537b] hover:bg-[#edd3ff]/50 transition-colors px-3 py-1 rounded-lg"
                href="/how-it-works"
              >
                Insights
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#702ae1] hover:bg-[#edd3ff]/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-[#702ae1] hover:bg-[#edd3ff]/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">chat_bubble</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container flex items-center justify-center bg-surface-container-high">
              {profile?.avatar_url ? (
                <img alt="Profile" className="w-full h-full object-cover" src={profile.avatar_url} />
              ) : (
                <span className="text-xl font-bold text-primary">{firstName.charAt(0)}</span>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#faecff] h-[1px] opacity-10"></div>
      </header>

      {/* Shell Container */}
      <div className="flex pt-20 min-h-screen">
        {/* Sidebar */}
        <DashboardSidebar
          firstName={firstName}
          fullName={fullName}
          avatarUrl={profile?.avatar_url || null}
        />

        {/* Main Canvas */}
        <main className="flex-1 md:ml-64 p-4 md:p-10 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 mt-auto bg-[#fef3ff]">
        <div className="flex flex-col md:flex-row justify-between items-center px-10 gap-6 w-full">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#3a264b]">Guild</span>
            <span className="text-[10px] uppercase tracking-widest text-[#69537b]">© 2024</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-xs uppercase tracking-widest text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">Support Center</a>
            <a className="text-xs uppercase tracking-widest text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">Terms of Service</a>
            <a className="text-xs uppercase tracking-widest text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-white/70 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-between items-center z-50">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-purple-700">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px] font-bold">Dashboard</span>
        </Link>
        <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
        <Link href="/find-a-pro" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-bold">Explore</span>
        </Link>
        <form action={signOutAction as any}>
          <button type="submit" className="flex flex-col items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-[10px] font-bold">Log Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}
