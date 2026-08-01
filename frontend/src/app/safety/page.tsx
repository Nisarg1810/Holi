"use client";

import React, { useState } from "react";
import { Activity, ShieldAlert, Award, Plane } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function SafetyPage() {
  const [activeTab, setActiveTab] = useState("protocol");

  const tabs = [
    { id: "protocol", label: "Flight Protocol", icon: Plane },
    { id: "dgca", label: "DGCA Regulations", icon: Award },
    { id: "emergency", label: "Emergency Procedures", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#020B1E] text-slate-100 pb-20 pt-10">
      
      {/* Immersive Header Banner */}
      <div className="relative max-w-6xl mx-auto px-6 mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[220px]">
        <img
          src="/safety_banner.png"
          alt="AURA Safety Header"
          className="w-full h-full object-cover brightness-[0.4] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E] via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 flex flex-col justify-end">
          <span className="text-[10px] font-space text-gold uppercase tracking-widest font-bold">
            Safety Commitment
          </span>
          <h1 className="font-space text-2xl md:text-4xl font-bold tracking-tight text-white uppercase mt-1">
            Safety Guidelines &amp; Air Protocols
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-2 max-w-xl">
            Review guidelines concerning helipad security checkpoints, dual-pilot procedures, and weather thresholds.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Tab Navigation */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 bg-[#051433] p-4 rounded-xl border border-white/5 shadow-xl">
          <span className="text-[9px] font-space uppercase tracking-widest text-slate-400 font-bold block px-2 mb-2">
            Safety Pillars
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
            {activeTab === "protocol" && (
              <motion.div
                key="protocol"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 text-slate-300 font-sans text-xs md:text-sm leading-relaxed"
              >
                <h2 className="font-space text-base font-bold text-white uppercase border-b border-white/5 pb-2 mb-2">
                  1. Pre-Flight passenger protocols
                </h2>
                <p>
                  To maintain helicopter balance margins, all passengers must comply with pre-boarding instructions:
                </p>
                <p>
                  • **Weight Declaration:** Precise body weights are audited at the helipad manifest desk prior to staging. 
                  <br />
                  • **Baggage Restrictions:** Heavy hard-shell suitcase models are not allowed in the helicopter storage bays. Bags must be soft duffel style.
                  <br />
                  • **Electronic Devices:** Cell phones and tablets must be switched to Flight Mode prior to takeoff to prevent interference with cockpit telemetry instruments.
                </p>
              </motion.div>
            )}

            {activeTab === "dgca" && (
              <motion.div
                key="dgca"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 text-slate-300 font-sans text-xs md:text-sm leading-relaxed"
              >
                <h2 className="font-space text-base font-bold text-white uppercase border-b border-white/5 pb-2 mb-2">
                  2. Civil Aviation (DGCA) Standards
                </h2>
                <p>
                  Roman Aviation operates in strict compliance with the Directorate General of Civil Aviation (DGCA) civil air safety guidelines:
                </p>
                <p>
                  - **Dual-Pilot cockpit crew:** All regional flights and passenger transfers are stage-guided by two fully licensed commercial helicopter pilots holding high-altitude training credentials.
                  <br />
                  - **Pre-flight Telemetry inspections:** Telemetry logs and mechanical tolerances are reviewed and signed off by certified B1.3 Aviation Maintenance Engineers (AME) before daily flight releases.
                </p>
              </motion.div>
            )}

            {activeTab === "emergency" && (
              <motion.div
                key="emergency"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 text-slate-300 font-sans text-xs md:text-sm leading-relaxed"
              >
                <h2 className="font-space text-base font-bold text-white uppercase border-b border-white/5 pb-2 mb-2">
                  3. Emergency procedures &amp; weather guidelines
                </h2>
                <p>
                  High-altitude corridors are subject to rapid weather shifts:
                </p>
                <p>
                  • **Standby Status:** In the event of high winds or visibility limitations below safety margins, pilots will put the flight on standby or divert to the nearest designated secondary landing pad.
                  <br />
                  • **Satellite Flight Telemetry Tracking:** All aircraft maintain constant satellite communication channels with the Sahastradhara central dispatch desk, uploading real-time telemetry coordinates.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
