import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

    // Helper Components for Icons
    const CartIcon = () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
    );
    const GameIcon = () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 8.5l-3 3-3-3M7.5 15.5l3-3 3 3M12 2a10 10 0 1 0 10 10c0-2.3-1.1-4.6-2.5-6.5C17.6 3.6 15.3 2 12 2z"></path></svg>
    );

    const ProfileIcon = () => (
        <svg className="w-4 h-3 text-gray-300 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
    );

    return (
        <nav className="bg-gray-800 border-b-2 border-red-600 p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                
                <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300">
                    <GameIcon />
                    <span className="hidden sm:block text-xl font-bold font-display tracking-wider">ENDURABLY GAMIC</span>
                </Link>
                
                <div className="hidden lg:block text-xl font-bold text-gray-100 hover:text-red-400 transition-colors duration-300 font-display tracking-wider">
                    GAMIC MART
                </div>

                {/* Right Side: Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/mart" className="text-gray-300 hover:text-red-400 transition-colors">Mart Home</Link>
                    {isAdmin && <Link to="/admin-review" className="text-yellow-300 hover:text-yellow-400 transition-colors">Admin Review</Link>}
                    {user ? (
                        <>
                            <Link to="/mart/my-orders" className="text-gray-300 hover:text-red-400">My Orders</Link>
                            <Link to="/mart/cart" className="relative text-gray-300 hover:text-white transition-colors duration-300">
                                <CartIcon />
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                            <div className="flex flex-col items-center">
                                <p className="flex items-center text-xs text-gray-400"><ProfileIcon/> {user.email}</p>
                                <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-red-400">Logout</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-red-400 transition-colors">Login</Link>
                            <Link to="/register" className="text-white bg-red-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors">Register</Link>
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
                        <Link to="/mart" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-red-400 text-left">Mart Home</Link>
                        {user ? (
                            <>
                                <Link to="/mart/my-orders" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-red-400 text-left">My Orders</Link>
                                <button onClick={handleLogout} className="text-gray-200 hover:text-red-400 text-left">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-red-400 text-left">Login</Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center text-white bg-red-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default MartNavbar;

