"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";
import { getScoreColor, getScoreLabel } from "@/lib/utils";
import {
  Heart, Apple, Activity, Moon, Droplets, Brain,
  Shield, TrendingUp, Sparkles, Loader2, Info, Upload, FileText
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";

// Mock StyleSheet helper similar to React Native
const StyleSheet = {
  create<T extends Record<string, React.CSSProperties>>(styles: T): T {
    return styles;
  }
};

const scoreConfig: Record<string, { icon: any; gradient: string; bg: string; label: string }> = {
  overall: { icon: Sparkles, gradient: "from-emerald-400 to-green-600", bg: "bg-emerald-50", label: "Overall Health" },
  nutrition: { icon: Apple, gradient: "from-lime-400 to-emerald-600", bg: "bg-lime-50", label: "Nutrition" },
  fitness: { icon: Activity, gradient: "from-blue-400 to-indigo-600", bg: "bg-blue-50", label: "Fitness" },
  sleep: { icon: Moon, gradient: "from-indigo-400 to-purple-600", bg: "bg-indigo-50", label: "Sleep Quality" },
  hydration: { icon: Droplets, gradient: "from-cyan-400 to-blue-600", bg: "bg-cyan-50", label: "Hydration" },
  mental_wellness: { icon: Brain, gradient: "from-violet-400 to-purple-600", bg: "bg-violet-50", label: "Mental Wellness" },
  heart_health: { icon: Heart, gradient: "from-rose-400 to-red-600", bg: "bg-rose-50", label: "Heart Health" },
  lifestyle: { icon: TrendingUp, gradient: "from-amber-400 to-orange-600", bg: "bg-amber-50", label: "Lifestyle" },
  risk_assessment: { icon: Shield, gradient: "from-slate-400 to-gray-600", bg: "bg-slate-50", label: "Risk Assessment" },
};

export default function HealthScoresPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/health/scores/latest")
      .then((res) => setData(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-3" />
          <p className="text-[#2D3B2D]/40 text-sm">Loading health scores…</p>
        </div>
      </div>
    );
  }

  const scores = data?.scores;
  const overallScore = scores?.overall?.score;

  return (
    <div style={styles.pageWrapper}>
      {/* ── Page Header ───────────────────────────────────────── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.headerTitleWrapper}>
            <Sparkles className="w-7 h-7 text-emerald-600" />
            <h1 style={styles.headerTitle}>Health Scores</h1>
          </div>
          <div style={styles.headerSubWrapper}>
            <FileText style={{ width: 14, height: 14, color: "rgba(45,59,45,0.45)" }} />
            <span style={styles.headerSub}>
              {!scores
                ? "No health scores generated yet"
                : `Overall Score: ${overallScore || 0}/100`}
            </span>
          </div>
        </div>
      </div>

      {!scores ? (
        <div style={styles.emptyStateCard}>
          <Sparkles style={{ width: 56, height: 56, color: "rgba(45,59,45,0.25)", margin: "0 auto 16px" }} />
          <h3 style={styles.emptyTitle}>No Health Scores Yet</h3>
          <p style={styles.emptyDesc}>
            Upload and analyze a medical report to generate your personalized health score breakdown.
          </p>
          <Link href="/dashboard/upload" className="btn-primary mt-6 inline-flex items-center gap-2" style={{ width: "fit-content", margin: "24px auto 0" }}>
            <Upload className="w-4 h-4" /> Upload a Report
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ===== Header with Overall ===== */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Overall ring */}
              <div className="relative w-36 h-36 flex-shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e8e0d8" strokeWidth="7" />
                  {overallScore && (
                    <motion.circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={overallScore >= 80 ? "#22c55e" : overallScore >= 60 ? "#84cc16" : overallScore >= 40 ? "#eab308" : "#ef4444"}
                      strokeWidth="7"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: `0 327` }}
                      animate={{ strokeDasharray: `${(overallScore / 100) * 327} 327` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`font-[family-name:var(--font-playfair)] text-4xl font-bold ${overallScore ? getScoreColor(overallScore) : "text-[#2D3B2D]/20"}`}>
                    {overallScore || "—"}
                  </span>
                  <span className="text-xs text-[#2D3B2D]/40 font-medium mt-0.5">
                    {overallScore ? getScoreLabel(overallScore) : "No data"}
                  </span>
                </div>
              </div>

              {/* Summary text */}
              <div className="text-center sm:text-left flex-1">
                <h2 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-[#2D3B2D] mb-2">
                  Overall Health Analysis
                </h2>
                <p className="text-[#2D3B2D]/50 text-sm mb-4 max-w-md leading-relaxed">
                  Based on your latest analyzed report. Each score reflects a different dimension of your health.
                </p>
                {overallScore && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-semibold text-emerald-700">
                      Overall: {getScoreLabel(overallScore)} ({overallScore}/100)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== Score Cards Grid ===== */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(scores)
              .filter(([key]) => key !== "overall")
              .map(([key, scoreData]: [string, any], i) => {
                const config = scoreConfig[key];
                if (!config) return null;
                const score = scoreData?.score || 0;
                const circumference = 2 * Math.PI * 48;
                const strokeDash = (score / 100) * circumference;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card p-5"
                  >
                    <div className="flex items-start gap-4">
                      {/* Score Ring */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                          <circle cx="60" cy="60" r="48" fill="none" stroke="#e8e0d8" strokeWidth="9" />
                          <motion.circle
                            cx="60" cy="60" r="48" fill="none"
                            stroke={
                              score >= 80 ? "#22c55e"
                              : score >= 60 ? "#84cc16"
                              : score >= 40 ? "#eab308"
                              : "#ef4444"
                            }
                            strokeWidth="9"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: `0 ${circumference}` }}
                            animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 + i * 0.08 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`font-[family-name:var(--font-playfair)] text-xl font-bold leading-none ${getScoreColor(score)}`}>
                            {score}
                          </span>
                          <span className="text-[9px] text-[#2D3B2D]/35 mt-0.5">/100</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                            <config.icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <h3 className="font-semibold text-[#2D3B2D] text-sm leading-tight">{config.label}</h3>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            score >= 80 ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                            score >= 60 ? "bg-lime-50 text-lime-600 border border-lime-200" :
                            score >= 40 ? "bg-yellow-50 text-yellow-600 border border-yellow-200" :
                            "bg-red-50 text-red-600 border border-red-200"
                          }`}>
                            {getScoreLabel(score)}
                          </span>
                        </div>
                        <p className="text-xs text-[#2D3B2D]/50 leading-relaxed line-clamp-3">
                          {scoreData?.explanation || "Explanation pending."}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 w-full h-1.5 rounded-full bg-[#2D3B2D]/6">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.08 }}
                        className={`h-full rounded-full ${
                          score >= 80 ? "bg-emerald-500"
                          : score >= 60 ? "bg-lime-500"
                          : score >= 40 ? "bg-yellow-500"
                          : "bg-red-500"
                        }`}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {/* ===== Scale Legend ===== */}
          <div className="glass-card p-5">
            <p className="text-xs font-semibold text-[#2D3B2D]/40 uppercase tracking-wider mb-3">Score Scale</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Excellent", range: "80–100", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
                { label: "Good", range: "60–79", color: "text-lime-600", bg: "bg-lime-50 border-lime-200" },
                { label: "Fair", range: "40–59", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
                { label: "Poor", range: "20–39", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
                { label: "Critical", range: "0–19", color: "text-red-600", bg: "bg-red-50 border-red-200" },
              ].map((item) => (
                <div key={item.label} className={`p-2.5 rounded-lg border ${item.bg} text-center`}>
                  <p className={`text-xs font-bold ${item.color}`}>{item.label}</p>
                  <p className="text-[10px] text-[#2D3B2D]/40 mt-0.5">{item.range}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Disclaimer ===== */}
          <div className="info-banner">
            <Info className="w-4 h-4" />
            <p>
              These scores are AI-generated for educational purposes. Always consult a qualified healthcare professional for medical decisions.
            </p>
          </div>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <Footer />

      {/* ── Atmospheric green glow (bottom-right, fixed) ─────── */}
      <div style={styles.atmosphericGlow} />
    </div>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "calc(100vh - 110px)",  // viewport minus topbar minus layout padding
    gap: "32px",
  },
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
  },
  headerSubWrapper: {
    display: "flex",
    alignItems: "center",
    marginLeft: "38px",
    gap: "6px",
  },
  headerSub: {
    fontSize: "14px",
    color: "rgba(45, 59, 45, 0.45)",
    fontWeight: "500",
  },
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
