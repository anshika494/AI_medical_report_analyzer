"use client";

import React from "react";

/** Floating DNA helix SVG for background decoration */
export function DNAHelix({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.15">
        {[0, 60, 120, 180, 240, 300].map((y, i) => (
          <React.Fragment key={i}>
            <ellipse cx={50 + Math.sin((y / 60) * Math.PI) * 25} cy={y + 20} rx="8" ry="4" fill="#22c55e" />
            <ellipse cx={50 - Math.sin((y / 60) * Math.PI) * 25} cy={y + 20} rx="8" ry="4" fill="#16a34a" />
            <line
              x1={50 + Math.sin((y / 60) * Math.PI) * 25}
              y1={y + 20}
              x2={50 - Math.sin((y / 60) * Math.PI) * 25}
              y2={y + 20}
              stroke="#86efac"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </React.Fragment>
        ))}
        <path
          d={`M ${50 + 25} 20 ${[60, 120, 180, 240, 300].map((y) => `Q ${50 + Math.sin((y / 60) * Math.PI) * 30} ${y}, ${50 + Math.sin((y / 60) * Math.PI) * 25} ${y + 20}`).join(" ")}`}
          stroke="#22c55e"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

/** Floating cell/molecule cluster */
export function CellPattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.12">
        <circle cx="100" cy="100" r="45" stroke="#22c55e" strokeWidth="1.5" fill="none" />
        <circle cx="100" cy="100" r="30" stroke="#16a34a" strokeWidth="1" fill="rgba(34, 197, 94, 0.05)" />
        <circle cx="100" cy="100" r="8" fill="#22c55e" opacity="0.3" />
        <circle cx="70" cy="75" r="3" fill="#16a34a" opacity="0.5" />
        <circle cx="130" cy="80" r="2.5" fill="#22c55e" opacity="0.4" />
        <circle cx="85" cy="130" r="3.5" fill="#16a34a" opacity="0.5" />
        <circle cx="120" cy="125" r="2" fill="#22c55e" opacity="0.4" />
        <ellipse cx="55" cy="110" r="18" ry="15" stroke="#86efac" strokeWidth="1" fill="none" opacity="0.4" />
        <ellipse cx="145" cy="95" r="15" ry="12" stroke="#86efac" strokeWidth="1" fill="none" opacity="0.3" />
      </g>
    </svg>
  );
}

/** Leaf decoration SVG */
export function LeafDecoration({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.15">
        <path
          d="M60 100 C60 100, 20 70, 25 35 C30 10, 60 5, 60 5 C60 5, 90 10, 95 35 C100 70, 60 100, 60 100Z"
          fill="rgba(34, 197, 94, 0.1)"
          stroke="#22c55e"
          strokeWidth="1.5"
        />
        <path d="M60 100 L60 20" stroke="#16a34a" strokeWidth="1" opacity="0.5" />
        <path d="M60 80 Q45 65 35 55" stroke="#16a34a" strokeWidth="0.8" opacity="0.4" fill="none" />
        <path d="M60 65 Q75 55 85 45" stroke="#16a34a" strokeWidth="0.8" opacity="0.4" fill="none" />
        <path d="M60 50 Q45 40 40 30" stroke="#16a34a" strokeWidth="0.8" opacity="0.4" fill="none" />
      </g>
    </svg>
  );
}

/** Heart with botanical elements */
export function HeartBotanical({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.2">
        <path
          d="M50 85 C50 85, 15 60, 15 38 C15 22, 28 15, 38 15 C45 15, 50 20, 50 25 C50 20, 55 15, 62 15 C72 15, 85 22, 85 38 C85 60, 50 85, 50 85Z"
          fill="rgba(220, 38, 38, 0.1)"
          stroke="#dc2626"
          strokeWidth="1.5"
          opacity="0.5"
        />
        {/* Leaf sprout from top */}
        <path d="M50 18 C50 18, 40 5, 50 0 C60 5, 50 18, 50 18Z" fill="#22c55e" opacity="0.4" />
        <path d="M50 18 L50 5" stroke="#16a34a" strokeWidth="0.5" opacity="0.4" />
      </g>
    </svg>
  );
}

/** Animated background with floating biology elements */
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <DNAHelix className="absolute -top-10 -right-10 w-24 h-96 animate-float-slow" />
      <CellPattern className="absolute top-1/4 -left-10 w-48 h-48 animate-float" />
      <LeafDecoration className="absolute bottom-20 right-10 w-28 h-28 animate-float-slow" style={{ animationDelay: "2s" }} />
      <CellPattern className="absolute top-10 left-1/3 w-32 h-32 animate-pulse-soft" />
      <LeafDecoration className="absolute top-1/2 right-1/4 w-20 h-20 animate-float" style={{ animationDelay: "4s" }} />
      <DNAHelix className="absolute -bottom-20 left-20 w-16 h-64 animate-float-slow" style={{ animationDelay: "3s" }} />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-green-100/30 to-emerald-50/20 blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-50/30 to-green-50/20 blur-3xl" />
    </div>
  );
}
