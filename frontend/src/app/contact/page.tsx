"use client";

import React, { useState } from "react";
import {
  Compass, Mail, Phone, Clock, Send, ShieldAlert, CheckCircle, Search, HelpCircle,
  ChevronDown, ChevronUp, MapPin, Award, Check, Calendar, Users, Target, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeroBanner from "@/components/ui/PageHeroBanner";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && msg) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setName("");
        setEmail("");
        setMsg("");
      }, 3000);
    }
  };

  const coreValues = [
    {
      title: "Premium Helicopter Services",
      desc: "Safe, Reliable & Comfortable high-altitude charters operated under strict DGCA certifications and dual-pilot requirements."
    },
    {
      title: "Scenic Tour Packages",
      desc: "Handcrafted journeys and sacred spiritual mountain tours across India's most breathtaking cultural and wilderness destinations."
    },
    {
      title: "Hotels & Cruise Bookings",
      desc: "Complete travel solutions featuring premier lakeside retreats, heritage lodges, and sunset luxury yacht services at one place."
    },
  ];

  const timeline = [
    { year: "2020", title: "Flight Inception", desc: "Founded Roman Aviation in New Delhi with 1 light utility helicopter, catering to private regional transits." },
    { year: "2022", title: "Himalayan Corridor Launch", desc: "Expanded the fleet to 3 multi-engine turbine helicopters and launched daily priority corridors to Kedarnath & Badrinath." },
    { year: "2024", title: "Yachts & ISO Standards", desc: "Earned ISO 9001:2015 safety certification and launched the Goan luxury yacht charter division." },
    { year: "2026", title: "National Air Ambulance & Elite Concierge", desc: "Integrated medical evacuation helicopters and launched bespoke HNWI elite travel concierge systems." }
  ];

  const fleet = [
    {
      name: "Airbus H145",
      type: "Twin-Engine Utility",
      specs: { Capacity: "4 Guests", Speed: "240 km/h", Ceiling: "20,000 ft", Avionics: "Helionix Suite" },
      desc: "The pinnacle of high-altitude luxury, complete with vibration containment and scenic panorama glass windows.",
      image: "https://images.unsplash.com/photo-1583244532610-2a234e7c3eca?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Bell 429",
      type: "Light Twin Engine",
      specs: { Capacity: "6 Guests", Speed: "273 km/h", Ceiling: "18,700 ft", Avionics: "P&W Glass Cockpit" },
      desc: "Twin-engine security combined with an elegant flat-floor cabin, perfect for coastal shoreline shuttle flights.",
      image: "https://images.unsplash.com/photo-1612459284970-e8f027596582?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Augusta AW109",
      type: "High-Speed Executive",
      specs: { Capacity: "5 Guests", Speed: "285 km/h", Ceiling: "15,000 ft", Avionics: "3-Axis Autopilot" },
      desc: "Aerodynamic corporate transport featuring fully retractable landing gear for rapid city shuttle lanes.",
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const offices = [
    { city: "Corporate Head Office", address: "SHOP NO. 10, RUPAN VILLAGE, RUPAN VILLAGE ROAD, SURAT 394160", phone: "+91 70418 61886" },
  ];

  const faqs = [
    {
      q: "What is the maximum baggage weight per passenger?",
      a: "Due to high-altitude flight safety dynamics and weight balance limits, individual baggage is limited to 10 kg per passenger. Soft duffel bags are highly recommended instead of hard shell trolley suitcases."
    },
    {
      q: "How are weather delays managed on spiritual mountain routes?",
      a: "Passenger safety is our absolute priority. In case of unfavorable weather coordinates or cloud ceiling warnings at Kedarnath or Badrinath, flights are put on priority standby. Rescheduling is provided at no extra cost, or a transparent refund is calculated."
    },
    {
      q: "Can we request custom gourmet catering or wheelchair assistance?",
      a: "Yes, you can specify custom preferences. Our flight concierges can coordinate gourmet vegetarian/Vedic box meals, priority porter passes for darshan, and wheelchair staging at helipads."
    },
    {
      q: "What certifications do Roman Aviation helicopters hold?",
      a: "All aircraft are operated under Non-Scheduled Operator Permits (NSOP) authorized by the DGCA, maintaining rigorous mechanical inspections and double-pilot cockpit redundancy protocols."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      
      {/* ── Hero Banner ────────────────────────────────────────── */}
      <PageHeroBanner
        imageSrc="/banners/contact-banner.jpg"
        imageAlt="Roman Aviation Contact - Helicopter Operations"
        label="Flight Concierge & Heritage"
        title="Contact & Corporate Desk"
        subtitle="Establish flight routes, review our luxury fleet, or connect with our dispatch offices."
        height={500}
        paperColor="#F2F5F8"
      />

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 flex flex-col gap-20">
        
        {/* ── Part 1: Contact Form & Main Offices ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Dispatch Inquiry Form (Left) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xl">
            <h2 className="font-space text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#051433]" /> Send Dispatch Inquiry
            </h2>

            {formSubmitted ? (
              <div className="text-center py-16 flex flex-col gap-4 items-center justify-center">
                <CheckCircle className="h-12 w-12 text-emerald-500 animate-bounce" />
                <h4 className="font-space text-base font-bold text-slate-900">Inquiry Forwarded Successfully</h4>
                <p className="font-sans text-xs text-slate-500 max-w-sm">
                  Our private travel concierge has queued your request and will contact your office in less than 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">FullName *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dev Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#051433]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="dev@patelcorp.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#051433]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Details &amp; Route Requirements *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your desired flight path, passenger count, preferred helicopter model, and scheduling requirements..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#051433] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3.5 bg-[#051433] hover:bg-[#092254] text-white rounded-xl font-space font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md"
                >
                  <span>Dispatch Inquiry Request</span>
                  <Send className="h-4 w-4 text-amber-400" />
                </button>
              </form>
            )}
          </div>

          {/* Location & Credentials (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl flex flex-col gap-5">
              <h3 className="font-space text-sm uppercase tracking-wider font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-[#051433]" /> Headquarters Address
              </h3>

              <div className="flex flex-col gap-6">
                {offices.map((of, i) => (
                  <div key={i} className="flex flex-col gap-1.5 font-sans text-xs text-slate-600">
                    <span className="font-space text-xs font-bold text-slate-900 uppercase">{of.city}</span>
                    <p className="leading-relaxed mt-0.5">{of.address}</p>
                    <span className="text-xs text-amber-600 font-mono mt-1 font-bold">Phone: {of.phone}</span>
                  </div>
                ))}
              </div>

              <div className="h-[1px] bg-slate-100 my-1" />

              {/* Emergency Heli-Rescue Box */}
              <div className="flex gap-3 bg-red-500/5 border border-red-500/10 p-4 rounded-xl text-xs font-sans text-slate-600 leading-relaxed">
                <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                <div>
                  <span className="text-red-600 font-bold block mb-0.5 uppercase tracking-wider font-space text-[10px]">24/7 Air Evac Emergency</span>
                  For instant search and rescue staging coordinates or mountain medical airlifts: <br />
                  <span className="font-bold text-slate-900 block mt-1">Call +91 70418 61886</span>
                </div>
              </div>

              {/* Tax Details */}
              <div className="flex items-center gap-3 bg-[#051433]/5 border border-slate-200 p-4 rounded-xl text-xs font-sans text-slate-600">
                <Award className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 block leading-none mb-1">Corporate Registration</span>
                  <span className="font-mono text-slate-800 font-bold text-[11px]">GST IN: 24AAPCR7672B1Z6</span>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xl overflow-hidden h-[240px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.6644781498616!2d77.08182967630043!3d28.549806475711684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1bf47b0e14a1%3A0xe21287c9362e524d!2sIndira%20Gandhi%20International%20Airport%20Terminal%203!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "0.75rem" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* ── Part 2: Corporate Pillars / Philosophy ─────────────── */}
        <section className="flex flex-col gap-8 text-center border-t border-slate-200 pt-16">
          <div>
            <span style={{ color: '#C5A880' }} className="font-space text-xs uppercase tracking-widest text-gold font-bold">
              Roman Philosophy
            </span>
            <h2 className="font-space text-2xl md:text-3xl font-bold text-slate-900 mt-2">Fly Beyond The Ordinary</h2>
            <div className="h-[1.5px] w-12 bg-amber-500 mx-auto mt-3" />
            <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto mt-4">
              Established in 2020, Roman Aviation &amp; Tourism was founded to redefine private regional transit. We cater to guests demanding seamless helicopter transits, elite concierge coordinates, and uncompromised flight safety dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 text-left">
            {coreValues.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg flex flex-col gap-4">
                <div className="h-10 w-10 rounded-full bg-[#051433]/5 border border-[#051433]/20 flex items-center justify-center text-[#051433] shrink-0">
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="font-space text-sm uppercase tracking-wider font-bold text-slate-900">{v.title}</h3>
                <p className="font-sans text-xs text-slate-500 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Part 3: Company Timeline & Milestones ─────────────── */}
        <section className="flex flex-col gap-8 border-t border-slate-200 pt-16">
          <div className="text-center">
            <span className="font-space text-xs uppercase tracking-widest text-gold font-bold">Our Journey</span>
            <h2 className="font-space text-2xl md:text-3xl font-bold text-slate-900 mt-2">Timeline &amp; Milestones</h2>
            <div className="h-[1.5px] w-12 bg-amber-500 mx-auto mt-3" />
          </div>

          <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-8 max-w-3xl mx-auto text-xs font-sans">
            {timeline.map((mile, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[32px] top-0 h-4 w-4 rounded-full bg-[#051433] border-4 border-[#F2F5F8]" />
                <div className="font-space text-sm font-bold text-amber-500">{mile.year}</div>
                <h4 className="font-space text-sm font-bold text-slate-900 mt-0.5">{mile.title}</h4>
                <p className="text-slate-500 leading-relaxed mt-1">{mile.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Part 4: Aircraft Fleet Details ─────────────────────── */}
        <section className="flex flex-col gap-8 border-t border-slate-200 pt-16">
          <div className="text-center">
            <span className="font-space text-xs uppercase tracking-widest text-gold font-bold">Our Fleet</span>
            <h2 className="font-space text-2xl md:text-3xl font-bold text-slate-900 mt-2">Aircraft Fleet Specifications</h2>
            <div className="h-[1.5px] w-12 bg-amber-500 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fleet.map((aircraft, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-slate-200 bg-white flex flex-col group shadow-md hover:shadow-xl transition-all duration-300">
                <div className="h-44 relative bg-slate-100 overflow-hidden">
                  <img src={aircraft.image} alt={aircraft.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                </div>
                <div className="p-5 text-left flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-space text-base font-bold text-slate-900">{aircraft.name}</h4>
                    <span className="font-space text-[9px] uppercase tracking-wider text-amber-500 font-bold block mb-2">{aircraft.type}</span>
                    <p className="font-sans text-xs text-slate-500 leading-relaxed mb-4">{aircraft.desc}</p>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex flex-col gap-1.5 font-mono text-[10px] text-slate-500">
                    {Object.entries(aircraft.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="opacity-70">{key}:</span>
                        <span className="text-slate-800 font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Part 5: FAQs Section ─────────────────────────────── */}
        <section className="flex flex-col gap-8 border-t border-slate-200 pt-16">
          <div className="text-center flex flex-col items-center">
            <span style={{ color: '#C5A880' }} className="font-space text-xs uppercase tracking-widest text-gold font-bold">FAQ Desk</span>
            <h2 className="font-space text-2xl md:text-3xl font-bold text-slate-900 mt-2">Common Booking Inquiries</h2>
            <div className="h-[1.5px] w-12 bg-amber-500 mt-4" />
          </div>

          <div className="max-w-4xl mx-auto w-full flex flex-col gap-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4.5 flex items-center justify-between gap-4 text-left font-space text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-amber-500 cursor-pointer transition-colors"
                  >
                    <span style={{ color: isOpen ? '#D68B3E' : '#1E293B' }} className="flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 shrink-0 text-[#051433]" />
                      {faq.q}
                    </span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-[#051433] shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100 bg-slate-50/50"
                      >
                        <p className="px-6 py-4 font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
