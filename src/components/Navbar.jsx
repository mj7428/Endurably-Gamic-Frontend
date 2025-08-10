import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Make sure this path is correct

const Navbar = ({ onLogout, onNavigate }) => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false); // Close menu on navigation
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <button 
          onClick={() => handleNavigate('home')} 
          className="text-xl sm:text-2xl font-bold text-white font-display tracking-wider"
        >
          ENDURABLY GAMIC
        </button>

        {/* Desktop Menu - Hidden on small screens */}
        <div className="hidden md:flex space-x-4 items-center">
          <button onClick={() => handleNavigate('home')} className="text-gray-300 hover:text-blue-400 transition-colors">Home</button>
          <button onClick={() => handleNavigate('tournaments')} className="text-gray-300 hover:text-blue-400 transition-colors">Tournaments</button>
          {user ? (
            <>
              <button onClick={() => handleNavigate('submit')} className="text-gray-300 hover:text-blue-400 transition-colors">Submit Base</button>
              <button onClick={onLogout} className="text-gray-300 hover:text-red-400 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => handleNavigate('login')} className="text-gray-300 hover:text-blue-400 transition-colors">Login</button>
              <button onClick={() => handleNavigate('register')} className="text-white bg-blue-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors">Register</button>
            </>
          )}
        </div>

        {/* Mobile Menu Button - Visible only on small screens */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-gray-700 rounded-lg p-4">
          <div className="flex flex-col space-y-4">
            <button onClick={() => handleNavigate('home')} className="text-gray-200 hover:text-blue-400 text-left">Home</button>
            <button onClick={() => handleNavigate('tournaments')} className="text-gray-200 hover:text-blue-400 text-left">Tournaments</button>
            {user ? (
              <>
                <button onClick={() => handleNavigate('submit')} className="text-gray-200 hover:text-blue-400 text-left">Submit Base</button>
                <button onClick={onLogout} className="text-gray-200 hover:text-red-400 text-left">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavigate('login')} className="text-gray-200 hover:text-blue-400 text-left">Login</button>
                <button onClick={() => handleNavigate('register')} className="w-full text-white bg-blue-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700">Register</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
