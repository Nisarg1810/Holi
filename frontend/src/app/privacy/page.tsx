"use client";

import React, { useState } from "react";
import { Shield, Lock, EyeOff, Server } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PageHeroBanner from "@/components/ui/PageHeroBanner";

export default function PrivacyPage() {
  const [activeTab, setActiveTab] = useState("collection");

  const tabs = [
    { id: "collection", label: "Data Collection", icon: Shield },
    { id: "sharing", label: "Third-Party Sharing", icon: EyeOff },
    { id: "security", label: "Security Protocols", icon: Lock },
    { id: "cookies", label: "Cookies & Logs", icon: Server },
  ];

  const content: Record<string, { heading: string; points: string[] }> = {
    collection: {
      heading: "Data We Collect",
      points: [
        "We collect personal identification data including full name, government ID number, date of birth, and passport details for flight manifest compliance.",
        "Contact information such as email address, WhatsApp number, and emergency contact details are collected for booking communications.",
        "Payment data including card last four digits, UPI VPA, and IMPS reference numbers are stored in encrypted form for reconciliation purposes.",
        "Biometric weight data recorded at helipad check-in is used exclusively for aircraft weight-and-balance calculations and is not retained beyond the flight date.",
        "Flight preference data (seat preference, meal requirements, accessibility needs) is collected to personalize your charter experience.",
      ],
    },
    sharing: {
      heading: "Third-Party Data Sharing",
      points: [
        "We share passenger manifest data with DGCA and the Airports Authority of India (AAI) as required under Indian aviation law.",
        "Payment gateway providers (Razorpay, PayU) receive transaction tokens but never receive full card data, which is processed on PCI-DSS certified servers.",
        "Hotel and resort partners receive name and contact data solely for room pre-assignment and concierge preparation upon guest request.",
        "We never sell, rent, or trade personal data to marketing companies, data brokers, or unaffiliated third parties.",
        "In the event of a regulatory investigation, we may be legally required to disclose information to law enforcement under court order.",
      ],
    },
    security: {
      heading: "Security Protocols",
      points: [
        "All data in transit is encrypted using TLS 1.3 with AES-256 cipher suites.",
        "Our databases are hosted on ISO 27001 certified cloud infrastructure with geo-redundant backups.",
        "Access to passenger data is restricted to authorized Roman Aviation flight operations and concierge personnel on a need-to-know basis.",
        "We conduct quarterly penetration testing and annual security audits by CERT-IN empaneled firms.",
        "In the event of a data breach, affected passengers will be notified within 72 hours as required under the Indian Data Protection Act.",
      ],
    },
    cookies: {
      heading: "Cookies & Access Logs",
      points: [
        "We use essential cookies to maintain your booking session state across page navigations on our platform.",
        "Analytics cookies (Google Analytics 4) help us understand which pages are most useful to our passengers. These can be opted out via your browser settings.",
        "Server access logs recording IP address, browser type, and page requested are retained for 90 days for security auditing purposes.",
        "We do not use tracking pixels, cross-site trackers, or fingerprinting technologies.",
        "You may request deletion of your cookies and session data at any time by contacting privacy@romanaviation.in.",
      ],
    },
  };

  const currentContent = content[activeTab];

  return (
    <div className="min-h-screen bg-[#020B1E] text-slate-100 pb-20">
      
      {/* Full-Width Hero Banner */}
      <PageHeroBanner
        imageSrc="/banners/privacy-banner.jpg"
        imageAlt="Roman Aviation Privacy Policy - Data Security"
        label="Data Governance"
        title="Privacy & Manifest Data Security"
        subtitle="Learn how we handle passenger identifiers, payment authorization tokens, and flight manifest security logs."
        height={360}
        paperColor="#020B1E"
      />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10">
        
        {/* Left Side Tab Navigation */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 bg-[#051433] p-4 rounded-xl border border-white/5 shadow-xl">
          <span className="text-[9px] font-space uppercase tracking-widest text-slate-400 font-bold block px-2 mb-2">
            Privacy Sections
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
                Last updated: 01 August 2026 · Roman Aviation Private Limited · privacy@romanaviation.in
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
