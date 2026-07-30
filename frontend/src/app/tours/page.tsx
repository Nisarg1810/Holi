"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import API from "@/utils/api";
import { TourPackage } from "@/utils/mockData";
import { Check, Star, RefreshCw, Compass, ArrowRight, ShieldCheck, MapPin, Calendar, SlidersHorizontal, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ToursListingContent() {
  const [tourPackages, setTourPackages] = useState<any[]>([]);
  const [filteredTours, setFilteredTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState<TourPackage[]>([]);
  const [compareTrayOpen, setCompareTrayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const res = await API.get("/tours");
        const data = res.data || [];
        setTourPackages(data);
        setFilteredTours(data);
      } catch (err) {
        console.error("Failed to query live tours list:", err);
        setTourPackages([]);
        setFilteredTours([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    let result = [...tourPackages];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.name?.toLowerCase().includes(q) || t.tagline?.toLowerCase().includes(q)
      );
    }
    if (durationFilter !== "all") {
      result = result.filter((t) => t.duration?.toLowerCase().includes(durationFilter));
    }
    setFilteredTours(result);
  }, [searchQuery, durationFilter, tourPackages]);

  const toggleCompare = (pkg: TourPackage) => {
    const isSelected = selectedForCompare.find((p) => p.id === pkg.id);
    if (isSelected) {
      setSelectedForCompare(selectedForCompare.filter((p) => p.id !== pkg.id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], pkg]);
      } else {
        setSelectedForCompare([...selectedForCompare, pkg]);
      }
      setCompareTrayOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F5F8] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 bg-slate-300 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-white p-6 border border-slate-200 h-64 animate-pulse shadow-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      {/* MakeMyTrip Style Navy Hero Header */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-8 pb-16 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-6 gap-4">
            <div>
              <h1 className="font-space text-3xl font-bold tracking-tight text-white">Tour Packages</h1>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Curated pilgrimages & holiday retreats combining VIP helicopter flights, hotels, and road transfers
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-gold px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 font-bold">
              <ShieldCheck className="h-4 w-4 text-gold" /> All Packages Verified
            </div>
          </div>

          {/* MakeMyTrip Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-2xl text-slate-800 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-6 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by package name or destination (e.g. Kedarnath, Goa, Dwarka)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none placeholder-slate-400 font-sans"
              />
            </div>

            <div className="md:col-span-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="all">All Durations</option>
                <option value="3 days">3 Days / 2 Nights</option>
                <option value="4 days">4 Days / 3 Nights</option>
                <option value="5 days">5 Days / 4 Nights</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setDurationFilter("all");
                }}
                className="w-full py-2.5 bg-[#051433] hover:bg-[#092254] text-white font-space font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Listing Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {filteredTours.map((pkg) => {
            const isComparing = selectedForCompare.some((p) => p.id === pkg.id);
            const ratingStr = pkg.rating ? String(pkg.rating) : "5.0";
            const inclusionsList = Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 
              ? pkg.inclusions 
              : ["VIP Priority Access", "Bespoke high-altitude catering"];

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition-all shadow-md hover:shadow-xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 group text-slate-800"
              >
                {/* Package Image & Duration Badge */}
                <div className="sm:col-span-5 h-64 sm:h-auto relative overflow-hidden bg-slate-100 border-r border-slate-200">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#051433] text-white px-3 py-1 rounded-md text-[10px] font-space font-bold tracking-wider uppercase z-10">
                    {pkg.duration}
                  </div>
                </div>

                {/* Package Content & Details */}
                <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold border border-emerald-200">
                        <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
                        <span>{ratingStr}</span>
                      </div>
                      <button
                        onClick={() => toggleCompare(pkg)}
                        className={`flex items-center gap-1 text-[10px] font-space uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          isComparing
                            ? "bg-[#051433] text-white border-[#051433] font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:text-black hover:bg-slate-100"
                        }`}
                      >
                        <RefreshCw className="h-3 w-3" />
                        {isComparing ? "Comparing" : "Compare"}
                      </button>
                    </div>

                    <h3 className="font-space text-lg font-bold text-slate-900 group-hover:text-[#051433] transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-sans mt-1 line-clamp-2">
                      {pkg.tagline || (pkg as any).description || ""}
                    </p>

                    {/* Inclusions Highlights */}
                    <div className="flex flex-col gap-1.5 my-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {inclusionsList.slice(0, 3).map((inc: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="font-sans line-clamp-1">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & MakeMyTrip CTA */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Package Price</span>
                      <div className="font-space text-xl font-bold text-slate-900">
                        ₹{Number(pkg.price).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <Link
                      href={`/tours/${pkg.id}`}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] hover:to-[#C57A2D] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>VIEW DETAILS</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Compare Tray Panel */}
      <AnimatePresence>
        {compareTrayOpen && selectedForCompare.length > 0 && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-6 shadow-2xl text-slate-800"
          >
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="font-space text-sm tracking-wider font-bold text-slate-900 uppercase flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-[#051433]" />
                  Package Comparison Chart
                </span>
                <button
                  onClick={() => setCompareTrayOpen(false)}
                  className="text-xs text-slate-500 hover:text-black font-bold uppercase"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 text-xs text-slate-700 font-sans">
                <div className="flex flex-col gap-3 font-bold border-r border-slate-100 pr-4">
                  <span>Duration</span>
                  <span>Price</span>
                  <span>Inclusions</span>
                </div>

                {selectedForCompare.map((pkg, idx) => (
                  <div key={idx} className="flex flex-col gap-3">
                    <span className="font-bold text-slate-900 truncate">{pkg.name}</span>
                    <span className="text-slate-600">{pkg.duration}</span>
                    <span className="font-bold text-emerald-700">₹{Number(pkg.price).toLocaleString("en-IN")}</span>
                    <span className="text-slate-500 line-clamp-2">
                      {Array.isArray(pkg.inclusions) ? pkg.inclusions.join(", ") : "VIP inclusions"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ToursListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F2F5F8] flex items-center justify-center">Loading Tours...</div>}>
      <ToursListingContent />
    </Suspense>
  );
}
