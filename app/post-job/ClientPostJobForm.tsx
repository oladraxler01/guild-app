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
      className="w-full py-5 rounded-full bg-gradient-to-br from-[#702ae1] to-[#b28cff] text-white font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Posting Project..." : "Post a Job"}
      {!pending && <span className="material-symbols-outlined">send</span>}
    </button>
  );
}

export function ClientPostJobForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      const result = await postOpenJobAction(formData);
      if (result && result.error) {
        setError(result.error);
        // Scroll to error
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e: any) {
      setError("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 flex-grow flex flex-col">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#3a264b] ml-1 uppercase tracking-tight text-[11px] opacity-70">Project Title</label>
          <input 
            name="title"
            type="text"
            className="w-full bg-white border-[#bda3d1]/30 border rounded-xl p-4 focus:ring-2 focus:ring-[#702ae1] focus:border-[#702ae1] outline-none transition-all placeholder:text-[#69537b]/40 font-semibold" 
            placeholder="e.g. UI/UX Design for Fintech App" 
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#3a264b] ml-1 uppercase tracking-tight text-[11px] opacity-70">Category</label>
            <select 
              name="category"
              className="w-full bg-white border-[#bda3d1]/30 border rounded-xl p-4 focus:ring-2 focus:ring-[#702ae1] focus:border-[#702ae1] outline-none transition-all font-medium text-[#3a264b]" 
              required
            >
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
              <option value="Writing">Writing</option>
              <option value="Consulting">Consulting</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#3a264b] ml-1 uppercase tracking-tight text-[11px] opacity-70">Location Type</label>
            <select 
              name="location_type"
              className="w-full bg-white border-[#bda3d1]/30 border rounded-xl p-4 focus:ring-2 focus:ring-[#702ae1] focus:border-[#702ae1] outline-none transition-all font-medium text-[#3a264b]" 
              required
            >
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#3a264b] ml-1 uppercase tracking-tight text-[11px] opacity-70">Budget ($)</label>
          <input 
            name="budget"
            type="number"
            className="w-full bg-white border-[#bda3d1]/30 border rounded-xl p-4 focus:ring-2 focus:ring-[#702ae1] focus:border-[#702ae1] outline-none transition-all placeholder:text-[#69537b]/40 font-bold" 
            placeholder="0.00" 
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#3a264b] ml-1 uppercase tracking-tight text-[11px] opacity-70">Timeline</label>
          <select 
            name="timeline"
            className="w-full bg-white border-[#bda3d1]/30 border rounded-xl p-4 focus:ring-2 focus:ring-[#702ae1] focus:border-[#702ae1] outline-none transition-all font-medium text-[#3a264b]" 
            required
          >
            <option value="Less than 1 week">Less than 1 week</option>
            <option value="1-2 weeks">1-2 weeks</option>
            <option value="2-4 weeks">2-4 weeks</option>
            <option value="More than a month">More than a month</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#3a264b] ml-1 uppercase tracking-tight text-[11px] opacity-70">Complexity</label>
          <select 
            name="complexity"
            className="w-full bg-white border-[#bda3d1]/30 border rounded-xl p-4 focus:ring-2 focus:ring-[#702ae1] focus:border-[#702ae1] outline-none transition-all font-medium text-[#3a264b]" 
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Description & Skills */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#3a264b] ml-1 uppercase tracking-tight text-[11px] opacity-70">Full Project Description</label>
          <textarea 
            name="description"
            rows={6}
            className="w-full bg-white border-[#bda3d1]/30 border rounded-xl p-4 focus:ring-2 focus:ring-[#702ae1] focus:border-[#702ae1] outline-none transition-all placeholder:text-[#69537b]/40 font-medium whitespace-pre-wrap" 
            placeholder="Describe the goals, responsibilities, and key deliverables..." 
            required
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#3a264b] ml-1 uppercase tracking-tight text-[11px] opacity-70">Skills Required (Comma separated)</label>
          <input 
            name="skills"
            type="text"
            className="w-full bg-white border-[#bda3d1]/30 border rounded-xl p-4 focus:ring-2 focus:ring-[#702ae1] focus:border-[#702ae1] outline-none transition-all placeholder:text-[#69537b]/40 font-medium" 
            placeholder="e.g. Figma, React, Copywriting, Marketing" 
          />
        </div>
      </div>

      <div className="p-6 bg-[#f5e2ff]/40 rounded-2xl flex items-start gap-4 border border-[#edd3ff]">
        <span className="material-symbols-outlined text-[#702ae1] opacity-70">info</span>
        <p className="text-sm text-[#69537b] leading-relaxed">Pros in our community will view this project and submit their bids directly. You can then review their profiles and choose the best fit.</p>
      </div>

      <SubmitButton />
    </form>
  );
}
