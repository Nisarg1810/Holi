"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import API from "@/utils/api";
import SearchBox from "@/components/booking/SearchBox";
import { 
  ShieldCheck, 
  Award, 
  Star, 
  HelpCircle, 
  PlaneTakeoff, 
  Ship, 
  Hotel, 
  Users, 
  MapPin, 
  Calendar, 
  Lock, 
  Headphones, 
  Sparkles, 
  Compass, 
  Helicopter,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const stats = [
    { value: "5000+", label: "Happy Customers", icon: Users },
    { value: "50+", label: "Destinations", icon: MapPin },
    { value: "10+", label: "Years of Experience", icon: Calendar },
    { value: "100+", label: "Travel Partners", icon: Award },
  ];

  const benefits = [
    { title: "Premium Helicopters", desc: "DGCA approved fleet", icon: Helicopter },
    { title: "Best Price Guarantee", desc: "Match charter rates", icon: Award },
    { title: "Secure Payments", desc: "100% secure bookings", icon: Lock },
    { title: "24/7 Customer Support", desc: "Dedicated flight concierges", icon: Headphones },
  ];

  const pillars = [
    { title: "Safety First", desc: "DGCA approved operators and top safety standards.", icon: ShieldCheck },
    { title: "Pan India Network", desc: "Wide network across major tourist destinations.", icon: Compass },
    { title: "Best Experience", desc: "Luxury, comfort and unforgettable journeys.", icon: Sparkles },
    { title: "Easy Booking", desc: "Simple booking process with instant confirmation.", icon: Calendar },
    { title: "Secure Payments", desc: "100% secure payment and data protection.", icon: Lock },
    { title: "24/7 Support", desc: "Our team is always here to assist you.", icon: Headphones },
  ];

  const popularPackages = [
    {
      id: "pkg-kedarnath",
      name: "Kedarnath Yatra",
      type: "Helicopter Package",
      badge: "3 Days / 2 Nights",
      badgeColor: "bg-[#C5A880] text-black",
      price: "₹ 49,999",
      personLabel: "/ Person",
      image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=600&auto=format&fit=crop",
      route: "Dehradun - Kedarnath - Dehradun",
      cta: "View Details"
    },
    {
      id: "pkg-chardham",
      name: "Char Dham Yatra",
      type: "Helicopter Package",
      badge: "4 Days / 3 Nights",
      badgeColor: "bg-[#4B6B40] text-white",
      price: "₹ 1,29,999",
      personLabel: "/ Person",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop",
      route: "Dehradun - Yamunotri - Gangotri - Kedarnath - Badrinath",
      cta: "View Details"
    },
    {
      id: "pkg-vaishnodevi",
      name: "Vaishno Devi",
      type: "Helicopter Package",
      badge: "2 Days / 1 Night",
      badgeColor: "bg-[#C5A880] text-black",
      price: "₹ 39,999",
      personLabel: "/ Person",
      image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=600&auto=format&fit=crop",
      route: "Katra - Vaishno Devi - Katra",
      cta: "View Details"
    },
    {
      id: "pkg-custom",
      name: "Custom Luxury",
      type: "Holiday Package",
      badge: "Custom Package",
      badgeColor: "bg-[#D68B3E] text-black",
      price: "Bespoke",
      personLabel: "Pricing",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      route: "Plan your own journey with customized experiences.",
      cta: "Customize Now"
    }
  ];

  const testimonials = [
    {
      name: "Dev Patel",
      role: "Chairman, Patel International Holdings",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      quote: "Roman Aviation is not just a flight coordinator; they are curators of the sky. We chartered an AW109 shuttle for my international board executives and a catamaran weekend cruise in Goa. The logistics were operated with surgical precision, complete with custom labels and premium catering.",
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
    },
    {
      name: "Sarah Jenkins",
      role: "Executive VP, Global Luxury Travels",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
      quote: "I recommend Roman Aviation to all our premium international clients. Their attention to detail, private lounges, and state-of-the-art DGCA-certified fleet are second to none in the country.",
    },
    {
      name: "Rajesh Kurup",
      role: "Director, Sacred India Expeditions",
      rating: 5,
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
      quote: "The Katra to Vaishno Devi flight was seamlessly executed. The team went out of their way to provide wheelchair staging for my elderly parents. Highly recommended for spiritual pilgrimages.",
    }
  ];



  return (
    <div className="relative min-h-screen bg-[#020B1E] text-white">
      {/* Background Mountain overlay (Optimized Next Image) */}
      <div className="absolute inset-0 opacity-5 mix-blend-lighten pointer-events-none z-0">
        <Image 
          src="https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=1920&auto=format&fit=crop" 
          alt="Himalayan mountain peaks backdrop" 
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020B1E]/80 to-[#020B1E] pointer-events-none z-0" />

      {/* 1. Cinematic Hero Section */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left column text content */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C5A880]/20 bg-[#C5A880]/5 self-start"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold glow-gold" />
            <span className="font-space text-[10px] uppercase tracking-widest text-gold font-bold">
              India's Premier Luxury Aviation Brand
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-6.5xl font-bold tracking-tight leading-[1.1]"
          >
            Elevating Travel <br />
            <span className="text-gold italic font-normal">Across India</span> <br />
            by Air, Land & Water
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-sans text-sm md:text-base text-[#cbd5e1] leading-relaxed max-w-xl"
          >
            Experience India like never before with our premium helicopter tours, curated travel packages, hotels and boat services.
          </motion.p>

          {/* Flyer bullet points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col gap-4.5 my-2 text-xs font-sans text-slate-300"
          >
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/45 flex items-center justify-center text-gold shrink-0 mt-0.5">
                <Helicopter className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold uppercase tracking-wider text-white text-[11px] block">Premium Helicopter Services</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Safe, Reliable & Comfortable</span>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/45 flex items-center justify-center text-gold shrink-0 mt-0.5">
                <Compass className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold uppercase tracking-wider text-white text-[11px] block">Scenic Tour Packages</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Explore breathtaking destinations</span>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/45 flex items-center justify-center text-gold shrink-0 mt-0.5">
                <Hotel className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold uppercase tracking-wider text-white text-[11px] block">Hotels & Cruise Bookings</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Complete travel solutions at one place</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions (CTA Visual Hierarchy) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            {/* Dominant Primary Solid Gold CTA */}
            <Link
              href="/booking"
              className="flex items-center gap-2 px-8 py-3.5 bg-gold hover:bg-[#E3C69D] text-black font-space text-xs font-bold uppercase tracking-widest rounded border border-gold transition-all duration-300 shadow-lg shadow-gold/20"
            >
              <span>Book Helicopter Now</span>
              <Helicopter className="h-4 w-4" />
            </Link>
            {/* Downgraded Outline Secondary CTA */}
            <Link
              href="/tours"
              className="flex items-center gap-2 px-8 py-3.5 border border-white/20 hover:border-gold hover:text-gold hover:bg-transparent font-space text-xs text-white uppercase tracking-widest rounded transition-all duration-300"
            >
              <span>Explore Packages</span>
              <Compass className="h-4 w-4 text-[#C5A880]" />
            </Link>
          </motion.div>

          {/* Core metrics counters / benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/5 pt-8 mt-6"
          >
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex flex-col gap-1.5 p-3 rounded-lg bg-white/2 border border-white/5 hover:border-gold/15 transition-all duration-300">
                  <div className="h-7 w-7 rounded bg-gold/10 flex items-center justify-center text-gold">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-space text-[10px] font-bold uppercase tracking-wider text-white">
                      {benefit.title}
                    </h4>
                    <p className="font-sans text-[9px] text-[#cbd5e1] mt-0.5 leading-snug">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right column: Large Helicopter Scenic Image (Optimized Next Image) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="lg:col-span-5 relative w-full h-[350px] sm:h-[450px] lg:h-[500px] flex items-center justify-center rounded-2xl overflow-hidden border border-white/10 shadow-2xl group"
        >
          <Image 
            src="/luxury_helicopter_hero_1783848402751.png" 
            alt="Airbus H145 helicopter over Himalayan mountains for Kedarnath route" 
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020B1E]/90 via-transparent to-transparent z-10" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-card border border-white/10 backdrop-blur-md z-20">
            <span className="font-space text-[9px] text-gold uppercase tracking-widest font-bold">Featured Airbus H145</span>
            <h4 className="font-serif text-sm font-semibold text-white mt-1">Himalayan Luxury Pilgrimage Route</h4>
            <p className="text-[10px] text-slate-300 font-sans mt-0.5">High altitude certified cabin with dynamic autopilot safety configuration.</p>
          </div>
        </motion.div>
      </section>

      {/* 2. Global Quick Search Panel */}
      <section className="px-6 relative z-30 -mt-10 mb-12 max-w-7xl mx-auto">
        <SearchBox />
      </section>

      {/* Exclusive Season Offers Banner */}
      <section className="px-6 max-w-7xl mx-auto mb-16 relative z-20">
        <div className="bg-gradient-to-r from-[#051433] via-[#092254] to-[#051433] border border-amber-400/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="font-space text-[10px] font-bold uppercase tracking-widest text-amber-400 block">EXCLUSIVE SEASON OFFERS</span>
              <h3 className="font-space text-base md:text-lg font-bold text-white">Save Up to ₹15,000 Extra on Char Dham &amp; Bespoke Charters</h3>
              <p className="text-xs text-slate-300 font-sans mt-0.5">Use promo code <strong className="text-amber-400 font-mono">CHARDHAM2026</strong> or <strong className="text-amber-400 font-mono">AURA10</strong> at checkout</p>
            </div>
          </div>

          <Link
            href="/booking"
            className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shrink-0 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Claim Offer</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 3. Our Services Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <span className="font-space text-xs uppercase tracking-widest text-[#C5A880] font-bold">
            Luxury Offerings
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
            Our Services
          </h2>
          {/* Custom Gold Divider */}
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
              cta: "Explore Now", 
              href: "/tours", 
              icon: Compass, 
              image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
              alt: "Luxury travel planner brochure and maps on table for Tour Packages"
            },
            { 
              name: "Hotel Booking", 
              desc: "Luxury stays and comfortable hotels at best prices.", 
              cta: "Book Hotel", 
              href: "/hotels", 
              icon: Hotel, 
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
              alt: "Exterior facade of Taj Lake Palace luxury hotel resort in Udaipur"
            },
            { 
              name: "Boat Services", 
              desc: "Enjoy luxury boat rides and water experiences at top destinations.", 
              cta: "Book Now", 
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
                className="rounded-xl overflow-hidden flex flex-col group hover:border-gold/30 transition-all duration-500 relative bg-[#051433] border border-white/5 shadow-lg text-white"
              >
                {/* Optimized Next Image */}
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
                  {/* Circular Gold Icon Badge */}
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

      {/* 4. Why Choose Roman Aviation Banner */}
      <section className="py-16 bg-[#051433]/70 border-y border-white/5 relative overflow-hidden z-10">
        {/* Ambient glow in banner */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-gold/5 blur-[80px] pointer-events-none" />


        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white">
              Why Choose Roman Aviation & Tourism?
            </h2>
            <div className="h-[1px] w-20 bg-gold mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {pillars.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4 bg-white/2 rounded-lg border border-white/5 hover:border-gold/15 transition-all">
                  <div className="h-10 w-10 rounded-full bg-gold/5 border border-gold/25 flex items-center justify-center text-gold mb-3">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-space text-[10px] font-bold uppercase tracking-wider text-white mb-1.5">
                    {pil.title}
                  </h4>
                  <p className="font-sans text-[9px] text-[#cbd5e1] leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>












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


