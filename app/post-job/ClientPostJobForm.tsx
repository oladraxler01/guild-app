"use client";

import { useFormStatus } from "react-dom";
import { postOpenJobAction } from "./actions";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit"
      disabled={pending}
      className="w-full py-5 rounded-full bg-gradient-to-br from-[#702ae1] to-[#b28cff] text-white font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-auto hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Posting..." : "Post a Job"}
      {!pending && <span className="material-symbols-outlined">send</span>}
    </button>
  );
}

export function ClientPostJobForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await postOpenJobAction(formData);
    if (result && result.error) {
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 flex-grow flex flex-col">
      <div className="space-y-2 flex-grow flex flex-col">
        <label className="block text-sm font-semibold text-[#3a264b] ml-1">Describe what you need</label>
        <textarea 
          name="description"
          className="w-full h-full min-h-[200px] bg-white border-[#bda3d1]/30 border rounded-lg p-4 focus:ring-2 focus:ring-[#702ae1] focus:border-[#702ae1] outline-none transition-all placeholder:text-[#69537b]/50 resize-none" 
          placeholder="e.g. I need someone to help me fix a leaky faucet in my kitchen this weekend..." 
          aria-label="Job Description"
          required
        ></textarea>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </div>
      )}

      <div className="p-6 bg-[#faecff] rounded-lg flex items-start gap-4">
        <span className="material-symbols-outlined text-[#7742a6]">info</span>
        <p className="text-sm text-[#69537b] leading-relaxed">Pros in your area will see this request and message you directly. Keep it brief but clear!</p>
      </div>

      <SubmitButton />
    </form>
  );
}
