import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onLogout, onNavigate }) => {
  const { user } = useAuth();
  const isAdmin = user && user.roles.includes('ROLE_ADMIN');

  return (
    <nav className="bg-brand-surface p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <button 
          onClick={() => onNavigate('home')} 
          className="text-2xl font-bold text-white font-display tracking-wider cursor-pointer"
        >
          ENDURABLY GAMIC
        </button>
        <div className="flex space-x-4 items-center">
          <button onClick={() => onNavigate('home')} className="text-gray-300 hover:text-accent-blue transition-colors cursor-pointer">Home</button>
          <button onClick={() => onNavigate('tournaments')} className="text-gray-300 hover:text-accent-blue transition-colors cursor-pointer">Tournaments</button>
          
          {user ? (
            <>
              <button onClick={() => onNavigate('submit')} className="text-gray-300 hover:text-accent-blue transition-colors cursor-pointer">Submit Base</button>
              <button onClick={onLogout} className="text-gray-300 hover:text-accent-red transition-colors cursor-pointer">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')} className="text-gray-300 hover:text-accent-blue transition-colors cursor-pointer">Login</button>
              <button onClick={() => onNavigate('register')} className="text-white bg-accent-blue px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-500 cursor-pointer">Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
