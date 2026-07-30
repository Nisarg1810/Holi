"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  User, CreditCard, Ticket, Shield, LogOut, Send, Check,
  Bell, Star, FileText, Award, Heart, MapPin, Calendar,
  ChevronRight, TrendingUp, Plane, Hotel, Anchor, Clock,
  CheckCircle, AlertCircle, Zap, Globe, Phone, Mail,
  LayoutDashboard, Upload, Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "overview" | "bookings" | "favourites" | "documents" | "profile" | "tickets" | "security";

// ── Stat card component ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = "gold" }: any) {
  const colorMap: Record<string, string> = {
    gold: "text-gold bg-gold/10 border-gold/25 shadow-gold/5",
    teal: "text-teal bg-teal/10 border-teal/25 shadow-teal/5",
    purple: "text-purple-300 bg-purple-500/10 border-purple-500/25 shadow-purple-500/5",
    blue: "text-blue-300 bg-blue-500/10 border-blue-500/25 shadow-blue-500/5",
  };
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 hover:border-gold/30 hover:bg-white/[0.06] transition-all duration-300 shadow-xl backdrop-blur-md">
      <div className={`h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 shadow-lg ${colorMap[color]}`}>
        <Icon className="h-5.5 w-5.5" />
      </div>
      <div>
        <p className="font-space text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</p>
        <p className="font-space text-xs font-semibold uppercase tracking-wider text-slate-300 mt-1">{label}</p>
        {sub && <p className="font-luxury text-xs text-slate-400 mt-1.5">{sub}</p>}
      </div>
    </div>
  );
}

const INPUT_CLS = "w-full bg-[#05070D]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all font-luxury placeholder-white/20 backdrop-blur-sm";
const LABEL_CLS = "text-xs font-space uppercase tracking-widest text-gold/90 font-bold mb-2 block";

// ── Main component ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const {
    isLoggedIn, user, bookings, tickets, notifications,
    logout, fetchBookings, fetchTickets, addTicket,
    addReplyToTicket, updateProfile, markNotificationsAsRead,
    cancelBooking,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Profile
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileEmail] = useState(user?.email || "");
  const [profileCity, setProfileCity] = useState("");
  const [profileNationality, setProfileNationality] = useState("Indian");
  const [profileGender, setProfileGender] = useState("Prefer not to say");
  const [profileDob, setProfileDob] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // Tickets
  const [tckSubject, setTckSubject] = useState("");
  const [tckCategory, setTckCategory] = useState("Inquiry");
  const [tckMsg, setTckMsg] = useState("");
  const [tckCreated, setTckCreated] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [chatReply, setChatReply] = useState("");

  // Documents
  const [docUploaded, setDocUploaded] = useState({ passport: false, aadhaar: false, visa: false, medical: false });

  // Favourites
  const [favorites, setFavorites] = useState([
    { id: "fav-1", name: "Kedarnath Helicopter Darshan", type: "Helicopter Charter", price: "₹4,99,000", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400", tag: "Spiritual" },
    { id: "fav-2", name: "Goa Beach Luxury Yacht", type: "Boat Charter", price: "₹1,25,000/day", img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=400", tag: "Leisure" },
    { id: "fav-3", name: "Himalayan Sacred Peaks", type: "Tour Package", price: "₹5,88,820", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400", tag: "VIP Expedition" },
    { id: "fav-4", name: "The Leela Goa Resort", type: "Hotel", price: "₹32,000/night", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400", tag: "5-Star" },
  ]);

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    if (isLoggedIn) { fetchBookings(); fetchTickets(); }
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

  const handleLogout = () => { logout(); router.push("/"); };

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <h2 className="font-space text-lg text-white">Access denied. Please authenticate.</h2>
        <button onClick={() => router.push("/auth")}
          className="px-6 py-3 bg-gold text-black rounded font-space text-xs font-bold uppercase tracking-widest">
          Sign In
        </button>
      </div>
    );
  }

  const selectedTicket = tickets.find((t) => t.id === activeTicketId);
  const unread = notifications.filter((n: any) => !n.read).length;

  // Loyalty points (mock: ₹500 per booking)
  const loyaltyPoints = bookings.length * 500;
  const tier = loyaltyPoints >= 5000 ? "Platinum" : loyaltyPoints >= 2000 ? "Gold" : loyaltyPoints >= 500 ? "Silver" : "Bronze";
  const tierColor = tier === "Platinum" ? "text-purple-300" : tier === "Gold" ? "text-gold" : tier === "Silver" ? "text-slate-300" : "text-amber-700";

  const NAV_ITEMS: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: "overview",   label: "Overview",          icon: LayoutDashboard },
    { id: "bookings",   label: "Flight Reservations", icon: CreditCard, badge: bookings.length },
    { id: "favourites", label: "Saved Favourites",  icon: Heart },
    { id: "documents",  label: "Travel Documents",  icon: FileText },
    { id: "profile",    label: "Profile Settings",  icon: User },
    { id: "tickets",    label: "Support Inquiries", icon: Ticket, badge: tickets.filter((t: any) => t.status === "Open").length },
    { id: "security",   label: "Security Protocols", icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-3 flex flex-col gap-5 bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl shadow-2xl lg:sticky lg:top-28">

        {/* Avatar block */}
        <div className="flex items-center gap-4 border-b border-white/[0.06] pb-5 mb-1">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold/45 to-gold/5 border-2 border-gold/40 flex items-center justify-center text-gold font-space font-bold text-xl shrink-0 shadow-lg shadow-gold/5">
            {user?.name?.slice(0, 2).toUpperCase() || "VIP"}
          </div>
          <div className="min-w-0">
            <h3 className="font-space text-base font-bold text-white leading-tight truncate tracking-tight">{user?.name || "Guest"}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Award className={`h-4 w-4 ${tierColor}`} />
              <span className={`font-space text-xs font-bold uppercase tracking-wider ${tierColor}`}>{tier} Member</span>
            </div>
          </div>
        </div>

        {/* Notification badge */}
        {unread > 0 && (
          <button onClick={() => { markNotificationsAsRead(); }}
            className="flex items-center justify-center gap-2.5 px-4 py-3 bg-gold/10 border border-gold/25 rounded-xl text-xs font-space text-gold font-bold w-full cursor-pointer hover:bg-gold/15 transition-all shadow-md shadow-gold/5 animate-pulse">
            <Bell className="h-4.5 w-4.5 shrink-0" />
            <span>{unread} New Notification{unread > 1 ? "s" : ""}</span>
          </button>
        )}

        {/* Nav items */}
        <nav className="flex flex-col gap-1.5 font-space text-sm">
          {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full text-left py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-3.5 border ${
                  isActive 
                    ? "bg-gold text-black border-gold font-bold shadow-lg shadow-gold/10" 
                    : "text-slate-300 border-transparent hover:text-white hover:bg-white/[0.04]"
                }`}>
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-black/20 text-black" : "bg-gold/15 text-gold border border-gold/20"}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Points mini-display */}
        <div className="mt-1 px-4 py-3.5 bg-white/[0.01] border border-white/[0.06] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-space uppercase tracking-widest text-slate-400 block font-bold">Loyalty Points</span>
            <span className="font-space font-bold text-gold text-base tracking-tight mt-0.5 block">{loyaltyPoints.toLocaleString("en-IN")}</span>
          </div>
          <Zap className="h-6 w-6 text-gold/30" />
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full text-left py-3 px-4 rounded-xl border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/30 transition-all font-space text-sm flex items-center gap-3.5 cursor-pointer mt-1">
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>Exit Workspace</span>
        </button>
      </div>

      {/* ── Main Panel ───────────────────────────────────────────────────────── */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-2xl min-h-[50vh]"
          >

            {/* ── 1. OVERVIEW ─────────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/[0.06] pb-6">
                  <div>
                    <span className="text-xs font-space uppercase tracking-widest text-gold font-bold">Welcome back</span>
                    <h2 className="font-space text-2xl md:text-3xl font-bold text-white mt-1 tracking-tight">
                      Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {user?.name?.split(" ")[0]} ✦
                    </h2>
                    <p className="font-luxury text-sm text-slate-400 mt-1">Your flight operations dashboard is ready.</p>
                  </div>
                  {/* Dest weather widget */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0 backdrop-blur-md">
                    <div className="h-2 w-2 rounded-full bg-teal animate-pulse" />
                    <div>
                      <span className="text-[10px] font-space uppercase text-slate-400 font-bold block">Aviation Weather</span>
                      <span className="text-xs font-space text-slate-200 font-bold">
                        {bookings.length > 0 && bookings[0].name.includes("Kedarnath") 
                          ? "Kedarnath Pad: 12°C · Caution Fog" 
                          : bookings.length > 0 && bookings[0].name.includes("Goa")
                          ? "Goa Heliport: 29°C · Clear Sky VFR"
                          : "Visual Flight Rules (VFR) Active"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                  <StatCard icon={Plane} label="Total Flights" value={bookings.length} sub="Booked" color="gold" />
                  <StatCard icon={Zap} label="Loyalty Points" value={loyaltyPoints.toLocaleString()} sub={`${tier} Tier`} color="purple" />
                  <StatCard icon={Ticket} label="Open Tickets" value={tickets.filter((t: any) => t.status === "Open").length} sub="Awaiting reply" color="teal" />
                  <StatCard icon={Bell} label="Notifications" value={unread} sub="Unread" color="blue" />
                </div>

                {/* Boarding Pass Preview / Next Trip */}
                {bookings.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-space text-sm uppercase tracking-wider font-bold text-gold/90">Upcoming Flight Boarding Pass</h3>
                    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-slate-950 via-[#0a0f1d] to-slate-950 p-6 md:p-8 flex flex-col md:flex-row items-stretch gap-6 shadow-2xl">
                      {/* Left half - details */}
                      <div className="flex-1 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-space bg-gold/10 border border-gold/30 text-gold px-2 py-0.5 rounded uppercase font-bold tracking-wider">Boarding Soon</span>
                            <span className="text-xs text-slate-400 font-mono">BK-{bookings[0].id.slice(0, 5).toUpperCase()}</span>
                          </div>
                          <Plane className="h-5 w-5 text-gold animate-pulse" />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-space uppercase text-slate-400 block font-bold">DEPARTURE</span>
                            <span className="font-space text-lg font-bold text-white tracking-tight">DELHI PAD</span>
                          </div>
                          <div className="flex-1 border-t border-dashed border-white/20 relative flex items-center justify-center">
                            <div className="absolute -top-1 bg-[#0a0f1d] px-2 text-[10px] font-space text-gold tracking-widest font-bold">SHUTTLE</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-space uppercase text-slate-400 block font-bold">DESTINATION</span>
                            <span className="font-space text-lg font-bold text-gold tracking-tight">{bookings[0].name.split(" ")[0].toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-4 text-xs font-space">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">PASSENGER</span>
                            <span className="font-bold text-slate-100 truncate block">{user?.name}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">PAD / GATE</span>
                            <span className="font-bold text-slate-100 block">HELIPAD ALPHA</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">DATE / TIME</span>
                            <span className="font-bold text-slate-100 block">{bookings[0].date}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Ticket dotted separator */}
                      <div className="hidden md:flex flex-col items-center justify-center relative px-2">
                        <div className="w-[1px] h-full border-l border-dashed border-white/20" />
                        <div className="absolute -top-1.5 h-3 w-3 bg-[#030712] rounded-full border border-white/10" />
                        <div className="absolute -bottom-1.5 h-3 w-3 bg-[#030712] rounded-full border border-white/10" />
                      </div>

                      {/* Right half - stub & barcode */}
                      <div className="md:w-56 flex flex-col justify-between items-center md:items-end gap-6 text-center md:text-right">
                        <div>
                          <span className="text-[10px] font-space uppercase text-slate-400 block font-bold">SEAT SELECTION</span>
                          <span className="font-space text-2xl font-bold text-white">1A <span className="text-xs text-gold">(VIP)</span></span>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-1.5 w-full">
                          {/* Mock Barcode */}
                          <div className="h-10 w-full bg-white/10 border border-white/20 rounded flex items-center justify-around px-2 opacity-65">
                            {[1, 2, 4, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 2].map((w, idx) => (
                              <div key={idx} className="h-7 bg-white rounded-sm" style={{ width: `${w}px` }} />
                            ))}
                          </div>
                          <span className="text-[9px] font-mono text-slate-400">BOARDING PASS VERIFICATION</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent bookings preview */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-space text-sm uppercase tracking-wider font-bold text-gold/90">Recent Reservations</h3>
                    <button onClick={() => setActiveTab("bookings")}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold font-space font-bold uppercase tracking-wider transition-colors cursor-pointer">
                      View All <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 font-luxury text-sm border border-white/[0.06] rounded-2xl bg-white/[0.01] backdrop-blur-md">
                      No reservations yet.{" "}
                      <button onClick={() => router.push("/tours")} className="text-gold underline cursor-pointer hover:text-gold-hover transition-colors">Browse Tours →</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {bookings.slice(0, 3).map((b: any) => (
                        <div key={b.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-white/15 transition-all shadow-md">
                          <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                            <Plane className="h-5 w-5 text-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-space text-sm md:text-base font-bold text-white truncate">{b.name}</p>
                            <p className="text-xs text-slate-400 font-luxury mt-0.5">{b.date} · {b.details}</p>
                          </div>
                          <span className="font-space text-base md:text-lg font-bold text-gold shrink-0">₹{Number(b.price).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-space text-sm uppercase tracking-wider font-bold text-gold/90">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Book Helicopter", icon: Plane, path: "/booking" },
                      { label: "Browse Tours", icon: MapPin, path: "/tours" },
                      { label: "Find Hotels", icon: Hotel, path: "/hotels" },
                      { label: "Boat Charter", icon: Anchor, path: "/boats" },
                    ].map((a) => (
                      <button key={a.label} onClick={() => router.push(a.path)}
                        className="flex flex-col items-center justify-center gap-3 p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-gold/30 hover:bg-gold/5 hover:shadow-lg hover:shadow-gold/5 transition-all cursor-pointer group">
                        <div className="h-10 w-10 rounded-xl bg-white/[0.04] group-hover:bg-gold/10 flex items-center justify-center transition-all">
                          <a.icon className="h-5 w-5 text-slate-400 group-hover:text-gold transition-colors" />
                        </div>
                        <span className="font-space text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors text-center">{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. FLIGHT RESERVATIONS ──────────────────────────────────── */}
            {activeTab === "bookings" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
                  <div>
                    <h2 className="font-space text-xl md:text-2xl font-bold text-white">Flight Reservations Log</h2>
                    <p className="font-luxury text-xs text-slate-400 mt-1">{bookings.length} total booking{bookings.length !== 1 ? "s" : ""} on record</p>
                  </div>
                  <button onClick={() => router.push("/booking")}
                    className="py-3 px-5 bg-gold text-black rounded-xl font-space text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-gold/15 hover:bg-gold-hover transition-all">
                    <Plane className="h-4 w-4" /> <span>New Booking</span>
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-luxury text-base flex flex-col items-center gap-4 border border-white/[0.06] rounded-2xl bg-white/[0.01]">
                    <Plane className="h-12 w-12 text-white/20" />
                    <p>No reservations found.</p>
                    <button onClick={() => router.push("/tours")} className="text-gold text-sm font-space font-bold underline cursor-pointer hover:text-gold-hover transition-colors">Explore Packages →</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="border border-white/[0.06] rounded-2xl p-6 bg-white/[0.02] hover:border-white/15 transition-all shadow-md flex flex-col gap-5">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 w-full">
                          <div className="flex gap-4 items-start">
                            <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0 shadow-md">
                              <Plane className="h-5 w-5 text-gold" />
                            </div>
                            <div className="flex flex-col gap-2 font-luxury text-sm text-slate-300">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="font-space font-bold text-white text-base md:text-lg tracking-tight">{booking.name}</span>
                                <span className="text-xs uppercase tracking-wider bg-white/[0.04] border border-white/10 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                                  {booking.id}
                                </span>
                                <span className={`text-[10px] uppercase border px-2 py-0.5 rounded-full font-space font-bold tracking-wider ${
                                  booking.status === 'Cancelled' 
                                    ? 'bg-red-500/10 border-red-500/25 text-red-400 shadow-md shadow-red-500/5' 
                                    : 'bg-teal/10 border-teal/25 text-teal shadow-md shadow-teal/5'
                                }`}>
                                  {booking.status || 'Confirmed'}
                                </span>
                              </div>
                              <p className="text-slate-400 text-sm leading-relaxed">{booking.details}</p>
                              <div className="flex flex-wrap gap-4 mt-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-gold/80" /> {booking.date}</span>
                                {booking.passengers && <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-gold/80" /> {booking.passengers} Guest{booking.passengers > 1 ? "s" : ""}</span>}
                                {booking.type && <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-gold/80" /> {booking.type}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex lg:flex-col items-start lg:items-end justify-between w-full lg:w-auto border-t lg:border-t-0 border-white/[0.06] pt-4 lg:pt-0 gap-4">
                            <div>
                              <span className="text-[10px] font-space uppercase text-slate-400 tracking-wider font-bold block">Final Cost</span>
                              <span className="font-space font-extrabold text-gold text-lg md:text-xl tracking-tight block mt-0.5">₹{Number(booking.price).toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex gap-2.5 flex-wrap">
                              <button onClick={() => router.push(`/success?id=${booking.id}`)}
                                className="px-4 py-2 border border-white/10 hover:border-gold rounded-xl font-space text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-gold bg-white/[0.02] hover:bg-gold/5 transition-all cursor-pointer">
                                Invoice
                              </button>
                              <button onClick={() => setActiveTab("tickets")}
                                className="px-4 py-2 border border-white/10 hover:border-teal/50 rounded-xl font-space text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-teal bg-white/[0.02] hover:bg-teal/5 transition-all cursor-pointer">
                                Support
                              </button>
                              {booking.status !== 'Cancelled' && (
                                <button onClick={() => cancelBooking(booking.id)}
                                  className="px-4 py-2 border border-red-500/20 hover:border-red-500/60 rounded-xl font-space text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 bg-white/[0.02] hover:bg-red-500/10 transition-all cursor-pointer">
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Refund Processing Timeline */}
                        {booking.status === 'Cancelled' && (
                          <div className="border-t border-white/[0.06] pt-5 flex flex-col gap-4">
                            <div className="flex items-center justify-between text-xs font-space uppercase tracking-widest">
                              <span className="font-bold text-slate-400">Refund Processing Pipeline</span>
                              <span className="text-red-400 font-bold bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded">Processing</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-space uppercase tracking-wider">
                              {/* Step 1 */}
                              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/5 border border-red-500/15">
                                <div className="h-6 w-6 rounded-full bg-red-500/20 text-red-400 border border-red-500/35 flex items-center justify-center font-bold text-xs">✓</div>
                                <span className="text-white font-semibold">Cancelled</span>
                              </div>
                              {/* Step 2 */}
                              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/5 border border-red-500/15">
                                <div className="h-6 w-6 rounded-full bg-red-500/20 text-red-400 border border-red-500/35 flex items-center justify-center font-bold text-xs">✓</div>
                                <span className="text-white font-semibold">Corridor Released</span>
                              </div>
                              {/* Step 3 */}
                              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gold/5 border border-gold/15">
                                <div className="h-6 w-6 rounded-full bg-gold/20 text-gold border border-gold/35 flex items-center justify-center font-bold text-xs animate-pulse">/</div>
                                <span className="text-gold font-bold">Processing</span>
                              </div>
                              {/* Step 4 */}
                              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.01] border border-white/[0.06] opacity-40">
                                <div className="h-6 w-6 rounded-full bg-white/5 text-slate-400 border border-white/10 flex items-center justify-center text-xs">4</div>
                                <span className="text-slate-400 font-medium">Credited</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── 3. FAVOURITES ────────────────────────────────────────────── */}
            {activeTab === "favourites" && (
              <div className="flex flex-col gap-6">
                <h2 className="font-space text-xl md:text-2xl font-bold text-white border-b border-white/[0.06] pb-4">Saved Favourites</h2>
                
                {favorites.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-luxury text-base flex flex-col items-center gap-4 border border-white/[0.06] rounded-2xl bg-white/[0.01]">
                    <Heart className="h-12 w-12 text-white/20" />
                    <p>You haven't saved any favourites yet.</p>
                    <button onClick={() => router.push("/tours")} className="text-gold text-sm font-space font-bold underline cursor-pointer hover:text-gold-hover transition-colors">Explore Packages →</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col bg-white/[0.02] hover:border-white/20 transition-all shadow-md">
                        <div className="h-36 relative overflow-hidden">
                          <img src={fav.img} alt={fav.name} className="w-full h-full object-cover opacity-70 hover:scale-105 transition-all duration-500" />
                          <span className="absolute top-3 left-3 text-[10px] font-space font-bold uppercase tracking-wider bg-gold/90 text-black px-2.5 py-1 rounded-md shadow-md">
                            {fav.tag}
                          </span>
                          <button 
                            onClick={() => handleRemoveFavorite(fav.id)}
                            className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer text-red-400"
                          >
                            <Heart className="h-4.5 w-4.5 fill-red-400 text-red-400" />
                          </button>
                        </div>
                        <div className="p-5 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-space text-sm md:text-base font-bold text-white tracking-tight">{fav.name}</p>
                            <p className="text-xs text-slate-400 font-luxury mt-1">{fav.type}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-space text-sm md:text-base font-bold text-gold tracking-tight">{fav.price}</p>
                            <button onClick={() => router.push("/booking")}
                              className="text-xs font-space font-bold text-teal uppercase tracking-wider hover:text-white transition-colors cursor-pointer mt-1.5 block">
                              Book Now →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-400 font-luxury text-center mt-3">
                  These are your curated favourites. Heart any service during browsing to save it here.
                </p>
              </div>
            )}



            {/* ── 5. TRAVEL DOCUMENTS ──────────────────────────────────────── */}
            {activeTab === "documents" && (
              <div className="flex flex-col gap-6">
                <div className="border-b border-white/[0.06] pb-4">
                  <h2 className="font-space text-xl md:text-2xl font-bold text-white">Travel Documents</h2>
                  <p className="font-luxury text-sm text-slate-400 mt-1">Upload and manage your KYC and travel documents for expedited boarding.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: "passport", label: "Passport", desc: "Valid passport for international travel clearance", icon: Globe },
                    { key: "aadhaar", label: "Aadhaar Card", desc: "Government-issued ID for domestic KYC verification", icon: User },
                    { key: "visa", label: "Visa Documents", desc: "Active visa for international charter destinations", icon: FileText },
                    { key: "medical", label: "Medical Fitness", desc: "High-altitude medical clearance certificate", icon: Shield },
                  ].map((doc) => {
                    const uploaded = docUploaded[doc.key as keyof typeof docUploaded];
                    return (
                      <div key={doc.key} className={`p-6 rounded-2xl border flex flex-col gap-5 transition-all shadow-md ${
                        uploaded ? "border-teal/30 bg-teal/5 shadow-teal/5" : "border-white/[0.06] bg-white/[0.02]"
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className={`h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 ${
                              uploaded ? "bg-teal/10 border-teal/25 text-teal" : "bg-white/[0.04] border-white/10 text-slate-400"
                            }`}>
                              <doc.icon className="h-5.5 w-5.5" />
                            </div>
                            <div>
                              <p className="font-space text-sm md:text-base font-bold text-white tracking-tight">{doc.label}</p>
                              <p className="font-luxury text-xs text-slate-400 mt-1 leading-relaxed max-w-[200px]">{doc.desc}</p>
                            </div>
                          </div>
                          {uploaded ? (
                            <CheckCircle className="h-6 w-6 text-teal shrink-0" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-slate-500 shrink-0" />
                          )}
                        </div>
                        <button
                          onClick={() => setDocUploaded((p) => ({ ...p, [doc.key]: !p[doc.key as keyof typeof docUploaded] }))}
                          className={`w-full py-3 rounded-xl border font-space text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                            uploaded
                              ? "border-teal/30 bg-teal/10 text-teal hover:bg-teal/15 shadow-md shadow-teal/5"
                              : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-gold/40 hover:text-gold"
                          }`}>
                          <Upload className="h-4 w-4" />
                          <span>{uploaded ? "Re-upload Document" : "Upload Document"}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3.5 p-5 bg-gold/5 border border-gold/25 rounded-2xl text-sm font-luxury text-slate-300 leading-relaxed shadow-lg">
                  <Lock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <p>All documents are encrypted and stored securely. They are only accessed by our compliance team for DGCA permit verification and customs clearance.</p>
                </div>
              </div>
            )}

            {/* ── 6. PROFILE SETTINGS ──────────────────────────────────────── */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSave} className="flex flex-col gap-6">
                <h2 className="font-space text-xl md:text-2xl font-bold text-white border-b border-white/[0.06] pb-4">Profile Configuration</h2>

                {profileSaved && (
                  <div className="bg-teal/10 border border-teal/25 text-teal text-sm px-5 py-3.5 rounded-xl flex items-center gap-2.5 shadow-md shadow-teal/5">
                    <Check className="h-4.5 w-4.5" /> <span>Profile updated successfully.</span>
                  </div>
                )}

                {/* Avatar section */}
                <div className="flex items-center gap-5 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl shadow-md">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold/30 to-gold/5 border-2 border-gold/45 flex items-center justify-center text-gold font-space font-bold text-2xl shrink-0 shadow-lg">
                    {user?.name?.slice(0, 2).toUpperCase() || "VIP"}
                  </div>
                  <div>
                    <p className="font-space text-base md:text-lg font-bold text-white tracking-tight">{user?.name}</p>
                    <p className={`font-space text-xs font-semibold mt-1 ${tierColor}`}>{tier} Member · {loyaltyPoints} pts</p>
                    <button type="button" className="text-xs font-space text-gold/80 hover:text-gold mt-2 cursor-pointer transition-colors uppercase tracking-wider flex items-center gap-1.5 font-bold">
                      <Upload className="h-3.5 w-3.5" /> <span>Change Avatar</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Full Name</label>
                    <input type="text" required value={profileName}
                      onChange={(e) => setProfileName(e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Email (read-only)</label>
                    <input type="email" disabled value={profileEmail} className={INPUT_CLS + " opacity-50 cursor-not-allowed border-dashed"} />
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Phone Number</label>
                    <input type="tel" required value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)} className={INPUT_CLS} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Date of Birth</label>
                    <input type="date" value={profileDob}
                      onChange={(e) => setProfileDob(e.target.value)} className={INPUT_CLS} style={{ colorScheme: "dark" }} />
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Gender</label>
                    <select value={profileGender} onChange={(e) => setProfileGender(e.target.value)}
                      className={INPUT_CLS + " cursor-pointer"}>
                      {["Male", "Female", "Non-Binary", "Prefer not to say"].map((g) => (
                        <option key={g} value={g} className="bg-[#030712]">{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>City / Base Location</label>
                    <input type="text" value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)} className={INPUT_CLS} placeholder="e.g. New Delhi" />
                  </div>
                  <div className="flex flex-col">
                    <label className={LABEL_CLS}>Nationality</label>
                    <select value={profileNationality} onChange={(e) => setProfileNationality(e.target.value)}
                      className={INPUT_CLS + " cursor-pointer"}>
                      {["Indian", "British", "American", "UAE National", "Canadian", "Australian", "Other"].map((n) => (
                        <option key={n} value={n} className="bg-[#030712]">{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit"
                  className="px-6 py-3.5 bg-gold hover:bg-gold-hover text-black rounded-xl font-space font-bold text-xs uppercase tracking-widest transition-all border border-gold cursor-pointer self-start flex items-center gap-2 shadow-lg shadow-gold/15">
                  <Check className="h-4 w-4" /> <span>Save Profile</span>
                </button>
              </form>
            )}

            {/* ── 7. SUPPORT INQUIRIES ─────────────────────────────────────── */}
            {activeTab === "tickets" && (
              <div className="flex flex-col gap-6">
                <h2 className="font-space text-xl md:text-2xl font-bold text-white border-b border-white/[0.06] pb-4">Support Inquiries</h2>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Create */}
                  <div className="lg:col-span-5 flex flex-col gap-5 lg:border-r lg:border-white/[0.06] lg:pr-8">
                    <h3 className="font-space text-sm uppercase tracking-wider font-bold text-gold">Submit New Inquiry</h3>
                    {tckCreated && (
                      <div className="bg-teal/10 border border-teal/25 text-teal text-xs px-4 py-3 rounded-xl shadow-md">
                        ✓ Inquiry logged. VIP dispatcher will review shortly.
                      </div>
                    )}
                    <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <label className={LABEL_CLS}>Subject</label>
                        <input type="text" required placeholder="e.g. VIP Catering Request" value={tckSubject}
                          onChange={(e) => setTckSubject(e.target.value)} className={INPUT_CLS} />
                      </div>
                      <div className="flex flex-col">
                        <label className={LABEL_CLS}>Category</label>
                        <select value={tckCategory} onChange={(e) => setTckCategory(e.target.value)}
                          className={INPUT_CLS + " cursor-pointer"}>
                          <option>General Inquiry</option>
                          <option>Billing Issue</option>
                          <option>Flight Change Request</option>
                          <option>Cancellation Request</option>
                          <option>Feedback</option>
                          <option>Emergency</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className={LABEL_CLS}>Message</label>
                        <textarea rows={5} required placeholder="Describe your inquiry in detail…" value={tckMsg}
                          onChange={(e) => setTckMsg(e.target.value)} className={INPUT_CLS + " resize-none"} />
                      </div>
                      <button type="submit"
                        className="w-full py-3.5 bg-gold hover:bg-gold-hover text-black font-space text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-gold/15">
                        Submit Inquiry
                      </button>
                    </form>
                  </div>

                  {/* History */}
                  <div className="lg:col-span-7 flex flex-col gap-5">
                    <h3 className="font-space text-sm uppercase tracking-wider font-bold text-gold">Inquiry History</h3>
                    <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                      {tickets.length === 0 ? (
                        <p className="text-sm text-slate-400 font-luxury text-center py-8 border border-white/[0.06] rounded-2xl bg-white/[0.01]">No inquiries submitted yet.</p>
                      ) : (
                        tickets.map((t: any) => (
                          <button key={t.id} onClick={() => setActiveTicketId(t.id)}
                            className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer text-sm ${
                              activeTicketId === t.id ? "bg-gold/10 border-gold/40 text-gold font-bold" : "bg-white/[0.01] border-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.04]"
                            }`}>
                            <div>
                              <div className="font-bold text-white tracking-tight">{t.subject}</div>
                              <span className="text-xs text-slate-400 mt-1 block">{t.category} · {t.date}</span>
                            </div>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              t.status === "Open" ? "text-teal bg-teal/10 border border-teal/20" : "text-slate-400 bg-white/5 border border-white/10"
                            }`}>{t.status}</span>
                          </button>
                        ))
                      )}
                    </div>

                    {selectedTicket && (
                      <div className="border border-white/[0.06] rounded-2xl p-5 bg-white/[0.02] flex flex-col gap-4 shadow-lg">
                        <span className="font-space text-xs font-semibold tracking-wider text-gold uppercase">Chat — {selectedTicket.subject}</span>
                        <div className="flex flex-col gap-4 max-h-56 overflow-y-auto pr-1">
                          {(selectedTicket as any).messages.map((m: any, i: number) => (
                            <div key={i} className={`flex flex-col gap-1 max-w-[85%] p-3.5 rounded-xl text-sm leading-relaxed ${
                              m.sender === "user"
                                ? "bg-gold/10 border border-gold/20 text-white self-end text-right"
                                : "bg-white/[0.04] border border-white/[0.06] text-slate-300 self-start"
                            }`}>
                              <p>{m.text}</p>
                              <span className="text-[10px] opacity-50 mt-1 block">{m.date}</span>
                            </div>
                          ))}
                        </div>
                        <form onSubmit={handleSendReply} className="flex gap-2.5 border-t border-white/[0.06] pt-4">
                          <input type="text" required placeholder="Type your response…" value={chatReply}
                            onChange={(e) => setChatReply(e.target.value)}
                            className={INPUT_CLS + " flex-1"} />
                          <button type="submit"
                            className="px-5 bg-gold hover:bg-gold-hover text-black rounded-xl flex items-center justify-center cursor-pointer shrink-0 shadow-md">
                            <Send className="h-4.5 w-4.5" />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── 8. SECURITY PROTOCOLS ────────────────────────────────────── */}
            {activeTab === "security" && (
              <div className="flex flex-col gap-8">
                <h2 className="font-space text-xl md:text-2xl font-bold text-white border-b border-white/[0.06] pb-4">Security & Compliance</h2>

                <div className="flex flex-col gap-4">
                  {[
                    { icon: Shield, color: "text-gold bg-gold/10 border-gold/25 shadow-gold/5", title: "Two-Factor Authentication (2FA)", desc: "Your account enforces 6-digit OTP validation via email on every login and high-value reservation.", status: "Active" },
                    { icon: Bell, color: "text-teal bg-teal/10 border-teal/25 shadow-teal/5", title: "Real-Time Security Alerts", desc: `We monitor login activity and flight status changes. You have ${unread} unread alert${unread !== 1 ? "s" : ""} right now.`, status: "Enabled" },
                    { icon: Lock, color: "text-purple-300 bg-purple-500/10 border-purple-500/25 shadow-purple-500/5", title: "JWT Session Encryption", desc: "All sessions are signed using RS256 asymmetric encryption with a 1-hour rolling window and refresh token rotation.", status: "Active" },
                    { icon: FileText, color: "text-blue-300 bg-blue-500/10 border-blue-500/25 shadow-blue-500/5", title: "DGCA Compliance Record", desc: "Your charter flights are logged under Non-Scheduled Operator Permit (NSOP) regulations. All records are audit-ready.", status: "Verified" },
                  ].map((item, i) => (
                    <div key={i} className="p-6 border border-white/[0.06] bg-white/[0.02] rounded-2xl flex items-start gap-5 hover:border-white/15 transition-all shadow-md">
                      <div className={`h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                        <item.icon className="h-5.5 w-5.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-space text-sm md:text-base font-bold text-white uppercase tracking-tight">{item.title}</span>
                          <span className="text-[10px] font-bold text-teal bg-teal/10 border border-teal/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{item.status}</span>
                        </div>
                        <p className="font-luxury text-sm text-slate-400 leading-relaxed mt-2">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active sessions */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-space text-sm uppercase tracking-wider font-bold text-gold/90">Active Sessions</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { device: "Chrome · Windows 11", location: "Mumbai, IN", time: "Now · Current session", active: true },
                      { device: "Safari · iPhone 15", location: "Delhi, IN", time: "2 hours ago", active: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-white/15 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className={`h-3 w-3 rounded-full ${session.active ? "bg-teal animate-pulse" : "bg-slate-600"}`} />
                          <div>
                            <p className="font-space text-sm md:text-base font-bold text-white tracking-tight">{session.device}</p>
                            <p className="font-luxury text-xs text-slate-400 mt-1">{session.location} · {session.time}</p>
                          </div>
                        </div>
                        {!session.active && (
                          <button className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/30 transition-all font-space font-bold uppercase cursor-pointer border border-red-500/20 px-3.5 py-1.5 rounded-xl">
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
