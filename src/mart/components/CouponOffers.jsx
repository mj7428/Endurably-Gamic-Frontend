import React, { useState, useEffect } from 'react';
import martService from '../services/martService';
import { useAuth } from '../../context/AuthContext';

const CouponOffers = ({ isOpen, onClose }) => {
    const { setCart } = useAuth();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchOffers = async () => {
                setLoading(true);
                try {
                    const response = await martService.discoverCoupons();
                    setOffers(response.data);
                } catch (err) {
                    console.error("Failed to fetch offers", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchOffers();
        }
    }, [isOpen]);

    const handleApplyCoupon = async (code) => {
        try {
            const response = await martService.applyCoupon(code);
            setCart(response.data);
            onClose();
        } catch (err) {
            alert(err.response?.data || "Failed to apply coupon.");
        }
    };

    if (!isOpen) return null;

    const eligibleOffers = offers.filter(o => o.status === 'ELIGIBLE');
    const lockedOffers = offers.filter(o => o.status === 'LOCKED');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                <h3 className="text-xl font-bold text-white mb-4">Available Coupons & Offers</h3>
                {loading ? (
                    <p className="text-gray-300">Loading offers...</p>
                ) : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                        {eligibleOffers.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-green-400 mb-2">Eligible Offers</h4>
                                {eligibleOffers.map(({ coupon }, index) => (
                                    <div key={index} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center mb-2">
                                        <div>
                                            <p className="font-bold text-white">{coupon.code}</p>
                                            <p className="text-xs text-gray-300">{coupon.description}</p>
                                        </div>
                                        <button onClick={() => handleApplyCoupon(coupon.code)} className="bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded hover:bg-red-700">Apply</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {lockedOffers.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-yellow-400 mb-2">More Offers</h4>
                                {lockedOffers.map(({ coupon, message }, index) => (
                                     <div key={index} className="bg-gray-700 p-3 rounded-lg opacity-60">
                                        <p className="font-bold text-white">{coupon.code}</p>
                                        <p className="text-xs text-gray-300">{coupon.description}</p>
                                        <p className="text-xs text-yellow-400 mt-1">{message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                         {eligibleOffers.length === 0 && lockedOffers.length === 0 && (
                            <p className="text-gray-400">No offers available at the moment.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponOffers;

