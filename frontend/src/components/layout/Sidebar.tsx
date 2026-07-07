"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Upload, FileText, BarChart3, Heart,
  TrendingUp, Camera, User, LogOut, Menu, X, Sparkles,
  ChevronRight, Activity
} from "lucide-react";

// Mock StyleSheet helper similar to React Native
const StyleSheet = {
  create<T extends Record<string, React.CSSProperties>>(styles: T): T {
    return styles;
  }
};

// Design Palette
const colors = {
  white: "#ffffff",
  black: "#000000",
  emerald300: "#6ee7b7",
  emerald400: "#34d399",
  emerald500: "#10b981",
  green600: "#059669",
  sidebarBgStart: "#1a2e1a",
  sidebarBgEnd: "#132213",
  whiteTrans8: "rgba(255, 255, 255, 0.08)",
  whiteTrans5: "rgba(255, 255, 255, 0.05)",
  whiteTrans35: "rgba(255, 255, 255, 0.35)",
  whiteTrans45: "rgba(255, 255, 255, 0.45)",
  emeraldTrans10: "rgba(16, 185, 129, 0.1)",
  emeraldTrans15: "rgba(16, 185, 129, 0.15)",
  emeraldTrans20: "rgba(16, 185, 129, 0.2)",
};

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

const healthTip = {
  text: "Drink 8 glasses of water daily for optimal hydration.",
  icon: "💧",
};

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div style={styles.container}>
      {/* Decorative background blur/blobs */}
      <div style={styles.bgBlobTop} />
      <div style={styles.bgBlobBottom} />

      {/* ── Logo Section ── */}
      <div style={styles.logoSection}>
        <Link href="/dashboard" style={styles.logoLink} onClick={onClose}>
          <div style={styles.logoIconWrapper}>
            <div style={styles.logoIcon}>
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span style={styles.logoPing} />
          </div>

          <div>
            <h1 style={styles.logoTitle}>BioBalance</h1>
            <p style={styles.logoSubtitle}>AI Health Suite</p>
          </div>
        </Link>

        {/* Separator line */}
        <div style={styles.separator} />
      </div>

      {/* ── Scrollable Navigation Container ── */}
      <div style={styles.scrollContainer} className="scrollbar-thin">
        {/* Navigation Section */}
        <div style={styles.navSection}>
          <p style={styles.navHeader}>Navigation</p>

          <div style={styles.navItemsWrapper}>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    ...styles.navItem,
                    color: isActive ? colors.white : "rgba(255, 255, 255, 0.45)"
                  }}
                  className="group hover:text-white"
                >
                  {/* Active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bg"
                      style={styles.activeBg}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Hover background */}
                  {!isActive && <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/4 transition-colors duration-200" />}

                  {/* Left accent bar */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-accent"
                      style={styles.accentBar}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Icon container */}
                  <div
                    style={{
                      ...styles.iconContainer,
                      ...(isActive ? styles.iconActive : styles.iconInactive)
                    }}
                    className="group-hover:bg-white/10 group-hover:text-white/60"
                  >
                    <item.icon className="w-4 h-4" />
                  </div>

                  {/* Label */}
                  <span style={styles.navLabel}>{item.label}</span>

                  {/* Active indicator dot */}
                  {isActive && <div style={styles.activeDot} />}

                  {/* Hover arrow indicator */}
                  {!isActive && <ChevronRight style={styles.hoverArrow} className="group-hover:text-white/20" />}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Fixed Footer Section ── */}
      <div style={styles.footer}>
        {/* Daily Tip Card */}
        <div style={styles.tipCard}>
          <div style={styles.tipCardCircle} />
          <div style={styles.tipCardFlex}>
            <span style={styles.tipCardIcon}>{healthTip.icon}</span>
            <div>
              <p style={styles.tipCardTitle}>Daily Tip</p>
              <p style={styles.tipCardText}>{healthTip.text}</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div style={styles.userCard}>
          <div style={styles.userAvatarWrapper}>
            <div style={styles.userAvatar}>U</div>
            <span style={styles.userStatusDot} />
          </div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>User</p>
            <p style={styles.userDetails}>Local Session · Active</p>
          </div>
          <Sparkles style={styles.userSparkles} />
        </div>

        {/* Exit Button */}
        <Link href="/" style={styles.exitButton} className="group hover:text-white/75 hover:bg-white/6">
          <div style={styles.exitIconWrapper} className="group-hover:bg-white/8">
            <LogOut className="w-3.5 h-3.5" />
          </div>
          <span style={styles.exitLabel}>Exit to Home</span>
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex" style={styles.desktopSidebar}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Toggle Button ── */}
      <button onClick={() => setMobileOpen(true)} aria-label="Open menu" style={styles.mobileToggle}>
        <Menu className="w-4.5 h-4.5 text-white/85" />
      </button>

      {/* ── Mobile Sidebar ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              style={styles.mobileBackdrop}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={styles.mobileDrawer}
            >
              {/* Close button */}
              <button onClick={() => setMobileOpen(false)} style={styles.mobileCloseBtn} className="hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>

              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── StyleSheet.create with CSS rules ──
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
  },
  bgBlobTop: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "144px",
    height: "144px",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderRadius: "9999px",
    filter: "blur(40px)",
    pointerEvents: "none",
  },
  bgBlobBottom: {
    position: "absolute",
    bottom: "80px",
    left: 0,
    width: "112px",
    height: "112px",
    backgroundColor: "rgba(74, 222, 128, 0.05)",
    borderRadius: "9999px",
    filter: "blur(32px)",
    pointerEvents: "none",
  },
  logoSection: {
    paddingLeft: "24px",
    paddingRight: "24px",
    paddingTop: "48px",
    paddingBottom: "24px",
    flexShrink: 0,
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
  },
  logoIconWrapper: {
    position: "relative",
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 15px -3px rgba(6, 78, 59, 0.4)",
  },
  logoPing: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    width: "10px",
    height: "10px",
    borderRadius: "9999px",
    backgroundColor: colors.emerald400,
    border: `2px solid ${colors.sidebarBgStart}`,
  },
  logoTitle: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: "20px",
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 0,
    lineHeight: 1,
    letterSpacing: "-0.02em",
  },
  logoSubtitle: {
    color: "rgba(52, 211, 153, 0.7)",
    fontSize: "10px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    marginTop: "6px",
  },
  separator: {
    marginTop: "24px",
    height: "1px",
    background: "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
  },
  scrollContainer: {
    flex: 1,
    overflowY: "auto",
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingBottom: "24px",
  },
  navSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  navHeader: {
    color: "rgba(255, 255, 255, 0.25)",
    fontSize: "10px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    paddingLeft: "12px",
    marginBottom: "4px",
    marginTop: "8px",
  },
  navItemsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  navItem: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    paddingLeft: "14px",
    paddingRight: "14px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    transition: "all 0.2s ease",
  },
  activeBg: {
    position: "absolute",
    inset: 0,
    backgroundColor: colors.whiteTrans8,
    borderRadius: "12px",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: "6px",
    bottom: "6px",
    width: "3px",
    borderRadius: "0 9999px 9999px 0",
    background: "linear-gradient(to bottom, #6ee7b7, #10b981)",
  },
  iconContainer: {
    position: "relative",
    zIndex: 10,
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  iconActive: {
    backgroundColor: colors.emeraldTrans20,
    color: colors.emerald300,
  },
  iconInactive: {
    backgroundColor: colors.whiteTrans5,
    color: "rgba(255, 255, 255, 0.35)",
  },
  navLabel: {
    position: "relative",
    zIndex: 10,
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  activeDot: {
    position: "relative",
    zIndex: 10,
    width: "6px",
    height: "6px",
    borderRadius: "9999px",
    backgroundColor: colors.emerald400,
    flexShrink: 0,
  },
  hoverArrow: {
    position: "relative",
    zIndex: 10,
    width: "14px",
    height: "14px",
    color: "rgba(255, 255, 255, 0)",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
  footer: {
    padding: "16px",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(19, 34, 19, 0.4)",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  tipCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "12px",
    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)",
    border: "1px solid rgba(16, 185, 129, 0.15)",
    padding: "10px",
  },
  tipCardCircle: {
    position: "absolute",
    right: "-12px",
    top: "-12px",
    width: "40px",
    height: "40px",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderRadius: "9999px",
  },
  tipCardFlex: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  tipCardIcon: {
    fontSize: "16px",
    lineHeight: 1,
    flexShrink: 0,
    marginTop: "2px",
  },
  tipCardTitle: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "rgba(52, 211, 153, 0.9)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "4px",
  },
  tipCardText: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.5)",
    lineHeight: 1.5,
    fontWeight: "normal",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingLeft: "12px",
    paddingRight: "12px",
    paddingTop: "10px",
    paddingBottom: "10px",
    borderRadius: "12px",
    backgroundColor: colors.whiteTrans5,
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  userAvatarWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  userAvatar: {
    width: "34px",
    height: "34px",
    borderRadius: "9999px",
    background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.white,
    fontSize: "12px",
    fontWeight: "bold",
    border: "2px solid rgba(16, 185, 129, 0.2)",
  },
  userStatusDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "10px",
    height: "10px",
    backgroundColor: colors.emerald500,
    borderRadius: "9999px",
    border: `2px solid ${colors.sidebarBgEnd}`,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    color: colors.white,
    fontSize: "14px",
    fontWeight: "semibold",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: 0,
    lineHeight: 1.25,
  },
  userDetails: {
    color: "rgba(255, 255, 255, 0.35)",
    fontSize: "10px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginTop: "2px",
  },
  userSparkles: {
    width: "14px",
    height: "14px",
    color: "rgba(52, 211, 153, 0.4)",
    flexShrink: 0,
  },
  exitButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingLeft: "12px",
    paddingRight: "12px",
    paddingTop: "8px",
    paddingBottom: "8px",
    borderRadius: "12px",
    color: "rgba(255, 255, 255, 0.4)",
    transition: "all 0.2s ease",
    width: "100%",
    fontSize: "14px",
    textDecoration: "none",
  },
  exitIconWrapper: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    backgroundColor: colors.whiteTrans5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease",
  },
  exitLabel: {
    fontWeight: 500,
  },
  desktopSidebar: {
    display: "flex",
    flexDirection: "column",
    width: "280px",
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 30,
    background: "linear-gradient(180deg, #1a2e1a 0%, #132213 50%, #1a2e1a 100%)",
    boxShadow: "4px 0 24px rgba(0,0,0,0.3), 1px 0 0 rgba(255,255,255,0.06)",
  },
  mobileToggle: {
    position: "fixed",
    top: "14px",
    left: "16px",
    zIndex: 45,
    width: "36px",
    height: "36px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(20, 36, 20, 0.9)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
  },
  mobileBackdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)",
    zIndex: 40,
  },
  mobileDrawer: {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    width: "280px",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg, #1a2e1a 0%, #132213 50%, #1a2e1a 100%)",
    boxShadow: "8px 0 32px rgba(0,0,0,0.45)",
  },
  mobileCloseBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "transparent",
    border: "none",
    transition: "all 0.2s ease",
    zIndex: 10,
    cursor: "pointer",
  },
});
