import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const CheckoutSuccessPage = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return <Navigate to="/mart" />;
    }

    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <span className="text-5xl">🎉</span>
                <h2 className="text-3xl font-bold text-white mt-4 mb-2">Thank You for Your Order!</h2>
                <p className="text-gray-400 mb-6">Your purchase was successful and has been recorded in your order history.</p>
                <div className="text-left bg-gray-900/50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                    <p className="text-lg font-bold text-white mt-2">Total: ₹{order.totalPrice.toFixed(2)}</p>
                </div>
                <div className="mt-8 flex justify-center space-x-4">
                    <Link to="/mart" className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                        Continue Shopping
                    </Link>
                    <Link to="/mart/my-orders" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                        View Order History
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccessPage;
