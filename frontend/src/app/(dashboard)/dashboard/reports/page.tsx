"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { formatDate, getScoreColor, getScoreLabel, cn } from "@/lib/utils";
import { FileText, Upload, ChevronRight, Loader2, Search, Lock, Info, FolderOpen } from "lucide-react";

import { Footer } from "@/components/layout/Footer";

// Mock StyleSheet helper similar to React Native
const StyleSheet = {
  create<T extends Record<string, React.CSSProperties>>(styles: T): T {
    return styles;
  }
};

export default function ReportsListPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [greeting, setGreeting] = useState("Good afternoon");

  useEffect(() => {
    api.get("/reports/")
      .then((res) => setReports(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Calculate dynamic greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filtered = reports.filter((r) =>
    r.file_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.report_type?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-3" />
        <p style={styles.loadingText}>Loading your reports...</p>
      </div>
    );
  }

  return (
    /* pageWrapper: full-height flex column so the card can be centred and footer pushed to bottom */
    <div style={styles.pageWrapper}>

      {/* ── Page Header ───────────────────────────────────────── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.headerTitleWrapper}>
            <FolderOpen className="w-7 h-7 text-emerald-600" />
            <h1 style={styles.headerTitle}>My Reports</h1>
          </div>
          <div style={styles.headerSubWrapper}>
            <FileText style={{ width: 14, height: 14, color: "rgba(45,59,45,0.45)" }} />
            <span style={styles.headerSub}>
              {reports.length === 0
                ? "No reports yet"
                : `${reports.length} report${reports.length === 1 ? "" : "s"} uploaded`}
            </span>
          </div>
        </div>

        {reports.length > 0 && (
          <Link href="/dashboard/upload" className="btn-primary">
            <Upload className="w-4 h-4" />
            Upload New Report
          </Link>
        )}
      </div>

      {/* ── Search (only when reports exist) ─────────────────── */}
      {reports.length > 0 && (
        <div style={styles.searchContainer}>
          <Search style={{ width: 16, height: 16, color: "rgba(45,59,45,0.35)", flexShrink: 0 }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by name or type..."
            style={styles.searchInput}
          />
          {search && <span style={styles.searchCount}>{filtered.length} found</span>}
        </div>
      )}

      {/* ── Content area (flex-grow so footer is pushed to bottom) ── */}
      <div style={styles.contentGrow}>

        {reports.length === 0 ? (
          /* Empty State — centred vertically + horizontally */
          <div style={styles.centreWrapper}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={styles.emptyCard}
            >
              {/* Left: Illustration — w-1/2, image centred at max-w 320px */}
              <div style={styles.imageHalf}>
                {/* Blurred glow behind image */}
                <div style={styles.imageGlow} />
                <img
                  src="/medical_report_desktop.png"
                  alt="AI Medical Scanner"
                  style={styles.cardImage}
                />
              </div>

              {/* Right: Text + CTA */}
              <div style={styles.contentHalf}>
                <div style={styles.textBlock}>
                  <h2 style={styles.cardTitle}>No reports uploaded yet</h2>
                  <p style={styles.cardDesc}>
                    Upload your first medical report to get AI-powered health analysis,
                    personalized scores, and recommendations.
                  </p>
                </div>

                <div style={styles.ctaBlock}>
                  <Link href="/dashboard/upload" style={styles.uploadBtnLarge} className="btn-primary">
                    <Upload style={{ width: 18, height: 18 }} />
                    Upload Your First Report
                  </Link>
                  <div style={styles.hipaaRow}>
                    <Lock style={{ width: 14, height: 14, color: "rgba(45,59,45,0.35)" }} />
                    <span style={styles.hipaaText}>HIPAA Compliant & Encrypted</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        ) : filtered.length === 0 ? (
          /* No search results */
          <div style={styles.emptyStateCard}>
            <Search style={{ width: 48, height: 48, color: "rgba(45,59,45,0.2)", margin: "0 auto 12px" }} />
            <p style={styles.emptyTitle}>No results found</p>
            <p style={styles.emptyDesc}>Try a different search term.</p>
          </div>

        ) : (
          /* Reports table */
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <div style={styles.tableHeaderGrid}>
                <span style={styles.tableHeaderLabel}>Report</span>
                <span style={styles.tableHeaderLabel} className="hidden sm:block">Type</span>
                <span style={styles.tableHeaderLabel} className="hidden md:block">Score</span>
                <span style={styles.tableHeaderLabel} className="hidden sm:block">Status</span>
              </div>
            </div>

            <div style={styles.reportRowsWrapper}>
              {filtered.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={`/dashboard/reports/${report.id}`}
                    style={styles.reportRowLink}
                    className="hover:bg-emerald-50/40 group"
                  >
                    <div style={styles.reportInfoCol}>
                      <div style={styles.reportIconBox}>
                        <FileText style={{ width: 18, height: 18, color: "#059669" }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={styles.reportFileName} className="group-hover:text-emerald-700 transition-colors">
                          {report.file_name}
                        </p>
                        <p style={styles.reportFileDate}>{formatDate(report.uploaded_at)}</p>
                      </div>
                    </div>

                    <div style={{ minWidth: "120px" }} className="hidden sm:block">
                      {report.report_type ? (
                        <span className="badge badge-success text-xs">{report.report_type.replace(/_/g, " ")}</span>
                      ) : (
                        <span className="badge badge-neutral text-xs">General</span>
                      )}
                    </div>

                    <div style={{ minWidth: "60px", textAlign: "right" }} className="hidden md:block">
                      {report.overall_score ? (
                        <div>
                          <p style={styles.scoreText} className={cn("tabular-nums", getScoreColor(report.overall_score))}>
                            {report.overall_score}
                          </p>
                          <p style={styles.scoreLabel}>{getScoreLabel(report.overall_score)}</p>
                        </div>
                      ) : (
                        <span style={{ color: "rgba(45,59,45,0.2)", fontSize: 16 }}>—</span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden sm:flex">
                      <span className={`badge text-xs ${report.has_analysis ? "badge-success" : "badge-warning"}`}>
                        {report.has_analysis ? "Analyzed" : "Pending"}
                      </span>
                      <ChevronRight style={styles.arrowIcon} className="group-hover:text-emerald-500" />
                    </div>

                    <ChevronRight style={styles.arrowIcon} className="sm:hidden group-hover:text-emerald-500" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ────────────────────────────────────────────── */}
      <Footer />

      {/* ── Mobile FAB ───────────────────────────────────────── */}
      {isMobile && (
        <Link href="/dashboard/upload" style={styles.fabButton}>
          <span style={{ fontSize: 28, color: "#ffffff", fontWeight: "300", lineHeight: 1 }}>+</span>
        </Link>
      )}

      {/* ── Atmospheric green glow (bottom-right, fixed) ─────── */}
      <div style={styles.atmosphericGlow} />
    </div>
  );
}

// ── StyleSheet.create ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // ── Page ──────────────────────────────────────────────────────────────────
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "calc(100vh - 64px - 64px)",  // viewport minus topbar minus layout padding
    gap: "32px",
  },

  // ── Loading ───────────────────────────────────────────────────────────────
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "96px",
    paddingBottom: "96px",
    textAlign: "center",
  },
  loadingText: { color: "rgba(45, 59, 45, 0.4)", fontSize: "14px", marginTop: "12px" },

  // ── Header ────────────────────────────────────────────────────────────────
  headerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "16px",
  },
  headerTitleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  headerTitle: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1a2e1a",
    margin: 0,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
  },
  headerSubWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginLeft: "38px",
  },
  headerSub: {
    fontSize: "14px",
    color: "rgba(45, 59, 45, 0.45)",
    fontWeight: "500",
  },

  // ── Search ────────────────────────────────────────────────────────────────
  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid rgba(45,59,45,0.08)",
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingTop: "12px",
    paddingBottom: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  searchInput: {
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#2D3B2D",
    width: "100%",
    padding: 0,
  },
  searchCount: {
    fontSize: "12px",
    color: "rgba(45, 59, 45, 0.4)",
    flexShrink: 0,
  },

  // ── Content grow area ─────────────────────────────────────────────────────
  contentGrow: {
    flex: 1,
    display: "flex",
    alignItems: "center",         // vertically centre the card
    justifyContent: "center",     // horizontally centre the card
  },

  // ── Empty state: outer centre wrapper ─────────────────────────────────────
  centreWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },

  // ── White card (matches reference: max-w-4xl = 896px, p-12 = 48px) ────────
  emptyCard: {
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    border: "1px solid #e6e9e8",
    borderRadius: "12px",
    padding: "48px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "48px",
    width: "100%",
    maxWidth: "896px",
    transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
  },

  // ── Left half: illustration ───────────────────────────────────────────────
  imageHalf: {
    width: "50%",
    flexShrink: 0,
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageGlow: {
    position: "absolute",
    inset: 0,
    background: "rgba(114, 253, 159, 0.10)",
    borderRadius: "9999px",
    filter: "blur(48px)",
    zIndex: 0,
  },
  cardImage: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "320px",
    margin: "0 auto",
    display: "block",
    filter: "drop-shadow(0 20px 24px rgba(0,0,0,0.18))",
    objectFit: "contain",
  },

  // ── Right half: text + CTA ────────────────────────────────────────────────
  contentHalf: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  textBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cardTitle: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: "24px",
    fontWeight: "500",
    color: "#1a2e1a",
    margin: 0,
    lineHeight: "32px",
  },
  cardDesc: {
    fontSize: "16px",
    color: "rgba(45, 59, 45, 0.55)",
    lineHeight: "24px",
    margin: 0,
  },
  ctaBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "flex-start",
    paddingTop: "8px",
  },
  uploadBtnLarge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    paddingLeft: "32px",
    paddingRight: "32px",
    paddingTop: "16px",
    paddingBottom: "16px",
    fontSize: "15px",
    fontWeight: "600",
    borderRadius: "9999px",
  },
  hipaaRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  hipaaText: {
    fontSize: "12px",
    color: "rgba(45, 59, 45, 0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: "700",
  },

  // ── No-results state ──────────────────────────────────────────────────────
  emptyStateCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e6e9e8",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    padding: "64px 32px",
    textAlign: "center",
    width: "100%",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2D3B2D",
    margin: "0 0 8px",
  },
  emptyDesc: {
    fontSize: "14px",
    color: "rgba(45,59,45,0.45)",
    margin: 0,
  },

  // ── Reports table ─────────────────────────────────────────────────────────
  tableCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e6e9e8",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    overflow: "hidden",
    width: "100%",
  },
  tableHeader: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "14px",
    paddingBottom: "14px",
    borderBottom: "1px solid rgba(45, 59, 45, 0.05)",
    backgroundColor: "rgba(250, 248, 245, 0.6)",
  },
  tableHeaderGrid: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto auto",
    alignItems: "center",
    gap: "16px",
  },
  tableHeaderLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "rgba(45, 59, 45, 0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  reportRowsWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  reportRowLink: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto auto",
    alignItems: "center",
    gap: "16px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "16px",
    paddingBottom: "16px",
    textDecoration: "none",
    transition: "background-color 0.15s ease",
    borderBottom: "1px solid rgba(45,59,45,0.04)",
  },
  reportInfoCol: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },
  reportIconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  reportFileName: {
    fontWeight: "600",
    color: "#2D3B2D",
    fontSize: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    margin: 0,
  },
  reportFileDate: {
    fontSize: "12px",
    color: "rgba(45, 59, 45, 0.4)",
    margin: 0,
    marginTop: "2px",
  },
  scoreText: {
    fontSize: "18px",
    fontWeight: "bold",
    lineHeight: 1,
    margin: 0,
  },
  scoreLabel: {
    fontSize: "10px",
    color: "rgba(45, 59, 45, 0.35)",
    marginTop: "2px",
    margin: 0,
  },
  arrowIcon: {
    color: "rgba(45, 59, 45, 0.2)",
    transition: "color 0.15s ease",
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "24px",
    borderTop: "1px solid #c2c8c2",
    marginTop: "32px",
  },
  footerLeftLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "rgba(45, 59, 45, 0.55)",
    fontSize: "14px",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  footerInfoText: {
    fontSize: "14px",
  },
  footerRight: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },
  footerLink: {
    color: "rgba(45, 59, 45, 0.4)",
    fontSize: "12px",
    letterSpacing: "0.05em",
    textDecoration: "none",
    textTransform: "uppercase",
    fontWeight: "700",
    transition: "color 0.2s ease",
  },

  // ── Mobile FAB ────────────────────────────────────────────────────────────
  fabButton: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "9999px",
    backgroundColor: "#059669",
    boxShadow: "0 4px 14px rgba(5, 150, 105, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 40,
    textDecoration: "none",
  },

  // ── Atmospheric glow (bottom-right corner) ────────────────────────────────
  atmosphericGlow: {
    position: "fixed",
    bottom: 0,
    right: 0,
    width: "500px",
    height: "500px",
    background: "rgba(114, 253, 159, 0.15)",
    filter: "blur(120px)",
    borderRadius: "9999px",
    transform: "translate(50%, 50%)",
    zIndex: -1,
    pointerEvents: "none",
  },
});
