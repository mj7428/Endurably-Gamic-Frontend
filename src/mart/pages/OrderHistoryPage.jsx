import React, { useState, useEffect } from 'react';
import martService from '../services/martService'; // Assuming this service exists

// ============================================================================
// Helper Component: Icons
// ============================================================================
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const ChevronDownIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);


// ============================================================================
// Helper Component: Horizontal Order Status Tracker
// ============================================================================
const OrderStatusTracker = ({ currentStatus }) => {
    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentStatusIndex = statuses.indexOf(currentStatus);

    return (
        <div className="flex items-center w-full max-w-xs">
            {statuses.map((status, index) => {
                const isCompleted = index < currentStatusIndex;
                const isActive = index === currentStatusIndex;

                return (
                    <React.Fragment key={status}>
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                ${isCompleted ? 'bg-sky-500' : ''}
                                ${isActive ? 'bg-sky-500 ring-4 ring-sky-500/30' : ''}
                                ${!isCompleted && !isActive ? 'bg-slate-600' : ''}
                            `}>
                                {isCompleted ? <CheckIcon /> : <span>{index + 1}</span>}
                            </div>
                            <p className={`mt-2 text-xs text-center ${isActive ? 'text-sky-400' : 'text-slate-400'}`}>
                                {status}
                            </p>
                        </div>
                        {index < statuses.length - 1 && (
                            <div className={`flex-auto h-0.5 mx-2 
                                ${isCompleted ? 'bg-sky-500' : 'bg-slate-600'}
                            `}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};


// ============================================================================
// Helper Component: Collapsible Order Card
// ============================================================================
const OrderCard = ({ order }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Show max 3 images stacked
    const imagesToShow = order.items.slice(0, 3);
    const remainingItemsCount = order.items.length - imagesToShow.length;

    return (
        <div className="bg-slate-800/50 rounded-lg shadow-md transition-all duration-300 hover:bg-slate-800 ring-1 ring-slate-700/50">
            {/* Clickable Header Row */}
            <div 
                className="p-4 grid grid-cols-2 md:grid-cols-5 gap-4 items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Item Images Stack */}
                <div className="flex items-center">
                    {imagesToShow.map((orderItem, index) => (
                        <img
                            key={orderItem.item?.id || `item-${index}`}
                            src={orderItem.item?.imageUrl || 'https://via.placeholder.com/150'}
                            alt={orderItem.item?.name || 'Item'}
                            className={`w-10 h-10 object-cover rounded-full border-2 border-slate-700 ${index > 0 ? '-ml-4' : ''}`}
                        />
                    ))}
                    {remainingItemsCount > 0 && (
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold -ml-4 border-2 border-slate-700">
                            +{remainingItemsCount}
                        </div>
                    )}
                </div>

                {/* Order Info */}
                <div className="text-sm md:col-span-1">
                    <p className="text-slate-400 text-xs">ORDER ID</p>
                    <p className="font-mono text-white truncate">{order.id}</p>
                </div>
                
                {/* Date and Total */}
                <div className="text-sm text-right md:text-left">
                     <p className="text-slate-400 text-xs">DATE</p>
                     <p className="font-semibold text-white">
                         {new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                     </p>
                </div>

                <div className="text-sm text-left md:text-right">
                    <p className="text-slate-400 text-xs">TOTAL</p>
                    <p className="font-bold text-lg text-sky-400">₹{order.totalPrice.toFixed(2)}</p>
                </div>

                {/* Status & Expander Icon */}
                <div className="flex items-center justify-end col-span-2 md:col-span-1">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' : ''}
                        ${order.status === 'SHIPPED' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                        ${order.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400' : ''}
                        ${order.status === 'PENDING' ? 'bg-slate-500/20 text-slate-400' : ''}
                    `}>
                        {order.status}
                    </div>
                    <ChevronDownIcon className={`w-6 h-6 text-slate-400 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            
            {/* Collapsible Details Section */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className="p-4 border-t border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                        <h4 className="font-semibold text-slate-300 mb-2">Items Ordered ({order.items.length})</h4>
                        {order.items.map((orderItem, index) => {
                            if (!orderItem.item) {
                                return (
                                    <div key={index} className="flex items-center text-sm opacity-60">
                                        <div className="w-12 h-12 bg-slate-700 rounded mr-4 flex-shrink-0"></div>
                                        <p className="text-slate-400 italic">This item is no longer available</p>
                                    </div>
                                );
                            }
                            return (
                                <div key={orderItem.item.id} className="flex items-center text-sm">
                                    <img src={orderItem.item.imageUrl} alt={orderItem.item.name} className="w-12 h-12 object-cover rounded mr-4" />
                                    <div className="flex-grow">
                                        <p className="text-white font-semibold">{orderItem.item.name}</p>
                                        <p className="text-slate-400">Qty: {orderItem.quantity}</p>
                                    </div>
                                    <p className="text-slate-300 font-mono">₹{orderItem.priceAtPurchase.toFixed(2)}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="md:col-span-1 md:border-l md:pl-6 border-slate-700">
                        <h4 className="font-semibold text-slate-300 mb-4">Order Progress</h4>
                        <OrderStatusTracker currentStatus={order.status} />
                    </div>
                </div>
            </div>
        </div>
    );
};


// ============================================================================
// Main OrderHistoryPage Component
// ============================================================================
const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
               
                const response = await martService.getOrderHistory();
                setOrders(response.data);
                
             

            } catch (err) {
                setError('Failed to load your order history. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <svg className="animate-spin h-8 w-8 text-sky-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="text-xl">Loading Your Orders...</p>
        </div>
    );
    
    if (error) return (
        <div className="text-center bg-red-900/50 border border-red-700 text-red-300 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h3>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">My Order History</h2>
                    <span className="bg-sky-500/20 text-sky-300 text-sm font-semibold px-3 py-1 rounded-full">{orders.length} Orders</span>
                </div>
                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map(order => <OrderCard key={order.id} order={order} />)}
                    </div>
                ) : (
                    <div className="text-center bg-slate-800/80 border-2 border-dashed border-slate-700 p-12 rounded-lg">
                        <p className="text-5xl mb-4">📦</p>
                        <h3 className="text-xl font-semibold text-white">No Orders Found</h3>
                        <p className="text-slate-400 mt-2">Looks like you haven't placed an order yet. Start shopping to see it here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;