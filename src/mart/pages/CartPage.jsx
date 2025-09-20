import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import martService from '../services/martService';
import { Link, useNavigate } from 'react-router-dom';


const CouponManager = () => {
    const { cart, setCart } = useAuth();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [offers, setOffers] = useState([]);
    const [loadingOffers, setLoadingOffers] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const dropdownRef = useRef(null);

    // Fetch offers when the dropdown is opened
    useEffect(() => {
        if (isDropdownOpen) {
            const fetchOffers = async () => {
                setLoadingOffers(true);
                try {
                    const response = await martService.discoverCoupons();
                    setOffers(response.data);
                } catch (err) {
                    console.error("Failed to fetch offers", err);
                } finally {
                    setLoadingOffers(false);
                }
            };
            fetchOffers();
        }
    }, [isDropdownOpen]);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);


    const handleApplyCoupon = async (code) => {
        setError('');
        setSuccess('');
        try {
            const response = await martService.applyCoupon(code);
            setCart(response.data);
            setSuccess('Coupon applied!');
            setManualCode('');
            setDropdownOpen(false); // Close dropdown on success
        } catch (err) {
            setError(err.response?.data || "Invalid or expired coupon code.");
        }
    };

    const handleRemoveCoupon = async () => {
        try {
            const response = await martService.removeCoupon();
            setCart(response.data);
        } catch (err) {
            console.error("Failed to remove coupon", err);
        }
    };
    
    const eligibleOffers = offers.filter(o => o.status === 'ELIGIBLE');
    const lockedOffers = offers.filter(o => o.status === 'LOCKED');

    return (
        <div className="pt-4 border-t border-gray-700 space-y-4" ref={dropdownRef}>
            {/* Section to display the currently applied coupon */}
            {cart?.appliedCoupon && (
                <div className={`${cart.appliedCoupon.isAutomatic ? 'bg-blue-900/50' : 'bg-green-900/50'} p-3 rounded-lg text-center`}>
                    <div className="flex justify-between items-center mb-1">
                        <p className={`text-sm font-semibold ${cart.appliedCoupon.isAutomatic ? 'text-blue-300' : 'text-green-300'}`}>
                            {cart.appliedCoupon.isAutomatic ? 'Best Deal Applied!' : 'Coupon Applied!'}
                        </p>
                        {!cart.appliedCoupon.automatic && (
                            <button onClick={handleRemoveCoupon} className="text-xs text-red-400 hover:underline">Remove</button>
                        )}
                    </div>
                    <p className="text-sm text-gray-300">"{cart.appliedCoupon.description}"</p>
                </div>
            )}

            {/* Section for manual input and discovering other offers */}
            <div className="relative">
                 <form onSubmit={(e) => { e.preventDefault(); handleApplyCoupon(manualCode); }} className="space-y-2">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                            placeholder="Enter Coupon Code"
                            className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button type="submit" className="bg-gray-600 text-white px-4 rounded-lg font-semibold hover:bg-gray-500 text-sm">
                            Apply
                        </button>
                    </div>
                    {error && <p className="text-xs text-red-400">{error}</p>}
                    {success && <p className="text-xs text-green-400">{success}</p>}
                        
                </form>
                
                <div className='flex items-center justify-center mt-2'>
                    <button onClick={() => setDropdownOpen(!isDropdownOpen)} className=" text-xs text-center text-red-400 font-semibold hover:text-red-500 hover:underline transition-colors ">
                        View All Available Offers
                    </button>
                </div>
                {isDropdownOpen && (
                    <div className="absolute bottom-full mb-2 w-full bg-gray-700 rounded-lg shadow-2xl z-20 p-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                        {loadingOffers ? (
                            <p className="text-gray-300 text-sm">Loading...</p>
                        ) : (
                            <div className="space-y-3">
                                 {eligibleOffers.map(({ coupon }, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white text-sm">{coupon.code}</p>
                                            <p className="text-xs text-gray-300">{coupon.description}</p>
                                        </div>
                                        <button onClick={() => handleApplyCoupon(coupon.code)} className="bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded hover:bg-red-700">Apply</button>
                                    </div>
                                ))}
                                {lockedOffers.map(({ coupon, message }, index) => (
                                     <div key={index} className="opacity-50">
                                        <p className="font-bold text-white text-sm">{coupon.code}</p>
                                        <p className="text-xs text-gray-400">{coupon.description}</p>
                                        <p className="text-xs text-yellow-400 mt-1">{message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const CartItemRow = ({ item, quantity, onRemove, onUpdateQuantity }) => {
    const isOutOfStock = item.stockQuantity <= 0;
    const hasDiscount = item.salePrice && item.salePrice < item.price;

    return (
        <div className={`bg-gray-800 p-4 rounded-lg flex items-center relative overflow-hidden ${isOutOfStock ? 'opacity-60' : ''}`}>
            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4 flex-shrink-0"/>
            <div className="flex-grow">
                <h3 className="font-bold text-white">{item.name}</h3>
                {hasDiscount ? (
                    <div className="flex items-baseline space-x-2">
                        <p className="text-sm text-red-400">₹{item.salePrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 line-through">₹{item.price.toFixed(2)}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">₹{item.price.toFixed(2)}</p>
                )}
                {isOutOfStock && (
                    <span className="mt-1 inline-block bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-1 rounded-full">
                        Out of Stock
                    </span>
                )}
            </div>
            <div className="flex items-center space-x-3 mx-4">
                <button onClick={() => onUpdateQuantity(item.id, quantity - 1)} disabled={quantity <= 1} className="bg-gray-700 w-8 h-8 rounded-full disabled:opacity-50">-</button>
                <span className="text-white font-semibold">{quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, quantity + 1)} className="bg-gray-700 w-8 h-8 rounded-full">+</button>
            </div>
            <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 z-10">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </button>
        </div>
    );
};

// ============================================================================
// Main CartPage Component
// ============================================================================
const CartPage = () => {
    const { cart, setCart, fetchCart } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCart = async () => {
            if (cart === null) {
                await fetchCart();
            }
            setIsLoading(false);
        };
        loadCart();
    }, [cart, fetchCart]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const response = await martService.updateItemQuantityFromCart(itemId, newQuantity);
            setCart(response.data);
        } catch (error) {
            console.error("Failed to update quantity", error);
        }
    };
    
    const handleRemoveItem = async (itemId) => {
        try {
            const response = await martService.removeItemFromCart(itemId);
            setCart(response.data);
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    const handleCheckout = () => {
        navigate('/mart/checkout');
    };

    if (isLoading) {
        return <p className="text-center text-xl p-8">Loading your cart...</p>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
                <p className="text-gray-400 mb-6">Looks like you haven't added any items yet.</p>
                <Link to="/mart" className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const originalSubtotal = cart.items.reduce((acc, { item, quantity }) => {
        return acc + (item.price * quantity);
    }, 0);
    
    const totalDiscount = originalSubtotal - cart.totalPrice;
    const isAnyItemOutOfStock = cart.items.some(({ item }) => item.stockQuantity <= 0);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-white mb-6">Your Shopping Cart</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map(({ item, quantity }) => (
                        <CartItemRow 
                            key={item.id} 
                            item={item} 
                            quantity={quantity} 
                            onRemove={handleRemoveItem}
                            onUpdateQuantity={handleUpdateQuantity}
                        />
                    ))}
                </div>
                <div className="bg-gray-800 p-6 rounded-lg h-fit lg:sticky lg:top-24">
                    <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-4 mb-4">Order Summary</h3>
                    <div className="space-y-2 text-gray-300">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{cart.originalSubtotal.toFixed(2)}</span>
                        </div>
                        
                        {cart.productDiscount > 0 && (
                            <div className="flex justify-between text-green-400">
                                <span>Product Discounts</span>
                                <span>- ₹{cart.productDiscount.toFixed(2)}</span>
                            </div>
                        )}
                        
                        {cart.couponDiscount > 0 && (
                            <div className="flex justify-between text-green-400">
                                <span>Coupon Discount</span>
                                <span>- ₹{cart.couponDiscount.toFixed(2)}</span>
                            </div>
                        )}

                        {cart.totalSaved > 0 && (
                             <div className="flex justify-between font-semibold text-green-300 pt-2 border-t border-gray-700/50">
                                <span>You Saved</span>
                                <span>₹{cart.totalSaved.toFixed(2)}</span>
                            </div>
                        )}
                        
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>FREE</span>
                        </div>

                        <div className="flex justify-between font-bold text-white text-lg pt-4 border-t border-gray-700">
                            <span>Grand Total</span>
                            <span>₹{cart.finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-lg h-fit lg:sticky lg:top-24 space-y-4">
                        <CouponManager />
                    </div>
                    
                    {isAnyItemOutOfStock && (
                        <p className="text-sm text-yellow-400 text-center my-4">
                            Please remove out-of-stock items to proceed.
                        </p>
                    )}
                    <button 
                        onClick={handleCheckout}
                        disabled={isAnyItemOutOfStock}
                        className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

