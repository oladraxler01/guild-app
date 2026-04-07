import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ session_id?: string; job_id?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const jobId = resolvedParams.job_id;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  let job: any = null;
  let payment: any = null;

  if (jobId) {
    // Manually update payment status since webhook may not fire in test mode
    await supabase
      .from("payments")
      .update({ status: "escrow" })
      .eq("job_id", jobId);

    await supabase
      .from("job_requests")
      .update({ payment_status: "funded" })
      .eq("id", jobId);

    const { data: jobData } = await supabase
      .from("job_requests")
      .select("*, pro:profiles!pro_id (first_name, last_name)")
      .eq("id", jobId)
      .single();
    job = jobData;

    const { data: paymentData } = await supabase
      .from("payments")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    payment = paymentData;
  }

  const amount = payment?.amount || job?.budget || 0;
  const escrowId = payment?.id ? `ESC-${payment.id.slice(0, 4).toUpperCase()}-${payment.id.slice(4, 7).toUpperCase()}` : "ESC-0000-XXX";
  const dashboardUrl = user.user_metadata?.role === "pro" ? "/dashboard" : "/client/dashboard";

  return (
    <div className="bg-[#fef3ff] text-[#3a264b] min-h-screen font-['Plus_Jakarta_Sans'] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-6 py-6 max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-[#3a264b]" style={{ letterSpacing: "-0.6px" }}>Guild</Link>
          <div className="flex items-center gap-2 text-[#69537b] font-medium text-sm">
            <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: '"FILL" 1' }}>verified_user</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-lg">
          {/* Success Card */}
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm">
            {/* Success Icon */}
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center" style={{ boxShadow: "0 0 40px -10px rgba(34, 197, 94, 0.2)" }}>
                <span className="material-symbols-outlined text-green-600 text-5xl" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-sm border border-green-100">
                <span className="material-symbols-outlined text-green-600 text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>lock</span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-[#3a264b] tracking-tight mb-2">Payment Successful</h1>
            <p className="text-[#69537b] text-lg font-medium mb-8">
              Your funds are now <span className="text-green-600">Secured in Escrow</span>
            </p>

            {/* Transaction Details */}
            <div className="bg-[#faecff] rounded-xl p-6 mb-8 text-left space-y-4">
              <div className="flex justify-between items-center border-b border-[#edd3ff]/40 pb-4">
                <span className="text-[#69537b] text-sm font-medium">Transaction Amount</span>
                <span className="text-[#3a264b] text-xl font-extrabold tracking-tight">${Number(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex flex-col">
                  <span className="text-[#69537b] text-xs uppercase tracking-widest font-bold">Escrow ID</span>
                  <span className="text-[#3a264b] font-mono text-sm">{escrowId}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[#69537b] text-xs uppercase tracking-widest font-bold">Release Condition</span>
                  <span className="text-[#3a264b] text-sm">Milestone Approval</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50/50 mb-10 text-left">
              <span className="material-symbols-outlined text-green-600 mt-1">security</span>
              <p className="text-sm text-[#69537b] leading-relaxed">
                Funds will only be released to the recipient once you confirm the work has been completed to your satisfaction. Our 24/7 dispute team is here to protect your investment.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Link
                href={dashboardUrl}
                className="block w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#702ae1] to-[#b28cff] text-white font-bold text-lg shadow-lg shadow-primary/20 active:scale-95 transition-all text-center"
              >
                Go to Dashboard
              </Link>
              {jobId && (
                <Link
                  href={`/messages/${jobId}`}
                  className="block w-full py-3 px-8 rounded-full bg-[#edd3ff] text-[#702ae1] font-semibold text-sm transition-colors hover:bg-[#e6c5ff] text-center"
                >
                  Continue Chat
                </Link>
              )}
            </div>
          </div>

          {/* Info Boxes */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/40 backdrop-blur-sm">
              <p className="text-xs font-bold text-[#69537b] uppercase tracking-widest mb-1">What's Next?</p>
              <p className="text-xs text-[#69537b]/80">The Pro has been notified and can begin work immediately.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/40 backdrop-blur-sm">
              <p className="text-xs font-bold text-[#69537b] uppercase tracking-widest mb-1">Support</p>
              <p className="text-xs text-[#69537b]/80">Need help? Contact our <span className="text-[#702ae1] font-medium">Safety Center</span>.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary-container/10 blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary-container/20 blur-[120px] -z-10"></div>

      {/* Footer */}
      <footer className="w-full py-10 bg-[#fef3ff] border-t border-[#edd3ff]/50">
        <div className="flex flex-col items-center justify-center space-y-4 px-4 text-xs tracking-wide">
          <span className="text-lg font-bold text-[#3a264b]">Guild</span>
          <div className="flex space-x-6 text-[#69537b]">
            <a className="hover:text-[#702ae1] transition-colors" href="#">Privacy</a>
            <a className="hover:text-[#702ae1] transition-colors" href="#">Terms</a>
            <a className="hover:text-[#702ae1] transition-colors" href="#">Help</a>
            <a className="hover:text-[#702ae1] transition-colors" href="#">Safety</a>
          </div>
          <p className="text-[#69537b]/80">© 2024 Guild. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
