"use client";

import React, { useState, useEffect } from "react";
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
  ChevronUp,
  Tag,
  Copy,
  CheckCircle,
  Percent,
  Clock,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const [dbHelis, setDbHelis] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursRes, helisRes] = await Promise.all([
          API.get("/tours"),
          API.get("/fleet")
        ]);
        if (toursRes.data) setDbPackages(toursRes.data);
        if (helisRes.data) setDbHelis(helisRes.data);
      } catch (err) {
        console.error("Failed to query live database records for homepage:", err);
      }
    };
    fetchData();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const exclusiveOffers = [
    {
      code: "PILGRIM10",
      title: "Char Dham Pilgrimage Offer",
      desc: "Get flat ₹10,000 OFF per seat on complete 4-shrine Himalayan helicopter charters.",
      discount: "FLAT ₹10,000 OFF",
      category: "Helicopter",
      bgGradient: "from-[#051433] to-[#0D2D6C]",
      border: "border-amber-500/30",
      badgeColor: "bg-amber-500 text-black",
      validTill: "Valid till 15th Aug 2026",
      link: "/booking?destination=Char+Dham+Circuit"
    },
    {
      code: "GOAYACHT20",
      title: "Goa Sunset Cruise Deal",
      desc: "Save 20% on private luxury catamaran charters off the Goa shoreline.",
      discount: "20% DISCOUNT",
      category: "Boats",
      bgGradient: "from-[#051433] to-[#0A3D62]",
      border: "border-blue-500/30",
      badgeColor: "bg-blue-500 text-white",
      validTill: "Valid on all weekend bookings",
      link: "/boats"
    },
    {
      code: "ROMANVIP",
      title: "5-Star Luxury Stay Shuttle",
      desc: "Complimentary helipad airport transfer on JW Marriott & Oberoi Udaivilas bookings.",
      discount: "FREE SHUTTLE",
      category: "Hotels",
      bgGradient: "from-[#051433] to-[#2C3A47]",
      border: "border-emerald-500/30",
      badgeColor: "bg-emerald-500 text-white",
      validTill: "Exclusive for VIP Members",
      link: "/hotels"
    }
  ];

  const stats = [
    { value: "5000+", label: "Happy Passengers", icon: Users },
    { value: "50+", label: "Heliports & Harbors", icon: MapPin },
    { value: "10+", label: "Years Experience", icon: Calendar },
    { value: "100%", label: "DGCA Verified", icon: Award },
  ];

  const faqs = [
    {
      q: "How do I book a private helicopter charter?",
      a: "Simply use our main search bar above to select your departure heliport (e.g. Dehradun), arrival destination (e.g. Kedarnath), travel date, and passenger count. Click 'Search Flight Charters' to select your aircraft and instantly complete checkout.",
    },
    {
      q: "What is your weather cancellation policy?",
      a: "Safety is paramount in VIP aviation. If severe weather or visibility limits flight operations, we offer immediate complimentary rescheduling, model upgrades, or a 100% full transparent refund.",
    },
    {
      q: "Are all flights operated by DGCA-certified crews?",
      a: "Yes. All flights are operated under Non-Scheduled Operator Permit (NSOP No. 24/2026) issued by the Directorate General of Civil Aviation, Government of India, utilizing multi-engine helicopters with dual-pilot command.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 font-sans pb-20">
      
      {/* 1. HERO SECTION: IMMEDIATE SEARCH & BOOKING CARD FIRST */}
      <section className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-10 pb-24 px-4 md:px-8 text-white relative overflow-hidden shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[650px] rounded-full bg-[#F5A623]/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Top Hero Heading */}
          <div className="text-center mb-8 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F5A623]/30 bg-[#F5A623]/10 text-[#F5A623] text-xs font-bold font-mono mb-4 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#F5A623]" />
              <span>India's Premier Luxury Aviation & Travel Portal</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-space text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-4xl"
            >
              Book Helicopter Charters, Tour Packages, Hotels & Yachts
            </motion.h1>

            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-3 max-w-2xl">
              Seamlessly reserve executive flights, sacred yatra packages, 5-star hotel resorts, and private cruises with instant confirmation.
            </p>
          </div>

          {/* MAIN BOOKING WIDGET (FIRST THING EYES GO TO) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <SearchBox />
          </motion.div>

          {/* TOP OFFERS QUICK RIBBON (EYES GO HERE FOR DEALS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {exclusiveOffers.map((offer) => (
              <motion.div
                key={offer.code}
                whileHover={{ y: -3 }}
                className={`bg-gradient-to-br ${offer.bgGradient} border ${offer.border} rounded-2xl p-4 shadow-xl flex flex-col justify-between relative overflow-hidden group text-white`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold font-space uppercase tracking-wider px-2.5 py-0.5 rounded-md ${offer.badgeColor}`}>
                    {offer.discount}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-400" /> {offer.validTill}
                  </span>
                </div>

                <div>
                  <h3 className="font-space text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-1 line-clamp-2 leading-relaxed">
                    {offer.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Code:</span>
                    <button
                      onClick={() => handleCopyCode(offer.code)}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{offer.code}</span>
                      {copiedCode === offer.code ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-300" />
                      )}
                    </button>
                  </div>

                  <Link
                    href={offer.link}
                    className="text-xs font-bold font-space text-[#F5A623] hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <span>Book Deal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. POPULAR BOOKING CATEGORIES & SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 -mt-10 relative z-20">
        <div className="text-center mb-10">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-[#051433] bg-blue-100 px-3 py-1 rounded-full">
            EXPLORE OUR SERVICES
          </span>
          <h2 className="font-space text-2xl md:text-3xl font-bold text-slate-900 mt-2">
            Luxury Travel Booking Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Helicopter Booking",
              desc: "Charter Airbus H145 & Bell 429 helicopters for pilgrimages & airport shuttles.",
              price: "From ₹15,000",
              link: "/booking",
              icon: Helicopter,
              image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600&auto=format&fit=crop"
            },
            {
              title: "Tour Packages",
              desc: "Handcrafted 3 to 5 day retreats with VIP flights, 5-star lodging & transfers.",
              price: "From ₹49,999",
              link: "/tours",
              icon: Compass,
              image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop"
            },
            {
              title: "Luxury Hotels",
              desc: "5-star resort stays with private helipad access in Mussoorie, Goa & Udaipur.",
              price: "From ₹15,000/night",
              link: "/hotels",
              icon: Hotel,
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop"
            },
            {
              title: "Yacht & Boat Charters",
              desc: "Executive catamaran cruises, speedboats & backwater suites.",
              price: "From ₹12,000/hr",
              link: "/boats",
              icon: Ship,
              image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop"
            }
          ].map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition-all shadow-md hover:shadow-xl overflow-hidden flex flex-col justify-between group text-slate-800"
              >
                <div className="h-44 relative overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#051433] text-white p-2 rounded-xl shadow-md">
                    <Icon className="h-4 w-4 text-[#F5A623]" />
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-space text-lg font-bold text-slate-900 group-hover:text-[#051433] transition-colors mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed mb-4">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                    <span className="text-xs font-bold text-slate-900 font-space">{cat.price}</span>
                    <Link
                      href={cat.link}
                      className="px-4 py-2 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl hover:from-[#E49512] transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>BOOK NOW</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING DESTINATIONS & TOUR PACKAGES (LIVE DB RECORDS) */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <span className="font-space text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                LIVE DATABASE RECORDINGS
              </span>
              <h2 className="font-space text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                Trending Pilgrimage & Holiday Packages
              </h2>
            </div>
            <Link
              href="/tours"
              className="text-xs font-bold font-space text-[#051433] hover:text-amber-600 uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>View All Tour Packages</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(dbPackages.length > 0 ? dbPackages : [
              {
                id: "p-1",
                name: "Himalayan Sacred Peaks Pilgrimage",
                tagline: "Dehradun - Kedarnath - Badrinath",
                duration: "3 Days / 2 Nights",
                price: 195000,
                rating: "4.9/5.0",
                image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=600&auto=format&fit=crop"
              },
              {
                id: "p-2",
                name: "Goa Sun & Azure Waves Luxury Retreat",
                tagline: "Beachfront Villa & Yacht Odyssey",
                duration: "4 Days / 3 Nights",
                price: 145000,
                rating: "4.8/5.0",
                image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop"
              }
            ]).map((pkg: any) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -3 }}
                className="bg-[#F8FAFC] rounded-2xl border border-slate-200 hover:border-slate-400 transition-all shadow-sm hover:shadow-lg overflow-hidden flex flex-col justify-between group"
              >
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#051433] text-white text-[10px] font-bold font-mono px-2.5 py-1 rounded-md uppercase">
                    {pkg.duration}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{pkg.rating || "5.0"}</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-space text-base font-bold text-slate-900 group-hover:text-[#051433] transition-colors line-clamp-1 mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-sans line-clamp-2">
                      {pkg.tagline || pkg.description || ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-4">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Package Price</span>
                      <span className="font-space text-base font-bold text-slate-900">
                        ₹{Number(pkg.price).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <Link
                      href={`/tours/${pkg.id}`}
                      className="px-3.5 py-1.5 bg-[#051433] hover:bg-[#092254] text-white font-space text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRUST BADGES & CERTIFICATION CREDENTIALS STRIP */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-[#051433]">
            SAFETY & CREDENTIALS
          </span>
          <h2 className="font-space text-2xl md:text-3xl font-bold text-slate-900 mt-1">
            Why Book With Roman Aviation & Tourism?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col gap-3">
            <div className="h-10 w-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-[#051433]">
              <ShieldCheck className="h-6 w-6 text-[#051433]" />
            </div>
            <h3 className="font-space text-base font-bold text-slate-900">DGCA Authorized Operator</h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Authorized under Non-Scheduled Operator Permit (NSOP No. 24/2026) issued by the Directorate General of Civil Aviation, Government of India.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col gap-3">
            <div className="h-10 w-10 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-amber-600">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-space text-base font-bold text-slate-900">₹50 Crore Insurance Coverage</h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Every passenger flight is backed by comprehensive passenger liability and hull insurance coverage underwritten by leading aviation insurers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col gap-3">
            <div className="h-10 w-10 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center text-emerald-600">
              <Lock className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-space text-base font-bold text-slate-900">256-Bit Encrypted Payments</h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              100% secure payment gateways via Razorpay and PayU, accepting credit cards, UPI, and instant net banking.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="font-space text-2xl md:text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Have questions about booking helicopter charters or yatra packages? We're here to help.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-[#F8FAFC] transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-space text-sm font-bold text-slate-900 flex items-center justify-between cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-[#051433]" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 font-sans leading-relaxed border-t border-slate-200 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
