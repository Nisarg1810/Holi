"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, MapPin, Search, Compass, Anchor, Building, Helicopter, Plane, ShieldCheck, ArrowRight } from "lucide-react";

type BookingType = "helicopter" | "package" | "hotel" | "boat" | "charter";

export default function SearchBox() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingType>("helicopter");
  const [source, setSource] = useState("Dehradun (DED)");
  const [destination, setDestination] = useState("Kedarnath Sanctuary");
  const [journeyType, setJourneyType] = useState("One Way");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(2);

  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = `?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&trip_type=${encodeURIComponent(journeyType)}&date=${date}&passengers=${passengers}`;
    
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

  const tabs = [
    { id: "helicopter", name: "Helicopter Booking", icon: Helicopter },
    { id: "charter", name: "Bespoke Charters", icon: Plane },
    { id: "package", name: "Tour Packages", icon: Compass },
    { id: "hotel", name: "Hotels", icon: Building },
    { id: "boat", name: "Boat Services", icon: Anchor },
  ] as const;

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
  };

  const filteredSources = locations[activeTab].sources.filter(loc =>
    loc.toLowerCase().includes(fromQuery.toLowerCase())
  );
  
  const filteredDestinations = locations[activeTab].destinations.filter(loc =>
    loc.toLowerCase().includes(toQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto bg-white text-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
      {/* MMT Category Selector Tabs */}
      <div className="flex border-b border-slate-100 bg-[#051433] text-white overflow-x-auto scrollbar-none whitespace-nowrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setSource(locations[tab.id].sources[0]);
                setDestination(locations[tab.id].destinations[0]);
                setFromQuery("");
                setToQuery("");
              }}
              className={`flex-none sm:flex-1 flex items-center justify-center gap-2 py-4 px-5 font-space text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-[#051433] border-t-4 border-[#F5A623] shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? "text-[#051433]" : "text-slate-400"}`} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* MMT Form Inputs Grid */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-5 items-end bg-white">
        
        {/* FROM Location */}
        <div className="md:col-span-3 bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-[#051433] transition-colors relative" onMouseLeave={() => setIsFromOpen(false)}>
          <label className="font-space text-[9px] tracking-wider text-slate-400 uppercase font-bold flex items-center gap-1 mb-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            From
          </label>
          <button
            type="button"
            onClick={() => {
              setIsFromOpen(!isFromOpen);
              setIsToOpen(false);
            }}
            className="w-full text-left font-bold text-slate-900 text-xs flex justify-between items-center"
          >
            <span className="truncate">{source}</span>
            <span className="text-[9px] text-slate-400">▼</span>
          </button>
          {isFromOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2 max-h-56 overflow-y-auto">
              <input
                type="text"
                placeholder="Search..."
                value={fromQuery}
                onChange={(e) => setFromQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-black focus:outline-none mb-1 font-sans"
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
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 text-xs text-slate-700 font-medium"
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TO Location */}
        <div className="md:col-span-3 bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-[#051433] transition-colors relative" onMouseLeave={() => setIsToOpen(false)}>
          <label className="font-space text-[9px] tracking-wider text-slate-400 uppercase font-bold flex items-center gap-1 mb-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            To
          </label>
          <button
            type="button"
            onClick={() => {
              setIsToOpen(!isToOpen);
              setIsFromOpen(false);
            }}
            className="w-full text-left font-bold text-slate-900 text-xs flex justify-between items-center"
          >
            <span className="truncate">{destination}</span>
            <span className="text-[9px] text-slate-400">▼</span>
          </button>
          {isToOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2 max-h-56 overflow-y-auto">
              <input
                type="text"
                placeholder="Search..."
                value={toQuery}
                onChange={(e) => setToQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-black focus:outline-none mb-1 font-sans"
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
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 text-xs text-slate-700 font-medium"
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-[#051433] transition-colors">
          <label className="font-space text-[9px] tracking-wider text-slate-400 uppercase font-bold flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            Travel Date
          </label>
          <input
            type="date"
            required
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
          />
        </div>

        {/* Passengers */}
        <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-[#051433] transition-colors">
          <label className="font-space text-[9px] tracking-wider text-slate-400 uppercase font-bold flex items-center gap-1 mb-1">
            <Users className="h-3 w-3 text-slate-400" />
            Passengers
          </label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 8].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Passenger" : "Passengers"}
              </option>
            ))}
          </select>
        </div>

        {/* Big MakeMyTrip Search Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] hover:to-[#C57A2D] text-black font-space font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>SEARCH</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Security & Partners Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border-t border-slate-100 px-5 py-3 text-[10px] text-slate-500 font-sans">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="font-semibold text-slate-600">DGCA Authorized Flight Operations</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-400">Payment Partners:</span>
          <span className="px-2 py-0.5 border border-slate-200 rounded font-mono font-bold text-[9px] text-slate-700 bg-white">Razorpay</span>
          <span className="px-2 py-0.5 border border-slate-200 rounded font-mono font-bold text-[9px] text-slate-700 bg-white">UPI / NetBanking</span>
        </div>
      </div>
    </div>
  );
}
