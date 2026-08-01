"use client";

import React, { useState } from "react";
import { Scale, FileText, Landmark, ShieldCheck, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General Conditions", icon: FileText },
    { id: "carriage", label: "Rules of Carriage", icon: Scale },
    { id: "payments", label: "Payments & Slots", icon: Landmark },
    { id: "liability", label: "Operational Liability", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#020B1E] text-slate-100 pb-20 pt-10">
      
      {/* Immersive Header Banner */}
      <div className="relative max-w-6xl mx-auto px-6 mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[220px]">
        <img
          src="/terms_banner.png"
          alt="AURA Legal Header"
          className="w-full h-full object-cover brightness-[0.4] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E] via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 flex flex-col justify-end">
          <span className="text-[10px] font-space text-gold uppercase tracking-widest font-bold">
            Legal Framework
          </span>
          <h1 className="font-space text-2xl md:text-4xl font-bold tracking-tight text-white uppercase mt-1">
            Terms &amp; Conditions of Carriage
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-2 max-w-xl">
            Review detailed guidelines concerning aircraft load restrictions, flight corridor slot approvals, and private ticketing rules.
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
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 text-slate-300 font-sans text-xs md:text-sm leading-relaxed"
              >
                <h2 className="font-space text-base font-bold text-white uppercase border-b border-white/5 pb-2 mb-2">
                  1. Agreement &amp; Contract of Service
                </h2>
                <p>
                  All bookings, flight reservations, and custom helicopter transits arranged by Roman Aviation &amp; Tourism are subject strictly to the rules of carriage outlined here. By completing a transaction on our portal, you acknowledge that you read, understood, and accepted these guidelines.
                </p>
                <p>
                  We act as a premium travel coordinator and charter desk. All direct flight operations are carried out under DGCA Non-Scheduled Operators Permits (NSOP) by fully certified aircraft operators.
                </p>
                <p>
                  Passengers are required to carry a valid government identification document (Aadhaar Card, Passport, or Voter ID) matching the manifest details submitted during checkout. Flight clearances are subject to background checks by civil airport security offices.
                </p>
              </motion.div>
            )}

            {activeTab === "carriage" && (
              <motion.div
                key="carriage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 text-slate-300 font-sans text-xs md:text-sm leading-relaxed"
              >
                <h2 className="font-space text-base font-bold text-white uppercase border-b border-white/5 pb-2 mb-2">
                  2. Aircraft Load &amp; Weight Restrictions
                </h2>
                <p>
                  Helicopter flight dynamics dictate strict maximum takeoff weights (MTOW) under DGCA guidelines to maintain high-altitude lift margins.
                </p>
                <div className="bg-[#020B1E] border border-white/10 p-4 rounded-lg flex flex-col gap-2 font-mono text-[11px] text-white">
                  <div>• Individual Passenger Weight limit: 85 kg (Standard).</div>
                  <div>• Standard Individual Baggage allocation: 10 kg maximum.</div>
                  <div>• Bags must be soft duffel bags (hard-shell trolley bags are strictly prohibited).</div>
                </div>
                <p>
                  Our flight operations desk verifies individual manifests prior to daily staging. If passengers exceed the weights specified during booking, we reserve the right to offload baggage or cancel the seat assignment to maintain strict payload margins.
                </p>
              </motion.div>
            )}

            {activeTab === "payments" && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 text-slate-300 font-sans text-xs md:text-sm leading-relaxed"
              >
                <h2 className="font-space text-base font-bold text-white uppercase border-b border-white/5 pb-2 mb-2">
                  3. Booking Fees &amp; ATC Slot Allocation
                </h2>
                <p>
                  All VIP priority corridors, spiritual routes (Kedarnath/Badrinath), and custom airport transfers require real-time slots authorized by the Airport Authority of India (AAI) and regional defense ATC cells.
                </p>
                <p>
                  Due to the lock-in of these flight channels, ticket bookings require full payment at checkout. Quoted pricing includes GST (5% for standard regional transfers) and mandatory passenger insurance coverage.
                </p>
                <p>
                  No reservation is considered confirmed until a designated Flight Dispatch Key is generated in the system.
                </p>
              </motion.div>
            )}

            {activeTab === "liability" && (
              <motion.div
                key="liability"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 text-slate-300 font-sans text-xs md:text-sm leading-relaxed"
              >
                <h2 className="font-space text-base font-bold text-white uppercase border-b border-white/5 pb-2 mb-2">
                  4. Liability, Weather &amp; Flight Standby
                </h2>
                <p>
                  Passenger safety is the absolute guideline of Roman Aviation. If a flight is delayed, suspended, or cancelled due to force majeure events (fog, high-altitude turbulence, airspace restrictions, or VIP security lockdowns):
                </p>
                <p>
                  - The flight operations desk will place the reservation on priority standby.
                  <br />
                  - A priority slot will be allocated in the next available weather clearance window.
                  <br />
                  - In the event of complete cancellation, the booking price will be refunded or credited for future transits.
                </p>
                <p>
                  Roman Aviation is not liable for secondary hotel charges, missing domestic flight connections, or alternate logistics costs incurred by passengers due to weather standbys.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
