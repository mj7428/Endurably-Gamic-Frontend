import React from 'react';

const Header = ({ activeTownHall, setActiveTownHall, setSearchTerm }) => {
  const townHallLevels = [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3];

  return (
    <header className="bg-gray-800/50 py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">Town Hall Bases</h2>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {townHallLevels.map(th => (
            <button
              key={th}
              onClick={() => setActiveTownHall(th)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                activeTownHall === th 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              TH {th}
            </button>
          ))}
        </div>
        {/* We can add the search input here later */}
      </div>
    </header>
  );
};

export default Header;
