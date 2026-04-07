"use client";

import { useState } from "react";
import { createCheckoutSession, markJobComplete, releasePayment } from "@/app/payments/actions";

export function PayNowButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      await createCheckoutSession(jobId);
    } catch (err) {
      const error = err as Error;
      // Redirect errors from server actions are caught here but the redirect still works
      if (!error.message?.includes("NEXT_REDIRECT")) {
        alert(error.message || "Payment failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-[#702ae1] to-[#b28cff] text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-70"
    >
      <span className="material-symbols-outlined text-lg">lock</span>
      {loading ? "Processing..." : "Secure Payment"}
    </button>
  );
}

export function MarkCompleteButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
      await markJobComplete(jobId);
      setDone(true);
    } catch (err) {
      const error = err as Error;
      alert(error.message || "Failed to mark complete");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="w-full flex items-center justify-center gap-2 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
        <span className="material-symbols-outlined text-lg">check_circle</span>
        Marked as Complete
      </div>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-lg text-sm font-bold active:scale-95 transition-all disabled:opacity-70"
    >
      <span className="material-symbols-outlined text-lg">task_alt</span>
      {loading ? "Updating..." : "Mark Job as Complete"}
    </button>
  );
}

export function ReleaseFundsButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleRelease() {
    if (!confirm("Are you sure? Funds will be released to the Pro.")) return;
    setLoading(true);
    try {
      await releasePayment(jobId);
      setDone(true);
    } catch (err) {
      const error = err as Error;
      alert(error.message || "Failed to release funds");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="w-full flex items-center justify-center gap-2 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
        <span className="material-symbols-outlined text-lg">paid</span>
        Funds Released!
      </div>
    );
  }

  return (
    <button
      onClick={handleRelease}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-bold shadow-lg active:scale-95 transition-all disabled:opacity-70"
    >
      <span className="material-symbols-outlined text-lg">paid</span>
      {loading ? "Releasing..." : "Release Funds"}
    </button>
  );
}
