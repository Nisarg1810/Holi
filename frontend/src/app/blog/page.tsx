"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, User, Calendar, Search, Helicopter, ArrowRight, Sparkles, BookOpen } from "lucide-react";
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
    id: "kedarnath-guide",
    category: "Char Dham",
    title: "Kedarnath Helicopter Travel Guide 2026",
    desc: "Understand official slot booking calendars, weight limitations, weather standbys, and fast-track Darshan protocols at the Himalayan shrine.",
    date: "July 28, 2026",
    author: "Capt. A. Singh (Retd. IAF)",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
    content: [
      "Securing a helicopter slot for Kedarnath is one of the most crucial aspects of planning your Himalayan pilgrimage. For the 2026 season, the Directorate General of Civil Aviation (DGCA) and Uttarakhand Civil Aviation Development Authority (UCADA) have announced synchronized booking schedules aligned with the temple opening dates.",
      "Safety takes absolute priority at high altitudes. All operations are conducted under strict visual flight rules (VFR). Luggage limits are non-negotiable at 10 kg per seat. It is strongly advised to carry soft duffel bags rather than hard trolleys, which cannot be accommodated in the helicopter cargo holds.",
      "Infants under 2 years travel free of charge if they do not occupy a seat and are lap-held. Be prepared for weather delays, as cloud cover at the Phata, Sirsi, and Guptkashi helipads can result in sudden standby holds. We recommend keeping a buffer day in your itinerary."
    ]
  },
  {
    id: "badrinath-guide",
    category: "Char Dham",
    title: "Badrinath VIP Darshan & Staging Guide",
    desc: "Coordinate luxury twin-engine helipad landings, premium resort bookings near the Alaknanda river, and special evening pooja clearances.",
    date: "July 25, 2026",
    author: "Devi Shastry",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop",
    content: [
      "Badrinath Dham, situated in the Garhwal hill tracks of Uttarakhand along the Alaknanda River, is easily accessible via private VIP helicopter transfers landing at the Badrinath helipad, just a 5-minute drive from the shrine.",
      "A typical helicopter itinerary allows passengers to land in the morning, proceed directly to the VIP queue for quick gate entry, and complete their prayers within two hours. We also arrange overnight premium temple stays for pilgrims wishing to witness the Maha Abhishek Puja at dawn.",
      "Baggage constraints remain at 10 kg per passenger, and ground coordinates are managed by our local hospitality desks. During the autumn months, early morning snow flurries can occur, so dress in heavy woolen layers."
    ]
  },
  {
    id: "mahakaleshwar-ujjain",
    category: "Jyotirlinga",
    title: "Mahakaleshwar Jyotirlinga: Bhasma Aarti Booking Guide",
    desc: "Learn how to secure priority slots for the sacred early morning Bhasma Aarti, VIP entry gates, and local transport in Ujjain.",
    date: "July 20, 2026",
    author: "Pandit R. Chaturvedi",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1608976328321-df6ff1a87e44?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Mahakaleshwar Temple in Ujjain is one of the most revered Jyotirlingas, famous for its unique dakshinmukhi (south-facing) deity structure and the legendary Bhasma Aarti performed daily at 4:00 AM.",
      "Securing a Bhasma Aarti slot requires registration on the official temple portal at least 30 days in advance, matching your photo identification. We offer customized travel packages including VIP fast-track queue tokens and premium stays near the Shipra river.",
      "The dress code is strictly traditional: dhotis for men and sarees for women are mandatory to enter the inner sanctum area. Plan your visit during the winter months (October to March) for pleasant weather conditions."
    ]
  },
  {
    id: "dwarka-gujarat",
    category: "Char Dham",
    title: "Dwarkadhish Temple: Exploring the Ancient Kingdom",
    desc: "A complete guide to visiting the Dwarkadhish Temple in Gujarat, including flight routes to Jamnagar and local excursions in Bet Dwarka.",
    date: "July 18, 2026",
    author: "Dr. Priya Nair",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc1f7f67?q=80&w=800&auto=format&fit=crop",
    content: [
      "Dwarka, situated on the western tip of the Kathiawar peninsula in Gujarat, is the legendary capital of Lord Krishna's ancient kingdom. The majestic five-storied Dwarkadhish Temple is a magnificent spiritual destination.",
      "We arrange express airport transfers from Jamnagar or Rajkot airports directly to Dwarka, followed by private boat excursions to Bet Dwarka temple and the newly developed Sudama Setu suspension bridge.",
      "Witnessing the flag-hoisting ceremony (Abhooti), where the giant flag is changed five times a day, is an essential experience for all travelers. The local marketplace is famous for exquisite Patola silk sarees and brass artifacts."
    ]
  },
  {
    id: "somnath-temple",
    category: "Jyotirlinga",
    title: "Somnath Temple: The Eternal Shrine on the Coast",
    desc: "Plan your pilgrimage to the Somnath Jyotirlinga, including light & sound show schedules, helipad access, and coastal weather tips.",
    date: "July 15, 2026",
    author: "Devi Shastry",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1561361531-99522c36679e?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Somnath Temple in Gujarat stands as the first of the twelve holy Jyotirlingas. Built on the shores of the Arabian Sea, this temple has been reconstructed multiple times, symbolizing resilience and devotion.",
      "The evening Sound and Light Show (Jay Somnath) projected onto the temple walls is a majestic historical chronicle that should not be missed. We coordinate airport transfers from Diu or Keshod to Somnath.",
      "No cameras or electronic items are allowed inside the main complex. Use the locker facilities at the outer gate before entering the main courtyard."
    ]
  },
  {
    id: "kashi-vishwanath",
    category: "Spiritual Centers",
    title: "Varanasi (Kashi): Exploring the Spiritual Heart of India",
    desc: "A complete visitor guide to the newly developed Kashi Vishwanath Corridor, Subah-e-Banaras, and Ganga Aarti boat cruises.",
    date: "July 10, 2026",
    author: "Pandit R. Chaturvedi",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1561361532-23524ca0186b?q=80&w=800&auto=format&fit=crop",
    content: [
      "Varanasi, or Kashi, is one of the oldest continuously inhabited cities in the world. The holy Kashi Vishwanath Temple, dedicated to Lord Shiva, sits at the heart of the city's labyrinth of spiritual ghats.",
      "The newly constructed Kashi Vishwanath Corridor connects the temple directly to the banks of the River Ganges, making it easy for pilgrims to bathe in the holy river and walk directly to the temple gates.",
      "We arrange private morning boat rides (Subah-e-Banaras) and evening VIP seatings for the grand Ganga Aarti at Dashashwamedh Ghat. The winter season offers the most comfortable temperature window for exploration."
    ]
  },
  {
    id: "vaishno-devi-yatra",
    category: "Pilgrimage Guide",
    title: "Mata Vaishno Devi Yatra: Helicopter Booking & Staging",
    desc: "How to book helicopter transfers from Katra to Sanjichhat, express Darshan clearances, and weather standby tips.",
    date: "July 05, 2026",
    author: "Dr. Priya Nair",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=800&auto=format&fit=crop",
    content: [
      "The holy cave shrine of Mata Vaishno Devi, nestled in the Trikuta Mountains of Jammu & Kashmir, is a premier spiritual destination. The helicopter service from Katra to Sanjichhat reduces the 12 km steep trek to an 8-minute scenic flight.",
      "All helicopter tickets automatically include an express VIP Darshan pass (Special Slip) at the Bhawan. Passengers must complete physical biometrics at the Katra boarding desk before staging.",
      "The weather at Sanjichhat can change rapidly, leading to sudden wind delays. Keeping a buffer day in your itinerary is strongly recommended, especially during the monsoon months."
    ]
  },
  {
    id: "amarnath-yatra",
    category: "Pilgrimage Guide",
    title: "Amarnath Yatra: High-Altitude Helicopter Routes",
    desc: "A safety and flight staging guide for the Amarnath Cave yatra via Baltal and Pahalgam helicopter corridors.",
    date: "July 01, 2026",
    author: "Capt. A. Singh (Retd. IAF)",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Amarnath Cave temple, located at an altitude of 3,888 meters in Jammu & Kashmir, houses the naturally forming ice Shiva Lingam. Accessible only during a short summer window, helicopter transits are the safest option.",
      "Flights operate from two primary bases: Baltal (shorter route, landing at Panchtarni) and Pahalgam (scenic route). From Panchtarni helipad, pilgrims must walk or hire ponies to complete the final 6 km stretch to the cave.",
      "A mandatory Compulsory Health Certificate (CHC) signed by an authorized physician is required to board the flight. The thin air at high altitudes requires all travelers to follow strict acclimatization procedures."
    ]
  },
  {
    id: "golden-temple-amritsar",
    category: "Spiritual Centers",
    title: "Golden Temple Amritsar: Travel Tips and Langar",
    desc: "Learn about visiting the Harmandir Sahib, attending the Palki Sahib ceremony, and community kitchen logistics.",
    date: "June 25, 2026",
    author: "Capt. A. Singh (Retd. IAF)",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Harmandir Sahib, popularly known as the Golden Temple in Amritsar, is the spiritual capital of Sikhism. Built around a beautiful pool, the gold-leaf covered temple is a symbol of absolute peace and equality.",
      "The community kitchen (Langar) serves free vegetarian meals to over 100,000 visitors daily, run entirely by volunteers. We arrange premium hotel stays and local transfers to the temple complex.",
      "All visitors must cover their heads and wash their feet in the shallow pools before entering the gold sanctum. The early morning Palki Sahib ceremony is a deeply spiritual experience."
    ]
  },
  {
    id: "tirupati-balaji-guide",
    category: "Spiritual Centers",
    title: "Tirupati Balaji VIP Darshan Booking and TTD Rules",
    desc: "Navigate Tirumala temple reservations, dynamic queue tokens, and dress codes for the richest temple in India.",
    date: "June 20, 2026",
    author: "Dr. Priya Nair",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Venkateswara Swamy Temple on the Tirumala hills in Andhra Pradesh is one of the most visited pilgrimage destinations globally. Managing the crowd dynamics requires structured bookings through the Tirumala Tirupati Devasthanams (TTD) portal.",
      "We secure Special Entry Darshan tokens (₹300) and premium accommodation cottages at the hills. Traditional wear is strictly enforced: dhotis or pyjamas for men, and sarees or churidars with dupattas for women.",
      "Hair tonsuring is a popular traditional practice at Tirumala. Ensure you collect your booking slip at least 15 days in advance to secure optimal morning prayer windows."
    ]
  },
  {
    id: "yamunotri-heli-guide",
    category: "Char Dham",
    title: "Yamunotri Heli Services: Fast Track to the Source",
    desc: "Coordinate flight bookings from Sahastradhara to Kharsali, and pony transits up to the Yamuna shrine.",
    date: "June 15, 2026",
    author: "Devi Shastry",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    content: [
      "Yamunotri is the first stop in the traditional Char Dham pilgrimage. The helicopter ride from Dehradun lands at the Kharsali helipad, from which the final 6 km trek to the Yamuna temple begins.",
      "Ponies and palanquins (dandis) can be booked at Kharsali to help complete the high-altitude trek. The hot springs at Yamunotri (Surya Kund) are a major highlight, where pilgrims cook rice as Prasad.",
      "The narrow valley gets cold early in the evening. We recommend morning slots to ensure maximum safety and avoid afternoon winds."
    ]
  },
  {
    id: "gangotri-valley-guide",
    category: "Char Dham",
    title: "Gangotri Valley: A Complete Pilgrim Visitor Guide",
    desc: "A traveler guide to reaching the sacred source of Ganges, temple coordinates, and local sightseeing in Harsil.",
    date: "June 10, 2026",
    author: "Capt. A. Singh (Retd. IAF)",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800&auto=format&fit=crop",
    content: [
      "Gangotri Dham, situated in the Uttarkashi district of Uttarakhand, is dedicated to Goddess Ganga. The temple sits amidst beautiful cedar pine forests in the Bhagirathi river valley.",
      "Private helicopters land at the Harsil helipad, a valley known as the 'Switzerland of India'. From Harsil, a scenic 25 km drive takes pilgrims directly to the Gangotri temple complex.",
      "Acclimatization is essential as the altitude reaches 3,100 meters. Visiting during the spring season (May to June) offers the most beautiful views of apple orchards in bloom in Harsil."
    ]
  },
  {
    id: "rameshwaram-jyotirlinga",
    category: "Jyotirlinga",
    title: "Rameshwaram Jyotirlinga & Pamban Bridge Guide",
    desc: "Learn about the holy wells (tirthas) at Rameshwaram, the historical Pamban bridge, and beachside stay options.",
    date: "June 05, 2026",
    author: "Dr. Priya Nair",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=800&auto=format&fit=crop",
    content: [
      "Rameshwaram Temple, located on Pamban Island in Tamil Nadu, is one of the holy Char Dham sites. It is renowned for having the longest temple corridor in the world, with spectacular sculpted pillars.",
      "Before offering prayers to the Shiva Lingam, pilgrims bathe in the 22 holy water wells (tirthas) located within the temple complex, believed to have healing properties.",
      "We arrange comfortable travel itineraries from Madurai airport to Rameshwaram, including visits to Dhanushkodi, the ghost town at the tip of the island bordering Sri Lanka."
    ]
  },
  {
    id: "meenakshi-temple-madurai",
    category: "Spiritual Centers",
    title: "Madurai Meenakshi Temple: Architectural Marvel Guide",
    desc: "A detailed guide to the massive gopurams, the thousand-pillar hall, and evening temple rituals in Madurai.",
    date: "June 01, 2026",
    author: "Devi Shastry",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Meenakshi Amman Temple in Madurai is a masterpiece of Dravidian architecture. It features 14 majestic gopurams (gateway towers) covered in thousands of colorful stone figures of deities and mythical animals.",
      "The Hall of Thousand Pillars is a spectacular sculpture gallery where each pillar produces a unique musical note when struck. The temple pool (Golden Lotus Tank) is a sacred gathering spot.",
      "Dress codes are strictly conservative, and mobile phones are prohibited inside the main gate. The annual Chithirai Festival in April is a magnificent visual celebration."
    ]
  },
  {
    id: "hampi-ruins-guide",
    category: "Heritage Sites",
    title: "Hampi Ruins: Exploring the Vijayanagara Splendors",
    desc: "Explore the stone chariot, Virupaksha temple, and boat crossings on the Tungabhadra river in Karnataka.",
    date: "May 25, 2026",
    author: "Dr. Priya Nair",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1600100397608-f010e42edb84?q=80&w=800&auto=format&fit=crop",
    content: [
      "Hampi, a UNESCO World Heritage Site in Karnataka, is an open-air museum of the ruins of the grand Vijayanagara Empire. The landscape is dominated by giant granite boulders and ancient monuments.",
      "Key sites include the Virupaksha Temple, the Vittala Temple with its famous stone chariot, and the royal Lotus Mahal. We coordinate boutique resort stays and guided walks with local historians.",
      "Taking a traditional coracle boat ride on the Tungabhadra River is a wonderful way to view the ruins from the water. October to February is the ideal season to visit."
    ]
  },
  {
    id: "konark-sun-temple",
    category: "Heritage Sites",
    title: "Konark Sun Temple: The Stone Chariot of Orissa",
    desc: "Understand the astronomy behind the sundial wheels, architectural carvings, and beach excursions in Puri.",
    date: "May 20, 2026",
    author: "Devi Shastry",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Konark Sun Temple in Odisha is built in the shape of a colossal chariot dedicated to the Sun God, Surya. It features 24 beautifully carved stone wheels pulled by seven horses.",
      "The wheels of the temple act as precise sundials, capable of calculating time to the accuracy of a few minutes. We arrange complete day tours from Bhubaneswar or Puri beach resorts.",
      "The annual Konark Dance Festival in December is a major cultural event showcasing classical Indian dance forms against the illuminated temple backdrop."
    ]
  },
  {
    id: "ajanta-ellora-caves",
    category: "Heritage Sites",
    title: "Ajanta & Ellora Caves: Ancient Rock-Cut Architecture",
    desc: "A visitor guide to the Kailash Temple, ancient Buddhist frescoes, and flight transfers to Aurangabad.",
    date: "May 15, 2026",
    author: "Capt. A. Singh (Retd. IAF)",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1608958416744-4869c9b583f7?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Ajanta and Ellora Caves in Maharashtra are monuments carved directly out of solid basalt cliffs. Ajanta features beautiful Buddhist frescoes, while Ellora represents Hindu, Buddhist, and Jain rock-cut architecture.",
      "The highlight of Ellora is the Kailash Temple, a colossal structure carved from a single rock from the top down, a marvel of ancient engineering. We arrange private guided transfers from Aurangabad airport.",
      "The caves are closed on certain weekdays (Mondays for Ajanta, Tuesdays for Ellora), so coordinate your travel plans accordingly."
    ]
  },
  {
    id: "taj-mahal-vip",
    category: "Heritage Sites",
    title: "Taj Mahal VIP Day Tour & Staging Guidelines",
    desc: "How to beat the crowds, purchase express entry passes, and schedule sunrise photography visits in Agra.",
    date: "May 10, 2026",
    author: "Devi Shastry",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Taj Mahal in Agra, a symbol of eternal love and a UNESCO World Heritage Site, is one of the most famous buildings globally. Viewing the white marble structure at sunrise offers a magical experience.",
      "We arrange private Audi transfers from Delhi via the Yamuna Expressway, express entry VIP tickets to skip the long queues, and local guides for your group.",
      "Strict security guidelines apply: large backpacks, tripods, and food items are prohibited inside the main gate. The monument is closed to the public on Fridays."
    ]
  },
  {
    id: "valley-of-flowers",
    category: "Nature Trails",
    title: "Valley of Flowers: Trek & Heli Shuttles",
    desc: "Coordinate express helicopter shuttles from Govindghat to Ghangaria, alpine bloom timelines, and safety tips.",
    date: "May 05, 2026",
    author: "Devi Shastry",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    content: [
      "The Valley of Flowers National Park in Uttarakhand is famous for its meadows of endemic alpine flowers and diverse flora. Reaching this remote valley via ground transport requires a long drive followed by a 13 km steep trek.",
      "Roman Aviation coordinates express helicopter transfers from Govindghat to Ghangaria, reducing travel time to a swift 4-minute flight over scenic alpine gorges. This allows pilgrims and leisure travelers to save energy for the final gentle walk into the national park core area.",
      "Operations start daily at 06:30 AM, taking advantage of the early morning wind stability. Ground crews verify all medical and safety passes at the Govindghat helipad. All passengers must check in their luggage to ensure strict helicopter take-off load safety profiles.",
      "Since weather clearance windows near Hemkund Sahib are narrow, we operate on high-frequency shuttle intervals during the blooming season (July to September). Ensure you coordinate with our dispatch desk to lock in your return ticket beforehand."
    ]
  },
  {
    id: "hemkund-sahib-staging",
    category: "Pilgrimage Guide",
    title: "Hemkund Sahib: High-Altitude Sikh Pilgrimage",
    desc: "Learn about the highest Gurudwara in the world, flight shuttle timings to Ghangaria, and physical fitness tips.",
    date: "May 01, 2026",
    author: "Capt. A. Singh (Retd. IAF)",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800&auto=format&fit=crop",
    content: [
      "Gurudwara Hemkund Sahib, situated at an altitude of 4,329 meters in Uttarakhand, is the highest place of worship for Sikhs, built next to a pristine glacial lake surrounded by seven mountain peaks.",
      "We arrange helicopter transits from Govindghat base to Ghangaria, followed by pony or trek arrangements for the final steep 6 km climb to the lake.",
      "Due to the extreme altitude and freezing temperatures, oxygen levels are low. Pilgrims are advised not to spend more than 2 hours at the top and must descent to Ghangaria for overnight stays."
    ]
  }
];

export default function BlogPage() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Char Dham", "Jyotirlinga", "Spiritual Centers", "Pilgrimage Guide", "Heritage Sites", "Nature Trails"];

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
              Spiritual &amp; Cultural Chronicles
            </span>
          </div>
          
          <h1 className="font-space text-3xl md:text-5xl font-bold tracking-tight text-white uppercase">
            Travel Blog
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-3 font-sans leading-relaxed">
            Explore 20 of the most sacred temples, architectural marvels, and natural heritage sites across India. Read expert logs, staging coordinates, and helipad guidelines.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
        
        <AnimatePresence mode="wait">
          {!selectedArticleId ? (
            /* Full-Width Blog Grid Layout */
            <motion.div 
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              
              {/* Central Filter Control Bar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Search Box */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Search temple or destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-[#051433] focus:bg-white transition-all"
                  />
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                </div>

                {/* Category Filter Navigation */}
                <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide max-w-full pb-1 md:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-space font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeCategory === cat
                          ? "bg-[#051433] text-white shadow-md"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

              </div>

              {/* 3-Column Full-Width Articles Grid */}
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map((article) => (
                    <div 
                      key={article.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-[440px]"
                    >
                      {/* Image Cover */}
                      <div className="h-48 relative overflow-hidden bg-slate-100">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 30vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 bg-[#051433] text-amber-400 font-space text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                          {article.category}
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="p-6 flex flex-col justify-between flex-grow text-left">
                        <div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-sans mb-2 font-semibold">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                            <span>• {article.date}</span>
                          </div>

                          <h3 className="font-space text-base font-bold text-slate-900 mb-2 group-hover:text-[#051433] transition-colors leading-snug line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="font-sans text-xs text-slate-500 leading-relaxed line-clamp-3">
                            {article.desc}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedArticleId(article.id)}
                          className="font-space text-xs text-[#051433] font-bold uppercase tracking-wider flex items-center gap-1 transition-all group-hover:translate-x-1 cursor-pointer self-start mt-4"
                        >
                          <span>Read Log Details</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-16 border border-slate-200 text-center flex flex-col items-center gap-4">
                  <BookOpen className="h-10 w-10 text-slate-300" />
                  <h3 className="font-space text-sm font-bold uppercase tracking-wider text-slate-700">No destinations found</h3>
                  <p className="text-xs text-slate-400 max-w-sm">No articles match your search query or selected category. Try selecting another filter pill.</p>
                </div>
              )}
            </motion.div>
          ) : (
            /* Centered Immersive Article Reader View */
            <motion.article 
              key="reader-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-5 md:p-10 border border-slate-200 shadow-sm flex flex-col gap-6 max-w-4xl mx-auto text-slate-800"
            >
              {/* Back Button */}
              <button
                type="button"
                onClick={() => setSelectedArticleId(null)}
                className="flex items-center gap-2 text-xs font-space uppercase tracking-widest text-slate-700 hover:text-[#051433] font-bold transition-colors cursor-pointer self-start bg-slate-50 border border-slate-150 px-4 py-2 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 text-[#051433]" />
                <span>Back to Travel Grid</span>
              </button>

              {/* Feature Image Cover */}
              <div className="h-[250px] sm:h-[400px] relative rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                <Image 
                  src={activeArticle!.image} 
                  alt={activeArticle!.title} 
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Meta details */}
              <div className="flex flex-col gap-2.5 border-b border-slate-100 pb-4 text-left">
                <span className="font-space text-xs font-bold text-[#051433] uppercase tracking-wider">
                  {activeArticle!.category}
                </span>
                <h2 className="font-space text-2xl sm:text-3.5xl font-bold text-slate-900 leading-tight">
                  {activeArticle!.title}
                </h2>
                <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400 font-sans font-medium">
                  <span className="flex items-center gap-1.5 text-slate-800 font-bold"><User className="h-4 w-4 text-[#051433]" /> {activeArticle!.author}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-300" /> {activeArticle!.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-300" /> {activeArticle!.readTime}</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="flex flex-col gap-5 text-slate-600 font-sans text-sm sm:text-base leading-relaxed text-left">
                {activeArticle!.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* CTA Call to Action Block */}
              <div className="bg-[#051433] rounded-2xl p-6 md:p-8 border border-[#051433] text-white flex flex-col sm:flex-row items-center justify-between gap-6 mt-4 shadow-md">
                <div className="flex items-start gap-4 text-left">
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

            </motion.article>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
