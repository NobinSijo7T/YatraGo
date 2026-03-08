"use client";
import React, { useEffect } from "react";

const DetailModal = ({ isOpen, onClose, item, type }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const renderHotelDetails = () => (
    <>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {item.images && item.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={item.name}
            className="w-full h-64 object-cover rounded-xl"
          />
        ))}
      </div>

      <div className="space-y-5">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Location</h4>
          <p className="text-gray-700">📍 {item.address}</p>
          <p className="text-gray-500 text-sm">{item.city}, {item.country}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Price Range</h4>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm font-semibold">
              {item.priceRange}
            </span>
            {item.pricePerNight && (
              <span className="text-lg font-bold text-[#003580]">
                ${item.pricePerNight.min} – ${item.pricePerNight.max} / night
              </span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Rating & Reviews</h4>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-semibold">
              ⭐ {item.rating?.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">{item.reviewCount} reviews</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {item.amenities?.map((amenity, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {item.website && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Website</h4>
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#003580] underline text-sm hover:text-[#002a6e]"
            >
              Visit Website
            </a>
          </div>
        )}

        {item.phone && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</h4>
            <p className="text-gray-700 text-sm">📞 {item.phone}</p>
          </div>
        )}
      </div>
    </>
  );

  const renderActivityDetails = () => (
    <>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {item.images && item.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={item.name}
            className="w-full h-64 object-cover rounded-xl"
          />
        ))}
      </div>

      <div className="space-y-5">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Location</h4>
          <p className="text-gray-700">📍 {item.location}</p>
          <p className="text-gray-500 text-sm">{item.city}, {item.country}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Category</h4>
            <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-sm">
              {item.category}
            </span>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Difficulty</h4>
            <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-sm">
              {item.difficulty}
            </span>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Duration</h4>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm">
              {item.duration?.value} {item.duration?.unit}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Price</h4>
          <span className="text-xl font-bold text-[#003580]">
            ${item.price?.amount} {item.price?.currency}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">What's Included</h4>
          <ul className="space-y-1">
            {item.includedInPrice?.map((inc, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-center gap-1"><span className="text-emerald-500">✓</span> {inc}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">What to Bring</h4>
          <div className="flex flex-wrap gap-2">
            {item.whatToBring?.map((thing, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-sm"
              >
                {thing}
              </span>
            ))}
          </div>
        </div>

        {item.ageRestriction && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Age Restriction</h4>
            <p className="text-gray-700 text-sm">
              {item.ageRestriction.min} – {item.ageRestriction.max} years
            </p>
          </div>
        )}

        {item.website && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Website</h4>
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#003580] underline text-sm hover:text-[#002a6e]"
            >
              Book Now
            </a>
          </div>
        )}
      </div>
    </>
  );

  const renderRestaurantDetails = () => (
    <>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {item.images && item.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={item.name}
            className="w-full h-64 object-cover border-4 border-black"
          />
        ))}
      </div>

      <div className="space-y-5">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Location</h4>
          <p className="text-gray-700">📍 {item.address}</p>
          <p className="text-gray-500 text-sm">{item.city}, {item.country}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cuisine</h4>
          <div className="flex flex-wrap gap-2">
            {item.cuisine?.map((c, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Average Cost</h4>
          <span className="text-xl font-bold text-[#003580]">
            {item.averageCost?.currency} {item.averageCost?.amount}
            {item.averageCost?.perPerson && " / person"}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Dietary Options</h4>
          <div className="flex flex-wrap gap-2">
            {item.dietaryOptions?.map((option, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm"
              >
                {option}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Specialties</h4>
          <ul className="space-y-1">
            {item.specialties?.map((spec, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-center gap-1"><span className="text-orange-400">•</span> {spec}</li>
            ))}
          </ul>
        </div>

        {item.openingHours && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Opening Hours</h4>
            <p className="text-gray-700 text-sm">🕒 {item.openingHours}</p>
          </div>
        )}

        {item.website && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Website</h4>
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#003580] underline text-sm hover:text-[#002a6e]"
            >
              Visit Website
            </a>
          </div>
        )}

        {item.phone && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</h4>
            <p className="text-gray-700 text-sm">📞 {item.phone}</p>
          </div>
        )}

        {item.reservationRequired && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 font-semibold text-sm">⚠️ Reservation Required</p>
          </div>
        )}
      </div>
    </>
  );

  const renderStoryDetails = () => (
    <>
      {item.coverImage && (
        <img
          src={item.coverImage}
          alt={item.title}
          className="w-full h-96 object-cover rounded-xl mb-6"
        />
      )}

      <div className="space-y-4">
        {item.author && (
          <div className="flex items-center gap-3 p-4 bg-[#003580]/5 rounded-xl">
            <div className="w-11 h-11 bg-[#003580] rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
              {item.author.avatar ? (
                <img
                  src={item.author.avatar}
                  alt={item.author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                (item.author.name?.[0] || 'T').toUpperCase()
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{item.author.name || 'Anonymous'}</p>
              <p className="text-xs text-gray-500">{item.author.email}</p>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Destinations</h4>
          <div className="flex flex-wrap gap-2">
            {item.countries?.map((country, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm"
              >
                📍 {country}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Trip Details</h4>
          <div className="grid md:grid-cols-3 gap-3">
            {item.tripType && (
              <span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium text-center">
                {item.tripType}
              </span>
            )}
            {item.tripDuration && (
              <span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium text-center">
                🕒 {item.tripDuration.value} {item.tripDuration.unit}
              </span>
            )}
            {item.budget?.amount && (
              <span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium text-center">
                💰 ${item.budget.amount}
              </span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {item.categories?.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-full text-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {item.excerpt && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Summary</h4>
            <p className="text-gray-600 leading-relaxed text-sm">{item.excerpt}</p>
          </div>
        )}

        {item.tips && item.tips.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">💡 Tips</h4>
            <ul className="space-y-1">
              {item.tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-1"><span className="text-amber-500 mt-0.5">•</span> {tip}</li>
              ))}
            </ul>
          </div>
        )}

        {item.highlights && item.highlights.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">✨ Highlights</h4>
            <ul className="space-y-1">
              {item.highlights.map((highlight, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-1"><span className="text-sky-500 mt-0.5">✦</span> {highlight}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          {item.likes !== undefined && (
            <span className="text-sm text-gray-600">❤️ {item.likes} likes</span>
          )}
          {item.views !== undefined && (
            <span className="text-sm text-gray-600">👁️ {item.views} views</span>
          )}
          {item.rating && (
            <span className="text-sm text-gray-600">⭐ {item.rating.toFixed(1)}</span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.16)] max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-start justify-between z-10">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{item.name || item.title}</h2>
            {item.city && item.country && (
              <p className="text-sm text-gray-500">📍 {item.city}, {item.country}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed text-base">
              {item.description || item.content}
            </p>
          </div>

          {type === "hotels" && renderHotelDetails()}
          {type === "activities" && renderActivityDetails()}
          {type === "restaurants" && renderRestaurantDetails()}
          {type === "stories" && renderStoryDetails()}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
