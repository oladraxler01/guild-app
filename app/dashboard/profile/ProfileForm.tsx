"use client";

import { useState } from "react";
import { updateProfileAction } from "../actions";
import Link from "next/link";

interface ProfileFormProps {
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    bio: string | null;
    services: string[] | null;
    hourly_rate: number | null;
    avatar_url: string | null;
    portfolio_urls: string[] | null;
    nin: string | null;
    location: string | null;
  };
  email: string;
}

export default function ProfileForm({ profile, email }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const servicesString = Array.isArray(profile.services) ? profile.services.join(", ") : "";
  const portfolioArray = Array.isArray(profile.portfolio_urls) ? profile.portfolio_urls : [];

  // Profile strength calculation
  let profileStrength = 20; // base for having an account
  if (profile.bio) profileStrength += 20;
  if (profile.services && profile.services.length > 0) profileStrength += 20;
  if (profile.hourly_rate) profileStrength += 20;
  if (portfolioArray.length > 0) profileStrength += 20;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      await updateProfileAction(formData);
      setMessage({ text: "Profile updated successfully! Changes are now live.", type: "success" });
    } catch (err) {
      const error = err as Error;
      setMessage({ text: error.message || "Failed to update profile.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">Edit Profile</h1>
          <p className="text-on-surface-variant">Manage your professional identity and showcase your best work.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/find-a-pro/${profile.id}`}
            className="px-6 py-3 rounded-full text-primary font-bold hover:bg-surface-container-highest transition-colors"
          >
            View Public Profile
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
          message.type === "success"
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-red-100 text-red-700 border border-red-200"
        }`}>
          <span className="material-symbols-outlined text-sm">
            {message.type === "success" ? "check_circle" : "error"}
          </span>
          {message.text}
        </div>
      )}

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Column (2/3) */}
        <div className="md:col-span-2 space-y-6">
          {/* Cover & Avatar Section */}
          <section className="bg-surface-container-lowest rounded-lg p-1 overflow-hidden">
            <div className="relative h-48 w-full rounded-t-lg bg-surface-container-high overflow-hidden group">
              <div className="w-full h-full bg-gradient-to-br from-[#702ae1]/20 to-[#b28cff]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary/30">landscape</span>
              </div>
            </div>
            <div className="px-6 pb-6 -mt-12 flex flex-col md:flex-row items-end gap-6">
              <div className="relative w-32 h-32 rounded-2xl border-4 border-surface-container-lowest overflow-hidden shadow-xl bg-surface-container-high flex items-center justify-center">
                {profile.avatar_url ? (
                  <img alt="Avatar" className="w-full h-full object-cover" src={profile.avatar_url} />
                ) : (
                  <span className="text-5xl font-extrabold text-primary">
                    {(profile.first_name || "P").charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  {profile.nin && (
                    <>
                      <span className="bg-secondary-container text-on-secondary-container text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded">NIN-Verified</span>
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-on-surface">
                  {[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Your Name"}
                </h2>
                <p className="text-on-surface-variant text-sm">Guild Professional Provider</p>
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <section className="bg-surface-container-low rounded-lg p-8 space-y-6">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person_edit</span> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Full Name</label>
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary text-on-surface placeholder:text-outline-variant transition-all"
                  type="text"
                  defaultValue={[profile.first_name, profile.last_name].filter(Boolean).join(" ")}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Email Address</label>
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary text-on-surface"
                  type="email"
                  defaultValue={email}
                  disabled
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Professional Bio</label>
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
                  <textarea
                    name="bio"
                    className="w-full bg-transparent border-none focus:ring-0 p-4 text-on-surface resize-none placeholder:text-outline-variant"
                    rows={5}
                    placeholder="Tell clients about your experience, philosophy, and expertise..."
                    defaultValue={profile.bio || ""}
                  ></textarea>
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio Management */}
          <section className="bg-surface-container-low rounded-lg p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">collections</span> Portfolio Projects
              </h3>
            </div>

            {/* Existing Portfolio */}
            {portfolioArray.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioArray.map((imgUrl, idx) => (
                  <div key={idx} className="aspect-square rounded-xl bg-surface-container-lowest overflow-hidden shadow-sm">
                    <img src={imgUrl} alt={`Project ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Upload New */}
            <div className="w-full bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl p-6 text-center">
              <span className="material-symbols-outlined text-3xl text-outline mb-2">add_photo_alternate</span>
              <input
                type="file"
                name="portfolio_images"
                accept="image/*"
                multiple
                className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-primary-dim transition-all mt-2"
              />
              <p className="text-xs text-on-surface-variant mt-2">Upload images directly to showcase your work.</p>
            </div>
          </section>
        </div>

        {/* Sidebar Column (1/3) */}
        <div className="space-y-6">
          {/* Service Details */}
          <section className="bg-surface-container-low rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">engineering</span> Service Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Services (comma-separated)</label>
                <input
                  name="services"
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary text-on-surface placeholder:text-outline-variant"
                  type="text"
                  placeholder="e.g. Plumbing, Electrical, Design"
                  defaultValue={servicesString}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Base Rate (Per Hour)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-bold text-primary">$</span>
                  <input
                    name="rate"
                    className="w-full bg-surface-container-lowest border-none rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary text-on-surface font-bold"
                    type="number"
                    min="1"
                    placeholder="50"
                    defaultValue={profile.hourly_rate || ""}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Trust & Activity */}
          <section className="bg-surface-container-low rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified_user</span> Trust & Activity
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl shadow-sm space-y-2 border border-primary/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-on-surface">Identity Check</span>
                  {profile.nin ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Verified</span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full uppercase">Pending</span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant">
                  {profile.nin
                    ? "Your NIN has been successfully linked and verified."
                    : "Complete your NIN to unlock top-tier badges."}
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-on-surface">Real-time Availability</span>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative flex items-center px-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-6 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Profile Strength */}
          <section className="bg-gradient-to-br from-[#702ae1] to-[#b28cff] rounded-lg p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">Profile Strength</p>
              <p className="text-sm font-bold">{profileStrength}%</p>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${profileStrength}%` }}></div>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              {profileStrength === 100
                ? "Your profile is fully complete! You're ranking at the top."
                : "Complete all sections to hit 100% and rank higher in search."}
            </p>
          </section>
        </div>
      </div>
    </form>
  );
}
