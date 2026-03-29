"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signUpAction } from "../actions";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const role = searchParams.get("role") || "client"; // Default to client if no role specified
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background selection:bg-primary-container selection:text-on-primary-container flex flex-col relative">
      <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #fef3ff; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ghost-border-focus:focus-within { border-color: #702ae1; outline: none; }
      `}} />

      {/* Top Navigation Bar */}
      <header className="w-full top-0 sticky bg-[#fef3ff]/70 backdrop-blur-md z-50">
        <div className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-[#702ae1] tracking-tight">
            <span style={{ color: "rgb(58, 38, 75)", letterSpacing: "-0.6px" }}>Guild</span>
          </Link>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-[#702ae1] cursor-pointer hover:bg-[#faecff] p-2 rounded-full transition-colors">language</span>
            <span className="material-symbols-outlined text-[#702ae1] cursor-pointer hover:bg-[#faecff] p-2 rounded-full transition-colors">help</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Side: Editorial Content */}
          <div className="hidden lg:flex flex-col flex-1 space-y-6">
            <h1 className="text-5xl font-extrabold text-on-surface leading-tight tracking-tight">
              Start your <span className="text-primary italic">human-centric</span> journey.
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
              Connect with verified service providers in a marketplace built on trust, transparency, and elegant simplicity.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-surface object-cover" alt="User 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZylwj0kaEmzvIPvohLfI1-eDp34im1Ua14m3iYY5NTomcOQ8MLwumgIfgY3AAdL8ZSbzqNOHLDmO8tpAwSPRPOaq-aXBKnvu2MSTPYnolnNwFY4inGolmfQvo6K9Q5dNlqYNqrpiJP5xfq-Hash-HC7H92gfacK07YlujE6uqdrUCNMjj2glTatCJgUGosCMeV-9MqUZ0K8jHQre6_0voNSm4RoBVPHsg0wFGk2qaz4_FZFdn8s1SYzY5WbZItYUwGMvhkkzUWQo" />
                <img className="w-10 h-10 rounded-full border-2 border-surface object-cover" alt="User 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv1jlTBlKV1r8hNMdICnhkXtmt442CnzD1ztWFEavLiEAEs0DLBya2VQQXlE4YIVW1Gm3r-DJanuGTxLuucARKZNtXRoieEE6rtdk41NFF_9yIzcX3OQSa_p-DxHKnDeInItvNvWTnfiLZo50TfwVEUDMjZXpoLTBDTeXhlzd-f7_p6xOIqWfyEpfYeqU2hp555xGpp1EAni4FMuIv63_rX7soQsL2l3daFu8J0of3M0FTQTdD5JnKBhv8H2nnx6mD-ApqefukrY4" />
                <img className="w-10 h-10 rounded-full border-2 border-surface object-cover" alt="User 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd82eROMOevENYa_IQbmA5c0cNdnzTfN9lIaZS6bumZYYs6tEOpZfQep67QYoeIvjo_IstbXIJ8v4T7Pv5neBq2BK6XS5lQ56N6_94yDnpXL9-lNS_fouIPvGmCf6TmHRw83iBSAd-o1ArjVNWhmvFWnAfnCyPIWH8sPXZpdl23q5vpxUimlipXcFGe-RhUDoAO2PQSXZziLWiMhKkt0jG6maM_fIY8W4kbsIEox7t36tSnAAYDthtkVaCCvGQRTJ7LiLxMPjlml0" />
              </div>
              <span className="text-sm font-bold text-on-surface-variant">Joined by 10k+ humans</span>
            </div>
          </div>

          {/* Right Side: Sign Up Form */}
          <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-10 rounded-lg shadow-sm border border-outline-variant/10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-on-surface mb-2">Create your account</h2>
              <p className="text-on-surface-variant text-sm font-medium">Join the community as a <span className="text-primary font-bold uppercase">{role}</span>.</p>
            </div>

            {error && (
              <div className="bg-error-container text-white p-4 rounded-lg mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                <p className="text-sm font-bold">{decodeURIComponent(error)}</p>
              </div>
            )}

            <form 
              action={async (formData) => {
                setIsLoading(true);
                await signUpAction(formData);
                setIsLoading(false);
              }} 
              className="space-y-5"
            >
              <input type="hidden" name="role" value={role} />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-on-surface-variant mb-2 px-1">First name</label>
                  <input 
                    name="first_name"
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full px-5 py-3 focus:border-primary focus:ring-0 transition-all text-on-surface placeholder:text-outline/50 font-medium" 
                    placeholder="Jane" 
                    required
                    type="text" 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-on-surface-variant mb-2 px-1">Last name</label>
                  <input 
                    name="last_name"
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full px-5 py-3 focus:border-primary focus:ring-0 transition-all text-on-surface placeholder:text-outline/50 font-medium" 
                    placeholder="Doe" 
                    required
                    type="text" 
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-on-surface-variant mb-2 px-1">National Identity Number (NIN)</label>
                <input 
                  name="nin"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full px-5 py-3 focus:border-primary focus:ring-0 transition-all text-on-surface placeholder:text-outline/50 font-medium" 
                  placeholder="0000 0000 000" 
                  required
                  type="text" 
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-on-surface-variant mb-2 px-1">Email</label>
                <input 
                  name="email"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full px-5 py-3 focus:border-primary focus:ring-0 transition-all text-on-surface placeholder:text-outline/50 font-medium" 
                  placeholder="jane@example.com" 
                  required
                  type="email" 
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-on-surface-variant mb-2 px-1">Phone number</label>
                <input 
                  name="phone"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full px-5 py-3 focus:border-primary focus:ring-0 transition-all text-on-surface placeholder:text-outline/50 font-medium" 
                  placeholder="+1 (555) 000-0000" 
                  required
                  type="tel" 
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-on-surface-variant mb-2 px-1">Password</label>
                <div className="relative">
                  <input 
                    name="password"
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full px-5 py-3 focus:border-primary focus:ring-0 transition-all text-on-surface placeholder:text-outline/50 font-medium" 
                    placeholder="••••••••" 
                    required
                    type={showPassword ? "text" : "password"} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-outline-variant cursor-pointer hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>
              <button 
                className="w-full py-4 mt-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-70 disabled:scale-100" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed px-4">
                By signing up, you agree to our <Link className="text-primary font-bold hover:underline" href="#">Terms of Service</Link> and <Link className="text-primary font-bold hover:underline" href="#">Privacy Policy</Link>.
              </p>
              <p className="text-sm text-on-surface-variant font-bold">
                Already have an account? <Link className="text-primary font-bold hover:underline" href="/auth/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-[#fef3ff] border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-bold text-[#3a264b]">Guild</span>
            <p className="text-sm text-[#69537b] font-medium">© 2024 TrustMarket. Human-centric service exchange.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link className="text-sm text-[#69537b] font-semibold hover:text-[#702ae1] transition-all" href="#">Privacy Policy</Link>
            <Link className="text-sm text-[#69537b] font-semibold hover:text-[#702ae1] transition-all" href="#">Terms of Service</Link>
            <Link className="text-sm text-[#69537b] font-semibold hover:text-[#702ae1] transition-all" href="#">Trust & Safety</Link>
            <Link className="text-sm text-[#69537b] font-semibold hover:text-[#702ae1] transition-all" href="#">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
