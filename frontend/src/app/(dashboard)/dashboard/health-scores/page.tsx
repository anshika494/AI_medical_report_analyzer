"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { getScoreColor, getScoreLabel } from "@/lib/utils";
import { Heart, Apple, Activity, Moon, Droplets, Brain, Shield, TrendingUp, Sparkles, Loader2, Info } from "lucide-react";

const scoreConfig: Record<string, { icon: any; color: string; label: string }> = {
  overall: { icon: Sparkles, color: "from-emerald-400 to-green-600", label: "Overall Health" },
  nutrition: { icon: Apple, color: "from-lime-400 to-emerald-600", label: "Nutrition" },
  fitness: { icon: Activity, color: "from-blue-400 to-indigo-600", label: "Fitness" },
  sleep: { icon: Moon, color: "from-indigo-400 to-purple-600", label: "Sleep Quality" },
  hydration: { icon: Droplets, color: "from-cyan-400 to-blue-600", label: "Hydration" },
  mental_wellness: { icon: Brain, color: "from-violet-400 to-purple-600", label: "Mental Wellness" },
  heart_health: { icon: Heart, color: "from-rose-400 to-red-600", label: "Heart Health" },
  lifestyle: { icon: TrendingUp, color: "from-amber-400 to-orange-600", label: "Lifestyle" },
  risk_assessment: { icon: Shield, color: "from-slate-400 to-gray-600", label: "Risk Assessment" },
};

export default function HealthScoresPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/health/scores/latest").then((res) => setData(res.data)).catch(() => { }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  if (!data?.scores) {
    return (
      <div className="glass-card p-16 text-center">
        <Sparkles className="w-16 h-16 text-[#2D3B2D]/10 mx-auto mb-4" />
        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2D3B2D] mb-2">No Health Scores Yet</h3>
        <p className="text-[#2D3B2D]/40">Upload a medical report to generate your personalized health scores</p>
      </div>
    );
  }

  const scores = data.scores;

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#2D3B2D]">Your Health Scores</h1>
        <p className="text-[#2D3B2D]/40 text-sm mt-1">Based on your latest report analysis</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(scores).map(([key, data]: [string, any], i) => {
          const config = scoreConfig[key];
          if (!config) return null;
          const score = data?.score || 0;
          const circumference = 2 * Math.PI * 52;
          const strokeDash = (score / 100) * circumference;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6"
            >
              <div className="flex items-start gap-4">
                {/* Score Ring */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#e8e0d8" strokeWidth="8" />
                    <motion.circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={score >= 60 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444"}
                      strokeWidth="8" strokeLinecap="round"
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#2D3B2D]">{score}</span>
                    <span className="text-[9px] text-[#2D3B2D]/40">{getScoreLabel(score)}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                      <config.icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#2D3B2D] text-sm">{config.label}</h3>
                  </div>
                  <p className="text-xs text-[#2D3B2D]/50 leading-relaxed line-clamp-4">
                    {data?.explanation || "Score explanation pending"}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm flex items-start gap-3">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>These scores are AI-generated for educational purposes. Consult a healthcare professional for medical decisions.</p>
      </div>
    </div>
  );
}
