"use client";

import React from "react";
import Link from "next/link";
import SearchBox from "@/components/booking/SearchBox";
import { 
  Helicopter, 
  Compass, 
  Hotel, 
  Ship, 
  Plane,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Sparkles,
  Check
} from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesPage() {
  const servicesList = [
    {
      name: "Helicopter Booking",
      tagline: "Ultra-luxury high altitude transits & shuttle flights",
      desc: "Fly above the clouds in state-of-the-art Airbus H145 and Bell 429 helicopters. Perfect for fast-track business transits, airport shoreline shuttle loops, and direct high-altitude sacred mountain pilgrimages to Kedarnath and Badrinath.",
      cta: "BOOK HELICOPTER FLIGHT",
      href: "/booking",
      icon: Helicopter,
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop",
      features: ["DGCA Certified Multi-Engine Fleets", "Dual-Pilot IFR Operations", "Bespoke Ramp VIP Pickups", "Retractable Landing Gear Stays"]
    },
    {
      name: "Bespoke Private Charters",
      tagline: "Custom flight corridor planning & multi-leg corridor charters",
      desc: "Plan bespoke flight paths across India with custom multi-leg corridors, custom cabin weight safety gauges, and dedicated flight concierge dispatchers.",
      cta: "CONFIGURE BESPOKE CHARTER",
      href: "/charter",
      icon: Plane,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop",
      features: ["Custom Flight Corridor Staging", "Dedicated Flight Concierge", "Gourmet Caviar & Catering", "VIP Terminal Ramp Access"]
    },
    {
      name: "Tour Packages",
      tagline: "Curated multi-day itineraries combining sky travel & luxury retreats",
      desc: "Experience India's most breathtaking sites through custom sky tour packages. Handcrafted journeys that unify scenic flights, 5-star lodging, private yacht excursions, and priority darshan slots.",
      cta: "EXPLORE TOUR PACKAGES",
      href: "/tours",
      icon: Compass,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
      features: ["VIP Priority Darshan Entries", "Taj & Sarovar Stays Included", "Private Gourmet Catering", "Personal Tour Historian Guides"]
    },
    {
      name: "Hotel & Resort Stays",
      tagline: "Elite lodgings, royal lake palaces, and wild canvas retreats",
      desc: "Access a handpicked portfolio of India's finest hotels, wilderness sanctuaries, and heritage monuments. Indulge in private suites at JW Marriott Mussoorie, Taj Fort Aguada Goa, and Taj Lake Palace Udaipur.",
      cta: "SEARCH HOTELS & RESORTS",
      href: "/hotels",
      icon: Hotel,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
      features: ["Private Pool Suite Access", "Personal Butler & Concierge", "Campfire Organic Dining", "Direct Helicopter Helipad Clearances"]
    },
    {
      name: "Yacht & Boat Services",
      tagline: "Executive catamarans, sunset motor yachts, & backwater suites",
      desc: "Navigate beautiful coastlines and backwaters aboard elite yachts and sovereign double-deck houseboats. Perfect for corporate shoreline conferences, sunset cruises in Goa, or romantic getaways.",
      cta: "BOOK YACHT CHARTER",
      href: "/boats",
      icon: Ship,
      image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop",
      features: ["Flybridge Sunbeds", "Private Chefs Onboard", "Jetski Attachments Available", "Professional Crew Included"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      
      {/* MakeMyTrip Style Hero Header */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-12 pb-20 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-space text-[10px] uppercase font-bold text-amber-400 tracking-widest">
              Roman Aviation &amp; Tourism Services
            </span>
          </div>
          
          <h1 className="font-space text-3xl md:text-5xl font-bold tracking-tight text-white uppercase">
            Luxury Travel &amp; Aviation Offerings
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mt-2 font-sans">
            Instantly search and book helicopters, bespoke charters, tour packages, luxury hotels, and private yachts.
          </p>
        </div>
      </div>

      {/* Embedded Instant SearchBox Widget */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-10 relative z-30 mb-12">
        <SearchBox />
      </div>

      {/* Main Services List */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-20 flex flex-col gap-10">
        
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md">
          <h2 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">
            All Operational Services &amp; Direct Booking Portals
          </h2>

          <div className="flex flex-col gap-10">
            {servicesList.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:border-[#051433] transition-all grid grid-cols-1 md:grid-cols-12 items-center p-6 gap-6"
                >
                  {/* Service Image */}
                  <div className="md:col-span-5 h-56 relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                    <img src={srv.image} alt={srv.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-[#051433] text-amber-400 p-2.5 rounded-xl shadow">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Service Description & Direct Booking CTA */}
                  <div className="md:col-span-7 flex flex-col gap-3 text-left">
                    <div>
                      <span className="font-space text-[10px] font-bold text-[#051433] uppercase tracking-wider block">
                        {srv.name}
                      </span>
                      <h3 className="font-space text-lg font-bold text-slate-900 leading-snug mt-0.5">
                        {srv.tagline}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      {srv.desc}
                    </p>

                    <div className="grid grid-cols-2 gap-2 my-1">
                      {srv.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 font-bold" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={srv.href}
                      className="self-start mt-2 px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>{srv.cta}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
