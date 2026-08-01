"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";
import { 
  Heart, 
  Trash2, 
  MapPin, 
  Star, 
  ArrowRight, 
  Helicopter, 
  Hotel, 
  Ship, 
  Compass, 
  ShoppingBag 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "Helicopter", "Tour Package", "Hotel", "Boat Charter"];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "ALL") return true;
    return (item.category || "").toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const getCategoryIcon = (cat: string) => {
    const c = (cat || "").toLowerCase();
    if (c.includes("helicopter")) return Helicopter;
    if (c.includes("hotel")) return Hotel;
    if (c.includes("boat") || c.includes("yacht")) return Ship;
    return Compass;
  };

  return (
    <div className="min-h-screen bg-[#020B1E] text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gold mb-2">
              <Heart className="h-4 w-4 fill-gold text-gold" /> Saved Favorites
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white">
              My Wishlist <span className="text-gold font-sans text-xl">({items.length})</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 font-sans">
              Saved helicopter flights, luxury staycations, holiday packages and yacht charters
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear your entire wishlist?")) {
                  clearWishlist();
                }
              }}
              className="px-4 py-2 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-space text-xs font-bold uppercase tracking-wider rounded-xl transition-all self-start md:self-auto flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Wishlist</span>
            </button>
          )}
        </div>

        {/* Category Filters */}
        {items.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-space text-[10px] uppercase font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gold text-black shadow-md"
                    : "bg-[#051433] text-slate-400 border border-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Wishlist Items Grid */}
        {items.length === 0 ? (
          <div className="py-20 text-center bg-[#051433]/40 rounded-2xl border border-white/10 p-8 max-w-lg mx-auto">
            <div className="h-16 w-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mx-auto mb-4">
              <Heart className="h-8 w-8 text-gold" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white mb-2">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-400 font-sans mb-6 leading-relaxed">
              Explore our luxury helicopter charters, curated tour packages, hotels, and boat rides, and click the heart icon to save them here!
            </p>
            <Link
              href="/booking"
              className="px-6 py-3 bg-gold hover:bg-[#E3C69D] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2"
            >
              <span>Discover Experiences</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-space uppercase tracking-wider">
            No saved items in "{selectedCategory}" category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.map((item) => {
                const CategoryIcon = getCategoryIcon(item.category);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#051433] rounded-2xl border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-gold/30 transition-all"
                  >
                    {/* Image Container */}
                    <div className="h-48 relative overflow-hidden bg-slate-900">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                          <CategoryIcon className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#051433] via-transparent to-transparent z-10" />

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-black/90 transition-all z-20 cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gold/90 text-black font-space text-[9px] uppercase font-bold tracking-wider z-20 flex items-center gap-1 shadow-md">
                        <CategoryIcon className="h-3 w-3" />
                        <span>{item.category}</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        {item.location && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-sans mb-1">
                            <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}

                        <h3 className="font-space text-base font-bold text-white mb-2 line-clamp-1">
                          {item.name}
                        </h3>

                        {item.rating && (
                          <div className="flex items-center gap-1 text-gold text-xs font-bold mb-4">
                            <Star className="h-3.5 w-3.5 fill-gold" />
                            <span>{item.rating} / 5</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-white/10 pt-4 mt-2 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 font-sans block uppercase">Starting Fare</span>
                          <span className="font-space text-lg font-bold text-gold">
                            {typeof item.price === "number" ? `₹${item.price.toLocaleString()}` : item.price}
                          </span>
                        </div>

                        <Link
                          href={item.href}
                          className="px-4 py-2 bg-gradient-to-r from-[#F5A623] to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Book Now</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
