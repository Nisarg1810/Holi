"use client";

import React, { useState } from "react";
import { Scale, FileText, Landmark, ShieldCheck, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PageHeroBanner from "@/components/ui/PageHeroBanner";

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General Conditions", icon: FileText },
    { id: "carriage", label: "Rules of Carriage", icon: Scale },
    { id: "payments", label: "Payments & Slots", icon: Landmark },
    { id: "liability", label: "Operational Liability", icon: ShieldCheck },
  ];

  const content: Record<string, { heading: string; points: string[] }> = {
    general: {
      heading: "General Terms & Conditions",
      points: [
        "All bookings are subject to availability and final confirmation from Roman Aviation dispatch.",
        "Passengers must carry a valid government-issued photo ID (Aadhar, Passport, or Driving License) at time of boarding.",
        "Children below 2 years of age are allowed as lap infants at no extra charge; children above 2 years require a full seat.",
        "Roman Aviation reserves the right to amend schedules, routes, or aircraft type for operational and safety reasons without prior notice.",
        "Passengers are requested to report to the helipad staging area at least 45 minutes before scheduled departure.",
        "Smoking, consumption of alcohol, and use of mobile phones during flight is strictly prohibited.",
        "Roman Aviation shall not be liable for any delays caused by adverse weather, technical holds, or regulatory checks.",
      ],
    },
    carriage: {
      heading: "Rules of Carriage",
      points: [
        "Maximum baggage allowance per passenger is 10 kg in a soft duffel bag. Hard-shell trolleys cannot be accommodated.",
        "Oversized or overweight baggage will be offloaded at the staging point. Roman Aviation is not responsible for such items.",
        "Carriage of flammable materials, pressurized cylinders, or prohibited items under DGCA Circular AI-001 is strictly forbidden.",
        "All passengers are subject to a pre-boarding weight check. Total payload (passenger + baggage) must not exceed the aircraft MTOW limits.",
        "Passengers with a combined body weight exceeding 120 kg must notify Roman Aviation at the time of booking for configuration adjustments.",
        "Stretcher and medical-assist carriage requires prior written clearance from the Roman Aviation Chief Flight Operations Officer.",
      ],
    },
    payments: {
      heading: "Payments & Slot Bookings",
      points: [
        "All bookings require 100% advance payment via approved channels: IMPS, RTGS, NEFT, or authorized payment gateways.",
        "Slot confirmations are issued digitally within 2 business hours of payment receipt under normal conditions.",
        "GST at 18% is applicable on all passenger air transport services as per Indian aviation tax regulations.",
        "Slot assignments are non-transferable between passengers or travel dates without written consent from our operations team.",
        "Group booking discounts (5+ seats) are available upon request. Contact our corporate desk for volume pricing.",
        "All published prices are base fares exclusive of applicable state landing fees, fuel surcharges, and airport facility charges.",
      ],
    },
    liability: {
      heading: "Operational Liability",
      points: [
        "Roman Aviation's liability for passenger baggage damage or loss is capped at ₹5,000 per incident unless otherwise documented.",
        "Roman Aviation is not liable for consequential damages, missed connections, or financial losses arising from flight disruptions.",
        "In the event of a declared operational emergency, passengers will be transported to the nearest safe landing zone and assisted by ground teams.",
        "All aircraft are maintained under DGCA-approved maintenance programs. Roman Aviation carries public liability insurance as required by Indian aviation law.",
        "Disputes arising under these terms shall be subject to the jurisdiction of courts in New Delhi, India.",
        "Roman Aviation reserves the right to refuse carriage to passengers deemed medically unfit, intoxicated, or a safety risk.",
      ],
    },
  };

  const currentContent = content[activeTab];

  return (
    <div className="min-h-screen bg-[#020B1E] text-slate-100 pb-20">
      
      {/* Full-Width Hero Banner */}
      <PageHeroBanner
        imageSrc="/banners/terms-banner.jpg"
        imageAlt="Roman Aviation Terms & Conditions - Legal Framework"
        label="Legal Framework"
        title="Terms & Conditions of Carriage"
        subtitle="Review guidelines concerning aircraft load restrictions, flight corridor slot approvals, and private ticketing rules."
        height={360}
        paperColor="#020B1E"
      />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10">
        
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
