import React from 'react';
import { API_BASE_URL } from '../config';

// A single, self-contained card component
const BaseLayoutCard = ({ layout }) => {
  const imageUrl = `${API_BASE_URL}${layout.imageUrl}`;

  return (
    <div className="bg-brand-surface rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 group">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={layout.title} 
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1F2937/FFFFFF?text=Image+Not+Found`; }}
        />
        <div className="absolute top-2 right-2 bg-accent-blue text-white text-xs font-bold px-2 py-1 rounded">
          with Link
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-accent-blue transition-colors">{layout.title}</h3>
        <p className="text-gray-400 mb-4">Town Hall {layout.townhallLevel}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
          <span>21.5k Views</span>
        </div>
      </div>
    </div>
  );
};


// The grid component that arranges the cards
const BaseLayoutGrid = ({ layouts, loading, error, lastBaseElementRef }) => {
  // Show an error message if the API call fails
  if (error && layouts.length === 0) return <p className="text-center text-xl text-accent-red">{error}</p>;
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {layouts.map((layout, index) => {
          // If this is the last layout in the current list, attach the ref to it.
          // This is the "sensor" for the infinite scroll.
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
      
      {/* Show a loading message at the bottom while fetching the next page */}
      {loading && <p className="text-center text-xl mt-8">Loading more bases...</p>}
      
      {/* Show a message if there are no results at all */}
      {!loading && layouts.length === 0 && <p className="text-center text-xl mt-8">No bases found for this Town Hall level.</p>}
    </>
  );
};

export default BaseLayoutGrid;
