import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';

const RecentOrdersWidget = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecentOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getRecentOrders(0, 5); 
            setOrders(response.data.content);
        } catch (error) {
            console.error("Failed to fetch recent orders", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecentOrders();
    }, [fetchRecentOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await adminService.updateOrderStatus(orderId, newStatus);
            // Optimistically update the UI before re-fetching
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Failed to update order status", error);
            // Optionally show an error message to the user
        }
    };

    const OrderStatusSelector = ({ currentStatus, orderId }) => {
        const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        return (
            <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(orderId, e.target.value)}
                className="bg-gray-700 text-white text-xs rounded p-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>
        );
    };

    return (
        <div className="h-full">
            {loading ? (
                <p className="text-gray-400">Loading recent orders...</p>
            ) : orders.length > 0 ? (
                <div className="space-y-3">
                    {orders.map(order => (
                        <div key={order.id} className="bg-gray-700/50 p-3 rounded-lg text-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-white">{order.customerEmail}</p>
                                    <p className="text-xs text-gray-400">{new Date(order.orderDate).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-400">${order.totalPrice.toFixed(2)}</p>
                                    <OrderStatusSelector currentStatus={order.status} orderId={order.id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">There are no recent orders.</p>
            )}
        </div>
    );
};

export default RecentOrdersWidget;
