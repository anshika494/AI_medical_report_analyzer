"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import {
  Camera, Loader2, CheckCircle2, AlertTriangle, Info, Sparkles,
  X, RefreshCw, ArrowRight, FileText
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";

interface NutritionItem {
  label: string;
  key: string;
  unit: string;
  color: string;
  bg: string;
}

const nutritionItems: NutritionItem[] = [
  { label: "Calories", key: "total_calories", unit: "kcal", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  { label: "Protein", key: "protein_g", unit: "g", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  { label: "Carbs", key: "carbohydrates_g", unit: "g", color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
  { label: "Fats", key: "fats_g", unit: "g", color: "text-red-500", bg: "bg-red-50 border-red-100" },
  { label: "Fiber", key: "fiber_g", unit: "g", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  { label: "Sugar", key: "sugar_g", unit: "g", color: "text-pink-500", bg: "bg-pink-50 border-pink-100" },
];

// Mock StyleSheet helper similar to React Native
const StyleSheet = {
  create<T extends Record<string, React.CSSProperties>>(styles: T): T {
    return styles;
  }
};

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
      const res = await api.post("/food/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
  };

  return (
    <div style={styles.pageWrapper}>
      {/* ── Page Header ───────────────────────────────────────── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.headerTitleWrapper}>
            <Camera className="w-7 h-7 text-emerald-600" />
            <h1 style={styles.headerTitle}>Food Scanner</h1>
          </div>
          <div style={styles.headerSubWrapper}>
            <FileText style={{ width: 14, height: 14, color: "rgba(45,59,45,0.45)" }} />
            <span style={styles.headerSub}>
              Snap or upload a photo of your meal for instant AI nutritional analysis.
            </span>
          </div>
        </div>
      </div>

      {/* ===== Error Banner ===== */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={styles.errorBanner}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p style={styles.errorText}>{error}</p>
            <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Upload / Preview Zone ===== */}
      <div style={styles.mainContentContainer}>
        <div style={styles.cardWrapper}>
          <input
            type="file"
            accept="image/*"
            id="food-upload"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {!preview ? (
            <label htmlFor="food-upload" style={styles.dropZoneLabel}>
              <div style={styles.uploadZoneCard}>
                <div
                  style={styles.dropZone}
                  className="hover:border-gray-400 hover:bg-gray-50/5 transition-all duration-300"
                >
                  <div style={styles.iconWrapper}>
                    <Camera className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p style={styles.dropZoneTitle}>Upload a food photo</p>
                  <p style={styles.dropZoneSub}>Click to browse or drag & drop</p>
                  <div style={styles.badgeRow}>
                    {["JPG", "PNG", "WEBP", "HEIC"].map((t) => (
                      <span key={t} style={styles.badge}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </label>
          ) : (
            <div style={styles.previewContainer}>
              {/* Preview Image */}
              <div style={styles.imageRelative}>
                <img
                  src={preview}
                  alt="Food preview"
                  style={styles.previewImage}
                />
                {!result && !loading && (
                  <button
                    onClick={reset}
                    style={styles.imageRemoveBtn}
                    className="hover:bg-black/60 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Actions & Status */}
              <div style={styles.actionsBlock}>
                <div>
                  <p style={styles.fileName}>{file?.name}</p>
                  <p style={styles.fileDetails}>
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · ${file.name.split(".").pop()?.toUpperCase()}` : ""}
                  </p>
                </div>

                {!result && (
                  <div style={styles.btnRow}>
                    <button
                      onClick={analyze}
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing meal…</>
                      ) : (
                        <><Sparkles className="w-4 h-4" /> Analyze Meal</>
                      )}
                    </button>
                    <label htmlFor="food-upload" className="btn-secondary cursor-pointer">
                      <RefreshCw className="w-4 h-4" /> Change Photo
                    </label>
                  </div>
                )}

                {result && (
                  <button onClick={reset} className="btn-secondary" style={{ width: "fit-content" }}>
                    <Camera className="w-4 h-4" /> Scan Another Meal
                  </button>
                )}

                {loading && (
                  <div style={styles.loadingBanner}>
                    <div style={styles.pulseDot} className="animate-pulse" />
                    <div style={styles.pulseDot} className="animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <div style={styles.pulseDot} className="animate-pulse" style={{ animationDelay: "0.4s" }} />
                    <span style={styles.loadingBannerText}>Identifying foods & calculating nutrition…</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Results View ===== */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.resultsWrapper}
          >
            {/* Verdict */}
            <div
              style={{
                ...styles.verdictCard,
                borderLeftColor: result.is_healthy ? "#10b981" : "#9ca3af",
              }}
              className="glass-card"
            >
              <div style={styles.verdictFlex}>
                <div
                  style={{
                    ...styles.verdictIconWrapper,
                    backgroundColor: result.is_healthy ? "#ecfdf5" : "#f3f4f6",
                  }}
                >
                  {result.is_healthy
                    ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    : <AlertTriangle className="w-6 h-6 text-gray-500" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.verdictTitleRow}>
                    <h3 style={styles.verdictTitle}>
                      {result.is_healthy ? "Healthy Meal! 🎉" : "Could Be Healthier 💡"}
                    </h3>
                    {result.meal_score && (
                      <span
                        style={{
                          ...styles.verdictScore,
                          color: result.is_healthy ? "#059669" : "#4b5563",
                        }}
                      >
                        {result.meal_score}<span style={styles.verdictScoreScale}>/100</span>
                      </span>
                    )}
                  </div>
                  <p style={styles.verdictText}>{result.verdict}</p>
                </div>
              </div>
            </div>

            {/* Identified Foods */}
            {result.identified_foods?.length > 0 && (
              <div className="glass-card" style={styles.detailsCard}>
                <h3 className="section-title mb-4">
                  <span className="text-base">🍽️</span>
                  Identified Foods
                </h3>
                <div style={styles.badgesContainer}>
                  {result.identified_foods.map((food: any, i: number) => (
                    <span key={i} style={styles.foodBadge}>
                      🌿 {food.name}
                      {food.estimated_quantity && (
                        <span style={styles.foodQty}>({food.estimated_quantity})</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Breakdown */}
            {result.nutrition && (
              <div className="glass-card" style={styles.detailsCard}>
                <h3 className="section-title mb-4">
                  <span className="text-base">📊</span>
                  Nutrition Breakdown
                </h3>
                <div style={styles.nutritionGrid}>
                  {nutritionItems.map((item) => {
                    const val = result.nutrition[item.key];
                    return (
                      <div key={item.label} className={`p-4 rounded-xl border text-center ${item.bg}`}>
                        <p className={`text-2xl font-bold font-[family-name:var(--font-playfair)] ${item.color}`} style={{ margin: 0 }}>
                          {val ?? "—"}
                        </p>
                        <p className="text-xs text-[#2D3B2D]/45 mt-1 font-medium" style={{ margin: 0 }}>{item.label}</p>
                        <p className="text-[10px] text-[#2D3B2D]/30" style={{ margin: 0 }}>{item.unit}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Alternatives */}
            {result.healthier_alternatives?.length > 0 && (
              <div className="glass-card" style={styles.detailsCard}>
                <h3 className="section-title mb-4">
                  <span className="text-base">💡</span>
                  Healthier Alternatives
                </h3>
                <div style={styles.alternativesList}>
                  {result.healthier_alternatives.map((alt: any, i: number) => (
                    <div key={i} style={styles.alternativeRow}>
                      <span style={styles.altInsteadOf}>{alt.instead_of}</span>
                      <ArrowRight className="w-4 h-4 text-[#2D3B2D]/25 flex-shrink-0" />
                      <span style={styles.altTry}>{alt.try}</span>
                      <span style={styles.altReason}>{alt.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Disclaimer ===== */}
      <div className="info-banner" style={{ marginTop: "16px" }}>
        <Info className="w-4 h-4" />
        <p>Food Scanner estimations are AI-generated for nutritional tracking. Consult a nutritionist or healthcare professional for strict diet recommendations.</p>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <Footer />
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
    fontWeight: "500",
    color: "#1a2e1a",
    margin: 0,
  },
  headerSubWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  headerSub: {
    fontSize: "12px",
    color: "rgba(45, 59, 45, 0.45)",
    fontWeight: "500",
  },
  errorBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
    borderRadius: "16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    maxWidth: "896px",
    width: "100%",
    margin: "0 auto",
  },
  errorText: {
    fontSize: "14px",
    flex: 1,
    margin: 0,
  },
  mainContentContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrapper: {
    maxWidth: "896px", // max-w-4xl equivalent
    width: "100%",
    margin: "0 auto",
  },
  uploadZoneCard: {
    backgroundColor: "#ffffff",
    padding: "16px",
    borderRadius: "24px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
    border: "1px solid #f3f4f6",
    width: "100%",
  },
  dropZone: {
    paddingTop: "48px",
    paddingBottom: "48px",
    paddingLeft: "24px",
    paddingRight: "24px",
    textAlign: "center" as const,
    borderWidth: "2px",
    borderStyle: "dashed" as const,
    borderColor: "rgba(229, 231, 235)",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "220px",
  },
  dropZoneLabel: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    width: "100%",
  },
  iconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "9999px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #d1fae5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
  dropZoneTitle: {
    color: "#2D3B2D",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 2px 0",
  },
  dropZoneSub: {
    color: "rgba(45, 59, 45, 0.5)",
    fontSize: "12px",
    margin: "0 0 16px 0",
  },
  badgeRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    flexWrap: "wrap" as const,
    marginTop: "4px",
  },
  badge: {
    backgroundColor: "#f3f4f6",
    color: "rgba(45, 59, 45, 0.65)",
    fontWeight: "500",
    fontSize: "10px",
    paddingLeft: "12px",
    paddingRight: "12px",
    paddingTop: "4px",
    paddingBottom: "4px",
    borderRadius: "9999px",
  },
  previewContainer: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
    border: "1px solid #f3f4f6",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "flex-start",
    gap: "24px",
    width: "100%",
  },
  imageRelative: {
    position: "relative" as const,
    flexShrink: 0,
  },
  previewImage: {
    width: "208px", // sm:w-52
    height: "208px",
    objectFit: "cover" as const,
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  imageRemoveBtn: {
    position: "absolute" as const,
    top: "8px",
    right: "8px",
    width: "28px",
    height: "28px",
    borderRadius: "9999px",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
  },
  actionsBlock: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    gap: "16px",
    alignSelf: "center",
  },
  fileName: {
    fontWeight: "600",
    color: "#2D3B2D",
    fontSize: "16px",
    margin: 0,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "280px",
  },
  fileDetails: {
    fontSize: "12px",
    color: "rgba(45, 59, 45, 0.4)",
    marginTop: "2px",
    margin: 0,
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
  },
  loadingBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "rgba(45, 59, 45, 0.5)",
  },
  pulseDot: {
    width: "6px",
    height: "6px",
    borderRadius: "9999px",
    backgroundColor: "#9ca3af",
  },
  loadingBannerText: {
    marginLeft: "4px",
  },
  resultsWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    maxWidth: "896px",
    width: "100%",
    margin: "0 auto",
  },
  verdictCard: {
    padding: "24px",
    borderLeftWidth: "4px",
    borderLeftStyle: "solid" as const,
  },
  verdictFlex: {
    display: "flex",
    alignItems: "start",
    gap: "16px",
  },
  verdictIconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  verdictTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "12px",
    marginBottom: "8px",
  },
  verdictTitle: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: "20px",
    fontWeight: "750",
    color: "#2D3B2D",
    margin: 0,
  },
  verdictScore: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: "24px",
    fontWeight: "700",
    marginLeft: "auto",
  },
  verdictScoreScale: {
    fontSize: "14px",
    color: "rgba(45, 59, 45, 0.3)",
  },
  verdictText: {
    color: "rgba(45, 59, 45, 0.6)",
    fontSize: "14px",
    lineHeight: "1.625",
    margin: 0,
  },
  detailsCard: {
    padding: "24px",
  },
  badgesContainer: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
  },
  foodBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    paddingLeft: "12px",
    paddingRight: "12px",
    paddingTop: "6px",
    paddingBottom: "6px",
    borderRadius: "9999px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#047857",
    fontSize: "14px",
    fontWeight: "500",
  },
  foodQty: {
    color: "#34d399",
    fontWeight: "normal",
    marginLeft: "2px",
  },
  nutritionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "12px",
  },
  alternativesList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  alternativeRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    border: "1px solid rgba(45, 59, 45, 0.05)",
  },
  altInsteadOf: {
    fontSize: "14px",
    color: "#f87171",
    textDecoration: "line-through",
    fontWeight: "500",
    flexShrink: 0,
  },
  altTry: {
    fontSize: "14px",
    color: "#059669",
    fontWeight: "600",
    flexShrink: 0,
  },
  altReason: {
    fontSize: "12px",
    color: "rgba(45, 59, 45, 0.4)",
    marginLeft: "auto",
    textAlign: "right" as const,
    lineHeight: "1.625",
  },
});
