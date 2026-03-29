import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-[0.03]"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold text-on-surface mb-8">Ready to get things done?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/explore" className="w-full sm:w-auto text-center bg-gradient-primary text-on-primary text-lg px-10 py-4 rounded-full font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all">
            Find a Pro
          </Link>
          <Link href="/auth/sign-up" className="w-full sm:w-auto text-center bg-surface-container-highest text-primary text-lg px-10 py-4 rounded-full font-bold hover:bg-surface-container transition-all">
            Be a Pro
          </Link>
        </div>
        <p className="mt-8 text-on-surface-variant font-medium">Join over 50,000 users building better products together.</p>
      </div>
    </section>
  );
}
