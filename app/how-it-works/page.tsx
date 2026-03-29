"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function HowItWorksPage() {
  return (
    <div className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <Navbar />
      
      <main className="pt-32 pb-20 flex-1">
        <style dangerouslySetInnerHTML={{ __html: `
          .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}} />

        {/* Hero Header */}
        <header className="max-w-7xl mx-auto px-6 text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight mb-6">
            Simple. Transparent. <span className="text-primary italic">Human.</span>
          </h1>
          <p className="text-on-surface-variant text-xl max-w-2xl mx-auto leading-relaxed">
            Connect with skilled professionals or grow your business with a marketplace built on trust and effortless collaboration.
          </p>
        </header>

        {/* Dynamic Content Section */}
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          
          {/* Clients Section */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div className="space-y-2">
                <span className="text-primary font-bold tracking-widest uppercase text-xs">For Clients</span>
                <h2 className="text-4xl font-bold text-on-surface">Hire with confidence</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Step 1 */}
              <div className="md:col-span-7 bg-surface-container-low p-10 rounded-lg flex flex-col justify-between group hover:bg-surface-container transition-colors duration-500">
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-white flex items-center justify-center rounded-2xl shadow-sm">
                    <span className="material-symbols-outlined text-primary text-3xl">edit_note</span>
                  </div>
                  <h3 className="text-2xl font-bold text-on-surface">1. Post a Requirement</h3>
                  <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                    Briefly describe what you need. From plumbing to web design, our intelligent matching system finds the right pros for your specific task.
                  </p>
                </div>
                <div className="mt-12 overflow-hidden rounded-xl h-64 bg-slate-200">
                  <img 
                    alt="Post requirements" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9uf6bo02qN1KJtepVnzDyoNa3qZUlTvJZTGLl5SY5JFPyuTOReRVJkKaUshmrUEY0GnxOfZwtAezigG4K3Sm71Ep2Yl1KkZiyLaBC_kbTNC7KCuvjFpGL-j9WnkQDsyi1TwCSJqINXen6M7ilX_oS6_LbQn3HP_x11a66jyamMYFQh9ILU55ZJ88hzT9a6wNXJegumVeKhzEKt1IxfItw76vyzprBM8d1VeKNKBrxzX0ues7F30O2LiLtsHXSYADC7NftEScXvc8" 
                  />
                </div>
              </div>
              {/* Step 2 & 3 */}
              <div className="md:col-span-5 flex flex-col gap-8">
                <div className="bg-surface-container-highest p-8 rounded-lg flex-1 group hover:bg-white transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl mb-6">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-3">2. Compare Bids</h3>
                  <p className="text-on-surface-variant">
                    Pros will bid on your job. Check their detailed profiles, diverse portfolios, and verified community reviews to make the right choice.
                  </p>
                </div>
                <div className="bg-secondary-container p-8 rounded-lg flex-1 group hover:brightness-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl mb-6 shadow-sm">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>verified_user</span>
                  </div>
                  <h3 className="text-xl font-bold text-on-secondary-container mb-3 text-secondary-dim">3. Pay Securely</h3>
                  <p className="text-on-secondary-container/80">
                    Use our integrated escrow system. Funds are securely held and only released when you&apos;re 100% satisfied with the completed work.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pros Section */}
          <section>
            <div className="flex flex-col md:flex-row-reverse justify-between items-end mb-12 gap-4">
              <div className="space-y-2 text-right">
                <span className="text-secondary font-bold tracking-widest uppercase text-xs">For Professionals</span>
                <h2 className="text-4xl font-bold text-on-surface">Scale your business</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Step 1 & 2 */}
              <div className="md:col-span-5 flex flex-col gap-8 order-2 md:order-1">
                <div className="bg-surface-container-low p-8 rounded-lg flex-1 border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all">
                  <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl mb-6">
                    <span className="material-symbols-outlined text-primary">badge</span>
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-3">1. Create a Profile</h3>
                  <p className="text-on-surface-variant">
                    Showcase your best work, highlight your skills, and undergo our verification process to earn the &quot;Trust Badge&quot; and attract premium clients.
                  </p>
                </div>
                <div className="bg-surface-container-low p-8 rounded-lg flex-1 border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all">
                  <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl mb-6">
                    <span className="material-symbols-outlined text-primary">request_quote</span>
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-3">2. Bid on Jobs</h3>
                  <p className="text-on-surface-variant">
                    Browse high-quality leads in your specific area or niche. Send professional, tailored quotes that highlight your unique value proposition.
                  </p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="md:col-span-7 bg-primary-container p-10 rounded-lg flex flex-col justify-between order-1 md:order-2 text-on-primary-container relative overflow-hidden">
                <div className="z-10">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md flex items-center justify-center rounded-2xl mb-8">
                    <span className="material-symbols-outlined text-white text-3xl">payments</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">3. Get Paid</h3>
                  <p className="text-on-primary-container/90 text-lg leading-relaxed max-w-md mb-8">
                    Never worry about collections again. Our escrow system ensures your payment is secured before you even start working. Work with peace of mind.
                  </p>
                </div>
                <div className="z-10 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">check_circle</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-70">Payment Status</div>
                      <div className="text-xl font-bold">Secured in Escrow</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </section>

          {/* Trust & Safety Section */}
          <section className="bg-surface-container-low rounded-lg p-12 md:p-20 relative overflow-hidden text-center">
            <div className="relative z-10 mb-16">
              <h2 className="text-3xl font-bold text-on-surface mb-4">Your safety is our priority</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto">We&apos;ve built several layers of protection to ensure every interaction on Guild is secure and professional.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              <div className="flex flex-col items-center space-y-4 group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">fingerprint</span>
                </div>
                <h4 className="font-bold text-on-surface">NIN Verification</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Identity checks for all users to maintain a community of real people.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">shield_with_heart</span>
                </div>
                <h4 className="font-bold text-on-surface">Secure Escrow</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Financial protection for both parties on every single transaction.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
                </div>
                <h4 className="font-bold text-on-surface">24/7 Support</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Our dedicated humanist support team is here whenever you need help.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">star</span>
                </div>
                <h4 className="font-bold text-on-surface">Verified Ratings</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Real feedback from real clients. No fake reviews, ever.</p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center py-20 bg-primary rounded-lg text-on-primary shadow-2xl shadow-primary/20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Ready to get started?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6 px-6">
              <Link href="/find-a-pro" className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-surface-bright transition-colors shadow-lg shadow-black/10">
                Find a Pro
              </Link>
              <Link href="/auth/sign-up" className="bg-primary-container/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                Join as a Pro
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
