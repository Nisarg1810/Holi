"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "@/utils/api";
import { useCartStore } from "@/store/useCartStore";
import { Star, Calendar, Users, Building, ArrowLeft, RefreshCw, MapPin, Check, ShieldAlert, ArrowRight, SlidersHorizontal, Image as ImageIcon, Sparkles, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBox from "@/components/booking/SearchBox";

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (d: string, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};

function HotelsListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setItem = useCartStore((state) => state.setItem);

  const initialCity = searchParams.get("destination") || searchParams.get("source") || "All";
  const initialCheckin = searchParams.get("date") || searchParams.get("checkin") || today();
  const initialCheckout = searchParams.get("return_date") || searchParams.get("checkout") || plusDays(initialCheckin, 2);
  const initialAdults = Number(searchParams.get("adults")) || Number(searchParams.get("passengers")) || 2;
  const initialRooms = Number(searchParams.get("rooms")) || 1;

  const [city, setCity] = useState(initialCity);
  const [checkin, setCheckin] = useState(initialCheckin);
  const [checkout, setCheckout] = useState(initialCheckout);
  const [adults, setAdults] = useState(initialAdults);
  const [rooms, setRooms] = useState(initialRooms);
  const [showPaxModal, setShowPaxModal] = useState(false);

  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [starFilter, setStarFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [dbHotels, setDbHotels] = useState<any[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);

  const cityOptions = [
    { name: "All Cities", code: "All" },
    { name: "Goa (Beach & Helipad)", code: "Goa" },
    { name: "Mussoorie (Himalayan)", code: "Mussoorie" },
    { name: "Badrinath (Pilgrimage)", code: "Badrinath" },
    { name: "Udaipur (Royal Palace)", code: "Udaipur" },
  ];

  // Calculate nights
  const getNights = () => {
    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 1;
  };

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await API.get("/hotels");
      const data = res.data || [];
      setDbHotels(data);
    } catch (err) {
      console.error("Failed to query live hotels database:", err);
      setDbHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    let result = [...dbHotels];

    // Filter by city
    if (city && city !== "All") {
      result = result.filter(
        (h) => h.city?.toLowerCase().includes(city.toLowerCase()) || 
               h.location?.toLowerCase().includes(city.toLowerCase()) ||
               h.name?.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (h) => h.name?.toLowerCase().includes(q) || h.location?.toLowerCase().includes(q)
      );
    }

    // Filter by star rating
    if (starFilter > 0) {
      result = result.filter((h) => Number(h.stars) === starFilter);
    }

    // Filter by price range
    if (priceFilter === "5000") {
      result = result.filter((h) => Number(h.price) <= 15000);
    } else if (priceFilter === "15000") {
      result = result.filter((h) => Number(h.price) > 15000 && Number(h.price) <= 25000);
    } else if (priceFilter === "25000") {
      result = result.filter((h) => Number(h.price) > 25000);
    }

    setFilteredHotels(result);
  }, [city, searchQuery, starFilter, priceFilter, dbHotels]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({
      destination: city,
      checkin,
      checkout,
      adults: String(adults),
      rooms: String(rooms),
    });
    router.push(`/hotels?${q.toString()}`);
  };

  const handleBookHotel = (hotel: any) => {
    const nights = getNights();
    const totalPrice = Number(hotel.price) * nights * rooms;
    const paramFareType = searchParams.get("fare_type") || "Regular";
    const paramGstNumber = searchParams.get("gst_number") || "";

    setItem({
      type: "hotel",
      id: hotel.id,
      name: hotel.name,
      price: totalPrice,
      date: checkin,
      passengers: adults,
      details: `${hotel.location} (${nights} Night${nights > 1 ? "s" : ""}, ${rooms} Room${rooms > 1 ? "s" : ""})`,
      duration: `${nights} Night Stay`,
      image: hotel.image,
      fare_type: paramFareType,
      gst_number: paramGstNumber,
    });
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F5F8] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 bg-slate-300 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white p-6 border border-slate-200 h-64 animate-pulse shadow-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      {/* Goibibo Header Search Hero Bar */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-6 pb-20 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-4 mb-5 gap-4">
            <div>
              <h1 className="font-space text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <Building className="h-7 w-7 text-amber-400" />
                Roman Luxury Hotels & Resorts
              </h1>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Book top 5-star hotels with private helipad access, lake views, and executive concierge services
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#F5A623] px-3.5 py-1.5 rounded-full border border-[#F5A623]/30 bg-[#F5A623]/10 font-bold">
              <Award className="h-4 w-4 text-[#F5A623]" /> Best Rate Guarantee
            </div>
          </div>

          {/* Unified MakeMyTrip Search Widget for Hotels */}
          <div className="mt-8">
            <SearchBox />
          </div>
        </div>
      </div>

      {/* Main Results & Filter Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Goibibo Filters */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-space text-xs uppercase font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#051433]" />
                  Filters
                </h3>
                {(starFilter > 0 || priceFilter !== "all") && (
                  <button
                    onClick={() => {
                      setStarFilter(0);
                      setPriceFilter("all");
                    }}
                    className="text-[10px] text-blue-600 font-bold uppercase hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Star Rating Filters */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Star Category</label>
                <div className="flex flex-col gap-1.5 text-xs font-medium">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="stars" checked={starFilter === 0} onChange={() => setStarFilter(0)} className="accent-[#051433]" />
                    <span>All Star Ratings</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="stars" checked={starFilter === 5} onChange={() => setStarFilter(5)} className="accent-[#051433]" />
                    <span>5 Star Luxury</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="stars" checked={starFilter === 4} onChange={() => setStarFilter(4)} className="accent-[#051433]" />
                    <span>4 Star Premium</span>
                  </label>
                </div>
              </div>

              {/* Price Filter */}
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Price Per Night</label>
                <div className="flex flex-col gap-1.5 text-xs font-medium">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" checked={priceFilter === "all"} onChange={() => setPriceFilter("all")} className="accent-[#051433]" />
                    <span>All Prices</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" checked={priceFilter === "5000"} onChange={() => setPriceFilter("5000")} className="accent-[#051433]" />
                    <span>Upto ₹15,000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" checked={priceFilter === "15000"} onChange={() => setPriceFilter("15000")} className="accent-[#051433]" />
                    <span>₹15,000 - ₹25,000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" checked={priceFilter === "25000"} onChange={() => setPriceFilter("25000")} className="accent-[#051433]" />
                    <span>₹25,000+</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Goibibo Hotel Result Cards */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                Found <span className="font-bold text-slate-900">{filteredHotels.length}</span> Verified Hotels in <span className="font-bold text-slate-900">{city === "All" ? "India" : city}</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">Prices include 18% GST</span>
            </div>

            {filteredHotels.map((hotel) => {
              const nights = getNights();
              const perNightPrice = Number(hotel.price);
              const origPrice = Number(hotel.original_price) || Math.round(perNightPrice * 1.25);
              const amenities = Array.isArray(hotel.amenities) && hotel.amenities.length > 0
                ? hotel.amenities
                : ["Helipad Access", "Luxury Spa", "Free WiFi", "Swimming Pool"];

              return (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition-all shadow-md hover:shadow-xl p-6 flex flex-col md:flex-row gap-6 text-slate-800"
                >
                  {/* Hotel Thumbnail Image */}
                  <div className="md:w-4/12 relative h-52 md:h-auto rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#051433] text-white px-2.5 py-1 rounded text-[10px] font-bold font-mono uppercase">
                      {hotel.tag || "GOISAFE LUXURY"}
                    </div>
                  </div>

                  {/* Hotel Info & Amenities */}
                  <div className="md:w-8/12 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: Number(hotel.stars) || 5 }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <h3 className="font-space text-lg font-bold text-slate-900">{hotel.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans mt-0.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>{hotel.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-200">
                          <span>{hotel.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 font-sans mt-3 line-clamp-2">
                        {hotel.description}
                      </p>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-2 my-4">
                        {amenities.slice(0, 5).map((amen: string, i: number) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium">
                            ✓ {amen}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Book CTA */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 line-through">₹{origPrice.toLocaleString("en-IN")}</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">20% OFF</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-space text-slate-900">
                            ₹{perNightPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-slate-500">/ Night</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookHotel(hotel)}
                        className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] hover:to-[#C57A2D] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>BOOK HOTEL</span>
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
    </div>
  );
}

export default function HotelsListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F2F5F8] flex items-center justify-center">Loading Hotels...</div>}>
      <HotelsListingContent />
    </Suspense>
  );
}
