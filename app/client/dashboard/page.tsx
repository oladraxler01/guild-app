import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default async function ClientDashboard() {
  const supabase = await createClient();

  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  // Double check role
  if (user.user_metadata?.role !== "client") {
    // If a pro somehow ends up here, bump them back to pro dashboard
    if (user.user_metadata?.role === "pro") redirect("/dashboard");
  }

  // Fetch client's own profile info
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const firstName = profile?.first_name || user.user_metadata?.first_name || "Client";
  const avatarUrl = profile?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBbqzaZsxRBv-3YkHF-KTLolK4Tc8jX2vC0Wvqf9Jrd4iFajfDkDwVhK8sScqbl0lzCvQD9Ej1tb9Yiu8aZzPGmgh6hCWUq2BWzNr-J2twVsJM206xUzhk2Wkh3Inm7EvZ6Fu9EuKsfVyPx5T0VTqvcohL3JGWipCcntXAwOG4oZoCAr72CpoFZgYbNP41jqZJ2moXdWsYKUscZ5Jgbe_SLAutDXf9lBlqiycVpFb90Dlp5ot0lkkmK1o_2y5orHi4QNd34JOt7SX0";

  // 2. Fetch Job Requests assigned to this client
  const { data: jobRequests, error: jobsError } = await supabase
    .from("job_requests")
    .select(`
      *,
      pro:profiles!pro_id (first_name, last_name, avatar_url)
    `)
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (jobsError) {
    console.error("Failed to fetch jobs:", jobsError);
  }

  const activeJobs = jobRequests?.filter(j => j.status === 'active' || j.status === 'pending') || [];
  const ongoingCount = activeJobs.filter(j => j.status === 'active').length;

  return (
    <div className="bg-[#fef3ff] text-[#3a264b] min-h-screen font-['Plus_Jakarta_Sans'] font-[400]">
      
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-lg shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter cursor-pointer" style={{ color: "rgb(58, 38, 75)", letterSpacing: "-0.6px" }}>
              Guild
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/messages" className="text-slate-500 hover:text-purple-500 transition-colors text-sm tracking-wide">Messages</Link>
              <Link href="/client/dashboard" className="text-purple-700 font-bold border-b-2 border-purple-600 pb-1 text-sm tracking-wide">My Jobs</Link>
              <Link href="/find-a-pro" className="text-slate-500 hover:text-purple-500 transition-colors text-sm tracking-wide">Explore</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-purple-50 rounded-full transition-all active:scale-95 duration-150">
              <span className="material-symbols-outlined text-[#69537b]">notifications</span>
            </button>
            <button className="p-2 hover:bg-purple-50 rounded-full transition-all active:scale-95 duration-150">
              <span className="material-symbols-outlined text-[#69537b]">settings</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#b28cff]">
              <img alt="User profile" src={avatarUrl} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Header Section */}
          <header>
            <h1 className="text-4xl font-extrabold text-[#3a264b] tracking-tight mb-2">My Jobs</h1>
            <p className="text-[#69537b] text-lg">Manage your active projects and service history, {firstName}.</p>
          </header>

          {/* Active Jobs Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#3a264b]">Active Jobs</h2>
              {ongoingCount > 0 && (
                <span className="bg-[#b28cff]/20 text-[#702ae1] font-bold px-3 py-1 rounded-full text-xs tracking-wider">
                  {ongoingCount} ONGOING
                </span>
              )}
            </div>

            {activeJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeJobs.map(job => {
                  const isPending = job.status === "pending";
                  const proInfo = job.pro as any;
                  const proName = [proInfo?.first_name, proInfo?.last_name].filter(Boolean).join(" ") || "Unknown Pro";
                  const proAvatar = proInfo?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDHKcCCQA08xlNMaQD-VTdFd3mWizXWzQ33lJO8_MuSffvwEBiCQ0_GqwRoTjQW1lEC130JHw1z83vaC5EQdGQVAavFWXZAWOoMjTLk8dRY9BfaUdIFxIoDWS4lb9LK2Nau-Sg9MmQ-6XYqr4cGE-1g19JkYjRXnVDefnmWxjmwxPOHueKB4d5X_55ByGtC3UVZEXGuRtkVnXNQdBD0MJnQpFE_gvujS4qo0tB3yrZVFWdGTyGW8vtk4xy7OxtD3fVpiGeekaaBG7E";

                  return (
                    <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-[#bda3d1]/15 flex flex-col justify-between">
                      <div>
                        {/* Status Heading */}
                        <div className="flex justify-between items-start mb-4">
                          {isPending ? (
                            <div className="w-12 h-12 rounded-lg bg-[#ff8eac]/30 flex items-center justify-center text-[#9e3657]">
                              <span className="material-symbols-outlined">hourglass_empty</span>
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#e6c5ff] flex items-center justify-center text-[#612c90]">
                              <span className="material-symbols-outlined">work</span>
                            </div>
                          )}
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${isPending ? "text-[#69537b] bg-[#edd3ff]" : "text-[#702ae1] bg-[#702ae1]/10"}`}>
                            {isPending ? "Awaiting Response" : "In Progress"}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-[#3a264b] mb-1">{job.title}</h3>
                        <p className="text-sm text-[#69537b] mb-4">
                          {isPending ? (
                            <span>Waiting on {proName}</span>
                          ) : (
                            <span>Assigned to: <span className="font-semibold text-[#7742a6]">{proName}</span></span>
                          )}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f5e2ff]">
                        {isPending ? (
                          <>
                            <span className="text-xs text-[#69537b] italic">
                              Budget: ${job.budget}
                            </span>
                            <span className="text-xs text-[#69537b] italic opacity-70">
                              {new Date(job.created_at).toLocaleDateString()}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="flex -space-x-2">
                              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src={proAvatar} alt={proName} />
                            </div>
                            <Link href={`/messages/${job.id}`}>
                              <button className="text-[#702ae1] text-sm font-bold flex items-center gap-1 hover:underline">
                                Message <span className="material-symbols-outlined text-sm">chat</span>
                              </button>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-[#bda3d1]/30 rounded-2xl flex flex-col items-center justify-center text-center bg-white shadow-sm">
                <span className="material-symbols-outlined text-[#856e98] mb-2 text-3xl">inbox</span>
                <p className="text-sm font-semibold text-[#69537b] opacity-80 mb-4">You have no active or pending jobs.</p>
                <Link href="/find-a-pro" className="bg-[#702ae1] text-white px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
                  Find a Professional
                </Link>
              </div>
            )}
          </section>

          {/* Past Jobs Section (Static Placeholder as requested) */}
          <section>
            <h2 className="text-xl font-bold text-[#3a264b] mb-6">Job History</h2>
            <div className="space-y-4">
              <div className="bg-[#faecff] p-5 rounded-lg flex items-center gap-6 hover:bg-[#f5e2ff] transition-colors">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-white">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWduwVUT0u9mfWeluPMpSEANlkzRomhW3w-fN7a_Y33Edz4XU_sqU6AUmsE3EXkdkX_1cVTLFZt_DHadMvQfISHaXqBBDpMVk4ynhbYTbvSvYb0M-fqnO8eihVmrz2D4r-KYf3zvwtf_jX-a1X-U2TDrm2MZ5Qtv6mTrpa7EMgTCT0dGogDtnRGKd5H3OPiKMmfYhB-hYaDBBkQZXQkQFfqv0RWsaWZB7w7gWejYC7DC87__dyBx0t4alLf6IPOCM02DruGIyzwME" className="w-full h-full object-cover" alt="Garden History" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-[#3a264b]">Garden Landscaping</h4>
                  <p className="text-sm text-[#69537b]">Completed Oct 12, 2023 • $450.00</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex text-[#9e3657]">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#6a3599] uppercase tracking-tighter">Excellent Service</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar Actions */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Quick Actions Bento */}
          <div className="bg-[#faecff] p-8 rounded-lg space-y-6">
            <h3 className="text-lg font-extrabold text-[#3a264b] tracking-tight">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              <button className="w-full flex items-center justify-between p-4 bg-gradient-to-br from-[#702ae1] to-[#b28cff] text-white rounded-lg shadow-lg hover:scale-[1.02] transition-transform text-left group">
                <div>
                  <span className="block font-bold text-lg">Post a New Job</span>
                  <span className="text-xs text-white/80">Get quotes within minutes</span>
                </div>
                <span className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform">add_circle</span>
              </button>
              
              <Link href="/find-a-pro" className="w-full flex items-center justify-between p-4 bg-[#edd3ff] text-[#702ae1] rounded-lg hover:bg-[#f1daff] transition-colors text-left group">
                <div>
                  <span className="block font-bold text-lg">Browse Pros</span>
                  <span className="text-xs text-[#69537b]">Top-rated service providers</span>
                </div>
                <span className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform">search</span>
              </Link>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-[#e6c5ff]/30 p-8 rounded-lg border border-[#e6c5ff]">
            <h4 className="text-[#7742a6] font-bold text-sm uppercase tracking-widest mb-4">Account Summary</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#7742a6]">verified_user</span>
              </div>
              <div>
                <p className="text-xs text-[#69537b]">Member since</p>
                <p className="text-sm font-bold text-[#3a264b]">January 2023</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="text-[10px] text-[#69537b] uppercase">Jobs Completed</p>
                <p className="text-xl font-extrabold text-[#7742a6]">24</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="text-[10px] text-[#69537b] uppercase">Avg. Rating</p>
                <p className="text-xl font-extrabold text-[#7742a6]">4.9</p>
              </div>
            </div>
          </div>

        </aside>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-bold text-purple-800">Connect</span>
            <p className="text-xs font-medium text-slate-400">© 2024 Radiant Connect. Human-centered marketplace.</p>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="flex-1 text-xs font-medium text-slate-400 hover:text-purple-600 underline-offset-4 hover:underline">Privacy Policy</Link>
            <Link href="#" className="flex-1 text-xs font-medium text-slate-400 hover:text-purple-600 underline-offset-4 hover:underline">Terms of Service</Link>
            <Link href="#" className="flex-1 text-xs font-medium text-slate-400 hover:text-purple-600 underline-offset-4 hover:underline">Help Center</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
