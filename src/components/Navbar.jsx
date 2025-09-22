import React, { useState } from 'react';
// 1. ADDED: Import NavLink instead of Link
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const isAdmin = user && user.roles.includes('ROLE_ADMIN');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // This function now calls navigate and closes the mobile menu
    const handleNavigateAndClose = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        handleNavigateAndClose('/');
    };
    
    // 2. ADDED: Helper functions for NavLink classes
    const getNavLinkClass = ({ isActive }) => {
        const baseClasses = 'text-gray-300 hover:text-red-400 transition-colors';
        const activeClass = 'text-red-400'; // Style for active links
        return isActive ? `${baseClasses} ${activeClass}` : baseClasses;
    };

    const getAdminNavLinkClass = ({ isActive }) => {
        const baseClasses = 'text-yellow-400 hover:text-yellow-300 transition-colors';
        const activeClass = 'text-yellow-300 font-bold'; // Style for active admin link
        return isActive ? `${baseClasses} ${activeClass}` : baseClasses;
    };

    const GameIcon = () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 8.5l-3 3-3-3M7.5 15.5l3-3 3 3M12 2a10 10 0 1 0 10 10c0-2.3-1.1-4.6-2.5-6.5C17.6 3.6 15.3 2 12 2z"></path></svg>
    );

    const ProfileIcon = () => (
      <svg className="w-4 h-3 text-gray-300 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
    );
    
    return (
        <nav className="bg-gray-800 border-b-2 border-red-600 p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
              {/* This section has nested Links, which is not ideal. Let's fix it to one NavLink */}
              <NavLink to="/mart" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300">
                  <GameIcon />
                  <span className="hidden sm:block text-xl sm:text-2xl font-bold text-white font-display tracking-wider">
                      ENDURABLY GAMIC
                  </span>
              </NavLink> 

                {/* 3. CHANGED: Desktop Menu Links updated to NavLinks */}
                <div className="hidden md:flex space-x-4 items-center">
                    <NavLink to="/" className={getNavLinkClass} end>Home</NavLink>
                    <NavLink to="/tournaments" className={getNavLinkClass}>Tournaments</NavLink>
                    {user ? (
                        <div className="flex items-center space-x-4 ">
                            <NavLink to="/submit" className={getNavLinkClass}>Submit Base</NavLink>
                            {isAdmin && <NavLink to="/admin-review" className={getAdminNavLinkClass}>Admin Review</NavLink>}
                            
                            <div className="flex flex-col items-center">
                                <p className="flex items-center text-xs text-gray-400"><ProfileIcon/> {user.email}</p>
                                <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-red-400">Logout</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <NavLink to="/login" className={getNavLinkClass}>Login</NavLink>
                            <NavLink to="/register" className="text-white bg-red-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors">Register</NavLink>
                        </div>
                    )}
                    
                    <NavLink to="/mart" className={getNavLinkClass}>
                        <div className="flex items-center">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>
                          <div className="flex flex-col text-xs items-center">
                            <span>Gamic</span>
                            <span>Mart</span>
                          </div>
                        </div>
                    </NavLink>
                </div>

                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
                    </button>
                </div>
            </div>

            {/* 4. CHANGED: Mobile menu now uses NavLinks instead of buttons */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 bg-gray-700 rounded-lg p-4">
                    <div className="flex flex-col space-y-4 items-start">
                        <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={getNavLinkClass} end>Home</NavLink>
                        <NavLink to="/tournaments" onClick={() => setMobileMenuOpen(false)} className={getNavLinkClass}>Tournaments</NavLink>
                        {user && <NavLink to="/submit" onClick={() => setMobileMenuOpen(false)} className={getNavLinkClass}>Submit Base</NavLink>}
                        {isAdmin && <NavLink to="/admin-review" onClick={() => setMobileMenuOpen(false)} className={getAdminNavLinkClass}>Admin Review</NavLink>}
                        {user ? (
                            <button onClick={handleLogout} className="text-gray-200 hover:text-red-400 text-left">Logout</button>
                        ) : (
                            <>
                                <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className={getNavLinkClass}>Login</NavLink>
                                <NavLink to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center text-white bg-red-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700">Register</NavLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;