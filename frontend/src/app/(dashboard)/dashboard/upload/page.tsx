"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle, Brain, Calculator, Sparkles, X, FilePlus } from "lucide-react";

import { Footer } from "@/components/layout/Footer";

type ProcessingStep = "idle" | "uploading" | "extracting" | "calculating" | "analyzing" | "complete" | "error";

const processingSteps = [
  { key: "extracting", icon: FileText, label: "Extracting Text", desc: "OCR processing your document..." },
  { key: "calculating", icon: Calculator, label: "Calculating Metrics", desc: "Computing BMI, BMR, TDEE & macros..." },
  { key: "analyzing", icon: Brain, label: "AI Analysis", desc: "Generating health scores & recommendations..." },
];

const ACCEPTED_TYPES = ["pdf", "jpg", "jpeg", "png", "bmp", "tiff"];
const MAX_SIZE_MB = 20;

// Mock StyleSheet helper similar to React Native
const StyleSheet = {
  create<T extends Record<string, React.CSSProperties>>(styles: T): T {
    return styles;
  }
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState<ProcessingStep>("idle");
  const [error, setError] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSet(dropped);
  }, []);

  const validateAndSet = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext || "")) {
      setError("Unsupported file type. Please upload a PDF, JPG, PNG, BMP, or TIFF file.");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFile(f);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setStep("extracting");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const t1 = setTimeout(() => setStep("calculating"), 3000);
      const t2 = setTimeout(() => setStep("analyzing"), 6000);

      const res = await api.post("/reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearTimeout(t1);
      clearTimeout(t2);
      setStep("complete");
      setTimeout(() => router.push(`/dashboard/reports/${res.data.id}`), 2000);
    } catch (err: any) {
      setStep("error");
      setError(err.response?.data?.detail || "Upload failed. Please try again.");
    }
  };

  const reset = () => {
    setFile(null);
    setStep("idle");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isProcessing = ["extracting", "calculating", "analyzing", "uploading"].includes(step);
  const currentStepIndex = processingSteps.findIndex((s) => s.key === step);

  return (
    <div style={styles.pageWrapper}>
      {/* ── Page Header ───────────────────────────────────────── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.headerTitleWrapper}>
            <UploadCloud className="w-7 h-7 text-emerald-600" />
            <h1 style={styles.headerTitle}>Upload Medical Report</h1>
          </div>
          <div style={styles.headerSubWrapper}>
            <FileText style={{ width: 14, height: 14, color: "rgba(45,59,45,0.45)" }} />
            <span style={styles.headerSub}>
              Upload any blood report, lab result, or prescription for comprehensive AI-powered health analysis.
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
            exit={{ opacity: 0, y: -8 }}
            style={styles.errorBanner}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p style={styles.errorText}>{error}</p>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 flex-shrink-0 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Main Content Area ===== */}
      <div style={styles.mainContentContainer}>
        <AnimatePresence mode="wait">
          {step === "idle" && (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              style={styles.cardWrapper}
            >
              <div style={styles.uploadZoneCard}>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => !file && inputRef.current?.click()}
                  style={{
                    ...styles.dropZone,
                    borderColor: dragActive ? "#34d399" : file ? "#6ee7b7" : "#e5e7eb",
                    backgroundColor: dragActive || file ? "rgba(209, 250, 229, 0.03)" : "transparent",
                    cursor: file ? "default" : "pointer",
                  }}
                  className="transition-all"
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff"
                    onChange={(e) => e.target.files?.[0] && validateAndSet(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />

                  {!file ? (
                    <label htmlFor="file-upload" style={styles.dropZoneLabel}>
                      <div style={styles.iconWrapper}>
                        <FilePlus className="w-5 h-5 text-[#059669]" />
                      </div>
                      <p style={styles.dropZoneTitle}>
                        {dragActive ? "Release to upload" : "Drop your report here"}
                      </p>
                      <p style={styles.dropZoneSub}>or click to browse files</p>
                      <div style={styles.badgeRow}>
                        {["PDF", "JPG", "PNG", "BMP", "TIFF"].map((t) => (
                          <span key={t} style={styles.badge}>
                            {t}
                          </span>
                        ))}
                        <span style={styles.limitBadge}>
                          Max 20MB
                        </span>
                      </div>
                    </label>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.selectedFileWrapper}>
                      {/* File selected state */}
                      <div style={styles.successIconWrapper}>
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p style={styles.fileName}>{file.name}</p>
                      <p style={styles.fileDetails}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB · {file.name.split(".").pop()?.toUpperCase()}
                      </p>
                      <div style={styles.btnRow}>
                        <button
                          onClick={(e) => { e.stopPropagation(); reset(); }}
                          className="btn-secondary text-sm !px-5"
                        >
                          <X className="w-4 h-4" /> Remove
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                          className="btn-primary text-sm !px-6"
                        >
                          <Sparkles className="w-4 h-4" />
                          Analyze Report
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== Processing State ===== */}
          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={styles.cardWrapper}
            >
              <div style={styles.stateCard}>
                <div style={styles.processingHeader}>
                  <div style={styles.loaderRelative}>
                    <div style={styles.loaderPulse} className="animate-pulse" />
                    <div style={styles.loaderFlex}>
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                  </div>
                  <p style={styles.processingTitle}>Processing your report…</p>
                  <p style={styles.processingSub}>This may take 10–30 seconds</p>
                </div>

                <div style={styles.stepsList}>
                  {processingSteps.map((s, i) => {
                    const isDone = i < currentStepIndex;
                    const isActive = s.key === step;
                    return (
                      <div
                        key={s.key}
                        style={{
                          ...styles.stepRow,
                          backgroundColor: isActive ? "rgba(240, 253, 244, 0.5)" : isDone ? "rgba(240, 253, 244, 0.2)" : "rgba(45, 59, 45, 0.01)",
                          borderColor: isActive ? "#bbf7d0" : isDone ? "#d1fae5" : "rgba(45, 59, 45, 0.05)",
                          opacity: isActive || isDone ? 1 : 0.6,
                        }}
                        className="transition-all duration-300"
                      >
                        <div
                          style={{
                            ...styles.stepIconBox,
                            backgroundColor: isDone ? "#10b981" : isActive ? "#d1fae5" : "rgba(45, 59, 45, 0.05)",
                          }}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : isActive ? (
                            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                          ) : (
                            <s.icon className="w-5 h-5 text-[#2D3B2D]/25" />
                          )}
                        </div>
                        <div>
                          <p
                            style={{
                              ...styles.stepLabel,
                              color: isActive || isDone ? "#2D3B2D" : "rgba(45, 59, 45, 0.35)",
                            }}
                          >
                            {s.label}
                          </p>
                          <p style={styles.stepDesc}>{s.desc}</p>
                        </div>
                        {isDone && (
                          <span className="ml-auto badge badge-success text-xs">Done</span>
                        )}
                        {isActive && (
                          <span className="ml-auto badge badge-warning text-xs">Running…</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== Success State ===== */}
          {step === "complete" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.cardWrapper}
            >
              <div style={styles.successCard}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  style={styles.successCompleteIconBox}
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </motion.div>
                <h2 style={styles.successTitle}>
                  Analysis Complete!
                </h2>
                <p style={styles.successSub}>Your report has been analyzed successfully.</p>
                <p style={styles.successRedirect}>Redirecting you to the results…</p>
                <div style={styles.successLoaderRow}>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== Error State ===== */}
          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.cardWrapper}
            >
              <div style={styles.errorCard}>
                <div style={styles.errorAlertIconBox}>
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 style={styles.errorTitle}>Upload Failed</h3>
                <p style={styles.errorDesc}>{error}</p>
                <button onClick={reset} className="btn-secondary">
                  <X className="w-4 h-4" /> Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== Info Section ===== */}
      {step === "idle" && (
        <div style={styles.infoSection}>
          <p style={styles.infoSectionTitle}>What happens next</p>
          <div style={styles.infoGrid}>
            {[
              { icon: FileText, title: "Text Extraction", desc: "OCR reads every value from your document with clinical precision." },
              { icon: Calculator, title: "Metric Calculation", desc: "BMI, BMR, TDEE and metabolic macros automatically computed." },
              { icon: Brain, title: "AI Analysis", desc: "Health scores & personalized clinical recommendations generated." },
            ].map((item) => (
              <div key={item.title} style={styles.infoCard} className="transition-all duration-300 hover:shadow-md">
                <div style={styles.infoIconBox}>
                  <item.icon className="w-5 h-5" />
                </div>
                <p style={styles.infoCardTitle}>{item.title}</p>
                <p style={styles.infoCardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <Footer />
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
    flexGrow: 1,
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
    paddingTop: "24px",
    paddingBottom: "24px",
    paddingLeft: "24px",
    paddingRight: "24px",
    textAlign: "center" as const,
    borderWidth: "2px",
    borderStyle: "dashed" as const,
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
  },
  iconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "9999px",
    backgroundColor: "rgba(59, 245, 144, 0.15)",
    border: "1px solid rgba(167, 243, 208, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
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
  limitBadge: {
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    color: "#9ca3af",
    fontStyle: "italic" as const,
    fontSize: "10px",
    paddingLeft: "12px",
    paddingRight: "12px",
    paddingTop: "4px",
    paddingBottom: "4px",
    borderRadius: "9999px",
  },
  selectedFileWrapper: {
    width: "100%",
    paddingTop: "16px",
    paddingBottom: "16px",
  },
  successIconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "9999px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #d1fae5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "12px",
  },
  fileName: {
    fontWeight: "600",
    color: "#2D3B2D",
    fontSize: "16px",
    marginBottom: "4px",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "384px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  fileDetails: {
    fontSize: "12px",
    color: "rgba(45, 59, 45, 0.55)",
    marginBottom: "24px",
    margin: 0,
  },
  btnRow: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
  },
  stateCard: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "32px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    border: "1px solid rgba(45, 59, 45, 0.05)",
    width: "100%",
  },
  processingHeader: {
    textAlign: "center" as const,
    marginBottom: "32px",
  },
  loaderRelative: {
    position: "relative" as const,
    width: "64px",
    height: "64px",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "16px",
  },
  loaderPulse: {
    position: "absolute" as const,
    inset: 0,
    borderRadius: "9999px",
    backgroundColor: "#ecfdf5",
  },
  loaderFlex: {
    position: "absolute" as const,
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  processingTitle: {
    fontWeight: "600",
    color: "#2D3B2D",
    fontSize: "18px",
    margin: 0,
  },
  processingSub: {
    color: "rgba(45, 59, 45, 0.5)",
    fontSize: "14px",
    marginTop: "4px",
    margin: 0,
  },
  stepsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  stepRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    borderRadius: "16px",
    borderWidth: "1px",
    borderStyle: "solid" as const,
  },
  stepIconBox: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepLabel: {
    fontSize: "14px",
    fontWeight: "600",
    margin: 0,
  },
  stepDesc: {
    fontSize: "12px",
    color: "rgba(45, 59, 45, 0.4)",
    marginTop: "2px",
    margin: 0,
  },
  successCard: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "32px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    border: "1px solid rgba(45, 59, 45, 0.05)",
    textAlign: "center" as const,
    width: "100%",
  },
  successCompleteIconBox: {
    width: "80px",
    height: "80px",
    borderRadius: "9999px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #d1fae5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "20px",
  },
  successTitle: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: "24px",
    fontWeight: "700",
    color: "#2D3B2D",
    marginBottom: "8px",
    margin: 0,
  },
  successSub: {
    color: "rgba(45, 59, 45, 0.5)",
    fontSize: "14px",
    marginBottom: "4px",
    margin: 0,
  },
  successRedirect: {
    color: "rgba(45, 59, 45, 0.35)",
    fontSize: "12px",
    margin: 0,
  },
  successLoaderRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: "16px",
  },
  errorCard: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "32px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    border: "1px solid rgba(45, 59, 45, 0.05)",
    textAlign: "center" as const,
    width: "100%",
  },
  errorAlertIconBox: {
    width: "64px",
    height: "64px",
    borderRadius: "9999px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "16px",
  },
  errorTitle: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: "20px",
    fontWeight: "700",
    color: "#2D3B2D",
    marginBottom: "8px",
    margin: 0,
  },
  errorDesc: {
    color: "rgba(45, 59, 45, 0.55)",
    fontSize: "14px",
    marginBottom: "24px",
    margin: 0,
  },
  infoSection: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "24px",
    width: "100%",
  },
  infoSectionTitle: {
    fontSize: "10px",
    fontWeight: "600",
    color: "rgba(45, 59, 45, 0.45)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.15em",
    textAlign: "center" as const,
    margin: 0,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    maxWidth: "896px",
    width: "100%",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #f3f4f6",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    borderRadius: "16px",
    paddingTop: "16px",
    paddingBottom: "16px",
    paddingLeft: "24px",
    paddingRight: "24px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
    width: "100%",
    height: "100%",
    boxSizing: "border-box" as const,
  },
  infoIconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#0c4f34",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
    color: "#3bf590",
    flexShrink: 0,
  },
  infoCardTitle: {
    fontSize: "12px",
    fontWeight: "750",
    color: "#2D3B2D",
    marginBottom: "8px",
    margin: 0,
  },
  infoCardDesc: {
    fontSize: "11px",
    color: "rgba(45, 59, 45, 0.55)",
    maxWidth: "180px",
    marginLeft: "auto",
    marginRight: "auto",
    margin: 0,
    lineHeight: "1.6",
  },
});
