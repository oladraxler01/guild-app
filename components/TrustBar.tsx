export function TrustBar() {
  return (
    <section className="bg-surface-container-low py-12">
      <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-center gap-12 md:gap-24">
        <div className="flex items-center space-x-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">verified_user</span>
          <span className="font-bold tracking-tight">Verified Profiles</span>
        </div>
        <div className="flex items-center space-x-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">shield_with_heart</span>
          <span className="font-bold tracking-tight">Secure Escrow</span>
        </div>
        <div className="flex items-center space-x-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">chat_bubble</span>
          <span className="font-bold tracking-tight">Direct Chat</span>
        </div>
        <div className="flex items-center space-x-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">lock</span>
          <span className="font-bold tracking-tight">Data Privacy</span>
        </div>
      </div>
    </section>
  );
}
