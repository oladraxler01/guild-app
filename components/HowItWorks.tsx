export function HowItWorks() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface mb-4">Simple steps to success</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto">We&#39;ve removed the friction from hiring. Focus on your project while we handle the logistics.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="group p-8 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all duration-500">
          <div className="w-16 h-16 bg-surface-container-lowest rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary text-3xl">post_add</span>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-3">Post a job</h3>
          <p className="text-on-surface-variant leading-relaxed">Tell us what you need. From plumbing to software development, our platform covers it all.</p>
        </div>
        
        {/* Step 2 */}
        <div className="group p-8 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all duration-500">
          <div className="w-16 h-16 bg-surface-container-lowest rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary text-3xl">compare_arrows</span>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-3">Compare bids</h3>
          <p className="text-on-surface-variant leading-relaxed">Review profiles, ratings, and portfolios. Pick the pro that best fits your vision and budget.</p>
        </div>
        
        {/* Step 3 */}
        <div className="group p-8 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all duration-500">
          <div className="w-16 h-16 bg-surface-container-lowest rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary text-3xl">payments</span>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-3">Pay securely</h3>
          <p className="text-on-surface-variant leading-relaxed">Funds are held in escrow and only released when you&#39;re 100% satisfied with the work.</p>
        </div>
      </div>
    </section>
  );
}
