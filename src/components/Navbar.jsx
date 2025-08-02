import React from 'react';

const Navbar = ({ userToken, onLogout, onNavigate }) => {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <button onClick={() => onNavigate('home')} className="text-xl md:text-2xl font-bold text-white">
          Endurably Gamic
        </button>
        <div className="flex space-x-4">
          <button onClick={() => onNavigate('home')} className="text-gray-300 hover:text-white transition-colors">Home</button>
          
          {userToken ? (
            <>
              {/* 3. This button is now functional */}
              <button onClick={() => onNavigate('submit')} className="text-gray-300 hover:text-white transition-colors">Submit Base</button>
              <button onClick={onLogout} className="text-gray-300 hover:text-white transition-colors">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')} className="text-gray-300 hover:text-white transition-colors">Login</button>
              <button onClick={() => onNavigate('register')} className="text-gray-300 hover:text-white transition-colors">Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
