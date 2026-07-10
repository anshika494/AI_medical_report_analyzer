"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { getScoreColor, getScoreLabel, getStatusColor, formatDate } from "@/lib/utils";
import {
  FileText, Heart, Apple, Activity, Moon, Droplets, Brain, Shield, TrendingUp,
  Sparkles, AlertTriangle, CheckCircle2, Info, Loader2, ArrowLeft, ChevronDown
} from "lucide-react";
import Link from "next/link";

const scoreIcons: Record<string, any> = {
  overall: Sparkles, nutrition: Apple, fitness: Activity, sleep: Moon,
  hydration: Droplets, mental_wellness: Brain, heart_health: Heart,
  lifestyle: TrendingUp, risk_assessment: Shield,
};

const scoreConfig: Record<string, { label: string; gradient: string }> = {
  overall: { label: "Overall Health", gradient: "from-emerald-400 to-green-600" },
  nutrition: { label: "Nutrition", gradient: "from-lime-400 to-emerald-600" },
  fitness: { label: "Fitness", gradient: "from-blue-400 to-indigo-600" },
  sleep: { label: "Sleep Quality", gradient: "from-indigo-400 to-purple-600" },
  hydration: { label: "Hydration", gradient: "from-cyan-400 to-blue-600" },
  mental_wellness: { label: "Mental Wellness", gradient: "from-violet-400 to-purple-600" },
  heart_health: { label: "Heart Health", gradient: "from-rose-400 to-red-600" },
  lifestyle: { label: "Lifestyle", gradient: "from-amber-400 to-orange-600" },
  risk_assessment: { label: "Risk Assessment", gradient: "from-slate-400 to-gray-600" },
};

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "biomarkers", label: "Biomarkers" },
  { key: "scores", label: "Health Scores" },
  { key: "recommendations", label: "Recommendations" },
];

export default function ReportDetailPage() {
  const params = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (params.id) {
      api.get(`/reports/${params.id}`)
        .then((res) => setReport(res.data))
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-3" />
          <p className="text-[#2D3B2D]/40 text-sm">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="glass-card">
        <div className="empty-state">
          <FileText className="empty-state-icon w-12 h-12" />
          <p className="empty-state-title">Report not found</p>
          <p className="empty-state-desc">This report may have been deleted or the link is invalid.</p>
          <Link href="/dashboard/reports" className="btn-secondary mt-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  const analysis = report.analysis;
  const scores = analysis?.scores || {};
  const biomarkers = analysis?.biomarkers || {};
  const abnormals = analysis?.abnormal_values || [];
  const recs = analysis?.recommendations || {};

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-start gap-3">
        <Link
          href="/dashboard/reports"
          className="p-2 rounded-xl hover:bg-white/60 border border-[#2D3B2D]/8 transition-colors flex-shrink-0 mt-0.5"
        >
          <ArrowLeft className="w-4 h-4 text-[#2D3B2D]/50" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-[#2D3B2D] truncate">
            {report.file_name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs text-[#2D3B2D]/40">{formatDate(report.uploaded_at)}</span>
            {report.report_type && (
              <span className="badge badge-success text-xs">{report.report_type.replace(/_/g, " ")}</span>
            )}
            {report.has_analysis ? (
              <span className="badge badge-success text-xs">
                <CheckCircle2 className="w-3 h-3" /> Analyzed
              </span>
            ) : (
              <span className="badge badge-warning text-xs">Pending Analysis</span>
            )}
          </div>
        </div>
        {/* Overall score pill */}
        {analysis?.scores?.overall?.score && (
          <div className={`flex-shrink-0 px-4 py-2 rounded-2xl text-center hidden sm:block ${
            analysis.scores.overall.score >= 80 ? "bg-emerald-50 border border-emerald-200" :
            analysis.scores.overall.score >= 60 ? "bg-lime-50 border border-lime-200" :
            "bg-yellow-50 border border-yellow-200"
          }`}>
            <p className={`text-2xl font-bold font-[family-name:var(--font-playfair)] ${getScoreColor(analysis.scores.overall.score)}`}>
              {analysis.scores.overall.score}
            </p>
            <p className="text-[10px] text-[#2D3B2D]/40 font-medium">Overall</p>
          </div>
        )}
      </div>

      {/* ===== Tabs ===== */}
      <div className="overflow-x-auto">
        <div className="tabs-container min-w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== No Analysis ===== */}
      {!analysis ? (
        <div className="glass-card">
          <div className="empty-state">
            <Info className="empty-state-icon w-12 h-12" />
            <p className="empty-state-title">Analysis Pending</p>
            <p className="empty-state-desc">Your report is still being processed. Please refresh in a moment.</p>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* ===== Overview Tab ===== */}
            {activeTab === "overview" && (
              <div className="space-y-5">
                {/* AI Summary */}
                <div className="glass-card p-6">
                  <h2 className="section-title mb-4">
                    <Brain className="w-4 h-4 text-emerald-500" />
                    AI Health Summary
                  </h2>
                  <p className="text-[#2D3B2D]/70 leading-relaxed text-sm">{analysis.summary}</p>
                </div>

                {/* Score Mini Grid */}
                <div>
                  <h3 className="text-sm font-semibold text-[#2D3B2D]/50 uppercase tracking-wider mb-3 px-1">
                    Health Scores at a Glance
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2.5">
                    {Object.entries(scores).map(([key, data]: [string, any], i) => {
                      const Icon = scoreIcons[key] || Sparkles;
                      const score = data?.score;
                      const cfg = scoreConfig[key];
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setActiveTab("scores")}
                          className="glass-card p-3 text-center cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/40 transition-all"
                        >
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cfg?.gradient || "from-gray-400 to-gray-600"} flex items-center justify-center mx-auto mb-2`}>
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <p className={`font-[family-name:var(--font-playfair)] text-lg font-bold ${score ? getScoreColor(score) : "text-[#2D3B2D]/20"}`}>
                            {score || "—"}
                          </p>
                          <p className="text-[10px] text-[#2D3B2D]/40 font-medium leading-tight mt-0.5">
                            {cfg?.label?.split(" ")[0] || key}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Abnormal Values */}
                {abnormals.length > 0 && (
                  <div className="glass-card p-6">
                    <h2 className="section-title mb-4">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Values Needing Attention
                      <span className="ml-auto badge badge-warning text-xs">{abnormals.length}</span>
                    </h2>
                    <div className="space-y-3">
                      {abnormals.map((item: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl border border-amber-200/60 bg-amber-50/40">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <span className="font-semibold text-[#2D3B2D] text-sm">{item.name}</span>
                            <span className={`badge text-xs flex-shrink-0 ${getStatusColor(item.status)}`}>
                              {item.value} · {item.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-[#2D3B2D]/60 leading-relaxed mb-1.5">{item.explanation}</p>
                          <p className="text-xs text-[#2D3B2D]/40">
                            Normal range: <span className="font-medium">{item.normal_range}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="info-banner">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <p>{analysis.disclaimer}</p>
                </div>
              </div>
            )}

            {/* ===== Biomarkers Tab ===== */}
            {activeTab === "biomarkers" && (
              <div className="glass-card overflow-hidden">
                {Object.keys(biomarkers).length === 0 ? (
                  <div className="empty-state">
                    <FileText className="empty-state-icon w-12 h-12" />
                    <p className="empty-state-title">No biomarkers extracted</p>
                    <p className="empty-state-desc">The report did not contain identifiable biomarker data.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Biomarker</th>
                          <th>Your Value</th>
                          <th className="hidden sm:table-cell">Reference Range</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(biomarkers).map(([key, data]: [string, any]) => (
                          <tr key={key}>
                            <td>
                              <span className="font-semibold text-[#2D3B2D] text-sm">{data.name}</span>
                            </td>
                            <td>
                              <span className="text-sm font-medium text-[#2D3B2D]">
                                {data.value}
                                <span className="text-[#2D3B2D]/40 ml-1 font-normal">{data.unit}</span>
                              </span>
                            </td>
                            <td className="hidden sm:table-cell">
                              <span className="text-sm text-[#2D3B2D]/50">
                                {data.reference_range?.min} – {data.reference_range?.max}{" "}
                                <span className="text-[#2D3B2D]/30">{data.unit}</span>
                              </span>
                            </td>
                            <td>
                              <span className={`badge text-xs ${getStatusColor(data.status)}`}>
                                {data.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ===== Health Scores Tab ===== */}
            {activeTab === "scores" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(scores).map(([key, data]: [string, any], i) => {
                  const Icon = scoreIcons[key] || Sparkles;
                  const score = data?.score || 0;
                  const cfg = scoreConfig[key];
                  const circumference = 2 * Math.PI * 48;
                  const strokeDash = (score / 100) * circumference;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {/* Mini score ring */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                            <circle cx="60" cy="60" r="48" fill="none" stroke="#e8e0d8" strokeWidth="8" />
                            <motion.circle
                              cx="60" cy="60" r="48" fill="none"
                              stroke={score >= 80 ? "#22c55e" : score >= 60 ? "#84cc16" : score >= 40 ? "#eab308" : "#ef4444"}
                              strokeWidth="8"
                              strokeLinecap="round"
                              initial={{ strokeDasharray: `0 ${circumference}` }}
                              animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
                              transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.08 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`font-[family-name:var(--font-playfair)] text-xl font-bold ${getScoreColor(score)}`}>
                              {score}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg?.gradient || "from-gray-400 to-gray-600"} flex items-center justify-center mb-2`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-[#2D3B2D] text-sm leading-tight">{cfg?.label || key.replace(/_/g, " ")}</h3>
                          <p className={`text-xs font-medium mt-0.5 ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 rounded-full bg-[#2D3B2D]/6 mb-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: i * 0.08 }}
                          className={`h-full rounded-full ${score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-lime-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                        />
                      </div>
                      <p className="text-xs text-[#2D3B2D]/55 leading-relaxed line-clamp-3">
                        {data?.explanation || "Score explanation pending."}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ===== Recommendations Tab ===== */}
            {activeTab === "recommendations" && (
              <div className="space-y-5">
                {/* Do's & Don'ts */}
                {(recs.dos?.length > 0 || recs.donts?.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="glass-card p-6">
                      <h3 className="section-title mb-4 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Do&apos;s
                      </h3>
                      <ul className="space-y-2.5">
                        {(recs.dos || []).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[#2D3B2D]/70">
                            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass-card p-6">
                      <h3 className="section-title mb-4 text-red-500">
                        <AlertTriangle className="w-4 h-4" />
                        Don&apos;ts
                      </h3>
                      <ul className="space-y-2.5">
                        {(recs.donts || []).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[#2D3B2D]/70">
                            <div className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Foods to eat */}
                {recs.foods_to_eat?.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="section-title mb-4">
                      <span className="text-base">🥗</span>
                      Foods to Eat More
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {recs.foods_to_eat.map((food: any, i: number) => (
                        <div key={i} className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                          <p className="font-semibold text-[#2D3B2D] text-sm">{food.name}</p>
                          <p className="text-xs text-[#2D3B2D]/50 mt-1 leading-relaxed">{food.benefit}</p>
                          {food.portion && (
                            <p className="text-xs text-emerald-600 mt-2 font-medium">📏 {food.portion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Daily meal plan */}
                {recs.daily_meal_plan && (
                  <div className="glass-card p-6">
                    <h3 className="section-title mb-4">
                      <span className="text-base">🍽️</span>
                      Daily Meal Plan
                    </h3>
                    <div className="space-y-2.5">
                      {Object.entries(recs.daily_meal_plan).map(([meal, data]: [string, any]) => (
                        <div key={meal} className="flex items-center justify-between p-3.5 rounded-xl bg-white/50 border border-[#2D3B2D]/5">
                          <div>
                            <p className="text-sm font-semibold text-[#2D3B2D] capitalize">{meal.replace(/_/g, " ")}</p>
                            <p className="text-xs text-[#2D3B2D]/50 mt-0.5">{data.meal || data}</p>
                          </div>
                          {data.calories && (
                            <span className="badge badge-success text-xs ml-3 flex-shrink-0">
                              {data.calories} cal
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="info-banner">
                  <Info className="w-4 h-4" />
                  <p>{analysis.disclaimer}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
