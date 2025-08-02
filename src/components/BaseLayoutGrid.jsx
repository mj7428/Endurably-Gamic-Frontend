import React from 'react';

const BaseLayoutCard = ({ layout, apiBaseUrl }) => {
  const imageUrl = `${apiBaseUrl}${layout.imageUrl}`;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 group">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={layout.title} 
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1F2937/FFFFFF?text=Image+Not+Found`; }}
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded cursor-pointer hover:bg-blue-700 transition-colors duration-300">
          <a
            href={layout.baseLink}
            target="_blank"
            rel="noopener noreferrer"
            >
            Copy Link
            </a>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-blue-400 transition-colors cursor-pointer">{layout.title}</h3>
        <p className="text-gray-400 mb-4">Town Hall {layout.townhallLevel}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>
          <span>21.5k Views</span>
        </div>
      </div>
    </div>
  );
};


const BaseLayoutGrid = ({ layouts, loading, error, apiBaseUrl }) => {
  if (loading) return <p className="text-center text-xl">Loading bases...</p>;
  if (error) return <p className="text-center text-xl text-red-500">{error}</p>;
  if (layouts.length === 0) return <p className="text-center text-xl">No bases found for this Town Hall level.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {layouts.map(layout => (
        <BaseLayoutCard key={layout.id} layout={layout} apiBaseUrl={apiBaseUrl} />
      ))}
    </div>
  );
};

export default BaseLayoutGrid;
