"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import API from "@/utils/api";
import SearchBox from "@/components/booking/SearchBox";
import { 
  ShieldCheck, 
  Award, 
  Star, 
  Lock, 
  Headphones, 
  Sparkles, 
  Compass, 
  Helicopter,
  Hotel,
  Ship,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const [dbPackages, setDbPackages] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchHomeTours = async () => {
      try {
        const res = await API.get("/tours");
        if (res.data && res.data.length > 0) {
          setDbPackages(res.data);
        }
      } catch (err) {
        console.error("Failed to query live database tours for homepage:", err);
      }
    };
    fetchHomeTours();
  }, []);

  const benefits = [
    { title: "DGCA Approved Fleet", desc: "Multi-engine IFR certified aircraft", icon: Helicopter },
    { title: "Best Rate Guarantee", desc: "Transparent luxury pricing", icon: Award },
    { title: "Instant Confirmation", desc: "Direct slot reservation", icon: Lock },
    { title: "24/7 Flight Concierge", desc: "Dedicated flight coordinator", icon: Headphones },
  ];

  const pillars = [
    { title: "Safety First", desc: "DGCA approved operators and top safety standards.", icon: ShieldCheck },
    { title: "Pan India Network", desc: "Wide network across major tourist destinations.", icon: Compass },
    { title: "Best Experience", desc: "Luxury, comfort and unforgettable journeys.", icon: Sparkles },
    { title: "Easy Booking", desc: "Simple booking process with instant confirmation.", icon: Lock },
    { title: "Secure Payments", desc: "100% secure payment and data protection.", icon: Lock },
    { title: "24/7 Support", desc: "Our team is always here to assist you.", icon: Headphones },
  ];

  const testimonials = [
    {
      name: "Dev Patel",
      role: "Chairman, Patel International Holdings",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      quote: "Roman Aviation is not just a flight coordinator; they are curators of the sky. We chartered an AW109 shuttle for my international board executives and a catamaran weekend cruise in Goa. The logistics were operated with surgical precision.",
    },
    {
      name: "Ananya Birla",
      role: "Founder, Birla Wellness Group",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      quote: "The Char Dham helicopter tour was exceptional. The priority darshan slots saved us hours, and the mountain lodges they arranged were premium. Truly a luxurious spiritual journey for my family.",
    },
    {
      name: "Vikram Singhania",
      role: "CEO, Singhania Logistics Ltd",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      quote: "Outstanding airport transfers. The Bell 429 helicopter bypassed all traffic, making sure our corporate team arrived at the regional summit right on schedule. Professional crew and exceptional safety standards.",
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#020B1E] text-white">
      
      {/* ─────────────────────────────────────────── */}
      {/* 1. MakeMyTrip Style Hero & Search Section    */}
      {/* ─────────────────────────────────────────── */}
      <section id="booking-section" className="relative bg-gradient-to-b from-[#051433] via-[#092254] to-[#020B1E] pt-8 pb-16 px-4 md:px-8 border-b border-white/10 shadow-2xl z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Title & Tagline Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 self-start mb-2 inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                <span className="font-space text-[10px] uppercase tracking-widest text-gold font-bold">
                  India's Premier Travel Platform
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Elevating Travel <span className="text-gold italic font-normal">Across India</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1.5 font-sans">
                Book Helicopters, Bespoke Charters, Holiday Packages, Luxury Hotels &amp; Yacht Charters in seconds
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-mono text-gold px-4 py-2 rounded-full border border-gold/30 bg-gold/10 font-bold shadow-md">
              <ShieldCheck className="h-4 w-4 text-gold" /> DGCA Certified Flights
            </div>
          </div>

          {/* 🎯 MAKEMYTRIP STYLE SEARCH WIDGET (FRONT & CENTER) */}
          <div className="relative z-30">
            <SearchBox />
          </div>

          {/* Core Trust Badges Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all">
                  <div className="h-9 w-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-space text-[10px] font-bold uppercase tracking-wider text-white">
                      {benefit.title}
                    </h4>
                    <p className="font-sans text-[9px] text-slate-400 mt-0.5 leading-snug">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>



      {/* ─────────────────────────────────────────── */}
      {/* 3. Luxury Services Category Cards Grid        */}
      {/* ─────────────────────────────────────────── */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">
            Luxury Offerings
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
            Explore All Services
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C5A880]" />
            <Helicopter className="h-4.5 w-4.5 text-[#C5A880]" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C5A880]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              name: "Helicopter Booking", 
              desc: "Book helicopter rides across India to your favorite destinations.", 
              cta: "Book Now", 
              href: "/booking", 
              icon: Helicopter, 
              image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600&auto=format&fit=crop",
              alt: "Airbus H135 helicopter parked on premium helipad for charter booking"
            },
            { 
              name: "Tour Packages", 
              desc: "Curated travel packages with helicopter, hotel & activities.", 
              cta: "Explore Packages", 
              href: "/tours", 
              icon: Compass, 
              image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
              alt: "Luxury travel planner brochure and maps on table for Tour Packages"
            },
            { 
              name: "Hotel Booking", 
              desc: "Luxury stays and comfortable hotels at best prices.", 
              cta: "Search Hotels", 
              href: "/hotels", 
              icon: Hotel, 
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
              alt: "Exterior facade of Taj Lake Palace luxury hotel resort in Udaipur"
            },
            { 
              name: "Boat Services", 
              desc: "Enjoy luxury boat rides and water experiences at top destinations.", 
              cta: "Book Yacht", 
              href: "/boats", 
              icon: Ship, 
              image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=600&auto=format&fit=crop",
              alt: "Luxury yacht sailing off the Goa shoreline under a bright blue sky"
            }
          ].map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl overflow-hidden flex flex-col group hover:border-gold/30 transition-all duration-500 relative bg-[#051433] border border-white/10 shadow-lg text-white"
              >
                <div className="h-48 relative overflow-hidden bg-secondary">
                  <Image 
                    src={srv.image} 
                    alt={srv.alt} 
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E]/95 via-transparent to-transparent z-10" />
                </div>
                
                <div className="p-6 pt-8 relative flex-grow flex flex-col justify-between z-20">
                  <div className="absolute -top-6 left-6 h-12 w-12 rounded-full bg-[#051433] border border-gold/30 flex items-center justify-center text-gold shadow-lg">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-space text-sm font-bold uppercase tracking-wider text-white mb-2">
                      {srv.name}
                    </h3>
                    <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4">
                      {srv.desc}
                    </p>
                  </div>

                  <Link
                    href={srv.href}
                    className="flex items-center gap-1 text-[10px] text-gold hover:text-white uppercase tracking-widest font-space font-bold mt-auto transition-colors"
                  >
                    <span>{srv.cta}</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* 4. Why Choose Roman Aviation Trust Section   */}
      {/* ─────────────────────────────────────────── */}
      <section className="py-16 bg-[#051433]/70 border-y border-white/5 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white">
              Why Choose Roman Aviation &amp; Tourism?
            </h2>
            <div className="h-[1px] w-20 bg-gold mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {pillars.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-gold/20 transition-all">
                  <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-3">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-space text-[10px] font-bold uppercase tracking-wider text-white mb-1.5">
                    {pil.title}
                  </h4>
                  <p className="font-sans text-[9px] text-slate-300 leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Roman Aviation",
            "image": "https://romanaviation.in/logo.png",
            "@id": "https://romanaviation.in",
            "url": "https://romanaviation.in",
            "telephone": "+917041861886",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "SHOP NO. 10, RUPAN VILLAGE, RUPAN VILLAGE ROAD",
              "addressLocality": "Surat",
              "postalCode": "394160",
              "addressCountry": "IN"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.95",
              "reviewCount": "58"
            },
            "review": testimonials.map(t => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": t.name
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": String(t.rating)
              },
              "reviewBody": t.quote
            }))
          })
        }}
      />
    </div>
  );
}
