"use client";

import { useState } from "react";
import { getAiCoachTip } from "@/app/client/actions/ai-match";

interface Props {
  jobTitle: string;
  jobDescription: string;
  budget: number | null;
  urgency?: string | null;
  category?: string | null;
}

const QUICK_PROMPTS = [
  { label: "Why this price?", icon: "help_outline", question: "Why might the pro be charging this amount for this type of work? Help me understand the pricing." },
  { label: "Suggest a reply", icon: "chat_bubble_outline", question: "Suggest a professional and friendly opening message I can send to this pro to start the conversation." },
  { label: "Balance my budget", icon: "balance", question: "My budget might be limited. How can I negotiate respectfully and find a middle ground with the pro?" },
];

export default function AiNegotiationCoach({ jobTitle, jobDescription, budget, urgency, category }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function askCoach(question: string) {
    if (!question.trim() || loading) return;
    setLoading(true);
    setTip(null);
    setError(null);
    const result = await getAiCoachTip({ jobTitle, jobDescription, budget, urgency, category, question });
    if (result.success && result.tip) {
      setTip(result.tip);
    } else {
      setError(result.error || "Could not get a response. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-[#702ae1]/20 bg-gradient-to-b from-[#faecff] to-white overflow-hidden shadow-sm flex flex-col">
      {/* Header toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#702ae1]/5 transition-colors shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#702ae1] to-[#b28cff] flex items-center justify-center shadow-sm shrink-0">
            <span className="material-symbols-outlined text-white text-[18px]">auto_awesome</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-extrabold text-[#3a264b] tracking-wide uppercase leading-none">Guild AI Coach</p>
            <p className="text-xs text-[#69537b] mt-0.5">Negotiation &amp; Pricing Help</p>
          </div>
        </div>
        <span className={`material-symbols-outlined text-[#702ae1] text-[20px] transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {/* Expanded content — scrolls internally so it never clips */}
      {isOpen && (
        <div className="border-t border-[#702ae1]/10 overflow-y-auto max-h-[60vh] flex flex-col">
          <div className="px-4 py-4 space-y-4">
            {/* Quick prompt buttons */}
            <div>
              <p className="text-xs font-bold text-[#69537b] uppercase tracking-widest mb-2">Quick Questions</p>
              <div className="space-y-2">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => askCoach(p.question)}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-[#bda3d1]/30 text-left hover:border-[#702ae1] hover:bg-[#702ae1]/5 transition-all text-sm font-semibold text-[#3a264b] disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[#702ae1] text-[18px] shrink-0">{p.icon}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom question input */}
            <div>
              <p className="text-xs font-bold text-[#69537b] uppercase tracking-widest mb-2">Ask Anything</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { askCoach(customQuestion); setCustomQuestion(""); } }}
                  placeholder="e.g. Is this price fair?"
                  className="flex-1 text-sm px-4 py-3 rounded-lg border border-[#bda3d1]/30 focus:border-[#702ae1] focus:ring-2 focus:ring-[#702ae1]/10 outline-none transition-all bg-white text-[#3a264b] placeholder:text-[#69537b]/50"
                />
                <button
                  onClick={() => { askCoach(customQuestion); setCustomQuestion(""); }}
                  disabled={loading || !customQuestion.trim()}
                  className="p-3 bg-[#702ae1] text-white rounded-lg hover:bg-[#5a1fc4] transition-colors disabled:opacity-40 shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>

            {/* AI Response */}
            {loading && (
              <div className="flex items-center gap-2 py-3 px-4 bg-[#702ae1]/5 rounded-xl">
                <div className="w-4 h-4 border-2 border-[#702ae1]/30 border-t-[#702ae1] rounded-full animate-spin shrink-0" />
                <p className="text-sm text-[#69537b] italic">Guild AI is thinking...</p>
              </div>
            )}

            {error && (
              <div className="py-3 px-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {tip && !loading && (
              <div className="py-4 px-4 bg-white border border-[#702ae1]/15 rounded-xl shadow-sm">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="material-symbols-outlined text-[#702ae1] text-[16px]">auto_awesome</span>
                  <span className="text-xs font-bold text-[#702ae1] uppercase tracking-wider">Guild AI Response</span>
                </div>
                {/* The response itself scrolls if very long */}
                <div className="overflow-y-auto max-h-64 pr-1">
                  <p className="text-sm text-[#3a264b] leading-relaxed whitespace-pre-wrap">{tip}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
