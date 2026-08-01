"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/utils/api";
import { BoatListing } from "@/utils/mockData";
import { useCartStore } from "@/store/useCartStore";
import {
  Star, Anchor, ShieldCheck, Check, Calendar, Users, Clock,
  ArrowRight, Ship, MapPin, Search, Filter, AlertTriangle, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SearchBox from "@/components/booking/SearchBox";

const DESTINATIONS = [
  "Goa Harbor, Panaji, Goa",
  "Mandovi River, Panjim, Goa",
  "Dashashwamedh Ghat, Varanasi",
  "Alleppey (Alappuzha) Backwaters, Kerala",
  "Port Blair Marina, Andaman Islands",
  "Gateway of India, Mumbai, Maharashtra",
];

const CHARTER_TYPES = [
  "Motor Yacht", "Luxury Houseboat", "Executive Catamaran",
  "Speedboat", "Premium Schooner", "Traditional Shikara", "Motor Cruiser"
];

function BoatsListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setItem = useCartStore((state) => state.setItem);

  const [boatsList, setBoatsList] = useState<BoatListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States (Synced with URL parameter or user changes)
  const [paramDestination, setParamDestination] = useState(searchParams.get("destination") || "");
  const [filterType, setFilterType] = useState(searchParams.get("type") || "");
  const [selectedDate, setSelectedDate] = useState(searchParams.get("date") || new Date().toISOString().split("T")[0]);
  const [filterGuests, setFilterGuests] = useState(Number(searchParams.get("guests")) || 2);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "rating">("rating");

  // Collapsible change search form state
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchDest, setSearchDest] = useState(paramDestination);
  const [searchType, setSearchType] = useState(filterType);
  const [searchDate, setSearchDate] = useState(selectedDate);
  const [searchGuests, setSearchGuests] = useState(filterGuests);

  // Sync state if URL changes directly
  useEffect(() => {
    setParamDestination(searchParams.get("destination") || "");
    setFilterType(searchParams.get("type") || "");
    setSelectedDate(searchParams.get("date") || new Date().toISOString().split("T")[0]);
    setFilterGuests(Number(searchParams.get("guests")) || 2);
  }, [searchParams]);

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        setLoading(true);
        const res = await API.get("/boats");
        if (res.data && res.data.length > 0) {
          const loaded: BoatListing[] = res.data.map((dbBoat: any) => ({
            ...dbBoat,
            location: dbBoat.location || "Goa, India",
            duration: "Per Charter",
            features: dbBoat.features && dbBoat.features.length > 0
              ? dbBoat.features
              : ["Private Captain & Crew", "Onboard Refreshments", "Safety Equipment"],
            capacity: Number(dbBoat.capacity) || 6,
            reviews: dbBoat.reviews || [],
          }));
          setBoatsList(loaded);
        } else {
          setBoatsList([]);
        }
      } catch (err) {
        console.error("Failed to fetch live boats database:", err);
        setBoatsList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBoats();
  }, []);

  const [hoursSelected, setHoursSelected] = useState<{ [boatId: string]: number }>({});
  const getHours = (boatId: string) => hoursSelected[boatId] || 3;

  const handleBookBoat = (boat: BoatListing) => {
    const hours = getHours(boat.id);
    const finalPrice = Number(boat.price) * hours;
    const paramFareType = searchParams.get("fare_type") || "Regular";
    const paramGstNumber = searchParams.get("gst_number") || "";
    setItem({
      type: "boat",
      id: boat.id,
      name: boat.name,
      price: finalPrice,
      date: selectedDate,
      passengers: filterGuests,
      details: `${boat.location} — ${boat.type || "Luxury Charter"} · ${hours} Hours`,
      duration: `${hours} Hours Charter`,
      image: boat.image,
      fare_type: paramFareType,
      gst_number: paramGstNumber,
    });
    router.push("/checkout");
  };

  const updateHours = (boatId: string, val: number) => {
    setHoursSelected({ ...hoursSelected, [boatId]: Math.max(1, Math.min(24, val)) });
  };

  // Submit Handler inside Search panel
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParamDestination(searchDest);
    setFilterType(searchType);
    setSelectedDate(searchDate);
    setFilterGuests(searchGuests);

    const params = new URLSearchParams();
    if (searchDest) params.set("destination", searchDest);
    if (searchType) params.set("type", searchType);
    if (searchDate) params.set("date", searchDate);
    params.set("guests", String(searchGuests));
    router.push(`/boats?${params.toString()}`);
    setShowSearchBox(false);
  };

  // ─── Filtering Logic ──────────────────────────────────────────────────
  // 1. Try exact filtering (Type + Capacity + Destination)
  const exactFiltered = boatsList.filter((b) => {
    if (filterType && b.type && !b.type.toLowerCase().includes(filterType.toLowerCase())) return false;
    if (filterGuests && Number(b.capacity) < filterGuests) return false;
    
    if (paramDestination) {
      const dest = paramDestination.toLowerCase().split(",")[0].trim();
      const loc = (b.location || "").toLowerCase();
      const name = b.name.toLowerCase();
      const type = (b.type || "").toLowerCase();
      if (!loc.includes(dest) && !name.includes(dest) && !type.includes(dest)) return false;
    }
    return true;
  });

  // 2. If exact filtered is empty, we fall back to general listing matching type/guests
  const isFallbackShown = exactFiltered.length === 0 && boatsList.length > 0;
  
  const displayList = isFallbackShown
    ? boatsList.filter((b) => {
        if (filterType && b.type && !b.type.toLowerCase().includes(filterType.toLowerCase())) return false;
        if (filterGuests && Number(b.capacity) < filterGuests) return false;
        return true;
      })
    : exactFiltered;

  // Sorting displayList
  const sortedBoats = [...displayList].sort((a, b) => {
    if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
    if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
    return 0; // rating / backend order
  });

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      {/* MakeMyTrip Style Navy Hero Header */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-8 pb-20 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Ship className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-space text-amber-400 font-bold uppercase tracking-widest">Yacht & Boat Charters</span>
              </div>
              <h1 className="font-space text-3xl font-bold tracking-tight text-white">Luxury Charters</h1>
              {paramDestination ? (
                <p className="text-xs text-slate-300 mt-1 font-sans flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  Cruising to: {paramDestination} · {filterGuests} Guest{filterGuests > 1 ? "s" : ""} · Date: {selectedDate}
                </p>
              ) : (
                <p className="text-xs text-slate-300 mt-1 font-sans">
                  Luxury catamarans, speedboats, and private river cruisers across India
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 font-bold">
              <ShieldCheck className="h-4 w-4" /> Certified Marine Operators
            </div>
          </div>

          {/* Unified MakeMyTrip Search Widget for Yachts & Boats */}
          <div className="mt-8">
            <SearchBox />
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-30 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-end justify-between">
            {/* Charter Type Filter */}
            <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Ship className="h-3 w-3" /> Vessel Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#051433] cursor-pointer"
              >
                <option value="">All Vessel Types</option>
                {CHARTER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#051433] cursor-pointer"
              />
            </div>

            {/* Guests */}
            <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Users className="h-3 w-3" /> Capacity
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <button type="button" onClick={() => setFilterGuests(Math.max(1, filterGuests - 1))}
                  className="h-5 w-5 bg-white border border-slate-300 rounded font-bold text-slate-700 flex items-center justify-center hover:bg-[#051433] hover:text-white text-xs transition-colors">-</button>
                <span className="text-xs font-bold text-slate-800 w-16 text-center">{filterGuests} Guest{filterGuests > 1 ? "s" : ""}</span>
                <button type="button" onClick={() => setFilterGuests(Math.min(30, filterGuests + 1))}
                  className="h-5 w-5 bg-white border border-slate-300 rounded font-bold text-slate-700 flex items-center justify-center hover:bg-[#051433] hover:text-white text-xs transition-colors">+</button>
              </div>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Filter className="h-3 w-3" /> Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#051433] cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Change Search Toggle */}
            <button
              onClick={() => {
                setShowSearchBox(!showSearchBox);
                setSearchDest(paramDestination);
                setSearchType(filterType);
                setSearchDate(selectedDate);
                setSearchGuests(filterGuests);
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-[#051433] hover:text-white border border-slate-200 transition-all text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer"
            >
              <Anchor className="h-4 w-4" /> Change Search {showSearchBox ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </button>
          </div>

          {/* ── Collapsible Search Box Drawer ── */}
          <AnimatePresence>
            {showSearchBox && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-slate-100 pt-4 mt-2"
              >
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  {/* Destination */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#051433]" /> Cruising To
                    </label>
                    <select
                      value={searchDest}
                      onChange={(e) => setSearchDest(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="">Select Destination</option>
                      {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* Vessel Type */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Ship className="h-3 w-3 text-[#051433]" /> Vessel Type
                    </label>
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="">All Vessel Types</option>
                      {CHARTER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#051433]" /> Date
                    </label>
                    <input
                      type="date"
                      value={searchDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  {/* Guests */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Users className="h-3 w-3 text-[#051433]" /> Guests
                    </label>
                    <div className="flex items-center justify-between bg-white border border-slate-300 rounded-lg px-3 py-1.5">
                      <button type="button" onClick={() => setSearchGuests(Math.max(1, searchGuests - 1))} className="h-6 w-6 rounded bg-slate-100 font-bold text-slate-800 flex items-center justify-center text-xs">-</button>
                      <span className="text-xs font-bold text-slate-800">{searchGuests} Guests</span>
                      <button type="button" onClick={() => setSearchGuests(Math.min(30, searchGuests + 1))} className="h-6 w-6 rounded bg-slate-100 font-bold text-slate-800 flex items-center justify-center text-xs">+</button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-3 border-t border-slate-200/60 pt-3 mt-1">
                    <button
                      type="submit"
                      className="px-8 py-2.5 bg-[#051433] hover:bg-[#092254] text-white font-space text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Update Search Results
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSearchBox(false)}
                      className="px-6 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-space text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Fallback / Notice Banners ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-4 flex flex-col gap-3">
        {/* Results Info */}
        {!loading && (
          <p className="text-xs text-slate-500 font-sans">
            <span className="font-bold text-slate-800">{sortedBoats.length}</span> vessel{sortedBoats.length !== 1 ? "s" : ""} available
            {paramDestination && <span className="text-amber-600 font-bold"> · {paramDestination}</span>}
          </p>
        )}

        {/* Fallback Display Warning */}
        {isFallbackShown && (
          <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-800 font-sans shadow-sm">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">No exact charters found matching "{paramDestination}".</p>
              <p className="text-slate-600">Showing other available premium vessel charters that match your filters below:</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Listings Grid ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {loading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white p-6 border border-slate-200 h-64 animate-pulse shadow-md" />
            ))}
          </div>
        ) : sortedBoats.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-16 text-center flex flex-col items-center gap-4">
            <Ship className="h-12 w-12 text-slate-300" />
            <h3 className="font-space text-lg font-bold text-slate-700">No vessels match your search</h3>
            <p className="text-xs text-slate-400 font-sans max-w-sm">
              Try adjusting your guest count, charter type, or clear the filters to see all available boats.
            </p>
            <button onClick={() => { setFilterType(""); setFilterGuests(1); setParamDestination(""); }}
              className="px-5 py-2.5 bg-[#051433] text-white font-space text-xs font-bold uppercase rounded-xl mt-2 cursor-pointer hover:bg-[#092254]">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {sortedBoats.map((boat, idx) => {
              const hours = getHours(boat.id);
              const totalPrice = Number(boat.price) * hours;
              const features = Array.isArray(boat.features) && boat.features.length > 0
                ? boat.features
                : ["Private Captain & Crew", "Onboard Refreshments", "Safety Equipment"];
              const avgRating = Array.isArray(boat.reviews) && boat.reviews.length > 0
                ? (boat.reviews.reduce((s: number, r: any) => s + r.rating, 0) / boat.reviews.length).toFixed(1)
                : "4.9";

              return (
                <motion.div
                  key={boat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition-all shadow-md hover:shadow-xl p-0 flex flex-col lg:flex-row overflow-hidden text-slate-800"
                >
                  {/* Boat Image */}
                  <div className="lg:w-5/12 relative h-60 lg:h-auto bg-slate-100 shrink-0">
                    <img
                      src={boat.image}
                      alt={boat.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Type badge */}
                    <div className="absolute top-3 left-3 bg-[#051433] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono uppercase">
                      {boat.type || "Luxury Charter"}
                    </div>
                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold">
                      <Star className="h-3 w-3 fill-white" /> {avgRating}
                    </div>
                    {/* Schedules */}
                    {Array.isArray(boat.schedules) && boat.schedules.length > 0 && (
                      <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg p-2">
                        <span className="text-[9px] text-amber-400 font-mono font-bold uppercase block mb-1">Available Slots</span>
                        <div className="flex flex-wrap gap-1">
                          {boat.schedules.slice(0, 2).map((s: string, si: number) => (
                            <span key={si} className="text-[9px] text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded-full font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details Column */}
                  <div className="lg:w-7/12 flex flex-col justify-between gap-0 p-6">
                    <div>
                      {/* Name & Location */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-space text-xl font-bold text-slate-900">{boat.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans mt-0.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>{boat.location || "India"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 shrink-0">
                          <Users className="h-3.5 w-3.5 text-slate-500" />
                          <span>Up to {boat.capacity} guests</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 font-sans leading-relaxed mb-3 line-clamp-2">
                        {boat.description}
                      </p>

                      {/* Feature Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {features.slice(0, 5).map((feat: string, i: number) => (
                          <span key={i} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                            <Check className="h-3 w-3" /> {feat}
                          </span>
                        ))}
                      </div>

                      {/* Duration Selector */}
                      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 w-fit">
                        <span className="text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Charter Duration:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateHours(boat.id, hours - 1)}
                            className="h-7 w-7 rounded-lg bg-white border border-slate-300 font-bold flex items-center justify-center hover:bg-slate-100 text-slate-700"
                          >-</button>
                          <span className="text-xs font-bold text-slate-900 w-16 text-center">{hours} Hr{hours > 1 ? "s" : ""}</span>
                          <button
                            onClick={() => updateHours(boat.id, hours + 1)}
                            className="h-7 w-7 rounded-lg bg-white border border-slate-300 font-bold flex items-center justify-center hover:bg-slate-100 text-slate-700"
                          >+</button>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          Total Charter Cost ({hours} Hour{hours > 1 ? "s" : ""})
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-bold font-space text-slate-900">
                            ₹{totalPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-slate-400">
                            (₹{Number(boat.price).toLocaleString("en-IN")}/hr)
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-medium">+ 5% Marine GST applicable</span>
                      </div>

                      <button
                        onClick={() => handleBookBoat(boat)}
                        className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] hover:to-[#C57A2D] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>RESERVE NOW</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoatsListingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F2F5F8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Ship className="h-8 w-8 text-[#051433] animate-bounce" />
          <span className="font-space text-sm text-slate-600 uppercase tracking-wider animate-pulse">Loading Charters...</span>
        </div>
      </div>
    }>
      <BoatsListingContent />
    </Suspense>
  );
}
