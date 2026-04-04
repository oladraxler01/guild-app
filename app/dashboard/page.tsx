import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditProfileForm from "./EditProfileForm";
import { handleJobAction } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Authentication & Fetching
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch the user's specific row from the profiles table
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    // You could redirect or render an error page
  }

  const firstName = profile?.first_name || user.user_metadata?.first_name || "Pro";

  // Data for the EditProfileForm
  const initialProfileData = {
    bio: profile?.bio || null,
    services: Array.isArray(profile?.services) ? profile.services.join(", ") : (profile?.services || null),
    hourly_rate: profile?.hourly_rate || null,
  };

  const { data: jobRequests, error: jobsError } = await supabase
    .from("job_requests")
    .select("*")
    .eq("pro_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: activeJobs } = await supabase
    .from("job_requests")
    .select("*")
    .eq("pro_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Map client profiles for active jobs
  let clientProfiles: Record<string, any> = {};
  if (activeJobs && activeJobs.length > 0) {
    const clientIds = activeJobs.map(j => j.client_id);
    const { data: profiles } = await supabase.from("profiles").select("id, first_name, last_name, avatar_url").in("id", clientIds);
    
    if (profiles) {
      clientProfiles = profiles.reduce<Record<string, any>>((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});
    }
  }

  return (
    <div className="min-h-screen bg-[#fef3ff] text-[#3a264b] font-['Plus_Jakarta_Sans'] pb-12">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .glass-nav {
            background-color: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
        }
        .tonal-gradient {
            background: linear-gradient(135deg, #702ae1 0%, #b28cff 100%);
        }
      `,
        }}
      />
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-extrabold text-purple-700 tracking-tighter">
            <Link href="/">
              <span style={{ color: "rgb(58, 38, 75)", letterSpacing: "-0.6px" }}>Guild</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="text-slate-500 hover:text-purple-500 transition-colors text-sm tracking-wide"
              href="#"
            >
              Messages
            </a>
            <a
              className="text-purple-700 font-bold border-b-2 border-purple-600 pb-1 text-sm tracking-wide"
              href="#"
            >
              My Jobs
            </a>
            <a
              className="text-slate-500 hover:text-purple-500 transition-colors text-sm tracking-wide"
              href="#"
            >
              Explore
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-purple-50 rounded-full transition-all active:scale-95 duration-150">
              <span className="material-symbols-outlined text-slate-500">notifications</span>
            </button>
            <button className="p-2 hover:bg-purple-50 rounded-full transition-all active:scale-95 duration-150">
              <span className="material-symbols-outlined text-slate-500">settings</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-purple-100 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  alt="User profile"
                  src={profile.avatar_url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-primary">{firstName.charAt(0)}</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Welcome Section & Availability */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-on-surface-variant font-medium tracking-wide mb-1">
              Welcome back, {firstName}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight">
              Pro Dashboard
            </h1>
          </div>
          {/* Availability Toggle */}
          <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4 w-fit">
            <span className="text-sm font-semibold text-on-surface-variant">
              Accepting Requests
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input defaultChecked className="sr-only peer" type="checkbox" />
              <div
                className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
              ></div>
            </label>
          </div>
        </header>

        {/* Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: New Job Requests (Asymmetric focus) */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                New Job Requests
                {jobRequests && jobRequests.length > 0 && (
                  <span className="bg-primary-container text-on-primary-container text-xs px-2 py-1 rounded-full">
                    {jobRequests.length} New
                  </span>
                )}
              </h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {jobRequests && jobRequests.length > 0 ? (
                jobRequests.map((job) => (
                  <div key={job.id} className="p-5 border border-outline-variant/50 rounded-2xl bg-surface-container-lowest hover:bg-white transition-colors cursor-pointer group shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{job.title}</h3>
                      {job.budget && <span className="text-primary font-extrabold">${job.budget}</span>}
                    </div>
                    <p className="text-sm text-on-surface-variant opacity-80 mb-3 line-clamp-2">
                      {job.description || "No description provided."}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <form action={handleJobAction.bind(null, job.id, "active") as any} className="flex-1">
                        <button type="submit" className="w-full py-2.5 bg-primary text-on-primary text-sm font-bold rounded-xl active:scale-95 transition-all shadow-sm hover:bg-primary-dim">Accept & Chat</button>
                      </form>
                      <form action={handleJobAction.bind(null, job.id, "declined") as any} className="flex-1">
                        <button type="submit" className="w-full py-2.5 bg-surface-container-high text-on-surface text-sm font-bold rounded-xl active:scale-95 transition-all hover:bg-surface-container">Decline</button>
                      </form>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 border-2 border-dashed border-outline-variant/30 rounded-2xl flex flex-col items-center justify-center text-center bg-surface-container-lowest">
                  <span className="material-symbols-outlined text-outline mb-2 text-3xl">inbox</span>
                  <p className="text-sm font-semibold text-on-surface-variant opacity-80">No pending job requests.</p>
                </div>
              )}
            </div>

            {/* Active Jobs Section */}
            <div className="flex items-center justify-between mb-4 mt-12">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                Active Jobs & Chats
              </h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {activeJobs && activeJobs.length > 0 ? (
                activeJobs.map((job) => {
                  const client = clientProfiles[job.client_id];
                  
                  return (
                    <div key={job.id} className="p-5 border border-primary/20 rounded-2xl bg-[#faecff]/30 hover:bg-[#faecff]/50 transition-colors cursor-pointer group shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                            {client?.avatar_url ? (
                              <img src={client.avatar_url} className="w-full h-full object-cover" alt="Client" />
                            ) : (
                              <span className="text-primary font-bold text-xs">{client?.first_name?.charAt(0) || "C"}</span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                            {job.title}
                          </h3>
                        </div>
                        <p className="text-sm font-medium text-primary">
                          Client: {client?.first_name || "Unknown"} {client?.last_name || ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 mt-3 md:mt-0">
                        {job.budget && <span className="text-primary font-extrabold text-lg">${job.budget}</span>}
                        <Link href={`/messages/${job.id}`}>
                          <button className="px-6 py-2.5 bg-white border-2 border-primary text-primary text-sm font-bold rounded-xl active:scale-95 transition-all shadow-sm hover:bg-primary-50">
                            Continue Chat
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 border border-outline-variant/20 rounded-2xl flex items-center justify-center bg-surface-container-lowest">
                  <p className="text-sm font-medium text-on-surface-variant opacity-70">No active jobs at the moment.</p>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: My Earnings & Stats */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Earnings Card */}
            <div className="bg-surface-container-low p-8 rounded-lg">
              <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                Total Balance
              </h2>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-on-surface">$2,480</span>
                <span className="text-lg font-bold text-secondary">.50</span>
              </div>
              <p className="text-on-surface-variant text-sm mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-green-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  arrow_upward
                </span>
                12% increase from last month
              </p>
              <button className="w-full mt-8 py-4 bg-white text-primary font-bold rounded-xl border border-primary/10 hover:bg-primary/5 transition-colors">
                Withdraw Funds
              </button>
            </div>

            {/* Recent Payouts */}
            <div className="bg-surface-container-lowest p-6 rounded-lg">
              <h3 className="font-bold text-on-surface mb-6">Recent Payouts</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary-container">
                        account_balance
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Bank Transfer</p>
                      <p className="text-xs text-on-surface-variant">Oct 24, 2024</p>
                    </div>
                  </div>
                  <span className="font-bold text-on-surface">-$1,200.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-tertiary-container">
                        payments
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Commission Earned</p>
                      <p className="text-xs text-on-surface-variant">Oct 22, 2024</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">+$350.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary-container">
                        account_balance
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Bank Transfer</p>
                      <p className="text-xs text-on-surface-variant">Oct 18, 2024</p>
                    </div>
                  </div>
                  <span className="font-bold text-on-surface">-$840.00</span>
                </div>
              </div>
            </div>

            {/* Growth Tip / Promo - REPLACED WITH EDIT PROFILE BUTTON */}
            <div className="bg-inverse-surface p-6 rounded-lg text-inverse-on-surface">
              <span className="material-symbols-outlined mb-4 text-primary-fixed">
                lightbulb
              </span>
              <h4 className="font-bold text-white">Boost your profile</h4>
              <p className="text-sm mt-2 opacity-80 leading-relaxed">
                Artisans with completed profiles see 40% more job requests. Add your services and rates to stand out.
              </p>
              
              <EditProfileForm initialData={initialProfileData} />
            </div>
          </aside>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-lg font-bold text-purple-800 mb-2">Connect</div>
            <p className="text-xs font-medium text-slate-400">
              © 2024 Radiant Connect. Human-centered marketplace.
            </p>
          </div>
          <div className="flex gap-8">
            <a
              className="text-xs font-medium text-slate-400 hover:text-purple-600 underline-offset-4 hover:underline transition-opacity"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-xs font-medium text-slate-400 hover:text-purple-600 underline-offset-4 hover:underline transition-opacity"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-xs font-medium text-slate-400 hover:text-purple-600 underline-offset-4 hover:underline transition-opacity"
              href="#"
            >
              Help Center
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-white/70 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-between items-center z-50">
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-purple-700">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            work
          </span>
          <span className="text-[10px] font-bold">My Jobs</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">chat</span>
          <span className="text-[10px] font-bold">Messages</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
}
