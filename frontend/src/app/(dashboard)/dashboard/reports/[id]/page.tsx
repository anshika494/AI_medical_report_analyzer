"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { getScoreColor, getScoreLabel, getStatusColor, formatDate } from "@/lib/utils";
import {
  FileText, Heart, Apple, Activity, Moon, Droplets, Brain, Shield, TrendingUp,
  Sparkles, AlertTriangle, CheckCircle2, Info, Loader2, ArrowLeft
} from "lucide-react";
import Link from "next/link";

const scoreIcons: Record<string, any> = {
  overall: Sparkles, nutrition: Apple, fitness: Activity, sleep: Moon,
  hydration: Droplets, mental_wellness: Brain, heart_health: Heart,
  lifestyle: TrendingUp, risk_assessment: Shield,
};

export default function ReportDetailPage() {
  const params = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (params.id) {
      api.get(`/reports/${params.id}`).then((res) => setReport(res.data)).catch(() => { }).finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  if (!report) {
    return <div className="text-center py-20"><p className="text-[#2D3B2D]/40">Report not found</p></div>;
  }

  const analysis = report.analysis;
  const scores = analysis?.scores || {};
  const biomarkers = analysis?.biomarkers || {};
  const abnormals = analysis?.abnormal_values || [];
  const recs = analysis?.recommendations || {};

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "biomarkers", label: "Biomarkers" },
    { key: "scores", label: "Health Scores" },
    { key: "recommendations", label: "Recommendations" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/reports" className="p-2 rounded-xl hover:bg-white/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#2D3B2D]/50" />
        </Link>
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#2D3B2D]">{report.file_name}</h1>
          <p className="text-[#2D3B2D]/40 text-sm">{formatDate(report.uploaded_at)} · {report.report_type?.replace(/_/g, " ") || "General"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-white/40 border border-[#2D3B2D]/5 w-fit">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? "bg-white shadow-sm text-[#2D3B2D]" : "text-[#2D3B2D]/40 hover:text-[#2D3B2D]/60"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!analysis ? (
        <div className="glass-card p-12 text-center">
          <Info className="w-12 h-12 text-[#2D3B2D]/15 mx-auto mb-3" />
          <p className="text-[#2D3B2D]/40">Analysis is still processing. Please refresh in a moment.</p>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* AI Summary */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2D3B2D] mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-500" /> AI Health Summary
                </h2>
                <p className="text-[#2D3B2D]/70 leading-relaxed">{analysis.summary}</p>
              </motion.div>

              {/* Score Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                {Object.entries(scores).map(([key, data]: [string, any]) => {
                  const Icon = scoreIcons[key] || Sparkles;
                  const score = data?.score;
                  return (
                    <motion.div key={key} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="glass-card p-4 text-center"
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-2 ${score ? getScoreColor(score) : "text-[#2D3B2D]/20"}`} />
                      <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#2D3B2D]">{score || "—"}</p>
                      <p className="text-[10px] text-[#2D3B2D]/40 font-medium mt-1">{key.replace(/_/g, " ")}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Abnormal Values */}
              {abnormals.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2D3B2D] mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Values Needing Attention
                  </h2>
                  <div className="space-y-3">
                    {abnormals.map((item: any, i: number) => (
                      <div key={i} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#2D3B2D]">{item.name}</span>
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                            {item.value} — {item.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-[#2D3B2D]/60 mb-2">{item.explanation}</p>
                        <p className="text-xs text-[#2D3B2D]/40">Normal range: {item.normal_range}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm flex items-start gap-3">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{analysis.disclaimer}</p>
              </div>
            </div>
          )}

          {/* Biomarkers Tab */}
          {activeTab === "biomarkers" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2D3B2D]/10">
                      <th className="text-left p-4 font-medium text-[#2D3B2D]/50">Biomarker</th>
                      <th className="text-left p-4 font-medium text-[#2D3B2D]/50">Value</th>
                      <th className="text-left p-4 font-medium text-[#2D3B2D]/50">Reference Range</th>
                      <th className="text-left p-4 font-medium text-[#2D3B2D]/50">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(biomarkers).map(([key, data]: [string, any]) => (
                      <tr key={key} className="border-b border-[#2D3B2D]/5 hover:bg-white/30 transition-colors">
                        <td className="p-4 font-medium text-[#2D3B2D]">{data.name}</td>
                        <td className="p-4 text-[#2D3B2D]">{data.value} {data.unit}</td>
                        <td className="p-4 text-[#2D3B2D]/50">{data.reference_range?.min} – {data.reference_range?.max} {data.unit}</td>
                        <td className="p-4">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(data.status)}`}>
                            {data.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {Object.keys(biomarkers).length === 0 && (
                <div className="p-12 text-center text-[#2D3B2D]/40">No biomarkers extracted from this report</div>
              )}
            </motion.div>
          )}

          {/* Scores Tab */}
          {activeTab === "scores" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(scores).map(([key, data]: [string, any]) => {
                const Icon = scoreIcons[key] || Sparkles;
                const score = data?.score || 0;
                return (
                  <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${score >= 60 ? "bg-emerald-50" : score >= 40 ? "bg-yellow-50" : "bg-red-50"}`}>
                        <Icon className={`w-5 h-5 ${getScoreColor(score)}`} />
                      </div>
                      <div>
                        <p className="font-medium text-[#2D3B2D] capitalize">{key.replace(/_/g, " ")}</p>
                        <p className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}<span className="text-sm text-[#2D3B2D]/30">/100</span></p>
                      </div>
                    </div>
                    {/* Score bar */}
                    <div className="w-full h-2 rounded-full bg-[#2D3B2D]/5 mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${score >= 60 ? "bg-emerald-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                      />
                    </div>
                    <p className="text-sm text-[#2D3B2D]/50 leading-relaxed">{data?.explanation || "No explanation available"}</p>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <div className="space-y-6">
              {/* Do's & Don'ts */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card p-6">
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-emerald-600 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Do&apos;s
                  </h3>
                  <ul className="space-y-2.5">
                    {(recs.dos || []).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#2D3B2D]/70">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card p-6">
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-red-500 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Don&apos;ts
                  </h3>
                  <ul className="space-y-2.5">
                    {(recs.donts || []).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#2D3B2D]/70">
                        <AlertTriangle className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Foods */}
              {recs.foods_to_eat && (
                <div className="glass-card p-6">
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2D3B2D] mb-4">🥗 Foods to Eat More</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {recs.foods_to_eat.map((food: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                        <p className="font-medium text-[#2D3B2D] text-sm">{food.name}</p>
                        <p className="text-xs text-[#2D3B2D]/50 mt-1">{food.benefit}</p>
                        {food.portion && <p className="text-xs text-emerald-600 mt-1">📏 {food.portion}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meal Plan */}
              {recs.daily_meal_plan && (
                <div className="glass-card p-6">
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2D3B2D] mb-4">🍽️ Daily Meal Plan</h3>
                  <div className="space-y-3">
                    {Object.entries(recs.daily_meal_plan).map(([meal, data]: [string, any]) => (
                      <div key={meal} className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-[#2D3B2D]/5">
                        <div>
                          <p className="text-sm font-medium text-[#2D3B2D] capitalize">{meal.replace(/_/g, " ")}</p>
                          <p className="text-xs text-[#2D3B2D]/50 mt-1">{data.meal || data}</p>
                        </div>
                        {data.calories && <span className="text-xs font-bold text-emerald-600">{data.calories} cal</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm flex items-start gap-3">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{analysis.disclaimer}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
