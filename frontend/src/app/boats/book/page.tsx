"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BookingProgressTracker from "@/components/booking/BookingProgressTracker";
import { useCartStore, Passenger, AddOn } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  User, ShieldCheck, Trash2, Mail, Phone, Lock, ArrowRight,
  Anchor, MapPin, Clock, Users, Star, Check, Waves,
  UtensilsCrossed, Music2, Waves as WaveIcon, Bike,
} from "lucide-react";
import { motion } from "framer-motion";

// ── Deck Slot Layout ──────────────────────────────────────────────────────────
const DECK_SLOTS = [
  { id: "D1", label: "Bow Deck 1", section: "bow" },
  { id: "D2", label: "Bow Deck 2", section: "bow" },
  { id: "S1", label: "Starboard 1", section: "mid" },
  { id: "S2", label: "Starboard 2", section: "mid" },
  { id: "P1", label: "Port Side 1", section: "mid" },
  { id: "P2", label: "Port Side 2", section: "mid" },
  { id: "A1", label: "Aft Deck 1", section: "aft" },
  { id: "A2", label: "Aft Deck 2", section: "aft" },
];

const BOAT_ADDONS: AddOn[] = [
  { id: "ba-1", name: "Gourmet Seafood Platter", price: 8500, description: "Premium catch-of-day feast for all guests" },
  { id: "ba-2", name: "Onboard DJ & Sound System", price: 12000, description: "Professional DJ + premium audio setup" },
  { id: "ba-3", name: "Snorkeling & Dive Gear", price: 4500, description: "Full gear set for underwater exploration" },
  { id: "ba-4", name: "Jet Ski Rental (1 Hour)", price: 9000, description: "High-speed jet ski alongside your charter" },
];

export default function BoatCheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    item,
    selectedSeats,
    passengers,
    selectedAddOns,
    insuranceEnabled,
    appliedPromo,
    setSelectedSeats,
    setPassengers,
    toggleAddOn,
    setInsuranceEnabled,
    applyPromo,
    removePromo,
  } = useCartStore();

  const [emailId, setEmailId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  // Redirect if wrong type or no item
  useEffect(() => {
    if (item && item.type !== "boat") {
      router.push("/checkout");
    }
  }, [item]);

  useEffect(() => {
    if (user) {
      if (user.email && !emailId) setEmailId(user.email);
      if (passengers.length > 0 && passengers[0].fullName === "") {
        const updated = [...passengers];
        updated[0] = { ...updated[0], fullName: user.name || "", age: 30, gender: "Male", idProof: "AADHAAR-VERIFIED" };
        setPassengers(updated);
      }
    }
  }, [user]);

  const handleDeckClick = (slotId: string) => {
    if (!item) return;
    const isSelected = selectedSeats.includes(slotId);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s !== slotId));
    } else {
      if (selectedSeats.length >= item.passengers) {
        setSelectedSeats([...selectedSeats.slice(1), slotId]);
      } else {
        setSelectedSeats([...selectedSeats, slotId]);
      }
    }
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.toUpperCase().trim();
    if (code === "AURA10") { applyPromo("AURA10", 10); setPromoError(""); }
    else if (code === "ROMANVIP") { applyPromo("ROMANVIP", 10); setPromoError(""); }
    else if (code === "YACHT15") { applyPromo("YACHT15", 15); setPromoError(""); }
    else { setPromoError("Invalid coupon code. Try YACHT15 for 15% off."); }
  };

  const calculateTotal = () => {
    if (!item) return { subtotal: 0, discount: 0, taxes: 0, total: 0 };
    const base = Number(item.price);
    const addOnsCost = selectedAddOns.reduce((acc, curr) => acc + curr.price, 0);
    const insuranceCost = insuranceEnabled ? 3500 * item.passengers : 0;
    const subtotal = base + addOnsCost + insuranceCost;
    let discount = 0;
    if (appliedPromo) discount = subtotal * (appliedPromo.discountPercent / 100);
    const taxes = (subtotal - discount) * 0.18;
    return { subtotal, discount, taxes, total: subtotal - discount + taxes };
  };

  const priceSummary = calculateTotal();

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    if (!emailId || !emailId.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!mobileNo || mobileNo.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    const sanitized = passengers.map((p, idx) => ({
      fullName: p.fullName.trim() || (idx === 0 && user?.name ? user.name : `Guest #${idx + 1}`),
      age: Number(p.age) > 0 ? Number(p.age) : 25,
      gender: p.gender || "Male",
      idProof: p.idProof.trim() || "AADHAAR-VERIFIED",
      email: idx === 0 ? emailId : p.email,
      phone: idx === 0 ? mobileNo : p.phone,
    }));
    setPassengers(sanitized);

    // Auto-assign deck slots if not enough selected
    if (selectedSeats.length < item.passengers) {
      const vacant = DECK_SLOTS.filter((s) => !selectedSeats.includes(s.id)).map((s) => s.id);
      const needed = item.passengers - selectedSeats.length;
      setSelectedSeats([...selectedSeats, ...vacant.slice(0, needed)]);
    }

    router.push("/payment");
  };

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col gap-4 items-center min-h-[60vh] justify-center bg-[#F2F5F8] text-slate-800">
        <Anchor className="h-12 w-12 text-slate-300" />
        <h2 className="font-space text-2xl font-bold">No charter selected.</h2>
        <p className="text-sm text-slate-500">Please search and choose a yacht to continue.</p>
        <button
          onClick={() => router.push("/boats")}
          className="px-6 py-3 bg-[#051433] hover:bg-[#092254] text-white font-space text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md"
        >
          Browse Yacht Charters
        </button>
      </div>
    );
  }

  const allPassengersFilled = passengers.every((p) => p.fullName && p.fullName.trim() !== "");
  const bowSlots = DECK_SLOTS.filter((s) => s.section === "bow");
  const midSlots = DECK_SLOTS.filter((s) => s.section === "mid");
  const aftSlots = DECK_SLOTS.filter((s) => s.section === "aft");

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">

      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-6 pb-16 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-7xl mx-auto">
          <BookingProgressTracker currentStep={3} />
          <div className="flex items-center gap-3 mt-4">
            <div className="h-10 w-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
              <Anchor className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="font-space text-2xl md:text-3xl font-bold tracking-tight text-white">
                Review Charter & Guest Details
              </h1>
              <p className="text-xs text-slate-300 mt-0.5 font-sans">
                Enter guest information and select your deck position for this charter
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left Column ── */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Booking Summary Strip */}
            <div className="bg-[#051433] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4 text-white shadow-lg">
              {item.image && (
                <div className="h-20 w-32 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Yacht Charter</span>
                <h3 className="font-space text-lg font-bold text-white">{item.name}</h3>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-slate-300"><MapPin className="h-3 w-3 text-amber-400" />{item.details}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-300"><Clock className="h-3 w-3 text-amber-400" />{item.duration}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-300"><Users className="h-3 w-3 text-amber-400" />{item.passengers} Guests</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-slate-400 font-sans block">Charter Rate</span>
                <span className="font-space text-xl font-bold text-amber-400">₹{Number(item.price).toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* 1. Contact Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800 flex flex-col gap-4">
              <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#051433]" />
                Contact & Ticket Delivery Details
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Your charter confirmation, boarding pass, and invoice will be sent to this email & mobile number.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email" required placeholder="e.g. name@example.com"
                    value={emailId} onChange={(e) => setEmailId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#051433]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 py-2.5 text-xs text-slate-600 font-bold">+91</span>
                    <input
                      type="tel" required maxLength={10} placeholder="10-digit mobile number"
                      value={mobileNo} onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#051433]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Guest Manifest */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800 flex flex-col gap-4">
              <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-[#051433]" />
                Guest Manifest ({item.passengers} Guest{item.passengers > 1 ? "s" : ""})
              </h3>
              <div className="flex flex-col gap-4">
                {passengers.map((p, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col gap-3">
                    <span className="font-space text-xs font-bold uppercase text-[#051433] flex items-center gap-2">
                      <Anchor className="h-3.5 w-3.5" /> Guest #{idx + 1}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                        <input
                          type="text" required placeholder="As on Govt ID"
                          value={p.fullName} onChange={(e) => handlePassengerChange(idx, "fullName", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#051433]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Age / Gender</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number" placeholder="Age" required
                            value={p.age || ""} onChange={(e) => handlePassengerChange(idx, "age", Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                          />
                          <select
                            value={p.gender} onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Govt ID / Aadhaar / Passport</label>
                        <input
                          type="text" required placeholder="ID Proof Number"
                          value={p.idProof} onChange={(e) => handlePassengerChange(idx, "idProof", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#051433]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Deck Position Selection */}
            {allPassengersFilled ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800"
              >
                <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 mb-5">
                  <Waves className="h-4 w-4 text-[#051433]" />
                  Deck Position Selection
                  <span className="ml-auto text-[10px] font-mono text-slate-400 normal-case font-normal">
                    Select {item.passengers} position{item.passengers > 1 ? "s" : ""}
                  </span>
                </h3>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-8 items-center justify-around">
                  {/* Boat SVG Map */}
                  <div className="flex flex-col items-center gap-3 min-w-[200px]">
                    {/* Bow (front) */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">🛶 BOW (FRONT)</span>
                      <div className="flex gap-3">
                        {bowSlots.map((slot) => {
                          const isSel = selectedSeats.includes(slot.id);
                          return (
                            <button key={slot.id} type="button" onClick={() => handleDeckClick(slot.id)}
                              className={`w-14 h-12 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer text-center gap-0.5 ${
                                isSel ? "bg-amber-400 border-amber-500 text-black scale-105 shadow-md" : "bg-white border-slate-300 text-slate-500 hover:border-blue-400"
                              }`}>
                              <span className="text-[9px] font-mono font-bold">{slot.id}</span>
                              {isSel && <Check className="h-3 w-3" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Boat body divider */}
                    <div className="w-full border-t-2 border-dashed border-slate-300 my-1 relative">
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-50 px-2 text-[9px] font-bold text-slate-400 uppercase">Main Deck</span>
                    </div>

                    {/* Mid (port + starboard) */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex gap-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase text-center">Port</span>
                          {midSlots.filter(s => s.id.startsWith("P")).map((slot) => {
                            const isSel = selectedSeats.includes(slot.id);
                            return (
                              <button key={slot.id} type="button" onClick={() => handleDeckClick(slot.id)}
                                className={`w-14 h-12 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer gap-0.5 ${
                                  isSel ? "bg-amber-400 border-amber-500 text-black scale-105 shadow-md" : "bg-white border-slate-300 text-slate-500 hover:border-blue-400"
                                }`}>
                                <span className="text-[9px] font-mono font-bold">{slot.id}</span>
                                {isSel && <Check className="h-3 w-3" />}
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex flex-col justify-center">
                          <div className="w-8 h-24 rounded-lg bg-[#051433]/10 border border-[#051433]/20 flex items-center justify-center">
                            <Anchor className="h-5 w-5 text-[#051433]/40 rotate-12" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase text-center">Starboard</span>
                          {midSlots.filter(s => s.id.startsWith("S")).map((slot) => {
                            const isSel = selectedSeats.includes(slot.id);
                            return (
                              <button key={slot.id} type="button" onClick={() => handleDeckClick(slot.id)}
                                className={`w-14 h-12 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer gap-0.5 ${
                                  isSel ? "bg-amber-400 border-amber-500 text-black scale-105 shadow-md" : "bg-white border-slate-300 text-slate-500 hover:border-blue-400"
                                }`}>
                                <span className="text-[9px] font-mono font-bold">{slot.id}</span>
                                {isSel && <Check className="h-3 w-3" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Aft (stern) */}
                    <div className="w-full border-t-2 border-dashed border-slate-300 my-1" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex gap-3">
                        {aftSlots.map((slot) => {
                          const isSel = selectedSeats.includes(slot.id);
                          return (
                            <button key={slot.id} type="button" onClick={() => handleDeckClick(slot.id)}
                              className={`w-14 h-12 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer gap-0.5 ${
                                isSel ? "bg-amber-400 border-amber-500 text-black scale-105 shadow-md" : "bg-white border-slate-300 text-slate-500 hover:border-blue-400"
                              }`}>
                              <span className="text-[9px] font-mono font-bold">{slot.id}</span>
                              {isSel && <Check className="h-3 w-3" />}
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">⚓ AFT (STERN)</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-3 text-xs text-slate-600 max-w-xs">
                    <span className="font-space uppercase font-bold text-slate-900">Deck Allocation</span>
                    <p className="font-sans leading-relaxed">
                      Click on deck positions to assign spots for your guests. Select {item.passengers} position{item.passengers > 1 ? "s" : ""} matching your guest count.
                    </p>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1.5"><div className="h-4 w-4 rounded bg-amber-400 border border-amber-500" /><span>Selected</span></div>
                      <div className="flex items-center gap-1.5"><div className="h-4 w-4 rounded bg-white border border-slate-300" /><span>Available</span></div>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 font-mono text-slate-900 font-bold">
                      <span>Selected Positions:</span>
                      <span>{selectedSeats.join(", ") || "Auto-Assigning"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center flex flex-col items-center gap-2 text-slate-500">
                <Waves className="h-6 w-6 text-slate-300" />
                <span className="font-space font-bold text-slate-700 text-xs uppercase">Deck Position Selection</span>
                <p className="text-xs font-sans">Fill in guest names above to unlock deck position selection.</p>
              </div>
            )}

            {/* 4. Yacht Add-ons */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800">
              <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" /> Premium Charter Add-ons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BOAT_ADDONS.map((addon) => {
                  const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                  const icons: Record<string, React.ReactNode> = {
                    "ba-1": <UtensilsCrossed className="h-5 w-5" />,
                    "ba-2": <Music2 className="h-5 w-5" />,
                    "ba-3": <WaveIcon className="h-5 w-5" />,
                    "ba-4": <Bike className="h-5 w-5" />,
                  };
                  return (
                    <button
                      key={addon.id} type="button" onClick={() => toggleAddOn(addon)}
                      className={`text-left p-4 rounded-xl border flex flex-col justify-between min-h-36 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-50 border-amber-300 ring-2 ring-amber-200"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-amber-400 text-black" : "bg-slate-100 text-slate-500"}`}>
                          {icons[addon.id]}
                        </div>
                        <div>
                          <h4 className="font-space text-xs font-bold text-slate-900">{addon.name}</h4>
                          <p className="text-[10px] text-slate-500 leading-snug mt-0.5">{addon.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                        <span className="font-mono text-xs font-bold text-slate-900">+₹{addon.price.toLocaleString("en-IN")}</span>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-amber-400 text-black" : "bg-slate-100 text-slate-500"}`}>
                          {isSelected ? "✓ Added" : "Add"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ── Right Column: Price Summary ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800 flex flex-col gap-4">
              <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3">
                Charter Summary
              </h3>

              <div className="flex flex-col gap-3 text-xs">
                {item.image && (
                  <div className="h-28 relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <span className="text-white text-[10px] font-bold font-mono">{item.duration}</span>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-space text-amber-600 uppercase font-bold block">🚢 Yacht Charter</span>
                  <h4 className="font-space text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="text-slate-500 mt-0.5 text-[11px]">{item.details}</p>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">Date: {item.date}</span>
                </div>

                {/* Charter Insurance */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-700">Marine Charter Insurance</span>
                  </div>
                  <input
                    type="checkbox" checked={insuranceEnabled}
                    onChange={(e) => setInsuranceEnabled(e.target.checked)}
                    className="accent-[#051433] h-4 w-4 cursor-pointer"
                  />
                </div>
                {insuranceEnabled && (
                  <p className="text-[10px] text-slate-400 -mt-2">
                    +₹{(3500 * item.passengers).toLocaleString("en-IN")} marine accident coverage
                  </p>
                )}

                {/* Promo Code */}
                <div className="border-t border-slate-100 pt-3 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Apply Promo Code</span>
                  <div className="flex gap-2">
                    <input
                      type="text" placeholder="e.g. YACHT15"
                      value={promoInput} onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold uppercase text-slate-900 focus:outline-none"
                    />
                    <button type="button" onClick={handleApplyPromo}
                      className="px-3 py-1.5 bg-[#051433] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#092254]">
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-[10px] text-emerald-600 font-bold mt-1">
                      <span>Applied: {appliedPromo.code} (-{appliedPromo.discountPercent}%)</span>
                      <button type="button" onClick={removePromo} className="text-red-500 hover:underline">Remove</button>
                    </div>
                  )}
                  {promoError && <span className="text-[10px] text-red-500 font-bold">{promoError}</span>}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Charter Rate</span>
                    <span>₹{Number(item.price).toLocaleString("en-IN")}</span>
                  </div>
                  {selectedAddOns.length > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Add-ons</span>
                      <span>+₹{selectedAddOns.reduce((a, c) => a + c.price, 0).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {insuranceEnabled && (
                    <div className="flex justify-between text-slate-500">
                      <span>Marine Insurance</span>
                      <span>+₹{(3500 * item.passengers).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount</span>
                      <span>-₹{Math.round(priceSummary.discount).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>GST (18%)</span>
                    <span>₹{Math.round(priceSummary.taxes).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-end border-t border-slate-100 pt-3 mt-1">
                    <span className="font-space text-xs font-bold uppercase text-slate-900">Total Payable</span>
                    <span className="font-space text-2xl font-bold text-slate-900">
                      ₹{Math.round(priceSummary.total).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  id="boat-checkout-proceed"
                  className="w-full py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] hover:to-[#C57A2D] text-black font-space font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>PROCEED TO PAYMENT</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl flex items-center gap-3 text-slate-600 text-xs font-sans">
              <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>256-bit SSL Encrypted Secure Payment Gateway — Your data is fully protected.</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
