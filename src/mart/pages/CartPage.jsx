import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import martService from '../services/martService';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cart, fetchCart } = useAuth();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [error, setError] = useState('');

    const handleRemoveItem = async (itemId) => {
        try {
            await martService.removeItemFromCart(itemId);
            await fetchCart();
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    const handleCheckout = () => {
        navigate('/mart/checkout');
    };

    if (!cart) {
        return <p className="text-center text-xl p-8">Loading your cart...</p>;
    }

    if (cart.items.length === 0) {
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-white mb-6">Your Shopping Cart</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map(({ item, quantity }) => (
                        <div key={item.id} className="bg-gray-800 p-4 rounded-lg flex items-center">
                            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4"/>
                            <div className="flex-grow">
                                <h3 className="font-bold text-white">{item.name}</h3>
                                <p className="text-sm text-gray-400">₹{item.price.toFixed(2)}</p>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-white">Qty: {quantity}</p>
                            </div>
                            <button onClick={() => handleRemoveItem(item.id)} className="ml-4 text-gray-400 hover:text-red-500">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="bg-gray-800 p-6 rounded-lg h-fit lg:sticky lg:top-24">
                    <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-4 mb-4">Order Summary</h3>
                    <div className="space-y-2 text-gray-300">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{cart.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>FREE</span>
                        </div>
                        <div className="flex justify-between font-bold text-white text-lg pt-4 border-t border-gray-700">
                            <span>Total</span>
                            <span>₹{cart.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-400 text-center my-4">{error}</p>}
                    <button 
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-500"
                    >
                        {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
