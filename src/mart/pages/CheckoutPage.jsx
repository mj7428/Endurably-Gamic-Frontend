import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import martService from '../services/martService';
import { useNavigate, Link } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import AddAddressModal from '../components/AddAddressModal';

const CheckoutPage = () => {
    const { cart, fetchCart } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [isPaymentFormValid, setPaymentFormValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddressModalOpen, setAddressModalOpen] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                if (!cart) await fetchCart();
                const response = await martService.getAddresses();
                setAddresses(response.data);
                if (response.data.length > 0) {
                    setSelectedAddress(response.data[0]);
                }
            } catch (err) {
                setError('Could not load your checkout data.');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [cart, fetchCart]);

    const handlePlaceOrder = async () => {
        if (!selectedAddress || !isPaymentFormValid) {
            setError('Please complete all steps before placing your order.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const orderData = {
                shippingAddress: selectedAddress,
                paymentMethod: paymentDetails.method,
            };
            const response = await martService.createOrder(orderData);
            await fetchCart();
            navigate('/mart/order-success', { state: { order: response.data } });
        } catch (err) {
            setError('Failed to place order. Please try again.');
            setLoading(false);
        }
    };
    
    const handleAddressAdded = (newAddresses) => {
        setAddresses(newAddresses);
        if(newAddresses.length > 0) {
            setSelectedAddress(newAddresses[newAddresses.length - 1]);
        }
    };

    if (loading) return <p className="text-center p-8">Loading Checkout...</p>;
    if (error && !cart) return <p className="text-center text-red-500 p-8">{error}</p>;
    if (!cart || cart.items.length === 0) {
         return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
                <p className="text-gray-400 mb-6">Start shopping to proceed to checkout.</p>
                 <Link to="/mart" className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700">
                    Continue Shopping
                </Link>
            </div>
        );
    }


    return (
        <div className="container mx-auto px-4 py-8">
            <AddAddressModal isOpen={isAddressModalOpen} onClose={() => setAddressModalOpen(false)} onAddressAdded={handleAddressAdded} />
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white text-center mb-8">Checkout</h1>
                
                <div className="flex justify-between items-center mb-8 text-sm text-gray-400">
                    <span className={step >= 1 ? 'text-red-400 font-bold' : ''}>1. Address</span>
                    <span className="flex-grow border-b border-gray-600 mx-4"></span>
                    <span className={step >= 2 ? 'text-red-400 font-bold' : ''}>2. Payment</span>
                    <span className="flex-grow border-b border-gray-600 mx-4"></span>
                    <span className={step >= 3 ? 'text-red-400 font-bold' : ''}>3. Review</span>
                </div>

                <div className="bg-gray-800 p-8 rounded-lg">
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4">Shipping Address</h2>
                            {addresses.length > 0 ? (
                                addresses.map((addr, index) => (
                                <div key={index} onClick={() => setSelectedAddress(addr)}
                                    className={`p-4 border rounded-lg mb-2 cursor-pointer transition-colors ${JSON.stringify(selectedAddress) === JSON.stringify(addr) ? 'border-red-500 bg-red-900/20' : 'border-gray-600 hover:bg-gray-700'}`}>
                                    <p className="font-semibold">{addr.street}</p>
                                    <p className="text-sm text-gray-300">{addr.city}, {addr.state} {addr.zipCode}</p>
                                </div>
                            ))
                            ) : (
                                <p className="text-gray-400 my-4">You have no saved addresses.</p>
                            )}
                            <button onClick={() => setAddressModalOpen(true)} className="text-red-400 hover:text-red-300 font-semibold text-sm mt-2">+ Add New Address</button>
                            <button onClick={() => setStep(2)} disabled={!selectedAddress} className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-600">Next: Payment</button>
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <PaymentForm 
                                onPaymentDetailsChange={setPaymentDetails} 
                                onValidityChange={setPaymentFormValid} 
                            />
                            <div className="flex justify-between mt-6">
                                <button onClick={() => setStep(1)} className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700">Back</button>
                                <button onClick={() => setStep(3)} disabled={!isPaymentFormValid} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-600">Next: Review</button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                         <div>
                            <h2 className="text-xl font-bold text-white mb-4">3. Review Order</h2>
                            <div className="border-b border-gray-700 pb-4 mb-4">
                                <h4 className="font-semibold text-gray-300">Shipping To:</h4>
                                <p>{selectedAddress?.street}, {selectedAddress?.city}</p>
                            </div>
                            <div className="border-b border-gray-700 pb-4 mb-4">
                                <h4 className="font-semibold text-gray-300">Payment Method:</h4>
                                <p>{paymentDetails?.method.replace(/([A-Z])/g, ' $1').trim()}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-300 mb-2">Items:</h4>
                                <div className="space-y-2">
                                {cart.items.map(ci => <p key={ci.item.id} className="text-sm">{ci.item.name} x {ci.quantity}</p>)}
                                </div>
                                <p className="text-lg font-bold mt-4 pt-4 border-t border-gray-700">Total: ₹{cart.totalPrice.toFixed(2)}</p>
                            </div>
                            {error && <p className="text-red-400 text-center my-4">{error}</p>}
                            <div className="flex justify-between mt-6">
                                 <button onClick={() => setStep(2)} className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700">Back</button>
                                <button onClick={handlePlaceOrder} disabled={loading || !isPaymentFormValid} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-500">
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

