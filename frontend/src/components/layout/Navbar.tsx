"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { 
  Compass, Menu, X, User, ShoppingCart, Phone, ChevronDown,
  Helicopter, Building, Plane, Anchor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, user, logout } = useAuthStore();
  const { item } = useCartStore();

  const categories = [
    { id: "helicopter", name: "Helicopters", icon: Helicopter, href: "/booking" },
    { id: "hotel", name: "Hotels", icon: Building, href: "/hotels" },
    { id: "package", name: "Tours", icon: Compass, href: "/tours" },
    { id: "charter", name: "Charters", icon: Plane, href: "/charter" },
    { id: "boat", name: "Yachts", icon: Anchor, href: "/boats" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Guides", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#051433]/95 border-b border-white/10 py-2.5 shadow-lg backdrop-blur-md"
            : "bg-[#051433]/40 border-b border-white/5 py-4 shadow-sm backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <img 
              src="/logo.png" 
              alt="Roman Aviation & Tourism" 
              className="h-12 w-auto object-contain brightness-100 contrast-125" 
            />
          </Link>

          {/* Desktop Menu - MMT transitions */}
          <div className="hidden lg:flex items-center justify-center flex-grow mx-8">
            <AnimatePresence mode="wait">
              {scrolled ? (
                <motion.div
                  key="scrolled-tabs"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 divide-x divide-white/10 shadow-inner"
                >
                  {categories.map((cat) => {
                    const isActive = pathname === cat.href;
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.id}
                        href={cat.href}
                        className={`flex items-center gap-2.5 px-5 py-2 text-[10px] font-space font-bold uppercase tracking-widest transition-all cursor-pointer ${
                          isActive
                            ? "text-[#F5A623] bg-white/10 rounded-full"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#F5A623]" : "text-slate-400"}`} />
                        <span>{cat.name}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="top-links"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-6"
                >
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`font-space text-[10px] uppercase tracking-widest hover:text-gold transition-colors relative py-1 ${
                          isActive ? "text-gold font-bold" : "text-slate-300"
                        }`}
                      >
                        {link.name}
                        {isActive && (
                          <motion.div
                            layoutId="activeNavIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Dashboard / Login */}
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-slate-300 hover:text-gold transition-colors py-1.5 px-4 border border-gold/45 rounded-full bg-white/5 hover:bg-gold hover:text-black"
              >
                <User className="h-3.5 w-3.5 text-gold" />
                <span>{user?.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-slate-300 hover:text-white transition-colors py-2 px-5 border border-white/20 hover:border-gold rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <User className="h-3.5 w-3.5 text-gold" />
                <span>Login / Register</span>
              </Link>
            )}

            {/* Book Now Primary CTA Button */}
            <Link
              href="/booking"
              className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-black transition-colors py-2 px-5 border border-gold rounded-full bg-gold hover:bg-[#E3C69D] transition-all duration-300 font-bold shadow-lg shadow-gold/20"
            >
              <span>Book Now</span>
            </Link>
          </div>

          {/* Mobile Nav Triggers */}
          <div className="flex items-center gap-4 lg:hidden shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white hover:text-gold transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-45 pt-24 px-6 bg-[#020B1E] flex flex-col justify-between pb-12 lg:hidden"
          >
            <div>
              {/* Mobile Quick Category Switcher */}
              <div className="grid grid-cols-5 gap-1.5 border-b border-white/10 pb-5 mb-3 mt-4">
                {categories.map((cat) => {
                  const isActive = pathname === cat.href;
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.id}
                      href={cat.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                        isActive
                          ? "bg-white/10 border-gold/45 text-gold"
                          : "bg-white/2 border-white/5 text-slate-300"
                      }`}
                    >
                      <Icon className="h-5 w-5 mb-1 text-inherit" />
                      <span className="text-[8px] font-space font-bold uppercase tracking-wider text-center">{cat.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Standard Links */}
              <div className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`font-space text-base uppercase tracking-wider hover:text-gold transition-colors py-2 border-b border-white/5 flex justify-between items-center ${
                        isActive ? "text-gold" : "text-white"
                      }`}
                    >
                      <span>{link.name}</span>
                      <Compass className="h-4 w-4 text-gold/30" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              {isLoggedIn ? (
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mb-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-white"
                  >
                    <div className="h-10 w-10 rounded-full bg-white/5 border border-gold/30 flex items-center justify-center">
                      <User className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <div className="font-space text-sm font-semibold">{user?.name}</div>
                      <div className="font-luxury text-xs text-white/60">Go to Dashboard</div>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="text-xs text-red-400 border border-red-400/20 px-3 py-1 rounded bg-red-400/5 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded border border-white/10 hover:border-gold/30 text-white font-luxury text-sm tracking-wider bg-white/5 transition-all"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-4 rounded bg-gold text-black font-space tracking-widest font-semibold uppercase glow-gold text-sm"
              >
                Book Flight Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
