"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#ffffff]/70 backdrop-blur-xl">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-[#3a264b]">
          <span className="tracking-[-0.6px]">Guild</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            className={`${pathname === "/find-a-pro" ? "text-purple-700 font-bold border-b-2 border-purple-600" : "text-[#69537b] hover:text-[#702ae1] font-medium"} text-sm transition-all duration-300`} 
            href="/find-a-pro"
          >
            Find a Pro
          </Link>
          <Link 
            className={`${pathname === "/be-a-pro" ? "text-purple-700 font-bold border-b-2 border-purple-600" : "text-[#69537b] hover:text-[#702ae1] font-medium"} text-sm transition-all duration-300`} 
            href="/be-a-pro"
          >
            Be a Pro
          </Link>
          <Link 
            className={`${pathname === "/how-it-works" ? "text-purple-700 font-bold border-b-2 border-purple-600" : "text-[#69537b] hover:text-[#702ae1] font-medium"} text-sm transition-all duration-300`} 
            href="/how-it-works"
          >
            How it Works
          </Link>
          <Link 
            className={`${pathname === "/browse-jobs" ? "text-purple-700 font-bold border-b-2 border-purple-600" : "text-[#69537b] hover:text-[#702ae1] font-medium"} text-sm transition-all duration-300`} 
            href="/browse-jobs"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="text-[#69537b] font-medium text-sm px-4 py-2 transition-all duration-300 hover:opacity-80 active:scale-95">
              Log In
            </Link>
            <Link href="/auth/sign-up" className="bg-gradient-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:opacity-90 active:scale-95 shadow-sm">
              Sign Up
            </Link>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-[#3a264b] p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined dropdown">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col p-4 space-y-4 rounded-b-xl z-40">
          <Link 
            className={`${pathname === "/find-a-pro" ? "text-purple-700 font-bold" : "text-[#69537b] hover:text-[#702ae1] font-medium"} text-base p-2`} 
            href="/find-a-pro"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Find a Pro
          </Link>
          <Link 
            className={`${pathname === "/be-a-pro" ? "text-purple-700 font-bold" : "text-[#69537b] hover:text-[#702ae1] font-medium"} text-base p-2`} 
            href="/be-a-pro"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Be a Pro
          </Link>
          <Link 
            className={`${pathname === "/how-it-works" ? "text-purple-700 font-bold" : "text-[#69537b] hover:text-[#702ae1] font-medium"} text-base p-2`} 
            href="/how-it-works"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How it Works
          </Link>
          <Link 
            className={`${pathname === "/browse-jobs" ? "text-purple-700 font-bold" : "text-[#69537b] hover:text-[#702ae1] font-medium"} text-base p-2`} 
            href="/browse-jobs"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Browse Jobs
          </Link>
          <div className="border-t border-gray-100 pt-4 flex flex-col space-y-3">
            <Link 
              href="/auth/login" 
              className="text-center text-[#69537b] font-medium text-base px-4 py-3 bg-gray-50 rounded-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Link 
              href="/auth/sign-up" 
              className="text-center bg-gradient-primary text-on-primary px-6 py-3 rounded-full font-bold text-base shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
