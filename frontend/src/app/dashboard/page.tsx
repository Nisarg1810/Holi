"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import {
  User, CreditCard, Ticket, Shield, LogOut, Send, Check,
  Bell, Star, FileText, Award, Heart, MapPin, Calendar,
  ChevronRight, Plane, Hotel, Anchor, Clock,
  CheckCircle, AlertCircle, Zap, Globe, Phone, Mail,
  LayoutDashboard, Upload, Lock, Sparkles, Compass, Helicopter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "overview" | "bookings" | "favourites" | "documents" | "profile" | "tickets" | "security";

function StatCard({ icon: Icon, label, value, sub, color = "gold" }: any) {
  const colorMap: Record<string, string> = {
    gold: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    teal: "text-teal-400 bg-teal-400/10 border-teal-400/30",
    purple: "text-purple-300 bg-purple-500/10 border-purple-500/30",
    blue: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  };
  return (
    <div className="bg-[#051433]/80 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-400/40 hover:bg-[#051433] transition-all duration-300 shadow-xl backdrop-blur-md group">
      <div className="flex items-center justify-between mb-3">
        <div className={`h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 shadow-lg ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {sub && <span className="text-[10px] font-space uppercase font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">{sub}</span>}
      </div>
      <div>
        <p className="font-space text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</p>
        <p className="font-space text-xs font-semibold uppercase tracking-wider text-slate-300 mt-1">{label}</p>
      </div>
    </div>
  );
}

const INPUT_CLS = "w-full bg-[#020B1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all font-sans placeholder-slate-500";
const LABEL_CLS = "text-[10px] font-space uppercase tracking-widest text-amber-400 font-bold mb-1.5 block";

export default function DashboardPage() {
  const router = useRouter();
  const {
    isLoggedIn, user, bookings, tickets, notifications,
    logout, fetchBookings, fetchTickets, addTicket,
    addReplyToTicket, updateProfile, markNotificationsAsRead,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileEmail] = useState(user?.email || "");
  const [profileCity, setProfileCity] = useState("Mumbai");
  const [profileNationality, setProfileNationality] = useState("Indian");
  const [profileGender, setProfileGender] = useState("Male");
  const [profileDob, setProfileDob] = useState("1992-08-14");
  const [profileSaved, setProfileSaved] = useState(false);

  // Support Tickets States
  const [tckSubject, setTckSubject] = useState("");
  const [tckCategory, setTckCategory] = useState("General Inquiry");
  const [tckMsg, setTckMsg] = useState("");
  const [tckCreated, setTckCreated] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [chatReply, setChatReply] = useState("");

  // Documents Upload States
  const [docUploaded, setDocUploaded] = useState({ passport: true, aadhaar: true, visa: false, medical: true });

  // Cancellation Wizard States
  const [cancellingBooking, setCancellingBooking] = useState<any | null>(null);
  const [cancelStep, setCancelStep] = useState<number>(1);
  const [cancelReason, setCancelReason] = useState<string>("Change of Plans");
  const [cancelNotes, setCancelNotes] = useState<string>("");
  const [refundMethod, setRefundMethod] = useState<"original" | "bank">("original");

  // Saved Favourites
  const [favorites, setFavorites] = useState([
    { id: "fav-1", name: "Kedarnath Helicopter Darshan", type: "Helicopter Package", price: "₹ 49,999", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400", tag: "Spiritual" },
    { id: "fav-2", name: "Goa Sunset Luxury Yacht", type: "Boat Charter", price: "₹ 25,000", img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=400", tag: "Leisure" },
    { id: "fav-3", name: "Taj Lake Palace Luxury Stay", type: "Hotel", price: "₹ 32,000", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400", tag: "5-Star Resort" },
  ]);

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings();
      fetchTickets();
    }
  }, [isLoggedIn]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profileName, profilePhone);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tckSubject && tckMsg) {
      await addTicket(tckSubject, tckCategory, tckMsg);
      setTckSubject(""); setTckMsg("");
      setTckCreated(true);
      setTimeout(() => setTckCreated(false), 3000);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTicketId && chatReply.trim()) {
      await addReplyToTicket(activeTicketId, chatReply);
      setChatReply("");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-[#020B1E]">
        <div className="h-16 w-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-md mb-6 font-sans">
          Please log in to your Roman Aviation account to view your flight reservations and account settings.
        </p>
        <button
          onClick={() => router.push("/auth?mode=login")}
          className="px-8 py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const selectedTicket = tickets.find((t) => t.id === activeTicketId);
  const unread = notifications.filter((n: any) => !n.read).length;
  const loyaltyPoints = bookings.length * 1500 + 3500;
  const tier = "VIP Platinum Member";

  const NAV_ITEMS: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "bookings", label: "Flight Reservations", icon: CreditCard, badge: bookings.length },
    { id: "favourites", label: "Saved Wishlist", icon: Heart, badge: favorites.length },
    { id: "documents", label: "Travel KYC Docs", icon: FileText },
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "tickets", label: "Support Tickets", icon: Ticket, badge: tickets.filter((t: any) => t.status === "Open").length },
    { id: "security", label: "Security & Protocols", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#020B1E] text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* ─────────────────────────────────────────── */}
        {/* Top Executive Header Banner                 */}
        {/* ─────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#051433] via-[#092254] to-[#051433] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-300 flex items-center justify-center text-black font-space font-extrabold text-2xl shrink-0 shadow-xl">
              {user?.name?.slice(0, 2).toUpperCase() || "VIP"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 font-space text-[9px] uppercase font-bold text-amber-400">
                  {tier}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: RA-894210</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight">
                Welcome back, {user?.name}
              </h1>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                {user?.email} · {user?.phone || "+91 98200 12345"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 relative z-10 w-full md:w-auto border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center flex-1 md:flex-initial">
              <span className="text-[9px] text-slate-400 font-space uppercase block font-bold">Loyalty Points</span>
              <span className="font-space text-lg font-bold text-amber-400">{loyaltyPoints.toLocaleString()} PTS</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center flex-1 md:flex-initial">
              <span className="text-[9px] text-slate-400 font-space uppercase block font-bold">Active Bookings</span>
              <span className="font-space text-lg font-bold text-white">{bookings.length} TRIPS</span>
            </div>
            <button
              onClick={() => router.push("/booking")}
              className="px-5 py-3 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Helicopter className="h-4 w-4" />
              <span>Book Flight</span>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────── */}
        {/* Main Workspace Layout (Sidebar + Main Panel) */}
        {/* ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar Menu */}
          <div className="lg:col-span-3 bg-[#051433]/80 border border-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-xl flex flex-col gap-2 lg:sticky lg:top-24">
            <span className="text-[10px] font-space uppercase tracking-widest text-amber-400 font-bold px-3 pt-2 pb-1">
              Account Menu
            </span>

            <nav className="flex flex-col gap-1.5 font-space text-xs">
              {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full text-left py-3 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-3 border ${
                      isActive 
                        ? "bg-gradient-to-r from-[#F5A623] to-[#D68B3E] text-black border-amber-400 font-bold shadow-md shadow-amber-500/20" 
                        : "text-slate-300 border-transparent hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span className="flex-1 truncate">{label}</span>
                    {badge !== undefined && badge > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-black/20 text-black" : "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                      }`}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-white/10 pt-3 mt-2">
              <button
                onClick={handleLogout}
                className="w-full text-left py-3 px-3.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-space text-xs font-bold flex items-center gap-3 cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Main Panel */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-[#051433]/60 border border-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl min-h-[600px]"
              >

                {/* ── 1. OVERVIEW TAB ────────────────────────────────────────── */}
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-8">
                    
                    {/* Welcome Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                      <div>
                        <span className="text-xs font-space uppercase tracking-widest text-amber-400 font-bold">Flight Dispatch Portal</span>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
                          Operational Overview
                        </h2>
                        <p className="text-xs text-slate-300 font-sans mt-0.5">
                          Track active helicopter charters, loyalty tier status, and VIP support tickets
                        </p>
                      </div>

                      {/* Aviation Weather Alert Badge */}
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <div>
                          <span className="text-[9px] font-space uppercase text-slate-400 font-bold block">Aviation Weather Status</span>
                          <span className="text-xs font-space text-emerald-400 font-bold">VFR Active · Clear Skies</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stat Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard icon={Helicopter} label="Total Charters" value={bookings.length} sub="Booked Trips" color="gold" />
                      <StatCard icon={Zap} label="Loyalty Points" value={loyaltyPoints.toLocaleString()} sub="Platinum Tier" color="purple" />
                      <StatCard icon={Ticket} label="Open Tickets" value={tickets.filter((t: any) => t.status === "Open").length} sub="VIP Support" color="teal" />
                      <StatCard icon={Bell} label="Notifications" value={unread} sub="Active Alerts" color="blue" />
                    </div>

                    {/* Boarding Pass Card */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-space text-xs font-bold uppercase tracking-wider text-amber-400">Boarding Pass Preview</h3>
                      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#020B1E] via-[#051433] to-[#020B1E] p-6 shadow-xl flex flex-col md:flex-row items-stretch gap-6">
                        <div className="flex-1 flex flex-col justify-between gap-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-space uppercase bg-amber-400/20 text-amber-400 border border-amber-400/40 px-2.5 py-0.5 rounded font-bold">
                              Confirmed Flight
                            </span>
                            <Helicopter className="h-5 w-5 text-amber-400 animate-pulse" />
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <span className="text-[9px] font-space uppercase text-slate-400 block font-bold">DEPARTURE</span>
                              <span className="font-space text-base md:text-lg font-bold text-white">Dehradun Helipad</span>
                            </div>
                            <div className="flex-1 border-t border-dashed border-white/20 relative flex items-center justify-center">
                              <span className="absolute -top-2 bg-[#051433] px-2 text-[9px] font-space text-amber-400 font-bold">AIRBUS H145</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-space uppercase text-slate-400 block font-bold">DESTINATION</span>
                              <span className="font-space text-base md:text-lg font-bold text-amber-400">Kedarnath Dham</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-xs font-space">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-semibold">PASSENGER</span>
                              <span className="font-bold text-white truncate block">{user?.name}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-semibold">STAGING GATE</span>
                              <span className="font-bold text-white block">GATE ALPHA</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-semibold">STATUS</span>
                              <span className="font-bold text-emerald-400 block">SLOT VERIFIED</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Reservations */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-space text-xs font-bold uppercase tracking-wider text-amber-400">Recent Reservations</h3>
                        <button
                          onClick={() => setActiveTab("bookings")}
                          className="text-xs font-space text-slate-300 hover:text-amber-400 flex items-center gap-1 font-bold transition-colors cursor-pointer"
                        >
                          <span>View All</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      {bookings.length === 0 ? (
                        <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl text-xs text-slate-400 font-sans">
                          No reservations found. <Link href="/booking" className="text-amber-400 underline font-bold">Book Helicopter →</Link>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {bookings.slice(0, 3).map((b: any) => (
                            <div key={b.id} className="p-4 bg-[#051433] border border-white/10 rounded-xl flex items-center justify-between gap-4 shadow-md">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                                  <Helicopter className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-space text-xs font-bold text-white">{b.route || b.service_type || b.name || "Charter Ride"}</h4>
                                  <span className="text-[10px] text-slate-400 font-sans block">{b.departure_date || b.date || "Scheduled Flight"}</span>
                                </div>
                              </div>
                              <span className="font-space text-sm font-bold text-amber-400">₹{(b.total_fare || b.price || 0).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* ── 2. FLIGHT RESERVATIONS TAB ────────────────────────────── */}
                {activeTab === "bookings" && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-white">Flight Reservations Log</h2>
                        <p className="text-xs text-slate-300 font-sans mt-0.5">Manage and track your booked helicopter charters, tour packages, and boat rides</p>
                      </div>
                      <button
                        onClick={() => router.push("/booking")}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                      >
                        <Helicopter className="h-4 w-4" />
                        <span>Book New Flight</span>
                      </button>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="py-16 text-center bg-white/5 border border-white/10 rounded-2xl p-8">
                        <Helicopter className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                        <h3 className="font-serif text-lg font-bold text-white mb-1">No Reservations Found</h3>
                        <p className="text-xs text-slate-400 font-sans mb-4">You haven't made any bookings yet.</p>
                        <button onClick={() => router.push("/booking")} className="px-6 py-2.5 bg-amber-400 text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl">Book Flight Now</button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {bookings.map((booking: any) => (
                          <div key={booking.id} className="bg-[#051433] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                                  <Helicopter className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs font-bold text-amber-400">#{booking.reference_number || booking.id}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-space font-bold uppercase">
                                      {booking.status || "CONFIRMED"}
                                    </span>
                                  </div>
                                  <h4 className="font-space text-sm font-bold text-white">{booking.route || booking.service_type || booking.name || "Charter Booking"}</h4>
                                  <p className="text-xs text-slate-300 font-sans mt-0.5">Date: {booking.departure_date || booking.date || "Upcoming"} · {booking.passengers_count || 1} Passenger(s)</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                                <div>
                                  <span className="text-[9px] text-slate-400 uppercase block font-sans">Total Fare</span>
                                  <span className="font-space text-lg font-bold text-amber-400">₹{(booking.total_fare || booking.price || 0).toLocaleString()}</span>
                                </div>
                                <button
                                  onClick={() => router.push(`/my-trips`)}
                                  className="px-4 py-2 border border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-black rounded-xl font-space text-xs font-bold uppercase transition-all"
                                >
                                  View Ticket
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── 3. SAVED FAVOURITES TAB ────────────────────────────────── */}
                {activeTab === "favourites" && (
                  <div className="flex flex-col gap-6">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="font-serif text-2xl font-bold text-white">Saved Wishlist</h2>
                      <p className="text-xs text-slate-300 font-sans mt-0.5">Your bookmarked luxury helicopter rides, hotels and boat charters</p>
                    </div>

                    {favorites.length === 0 ? (
                      <div className="py-16 text-center bg-white/5 border border-white/10 rounded-2xl p-8">
                        <Heart className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                        <h3 className="font-serif text-lg font-bold text-white mb-1">Your Wishlist is Empty</h3>
                        <p className="text-xs text-slate-400 font-sans mb-4">Heart any experience during browsing to save it here.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {favorites.map((fav) => (
                          <div key={fav.id} className="bg-[#051433] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group">
                            <div className="h-40 relative overflow-hidden bg-slate-900">
                              <img src={fav.img} alt={fav.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400 text-black font-space text-[9px] font-bold uppercase shadow-md">
                                {fav.tag}
                              </span>
                              <button
                                onClick={() => handleRemoveFavorite(fav.id)}
                                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-red-400 hover:bg-black/90 transition-all cursor-pointer"
                              >
                                <Heart className="h-4 w-4 fill-red-400" />
                              </button>
                            </div>
                            <div className="p-5 flex items-center justify-between gap-4">
                              <div>
                                <h4 className="font-space text-sm font-bold text-white">{fav.name}</h4>
                                <span className="text-xs text-slate-400 font-sans block mt-0.5">{fav.type}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-space text-base font-bold text-amber-400 block">{fav.price}</span>
                                <button onClick={() => router.push("/booking")} className="text-[10px] font-space font-bold uppercase text-slate-300 hover:text-white mt-1 block">Book Now →</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── 4. TRAVEL DOCUMENTS TAB ───────────────────────────────── */}
                {activeTab === "documents" && (
                  <div className="flex flex-col gap-6">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="font-serif text-2xl font-bold text-white">Travel &amp; KYC Documents</h2>
                      <p className="text-xs text-slate-300 font-sans mt-0.5">Upload verified documents for expedited DGCA helipad clearance and boarding authorization</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: "passport", label: "Passport Documents", desc: "International travel clearance & identity proof", icon: Globe },
                        { key: "aadhaar", label: "Aadhaar Card ID", desc: "Government-issued KYC identity proof", icon: User },
                        { key: "visa", label: "Visa Approvals", desc: "Active visa documentation for charter destinations", icon: FileText },
                        { key: "medical", label: "High-Altitude Medical Clearance", desc: "Helicopter pilgrimage medical certificate", icon: Shield },
                      ].map((doc) => {
                        const uploaded = docUploaded[doc.key as keyof typeof docUploaded];
                        return (
                          <div key={doc.key} className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 ${uploaded ? "bg-emerald-500/10 border-emerald-500/30" : "bg-[#051433] border-white/10"}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${uploaded ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-white/5 text-slate-400 border-white/10"}`}>
                                  <doc.icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-space text-xs font-bold text-white">{doc.label}</h4>
                                  <p className="text-[11px] text-slate-300 font-sans mt-0.5">{doc.desc}</p>
                                </div>
                              </div>
                              {uploaded ? <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" /> : <AlertCircle className="h-5 w-5 text-slate-500 shrink-0" />}
                            </div>

                            <button
                              onClick={() => setDocUploaded((p) => ({ ...p, [doc.key]: !p[doc.key as keyof typeof docUploaded] }))}
                              className={`w-full py-2.5 rounded-xl font-space text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                uploaded ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-white/10 text-white hover:bg-amber-400 hover:text-black border border-white/10"
                              }`}
                            >
                              <Upload className="h-4 w-4" />
                              <span>{uploaded ? "Re-upload File" : "Upload Document"}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── 5. PROFILE SETTINGS TAB ────────────────────────────────── */}
                {activeTab === "profile" && (
                  <form onSubmit={handleProfileSave} className="flex flex-col gap-6">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="font-serif text-2xl font-bold text-white">Profile Configuration</h2>
                      <p className="text-xs text-slate-300 font-sans mt-0.5">Manage your personal details and contact preferences</p>
                    </div>

                    {profileSaved && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-space font-bold flex items-center gap-2">
                        <Check className="h-4 w-4" /> Profile updated successfully!
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={LABEL_CLS}>Full Name</label>
                        <input type="text" required value={profileName} onChange={(e) => setProfileName(e.target.value)} className={INPUT_CLS} />
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Email Address</label>
                        <input type="email" disabled value={profileEmail} className={INPUT_CLS + " opacity-60 cursor-not-allowed"} />
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Phone Number</label>
                        <input type="tel" required value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className={INPUT_CLS} />
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Base City</label>
                        <input type="text" value={profileCity} onChange={(e) => setProfileCity(e.target.value)} className={INPUT_CLS} />
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Gender</label>
                        <select value={profileGender} onChange={(e) => setProfileGender(e.target.value)} className={INPUT_CLS}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Nationality</label>
                        <input type="text" value={profileNationality} onChange={(e) => setProfileNationality(e.target.value)} className={INPUT_CLS} />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all self-start flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </form>
                )}

                {/* ── 6. SUPPORT TICKETS TAB ─────────────────────────────────── */}
                {activeTab === "tickets" && (
                  <div className="flex flex-col gap-6">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="font-serif text-2xl font-bold text-white">VIP Concierge &amp; Support Tickets</h2>
                      <p className="text-xs text-slate-300 font-sans mt-0.5">Submit inquiries or chat directly with our 24/7 flight coordination desk</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-5 flex flex-col gap-4">
                        <h3 className="font-space text-xs font-bold uppercase tracking-wider text-amber-400">Submit New Inquiry</h3>
                        <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
                          <div>
                            <label className={LABEL_CLS}>Subject</label>
                            <input type="text" required placeholder="e.g. Flight Schedule Adjustment" value={tckSubject} onChange={(e) => setTckSubject(e.target.value)} className={INPUT_CLS} />
                          </div>
                          <div>
                            <label className={LABEL_CLS}>Category</label>
                            <select value={tckCategory} onChange={(e) => setTckCategory(e.target.value)} className={INPUT_CLS}>
                              <option value="General Inquiry">General Inquiry</option>
                              <option value="Flight Change">Flight Change Request</option>
                              <option value="Billing Issue">Billing &amp; Refund</option>
                              <option value="VIP Catering">VIP Catering &amp; Ground Transport</option>
                            </select>
                          </div>
                          <div>
                            <label className={LABEL_CLS}>Message</label>
                            <textarea rows={4} required placeholder="Describe your request..." value={tckMsg} onChange={(e) => setTckMsg(e.target.value)} className={INPUT_CLS + " resize-none"} />
                          </div>
                          <button type="submit" className="py-3 bg-amber-400 hover:bg-amber-300 text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer">
                            Submit Inquiry
                          </button>
                        </form>
                      </div>

                      <div className="lg:col-span-7 flex flex-col gap-4">
                        <h3 className="font-space text-xs font-bold uppercase tracking-wider text-amber-400">Inquiry History</h3>
                        {tickets.length === 0 ? (
                          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center text-xs text-slate-400 font-sans">
                            No support tickets created yet.
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                            {tickets.map((t: any) => (
                              <div key={t.id} className="p-4 bg-[#051433] border border-white/10 rounded-xl flex items-center justify-between">
                                <div>
                                  <h4 className="font-space text-xs font-bold text-white">{t.subject}</h4>
                                  <span className="text-[10px] text-slate-400 font-sans">{t.category} · {t.date}</span>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[9px] font-space font-bold uppercase">
                                  {t.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 7. SECURITY TAB ───────────────────────────────────────── */}
                {activeTab === "security" && (
                  <div className="flex flex-col gap-6">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="font-serif text-2xl font-bold text-white">Security &amp; Protocols</h2>
                      <p className="text-xs text-slate-300 font-sans mt-0.5">Account protection, session management, and encryption standards</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 bg-[#051433] border border-white/10 rounded-2xl flex items-start gap-4">
                        <Shield className="h-6 w-6 text-amber-400 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-space text-xs font-bold text-white uppercase">Two-Factor Authentication</h4>
                          <p className="text-xs text-slate-300 font-sans mt-1">OTP validation active on email on every login.</p>
                          <span className="inline-block mt-2 text-[9px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">ACTIVE</span>
                        </div>
                      </div>

                      <div className="p-5 bg-[#051433] border border-white/10 rounded-2xl flex items-start gap-4">
                        <Lock className="h-6 w-6 text-amber-400 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-space text-xs font-bold text-white uppercase">Session Encryption</h4>
                          <p className="text-xs text-slate-300 font-sans mt-1">JWT asymmetric RS256 token rotation.</p>
                          <span className="inline-block mt-2 text-[9px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">SECURED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
