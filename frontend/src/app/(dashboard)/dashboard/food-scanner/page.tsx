"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Camera, Upload, Loader2, CheckCircle2, AlertTriangle, Info, Sparkles, Apple } from "lucide-react";

export default function FoodScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError("");
  }, []);

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/food/analyze", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#2D3B2D]">Food Scanner</h1>
        <p className="text-[#2D3B2D]/40 text-sm mt-1">Upload a photo of your meal for AI nutritional analysis</p>
      </div>

      {/* Upload Zone */}
      <div className="glass-card p-8 text-center">
        <input type="file" accept="image/*" id="food-upload" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

        {!preview ? (
          <label htmlFor="food-upload" className="cursor-pointer block">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-dashed border-amber-300 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-[#2D3B2D] font-medium">Click to upload a food photo</p>
            <p className="text-[#2D3B2D]/40 text-sm mt-1">JPG, PNG, WEBP supported</p>
          </label>
        ) : (
          <div>
            <img src={preview} alt="Food preview" className="w-64 h-64 object-cover rounded-2xl mx-auto mb-4 shadow-lg" />
            <div className="flex gap-3 justify-center">
              <label htmlFor="food-upload" className="btn-secondary text-sm !py-2.5 !px-5 rounded-xl cursor-pointer">Change Photo</label>
              {!result && (
                <button onClick={analyze} disabled={loading} className="btn-primary text-sm !py-2.5 !px-5 rounded-xl inline-flex items-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Analyze</>}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Verdict */}
          <div className={`glass-card p-6 border-2 ${result.is_healthy ? "border-emerald-200 bg-emerald-50/30" : "border-amber-200 bg-amber-50/30"}`}>
            <div className="flex items-center gap-3 mb-3">
              {result.is_healthy ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <AlertTriangle className="w-6 h-6 text-amber-500" />}
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2D3B2D]">
                {result.is_healthy ? "Healthy Meal! 🎉" : "Could Be Healthier 💡"}
              </h3>
              {result.meal_score && <span className="ml-auto text-2xl font-bold text-emerald-600">{result.meal_score}/100</span>}
            </div>
            <p className="text-[#2D3B2D]/60 text-sm">{result.verdict}</p>
          </div>

          {/* Identified Foods */}
          {result.identified_foods?.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-semibold text-[#2D3B2D] mb-3">🍽️ Identified Foods</h3>
              <div className="flex flex-wrap gap-2">
                {result.identified_foods.map((food: any, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                    {food.name} {food.estimated_quantity && `(${food.estimated_quantity})`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition */}
          {result.nutrition && (
            <div className="glass-card p-6">
              <h3 className="font-semibold text-[#2D3B2D] mb-4">📊 Nutrition Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Calories", value: result.nutrition.total_calories, unit: "kcal", color: "text-amber-600" },
                  { label: "Protein", value: result.nutrition.protein_g, unit: "g", color: "text-blue-600" },
                  { label: "Carbs", value: result.nutrition.carbohydrates_g, unit: "g", color: "text-orange-600" },
                  { label: "Fats", value: result.nutrition.fats_g, unit: "g", color: "text-red-500" },
                  { label: "Fiber", value: result.nutrition.fiber_g, unit: "g", color: "text-green-600" },
                  { label: "Sugar", value: result.nutrition.sugar_g, unit: "g", color: "text-pink-500" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-white/40 text-center">
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value ?? "—"}</p>
                    <p className="text-xs text-[#2D3B2D]/40 mt-1">{item.label} ({item.unit})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Healthier Alternatives */}
          {result.healthier_alternatives?.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-semibold text-[#2D3B2D] mb-3">💡 Healthier Alternatives</h3>
              <div className="space-y-2">
                {result.healthier_alternatives.map((alt: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/40">
                    <span className="text-sm text-red-400 line-through">{alt.instead_of}</span>
                    <span className="text-[#2D3B2D]/30">→</span>
                    <span className="text-sm text-emerald-600 font-medium">{alt.try}</span>
                    <span className="text-xs text-[#2D3B2D]/40 ml-auto">{alt.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}
    </div>
  );
}
