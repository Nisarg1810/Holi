"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BookingProgressTracker from "@/components/booking/BookingProgressTracker";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ShieldCheck, Compass, CreditCard, Laptop, RefreshCw, XCircle, CheckCircle2, Lock, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "@/utils/api";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentPage() {
  const router = useRouter();
  const { item, passengers, selectedSeats, selectedAddOns, insuranceEnabled, appliedPromo, clearCart } = useCartStore();
  const { addBooking, user } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "stripe" | "phonepe">("razorpay");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failure">("idle");

  const calculateTotal = () => {
    if (!item) return 0;
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
      discount = subtotal * (appliedPromo.discountPercent / 100);
    }
    
    const taxes = (subtotal - discount) * 0.18;
    return subtotal - discount + taxes;
  };

  const finalAmount = calculateTotal();

  const handlePayment = async () => {
    if (!item) return;
    setPaymentStatus("processing");

    const bookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    const userEmail = passengers[0]?.email || user?.email || "guest@aura.com";
    const userPhone = passengers[0]?.phone || "";

    try {
      // 1. Create Booking record in PostgreSQL
      await API.post("/bookings", {
        id: bookingId,
        user_email: userEmail,
        contact_email: userEmail,
        contact_phone: userPhone,
        type: item.type,
        name: item.name,
        details: item.details,
        date: item.date,
        return_date: item.return_date || "",
        trip_type: item.trip_type || "One Way",
        passengers: item.passengers,
        adults: item.adults || 1,
        children: item.children || 0,
        infants: item.infants || 0,
        legs: item.legs || [],
        selected_seats: selectedSeats,
        passenger_manifest: passengers,
        addons: selectedAddOns,
        price: finalAmount,
        fare_type: item.fare_type || "Regular",
        gst_number: item.gst_number || "",
      });

      // 2. Initialize Payment Order
      const orderRes = await API.post("/payments/create", {
        provider: paymentMethod,
        amount: finalAmount,
        bookingId: bookingId,
        userEmail: userEmail,
      });

      const orderData = orderRes.data;

      if (paymentMethod === "razorpay") {
        const loaded = await loadRazorpay();
        if (!loaded) {
          setPaymentStatus("failure");
          alert("Razorpay payment gateway script failed to load.");
          return;
        }

        const options = {
          key: "rzp_test_AuraAviationKey",
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Roman Aviation & Tourism",
          description: `Booking Reservation #${bookingId}`,
          order_id: orderData.mock ? undefined : orderData.id,
          handler: async function (response: any) {
            const verifyRes = await API.post("/payments/verify", {
              provider: "razorpay",
              paymentId: response.razorpay_payment_id || orderData.id,
              signature: response.razorpay_signature || "mock_sig",
              bookingId: bookingId,
            });

            if (verifyRes.data.verified) {
              setPaymentStatus("success");
              addBooking({
                id: bookingId,
                type: item.type,
                name: item.name,
                details: item.details,
                date: item.date,
                passengers: item.passengers,
                price: finalAmount,
                status: "Confirmed",
                fare_type: item.fare_type || "Regular",
                gst_number: item.gst_number || "",
              });
              setTimeout(() => {
                clearCart();
                router.push(`/success?id=${bookingId}`);
              }, 1500);
            } else {
              setPaymentStatus("failure");
            }
          },
          prefill: {
            name: passengers[0]?.fullName || user?.name || "VIP Guest",
            email: userEmail,
            contact: userPhone,
          },
          theme: {
            color: "#051433"
          },
          modal: {
            ondismiss: function () {
              setPaymentStatus("idle");
            }
          }
        };

        if (orderData.mock) {
          setTimeout(() => {
            options.handler({ razorpay_payment_id: orderData.id });
          }, 1500);
        } else {
          const paymentObject = new (window as any).Razorpay(options);
          paymentObject.open();
        }
      } else {
        setTimeout(async () => {
          const verifyRes = await API.post("/payments/verify", {
            provider: paymentMethod,
            paymentId: orderData.id,
            signature: "mock_success",
            bookingId: bookingId,
          });

          if (verifyRes.data.verified) {
            setPaymentStatus("success");
            addBooking({
              id: bookingId,
              type: item.type,
              name: item.name,
              details: item.details,
              date: item.date,
              passengers: item.passengers,
              price: finalAmount,
              status: "Confirmed",
              fare_type: item.fare_type || "Regular",
              gst_number: item.gst_number || "",
            });
            setTimeout(() => {
              clearCart();
              router.push(`/success?id=${bookingId}`);
            }, 1500);
          } else {
            setPaymentStatus("failure");
          }
        }, 1800);
      }
    } catch (e) {
      setPaymentStatus("failure");
      console.error("Payment Gateway Error:", e);
    }
  };

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col gap-4 items-center justify-center min-h-[60vh] bg-[#F2F5F8] text-slate-800">
        <h2 className="font-space text-2xl font-bold">Session expired or empty reservation details.</h2>
        <button onClick={() => router.push("/")} className="px-6 py-3 bg-[#051433] text-white rounded-xl font-space text-xs font-bold uppercase">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F5F8] text-slate-800 pb-20">
      
      {/* MakeMyTrip Style Hero Header */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-6 pb-16 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-7xl mx-auto">
          <BookingProgressTracker currentStep={4} />
          <h1 className="font-space text-3xl font-bold tracking-tight text-white mt-4 flex items-center gap-2">
            <Lock className="h-7 w-7 text-amber-400" />
            256-Bit SSL Secure Payment Gateway
          </h1>
          <p className="text-xs text-slate-300 mt-1 font-sans">
            Select your preferred payment method to authorize and instantly issue your booking ticket
          </p>
        </div>
      </div>

      {/* Main Payment Layout */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        {paymentStatus === "idle" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Payment Method Selector - Left */}
            <div className="md:col-span-7 flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800 flex flex-col gap-4">
                <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#051433]" />
                  Select Payment Method
                </h3>

                <div className="flex flex-col gap-3">
                  {/* Razorpay SmartPay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                      paymentMethod === "razorpay"
                        ? "bg-slate-50 border-[#051433] shadow-md ring-2 ring-[#051433]/20"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${paymentMethod === "razorpay" ? "bg-[#051433] text-white" : "bg-slate-100 text-slate-600"}`}>
                        <Compass className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-space font-bold text-slate-900 text-sm block">Razorpay SmartPay</span>
                        <span className="text-[11px] text-slate-500 font-sans">UPI, NetBanking, Credit/Debit &amp; QR Code</span>
                      </div>
                    </div>
                    {paymentMethod === "razorpay" && <Check className="h-5 w-5 text-emerald-600 font-bold" />}
                  </button>

                  {/* Stripe */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                      paymentMethod === "stripe"
                        ? "bg-slate-50 border-[#051433] shadow-md ring-2 ring-[#051433]/20"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${paymentMethod === "stripe" ? "bg-[#051433] text-white" : "bg-slate-100 text-slate-600"}`}>
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-space font-bold text-slate-900 text-sm block">Stripe Express</span>
                        <span className="text-[11px] text-slate-500 font-sans">International Cards, Apple Pay &amp; Google Pay</span>
                      </div>
                    </div>
                    {paymentMethod === "stripe" && <Check className="h-5 w-5 text-emerald-600 font-bold" />}
                  </button>

                  {/* PhonePe */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("phonepe")}
                    className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                      paymentMethod === "phonepe"
                        ? "bg-slate-50 border-[#051433] shadow-md ring-2 ring-[#051433]/20"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${paymentMethod === "phonepe" ? "bg-[#051433] text-white" : "bg-slate-100 text-slate-600"}`}>
                        <Laptop className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-space font-bold text-slate-900 text-sm block">PhonePe UPI</span>
                        <span className="text-[11px] text-slate-500 font-sans">Instant Mobile App Pay &amp; BHIM UPI</span>
                      </div>
                    </div>
                    {paymentMethod === "phonepe" && <Check className="h-5 w-5 text-emerald-600 font-bold" />}
                  </button>
                </div>

                {/* Bank Security Guarantee */}
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 font-sans mt-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <p>
                    All payment credentials are protected under 256-bit SSL encryption. Card CVV or banking credentials are never cached.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePayment}
                  className="w-full py-4 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] hover:to-[#C57A2D] text-black font-space font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>AUTHORIZE &amp; PAY NOW (₹{finalAmount.toLocaleString("en-IN")})</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Summary Invoice - Right */}
            <div className="md:col-span-5">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-slate-800 flex flex-col gap-4">
                <h3 className="font-space text-sm uppercase font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Booking Summary</span>
                  <span className="text-[10px] bg-[#051433] text-white px-2 py-0.5 rounded font-mono uppercase">{item.type}</span>
                </h3>

                {/* Thumbnail Image */}
                {item.image && (
                  <div className="h-32 relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Service Details */}
                <div className="flex flex-col gap-2 text-xs font-sans text-slate-600">
                  <h4 className="font-space text-sm font-bold text-slate-900">{item.name}</h4>
                  
                  {item.details && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700">
                      📍 {item.details}
                    </div>
                  )}

                  <div className="flex justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-400 font-medium">Travel Date:</span>
                    <span className="font-bold text-slate-900">{item.date}</span>
                  </div>

                  {item.return_date && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Return Date:</span>
                      <span className="font-bold text-slate-900">{item.return_date}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Passengers:</span>
                    <span className="font-bold text-slate-900">{item.passengers} Guest(s)</span>
                  </div>

                  {/* Passenger Manifest Names */}
                  {passengers.length > 0 && passengers[0].fullName && (
                    <div className="flex flex-col gap-1 border-t border-slate-100 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Passenger Roster</span>
                      {passengers.map((p, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-slate-700">
                          <span>#{idx + 1} {p.fullName}</span>
                          <span className="text-slate-400">{p.age ? `${p.age} yrs` : ""}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Seats Allocated */}
                  {selectedSeats.length > 0 && (
                    <div className="flex justify-between border-t border-slate-100 pt-2">
                      <span className="text-slate-400 font-medium">Allocated Seats:</span>
                      <span className="font-bold text-slate-900 font-mono">{selectedSeats.join(", ")}</span>
                    </div>
                  )}

                  {/* Add-ons List */}
                  {selectedAddOns.length > 0 && (
                    <div className="flex flex-col gap-1 border-t border-slate-100 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">VIP Add-ons</span>
                      {selectedAddOns.map((ao) => (
                        <div key={ao.id} className="flex justify-between text-[11px] text-slate-700">
                          <span>• {ao.name}</span>
                          <span className="font-bold text-slate-900">+₹{ao.price.toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delivery Contacts */}
                  {(passengers[0]?.email || passengers[0]?.phone) && (
                    <div className="flex flex-col gap-1 border-t border-slate-100 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Ticket Delivery Info</span>
                      {passengers[0]?.email && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Email:</span>
                          <span className="font-bold text-slate-900 truncate max-w-[170px]">{passengers[0].email}</span>
                        </div>
                      )}
                      {passengers[0]?.phone && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Mobile:</span>
                          <span className="font-bold text-slate-900">+91 {passengers[0].phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Final Price Breakdown */}
                <div className="border-t border-slate-200 pt-3 flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Base Fare</span>
                    <span>₹{Number(item.price).toLocaleString("en-IN")}</span>
                  </div>
                  {item.fare_type && item.fare_type !== "Regular" && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>{item.fare_type} Discount</span>
                      <span>-₹{(Number(item.price) * (item.fare_type === "Student" ? 0.10 : item.fare_type === "Armed Forces" ? 0.15 : item.fare_type === "Senior Citizen" ? 0.12 : item.fare_type === "Doctor & Nurses" ? 0.10 : 0)).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {item.gst_number && (
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>GSTIN</span>
                      <span className="font-mono text-[11px]">{item.gst_number}</span>
                    </div>
                  )}
                  {selectedAddOns.length > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Add-ons Subtotal</span>
                      <span>+₹{selectedAddOns.reduce((acc, curr) => acc + curr.price, 0).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {insuranceEnabled && (
                    <div className="flex justify-between text-slate-500">
                      <span>VIP Flight Insurance</span>
                      <span>+₹{(5000 * item.passengers).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-₹{((Number(item.price) + selectedAddOns.reduce((a, c) => a + c.price, 0)) * (appliedPromo.discountPercent / 100)).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>GST Tax (18%)</span>
                    <span>₹{((Number(item.price) + selectedAddOns.reduce((a, c) => a + c.price, 0)) * 0.18).toLocaleString("en-IN")}</span>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-3 mt-1 flex justify-between items-end">
                    <span className="font-space text-xs font-bold uppercase text-slate-900">Total Payable</span>
                    <span className="font-space text-2xl font-bold text-slate-900">
                      ₹{finalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Processing State Animation */}
        {paymentStatus === "processing" && (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center gap-4 text-slate-800">
            <RefreshCw className="h-10 w-10 text-[#051433] animate-spin" />
            <h3 className="font-space text-xl font-bold text-slate-900">Authorizing Booking Payment...</h3>
            <p className="text-xs text-slate-500 font-sans max-w-sm">
              Connecting to secure banking gateway server. Please do not close or refresh this page.
            </p>
          </div>
        )}

        {/* Success State */}
        {paymentStatus === "success" && (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center gap-4 text-slate-800">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-bounce" />
            <h3 className="font-space text-2xl font-bold text-slate-900">Payment Authorized &amp; Confirmed!</h3>
            <p className="text-xs text-slate-500 font-sans">
              Generating your flight ticket &amp; boarding pass. Redirecting to receipt workspace...
            </p>
          </div>
        )}

        {/* Failure Retry Workspace */}
        {paymentStatus === "failure" && (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center gap-4 text-slate-800">
            <XCircle className="h-12 w-12 text-red-500" />
            <h3 className="font-space text-xl font-bold text-slate-900">Payment Authorization Declined</h3>
            <p className="text-xs text-slate-500 font-sans max-w-sm">
              The banking gateway rejected the payment handshake. Please try another card or UPI option.
            </p>
            <button
              type="button"
              onClick={() => setPaymentStatus("idle")}
              className="mt-2 px-6 py-2.5 bg-[#051433] text-white rounded-xl font-space text-xs font-bold uppercase"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
