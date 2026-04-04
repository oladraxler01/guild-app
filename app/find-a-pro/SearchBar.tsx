"use client";

import { useState } from "react";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
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
  );
}
