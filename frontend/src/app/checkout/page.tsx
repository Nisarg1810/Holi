"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BookingProgressTracker from "@/components/booking/BookingProgressTracker";
import { useCartStore, Passenger, AddOn } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { User, ShieldCheck, Ticket, Trash2, CheckCircle2, ChevronRight, Armchair, Award, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
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

  useEffect(() => {
    if (user) {
      if (user.email && !emailId) setEmailId(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (user && passengers.length > 0 && passengers[0].fullName === "") {
      const updated = [...passengers];
      updated[0] = {
        ...updated[0],
        fullName: user.name || "",
        age: 30,
        gender: "Male",
        idProof: "AADHAAR-VERIFIED"
      };
      setPassengers(updated);
    }
  }, [user]);

  const isBoat = item?.type === "boat";

  const addOnOptions: AddOn[] = isBoat ? [
    { id: "ao-b1", name: "Gourmet Seafood Platter", price: 8500, description: "Chef-prepared fresh catch with wine pairing" },
    { id: "ao-b2", name: "Snorkeling Gear Package", price: 4500, description: "Full set for all guests — masks, fins, vests" },
    { id: "ao-b3", name: "Sunset Photography Session", price: 6500, description: "Professional photographer for 1 hour onboard" },
    { id: "ao-b4", name: "Private DJ & Sound System", price: 12000, description: "Live DJ with premium marine speaker setup" },
  ] : [
    { id: "ao-1", name: "Gourmet Caviar & Champagne", price: 12500, description: "VIP cabin flight refreshments" },
    { id: "ao-2", name: "Airport Limousine Pickup", price: 15000, description: "Audi A8 terminal transfer service" },
    { id: "ao-3", name: "Extended Heli Baggage (+15kg)", price: 8000, description: "Additional custom weight allowance" },
  ];

  const handleSeatClick = (seatId: string) => {
    if (!item) return;
    const isSelected = selectedSeats.includes(seatId);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= item.passengers) {
        setSelectedSeats([...selectedSeats.slice(1), seatId]);
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
    const updated = [...passengers];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setPassengers(updated);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.toUpperCase().trim();
    if (code === "AURA10") {
      applyPromo("AURA10", 10);
      setPromoError("");
    } else if (code === "ROMANVIP") {
      applyPromo("ROMANVIP", 10);
      setPromoError("");
    } else if (code === "CHARDHAM2026") {
      applyPromo("CHARDHAM2026", 0);
      setPromoError("");
    } else {
      setPromoError("Invalid coupon code.");
    }
  };

  const calculateTotal = () => {
    if (!item) return { subtotal: 0, discount: 0, taxes: 0, total: 0, fareDiscount: 0 };
    const base = Number(item.price);
    
    let fareDiscount = 0;
    if (item.fare_type === "Student") {
      fareDiscount = base * 0.10;
    } else if (item.fare_type === "Armed Forces") {
      fareDiscount = base * 0.15;
    } else if (item.fare_type === "Senior Citizen") {
      fareDiscount = base * 0.12;
    } else if (item.fare_type === "Doctor & Nurses") {
      fareDiscount = base * 0.10;
    }

    const discountedBase = base - fareDiscount;
    const addOnsCost = selectedAddOns.reduce((acc, curr) => acc + curr.price, 0);
    const insuranceCost = insuranceEnabled ? 5000 * item.passengers : 0;
    const subtotal = discountedBase + addOnsCost + insuranceCost;
    
    let discount = 0;
    if (appliedPromo) {
      if (appliedPromo.code === "CHARDHAM2026") {
        discount = 15000;
      } else {
        discount = subtotal * (appliedPromo.discountPercent / 100);
      }
    }
    
    // Boats use 5% marine GST; others use 18% aviation GST
    const taxRate = item.type === "boat" ? 0.05 : 0.18;
    const taxes = (subtotal - discount) * taxRate;
    return {
      subtotal,
      discount,
      fareDiscount,
      taxes,
      total: subtotal - discount + taxes,
    };
  };

  const priceSummary = calculateTotal();

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (!emailId || !emailId.includes("@")) {
      alert("Please enter a valid email address for receiving your ticket & confirmation.");
      return;
    }
    if (!mobileNo || mobileNo.length < 10) {
      alert("Please enter a valid 10-digit mobile number for WhatsApp & SMS updates.");
      return;
    }

    // Save contact info to passenger #1
    const sanitized = passengers.map((p, idx) => ({
      fullName: p.fullName.trim() !== "" ? p.fullName : (idx === 0 && user?.name ? user.name : `VIP Guest #${idx + 1}`),
      age: Number(p.age) > 0 ? Number(p.age) : 30,
      gender: p.gender || "Male",
      idProof: p.idProof.trim() !== "" ? p.idProof : "AADHAAR-VERIFIED",
      email: idx === 0 ? emailId : p.email,
      phone: idx === 0 ? mobileNo : p.phone,
    }));
    setPassengers(sanitized);

    if (item.type === "helicopter" && selectedSeats.length < item.passengers) {
      const seatsNeeded = item.passengers - selectedSeats.length;
      const vacant = HELI_SEATS.filter((s) => !selectedSeats.includes(s));
      const autoSelected = [...selectedSeats, ...vacant.slice(0, seatsNeeded)];
      setSelectedSeats(autoSelected);
    }

    router.push("/payment");
  };

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col gap-4 items-center min-h-[60vh] justify-center bg-[#F2F5F8] text-slate-800">
        <h2 className="font-space text-2xl font-bold">Your booking stack is empty.</h2>
        <p className="text-sm text-slate-500">Explore our helicopter charter routes or hotels to begin.</p>
        <button
          onClick={() => router.push("/booking")}
          className="px-6 py-3 bg-[#051433] hover:bg-[#092254] text-white font-space text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md"
        >
          View Helicopter Fleet
        </button>
      </div>
    );
  }

  const HELI_SEATS = ["1A", "1B", "2A", "2B", "3A", "3B"];

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      
      {/* MakeMyTrip Style Hero Header */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-6 pb-16 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-7xl mx-auto">
          <BookingProgressTracker currentStep={3} />
          <h1 className="font-space text-3xl font-bold tracking-tight text-white mt-4">Review Booking &amp; Passenger Details</h1>
          <p className="text-xs text-slate-300 mt-1 font-sans">
            Enter contact information for ticket delivery and passenger manifest for flight boarding pass
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* 1. Contact Details Card (Mobile No & Email ID) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800 flex flex-col gap-4">
              <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#051433]" />
                Contact &amp; Ticket Delivery Details
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Your flight ticket, booking confirmation, and PDF boarding pass will be sent to this email &amp; mobile number via WhatsApp &amp; SMS.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@example.com"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#051433]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 py-2.5 text-xs text-slate-600 font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#051433]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Passenger Manifest Forms */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800 flex flex-col gap-4">
              <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-[#051433]" />
                Passenger Manifest ({item.passengers} Guest{item.passengers > 1 ? "s" : ""})
              </h3>

              <div className="flex flex-col gap-4">
                {passengers.map((p, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col gap-3">
                    <span className="font-space text-xs font-bold uppercase text-[#051433]">
                      Passenger #{idx + 1}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="As on Govt ID"
                          value={p.fullName}
                          onChange={(e) => handlePassengerChange(idx, "fullName", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#051433]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Age / Gender</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Age"
                            required
                            value={p.age || ""}
                            onChange={(e) => handlePassengerChange(idx, "age", Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                          />
                          <select
                            value={p.gender}
                            onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Government ID / Aadhaar / Passport</label>
                        <input
                          type="text"
                          required
                          placeholder="ID Proof Number"
                          value={p.idProof}
                          onChange={(e) => handlePassengerChange(idx, "idProof", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#051433]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Boat Charter Info OR Helicopter Seating */}
            {item.type === "boat" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800"
              >
                <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 mb-4">
                  <Ticket className="h-4 w-4 text-[#051433]" />
                  Charter Details & Special Requests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Charter Summary</span>
                    <p className="text-xs text-slate-700 font-medium">{item.details}</p>
                    <p className="text-[10px] text-slate-500">Date: <strong className="text-slate-800">{item.date}</strong></p>
                    <p className="text-[10px] text-slate-500">Guests: <strong className="text-slate-800">{item.passengers}</strong></p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Important Notes</span>
                    <ul className="text-[10px] text-slate-600 space-y-1">
                      <li>✓ Life jackets provided for all guests</li>
                      <li>✓ Experienced certified captain included</li>
                      <li>✓ Report 30 mins before departure</li>
                      <li>✓ Valid govt ID required for boarding</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
            item.type === "helicopter" && (
              passengers.every((p) => p.fullName && p.fullName.trim() !== "") ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800"
                >
                  <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 mb-4">
                    <Armchair className="h-4 w-4 text-[#051433]" />
                    Interactive Cabin Seating Selection
                  </h3>

                  <div className="flex flex-col md:flex-row items-center justify-around gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div className="w-52 bg-[#051433] text-white p-6 rounded-full flex flex-col items-center gap-4 relative shadow-md">
                      <div className="h-8 w-20 border border-white/20 rounded-t-full bg-[#020B1E] flex items-center justify-center text-[9px] font-space text-slate-300 tracking-widest uppercase">
                        COCKPIT
                      </div>
                      <div className="grid grid-cols-2 gap-6 w-full mt-2">
                        {HELI_SEATS.map((seatId) => {
                          const isSelected = selectedSeats.includes(seatId);
                          return (
                            <button
                              type="button"
                              key={seatId}
                              onClick={() => handleSeatClick(seatId)}
                              className={`py-3 px-2 rounded-xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#F5A623] border-[#F5A623] text-black font-bold scale-105"
                                  : "bg-[#020B1E] border-white/20 text-slate-300 hover:border-white/50"
                              }`}
                            >
                              <Armchair className="h-4 w-4" />
                              <span className="text-[9px] font-mono font-bold">{seatId}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 text-xs text-slate-600 max-w-sm">
                      <span className="font-space uppercase font-bold text-slate-900">Seating Allocation</span>
                      <p>Click on the cabin seating chart to assign seats for your manifest. Please allocate {item.passengers} seats.</p>
                      <div className="flex justify-between border-t border-slate-200 pt-2 font-mono text-slate-900 font-bold">
                        <span>Allocated Seats:</span>
                        <span>{selectedSeats.join(", ") || "Auto-Assigning"}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
            ) : (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center flex flex-col items-center gap-2 text-slate-500">
                  <Armchair className="h-6 w-6 text-slate-400" />
                  <span className="font-space font-bold text-slate-700 text-xs uppercase">Interactive Cabin Seating Selection</span>
                  <p className="text-xs">Please fill in passenger full name(s) above to unlock cabin seating selection.</p>
                </div>
              )
            ))}

            {/* 4. Add-ons */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800">
              <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                {item.type === "boat" ? "🌊 Boat Charter Add-ons" : "Luxury Flight Add-ons"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {addOnOptions.map((addon) => {
                  const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddOn(addon)}
                      className={`text-left p-4 rounded-xl border flex flex-col justify-between min-h-36 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-50 border-[#051433] text-slate-900 ring-2 ring-[#051433]/20"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <h4 className="font-space text-xs font-bold text-slate-900 mb-1">{addon.name}</h4>
                        <p className="text-[10px] text-slate-500 leading-snug">{addon.description}</p>
                      </div>
                      <div className="flex items-center justify-between w-full border-t border-slate-100 pt-3 mt-2">
                        <span className="font-mono text-xs font-bold text-slate-900">+₹{addon.price.toLocaleString("en-IN")}</span>
                        <span className="text-[9px] uppercase font-bold text-slate-500">{isSelected ? "Remove" : "Select"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Pricing details summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800 flex flex-col gap-4">
              <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3">
                Booking Summary
              </h3>

              <div className="flex flex-col gap-3 text-xs">
                {item.image && (
                  <div className="h-28 relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-space text-slate-400 uppercase font-bold block">{item.type} Service</span>
                  <h4 className="font-space text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="text-slate-500 mt-0.5">{item.details}</p>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">Travel Date: {item.date}</span>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-700">VIP Flight Insurance</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={insuranceEnabled}
                    onChange={(e) => setInsuranceEnabled(e.target.checked)}
                    className="accent-[#051433] h-4 w-4 cursor-pointer"
                  />
                </div>

                {/* Promo Code Form */}
                <div className="border-t border-slate-100 pt-3 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Apply Promo Code</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. AURA10"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold uppercase text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3 py-1.5 bg-[#051433] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#092254]"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-[10px] text-emerald-600 font-bold mt-1">
                      <span>Applied: {appliedPromo.code}</span>
                      <button type="button" onClick={removePromo} className="text-red-500 hover:underline">Remove</button>
                    </div>
                  )}
                  {promoError && <span className="text-[10px] text-red-500 font-bold">{promoError}</span>}
                </div>

                {/* Final Price Breakdown */}
                {priceSummary && (
                  <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                    <div className="flex justify-between text-slate-500">
                      <span>Base Rate</span>
                      <span>₹{Number(item.price).toLocaleString("en-IN")}</span>
                    </div>
                    {item.fare_type && item.fare_type !== "Regular" && priceSummary.fareDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>{item.fare_type} Discount</span>
                        <span>-₹{priceSummary.fareDiscount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {item.gst_number && (
                      <div className="flex justify-between text-slate-600 font-medium">
                        <span>GSTIN ID</span>
                        <span className="font-mono text-[11px]">{item.gst_number}</span>
                      </div>
                    )}
                    {selectedAddOns.length > 0 && (
                      <div className="flex justify-between text-slate-500">
                        <span>VIP Add-ons</span>
                        <span>+₹{selectedAddOns.reduce((acc, curr) => acc + curr.price, 0).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {insuranceEnabled && (
                      <div className="flex justify-between text-slate-500">
                        <span>Flight Insurance</span>
                        <span>+₹{(5000 * item.passengers).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {appliedPromo && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Promo Discount</span>
                        <span>-₹{priceSummary.discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500">
                        <span>{item.type === "boat" ? "Marine Service Tax (5%)" : "GST Aviation Tax (18%)"}</span>
                        <span>₹{priceSummary.taxes.toLocaleString("en-IN")}</span>
                      </div>
                    <div className="flex justify-between items-end border-t border-slate-100 pt-3 mt-1">
                      <span className="font-space text-xs font-bold uppercase text-slate-900">Total Price</span>
                      <span className="font-space text-2xl font-bold text-slate-900">
                        ₹{priceSummary.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] hover:to-[#C57A2D] text-black font-space font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>PROCEED TO PAYMENT</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Lock / Security Note */}
            <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl flex items-center gap-3 text-slate-600 text-xs font-sans">
              <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>256-bit SSL Encrypted Secure Payment Gateway</span>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}
