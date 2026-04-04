"use client";

import { useState } from "react";
import { updateProfileAction } from "./actions";

interface EditProfileFormProps {
  initialData: {
    bio: string | null;
    services: string | null;
    hourly_rate: number | null;
  };
}

export default function EditProfileForm({ initialData }: EditProfileFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      await updateProfileAction(formData);
      setMessage({ text: "Profile updated successfully!", type: "success" });
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 2000);
    } catch (err) {
      const error = err as Error;
      setMessage({ text: error.message || "Failed to update profile", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 text-sm font-bold text-primary-fixed hover:text-white transition-colors"
      >
        Complete Profile &rarr;
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest text-on-surface w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-2"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined shrink-0" style={{ fontSize: "24px" }}>
                close
              </span>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight mb-2 text-on-surface">
                Complete Your Profile
              </h2>
              <p className="text-sm text-on-surface-variant">
                Provide details about your services to attract more clients.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="services"
                  className="block text-sm font-semibold mb-1.5 text-on-surface"
                >
                  Specialty / Services
                </label>
                <input
                  type="text"
                  id="services"
                  name="services"
                  placeholder="e.g. Plumbing, Carpentry, Electrical"
                  defaultValue={initialData.services || ""}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-on-surface placeholder:text-on-surface-variant/50"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="rate"
                  className="block text-sm font-semibold mb-1.5 text-on-surface"
                >
                  Hourly Rate ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    id="rate"
                    name="rate"
                    min="1"
                    placeholder="50"
                    defaultValue={initialData.hourly_rate || ""}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-on-surface placeholder:text-on-surface-variant/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-semibold mb-1.5 text-on-surface"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  placeholder="Tell clients about your experience and expertise..."
                  defaultValue={initialData.bio || ""}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y text-on-surface placeholder:text-on-surface-variant/50"
                  required
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="portfolio_images"
                  className="block text-sm font-semibold mb-1.5 text-on-surface"
                >
                  Upload Portfolio Images
                </label>
                <div className="w-full bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-4 text-center">
                  <input
                    type="file"
                    id="portfolio_images"
                    name="portfolio_images"
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-primary-dim transition-all"
                  />
                  <p className="text-xs text-on-surface-variant mt-2">
                    Select multiple files from your device.
                  </p>
                </div>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg text-sm font-semibold flex items-center justify-center ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-error-container text-on-error-container border border-error/20"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-bold hover:bg-primary-dim transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
