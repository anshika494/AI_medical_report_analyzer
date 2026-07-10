"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";
import { formatDate, getScoreColor, getScoreLabel } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Loader2, BarChart3, Info, Upload, FileText } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";

const SCORE_KEYS = ["overall", "nutrition", "fitness", "sleep", "hydration", "heart_health", "lifestyle"];
const COLORS: Record<string, string> = {
  overall: "#22c55e", nutrition: "#84cc16", fitness: "#3b82f6",
  sleep: "#8b5cf6", hydration: "#06b6d4", heart_health: "#ef4444", lifestyle: "#f59e0b",
};
const LABELS: Record<string, string> = {
  overall: "Overall", nutrition: "Nutrition", fitness: "Fitness",
  sleep: "Sleep", hydration: "Hydration", heart_health: "Heart", lifestyle: "Lifestyle",
};

import { Footer } from "@/components/layout/Footer";

// Mock StyleSheet helper similar to React Native
const StyleSheet = {
  create<T extends Record<string, React.CSSProperties>>(styles: T): T {
    return styles;
  }
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-[#2D3B2D]/10 rounded-xl p-3 shadow-lg">
        <p className="text-xs font-semibold text-[#2D3B2D]/50 mb-1.5">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-xs font-bold text-[#2D3B2D]">{p.value}</span>
            <span className="text-xs text-[#2D3B2D]/40 capitalize">{LABELS[p.dataKey] || p.dataKey}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScore, setActiveScore] = useState("overall");

  useEffect(() => {
    api.get("/health/trends")
      .then((res) => setTrends(res.data.trends || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-3" />
          <p className="text-[#2D3B2D]/40 text-sm">Loading trends…</p>
        </div>
      </div>
    );
  }

  const chartData = trends.map((t) => ({
    date: formatDate(t.date),
    ...SCORE_KEYS.reduce((acc, key) => ({ ...acc, [key]: t[key] }), {}),
  }));

  const latest = trends[trends.length - 1];
  const previous = trends.length > 1 ? trends[trends.length - 2] : null;
  const activeColor = COLORS[activeScore] || "#22c55e";
  const latestScore = latest?.[activeScore];

  return (
    <div style={styles.pageWrapper}>
      {/* ── Page Header ───────────────────────────────────────── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.headerTitleWrapper}>
            <TrendingUp className="w-7 h-7 text-emerald-600" />
            <h1 style={styles.headerTitle}>Progress & Trends</h1>
          </div>
          <div style={styles.headerSubWrapper}>
            <FileText style={{ width: 14, height: 14, color: "rgba(45,59,45,0.45)" }} />
            <span style={styles.headerSub}>
              {trends.length === 0
                ? "No data tracked yet"
                : `${trends.length} data point${trends.length !== 1 ? "s" : ""} tracked`}
            </span>
          </div>
        </div>
      </div>

      {trends.length === 0 ? (
        <div style={styles.emptyStateCard}>
          <BarChart3 style={{ width: 56, height: 56, color: "rgba(45,59,45,0.25)", margin: "0 auto 16px" }} />
          <h3 style={styles.emptyTitle}>No Trends Yet</h3>
          <p style={styles.emptyDesc}>
            Upload at least 2 medical reports to start seeing your health score trends over time.
          </p>
          <Link href="/dashboard/upload" className="btn-primary mt-6 inline-flex items-center gap-2" style={{ width: "fit-content", margin: "24px auto 0" }}>
            <Upload className="w-4 h-4" /> Upload a Report
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ===== active details ===== */}
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeColor }} />
                <h2 className="font-semibold text-lg text-[#2D3B2D] capitalize">
                  {LABELS[activeScore]} Progress
                </h2>
              </div>
              {latestScore && (
                <div className="inline-flex items-center gap-3">
                  <span className="text-[#2D3B2D]/40 text-xs font-semibold uppercase tracking-wider">Latest Score</span>
                  <span className={`font-[family-name:var(--font-playfair)] text-3xl font-bold ${getScoreColor(latestScore)}`}>
                    {latestScore}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    latestScore >= 80 ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : latestScore >= 60 ? "bg-lime-50 text-lime-600 border border-lime-100"
                    : latestScore >= 40 ? "bg-yellow-50 text-yellow-600 border border-yellow-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                  }`}>
                    {getScoreLabel(latestScore)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ===== Main Chart Card ===== */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            {/* Metric Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {SCORE_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveScore(key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide capitalize border transition-all duration-200 cursor-pointer ${
                    activeScore === key
                      ? "bg-white border-[#2D3B2D] text-[#2D3B2D] shadow-sm"
                      : "bg-[#2D3B2D]/[0.02] border-transparent text-[#2D3B2D]/45 hover:bg-[#2D3B2D]/[0.05] hover:text-[#2D3B2D]/70"
                  }`}
                >
                  {LABELS[key] || key.replace(/_/g, " ")}
                </button>
              ))}
            </div>

            {/* Chart Container */}
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeColor} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={activeColor} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 59, 45, 0.04)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(45, 59, 45, 0.45)", fontSize: 11, fontWeight: "600" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(45, 59, 45, 0.45)", fontSize: 11, fontWeight: "600" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={60} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <Area
                    type="monotone"
                    dataKey={activeScore}
                    stroke={activeColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorActive)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-[#2D3B2D]/35 mt-3 text-center">
              — Green dashed line marks the "Good" threshold (60+)
            </p>
          </motion.div>

          {/* ===== Changes Since Last Report ===== */}
          {previous && (
            <div className="glass-card p-6">
              <h3 className="section-title mb-5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Change Since Last Report
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {SCORE_KEYS.map((key) => {
                  const curr = latest[key];
                  const prev = previous[key];
                  if (!curr || !prev) return null;
                  const delta = curr - prev;
                  const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
                  const deltaColor = delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-500" : "text-[#2D3B2D]/30";
                  const deltaBg = delta > 0 ? "bg-emerald-50 border-emerald-100" : delta < 0 ? "bg-red-50 border-red-100" : "bg-[#2D3B2D]/[0.03] border-[#2D3B2D]/8";

                  return (
                    <div key={key} className={`p-3.5 rounded-xl border text-center ${deltaBg}`}>
                      <p className="text-[11px] text-[#2D3B2D]/45 font-medium capitalize mb-2">
                        {LABELS[key] || key.replace(/_/g, " ")}
                      </p>
                      <p className={`font-[family-name:var(--font-playfair)] text-2xl font-bold ${getScoreColor(curr)}`}>
                        {curr}
                      </p>
                      <div className={`flex items-center justify-center gap-1 mt-1.5 text-xs font-semibold ${deltaColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{delta > 0 ? "+" : ""}{delta}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-[#2D3B2D]/35 mt-4">
                Comparing <span className="font-medium">{formatDate(latest.date)}</span> vs <span className="font-medium">{formatDate(previous.date)}</span>
              </p>
            </div>
          )}

          {/* ===== Disclaimer ===== */}
          <div className="info-banner">
            <Info className="w-4 h-4" />
            <p>Trends are based on your analyzed reports. Upload more reports regularly for richer health insights over time.</p>
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
