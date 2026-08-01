"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BookingProgressTracker from "@/components/booking/BookingProgressTracker";
import { HELICOPTERS, HelicopterListing } from "@/utils/mockData";
import { useCartStore } from "@/store/useCartStore";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  ChevronDown,
  Plane,
  ArrowRightLeft,
  Plus,
  Trash2,
  Minus,
  SlidersHorizontal,
  Clock,
  Sparkles,
  Info,
  Compass,
  Check,
  CheckCircle2,
  Helicopter,
  Award,
  Building,
  Home,
  Shield,
  DollarSign,
  FileText,
  Anchor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "@/utils/api";

const locationCoordinates: Record<string, { lat: string; lon: string; name: string }> = {
  "Dehradun (DED)": { name: "Dehradun", lat: "30.3165° N", lon: "78.0322° E" },
  "New Delhi Hub": { name: "New Delhi", lat: "28.6139° N", lon: "77.2090° E" },
  "Srinagar Terminal": { name: "Srinagar", lat: "34.0837° N", lon: "74.7973° E" },
  "Goa Beachfront Heliport": { name: "Goa Beach", lat: "15.2993° N", lon: "74.1240° E" },
  "Mumbai Heliport": { name: "Mumbai", lat: "19.0760° N", lon: "72.8777° E" },
  "Kedarnath Sanctuary": { name: "Kedarnath", lat: "30.7346° N", lon: "79.0669° E" },
  "Badrinath Valley": { name: "Badrinath", lat: "30.7433° N", lon: "79.4938° E" },
  "Vaishno Devi Shrine": { name: "Vaishno Devi", lat: "32.9801° N", lon: "74.9530° E" },
  "Char Dham Circuit": { name: "Char Dham", lat: "30.7000° N", lon: "79.1000° E" },
};

function BookingSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setItem = useCartStore((state) => state.setItem);

  const [sourceOptions, setSourceOptions] = useState<{ code: string; name: string; desc: string }[]>([
    { code: "DED", name: "Dehradun", desc: "Jolly Grant Heliport" },
    { code: "DEL", name: "New Delhi", desc: "IGI Executive Terminal Hub" },
    { code: "SXR", name: "Srinagar", desc: "Aerodrome Terminal" },
    { code: "GOI", name: "Goa Shore", desc: "Beachfront Heliport" },
    { code: "BOM", name: "Mumbai", desc: "Juhu Helipad Hub" },
  ]);

  const [destOptions, setDestOptions] = useState<{ code: string; name: string; desc: string }[]>([
    { code: "KED", name: "Kedarnath Sanctuary", desc: "Phata / Sersi Helipad" },
    { code: "BAD", name: "Badrinath Valley", desc: "Govindghat Terminal" },
    { code: "VSD", name: "Vaishno Devi Shrine", desc: "Sanjichhat Helipad" },
    { code: "CDM", name: "Char Dham Circuit", desc: "Complete 4-Shrine Corridor" },
  ]);

  const paramTripType = (searchParams.get("trip_type") as "One Way" | "Round Trip" | "Multi-City") || "One Way";
  const paramSource = searchParams.get("source") || "Dehradun (DED)";
  const paramDest = searchParams.get("destination") || "Kedarnath Sanctuary";
  const paramDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const paramReturnDate = searchParams.get("return_date") || "";
  const paramAdults = Number(searchParams.get("adults")) || 2;
  const paramChildren = Number(searchParams.get("children")) || 0;
  const paramInfants = Number(searchParams.get("infants")) || 0;
  const paramFareType = searchParams.get("fare_type") || "Regular";
  const paramGstNumber = searchParams.get("gst_number") || "";

  const [tripType, setTripType] = useState<"One Way" | "Round Trip" | "Multi-City">(paramTripType);
  const [localSource, setLocalSource] = useState(paramSource);
  const [localDest, setLocalDest] = useState(paramDest);
  const [localDate, setLocalDate] = useState(paramDate);
  const [localReturnDate, setLocalReturnDate] = useState(paramReturnDate);
  const [adults, setAdults] = useState(paramAdults);
  const [children, setChildren] = useState(paramChildren);
  const [infants, setInfants] = useState(paramInfants);
  const [fareType, setFareType] = useState<string>(paramFareType);
  const [gstNumber, setGstNumber] = useState<string>(paramGstNumber);
  const [gstCompanyName, setGstCompanyName] = useState<string>("");
  const [showPaxDropdown, setShowPaxDropdown] = useState(false);

  const [multiCityLegs, setMultiCityLegs] = useState<{ source: string; destination: string; date: string }[]>([
    { source: "Dehradun (DED)", destination: "Kedarnath Sanctuary", date: paramDate },
    { source: "Kedarnath Sanctuary", destination: "Badrinath Valley", date: paramDate },
  ]);

  const totalPassengers = adults + children;

  const [helicopters, setHelicopters] = useState<HelicopterListing[]>([]);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "capacity" | "speed" | "safety">("price_asc");
  const [engineFilter, setEngineFilter] = useState<"all" | "twin" | "single">("all");
  const [capacityFilter, setCapacityFilter] = useState<number>(0);
  const [filteredHelis, setFilteredHelis] = useState<HelicopterListing[]>([]);

  useEffect(() => {
    setTripType(paramTripType);
    setLocalSource(paramSource);
    setLocalDest(paramDest);
    setLocalDate(paramDate);
    setLocalReturnDate(paramReturnDate);
    setAdults(paramAdults);
    setChildren(paramChildren);
    setInfants(paramInfants);
    setFareType(paramFareType);
    setGstNumber(paramGstNumber);
  }, [paramTripType, paramSource, paramDest, paramDate, paramReturnDate, paramAdults, paramChildren, paramInfants, paramFareType, paramGstNumber]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fleetRes, toursRes] = await Promise.all([
          API.get("/fleet"),
          API.get("/tours")
        ]);
        if (fleetRes.data && fleetRes.data.length > 0) {
          setHelicopters(fleetRes.data);
        }
        if (toursRes.data && toursRes.data.length > 0) {
          const dynamicDestList = toursRes.data.map((tour: any, idx: number) => ({
            code: tour.id ? tour.id.toUpperCase() : `PKG${idx+1}`,
            name: tour.name,
            desc: tour.tagline || tour.duration || "Verified Tour Package"
          }));
          setDestOptions(dynamicDestList);
        }
      } catch (err) {
        console.error("Failed to query live database:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = helicopters.filter((h) => Number(h.price) <= maxPrice);

    if (capacityFilter > 0) {
      result = result.filter((h) => Number(h.capacity) >= capacityFilter);
    }

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
    query.set("fare_type", fareType);
    if (gstNumber) {
      query.set("gst_number", gstNumber);
    }
    
    router.push(`/booking?${query.toString()}`);
  };

  const handleSelectFlight = (heli: HelicopterListing) => {
    const pax = totalPassengers || 1;
    const finalPerPassengerPrice = Number(heli.price);
    
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
      fare_type: fareType,
      gst_number: gstNumber,
    });
    router.push("/checkout");
  };

  // Date formatter for MakeMyTrip style
  const getFormattedDate = (dateStr: string) => {
    if (!dateStr) return { day: "--", monthYear: "Select Date", weekday: "" };
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return { day: "--", monthYear: "Select Date", weekday: "" };
      const day = date.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear().toString().slice(-2);
      const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const weekday = weekdayNames[date.getDay()];
      return {
        day: day.toString().padStart(2, "0"),
        monthYear: `${month}'${year}`,
        weekday
      };
    } catch {
      return { day: "--", monthYear: "Select Date", weekday: "" };
    }
  };

  const departDateObj = getFormattedDate(localDate);
  const returnDateObj = getFormattedDate(localReturnDate);

  const categories = [
    { name: "Helicopters", icon: Helicopter, href: "/booking", active: true },
    { name: "Hotels", icon: Building, href: "/hotels" },
    { name: "Holiday Packages", icon: Compass, href: "/tours" },
    { name: "Bespoke Charters", icon: Plane, href: "/charter" },
    { name: "Yacht Service", icon: Anchor, href: "/boats" }
  ];

  const handleSwapLocations = () => {
    const temp = localSource;
    setLocalSource(localDest);
    setLocalDest(temp);
  };

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      {/* MakeMyTrip Signature Navy Hero Banner */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-6 pb-24 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-7xl mx-auto relative">
          <BookingProgressTracker currentStep={2} />

          {/* MakeMyTrip Centered Top Navigation Tabs - Overlapping the Hero Grid */}
          <div className="flex justify-center -mb-8 mt-6 relative z-30">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200/80 px-6 py-3 flex items-center justify-start gap-8 overflow-x-auto max-w-full no-scrollbar">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={i}
                    href={cat.href || "#"}
                    className={`flex flex-col items-center gap-1 min-w-[70px] transition-all relative ${
                      cat.active 
                        ? "text-blue-600 font-bold" 
                        : "text-slate-500 hover:text-blue-500 font-medium"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${cat.active ? "text-blue-600 animate-pulse" : "text-slate-400"}`} />
                    <span className="text-[11px] whitespace-nowrap">{cat.name}</span>
                    {cat.active && (
                      <span className="absolute -bottom-3 left-0 right-0 h-[3px] bg-blue-600 rounded-t-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* MakeMyTrip Style Main Search Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 pt-14 text-slate-800 border border-slate-200/60 mt-12 relative z-20">
            
            {/* Trip Type Selector & Headline */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-6">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs font-bold text-slate-700">
                  <input
                    type="radio"
                    name="triptype"
                    checked={tripType === "One Way"}
                    onChange={() => setTripType("One Way")}
                    className="accent-blue-600 h-4 w-4"
                  />
                  <span>One Way</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs font-bold text-slate-700">
                  <input
                    type="radio"
                    name="triptype"
                    checked={tripType === "Round Trip"}
                    onChange={() => setTripType("Round Trip")}
                    className="accent-blue-600 h-4 w-4"
                  />
                  <span>Round Trip</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs font-bold text-slate-700">
                  <input
                    type="radio"
                    name="triptype"
                    checked={tripType === "Multi-City"}
                    onChange={() => setTripType("Multi-City")}
                    className="accent-blue-600 h-4 w-4"
                  />
                  <span>Multi-City</span>
                </label>
              </div>

              <div className="text-xs text-slate-400 font-bold font-sans">
                Book Private Helicopter & Jet Charters
              </div>
            </div>

            {/* MakeMyTrip Styled Input Grid */}
            <form onSubmit={handleUpdateSearch} className="relative pb-6">
              {tripType !== "Multi-City" ? (
                <div className="relative">
                  <div className="grid grid-cols-1 lg:grid-cols-12 border border-slate-300 rounded-xl overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200 bg-white">
                    
                    {/* FROM Section */}
                    <div className="lg:col-span-3 p-4 hover:bg-slate-50 transition-all cursor-pointer relative group">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">From</span>
                      <select
                        value={localSource}
                        onChange={(e) => setLocalSource(e.target.value)}
                        className="w-full bg-transparent font-space text-lg font-bold text-slate-900 focus:outline-none cursor-pointer appearance-none"
                      >
                        {sourceOptions.map((opt) => (
                          <option key={opt.code} value={`${opt.name} (${opt.code})`}>
                            {opt.name} ({opt.code})
                          </option>
                        ))}
                      </select>
                      <span className="text-xs text-slate-500 block truncate mt-1">
                        {sourceOptions.find(o => localSource.includes(o.name))?.desc || "Premium Departure Heliport"}
                      </span>
                    </div>

                    {/* Swap Circle Button */}
                    <div className="absolute left-[25%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden lg:block">
                      <button
                        type="button"
                        onClick={handleSwapLocations}
                        className="h-8 w-8 rounded-full border border-slate-300 bg-white hover:bg-slate-50 shadow-md flex items-center justify-center text-blue-600 hover:text-blue-700 transition-all active:scale-95"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </button>
                    </div>

                    {/* TO Section */}
                    <div className="lg:col-span-3 p-4 hover:bg-slate-50 transition-all cursor-pointer group">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">To</span>
                      <select
                        value={localDest}
                        onChange={(e) => setLocalDest(e.target.value)}
                        className="w-full bg-transparent font-space text-lg font-bold text-slate-900 focus:outline-none cursor-pointer appearance-none"
                      >
                        {destOptions.map((opt) => (
                          <option key={opt.code} value={opt.name}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                      <span className="text-xs text-slate-500 block truncate mt-1">
                        {destOptions.find(o => localDest.includes(o.name))?.desc || "Arrival Sanctuary / Shrine"}
                      </span>
                    </div>

                    {/* DEPARTURE Section */}
                    <div className="lg:col-span-2 p-4 hover:bg-slate-50 transition-all cursor-pointer relative">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Departure</span>
                      <div className="relative">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-space text-2xl font-bold text-slate-900">{departDateObj.day}</span>
                          <span className="font-space text-sm font-bold text-slate-800">{departDateObj.monthYear}</span>
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">{departDateObj.weekday || "Select Date"}</span>
                        <input
                          type="date"
                          required
                          value={localDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setLocalDate(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    </div>

                    {/* RETURN Section */}
                    <div 
                      className={`lg:col-span-2 p-4 hover:bg-slate-50 transition-all cursor-pointer relative ${
                        tripType === "One Way" ? "bg-slate-50/50" : ""
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Return</span>
                      {tripType === "One Way" ? (
                        <div 
                          onClick={() => {
                            setTripType("Round Trip");
                            // Default return date is 2 days from departure
                            if (localDate) {
                              const d = new Date(localDate);
                              d.setDate(d.getDate() + 2);
                              setLocalReturnDate(d.toISOString().split("T")[0]);
                            }
                          }}
                          className="flex flex-col justify-center h-full min-h-[36px]"
                        >
                          <span className="text-[11px] text-slate-400 font-bold font-sans hover:text-blue-600 transition-colors">
                            Tap to add return date for bigger discounts
                          </span>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-space text-2xl font-bold text-slate-900">{returnDateObj.day}</span>
                            <span className="font-space text-sm font-bold text-slate-800">{returnDateObj.monthYear}</span>
                          </div>
                          <span className="text-xs text-slate-500 block mt-0.5">{returnDateObj.weekday || "Select Date"}</span>
                          <input
                            type="date"
                            required={tripType === "Round Trip"}
                            value={localReturnDate}
                            min={localDate || new Date().toISOString().split("T")[0]}
                            onChange={(e) => setLocalReturnDate(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </div>
                      )}
                    </div>

                    {/* TRAVELLERS & CLASS Section */}
                    <div className="lg:col-span-2 p-4 hover:bg-slate-50 transition-all cursor-pointer relative">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Travellers &amp; Class</span>
                      <button
                        type="button"
                        onClick={() => setShowPaxDropdown(!showPaxDropdown)}
                        className="w-full text-left focus:outline-none"
                      >
                        <div className="flex items-baseline gap-1">
                          <span className="font-space text-xl font-bold text-slate-900">{totalPassengers}</span>
                          <span className="font-space text-sm font-bold text-slate-800">Guest{totalPassengers > 1 ? "s" : ""}</span>
                        </div>
                        <span className="text-xs text-slate-500 block truncate mt-0.5">Executive Charter Class</span>
                      </button>

                      {/* MakeMyTrip Passenger Counter Dropdown */}
                      <AnimatePresence>
                        {showPaxDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl z-50 text-slate-800"
                          >
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                              <div>
                                <div className="text-xs font-bold text-slate-900">Adults</div>
                                <div className="text-[10px] text-slate-400">12+ Years</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  disabled={adults <= 1}
                                  onClick={() => setAdults(adults - 1)}
                                  className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 font-bold flex items-center justify-center"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-xs font-bold w-4 text-center">{adults}</span>
                                <button
                                  type="button"
                                  disabled={adults >= 8}
                                  onClick={() => setAdults(adults + 1)}
                                  className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 font-bold flex items-center justify-center"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                              <div>
                                <div className="text-xs font-bold text-slate-900">Children</div>
                                <div className="text-[10px] text-slate-400">2-12 Years</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  disabled={children <= 0}
                                  onClick={() => setChildren(children - 1)}
                                  className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 font-bold flex items-center justify-center"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-xs font-bold w-4 text-center">{children}</span>
                                <button
                                  type="button"
                                  disabled={children >= 6}
                                  onClick={() => setChildren(children + 1)}
                                  className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 font-bold flex items-center justify-center"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3">
                              <div>
                                <div className="text-xs font-bold text-slate-900">Infants</div>
                                <div className="text-[10px] text-slate-400">Below 2 Years</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  disabled={infants <= 0}
                                  onClick={() => setInfants(infants - 1)}
                                  className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 font-bold flex items-center justify-center"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-xs font-bold w-4 text-center">{infants}</span>
                                <button
                                  type="button"
                                  disabled={infants >= 4}
                                  onClick={() => setInfants(infants + 1)}
                                  className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 font-bold flex items-center justify-center"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setShowPaxDropdown(false)}
                              className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase mt-4 hover:bg-blue-700 transition-colors font-space"
                            >
                              Apply Selection
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                </div>
              ) : (
                /* Multi-City Leg Inputs */
                <div className="flex flex-col gap-3">
                  {multiCityLegs.map((leg, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 items-center">
                      <div className="md:col-span-4 bg-white p-2.5 rounded-xl border border-slate-200">
                        <label className="text-[9px] text-slate-400 font-bold block uppercase">Leg {idx + 1} From</label>
                        <select
                          value={leg.source}
                          onChange={(e) => {
                            const updated = [...multiCityLegs];
                            updated[idx].source = e.target.value;
                            setMultiCityLegs(updated);
                          }}
                          className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none"
                        >
                          {sourceOptions.map((opt) => (
                            <option key={opt.code} value={`${opt.name} (${opt.code})`}>{opt.name} ({opt.code})</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-4 bg-white p-2.5 rounded-xl border border-slate-200">
                        <label className="text-[9px] text-slate-400 font-bold block uppercase">Leg {idx + 1} To</label>
                        <select
                          value={leg.destination}
                          onChange={(e) => {
                            const updated = [...multiCityLegs];
                            updated[idx].destination = e.target.value;
                            setMultiCityLegs(updated);
                          }}
                          className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none"
                        >
                          {destOptions.map((opt) => (
                            <option key={opt.code} value={opt.name}>{opt.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-3 bg-white p-2.5 rounded-xl border border-slate-200">
                        <label className="text-[9px] text-slate-400 font-bold block uppercase">Date</label>
                        <input
                          type="date"
                          value={leg.date}
                          onChange={(e) => {
                            const updated = [...multiCityLegs];
                            updated[idx].date = e.target.value;
                            setMultiCityLegs(updated);
                          }}
                          className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
                        />
                      </div>

                      <div className="md:col-span-1 flex justify-center">
                        {multiCityLegs.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setMultiCityLegs(multiCityLegs.filter((_, i) => i !== idx))}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Special Fare Selection Section */}
              <div className="mt-6">
                <span className="text-xs font-bold text-slate-600 block mb-2.5 uppercase tracking-wide">
                  Select a Special Fare
                </span>
                
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: "Regular", name: "Regular Fares", sub: "Standard pricing" },
                    { id: "Student", name: "Student", sub: "Flat 10% off base" },
                    { id: "Armed Forces", name: "Armed Forces", sub: "Flat 15% off base" },
                    { id: "Senior Citizen", name: "Senior Citizen", sub: "Flat 12% off base" },
                    { id: "Doctor & Nurses", name: "Doctor & Nurses", sub: "Flat 10% off base" },
                    { id: "GST", name: "Have a GST number?", sub: "Enter corporate details" },
                  ].map((fare) => (
                    <button
                      key={fare.id}
                      type="button"
                      onClick={() => {
                        setFareType(fare.id);
                        if (fare.id !== "GST") {
                          setGstNumber("");
                          setGstCompanyName("");
                        }
                      }}
                      className={`px-4 py-3 rounded-xl border text-left transition-all cursor-pointer min-w-[130px] flex flex-col justify-between ${
                        fareType === fare.id
                          ? "bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-500/10 text-slate-900"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <span className="text-xs font-bold block">{fare.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{fare.sub}</span>
                    </button>
                  ))}
                </div>

                {/* GST input fields when selected */}
                {fareType === "GST" && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-4 items-end animate-fadeIn max-w-2xl">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">GSTIN (15-Digit)</span>
                      <input
                        type="text"
                        maxLength={15}
                        required
                        placeholder="e.g. 07AAAAA1111A1Z1"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                        className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold w-64 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Company Name</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Roman Luxury Corp"
                        value={gstCompanyName}
                        onChange={(e) => setGstCompanyName(e.target.value)}
                        className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold w-64 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold mb-2.5">
                      ✔ Tax Invoice Active
                    </span>
                  </div>
                )}
              </div>

              {/* MakeMyTrip Centered Floating Search Button */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-40">
                <button
                  type="submit"
                  className="px-20 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-space font-bold text-sm uppercase tracking-wider rounded-full shadow-2xl hover:shadow-blue-500/20 transition-all flex items-center gap-3 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Plane className="h-5 w-5 fill-white" />
                  <span>SEARCH</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

      {/* Main Results & Filter Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Quick Filter Bar & Info */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Filter Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-space text-xs uppercase font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#051433]" />
                  Filter Aircraft
                </h3>
                {(engineFilter !== "all" || capacityFilter > 0 || maxPrice < 500000) && (
                  <button
                    onClick={() => {
                      setEngineFilter("all");
                      setCapacityFilter(0);
                      setMaxPrice(500000);
                    }}
                    className="text-[10px] text-blue-600 hover:underline font-bold uppercase"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Engine Type Filter */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Engine Type</label>
                <div className="flex flex-col gap-1.5 text-xs font-medium">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="engine"
                      checked={engineFilter === "all"}
                      onChange={() => setEngineFilter("all")}
                      className="accent-[#051433]"
                    />
                    <span>All Engines</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="engine"
                      checked={engineFilter === "twin"}
                      onChange={() => setEngineFilter("twin")}
                      className="accent-[#051433]"
                    />
                    <span>Twin-Engine (Mountain Rated)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="engine"
                      checked={engineFilter === "single"}
                      onChange={() => setEngineFilter("single")}
                      className="accent-[#051433]"
                    />
                    <span>Single Engine</span>
                  </label>
                </div>
              </div>

              {/* Capacity Filter */}
              <div className="flex flex-col gap-2 mb-5 border-t border-slate-100 pt-4">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Min Passenger Seats</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[0, 4, 5, 6].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setCapacityFilter(cap)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        capacityFilter === cap
                          ? "bg-[#051433] text-white border-[#051433]"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cap === 0 ? "Any" : `${cap}+ Seats`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Max Budget</label>
                  <span className="text-xs font-bold text-[#051433]">₹{maxPrice.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={500000}
                  step={20000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#051433]"
                />
              </div>
            </div>

            {/* MMT Guarantee Badge Card */}
            <div className="bg-gradient-to-br from-[#051433] to-[#0D2D6C] text-white p-5 rounded-2xl shadow-md border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <h4 className="font-space text-xs uppercase font-bold tracking-wider">AURA Safety Assured</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                100% DGCA-certified multi-engine helicopters with dual pilot command, real-time satellite radar tracking, and Executive lounge boarding.
              </p>
            </div>

          </div>

          {/* Right Column: Search Results List */}
          <div className="lg:col-span-9 flex flex-col gap-4">

            {/* MakeMyTrip Sort Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 uppercase font-space">Sort By:</span>
                <button
                  onClick={() => setSortBy("price_asc")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    sortBy === "price_asc" ? "bg-[#051433] text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Cheapest
                </button>
                <button
                  onClick={() => setSortBy("speed")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    sortBy === "speed" ? "bg-[#051433] text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Fastest Flight
                </button>
                <button
                  onClick={() => setSortBy("capacity")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    sortBy === "capacity" ? "bg-[#051433] text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Max Capacity
                </button>
                <button
                  onClick={() => setSortBy("safety")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    sortBy === "safety" ? "bg-[#051433] text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Safety Rating
                </button>
              </div>

              <div className="text-xs text-slate-600 font-medium">
                Found <span className="font-bold text-slate-900">{filteredHelis.length}</span> Verified Aircraft
              </div>
            </div>

            {/* MakeMyTrip Flight Listing Cards */}
            {filteredHelis.map((heli) => {
              const totalPrice = Number(heli.price) * (totalPassengers || 1);

              return (
                <motion.div
                  key={heli.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition-all shadow-md hover:shadow-xl p-5 md:p-6 flex flex-col md:flex-row gap-6 text-slate-800"
                >
                  {/* Aircraft Image & Model Badge */}
                  <div className="md:w-4/12 relative h-48 md:h-auto rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img 
                      src={heli.image} 
                      alt={heli.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-[#051433] text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded-md">
                      {heli.model}
                    </div>
                  </div>

                  {/* Flight Details & Schedule Breakdown */}
                  <div className="md:w-8/12 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-space text-lg font-bold text-slate-900">{heli.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{heli.tagline}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold">
                          <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
                          <span>{heli.safetyRating}</span>
                        </div>
                      </div>

                      {/* Flight Path Graphic Line */}
                      <div className="flex items-center justify-between my-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Departure</span>
                          <span className="text-xs font-bold text-slate-900">{paramSource.split(" ")[0]}</span>
                        </div>

                        <div className="flex flex-col items-center flex-1 px-4">
                          <div className="text-[10px] text-slate-500 font-bold mb-1 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {heli.speed.includes("240") ? "45 Mins" : "35 Mins"}
                          </div>
                          <div className="w-full h-[2px] bg-slate-300 relative flex items-center justify-center">
                            <Helicopter className="h-4 w-4 text-[#051433] bg-slate-50 px-0.5 absolute" />
                          </div>
                          <span className="text-[9px] text-emerald-600 font-bold mt-1">Direct Flight</span>
                        </div>

                        <div className="flex flex-col text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Arrival</span>
                          <span className="text-xs font-bold text-slate-900">{paramDest.split(" ")[0]}</span>
                        </div>
                      </div>

                      {/* Aircraft Specifications & Features */}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                          ⚡ {heli.speed} Cruise
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                          👤 {heli.capacity} Seater
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                          📍 {heli.range} Max Range
                        </span>
                      </div>
                    </div>

                    {/* Pricing & MakeMyTrip CTA Button */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Price ({totalPassengers} Pax)</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold font-space text-slate-900">
                            ₹{totalPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-slate-500">
                            (₹{Number(heli.price).toLocaleString("en-IN")}/pax)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleSelectFlight(heli)}
                          className="px-6 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] hover:to-[#C57A2D] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <span>BOOK FLIGHT</span>
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
        <div className="min-h-screen bg-[#F2F5F8] flex items-center justify-center text-slate-800 font-space text-sm">
          Loading MakeMyTrip Flight Search...
        </div>
      }
    >
      <BookingSearchContent />
    </Suspense>
  );
}
