"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BookingProgressTracker from "@/components/booking/BookingProgressTracker";
import { HELICOPTERS, HelicopterListing } from "@/utils/mockData";
import { useCartStore } from "@/store/useCartStore";
import { 
  Map, 
  Eye, 
  Compass, 
  Calendar, 
  Users, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  ChevronDown,
  Activity,
  Coffee,
  UserCheck,
  Car,
  Plane,
  ArrowRightLeft,
  Plus,
  Trash2,
  Minus,
  SlidersHorizontal,
  Gauge,
  Shield,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "@/utils/api";

// Latitude, Longitude, and Relative SVG Grid Coordinates for major flight paths
const locationCoordinates: Record<string, { lat: string; lon: string; x: number; y: number; name: string }> = {
  "Dehradun (DED)": { name: "Dehradun", lat: "30.3165° N", lon: "78.0322° E", x: 48, y: 46 },
  "New Delhi Hub": { name: "New Delhi", lat: "28.6139° N", lon: "77.2090° E", x: 42, y: 62 },
  "Delhi (DEL)": { name: "New Delhi", lat: "28.6139° N", lon: "77.2090° E", x: 42, y: 62 },
  "Srinagar Terminal": { name: "Srinagar", lat: "34.0837° N", lon: "74.7973° E", x: 30, y: 20 },
  "Goa Beachfront Heliport": { name: "Goa Beach", lat: "15.2993° N", lon: "74.1240° E", x: 36, y: 88 },
  "Goa Shoreline": { name: "Goa Shore", lat: "15.3200° N", lon: "74.1100° E", x: 37, y: 89 },
  "Mumbai Heliport": { name: "Mumbai", lat: "19.0760° N", lon: "72.8777° E", x: 28, y: 78 },
  "Mumbai (BOM)": { name: "Mumbai", lat: "19.0760° N", lon: "72.8777° E", x: 28, y: 78 },
  "Kedarnath Sanctuary": { name: "Kedarnath", lat: "30.7346° N", lon: "79.0669° E", x: 55, y: 34 },
  "Badrinath Valley": { name: "Badrinath", lat: "30.7433° N", lon: "79.4938° E", x: 59, y: 35 },
  "Badrinath Shrine": { name: "Badrinath", lat: "30.7433° N", lon: "79.4938° E", x: 59, y: 35 },
  "Vaishno Devi Shrine": { name: "Vaishno Devi", lat: "32.9801° N", lon: "74.9530° E", x: 31, y: 25 },
  "Char Dham Circuit": { name: "Char Dham", lat: "30.7000° N", lon: "79.1000° E", x: 57, y: 37 },
};

function BookingSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setItem = useCartStore((state) => state.setItem);

  // Pre-load location options
  const sourceOptions = ["Dehradun (DED)", "New Delhi Hub", "Srinagar Terminal", "Goa Beachfront Heliport", "Mumbai Heliport"];
  const destOptions = ["Kedarnath Sanctuary", "Badrinath Valley", "Vaishno Devi Shrine", "Char Dham Circuit", "Goa Shoreline", "Mumbai Heliport"];

  // Search parameters from URL
  const paramTripType = (searchParams.get("trip_type") as "One Way" | "Round Trip" | "Multi-City") || "One Way";
  const paramSource = searchParams.get("source") || "Dehradun (DED)";
  const paramDest = searchParams.get("destination") || "Kedarnath Sanctuary";
  const paramDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const paramReturnDate = searchParams.get("return_date") || "";
  const paramAdults = Number(searchParams.get("adults")) || 2;
  const paramChildren = Number(searchParams.get("children")) || 0;
  const paramInfants = Number(searchParams.get("infants")) || 0;

  // Local state for MakeMyTrip style search
  const [tripType, setTripType] = useState<"One Way" | "Round Trip" | "Multi-City">(paramTripType);
  const [localSource, setLocalSource] = useState(paramSource);
  const [localDest, setLocalDest] = useState(paramDest);
  const [localDate, setLocalDate] = useState(paramDate);
  const [localReturnDate, setLocalReturnDate] = useState(paramReturnDate);
  const [adults, setAdults] = useState(paramAdults);
  const [children, setChildren] = useState(paramChildren);
  const [infants, setInfants] = useState(paramInfants);
  const [showPaxDropdown, setShowPaxDropdown] = useState(false);

  // Multi-City Legs state
  const [multiCityLegs, setMultiCityLegs] = useState<{ source: string; destination: string; date: string }[]>([
    { source: "Dehradun (DED)", destination: "Kedarnath Sanctuary", date: paramDate },
    { source: "Kedarnath Sanctuary", destination: "Badrinath Valley", date: paramDate },
  ]);

  const totalPassengers = adults + children;

  // Filter & Sort states tailored for Helicopter Charters
  const [helicopters, setHelicopters] = useState<HelicopterListing[]>(HELICOPTERS);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "capacity" | "speed" | "safety">("price_asc");
  const [engineFilter, setEngineFilter] = useState<"all" | "twin" | "single">("all");
  const [capacityFilter, setCapacityFilter] = useState<number>(0);
  const [filteredHelis, setFilteredHelis] = useState<HelicopterListing[]>(HELICOPTERS);

  // Hospitality Upgrades Selection
  const [upgrades, setUpgrades] = useState({
    vipLounge: false,
    gourmetMeals: false,
    porterDarshan: false,
    groundTransfer: false
  });

  // Upgrade prices definitions
  const UPGRADE_PRICES = {
    vipLounge: 5000,     // Per passenger
    gourmetMeals: 3500,    // Per passenger
    porterDarshan: 12000,  // Per passenger
    groundTransfer: 8000   // Flat rate
  };

  // Sync state if url parameters change
  useEffect(() => {
    setTripType(paramTripType);
    setLocalSource(paramSource);
    setLocalDest(paramDest);
    setLocalDate(paramDate);
    setLocalReturnDate(paramReturnDate);
    setAdults(paramAdults);
    setChildren(paramChildren);
    setInfants(paramInfants);
  }, [paramTripType, paramSource, paramDest, paramDate, paramReturnDate, paramAdults, paramChildren, paramInfants]);

  // Fetch live fleet from API
  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const res = await API.get("/fleet");
        if (res.data && res.data.length > 0) {
          setHelicopters(res.data);
        }
      } catch (err) {
        console.error("Failed to query live fleet database:", err);
      }
    };
    fetchFleet();
  }, []);

  // Filter and sort listings with helicopter-specific criteria
  useEffect(() => {
    let result = helicopters.filter((h) => Number(h.price) <= maxPrice);

    // Seating capacity filter
    if (capacityFilter > 0) {
      result = result.filter((h) => Number(h.capacity) >= capacityFilter);
    }

    // Helicopter Engine Type filter
    if (engineFilter === "twin") {
      result = result.filter((h) => 
        h.model.toLowerCase().includes("twin") || 
        h.model.toLowerCase().includes("h145") || 
        h.model.toLowerCase().includes("429") || 
        h.model.toLowerCase().includes("aw109") || 
        (h.specs && h.specs["Engine Type"] && h.specs["Engine Type"].toLowerCase().includes("dual")) ||
        h.description.toLowerCase().includes("twin") ||
        h.tagline.toLowerCase().includes("twin")
      );
    } else if (engineFilter === "single") {
      result = result.filter((h) => 
        !h.model.toLowerCase().includes("twin") && 
        !h.model.toLowerCase().includes("h145") && 
        !h.model.toLowerCase().includes("429") && 
        !h.model.toLowerCase().includes("aw109") && 
        !(h.specs && h.specs["Engine Type"] && h.specs["Engine Type"].toLowerCase().includes("dual"))
      );
    }

    // Helicopter Sort options
    if (sortBy === "price_asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "capacity") {
      result.sort((a, b) => Number(b.capacity) - Number(a.capacity));
    } else if (sortBy === "speed") {
      result.sort((a, b) => parseFloat(b.speed) - parseFloat(a.speed));
    } else if (sortBy === "safety") {
      result.sort((a, b) => parseFloat(b.safetyRating) - parseFloat(a.safetyRating));
    }

    setFilteredHelis(result);
  }, [helicopters, maxPrice, sortBy, engineFilter, capacityFilter]);

  // Calculate pricing upgrades
  let upgradesPerPassenger = 0;
  if (upgrades.vipLounge) upgradesPerPassenger += UPGRADE_PRICES.vipLounge;
  if (upgrades.gourmetMeals) upgradesPerPassenger += UPGRADE_PRICES.gourmetMeals;
  if (upgrades.porterDarshan) upgradesPerPassenger += UPGRADE_PRICES.porterDarshan;

  let flatUpgrades = 0;
  if (upgrades.groundTransfer) flatUpgrades += UPGRADE_PRICES.groundTransfer;

  const totalUpgradeCost = (upgradesPerPassenger * (totalPassengers || 1)) + flatUpgrades;

  // Add Multi-city leg
  const handleAddLeg = () => {
    if (multiCityLegs.length < 4) {
      const lastLeg = multiCityLegs[multiCityLegs.length - 1];
      setMultiCityLegs([
        ...multiCityLegs,
        { source: lastLeg.destination, destination: "Vaishno Devi Shrine", date: localDate }
      ]);
    }
  };

  // Remove Multi-city leg
  const handleRemoveLeg = (index: number) => {
    if (multiCityLegs.length > 2) {
      setMultiCityLegs(multiCityLegs.filter((_, i) => i !== index));
    }
  };

  // Update specific Multi-city leg
  const handleUpdateLeg = (index: number, field: "source" | "destination" | "date", val: string) => {
    const updated = [...multiCityLegs];
    updated[index] = { ...updated[index], [field]: val };
    setMultiCityLegs(updated);
  };

  // Handle Search submit
  const handleUpdateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    query.set("trip_type", tripType);
    query.set("source", localSource);
    query.set("destination", localDest);
    query.set("date", localDate);
    if (tripType === "Round Trip" && localReturnDate) {
      query.set("return_date", localReturnDate);
    }
    query.set("adults", adults.toString());
    query.set("children", children.toString());
    query.set("infants", infants.toString());
    query.set("passengers", totalPassengers.toString());
    
    router.push(`/booking?${query.toString()}`);
  };

  // Select flight and book
  const handleSelectFlight = (heli: HelicopterListing) => {
    const pax = totalPassengers || 1;
    const finalPerPassengerPrice = Number(heli.price) + upgradesPerPassenger + Math.round(flatUpgrades / pax);
    
    let detailsStr = "";
    if (tripType === "Multi-City") {
      detailsStr = multiCityLegs.map(l => `${l.source} ➔ ${l.destination}`).join(" | ");
    } else if (tripType === "Round Trip") {
      detailsStr = `${localSource} ⇄ ${localDest} (Return: ${localReturnDate || "Flexible"})`;
    } else {
      detailsStr = `${localSource} ➔ ${localDest}`;
    }

    setItem({
      type: "helicopter",
      id: heli.id,
      name: `${heli.name} Flight (${tripType})`,
      price: finalPerPassengerPrice,
      date: localDate,
      return_date: localReturnDate,
      trip_type: tripType,
      passengers: pax,
      adults,
      children,
      infants,
      legs: tripType === "Multi-City" ? multiCityLegs : undefined,
      details: detailsStr,
      duration: heli.speed.includes("240") ? "45 Mins" : "35 Mins",
      image: heli.image,
    });
    router.push("/checkout");
  };

  // Google Maps Vector calculation
  const srcCoord = locationCoordinates[paramSource] || { name: paramSource.split(" ")[0], lat: "30.3165° N", lon: "78.0322° E", x: 45, y: 55 };
  const destCoord = locationCoordinates[paramDest] || { name: paramDest.split(" ")[0], lat: "30.7346° N", lon: "79.0669° E", x: 55, y: 35 };

  const dx = destCoord.x - srcCoord.x;
  const dy = destCoord.y - srcCoord.y;
  const rawDist = Math.sqrt(dx * dx + dy * dy);

  let distanceKm = Math.round(rawDist * 12.5);
  let etaMin = Math.round(distanceKm / 4.2);

  if (paramSource.includes("Dehradun") && paramDest.includes("Kedarnath")) {
    distanceKm = 109;
    etaMin = 28;
  } else if (paramSource.includes("Delhi") && paramDest.includes("Kedarnath")) {
    distanceKm = 325;
    etaMin = 65;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <BookingProgressTracker currentStep={2} />
      {/* Header breadcrumb summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4">
        <div>
          <h1 className="font-space text-3xl font-bold tracking-tight text-white">Helicopter Booking</h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">Search and reserve private luxury helicopter flights across India</p>
        </div>
        <div className="text-xs font-mono text-gold px-3 py-1.5 rounded border border-gold/20 bg-gold/5 uppercase tracking-wider">
          Total Upgrade Cost: +₹{totalUpgradeCost.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings & Configuration panel - Left */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* MakeMyTrip Style Flight Search Widget */}
          <form onSubmit={handleUpdateSearch} className="flex flex-col gap-4 bg-[#051433] p-5 rounded-xl border border-white/10 shadow-2xl text-white">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Compass className="h-5 w-5 text-gold" />
              <h2 className="font-space text-xs uppercase tracking-wider font-bold text-white">Search Flight Charters</h2>
            </div>

            {/* Trip Type Pills (One Way | Round Trip | Multi-City) */}
            <div className="flex items-center gap-1.5 bg-[#020B1E] p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setTripType("One Way")}
                className={`flex-1 py-1.5 px-2 text-[10px] font-space font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1 ${
                  tripType === "One Way"
                    ? "bg-gold text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Plane className="h-3 w-3" />
                One Way
              </button>
              <button
                type="button"
                onClick={() => setTripType("Round Trip")}
                className={`flex-1 py-1.5 px-2 text-[10px] font-space font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1 ${
                  tripType === "Round Trip"
                    ? "bg-gold text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ArrowRightLeft className="h-3 w-3" />
                Round Trip
              </button>
              <button
                type="button"
                onClick={() => setTripType("Multi-City")}
                className={`flex-1 py-1.5 px-2 text-[10px] font-space font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1 ${
                  tripType === "Multi-City"
                    ? "bg-gold text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Compass className="h-3 w-3" />
                Multi-City
              </button>
            </div>

            {/* One Way / Round Trip Form Fields */}
            {tripType !== "Multi-City" ? (
              <div className="flex flex-col gap-3.5">
                {/* Departure */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-wider text-gold font-bold">Departure From</label>
                  <select
                    value={localSource}
                    onChange={(e) => setLocalSource(e.target.value)}
                    className="w-full bg-[#020B1E] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold cursor-pointer font-sans"
                  >
                    {sourceOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#020B1E]">{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Destination */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-wider text-gold font-bold">Destination To</label>
                  <select
                    value={localDest}
                    onChange={(e) => setLocalDest(e.target.value)}
                    className="w-full bg-[#020B1E] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold cursor-pointer font-sans"
                  >
                    {destOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#020B1E]">{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Dates (Departure & Optional Return) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-300 font-bold">Departure Date</label>
                    <input
                      type="date"
                      required
                      value={localDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setLocalDate(e.target.value)}
                      className="w-full bg-[#020B1E] border border-white/15 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold cursor-pointer font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={`text-[9px] uppercase tracking-wider font-bold ${tripType === "Round Trip" ? "text-gold" : "text-slate-500"}`}>
                      Return Date {tripType === "One Way" && "(Optional)"}
                    </label>
                    <input
                      type="date"
                      disabled={tripType === "One Way"}
                      required={tripType === "Round Trip"}
                      value={localReturnDate}
                      min={localDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setLocalReturnDate(e.target.value)}
                      className={`w-full bg-[#020B1E] border rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none cursor-pointer font-sans ${
                        tripType === "Round Trip" ? "border-gold/50 focus:border-gold" : "border-white/5 opacity-40 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Multi-City Form Fields */
              <div className="flex flex-col gap-3.5">
                {multiCityLegs.map((leg, idx) => (
                  <div key={idx} className="p-3 bg-[#020B1E] rounded-lg border border-white/10 flex flex-col gap-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-space font-bold uppercase text-gold tracking-wider">Leg {idx + 1}</span>
                      {multiCityLegs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLeg(idx)}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={leg.source}
                        onChange={(e) => handleUpdateLeg(idx, "source", e.target.value)}
                        className="w-full bg-[#051433] border border-white/15 rounded px-2 py-1.5 text-[11px] text-white"
                      >
                        {sourceOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <select
                        value={leg.destination}
                        onChange={(e) => handleUpdateLeg(idx, "destination", e.target.value)}
                        className="w-full bg-[#051433] border border-white/15 rounded px-2 py-1.5 text-[11px] text-white"
                      >
                        {destOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="date"
                      value={leg.date}
                      onChange={(e) => handleUpdateLeg(idx, "date", e.target.value)}
                      className="w-full bg-[#051433] border border-white/15 rounded px-2 py-1 text-[11px] text-white"
                    />
                  </div>
                ))}
                {multiCityLegs.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddLeg}
                    className="py-1.5 px-3 border border-dashed border-gold/40 hover:border-gold text-gold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-space uppercase tracking-wider"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Another City Leg
                  </button>
                )}
              </div>
            )}

            {/* Travellers & Class Selector (MakeMyTrip Counter) */}
            <div className="flex flex-col gap-1 relative">
              <label className="text-[9px] uppercase tracking-wider text-slate-300 font-bold">Travellers & Class</label>
              <button
                type="button"
                onClick={() => setShowPaxDropdown(!showPaxDropdown)}
                className="w-full bg-[#020B1E] border border-white/15 hover:border-gold/50 rounded-lg px-3 py-2 text-xs text-white flex items-center justify-between cursor-pointer font-sans transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gold" />
                  <span className="font-medium">
                    {adults} Adult{adults > 1 ? "s" : ""}, {children} Child{children !== 1 ? "ren" : ""}, {infants} Infant{infants !== 1 ? "s" : ""}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* MakeMyTrip Style Pax Dropdown */}
              <AnimatePresence>
                {showPaxDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-[#020B1E] border border-white/20 rounded-xl p-4 shadow-2xl z-30 flex flex-col gap-3 text-white"
                  >
                    {/* Adults */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <div className="text-xs font-bold text-white">Adults</div>
                        <div className="text-[9px] text-slate-400">12+ Years</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={adults <= 1}
                          onClick={() => setAdults(adults - 1)}
                          className="h-6 w-6 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center">{adults}</span>
                        <button
                          type="button"
                          disabled={adults >= 8}
                          onClick={() => setAdults(adults + 1)}
                          className="h-6 w-6 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-gold"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <div className="text-xs font-bold text-white">Children</div>
                        <div className="text-[9px] text-slate-400">2-12 Years</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={children <= 0}
                          onClick={() => setChildren(children - 1)}
                          className="h-6 w-6 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center">{children}</span>
                        <button
                          type="button"
                          disabled={children >= 6}
                          onClick={() => setChildren(children + 1)}
                          className="h-6 w-6 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-gold"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Infants</div>
                        <div className="text-[9px] text-slate-400">Below 2 Years (Lap)</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={infants <= 0}
                          onClick={() => setInfants(infants - 1)}
                          className="h-6 w-6 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center">{infants}</span>
                        <button
                          type="button"
                          disabled={infants >= 4}
                          onClick={() => setInfants(infants + 1)}
                          className="h-6 w-6 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-gold"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPaxDropdown(false)}
                      className="w-full py-1.5 bg-gold text-black rounded font-space text-[10px] font-bold uppercase mt-1 cursor-pointer"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gold hover:bg-gold-hover text-black font-space text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-xl cursor-pointer text-center flex items-center justify-center gap-2 mt-1"
            >
              <Compass className="h-4 w-4" />
              Search Flights
            </button>
          </form>


          {/* Module 3: Hospitality & VIP Upgrades */}
          <div className="flex flex-col gap-4 bg-[#051433] p-5 rounded-xl border border-white/5 shadow-lg text-white">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <UserCheck className="h-4.5 w-4.5 text-gold" />
              <h2 className="font-space text-xs uppercase tracking-wider font-bold">Hospitality Services</h2>
            </div>

            <div className="flex flex-col gap-3.5">
              {/* Upgrade 1: VIP Lounge */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={upgrades.vipLounge}
                  onChange={(e) => setUpgrades({...upgrades, vipLounge: e.target.checked})}
                  className="mt-0.5 accent-gold cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-space uppercase tracking-wider font-bold text-white group-hover:text-gold transition-colors">VIP Lounge Access</span>
                    <span className="text-[9px] font-mono text-gold">+₹5,000/pax</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans leading-relaxed">Dedicated terminal suite with complimentary drinks and fast customs clearance.</p>
                </div>
              </label>

              {/* Upgrade 2: Gourmet Meals */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={upgrades.gourmetMeals}
                  onChange={(e) => setUpgrades({...upgrades, gourmetMeals: e.target.checked})}
                  className="mt-0.5 accent-gold cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-space uppercase tracking-wider font-bold text-white group-hover:text-gold transition-colors">Gourmet In-Flight Catering</span>
                    <span className="text-[9px] font-mono text-gold">+₹3,500/pax</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans leading-relaxed">Artisanal organic snacks, fresh juices, and champagne for mountain transit.</p>
                </div>
              </label>

              {/* Upgrade 3: Porter & Darshan Priority */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={upgrades.porterDarshan}
                  onChange={(e) => setUpgrades({...upgrades, porterDarshan: e.target.checked})}
                  className="mt-0.5 accent-gold cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-space uppercase tracking-wider font-bold text-white group-hover:text-gold transition-colors">VIP Shrine Priority & Escort</span>
                    <span className="text-[9px] font-mono text-gold">+₹12,000/pax</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans leading-relaxed">Direct temple queue bypass, priority Palki/Pony arrangement, and temple priest escort.</p>
                </div>
              </label>

              {/* Upgrade 4: Ground Chauffeur */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={upgrades.groundTransfer}
                  onChange={(e) => setUpgrades({...upgrades, groundTransfer: e.target.checked})}
                  className="mt-0.5 accent-gold cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-space uppercase tracking-wider font-bold text-white group-hover:text-gold transition-colors">Luxury Chauffeur Pickup</span>
                    <span className="text-[9px] font-mono text-gold">+₹8,000 Flat</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans leading-relaxed">Mercedes-Benz V-Class / Audi terminal-to-heliport luxury road transfer.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Module 4: Filter by Maximum Budget */}
          <div className="flex flex-col gap-4 bg-[#051433] p-5 rounded-xl border border-white/5 shadow-lg text-white">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-space text-xs uppercase tracking-wider font-bold">Max Charter Budget</span>
              <span className="font-mono text-gold text-xs">₹{maxPrice.toLocaleString("en-IN")}</span>
            </div>
            <input 
              type="range"
              min={100000}
              max={500000}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold cursor-pointer"
            />
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
              <span>₹1,00,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>
        </div>

        {/* Available Fleet Listings & Map View - Right Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Aviation Specific Filter & Sort Toolbar */}
          <div className="flex flex-col gap-3 bg-[#051433] p-4 rounded-xl border border-white/10 shadow-lg text-white">
            {/* Top Row: Sort Options & Count */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-space tracking-wider text-gold font-bold flex items-center gap-1">
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Sort Aircraft:
                </span>
                <button
                  onClick={() => setSortBy("price_asc")}
                  className={`text-xs px-2.5 py-1 rounded transition-all cursor-pointer ${
                    sortBy === "price_asc" ? "bg-gold text-black font-bold" : "bg-[#020B1E] text-slate-300 hover:text-white border border-white/10"
                  }`}
                >
                  Price: Low ➔ High
                </button>
                <button
                  onClick={() => setSortBy("price_desc")}
                  className={`text-xs px-2.5 py-1 rounded transition-all cursor-pointer ${
                    sortBy === "price_desc" ? "bg-gold text-black font-bold" : "bg-[#020B1E] text-slate-300 hover:text-white border border-white/10"
                  }`}
                >
                  Price: High ➔ Low
                </button>
                <button
                  onClick={() => setSortBy("capacity")}
                  className={`text-xs px-2.5 py-1 rounded transition-all cursor-pointer ${
                    sortBy === "capacity" ? "bg-gold text-black font-bold" : "bg-[#020B1E] text-slate-300 hover:text-white border border-white/10"
                  }`}
                >
                  Seating Capacity
                </button>
                <button
                  onClick={() => setSortBy("speed")}
                  className={`text-xs px-2.5 py-1 rounded transition-all cursor-pointer ${
                    sortBy === "speed" ? "bg-gold text-black font-bold" : "bg-[#020B1E] text-slate-300 hover:text-white border border-white/10"
                  }`}
                >
                  Cruise Speed
                </button>
                <button
                  onClick={() => setSortBy("safety")}
                  className={`text-xs px-2.5 py-1 rounded transition-all cursor-pointer ${
                    sortBy === "safety" ? "bg-gold text-black font-bold" : "bg-[#020B1E] text-slate-300 hover:text-white border border-white/10"
                  }`}
                >
                  Safety Rating
                </button>
              </div>

              <div className="text-xs text-slate-300 font-sans">
                Found <span className="text-gold font-bold">{filteredHelis.length}</span> Helicopter Charters
              </div>
            </div>

            {/* Bottom Row: Helicopter Aviation Specific Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Engine Type Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-space text-slate-400 font-bold">Engine:</span>
                  <select
                    value={engineFilter}
                    onChange={(e) => setEngineFilter(e.target.value as any)}
                    className="bg-[#020B1E] border border-white/15 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-gold cursor-pointer"
                  >
                    <option value="all">All Engine Types</option>
                    <option value="twin">Twin-Engine (High Altitude / Max Safety)</option>
                    <option value="single">Single Engine</option>
                  </select>
                </div>

                {/* Min Capacity Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-space text-slate-400 font-bold">Min Seats:</span>
                  <select
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(Number(e.target.value))}
                    className="bg-[#020B1E] border border-white/15 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-gold cursor-pointer"
                  >
                    <option value={0}>Any Capacity</option>
                    <option value={4}>4+ Passengers</option>
                    <option value={5}>5+ Passengers</option>
                    <option value={6}>6+ Passengers</option>
                  </select>
                </div>
              </div>

              {(engineFilter !== "all" || capacityFilter > 0 || maxPrice < 500000) && (
                <button
                  onClick={() => {
                    setEngineFilter("all");
                    setCapacityFilter(0);
                    setMaxPrice(500000);
                    setSortBy("price_asc");
                  }}
                  className="text-[10px] font-space text-gold hover:underline cursor-pointer uppercase tracking-wider font-bold"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Flight Corridor Visualizer */}
          <div className="bg-[#020B1E] p-5 rounded-xl border border-white/10 relative overflow-hidden shadow-xl text-white">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-gold animate-pulse" />
                <span className="font-space text-xs uppercase tracking-wider font-bold text-white">Live Corridor Tracking</span>
              </div>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Weather Operational
              </div>
            </div>

            {/* Flight Path SVG Line */}
            <div className="relative h-48 bg-[#051433]/80 rounded-lg border border-white/5 p-4 flex flex-col justify-between overflow-hidden">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line 
                  x1={`${srcCoord.x}%`} 
                  y1={`${srcCoord.y}%`} 
                  x2={`${destCoord.x}%`} 
                  y2={`${destCoord.y}%`} 
                  stroke="#C5A880" 
                  strokeWidth="2" 
                  strokeDasharray="6,6"
                  className="animate-pulse"
                />
                <circle cx={`${srcCoord.x}%`} cy={`${srcCoord.y}%`} r="6" fill="#C5A880" />
                <circle cx={`${destCoord.x}%`} cy={`${destCoord.y}%`} r="6" fill="#10B981" />
              </svg>

              {/* Source Details overlay */}
              <div className="z-10 flex flex-col items-start bg-[#020B1E]/90 p-2.5 rounded border border-white/10 max-w-[170px]">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Departure Terminal</span>
                <span className="text-xs font-bold text-gold">{paramSource}</span>
                <span className="text-[9px] font-mono text-slate-300 mt-0.5">{srcCoord.lat}</span>
              </div>

              {/* Mid Flight Stats */}
              <div className="z-10 self-center bg-gold/10 border border-gold/30 px-3 py-1 rounded-full text-center backdrop-blur-md">
                <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider">
                  Dist: {distanceKm} KM | Approx. Flight Time: {etaMin} Mins
                </span>
              </div>

              {/* Destination Details overlay */}
              <div className="z-10 flex flex-col items-end self-end bg-[#020B1E]/90 p-2.5 rounded border border-white/10 max-w-[170px] text-right">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Arrival Helipad</span>
                <span className="text-xs font-bold text-emerald-400">{paramDest}</span>
                <span className="text-[9px] font-mono text-slate-300 mt-0.5">{destCoord.lat}</span>
              </div>
            </div>
          </div>

          {/* List of Available Helicopter Charters */}
          <div className="flex flex-col gap-6">
            {filteredHelis.map((heli) => {
              const basePrice = Number(heli.price);
              const calculatedTotalPrice = (basePrice + upgradesPerPassenger) * (totalPassengers || 1) + flatUpgrades;
              const displayPerPassengerPrice = Math.round(calculatedTotalPrice / (totalPassengers || 1));

              return (
                <motion.div
                  key={heli.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#051433] rounded-2xl border border-white/10 hover:border-gold/50 transition-all duration-300 p-6 shadow-xl flex flex-col md:flex-row gap-6 text-white group"
                >
                  {/* Aircraft Image */}
                  <div className="md:w-5/12 relative h-56 md:h-auto rounded-xl overflow-hidden bg-black/40 border border-white/5">
                    <img 
                      src={heli.image} 
                      alt={heli.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#020B1E]/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-gold border border-gold/20 font-bold">
                      {heli.model}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-emerald-500/90 text-black px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                      Rating: {heli.safetyRating}
                    </div>
                  </div>

                  {/* Flight Specifications & Specs Details */}
                  <div className="md:w-7/12 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-space text-xl font-bold text-white group-hover:text-gold transition-colors">{heli.name}</h3>
                          <p className="text-xs text-slate-400 mt-1 font-sans">{heli.tagline}</p>
                        </div>
                      </div>

                      {/* Specs Badge Bar */}
                      <div className="grid grid-cols-3 gap-2 my-4 bg-[#020B1E] p-3 rounded-xl border border-white/5 text-center">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Max Speed</span>
                          <span className="text-xs font-mono text-white font-bold mt-0.5">{heli.speed}</span>
                        </div>
                        <div className="flex flex-col border-x border-white/10">
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Max Range</span>
                          <span className="text-xs font-mono text-white font-bold mt-0.5">{heli.range}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Capacity</span>
                          <span className="text-xs font-mono text-gold font-bold mt-0.5">{heli.capacity} Seater</span>
                        </div>
                      </div>

                      {/* Feature Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {heli.features.slice(0, 4).map((feat, i) => (
                          <span key={i} className="text-[9px] bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-300 font-sans">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and Book Action CTA */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Total Charter Price ({totalPassengers} Pax)</div>
                        <div className="text-2xl font-space font-bold text-gold">
                          ₹{calculatedTotalPrice.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400">
                          (₹{displayPerPassengerPrice.toLocaleString("en-IN")} / person incl. upgrades)
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/booking/${heli.id}?source=${encodeURIComponent(paramSource)}&destination=${encodeURIComponent(paramDest)}`}
                          className="px-3.5 py-2.5 rounded-lg border border-white/20 hover:border-gold text-xs font-space font-bold uppercase text-slate-200 hover:text-gold transition-colors"
                        >
                          View Aircraft
                        </Link>
                        <button
                          onClick={() => handleSelectFlight(heli)}
                          className="px-5 py-2.5 rounded-lg bg-gold hover:bg-gold-hover text-black font-space text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Reserve Charter</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function BookingSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020B1E] flex items-center justify-center text-white font-space text-sm">
          Loading Luxury Charter Search...
        </div>
      }
    >
      <BookingSearchContent />
    </Suspense>
  );
}
