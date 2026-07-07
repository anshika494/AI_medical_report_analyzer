"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { formatDate, getScoreColor, getScoreLabel } from "@/lib/utils";
import { FileText, Upload, ChevronRight, Loader2 } from "lucide-react";

export default function ReportsListPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reports/").then((res) => setReports(res.data)).catch(() => { }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#2D3B2D]">My Reports</h1>
          <p className="text-[#2D3B2D]/40 text-sm mt-1">{reports.length} reports uploaded</p>
        </div>
        <Link href="/dashboard/upload" className="btn-primary text-sm !py-2.5 !px-5 rounded-xl inline-flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload New
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <FileText className="w-16 h-16 text-[#2D3B2D]/10 mx-auto mb-4" />
          <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2D3B2D] mb-2">No reports yet</h3>
          <p className="text-[#2D3B2D]/40 mb-6">Upload your first medical report to get started</p>
          <Link href="/dashboard/upload" className="btn-primary text-sm !py-3 !px-6 rounded-xl inline-flex items-center gap-2">
            Upload Report <Upload className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report, i) => (
            <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/dashboard/reports/${report.id}`}
                className="glass-card p-5 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#2D3B2D]">{report.file_name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#2D3B2D]/40">{formatDate(report.uploaded_at)}</span>
                      {report.report_type && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {report.report_type.replace(/_/g, " ")}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${report.has_analysis ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-600"}`}>
                        {report.has_analysis ? "Analyzed" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {report.overall_score && (
                    <div className="text-right">
                      <p className={`text-xl font-bold ${getScoreColor(report.overall_score)}`}>{report.overall_score}</p>
                      <p className="text-xs text-[#2D3B2D]/40">{getScoreLabel(report.overall_score)}</p>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-[#2D3B2D]/20 group-hover:text-emerald-500 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
