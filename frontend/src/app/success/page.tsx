"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BookingProgressTracker from "@/components/booking/BookingProgressTracker";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckCircle2, FileText, ArrowRight, Printer, Share2, ShieldCheck, Download, Plane, Building, Compass, Anchor, MapPin, Calendar, Users, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import canvasConfetti from "canvas-confetti";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookings = useAuthStore((state) => state.bookings);

  const bookingId = searchParams.get("id") || "BK-8801";
  const booking = bookings.find((b) => b.id === bookingId) || bookings[0] || {
    id: bookingId,
    type: "helicopter",
    name: "Airbus H145 Twin-Engine Helicopter",
    details: "Dehradun Helipad (DED) ➔ Kedarnath Sanctuary",
    date: "2026-07-30",
    passengers: 2,
    price: 297950,
    status: "Confirmed",
    created_at: new Date().toISOString()
  };

  useEffect(() => {
    canvasConfetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#F5A623", "#051433", "#10B981"],
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `I just booked my luxury experience: ${booking.name} (${booking.details}) with Roman Luxury Aviation & Hotels! Invoice ID: ${booking.id}`;
    navigator.clipboard.writeText(text);
    alert("Invoice share link copied to clipboard!");
  };

  const basePrice = Number(booking.price) / 1.18; // approx pre-tax base
  const gstTax = Number(booking.price) - basePrice;

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      
      {/* Hero Success Banner */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-6 pb-16 px-4 md:px-8 text-white relative shadow-lg print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <BookingProgressTracker currentStep={5} />

          <div className="h-14 w-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl mt-4 mb-2 animate-bounce">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <span className="font-space text-xs font-bold text-amber-400 uppercase tracking-widest">
            {booking.type === "boat" ? "CHARTER CONFIRMED & ISSUED" : "BOOKING CONFIRMED & ISSUED"}
          </span>
          <h1 className="font-space text-3xl md:text-4xl font-bold tracking-tight text-white mt-1">
            {booking.type === "boat" ? "Your Charter is Confirmed!" : "Your Reservation is Complete!"}
          </h1>
          <p className="text-xs text-slate-300 max-w-md mt-1 font-sans">
            {booking.type === "boat"
              ? "Your official charter certificate and boarding confirmation have been sent to your email."
              : "Your official PDF invoice and boarding pass have been generated and dispatched to your email."
            }
          </p>
        </div>
      </div>

      {/* Main Professional Printable Invoice Card */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-8 relative z-20 print:m-0 print:p-0 print:max-w-none">
        
        {/* Printable Tax Invoice Container */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-2xl text-slate-800 flex flex-col gap-8 print:shadow-none print:border-none print:rounded-none">
          
          {/* Invoice Top Header */}
          <div className="flex flex-wrap justify-between items-start border-b border-slate-200 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 bg-[#051433] text-amber-400 font-space font-bold text-lg rounded-xl flex items-center justify-center shadow-md">
                  R
                </div>
                <div>
                  <span className="font-space text-base font-bold text-[#051433] uppercase tracking-wider block">
                    ROMAN LUXURY HOTELS &amp; AVIATION
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans block">
                    DGCA Authorized Air Charter &amp; Luxury Tourism Ops | GSTIN: 05AAACR8890C1Z2
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-space text-xs font-bold uppercase tracking-wider mb-1">
                ✔ {booking.status || "CONFIRMED & PAID"}
              </span>
              <div className="font-space text-xs text-slate-500 font-bold">
                INVOICE #: <span className="text-slate-900 font-mono">{booking.id}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                Issue Date: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Passenger Manifest & Delivery Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex flex-col gap-1">
              <span className="font-space text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                ISSUED TO (LEAD PASSENGER / GUEST)
              </span>
              <span className="font-space text-sm font-bold text-slate-900">
                {booking.user_email || "VIP Guest"}
              </span>
              <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
                {booking.contact_email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {booking.contact_email}
                  </span>
                )}
                {booking.contact_phone && (
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    +91 {booking.contact_phone}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1 md:text-right">
              <span className="font-space text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                PAYMENT DETAILS
              </span>
              <span className="text-xs text-slate-700 font-medium">
                Payment Provider: <strong className="text-slate-900 uppercase">Razorpay / Stripe Secure</strong>
              </span>
              <span className="text-xs text-slate-700 font-medium">
                Transaction Status: <strong className="text-emerald-700 uppercase">SUCCESS (256-Bit SSL Encrypted)</strong>
              </span>
            </div>
          </div>

          {/* Reserved Service Itinerary Card */}
          <div className="flex flex-col gap-3">
            <h3 className="font-space text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              RESERVED SERVICE ITINERARY
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#051433] text-white p-5 rounded-2xl shadow-md">
              <div className="md:col-span-8 flex flex-col gap-1">
                <span className="text-[10px] font-space text-amber-400 font-bold uppercase tracking-widest">
                  {booking.type} Service
                </span>
                <h4 className="font-space text-lg font-bold text-white">{booking.name}</h4>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  {booking.details || "Luxury Service Corridor"}
                </p>
              </div>

              <div className="md:col-span-4 flex flex-col md:items-end gap-1 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
                <span className="text-[10px] text-slate-400 font-space uppercase">Travel Date</span>
                <span className="font-space font-bold text-amber-400 text-sm">{booking.date}</span>
                <span className="text-xs text-slate-300 font-sans mt-0.5">{booking.passengers} Guest(s)</span>
              </div>
            </div>
          </div>

          {/* Passenger Roster & Assigned Cabin Seats */}
          {booking.passenger_manifest && booking.passenger_manifest.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="font-space text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                PASSENGER MANIFEST &amp; SEATING ROSTER
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-space text-[10px] uppercase">
                      <th className="p-3 rounded-l-lg">#</th>
                      <th className="p-3">Passenger Full Name</th>
                      <th className="p-3">Age / Gender</th>
                      <th className="p-3">Govt ID Proof Number</th>
                      <th className="p-3 rounded-r-lg text-right">Allocated Seat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {booking.passenger_manifest.map((p: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 font-medium text-slate-800">
                        <td className="p-3 text-slate-400 font-mono">0{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900">{p.fullName || `VIP Guest #${idx + 1}`}</td>
                        <td className="p-3 text-slate-600">{p.age ? `${p.age} Yrs` : "Adult"} / {p.gender || "Male"}</td>
                        <td className="p-3 font-mono text-slate-600">{p.idProof || "VERIFIED-ID"}</td>
                        <td className="p-3 text-right font-mono font-bold text-[#051433]">
                          {booking.selected_seats?.[idx] || `Seat ${idx + 1}A`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Financial Invoice Breakdown Table */}
          <div className="flex flex-col gap-3">
            <h3 className="font-space text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              ITEMIZED FINANCIAL CHARGES (INR)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-space text-[10px] uppercase">
                    <th className="p-3 rounded-l-lg">Description</th>
                    <th className="p-3 text-center">Qty / Manifest</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 rounded-r-lg text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">{booking.name} (Base Fare)</td>
                    <td className="p-3 text-center">{booking.passengers} Guest(s)</td>
                    <td className="p-3 text-right font-mono">₹{Math.round(basePrice).toLocaleString("en-IN")}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">₹{Math.round(basePrice).toLocaleString("en-IN")}</td>
                  </tr>

                  {booking.addons && booking.addons.length > 0 && booking.addons.map((ao: any) => (
                    <tr key={ao.id}>
                      <td className="p-3 text-slate-700">• {ao.name} ({ao.description})</td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-right font-mono">₹{Number(ao.price).toLocaleString("en-IN")}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">₹{Number(ao.price).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}

                  <tr>
                    <td className="p-3 text-slate-600">
                      {booking.type === "boat" ? "Marine Service Tax (CGST 2.5% + SGST 2.5%)" : "Aviation GST Tax (CGST 9% + SGST 9%)"}
                    </td>
                    <td className="p-3 text-center">{booking.type === "boat" ? "5%" : "18%"}</td>
                    <td className="p-3 text-right font-mono">-</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">₹{Math.round(gstTax).toLocaleString("en-IN")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Highlight */}
            <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border border-slate-200 mt-2">
              <div>
                <span className="font-space text-xs font-bold uppercase text-slate-900 block">TOTAL GRAND PAID AMOUNT</span>
                <span className="text-[10px] text-slate-500 font-sans">Includes 18% Aviation Taxes and Passenger Insurance</span>
              </div>
              <span className="font-space text-2xl md:text-3xl font-bold text-[#051433]">
                ₹{Number(booking.price).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Security & Terminal Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 font-sans">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                {booking.type === "boat"
                  ? "Certified Marine Charter Operators. Present this official invoice for boarding at the marina."
                  : "DGCA Authorized Operations. Present this official invoice for boarding terminal entry."
                }
              </span>
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              STAMP: ROMAN-LUXURY-OFFICIAL-VERIFIED
            </div>
          </div>

        </div>

        {/* Floating Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center items-center mt-8 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-3 bg-[#051433] hover:bg-[#092254] text-white rounded-xl font-space text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            Print / Save PDF Invoice
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="px-6 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl font-space text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            Share Invoice Link
          </button>

          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black rounded-xl font-space text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            Go to My Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="font-space text-[#051433] text-sm tracking-wider animate-pulse">
            Configuring official invoice confirmation...
          </span>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
