"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { User, Loader2, CheckCircle2, Save } from "lucide-react";

const activityLevels = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "lightly_active", label: "Lightly Active (1-3 days/week)" },
  { value: "moderately_active", label: "Moderately Active (3-5 days/week)" },
  { value: "very_active", label: "Very Active (6-7 days/week)" },
  { value: "extra_active", label: "Extra Active (physical job + exercise)" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setProfile(res.data.profile || {});
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.put("/users/profile", profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: any) => setProfile((prev: any) => ({ ...prev, [key]: value }));

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  const inputClass = "w-full py-3 px-4 rounded-xl bg-white/60 border border-[#2D3B2D]/10 text-[#2D3B2D] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-sm";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#2D3B2D]">My Profile</h1>
        <p className="text-[#2D3B2D]/40 text-sm mt-1">Complete your health profile for personalized analysis</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8">
        <div className="grid gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#2D3B2D]/70 mb-2">Age</label>
              <input type="number" value={profile.age || ""} onChange={(e) => update("age", parseInt(e.target.value) || null)} placeholder="e.g. 30" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D3B2D]/70 mb-2">Gender</label>
              <select value={profile.gender || ""} onChange={(e) => update("gender", e.target.value)} className={inputClass}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#2D3B2D]/70 mb-2">Height (cm)</label>
              <input type="number" value={profile.height_cm || ""} onChange={(e) => update("height_cm", parseFloat(e.target.value) || null)} placeholder="e.g. 175" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D3B2D]/70 mb-2">Weight (kg)</label>
              <input type="number" value={profile.weight_kg || ""} onChange={(e) => update("weight_kg", parseFloat(e.target.value) || null)} placeholder="e.g. 70" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D3B2D]/70 mb-2">Activity Level</label>
            <select value={profile.activity_level || ""} onChange={(e) => update("activity_level", e.target.value)} className={inputClass}>
              <option value="">Select activity level</option>
              {activityLevels.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D3B2D]/70 mb-2">Health Conditions</label>
            <input type="text" value={profile.health_conditions || ""} onChange={(e) => update("health_conditions", e.target.value)} placeholder="e.g. Diabetes, Hypertension (comma-separated)" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D3B2D]/70 mb-2">Allergies</label>
            <input type="text" value={profile.allergies || ""} onChange={(e) => update("allergies", e.target.value)} placeholder="e.g. Peanuts, Shellfish (comma-separated)" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D3B2D]/70 mb-2">Dietary Preferences</label>
            <input type="text" value={profile.dietary_preferences || ""} onChange={(e) => update("dietary_preferences", e.target.value)} placeholder="e.g. Vegetarian, Vegan, Keto" className={inputClass} />
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary !py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Profile</>}
          </button>
        </div>
      </motion.div>

      {/* Profile completeness */}
      {(() => {
        const fields = ["age", "gender", "height_cm", "weight_kg", "activity_level"];
        const filled = fields.filter((f) => profile[f]);
        const pct = Math.round((filled.length / fields.length) * 100);
        return (
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#2D3B2D]/70">Profile Completeness</span>
              <span className="text-sm font-bold text-emerald-600">{pct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#2D3B2D]/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-600" />
            </div>
            {pct < 100 && <p className="text-xs text-[#2D3B2D]/40 mt-2">Complete your profile for more accurate health analysis</p>}
          </div>
        );
      })()}
    </div>
  );
}
