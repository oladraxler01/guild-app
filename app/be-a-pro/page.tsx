"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";


export default function BeAProPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #fef3ff; color: #3a264b; }
        .glass-effect { backdrop-filter: blur(20px); background: rgba(255, 255, 255, 0.7); }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}} />

      <div className="selection:bg-primary-container selection:text-on-primary-container min-h-screen bg-background">
      <div className="selection:bg-primary-container selection:text-on-primary-container min-h-screen bg-background">
        <Navbar />

        <main className="pt-24">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-sm font-semibold tracking-wide">
                <span className="material-symbols-outlined text-sm mr-2" style={{ fontVariationSettings: '"FILL" 1' }}>stars</span>
                JOIN THE TOP 1% OF PROS
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight">
                Turn your talent into <span className="text-primary">equity.</span>
              </h1>
              <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed">
                Guild is the premium marketplace for independent artisans and digital specialists to scale their business with verified leads and automated security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/auth/sign-up?role=pro" className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-95 transition-all text-center">
                  Get Started
                </Link>
                <button className="bg-surface-container-highest text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-surface-container-high transition-all">
                  View Pricing
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
                <img className="w-full h-full object-cover" alt="Close-up of a professional digital artisan working on a high-end keyboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuzUt8OFrLtDdWuCMn1Sp4DsifAxr4DRYjdrrGLaMPCrIYliR8WaNmF_AlmyWs3ZU4YeeL8XbRfm0qv6osbNwo7hKyMrzV43G49YyQ2lxHMrR64IPUpw45OkL5oEf_08Rkn3-dHkopAf714HlviKY4jEsofC4p_VFdrANSFtnQykQ_HmT6jkxyqPScZo68GHNQt5yLkuy5P0iGwo8kQ7WsXKV_WbIz-yO3nEKa8cTJLCTfpy6zlr3fVH_jN79Jar9csZwHMUNHBr8" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-6 rounded-lg shadow-xl max-w-[200px]">
                <div className="flex -space-x-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary-container border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-secondary-container border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-surface-dim border-2 border-white"></div>
                </div>
                <p className="text-xs font-bold text-on-surface">Join 50k+ professionals earning weekly</p>
              </div>
            </div>
          </section>

          {/* Why Join Bento Grid */}
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Join Guild</h2>
              <p className="text-on-surface-variant">We built the infrastructure so you can focus on the craft.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Large Card */}
              <div className="md:col-span-2 bg-surface-container-low rounded-lg p-10 flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white mb-8">
                    <span className="material-symbols-outlined text-3xl">payments</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Secure Payments</h3>
                  <p className="text-on-surface-variant text-lg max-w-md">Never chase an invoice again. Our automated escrow system ensures you get paid the moment the milestone is met.</p>
                </div>
                <div className="mt-12 flex items-center text-primary font-bold group-hover:gap-2 transition-all cursor-pointer">
                  Learn about Guild Pay <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
              {/* Small Card 1 */}
              <div className="bg-surface-container-highest rounded-lg p-10">
                <div className="w-14 h-14 bg-secondary-dim rounded-full flex items-center justify-center text-white mb-8">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Verified Leads</h3>
                <p className="text-on-surface-variant">Access a curated stream of high-intent clients who are ready to start projects immediately.</p>
              </div>
              {/* Small Card 2 */}
              <div className="bg-surface-container rounded-lg p-10">
                <div className="w-14 h-14 bg-tertiary-dim rounded-full flex items-center justify-center text-white mb-8">
                  <span className="material-symbols-outlined text-3xl">trending_up</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Reputation Building</h3>
                <p className="text-on-surface-variant">Build a portable professional profile with verified reviews that stay with you forever.</p>
              </div>
              {/* Medium Card with Image */}
              <div className="md:col-span-2 relative h-[300px] rounded-lg overflow-hidden group">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Professional office space" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwFe8jfgVg9fvpK-swDffzbRzePFfABRDVVY00voXhQP1ht_1RVogkMXWrqTYJ6EgFt0bYTASIs3IjT5ykUGEVBlYcxmXWg_5lx8og5cIISHKse_WFkrzscio0gZBjBUOgcw7KGRi4rJN2eWef9oTHSljfRqB6f33cTW9739wmm8ludiU3QzsGAJgkOqa33u7BSB16VqpgsCk6DSzQGHikTsA98SLQGteJzqG577eqHjSvUNeEJ-JUL4l2TIZRDIPe91Qz7Qhpfs8" />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent p-10 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">Network with the Best</h3>
                  <p className="text-white/80 max-w-sm">Partner with a global community of elite service providers and collaborate on major enterprise contracts.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3-Step Process */}
          <section className="bg-surface-container-low py-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-4xl font-bold mb-4">Three steps to success</h2>
                <p className="text-on-surface-variant">Simple, fast, and transparent onboarding.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Step 1 */}
                <div className="relative z-10 space-y-6 text-center md:text-left">
                  <div className="inline-block px-4 py-1 bg-primary text-on-primary rounded-full text-sm font-bold">STEP 1</div>
                  <h4 className="text-2xl font-bold">Create Profile</h4>
                  <p className="text-on-surface-variant">Set up your professional identity. Highlight your skills, portfolio, and set your own rates.</p>
                  <div className="aspect-square bg-white rounded-lg p-8 shadow-sm">
                    <img className="w-full h-full object-cover rounded-md" alt="Portrait of a professional" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLqE4Rdw4JeNhCWVo_uRelFQs5TN--XV14A4cpDZPS8zajjrZA9gk-Ca2s1dMP0LhCUN9mE-ibPh4IHnRlX_gRaUx71Gq_URih8IafUtXisPQtqVGepjEn4pRFxiS1_IHeSzDYUfpJ2GJgP35UqZtf91ELveX_XBRX_4PW0KGI_9jMDNSTsw0lD1vA_qkAqmuaE-b5TCNBJOUaUAcNUXmyisEruXscP5RyRljzEZQpF6vkmi6xcr_dDtjpHkCe7-qROgNMjr5r_v4" />
                  </div>
                </div>
                {/* Step 2 */}
                <div className="relative z-10 space-y-6 text-center md:text-left">
                  <div className="inline-block px-4 py-1 bg-primary text-on-primary rounded-full text-sm font-bold">STEP 2</div>
                  <h4 className="text-2xl font-bold">Get Verified</h4>
                  <p className="text-on-surface-variant">Our team reviews your credentials to ensure the quality of the marketplace remains world-class.</p>
                  <div className="aspect-square bg-white rounded-lg p-8 shadow-sm">
                    <div className="w-full h-full bg-surface-container-high rounded-md flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                    </div>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="relative z-10 space-y-6 text-center md:text-left">
                  <div className="inline-block px-4 py-1 bg-primary text-on-primary rounded-full text-sm font-bold">STEP 3</div>
                  <h4 className="text-2xl font-bold">Start Earning</h4>
                  <p className="text-on-surface-variant">Go live and start receiving high-quality leads. Withdraw your earnings daily if you wish.</p>
                  <div className="aspect-square bg-white rounded-lg p-8 shadow-sm">
                    <img className="w-full h-full object-cover rounded-md" alt="Digital professional working" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHKgYpZL66rvq-hnyIOakzPGAHdKFniJUHY5oHtKol2t6Co089i-OmZUc-qx7gzSulT5wjhUwFv9m23h0Tb1wTYPfQQqitqB5tKhnGSfvMSm0kidXq38jJFLhOuC0j8pwvo_Ohh51akzU-EkAYv4RWmXEhm7vbgggZWS-QNZvME-9GbX-0mlI1O9a3YfRjaiPbqDyyu2cTi0hslUv--ys7Ch_ZIQJKWW6dCNA4DfxY7iZ7A1RnRzD165GvBpFv0Mo_w0uBVGhTlI4" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="bg-inverse-surface rounded-xl p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 relative z-10">Ready to take the next step?</h2>
              <p className="text-white/60 text-xl max-w-2xl mx-auto mb-12 relative z-10">Join thousands of pros who have already doubled their business using Guild&apos;s platform.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                <Link href="/auth/sign-up?role=pro" className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-12 py-5 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-all text-center">
                  Create Your Pro Profile
                </Link>
                <button className="border-2 border-white/20 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                  Talk to an Agent
                </button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
      </div>
    </>
  );
}
