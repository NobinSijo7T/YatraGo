"use client";
import React from "react";
import Link from "next/link";

const safetyConfig = {
  Low:       { label: "Low Risk",       color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Moderate:  { label: "Moderate Risk",  color: "bg-amber-50  text-amber-700  border-amber-200"  },
  High:      { label: "High Risk",      color: "bg-orange-50 text-orange-700 border-orange-200" },
  "Very High":{ label: "Very High Risk", color: "bg-red-50   text-red-700   border-red-200"   },
};

const expenseConfig = {
  Budget:    { label: "Budget",    color: "bg-sky-50    text-sky-700    border-sky-200"    },
  "Mid-range":{ label: "Mid-range", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  Luxury:    { label: "Luxury",    color: "bg-purple-50 text-purple-700 border-purple-200" },
};

const DestinationCard = ({ destination }) => {
  if (!destination) return null;

  const coverImage =
    (destination.images && destination.images[0]) ||
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";

  const safety  = safetyConfig[destination.safetyLevel]  || safetyConfig["Moderate"];
  const expense = expenseConfig[destination.expense]      || expenseConfig["Mid-range"];

  return (
    <Link
      href={`/trip-advisor/${destination._id}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={coverImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Continent badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-sm">
          {destination.continent}
        </span>
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Name & country */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#003580] transition-colors">
            {destination.name}
          </h3>
          {destination.capital && (
            <p className="text-sm text-gray-500 mt-0.5">
              🏛️ {destination.capital}
              {destination.currency ? ` · ${destination.currency}` : ""}
            </p>
          )}
          {destination.bestTimeToVisit && (
            <p className="text-xs text-gray-400 mt-0.5">
              📅 Best time: {destination.bestTimeToVisit}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
          {destination.details}
        </p>

        {/* Badges row */}
        <div className="flex items-center flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${safety.color}`}>
            🛡️ {safety.label}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${expense.color}`}>
            💰 {expense.label}
          </span>
          {destination.whatToDo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-xs font-medium">
              🗺️ {destination.whatToDo.length} attractions
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {destination.tags?.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-xs text-gray-400">#{tag}</span>
            ))}
          </div>
          <span className="text-xs font-semibold text-[#003580] group-hover:underline">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
