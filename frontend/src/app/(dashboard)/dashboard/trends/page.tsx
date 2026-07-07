"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { formatDate, getScoreColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Loader2, BarChart3, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const SCORE_KEYS = ["overall", "nutrition", "fitness", "sleep", "hydration", "heart_health", "lifestyle"];
const COLORS: Record<string, string> = {
  overall: "#22c55e", nutrition: "#84cc16", fitness: "#3b82f6",
  sleep: "#8b5cf6", hydration: "#06b6d4", heart_health: "#ef4444", lifestyle: "#f59e0b",
};

export default function TrendsPage() {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScore, setActiveScore] = useState("overall");

  useEffect(() => {
    api.get("/health/trends").then((res) => setTrends(res.data.trends || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  if (trends.length === 0) {
    return (
      <div className="glass-card p-16 text-center">
        <BarChart3 className="w-16 h-16 text-[#2D3B2D]/10 mx-auto mb-4" />
        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2D3B2D] mb-2">No Trends Yet</h3>
        <p className="text-[#2D3B2D]/40">Upload at least 2 reports to see your health trends over time</p>
      </div>
    );
  }

  const chartData = trends.map((t) => ({
    date: formatDate(t.date),
    ...SCORE_KEYS.reduce((acc, key) => ({ ...acc, [key]: t[key] }), {}),
  }));

  // Calculate changes
  const latest = trends[trends.length - 1];
  const previous = trends.length > 1 ? trends[trends.length - 2] : null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#2D3B2D]">Progress & Trends</h1>
        <p className="text-[#2D3B2D]/40 text-sm mt-1">Track your health scores over time</p>
      </div>

      {/* Score Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {SCORE_KEYS.map((key) => (
          <button key={key} onClick={() => setActiveScore(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${activeScore === key ? "bg-[#2D3B2D] text-white" : "bg-white/50 text-[#2D3B2D]/50 hover:bg-white/80"}`}
          >
            {key.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="font-semibold text-[#2D3B2D] mb-4 capitalize">{activeScore.replace(/_/g, " ")} Score Trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[activeScore] || "#22c55e"} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS[activeScore] || "#22c55e"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#2D3B2D80" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#2D3B2D80" }} />
              <Tooltip
                contentStyle={{ background: "rgba(255,255,255,0.9)", border: "1px solid #e8e0d8", borderRadius: "12px", fontSize: "13px" }}
              />
              <Area type="monotone" dataKey={activeScore} stroke={COLORS[activeScore] || "#22c55e"} strokeWidth={3} fill="url(#colorScore)" dot={{ fill: COLORS[activeScore] || "#22c55e", strokeWidth: 2, r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Score Changes Table */}
      {previous && (
        <div className="glass-card p-6">
          <h3 className="font-semibold text-[#2D3B2D] mb-4">Recent Changes</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SCORE_KEYS.map((key) => {
              const curr = latest[key];
              const prev = previous[key];
              if (!curr || !prev) return null;
              const delta = curr - prev;
              const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
              const color = delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-500" : "text-[#2D3B2D]/30";

              return (
                <div key={key} className="p-4 rounded-xl bg-white/40 border border-[#2D3B2D]/5">
                  <p className="text-xs text-[#2D3B2D]/40 capitalize mb-1">{key.replace(/_/g, " ")}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#2D3B2D]">{curr}</span>
                    <div className={`flex items-center gap-1 text-sm font-medium ${color}`}>
                      <Icon className="w-4 h-4" />
                      {delta > 0 ? "+" : ""}{delta}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm flex items-start gap-3">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>Trends are based on your analyzed reports. Upload more reports over time for better insights.</p>
      </div>
    </div>
  );
}
