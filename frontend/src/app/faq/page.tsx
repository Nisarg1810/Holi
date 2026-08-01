"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronUp, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeroBanner from "@/components/ui/PageHeroBanner";

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
      a: "In Private aviation, safety takes absolute priority. If regional weather conditions fall below instrument standards, we offer immediate complimentary rescheduling, helicopter model upgrades, or a complete transparent refund calculation.",
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
      q: "What luggage is allowed on the helicopter?",
      a: "Each passenger is allowed one soft-sided duffel bag with a maximum weight of 10 kg. Hard-shell trolleys or rigid suitcases cannot be accommodated in helicopter cargo bays due to space constraints. Excess baggage will be offloaded at the staging base.",
      category: "Luggage"
    },
    {
      q: "Is there a minimum age requirement for flights?",
      a: "Children above 2 years of age require a full paid seat. Infants below 2 years may travel as lap infants at no extra charge. Children under 12 must travel accompanied by a parent or legal guardian.",
      category: "Eligibility"
    },
    {
      q: "Can we request custom gourmet catering or wheelchair assistance?",
      a: "Yes, you can specify custom preferences. Our flight concierges can coordinate gourmet vegetarian/Vedic box meals, priority porter passes for darshan, and wheelchair staging at helipads.",
      category: "Services"
    },
    {
      q: "What certifications do Roman Aviation helicopters hold?",
      a: "All aircraft are operated under Non-Scheduled Operator Permits (NSOP) authorized by the DGCA, maintaining rigorous mechanical inspections and double-pilot cockpit redundancy protocols.",
      category: "Safety"
    }
  ];

  const categories = ["All", ...Array.from(new Set(faqs.map(f => f.category)))];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === "" ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#020B1E] text-white pb-20">
      {/* Hero Banner */}
      <PageHeroBanner
        imageSrc="/banners/faq-banner.jpg"
        imageAlt="Roman Aviation FAQ - Support Center"
        label="Support Center"
        title="Frequently Asked Questions"
        subtitle="Find answers about helicopter bookings, safety guidelines, cancellations, luggage rules, and flight schedules."
        paperColor="#020B1E"
      />

      {/* Search Bar (below banner) */}
      <div className="max-w-xl mx-auto px-4 mt-8 relative z-30 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-full pl-12 pr-6 py-3.5 text-sm font-sans focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-white placeholder-slate-400 shadow-lg"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-3xl mx-auto px-4 mb-8 flex flex-wrap gap-2 justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-space font-bold uppercase tracking-wide transition-all ${
              activeCategory === cat
                ? "bg-[#C5A880] text-[#020B1E]"
                : "bg-white/5 text-slate-400 border border-white/10 hover:border-[#C5A880]/50 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List Container */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 mt-4 relative z-20">
        {filteredFaqs.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isOpen ? "border-[#C5A880]/40 bg-[#051433]" : "border-white/10 bg-[#051433]/60"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className={`h-4 w-4 shrink-0 ${isOpen ? "text-[#C5A880]" : "text-slate-500"}`} />
                      <span className={`text-sm font-space font-semibold ${isOpen ? "text-[#C5A880]" : "text-slate-200"}`}>
                        {faq.q}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#C5A880] shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 pt-1 text-sm text-slate-300 font-sans leading-relaxed border-t border-white/5">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 font-sans">
            <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No questions match your search. Try different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
