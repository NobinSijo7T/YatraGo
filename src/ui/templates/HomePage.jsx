"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MainNavbar from "@/ui/organisms/MainNavbar";

/* ─────────────────────────────────────────────────────────────
   Static data
───────────────────────────────────────────────────────────── */
const categories = [
  { name: "Hotels",         icon: "🏨", link: "/trip-advisor?category=hotels",     color: "bg-blue-50   text-blue-700   border-blue-100" },
  { name: "Activities",     icon: "🎭", link: "/trip-advisor?category=activities", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { name: "Restaurants",    icon: "🍽️", link: "/trip-advisor?category=restaurants",color: "bg-orange-50  text-orange-700  border-orange-100" },
  { name: "Travel Stories", icon: "✈️", link: "/trip-advisor?category=stories",    color: "bg-purple-50  text-purple-700  border-purple-100" },
];

const destinations = [
  { name: "Bali",      country: "Indonesia",  img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", tagline: "Island paradise" },
  { name: "Paris",     country: "France",     img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80", tagline: "City of light" },
  { name: "Kyoto",     country: "Japan",      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", tagline: "Ancient culture" },
  { name: "Santorini", country: "Greece",     img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", tagline: "Aegean escape" },
  { name: "New York",  country: "USA",        img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80", tagline: "City that never sleeps" },
  { name: "Cape Town", country: "South Africa", img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80", tagline: "Where mountains meet sea" },
];

const interests = [
  { name: "Adventure", emoji: "🏔️", desc: "Trekking, rafting & more",   bg: "from-emerald-400 to-teal-500" },
  { name: "Food",      emoji: "🍜", desc: "Local cuisine & street food", bg: "from-orange-400  to-red-500"   },
  { name: "Culture",   emoji: "🎨", desc: "Art, history & heritage",     bg: "from-purple-400  to-indigo-500"},
  { name: "Beach",     emoji: "🌊", desc: "Sun, sand & sea",             bg: "from-sky-400     to-blue-500"  },
];

const stats = [
  { value: "400K+",  label: "Travelers" },
  { value: "180+",   label: "Countries" },
  { value: "50K+",   label: "Stories"   },
  { value: "24/7",   label: "Support"   },
];

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (session) {
        router.push(`/trip-advisor?query=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push(`/discover?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <MainNavbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] -mt-28 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background — pointer-events-none so decorative layers never block navbar clicks */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage:
              "url('/landing.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <p className="text-white/80 text-sm font-semibold tracking-widest uppercase mb-4">
            Your travel companion
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
            Where will you go
            <span className="block text-[#009fe3]">next?</span>
          </h1>
          <p className="text-white/85 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Discover amazing destinations, find travel buddies, and create memories that last a lifetime.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cities, hotels, activities, travel stories..."
                  className="flex-1 py-3 text-gray-900 text-base placeholder-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#003580] text-white font-semibold rounded-xl hover:bg-[#00266b] transition-colors text-base flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick category chips */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={session ? cat.link : "/register"}
                className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-[#003580] text-white py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-white/70 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#009fe3] text-sm font-semibold uppercase tracking-wide mb-1">Explore</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Popular Destinations</h2>
          </div>
          <Link
            href={session ? "/discover" : "/register"}
            className="text-sm font-semibold text-[#003580] hover:underline hidden sm:block"
          >
            View all →
          </Link>
        </div>

        {/* Grid: 1 large + 5 small */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {destinations.map((dest, i) => (
            <Link
              key={dest.name}
              href={session ? `/discover?q=${dest.name}` : "/register"}
              className={`group relative overflow-hidden rounded-2xl ${
                i === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? "h-72 md:h-full min-h-[340px]" : "h-44"}`}>
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold text-lg leading-tight">{dest.name}</p>
                  <p className="text-white/75 text-sm">{dest.country}</p>
                  <p className="text-white/60 text-xs mt-0.5 italic">{dest.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── INTERESTS ────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#009fe3] text-sm font-semibold uppercase tracking-wide mb-1">Find your tribe</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Travel by interest</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Whatever you&apos;re passionate about, find companions who share your vibe.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {interests.map((interest) => (
              <Link
                key={interest.name}
                href={`/discover?interest=${interest.name.toLowerCase()}`}
                className={`group relative h-52 rounded-2xl bg-gradient-to-br ${interest.bg} overflow-hidden hover:shadow-lg transition-shadow`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <span className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {interest.emoji}
                  </span>
                  <h3 className="text-xl font-bold">{interest.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{interest.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-[#009fe3] text-sm font-semibold uppercase tracking-wide mb-1">Simple &amp; easy</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How YathraGo works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            { step: "01", title: "Create your profile",  desc: "Tell us about yourself — where you travel, your style and what you love.",       icon: "👤" },
            { step: "02", title: "Find companions",       desc: "Browse thousands of travelers heading to the same destinations as you.",          icon: "🤝" },
            { step: "03", title: "Travel together",       desc: "Chat, plan and share your journey. Make friends that last a lifetime.",           icon: "🌍" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-[#003580]/5 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-[#009fe3] tracking-wider uppercase">{item.step}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      {!session && (
        <section className="relative overflow-hidden bg-[#003580] py-20 px-4">
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=1200&q=70')" }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to explore the world?
            </h2>
            <p className="text-white/75 text-lg mb-8">
              Join 400,000+ travelers who found their perfect companion on YathraGo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-10 py-4 bg-white text-[#003580] font-bold rounded-xl hover:bg-gray-100 transition-colors text-base shadow-lg"
              >
                Get started — it&apos;s free
              </Link>
              <Link
                href="/discover"
                className="px-10 py-4 border border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-base"
              >
                Browse destinations
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 p-1">
                <img src="/black_ver.png" alt="YathraGo" className="w-full h-full object-contain filter invert opacity-70" />
              </div>
              <span className="text-white text-lg font-bold">YathraGo</span>
            </div>
            <p className="text-sm">© 2026 YathraGo. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/discover" className="hover:text-white transition-colors">Explore</Link>
              <Link href="/trip-advisor" className="hover:text-white transition-colors">Trip Advisor</Link>
              <Link href="/chatrooms" className="hover:text-white transition-colors">Community</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
