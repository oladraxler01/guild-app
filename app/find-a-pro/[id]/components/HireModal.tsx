"use client";

import { useState } from "react";
import { sendJobRequest } from "../actions";

interface HireModalProps {
  proId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function HireModal({ proId, isOpen, onClose }: HireModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await sendJobRequest(formData, proId);

    if (result?.error) {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    } else if (result?.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSubmitting(false);
        setSuccess(false);
      }, 2000);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 font-['Plus_Jakarta_Sans']">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors"
          disabled={isSubmitting}
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Send Request</h2>
        <p className="text-on-surface-variant text-sm mb-6">Detail your project so they can get back to you quickly.</p>

        {success ? (
          <div className="bg-[#E8F5E9] text-[#2E7D32] p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-5xl mb-4">check_circle</span>
            <p className="font-bold text-lg">Request Sent Successfully!</p>
            <p className="text-sm opacity-80 mt-1">The professional will be notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold text-center border border-red-100">
                {errorMsg}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-bold mb-1.5 text-on-surface">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g. Bathroom Sink Leak Repair"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-bold mb-1.5 text-on-surface">
                Proposed Budget ($)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                min="0"
                step="0.01"
                placeholder="e.g. 150"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold mb-1.5 text-on-surface">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe what exactly needs to be done..."
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:bg-primary-dim transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'wght' 300" }}>refresh</span>
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
