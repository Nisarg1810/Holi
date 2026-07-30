"use client";

import React from "react";
import { Compass, Award, ShieldCheck, Users, Check, PlaneTakeoff, Phone, Mail, Globe, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const coreValues = [
    { 
      title: "Premium Helicopter Charters", 
      desc: "Safe, reliable, and comfortable high-altitude helicopter shuttles operated under strict DGCA certifications and dual-pilot requirements." 
    },
    { 
      title: "Scenic Tour Packages", 
      desc: "Handcrafted spiritual mountain tours and coastal odysseys across India's most breathtaking pilgrimage and wilderness destinations." 
    },
    { 
      title: "Hotels & Yacht Charters", 
      desc: "Complete travel solutions featuring premier luxury hotel stays, heritage retreats, and private sunset yacht services in Goa." 
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      
      {/* MakeMyTrip Style Hero Header */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-12 pb-20 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-space text-[10px] uppercase font-bold text-amber-400 tracking-widest">
              Roman Aviation Philosophy
            </span>
          </div>
          
          <h1 className="font-space text-3xl md:text-5xl font-bold tracking-tight text-white uppercase">
            Elevating Travel Across India
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mt-2 font-sans">
            Curating bespoke air, land, and water journeys with uncompromised safety dynamics and military-grade precision.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-8 relative z-20 flex flex-col gap-10">
        
        {/* Main Hangar Showcase Image */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative h-[300px] sm:h-[400px] lg:h-[450px]">
          <Image 
            src="/luxury_hangar_about.png" 
            alt="Roman Aviation Private Hangar Base" 
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051433]/90 via-[#051433]/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
            <div>
              <span className="font-space text-[10px] uppercase tracking-widest text-amber-400 font-bold">Base of Operations</span>
              <h2 className="font-space text-xl sm:text-2xl font-bold text-white mt-0.5">State-of-the-Art Private Hangars</h2>
            </div>
            <p className="text-xs text-slate-300 font-sans max-w-xs leading-relaxed">
              Climate-controlled maintenance hangars housing our fleet under constant telemetry and mechanical inspection.
            </p>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md">
          <h2 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">
            Bespoke Travel Pillars
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((v, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col gap-3 hover:border-[#051433] transition-all">
                <div className="h-10 w-10 rounded-xl bg-[#051433] text-amber-400 flex items-center justify-center font-bold">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-space text-sm font-bold text-slate-900 uppercase tracking-wider">{v.title}</h3>
                <p className="font-sans text-xs text-slate-600 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Company Timeline & Milestones */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md flex flex-col gap-6">
          <h2 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3">
            Company Timeline &amp; Milestones
          </h2>

          <div className="relative border-l-2 border-slate-200 pl-6 ml-3 space-y-6 text-xs font-sans">
            {[
              { year: "2020", title: "Flight Inception", desc: "Founded Roman Aviation in New Delhi with 1 light utility helicopter, catering to private regional transits." },
              { year: "2022", title: "Himalayan Corridor Launch", desc: "Expanded the fleet to 3 multi-engine turbine helicopters and launched daily priority corridors to Kedarnath & Badrinath." },
              { year: "2024", title: "Yachts & ISO Standards", desc: "Earned ISO 9001:2015 safety certification and launched the Goan luxury yacht charter division." },
              { year: "2026", title: "National Air Ambulance & Elite Concierge", desc: "Integrated medical evacuation helicopters and launched bespoke HNWI elite travel concierge systems." }
            ].map((mile, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-[#051433] border-2 border-amber-400" />
                <span className="font-space text-sm font-bold text-[#051433]">{mile.year}</span>
                <h4 className="font-space text-sm font-bold text-slate-900 mt-0.5">{mile.title}</h4>
                <p className="text-slate-600 leading-relaxed mt-1">{mile.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Specifications Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md flex flex-col gap-6">
          <h2 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3">
            Fleet Specifications &amp; Avionics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Airbus H145",
                type: "Twin-Engine Utility",
                specs: { Capacity: "4 VIPs", Speed: "240 km/h", Ceiling: "20,000 ft", Avionics: "Helionix Suite" },
                desc: "High-altitude luxury helicopter equipped with dual autopilot and vibration containment.",
                image: "https://images.unsplash.com/photo-1681281896815-bfa3b9b47e2b?q=80&w=600&auto=format&fit=crop"
              },
              {
                name: "Bell 429",
                type: "Light Twin Engine",
                specs: { Capacity: "6 VIPs", Speed: "273 km/h", Ceiling: "18,700 ft", Avionics: "P&W Glass Cockpit" },
                desc: "Twin-engine security combined with an elegant flat-floor cabin, perfect for coastal shuttle flights.",
                image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=600&auto=format&fit=crop"
              },
              {
                name: "Agusta AW109",
                type: "High-Speed Executive",
                specs: { Capacity: "5 VIPs", Speed: "285 km/h", Ceiling: "15,000 ft", Avionics: "3-Axis Autopilot" },
                desc: "Aerodynamic corporate transport featuring retractable landing gear for rapid city shuttle lanes.",
                image: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=600&auto=format&fit=crop"
              }
            ].map((aircraft, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col justify-between group hover:border-[#051433] transition-all">
                <div className="h-44 relative overflow-hidden bg-slate-100 border-b border-slate-200">
                  <Image src={aircraft.image} alt={aircraft.name} fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                
                <div className="p-5 flex flex-col justify-between flex-grow text-left">
                  <div>
                    <h4 className="font-space text-base font-bold text-slate-900">{aircraft.name}</h4>
                    <span className="font-space text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-2">{aircraft.type}</span>
                    <p className="font-sans text-xs text-slate-600 leading-relaxed mb-4">{aircraft.desc}</p>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-3 flex flex-col gap-1.5 font-mono text-[10px] text-slate-600">
                    {Object.entries(aircraft.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-400">{key}:</span>
                        <span className="text-slate-900 font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Credentials Card */}
        <div className="bg-[#051433] rounded-3xl p-8 border border-[#051433] text-white grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xl">
          <div className="md:col-span-7 flex flex-col gap-3 text-left">
            <span className="font-space text-xs text-amber-400 font-bold uppercase tracking-wider">Mission Statement</span>
            <h2 className="font-space text-2xl md:text-3xl font-bold uppercase text-white">Your Journey, Our Priority</h2>
            <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-lg">
              From spiritual pilgrimages to coastal yacht expeditions, we deliver world-class safety and luxury transits.
            </p>
            <div className="flex flex-col gap-2 mt-2 text-xs text-slate-200 font-sans">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Multi-Engine Turbine Helicopter Mandate</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Strict Balance &amp; Weight Safety Protocols</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>VIP Airport Terminal Transfers &amp; Lounges</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4 text-xs font-sans text-slate-200">
            <span className="font-space text-[10px] uppercase font-bold text-amber-400">Corporate Credentials</span>
            
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <span>+91 70418 61886</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="truncate">info@romanaviation.in</span>
              </div>
              <div className="flex items-center gap-3 border-t border-white/10 pt-2.5">
                <span className="font-bold text-amber-400 font-space text-[10px] uppercase">GSTIN:</span>
                <span className="font-mono text-white font-bold">24AAPCR7672B1Z6</span>
              </div>
            </div>

            <Link
              href="/contact"
              className="w-full py-3 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider text-center rounded-xl shadow-md transition-all mt-2"
            >
              Contact Flight Concierge
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
