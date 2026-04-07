import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";

export default async function ClientDashboard() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  if (user.user_metadata?.role === "pro") {
    redirect("/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const firstName = profile?.first_name || user.user_metadata?.first_name || "there";

  // Fetch job requests with Pro details
  const { data: jobRequests } = await supabase
    .from("job_requests")
    .select(`*, pro:profiles!pro_id (first_name, last_name, avatar_url)`)
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const activeJobs = jobRequests?.filter(j => j.status === 'active' || j.status === 'pending') || [];
  const completedJobs = jobRequests?.filter(j => j.status === 'completed') || [];
  const ongoingCount = activeJobs.filter(j => j.status === 'active').length;
  const pendingCount = activeJobs.filter(j => j.status === 'pending').length;

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="bg-[#fef3ff] text-[#3a264b] min-h-screen font-['Plus_Jakarta_Sans']">

      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#ffffff]/70 backdrop-blur-xl shadow-[0px_0px_32px_rgba(58,38,75,0.06)]">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-[#3a264b]">Guild</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/client/dashboard" className="text-base tracking-tight text-[#702ae1] font-bold border-b-2 border-[#702ae1]">My Jobs</Link>
              <Link href="/find-a-pro" className="text-base tracking-tight text-[#69537b] hover:bg-[#edd3ff]/50 transition-colors px-3 py-1 rounded-lg">Find a Pro</Link>
              <Link href="/how-it-works" className="text-base tracking-tight text-[#69537b] hover:bg-[#edd3ff]/50 transition-colors px-3 py-1 rounded-lg">How it Works</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-[#702ae1] hover:bg-[#edd3ff]/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link href="/client/settings" className="p-2 text-[#702ae1] hover:bg-[#edd3ff]/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </Link>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container-high flex items-center justify-center">
              {profile?.avatar_url ? (
                <img alt="Profile" className="w-full h-full object-cover" src={profile.avatar_url} />
              ) : (
                <span className="text-xl font-bold text-primary">{firstName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <form action={signOutAction as any}>
              <button type="submit" className="hidden md:flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#69537b] hover:bg-[#edd3ff]/50 rounded-full transition-colors">
                <span className="material-symbols-outlined text-sm">logout</span>
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-24 md:pb-16 px-6 max-w-6xl mx-auto">

        {/* Welcome Header */}
        <div className="mb-10">
          <p className="text-[#69537b] font-medium mb-1">Welcome back, {firstName} 👋</p>
          <h1 className="text-4xl font-extrabold text-[#3a264b] tracking-tight">My Jobs</h1>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link href="/post-job" className="group p-6 bg-gradient-to-br from-[#702ae1] to-[#b28cff] text-white rounded-2xl shadow-lg shadow-primary/15 hover:scale-[1.02] transition-all flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">Post a New Job</p>
              <p className="text-sm text-white/80">Get quotes within minutes</p>
            </div>
            <span className="material-symbols-outlined text-3xl opacity-80 group-hover:translate-x-1 transition-transform">add_circle</span>
          </Link>
          <Link href="/find-a-pro" className="group p-6 bg-white border border-[#edd3ff] rounded-2xl hover:border-[#b28cff] transition-all flex items-center justify-between">
            <div>
              <p className="font-bold text-lg text-[#3a264b]">Browse Pros</p>
              <p className="text-sm text-[#69537b]">Top-rated service providers</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-[#702ae1] opacity-60 group-hover:translate-x-1 transition-transform">search</span>
          </Link>
          <div className="p-6 bg-white border border-[#edd3ff] rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#702ae1]">verified_user</span>
              <p className="text-sm text-[#69537b]">Member since</p>
            </div>
            <p className="font-bold text-lg text-[#3a264b]">{memberSince}</p>
            <div className="flex gap-4 mt-3">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-[#702ae1]">{activeJobs.length}</p>
                <p className="text-[10px] text-[#69537b] uppercase tracking-wider font-bold">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-[#702ae1]">{completedJobs.length}</p>
                <p className="text-[10px] text-[#69537b] uppercase tracking-wider font-bold">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Jobs */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#3a264b] flex items-center gap-2">
              Active Jobs
              {ongoingCount > 0 && (
                <span className="bg-[#702ae1]/10 text-[#702ae1] font-bold px-3 py-1 rounded-full text-xs">
                  {ongoingCount} In Progress
                </span>
              )}
              {pendingCount > 0 && (
                <span className="bg-[#ff8eac]/20 text-[#9e3657] font-bold px-3 py-1 rounded-full text-xs">
                  {pendingCount} Pending
                </span>
              )}
            </h2>
          </div>

          {activeJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeJobs.map(job => {
                const isPending = job.status === "pending";
                const proInfo = job.pro as any;
                const proName = [proInfo?.first_name, proInfo?.last_name].filter(Boolean).join(" ") || "Unknown Pro";

                return (
                  <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#edd3ff]/50 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      {/* Status & Icon */}
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          isPending ? "bg-[#ff8eac]/20 text-[#9e3657]" : "bg-[#e6c5ff] text-[#612c90]"
                        }`}>
                          <span className="material-symbols-outlined text-xl">
                            {isPending ? "hourglass_empty" : "work"}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          isPending
                            ? "text-[#9e3657] bg-[#ff8eac]/15"
                            : "text-[#702ae1] bg-[#702ae1]/10"
                        }`}>
                          {isPending ? "Pending" : "In Progress"}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#3a264b] mb-1 leading-tight">{job.title}</h3>
                      <p className="text-sm text-[#69537b] mb-1">
                        {isPending ? "Waiting on" : "Assigned to"}{" "}
                        <span className="font-semibold text-[#7742a6]">{proName}</span>
                      </p>
                      {job.budget && (
                        <p className="text-sm font-bold text-[#702ae1]">${job.budget}</p>
                      )}
                    </div>

                    {/* Action */}
                    <div className="mt-5 pt-4 border-t border-[#f5e2ff]">
                      {isPending ? (
                        <p className="text-xs text-[#69537b] italic">
                          Submitted {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      ) : (
                        <Link
                          href={`/messages/${job.id}`}
                          className="w-full py-2.5 bg-[#702ae1] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#6411d5] active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">chat</span>
                          Message Pro
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 border-2 border-dashed border-[#bda3d1]/30 rounded-2xl flex flex-col items-center justify-center text-center bg-white">
              <span className="material-symbols-outlined text-[#856e98] mb-3 text-4xl">inbox</span>
              <p className="text-sm font-semibold text-[#69537b] mb-4">You have no active or pending jobs.</p>
              <Link href="/find-a-pro" className="bg-[#702ae1] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#6411d5] transition-colors">
                Find a Professional
              </Link>
            </div>
          )}
        </section>

        {/* Job History */}
        <section>
          <h2 className="text-xl font-bold text-[#3a264b] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#702ae1]">history</span>
            Job History
          </h2>
          {completedJobs.length > 0 ? (
            <div className="space-y-3">
              {completedJobs.map(job => {
                const proInfo = job.pro as any;
                const proName = [proInfo?.first_name, proInfo?.last_name].filter(Boolean).join(" ") || "Pro";
                return (
                  <div key={job.id} className="bg-white p-5 rounded-2xl border border-[#edd3ff]/50 flex items-center gap-5 hover:shadow-sm transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-green-600">check_circle</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-[#3a264b]">{job.title}</h4>
                      <p className="text-sm text-[#69537b]">Completed by {proName}{job.budget ? ` • $${job.budget}` : ""}</p>
                    </div>
                   </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-[#edd3ff]/50 text-center">
              <p className="text-sm text-[#69537b]">No completed jobs yet. Your history will appear here.</p>
            </div>
          )}
        </section>

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

      <div className="md:hidden fixed bottom-0 w-full bg-white/80 backdrop-blur-lg border-t border-[#edd3ff] px-4 py-3 flex justify-around items-center z-50">
        <Link href="/client/dashboard" className="flex flex-col items-center gap-0.5 text-[#702ae1]">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
          <span className="text-[10px] font-bold">Jobs</span>
        </Link>
        <Link href="/find-a-pro" className="flex flex-col items-center gap-0.5 text-[#69537b]">
          <span className="material-symbols-outlined text-xl">search</span>
          <span className="text-[10px] font-bold">Find Pro</span>
        </Link>
        <Link href="/post-job" className="flex flex-col items-center gap-0.5 text-[#69537b]">
          <span className="material-symbols-outlined text-xl">add_circle</span>
          <span className="text-[10px] font-bold">Post Job</span>
        </Link>
        <Link href="/client/settings" className="flex flex-col items-center gap-0.5 text-[#69537b]">
          <span className="material-symbols-outlined text-xl">settings</span>
          <span className="text-[10px] font-bold">Settings</span>
        </Link>
      </div>
    </div>
  );
}
