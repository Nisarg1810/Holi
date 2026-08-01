"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const footerLinks = {
    services: [
      { name: "Helicopter Booking", href: "/booking" },
      { name: "Tour Packages", href: "/tours" },
      { name: "Premium Hotels", href: "/hotels" },
      { name: "Boat & Yacht Charters", href: "/boats" },
    ],
    company: [
      { name: "Brand Philosophy", href: "/contact" },
      { name: "Travel Blog", href: "/blog" },
      { name: "Frequently Asked Questions", href: "/faq" },
      { name: "Contact & Support", href: "/contact" },
    ],
    legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Refund & Cancellations", href: "/refunds" },
      { name: "Safety Guidelines", href: "/safety" },
    ],
  };

  return (
    <footer className="bg-[#020B1E] border-t border-white/5 pt-20 pb-8 relative overflow-hidden z-10 text-white">
      {/* Background glow lines */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-gold/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-teal/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

        {/* Links lists */}
        <div className="flex flex-col gap-5">
          <span className="font-space text-sm tracking-wider text-white font-bold">Services</span>
          <div className="flex flex-col gap-3">
            {footerLinks.services.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-luxury text-sm text-slate-400 hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <span className="font-space text-sm tracking-wider text-white font-bold">Company</span>
          <div className="flex flex-col gap-3">
            {footerLinks.company.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-luxury text-sm text-slate-400 hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <span className="font-space text-sm tracking-wider text-white font-bold">Legal</span>
          <div className="flex flex-col gap-3">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-luxury text-sm text-slate-400 hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-10 flex flex-col items-center justify-center gap-6">
        <span className="text-sm font-space uppercase tracking-widest text-[#C5A880] font-bold">
          Connect With Us
        </span>
        <div className="flex items-center gap-8 text-white">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-white/5 hover:bg-gradient-to-tr hover:from-[#fdf497] hover:via-[#fd5949] hover:to-[#d6249f] border border-white/10 hover:border-transparent rounded-full text-slate-300 hover:text-white transition-all transform hover:-translate-y-1 hover:scale-110 shadow-lg hover:shadow-pink-500/20 flex items-center justify-center cursor-pointer"
            title="Instagram"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-white/5 hover:bg-[#FF0000]/15 border border-white/10 hover:border-[#FF0000]/40 rounded-full text-slate-300 hover:text-[#FF0000] transition-all transform hover:-translate-y-1 hover:scale-110 shadow-lg hover:shadow-[#FF0000]/10 flex items-center justify-center cursor-pointer"
            title="YouTube"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-white/5 hover:bg-[#0077b5]/15 border border-white/10 hover:border-[#0077b5]/40 rounded-full text-slate-300 hover:text-[#0077b5] transition-all transform hover:-translate-y-1 hover:scale-110 shadow-lg hover:shadow-[#0077b5]/10 flex items-center justify-center cursor-pointer"
            title="LinkedIn"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-full text-slate-300 hover:text-white transition-all transform hover:-translate-y-1 hover:scale-110 shadow-lg hover:shadow-white/5 flex items-center justify-center cursor-pointer"
            title="Twitter / X"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
