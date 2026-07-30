"use client";

import React from "react";
import { Check } from "lucide-react";

interface TrackerProps {
  currentStep: number; // 1 to 5
}

const STEPS = [
  { step: 1, label: "Search" },
  { step: 2, label: "Select Flight" },
  { step: 3, label: "Passenger Details" },
  { step: 4, label: "Payment" },
  { step: 5, label: "Confirmation" }
];

export default function BookingProgressTracker({ currentStep }: TrackerProps) {
  return (
    <div className="max-w-3xl mx-auto my-6 px-4 relative z-20">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-white/20 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Active golden progress line */}
        <div 
          className="absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-amber-400 via-[#F5A623] to-[#D68B3E] -translate-y-1/2 z-0 transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(245,166,35,0.5)]"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;

          return (
            <div key={s.step} className="flex flex-col items-center z-10 relative">
              <div 
                className={`h-9 w-9 rounded-full flex items-center justify-center font-space text-xs font-bold transition-all duration-300 ${
                  isCompleted 
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 scale-100" 
                    : isActive 
                    ? "bg-[#051433] text-amber-400 border-2 border-amber-400 ring-4 ring-amber-400/20 shadow-xl scale-110" 
                    : "bg-[#051433]/90 text-slate-400 border border-slate-700"
                }`}
              >
                {isCompleted ? <Check className="h-5 w-5 stroke-[3] text-slate-950" /> : s.step}
              </div>
              
              <span 
                className={`text-[10px] uppercase tracking-wider font-space mt-2.5 transition-colors duration-300 font-bold ${
                  isActive ? "text-amber-400 scale-105 drop-shadow-md" : isCompleted ? "text-white font-semibold" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
