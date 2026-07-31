"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronUp, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      q: "What is your emergency safety protocol?",
      a: "All flights are operated by DGCA-certified operators utilizing multi-engine helicopters with dual-pilot instrument flight rating (IFR). We work in close alignment with state disaster boards, regional command controls, and maintain immediate emergency evacuation readiness.",
      category: "Safety"
    },
    {
      q: "How does Roman Aviation handle weather cancellations?",
      a: "In VIP aviation, safety takes absolute priority. If regional weather conditions fall below instrument standards, we offer immediate complimentary rescheduling, helicopter model upgrades, or a complete transparent refund calculation.",
      category: "Cancellations"
    },
    {
      q: "Are there any hidden booking fees or taxes?",
      a: "No. All our pricing options are transparent. A standard 18% GST (Goods and Services Tax) is applicable on air passenger transits and will be detailed clearly at checkout with no hidden surcharges.",
      category: "Pricing"
    },
    {
      q: "What is the cancellation and rescheduling policy?",
      a: "Bookings cancelled 72 hours prior to departure receive a full refund minus a 5% handling charge. Cancellations within 24-72 hours incur a 50% retention charge. Rescheduling is complimentary up to 48 hours before flight staging, subject to slot availability.",
      category: "Cancellations"
    },
    {
      q: "What identity documents are mandatory for boarding?",
      a: "As per DGCA mandates for flight manifests, all passengers must carry a valid physical government-issued photo ID (Aadhaar Card, Passport, or Voter ID). PAN cards are not accepted as valid identity proof for boarding manifest logs.",
      category: "Guidelines"
    },
    {
      q: "What is the luggage weight limit per passenger?",
      a: "Due to strict helicopter weight capacity limits and high-altitude flight safety regulations, passenger luggage is strictly limited to 10 kg per passenger. Soft duffel bags are highly recommended; large hard-shell suitcases will not fit in the baggage compartments.",
      category: "Guidelines"
    },
    {
      q: "Do you accommodate group bookings and corporate charters?",
      a: "Yes. We offer fully customizable private helicopter charter flights for corporate board members, weddings, VIP families, and emergency medical flyouts. Contact our 24/7 Concierge Desk to coordinate aircraft staging.",
      category: "Services"
    },
    {
      q: "What is the policy for infant and elderly passengers?",
      a: "Infants under 2 years of age (under 10 kg) travel free of charge when seated on an adult's lap. Passengers with specific high-altitude cardiac or respiratory conditions are advised to consult a medical practitioner before booking Himalayan routes.",
      category: "Guidelines"
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#020B1E] text-white pb-20">
      {/* Premium Navy Hero Header */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#020B1E] pt-12 pb-20 px-4 md:px-8 text-white relative shadow-lg text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">
            SUPPORT CENTER
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-3 text-white leading-tight uppercase">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-lg font-sans">
            Find answers to common questions about helicopter bookings, safety guidelines, cancellations, luggage weight rules, and flight schedules.
          </p>

          {/* Interactive Search Bar */}
          <div className="mt-8 w-full max-w-lg relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3.5 text-sm font-sans focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-white placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Accordion List Container */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 mt-12 relative z-20">
        {filteredFaqs.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border border-white/10 rounded-xl overflow-hidden bg-white/2 transition-all hover:border-[#C5A880]/30 shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 font-space text-xs md:text-sm font-semibold flex items-center justify-between gap-4 hover:text-[#C5A880] transition-colors text-white cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="h-4.5 w-4.5 text-[#C5A880] shrink-0" />
                      {faq.q}
                    </span>
                    <span className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block text-[9px] font-mono tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded uppercase font-bold">
                        {faq.category}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-[#C5A880]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-white/5 bg-[#020B1E]/40 text-left"
                      >
                        <div className="p-5 text-[11px] md:text-xs font-sans text-slate-300 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/2 rounded-2xl border border-white/5">
            <HelpCircle className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="font-space text-base font-bold text-white">No matches found</h3>
            <p className="text-xs text-slate-400 font-sans mt-1">Try refining your search keyword (e.g. safety, cancellations, weight)</p>
          </div>
        )}
      </div>

      {/* JSON-LD Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })
        }}
      />
    </div>
  );
}
