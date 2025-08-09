import React from 'react';

// NEW: StarRating component to display fractional ratings
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let fillPercentage = '0%';
    if (i < rating) {
      fillPercentage = '100%';
    } else if (i === Math.ceil(rating)) {
      fillPercentage = `${(rating - Math.floor(rating)) * 100}%`;
    }

    stars.push(
      <div key={i} className="relative">
        {/* Background star is now gray */}
        <span className="text-gray-300">★</span>
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: fillPercentage }}
        >
          {/* Foreground (fill) star is yellow */}
          <span className="text-yellow-400">★</span>
        </div>
      </div>
    );
  }
  return <div className="flex items-center">{stars}</div>;
};


// Main Component for the Base Layout Card
const BaseLayoutCard = ({ layout }) => {

  // Helper component for the Link icon
  const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l-1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
    </svg>
  );
  
  // Helper component for the Views icon
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-blue-500/50 hover:-translate-y-1 group flex flex-col h-70">
      
      {/* Image Section */}
      <div className="relative">
        <img 
          src={layout.imageUrl} 
          alt={layout.title} 
          className="w-full h-40 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1F2937/FFFFFF?text=Image+Not+Found`; }}
        />
        {/* Townhall Level Indicator (Top Right) */}
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-lg">
          TH {layout.townhallLevel}
        </div>
        {/* Star Rating (Top Left) */}
        <div className="absolute top-1 left-1 flex items-center space-x-1">
            <StarRating rating={3.5} />
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-3 flex flex-col flex-grow justify-between"> 
        <div>
          {/* Title now clamps to 2 lines with an ellipsis (...) */}
          <h3 className="text-md font-bold text-gray-100 mb-1 group-hover:text-blue-400 transition-colors h-12 line-clamp-2">
            {layout.title}
          </h3>
        </div>
        
        {/* Combined Info and Action Section */}
        <div className="mt-2 flex items-end justify-between">
            {/* Left side: Info */}
            <div className="text-xs">
                <p className="text-gray-400">
                    By {layout.submittedByUsername}
                </p>
                <div className="flex items-center text-gray-500 mt-1">
                    <EyeIcon />
                    <span>21.5k Views</span>
                </div>
            </div>

            {/* Right side: Action Link (styled as a button) */}
            <a 
              href={layout.baseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-xs"
            >
              <LinkIcon />
              Open Link
            </a>
        </div>
      </div>
    </div>
  );
};

// Component to render the grid of BaseLayoutCards
const BaseLayoutGrid = ({ layouts, loading, error, lastBaseElementRef }) => {
  if (error && layouts.length === 0) return <p className="text-center text-xl text-red-500">{error}</p>;
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {layouts.map((layout, index) => {
          if (layouts.length === index + 1) {
            return (
              <div ref={lastBaseElementRef} key={layout.id}>
                <BaseLayoutCard layout={layout} />
              </div>
            );
          } else {
            return <BaseLayoutCard key={layout.id} layout={layout} />;
          }
        })}
      </div>
      
      {loading && <p className="text-center text-xl mt-8 text-gray-400">Loading more bases...</p>}
      
      {!loading && layouts.length === 0 && <p className="text-center text-xl mt-8 text-gray-400">No bases found for this Town Hall level.</p>}
    </>
  );
};

export default BaseLayoutGrid;
