"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInAction } from "../actions";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 selection:bg-primary-container selection:text-on-primary-container relative">
      <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #fef3ff; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .login-gradient { background: linear-gradient(135deg, #702ae1 0%, #b28cff 100%); }
        .ghost-border { border: 1px solid rgba(189, 163, 209, 0.15); }
        .ghost-border:focus-within { border-color: #702ae1; }
      `}} />

      {/* Brand Header */}
      <header className="w-full max-w-md mb-12 text-center">
        <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-highest mb-6 hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-primary text-4xl">lock_open</span>
        </Link>
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Connect</h1>
        <p className="text-on-surface-variant text-lg">Welcome back to TrustMarket</p>
      </header>

      {/* Login Card */}
      <main className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-lg p-8 sm:p-10 shadow-sm">
          <form 
            action={async (formData) => {
              setIsLoading(true);
              await signInAction(formData);
              setIsLoading(false);
            }} 
            className="space-y-8"
          >
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2 ml-1" htmlFor="email">Email</label>
              <div className="relative ghost-border rounded-lg bg-surface-container-lowest transition-all duration-200">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">mail</span>
                </div>
                <input 
                  className="block w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 rounded-lg text-on-surface placeholder:text-outline/50" 
                  id="email" 
                  name="email" 
                  placeholder="name@example.com" 
                  required 
                  type="email" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="block text-sm font-medium text-on-surface-variant" htmlFor="password">Password</label>
                <Link className="text-sm font-semibold text-primary hover:underline transition-all" href="/auth/forgot-password">Forgot your password?</Link>
              </div>
              <div className="relative ghost-border rounded-lg bg-surface-container-lowest transition-all duration-200">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">key</span>
                </div>
                <input 
                  className="block w-full pl-12 pr-12 py-4 bg-transparent border-none focus:ring-0 rounded-lg text-on-surface placeholder:text-outline/50" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"} 
                />
                <button 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-error-container/10 border border-error/20 p-4 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-error">error</span>
                <p className="text-sm text-error font-medium">{decodeURIComponent(error)}</p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              className="w-full login-gradient text-on-primary font-bold py-4 rounded-full text-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
              {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="mt-10 relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-container"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface-container-lowest text-on-surface-variant font-medium">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-3 px-4 bg-surface-container-low rounded-lg hover:bg-surface-container-highest transition-colors duration-200 group">
              <img alt="Google Logo" className="w-5 h-5 mr-2 opacity-80 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA09S_qs2hNeG9e0GEw9w-80UmYKqHMWpi8ZPgBagI_OYRaU-Q4poD6DAh16pqPPcZbLmREGRMSX7oj1CDf7szF4yaIAGfXwoB0IDnxCTM5vye-RyL-WI4jrh4QM48DH7bnPNcnc5s_LWR61A1jJF_TVE6trVQXVKmh4wj_oiGA1Ptx56plQpaX7wR8E2V5ZImEqra43VLbnJqfYDgLUK1FvePg-KZUH5XotEpz3MLIP-HU2R5onFunqmvjEgldqOUWmzKg9V6kBE" />
              <span className="text-sm font-semibold text-on-surface">Google</span>
            </button>
            <button className="flex items-center justify-center py-3 px-4 bg-surface-container-low rounded-lg hover:bg-surface-container-highest transition-colors duration-200 group">
              <span className="material-symbols-outlined text-on-surface mr-2" style={{ fontVariationSettings: '"FILL" 1' }}>ios</span>
              <span className="text-sm font-semibold text-on-surface">Apple</span>
            </button>
          </div>
        </div>

        {/* Signup Link */}
        <p className="mt-10 text-center text-on-surface-variant">
          Don&apos;t have an account? 
          <Link className="font-bold text-primary hover:underline transition-all ml-1" href="/auth/sign-up">Sign up</Link>
        </p>
      </main>

      {/* Footer Information */}
      <footer className="mt-auto pt-12 pb-6 text-center">
        <p className="text-xs text-on-surface-variant/60 uppercase tracking-widest font-bold mb-4">Secure &amp; Human-Centric</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">Privacy Policy</Link>
          <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">Terms of Service</Link>
          <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">Help Center</Link>
        </div>
        <p className="mt-6 text-xs text-on-surface-variant/40 font-medium">© 2024 TrustMarket. All rights reserved.</p>
      </footer>

      {/* Aesthetic Decorative Elements */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}
