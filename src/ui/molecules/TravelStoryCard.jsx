import React from "react";

const TravelStoryCard = ({ story, onClick }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer border border-gray-100"
    >
      {/* Cover Image */}
      <div className="h-52 relative overflow-hidden bg-gray-50">
        {story.coverImage || (story.images && story.images[0]) ? (
          <img
            src={story.coverImage || story.images[0]}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100">
            <span className="text-5xl opacity-30">✈️</span>
          </div>
        )}
        {story.featured && (
          <div className="absolute top-3 right-3 bg-amber-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            ★ Featured
          </div>
        )}
        {story.tripType && (
          <div className="absolute top-3 left-3 bg-white/90 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {story.tripType}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {story.author && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-[#009fe3] rounded-full flex items-center justify-center text-white text-xs font-semibold overflow-hidden flex-shrink-0">
              {story.author.avatar ? (
                <img src={story.author.avatar} alt={story.author.name || ''} className="w-full h-full object-cover" />
              ) : (
                (story.author.name?.[0] || 'T').toUpperCase()
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700">{story.author.name || 'Anonymous'}</p>
              {story.createdAt && <p className="text-xs text-gray-400">{formatDate(story.createdAt)}</p>}
            </div>
          </div>
        )}

        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#003580] transition-colors">
          {story.title}
        </h3>

        {story.countries && story.countries.length > 0 && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {story.countries.slice(0, 2).join(', ')}
            {story.countries.length > 2 && ` +${story.countries.length - 2}`}
          </p>
        )}

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {story.excerpt || (story.content ? story.content.substring(0, 130) + '…' : 'No description available')}
        </p>

        {story.categories && story.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {story.categories.slice(0, 3).map((cat, i) => (
              <span key={i} className="bg-sky-50 text-sky-600 text-xs px-2.5 py-1 rounded-full border border-sky-100">{cat}</span>
            ))}
            {story.categories.length > 3 && (
              <span className="bg-gray-50 text-gray-400 text-xs px-2.5 py-1 rounded-full border border-gray-200">+{story.categories.length - 3}</span>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {story.likes > 0 && <span className="flex items-center gap-1">♥ {story.likes}</span>}
            {story.views > 0 && <span className="flex items-center gap-1">👁 {story.views}</span>}
            {story.tripDuration?.value && (
              <span>🕒 {story.tripDuration.value} {story.tripDuration.unit}</span>
            )}
          </div>
          {story.rating > 0 && (
            <span className="text-xs font-semibold text-amber-500">★ {story.rating.toFixed(1)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
