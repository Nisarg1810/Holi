"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/utils/api";
import { BoatListing } from "@/utils/mockData";
import { useCartStore } from "@/store/useCartStore";
import { Star, Anchor, ShieldCheck, Check, Calendar, Users, Clock, ArrowRight, Ship, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import SearchBox from "@/components/booking/SearchBox";

function BoatsListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setItem = useCartStore((state) => state.setItem);

  const paramSource = searchParams.get("source") || "Goa Harbor";
  const paramDest = searchParams.get("destination") || "Panaji Coastline";
  const paramDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const paramPassengers = Number(searchParams.get("passengers")) || 2;

  const [boatsList, setBoatsList] = useState<BoatListing[]>([]);
  const [loading, setLoading] = useState(true);

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
            features: dbBoat.features && dbBoat.features.length > 0 ? dbBoat.features : ["Private Captain & Crew", "Onboard Refreshments", "Safety Equipment"],
            capacity: dbBoat.capacity || 6,
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

  const [hoursSelected, setHoursSelected] = useState<{ [boatId: string]: number }>({
    "b-1": 3,
    "b-2": 2,
  });

  const handleBookBoat = (boat: BoatListing) => {
    const hours = hoursSelected[boat.id] || 3;
    const finalPrice = Number(boat.price) * hours;
    const paramFareType = searchParams.get("fare_type") || "Regular";
    const paramGstNumber = searchParams.get("gst_number") || "";

    setItem({
      type: "boat",
      id: boat.id,
      name: boat.name,
      price: finalPrice,
      date: paramDate,
      passengers: paramPassengers,
      details: `${boat.location} (${boat.type || "Luxury Yacht"})`,
      duration: `${hours} Hours Cruise`,
      image: boat.image,
      fare_type: paramFareType,
      gst_number: paramGstNumber,
    });
    router.push("/checkout");
  };

  const updateHours = (boatId: string, val: number) => {
    setHoursSelected({
      ...hoursSelected,
      [boatId]: Math.max(1, val),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F5F8] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 bg-slate-300 rounded animate-pulse mb-4" />
          <div className="flex flex-col gap-6">
            {[1, 2].map((i) => (
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
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-8 pb-20 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-6 gap-4">
            <div>
              <h1 className="font-space text-3xl font-bold tracking-tight text-white">Yacht & Boat Charters</h1>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Luxury catamarans, speedboats, and private river cruisers across Goa & Kerala
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-gold px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 font-bold">
              <ShieldCheck className="h-4 w-4 text-gold" /> Certified Marine Captains
            </div>
          </div>

          {/* Unified MakeMyTrip Search Widget for Yachts & Boats */}
          <div className="mt-8">
            <SearchBox />
          </div>
        </div>
      </div>

      {/* Main Listing Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        <div className="flex flex-col gap-6">
          {boatsList.map((boat) => {
            const hours = hoursSelected[boat.id] || 3;
            const totalPrice = Number(boat.price) * hours;
            const features = Array.isArray(boat.features) && boat.features.length > 0
              ? boat.features
              : ["Private Captain & Crew", "Onboard Refreshments", "Safety Equipment"];

            return (
              <motion.div
                key={boat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition-all shadow-md hover:shadow-xl p-6 flex flex-col lg:flex-row gap-6 text-slate-800"
              >
                {/* Yacht Image */}
                <div className="lg:w-4/12 relative h-56 lg:h-auto rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={boat.image}
                    alt={boat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#051433] text-white px-2.5 py-1 rounded text-[10px] font-bold font-mono">
                    {boat.type || "Luxury Yacht"}
                  </div>
                </div>

                {/* Details Column */}
                <div className="lg:w-8/12 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-space text-xl font-bold text-slate-900">{boat.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{boat.location || "Goa Harbor, India"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-200">
                        <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
                        <span>4.9/5.0</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-sans mt-3 leading-relaxed">
                      {boat.description}
                    </p>

                    {/* Features Tags */}
                    <div className="flex flex-wrap gap-2 my-4">
                      <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium">
                        👥 Capacity: {boat.capacity || "8 Guests"}
                      </span>
                      {features.map((feat: string, i: number) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>

                    {/* Duration Selector */}
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 w-fit">
                      <span className="text-xs font-bold text-slate-700 uppercase">Cruise Duration:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateHours(boat.id, hours - 1)}
                          className="h-7 w-7 rounded-lg bg-white border border-slate-300 font-bold flex items-center justify-center hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-900 w-16 text-center">{hours} Hours</span>
                        <button
                          onClick={() => updateHours(boat.id, hours + 1)}
                          className="h-7 w-7 rounded-lg bg-white border border-slate-300 font-bold flex items-center justify-center hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & MakeMyTrip CTA */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Charter Cost ({hours} Hours)</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold font-space text-slate-900">
                          ₹{totalPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-slate-500">
                          (₹{Number(boat.price).toLocaleString("en-IN")}/hr)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookBoat(boat)}
                      className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] hover:to-[#C57A2D] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>RESERVE YACHT</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function BoatsListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F2F5F8] flex items-center justify-center">Loading Boats...</div>}>
      <BoatsListingContent />
    </Suspense>
  );
}
