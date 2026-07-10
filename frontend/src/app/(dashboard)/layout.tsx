"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

// Mock StyleSheet helper similar to React Native
const StyleSheet = {
  create<T extends Record<string, React.CSSProperties>>(styles: T): T {
    return styles;
  }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.layoutContainer}>
      <Sidebar />
      <div style={styles.contentWrapper}>
        <Topbar />
        <main style={styles.mainContent}>
          <div style={styles.centeringContainer}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  layoutContainer: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#FFFDF7",
  },
  contentWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    marginLeft: "280px",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#F2F4F2",
    padding: "32px 40px",
  },
  centeringContainer: {
    maxWidth: "1100px",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
  },
});
