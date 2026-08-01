"use client";

import React, { useState, useEffect } from "react";
import API from "@/utils/api";
import {
  Ship, Plus, Trash2, Edit2, CheckCircle, AlertCircle, RefreshCw,
  MapPin, Users, Star, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BoatItem {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
  image: string;
  location: string;
  description: string;
  features: string[];
  schedules: string[];
  reviews: any[];
}

const CHARTER_TYPES = [
  "Motor Yacht", "Luxury Houseboat", "Executive Catamaran",
  "Speedboat", "Premium Schooner", "Traditional Shikara", "Motor Cruiser"
];

export default function AdminBoats() {
  const [boats, setBoats] = useState<BoatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [createdStatus, setCreatedStatus] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newBoat, setNewBoat] = useState({
    id: "",
    name: "",
    type: "",
    location: "",
    capacity: 8,
    price: 45000,
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop",
    featuresInput: "",
    schedulesInput: "09:00 AM, 02:00 PM, 05:30 PM (Sunset)",
    description: ""
  });

  const fetchBoats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/boats");
      setBoats(res.data || []);
    } catch (err: any) {
      setError("Failed to query boats database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBoats(); }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoat.name || !newBoat.type) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const payload = {
        id: newBoat.id || `b-${Date.now()}`,
        name: newBoat.name,
        type: newBoat.type,
        location: newBoat.location,
        capacity: Number(newBoat.capacity),
        price: Number(newBoat.price),
        image: newBoat.image,
        features: newBoat.featuresInput.split(",").map((f) => f.trim()).filter(Boolean),
        schedules: newBoat.schedulesInput.split(",").map((f) => f.trim()),
        description: newBoat.description,
        reviews: [],
      };

      await API.post("/boats", payload);
      setCreatedStatus(true);
      await fetchBoats();

      setNewBoat({
        id: "", name: "", type: "", location: "", capacity: 8, price: 45000,
        image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop",
        featuresInput: "", schedulesInput: "09:00 AM, 02:00 PM, 05:30 PM (Sunset)", description: ""
      });

      setTimeout(() => { setCreatedStatus(false); setShowAddForm(false); }, 2500);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create vessel.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Remove vessel ${id} from the live fleet database?`)) {
      try {
        await API.delete(`/boats/${id}`);
        fetchBoats();
      } catch (err) {
        console.error("Failed to delete boat:", err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-space text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Ship className="h-5 w-5 text-amber-400" />
            Yacht & Marine Fleet Manager
          </h2>
          <p className="font-luxury text-[11px] text-grey-text mt-0.5">
            Add, configure and manage all vessel records — live on the customer listing page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchBoats}
            className="py-2 px-3 rounded border border-white/10 bg-white/2 hover:bg-white/5 font-space text-[10px] font-bold text-grey-text transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-widest">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-space text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Vessel
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 font-luxury text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {createdStatus && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 font-space text-xs text-emerald-400 font-bold">
          <Check className="h-4 w-4 shrink-0" />
          ✅ New vessel saved to database! Now visible on the live /boats listing page.
        </motion.div>
      )}

      {/* Add Vessel Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-xl border border-amber-400/20 p-6 flex flex-col gap-5 overflow-hidden"
          >
            <h3 className="font-space text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
              <Ship className="h-4 w-4" /> Register New Marine Vessel
            </h3>

            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">Vessel Name *</label>
                <input required value={newBoat.name} onChange={(e) => setNewBoat({ ...newBoat, name: e.target.value })}
                  placeholder="e.g. Royal Goa Sunset Catamaran"
                  className="bg-[#030712] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-bold focus:border-amber-400/50 outline-none placeholder-grey-text/40" />
              </div>

              {/* Type */}
              <div className="flex flex-col gap-1.5">
                <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">Charter Type *</label>
                <select required value={newBoat.type} onChange={(e) => setNewBoat({ ...newBoat, type: e.target.value })}
                  className="bg-[#030712] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-bold focus:border-amber-400/50 outline-none cursor-pointer">
                  <option value="" disabled className="bg-[#030712]">Select charter type</option>
                  {CHARTER_TYPES.map((t) => <option key={t} value={t} className="bg-[#030712]">{t}</option>)}
                </select>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">Location / Marina *</label>
                <input required value={newBoat.location} onChange={(e) => setNewBoat({ ...newBoat, location: e.target.value })}
                  placeholder="e.g. Goa Harbor, Panaji, Goa"
                  className="bg-[#030712] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-bold focus:border-amber-400/50 outline-none placeholder-grey-text/40" />
              </div>

              {/* Capacity */}
              <div className="flex flex-col gap-1.5">
                <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">Guest Capacity *</label>
                <input required type="number" min="1" value={newBoat.capacity}
                  onChange={(e) => setNewBoat({ ...newBoat, capacity: Number(e.target.value) })}
                  className="bg-[#030712] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-bold focus:border-amber-400/50 outline-none" />
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">Hourly Rate (₹) *</label>
                <input required type="number" min="0" value={newBoat.price}
                  onChange={(e) => setNewBoat({ ...newBoat, price: Number(e.target.value) })}
                  className="bg-[#030712] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-bold focus:border-amber-400/50 outline-none" />
              </div>

              {/* Image URL */}
              <div className="flex flex-col gap-1.5">
                <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">Image URL</label>
                <input value={newBoat.image} onChange={(e) => setNewBoat({ ...newBoat, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-[#030712] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-bold focus:border-amber-400/50 outline-none placeholder-grey-text/40" />
              </div>

              {/* Features */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">Features (comma-separated)</label>
                <input value={newBoat.featuresInput} onChange={(e) => setNewBoat({ ...newBoat, featuresInput: e.target.value })}
                  placeholder="e.g. Private Captain, Snorkeling Gear, Onboard BBQ, Sound System"
                  className="bg-[#030712] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-bold focus:border-amber-400/50 outline-none placeholder-grey-text/40" />
              </div>

              {/* Schedules */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">Departure Slots (comma-separated)</label>
                <input value={newBoat.schedulesInput} onChange={(e) => setNewBoat({ ...newBoat, schedulesInput: e.target.value })}
                  className="bg-[#030712] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-bold focus:border-amber-400/50 outline-none" />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-space text-[9px] uppercase tracking-widest text-grey-text">Description</label>
                <textarea rows={3} value={newBoat.description} onChange={(e) => setNewBoat({ ...newBoat, description: e.target.value })}
                  placeholder="Describe the vessel experience, amenities, and unique features..."
                  className="bg-[#030712] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-bold focus:border-amber-400/50 outline-none resize-none placeholder-grey-text/40" />
              </div>

              {/* Submit */}
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 py-2.5 px-6 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-space text-[10px] font-bold uppercase tracking-widest rounded-xl cursor-pointer transition-all">
                  {saving ? "Saving to Database..." : <><Plus className="h-4 w-4" /> Save Vessel to Database</>}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)}
                  className="py-2.5 px-5 border border-white/10 bg-white/2 hover:bg-white/5 text-grey-text font-space text-[10px] font-bold uppercase tracking-widest rounded-xl cursor-pointer transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-xs text-grey-text font-luxury">
          <RefreshCw className="h-5 w-5 animate-spin text-amber-400 mx-auto mb-2" />
          Loading marine fleet from database...
        </div>
      )}

      {/* Fleet Count */}
      {!loading && (
        <p className="text-[10px] text-grey-text font-space">
          <span className="text-amber-400 font-bold">{boats.length}</span> vessel{boats.length !== 1 ? "s" : ""} in live fleet registry
        </p>
      )}

      {/* Boats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {boats.map((boat) => (
          <div key={boat.id} className="glass-card rounded-xl border border-white/8 overflow-hidden flex flex-col justify-between hover:border-amber-400/20 transition-all">
            {/* Image */}
            <div className="h-44 w-full relative overflow-hidden">
              <img src={boat.image} alt={boat.name} className="w-full h-full object-cover opacity-85" />
              <span className="absolute top-3 left-3 bg-[#030712]/80 border border-white/10 px-2.5 py-0.5 rounded font-mono font-bold text-[9px] text-amber-400 uppercase">
                {boat.id}
              </span>
              <span className="absolute top-3 right-3 bg-[#030712]/80 border border-white/10 px-2.5 py-0.5 rounded font-mono font-bold text-[9px] text-white uppercase">
                {boat.type}
              </span>
            </div>

            <div className="p-5 flex flex-col gap-3">
              {/* Name & Location */}
              <div>
                <h3 className="font-space text-base font-bold text-white leading-tight">{boat.name}</h3>
                {boat.location && (
                  <span className="flex items-center gap-1 font-luxury text-[10px] text-grey-text mt-1">
                    <MapPin className="h-3 w-3 text-amber-400" /> {boat.location}
                  </span>
                )}
              </div>

              {/* Capacity & Features */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-[10px] text-grey-text bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-space">
                  <Users className="h-3 w-3" /> Up to {boat.capacity} guests
                </span>
                {Array.isArray(boat.features) && boat.features.slice(0, 2).map((f, i) => (
                  <span key={i} className="text-[9px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 px-2 py-0.5 rounded-full font-space">
                    ✓ {f}
                  </span>
                ))}
              </div>

              {/* Schedules */}
              {Array.isArray(boat.schedules) && boat.schedules.length > 0 && (
                <div className="flex flex-wrap gap-1 font-space text-[9px]">
                  {boat.schedules.slice(0, 3).map((time: string, i: number) => (
                    <span key={i} className="bg-white/2 border border-white/5 text-grey-text px-2 py-0.5 rounded">
                      {time}
                    </span>
                  ))}
                </div>
              )}

              {/* Price & Actions */}
              <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                <div>
                  <span className="text-[8px] uppercase text-grey-text block">Hourly Rate</span>
                  <span className="font-space font-bold text-amber-400 text-sm">
                    ₹{Number(boat.price).toLocaleString("en-IN")}/hr
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(boat.id)}
                    className="p-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded cursor-pointer transition-all"
                    title="Remove vessel"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && boats.length === 0 && (
        <div className="glass-card rounded-xl border border-white/8 p-16 text-center flex flex-col items-center gap-4">
          <Ship className="h-10 w-10 text-grey-text" />
          <span className="font-space text-sm font-bold text-white uppercase">No vessels in fleet database</span>
          <p className="text-xs text-grey-text font-luxury">Click "Add New Vessel" above to register your first marine charter.</p>
        </div>
      )}
    </div>
  );
}
