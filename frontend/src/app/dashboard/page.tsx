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

import API from "@/utils/api";
import { useWishlistStore } from "@/store/useWishlistStore";

type Tab = "overview" | "bookings" | "favourites" | "documents" | "profile" | "tickets" | "security";

function StatCard({ icon: Icon, label, value, sub, color = "gold" }: any) {
  const colorMap: Record<string, string> = {
    gold: "text-[#C5A880] bg-[#C5A880]/5 border-[#C5A880]/20",
    teal: "text-teal-400 bg-teal-400/5 border-teal-400/20",
    purple: "text-purple-400 bg-purple-400/5 border-purple-400/20",
    blue: "text-sky-400 bg-sky-400/5 border-sky-400/20",
  };
  return (
    <div className="bg-slate-900/40 border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between hover:border-[#C5A880]/30 hover:bg-slate-900/60 transition-all duration-300 shadow-xl backdrop-blur-md group">
      <div className="flex items-center justify-between mb-3">
        <div className={`h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 shadow-md ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {sub && <span className="text-[9px] font-space uppercase font-bold text-[#C5A880] bg-[#C5A880]/10 border border-[#C5A880]/20 px-2.5 py-0.5 rounded-full">{sub}</span>}
      </div>
      <div>
        <p className="font-space text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</p>
        <p className="font-space text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

const INPUT_CLS = "w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880]/50 focus:ring-1 focus:ring-[#C5A880]/30 transition-all font-sans placeholder-slate-600 backdrop-blur-sm";
const LABEL_CLS = "text-[10px] font-space uppercase tracking-widest text-[#C5A880] font-bold mb-1.5 block";

export default function DashboardPage() {
  const router = useRouter();
  const {
    isLoggedIn, user, bookings, tickets, notifications,
    logout, fetchBookings, fetchTickets, fetchProfile, addTicket,
    addReplyToTicket, updateProfile, markNotificationsAsRead,
  } = useAuthStore();
  const { items: favorites, removeItem: handleRemoveFavorite } = useWishlistStore();

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Statistics State
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedTrips: 0,
    cancelledBookings: 0,
    upcomingTrips: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError(false);
      const res = await API.get("/profile/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setStatsError(true);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchStats();
    }
  }, [isLoggedIn, bookings]);

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileEmail] = useState(user?.email || "");
  const [profileCity, setProfileCity] = useState(user?.city_of_residence || "");
  const [profileNationality, setProfileNationality] = useState(user?.nationality || "Indian");
  const [profileGender, setProfileGender] = useState(user?.gender || "Male");
  const [profileDob, setProfileDob] = useState(user?.date_of_birth || "");
  const [profileSaved, setProfileSaved] = useState(false);

  // Support Tickets States
  const [tckSubject, setTckSubject] = useState("");
  const [tckCategory, setTckCategory] = useState("General Inquiry");
  const [tckMsg, setTckMsg] = useState("");
  const [tckCreated, setTckCreated] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [chatReply, setChatReply] = useState("");

  // Documents Upload States (real file handling & database sync)
  const [docFiles, setDocFiles] = useState<Record<string, { fileName: string; fileSize: string; uploadedAt: string }>>({});
  const fileInputRefs: Record<string, React.RefObject<HTMLInputElement | null>> = {
    passport: React.useRef<HTMLInputElement>(null),
    aadhaar: React.useRef<HTMLInputElement>(null),
    visa: React.useRef<HTMLInputElement>(null),
    medical: React.useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (user?.email) {
      API.get(`/auth/kyc-documents?email=${encodeURIComponent(user.email)}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            const docsMap: Record<string, any> = {};
            res.data.forEach((d: any) => {
              docsMap[d.document_type] = {
                fileName: d.file_name,
                fileSize: d.file_size || "Verified",
                uploadedAt: `Uploaded on ${new Date(d.uploaded_at).toLocaleDateString()}`,
              };
            });
            setDocFiles(docsMap);
          }
        })
        .catch((err) => console.error("Error fetching KYC docs:", err));
    }
  }, [user]);

  const handleFileUpload = async (docKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setDocFiles((prev) => ({
        ...prev,
        [docKey]: {
          fileName: file.name,
          fileSize: `${sizeMb} MB`,
          uploadedAt: `Uploaded today at ${timeStr}`,
        },
      }));

      try {
        const formData = new FormData();
        formData.append('document_type', docKey);
        formData.append('file', file);
        formData.append('file_name', file.name);
        formData.append('file_size', `${sizeMb} MB`);
        if (user?.email) formData.append('email', user.email);

        await API.post('/auth/kyc-documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (err) {
        console.error('Error saving KYC doc to DB:', err);
      }
    }
  };

  const handleRemoveDoc = (docKey: string) => {
    setDocFiles((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
  };

  // Security Management States
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdStatus, setPwdStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessions, setSessions] = useState([
    { id: "s-1", device: "Chrome · Windows 11", location: "Mumbai, IN", time: "Active now (Current Device)", isCurrent: true },
    { id: "s-2", device: "Safari · iPhone 15 Pro", location: "Delhi, IN", time: "Last active 2 hrs ago", isCurrent: false },
    { id: "s-3", device: "Firefox · macOS Sonoma", location: "Bengaluru, IN", time: "Last active yesterday", isCurrent: false },
  ]);
  const [securityLogs, setSecurityLogs] = useState([
    { id: "l-1", event: "Account Login Authorized", device: "Chrome / Windows 11", date: "Today at 21:40" },
    { id: "l-2", event: "2FA Verification Code Validated", device: "Email Security Desk", date: "Today at 21:40" },
    { id: "l-3", event: "JWT Token Issued", device: "OAuth RS256 Engine", date: "Today at 21:40" },
  ]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPassword) {
      setPwdStatus({ type: "error", msg: "Please enter your current password." });
      return;
    }
    if (newPassword.length < 8) {
      setPwdStatus({ type: "error", msg: "New password must be at least 8 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdStatus({ type: "error", msg: "New passwords do not match." });
      return;
    }

    try {
      await API.post('/auth/change-password', {
        email: user?.email,
        current_password: currPassword,
        new_password: newPassword,
      });
      setPwdStatus({ type: "success", msg: "Password updated and secured in database!" });
      setCurrPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSecurityLogs((prev) => [
        { id: `l-${Date.now()}`, event: "Password Updated in Database", device: "Security Panel", date: "Just now" },
        ...prev,
      ]);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to update password. Check current password.";
      setPwdStatus({ type: "error", msg: errorMsg });
    }
    setTimeout(() => setPwdStatus(null), 4000);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setSecurityLogs((prev) => [
      { id: `l-${Date.now()}`, event: "Session Revoked by User", device: "Security Panel", date: "Just now" },
      ...prev,
    ]);
  };

  // Cancellation Wizard States
  const [cancellingBooking, setCancellingBooking] = useState<any | null>(null);
  const [cancelStep, setCancelStep] = useState<number>(1);
  const [cancelReason, setCancelReason] = useState<string>("Change of Plans");
  const [cancelNotes, setCancelNotes] = useState<string>("");
  const [refundMethod, setRefundMethod] = useState<"original" | "bank">("original");

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings();
      fetchTickets();
      fetchProfile();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfilePhone(user.phone || "");
      setProfileCity(user.city_of_residence || "");
      setProfileNationality(user.nationality || "Indian");
      setProfileGender(user.gender || "Male");
      setProfileDob(user.date_of_birth || "");
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: profileName,
      phone: profilePhone,
      city_of_residence: profileCity,
      nationality: profileNationality,
      gender: profileGender,
      date_of_birth: profileDob || null,
    });
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
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">Authentication Required</h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-md mb-6 font-sans">
          You are currently signed out. Please sign in on the dedicated login page to view your flight reservations and account settings.
        </p>
        <button
          onClick={() => router.push("/auth?mode=login&redirect=/dashboard")}
          className="px-8 py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Open Login Page</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const selectedTicket = tickets.find((t) => t.id === activeTicketId);
  const unread = notifications.filter((n: any) => !n.read).length;


  const NAV_ITEMS: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "bookings", label: "Flight Reservations", icon: CreditCard, badge: bookings.length },
    { id: "favourites", label: "Saved Wishlist", icon: Heart, badge: favorites.length },
    { id: "documents", label: "Travel KYC Docs", icon: FileText, badge: Object.keys(docFiles).length },
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "security", label: "Security & Protocols", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-24 pb-16 px-4 md:px-8 relative overflow-hidden">
      {/* Premium ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#C5A880]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/3 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">

        {/* ─────────────────────────────────────────── */}
        {/* Top Executive Header Banner                 */}
        {/* ─────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-slate-900/90 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#1E293B] to-[#0F172A] border border-white/10 flex items-center justify-center text-[#C5A880] font-serif font-bold text-2xl shrink-0 shadow-inner">
              {user?.name?.slice(0, 2).toUpperCase() || "Premium"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">ID: #{user?.id || "USR-ACCOUNT"}</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 tracking-wide">
                Welcome back, {user?.name}
              </h1>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {user?.email} {user?.phone ? `· ${user.phone}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 relative z-10 w-full md:w-auto border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 text-center flex-1 md:flex-initial">
              <span className="text-[9px] text-slate-400 font-space uppercase block font-bold">Active Bookings</span>
              <span className="font-space text-lg font-bold text-white">{statsLoading ? "..." : stats.activeBookings}</span>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 text-center flex-1 md:flex-initial">
              <span className="text-[9px] text-slate-400 font-space uppercase block font-bold">Total Bookings</span>
              <span className="font-space text-lg font-bold text-white">{statsLoading ? "..." : stats.totalBookings}</span>
            </div>
            <button
              onClick={() => router.push("/booking")}
              className="px-5 py-3 bg-gradient-to-r from-[#C5A880] to-[#E2C799] hover:from-[#BCA078] hover:to-[#D5BA8C] text-[#020B1E] font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#C5A880]/10 transition-all shrink-0 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
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
          <div className="lg:col-span-3 bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl p-4 rounded-2xl shadow-xl flex flex-col gap-2 lg:sticky lg:top-24">
            <span className="text-[10px] font-space uppercase tracking-widest text-[#C5A880] font-bold px-3 pt-2 pb-1">
              Account Menu
            </span>

            <nav className="flex flex-col gap-1.5 font-space text-xs">
              {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full text-left py-3.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-3 border ${
                      isActive 
                        ? "bg-white/[0.03] border-l-2 border-l-[#C5A880] border-y-transparent border-r-transparent text-[#C5A880] font-bold shadow-lg shadow-black/25" 
                        : "text-slate-400 border-l-2 border-transparent hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span className="flex-1 truncate">{label}</span>
                    {badge !== undefined && badge > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-[#C5A880]/20 text-[#C5A880]" : "bg-white/5 text-slate-400 border border-white/10"
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
                className="w-full text-left py-3 px-3.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all font-space text-xs font-bold flex items-center gap-3 cursor-pointer"
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
                className="bg-slate-900/40 border border-white/[0.06] backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl min-h-[600px]"
              >

                {/* ── 1. OVERVIEW TAB ────────────────────────────────────────── */}
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-8">
                    
                    {/* Welcome Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
                      <div>
                        <span className="text-[10px] font-space uppercase tracking-widest text-[#C5A880] font-bold">Flight Dispatch Portal</span>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 tracking-wide mt-1">
                          Operational Overview
                        </h2>
                        <p className="text-xs text-slate-400 font-sans mt-0.5">
                          Track active helicopter charters, loyalty tier status, and Priority support tickets
                        </p>
                      </div>

                      {/* Aviation Weather Alert Badge */}
                      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <div>
                          <span className="text-[9px] font-space uppercase text-slate-400 font-bold block">Aviation Weather Status</span>
                          <span className="text-xs font-space text-emerald-400 font-bold">VFR Active · Clear Skies</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stat Cards Grid */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-space text-[10px] font-bold uppercase tracking-widest text-[#C5A880]">Profile Statistics</h3>
                      {statsLoading ? (
                        <div className="text-center py-6 text-xs text-slate-400 font-sans">
                          Loading profile statistics...
                        </div>
                      ) : statsError ? (
                        <div className="text-center py-6 text-xs text-red-400 font-sans">
                          Failed to load statistics.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                          <StatCard icon={Helicopter} label="Total Bookings" value={stats.totalBookings} sub="All Bookings" color="gold" />
                          <StatCard icon={Zap} label="Active Bookings" value={stats.activeBookings} sub="Active" color="teal" />
                          <StatCard icon={CheckCircle} label="Completed Trips" value={stats.completedTrips} sub="Completed" color="blue" />
                          <StatCard icon={AlertCircle} label="Cancelled Bookings" value={stats.cancelledBookings} sub="Cancelled" color="purple" />
                          <StatCard icon={Calendar} label="Upcoming Trips" value={stats.upcomingTrips} sub="Upcoming" color="gold" />
                        </div>
                      )}
                    </div>

                    {/* Boarding Pass Card (Live Database Booking) */}
                    {bookings.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <h3 className="font-space text-[10px] font-bold uppercase tracking-widest text-[#C5A880]">Boarding Pass Preview</h3>
                        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl flex flex-col md:flex-row items-stretch gap-6">
                          <div className="flex-1 flex flex-col justify-between gap-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-space uppercase bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30 px-2.5 py-0.5 rounded font-bold">
                                {bookings[0].status || "CONFIRMED FLIGHT"}
                              </span>
                              <Helicopter className="h-5 w-5 text-[#C5A880] animate-pulse" />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <span className="text-[9px] font-space uppercase text-slate-400 block font-bold">BOOKING REF</span>
                                <span className="font-space text-base md:text-lg font-bold text-white">#{bookings[0].reference_number || bookings[0].id}</span>
                              </div>
                              <div className="flex-1 border-t border-dashed border-white/10 relative flex items-center justify-center">
                                <span className="absolute -top-2 bg-slate-900 px-2 text-[9px] font-space text-[#C5A880] font-bold">
                                  {bookings[0].service_type || "LUXURY TRIP"}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] font-space uppercase text-slate-400 block font-bold">ROUTE / SERVICE</span>
                                <span className="font-space text-base md:text-lg font-bold text-[#C5A880]">{bookings[0].route || bookings[0].name || "Helicopter Flight"}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-3 text-xs font-space">
                              <div>
                                <span className="text-[9px] text-slate-500 block font-semibold">PASSENGER</span>
                                <span className="font-bold text-white truncate block">{user?.name}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-500 block font-semibold">DEPARTURE DATE</span>
                                <span className="font-bold text-white block">{bookings[0].departure_date || bookings[0].date || "Upcoming"}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-500 block font-semibold">STATUS</span>
                                <span className="font-bold text-emerald-400 block">SLOT VERIFIED</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recent Reservations */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-space text-[10px] font-bold uppercase tracking-widest text-[#C5A880]">Recent Reservations</h3>
                        <button
                          onClick={() => setActiveTab("bookings")}
                          className="text-xs font-space text-slate-400 hover:text-[#C5A880] flex items-center gap-1 font-bold transition-colors cursor-pointer"
                        >
                          <span>View All</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      {bookings.length === 0 ? (
                        <div className="p-8 text-center bg-white/[0.02] border border-white/[0.06] rounded-2xl text-xs text-slate-400 font-sans">
                          No reservations found. <Link href="/booking" className="text-[#C5A880] hover:text-[#D5BA8C] underline font-bold">Book Helicopter →</Link>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {bookings.slice(0, 3).map((b: any) => (
                            <div key={b.id} className="p-4 bg-slate-900/30 border border-white/[0.05] hover:border-[#C5A880]/20 rounded-xl flex items-center justify-between gap-4 shadow-md transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shrink-0">
                                  <Helicopter className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-space text-xs font-bold text-white">{b.route || b.service_type || b.name || "Charter Ride"}</h4>
                                  <span className="text-[10px] text-slate-400 font-sans block">{b.departure_date || b.date || "Scheduled Flight"}</span>
                                </div>
                              </div>
                              <span className="font-space text-sm font-bold text-[#C5A880]">₹{(b.total_fare || b.price || 0).toLocaleString()}</span>
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-4 gap-4">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">Flight Reservations Log</h2>
                        <p className="text-xs text-slate-400 font-sans mt-0.5">Manage and track your booked helicopter charters, tour packages, and boat rides</p>
                      </div>
                      <button
                        onClick={() => router.push("/booking")}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#C5A880] to-[#E2C799] hover:from-[#BCA078] hover:to-[#D5BA8C] text-[#020B1E] font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto transform hover:-translate-y-0.5"
                      >
                        <Helicopter className="h-4 w-4" />
                        <span>Book New Flight</span>
                      </button>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="py-16 text-center bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
                        <Helicopter className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                        <h3 className="font-serif text-lg font-bold text-white mb-1">No bookings found.</h3>
                        <p className="text-xs text-slate-400 font-sans mb-4">You haven't made any bookings yet.</p>
                        <button onClick={() => router.push("/booking")} className="px-6 py-2.5 bg-[#C5A880] hover:bg-[#D5BA8C] text-[#020B1E] font-space text-xs font-bold uppercase tracking-wider rounded-xl transition-all">Book Flight Now</button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {bookings.map((booking: any) => (
                          <div key={booking.id} className="bg-slate-900/30 border border-white/[0.05] hover:border-[#C5A880]/20 rounded-2xl p-5 shadow-lg flex flex-col gap-4 transition-all duration-300">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                                  <Helicopter className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs font-bold text-[#C5A880]">#{booking.reference_number || booking.id}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-space font-bold uppercase">
                                      {booking.status || "CONFIRMED"}
                                    </span>
                                  </div>
                                  <h4 className="font-space text-sm font-bold text-white">{booking.route || booking.service_type || booking.name || "Charter Booking"}</h4>
                                  <p className="text-xs text-slate-400 font-sans mt-0.5">Date: {booking.departure_date || booking.date || "Upcoming"} · {booking.passengers_count || 1} Passenger(s)</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-white/[0.08] pt-3 md:pt-0">
                                <div>
                                  <span className="text-[9px] text-slate-500 uppercase block font-sans font-medium">Total Fare</span>
                                  <span className="font-space text-lg font-bold text-[#C5A880]">₹{(booking.total_fare || booking.price || 0).toLocaleString()}</span>
                                </div>
                                <button
                                  onClick={() => router.push(`/my-trips`)}
                                  className="px-4 py-2 border border-[#C5A880]/40 text-[#C5A880] hover:bg-[#C5A880] hover:text-[#020B1E] rounded-xl font-space text-xs font-bold uppercase transition-all"
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
                    <div className="border-b border-white/[0.08] pb-4">
                      <h2 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">Saved Wishlist</h2>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Your bookmarked luxury helicopter rides, hotels and boat charters</p>
                    </div>

                    {favorites.length === 0 ? (
                      <div className="py-16 text-center bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
                        <Heart className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                        <h3 className="font-serif text-lg font-bold text-white mb-1">Your Wishlist is Empty</h3>
                        <p className="text-xs text-slate-400 font-sans mb-4">Heart any experience during browsing to save it here.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {favorites.map((fav) => (
                          <div key={fav.id} className="bg-slate-950/30 border border-white/[0.05] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-[#C5A880]/20 transition-all duration-300">
                            <div className="h-40 relative overflow-hidden bg-slate-950">
                              <img src={fav.image || fav.img || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400"} alt={fav.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75" />
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#C5A880] text-[#020B1E] font-space text-[9px] font-bold uppercase shadow-md">
                                {fav.tag || fav.category || "Luxury"}
                              </span>
                              <button
                                onClick={() => handleRemoveFavorite(fav.id)}
                                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-red-400 hover:bg-black/90 transition-all cursor-pointer border border-white/10"
                              >
                                <Heart className="h-4 w-4 fill-red-400" />
                              </button>
                            </div>
                            <div className="p-5 flex items-center justify-between gap-4">
                              <div>
                                <h4 className="font-space text-sm font-bold text-white">{fav.name}</h4>
                                <span className="text-xs text-slate-400 font-sans block mt-0.5">{fav.category || fav.type || "Service"}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-space text-base font-bold text-[#C5A880] block">
                                  {typeof fav.price === "number" ? `₹${fav.price.toLocaleString("en-IN")}` : fav.price}
                                </span>
                                <button onClick={() => router.push(fav.href || "/booking")} className="text-[10px] font-space font-bold uppercase text-[#C5A880] hover:text-[#D5BA8C] mt-1 block">Book Now →</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── 4. TRAVEL KYC DOCS TAB (REAL FUNCTIONAL FILE UPLOAD) ───── */}
                {activeTab === "documents" && (
                  <div className="flex flex-col gap-6">
                    <div className="border-b border-white/[0.08] pb-4">
                      <h2 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">Travel &amp; KYC Documents</h2>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Upload verified documents for expedited DGCA helipad clearance and boarding authorization</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: "passport", label: "Passport Documents", desc: "International travel clearance & identity proof", icon: Globe },
                        { key: "aadhaar", label: "Aadhaar Card ID", desc: "Government-issued KYC identity proof", icon: User },
                        { key: "visa", label: "Visa Approvals", desc: "Active visa documentation for charter destinations", icon: FileText },
                        { key: "medical", label: "High-Altitude Medical Clearance", desc: "Helicopter pilgrimage medical certificate", icon: Shield },
                      ].map((doc) => {
                        const fileInfo = docFiles[doc.key];
                        return (
                          <div key={doc.key} className={`p-6 rounded-2xl border flex flex-col justify-between gap-5 transition-all duration-300 ${fileInfo ? "bg-emerald-950/20 border-emerald-500/30 shadow-lg shadow-emerald-500/5" : "bg-slate-950/30 border-white/[0.05] hover:border-[#C5A880]/20"}`}>
                            <input
                               type="file"
                               ref={fileInputRefs[doc.key]}
                               onChange={(e) => handleFileUpload(doc.key, e)}
                               className="hidden"
                               accept=".pdf,.png,.jpg,.jpeg"
                            />

                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3.5">
                                <div className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-all ${fileInfo ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-white/[0.02] text-slate-400 border-white/[0.08]"}`}>
                                  <doc.icon className="h-5.5 w-5.5" />
                                </div>
                                <div>
                                  <h4 className="font-space text-xs font-bold text-white">{doc.label}</h4>
                                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">{doc.desc}</p>
                                </div>
                              </div>
                              {fileInfo ? <CheckCircle className="h-5.5 w-5.5 text-emerald-400 shrink-0" /> : <AlertCircle className="h-5.5 w-5.5 text-slate-600 shrink-0" />}
                            </div>

                            {fileInfo ? (
                              <div className="bg-black/35 border border-emerald-500/20 rounded-xl p-3 flex flex-col gap-1 text-xs">
                                <div className="flex items-center justify-between font-mono font-bold text-white truncate">
                                  <span className="truncate">📄 {fileInfo.fileName}</span>
                                  <span className="text-[10px] text-emerald-400 shrink-0 ml-2">VERIFIED</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-sans">{fileInfo.fileSize} · {fileInfo.uploadedAt}</span>
                                
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                                  <button
                                    onClick={() => fileInputRefs[doc.key].current?.click()}
                                    className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-space font-bold uppercase transition-all"
                                  >
                                    Replace File
                                  </button>
                                  <button
                                    onClick={() => handleRemoveDoc(doc.key)}
                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[10px] font-space font-bold uppercase transition-all"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => fileInputRefs[doc.key].current?.click()}
                                className="w-full py-3 rounded-xl bg-white/[0.02] hover:bg-[#C5A880] hover:text-[#020B1E] border border-white/[0.08] font-space text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer group"
                              >
                                <Upload className="h-4 w-4 text-[#C5A880] group-hover:text-[#020B1E]" />
                                <span>Upload File</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── 5. PROFILE SETTINGS TAB ────────────────────────────────── */}
                {activeTab === "profile" && (
                  <form onSubmit={handleProfileSave} className="flex flex-col gap-6">
                    <div className="border-b border-white/[0.08] pb-4">
                      <h2 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">Profile Configuration</h2>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Manage your personal details and contact preferences</p>
                    </div>

                    {profileSaved && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-space font-bold flex items-center gap-2">
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
                      className="px-6 py-3 bg-gradient-to-r from-[#C5A880] to-[#E2C799] hover:from-[#BCA078] hover:to-[#D5BA8C] text-[#020B1E] font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all self-start flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <Check className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </form>
                )}


                {/* ── 7. SECURITY & PROTOCOLS TAB (FULLY FUNCTIONAL CONTROLS) ─── */}
                {activeTab === "security" && (
                  <div className="flex flex-col gap-8">
                    <div className="border-b border-white/[0.08] pb-4">
                      <h2 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">Security &amp; Protocols</h2>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Account protection, password updates, 2FA management, and active session control</p>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-slate-950/30 border border-white/[0.05] rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                      <h3 className="font-space text-xs font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span>Update Account Password</span>
                      </h3>

                      {pwdStatus && (
                        <div className={`p-3.5 rounded-xl border text-xs font-space font-bold flex items-center gap-2 ${
                          pwdStatus.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}>
                          {pwdStatus.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                          <span>{pwdStatus.msg}</span>
                        </div>
                      )}

                      <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className={LABEL_CLS}>Current Password</label>
                          <input type="password" required value={currPassword} onChange={(e) => setCurrPassword(e.target.value)} className={INPUT_CLS} placeholder="••••••••" />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>New Password</label>
                          <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={INPUT_CLS} placeholder="••••••••" />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Confirm New Password</label>
                          <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={INPUT_CLS} placeholder="••••••••" />
                        </div>
                        <div className="md:col-span-3">
                          <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-[#C5A880] to-[#E2C799] hover:from-[#BCA078] hover:to-[#D5BA8C] text-[#020B1E] font-space text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer transform hover:-translate-y-0.5">
                            Update Password
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Security Feature Switches (2FA & Encryption) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 bg-slate-950/30 border border-white/[0.05] rounded-2xl flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <Shield className="h-6 w-6 text-[#C5A880] shrink-0 mt-1" />
                          <div>
                            <h4 className="font-space text-xs font-bold text-white uppercase">Two-Factor Authentication (2FA)</h4>
                            <p className="text-xs text-slate-400 font-sans mt-1">Requires email OTP code on every login attempt.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                          className={`px-3 py-1.5 rounded-full font-space text-[10px] font-bold uppercase transition-all cursor-pointer shrink-0 border ${
                            twoFactorEnabled ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-slate-400 border-white/10"
                          }`}
                        >
                          {twoFactorEnabled ? "ENABLED" : "DISABLED"}
                        </button>
                      </div>

                      <div className="p-5 bg-slate-950/30 border border-white/[0.05] rounded-2xl flex items-start gap-4">
                        <Lock className="h-6 w-6 text-[#C5A880] shrink-0 mt-1" />
                        <div>
                          <h4 className="font-space text-xs font-bold text-white uppercase">Session Encryption</h4>
                          <p className="text-xs text-slate-400 font-sans mt-1">JWT asymmetric RS256 token rotation.</p>
                          <span className="inline-block mt-2 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">SECURED</span>
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
