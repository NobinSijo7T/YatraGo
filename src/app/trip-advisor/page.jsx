"use client";
import React, { useState, useEffect } from "react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Provider from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/ui/atoms/Loader";
import Link from "next/link";

const TripAdvisorPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchDestinations();
    }
  }, [status, selectedCategory]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const endpoint = selectedCategory === "all" 
        ? "/api/destinations"
        : `/api/destinations?category=${encodeURIComponent(selectedCategory)}`;
      
      const res = await fetch(endpoint, {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      const data = await res.json();
      
      if (res.ok) {
        setDestinations(Array.isArray(data) ? data : []);
      } else {
        console.error("Error fetching destinations:", data.error);
        setDestinations([]);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <Loader />;
  }

  const categories = [
    { id: "all", name: "All", emoji: "🌍" },
    { id: "Hotels", name: "Hotels", emoji: "🏨" },
    { id: "Things to Do", name: "Activities", emoji: "🎭" },
    { id: "Restaurants", name: "Food", emoji: "🍽️" },
    { id: "Travel Stories", name: "Stories", emoji: "✈️" },
  ];

  const colors = ["#FF6B6B", "#4ADE80", "#00D9FF", "#FFC700", "#FF69B4", "#00CED1"];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <MainNavbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#FF6B6B] to-[#FFC700] border-b-4 border-black py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase text-black">
            Trip Advisor
          </h1>
          <p className="text-xl font-bold text-black">
            Discover amazing destinations around the world
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b-4 border-black py-6 px-4 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 border-4 border-black font-black whitespace-nowrap transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] ${
                  selectedCategory === cat.id
                    ? "bg-[#FFC700] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black"
                    : "bg-white text-black"
                }`}
              >
                <span className="mr-2">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, index) => (
              <Link
                key={dest._id}
                href={`/trip-advisor/${dest._id}`}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                {/* Image/Icon */}
                <div
                  className="h-48 flex items-center justify-center text-8xl border-b-4 border-black"
                  style={{ backgroundColor: colors[index % colors.length] }}
                >
                  {dest.images && dest.images[0] ? (
                    <img src={dest.images[0]} alt={dest.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>🌍</span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-[#FFC700] border-2 border-black font-black text-xs text-black uppercase">
                      {dest.category}
                    </span>
                    {dest.expense && (
                      <span className="px-2 py-1 bg-white border-2 border-black font-bold text-xs text-black">
                        {dest.expense}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-black">{dest.name}</h3>
                  <p className="font-medium text-black mb-4 line-clamp-3">{dest.details}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-black">{dest.continent}</span>
                    <span className="px-4 py-2 bg-black border-2 border-black font-bold text-white">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🌍</div>
            <h3 className="text-3xl font-black mb-4 uppercase text-black">No Destinations Found</h3>
            <p className="text-xl font-medium text-black">Try selecting a different category</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default function TripAdvisor() {
  return (
    <Provider>
      <TripAdvisorPage />
    </Provider>
  );
}
