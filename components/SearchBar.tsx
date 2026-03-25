"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/explore`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="bg-surface-container-lowest p-2 rounded-full shadow-lg flex items-center max-w-xl group focus-within:ring-2 ring-primary/20 transition-all">
      <div className="pl-6 text-on-surface-variant flex items-center">
        <span className="material-symbols-outlined align-middle">search</span>
      </div>
      <input 
        className="w-full bg-transparent border-none focus:ring-0 text-on-surface px-4 py-3 text-lg font-medium placeholder:text-outline" 
        placeholder="What service do you need today?" 
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
        type="submit"
        className="bg-gradient-primary text-on-primary px-8 py-3 rounded-full font-bold transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}
