import React from "react";

const ActivityCard = ({ activity, onClick }) => {
  const categoryEmojis = {
    Adventure: '🏔️', Cultural: '🎭', Nature: '🌿',
    Historical: '🏛️', Entertainment: '🎪', Sports: '⚽',
    Wellness: '🧘', 'Food & Drink': '🍷',
  };
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
        {activity.images && activity.images[0] ? (
          <img
            src={activity.images[0]}
            alt={activity.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
            <span className="text-5xl opacity-40">{categoryEmojis[activity.category] || '🎭'}</span>
          </div>
        )}
        {activity.category && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {activity.category}
          </div>
        )}
        {activity.difficulty && (
          <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {activity.difficulty}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {activity.name}
          </h3>
          {activity.rating > 0 && (
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <span className="text-sm font-bold text-gray-800">{activity.rating.toFixed(1)}</span>
              <div className="flex text-xs">{renderStars(activity.rating)}</div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {activity.city}, {activity.country}
        </p>

        {activity.duration && (
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-teal-50 text-teal-700 text-xs px-2.5 py-1 rounded-full border border-teal-100">
              ⏱ {activity.duration.value} {activity.duration.unit}
            </span>
            {activity.priceRange && (
              <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full border border-amber-100">
                {activity.priceRange}
              </span>
            )}
          </div>
        )}

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{activity.description}</p>

        {activity.tags && activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activity.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="bg-gray-50 text-gray-500 text-xs px-2.5 py-1 rounded-full border border-gray-200">#{tag}</span>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
          {activity.price && activity.price.amount > 0 ? (
            <p className="text-lg font-bold text-[#003580]">
              {activity.price.currency} {activity.price.amount}
            </p>
          ) : (
            <p className="text-base font-semibold text-emerald-600">
              {activity.priceRange === 'Free' ? 'Free' : 'Varies'}
            </p>
          )}
          {activity.reviewCount > 0 && (
            <span className="text-xs text-gray-400">{activity.reviewCount} reviews</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
