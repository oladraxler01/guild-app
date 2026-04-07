import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";

import { BidForm } from "./BidForm";

export const dynamic = "force-dynamic";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const supabase = await createClient();

  // 1. Fetch Job
  const { data: job, error: jobError } = await supabase
    .from("job_requests")
    .select("*")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    console.error("Job Fetch Error:", jobError);
    notFound();
  }

  // 2. Fetch Client Info
  const { data: client } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", job.client_id)
    .single();

  // 3. Fetch Bids
  const { data: bids } = await supabase
    .from("job_bids")
    .select(`
      *,
      pro:profiles!pro_id (id, first_name, last_name, avatar_url)
    `)
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  const timeAgo = formatDistanceToNow(new Date(job.created_at), { addSuffix: true });

  return (
    <div className="bg-[#fef3ff] text-[#3a264b] antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto flex-grow w-full">
        {/* Job Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#e6c5ff] text-[#612c90] text-xs font-bold tracking-wide rounded-full uppercase">
                  {job.status === 'active' ? 'Awarded' : 'Active Post'}
                </span>
                <span className="text-[#69537b] text-sm font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span> {timeAgo}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#3a264b] tracking-tight mb-4">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-[#69537b] font-medium">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#702ae1]">verified</span>
                  <span>Premium Client (Verified)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#702ae1]">distance</span>
                  <span>{job.location_type || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#702ae1]">category</span>
                  <span>{job.category || 'General'}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="material-symbols-outlined p-4 rounded-full bg-[#f1daff] text-[#702ae1] hover:bg-[#edd3ff] transition-colors">share</button>
              <button className="material-symbols-outlined p-4 rounded-full bg-[#f1daff] text-[#702ae1] hover:bg-[#edd3ff] transition-colors">bookmark_border</button>
            </div>
          </div>
        </header>

        {/* Bento Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details & Description */}
          <div className="lg:col-span-8 space-y-10">
            {/* Project Metrics Bento Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#faecff] p-6 rounded-2xl flex flex-col gap-2 border border-[#edd3ff]/30">
                <span className="text-[#69537b] text-sm font-semibold uppercase tracking-wider">Budget</span>
                <span className="text-2xl font-bold text-[#3a264b]">${job.budget?.toLocaleString()}</span>
              </div>
              <div className="bg-[#faecff] p-6 rounded-2xl flex flex-col gap-2 border border-[#edd3ff]/30">
                <span className="text-[#69537b] text-sm font-semibold uppercase tracking-wider">Timeline</span>
                <span className="text-2xl font-bold text-[#3a264b]">{job.timeline || 'Not set'}</span>
              </div>
              <div className="bg-[#faecff] p-6 rounded-2xl flex flex-col gap-2 border border-[#edd3ff]/30">
                <span className="text-[#69537b] text-sm font-semibold uppercase tracking-wider">Complexity</span>
                <span className="text-2xl font-bold text-[#3a264b]">{job.complexity || 'General'}</span>
              </div>
            </div>

            {/* Description Block */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#3a264b]">Full Job Description</h3>
              <div className="prose max-w-none text-[#69537b] text-lg leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Skills Required */}
            {job.skills && job.skills.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#3a264b]">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string) => (
                    <span key={skill} className="px-4 py-2 bg-[#e6c5ff] text-[#612c90] rounded-full text-sm font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Bidding Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <BidForm jobId={jobId} />

            {/* Other Bids List */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#3a264b]">Activity</h3>
                <span className="text-sm font-medium text-[#69537b]">{bids?.length || 0} Bids placed</span>
              </div>
              <div className="space-y-4">
                {bids && bids.length > 0 ? (
                  bids.map((bid: any) => (
                    <div key={bid.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#edd3ff]/50 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f1daff] flex items-center justify-center overflow-hidden shrink-0">
                          {bid.pro?.avatar_url ? (
                            <Image src={bid.pro.avatar_url} width={40} height={40} className="object-cover w-full h-full" alt="Avatar" />
                          ) : (
                            <span className="material-symbols-outlined text-[#702ae1]">person</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#3a264b] text-sm">{bid.pro?.first_name || 'Pro'} {bid.pro?.last_name?.charAt(0)}.</p>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px] text-[#702ae1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-xs font-bold text-[#3a264b]">4.9</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-[#69537b] tracking-wider">Bid Placed</p>
                        <p className="text-xs font-medium text-[#3a264b]">
                          {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#69537b] italic text-center py-4 bg-white/50 rounded-xl border border-dashed border-[#bda3d1]/30">Be the first to bid on this project!</p>
                )}
              </div>
              {bids && bids.length > 3 && (
                <button className="w-full text-center text-[#702ae1] font-bold text-sm py-2 hover:underline">View all bids ({bids.length})</button>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
