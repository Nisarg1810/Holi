"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Trash2, ShieldCheck, Weight, Info, Calendar, Users, ChevronRight, Helicopter, Plane, Award, MapPin, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBox from "@/components/booking/SearchBox";

interface Leg {
  source: string;
  destination: string;
}

interface PassengerWeight {
  name: string;
  weight: number;
}

const MAP_COORDINATES: Record<string, { x: number; y: number; label: string }> = {
  "New Delhi Hub (DEL)": { x: 190, y: 190, label: "Delhi (DEL)" },
  "Dehradun Terminal (DED)": { x: 215, y: 155, label: "Dehradun (DED)" },
  "Kedarnath Sanctuary": { x: 235, y: 130, label: "Kedarnath" },
  "Badrinath Valley": { x: 255, y: 135, label: "Badrinath" },
  "Srinagar Terminal (SXR)": { x: 165, y: 80, label: "Srinagar (SXR)" },
  "Katra Staging Helipad": { x: 155, y: 105, label: "Katra" },
  "Mumbai Corporate Helipad": { x: 120, y: 350, label: "Mumbai (BOM)" },
  "Goa Beachfront Heliport": { x: 135, y: 400, label: "Goa (GOI)" }
};

const STAGING_LOCATIONS = Object.keys(MAP_COORDINATES);

const HELI_MODELS = [
  { id: "h-1", name: "Airbus H145", capacity: 900, ratePerLeg: 220000, desc: "Twin-engine Executive cabin · Max 900 kg payload" },
  { id: "h-2", name: "Bell 429", capacity: 750, ratePerLeg: 180000, desc: "High-altitude power · Max 750 kg payload" },
  { id: "h-3", name: "AgustaWestland AW109", capacity: 600, ratePerLeg: 150000, desc: "Executive shuttle · Max 600 kg payload" }
];

function CharterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setItem = useCartStore((state) => state.setItem);

  const today = new Date().toISOString().split("T")[0];

  const paramSource = searchParams.get("source") || "New Delhi Hub (DEL)";
  const paramDest = searchParams.get("destination") || "Dehradun Terminal (DED)";
  const paramDate = searchParams.get("date") || today;
  const paramPassengers = Number(searchParams.get("passengers")) || 2;

  const [legs, setLegs] = useState<Leg[]>([
    { source: paramSource, destination: paramDest }
  ]);

  const [selectedHeliId, setSelectedHeliId] = useState("h-1");
  const activeHeli = HELI_MODELS.find((h) => h.id === selectedHeliId) || HELI_MODELS[0];

  const [departureDate, setDepartureDate] = useState(paramDate);

  const [passengers, setPassengers] = useState<PassengerWeight[]>(() => {
    const list: PassengerWeight[] = [{ name: "Primary Charterer", weight: 78 }];
    for (let i = 2; i <= paramPassengers; i++) {
      list.push({ name: `Guest #${i}`, weight: 70 });
    }
    return list;
  });
  const [luggageCount, setLuggageCount] = useState(2);

  // Sync state when search parameters change
  useEffect(() => {
    setDepartureDate(paramDate);
    setLegs([{ source: paramSource, destination: paramDest }]);
    
    const list: PassengerWeight[] = [{ name: "Primary Charterer", weight: 78 }];
    for (let i = 2; i <= paramPassengers; i++) {
      list.push({ name: `Guest #${i}`, weight: 70 });
    }
    setPassengers(list);
  }, [paramSource, paramDest, paramDate, paramPassengers]);

  const totalPassengerWeight = passengers.reduce((sum, p) => sum + p.weight, 0);
  const totalLuggageWeight = luggageCount * 15;
  const totalPayload = totalPassengerWeight + totalLuggageWeight;
  const isOverweight = totalPayload > activeHeli.capacity;
  const safetyPercentage = Math.min(100, (totalPayload / activeHeli.capacity) * 100);

  const pricePerLeg = activeHeli.ratePerLeg;
  const subtotal = legs.length * pricePerLeg;
  const tax = subtotal * 0.18;
  const finalPrice = subtotal + tax;

  const handleAddLeg = () => {
    if (legs.length >= 4) return;
    const lastDest = legs[legs.length - 1].destination;
    const nextDest = STAGING_LOCATIONS.find((loc) => loc !== lastDest) || STAGING_LOCATIONS[0];
    setLegs([...legs, { source: lastDest, destination: nextDest }]);
  };

  const handleRemoveLeg = (idx: number) => {
    if (legs.length <= 1) return;
    setLegs(legs.filter((_, i) => i !== idx));
  };

  const handleLegChange = (idx: number, field: keyof Leg, val: string) => {
    const updated = [...legs];
    updated[idx] = { ...updated[idx], [field]: val };
    setLegs(updated);
  };

  const handleAddPassenger = () => {
    if (passengers.length >= 8) return;
    setPassengers([...passengers, { name: `Guest #${passengers.length + 1}`, weight: 75 }]);
  };

  const handleRemovePassenger = (idx: number) => {
    if (passengers.length <= 1) return;
    setPassengers(passengers.filter((_, i) => i !== idx));
  };

  const handlePassengerWeightChange = (idx: number, field: keyof PassengerWeight, val: string | number) => {
    const updated = [...passengers];
    updated[idx] = {
      ...updated[idx],
      [field]: field === "weight" ? Number(val) : val
    };
    setPassengers(updated);
  };

  const handleReserveCharter = () => {
    if (isOverweight) {
      alert("Payload safety limit exceeded! Please reduce cargo weight or select a larger helicopter model.");
      return;
    }

    const routeStr = legs.map((l) => MAP_COORDINATES[l.source]?.label + " ➔ " + MAP_COORDINATES[l.destination]?.label).join(" | ");
    const paramFareType = searchParams.get("fare_type") || "Regular";
    const paramGstNumber = searchParams.get("gst_number") || "";

    setItem({
      type: "helicopter",
      id: `bespoke-charter-${Date.now()}`,
      name: `Bespoke Charter: ${activeHeli.name}`,
      price: finalPrice,
      date: departureDate,
      passengers: passengers.length,
      details: `Multi-Leg Charter: ${routeStr} · Total Payload: ${totalPayload}kg / ${activeHeli.capacity}kg`,
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop",
      fare_type: paramFareType,
      gst_number: paramGstNumber,
    });

    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      
      {/* MakeMyTrip Style Hero Header */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-8 pb-20 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-6 gap-4">
            <div>
              <h1 className="font-space text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <Plane className="h-7 w-7 text-amber-400" />
                Bespoke Flight Charters
              </h1>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Build custom multi-leg flight corridors, verify real-time payload safety, and charter Luxury helicopters
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#F5A623] px-3.5 py-1.5 rounded-full border border-[#F5A623]/30 bg-[#F5A623]/10 font-bold">
              <ShieldCheck className="h-4 w-4 text-[#F5A623]" /> Real-Time Payload Verification
            </div>
          </div>

          {/* Unified MakeMyTrip Search Widget for Bespoke Charters */}
          <div className="mt-8">
            <SearchBox />
          </div>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Route, Fleet & Payload Builder */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* 1. Build Flight Legs Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="font-space text-sm uppercase font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#051433]" />
                  1. Build Custom Flight Legs
                </h3>
                <span className="text-xs font-bold text-slate-500 font-mono">Max 4 Legs</span>
              </div>

              <div className="flex flex-col gap-3">
                {legs.map((leg, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="md:col-span-1 text-xs font-bold font-space text-[#051433] uppercase">
                      Leg #{idx + 1}
                    </div>

                    <div className="md:col-span-5 flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Departure (From)</label>
                      <select
                        value={leg.source}
                        onChange={(e) => handleLegChange(idx, "source", e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#051433] cursor-pointer font-sans"
                      >
                        {STAGING_LOCATIONS.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-5 flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Destination (To)</label>
                      <select
                        value={leg.destination}
                        onChange={(e) => handleLegChange(idx, "destination", e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#051433] cursor-pointer font-sans"
                      >
                        {STAGING_LOCATIONS.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                      {legs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLeg(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {legs.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddLeg}
                  className="mt-4 py-2.5 px-4 bg-[#051433] hover:bg-[#092254] text-white rounded-xl text-xs font-space font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Flight Leg
                </button>
              )}
            </div>

            {/* 2. Select Aircraft Model */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800">
              <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
                <Helicopter className="h-4 w-4 text-[#051433]" />
                2. Private Helicopter Model
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {HELI_MODELS.map((heli) => {
                  const isSelected = selectedHeliId === heli.id;
                  return (
                    <button
                      key={heli.id}
                      type="button"
                      onClick={() => setSelectedHeliId(heli.id)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-36 ${
                        isSelected
                          ? "bg-slate-50 border-[#051433] shadow-md ring-2 ring-[#051433]/20"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-[#051433] text-white" : "bg-slate-100 text-slate-600"}`}>
                            <Helicopter className="h-4.5 w-4.5" />
                          </div>
                          {isSelected && <span className="text-[10px] font-bold bg-[#051433] text-white px-2 py-0.5 rounded">Selected</span>}
                        </div>
                        <span className="font-space font-bold text-slate-900 text-sm block">{heli.name}</span>
                        <span className="text-[10px] text-slate-500 mt-1 block leading-snug">{heli.desc}</span>
                      </div>
                      <div className="border-t border-slate-100 pt-3 mt-3 font-space text-xs font-bold text-slate-900">
                        ₹{heli.ratePerLeg.toLocaleString("en-IN")} <span className="text-[10px] font-normal text-slate-500">/ Leg</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Payload & Manifest Logger */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800">
              <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
                <Weight className="h-4 w-4 text-[#051433]" />
                3. Cabin Payload & Cargo Logger
              </h3>

              {/* Weight Safety Gauge */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-3 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-space uppercase font-bold text-slate-600">Total Cabin Payload</span>
                  <span className={`font-mono font-bold text-sm ${isOverweight ? "text-red-600" : "text-emerald-700"}`}>
                    {totalPayload} kg / {activeHeli.capacity} kg
                  </span>
                </div>

                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isOverweight ? "bg-red-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${safetyPercentage}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs font-medium">
                  <Info className={`h-4 w-4 ${isOverweight ? "text-red-500" : "text-emerald-600"}`} />
                  <span className={isOverweight ? "text-red-600 font-bold" : "text-slate-600"}>
                    {isOverweight 
                      ? "Warning: Weight limit exceeded! Upgrade helicopter model or drop secondary baggage."
                      : "Safety Approved: Payload is within DGCA high-altitude flight safety limits."
                    }
                  </span>
                </div>
              </div>

              {/* Passenger Roster Input Grid */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase">Passenger Roster & Weights</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {passengers.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => handlePassengerWeightChange(idx, "name", e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none w-2/3"
                        placeholder={`Guest #${idx + 1}`}
                      />
                      <div className="flex items-center gap-1 w-1/3">
                        <input
                          type="number"
                          value={p.weight || ""}
                          onChange={(e) => handlePassengerWeightChange(idx, "weight", e.target.value)}
                          className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold font-mono text-right w-full"
                          placeholder="kg"
                        />
                        <span className="text-[10px] text-slate-500">kg</span>
                      </div>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePassenger(idx)}
                          className="text-red-500 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                  {passengers.length < 8 && (
                    <button
                      type="button"
                      onClick={handleAddPassenger}
                      className="py-2 px-3 border border-slate-300 hover:border-black text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                    >
                      + Add Passenger
                    </button>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600">Baggage Bags:</span>
                    <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setLuggageCount((c) => Math.max(0, c - 1))}
                        className="px-2.5 py-1 text-xs font-bold text-slate-700"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-900">{luggageCount}</span>
                      <button
                        type="button"
                        onClick={() => setLuggageCount((c) => Math.min(8, c + 1))}
                        className="px-2.5 py-1 text-xs font-bold text-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Flight Map Tracker & Pricing */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-6">
            
            {/* SVG Flight Corridor Map */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-slate-800">
              <span className="font-space text-xs uppercase font-bold text-slate-900 block mb-3">
                Flight Corridor Tracker
              </span>

              <div className="h-[280px] w-full bg-[#051433] border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 350 450">
                  {legs.map((leg, idx) => {
                    const pt1 = MAP_COORDINATES[leg.source];
                    const pt2 = MAP_COORDINATES[leg.destination];
                    if (!pt1 || !pt2) return null;

                    const dx = pt2.x - pt1.x;
                    const dy = pt2.y - pt1.y;
                    const cx = pt1.x + dx / 2 - dy * 0.15;
                    const cy = pt1.y + dy / 2 + dx * 0.15;

                    return (
                      <g key={idx}>
                        <path
                          d={`M ${pt1.x} ${pt1.y} Q ${cx} ${cy} ${pt2.x} ${pt2.y}`}
                          fill="none"
                          stroke="#F5A623"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          className="opacity-70"
                        />
                      </g>
                    );
                  })}

                  {Object.entries(MAP_COORDINATES).map(([name, coords]) => {
                    const isActive = legs.some((l) => l.source === name || l.destination === name);
                    return (
                      <g key={name} transform={`translate(${coords.x}, ${coords.y})`}>
                        <circle
                          r={isActive ? 5 : 3}
                          className={isActive ? "fill-[#F5A623] stroke-white stroke-2" : "fill-white/40"}
                        />
                        <text
                          y="-8"
                          textAnchor="middle"
                          className={`text-[8px] font-space font-bold uppercase ${
                            isActive ? "fill-white font-bold" : "fill-slate-400"
                          }`}
                        >
                          {coords.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800 flex flex-col gap-4">
              <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3">
                Charter Estimate
              </h3>

              <div className="flex flex-col gap-2 text-xs font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Travel Date:</span>
                  <span className="font-bold text-slate-900">{departureDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Flight Legs:</span>
                  <span className="font-bold text-slate-900">{legs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aircraft:</span>
                  <span className="font-bold text-slate-900">{activeHeli.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passengers:</span>
                  <span className="font-bold text-slate-900">{passengers.length} Pax</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Leg Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Aviation GST (18%)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-end border-t border-slate-100 pt-3 mt-1">
                  <span className="font-space text-xs font-bold uppercase text-slate-900">Total Charter Rate</span>
                  <span className="font-space text-2xl font-bold text-slate-900">
                    ₹{finalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReserveCharter}
                disabled={isOverweight}
                className="w-full py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] hover:to-[#C57A2D] text-black font-space font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>BOOK PRIVATE CHARTER</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default function CharterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F2F5F8] flex items-center justify-center">Loading Charters...</div>}>
      <CharterContent />
    </Suspense>
  );
}
