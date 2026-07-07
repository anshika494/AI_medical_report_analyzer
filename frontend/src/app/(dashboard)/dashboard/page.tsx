"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { getScoreColor, getScoreLabel, formatDate } from "@/lib/utils";
import { CellPattern, LeafDecoration } from "@/components/shared/Illustrations";
import {
  Upload, FileText, BarChart3, TrendingUp, Heart, Apple,
  Activity, Moon, Droplets, Brain, Shield, Sparkles, ArrowRight, ChevronRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const scoreIcons: Record<string, any> = {
  overall: Sparkles, nutrition: Apple, fitness: Activity, sleep: Moon,
  hydration: Droplets, mental_wellness: Brain, heart_health: Heart,
  lifestyle: TrendingUp, risk_assessment: Shield,
};

const scoreLabels: Record<string, string> = {
  overall: "Overall", nutrition: "Nutrition", fitness: "Fitness", sleep: "Sleep",
  hydration: "Hydration", mental_wellness: "Mental", heart_health: "Heart",
  lifestyle: "Lifestyle", risk_assessment: "Risk",
};

export default function DashboardPage() {
  const [scores, setScores] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/health/scores/latest").catch(() => ({ data: null })),
      api.get("/reports/").catch(() => ({ data: [] })),
    ]).then(([scoresRes, reportsRes]) => {
      setScores(scoresRes.data?.scores || null);
      setReports(reportsRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const latestScore = scores?.overall?.score;

  return (
    <div className="space-y-6">
      {/* Floating decorations */}
      <CellPattern className="fixed top-20 right-0 w-40 h-40 pointer-events-none opacity-5" />
      <LeafDecoration className="fixed bottom-10 right-10 w-24 h-24 pointer-events-none opacity-5" />

      {/* ===== Top Stats Row ===== */}
      <motion.div
        initial="hidden" animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Health Score", value: latestScore ? `${latestScore}` : "—", sub: latestScore ? getScoreLabel(latestScore) : "Upload a report", icon: Heart, color: "from-emerald-400 to-green-600" },
          { label: "Reports", value: reports.length.toString(), sub: "Total uploaded", icon: FileText, color: "from-blue-400 to-indigo-600" },
          { label: "Nutrition Score", value: scores?.nutrition?.score ? `${scores.nutrition.score}` : "—", sub: scores?.nutrition?.score ? getScoreLabel(scores.nutrition.score) : "Pending", icon: Apple, color: "from-amber-400 to-orange-500" },
          { label: "Fitness Score", value: scores?.fitness?.score ? `${scores.fitness.score}` : "—", sub: scores?.fitness?.score ? getScoreLabel(scores.fitness.score) : "Pending", icon: Activity, color: "from-violet-400 to-purple-600" },
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={fadeUp} custom={i} className="glass-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[#2D3B2D]/40 text-xs font-medium">{stat.label}</p>
              <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#2D3B2D]">{stat.value}</p>
              <p className="text-[#2D3B2D]/40 text-xs">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ===== Quick Upload ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2D3B2D] mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { href: "/dashboard/upload", icon: Upload, label: "Upload Report", desc: "Analyze a new report", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
                { href: "/dashboard/food-scanner", icon: Sparkles, label: "Scan Food", desc: "Analyze your meal", color: "bg-amber-50 text-amber-600 border-amber-200" },
                { href: "/dashboard/health-scores", icon: BarChart3, label: "View Scores", desc: "Check your health", color: "bg-blue-50 text-blue-600 border-blue-200" },
              ].map((action) => (
                <Link key={action.href} href={action.href}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-[#2D3B2D]/5 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl ${action.color} border flex items-center justify-center`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2D3B2D]">{action.label}</p>
                    <p className="text-xs text-[#2D3B2D]/40">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#2D3B2D]/20 ml-auto group-hover:text-emerald-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ===== Health Score Ring ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="glass-card p-6 text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2D3B2D] mb-4">Overall Health</h2>
            <div className="relative w-36 h-36 mx-auto mb-4">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e8e0d8" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke={latestScore ? (latestScore >= 60 ? "#22c55e" : latestScore >= 40 ? "#eab308" : "#ef4444") : "#e8e0d8"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(latestScore || 0) * 3.27} 327`}
                  className="score-ring"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#2D3B2D]">
                  {latestScore || "—"}
                </span>
                <span className="text-xs text-[#2D3B2D]/40 font-medium">
                  {latestScore ? getScoreLabel(latestScore) : "No data"}
                </span>
              </div>
            </div>
            {latestScore && (
              <Link href="/dashboard/health-scores" className="text-sm text-emerald-600 font-medium hover:underline inline-flex items-center gap-1">
                View all scores <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* ===== Recent Reports ===== */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2D3B2D]">Recent Reports</h2>
            <Link href="/dashboard/reports" className="text-sm text-emerald-600 font-medium hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-[#2D3B2D]/15 mx-auto mb-3" />
              <p className="text-[#2D3B2D]/40 mb-4">No reports uploaded yet</p>
              <Link href="/dashboard/upload" className="btn-primary text-sm !py-2.5 !px-6 rounded-xl inline-flex items-center gap-2">
                Upload Your First Report <Upload className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report: any) => (
                <Link key={report.id} href={`/dashboard/reports/${report.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-[#2D3B2D]/5 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2D3B2D]">{report.file_name}</p>
                      <p className="text-xs text-[#2D3B2D]/40">{formatDate(report.uploaded_at)} · {report.report_type || "General"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {report.overall_score && (
                      <span className={`text-sm font-bold ${getScoreColor(report.overall_score)}`}>
                        {report.overall_score}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-[#2D3B2D]/20 group-hover:text-emerald-500" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ===== Health Scores Mini Grid ===== */}
      {scores && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2D3B2D]">Your Health Scores</h2>
              <Link href="/dashboard/health-scores" className="text-sm text-emerald-600 font-medium hover:underline inline-flex items-center gap-1">
                Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
              {Object.entries(scores).map(([key, data]: [string, any]) => {
                const Icon = scoreIcons[key] || Sparkles;
                const score = data?.score;
                return (
                  <div key={key} className="text-center p-3 rounded-2xl bg-white/40 border border-[#2D3B2D]/5">
                    <Icon className={`w-5 h-5 mx-auto mb-1.5 ${score ? getScoreColor(score) : "text-[#2D3B2D]/20"}`} />
                    <p className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#2D3B2D]">{score || "—"}</p>
                    <p className="text-[10px] text-[#2D3B2D]/40 font-medium">{scoreLabels[key] || key}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
