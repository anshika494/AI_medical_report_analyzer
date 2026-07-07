"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LeafDecoration } from "@/components/shared/Illustrations";
import {
  LayoutDashboard, Upload, FileText, BarChart3, Heart,
  TrendingUp, Camera, User, LogOut, Menu, X
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload Report", icon: Upload },
  { href: "/dashboard/reports", label: "My Reports", icon: FileText },
  { href: "/dashboard/health-scores", label: "Health Scores", icon: BarChart3 },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: Heart },
  { href: "/dashboard/trends", label: "Progress & Trends", icon: TrendingUp },
  { href: "/dashboard/food-scanner", label: "Food Scanner", icon: Camera },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <LeafDecoration className="w-5 h-5" />
          </div>
          <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white">
            BioBalance
          </span>
        </Link>
        <p className="text-white/30 text-xs mt-3 ml-1">AI Nutrition & Wellness</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-white/15 text-white shadow-lg shadow-black/10"
                  : "text-white/50 hover:bg-white/8 hover:text-white/80"
              )}
            >
              <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive ? "text-emerald-300" : "text-white/40 group-hover:text-emerald-300/70")} />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 rounded-r-full bg-emerald-400"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Exit */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">User</p>
            <p className="text-white/30 text-xs truncate">Local Session</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/8 transition-all w-full text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit to Home</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 sidebar-gradient z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl glass text-[#2D3B2D]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 sidebar-gradient z-50 flex flex-col"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
