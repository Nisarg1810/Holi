"use client";

import React, { useState } from "react";
import { Activity, ShieldAlert, Award, Plane } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PageHeroBanner from "@/components/ui/PageHeroBanner";

export default function SafetyPage() {
  const [activeTab, setActiveTab] = useState("protocol");

  const tabs = [
    { id: "protocol", label: "Flight Protocol", icon: Plane },
    { id: "dgca", label: "DGCA Regulations", icon: Award },
    { id: "emergency", label: "Emergency Procedures", icon: ShieldAlert },
  ];

  const content: Record<string, { heading: string; points: string[] }> = {
    protocol: {
      heading: "Flight Safety Protocol",
      points: [
        "All Roman Aviation flights are operated under strict Visual Flight Rules (VFR) as mandated by DGCA regulations.",
        "A minimum weather ceiling of 1,500 feet AGL and visibility of 5 km is required for all high-altitude Himalayan operations.",
        "Dual-pilot cockpit configuration is mandatory for all passenger flights. Both pilots must hold valid DGCA Airline Transport Pilot Licenses (ATPL).",
        "Pre-flight passenger safety briefings cover emergency exits, floatation devices (for coastal routes), and brace positions.",
        "All passengers must wear the provided safety harness throughout the flight. Unbuckling during flight is prohibited.",
        "Mobile phones must be set to airplane mode before boarding. Electronic devices may not interfere with aircraft avionics.",
        "Maximum payload calculations are performed before each flight. No exceptions are made to MTOW limits for any reason.",
      ],
    },
    dgca: {
      heading: "DGCA Regulatory Compliance",
      points: [
        "Roman Aviation operates under a DGCA Non-Scheduled Operator Permit (NSOP) renewed annually through airworthiness audits.",
        "All aircraft undergo 100-hour and 200-hour scheduled maintenance inspections as per the manufacturer's approved maintenance program.",
        "Pilot flight time is monitored in compliance with DGCA CAR Section 7 – Flight Crew Licensing and Flight Time Limitations.",
        "Roman Aviation maintains a full Safety Management System (SMS) as required under DGCA Circular No. 3 of 2014.",
        "All accidents and incidents are reported to the Aircraft Accident Investigation Bureau (AAIB) within the prescribed regulatory timelines.",
        "Helipad infrastructure used by Roman Aviation is licensed under state aviation authority approvals and meets AAI helipad standards.",
      ],
    },
    emergency: {
      heading: "Emergency Procedures",
      points: [
        "In the event of an in-flight emergency, pilots are trained to execute emergency autorotation landing procedures within 30 seconds of power loss.",
        "All aircraft carry EPIRB distress beacons that transmit GPS coordinates to ISRO SAR satellite network upon activation.",
        "Roman Aviation maintains 24/7 contact with regional Army Aviation and IAF Search and Rescue units at Srinagar, Dehradun, and Leh.",
        "Medical evacuation protocols are pre-briefed with passengers on all mountain pilgrimage routes where terrain access is restricted.",
        "Emergency landing zones are pre-surveyed and pre-cleared along all Roman Aviation flight corridors.",
        "Our ground teams carry first-aid kits and AED defibrillators at all primary helipad staging locations.",
      ],
    },
  };

  const currentContent = content[activeTab];

  return (
    <div className="min-h-screen bg-[#020B1E] text-slate-100 pb-20">
      
      {/* Full-Width Hero Banner */}
      <PageHeroBanner
        imageSrc="/banners/safety-banner.jpg"
        imageAlt="Roman Aviation Safety Guidelines & Air Protocols"
        label="Safety Commitment"
        title="Safety Guidelines & Air Protocols"
        subtitle="Helipad security checkpoints, dual-pilot procedures, DGCA regulations, and weather thresholds."
        height={360}
        paperColor="#020B1E"
      />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10">
        
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-space font-semibold transition-all ${
                  isActive
                    ? "bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Side Content */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="bg-[#051433] rounded-xl border border-white/5 p-6 shadow-xl"
            >
              <h2 className="font-space text-lg font-bold text-white uppercase tracking-wide mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#C5A880] rounded-full inline-block" />
                {currentContent.heading}
              </h2>
              <ul className="flex flex-col gap-3">
                {currentContent.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-sans leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-slate-500 font-sans mt-6 pt-4 border-t border-white/5">
                Last updated: 01 August 2026 · Roman Aviation Private Limited · DGCA NSOP Holder
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
