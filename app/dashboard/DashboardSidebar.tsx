"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";

interface DashboardSidebarProps {
  firstName: string;
  fullName: string;
  avatarUrl: string | null;
}

export function DashboardSidebar({ firstName, fullName, avatarUrl }: DashboardSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
    { label: "Profile", icon: "person", href: "/dashboard/profile" },
    { label: "Services", icon: "work", href: "/dashboard/services" },
    { label: "Portfolio", icon: "photo_library", href: "/dashboard/portfolio" },
    { label: "Settings", icon: "settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="hidden md:flex h-[calc(100vh-5rem)] w-64 fixed left-0 top-20 bg-[#fef3ff] flex-col gap-2 p-4">
      {/* Profile Card */}
      <div className="px-4 py-6 mb-4 flex items-center gap-3 bg-surface-container-low rounded-xl">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center">
          {avatarUrl ? (
            <img alt="Pro Profile" className="w-full h-full object-cover" src={avatarUrl} />
          ) : (
            <span className="text-xl font-bold text-primary">{firstName.charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#702ae1]">{fullName}</h3>
          <p className="text-xs text-[#69537b]">Guild Provider</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-[#edd3ff] text-[#702ae1]"
                  : "text-[#69537b] hover:bg-[#faecff]"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Live Status Toggle */}
      <div className="mt-auto p-4 bg-primary/5 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-on-surface-variant">Live Status</span>
          <div className="w-10 h-5 bg-primary rounded-full relative flex items-center px-1">
            <div className="w-3 h-3 bg-white rounded-full translate-x-5"></div>
          </div>
        </div>
        <p className="text-[10px] text-on-surface-variant leading-tight">
          You are currently appearing as <span className="text-primary font-bold">Online</span> to clients.
        </p>
      </div>

      {/* Sign Out */}
      <form action={signOutAction as any} className="mt-2">
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
        >
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </form>
    </aside>
  );
}
