import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { SearchBar } from "./SearchBar";

const PLACEHOLDER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuDlgKrURJgSUm4gP1fOGuFuwWg26vAP1WPqi9XPDJELoQFCLQ7J_bPWyLFWJqIoovMDjIGNJwr03G6GPyT0zh7f66JAivNnBQhSZ1f29HnFoKx93RErhguyjOsojTxqORT0hSeGvuXWhV5eIF8O73HvIPnzcOAUd5yr3PP0E0KohJPFHa8RIXzO8UNEYBNtx8LdASIcV-rOfbQ-3lqiHniPwxX6dlR7IYstcNXAY6qugUD3chts0G6sdZHLTZCghruVi_nQRPhg6Yc";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  location: string | null;
  role: string | null;
}

export default async function FindAProPage() {
  const supabase = await createClient();

  const { data: pros, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "pro");

  if (error) {
    console.error("Error fetching pros:", error.message);
  }

  const proList: Profile[] = pros ?? [];

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <style dangerouslySetInnerHTML={{ __html: `
          .pro-card-gradient { background: linear-gradient(135deg, #ffffff 0%, #faecff 100%); }
          .primary-cta-gradient { background: linear-gradient(135deg, #702ae1 0%, #b28cff 100%); }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* Hero Search Section */}
        <section className="mt-12 mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4 tracking-tight">
            Expert help, just a <span className="text-primary">click away.</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-10">
            Connect with the top-rated professionals in your area for any service you need.
          </p>
          
          <SearchBar />
        </section>

        {/* Category Filters */}
        <section className="mb-12 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-4 pb-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full whitespace-nowrap font-semibold shadow-md">
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              All Pros
            </button>
            {["Plumbing", "Electrical", "Design", "Cleaning", "Gardening", "More"].map((cat) => (
              <button key={cat} className="flex items-center gap-2 px-6 py-3 bg-surface-container-low text-on-surface-variant rounded-full whitespace-nowrap font-medium hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-base">
                  {cat === "Plumbing" ? "plumbing" : cat === "Electrical" ? "electrical_services" : cat === "Design" ? "architecture" : cat === "Cleaning" ? "cleaning_services" : cat === "Gardening" ? "landscape" : "more_horiz"}
                </span>
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Main Content: Grid of Pros */}
        {proList.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {proList.map((pro) => {
              const fullName = [pro.first_name, pro.last_name].filter(Boolean).join(" ") || "Guild Professional";
              const avatarUrl = pro.avatar_url || PLACEHOLDER_AVATAR;

              return (
                <div key={pro.id} className="pro-card-gradient p-6 rounded-lg group transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative">
                      <img 
                        className="w-20 h-20 rounded-2xl object-cover shadow-md border-4 border-white" 
                        alt={fullName} 
                        src={avatarUrl} 
                      />
                    </div>
                    <div className="text-right">
                      {pro.location && (
                        <div className="flex items-center justify-end text-on-surface-variant mb-1 gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span className="text-xs font-medium">{pro.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-on-surface mb-1">{fullName}</h3>
                    <p className="text-primary font-semibold text-sm mb-4">Guild Professional</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-secondary-container/50 text-on-secondary-container text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">PRO</span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Link 
                      href={`/find-a-pro/${pro.id}`} 
                      className="w-full py-3 px-4 bg-surface-container-high text-primary font-bold rounded-full hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95 text-center block"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          /* Empty State UI */
          <section className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary text-5xl">group_add</span>
            </div>
            <h2 className="text-3xl font-extrabold text-on-surface mb-4 tracking-tight">
              No professionals found in your area yet.
            </h2>
            <p className="text-on-surface-variant text-lg max-w-md mb-10 leading-relaxed">
              Be the first to join the Guild! Sign up as a Pro and start connecting with clients today.
            </p>
            <Link 
              href="/auth/sign-up?role=pro" 
              className="primary-cta-gradient text-on-primary px-10 py-5 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Join as a Pro
            </Link>
          </section>
        )}

        {/* CTA Section */}
        <section className="mt-20 p-12 rounded-lg bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-on-surface mb-4">Can&apos;t find what you&apos;re looking for?</h2>
            <p className="text-on-surface-variant leading-relaxed">Describe your project and let the pros come to you. Get up to 5 quotes from qualified local professionals in minutes.</p>
          </div>
          <Link href="/post-job" className="primary-cta-gradient text-on-primary px-10 py-5 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform whitespace-nowrap text-center">
            Post a Project
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
