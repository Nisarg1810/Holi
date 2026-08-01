"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import API from "@/utils/api";
import { 
  Plane, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  XCircle, 
  CheckCircle2, 
  ArrowRight,
  Helicopter,
  Ship,
  Hotel,
  Compass,
  Search,
  Download
} from "lucide-react";
import { motion } from "framer-motion";

export default function MyTripsPage() {
  const { isLoggedIn, user } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchMyBookings();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/bookings");
      if (res.data) {
        setBookings(Array.isArray(res.data) ? res.data : res.data.results || []);
      }
    } catch (err) {
      console.error("Failed to fetch user bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLookupBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId || !lookupEmail) {
      setLookupError("Please enter both Booking Reference ID and Email.");
      return;
    }
    setLookupError("");
    setLoading(true);
    try {
      const res = await API.get(`/bookings?reference_number=${lookupId}&email=${lookupEmail}`);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      if (data.length > 0) {
        setLookupResult(data[0]);
      } else {
        setLookupError("No booking found with the provided details.");
        setLookupResult(null);
      }
    } catch (err) {
      setLookupError("Error fetching booking details. Please verify your reference number.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCancel = async (bookingId: number) => {
    if (!confirm("Are you sure you want to request cancellation for this booking?")) return;
    setCancellingId(bookingId);
    try {
      await API.post(`/bookings/${bookingId}/request-cancel/`, {
        cancellation_data: { reason: "Requested by passenger from My Trips page." }
      });
      alert("Cancellation request submitted successfully.");
      fetchMyBookings();
    } catch (err) {
      alert("Failed to submit cancellation request. Please contact VIP Support.");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const status = (b.status || "").toUpperCase();
    if (activeTab === "UPCOMING" && status !== "CONFIRMED" && status !== "PENDING") return false;
    if (activeTab === "COMPLETED" && status !== "COMPLETED") return false;
    if (activeTab === "CANCELLED" && !status.includes("CANCEL")) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const ref = (b.reference_number || "").toLowerCase();
      const service = (b.service_type || b.route || b.package_name || "").toLowerCase();
      return ref.includes(q) || service.includes(q);
    }
    return true;
  });

  const getServiceIcon = (type: string) => {
    const s = (type || "").toLowerCase();
    if (s.includes("helicopter") || s.includes("flight")) return Helicopter;
    if (s.includes("boat") || s.includes("yacht")) return Ship;
    if (s.includes("hotel") || s.includes("stay")) return Hotel;
    return Compass;
  };

  return (
    <div className="min-h-screen bg-[#020B1E] text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gold mb-2">
              <Plane className="h-4 w-4" /> VIP Passenger Portal
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white">
              My Trips &amp; Bookings
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 font-sans">
              Manage your upcoming flights, hotel stays, tour packages and boat charters
            </p>
          </div>

          {!isLoggedIn && (
            <Link
              href="/auth?mode=login"
              className="px-5 py-2.5 bg-gold hover:bg-[#E3C69D] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all self-start md:self-auto flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span>Login for Instant Sync</span>
            </Link>
          )}
        </div>

        {/* Tab Filters & Search */}
        {isLoggedIn && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-1.5 p-1 bg-[#051433] border border-white/10 rounded-xl w-full sm:w-auto">
              {(["ALL", "UPCOMING", "COMPLETED", "CANCELLED"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-space text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-gold text-black shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search trip or ref ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#051433] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold/40"
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-space text-xs text-slate-400 uppercase tracking-widest">Loading your trips...</p>
          </div>
        ) : !isLoggedIn ? (
          /* Not Logged In State + Booking Lookup Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-[#051433] p-8 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">Access All Saved Trips</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
                  Log in to automatically view all your confirmed helicopter tickets, tour itineraries, hotel reservations, and yacht charters in one place.
                </p>
              </div>

              <Link
                href="/auth?mode=login"
                className="w-full text-center py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all"
              >
                Sign In / Create Account
              </Link>
            </div>

            {/* Quick Guest Lookup Form */}
            <div className="lg:col-span-5 bg-[#051433]/60 p-6 rounded-2xl border border-white/10 shadow-lg">
              <h4 className="font-space text-sm font-bold uppercase tracking-wider text-gold mb-1">Look Up Guest Booking</h4>
              <p className="text-[11px] text-slate-400 font-sans mb-4">Check status using reference code &amp; email address</p>

              <form onSubmit={handleLookupBooking} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-300 font-space block mb-1">Booking Reference ID</label>
                  <input
                    type="text"
                    placeholder="e.g. RA-89421"
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value)}
                    className="w-full bg-[#020B1E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold/40"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-300 font-space block mb-1">Passenger Email</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    className="w-full bg-[#020B1E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold/40"
                  />
                </div>

                {lookupError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{lookupError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="py-3 bg-white/10 hover:bg-gold hover:text-black border border-white/20 text-white font-space text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Find Booking
                </button>
              </form>

              {/* Render Lookup Result Card if Found */}
              {lookupResult && (
                <div className="mt-6 p-4 rounded-xl bg-gold/10 border border-gold/40 text-left">
                  <div className="flex items-center justify-between text-xs font-bold text-gold mb-2">
                    <span>{lookupResult.reference_number}</span>
                    <span className="px-2 py-0.5 rounded bg-gold/20 text-[10px]">{lookupResult.status}</span>
                  </div>
                  <h5 className="font-space text-xs font-bold text-white mb-1">{lookupResult.route || lookupResult.service_type || "Luxury Trip"}</h5>
                  <p className="text-[11px] text-slate-300 font-sans">Date: {lookupResult.departure_date || lookupResult.created_at?.split("T")[0]}</p>
                  <p className="text-[11px] text-slate-300 font-sans">Total Fare: ₹{lookupResult.total_fare || lookupResult.amount || "N/A"}</p>
                </div>
              )}
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center bg-[#051433]/40 rounded-2xl border border-white/10 p-8">
            <div className="h-16 w-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mx-auto mb-4">
              <Compass className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white mb-2">No Trips Found</h3>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto mb-6">
              You haven't booked any trips in this category yet. Explore our luxury helicopter flights, hotel stays, or tour packages!
            </p>
            <Link
              href="/booking"
              className="px-6 py-3 bg-gold hover:bg-[#E3C69D] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2"
            >
              <span>Explore Flights &amp; Packages</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* Bookings List Cards */
          <div className="flex flex-col gap-6">
            {filteredBookings.map((b) => {
              const Icon = getServiceIcon(b.service_type || b.route);
              const status = (b.status || "CONFIRMED").toUpperCase();
              return (
                <div
                  key={b.id}
                  className="bg-[#051433] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-gold/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0 mt-1">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-xs font-bold text-gold">#{b.reference_number || `RA-${b.id}`}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-space text-[9px] uppercase font-bold tracking-wider ${
                            status === "CONFIRMED" || status === "COMPLETED"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : status.includes("CANCEL")
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <h4 className="font-space text-base font-bold text-white mb-2">
                        {b.route || b.service_type || b.package_name || "Helicopter Charter Ride"}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-sans">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gold" />
                          <span>{b.departure_date || b.travel_date || b.created_at?.split("T")[0]}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-gold" />
                          <span>{b.passengers_count || b.passengers || 1} Passenger(s)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Insured Flight</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 font-sans block">Total Amount</span>
                      <span className="font-space text-xl font-bold text-gold">
                        ₹{(b.total_fare || b.amount || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      {!status.includes("CANCEL") && (
                        <button
                          onClick={() => handleRequestCancel(b.id)}
                          disabled={cancellingId === b.id}
                          className="px-3.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-space font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === b.id ? "Requesting..." : "Cancel Trip"}
                        </button>
                      )}

                      <Link
                        href={`/booking?ref=${b.reference_number || b.id}`}
                        className="px-4 py-1.5 rounded-lg bg-gold/10 hover:bg-gold hover:text-black border border-gold/30 text-gold text-xs font-space font-bold transition-all flex items-center gap-1.5"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Ticket Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
