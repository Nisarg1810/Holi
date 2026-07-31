"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Search, 
  Compass, 
  Anchor, 
  Building, 
  Helicopter, 
  Plane, 
  ShieldCheck, 
  ArrowRight, 
  ArrowRightLeft, 
  Minus, 
  Plus,
  Home,
  Shield,
  DollarSign,
  FileText,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type BookingType = "helicopter" | "package" | "hotel" | "boat" | "charter";

export default function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [activeTab, setActiveTab] = useState<BookingType>("helicopter");

  useEffect(() => {
    if (pathname.includes("/booking")) setActiveTab("helicopter");
    else if (pathname.includes("/hotels")) setActiveTab("hotel");
    else if (pathname.includes("/tours")) setActiveTab("package");
    else if (pathname.includes("/charter")) setActiveTab("charter");
    else if (pathname.includes("/boats")) setActiveTab("boat");
    else setActiveTab("helicopter");
  }, [pathname]);
  const [source, setSource] = useState("Dehradun (DED)");
  const [destination, setDestination] = useState("Kedarnath Sanctuary");
  const [journeyType, setJourneyType] = useState("One Way");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [returnDate, setReturnDate] = useState("");
  
  // Passenger counters
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showPaxDropdown, setShowPaxDropdown] = useState(false);

  // Special Fare counters
  const [fareType, setFareType] = useState("Regular");
  const [gstNumber, setGstNumber] = useState("");
  const [gstCompanyName, setGstCompanyName] = useState("");

  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");

  const totalPassengers = adults + children;

  const locations = {
    helicopter: {
      sources: ["Dehradun (DED)", "New Delhi Hub", "Srinagar Terminal", "Goa Beachfront Heliport"],
      destinations: ["Kedarnath Sanctuary", "Badrinath Valley", "Srinagar Terminal", "Goa Shoreline", "Mumbai Heliport"],
    },
    charter: {
      sources: ["New Delhi Hub (DEL)", "Dehradun Terminal (DED)", "Mumbai Corporate Helipad", "Goa Beachfront Heliport", "Srinagar Terminal (SXR)"],
      destinations: ["Kedarnath Sanctuary", "Badrinath Valley", "Srinagar Terminal (SXR)", "Mumbai Corporate Helipad", "Goa Beachfront Heliport"],
    },
    package: {
      sources: ["All Locations", "Dehradun (DED)", "Goa Harbor"],
      destinations: ["Himalayan Sacred Peaks Pilgrimage", "Goan Coastline Yacht & Sky Odyssey", "Dwarka – Somnath – Diu Pilgrimage"],
    },
    hotel: {
      sources: ["India", "All Locations"],
      destinations: ["Mussoorie", "Goa", "Badrinath", "Udaipur"],
    },
    boat: {
      sources: ["Harbors"],
      destinations: ["AURA Prestige 75 Yacht, Goa", "Mandovi Royal Speedboat, Goa"],
    },
  } as const;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = `?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&trip_type=${encodeURIComponent(journeyType)}&date=${date}&return_date=${returnDate}&adults=${adults}&children=${children}&infants=${infants}&passengers=${totalPassengers}&fare_type=${fareType}&gst_number=${gstNumber}`;
    
    if (activeTab === "helicopter") {
      router.push(`/booking${query}`);
    } else if (activeTab === "package") {
      router.push(`/tours${query}`);
    } else if (activeTab === "hotel") {
      router.push(`/hotels${query}`);
    } else if (activeTab === "charter") {
      router.push(`/charter${query}`);
    } else {
      router.push(`/boats${query}`);
    }
  };

  const handleSwapLocations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  // Date formatter for MakeMyTrip style
  const getFormattedDate = (dateStr: string) => {
    if (!dateStr) return { day: "--", monthYear: "Select Date", weekday: "" };
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return { day: "--", monthYear: "Select Date", weekday: "" };
      const day = dateObj.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[dateObj.getMonth()];
      const year = dateObj.getFullYear().toString().slice(-2);
      const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const weekday = weekdayNames[dateObj.getDay()];
      return {
        day: day.toString().padStart(2, "0"),
        monthYear: `${month}'${year}`,
        weekday
      };
    } catch {
      return { day: "--", monthYear: "Select Date", weekday: "" };
    }
  };

  const departDateObj = getFormattedDate(date);
  const returnDateObj = getFormattedDate(returnDate);

  const categories = [
    { id: "helicopter", name: "Helicopters", icon: Helicopter, href: "/booking" },
    { id: "hotel", name: "Hotels", icon: Building, href: "/hotels" },
    { id: "package", name: "Holiday Packages", icon: Compass, href: "/tours" },
    { id: "charter", name: "Bespoke Charters", icon: Plane, href: "/charter" },
    { id: "boat", name: "Yacht Service", icon: Anchor, href: "/boats" }
  ];

  const filteredSources = locations[activeTab]?.sources?.filter(loc =>
    loc.toLowerCase().includes(fromQuery.toLowerCase())
  ) || [];
  
  const filteredDestinations = locations[activeTab]?.destinations?.filter(loc =>
    loc.toLowerCase().includes(toQuery.toLowerCase())
  ) || [];

  return (
    <div className="w-full relative z-30">
      {/* MakeMyTrip Centered Top Navigation Tabs - Overlapping the Hero Grid */}
      <div className="flex justify-center -mb-8 relative z-30">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200/80 px-6 py-3 flex items-center justify-start gap-8 overflow-x-auto max-w-full no-scrollbar">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isTabActive = activeTab === cat.id;
            return (
              <Link
                key={i}
                href={cat.href || "#"}
                className={`flex flex-col items-center gap-1 min-w-[70px] transition-all relative cursor-pointer ${
                  isTabActive 
                    ? "text-blue-600 font-bold" 
                    : "text-slate-500 hover:text-blue-500 font-medium"
                }`}
              >
                <Icon className={`h-5 w-5 ${isTabActive ? "text-blue-600 animate-pulse" : "text-slate-400"}`} />
                <span className="text-[11px] whitespace-nowrap">{cat.name}</span>
                {isTabActive && (
                  <span className="absolute -bottom-3 left-0 right-0 h-[3px] bg-blue-600 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* MakeMyTrip Style Main Search Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 pt-14 text-slate-800 border border-slate-200/60 mt-4 relative z-20">
        
        {/* Trip Type Selector & Headline */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-6">
          <div className="flex items-center gap-6">
            {(activeTab === "helicopter" || activeTab === "charter") ? (
              <>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs font-bold text-slate-700">
                  <input
                    type="radio"
                    name="hometriptype"
                    checked={journeyType === "One Way"}
                    onChange={() => setJourneyType("One Way")}
                    className="accent-blue-600 h-4 w-4"
                  />
                  <span>One Way</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs font-bold text-slate-700">
                  <input
                    type="radio"
                    name="hometriptype"
                    checked={journeyType === "Round Trip"}
                    onChange={() => setJourneyType("Round Trip")}
                    className="accent-blue-600 h-4 w-4"
                  />
                  <span>Round Trip</span>
                </label>
              </>
            ) : (
              <span className="text-xs font-bold font-space uppercase text-blue-600 tracking-wider">
                {activeTab === "hotel" ? "Book Premium Hotels & Resorts" : activeTab === "package" ? "Book Curated Holiday Packages" : "Book Luxury Yacht & Cruise Charters"}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-400 font-bold font-sans">
            DGCA Authorized Fleet Operations
          </div>
        </div>

        {/* MakeMyTrip Styled Input Grid */}
        <form onSubmit={handleSearch} className="relative pb-6">
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 border border-slate-300 rounded-xl overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200 bg-white">
              
              {/* FROM Section */}
              <div 
                className="lg:col-span-3 p-4 hover:bg-slate-50 transition-all cursor-pointer relative group"
                onClick={() => {
                  setIsFromOpen(!isFromOpen);
                  setIsToOpen(false);
                }}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  {activeTab === "hotel" ? "Country / Region" : "From"}
                </span>
                <span className="w-full bg-transparent font-space text-base font-bold text-slate-900 focus:outline-none block truncate">
                  {source}
                </span>
                <span className="text-[10px] text-slate-500 block truncate mt-1">
                  {activeTab === "helicopter" || activeTab === "charter" ? "Primary Departure Heliport" : "Departure Hub"}
                </span>

                {/* Dropdown Options */}
                <AnimatePresence>
                  {isFromOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2 max-h-56 overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        placeholder="Search..."
                        value={fromQuery}
                        onChange={(e) => setFromQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-black focus:outline-none mb-1 font-sans"
                      />
                      {filteredSources.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setSource(loc);
                            setIsFromOpen(false);
                            setFromQuery("");
                          }}
                          className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-100 text-xs text-slate-700 font-bold block"
                        >
                          {loc}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Swap Circle Button (Only for Flights) */}
              {(activeTab === "helicopter" || activeTab === "charter") && (
                <div className="absolute left-[25%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden lg:block">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwapLocations();
                    }}
                    className="h-8 w-8 rounded-full border border-slate-300 bg-white hover:bg-slate-50 shadow-md flex items-center justify-center text-blue-600 hover:text-blue-700 transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* TO Section */}
              <div 
                className="lg:col-span-3 p-4 hover:bg-slate-50 transition-all cursor-pointer group relative"
                onClick={() => {
                  setIsToOpen(!isToOpen);
                  setIsFromOpen(false);
                }}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  {activeTab === "hotel" ? "Check-in City / Resort" : "To"}
                </span>
                <span className="w-full bg-transparent font-space text-base font-bold text-slate-900 focus:outline-none block truncate">
                  {destination}
                </span>
                <span className="text-[10px] text-slate-500 block truncate mt-1">
                  {activeTab === "hotel" ? "Destination Location" : "Arrival Sanctuary / Port"}
                </span>

                {/* Dropdown Options */}
                <AnimatePresence>
                  {isToOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2 max-h-56 overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        placeholder="Search..."
                        value={toQuery}
                        onChange={(e) => setToQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-black focus:outline-none mb-1 font-sans"
                      />
                      {filteredDestinations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setDestination(loc);
                            setIsToOpen(false);
                            setToQuery("");
                          }}
                          className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-100 text-xs text-slate-700 font-bold block"
                        >
                          {loc}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* DEPARTURE Section */}
              <div className="lg:col-span-2 p-4 hover:bg-slate-50 transition-all cursor-pointer relative">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  {activeTab === "hotel" ? "Check-In" : "Travel Date"}
                </span>
                <div className="relative">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-space text-2xl font-bold text-slate-900">{departDateObj.day}</span>
                    <span className="font-space text-sm font-bold text-slate-800">{departDateObj.monthYear}</span>
                  </div>
                  <span className="text-xs text-slate-500 block mt-0.5">{departDateObj.weekday || "Select Date"}</span>
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>

              {/* RETURN Section */}
              <div 
                className={`lg:col-span-2 p-4 hover:bg-slate-50 transition-all cursor-pointer relative ${
                  (journeyType === "One Way" && (activeTab === "helicopter" || activeTab === "charter")) ? "bg-slate-50/50" : ""
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  {activeTab === "hotel" ? "Check-Out" : "Return Date"}
                </span>
                {((activeTab === "helicopter" || activeTab === "charter") && journeyType === "One Way") ? (
                  <div 
                    onClick={() => {
                      setJourneyType("Round Trip");
                      if (date) {
                        const d = new Date(date);
                        d.setDate(d.getDate() + 2);
                        setReturnDate(d.toISOString().split("T")[0]);
                      }
                    }}
                    className="flex flex-col justify-center h-full min-h-[36px]"
                  >
                    <span className="text-[10px] text-slate-400 font-bold font-sans hover:text-blue-600 transition-colors">
                      Tap to add return date for discounts
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
                      required={journeyType === "Round Trip" || activeTab === "hotel"}
                      value={returnDate}
                      min={date || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                )}
              </div>

              {/* TRAVELLERS & CLASS Section */}
              <div className="lg:col-span-2 p-4 hover:bg-slate-50 transition-all cursor-pointer relative">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  {activeTab === "hotel" ? "Guests & Rooms" : "Guests & Class"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPaxDropdown(!showPaxDropdown)}
                  className="w-full text-left focus:outline-none"
                >
                  <div className="flex items-baseline gap-1">
                    <span className="font-space text-xl font-bold text-slate-900">{totalPassengers}</span>
                    <span className="font-space text-sm font-bold text-slate-800">Guest{totalPassengers > 1 ? "s" : ""}</span>
                  </div>
                  <span className="text-xs text-slate-500 block truncate mt-0.5">
                    {activeTab === "hotel" ? "Standard Room Class" : "Executive VIP Class"}
                  </span>
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
              <Search className="h-5 w-5" />
              <span>SEARCH</span>
            </button>
          </div>
        </form>

      </div>

      {/* Security & Partners Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-t-0 border-slate-200 rounded-b-3xl px-8 py-4 text-[10px] text-slate-500 font-sans shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="font-semibold text-slate-600">DGCA NSOP Flight License Authorized Operations</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-400">Secure Gateways:</span>
          <span className="px-2.5 py-0.5 border border-slate-200 rounded font-mono font-bold text-[9px] text-slate-700 bg-white">Razorpay</span>
          <span className="px-2.5 py-0.5 border border-slate-200 rounded font-mono font-bold text-[9px] text-slate-700 bg-white">Stripe Express</span>
          <span className="px-2.5 py-0.5 border border-slate-200 rounded font-mono font-bold text-[9px] text-slate-700 bg-white">PhonePe UPI</span>
        </div>
      </div>
    </div>
  );
}
