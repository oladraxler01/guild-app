"use client";

import { useState } from "react";
import { parseJobAndMatch, createAiJobRequest } from "../client/actions/ai-match";
import Image from "next/image";
import Link from "next/link";

type Appraisal = {
  category: string;
  skills: string[];
  urgency: string;
  estimatedBudget: number;
};

type Pro = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  professional_title: string;
  is_premium: boolean;
  experience_years: number;
};

export function MagicJobForm() {
  const [step, setStep] = useState<"INPUT" | "LOADING" | "RESULTS" | "SUCCESS">("INPUT");
  const [description, setDescription] = useState("");
  const [appraisal, setAppraisal] = useState<Appraisal | null>(null);
  const [matchedPros, setMatchedPros] = useState<Pro[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleMagicMatch() {
    if (!description.trim()) return;
    
    setStep("LOADING");
    const result = await parseJobAndMatch(description);
    
    if (result.success) {
      setAppraisal(result.appraisal);
      setMatchedPros(result.matchedPros as Pro[]);
      setStep("RESULTS");
    } else {
      alert("AI was unable to parse this perfectly. Try adding more detail!");
      setStep("INPUT");
    }
  }

  async function handleFinalSubmit() {
    if (!appraisal || isSubmitting) return;

    setIsSubmitting(true);
    const result = await createAiJobRequest({
      description,
      appraisal,
      proIds: matchedPros.map((p: Pro) => p.id)
    });

    if (result.success) {
      setStep("SUCCESS");
    } else {
      alert(result.error || "Failed to send request.");
    }
    setIsSubmitting(false);
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      {step === "INPUT" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#3a264b] tracking-tight">
              Tell us your <span className="text-primary italic">vision.</span>
            </h2>
            <p className="text-[#69537b] text-lg max-w-lg mx-auto">
              Skip the forms. Just describe what you need in plain English, and our AI will build the project brief for you.
            </p>
          </div>

          <div className="relative group">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., I need a high-end UI/UX designer to redesign my fintech app's dashboard. It's quite urgent and I have a budget of around $2000..."
              className="w-full h-64 p-8 rounded-3xl bg-white border-2 border-[#edd3ff]/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-xl text-[#3a264b] placeholder:text-[#69537b]/40 shadow-sm"
            />
            <div className="absolute bottom-6 right-6">
              <button
                onClick={handleMagicMatch}
                className="bg-gradient-primary text-on-primary px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">auto_awesome</span>
                Generate Smart Match
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "LOADING" && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
            <div className="relative bg-white p-6 rounded-full shadow-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin-slow">auto_awesome</span>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-[#3a264b]">Guild AI is thinking...</h3>
            <p className="text-[#69537b]">Extracting metrics and scanning for top professionals.</p>
          </div>
        </div>
      )}

      {step === "RESULTS" && appraisal && (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h3 className="text-3xl font-extrabold text-[#3a264b] mb-2">Internal Project Appraisal</h3>
              <p className="text-[#69537b]">We&apos;ve analyzed your request. Here&apos;s our assessment:</p>
            </div>
            <button 
              onClick={() => setStep("INPUT")}
              className="text-primary font-bold hover:underline"
            >
              Start Over
            </button>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-[#69537b] tracking-wider">Category</span>
              <span className="text-lg font-bold text-[#3a264b]">{appraisal.category}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-[#69537b] tracking-wider">Urgency</span>
              <span className={`text-lg font-bold ${appraisal.urgency === 'High' ? 'text-red-500' : 'text-[#3a264b]'}`}>
                {appraisal.urgency}
              </span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-[#69537b] tracking-wider">Est. Budget</span>
              <span className="text-lg font-bold text-[#3a264b]">${appraisal.estimatedBudget}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-[#69537b] tracking-wider">Top Skill</span>
              <span className="text-lg font-bold text-[#3a264b]">{appraisal.skills[0]}</span>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-bold text-[#3a264b]">Top Professional Matches</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchedPros.length > 0 ? (
                matchedPros.map((pro: Pro) => (
                  <div key={pro.id} className={`relative p-6 rounded-3xl border-2 transition-all hover:translate-y-[-4px] ${pro.is_premium ? 'bg-primary/5 border-primary/30' : 'bg-white border-[#edd3ff]/30'}`}>
                    {pro.is_premium && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1 shadow-lg">
                        <span className="material-symbols-outlined text-[12px]">grade</span>
                        Empowered Match
                      </div>
                    )}
                    <div className="flex flex-col items-center text-center space-y-4 pt-2">
                       <div className="w-16 h-16 rounded-full bg-primary/10 overflow-hidden ring-4 ring-white shadow-sm">
                        {pro.avatar_url ? (
                          <Image src={pro.avatar_url} width={64} height={64} alt="Pro" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-4xl text-primary flex items-center justify-center h-full">person</span>
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-[#3a264b]">{pro.first_name} {pro.last_name.charAt(0)}.</p>
                        <p className="text-xs font-semibold text-[#69537b]">{pro.professional_title}</p>
                      </div>
                      <div className="flex items-center gap-1">
                         <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                         <span className="text-xs font-bold text-[#3a264b]">4.9 ({pro.experience_years}y exp)</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-12 text-center text-[#69537b] italic bg-white/50 rounded-3xl border border-dashed border-[#edd3ff]">
                  No exact matches found. Broaden your description to find more pros!
                </div>
              )}
            </div>
            
            <div className="pt-6 flex justify-center">
              <button 
                onClick={handleFinalSubmit}
                disabled={matchedPros.length === 0 || isSubmitting}
                className="bg-gradient-primary text-on-primary px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
              >
                {isSubmitting ? (
                   <span className="material-symbols-outlined animate-spin">sync</span>
                ) : (
                   <span className="material-symbols-outlined">send</span>
                )}
                {isSubmitting ? 'Sending...' : 'Send Request to these Pros'}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "SUCCESS" && (
        <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-in zoom-in-90 duration-500">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
           </div>
           <div className="text-center space-y-3">
              <h2 className="text-4xl font-extrabold text-[#3a264b]">Request Dispatched!</h2>
              <p className="text-[#69537b] text-lg">Your project brief has been sent to the matched professionals.</p>
           </div>
           <div className="flex gap-4">
              <Link href="/client/dashboard" className="px-8 py-4 bg-[#3a264b] text-white rounded-full font-bold">Go to Dashboard</Link>
              <button onClick={() => setStep("INPUT")} className="px-8 py-4 bg-[#f1daff] text-[#702ae1] rounded-full font-bold">Post Another</button>
           </div>
        </div>
      )}
    </div>
  );
}
