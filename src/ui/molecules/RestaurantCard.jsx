import React from "react";

const RestaurantCard = ({ restaurant, onClick }) => {
  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"}>★</span>
    ));

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer border border-gray-100"
    >
      {/* Image */}
      <div className="h-52 relative overflow-hidden bg-gray-50">
        {restaurant.images && restaurant.images[0] ? (
          <img
            src={restaurant.images[0]}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
            <span className="text-5xl opacity-30">🍽️</span>
          </div>
        )}
        {restaurant.priceRange && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {restaurant.priceRange}
          </div>
        )}
        {restaurant.restaurantType && (
          <div className="absolute top-3 left-3 bg-orange-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {restaurant.restaurantType}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {restaurant.name}
          </h3>
          {restaurant.rating > 0 && (
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <span className="text-sm font-bold text-gray-800">{restaurant.rating.toFixed(1)}</span>
              <div className="flex text-xs">{renderStars(restaurant.rating)}</div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {restaurant.city}, {restaurant.country}
        </p>

        {restaurant.cuisine && restaurant.cuisine.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {restaurant.cuisine.slice(0, 3).map((c, i) => (
              <span key={i} className="bg-orange-50 text-orange-600 text-xs px-2.5 py-1 rounded-full border border-orange-100">
                {c}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{restaurant.description}</p>

        {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {restaurant.dietaryOptions.slice(0, 3).map((opt, i) => (
              <span key={i} className="bg-green-50 text-green-600 text-xs px-2.5 py-1 rounded-full border border-green-100">
                {opt}
              </span>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
          {restaurant.averageCost && restaurant.averageCost.amount > 0 ? (
            <p className="text-lg font-bold text-gray-900">
              {restaurant.averageCost.currency} {restaurant.averageCost.amount}
              {restaurant.averageCost.perPerson && <span className="text-xs font-normal text-gray-400"> /person</span>}
            </p>
          ) : (
            <span className="text-sm text-gray-400">{restaurant.priceRange}</span>
          )}
          {restaurant.reviewCount > 0 && (
            <span className="text-xs text-gray-400">{restaurant.reviewCount} reviews</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
