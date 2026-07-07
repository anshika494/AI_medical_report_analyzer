"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Loader2, Heart, Info } from "lucide-react";

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

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  if (!data) {
    return (
      <div className="glass-card p-16 text-center">
        <Heart className="w-16 h-16 text-[#2D3B2D]/10 mx-auto mb-4" />
        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2D3B2D] mb-2">No Recommendations Yet</h3>
        <p className="text-[#2D3B2D]/40">Upload and analyze a report to get personalized recommendations</p>
      </div>
    );
  }

  const recs = data.recommendations || {};
  const workout = data.workout_plan || {};
  const lifestyle = data.lifestyle_advice || {};

  const tabs = [
    { key: "diet", label: "🥗 Diet & Nutrition" },
    { key: "exercise", label: "🏃 Exercise" },
    { key: "lifestyle", label: "🌙 Lifestyle" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#2D3B2D]">Personalized Recommendations</h1>
        <p className="text-[#2D3B2D]/40 text-sm mt-1">Based on your latest health analysis</p>
      </div>

      <div className="flex gap-1 p-1 rounded-2xl bg-white/40 border border-[#2D3B2D]/5 w-fit mx-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? "bg-white shadow-sm text-[#2D3B2D]" : "text-[#2D3B2D]/40 hover:text-[#2D3B2D]/60"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        {tab === "diet" && (
          <>
            {recs.dos && recs.donts && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-emerald-600 mb-3">✅ Do&apos;s</h3>
                  <ul className="space-y-2">{recs.dos.map((d: string, i: number) => <li key={i} className="text-sm text-[#2D3B2D]/70 flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span>{d}</li>)}</ul>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-red-500 mb-3">❌ Don&apos;ts</h3>
                  <ul className="space-y-2">{recs.donts.map((d: string, i: number) => <li key={i} className="text-sm text-[#2D3B2D]/70 flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>{d}</li>)}</ul>
                </div>
              </div>
            )}

            {recs.foods_to_eat && (
              <div className="glass-card p-6">
                <h3 className="font-semibold text-[#2D3B2D] mb-4">🥦 Foods to Eat More</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recs.foods_to_eat.map((f: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <p className="font-medium text-sm text-[#2D3B2D]">{f.name}</p>
                      <p className="text-xs text-[#2D3B2D]/50 mt-1">{f.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recs.foods_to_avoid && (
              <div className="glass-card p-6">
                <h3 className="font-semibold text-[#2D3B2D] mb-4">🚫 Foods to Avoid</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recs.foods_to_avoid.map((f: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-red-50/50 border border-red-100">
                      <p className="font-medium text-sm text-[#2D3B2D]">{f.name}</p>
                      <p className="text-xs text-[#2D3B2D]/50 mt-1">{f.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recs.daily_meal_plan && (
              <div className="glass-card p-6">
                <h3 className="font-semibold text-[#2D3B2D] mb-4">🍽️ Daily Meal Plan</h3>
                <div className="space-y-3">
                  {Object.entries(recs.daily_meal_plan).map(([meal, info]: [string, any]) => (
                    <div key={meal} className="p-4 rounded-xl bg-white/40 border border-[#2D3B2D]/5 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#2D3B2D] text-sm capitalize">{meal.replace(/_/g, " ")}</p>
                        <p className="text-xs text-[#2D3B2D]/50 mt-1">{info.meal || info}</p>
                      </div>
                      {info.calories && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{info.calories} cal</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === "exercise" && (
          <>
            {Object.entries(workout).map(([type, info]: [string, any]) => (
              <div key={type} className="glass-card p-6">
                <h3 className="font-semibold text-[#2D3B2D] mb-3 capitalize">🏋️ {type}</h3>
                {info.goal && <p className="text-sm text-[#2D3B2D]/70 mb-2"><strong>Goal:</strong> {info.goal}</p>}
                {info.duration && <p className="text-sm text-[#2D3B2D]/70 mb-2"><strong>Duration:</strong> {info.duration}</p>}
                {info.frequency && <p className="text-sm text-[#2D3B2D]/70 mb-2"><strong>Frequency:</strong> {info.frequency}</p>}
                {info.exercises && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {info.exercises.map((ex: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-200">{ex}</span>
                    ))}
                  </div>
                )}
                {info.poses && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {info.poses.map((p: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs border border-purple-200">{p}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {tab === "lifestyle" && (
          <>
            {lifestyle.sleep_schedule && (
              <div className="glass-card p-6">
                <h3 className="font-semibold text-[#2D3B2D] mb-3">🌙 Sleep Schedule</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-center">
                    <p className="text-2xl font-bold text-indigo-600">{lifestyle.sleep_schedule.bedtime}</p>
                    <p className="text-xs text-[#2D3B2D]/40 mt-1">Bedtime</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-center">
                    <p className="text-2xl font-bold text-amber-600">{lifestyle.sleep_schedule.wake_time}</p>
                    <p className="text-xs text-[#2D3B2D]/40 mt-1">Wake Time</p>
                  </div>
                </div>
              </div>
            )}

            {lifestyle.stress_management && (
              <div className="glass-card p-6">
                <h3 className="font-semibold text-[#2D3B2D] mb-3">🧘 Stress Management</h3>
                <ul className="space-y-2">{lifestyle.stress_management.map((t: string, i: number) => <li key={i} className="text-sm text-[#2D3B2D]/70 flex items-start gap-2"><span className="text-purple-400">•</span>{t}</li>)}</ul>
              </div>
            )}

            {lifestyle.morning_routine && (
              <div className="glass-card p-6">
                <h3 className="font-semibold text-[#2D3B2D] mb-3">🌅 Morning Routine</h3>
                <ol className="space-y-2">{lifestyle.morning_routine.map((s: string, i: number) => <li key={i} className="text-sm text-[#2D3B2D]/70 flex items-start gap-2"><span className="text-amber-500 font-bold text-xs w-5">{i + 1}.</span>{s}</li>)}</ol>
              </div>
            )}

            {lifestyle.healthy_habits && (
              <div className="glass-card p-6">
                <h3 className="font-semibold text-[#2D3B2D] mb-3">🌿 Healthy Habits</h3>
                <ul className="space-y-2">{lifestyle.healthy_habits.map((h: string, i: number) => <li key={i} className="text-sm text-[#2D3B2D]/70 flex items-start gap-2"><span className="text-emerald-400">•</span>{h}</li>)}</ul>
              </div>
            )}
          </>
        )}
      </motion.div>

      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm flex items-start gap-3">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>These recommendations are AI-generated for educational purposes only. Always consult a healthcare professional.</p>
      </div>
    </div>
  );
}
