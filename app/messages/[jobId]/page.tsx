import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import RealtimeChatUI from "./components/RealtimeChatUI";
import AiNegotiationCoach from "./components/AiNegotiationCoach";
import { PayNowButton, MarkCompleteButton, ReleaseFundsButton, SetBudgetButton } from "@/components/PaymentButtons";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  const resolvedParams = await params;
  const jobId = resolvedParams.jobId;

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  // 1. Fetch Job Request
  const { data: rawJob, error: jobError } = await supabase
    .from("job_requests")
    .select("*")
    .eq("id", jobId)
    .single();

  if (jobError || !rawJob) {
    console.error("Job not found:", jobError);
    notFound();
  }

  // Fetch the Client profile separately since client_id references auth.users instead of profiles
  const { data: clientProfile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url")
    .eq("id", rawJob.client_id)
    .single();

  // Fetch the Pro profile separately for the same reason
  const { data: proProfile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url")
    .eq("id", rawJob.pro_id)
    .single();

  const job = {
    ...rawJob,
    client: clientProfile || null,
    pro: proProfile || null,
  };

  // Authorize User (Must be client or pro)
  if (user.id !== job.client_id && user.id !== job.pro_id) {
    redirect("/dashboard");
  }

  // 2. Fetch Messages
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });

  const isPro = user.id === job.pro_id;
  const isClient = user.id === job.client_id;
  const otherParty = isPro ? job.client : job.pro;
  const otherPartyFirstName = otherParty?.first_name || "Unknown";
  const paymentStatus = job.payment_status || "unpaid";

  return (
    <div className="bg-[#fef3ff] text-[#3a264b] antialiased min-h-screen font-['Plus_Jakarta_Sans']">
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-[#3a264b] tracking-tight" style={{ letterSpacing: "-0.6px" }}>
              Guild
            </Link>
            <div className="hidden md:flex items-center gap-6 font-medium text-sm text-[#69537b]">
              <Link href="/messages" className="text-[#702ae1] font-semibold border-b-2 border-[#702ae1] pb-1">Messages</Link>
              <Link href="/dashboard" className="hover:text-[#702ae1] transition-colors">Dashboard</Link>
              <Link href="/find-a-pro" className="hover:text-[#702ae1] transition-colors">Explore</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#edd3ff] overflow-hidden flex items-center justify-center font-bold">
              {user.user_metadata?.first_name?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-[72px] md:pt-24 pb-0 md:pb-12 px-0 md:px-6 max-w-7xl mx-auto h-[100dvh] md:h-[calc(100vh-2rem)] flex gap-6 overflow-hidden w-full">
        
        {/* Left Sidebar: Job Details + Payment */}
        <aside className="hidden lg:flex flex-col w-80 shrink-0 gap-6 h-full overflow-y-auto hide-scrollbar">
          <div className="bg-white p-6 rounded-lg space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full tracking-wide uppercase ${
                paymentStatus === "funded" || paymentStatus === "awaiting_release"
                  ? "bg-green-100 text-green-700"
                  : paymentStatus === "released"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-[#e6c5ff] text-[#612c90]"
              }`}>
                {paymentStatus === "funded" ? "💰 Funded"
                  : paymentStatus === "awaiting_release" ? "⏳ Awaiting Release"
                  : paymentStatus === "released" ? "✅ Completed"
                  : job.status}
              </span>
              {job.budget !== null && (
                <span className="text-[#702ae1] font-bold text-lg">${job.budget}</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#3a264b] leading-tight">{job.title}</h1>
              <p className="text-[#69537b] text-sm mt-1 italic">Interacting with {otherPartyFirstName}</p>
            </div>
            <div className="space-y-3 pt-4">
              <p className="text-sm text-[#69537b]">{job.description || "No description provided."}</p>
            </div>
          </div>

          {/* Payment Actions */}
          <div className="space-y-3">
            {isClient && paymentStatus === "unpaid" && job.budget && (
              <PayNowButton jobId={jobId} />
            )}
            {isClient && paymentStatus === "unpaid" && !job.budget && (
              <SetBudgetButton jobId={jobId} />
            )}
            {isPro && paymentStatus === "funded" && (
              <MarkCompleteButton jobId={jobId} />
            )}
            {isClient && paymentStatus === "awaiting_release" && (
              <ReleaseFundsButton jobId={jobId} />
            )}
          </div>
        </aside>

        {/* Main Chat Window */}
        <section className="flex-1 flex flex-col bg-white overflow-hidden border-[#bda3d1]/30 relative border-y-0 border-x-0 rounded-none md:rounded-lg md:border">
          
          <header className="px-6 py-4 flex items-center justify-between border-b border-[#bda3d1]/30">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#f5e2ff] overflow-hidden relative flex items-center justify-center font-bold text-xl">
                {otherParty?.avatar_url ? (
                  <img src={otherParty.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  otherPartyFirstName.charAt(0)
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h2 className="font-bold text-[#3a264b] leading-tight">{otherPartyFirstName} {otherParty?.last_name || ""}</h2>
                <p className="text-xs text-[#69537b] font-medium">Active now</p>
              </div>
            </div>
          </header>

          {/* Mobile Payment Actions Banner */}
          <div className="xl:hidden p-3 border-b border-[#bda3d1]/30 bg-[#fef3ff] shrink-0">
            {isClient && paymentStatus === "unpaid" && job.budget && (
              <PayNowButton jobId={jobId} />
            )}
            {isClient && paymentStatus === "unpaid" && !job.budget && (
              <SetBudgetButton jobId={jobId} />
            )}
            {isPro && paymentStatus === "funded" && (
              <MarkCompleteButton jobId={jobId} />
            )}
            {isClient && paymentStatus === "awaiting_release" && (
              <ReleaseFundsButton jobId={jobId} />
            )}
            {((!isClient && paymentStatus === "unpaid") || paymentStatus === "released") && (
              <div className="w-full flex items-center justify-center gap-2 p-3 bg-white text-[#69537b] rounded-lg text-sm font-bold border border-[#bda3d1]/30">
                <span className="material-symbols-outlined text-lg">
                  {paymentStatus === "released" ? "check_circle" : "info"}
                </span>
                {paymentStatus === "released" 
                  ? "Job Complete & Paid" 
                  : !job.budget 
                    ? "No Budget Set for this Job"
                    : "Waiting on Client to Fund"}
              </div>
            )}
          </div>

          {/* Mobile Quick Actions Bar */}
          <div className="flex xl:hidden gap-3 p-3 border-b border-[#bda3d1]/20 overflow-x-auto hide-scrollbar shrink-0 bg-[#faecff]/50">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#702ae1] rounded-full text-xs font-bold whitespace-nowrap shadow-sm border border-[#bda3d1]/20">
              <span className="material-symbols-outlined text-[16px]">videocam</span> Video Call
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#702ae1] rounded-full text-xs font-bold whitespace-nowrap shadow-sm border border-[#bda3d1]/20">
              <span className="material-symbols-outlined text-[16px]">attach_money</span> Send Tip
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#702ae1] rounded-full text-xs font-bold whitespace-nowrap shadow-sm border border-[#bda3d1]/20">
              <span className="material-symbols-outlined text-[16px]">schedule</span> Extend Time
            </button>
            <div className="flex items-center gap-1 ml-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              <span className="text-[10px] font-bold">ESCROW PROTECTED</span>
            </div>
          </div>

          {/* Mobile AI Coach Panel */}
          <div className="xl:hidden px-3 py-2 border-b border-[#bda3d1]/20 bg-white/60 shrink-0">
            <AiNegotiationCoach
              jobTitle={job.title}
              jobDescription={job.description || ""}
              budget={job.budget}
              urgency={job.urgency}
              category={job.category}
            />
          </div>

          <RealtimeChatUI 
            initialMessages={messages || []} 
            jobId={jobId} 
            currentUserId={user.id} 
            otherParty={otherParty} 
          />

        </section>

        {/* Right Sidebar Toolings */}
        <aside className="hidden xl:flex flex-col w-80 gap-6 shrink-0 h-full overflow-y-auto hide-scrollbar">
          <div className="bg-[#edd3ff]/40 p-5 rounded-lg border border-[#bda3d1]/20">
            <h3 className="text-xs font-bold text-[#3a264b] tracking-widest uppercase mb-4">Quick Tools</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-white rounded-lg text-sm font-semibold hover:text-[#702ae1] transition-all shadow-sm">
                <span className="material-symbols-outlined text-[#702ae1]">videocam</span> Video Call
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-white rounded-lg text-sm font-semibold hover:text-[#702ae1] transition-all shadow-sm">
                <span className="material-symbols-outlined text-[#702ae1]">attach_money</span> Send Tip
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-white rounded-lg text-sm font-semibold hover:text-[#702ae1] transition-all shadow-sm">
                <span className="material-symbols-outlined text-[#702ae1]">schedule</span> Extend Time
              </button>
            </div>
          </div>

          <div className="p-5 border border-[#bda3d1]/20 rounded-lg bg-[#faecff]/50">
            <h3 className="text-xs font-bold text-[#3a264b] tracking-widest uppercase mb-3">Service Protection</h3>
            <p className="text-xs text-[#69537b] leading-relaxed">
              Your payment is held in escrow and only released when you are satisfied with the work.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 text-sm">verified_user</span>
              <span className="text-[10px] font-bold text-green-700">ESCROW PROTECTED</span>
            </div>
          </div>

          {/* AI Negotiation Coach */}
          <AiNegotiationCoach
            jobTitle={job.title}
            jobDescription={job.description || ""}
            budget={job.budget}
            urgency={job.urgency}
            category={job.category}
          />
        </aside>

      </main>
    </div>
  );
}
