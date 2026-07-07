"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, Brain, Calculator, Sparkles } from "lucide-react";

type ProcessingStep = "idle" | "uploading" | "extracting" | "calculating" | "analyzing" | "complete" | "error";

const steps = [
  { key: "extracting", icon: FileText, label: "Extracting Text", desc: "OCR processing your document..." },
  { key: "calculating", icon: Calculator, label: "Calculating Metrics", desc: "Computing BMI, BMR, TDEE, macros..." },
  { key: "analyzing", icon: Brain, label: "AI Analyzing", desc: "Generating health scores & recommendations..." },
];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState<ProcessingStep>("idle");
  const [error, setError] = useState("");
  const [reportId, setReportId] = useState<string>("");
  const router = useRouter();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSet(dropped);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSet(selected);
  };

  const validateAndSet = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "jpg", "jpeg", "png", "bmp", "tiff"].includes(ext || "")) {
      setError("Unsupported file type. Please upload PDF or image files.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("File too large. Maximum size is 20MB.");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setStep("uploading");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate step progression while the API processes everything
      setStep("extracting");
      const timeout1 = setTimeout(() => setStep("calculating"), 3000);
      const timeout2 = setTimeout(() => setStep("analyzing"), 6000);

      const res = await api.post("/reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearTimeout(timeout1);
      clearTimeout(timeout2);

      setReportId(res.data.id);
      setStep("complete");

      // Auto-redirect after 2s
      setTimeout(() => router.push(`/dashboard/reports/${res.data.id}`), 2000);
    } catch (err: any) {
      setStep("error");
      setError(err.response?.data?.detail || "Upload failed. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#2D3B2D] mb-2">
            Upload Medical Report
          </h1>
          <p className="text-[#2D3B2D]/50">
            Upload a blood report, lab result, or prescription for AI-powered analysis
          </p>
        </div>

        {/* Upload Zone */}
        {step === "idle" && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`glass-card p-12 text-center border-2 border-dashed transition-all cursor-pointer ${dragActive ? "upload-zone-active border-emerald-400" : "border-[#2D3B2D]/10 hover:border-emerald-300"
              }`}
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-[#2D3B2D] font-medium mb-1">
                {file ? file.name : "Drop your report here or click to browse"}
              </p>
              <p className="text-[#2D3B2D]/40 text-sm">
                Supports PDF, JPG, PNG • Max 20MB
              </p>
            </label>

            {file && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                  <FileText className="w-4 h-4" />
                  {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </div>
                <div className="mt-4">
                  <button onClick={handleUpload} className="btn-primary !py-3 !px-8 rounded-xl inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Analyze Report
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Processing Animation */}
        {["uploading", "extracting", "calculating", "analyzing"].includes(step) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8">
            <div className="text-center mb-8">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto mb-3" />
              <p className="text-[#2D3B2D] font-medium">Processing your report...</p>
            </div>

            <div className="space-y-4">
              {steps.map((s, i) => {
                const stepIndex = steps.findIndex((st) => st.key === step);
                const isActive = s.key === step;
                const isDone = i < stepIndex;

                return (
                  <div key={s.key} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive ? "bg-emerald-50 border border-emerald-200" : isDone ? "bg-emerald-50/50" : "opacity-40"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDone ? "bg-emerald-500" : isActive ? "bg-emerald-100" : "bg-[#2D3B2D]/5"}`}>
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                      ) : (
                        <s.icon className="w-5 h-5 text-[#2D3B2D]/30" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isActive || isDone ? "text-[#2D3B2D]" : "text-[#2D3B2D]/40"}`}>{s.label}</p>
                      <p className="text-xs text-[#2D3B2D]/40">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Complete */}
        {step === "complete" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#2D3B2D] mb-2">
              Analysis Complete!
            </h2>
            <p className="text-[#2D3B2D]/50 mb-4">Redirecting to your results...</p>
          </motion.div>
        )}

        {/* Error */}
        {(error || step === "error") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-medium mb-2">Upload Failed</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button onClick={() => { setStep("idle"); setError(""); setFile(null); }} className="btn-secondary text-sm !py-2 !px-6 rounded-xl">
              Try Again
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
