"use client";

import React, { useState } from "react";
import { RefreshCw, CloudSun, CreditCard, ShieldAlert } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function RefundsPage() {
  const [activeTab, setActiveTab] = useState("timeline");

  const tabs = [
    { id: "timeline", label: "Cancellation Timeline", icon: RefreshCw },
    { id: "weather", label: "Weather Guarantee", icon: CloudSun },
    { id: "payouts", label: "Refund Payouts", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#020B1E] text-slate-100 pb-20 pt-10">
      
      {/* Immersive Header Banner */}
      <div className="relative max-w-6xl mx-auto px-6 mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[220px]">
        <img
          src="/refunds_banner.png"
          alt="AURA Refunds Header"
          className="w-full h-full object-cover brightness-[0.4] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E] via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 flex flex-col justify-end">
          <span className="text-[10px] font-space text-gold uppercase tracking-widest font-bold">
            Passenger Protection
          </span>
          <h1 className="font-space text-2xl md:text-4xl font-bold tracking-tight text-white uppercase mt-1">
            Refund &amp; Rescheduling Guidelines
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-2 max-w-xl">
            Read transparent cancellation schedules, weather standby processes, and IMPS payout options.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Tab Navigation */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 bg-[#051433] p-4 rounded-xl border border-white/5 shadow-xl">
          <span className="text-[9px] font-space uppercase tracking-widest text-slate-400 font-bold block px-2 mb-2">
            Policy Sections
          </span>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-space text-xs font-bold uppercase tracking-wider text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-gold text-black shadow-lg shadow-gold/20"
                    : "bg-[#020B1E]/40 text-slate-300 hover:text-white border border-white/5 hover:border-white/10"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-black" : "text-gold"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Side Content Panel */}
        <div className="lg:col-span-8 bg-[#051433] rounded-xl p-6 md:p-8 border border-white/5 shadow-xl min-h-[380px]">
          <AnimatePresence mode="wait">
            {activeTab === "timeline" && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 text-slate-300 font-sans text-xs md:text-sm leading-relaxed"
              >
                <h2 className="font-space text-base font-bold text-white uppercase border-b border-white/5 pb-2 mb-2">
                  1. Cancellation Fees &amp; Timeline
                </h2>
                <p>
                  Charter slot bookings require locking down priority runway timings. If you decide to cancel your booking, the following retention schedules apply based on your departure time:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-space text-xs text-white">
                  <div className="bg-[#020B1E] border border-emerald-500/20 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">&gt; 72 Hours Left</span>
                    <div className="text-xl font-bold font-mono">95% Refund</div>
                    <span className="text-[9.5px] text-slate-400">5% Retention fee applies</span>
                  </div>
                  <div className="bg-[#020B1E] border border-amber-500/20 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">24 - 72 Hours Left</span>
                    <div className="text-xl font-bold font-mono">50% Refund</div>
                    <span className="text-[9.5px] text-slate-400">50% Retention fee applies</span>
                  </div>
                  <div className="bg-[#020B1E] border border-red-500/20 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider">&lt; 24 Hours Left</span>
                    <div className="text-xl font-bold font-mono">0% Refund</div>
                    <span className="text-[9.5px] text-slate-400">100% Retention fee applies</span>
                  </div>
                </div>
                <p>
                  To request a cancellation, navigate to your user dashboard, locate the active booking under "My Trips", and complete the cancellation request modal steps.
                </p>
              </motion.div>
            )}

            {activeTab === "weather" && (
              <motion.div
                key="weather"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 text-slate-300 font-sans text-xs md:text-sm leading-relaxed"
              >
                <h2 className="font-space text-base font-bold text-white uppercase border-b border-white/5 pb-2 mb-2">
                  2. Weather delays &amp; operational standbys
                </h2>
                <p>
                  In private regional aviation and high-altitude spiritual routes (such as Kedarnath &amp; Badrinath), safety is the paramount consideration.
                </p>
                <p>
                  If a flight is suspended or cancelled due to hazardous cloud cover, mountain turbulence, technical telemetry warnings, or temporary military airspace restrictions:
                  <br />
                  - Passengers will be accommodated on the next available weather clearance slot.
                  <br />
                  - If rescheduling is not possible due to your travel constraints, a complete **100% refund** will be authorized without any retention deduction.
                </p>
              </motion.div>
            )}

            {activeTab === "payouts" && (
              <motion.div
                key="payouts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 text-slate-300 font-sans text-xs md:text-sm leading-relaxed"
              >
                <h2 className="font-space text-base font-bold text-white uppercase border-b border-white/5 pb-2 mb-2">
                  3. Payout methods &amp; processing timelines
                </h2>
                <p>
                  During the cancellation wizard process on your dashboard, you can choose how your eligible refund is processed:
                </p>
                <p>
                  • **Original Payment Source:** Automatically credited back to the cards, net banking, or UPI credentials used at checkout. Standard timeline: 5 to 7 working days.
                  <br />
                  • **Direct Bank Transfer (IMPS/NEFT):** Processed manually by our central dispatch desk to the bank account number, holder, and IFSC code provided during cancellation. Standard timeline: 24 to 48 hours.
                </p>
                <div className="flex gap-3 bg-[#020B1E] border border-white/10 p-4 rounded-xl text-xs font-sans text-slate-300 leading-relaxed mt-2">
                  <ShieldAlert className="h-5 w-5 text-gold shrink-0" />
                  <div>
                    Refund requests must be approved by the admin team. Once approved, the transaction ID will be updated on your dashboard.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
