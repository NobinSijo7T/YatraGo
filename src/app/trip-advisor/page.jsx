"use client";
import React, { useState, useEffect, Suspense } from "react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Provider from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/ui/atoms/Loader";
import HotelCard from "@/ui/molecules/HotelCard";
import ActivityCard from "@/ui/molecules/ActivityCard";
import RestaurantCard from "@/ui/molecules/RestaurantCard";
import TravelStoryCard from "@/ui/molecules/TravelStoryCard";
import DestinationCard from "@/ui/molecules/DestinationCard";
import DetailModal from "@/ui/organisms/DetailModal";

const TripAdvisorPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "destinations");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    country: searchParams.get("country") || "",
    priceRange: "",
    rating: "",
    sortBy: "rating"
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchItems();
    }
  }, [status, selectedCategory, filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      const params = new URLSearchParams();
      
      // Add common params
      if (searchQuery) params.append("query", searchQuery);
      if (filters.city) params.append("city", filters.city);
      if (filters.country) params.append("country", filters.country);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.rating) params.append("rating", filters.rating);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      
      // Determine endpoint based on category
      switch (selectedCategory) {
        case "destinations":
          endpoint = `/api/destinations?${params.toString()}`;
          break;
        case "hotels":
          endpoint = `/api/hotels?${params.toString()}`;
          break;
        case "activities":
          endpoint = `/api/activities?${params.toString()}`;
          break;
        case "restaurants":
          endpoint = `/api/restaurants?${params.toString()}`;
          break;
        case "stories":
          endpoint = `/api/travel-stories?${params.toString()}`;
          break;
        default:
          endpoint = `/api/destinations`;
      }
      
      const res = await fetch(endpoint, {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      const data = await res.json();
      
      if (res.ok) {
        setItems(Array.isArray(data) ? data : []);
      } else {
        console.error("Error fetching items:", data.error);
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      city: "",
      country: "",
      priceRange: "",
      rating: "",
      sortBy: "rating"
    });
  };

  if (status === "loading") {
    return <Loader />;
  }

  const categories = [
    { id: "destinations", name: "Destinations", emoji: "🌍" },
    { id: "hotels", name: "Hotels", emoji: "🏨" },
    { id: "activities", name: "Activities", emoji: "🎭" },
    { id: "restaurants", name: "Restaurants", emoji: "🍽️" },
    { id: "stories", name: "Stories", emoji: "✈️" },
  ];

  const priceRanges = {
    hotels: ["Budget", "Mid-range", "Luxury", "Ultra-Luxury"],
    activities: ["Free", "Budget", "Mid-range", "Expensive"],
    restaurants: ["Budget", "Mid-range", "Fine Dining", "Luxury"],
    stories: []
  };

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name (A-Z)" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />

      {/* Header */}
      <section
        className="relative py-16 px-4 text-white"
        style={{ background: "linear-gradient(135deg, #003580 0%, #009fe3 60%, #00AF87 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Trip Advisor
          </h1>
          <p className="text-white/80 mb-8">
            Discover amazing destinations, activities, and experiences
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotels, activities, restaurants..."
                className="flex-1 px-5 py-3 rounded-xl text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
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

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? "bg-[#003580] text-white border-[#003580]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#003580] hover:text-[#003580]"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      {selectedCategory !== "destinations" && (
      <section className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters({...filters, city: e.target.value})}
              placeholder="City"
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent transition-all"
            />
            <input
              type="text"
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
              placeholder="Country"
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent transition-all"
            />
            
            {priceRanges[selectedCategory] && priceRanges[selectedCategory].length > 0 && (
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
              >
                <option value="">All Prices</option>
                {priceRanges[selectedCategory].map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            )}
            
            <select
              value={filters.rating}
              onChange={(e) => setFilters({...filters, rating: e.target.value})}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
            
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>

            <button
              onClick={fetchItems}
              className="px-4 py-1.5 bg-[#003580] text-white text-sm font-semibold rounded-lg hover:bg-[#002a6e] transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </section>
      )}

      {/* Results Grid */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="mb-5">
              <p className="text-sm text-gray-500">
                Found {items.length} {selectedCategory}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => {
                switch (selectedCategory) {
                  case "destinations":
                    return <DestinationCard key={item._id} destination={item} />;
                  case "hotels":
                    return <HotelCard key={item._id} hotel={item} onClick={() => handleCardClick(item)} />;
                  case "activities":
                    return <ActivityCard key={item._id} activity={item} onClick={() => handleCardClick(item)} />;
                  case "restaurants":
                    return <RestaurantCard key={item._id} restaurant={item} onClick={() => handleCardClick(item)} />;
                  case "stories":
                    return <TravelStoryCard key={item._id} story={item} onClick={() => handleCardClick(item)} />;
                  default:
                    return null;
                }
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-[#003580] text-white font-semibold rounded-lg hover:bg-[#002a6e] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        item={selectedItem}
        type={selectedCategory}
      />
    </div>
  );
};

export default function TripAdvisor() {
  return (
    <Provider>
      <Suspense fallback={<Loader />}>
        <TripAdvisorPage />
      </Suspense>
    </Provider>
  );
}
