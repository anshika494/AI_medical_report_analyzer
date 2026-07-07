"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/upload": "Upload Report",
  "/dashboard/reports": "My Reports",
  "/dashboard/health-scores": "Health Scores",
  "/dashboard/recommendations": "Recommendations",
  "/dashboard/trends": "Progress & Trends",
  "/dashboard/food-scanner": "Food Scanner",
  "/dashboard/profile": "My Profile",
};

export function Topbar() {
  const pathname = usePathname();

  const title = pageTitles[pathname] || "Dashboard";
  const greeting = getGreeting();

  return (
    <header className="sticky top-0 z-20 glass border-b border-[#2D3B2D]/5 px-4 md:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="ml-12 lg:ml-0">
          <h1 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[#2D3B2D]">
            {title}
          </h1>
          <p className="text-[#2D3B2D]/40 text-sm mt-0.5">
            {greeting}, there 👋
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/50 border border-[#2D3B2D]/8 w-64">
            <Search className="w-4 h-4 text-[#2D3B2D]/30" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm text-[#2D3B2D] placeholder:text-[#2D3B2D]/30 w-full"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl hover:bg-white/50 transition-colors">
            <Bell className="w-5 h-5 text-[#2D3B2D]/50" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-sm font-bold">
            U
          </div>
        </div>
      </div>
    </header>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
