import React, { useState } from 'react';
// 1. Import NavLink instead of Link
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MartNavbar = () => {
    const { user, cart, logout } = useAuth();
    const isAdmin = user && user.roles.includes('ROLE_ADMIN');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigateAndCloseMenu = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        navigate('/'); // Navigate to main home after logout
    };

    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // Helper function for nav link classes to avoid repetition
    const getNavLinkClass = ({ isActive }) => {
        const baseClasses = 'text-gray-300 hover:text-red-400 transition-colors';
        const activeClass = 'text-red-400'; 
        return isActive ? `${baseClasses} ${activeClass}` : baseClasses;
    };
    
    // Helper for the admin link which has different base colors
    const getAdminNavLinkClass = ({ isActive }) => {
        const baseClasses = 'text-yellow-300 hover:text-yellow-400 transition-colors';
        const activeClass = 'text-yellow-400 font-bold'; 
        return isActive ? `${baseClasses} ${activeClass}` : baseClasses;
    };


    // Helper Components for Icons (no changes here)
    const CartIcon = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg> );
    const GameIcon = () => ( <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 8.5l-3 3-3-3M7.5 15.5l3-3 3 3M12 2a10 10 0 1 0 10 10c0-2.3-1.1-4.6-2.5-6.5C17.6 3.6 15.3 2 12 2z"></path></svg> );
    const ProfileIcon = () => ( <svg className="w-4 h-3 text-gray-300 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg> );

    return (
        <nav className="bg-gray-800 border-b-2 border-red-600 p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                
                <NavLink to="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300">
                    <GameIcon />
                    <span className="hidden sm:block text-xl font-bold font-display tracking-wider">ENDURABLY GAMIC</span>
                </NavLink>
                
                <div className="hidden lg:block text-xl font-bold text-gray-100 hover:text-red-400 transition-colors duration-300 font-display tracking-wider">
                    GAMIC MART
                </div>

                {/* Right Side: Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* 2. Replace Link with NavLink and use the function for className */}
                    <NavLink to="/mart" className={getNavLinkClass} end>Mart Home</NavLink>
                    {isAdmin && <NavLink to="/admin-review" className={getAdminNavLinkClass}>Admin Review</NavLink>}
                    {user ? (
                        <>
                            <NavLink to="/mart/my-orders" className={getNavLinkClass}>My Orders</NavLink>
                            <NavLink to="/mart/cart" className={({isActive}) => isActive ? 'text-red-400 relative' : 'text-gray-300 hover:text-red-500 relative transition-colors duration-300'}>
                                <CartIcon />
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </NavLink>
                            <div className="flex flex-col items-center">
                                <p className="flex items-center text-xs text-gray-400"><ProfileIcon/> {user.email}</p>
                                <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-red-400">Logout</button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* For Login/Register, NavLink is fine but you might not want an active state */}
                            <NavLink to="/login" className={getNavLinkClass}>Login</NavLink>
                            <NavLink to="/register" className="text-white bg-red-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors">Register</NavLink>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 bg-gray-700 rounded-lg p-4">
                    <div className="flex flex-col space-y-4">
                        {/* 3. Apply the same NavLink logic to the mobile menu */}
                        <NavLink to="/mart" onClick={() => setMobileMenuOpen(false)} className={getNavLinkClass} end>Mart Home</NavLink>
                        {user ? (
                            <>
                                <NavLink to="/mart/my-orders" onClick={() => setMobileMenuOpen(false)} className={getNavLinkClass}>My Orders</NavLink>
                                <button onClick={handleLogout} className="text-gray-200 hover:text-red-400 text-left">Logout</button>
                            </>
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

export default MartNavbar;