"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Loader from "@/ui/atoms/Loader";
import Link from "next/link";
import Provider from "@/context/Provider";

const DestinationDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchDestination = async () => {
      if (!params.id) return;

      try {
        const response = await fetch(`/api/destinations/${params.id}`, {
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        
        if (response.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch destination");
        }

        const data = await response.json();
        setDestination(data);
      } catch (error) {
        console.error("Error fetching destination:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [params.id]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNavbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Destination Not Found</h1>
          <p className="text-gray-500 mb-8">
            The destination you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/trip-advisor"
            className="inline-block px-6 py-3 bg-[#003580] text-white font-semibold rounded-xl hover:bg-[#002a6e] transition-colors"
          >
            ← Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  if (!destination) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link
          href="/trip-advisor"
          className="inline-flex items-center gap-1.5 text-sm text-[#003580] font-medium hover:underline transition-colors"
        >
          ← Back to Destinations
        </Link>
      </div>

      {/* Hero Header */}
      <div
        className="mt-4 relative text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #003580 0%, #009fe3 60%, #00AF87 100%)" }}
      >
        {/* faint cover image overlay */}
        {destination.images && destination.images[0] && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
            style={{ backgroundImage: `url(${destination.images[0]})` }}
          />
        )}
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            {destination.name}
          </h1>
          {destination.country && destination.country !== destination.name && (
            <p className="text-white/70 text-lg mb-4">{destination.country}</p>
          )}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {destination.continent && (
              <span className="px-3 py-1 rounded-full border border-white/30 text-white text-sm bg-white/10">
                📍 {destination.continent}
              </span>
            )}
            {destination.expense && (
              <span className="px-3 py-1 rounded-full border border-white/30 text-white text-sm bg-white/10">
                💰 {destination.expense}
              </span>
            )}
            {destination.safetyLevel && (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                destination.safetyLevel === "Low"       ? "bg-emerald-400/30 border-emerald-300 text-emerald-100" :
                destination.safetyLevel === "Moderate"  ? "bg-amber-400/30  border-amber-300  text-amber-100"   :
                destination.safetyLevel === "High"      ? "bg-orange-400/30 border-orange-300 text-orange-100"  :
                                                          "bg-red-400/30    border-red-300    text-red-100"
              }`}>
                🛡️ {destination.safetyLevel} Risk
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-6">
          {/* Quick Facts */}
          {(destination.capital || destination.currency || destination.language || destination.bestTimeToVisit) && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick Facts</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {destination.capital && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Capital</p>
                    <p className="text-sm font-semibold text-gray-800">🏛️ {destination.capital}</p>
                  </div>
                )}
                {destination.currency && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Currency</p>
                    <p className="text-sm font-semibold text-gray-800">💵 {destination.currency}</p>
                  </div>
                )}
                {destination.language && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Language</p>
                    <p className="text-sm font-semibold text-gray-800">🗣️ {destination.language}</p>
                  </div>
                )}
                {destination.bestTimeToVisit && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Best Time to Visit</p>
                    <p className="text-sm font-semibold text-gray-800">📅 {destination.bestTimeToVisit}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* About Section */}
          <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">About</p>
            <p className="text-gray-700 leading-relaxed text-lg">
              {destination.details}
            </p>
          </section>

          {/* Images Grid (if available) */}
          {destination.images && destination.images.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {destination.images.slice(0, 4).map((image, i) => (
                <div key={i} className="h-56 rounded-xl overflow-hidden">
                  <img
                    src={image}
                    alt={`${destination.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </section>
          )}

          {/* Tourist Attractions */}
          {destination.whatToDo && destination.whatToDo.length > 0 && (
            <section className="bg-sky-50 rounded-2xl border border-sky-100 p-8">
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-5">🗺️ Top Tourist Attractions</p>
              <div className="space-y-3">
                {destination.whatToDo.map((attraction, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-sky-100"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#003580] rounded-full text-white text-sm font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{attraction}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Safety Section */}
          {destination.safetyLevel && (
            <section className={`rounded-2xl border p-8 ${
              destination.safetyLevel === "Low"        ? "bg-emerald-50 border-emerald-200" :
              destination.safetyLevel === "Moderate"   ? "bg-amber-50  border-amber-200"   :
              destination.safetyLevel === "High"       ? "bg-orange-50 border-orange-200"  :
                                                         "bg-red-50    border-red-200"
            }`}>
              <div className="flex items-center gap-3 mb-5">
                <p className={`text-xs font-semibold uppercase tracking-wider ${
                  destination.safetyLevel === "Low"      ? "text-emerald-600" :
                  destination.safetyLevel === "Moderate" ? "text-amber-600"   :
                  destination.safetyLevel === "High"     ? "text-orange-600"  :
                                                           "text-red-600"
                }`}>🛡️ Safety & Travel Caution</p>
                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                  destination.safetyLevel === "Low"       ? "bg-emerald-100 border-emerald-300 text-emerald-800" :
                  destination.safetyLevel === "Moderate"  ? "bg-amber-100  border-amber-300  text-amber-800"    :
                  destination.safetyLevel === "High"      ? "bg-orange-100 border-orange-300 text-orange-800"   :
                                                            "bg-red-100    border-red-300    text-red-800"
                }`}>
                  {destination.safetyLevel} Risk
                </span>
              </div>
              {destination.safetyTips && destination.safetyTips.length > 0 && (
                <ul className="space-y-3">
                  {destination.safetyTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs mt-0.5 ${
                        destination.safetyLevel === "Low"      ? "bg-emerald-500" :
                        destination.safetyLevel === "Moderate" ? "bg-amber-500"   :
                        destination.safetyLevel === "High"     ? "bg-orange-500"  :
                                                                  "bg-red-500"
                      }`}>!</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Packing List */}
          {destination.packingList && destination.packingList.length > 0 && (
            <section className="bg-amber-50 rounded-2xl border border-amber-200 p-8">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-4">🎒 Packing List</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destination.packingList.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tags */}
          {destination.tags && destination.tags.length > 0 && (
            <section className="flex flex-wrap gap-2">
              {destination.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-sm hover:border-[#003580] hover:text-[#003580] transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </section>
          )}

          {/* CTA Section */}
          <section
            className="rounded-2xl p-8 text-white text-center"
            style={{ background: "linear-gradient(135deg, #003580 0%, #009fe3 100%)" }}
          >
            <h3 className="text-2xl font-bold mb-3">Ready to explore {destination.name}?</h3>
            <p className="text-white/80 mb-6">
              Find travel companions who want to visit this destination!
            </p>
            <Link
              href="/discover"
              className="inline-block px-7 py-3 bg-white text-[#003580] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Find Companion →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default function DestinationDetail() {
  return (
    <Provider>
      <DestinationDetailPage />
    </Provider>
  );
}
