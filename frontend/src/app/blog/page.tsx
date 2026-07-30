"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, User, Calendar, BookOpen, Compass, Helicopter, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Article {
  id: string;
  category: string;
  title: string;
  desc: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  content: string[];
}

const ARTICLES: Article[] = [
  {
    id: "kedarnath-2026",
    category: "Pilgrimage Guide",
    title: "Kedarnath Helicopter Booking 2026 Guide",
    desc: "Understand official slot booking calendars, DGCA guidelines, baggage constraints, and flight schedules for the 2026 pilgrimage season.",
    date: "July 12, 2026",
    author: "Capt. A. Singh (Retd. IAF)",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
    content: [
      "Securing a helicopter slot for Kedarnath is one of the most crucial aspects of planning your Himalayan pilgrimage. For the 2026 season, the Directorate General of Civil Aviation (DGCA) and Uttarakhand Civil Aviation Development Authority (UCADA) have announced synchronized booking schedules aligned with the temple opening dates.",
      "Official slot calendars open in phases, starting 30 days prior to the opening of the shrine. It is mandatory for all pilgrims to register on the official Uttarakhand Tourist Care portal before attempting to book a helicopter ticket, as your unique registration key will be verified during the manifest logging.",
      "Safety takes absolute priority at high altitudes. All operations are conducted under strict visual flight rules (VFR). Luggage limits are non-negotiable at 10 kg per seat. It is strongly advised to carry soft duffel bags rather than hard trolleys, which cannot be accommodated in the helicopter cargo holds.",
      "Infants under 2 years travel free of charge if they do not occupy a seat and are lap-held (weight must be under 10 kg). Be prepared for weather delays, as cloud cover at the Phata, Sirsi, and Guptkashi helipads can result in sudden standby holds. We recommend keeping a buffer day in your itinerary."
    ]
  },
  {
    id: "chardham-cost",
    category: "Cost & Budget",
    title: "Char Dham Yatra Cost Breakdown",
    desc: "A detailed pricing and budget breakdown comparing VIP private helicopter charters with group flight shuttles and premium hotel stops.",
    date: "June 28, 2026",
    author: "Devi Shastry",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1562016600-ece13e8ba570?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Char Dham Yatra—encompassing Yamunotri, Gangotri, Kedarnath, and Badrinath—is a spiritual odyssey of a lifetime. Traveling via helicopter offers unparalleled convenience and comfort, bypassing days of grueling road travel. However, understanding the cost elements is vital for budgeting.",
      "A VIP private helicopter charter typically runs between ₹4,50,000 to ₹5,80,000 per package, depending on occupancy levels, aircraft model (such as the spacious twin-engine Airbus H145), and the quality of accommodations at each valley stop.",
      "The cost structure generally includes Dehradun Sahastradhara helipad departures, dynamic priority Darshan slots at Badrinath and Kedarnath, luxury mountain resort stays, custom high-altitude gourmet meals, and dedicated local guides.",
      "For solo travelers or couples, seat-only configurations on shared commercial shuttles start from ₹49,999 per temple. When calculating budgets, factor in a standard 18% GST on air passenger transits and optional upgrades such as custom Vedic pujas or private Audi SUV ground transits."
    ]
  },
  {
    id: "vaishnodevi-time",
    category: "Travel Tips",
    title: "Best Time to Visit Vaishno Devi by Helicopter",
    desc: "Understand peak seasons, weather coordinates, monsoon delay schedules, and how to book express Darshan passes in Katra.",
    date: "May 15, 2026",
    author: "Dr. Priya Nair",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=800&auto=format&fit=crop",
    content: [
      "Located in the Trikuta Mountains of Jammu & Kashmir, the holy shrine of Mata Vaishno Devi attracts millions of devotees annually. The helicopter ride from Katra base to Sanjichhat helipad reduces a steep 12 km trek into a scenic 8-minute flight.",
      "Choosing the right season for your flight is key. The ideal windows are March to June (spring-summer) and September to November (autumn). During these months, the weather coordinates are highly stable, maximizing flight safety and reducing air corridor standby holds.",
      "The monsoon season (July to August) is prone to sudden rainstorms and dense mountain fog, which often lead to operational delays or cancellations. If you book during these months, verify the operator's standby policies and ensure your tickets include automated refund processing.",
      "Helicopter tickets automatically grant you access to the priority VIP Darshan queue at the Bhawan. Always double-check slot timings and arrive at the Katra staging helipad at least 1 hour before departure for security profiling and physical weight checks."
    ]
  }
];

export default function BlogPage() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Pilgrimage Guide", "Cost & Budget", "Travel Tips"];

  const filteredArticles = activeCategory === "All"
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === activeCategory);

  const activeArticle = ARTICLES.find((a) => a.id === selectedArticleId);

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      
      {/* MakeMyTrip Style Hero Header */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-12 pb-20 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-space text-[10px] uppercase font-bold text-amber-400 tracking-widest">
              Aviation &amp; Travel Chronicles
            </span>
          </div>
          
          <h1 className="font-space text-3xl md:text-5xl font-bold tracking-tight text-white uppercase">
            Himalayan Expedition Guides
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mt-2 font-sans">
            Expert insights, DGCA safety manuals, slot booking timelines, and pilgrimage checklists.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        
        <AnimatePresence mode="wait">
          {!selectedArticleId ? (
            /* Articles List Grid */
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              {/* Category Filter Pills */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md flex items-center justify-center gap-2 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-space font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#051433] text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <div 
                    key={article.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full"
                  >
                    <div className="h-52 relative overflow-hidden bg-slate-100 border-b border-slate-100">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-[#051433] text-amber-400 font-space text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                        {article.category}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col justify-between flex-grow text-left">
                      <div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-sans mb-2 font-semibold">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-slate-400" /> {article.readTime}</span>
                          <span>• {article.date}</span>
                        </div>

                        <h3 className="font-space text-base font-bold text-slate-900 mb-2 group-hover:text-[#051433] transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="font-sans text-xs text-slate-500 leading-relaxed mb-6">
                          {article.desc}
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setSelectedArticleId(article.id)}
                        className="font-space text-xs text-[#051433] font-bold uppercase tracking-wider flex items-center gap-1.5 mt-auto transition-all group-hover:translate-x-1 cursor-pointer self-start"
                      >
                        <span>Read Full Guide</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Article Reader View */
            <motion.article 
              key="reader"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl flex flex-col gap-6 max-w-4xl mx-auto text-slate-800"
            >
              {/* Back Button */}
              <button
                type="button"
                onClick={() => setSelectedArticleId(null)}
                className="flex items-center gap-2 text-xs font-space uppercase tracking-widest text-slate-700 hover:text-[#051433] font-bold transition-colors cursor-pointer self-start bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Expedition Guides</span>
              </button>

              {/* Feature Image */}
              <div className="h-[250px] sm:h-[380px] relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <Image 
                  src={activeArticle!.image} 
                  alt={activeArticle!.title} 
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Article Header */}
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-4">
                <span className="font-space text-xs font-bold text-[#051433] uppercase tracking-wider">
                  {activeArticle!.category}
                </span>
                <h2 className="font-space text-2xl sm:text-3.5xl font-bold text-slate-900 leading-tight">
                  {activeArticle!.title}
                </h2>
                <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-sans font-medium">
                  <span className="flex items-center gap-1.5 text-slate-900 font-bold"><User className="h-4 w-4 text-[#051433]" /> {activeArticle!.author}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> {activeArticle!.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-400" /> {activeArticle!.readTime}</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="flex flex-col gap-5 text-slate-700 font-sans text-sm sm:text-base leading-relaxed text-left">
                {activeArticle!.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Ready to Book CTA Card */}
              <div className="bg-[#051433] rounded-2xl p-6 md:p-8 border border-[#051433] text-white flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 shadow-xl">
                <div className="text-left flex items-start gap-4">
                  <div className="h-10 w-10 bg-amber-400/20 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-400 shrink-0 mt-1">
                    <Helicopter className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-space text-sm uppercase tracking-wider font-bold text-white">Ready for your pilgrimage?</h4>
                    <p className="font-sans text-xs text-slate-300 mt-1">Reserve your exclusive private charter and luxury flight corridor now.</p>
                  </div>
                </div>
                
                <Link
                  href="/booking"
                  className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl transition-all shrink-0 text-center w-full sm:w-auto shadow-md"
                >
                  Book Flight Now
                </Link>
              </div>
            </motion.article>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
