"use client";
import React, { useState, useEffect } from "react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Provider from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/ui/atoms/Loader";

const TripAdvisorPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedContinent, setSelectedContinent] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchDestinations();
    }
  }, [status, selectedCategory, selectedContinent, selectedExpense]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        continent: selectedContinent,
        expense: selectedExpense,
        query: searchQuery
      });
      const res = await fetch(`/api/destinations?${params.toString()}`);
      const data = await res.json();
      setDestinations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDestinations();
  };

  if (status === "loading") {
    return <Loader />;
  }

  const categories = [
    { id: "all", name: "All Types", emoji: "🌍" },
    { id: "Hotels", name: "Hotels", emoji: "🏨" },
    { id: "Things to Do", name: "Activities", emoji: "🎭" },
    { id: "Restaurants", name: "Food", emoji: "🍽️" },
    { id: "Travel Stories", name: "Stories", emoji: "✈️" },
  ];

  const continents = ["all", "Africa", "Asia", "Europe", "North America", "South America", "Australia", "Antarctica"];
  const expenses = ["all", "Budget", "Mid-range", "Luxury"];

  const colors = ["#FF6B6B", "#4ADE80", "#00D9FF", "#FFC700", "#FF69B4", "#00CED1"];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <MainNavbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#FF6B6B] via-[#FFC700] to-[#00D9FF] border-b-4 border-black py-12 px-4 relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase text-black italic">
                GUIDEBOOK
              </h1>
              <p className="text-xl font-bold bg-white inline-block px-4 py-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
                {destinations.length} GLOBAL ESCAPES WAITING FOR YOU
              </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="w-full md:w-96">
              <div className="flex bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cities, tags..."
                  className="flex-1 px-4 py-3 font-bold focus:outline-none text-black"
                />
                <button type="submit" className="px-6 bg-[#4ADE80] border-l-4 border-black font-black text-black hover:bg-black hover:text-white transition-colors">
                  GO
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Multi-Filter Bar */}
      <section className="bg-white border-b-4 border-black py-8 px-4 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Main Types */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 border-4 border-black font-black text-black uppercase text-sm transition-all ${selectedCategory === cat.id
                    ? "bg-[#FFC700] translate-x-1 translate-y-1 shadow-none"
                    : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-8 items-center">
            {/* Continent Filter */}
            <div className="flex items-center gap-3">
              <span className="font-black text-xs uppercase text-gray-500">Continent:</span>
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                className="bg-white border-2 border-black font-bold px-3 py-1 focus:outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black"
              >
                {continents.map(c => <option key={c} value={c}>{c === 'all' ? 'Everywhere' : c}</option>)}
              </select>
            </div>

            {/* Expense Filter */}
            <div className="flex items-center gap-3">
              <span className="font-black text-xs uppercase text-gray-500">Budget:</span>
              <select
                value={selectedExpense}
                onChange={(e) => setSelectedExpense(e.target.value)}
                className="bg-white border-2 border-black font-bold px-3 py-1 focus:outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black"
              >
                {expenses.map(e => <option key={e} value={e}>{e === 'all' ? 'Any Budget' : e}</option>)}
              </select>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {destinations.map((dest, index) => (
              <div
                key={dest._id}
                onClick={() => {
                  setSelectedDest(dest);
                  setActiveImgIndex(0);
                }}
                className="bg-white border-4 border-black text-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer group flex flex-col h-full"
              >
                {/* Image Area */}
                <div
                  className="h-64 border-b-4 border-black relative overflow-hidden"
                  style={{ backgroundColor: colors[index % colors.length] }}
                >
                  {dest.images?.[0] ? (
                    <img src={dest.images[0]} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-8xl">🌏</div>
                  )}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="px-3 py-1 bg-white border-2 border-black font-black text-xs text-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      {dest.continent}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-[#4ADE80] border-2 border-black font-black text-xs text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    {dest.expense}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black uppercase leading-tight">{dest.name}</h3>
                    <span className="text-2xl">⭐</span>
                  </div>

                  <p className="font-medium mb-6 line-clamp-3 text-gray-700 leading-relaxed overflow-hidden flex-1">{dest.details}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {dest.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 border-2 border-black font-bold text-[10px] uppercase">#{tag}</span>
                    ))}
                  </div>

                  <div className="pt-6 border-t-2 border-black/10 flex justify-between items-center group-hover:bg-gray-50 -mx-6 -mb-6 px-6 pb-6 transition-colors">
                    <span className="font-black text-sm uppercase underline decoration-4 decoration-[#4ADE80] underline-offset-4">Read Guide →</span>
                    <span className="font-bold text-xs text-gray-400">{dest.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white border-8 border-black border-dashed">
            <div className="text-9xl mb-6">🏜️</div>
            <h3 className="text-4xl font-black uppercase mb-4">No results for this search</h3>
            <p className="font-bold text-xl text-gray-500 uppercase">Try broading your filters or search terms</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedContinent('all');
                setSelectedExpense('all');
                setSearchQuery('');
              }}
              className="mt-8 px-10 py-4 bg-black text-white border-4 border-black font-black text-xl hover:bg-[#4ADE80] hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
            >
              RESET ALL
            </button>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedDest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
          <div className="bg-white border-8 border-black w-full max-w-6xl h-full max-h-[90vh] overflow-y-auto shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b-8 border-black p-8 flex justify-between items-center z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <h2 className="text-3xl md:text-6xl font-black uppercase italic leading-none">{selectedDest.name}</h2>
                <div className="px-4 py-1 bg-[#FFC700] border-4 border-black font-black uppercase text-sm -rotate-2">
                  {selectedDest.continent}
                </div>
              </div>
              <button
                onClick={() => setSelectedDest(null)}
                className="w-16 h-16 bg-[#FF6B6B] border-4 border-black font-black text-3xl flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-0 flex flex-col lg:flex-row flex-1">
              {/* Image Gallery */}
              <div className="lg:w-1/2 border-r-8 border-black bg-gray-100 flex flex-col">
                <div className="flex-1 min-h-[400px] relative border-b-8 border-black">
                  <img
                    src={selectedDest.images?.[activeImgIndex] || "https://images.unsplash.com/photo-1548013146-72479768bada"}
                    className="w-full h-full object-cover"
                    alt={selectedDest.name}
                  />
                  <div className="absolute bottom-6 left-6 text-white font-black text-8xl opacity-10 uppercase select-none pointer-events-none">
                    EXPLORE
                  </div>
                </div>
                <div className="grid grid-cols-3 h-32">
                  {selectedDest.images?.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImgIndex(i)}
                      className={`border-r-4 border-black last:border-r-0 overflow-hidden group ${activeImgIndex === i ? 'sepia-0' : 'sepia'}`}
                    >
                      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="thumbnail" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="lg:w-1/2 p-8 md:p-12 space-y-12 bg-[#FAFAFA]">
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-3xl font-black uppercase bg-[#4ADE80] px-4 py-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
                      Background
                    </h3>
                    <div className="flex-1 h-1 bg-black"></div>
                  </div>
                  <p className="text-xl font-bold leading-relaxed text-black italic">
                    "{selectedDest.details}"
                  </p>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                  <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(255,199,0,1)]">
                    <h3 className="text-2xl font-black mb-6 uppercase flex items-center justify-between text-black">
                      <span>Activities</span>
                      <span className="text-3xl">🎭</span>
                    </h3>
                    <div className="space-y-4">
                      {selectedDest.whatToDo?.map((activity, i) => (
                        <div key={i} className="flex items-start gap-4 p-3 bg-gray-50 border-2 border-black text-black">
                          <span className="font-black text-[#00D9FF]">0{i + 1}</span>
                          <span className="font-bold">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,217,255,1)]">
                    <h3 className="text-2xl font-black mb-6 uppercase flex items-center justify-between text-black">
                      <span>Essentials</span>
                      <span className="text-3xl">🎒</span>
                    </h3>
                    <ul className="space-y-4">
                      {selectedDest.packingList?.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 font-bold text-black border-b-2 border-black/5 pb-2">
                          <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-[10px] font-black">✔</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <section className="pt-8 flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 bg-black text-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(74,222,128,1)]">
                    <h4 className="text-2xl font-black mb-2 uppercase">Ready to go?</h4>
                    <p className="font-bold text-gray-400 mb-6 uppercase text-xs tracking-widest">Find a partner for {selectedDest.name}</p>
                    <button className="w-full px-6 py-4 bg-[#4ADE80] text-black border-4 border-black font-black text-xl hover:bg-white transition-all transform hover:-translate-y-1">
                      MATCH ME
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <section className="bg-black py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 text-white/5 text-9xl font-black uppercase rotate-12 pointer-events-none">NEVER STOP</div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-black mb-8 text-white uppercase italic">
            WORLD IS <span className="text-[#FFC700]">HUGE</span>
          </h2>
          <p className="text-2xl font-bold text-gray-400 mb-12 uppercase">
            AND SO IS YOUR POTENTIAL TO EXPLORE IT
          </p>
          <button className="px-16 py-6 bg-[#4ADE80] text-black border-8 border-white font-black text-2xl hover:bg-white transition-all shadow-[12px_12px_0px_0px_rgba(255,199,0,1)]">
            JOIN THE COMMUNITY
          </button>
        </div>
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
