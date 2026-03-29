import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: PageProps) {
  const { id } = use(params);

  /* 
     TODO: Fetch real data from Supabase 'profiles' table using the 'id'
     const supabase = await createClient();
     const { data: profile } = await supabase
       .from('profiles')
       .select('*')
       .eq('id', id)
       .single();
  */

  // Fallback data (Emeka Okafor)
  const profile = {
    name: "Emeka Okafor",
    title: "Master Plumber & Systems Engineer",
    location: "Garki, Abuja",
    rating: "4.9/5",
    hires: 82,
    bio: "With over 15 years of experience serving the Abuja metropolis, I specialize in high-precision plumbing and industrial water systems. My approach combines traditional craftsmanship with modern diagnostic tools to ensure long-lasting solutions. I believe in transparent pricing and respect for your home environment.",
    services: [
      {
        icon: "water_damage",
        title: "Leak Repair",
        description: "Precision detection and repair of concealed pipe leaks."
      },
      {
        icon: "plumbing",
        title: "Pipe Installation",
        description: "Full copper and PEX piping for new builds and renovations."
      },
      {
        icon: "hot_tub",
        title: "Water Heaters",
        description: "Maintenance and installation of solar and electric systems."
      }
    ]
  };

  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex-grow">
        {/* Profile Header Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 items-start">
          {/* Profile Image & Quick Info */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low">
                <img 
                  alt={profile.name} 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-qQ-gatGMUDMD8vkTCr1udMC28D-GWKEZ3GoEBs-GCJBR4wXvcOniFiS6IPiLk6Kua5HCHsPK0bpb1KKI2psLUR_1vTXjIN1oAQaHtBbNZpjW9IWE7QzxzxcYzoSwL6J57OBWrRJCB9zmaHmfocFdJfpr3hFfXJ5biKwkf58nT3PSDoe4PrB_F6bthgEJI8GeAif95SBM80Ze4hI9f773oWdJyCWMFD0gNg-IX712YnFhZrvhYoEathKLx-jmLRNjfplPfqybhBg" 
                />
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Verified</span>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <button className="w-full py-4 bg-gradient-primary text-on-primary rounded-full font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                <span className="material-symbols-outlined">calendar_today</span>
                Hire Now
              </button>
              <button className="w-full py-4 bg-surface-container-highest text-primary rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined">mail</span>
                Message
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-2 tracking-tight">{profile.name}</h1>
              <p className="text-xl text-primary font-semibold mb-4">{profile.title}</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                  <span className="material-symbols-outlined text-on-surface-variant">location_on</span>
                  <span className="text-on-surface font-medium">{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                  <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  <span className="text-on-surface font-bold">{profile.rating}</span>
                  <span className="text-on-surface-variant text-sm">({profile.hires} hires)</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-surface-container-low p-8 rounded-lg border border-outline-variant/10">
              <h2 className="text-xl font-bold text-on-surface mb-4">About {profile.name.split(' ')[0]}</h2>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                {profile.bio}
              </p>
            </div>

            {/* Services Bento Grid */}
            <div>
              <h2 className="text-xl font-bold text-on-surface mb-6">Specialized Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.services.map((service, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-outline-variant/10 shadow-sm flex flex-col gap-3">
                    <span className="material-symbols-outlined text-primary text-3xl">{service.icon}</span>
                    <h3 className="font-bold text-on-surface">{service.title}</h3>
                    <p className="text-sm text-on-surface-variant">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-on-surface mb-8">Recent Projects</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low group cursor-pointer">
              <img 
                alt="Modern Bathroom" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHsy5u3cynilcwDf_ZD0KNgNFXpZFf9F7zYL1f1QMBKI1GmYUhbnP10IdPpQGsq2XejcQi564geIWLZnc5-8xtmrzvMKVBLrnUz9YK7mTPbIlDTMtVD4RefYdLw6NttSDIQtKG4Lrm8LjauwVtUg8YVo7GKI7zqTZvF7I4_1B8dZQzPb3CpzFAUy4WBDuDU0gFbttyr5wzmIDKNf4MLpyOeMwivXnaMhbGdiFFmWocBxdPNKhSsxZOfHi_rSfbMRogX3qFycGTvok" 
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low group cursor-pointer">
              <img 
                alt="Piping System" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgnxvPZNLJFcoPw6b6WYzo-VjElwVrEf2-ofQmYAoUGqaNnTzVGWlChLkBhidqipSdQu6oI8RDboZVLPqTdafMkPuOOgZ1GQgkcONvKMqcr6G_9c2Q0dk5OZq8S9mqkj8_rhOMFfRcScv2pZ_RQud-Inopp8QN7pL3vNt7ZlZVuKSrNCUZMuw_DDSvGLrMij4KAA38LQW7aSN0i0O1yEhM7FRnE6WW95HO7CBu0Moz6HwczajqoP3aX5PN9W5Fx-_lpwyDLKfoEnA" 
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low group cursor-pointer">
              <img 
                alt="Kitchen Fixture" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ8PL9UbZrrNcSXGSdDGE1FEJhiwPZV93uNsmjgl7bBmmnWmQ-EQM7OQWGDLVjZI3qhR_5PPwBpMHRbrnjrO-fLLNZUk85mj9HFjs6la78xlyy4m1tTYF3frTRDaM79h4uWhE81Kx685Zewsv_XLYJRDmU5VRDFOnQSQ2UDuC0wMEZPWKQNhEr7eLwaj5y4jjMnlvf9pDBE-3lvWcwWFwN5KHauBW-fkae5xynQXwfrmESJudL_fDnukqGZGeET7gO4SrzmEd6WgM" 
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low flex items-center justify-center p-6 text-center border-2 border-dashed border-outline-variant/30 hover:bg-surface-container-high transition-colors cursor-pointer">
              <p className="text-on-surface-variant font-medium">+14 more project photos</p>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">Client Reviews</h2>
              <p className="text-on-surface-variant">What it&apos;s like to work with {profile.name.split(' ')[0]}</p>
            </div>
            <button className="text-primary font-bold hover:underline flex items-center gap-1 group">
              View All Reviews 
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/5 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container">AM</div>
                <div>
                  <p className="font-bold text-on-surface">Amina Mohammed</p>
                  <div className="flex text-amber-500 text-sm">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-on-surface-variant italic leading-relaxed">
                &quot;Emeka fixed a major leak that two other plumbers couldn&apos;t find. He was punctual, clean, and extremely professional. Highly recommended for any complex issues!&quot;
              </p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/5 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center font-bold text-on-tertiary-container">CO</div>
                <div>
                  <p className="font-bold text-on-surface">Chidi Okoro</p>
                  <div className="flex text-amber-500 text-sm">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-on-surface-variant italic leading-relaxed">
                &quot;Professional service from start to finish. He explained everything clearly and the final bill was exactly what he quoted. A rare find in this city.&quot;
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
