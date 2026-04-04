import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HireAction } from "./components/HireAction";
import { startInquiryChat } from "./actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#fef3ff] flex flex-col items-center justify-center text-[#3a264b] font-['Plus_Jakarta_Sans']">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 font-light">
            person_off
          </span>
          <h1 className="text-3xl font-extrabold mb-2">Profile Not Found</h1>
          <p className="text-on-surface-variant mb-6">
            We couldn't find the professional you're looking for.
          </p>
          <Link href="/" className="text-primary font-bold hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Professional";
  const firstName = profile.first_name || "Professional";

  // Parse arrays
  const servicesArray = Array.isArray(profile.services)
    ? profile.services
    : typeof profile.services === "string"
      ? profile.services.split(",").map((s: string) => s.trim())
      : [];

  const portfolioArray = Array.isArray(profile.portfolio_urls) ? profile.portfolio_urls : [];

  return (
    <div className="min-h-screen bg-[#fef3ff] text-[#3a264b] font-['Plus_Jakarta_Sans'] pb-24">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .glass-nav {
            background-color: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
        }
        .tonal-gradient {
            background: linear-gradient(135deg, #702ae1 0%, #b28cff 100%);
        }
        .pro-card-gradient { background: linear-gradient(135deg, #ffffff 0%, #faecff 100%); }
      `,
        }}
      />
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm bg-white/70">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-extrabold text-purple-700 tracking-tighter">
            <Link href="/">
              <span style={{ color: "rgb(58, 38, 75)", letterSpacing: "-0.6px" }}>ConnectFlow</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/find-a-pro"
              className="text-purple-700 font-bold border-b-2 border-purple-600 pb-1 text-sm tracking-wide"
            >
              Find Services
            </Link>
            <Link
              href="/be-a-pro"
              className="text-slate-500 hover:text-purple-500 transition-colors text-sm tracking-wide"
            >
              Be a Provider
            </Link>
            <Link
              href="/how-it-works"
              className="text-slate-500 hover:text-purple-500 transition-colors text-sm tracking-wide"
            >
              How it Works
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-bold text-purple-700 hover:text-purple-900 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="pt-28 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-[2rem] p-4 shadow-sm w-full relative">
            <div className="absolute top-8 right-8 bg-white px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider text-on-surface shadow-sm flex items-center gap-1 z-10 uppercase">
              <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Verified
            </div>
            <div className="w-full aspect-square rounded-[1.5rem] bg-surface-container-high overflow-hidden mb-6 flex items-center justify-center relative">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl font-extrabold text-primary">{fullName.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <HireAction proId={profile.id} />
              <form action={startInquiryChat.bind(null, profile.id) as any} className="w-full">
                <button type="submit" className="w-full py-4 rounded-full bg-surface-container-low text-primary font-bold text-sm hover:bg-surface-container transition-all active:scale-95 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  Message
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Header Info */}
          <header>
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-2">
              {fullName}
            </h1>
            <h2 className="text-primary font-bold text-lg mb-6">
              Guild Professional Provider
            </h2>
            
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full text-sm font-semibold text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {profile.location || "Abuja, FCT"}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full text-sm font-semibold text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-[#FFA800]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-on-surface">4.9/5</span>
                <span className="opacity-60 font-medium">(82 hires)</span>
              </div>
            </div>
          </header>

          {/* About Section */}
          <section className="bg-surface-container-low p-8 rounded-[2rem]">
            <h3 className="text-xl font-bold text-on-surface mb-4">About {firstName}</h3>
            <p className="text-on-surface-variant leading-relaxed">
              {profile.bio || "This professional hasn't provided a full bio yet. Contact them to learn more about their capabilities and experience."}
            </p>
          </section>

          {/* Specialized Services */}
          {servicesArray.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-on-surface mb-6">Specialized Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {servicesArray.map((service: string, index: number) => {
                  const icons = ["home_repair_service", "plumbing", "electrical_services", "cleaning_services", "construction", "handyman"];
                  const icon = icons[index % icons.length];
                  
                  return (
                    <div key={index} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-outline-variant/20 flex flex-col items-start gap-4">
                      <div className="text-primary">
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface text-sm mb-2 leading-tight">{service}</h4>
                        <p className="text-xs text-on-surface-variant opacity-80 leading-relaxed">Professional {service.toLowerCase()} available upon request.</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Recent Projects */}
          <section>
            <h3 className="text-xl font-bold text-on-surface mb-6">Recent Projects</h3>
            {portfolioArray.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {portfolioArray.slice(0, 3).map((imgUrl: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-[1.5rem] bg-surface-container-low overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt="Project" className="w-full h-full object-cover" />
                  </div>
                ))}
                
                {/* Last item or More placeholder */}
                {portfolioArray.length > 3 ? (
                  <div className="aspect-square rounded-[1.5rem] bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant border-2 border-dashed border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors">
                    <span className="font-bold text-sm">+{portfolioArray.length - 3} more</span>
                    <span className="text-xs opacity-70">project photos</span>
                  </div>
                ) : (
                  <div className="aspect-square rounded-[1.5rem] bg-surface-container-low/50 flex flex-col items-center justify-center text-on-surface-variant border-2 border-dashed border-outline-variant/20">
                    <span className="material-symbols-outlined opacity-50 mb-1">add_photo_alternate</span>
                  </div>
                )}
              </div>
            ) : (
                <div className="bg-surface-container-low/50 p-8 rounded-[1.5rem] text-center border border-dashed border-outline-variant/30">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50 mb-2">imagesmode</span>
                  <p className="text-on-surface-variant text-sm font-medium">No recent projects uploaded yet.</p>
                </div>
            )}
          </section>

          {/* Client Reviews */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-on-surface">Client Reviews</h3>
              <button className="text-sm font-bold text-primary hover:text-primary-dim flex items-center gap-1 transition-colors">
                View All Reviews <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            
            <p className="text-sm text-on-surface-variant mb-6 font-medium">What it's like to work with {firstName}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fake Review 1 */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-outline-variant/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container font-bold flex items-center justify-center text-sm">
                    AM
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface text-sm">Amina Mohammed</h5>
                    <div className="flex text-[#FFA800]">
                       {[...Array(5)].map((_, i) => (
                         <span key={i} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                       ))}
                    </div>
                  </div>
                </div>
                <p className="text-on-surface-variant italic text-sm leading-relaxed">
                  "Extraordinary service from start to finish. He arrived absolutely on time, diagnosed the issue quickly, and left the workspace perfectly clean. Highly recommend!"
                </p>
              </div>

              {/* Fake Review 2 */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-outline-variant/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container font-bold flex items-center justify-center text-sm">
                    CO
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface text-sm">Chidi Okoro</h5>
                    <div className="flex text-[#FFA800]">
                       {[...Array(5)].map((_, i) => (
                         <span key={i} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                       ))}
                    </div>
                  </div>
                </div>
                <p className="text-on-surface-variant italic text-sm leading-relaxed">
                  "Professional and transparent with pricing. Explained everything clearly before proceeding with the work. A rare find in this city."
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>

       {/* Footer */}
       <footer className="w-full mt-12 py-8 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-lg font-bold text-on-surface mb-2 tracking-tight">ConnectFlow</div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <span className="text-xs font-semibold text-slate-400 hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-xs font-semibold text-slate-400 hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-xs font-semibold text-slate-400 hover:text-primary cursor-pointer transition-colors">Help Center</span>
            <span className="text-xs font-semibold text-slate-400 hover:text-primary cursor-pointer transition-colors">Contact Us</span>
          </div>
          <p className="text-xs font-medium text-slate-400">
            © 2024 ConnectFlow. Human-centric connections.
          </p>
        </div>
      </footer>
    </div>
  );
}
