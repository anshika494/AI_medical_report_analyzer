"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";
import {
  Loader2, Heart, Info, Upload, CheckCircle2, AlertTriangle,
  Apple, Salad, Ban, UtensilsCrossed, Bed, Activity, Flame, Sun, FileText, Sparkles
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";

// Mock StyleSheet helper similar to React Native
const StyleSheet = {
  create<T extends Record<string, React.CSSProperties>>(styles: T): T {
    return styles;
  }
};

export default function RecommendationsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("diet");

  useEffect(() => {
    api.get("/reports/").then(async (res) => {
      const reports = res.data;
      if (reports.length > 0 && reports[0].has_analysis) {
        const detail = await api.get(`/reports/${reports[0].id}`);
        setData(detail.data.analysis);
      }
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-3" />
          <p className="text-[#2D3B2D]/40 text-sm">Loading recommendations…</p>
        </div>
      </div>
    );
  }

  const recs = data?.recommendations || {};
  const workout = data?.workout_plan || {};
  const lifestyle = data?.lifestyle_advice || {};

  const tabs = [
    { key: "diet", label: "Diet & Nutrition", emoji: "🥗" },
    { key: "exercise", label: "Exercise", emoji: "🏃" },
    { key: "lifestyle", label: "Lifestyle", emoji: "🌙" },
  ];

  return (
    <div style={styles.pageWrapper}>
      {/* ── Page Header ───────────────────────────────────────── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.headerTitleWrapper}>
            <Heart className="w-7 h-7 text-emerald-600" />
            <h1 style={styles.headerTitle}>Recommendations</h1>
          </div>
          <div style={styles.headerSubWrapper}>
            <FileText style={{ width: 14, height: 14, color: "rgba(45,59,45,0.45)" }} />
            <span style={styles.headerSub}>
              {!data
                ? "No recommendations generated yet"
                : "Personalized advice based on your reports"}
            </span>
          </div>
        </div>
      </div>

      {!data ? (
        <div style={styles.emptyStateCard}>
          <Heart style={{ width: 56, height: 56, color: "rgba(45,59,45,0.25)", margin: "0 auto 16px" }} />
          <h3 style={styles.emptyTitle}>No Recommendations Yet</h3>
          <p style={styles.emptyDesc}>
            Upload and analyze a medical report to get personalized diet, exercise, and lifestyle recommendations.
          </p>
          <Link href="/dashboard/upload" className="btn-primary mt-6 inline-flex items-center gap-2" style={{ width: "fit-content", margin: "24px auto 0" }}>
            <Upload className="w-4 h-4" /> Upload a Report
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ===== Tabs ===== */}
          <div className="tabs-container">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`tab-btn ${tab === t.key ? "active" : ""}`}
              >
                <span className="mr-1.5">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* ===== Tab Content ===== */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {tab === "diet" && (
                <>
                  {/* Do's & Don'ts */}
                  {(recs.dos?.length > 0 || recs.donts?.length > 0) && (
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="glass-card p-6">
                        <h3 className="section-title mb-4 text-emerald-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Recommended Do's
                        </h3>
                        <ul className="space-y-3">
                          {(recs.dos || []).map((d: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-[#2D3B2D]/70">
                              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              </div>
                              <span className="leading-relaxed">{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="glass-card p-6">
                        <h3 className="section-title mb-4 text-red-500">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          Things to Avoid
                        </h3>
                        <ul className="space-y-3">
                          {(recs.donts || []).map((d: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-[#2D3B2D]/70">
                              <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <AlertTriangle className="w-3 h-3 text-red-400" />
                              </div>
                              <span className="leading-relaxed">{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Beneficial Foods */}
                  {recs.foods_to_eat?.length > 0 && (
                    <div className="glass-card p-6">
                      <h3 className="section-title mb-4">
                        <span className="text-base">🥦</span>
                        Beneficial Foods
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {recs.foods_to_eat.map((f: any, i: number) => (
                          <div key={i} className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50 transition-colors">
                            <div className="flex items-start gap-2 mb-1.5">
                              <span className="text-lg leading-none">🌿</span>
                              <p className="font-semibold text-[#2D3B2D] text-sm">{f.name}</p>
                            </div>
                            <p className="text-xs text-[#2D3B2D]/55 leading-relaxed">{f.benefit}</p>
                            {f.portion && (
                              <p className="text-xs text-emerald-600 font-medium mt-2">📏 {f.portion}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {tab === "exercise" && (
                <>
                  {/* Workout Strategy */}
                  <div className="glass-card p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <h3 className="section-title mb-3">
                          <span className="text-base">🏋️</span> Exercise Strategy
                        </h3>
                        <p className="text-sm text-[#2D3B2D]/70 leading-relaxed">
                          {workout.strategy || "Custom physical activity roadmap."}
                        </p>
                      </div>
                      <div className="flex gap-4 flex-wrap md:flex-nowrap">
                        {[
                          { label: "Weekly Sessions", val: workout.weekly_sessions, unit: "sessions", icon: Activity },
                          { label: "Session Duration", val: workout.session_duration, unit: "mins", icon: Flame },
                        ].map((stat) => (
                          <div key={stat.label} className="p-4 rounded-xl bg-[#2D3B2D]/4 border border-[#2D3B2D]/8 min-w-[140px]">
                            <div className="flex items-center gap-2 mb-1.5 text-[#2D3B2D]/40">
                              <stat.icon className="w-4 h-4" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                            </div>
                            <span className="text-2xl font-bold text-[#2D3B2D]">{stat.val || "—"}</span>
                            <span className="text-xs text-[#2D3B2D]/50 block mt-0.5">{stat.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Workout Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Cardio */}
                    <div className="glass-card p-6">
                      <h3 className="section-title mb-4">
                        <span className="text-base">🏃</span> Cardiovascular Plan
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs text-[#2D3B2D]/45 font-bold uppercase tracking-wider block mb-1">Type</span>
                          <p className="text-sm text-[#2D3B2D] font-medium">{workout.cardio_type || "Aerobic focus"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-[#2D3B2D]/45 font-bold uppercase tracking-wider block mb-1">Frequency</span>
                          <p className="text-sm text-[#2D3B2D] font-medium">{workout.cardio_frequency || "3x per week"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-[#2D3B2D]/45 font-bold uppercase tracking-wider block mb-1">Intensity</span>
                          <p className="text-sm text-[#2D3B2D]/70 leading-relaxed">{workout.cardio_intensity || "Moderate pace"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Strength */}
                    <div className="glass-card p-6">
                      <h3 className="section-title mb-4">
                        <span className="text-base">💪</span> Strength Training
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs text-[#2D3B2D]/45 font-bold uppercase tracking-wider block mb-1">Focus</span>
                          <p className="text-sm text-[#2D3B2D] font-medium">{workout.strength_focus || "Hypertrophy/Endurance"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-[#2D3B2D]/45 font-bold uppercase tracking-wider block mb-1">Frequency</span>
                          <p className="text-sm text-[#2D3B2D] font-medium">{workout.strength_frequency || "2-3x per week"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-[#2D3B2D]/45 font-bold uppercase tracking-wider block mb-1">Format</span>
                          <p className="text-sm text-[#2D3B2D]/70 leading-relaxed">{workout.strength_format || "Full body splits"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {tab === "lifestyle" && (
                <>
                  {/* Lifestyle strategy */}
                  <div className="glass-card p-6">
                    <h3 className="section-title mb-3">
                      <span className="text-base">🌙</span> Lifestyle Adjustments
                    </h3>
                    <p className="text-sm text-[#2D3B2D]/70 leading-relaxed">
                      {lifestyle.strategy || "Personalized wellness optimizations."}
                    </p>
                  </div>

                  {/* Sleep & Sun */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card p-6">
                      <h3 className="section-title mb-4">
                        <Bed className="w-4 h-4 text-indigo-500" />
                        Sleep Optimization
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs text-[#2D3B2D]/45 font-bold uppercase tracking-wider block mb-1">Target Hours</span>
                          <p className="text-sm text-[#2D3B2D] font-medium">{lifestyle.sleep_target || "7.5 - 8 hours/night"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-[#2D3B2D]/45 font-bold uppercase tracking-wider block mb-1">Advice</span>
                          <p className="text-sm text-[#2D3B2D]/70 leading-relaxed">{lifestyle.sleep_advice || "Establish regular wake times."}</p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <h3 className="section-title mb-4">
                        <Sun className="w-4 h-4 text-amber-500" />
                        Sun & Vitamin D
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs text-[#2D3B2D]/45 font-bold uppercase tracking-wider block mb-1">Target Exposure</span>
                          <p className="text-sm text-[#2D3B2D] font-medium">{lifestyle.sun_exposure_target || "15-20 minutes daily"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-[#2D3B2D]/45 font-bold uppercase tracking-wider block mb-1">Details</span>
                          <p className="text-sm text-[#2D3B2D]/70 leading-relaxed">{lifestyle.sun_exposure_advice || "Mid-morning exposure."}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Healthy Habits */}
                  {lifestyle.healthy_habits?.length > 0 && (
                    <div className="glass-card p-6">
                      <h3 className="section-title mb-4">
                        <span className="text-base">🌿</span>
                        Healthy Habits to Build
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {lifestyle.healthy_habits.map((h: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            </div>
                            <p className="text-sm text-[#2D3B2D]/70 leading-relaxed">{h}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ===== Disclaimer ===== */}
          <div className="info-banner">
            <Info className="w-4 h-4" />
            <p>
              These recommendations are AI-generated for educational purposes only. Always consult a qualified healthcare professional before making changes to your diet or exercise routine.
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
    minHeight: "calc(100vh - 64px - 64px)",  // viewport minus topbar minus layout padding
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
