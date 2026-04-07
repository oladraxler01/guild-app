import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function BrowseJobsPage() {
  const supabase = await createClient();

  // Fetch pending job requests mapped with client details
  const { data: rawJobs, error } = await supabase
    .from("job_requests")
    .select(`*`)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  let jobs = rawJobs || [];

  // Map Client profiles
  if (jobs.length > 0) {
    const clientIds = jobs.map((j) => j.client_id).filter(Boolean);
    if (clientIds.length > 0) {
      const { data: clientProfiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url")
        .in("id", clientIds);

      const clientMap: Record<string, any> = {};
      clientProfiles?.forEach((p) => (clientMap[p.id] = p));

      jobs = jobs.map(job => ({
        ...job,
        client: job.client_id ? clientMap[job.client_id] : null
      }));
    }
  }

  return (
    <div className="bg-[#fef3ff] text-[#3a264b] min-h-screen font-['Plus_Jakarta_Sans'] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-6 max-w-screen-xl mx-auto w-full">
        {/* Header & Search Section */}
        <section className="mb-12">
          <h1 className="text-5xl font-extrabold text-[#3a264b] tracking-tighter mb-8 leading-tight">
            Browse <span className="text-[#702ae1]">Open Jobs</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative w-full md:flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#856e98]">search</span>
              </div>
              <input 
                className="w-full bg-white border-none outline-none ring-1 ring-[#bda3d1]/30 focus:ring-[#702ae1] h-14 pl-12 pr-6 rounded-full text-lg transition-all shadow-sm" 
                placeholder="Search tasks, skills, or clients..." 
                type="text"
              />
            </div>
            {/* Location Filter */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#856e98]">location_on</span>
              </div>
              <select className="w-full bg-white border-none outline-none ring-1 ring-[#bda3d1]/30 focus:ring-[#702ae1] h-14 pl-12 pr-10 rounded-full text-[#69537b] appearance-none cursor-pointer shadow-sm">
                <option>Everywhere</option>
                <option>Garki, Abuja</option>
                <option>Lekki, Lagos</option>
                <option>Wuse, Abuja</option>
              </select>
            </div>
          </div>
        </section>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              const client = job.client;
              const isPremium = job.budget && job.budget >= 1000;

              if (isPremium) {
                return (
                  <div key={job.id} className="group bg-gradient-to-br from-[#702ae1] to-[#b28cff] rounded-2xl p-6 flex flex-col justify-between hover:translate-y-[-4px] shadow-xl shadow-primary/20 transition-all duration-300">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md overflow-hidden shrink-0 text-white font-bold">
                            {client?.avatar_url ? (
                              <Image src={client.avatar_url} width={40} height={40} className="object-cover w-full h-full" alt="Client" />
                            ) : (
                              client?.first_name?.charAt(0) || "C"
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-tight">{client?.first_name || "Premium"} {client?.last_name || "Client"}</p>
                            <p className="text-xs text-white/80 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">location_on</span> Remote
                            </p>
                          </div>
                        </div>
                        <span className="bg-white/20 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md">Featured</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 leading-tight">{job.title}</h3>
                      <p className="text-white/90 text-sm leading-relaxed mb-6 line-clamp-2">
                        {job.description || "No description provided."}
                      </p>
                    </div>
                    <div className="pt-6 mt-auto border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/80 font-medium">Budget</p>
                        <p className="text-xl font-extrabold text-white">${job.budget}</p>
                      </div>
                      <Link href="/auth/login">
                        <button className="bg-white text-[#702ae1] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-opacity-90 transition-all shadow-sm">
                          View & Bid
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <div key={job.id} className="group bg-white rounded-2xl p-6 flex flex-col justify-between hover:translate-y-[-4px] shadow-sm hover:shadow-md border border-[#edd3ff]/50 transition-all duration-300">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f5e2ff] text-[#702ae1] font-bold flex items-center justify-center overflow-hidden shrink-0">
                          {client?.avatar_url ? (
                            <Image src={client.avatar_url} width={40} height={40} className="object-cover w-full h-full" alt="Client" />
                          ) : (
                            client?.first_name?.charAt(0) || "C"
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#3a264b] leading-tight">{client?.first_name || "Client"} {client?.last_name || ""}</p>
                          <p className="text-xs text-[#69537b] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">location_on</span> Online
                          </p>
                        </div>
                      </div>
                      <span className="bg-[#e6c5ff] text-[#612c90] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">New</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#3a264b] mb-3 group-hover:text-[#702ae1] transition-colors leading-tight">{job.title}</h3>
                    <p className="text-[#69537b] text-sm leading-relaxed mb-6 line-clamp-2">
                      {job.description || "No description provided."}
                    </p>
                  </div>
                  <div className="pt-6 mt-auto border-t border-[#edd3ff]/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#69537b] font-medium">Budget</p>
                      <p className="text-xl font-extrabold text-[#702ae1]">${job.budget || "Open"}</p>
                    </div>
                    <Link href="/auth/login">
                      <button className="bg-[#edd3ff]/50 text-[#702ae1] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#702ae1] hover:text-white transition-all shadow-sm">
                        View & Bid
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-70">
              <span className="material-symbols-outlined text-6xl text-[#856e98] mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>search_off</span>
              <h3 className="text-2xl font-bold text-[#3a264b] mb-2">No Open Jobs</h3>
              <p className="text-[#69537b] max-w-md">There are currently no open jobs available. Check back soon when clients post new requests.</p>
            </div>
          )}
        </div>

        {jobs.length > 0 && (
          <div className="mt-16 flex flex-col items-center gap-6">
            <button className="bg-white text-[#3a264b] font-semibold px-12 py-4 rounded-full ring-1 ring-[#bda3d1]/30 hover:ring-[#702ae1] transition-all flex items-center gap-2 shadow-sm">
              Load More Jobs
              <span className="material-symbols-outlined">expand_more</span>
            </button>
            <p className="text-[#69537b] text-sm">Showing {jobs.length} of {jobs.length} open jobs</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
