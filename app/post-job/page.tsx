import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ClientPostJobForm } from "./ClientPostJobForm";

export default function PostJobPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight mb-4">Let&apos;s get started.</h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-lg mx-auto">Choose how you want to use Connect today. Simple, fast, and friendly.</p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Pro Side */}
            <section className="bg-surface-container-low p-8 rounded-lg flex flex-col gap-8 h-full">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">work</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface">I&apos;m a Pro</h2>
              </div>
              <div className="space-y-6 flex-grow">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface ml-1">Full Name</label>
                  <input className="w-full bg-surface-container-lowest border-outline-variant/15 border rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/50" placeholder="e.g. Alex Rivera" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface ml-1">What service do you offer?</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-lowest border-outline-variant/15 border rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/50" placeholder="e.g. Gardening, Tutoring..." type="text" />
                    <span className="material-symbols-outlined absolute right-4 top-4 text-on-surface-variant/40">search</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface ml-1">Your Location</label>
                  <input className="w-full bg-surface-container-lowest border-outline-variant/15 border rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/50" placeholder="City or Zip Code" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface ml-1">Profile Photo</label>
                  <div className="border-2 border-dashed border-outline-variant/30 rounded-lg p-8 flex flex-col items-center justify-center bg-surface-container-lowest/50 hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors mb-2">add_a_photo</span>
                    <span className="text-sm font-medium text-on-surface-variant">Tap to upload your best smile</span>
                  </div>
                </div>
              </div>
              <Link href="/auth/sign-up?role=pro" className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Join Connect
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </section>

            {/* Client Side */}
            <section className="bg-surface-container-highest p-8 rounded-lg flex flex-col gap-8 h-full">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-container">person_search</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface">I&apos;m a Client</h2>
              </div>
              <ClientPostJobForm />
            </section>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-12 text-center opacity-80">
            <div className="space-y-3">
              <span className="material-symbols-outlined text-3xl text-primary">verified_user</span>
              <h3 className="font-bold text-on-surface">Verified Pros</h3>
              <p className="text-sm text-on-surface-variant">Every professional is manually vetted for quality and trust.</p>
            </div>
            <div className="space-y-3">
              <span className="material-symbols-outlined text-3xl text-primary">payments</span>
              <h3 className="font-bold text-on-surface">Secure Payments</h3>
              <p className="text-sm text-on-surface-variant">Pay through the app only when the work is done.</p>
            </div>
            <div className="space-y-3">
              <span className="material-symbols-outlined text-3xl text-primary">chat</span>
              <h3 className="font-bold text-on-surface">Direct Chat</h3>
              <p className="text-sm text-on-surface-variant">Message and coordinate directly within the platform.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
