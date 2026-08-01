"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, User, Calendar, Search, Compass, Helicopter, ArrowRight, Sparkles, BookOpen, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Article {
  id: string;
  category: string;
  title: string;
  desc: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  content: string[];
}

const ARTICLES: Article[] = [
  {
    id: "fleet-review-2026",
    category: "Aviation",
    title: "Airbus H145 vs Bell 429: Luxury Helicopter Fleet Review",
    desc: "An in-depth performance, cabin space, and luxury comfort comparison of the two primary private charter helicopters operating in the Himalayas.",
    date: "August 01, 2026",
    author: "Capt. A. Singh (Retd. IAF)",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800&auto=format&fit=crop",
    content: [
      "When booking private high-altitude charter flights in Uttarakhand and Himachal Pradesh, selecting the appropriate aircraft is critical to both comfort and load margins. The Airbus H145 and the Bell 429 represent the pinnacle of twin-engine luxury helicopter aviation in India.",
      "The Airbus H145 is widely regarded as the ultimate multi-mission helicopter. Equipped with Airbus's signature Fenestron shrouded tail rotor, it offers an extremely quiet cabin experience, making in-flight conversations seamless. Its cabin boasts a spacious layout that comfortably seats up to 6 VIP passengers in club seating configuration.",
      "The Bell 429, on the other hand, excels in raw altitude speed and power-to-weight ratios. It features a wide, flat-floor cabin with exceptional legroom and oversized windows, offering panoramic views of the Himalayan peaks. It is a preferred model for swift VIP transport from Dehradun to Badrinath and Kedarnath.",
      "In summary, while the Airbus H145 offers unmatched cabin quietness and state-of-the-art rotor safety, the Bell 429 stands out for its high-cruising speed and spacious vertical clearance. Roman Aviation maintains fully inspected models of both helicopters in our Sahastradhara fleet to suit your group's preferences."
    ]
  },
  {
    id: "kedarnath-2026",
    category: "Travel Guides",
    title: "Kedarnath Helicopter Booking 2026 Guide",
    desc: "Understand official slot booking calendars, DGCA guidelines, baggage constraints, and flight schedules for the 2026 pilgrimage season.",
    date: "July 12, 2026",
    author: "Capt. A. Singh (Retd. IAF)",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
    content: [
      "Securing a helicopter slot for Kedarnath is one of the most crucial aspects of planning your Himalayan pilgrimage. For the 2026 season, the Directorate General of Civil Aviation (DGCA) and Uttarakhand Civil Aviation Development Authority (UCADA) have announced synchronized booking schedules aligned with the temple opening dates.",
      "Official slot calendars open in phases, starting 30 days prior to the opening of the shrine. It is mandatory for all pilgrims to register on the official Uttarakhand Tourist Care portal before attempting to book a helicopter ticket, as your unique registration key will be verified during the manifest logging.",
      "Safety takes absolute priority at high altitudes. All operations are conducted under strict visual flight rules (VFR). Luggage limits are non-negotiable at 10 kg per seat. It is strongly advised to carry soft duffel bags rather than hard trolleys, which cannot be accommodated in the helicopter cargo holds.",
      "Infants under 2 years travel free of charge if they do not occupy a seat and are lap-held (weight must be under 10 kg). Be prepared for weather delays, as cloud cover at the Phata, Sirsi, and Guptkashi helipads can result in sudden standby holds. We recommend keeping a buffer day in your itinerary."
    ]
  },
  {
    id: "chardham-cost",
    category: "Cost & Budget",
    title: "Char Dham Yatra Cost Breakdown",
    desc: "A detailed pricing and budget breakdown comparing VIP private helicopter charters with group flight shuttles and premium hotel stops.",
    date: "June 28, 2026",
    author: "Devi Shastry",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1562016600-ece13e8ba570?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Char Dham Yatra—encompassing Yamunotri, Gangotri, Kedarnath, and Badrinath—is a spiritual odyssey of a lifetime. Traveling via helicopter offers unparalleled convenience and comfort, bypassing days of grueling road travel. However, understanding the cost elements is vital for budgeting.",
      "A VIP private helicopter charter typically runs between ₹4,50,000 to ₹5,80,000 per package, depending on occupancy levels, aircraft model (such as the spacious twin-engine Airbus H145), and the quality of accommodations at each valley stop.",
      "The cost structure generally includes Dehradun Sahastradhara helipad departures, dynamic priority Darshan slots at Badrinath and Kedarnath, luxury mountain resort stays, custom high-altitude gourmet meals, and dedicated local guides.",
      "For solo travelers or couples, seat-only configurations on shared commercial shuttles start from ₹49,999 per temple. When calculating budgets, factor in a standard 18% GST on air passenger transits and optional upgrades such as custom Vedic pujas or private Audi SUV ground transits."
    ]
  },
  {
    id: "valley-flowers-2026",
    category: "Travel Guides",
    title: "Valley of Flowers: Aerial Staging Guidelines",
    desc: "How to plan your high-altitude landing coordinates, weather clearance windows, and trek connections from Govindghat.",
    date: "July 24, 2026",
    author: "Devi Shastry",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Valley of Flowers, a UNESCO World Heritage Site in Uttarakhand, is famous for its meadows of endemic alpine flowers and diverse flora. Reaching this remote valley via ground transport requires a long drive followed by a 13 km steep trek.",
      "Roman Aviation coordinates express helicopter transfers from Govindghat to Ghangaria, reducing travel time to a swift 4-minute flight over scenic alpine gorges. This allows pilgrims and leisure travelers to save energy for the final gentle walk into the national park core area.",
      "Operations start daily at 06:30 AM, taking advantage of the early morning wind stability. Ground crews verify all medical and safety passes at the Govindghat helipad. All passengers must check in their luggage to ensure strict helicopter take-off load safety profiles.",
      "Since weather clearance windows near Hemkund Sahib are narrow, we operate on high-frequency shuttle intervals during the blooming season (July to September). Ensure you coordinate with our dispatch desk to lock in your return ticket beforehand."
    ]
  },
  {
    id: "vaishnodevi-time",
    category: "Travel Tips",
    title: "Best Time to Visit Vaishno Devi by Helicopter",
    desc: "Understand peak seasons, weather coordinates, monsoon delay schedules, and how to book express Darshan passes in Katra.",
    date: "May 15, 2026",
    author: "Dr. Priya Nair",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=800&auto=format&fit=crop",
    content: [
      "Located in the Trikuta Mountains of Jammu & Kashmir, the holy shrine of Mata Vaishno Devi attracts millions of devotees annually. The helicopter ride from Katra base to Sanjichhat helipad reduces a steep 12 km trek into a scenic 8-minute flight.",
      "Choosing the right season for your flight is key. The ideal windows are March to June (spring-summer) and September to November (autumn). During these months, the weather coordinates are highly stable, maximizing flight safety and reducing air corridor standby holds.",
      "The monsoon season (July to August) is prone to sudden rainstorms and dense mountain fog, which often lead to operational delays or cancellations. If you book during these months, verify the operator's standby policies and ensure your tickets include automated refund processing.",
      "Helicopter tickets automatically grant you access to the priority VIP Darshan queue at the Bhawan. Always double-check slot timings and arrive at the Katra staging helipad at least 1 hour before departure for security profiling and physical weight checks."
    ]
  }
];

export default function BlogPage() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Aviation", "Travel Guides", "Cost & Budget", "Travel Tips"];

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory = activeCategory === "All" || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeArticle = ARTICLES.find((a) => a.id === selectedArticleId);

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 pb-20">
      
      {/* Blog Page Hero Header */}
      <div className="bg-gradient-to-b from-[#051433] via-[#092254] to-[#0D2D6C] pt-16 pb-24 px-4 md:px-8 text-white relative shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full mb-4">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-space text-[10px] uppercase font-bold text-amber-400 tracking-widest">
              Aviation &amp; Travel Blog
            </span>
          </div>
          
          <h1 className="font-space text-3xl md:text-5xl font-bold tracking-tight text-white uppercase">
            Travel Blog
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mt-3 font-sans leading-relaxed">
            This is an archive of our recent posts &amp; all our past aviation travel blog posts from valleys we cover around India. Start exploring!
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
        
        <AnimatePresence mode="wait">
          {!selectedArticleId ? (
            /* Blog Grid & Sidebar Layout */
            <motion.div 
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* Left Column: Articles List (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Category Filter Navigation */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-[11px] font-space font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeCategory === cat
                          ? "bg-[#051433] text-white shadow-md"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Article Feed Cards */}
                {filteredArticles.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {filteredArticles.map((article) => (
                      <div 
                        key={article.id}
                        className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 md:grid-cols-12 h-auto md:h-64 group"
                      >
                        {/* Image Cover */}
                        <div className="md:col-span-5 relative h-52 md:h-full overflow-hidden bg-slate-100">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3 bg-[#051433] text-amber-400 font-space text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                            {article.category}
                          </div>
                        </div>

                        {/* Text Metadata */}
                        <div className="md:col-span-7 p-6 flex flex-col justify-between text-left">
                          <div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-sans mb-2 font-semibold">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                              <span>• {article.date}</span>
                            </div>

                            <h3 className="font-space text-base font-bold text-slate-900 mb-2 group-hover:text-[#051433] transition-colors leading-snug">
                              {article.title}
                            </h3>
                            <p className="font-sans text-xs text-slate-500 leading-relaxed line-clamp-3">
                              {article.desc}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedArticleId(article.id)}
                            className="font-space text-xs text-[#051433] font-bold uppercase tracking-wider flex items-center gap-1 mt-4 transition-all group-hover:translate-x-1 cursor-pointer self-start"
                          >
                            <span>Read Article</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center flex flex-col items-center gap-4">
                    <BookOpen className="h-10 w-10 text-slate-300" />
                    <h3 className="font-space text-sm font-bold uppercase tracking-wider text-slate-700">No blog posts found</h3>
                    <p className="text-xs text-slate-400 max-w-sm">No articles match your search or selected category. Try selecting another filter tag.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar Widgets (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6 text-left">
                
                {/* Search Widget */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-3">
                  <h4 className="font-space text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                    Search Articles
                  </h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-[#051433] transition-colors"
                    />
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* About Roman Aviation Widget */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-3">
                  <h4 className="font-space text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                    About Roman Aviation
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#051433] rounded-xl flex items-center justify-center text-gold">
                      <Helicopter className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-space text-xs font-bold text-slate-900">Roman Aviation</h5>
                      <span className="text-[10px] text-slate-400 font-sans">Luxury Air Charter Agency</span>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">
                    Providing high-altitude spiritual charters, premium regional airport connectivity, and custom VIP heli-transits across Indian valleys with dual-pilot guarantees.
                  </p>
                  <Link
                    href="/contact"
                    className="font-space text-[10px] text-[#051433] font-bold uppercase tracking-wider flex items-center gap-1 hover:translate-x-1 transition-all mt-1"
                  >
                    <span>Contact Our Desk</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Recent Posts Widget */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-3">
                  <h4 className="font-space text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                    Recent Posts
                  </h4>
                  <div className="flex flex-col gap-4">
                    {ARTICLES.slice(0, 3).map((art) => (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => setSelectedArticleId(art.id)}
                        className="text-left flex flex-col gap-1 group cursor-pointer"
                      >
                        <span className="font-space text-xs font-bold text-slate-800 group-hover:text-[#051433] transition-colors leading-tight">
                          {art.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono uppercase">{art.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          ) : (
            /* Immersive Article Reader View */
            <motion.article 
              key="reader-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* Back & Article Panel (8 Cols) */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 md:p-8 border border-slate-200 shadow-sm flex flex-col gap-6 text-left">
                
                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setSelectedArticleId(null)}
                  className="flex items-center gap-2 text-xs font-space uppercase tracking-widest text-slate-700 hover:text-[#051433] font-bold transition-colors cursor-pointer self-start bg-slate-50 border border-slate-150 px-4 py-2 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 text-[#051433]" />
                  <span>Back to Blog Articles</span>
                </button>

                {/* Feature Image Cover */}
                <div className="h-[250px] sm:h-[360px] relative rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                  <Image 
                    src={activeArticle!.image} 
                    alt={activeArticle!.title} 
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Meta details */}
                <div className="flex flex-col gap-2.5 border-b border-slate-100 pb-4">
                  <span className="font-space text-xs font-bold text-[#051433] uppercase tracking-wider">
                    {activeArticle!.category}
                  </span>
                  <h2 className="font-space text-xl sm:text-2.5xl font-bold text-slate-900 leading-tight">
                    {activeArticle!.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400 font-sans font-medium">
                    <span className="flex items-center gap-1.5 text-slate-800 font-bold"><User className="h-4 w-4 text-[#051433]" /> {activeArticle!.author}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-300" /> {activeArticle!.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-300" /> {activeArticle!.readTime}</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="flex flex-col gap-5 text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
                  {activeArticle!.content.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* CTA Call to Action Block */}
                <div className="bg-[#051433] rounded-2xl p-6 border border-[#051433] text-white flex flex-col sm:flex-row items-center justify-between gap-6 mt-4 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-amber-400/20 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-400 shrink-0 mt-1">
                      <Helicopter className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-space text-xs uppercase tracking-wider font-bold text-white">Reserve your priority slot today</h4>
                      <p className="font-sans text-[11px] text-slate-300 mt-0.5">Let our dispatch desk stage your private regional heli-transit.</p>
                    </div>
                  </div>
                  <Link
                    href="/booking"
                    className="px-6 py-2.5 bg-gradient-to-r from-gold to-[#D68B3E] hover:from-[#E49512] text-black font-space text-xs font-bold uppercase tracking-wider rounded-xl transition-all shrink-0 text-center w-full sm:w-auto shadow-md"
                  >
                    Book Ticket Now
                  </Link>
                </div>

              </div>

              {/* Right Column: Reader Sidebar Widgets (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6 text-left">
                
                {/* Other Recent Posts widget in reader mode */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-3">
                  <h4 className="font-space text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                    More from Blog
                  </h4>
                  <div className="flex flex-col gap-4">
                    {ARTICLES.filter((a) => a.id !== selectedArticleId).slice(0, 3).map((art) => (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => setSelectedArticleId(art.id)}
                        className="text-left flex flex-col gap-1 group cursor-pointer"
                      >
                        <span className="font-space text-xs font-bold text-slate-800 group-hover:text-[#051433] transition-colors leading-tight">
                          {art.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono uppercase">{art.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </motion.article>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
