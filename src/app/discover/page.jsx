"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Provider from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/ui/atoms/Loader";
import Link from "next/link";

const TRAVEL_TYPES = [
  "Adventure",
  "Beach",
  "Cultural",
  "Business",
  "Family",
  "Solo",
  "Backpacking",
  "Luxury",
];

const TRAVEL_TYPE_ICONS = {
  Adventure: "🏔️",
  Beach: "🏖️",
  Cultural: "🏛️",
  Business: "💼",
  Family: "👨‍👩‍👧‍👦",
  Solo: "🎒",
  Backpacking: "🌿",
  Luxury: "✨",
};

const DiscoverPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeType, setActiveType] = useState("All");
  const [countryFilter, setCountryFilter] = useState("");
  const [placeFilter, setPlaceFilter] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let endpoint = "/api/users";
      if (searchQuery) {
        endpoint = `/api/users/searchOther?query=${encodeURIComponent(searchQuery)}`;
      }
      const res = await fetch(endpoint, { cache: "no-store" });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleClearFilters = () => {
    setActiveType("All");
    setCountryFilter("");
    setPlaceFilter("");
    setSearchQuery("");
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesType =
        activeType === "All" ||
        (user.travelType || "").toLowerCase() === activeType.toLowerCase();
      const matchesCountry =
        !countryFilter ||
        (user.travelCountry || "").toLowerCase().includes(countryFilter.toLowerCase());
      const matchesPlace =
        !placeFilter ||
        (user.travelCity || "").toLowerCase().includes(placeFilter.toLowerCase());
      return matchesType && matchesCountry && matchesPlace;
    });
  }, [users, activeType, countryFilter, placeFilter]);

  if (status === "loading") {
    return <Loader />;
  }

  const colors = ["#003580", "#009fe3", "#00AF87", "#7c3aed", "#db2777"];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />

      {/* Header */}
      <section
        className="relative py-16 px-4 text-white"
        style={{ background: "linear-gradient(135deg, #003580 0%, #009fe3 60%, #00AF87 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Discover Travelers</h1>
          <p className="text-white/80 mb-8">Find your perfect travel companion from around the world</p>

          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, city, country, or travel style..."
                className="flex-1 px-5 py-3 rounded-xl text-gray-900 placeholder-gray-400 bg-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-[#003580] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-5 px-4 sticky top-28 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Travel Style</p>
            <div className="flex gap-2 flex-wrap">
              {["All", ...TRAVEL_TYPES].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    activeType === type
                      ? "bg-[#003580] text-white border-[#003580]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#003580] hover:text-[#003580]"
                  }`}
                >
                  {type !== "All" ? `${TRAVEL_TYPE_ICONS[type]} ` : ""}{type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Country</label>
              <input
                type="text"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                placeholder="e.g., Japan"
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent transition-all w-44"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">City / Place</label>
              <input
                type="text"
                value={placeFilter}
                onChange={(e) => setPlaceFilter(e.target.value)}
                placeholder="e.g., Kyoto"
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent transition-all w-44"
              />
            </div>
            {(activeType !== "All" || countryFilter || placeFilter || searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Users Grid */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : filteredUsers.length > 0 ? (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <p className="text-sm text-gray-500">
                {filteredUsers.length} traveler{filteredUsers.length !== 1 ? "s" : ""} found
              </p>
              {activeType !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#003580]/10 text-[#003580] text-xs font-medium rounded-full">
                  {TRAVEL_TYPE_ICONS[activeType]} {activeType}
                </span>
              )}
              {countryFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#009fe3]/10 text-[#009fe3] text-xs font-medium rounded-full">
                  🌍 {countryFilter}
                </span>
              )}
              {placeFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#00AF87]/10 text-[#00AF87] text-xs font-medium rounded-full">
                  📍 {placeFilter}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredUsers.map((user, index) => (
                <div
                  key={user._id || index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all overflow-hidden"
                >
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                        {user.email && (
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    {user.bio && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">&ldquo;{user.bio}&rdquo;</p>
                    )}

                    <div className="space-y-2 mb-4">
                      {(user.travelCity || user.travelCountry) && (
                        <div className="flex items-center gap-2">
                          <span className="text-base">📍</span>
                          <span className="text-sm text-gray-600 font-medium">
                            {user.travelCity}
                            {user.travelCity && user.travelCountry && ", "}
                            {user.travelCountry}
                          </span>
                        </div>
                      )}
                      {user.travelType && (
                        <div className="flex items-center gap-2">
                          <span className="text-base">{TRAVEL_TYPE_ICONS[user.travelType] || "✈️"}</span>
                          <span className="inline-block px-2.5 py-0.5 bg-[#003580]/10 text-[#003580] text-xs font-semibold rounded-full">
                            {user.travelType}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/chats/new?userId=${user._id}`}
                        className="flex-1 px-4 py-2 bg-[#003580] text-white text-sm font-semibold text-center rounded-lg hover:bg-[#002a6e] transition-colors"
                      >
                        Chat
                      </Link>
                      <button className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        👋
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No travelers found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-[#003580] text-white font-semibold rounded-lg hover:bg-[#002a6e] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default function Discover() {
  return (
    <Provider>
      <Suspense fallback={<Loader />}>
        <DiscoverPage />
      </Suspense>
    </Provider>
  );
}
