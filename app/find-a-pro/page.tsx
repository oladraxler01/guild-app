"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface ProCardProps {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  experience: string;
  tags: string[];
  imageUrl: string;
  badge?: string;
}

const ProCard = ({ id, name, role, rating, reviews, experience, tags, imageUrl, badge }: ProCardProps) => {
  return (
    <div className="pro-card-gradient p-6 rounded-lg group transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div className="relative">
          <img 
            className="w-20 h-20 rounded-2xl object-cover shadow-md border-4 border-white" 
            alt={name} 
            src={imageUrl} 
          />
          {badge && (
            <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white">
              {badge}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end text-primary mb-1">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
            <span className="font-bold ml-1">{rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">({reviews} reviews)</span>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-on-surface mb-1">{name}</h3>
        <p className="text-primary font-semibold text-sm mb-4">{role}</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-secondary-container/50 text-on-secondary-container text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{experience}</span>
          {tags.map((tag, i) => (
            <span key={i} className="bg-secondary-container/50 text-on-secondary-container text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{tag}</span>
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <Link 
          href={`/find-a-pro/${id}`} 
          className="w-full py-3 px-4 bg-surface-container-high text-primary font-bold rounded-full hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95 text-center block"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default function FindAProPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const pros: ProCardProps[] = [
    {
      id: "1",
      name: "Marcus Thorne",
      role: "Master Plumber",
      rating: 4.9,
      reviews: 128,
      experience: "12 yrs exp",
      tags: ["Emergency Service"],
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlgKrURJgSUm4gP1fOGuFuwWg26vAP1WPqi9XPDJELoQFCLQ7J_bPWyLFWJqIoovMDjIGNJwr03G6GPyT0zh7f66JAivNnBQhSZ1f29HnFoKx93RErhguyjOsojTxqORT0hSeGvuXWhV5eIF8O73HvIPnzcOAUd5yr3PP0E0KohJPFHa8RIXzO8UNEYBNtx8LdASIcV-rOfbQ-3lqiHniPwxX6dlR7IYstcNXAY6qugUD3chts0G6sdZHLTZCghruVi_nQRPhg6Yc",
      badge: "VERIFIED"
    },
    {
      id: "2",
      name: "Elena Rodriguez",
      role: "Interior Designer",
      rating: 5.0,
      reviews: 84,
      experience: "8 yrs exp",
      tags: ["Eco-Friendly"],
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUTjDP2kCs_kuRpQlTCze6XlNr3pa8-C8pbRRq83NHwLShEPxzJFPEIoGwWzX-QozYhJ05V0Dc5SCLj4rDyfNefybk1T0A3Lp-1DicSnmlufCIBRp5Mc_OpFesgZqzNa4MfL6X_SpgGBn-81hhgmzSg1tooF9BShvZstb9jl4NP_r2hSDxGZv4y1uxuGznlsPX-EM0ib8sudR_UhijQxBMOkXQ0f0Yevav4qxe_lZMQg1w23FDnNSkRmVJxHk7td4mAZy8QWFAWIE",
      badge: "TOP RATED"
    },
    {
      id: "3",
      name: "David Chen",
      role: "Electrician",
      rating: 4.7,
      reviews: 210,
      experience: "15 yrs exp",
      tags: ["Smart Home Pro"],
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg7zlnX-35wZiqyhMauqEOyGTmnCKz0qhYuZaVop1HVcLplIRlf-nOSC0On4NbY4EtEa_sQmjmVRS8o8pWLRxCRp4sga67cKknOoQQbTF9MDD6Tq8fISJ8j8wt_EeKhw7HwzM9bq270AhO7hNnqvJBRZBzeIMBrJ_R3N-PGw4HNFK3ypE2aLG7D6Zlw78-HV-Ro0tAxu0zTbEJqguI105x7LYHBJKFroUCGREplA_OAfjFcbykjWaYNq3-irtNHdBak3gBuG5K1kA"
    },
    {
      id: "4",
      name: "Jordan Smith",
      role: "Garden Specialist",
      rating: 4.8,
      reviews: 56,
      experience: "5 yrs exp",
      tags: ["Drought Tolerant"],
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHQ1MKyYvHhzhYU_6u_h6POGvEpwtyz2XE15u6Puuwygq9Io86y2kPJdEuGHGcT42ncAlWq94jyiHpWTULKDmnjImgYqWc22Hmri1KdI6XlPnHgm8PvrP7YMBzaLdoPnDZKXD0dpLKi_Q8135BRBSJwD25BxT7jTvsNS45xNXIdj_Fnv1BY5fCuU4uSVbHJWE9vzk2zb-vyMfETunIGfUnfj0iqSgMnDP-pkRc0dHuNsrd92FOYJ4cOiXkQ0Labh9gi9klUENTZzs",
      badge: "VERIFIED"
    },
    {
      id: "5",
      name: "Sarah Jenkins",
      role: "Cleaning Pro",
      rating: 4.9,
      reviews: 192,
      experience: "10 yrs exp",
      tags: ["Pet Friendly"],
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGpjYSKERvd4IoIa9vnSf_uU2quKvq7K5297Kxfchvxf-I78Epk33yDXfRcf9dX90fqic7h5mMBnPapGcQinwmw5JiOO8zxAVEoz_J9LStKe3nN3mKMmICN8Um1rMZgZ8E_uP0wyn7zgnYVLEaY3c7jwEho8FoN3FSBbpZ-Jse4awVMJYeh_P4ofhI3b1u4NAgc83o8isKOltoYG6is6wp445g74FiZx7EatJ28JYsjaDQTy5wFfOvLUcxb1syoxwnR8lp9AemE7o"
    },
    {
      id: "6",
      name: "Liam O'Connell",
      role: "General Handyman",
      rating: 4.6,
      reviews: 45,
      experience: "7 yrs exp",
      tags: ["Furniture Assembly"],
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBH6FwB-3UJo9rHeHqYasLlGOuDZXgJBCsEX3Gn_vaeiN9bmGP6C3Q0_up_3iUaUC2CnZk-nyS9w4E92B3csFEILwo1EKBUKntuAtwi43gHOReTid46LfJrMuC35pKyePWz1za8B_IwrlWriLB4JmhI5_Op637nF32TRE7rLt_WrwEq8x-C1aFCK-JMp_Z-yBE2K1DesMc95BnaIz-vYYnAt0PF_8fBy44fgUrZdpWwpa7tL7X-jKGsIFcXYBOpgspaMiG8OWMxe4U"
    }
  ];

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
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-surface-container-lowest p-2 rounded-full shadow-lg shadow-on-surface/5 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center px-6 py-2 w-full">
              <span className="material-symbols-outlined text-primary mr-3">search</span>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60 font-medium" 
                placeholder="What service are you looking for?" 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/30 hidden md:block"></div>
            <div className="flex-1 flex items-center px-6 py-2 w-full">
              <span className="material-symbols-outlined text-primary mr-3">location_on</span>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60 font-medium" 
                placeholder="Location" 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button className="primary-cta-gradient text-on-primary px-10 py-4 rounded-full font-bold w-full md:w-auto hover:scale-105 transition-transform">Search</button>
          </div>
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
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pros.map((pro) => (
            <ProCard key={pro.id} {...pro} />
          ))}
        </section>

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
