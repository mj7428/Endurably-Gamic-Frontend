import React, { useState, useEffect } from 'react';

// A simple utility to validate credit card numbers (Luhn algorithm)
const isValidCardNumber = (num) => {
    if (!num || num.length < 13) return false;
    let arr = (num + '').split('').reverse().map((x) => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val *= 2) > 9 ? val - 9 : val)), 0);
    sum += lastDigit;
    return sum % 10 === 0;
};

const PaymentForm = ({ onPaymentDetailsChange, onValidityChange }) => {
    const [paymentMethod, setPaymentMethod] = useState('CreditCard');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardName, setCardName] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const validate = () => {
            const newErrors = {};
            if (paymentMethod === 'CreditCard') {
                if (!isValidCardNumber(cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number.';
                // Updated validation to match MM/YY format
                if (!/^(0[1-9]|1[0-2])\s?\/\s?(\d{2})$/.test(expiry)) newErrors.expiry = 'Invalid expiry (MM/YY).';
                if (!/^\d{3,4}$/.test(cvc)) newErrors.cvc = 'Invalid CVC.';
                if (cardName.trim().length < 2) newErrors.cardName = 'Name is required.';
            }
            setErrors(newErrors);
            onValidityChange(Object.keys(newErrors).length === 0);
            onPaymentDetailsChange({
                method: paymentMethod,
                details: paymentMethod === 'CreditCard' ? { cardName, last4: cardNumber.slice(-4) } : {}
            });
        };
        validate();
    }, [cardNumber, expiry, cvc, cardName, paymentMethod, onValidityChange, onPaymentDetailsChange]);

    const formatCardNumber = (value) => value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);

    // ✅ This is the new, more robust formatting function
    const formatExpiry = (value) => {
        const cleanValue = value.replace(/[^\d]/g, ''); // Remove non-digits
        if (cleanValue.length >= 3) {
            return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
        }
        return cleanValue;
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-4">2. Payment Method</h2>
            <div className="flex space-x-2 border border-gray-600 rounded-lg p-1 mb-6">
                <button type="button" onClick={() => setPaymentMethod('CreditCard')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${paymentMethod === 'CreditCard' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}>Credit Card</button>
                <button type="button" onClick={() => setPaymentMethod('CashOnDelivery')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${paymentMethod === 'CashOnDelivery' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}>Cash Payment</button>
            </div>

            {paymentMethod === 'CreditCard' && (
                <div className="space-y-4">
                     <input type="text" placeholder="Card Number" value={formatCardNumber(cardNumber)} onChange={e => setCardNumber(e.target.value)} className={`w-full p-3 bg-gray-700 rounded ${errors.cardNumber ? 'border border-red-500' : 'border border-gray-600'}`} />
                     {errors.cardNumber && <p className="text-xs text-red-400 -mt-2 ml-1">{errors.cardNumber}</p>}
                     <div className="flex space-x-4">
                         <div className="w-1/2">
                            <input type="text" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} className={`w-full p-3 bg-gray-700 rounded ${errors.expiry ? 'border border-red-500' : 'border border-gray-600'}`} />
                            {errors.expiry && <p className="text-xs text-red-400 -mt-2 ml-1">{errors.expiry}</p>}
                         </div>
                         <div className="w-1/2">
                            <input type="text" placeholder="CVC" value={cvc} onChange={e => setCvc(e.target.value.replace(/[^\d]/g, '').slice(0,4))} className={`w-full p-3 bg-gray-700 rounded ${errors.cvc ? 'border border-red-500' : 'border border-gray-600'}`} maxLength="4" />
                            {errors.cvc && <p className="text-xs text-red-400 -mt-2 ml-1">{errors.cvc}</p>}
                         </div>
                     </div>
                     <input type="text" placeholder="Name on Card" value={cardName} onChange={e => setCardName(e.target.value)} className={`w-full p-3 bg-gray-700 rounded ${errors.cardName ? 'border border-red-500' : 'border border-gray-600'}`} />
                     {errors.cardName && <p className="text-xs text-red-400 -mt-2 ml-1">{errors.cardName}</p>}
                </div>
            )}
            {paymentMethod === 'CashOnDelivery' && (
                <div className="text-center p-8 bg-gray-700 rounded-lg">
                    <p className="text-gray-300">You have selected to pay with cash upon delivery.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentForm;

