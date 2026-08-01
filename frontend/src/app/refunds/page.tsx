"use client";

import React, { useState } from "react";
import { RefreshCw, CloudSun, CreditCard } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PageHeroBanner from "@/components/ui/PageHeroBanner";

export default function RefundsPage() {
  const [activeTab, setActiveTab] = useState("timeline");

  const tabs = [
    { id: "timeline", label: "Cancellation Timeline", icon: RefreshCw },
    { id: "weather", label: "Weather Guarantee", icon: CloudSun },
    { id: "payouts", label: "Refund Payouts", icon: CreditCard },
  ];

  const content: Record<string, { heading: string; points: string[] }> = {
    timeline: {
      heading: "Cancellation Timeline",
      points: [
        "Cancellations made more than 72 hours before scheduled departure receive a full refund minus a 5% processing fee.",
        "Cancellations between 48–72 hours before departure attract a 25% retention charge of the total booking value.",
        "Cancellations between 24–48 hours before departure attract a 50% retention charge.",
        "Cancellations within 24 hours of scheduled departure are non-refundable under standard conditions.",
        "No-shows at the helipad without prior notification are treated as same-day cancellations and are non-refundable.",
        "Group bookings (5+ seats) have a separate cancellation policy governed by the group contract terms.",
      ],
    },
    weather: {
      heading: "Weather Guarantee",
      points: [
        "Roman Aviation operates exclusively under Visual Flight Rules (VFR). Flights may be postponed or cancelled if weather conditions do not meet minimum VFR standards.",
        "Weather-related cancellations initiated by Roman Aviation qualify for a 100% full refund or complimentary rescheduling at no extra cost.",
        "If a passenger declines to reschedule a weather-cancelled flight, a full refund will be initiated within 5–7 business days.",
        "Passengers are advised not to make non-refundable onward bookings (rail, hotel) without accounting for possible weather delays at Himalayan helipads.",
        "Roman Aviation's meteorological team monitors weather conditions using DGCA-certified forecasting tools and makes final go/no-go decisions.",
      ],
    },
    payouts: {
      heading: "Refund Payout Methods",
      points: [
        "Refunds are processed to the original payment source within 5–7 working days of approval.",
        "IMPS/NEFT bank transfers are available for refunds above ₹10,000. Bank account details must be provided via the secure refund portal.",
        "UPI refunds are processed within 1–3 business days to the originating UPI ID.",
        "Credit/debit card refunds may take 7–14 banking days to reflect based on your card issuer's processing cycles.",
        "Corporate account holders may opt for account credit toward future bookings in lieu of cash refunds.",
        "For refund-related queries, contact our accounts team at refunds@romanaviation.in with your booking reference number.",
      ],
    },
  };

  const currentContent = content[activeTab];

  return (
    <div className="min-h-screen bg-[#020B1E] text-slate-100 pb-20">
      
      {/* Full-Width Hero Banner */}
      <PageHeroBanner
        imageSrc="/banners/refunds-banner.jpg"
        imageAlt="Roman Aviation Refunds & Cancellations Policy"
        label="Passenger Protection"
        title="Refund & Rescheduling Guidelines"
        subtitle="Transparent cancellation schedules, weather standby processes, and IMPS payout options."
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
                Last updated: 01 August 2026 · Roman Aviation Private Limited · refunds@romanaviation.in
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
