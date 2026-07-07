"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedBackground, DNAHelix, LeafDecoration, CellPattern, HeartBotanical } from "@/components/shared/Illustrations";
import {
  Activity, Upload, BarChart3, Apple, Shield, Sparkles, ArrowRight,
  Heart, Brain, Moon, Droplets, TrendingUp, ChevronRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: Upload,
    title: "AI Report Analysis",
    desc: "Upload blood reports, prescriptions, or lab results. Our AI extracts, analyzes, and explains every value in simple language.",
    color: "from-emerald-400 to-green-600",
  },
  {
    icon: BarChart3,
    title: "9 Health Scores",
    desc: "Get personalized scores for nutrition, fitness, sleep, hydration, mental wellness, heart health, lifestyle, and risk assessment.",
    color: "from-lime-400 to-emerald-600",
  },
  {
    icon: Apple,
    title: "Smart Recommendations",
    desc: "Receive personalized meal plans, workout routines, sleep schedules, stress management tips, and lifestyle modifications.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "Food Recognition",
    desc: "Upload a photo of your meal. AI identifies foods, estimates nutrition, and suggests healthier alternatives.",
    color: "from-violet-400 to-purple-600",
  },
];

const scores = [
  { icon: Heart, name: "Heart Health", color: "text-red-400" },
  { icon: Apple, name: "Nutrition", color: "text-green-500" },
  { icon: Activity, name: "Fitness", color: "text-blue-500" },
  { icon: Moon, name: "Sleep", color: "text-indigo-400" },
  { icon: Droplets, name: "Hydration", color: "text-cyan-400" },
  { icon: Brain, name: "Mental Wellness", color: "text-purple-400" },
  { icon: Shield, name: "Risk Assessment", color: "text-amber-500" },
  { icon: TrendingUp, name: "Lifestyle", color: "text-emerald-500" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      {/* ===== Navbar ===== */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center">
            <LeafDecoration className="w-6 h-6" />
          </div>
          <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#2D3B2D]">
            BioBalance
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="btn-primary text-sm !py-2.5 !px-5 rounded-xl inline-flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section className="relative z-10 px-6 md:px-12 pt-16 pb-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" /> AI-Powered Health Intelligence
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-bold text-[#2D3B2D] leading-[1.1] mb-6"
            >
              Nourish your body,{" "}
              <span className="italic text-emerald-600">Balance</span> your life.
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg text-[#2D3B2D]/60 mb-8 max-w-lg leading-relaxed">
              Your personal AI companion that analyzes health reports, provides personalized nutrition guidance,
              and helps you build a healthier lifestyle — one report at a time.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="btn-primary text-base !py-3.5 !px-8 rounded-2xl inline-flex items-center gap-2"
              >
                Start Free Analysis <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="btn-secondary !py-3.5 !px-8 rounded-2xl inline-flex items-center gap-2"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Mini Stats */}
            <motion.div variants={fadeUp} custom={4} className="flex gap-8 mt-12">
              {[
                { num: "25+", label: "Biomarkers Tracked" },
                { num: "9", label: "Health Scores" },
                { num: "AI", label: "Powered Analysis" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-emerald-600">{stat.num}</div>
                  <div className="text-sm text-[#2D3B2D]/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[500px] h-[500px]">
              {/* Central heart */}
              <HeartBotanical className="absolute inset-0 w-full h-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-card p-8 text-center">
                  <div className="font-[family-name:var(--font-playfair)] text-6xl font-bold text-emerald-600 mb-2">82</div>
                  <div className="text-sm text-[#2D3B2D]/60 font-medium">Health Score</div>
                  <div className="text-xs text-emerald-500 font-semibold mt-1">Good</div>
                </div>
              </div>
              {/* Floating score badges */}
              {scores.slice(0, 4).map((s, i) => {
                const positions = [
                  "top-4 left-8",
                  "top-4 right-8",
                  "bottom-16 left-4",
                  "bottom-16 right-4",
                ];
                return (
                  <motion.div
                    key={s.name}
                    className={`absolute ${positions[i]} glass-card px-4 py-3 flex items-center gap-2`}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                    <span className="text-xs font-medium text-[#2D3B2D]/70">{s.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[#2D3B2D] mb-4"
          >
            Everything you need for{" "}
            <span className="italic text-emerald-600">healthier</span> living
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-lg text-[#2D3B2D]/50 max-w-2xl mx-auto">
            From medical report analysis to personalized meal plans — our AI processes your data
            and delivers actionable health insights.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="glass-card p-8 group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2D3B2D] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#2D3B2D]/55 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="relative z-10 px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[#2D3B2D] mb-4"
          >
            How it works
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Upload Your Report",
              desc: "Upload any medical report in PDF or image format. Our OCR engine extracts every detail.",
              icon: Upload,
            },
            {
              step: "02",
              title: "AI Analyzes",
              desc: "The backend calculates BMI, BMR, TDEE & macros, then sends structured data to our AI for deep analysis.",
              icon: Brain,
            },
            {
              step: "03",
              title: "Get Personalized Results",
              desc: "Receive health scores, explanations, meal plans, workout routines, and lifestyle recommendations.",
              icon: Sparkles,
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="glass-card p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 font-[family-name:var(--font-playfair)] text-6xl font-bold text-emerald-500/10">
                {item.step}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
                <item.icon className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2D3B2D] mb-3">
                {item.title}
              </h3>
              <p className="text-[#2D3B2D]/55 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative z-10 px-6 md:px-12 py-24 max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass-card p-12 md:p-16 relative overflow-hidden"
        >
          <DNAHelix className="absolute -top-10 -right-5 w-20 h-80 opacity-10" />
          <LeafDecoration className="absolute -bottom-5 -left-5 w-24 h-24 opacity-10" />

          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#2D3B2D] mb-4"
          >
            Ready to understand your health better?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-[#2D3B2D]/55 mb-8 max-w-xl mx-auto">
            Upload your first medical report and let our AI generate a complete health analysis — completely free.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link href="/dashboard" className="btn-primary text-base !py-4 !px-10 rounded-2xl inline-flex items-center gap-2">
              Get Started Free <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-[#2D3B2D]/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center">
              <LeafDecoration className="w-4 h-4" />
            </div>
            <span className="font-[family-name:var(--font-playfair)] text-lg font-semibold">BioBalance</span>
          </div>
          <p className="text-sm text-[#2D3B2D]/40">
            © 2025 BioBalance. For educational purposes only. Not a replacement for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
