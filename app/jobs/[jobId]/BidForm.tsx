"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { postBidAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit"
      disabled={pending}
      className="w-full py-4 bg-gradient-to-br from-[#702ae1] to-[#b28cff] text-white font-bold rounded-full hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? "Submitting..." : "Submit Bid"}
      {!pending && <span className="material-symbols-outlined">send</span>}
    </button>
  );
}

export function BidForm({ jobId }: { jobId: string }) {
  const [state, setState] = useState<{ error?: string; success?: boolean }>({});

  async function handleSubmit(formData: FormData) {
    setState({});
    const res = await postBidAction(formData);
    if (res && res.error) {
      setState({ error: res.error });
    } else if (res && res.success) {
      setState({ success: true });
    }
  }

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-100 p-8 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
          <span className="material-symbols-outlined text-3xl">check_circle</span>
        </div>
        <h3 className="text-xl font-bold text-green-900">Bid Submitted!</h3>
        <p className="text-green-700 text-sm">Your proposal has been sent to the client. They will contact you if they're interested.</p>
        <button 
          onClick={() => setState({})}
          className="text-[#702ae1] font-bold text-sm hover:underline"
        >
          Submit another bid?
        </button>
      </div>
    );
  }

  return (
    <section className="bg-[#faecff] p-8 rounded-2xl shadow-sm border border-[#edd3ff]">
      <h3 className="text-2xl font-bold text-[#3a264b] mb-6">Your Bid</h3>
      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="job_id" value={jobId} />
        
        <div>
          <label className="block text-sm font-semibold text-[#69537b] mb-2">Price Bid ($)</label>
          <input 
            name="amount"
            className="w-full p-4 rounded-xl bg-white border-none ring-1 ring-[#bda3d1]/20 focus:ring-2 focus:ring-[#702ae1] outline-none transition-all placeholder:text-[#69537b]/30 font-bold" 
            placeholder="0.00" 
            type="number"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-[#69537b] mb-2">Estimated Timeline</label>
          <select 
            name="timeline"
            className="w-full p-4 rounded-xl bg-white border-none ring-1 ring-[#bda3d1]/20 focus:ring-2 focus:ring-[#702ae1] outline-none transition-all text-[#3a264b] font-medium"
            required
          >
            <option value="Less than 1 week">Less than 1 week</option>
            <option value="1-2 weeks">1-2 weeks</option>
            <option value="2-4 weeks">2-4 weeks</option>
            <option value="More than a month">More than a month</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-[#69537b] mb-2">Proposal Text</label>
          <textarea 
            name="proposal"
            className="w-full p-4 rounded-xl bg-white border-none ring-1 ring-[#bda3d1]/20 focus:ring-2 focus:ring-[#702ae1] outline-none transition-all placeholder:text-[#69537b]/30 font-medium" 
            placeholder="Explain why you're the best fit for this role..." 
            rows={5}
            required
          ></textarea>
        </div>

        {state.error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {state.error}
          </div>
        )}

        <SubmitButton />
      </form>
    </section>
  );
}
