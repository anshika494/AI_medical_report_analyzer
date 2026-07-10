"use client";

import React from "react";
import { Bell, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Topbar() {
  return (
    <header style={styles.topbar}>
      {/* Left: Portal badge */}
      <div style={styles.portalBadge}>
        <ShieldCheck style={styles.badgeIcon} />
        <span style={styles.badgeText}>Secure Patient Portal</span>
      </div>

      {/* Right: User menu & notifications */}
      <div style={styles.actions}>
        <button
          aria-label="Notifications"
          style={styles.notificationBtn}
          className="hover:bg-[#2D3B2D]/5 active:scale-[0.95] transition-all"
        >
          <Bell style={styles.bellIcon} />
          <span style={styles.notificationDot} />
        </button>

        <div style={styles.profileDivider} />

        <Link href="/dashboard/profile" style={styles.profileLink}>
          <div style={styles.userInfo}>
            <p style={styles.userName}>Alex Mercer</p>
            <p style={styles.userSubtitle}>Member since 2024</p>
          </div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKUXkOZE532qUHZlPOQIP3gB75OK7ibGABrZsBa4ApweROciRX_zcmmTReoyTulaN67vIAHWsE2jWS14e3JqmjPSjKjfJPzFDclCQyFxUkO_UxIuOTp7RivLMHeFKWHus1CDtrfnE_IAS3tBgzCYnTFxMSCbgNEtXZ6LRJ0DKwtY5qTrWmXkn0qBjZgp3o03eNHwWXomYxXNG69Vh2JiqcjW_AzpCcQNLibINL9hHU4l_xlVhTdNDU"
            alt="Alex Mercer"
            style={styles.avatar}
          />
        </Link>
      </div>
    </header>
  );
}

const styles = {
  topbar: {
    height: "64px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "32px",
    paddingRight: "32px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid rgba(45, 59, 45, 0.08)",
    position: "sticky" as const,
    top: 0,
    zIndex: 40,
  },
  portalBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  badgeIcon: {
    width: "18px",
    height: "18px",
    color: "#059669",
  },
  badgeText: {
    fontSize: "12px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    fontWeight: "700",
    color: "rgba(45, 59, 45, 0.65)",
    fontFamily: "var(--font-manrope), sans-serif",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  notificationBtn: {
    position: "relative" as const,
    padding: "8px",
    borderRadius: "9999px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: {
    width: "18px",
    height: "18px",
    color: "rgba(45, 59, 45, 0.65)",
  },
  notificationDot: {
    position: "absolute" as const,
    top: "8px",
    right: "8px",
    width: "6px",
    height: "6px",
    backgroundColor: "#10B981",
    borderRadius: "9999px",
  },
  profileDivider: {
    height: "24px",
    width: "1px",
    backgroundColor: "rgba(45, 59, 45, 0.15)",
  },
  profileLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
  },
  userInfo: {
    textAlign: "right" as const,
    display: "flex",
    flexDirection: "column" as const,
  },
  userName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2D3B2D",
    margin: 0,
    lineHeight: "1.2",
  },
  userSubtitle: {
    fontSize: "10px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: "rgba(45, 59, 45, 0.45)",
    margin: 0,
    marginTop: "2px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "9999px",
    border: "2px solid #72fd9f",
    objectFit: "cover" as const,
  },
};
