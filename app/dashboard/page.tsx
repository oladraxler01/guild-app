import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { handleJobAction } from "./actions";
import { MarkCompleteButton } from "@/components/PaymentButtons";

export default async function DashboardPage() {
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

  // Pending job requests
  const { data: jobRequests } = await supabase
    .from("job_requests")
    .select("*")
    .eq("pro_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // Active jobs
  const { data: activeJobs } = await supabase
    .from("job_requests")
    .select("*")
    .eq("pro_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Map client profiles for active jobs
  let clientProfiles: Record<string, any> = {};
  if (activeJobs && activeJobs.length > 0) {
    const clientIds = activeJobs.map((j) => j.client_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url")
      .in("id", clientIds);

    if (profiles) {
      clientProfiles = profiles.reduce<Record<string, any>>((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {});
    }
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-on-surface-variant font-medium tracking-wide">Welcome back, {firstName}</p>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">Pro Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/find-a-pro/${user.id}`}
            className="px-6 py-3 rounded-full text-primary font-bold hover:bg-surface-container-highest transition-colors"
          >
            View Public Profile
          </Link>
          <Link
            href="/dashboard/profile"
            className="px-8 py-3 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Job Feeds */}
        <section className="lg:col-span-8 space-y-6">
          {/* New Job Requests */}
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
                        {(job.payment_status === "funded" || job.payment_status === "awaiting_release") && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">💰 Funded</span>
                        )}
                        {job.payment_status === "released" && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase">✅ Completed</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-primary">
                        Client: {client?.first_name || "Unknown"} {client?.last_name || ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 mt-3 md:mt-0">
                      {job.budget && <span className="text-primary font-extrabold text-lg">${job.budget}</span>}
                      {job.payment_status === "funded" && (
                        <MarkCompleteButton jobId={job.id} />
                      )}
                      <Link href={`/messages/${job.id}`}>
                        <button className="px-6 py-2.5 bg-white border-2 border-primary text-primary text-sm font-bold rounded-xl active:scale-95 transition-all shadow-sm hover:bg-primary/5">
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

        {/* Right Column: Earnings & Stats */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Earnings Card */}
          <div className="bg-surface-container-low p-8 rounded-lg">
            <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Total Balance</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-on-surface">$0</span>
              <span className="text-lg font-bold text-secondary">.00</span>
            </div>
            <p className="text-on-surface-variant text-sm mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-green-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                arrow_upward
              </span>
              Earnings will appear here
            </p>
            <button className="w-full mt-8 py-4 bg-white text-primary font-bold rounded-xl border border-primary/10 hover:bg-primary/5 transition-colors">
              Withdraw Funds
            </button>
          </div>

          {/* Profile Strength */}
          <div className="bg-gradient-to-br from-[#702ae1] to-[#b28cff] rounded-lg p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">Profile Strength</p>
              <p className="text-sm font-bold">
                {(() => {
                  let score = 20;
                  if (profile?.bio) score += 20;
                  if (profile?.services && Array.isArray(profile.services) && profile.services.length > 0) score += 20;
                  if (profile?.hourly_rate) score += 20;
                  if (profile?.portfolio_urls && Array.isArray(profile.portfolio_urls) && profile.portfolio_urls.length > 0) score += 20;
                  return `${score}%`;
                })()}
              </p>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: `${(() => {
                    let score = 20;
                    if (profile?.bio) score += 20;
                    if (profile?.services && Array.isArray(profile.services) && profile.services.length > 0) score += 20;
                    if (profile?.hourly_rate) score += 20;
                    if (profile?.portfolio_urls && Array.isArray(profile.portfolio_urls) && profile.portfolio_urls.length > 0) score += 20;
                    return score;
                  })()}%`,
                }}
              ></div>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              Complete your profile to rank higher in search and attract more clients.
            </p>
            <Link
              href="/dashboard/profile"
              className="block text-center w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors"
            >
              Complete Profile →
            </Link>
          </div>

          {/* Trust & Activity */}
          <div className="bg-surface-container-low rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified_user</span> Trust & Activity
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl shadow-sm space-y-2 border border-primary/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-on-surface">Identity Check</span>
                  {profile?.nin ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Verified</span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full uppercase">Pending</span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant">
                  {profile?.nin
                    ? "Your NIN has been successfully linked and verified."
                    : "Please complete your NIN verification to unlock top-tier badges."}
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-on-surface">Real-time Availability</span>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative flex items-center px-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-6 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
