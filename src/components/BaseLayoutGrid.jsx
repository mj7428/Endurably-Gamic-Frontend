import React from 'react';

const BaseLayoutCard = ({ layout }) => {

  const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
    </svg>
  );
  
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 group">
      
      <div className="relative">
        <img 
          src={layout.imageUrl} 
          alt={layout.title} 
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1F2937/FFFFFF?text=Image+Not+Found`; }}
        />
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-lg">
          TH {layout.townhallLevel}
        </div>
      </div>
      
      <div className="p-4 flex flex-col h-56 justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-100 mb-2 h-14 overflow-hidden group-hover:text-blue-400 transition-colors">
            {layout.title}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            By {layout.submittedByUsername}
          </p>
        </div>
        
        <div className="mt-auto">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                    <EyeIcon />
                    <span>21.5k Views</span>
                </div>
                <div className="flex items-center space-x-1 text-yellow-400">
                    <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                </div>
            </div>

            <a 
              href={layout.baseLink}
              target="_blank" // Opens the link in a new tab
              rel="noopener noreferrer" // Security best practice for new tabs
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <LinkIcon />
              Open Link
            </a>
        </div>
      </div>
    </div>
  );
};

const BaseLayoutGrid = ({ layouts, loading, error, lastBaseElementRef }) => {
  if (error && layouts.length === 0) return <p className="text-center text-xl text-red-500">{error}</p>;
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
